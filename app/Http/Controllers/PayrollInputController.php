<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payroll\UpsertPayrollInputRequest;
use App\Models\Employee;
use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollPeriod;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
            ->with(['period', 'employee.orgUnit', 'employee.position', 'payCode'])
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
                ->get(['id', 'staff_number', 'first_name', 'middle_name', 'surname'])
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'staff_number' => $employee->staff_number,
                    'full_name' => $employee->full_name,
                ])
                ->values(),
            'payCodes' => PayCode::query()
                ->where('active', true)
                ->orderBy('sort_order')
                ->orderBy('code')
                ->get(['id', 'code', 'description', 'type', 'category'])
                ->map(fn (PayCode $payCode) => [
                    'id' => $payCode->id,
                    'code' => $payCode->code,
                    'description' => $payCode->description,
                    'type' => $payCode->type,
                    'category' => $payCode->category,
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
            'sources' => ['MANUAL', 'IMPORT', 'TIMESHEET', 'LEAVE', 'SYSTEM'],
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
        $headers = ['staff_number', 'pay_code', 'amount', 'quantity', 'rate', 'reference', 'notes'];
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

    public function import(Request $request, AuditLogger $auditLogger): RedirectResponse
    {
        $validated = $request->validate([
            'payroll_period_id' => ['required', 'integer'],
            'file' => ['required', 'file', 'mimes:csv,txt'],
        ]);

        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, (int) $validated['payroll_period_id']);

        if (in_array($period->status, ['APPROVED', 'CLOSED'], true)) {
            return back()->withErrors([
                'file' => 'Inputs cannot be imported into approved or closed periods.',
            ]);
        }

        $file = $request->file('file');
        abort_unless($file, 422);

        $handle = fopen($file->getRealPath(), 'r');
        abort_unless($handle !== false, 422);

        $header = fgetcsv($handle) ?: [];
        $columns = collect($header)->map(fn ($value) => Str::of((string) $value)->trim()->lower()->toString())->values();
        $imported = 0;
        $errors = [];

        DB::transaction(function () use ($handle, $columns, $period, &$imported, &$errors): void {
            while (($row = fgetcsv($handle)) !== false) {
                $data = $columns->combine($row);

                $staffNumber = trim((string) ($data['staff_number'] ?? ''));
                $payCodeValue = trim((string) ($data['pay_code'] ?? ''));

                if ($staffNumber === '' || $payCodeValue === '') {
                    $errors[] = 'Skipped a row without staff number or pay code.';
                    continue;
                }

                $employee = Employee::query()->where('staff_number', $staffNumber)->first();
                $payCode = PayCode::query()->where('code', $payCodeValue)->first();

                if (! $employee || ! $payCode) {
                    $errors[] = "Skipped {$staffNumber}: employee or pay code could not be resolved.";
                    continue;
                }

                PayrollInput::query()->updateOrCreate(
                    [
                        'organization_id' => $period->organization_id,
                        'payroll_period_id' => $period->id,
                        'employee_id' => $employee->id,
                        'pay_code_id' => $payCode->id,
                        'reference' => trim((string) ($data['reference'] ?? '')),
                    ],
                    [
                        'input_mode' => ($data['quantity'] ?? '') !== '' && ($data['rate'] ?? '') !== '' ? 'RATE_X_QTY' : 'FIXED',
                        'amount' => $data['amount'] !== '' ? (float) $data['amount'] : null,
                        'quantity' => $data['quantity'] !== '' ? (float) $data['quantity'] : null,
                        'rate' => $data['rate'] !== '' ? (float) $data['rate'] : null,
                        'source' => 'IMPORT',
                        'notes' => $data['notes'] ?? null,
                        'created_by' => request()->user()?->id,
                        'updated_by' => request()->user()?->id,
                    ]
                );

                $imported++;
            }
        });

        fclose($handle);

        $auditLogger->logCustom('import', $period, [
            'module' => 'payroll',
            'category' => 'bulk',
            'description' => 'Imported payroll inputs into a payroll period.',
            'organization_id' => $period->organization_id,
            'new_values' => [
                'imported_rows' => $imported,
                'error_count' => count($errors),
            ],
        ]);

        return back()->with(
            'success',
            $errors === []
                ? "Imported {$imported} payroll inputs successfully."
                : "Imported {$imported} payroll inputs with ".count($errors).' skipped row(s).'
        );
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
