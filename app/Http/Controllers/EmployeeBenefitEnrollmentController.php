<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\BenefitChangeLog;
use App\Models\BenefitDocument;
use App\Models\BenefitPlan;
use App\Models\Employee;
use App\Models\EmployeeBenefitEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeBenefitEnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $benefitId = $request->input('benefit_id');
        $status = $request->input('status');

        $baseQuery = EmployeeBenefitEnrollment::query()
            ->with([
                'employee:id,first_name,surname,staff_number',
                'benefit:id,name,code,category',
                'plan:id,name,code',
            ])
            ->when($search, fn ($q) => $q->whereHas('employee', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('surname', 'like', "%{$search}%")
                    ->orWhere('staff_number', 'like', "%{$search}%");
            }))
            ->when($benefitId, fn ($q) => $q->where('benefit_id', $benefitId))
            ->when($status, fn ($q) => $q->where('status', $status));

        $enrollments = (clone $baseQuery)
            ->orderByDesc('updated_at')
            ->paginate(25)
            ->through(fn (EmployeeBenefitEnrollment $enrollment) => $this->mapEnrollment($enrollment))
            ->withQueryString();

        $statsBaseQuery = EmployeeBenefitEnrollment::query()
            ->when($search, fn ($q) => $q->whereHas('employee', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('surname', 'like', "%{$search}%")
                    ->orWhere('staff_number', 'like', "%{$search}%");
            }))
            ->when($benefitId, fn ($q) => $q->where('benefit_id', $benefitId));

        $benefits = Benefit::query()
            ->select(['id', 'name', 'code'])
            ->where('active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Benefits/Enrollments/Index', [
            'enrollments' => $enrollments,
            'filters' => [
                'search' => $search,
                'benefit_id' => $benefitId,
                'status' => $status,
            ],
            'benefits' => $benefits,
            'statuses' => EmployeeBenefitEnrollment::STATUSES,
            'stats' => [
                'total_active' => (clone $statsBaseQuery)->where('status', 'active')->count(),
                'total_employer_contribution' => (clone $statsBaseQuery)->where('status', 'active')->sum('employer_contribution'),
                'total_employee_contribution' => (clone $statsBaseQuery)->where('status', 'active')->sum('employee_contribution'),
                'pending' => (clone $statsBaseQuery)->where('status', 'pending')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Benefits/Enrollments/Create', [
            'options' => $this->enrollmentFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateEnrollment($request);

        $enrollment = DB::transaction(function () use ($data, $request) {
            $enrollment = EmployeeBenefitEnrollment::create([
                ...$data,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);

            BenefitChangeLog::create([
                'organization_id' => $enrollment->organization_id,
                'employee_benefit_enrollment_id' => $enrollment->id,
                'event' => 'enrolled',
                'from_status' => null,
                'to_status' => $enrollment->status,
                'reason' => 'Employee enrolled in benefit.',
                'changed_by' => $request->user()?->id,
            ]);

            return $enrollment;
        });

        return redirect("/benefits/enrollments/{$enrollment->id}")
            ->with('success', 'Enrollment created successfully.');
    }

    public function show(EmployeeBenefitEnrollment $enrollment)
    {
        $enrollment->load([
            'employee:id,first_name,surname,staff_number',
            'benefit:id,name,code,category,benefit_type',
            'plan:id,name,code',
            'dependants',
            'documents',
            'changeLogs.changer:id,name',
            'createdBy:id,name',
            'updatedBy:id,name',
        ]);

        return Inertia::render('Benefits/Enrollments/Show', [
            'enrollment' => $this->mapEnrollmentDetail($enrollment),
        ]);
    }

    public function edit(EmployeeBenefitEnrollment $enrollment)
    {
        $enrollment->load([
            'employee:id,first_name,surname,staff_number',
            'benefit:id,name,code',
            'plan:id,name,code',
        ]);

        return Inertia::render('Benefits/Enrollments/Edit', [
            'enrollment' => $this->mapEnrollmentDetail($enrollment),
            'options' => $this->enrollmentFormOptions(),
        ]);
    }

    public function update(Request $request, EmployeeBenefitEnrollment $enrollment): RedirectResponse
    {
        $data = $this->validateEnrollment($request, $enrollment);
        $oldStatus = $enrollment->status;

        DB::transaction(function () use ($enrollment, $data, $request, $oldStatus) {
            $enrollment->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);

            if ($oldStatus !== $enrollment->status) {
                BenefitChangeLog::create([
                    'organization_id' => $enrollment->organization_id,
                    'employee_benefit_enrollment_id' => $enrollment->id,
                    'event' => 'status_changed',
                    'from_status' => $oldStatus,
                    'to_status' => $enrollment->status,
                    'reason' => 'Enrollment updated.',
                    'changed_by' => $request->user()?->id,
                ]);
            }
        });

        return redirect("/benefits/enrollments/{$enrollment->id}")
            ->with('success', 'Enrollment updated successfully.');
    }

    public function suspend(Request $request, EmployeeBenefitEnrollment $enrollment): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:2000'],
        ]);

        $oldStatus = $enrollment->status;

        DB::transaction(function () use ($enrollment, $request, $oldStatus) {
            $enrollment->update([
                'status' => 'suspended',
                'updated_by' => $request->user()?->id,
            ]);

            BenefitChangeLog::create([
                'organization_id' => $enrollment->organization_id,
                'employee_benefit_enrollment_id' => $enrollment->id,
                'event' => 'suspended',
                'from_status' => $oldStatus,
                'to_status' => 'suspended',
                'reason' => $request->input('reason', 'Enrollment suspended.'),
                'changed_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Enrollment suspended successfully.');
    }

    public function terminate(Request $request, EmployeeBenefitEnrollment $enrollment): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:2000'],
        ]);

        $oldStatus = $enrollment->status;

        DB::transaction(function () use ($enrollment, $request, $oldStatus) {
            $enrollment->update([
                'status' => 'terminated',
                'end_date' => now()->toDateString(),
                'updated_by' => $request->user()?->id,
            ]);

            BenefitChangeLog::create([
                'organization_id' => $enrollment->organization_id,
                'employee_benefit_enrollment_id' => $enrollment->id,
                'event' => 'terminated',
                'from_status' => $oldStatus,
                'to_status' => 'terminated',
                'reason' => $request->input('reason', 'Enrollment terminated.'),
                'changed_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Enrollment terminated successfully.');
    }

    public function reinstate(Request $request, EmployeeBenefitEnrollment $enrollment): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:2000'],
        ]);

        $oldStatus = $enrollment->status;

        DB::transaction(function () use ($enrollment, $request, $oldStatus) {
            $enrollment->update([
                'status' => 'active',
                'end_date' => null,
                'updated_by' => $request->user()?->id,
            ]);

            BenefitChangeLog::create([
                'organization_id' => $enrollment->organization_id,
                'employee_benefit_enrollment_id' => $enrollment->id,
                'event' => 'reinstated',
                'from_status' => $oldStatus,
                'to_status' => 'active',
                'reason' => $request->input('reason', 'Enrollment reinstated.'),
                'changed_by' => $request->user()?->id,
            ]);
        });

        return back()->with('success', 'Enrollment reinstated successfully.');
    }

    // ── Documents ────────────────────────────────────────────

    public function storeDocument(Request $request, EmployeeBenefitEnrollment $enrollment): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'],
            'document_type' => ['nullable', 'string', 'max:50'],
        ]);

        $file = $request->file('file');
        $filePath = $file->store("benefits/enrollments/{$enrollment->id}", 'public');

        $enrollment->documents()->create([
            'organization_id' => $enrollment->organization_id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'document_type' => $request->input('document_type', 'other'),
            'uploaded_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function downloadDocument(EmployeeBenefitEnrollment $enrollment, BenefitDocument $document)
    {
        abort_unless((int) $document->employee_benefit_enrollment_id === (int) $enrollment->id, 404);

        $disk = Storage::disk('public');
        if ($disk->exists($document->file_path)) {
            return $disk->download($document->file_path, $document->file_name);
        }

        return back()->with('error', 'The requested document file could not be located.');
    }

    public function destroyDocument(EmployeeBenefitEnrollment $enrollment, BenefitDocument $document): RedirectResponse
    {
        abort_unless((int) $document->employee_benefit_enrollment_id === (int) $enrollment->id, 404);

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateEnrollment(Request $request, ?EmployeeBenefitEnrollment $enrollment = null): array
    {
        return $request->validate([
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'benefit_id' => ['required', 'integer', 'exists:benefits,id'],
            'benefit_plan_id' => ['nullable', 'integer', 'exists:benefit_plans,id'],
            'status' => ['required', 'string', Rule::in(EmployeeBenefitEnrollment::STATUSES)],
            'effective_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
            'employee_contribution' => ['nullable', 'numeric', 'min:0'],
            'employer_contribution' => ['nullable', 'numeric', 'min:0'],
            'payroll_deduction_code' => ['nullable', 'string', 'max:50'],
            'enrollment_reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function mapEnrollment(EmployeeBenefitEnrollment $enrollment): array
    {
        return [
            'id' => $enrollment->id,
            'employee' => $enrollment->employee ? [
                'id' => $enrollment->employee->id,
                'full_name' => $enrollment->employee->full_name,
                'staff_number' => $enrollment->employee->staff_number,
            ] : null,
            'benefit' => $enrollment->benefit ? [
                'id' => $enrollment->benefit->id,
                'name' => $enrollment->benefit->name,
                'code' => $enrollment->benefit->code,
                'category' => $enrollment->benefit->category,
            ] : null,
            'plan' => $enrollment->plan ? [
                'id' => $enrollment->plan->id,
                'name' => $enrollment->plan->name,
                'code' => $enrollment->plan->code,
            ] : null,
            'status' => $enrollment->status,
            'effective_date' => optional($enrollment->effective_date)->toDateString(),
            'end_date' => optional($enrollment->end_date)->toDateString(),
            'employee_contribution' => $enrollment->employee_contribution,
            'employer_contribution' => $enrollment->employer_contribution,
            'updated_at' => optional($enrollment->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/benefits/enrollments/{$enrollment->id}",
                'edit' => "/benefits/enrollments/{$enrollment->id}/edit",
            ],
        ];
    }

    private function mapEnrollmentDetail(EmployeeBenefitEnrollment $enrollment): array
    {
        return [
            ...$this->mapEnrollment($enrollment),
            'payroll_deduction_code' => $enrollment->payroll_deduction_code,
            'enrollment_reference' => $enrollment->enrollment_reference,
            'notes' => $enrollment->notes,
            'metadata' => $enrollment->metadata,
            'created_by' => $enrollment->createdBy ? ['id' => $enrollment->createdBy->id, 'name' => $enrollment->createdBy->name] : null,
            'updated_by' => $enrollment->updatedBy ? ['id' => $enrollment->updatedBy->id, 'name' => $enrollment->updatedBy->name] : null,
            'created_at' => optional($enrollment->created_at)->toDateTimeString(),
            'dependants' => $enrollment->relationLoaded('dependants') ? $enrollment->dependants->map(fn ($dep) => [
                'id' => $dep->id,
                'full_name' => $dep->full_name,
                'relationship' => $dep->relationship,
                'date_of_birth' => optional($dep->date_of_birth)->toDateString(),
                'national_id' => $dep->national_id,
                'contact_number' => $dep->contact_number,
                'effective_date' => optional($dep->effective_date)->toDateString(),
                'end_date' => optional($dep->end_date)->toDateString(),
                'status' => $dep->status,
                'notes' => $dep->notes,
            ])->values()->all() : [],
            'documents' => $enrollment->relationLoaded('documents') ? $enrollment->documents->map(fn (BenefitDocument $doc) => [
                'id' => $doc->id,
                'file_name' => $doc->file_name,
                'mime_type' => $doc->mime_type,
                'size' => $doc->size,
                'document_type' => $doc->document_type,
                'created_at' => optional($doc->created_at)->toDateTimeString(),
                'download_url' => "/benefits/enrollments/{$enrollment->id}/documents/{$doc->id}/download",
                'delete_url' => "/benefits/enrollments/{$enrollment->id}/documents/{$doc->id}",
            ])->values()->all() : [],
            'change_logs' => $enrollment->relationLoaded('changeLogs') ? $enrollment->changeLogs->map(fn (BenefitChangeLog $log) => [
                'id' => $log->id,
                'event' => $log->event,
                'from_status' => $log->from_status,
                'to_status' => $log->to_status,
                'reason' => $log->reason,
                'changed_by' => $log->changer ? ['id' => $log->changer->id, 'name' => $log->changer->name] : null,
                'created_at' => optional($log->created_at)->toDateTimeString(),
            ])->values()->all() : [],
            'links' => [
                'show' => "/benefits/enrollments/{$enrollment->id}",
                'edit' => "/benefits/enrollments/{$enrollment->id}/edit",
                'suspend' => "/benefits/enrollments/{$enrollment->id}/suspend",
                'terminate' => "/benefits/enrollments/{$enrollment->id}/terminate",
                'reinstate' => "/benefits/enrollments/{$enrollment->id}/reinstate",
                'document_store' => "/benefits/enrollments/{$enrollment->id}/documents",
            ],
        ];
    }

    private function enrollmentFormOptions(): array
    {
        $employees = Employee::query()
            ->select(['id', 'first_name', 'surname', 'staff_number'])
            ->orderBy('first_name')
            ->get()
            ->map(fn (Employee $e) => [
                'id' => $e->id,
                'full_name' => $e->full_name,
                'staff_number' => $e->staff_number,
            ])
            ->values()
            ->all();

        $benefits = Benefit::query()
            ->select(['id', 'name', 'code'])
            ->where('active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Benefit $b) => ['id' => $b->id, 'name' => $b->name, 'code' => $b->code])
            ->values()
            ->all();

        $plans = BenefitPlan::query()
            ->select(['id', 'benefit_id', 'name', 'code'])
            ->where('active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (BenefitPlan $p) => ['id' => $p->id, 'benefit_id' => $p->benefit_id, 'name' => $p->name, 'code' => $p->code])
            ->values()
            ->all();

        return [
            'employees' => $employees,
            'benefits' => $benefits,
            'plans' => $plans,
            'statuses' => EmployeeBenefitEnrollment::STATUSES,
        ];
    }
}
