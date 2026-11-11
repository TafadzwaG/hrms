<?php

namespace App\Http\Controllers;

use App\Models\EmployeePayrollProfile;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollInputBatch;
use App\Models\PayrollPeriod;
use App\Support\Payroll\Inputs\HourlyRateResolver;
use App\Support\Payroll\Inputs\PayrollInputBatchService;
use App\Support\Payroll\Inputs\PayrollInputFileReader;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Hourly Input: capture hours (and other paid units such as mileage) for a period, in
 * summary (one line per employee and pay code) or in detail (per day and cost centre).
 *
 * Lines are typed in or uploaded from a file, checked against optional control totals
 * of hours and lines, and posted as one batch. Each line becomes an input paid at the
 * rate in force when it was posted; the payslip shows one line per pay code and rate.
 */
class PayrollHourlyInputController extends Controller
{
    public const FILE_COLUMNS = ['staff_number', 'pay_code', 'quantity', 'work_date', 'cost_centre', 'rate', 'notes'];

    public function show(int $period, PayrollInputBatchService $batches): Response
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $profiles = $batches->payrollProfiles($period);

        $captured = PayrollInput::query()
            ->with(['payCode', 'batch'])
            ->where('payroll_period_id', $period->id)
            ->where('source', 'HOURLY')
            ->get();

        return Inertia::render('Payroll/Inputs/Hourly', [
            'period' => [
                'id' => $period->id,
                'code' => $period->code,
                'name' => $period->name,
                'status' => $period->status,
                'period_start' => optional($period->period_start)->toDateString(),
                'period_end' => optional($period->period_end)->toDateString(),
                'editable' => ! in_array($period->status, ['APPROVED', 'CLOSED'], true),
            ],
            'employees' => $profiles->map(fn (EmployeePayrollProfile $profile) => [
                'employee_id' => $profile->employee_id,
                'staff_number' => $profile->employee?->staff_number,
                'full_name' => $profile->employee?->full_name,
                'pay_basis' => $profile->pay_basis,
                'hourly_rate' => $profile->hourly_rate !== null ? (float) $profile->hourly_rate : null,
                'overtime_multiplier' => (float) ($profile->overtime_multiplier ?: 1.5),
                'cost_centre' => $profile->cost_centre,
            ])->values(),
            'payCodes' => $this->hourCodes()->get()->map(fn (PayCode $code) => [
                'id' => $code->id,
                'code' => $code->code,
                'description' => $code->description,
                'unit' => $code->unit,
                'rate_multiplier' => $code->rate_multiplier !== null ? (float) $code->rate_multiplier : null,
                'default_rate' => $code->default_rate !== null ? (float) $code->default_rate : null,
            ])->values(),
            'costCentres' => EmployeePayrollProfile::query()->whereNotNull('cost_centre')->where('cost_centre', '!=', '')->distinct()->orderBy('cost_centre')->pluck('cost_centre')->values(),
            // What has been captured so far this period, per employee and pay code.
            'summary' => $captured
                ->groupBy(fn (PayrollInput $input) => $input->employee_id.'|'.$input->pay_code_id)
                ->map(function (Collection $group) use ($profiles) {
                    /** @var PayrollInput $first */
                    $first = $group->first();
                    $profile = $profiles->firstWhere('employee_id', $first->employee_id);

                    return [
                        'employee_id' => $first->employee_id,
                        'staff_number' => $profile?->employee?->staff_number,
                        'full_name' => $profile?->employee?->full_name,
                        'code' => $first->payCode?->code,
                        'unit' => $first->payCode?->unit,
                        'quantity' => round((float) $group->sum('quantity'), 2),
                        'amount' => round((float) $group->sum(fn (PayrollInput $input) => $input->resolvedAmount()), 2),
                        'lines' => $group->count(),
                        'batches' => $group->pluck('batch.batch_number')->filter()->unique()->values(),
                    ];
                })
                ->sortBy(['staff_number', 'code'])
                ->values(),
            'maxHoursPerDay' => (float) config('payroll.max_hours_per_day', 24),
        ]);
    }

    public function post(Request $request, int $period, PayrollInputBatchService $batches, HourlyRateResolver $rates): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $validated = $request->validate([
            'lines' => ['required', 'array', 'min:1', 'max:5000'],
            'lines.*.employee_id' => ['required', 'integer'],
            'lines.*.pay_code_id' => ['required', 'integer'],
            'lines.*.quantity' => ['required', 'numeric', 'gt:0', 'max:744'],
            'lines.*.work_date' => ['nullable', 'date'],
            'lines.*.cost_centre' => ['nullable', 'string', 'max:100'],
            'lines.*.rate' => ['nullable', 'numeric', 'min:0'],
            'lines.*.notes' => ['nullable', 'string', 'max:255'],
            ...$this->controlRules(),
        ]);

        $batch = $this->postLines($period, collect($validated['lines']), $validated, $request, $batches, $rates, 'Hourly input');

        return back()->with('success', $this->summary($batch));
    }

    public function import(Request $request, int $period, PayrollInputBatchService $batches, HourlyRateResolver $rates): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx', 'max:10240'],
            ...$this->controlRules(),
        ]);

        $file = $request->file('file');
        $rows = PayrollInputFileReader::read($file->getRealPath(), strtolower((string) $file->getClientOriginalExtension()));
        $profiles = $batches->payrollProfiles($period)->keyBy(fn ($profile) => (string) $profile->employee?->staff_number);
        $codes = $this->hourCodes()->get()->keyBy('code');
        $problems = [];
        $lines = collect();

        foreach ($rows as $line => $row) {
            if (implode('', $row) === '') {
                continue;
            }

            $profile = $profiles->get(trim((string) ($row['staff_number'] ?? '')));
            $code = $codes->get(strtoupper(trim((string) ($row['pay_code'] ?? ''))));

            if (! $profile || ! $code) {
                $problems[] = "Row {$line}: ".(! $profile ? 'staff number is not in this period\'s payroll' : 'pay code is not an hours or units code').'.';

                continue;
            }

            $lines->push([
                'employee_id' => $profile->employee_id,
                'pay_code_id' => $code->id,
                'quantity' => $row['quantity'] ?? ($row['hours'] ?? null),
                'work_date' => ($row['work_date'] ?? ($row['date'] ?? '')) ?: null,
                'cost_centre' => ($row['cost_centre'] ?? '') ?: null,
                'rate' => ($row['rate'] ?? '') !== '' ? $row['rate'] : null,
                'notes' => ($row['notes'] ?? '') ?: null,
                'row' => $line,
            ]);
        }

        // A file is posted whole or not at all, so a fix-and-retry never double-posts.
        if ($problems !== []) {
            throw ValidationException::withMessages(['file' => 'Nothing was posted. '.implode(' ', array_slice($problems, 0, 8)).(count($problems) > 8 ? ' ...' : '')]);
        }

        $batch = $this->postLines($period, $lines, $validated, $request, $batches, $rates, 'Hourly import: '.$file->getClientOriginalName());

        return back()->with('success', $this->summary($batch));
    }

    public function template(): StreamedResponse
    {
        return response()->streamDownload(function (): void {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, self::FILE_COLUMNS);
            fputcsv($stream, ['EMP-0001', 'NORM', '8', '2026-11-02', 'CC-OPS', '', 'Day shift']);
            fputcsv($stream, ['EMP-0001', 'OT', '2.5', '2026-11-02', 'CC-OPS', '', '']);
            fclose($stream);
        }, 'hourly-input-template.csv', ['Content-Type' => 'text/csv']);
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $lines
     * @param  array<string, mixed>  $control
     */
    private function postLines(PayrollPeriod $period, Collection $lines, array $control, Request $request, PayrollInputBatchService $batches, HourlyRateResolver $rates, string $description): PayrollInputBatch
    {
        $batches->ensurePeriodOpen($period, 'lines');

        $profiles = $batches->payrollProfiles($period)->keyBy('employee_id');
        $codes = $this->hourCodes()->get()->keyBy('id');
        $start = Carbon::parse($period->period_start)->startOfDay();
        $end = Carbon::parse($period->period_end)->endOfDay();
        $maxPerDay = (float) config('payroll.max_hours_per_day', 24);
        $problems = [];
        $prepared = [];

        foreach ($lines->values() as $index => $line) {
            $label = 'Line '.($line['row'] ?? $index + 1);
            $profile = $profiles->get((int) $line['employee_id']);
            $code = $codes->get((int) $line['pay_code_id']);
            $quantity = is_numeric($line['quantity'] ?? null) ? (float) $line['quantity'] : 0.0;

            if (! $profile || ! $code) {
                $problems[] = "{$label}: the employee is not in this period's payroll, or the pay code is not an hours or units code.";

                continue;
            }

            if ($quantity <= 0 || $quantity > 744) {
                $problems[] = "{$label}: enter a quantity above 0 and no more than 744.";

                continue;
            }

            $date = null;

            if (! blank($line['work_date'] ?? null)) {
                try {
                    $date = Carbon::parse((string) $line['work_date'])->startOfDay();
                } catch (\Throwable) {
                    $problems[] = "{$label}: the date is not valid.";

                    continue;
                }

                if ($date->lt($start) || $date->gt($end)) {
                    $problems[] = "{$label}: {$date->toDateString()} is outside the period.";

                    continue;
                }
            }

            $rate = $rates->resolve($profile, $code, is_numeric($line['rate'] ?? null) ? (float) $line['rate'] : null);

            if ($rate['error']) {
                $problems[] = "{$label} ({$profile->employee?->staff_number}): {$rate['error']}";

                continue;
            }

            $prepared[] = [
                'profile' => $profile,
                'code' => $code,
                'quantity' => round($quantity, 4),
                'rate' => $rate['rate'],
                'date' => $date?->toDateString(),
                'cost_centre' => blank($line['cost_centre'] ?? null) ? $profile->cost_centre : trim((string) $line['cost_centre']),
                'notes' => $line['notes'] ?? null,
            ];
        }

        // No one works more than a day's hours on one date, across everything in the batch.
        collect($prepared)
            ->filter(fn ($line) => $line['date'] !== null && $line['code']->unit === 'HOURS')
            ->groupBy(fn ($line) => $line['profile']->employee_id.'|'.$line['date'])
            ->each(function (Collection $group) use ($maxPerDay, &$problems): void {
                $hours = $group->sum('quantity');

                if ($hours > $maxPerDay) {
                    $first = $group->first();
                    $problems[] = "{$first['profile']->employee?->staff_number} has {$hours} hours on {$first['date']}, more than {$maxPerDay}.";
                }
            });

        if ($problems !== []) {
            throw ValidationException::withMessages(['lines' => 'Nothing was posted. '.implode(' ', array_slice($problems, 0, 8)).(count($problems) > 8 ? ' ...' : '')]);
        }

        return $batches->post($period, $request->user(), [
            'source' => PayrollInputBatch::SOURCE_HOURLY,
            'description' => $description.': '.count($prepared).' line(s)',
            'measure' => 'quantity',
            'control_total' => $control['control_total'] ?? null,
            'control_count' => $control['control_count'] ?? null,
            'accept_mismatch' => (bool) ($control['accept_mismatch'] ?? false),
        ], function (PayrollInputBatch $batch) use ($prepared, $period, $batches, $request) {
            return collect($prepared)->map(fn (array $line) => $batches->create($batch, [
                'organization_id' => $period->organization_id,
                'payroll_period_id' => $period->id,
                'employee_id' => $line['profile']->employee_id,
                'pay_code_id' => $line['code']->id,
                'input_mode' => 'RATE_X_QTY',
                'amount' => null,
                'quantity' => $line['quantity'],
                'rate' => $line['rate'],
                'work_date' => $line['date'],
                'cost_centre' => $line['cost_centre'],
                'source' => 'HOURLY',
                'reference' => $batch->batch_number,
                'notes' => $line['notes'],
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]));
        });
    }

    private function summary(PayrollInputBatch $batch): string
    {
        $amount = PayrollInput::query()->where('payroll_input_batch_id', $batch->id)->get()->sum(fn (PayrollInput $input) => $input->resolvedAmount());

        return "Batch {$batch->batch_number}: {$batch->entered_count} line(s), ".number_format((float) $batch->entered_total, 2).' hours/units, worth '.number_format((float) $amount, 2).'.';
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function controlRules(): array
    {
        return [
            'control_total' => ['nullable', 'numeric'],
            'control_count' => ['nullable', 'integer', 'min:0'],
            'accept_mismatch' => ['nullable', 'boolean'],
        ];
    }

    private function hourCodes(): Builder
    {
        return PayCode::query()
            ->where('active', true)
            ->where('type', 'EARNING')
            ->whereIn('unit', ['HOURS', 'UNITS'])
            ->orderBy('sort_order')
            ->orderBy('code');
    }
}
