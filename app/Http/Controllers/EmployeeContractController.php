<?php

namespace App\Http\Controllers;

use App\Models\ContractDocument;
use App\Models\Employee;
use App\Models\EmployeeContract;
use App\Models\OrgUnit;
use App\Models\Position;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeContractController extends Controller
{
    public function index(Request $request, Employee $employee)
    {
        $contracts = $employee->contracts()
            ->with([
                'department:id,name',
                'position:id,name',
            ])
            ->get()
            ->map(fn (EmployeeContract $contract) => $this->mapContract($employee, $contract));

        return Inertia::render('EmployeeContracts/Index', [
            'employee' => $this->mapEmployeeSummary($employee),
            'contracts' => $contracts->values()->all(),
        ]);
    }

    public function create(Employee $employee)
    {
        return Inertia::render('EmployeeContracts/Create', [
            'employee' => $this->mapEmployeeSummary($employee),
            'options' => $this->contractFormOptions(),
        ]);
    }

    public function store(Request $request, Employee $employee): RedirectResponse
    {
        $data = $this->validateContract($request, $employee);

        DB::transaction(function () use ($employee, $data, $request) {
            $isCurrent = (bool) ($data['is_current'] ?? false);

            if ($isCurrent) {
                $employee->contracts()->where('is_current', true)->update(['is_current' => false]);
            }

            $employee->contracts()->create([
                ...$data,
                'is_current' => $isCurrent,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/employees/{$employee->id}/contracts")
            ->with('success', 'Contract created successfully.');
    }

    public function show(Employee $employee, EmployeeContract $contract)
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);

        $contract->load([
            'department:id,name',
            'position:id,name',
            'documents',
            'createdBy:id,name',
            'updatedBy:id,name',
        ]);

        return Inertia::render('EmployeeContracts/Show', [
            'employee' => $this->mapEmployeeSummary($employee),
            'contract' => $this->mapContractDetail($employee, $contract),
        ]);
    }

    public function edit(Employee $employee, EmployeeContract $contract)
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);

        $contract->load(['department:id,name', 'position:id,name']);

        return Inertia::render('EmployeeContracts/Edit', [
            'employee' => $this->mapEmployeeSummary($employee),
            'contract' => $this->mapContractDetail($employee, $contract),
            'options' => $this->contractFormOptions(),
        ]);
    }

    public function update(Request $request, Employee $employee, EmployeeContract $contract): RedirectResponse
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);

        $data = $this->validateContract($request, $employee, $contract);

        DB::transaction(function () use ($employee, $contract, $data, $request) {
            $isCurrent = (bool) ($data['is_current'] ?? false);

            if ($isCurrent && !$contract->is_current) {
                $employee->contracts()
                    ->whereKeyNot($contract->id)
                    ->where('is_current', true)
                    ->update(['is_current' => false]);
            }

            $contract->update([
                ...$data,
                'is_current' => $isCurrent,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/employees/{$employee->id}/contracts/{$contract->id}")
            ->with('success', 'Contract updated successfully.');
    }

    public function destroy(Employee $employee, EmployeeContract $contract): RedirectResponse
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);
        $contract->delete();

        return redirect("/employees/{$employee->id}/contracts")
            ->with('success', 'Contract deleted successfully.');
    }

    public function activate(Request $request, Employee $employee, EmployeeContract $contract): RedirectResponse
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);

        DB::transaction(function () use ($employee, $contract, $request) {
            $employee->contracts()
                ->whereKeyNot($contract->id)
                ->where('is_current', true)
                ->update(['is_current' => false]);

            $contract->update([
                'is_current' => true,
                'status' => 'active',
                'updated_by' => $request->user()?->id,
            ]);
        });

        app(AuditLogger::class)->logCustom('activate', $contract, [
            'module' => 'employee_contracts',
            'description' => "Activated contract {$contract->contract_number} as current for employee #{$employee->id}.",
        ]);

        return back()->with('success', 'Contract activated as current successfully.');
    }

    public function terminate(Request $request, Employee $employee, EmployeeContract $contract): RedirectResponse
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);

        $request->validate([
            'termination_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $contract->update([
            'status' => 'terminated',
            'is_current' => false,
            'terminated_at' => now(),
            'termination_reason' => $request->input('termination_reason'),
            'updated_by' => $request->user()?->id,
        ]);

        app(AuditLogger::class)->logCustom('terminate', $contract, [
            'module' => 'employee_contracts',
            'description' => "Terminated contract {$contract->contract_number} for employee #{$employee->id}.",
        ]);

        return back()->with('success', 'Contract terminated successfully.');
    }

    public function storeDocument(Request $request, Employee $employee, EmployeeContract $contract): RedirectResponse
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);

        $request->validate([
            'file' => ['required', 'file', 'max:20480'],
        ]);

        $file = $request->file('file');
        $filePath = $file->store("contracts/{$employee->id}/{$contract->id}", 'public');

        $contract->documents()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Contract document uploaded successfully.');
    }

    public function downloadDocument(Employee $employee, EmployeeContract $contract, ContractDocument $document)
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);
        $this->ensureContractOwnsDocument($contract, $document);

        app(AuditLogger::class)->logCustom('export', $document, [
            'module' => 'contract_documents',
            'description' => "Downloaded contract document {$document->file_name}.",
            'metadata' => [
                'employee_id' => $employee->id,
                'contract_id' => $contract->id,
            ],
        ]);

        $disk = Storage::disk('public');
        if ($disk->exists($document->file_path)) {
            return $disk->download($document->file_path, $document->file_name);
        }

        return back()->with('error', 'The requested document file could not be located.');
    }

    public function destroyDocument(Employee $employee, EmployeeContract $contract, ContractDocument $document): RedirectResponse
    {
        $this->ensureEmployeeOwnsContract($employee, $contract);
        $this->ensureContractOwnsDocument($contract, $document);

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Contract document deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function ensureEmployeeOwnsContract(Employee $employee, EmployeeContract $contract): void
    {
        abort_unless((int) $contract->employee_id === (int) $employee->id, 404);
    }

    private function ensureContractOwnsDocument(EmployeeContract $contract, ContractDocument $document): void
    {
        abort_unless((int) $document->employee_contract_id === (int) $contract->id, 404);
    }

    private function validateContract(Request $request, Employee $employee, ?EmployeeContract $contract = null): array
    {
        return $request->validate([
            'contract_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('employee_contracts', 'contract_number')
                    ->where('organization_id', $employee->organization_id)
                    ->ignore($contract?->id),
            ],
            'contract_type' => ['required', 'string', Rule::in(EmployeeContract::CONTRACT_TYPES)],
            'status' => ['required', 'string', Rule::in(EmployeeContract::STATUSES)],
            'start_date' => ['required', 'date'],
            'end_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
                Rule::requiredIf(fn () => $request->input('contract_type') === 'fixed_term'),
            ],
            'probation_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'department_id' => ['nullable', 'integer', 'exists:org_units,id'],
            'position_id' => ['nullable', 'integer', 'exists:positions,id'],
            'pay_point' => ['nullable', 'string', 'max:100'],
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'pay_frequency' => ['nullable', 'string', Rule::in(EmployeeContract::PAY_FREQUENCIES)],
            'working_hours_per_week' => ['nullable', 'numeric', 'min:0', 'max:168'],
            'notice_period_days' => ['nullable', 'integer', 'min:0'],
            'leave_days_per_year' => ['nullable', 'integer', 'min:0'],
            'is_current' => ['nullable', 'boolean'],
            'signed_at' => ['nullable', 'date'],
            'termination_reason' => ['nullable', 'string', 'max:500'],
            'renewal_notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function contractFormOptions(): array
    {
        $departments = OrgUnit::query()
            ->select(['id', 'name', 'type'])
            ->where('type', 'DEPARTMENT')
            ->orderBy('name')
            ->get()
            ->map(fn (OrgUnit $unit) => ['id' => $unit->id, 'name' => $unit->name])
            ->values()
            ->all();

        $positions = Position::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Position $position) => ['id' => $position->id, 'name' => $position->name])
            ->values()
            ->all();

        return [
            'contract_types' => EmployeeContract::CONTRACT_TYPES,
            'statuses' => EmployeeContract::STATUSES,
            'pay_frequencies' => EmployeeContract::PAY_FREQUENCIES,
            'currencies' => EmployeeContract::CURRENCIES,
            'departments' => $departments,
            'positions' => $positions,
        ];
    }

    private function mapEmployeeSummary(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'staff_number' => $employee->staff_number,
            'full_name' => $employee->full_name,
            'first_name' => $employee->first_name,
            'surname' => $employee->surname,
        ];
    }

    private function mapContract(Employee $employee, EmployeeContract $contract): array
    {
        return [
            'id' => $contract->id,
            'contract_number' => $contract->contract_number,
            'contract_type' => $contract->contract_type,
            'status' => $contract->status,
            'start_date' => optional($contract->start_date)->toDateString(),
            'end_date' => optional($contract->end_date)->toDateString(),
            'job_title' => $contract->job_title,
            'department' => $contract->department ? ['id' => $contract->department->id, 'name' => $contract->department->name] : null,
            'position' => $contract->position ? ['id' => $contract->position->id, 'name' => $contract->position->name] : null,
            'basic_salary' => $contract->basic_salary,
            'currency' => $contract->currency,
            'is_current' => $contract->is_current,
            'created_at' => optional($contract->created_at)->toDateTimeString(),
            'links' => [
                'show' => "/employees/{$employee->id}/contracts/{$contract->id}",
                'edit' => "/employees/{$employee->id}/contracts/{$contract->id}/edit",
                'activate' => "/employees/{$employee->id}/contracts/{$contract->id}/activate",
                'terminate' => "/employees/{$employee->id}/contracts/{$contract->id}/terminate",
            ],
        ];
    }

    private function mapContractDetail(Employee $employee, EmployeeContract $contract): array
    {
        return [
            ...$this->mapContract($employee, $contract),
            'probation_end_date' => optional($contract->probation_end_date)->toDateString(),
            'pay_point' => $contract->pay_point,
            'pay_frequency' => $contract->pay_frequency,
            'working_hours_per_week' => $contract->working_hours_per_week,
            'notice_period_days' => $contract->notice_period_days,
            'leave_days_per_year' => $contract->leave_days_per_year,
            'signed_at' => optional($contract->signed_at)->toDateTimeString(),
            'terminated_at' => optional($contract->terminated_at)->toDateTimeString(),
            'termination_reason' => $contract->termination_reason,
            'renewal_notes' => $contract->renewal_notes,
            'benefits' => $contract->benefits,
            'metadata' => $contract->metadata,
            'created_by' => $contract->createdBy ? ['id' => $contract->createdBy->id, 'name' => $contract->createdBy->name] : null,
            'updated_by' => $contract->updatedBy ? ['id' => $contract->updatedBy->id, 'name' => $contract->updatedBy->name] : null,
            'updated_at' => optional($contract->updated_at)->toDateTimeString(),
            'documents' => $contract->documents->map(fn (ContractDocument $doc) => [
                'id' => $doc->id,
                'file_name' => $doc->file_name,
                'mime_type' => $doc->mime_type,
                'size' => $doc->size,
                'created_at' => optional($doc->created_at)->toDateTimeString(),
                'download_url' => "/employees/{$employee->id}/contracts/{$contract->id}/documents/{$doc->id}/download",
                'delete_url' => "/employees/{$employee->id}/contracts/{$contract->id}/documents/{$doc->id}",
            ])->values()->all(),
            'links' => [
                'show' => "/employees/{$employee->id}/contracts/{$contract->id}",
                'edit' => "/employees/{$employee->id}/contracts/{$contract->id}/edit",
                'activate' => "/employees/{$employee->id}/contracts/{$contract->id}/activate",
                'terminate' => "/employees/{$employee->id}/contracts/{$contract->id}/terminate",
                'document_store' => "/employees/{$employee->id}/contracts/{$contract->id}/documents",
            ],
        ];
    }
}
