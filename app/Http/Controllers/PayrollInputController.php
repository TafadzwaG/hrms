<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payroll\UpsertPayrollInputRequest;
use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\OrgUnit;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollInputBatch;
use App\Models\PayrollPeriod;
use App\Support\Payroll\Inputs\PayrollInputBatchService;
use App\Support\Payroll\Inputs\PayrollInputFileReader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PayrollInputController extends Controller
{
    public function index(Request $request): Response
    {
        $periodId = $request->integer('period_id');
        $search = $request->string('search')->toString();
        $source = $request->string('source')->toString();

        $inputs = PayrollInput::query()
            ->with(['period', 'employee.orgUnit', 'employee.position', 'payCode', 'batch'])
            ->when($periodId, fn ($query) => $query->where('payroll_period_id', $periodId))
            ->when($source !== '' && $source !== 'all', fn ($query) => $query->where('source', $source))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($builder) use ($search): void {
                    $builder->where('reference', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%")
                        ->orWhereHas('employee', function ($employeeQuery) use ($search): void {
                            $employeeQuery->where('staff_number', 'like', "%{$search}%")
                                ->orWhere('first_name', 'like', "%{$search}%")
                                ->orWhere('middle_name', 'like', "%{$search}%")
                                ->orWhere('surname', 'like', "%{$search}%");
                        })
                        ->orWhereHas('payCode', fn ($payCodeQuery) => $payCodeQuery->where('code', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (PayrollInput $input) => $this->mapInput($input));

        return Inertia::render('Payroll/Inputs/Index', [
            'inputs' => $inputs,
            'filters' => [
                'period_id' => $periodId ?: null,
                'search' => $search,
                'source' => $source,
            ],
            'stats' => [
                'total' => PayrollInput::query()->count(),
                'manual' => PayrollInput::query()->where('source', 'MANUAL')->count(),
                'imported' => PayrollInput::query()->where('source', 'IMPORT')->count(),
                'periods_with_inputs' => PayrollInput::query()->distinct('payroll_period_id')->count('payroll_period_id'),
            ],
            'periods' => PayrollPeriod::query()
                ->orderByDesc('period_end')
                ->get(['id', 'code', 'name', 'status', 'period_start', 'period_end'])
                ->map(fn (PayrollPeriod $period) => [
                    'id' => $period->id,
                    'code' => $period->code,
                    'name' => $period->name,
                    'status' => $period->status,
                    'period_start' => optional($period->period_start)->toDateString(),
                    'period_end' => optional($period->period_end)->toDateString(),
                ])
                ->values(),
            'employees' => Employee::query()
                ->orderBy('first_name')
                ->orderBy('surname')
                ->with('payrollProfiles')
                ->get(['id', 'staff_number', 'first_name', 'middle_name', 'surname', 'org_unit_id'])
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'staff_number' => $employee->staff_number,
                    'full_name' => $employee->full_name,
                    'org_unit_id' => $employee->org_unit_id,
                    'cost_centre' => $employee->payrollProfiles->sortByDesc('effective_from')->first()?->cost_centre,
                ])
                ->values(),
            'payCodes' => PayCode::query()
                ->where('active', true)
                ->orderBy('sort_order')
                ->orderBy('code')
                ->get(['id', 'code', 'description', 'type', 'category', 'unit'])
                ->map(fn (PayCode $payCode) => [
                    'id' => $payCode->id,
                    'code' => $payCode->code,
                    'description' => $payCode->description,
                    'type' => $payCode->type,
                    'category' => $payCode->category,
                    'unit' => $payCode->unit ?: 'AMOUNT',
                ])
                ->values(),
            'defaults' => [
                'payroll_period_id' => $periodId ?: '',
                'employee_id' => '',
                'pay_code_id' => '',
                'input_mode' => 'FIXED',
                'amount' => '',
                'quantity' => '',
                'rate' => '',
                'source' => 'MANUAL',
                'reference' => '',
                'notes' => '',
            ],
            'sources' => ['MANUAL', 'IMPORT', 'BULK', 'GRID', 'HOURLY', 'TIMESHEET', 'LEAVE', 'SYSTEM'],
            'orgUnits' => OrgUnit::query()->orderBy('name')->get(['id', 'name'])->map(fn (OrgUnit $unit) => ['id' => $unit->id, 'name' => $unit->name])->values(),
            'costCentres' => EmployeePayrollProfile::query()->whereNotNull('cost_centre')->where('cost_centre', '!=', '')->distinct()->orderBy('cost_centre')->pluck('cost_centre')->values(),
        ]);
    }

    public function store(UpsertPayrollInputRequest $request): RedirectResponse
    {
        PayrollInput::query()->create([
            'organization_id' => $this->tenantId(),
            ...$this->inputPayload($request->validated()),
            'created_by' => request()->user()?->id,
            'updated_by' => request()->user()?->id,
        ]);

        return back()->with('success', 'Payroll input captured successfully.');
    }

    public function update(UpsertPayrollInputRequest $request, int $input): RedirectResponse
    {
        /** @var PayrollInput $input */
        $input = $this->findTenantModelOrFail(PayrollInput::class, $input);
        $input->update([
            ...$this->inputPayload($request->validated()),
            // A hand edit takes the input out of its batch, so reversing the batch leaves it alone.
            'payroll_input_batch_id' => null,
            'updated_by' => request()->user()?->id,
        ]);

        return back()->with('success', 'Payroll input updated successfully.');
    }

    public function destroy(int $input): RedirectResponse
    {
        /** @var PayrollInput $input */
        $input = $this->findTenantModelOrFail(PayrollInput::class, $input);

        if (in_array($input->period?->status, ['APPROVED', 'CLOSED'], true)) {
            return back()->withErrors([
                'input' => 'Inputs cannot be deleted once the payroll period is approved or closed.',
            ]);
        }

        $input->delete();

        return back()->with('success', 'Payroll input deleted successfully.');
    }

    public function template(): StreamedResponse
    {
        $headers = PayrollInputFileReader::COLUMNS;
        $sample = ['EMP-0001', 'BONUS', '150.00', '', '', 'MARCH_BONUS', 'Performance bonus'];

        return response()->streamDownload(function () use ($headers, $sample): void {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, $headers);
            fputcsv($stream, $sample);
            fclose($stream);
        }, 'payroll-input-template.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function import(Request $request, PayrollInputBatchService $batches): RedirectResponse
    {
        $validated = $request->validate([
            'payroll_period_id' => ['required', 'integer'],
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx', 'max:10240'],
            'control_total' => ['nullable', 'numeric'],
            'control_count' => ['nullable', 'integer', 'min:0'],
            'accept_mismatch' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, (int) $validated['payroll_period_id']);

        try {
            $batches->ensurePeriodOpen($period, 'file');
        } catch (ValidationException $exception) {
            return back()->withErrors($exception->errors());
        }

        $file = $request->file('file');
        abort_unless($file, 422);

        $rows = PayrollInputFileReader::read($file->getRealPath(), strtolower((string) $file->getClientOriginalExtension()));
        $errors = [];

        $batch = $batches->post($period, $request->user(), [
            'source' => PayrollInputBatch::SOURCE_IMPORT,
            'description' => $validated['description'] ?? $file->getClientOriginalName(),
            'control_total' => $validated['control_total'] ?? null,
            'control_count' => $validated['control_count'] ?? null,
            'accept_mismatch' => (bool) ($validated['accept_mismatch'] ?? false),
            'metadata' => ['file_name' => $file->getClientOriginalName()],
        ], function (PayrollInputBatch $batch) use ($rows, $period, $batches, &$errors) {
            $written = collect();

            foreach ($rows as $line => $data) {
                $staffNumber = trim((string) ($data['staff_number'] ?? ''));
                $payCodeValue = trim((string) ($data['pay_code'] ?? ''));

                if ($staffNumber === '' && $payCodeValue === '') {
                    continue;
                }

                if ($staffNumber === '' || $payCodeValue === '') {
                    $errors[] = "Row {$line}: staff number or pay code is missing.";

                    continue;
                }

                $employee = Employee::query()->where('staff_number', $staffNumber)->first();
                $payCode = PayCode::query()->where('code', $payCodeValue)->first();

                if (! $employee || ! $payCode) {
                    $errors[] = "Row {$line}: {$staffNumber} / {$payCodeValue} could not be matched to an employee and pay code.";

                    continue;
                }

                $amount = trim((string) ($data['amount'] ?? ''));
                $quantity = trim((string) ($data['quantity'] ?? ''));
                $rate = trim((string) ($data['rate'] ?? ''));

                $written->push($batches->upsert(
                    $batch,
                    [
                        'organization_id' => $period->organization_id,
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee->id,
                        'pay_code_id' => $payCode->id,
                        'reference' => trim((string) ($data['reference'] ?? '')),
                    ],
                    [
                        'input_mode' => $quantity !== '' && $rate !== '' ? 'RATE_X_QTY' : 'FIXED',
                        'amount' => $amount !== '' ? (float) $amount : null,
                        'quantity' => $quantity !== '' ? (float) $quantity : null,
                        'rate' => $rate !== '' ? (float) $rate : null,
                        'source' => 'IMPORT',
                        'notes' => ($data['notes'] ?? '') !== '' ? (string) $data['notes'] : null,
                        'created_by' => request()->user()?->id,
                        'updated_by' => request()->user()?->id,
                    ]
                ));
            }

            return $written;
        });

        $message = "Batch {$batch->batch_number}: imported {$batch->entered_count} payroll input(s) totalling ".number_format((float) $batch->entered_total, 2).'.';

        if ($errors !== []) {
            $message .= ' '.count($errors).' row(s) skipped: '.implode(' ', array_slice($errors, 0, 5)).(count($errors) > 5 ? ' ...' : '');
        }

        return back()->with($errors === [] ? 'success' : 'error', $message);
    }

    /**
     * Bulk Input: add one pay code to, or remove it from, every employee in a group.
     */
    public function bulk(Request $request, PayrollInputBatchService $batches): RedirectResponse
    {
        $tenantId = $this->tenantId();
        $validated = $request->validate([
            'payroll_period_id' => ['required', 'integer'],
            'pay_code_id' => ['required', 'integer', Rule::exists('pay_codes', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId))],
            'action' => ['required', Rule::in(['INSERT', 'DELETE'])],
            'input_mode' => ['required_if:action,INSERT', 'nullable', Rule::in(['FIXED', 'RATE_X_QTY'])],
            'amount' => ['nullable', 'required_if:input_mode,FIXED', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'required_if:input_mode,RATE_X_QTY', 'numeric', 'min:0'],
            'rate' => ['nullable', 'required_if:input_mode,RATE_X_QTY', 'numeric', 'min:0'],
            'reference' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string', 'max:500'],
            'org_unit_ids' => ['nullable', 'array'],
            'org_unit_ids.*' => ['integer'],
            'cost_centres' => ['nullable', 'array'],
            'cost_centres.*' => ['string', 'max:100'],
            'employee_ids' => ['nullable', 'array'],
            'employee_ids.*' => ['integer'],
            'control_total' => ['nullable', 'numeric'],
            'control_count' => ['nullable', 'integer', 'min:0'],
            'accept_mismatch' => ['nullable', 'boolean'],
        ]);

        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, (int) $validated['payroll_period_id']);
        $payCode = PayCode::query()->findOrFail((int) $validated['pay_code_id']);

        if ($payCode->system_generated && $payCode->code !== 'OT') {
            return back()->withErrors(['pay_code_id' => "{$payCode->code} is calculated by the system and cannot be entered in bulk."]);
        }

        if (($payCode->unit ?? 'AMOUNT') !== 'AMOUNT') {
            return back()->withErrors(['pay_code_id' => "{$payCode->code} is paid by the hour or unit. Capture it in Hourly input so each employee's own rate is used."]);
        }

        $profiles = $batches->payrollProfiles($period, $validated);

        if ($profiles->isEmpty()) {
            return back()->withErrors(['org_unit_ids' => 'No employees in this period\'s payroll match the selection.']);
        }

        $isInsert = $validated['action'] === 'INSERT';
        $reference = trim((string) ($validated['reference'] ?? '')) ?: ($isInsert ? 'BULK-'.$payCode->code : '');

        $batch = $batches->post($period, $request->user(), [
            'source' => PayrollInputBatch::SOURCE_BULK,
            'action' => $validated['action'],
            'description' => ($isInsert ? 'Add ' : 'Remove ').$payCode->code.' for '.$profiles->count().' employee(s)',
            'control_total' => $validated['control_total'] ?? null,
            'control_count' => $validated['control_count'] ?? null,
            'accept_mismatch' => (bool) ($validated['accept_mismatch'] ?? false),
            'metadata' => [
                'pay_code' => $payCode->code,
                'filters' => collect($validated)->only(['org_unit_ids', 'cost_centres', 'employee_ids'])->all(),
            ],
        ], function (PayrollInputBatch $batch) use ($isInsert, $profiles, $period, $payCode, $validated, $reference, $batches) {
            if (! $isInsert) {
                $removed = PayrollInput::query()
                    ->where('payroll_period_id', $period->id)
                    ->where('pay_code_id', $payCode->id)
                    ->whereIn('employee_id', $profiles->pluck('employee_id'))
                    ->when($reference !== '', fn ($query) => $query->where('reference', $reference))
                    ->get();

                $removed->each(fn (PayrollInput $input) => $batches->remove($batch, $input));

                return $removed->map(fn (PayrollInput $input) => ['amount' => $input->resolvedAmount()]);
            }

            return $profiles->map(fn ($profile) => $batches->upsert(
                $batch,
                [
                    'organization_id' => $period->organization_id,
                    'payroll_period_id' => $period->id,
                    'employee_id' => $profile->employee_id,
                    'pay_code_id' => $payCode->id,
                    'reference' => $reference,
                ],
                [
                    'input_mode' => $validated['input_mode'],
                    'amount' => $validated['input_mode'] === 'FIXED' ? (float) $validated['amount'] : null,
                    'quantity' => $validated['input_mode'] === 'RATE_X_QTY' ? (float) $validated['quantity'] : null,
                    'rate' => $validated['input_mode'] === 'RATE_X_QTY' ? (float) $validated['rate'] : null,
                    'source' => 'BULK',
                    'notes' => $validated['notes'] ?? null,
                    'created_by' => request()->user()?->id,
                    'updated_by' => request()->user()?->id,
                ]
            ))->values();
        });

        return back()->with('success', $isInsert
            ? "Batch {$batch->batch_number}: added {$payCode->code} for {$batch->entered_count} employee(s), totalling ".number_format((float) $batch->entered_total, 2).'.'
            : "Batch {$batch->batch_number}: removed {$batch->entered_count} {$payCode->code} input(s).");
    }

    public function batches(Request $request): Response
    {
        $periodId = $request->integer('period_id');

        return Inertia::render('Payroll/Inputs/Batches', [
            'batches' => PayrollInputBatch::query()
                ->with(['period', 'createdBy', 'reversedBy'])
                ->when($periodId, fn ($query) => $query->where('payroll_period_id', $periodId))
                ->orderByDesc('id')
                ->paginate(25)
                ->withQueryString()
                ->through(fn (PayrollInputBatch $batch) => [
                    'id' => $batch->id,
                    'batch_number' => $batch->batch_number,
                    'source' => $batch->source,
                    'action' => $batch->action,
                    'description' => $batch->description,
                    'period' => $batch->period ? ['id' => $batch->period->id, 'code' => $batch->period->code, 'status' => $batch->period->status] : null,
                    'control_total' => $batch->control_total !== null ? (float) $batch->control_total : null,
                    'control_count' => $batch->control_count,
                    'entered_total' => (float) $batch->entered_total,
                    'entered_count' => (int) $batch->entered_count,
                    'differences' => $batch->metadata['control_differences'] ?? [],
                    'measure' => $batch->metadata['measure'] ?? 'amount',
                    'status' => $batch->status,
                    'created_by' => $batch->createdBy?->name,
                    'created_at' => optional($batch->created_at)->toDateTimeString(),
                    'reversed_by' => $batch->reversedBy?->name,
                    'reversed_at' => optional($batch->reversed_at)->toDateTimeString(),
                ]),
            'filters' => ['period_id' => $periodId ?: null],
            'periods' => PayrollPeriod::query()->orderByDesc('period_end')->get(['id', 'code', 'name'])->values(),
        ]);
    }

    public function reverseBatch(int $batch, PayrollInputBatchService $batches): RedirectResponse
    {
        /** @var PayrollInputBatch $batch */
        $batch = $this->findTenantModelOrFail(PayrollInputBatch::class, $batch, ['period']);
        $batches->reverse($batch, request()->user());

        return back()->with('success', "Batch {$batch->batch_number} reversed. Its inputs are back to how they were before it was posted.");
    }

    private function mapInput(PayrollInput $input): array
    {
        return [
            'id' => $input->id,
            'payroll_period_id' => $input->payroll_period_id,
            'employee_id' => $input->employee_id,
            'employee' => $input->employee ? [
                'id' => $input->employee->id,
                'staff_number' => $input->employee->staff_number,
                'full_name' => $input->employee->full_name,
                'department' => $input->employee->orgUnit?->name,
                'position' => $input->employee->position?->name,
            ] : null,
            'period' => $input->period ? [
                'id' => $input->period->id,
                'code' => $input->period->code,
                'status' => $input->period->status,
            ] : null,
            'pay_code' => $input->payCode ? [
                'id' => $input->payCode->id,
                'code' => $input->payCode->code,
                'description' => $input->payCode->description,
                'type' => $input->payCode->type,
            ] : null,
            'input_mode' => $input->input_mode,
            'amount' => $input->amount !== null ? (float) $input->amount : null,
            'quantity' => $input->quantity !== null ? (float) $input->quantity : null,
            'rate' => $input->rate !== null ? (float) $input->rate : null,
            'source' => $input->source,
            'batch_number' => $input->batch?->batch_number,
            'reference' => $input->reference,
            'notes' => $input->notes,
            'created_at' => optional($input->created_at)->toDateTimeString(),
        ];
    }

    private function inputPayload(array $validated): array
    {
        $validated['source'] = $validated['source'] ?? 'MANUAL';

        return $validated;
    }
}
