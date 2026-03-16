<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Models\EmployeeContract;
use App\Models\EmployeeJobProfile;
use App\Models\EmployeeKpi;
use App\Models\EmployeeNextOfKin;
use App\Models\EmployeePhysicalProfile;
use App\Models\EmployeeSkill;
use App\Models\OrgUnit;
use App\Models\Position;
use App\Models\Role;
use App\Models\User;
use App\Support\Audit\AuditContext;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'pay_point' => $request->string('pay_point')->toString(),
        ];

        $query = Employee::query()
            ->with([
                'user:id,name,email',
                'orgUnit:id,name,type',
                'position:id,name',
                'location:id,name',
            ])
            ->orderBy('surname')
            ->orderBy('first_name');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('staff_number', 'like', "%{$s}%")
                    ->orWhere('first_name', 'like', "%{$s}%")
                    ->orWhere('middle_name', 'like', "%{$s}%")
                    ->orWhere('surname', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")
                    ->orWhere('national_id', 'like', "%{$s}%")
                    ->orWhere('gender', 'like', "%{$s}%")
                    ->orWhere('occupation', 'like', "%{$s}%")
                    ->orWhere('contact_number', 'like', "%{$s}%")
                    ->orWhere('alt_phone_number', 'like', "%{$s}%")
                    ->orWhere('marital_status', 'like', "%{$s}%")
                    ->orWhere('nationality', 'like', "%{$s}%")
                    ->orWhere('educational_level', 'like', "%{$s}%")
                    ->orWhere('pay_point', 'like', "%{$s}%")
                    ->orWhereHas('user', function ($uq) use ($s) {
                        $uq->where('email', 'like', "%{$s}%")
                            ->orWhere('name', 'like', "%{$s}%");
                    });
            });
        }

        if (!empty($filters['pay_point']) && $filters['pay_point'] !== 'all') {
            $query->where('pay_point', $filters['pay_point']);
        }

        $employees = $query->paginate(15)->withQueryString()->through(function (Employee $employee) {
            return [
                'id' => $employee->id,
                'staff_number' => $employee->staff_number,
                'first_name' => $employee->first_name,
                'middle_name' => $employee->middle_name,
                'surname' => $employee->surname,
                'full_name' => trim($employee->first_name.' '.($employee->middle_name ? $employee->middle_name.' ' : '').$employee->surname),
                'date_of_birth' => optional($employee->date_of_birth)->toDateString(),
                'email' => $this->resolveEmployeeEmail($employee),
                'national_id' => $employee->national_id,
                'gender' => $employee->gender,
                'occupation' => $employee->occupation,
                'pay_point' => $employee->pay_point,
                'contact_number' => $employee->contact_number,
                'alt_phone_number' => $employee->alt_phone_number,
                'address' => $employee->address,
                'marital_status' => $employee->marital_status,
                'nationality' => $employee->nationality,
                'educational_level' => $employee->educational_level,
                'user' => $employee->user ? [
                    'id' => $employee->user->id,
                    'name' => $employee->user->name,
                    'email' => $employee->user->email,
                ] : null,
                'department' => $employee->orgUnit ? [
                    'id' => $employee->orgUnit->id,
                    'name' => $employee->orgUnit->name,
                    'type' => $employee->orgUnit->type,
                ] : null,
                'position' => $employee->position ? [
                    'id' => $employee->position->id,
                    'name' => $employee->position->name,
                ] : null,
                'created_at' => optional($employee->created_at)->toDateTimeString(),
            ];
        });

        $payPoints = Employee::query()
            ->whereNotNull('pay_point')
            ->where('pay_point', '!=', '')
            ->distinct()
            ->orderBy('pay_point')
            ->pluck('pay_point')
            ->values();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'pay_point' => $filters['pay_point'] ?: 'all',
            ],
            'payPoints' => $payPoints,
        ]);
    }

    public function create()
    {
        $departments = OrgUnit::query()
            ->select(['id', 'name', 'type'])
            ->where('type', 'DEPARTMENT')
            ->orderBy('name')
            ->get();

        $positions = Position::query()
            ->select(['id', 'name', 'code', 'org_unit_id', 'is_active'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Employees/Create', [
            'departments' => $departments,
            'positions' => $positions,
            'options' => $this->employeeFormOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateEmployee($request);

        DB::transaction(function () use ($data) {
            $email = $data['email'] ?? null;

            $user = null;
            if ($email) {
                $user = $this->createOrUpdateUserForEmployee($data);
                $this->attachEmployeeRoleIfAvailable($user);
            }

            Employee::create($this->employeeUpsertPayload($data, $user));
        });

        return redirect()
            ->to('/employees')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Request $request, Employee $employee)
    {
        $employee->load([
            'user.roles:id,code,name',
            'orgUnit:id,name,type',
            'position:id,name',
            'manager:id,first_name,surname,staff_number',
            'documents.documentType:id,code,name,sensitivity_level',
            'nextOfKin',
            'physicalProfile',
            'skills',
            'jobProfile',
            'kpis',
            'currentContract.department:id,name',
            'currentContract.position:id,name',
            'contracts.department:id,name',
            'contracts.position:id,name',
            'assetAssignments.asset:id,asset_tag,name,status',
        ]);

        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'user_id' => $employee->user_id,
                'staff_number' => $employee->staff_number,
                'first_name' => $employee->first_name,
                'middle_name' => $employee->middle_name,
                'surname' => $employee->surname,
                'full_name' => $employee->full_name,
                'status' => $employee->status,
                'date_of_birth' => optional($employee->date_of_birth)->toDateString(),
                'email' => $this->resolveEmployeeEmail($employee),
                'national_id' => $employee->national_id,
                'gender' => $employee->gender,
                'occupation' => $employee->occupation,
                'pay_point' => $employee->pay_point,
                'contact_number' => $employee->contact_number,
                'alt_phone_number' => $employee->alt_phone_number,
                'address' => $employee->address,
                'marital_status' => $employee->marital_status,
                'nationality' => $employee->nationality,
                'educational_level' => $employee->educational_level,
                'department' => $employee->orgUnit ? [
                    'id' => $employee->orgUnit->id,
                    'name' => $employee->orgUnit->name,
                ] : null,
                'position' => $employee->position ? [
                    'id' => $employee->position->id,
                    'name' => $employee->position->name,
                ] : null,
                'manager' => $employee->manager ? [
                    'id' => $employee->manager->id,
                    'staff_number' => $employee->manager->staff_number,
                    'full_name' => trim($employee->manager->first_name.' '.$employee->manager->surname),
                ] : null,
                'user' => $employee->user ? [
                    'id' => $employee->user->id,
                    'name' => $employee->user->name,
                    'email' => $employee->user->email,
                    'username' => Schema::hasColumn('users', 'username') ? $employee->user->username : null,
                    'role' => Schema::hasColumn('users', 'role') ? $employee->user->role : null,
                    'roles' => $employee->user->effectiveRoles($employee->organization_id)->map(fn (Role $role) => [
                        'id' => $role->id,
                        'code' => $role->code,
                        'name' => $role->name,
                    ])->values()->all(),
                    'created_at' => optional($employee->user->created_at)->toDateTimeString(),
                    'updated_at' => optional($employee->user->updated_at)->toDateTimeString(),
                    'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                        ? optional($employee->user->email_verified_at)->toDateTimeString()
                        : null,
                ] : null,
                'leave_applications_count' => $employee->leaveRequest()->count(),
                'leave_balances_count' => 0,
                'documents' => $employee->documents->map(fn (Document $document) => $this->mapDocument($employee, $document))->values()->all(),
                'next_of_kin' => $employee->nextOfKin->map(fn (EmployeeNextOfKin $nextOfKin) => $this->mapNextOfKin($employee, $nextOfKin))->values()->all(),
                'physical_profile' => $employee->physicalProfile ? $this->mapPhysicalProfile($employee->physicalProfile) : null,
                'skills' => $employee->skills->map(fn (EmployeeSkill $skill) => $this->mapSkill($employee, $skill))->values()->all(),
                'job_profile' => $employee->jobProfile ? $this->mapJobProfile($employee->jobProfile) : null,
                'kpis' => $employee->kpis->map(fn (EmployeeKpi $kpi) => $this->mapKpi($employee, $kpi))->values()->all(),
                'current_contract' => $employee->currentContract ? [
                    'id' => $employee->currentContract->id,
                    'contract_number' => $employee->currentContract->contract_number,
                    'contract_type' => $employee->currentContract->contract_type,
                    'status' => $employee->currentContract->status,
                    'start_date' => optional($employee->currentContract->start_date)->toDateString(),
                    'end_date' => optional($employee->currentContract->end_date)->toDateString(),
                    'basic_salary' => $employee->currentContract->basic_salary,
                    'currency' => $employee->currentContract->currency,
                    'job_title' => $employee->currentContract->job_title,
                    'department' => $employee->currentContract->department ? ['id' => $employee->currentContract->department->id, 'name' => $employee->currentContract->department->name] : null,
                    'position' => $employee->currentContract->position ? ['id' => $employee->currentContract->position->id, 'name' => $employee->currentContract->position->name] : null,
                    'show_url' => "/employees/{$employee->id}/contracts/{$employee->currentContract->id}",
                ] : null,
                'contracts' => $employee->contracts->map(fn (EmployeeContract $c) => [
                    'id' => $c->id,
                    'contract_number' => $c->contract_number,
                    'contract_type' => $c->contract_type,
                    'status' => $c->status,
                    'start_date' => optional($c->start_date)->toDateString(),
                    'end_date' => optional($c->end_date)->toDateString(),
                    'is_current' => $c->is_current,
                    'show_url' => "/employees/{$employee->id}/contracts/{$c->id}",
                ])->values()->all(),
                'asset_assignments' => $employee->assetAssignments->map(fn (\App\Models\AssetAssignment $a) => [
                    'id' => $a->id,
                    'asset' => $a->asset ? [
                        'id' => $a->asset->id,
                        'asset_tag' => $a->asset->asset_tag,
                        'name' => $a->asset->name,
                        'status' => $a->asset->status,
                    ] : null,
                    'assigned_at' => optional($a->assigned_at)->toDateTimeString(),
                    'expected_return_date' => optional($a->expected_return_date)->toDateString(),
                    'returned_at' => optional($a->returned_at)->toDateTimeString(),
                    'status' => $a->status,
                    'show_url' => "/assets/{$a->asset_id}",
                ])->values()->all(),
                'stats' => [
                    'documents_count' => $employee->documents->count(),
                    'next_of_kin_count' => $employee->nextOfKin->count(),
                    'skills_count' => $employee->skills->count(),
                    'kpis_count' => $employee->kpis->count(),
                    'contracts_count' => $employee->contracts->count(),
                    'asset_assignments_count' => $employee->assetAssignments->count(),
                ],
                'links' => [
                    'document_store' => "/employees/{$employee->id}/documents",
                    'next_of_kin_store' => "/employees/{$employee->id}/next-of-kin",
                    'physical_profile_store' => "/employees/{$employee->id}/physical-profile",
                    'skill_store' => "/employees/{$employee->id}/skills",
                    'job_profile_store' => "/employees/{$employee->id}/job-profile",
                    'kpi_store' => "/employees/{$employee->id}/kpis",
                    'contracts_index' => "/employees/{$employee->id}/contracts",
                    'contracts_create' => "/employees/{$employee->id}/contracts/create",
                ],
                'created_at' => optional($employee->created_at)->toDateTimeString(),
                'updated_at' => optional($employee->updated_at)->toDateTimeString(),
            ],
            'options' => [
                'document_types' => DocumentType::query()
                    ->select('id', 'code', 'name', 'sensitivity_level')
                    ->orderBy('name')
                    ->get()
                    ->map(fn (DocumentType $type) => [
                        'id' => $type->id,
                        'code' => $type->code,
                        'name' => $type->name,
                        'sensitivity_level' => $type->sensitivity_level,
                    ])
                    ->values()
                    ->all(),
                'document_access_policies' => $this->documentAccessPolicies(),
                'skill_levels' => $this->skillLevels(),
                'employment_types' => $this->employmentTypes(),
                'kpi_statuses' => $this->kpiStatuses(),
            ],
        ]);
    }

    public function edit(Employee $employee)
    {
        $departments = OrgUnit::query()
            ->select(['id', 'name', 'type'])
            ->where('type', 'DEPARTMENT')
            ->orderBy('name')
            ->get();

        $positions = Position::query()
            ->select(['id', 'name', 'code', 'org_unit_id', 'is_active'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $employee->load('user');

        return Inertia::render('Employees/Edit', [
            'employee' => [
                'id' => $employee->id,
                'staff_number' => $employee->staff_number,
                'first_name' => $employee->first_name,
                'middle_name' => $employee->middle_name,
                'surname' => $employee->surname,
                'date_of_birth' => optional($employee->date_of_birth)->toDateString(),
                'email' => $this->resolveEmployeeEmail($employee),
                'national_id' => $employee->national_id,
                'gender' => $employee->gender,
                'occupation' => $employee->occupation,
                'pay_point' => $employee->pay_point,
                'contact_number' => $employee->contact_number,
                'alt_phone_number' => $employee->alt_phone_number,
                'address' => $employee->address,
                'marital_status' => $employee->marital_status,
                'nationality' => $employee->nationality,
                'educational_level' => $employee->educational_level,
                'department_id' => $employee->org_unit_id,
                'position_id' => $employee->position_id,
            ],
            'departments' => $departments,
            'positions' => $positions,
            'options' => $this->employeeFormOptions(),
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $data = $this->validateEmployee($request, $employee);

        DB::transaction(function () use ($employee, $data) {
            $user = $employee->user;

            if (!empty($data['email'])) {
                $user = $this->createOrUpdateUserForEmployee($data, $employee->user_id);
                $employee->user_id = $user->id;
                $this->attachEmployeeRoleIfAvailable($user);
            }

            $employee->update($this->employeeUpsertPayload($data, $user, $employee->status));
        });

        return redirect()
            ->to("/employees/{$employee->id}")
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()
            ->to('/employees')
            ->with('success', 'Employee deleted successfully.');
    }

    public function storeDocument(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $this->validateEmployeeDocument($request);
        $metadata = $this->parseMetadataInput($validated['metadata_json'] ?? null) ?? [];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileUri = $file->store("documents/employees/{$employee->id}", 'public');
            $metadata = array_merge($metadata, [
                'storage_disk' => 'public',
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size_bytes' => $file->getSize(),
            ]);
        } else {
            $fileUri = $validated['file_uri'];
            $metadata = array_merge($metadata, [
                'storage_disk' => 'external',
            ]);
        }

        Document::create([
            'owner_employee_id' => $employee->id,
            'document_type_id' => (int) $validated['document_type_id'],
            'title' => $validated['title'],
            'file_uri' => $fileUri,
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'metadata_json' => empty($metadata) ? null : $metadata,
            'access_policy' => $validated['access_policy'],
        ]);

        return back()->with('success', 'Employee document attached successfully.');
    }

    public function downloadDocument(Employee $employee, Document $document)
    {
        $this->ensureEmployeeOwnsDocument($employee, $document);

        app(AuditLogger::class)->logCustom('export', $document, [
            'module' => 'documents',
            'description' => "Downloaded employee document {$document->title}.",
            'metadata' => [
                'employee_id' => $employee->id,
            ],
        ]);

        if (filter_var($document->file_uri, FILTER_VALIDATE_URL)) {
            return redirect()->away($document->file_uri);
        }

        $disk = Storage::disk('public');
        if ($disk->exists($document->file_uri)) {
            $downloadName = data_get($document->metadata_json, 'original_name') ?: basename($document->file_uri);

            return $disk->download($document->file_uri, $downloadName);
        }

        return back()->with('error', 'The requested document file could not be located.');
    }

    public function destroyDocument(Employee $employee, Document $document): RedirectResponse
    {
        $this->ensureEmployeeOwnsDocument($employee, $document);
        $document->delete();

        return back()->with('success', 'Employee document deleted successfully.');
    }

    public function storeNextOfKin(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $this->validateNextOfKin($request);
        $isPrimary = (bool) ($validated['is_primary'] ?? false) || !$employee->nextOfKin()->exists();

        DB::transaction(function () use ($employee, $validated, $isPrimary) {
            if ($isPrimary) {
                $employee->nextOfKin()->update(['is_primary' => false]);
            }

            $employee->nextOfKin()->create([
                ...$validated,
                'is_primary' => $isPrimary,
            ]);
        });

        return back()->with('success', 'Next of kin information added successfully.');
    }

    public function updateNextOfKin(Request $request, Employee $employee, EmployeeNextOfKin $nextOfKin): RedirectResponse
    {
        $this->ensureEmployeeOwnsNextOfKin($employee, $nextOfKin);
        $validated = $this->validateNextOfKin($request);
        $isPrimary = (bool) ($validated['is_primary'] ?? false);

        DB::transaction(function () use ($employee, $nextOfKin, $validated, $isPrimary) {
            if ($isPrimary) {
                $employee->nextOfKin()
                    ->whereKeyNot($nextOfKin->id)
                    ->update(['is_primary' => false]);
            }

            $nextOfKin->update([
                ...$validated,
                'is_primary' => $isPrimary,
            ]);
        });

        return back()->with('success', 'Next of kin information updated successfully.');
    }

    public function destroyNextOfKin(Employee $employee, EmployeeNextOfKin $nextOfKin): RedirectResponse
    {
        $this->ensureEmployeeOwnsNextOfKin($employee, $nextOfKin);
        $wasPrimary = $nextOfKin->is_primary;
        $nextOfKin->delete();

        if ($wasPrimary) {
            $replacement = $employee->nextOfKin()->first();
            if ($replacement) {
                $replacement->update(['is_primary' => true]);
            }
        }

        return back()->with('success', 'Next of kin information removed successfully.');
    }

    public function storePhysicalProfile(Request $request, Employee $employee): RedirectResponse
    {
        $employee->physicalProfile()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->validatePhysicalProfile($request),
        );

        return back()->with('success', 'Physical profile saved successfully.');
    }

    public function storeSkill(Request $request, Employee $employee): RedirectResponse
    {
        $employee->skills()->create($this->validateSkill($request));

        return back()->with('success', 'Skill added successfully.');
    }

    public function updateSkill(Request $request, Employee $employee, EmployeeSkill $skill): RedirectResponse
    {
        $this->ensureEmployeeOwnsSkill($employee, $skill);
        $skill->update($this->validateSkill($request));

        return back()->with('success', 'Skill updated successfully.');
    }

    public function destroySkill(Employee $employee, EmployeeSkill $skill): RedirectResponse
    {
        $this->ensureEmployeeOwnsSkill($employee, $skill);
        $skill->delete();

        return back()->with('success', 'Skill removed successfully.');
    }

    public function storeJobProfile(Request $request, Employee $employee): RedirectResponse
    {
        $employee->jobProfile()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->validateJobProfile($request),
        );

        return back()->with('success', 'Job description saved successfully.');
    }

    public function storeKpi(Request $request, Employee $employee): RedirectResponse
    {
        $employee->kpis()->create($this->validateKpi($request));

        return back()->with('success', 'KPI added successfully.');
    }

    public function updateKpi(Request $request, Employee $employee, EmployeeKpi $kpi): RedirectResponse
    {
        $this->ensureEmployeeOwnsKpi($employee, $kpi);
        $kpi->update($this->validateKpi($request));

        return back()->with('success', 'KPI updated successfully.');
    }

    public function destroyKpi(Employee $employee, EmployeeKpi $kpi): RedirectResponse
    {
        $this->ensureEmployeeOwnsKpi($employee, $kpi);
        $kpi->delete();

        return back()->with('success', 'KPI removed successfully.');
    }

    public function upload()
    {
        return Inertia::render('Employees/Upload');
    }

    public function downloadTemplate(): StreamedResponse
    {
        $filename = 'employees_template.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () {
            $out = fopen('php://output', 'w');

            fputcsv($out, [
                'staff_number',
                'first_name',
                'middle_name',
                'surname',
                'date_of_birth',
                'national_id',
                'gender',
                'marital_status',
                'nationality',
                'educational_level',
                'occupation',
                'pay_point',
                'contact_number',
                'alt_phone_number',
                'address',
                'email',
                'department_id',
                'position_id',
            ]);

            fputcsv($out, [
                'EMP001',
                'John',
                '',
                'Doe',
                '1995-01-10',
                '12-345678-X-90',
                'Male',
                'Single',
                'Zimbabwean',
                'Degree',
                'Systems Analyst',
                'Head Office',
                '+263771234567',
                '+263772345678',
                'Harare, Zimbabwe',
                'john.doe@example.com',
                '',
                '',
            ]);

            fclose($out);
        }, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $path = $request->file('file')->getRealPath();

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $batchId = (string) Str::uuid();

        AuditContext::withBatch($batchId, function () use ($path, &$created, &$updated, &$skipped) {
            DB::transaction(function () use ($path, &$created, &$updated, &$skipped) {
                $handle = fopen($path, 'r');
                if ($handle === false) {
                    throw new \RuntimeException('Failed to open uploaded file.');
                }

                $header = fgetcsv($handle);
                if (!$header) {
                    fclose($handle);
                    throw new \RuntimeException('CSV file is empty.');
                }

                $header = array_map(fn ($heading) => Str::of($heading)->trim()->lower()->toString(), $header);
                $idx = array_flip($header);

                foreach (['staff_number', 'first_name', 'surname', 'national_id', 'gender', 'marital_status'] as $column) {
                    if (!array_key_exists($column, $idx)) {
                        fclose($handle);
                        throw new \RuntimeException("Missing required column: {$column}");
                    }
                }

                while (($row = fgetcsv($handle)) !== false) {
                    $staffNumber = $this->csvColumnValue($row, $idx, 'staff_number');
                    $firstName = $this->csvColumnValue($row, $idx, 'first_name');
                    $surname = $this->csvColumnValue($row, $idx, 'surname');

                    if (
                        $staffNumber === null
                        || $firstName === null
                        || $surname === null
                        || $this->csvColumnValue($row, $idx, 'national_id') === null
                        || $this->csvColumnValue($row, $idx, 'gender') === null
                        || $this->csvColumnValue($row, $idx, 'marital_status') === null
                    ) {
                        $skipped++;
                        continue;
                    }

                    $payload = [
                        'staff_number' => $staffNumber,
                        'first_name' => $firstName,
                        'middle_name' => $this->csvColumnValue($row, $idx, 'middle_name'),
                        'surname' => $surname,
                        'date_of_birth' => $this->csvColumnValue($row, $idx, 'date_of_birth'),
                        'national_id' => $this->csvColumnValue($row, $idx, 'national_id'),
                        'gender' => $this->csvColumnValue($row, $idx, 'gender'),
                        'occupation' => $this->csvColumnValue($row, $idx, 'occupation'),
                        'pay_point' => $this->csvColumnValue($row, $idx, 'pay_point'),
                        'contact_number' => $this->csvColumnValue($row, $idx, 'contact_number'),
                        'alt_phone_number' => $this->csvColumnValue($row, $idx, 'alt_phone_number'),
                        'address' => $this->csvColumnValue($row, $idx, 'address'),
                        'email' => $this->csvColumnValue($row, $idx, 'email'),
                        'marital_status' => $this->csvColumnValue($row, $idx, 'marital_status'),
                        'nationality' => $this->csvColumnValue($row, $idx, 'nationality'),
                        'educational_level' => $this->csvColumnValue($row, $idx, 'educational_level'),
                        'department_id' => $this->csvColumnValue($row, $idx, 'department_id'),
                        'position_id' => $this->csvColumnValue($row, $idx, 'position_id'),
                    ];

                    $existing = Employee::where('staff_number', $staffNumber)->first();
                    $userId = $existing?->user_id;

                    if (!empty($payload['email'])) {
                        $user = $this->createOrUpdateUserForEmployee($payload, $userId);
                        $this->attachEmployeeRoleIfAvailable($user);
                        $userId = $user->id;
                    }

                    $saveData = $this->employeeUpsertPayload($payload, $userId ? User::find($userId) : null);

                    if ($existing) {
                        $existing->update($saveData);
                        $updated++;
                    } else {
                        Employee::create($saveData);
                        $created++;
                    }
                }

                fclose($handle);
            });
        });

        app(AuditLogger::class)->logCustom('bulk_upload', null, [
            'module' => 'employees',
            'category' => 'bulk',
            'description' => 'Processed employee bulk upload import.',
            'metadata' => [
                'created' => $created,
                'updated' => $updated,
                'skipped' => $skipped,
            ],
            'batch_id' => $batchId,
        ]);

        return redirect()
            ->to('/employees')
            ->with('success', "Import completed. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
    }

    private function mapDocument(Employee $employee, Document $document): array
    {
        return [
            'id' => $document->id,
            'document_type_id' => $document->document_type_id,
            'title' => $document->title,
            'file_uri' => $document->file_uri,
            'file_name' => data_get($document->metadata_json, 'original_name') ?: basename($document->file_uri),
            'issue_date' => optional($document->issue_date)->toDateString(),
            'expiry_date' => optional($document->expiry_date)->toDateString(),
            'access_policy' => $document->access_policy,
            'metadata_json' => $document->metadata_json,
            'created_at' => optional($document->created_at)->toDateTimeString(),
            'document_type' => $document->documentType ? [
                'id' => $document->documentType->id,
                'code' => $document->documentType->code,
                'name' => $document->documentType->name,
                'sensitivity_level' => $document->documentType->sensitivity_level,
            ] : null,
            'download_url' => "/employees/{$employee->id}/documents/{$document->id}/download",
            'delete_url' => "/employees/{$employee->id}/documents/{$document->id}",
        ];
    }

    private function mapNextOfKin(Employee $employee, EmployeeNextOfKin $nextOfKin): array
    {
        return [
            'id' => $nextOfKin->id,
            'full_name' => $nextOfKin->full_name,
            'relationship' => $nextOfKin->relationship,
            'contact_number' => $nextOfKin->contact_number,
            'alternate_contact_number' => $nextOfKin->alternate_contact_number,
            'email' => $nextOfKin->email,
            'address' => $nextOfKin->address,
            'is_primary' => $nextOfKin->is_primary,
            'notes' => $nextOfKin->notes,
            'created_at' => optional($nextOfKin->created_at)->toDateTimeString(),
            'updated_at' => optional($nextOfKin->updated_at)->toDateTimeString(),
            'update_url' => "/employees/{$employee->id}/next-of-kin/{$nextOfKin->id}",
            'delete_url' => "/employees/{$employee->id}/next-of-kin/{$nextOfKin->id}",
        ];
    }

    private function mapPhysicalProfile(EmployeePhysicalProfile $physicalProfile): array
    {
        return [
            'id' => $physicalProfile->id,
            'uniform_size' => $physicalProfile->uniform_size,
            'shirt_size' => $physicalProfile->shirt_size,
            'trouser_size' => $physicalProfile->trouser_size,
            'shoe_size' => $physicalProfile->shoe_size,
            'height_cm' => $physicalProfile->height_cm,
            'weight_kg' => $physicalProfile->weight_kg,
            'blood_type' => $physicalProfile->blood_type,
            'emergency_medical_notes' => $physicalProfile->emergency_medical_notes,
            'ppe_notes' => $physicalProfile->ppe_notes,
            'updated_at' => optional($physicalProfile->updated_at)->toDateTimeString(),
        ];
    }

    private function mapSkill(Employee $employee, EmployeeSkill $skill): array
    {
        return [
            'id' => $skill->id,
            'name' => $skill->name,
            'category' => $skill->category,
            'proficiency_level' => $skill->proficiency_level,
            'proficiency_percent' => $skill->proficiency_percent,
            'certification_name' => $skill->certification_name,
            'certification_issuer' => $skill->certification_issuer,
            'certified_at' => optional($skill->certified_at)->toDateString(),
            'expires_at' => optional($skill->expires_at)->toDateString(),
            'notes' => $skill->notes,
            'update_url' => "/employees/{$employee->id}/skills/{$skill->id}",
            'delete_url' => "/employees/{$employee->id}/skills/{$skill->id}",
        ];
    }

    private function mapJobProfile(EmployeeJobProfile $jobProfile): array
    {
        return [
            'id' => $jobProfile->id,
            'title' => $jobProfile->title,
            'employment_type' => $jobProfile->employment_type,
            'reports_to' => $jobProfile->reports_to,
            'working_hours' => $jobProfile->working_hours,
            'location_summary' => $jobProfile->location_summary,
            'summary' => $jobProfile->summary,
            'responsibilities' => $jobProfile->responsibilities,
            'requirements' => $jobProfile->requirements,
            'review_date' => optional($jobProfile->review_date)->toDateString(),
            'updated_at' => optional($jobProfile->updated_at)->toDateTimeString(),
        ];
    }

    private function mapKpi(Employee $employee, EmployeeKpi $kpi): array
    {
        return [
            'id' => $kpi->id,
            'title' => $kpi->title,
            'description' => $kpi->description,
            'target_value' => $kpi->target_value,
            'current_value' => $kpi->current_value,
            'measurement_period' => $kpi->measurement_period,
            'weight' => $kpi->weight,
            'progress_percent' => $kpi->progress_percent,
            'due_date' => optional($kpi->due_date)->toDateString(),
            'status' => $kpi->status,
            'update_url' => "/employees/{$employee->id}/kpis/{$kpi->id}",
            'delete_url' => "/employees/{$employee->id}/kpis/{$kpi->id}",
        ];
    }

    private function validateEmployee(Request $request, ?Employee $employee = null): array
    {
        $tenantId = $this->tenantId();
        $currentUserId = $employee?->user_id;
        $genderOptions = $this->employeeGenders();
        $maritalStatusOptions = $this->employeeMaritalStatuses();
        $educationOptions = $this->employeeEducationalLevels();

        return $request->validate([
            'staff_number' => ['required', 'string', 'max:64', $this->tenantUniqueRule('employees', 'staff_number', $employee?->id)],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'surname' => ['required', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date'],
            'national_id' => ['required', 'string', 'max:100', $this->tenantUniqueRule('employees', 'national_id', $employee?->id)],
            'gender' => ['required', 'string', Rule::in($genderOptions)],
            'occupation' => ['nullable', 'string', 'max:150'],
            'pay_point' => ['nullable', 'string', 'max:64'],
            'contact_number' => ['nullable', 'string', 'max:64'],
            'alt_phone_number' => ['nullable', 'string', 'max:64'],
            'address' => ['nullable', 'string'],
            'email' => [
                Rule::requiredIf($currentUserId !== null),
                'nullable',
                'email',
                'max:255',
                $this->tenantUniqueRule('employees', 'email', $employee?->id),
                function (string $attribute, mixed $value, \Closure $fail) use ($employee): void {
                    if (blank($value)) {
                        return;
                    }

                    $existingUser = User::query()->where('email', $value)->first();

                    if (! $existingUser || $existingUser->id === $employee?->user_id) {
                        return;
                    }

                    $linkedEmployee = $existingUser->employee()
                        ->when($employee, fn ($query) => $query->whereKeyNot($employee->id))
                        ->first();

                    if ($linkedEmployee) {
                        $fail('The selected email is already linked to another employee account.');
                    }
                },
            ],
            'marital_status' => ['required', 'string', Rule::in($maritalStatusOptions)],
            'nationality' => ['nullable', 'string', 'max:120'],
            'educational_level' => ['nullable', 'string', Rule::in($educationOptions)],
            'department_id' => ['nullable', 'integer', Rule::exists('org_units', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId))],
            'position_id' => ['nullable', 'integer', Rule::exists('positions', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId))],
        ]);
    }

    private function validateEmployeeDocument(Request $request): array
    {
        $tenantId = $this->tenantId();

        $validator = validator($request->all(), [
            'document_type_id' => ['required', 'integer', Rule::exists('document_types', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId))],
            'title' => ['required', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'max:10240'],
            'file_uri' => ['nullable', 'string', 'max:2048'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'access_policy' => ['required', 'in:'.implode(',', $this->documentAccessPolicies())],
            'metadata_json' => ['nullable', 'string'],
        ]);

        $validator->after(function ($validator) use ($request): void {
            if (!$request->hasFile('file') && blank($request->input('file_uri'))) {
                $validator->errors()->add('file', 'Attach a file or provide a file URI.');
            }
        });

        return $validator->validate();
    }

    private function validateNextOfKin(Request $request): array
    {
        return $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'string', 'max:100'],
            'contact_number' => ['required', 'string', 'max:64'],
            'alternate_contact_number' => ['nullable', 'string', 'max:64'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['required', 'string'],
            'is_primary' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function validatePhysicalProfile(Request $request): array
    {
        return $request->validate([
            'uniform_size' => ['nullable', 'string', 'max:32'],
            'shirt_size' => ['nullable', 'string', 'max:32'],
            'trouser_size' => ['nullable', 'string', 'max:32'],
            'shoe_size' => ['nullable', 'string', 'max:32'],
            'height_cm' => ['nullable', 'numeric', 'min:0'],
            'weight_kg' => ['nullable', 'numeric', 'min:0'],
            'blood_type' => ['nullable', 'string', 'max:8'],
            'emergency_medical_notes' => ['nullable', 'string'],
            'ppe_notes' => ['nullable', 'string'],
        ]);
    }

    private function validateSkill(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'proficiency_level' => ['required', 'in:'.implode(',', $this->skillLevels())],
            'proficiency_percent' => ['required', 'integer', 'between:0,100'],
            'certification_name' => ['nullable', 'string', 'max:255'],
            'certification_issuer' => ['nullable', 'string', 'max:255'],
            'certified_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:certified_at'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function validateJobProfile(Request $request): array
    {
        return $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', 'in:'.implode(',', $this->employmentTypes())],
            'reports_to' => ['nullable', 'string', 'max:255'],
            'working_hours' => ['nullable', 'string', 'max:128'],
            'location_summary' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'requirements' => ['nullable', 'string'],
            'review_date' => ['nullable', 'date'],
        ]);
    }

    private function validateKpi(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target_value' => ['nullable', 'string', 'max:255'],
            'current_value' => ['nullable', 'string', 'max:255'],
            'measurement_period' => ['nullable', 'string', 'max:64'],
            'weight' => ['nullable', 'numeric', 'between:0,100'],
            'progress_percent' => ['required', 'integer', 'between:0,100'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', 'in:'.implode(',', $this->kpiStatuses())],
        ]);
    }

    private function createOrUpdateUserForEmployee(array $data, ?int $existingUserId = null): User
    {
        $email = trim((string) ($data['email'] ?? ''));
        $first = $data['first_name'] ?? 'user';
        $last = $data['surname'] ?? 'employee';

        $userQuery = User::query();

        if ($existingUserId) {
            $userQuery->whereKey($existingUserId);
        } else {
            $userQuery->where('email', $email);
        }

        $user = $userQuery->first();

        $userData = [
            'name' => trim($first.' '.$last),
            'email' => $email,
        ];

        if (!$user) {
            $userData['password'] = Hash::make('PHC@2025!');
        }

        if (Schema::hasColumn('users', 'username')) {
            $base = Str::lower(Str::slug($first.'.'.$last, '.'));
            $candidate = $base;
            $n = 1;
            while (User::where('username', $candidate)->when($user, fn ($q) => $q->where('id', '!=', $user->id))->exists()) {
                $n++;
                $candidate = $base.$n;
            }
            $userData['username'] = $candidate;
        }

        if (Schema::hasColumn('users', 'role') && empty($userData['role'])) {
            $userData['role'] = 'employee';
        }

        if (Schema::hasColumn('users', 'email_verified_at') && empty($userData['email_verified_at'])) {
            $userData['email_verified_at'] = now();
        }

        if ($user) {
            $user->update($userData);

            if ($this->tenantId()) {
                $user->attachToOrganization($this->tenantId());
            }

            return $user;
        }

        $user = User::create($userData);

        if ($this->tenantId()) {
            $user->attachToOrganization($this->tenantId());
        }

        return $user;
    }

    private function employeeUpsertPayload(array $data, ?User $user = null, ?string $status = 'ACTIVE'): array
    {
        return [
            'user_id' => $user?->id,
            'staff_number' => $data['staff_number'],
            'first_name' => $data['first_name'],
            'middle_name' => $data['middle_name'] ?? null,
            'surname' => $data['surname'],
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'email' => $user?->email ?? ($data['email'] ?? null),
            'national_id' => $data['national_id'],
            'gender' => $data['gender'],
            'occupation' => $data['occupation'] ?? null,
            'pay_point' => $data['pay_point'] ?? null,
            'contact_number' => $data['contact_number'] ?? null,
            'alt_phone_number' => $data['alt_phone_number'] ?? null,
            'address' => $data['address'] ?? null,
            'marital_status' => $data['marital_status'],
            'nationality' => $data['nationality'] ?? null,
            'educational_level' => $data['educational_level'] ?? null,
            'org_unit_id' => ! empty($data['department_id']) ? (int) $data['department_id'] : null,
            'position_id' => ! empty($data['position_id']) ? (int) $data['position_id'] : null,
            'status' => $status ?? 'ACTIVE',
        ];
    }

    private function resolveEmployeeEmail(Employee $employee): ?string
    {
        return $employee->user?->email ?: $employee->email;
    }

    private function csvColumnValue(array $row, array $indexes, string $column): ?string
    {
        if (! array_key_exists($column, $indexes)) {
            return null;
        }

        $value = trim((string) ($row[$indexes[$column]] ?? ''));

        return $value !== '' ? $value : null;
    }

    private function employeeFormOptions(): array
    {
        return [
            'genders' => $this->employeeGenders(),
            'marital_statuses' => $this->employeeMaritalStatuses(),
            'educational_levels' => $this->employeeEducationalLevels(),
        ];
    }

    private function employeeGenders(): array
    {
        return ['Male', 'Female', 'Other'];
    }

    private function employeeMaritalStatuses(): array
    {
        return ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
    }

    private function employeeEducationalLevels(): array
    {
        return ['Primary', 'Secondary', 'Certificate', 'Diploma', 'Degree', 'Masters', 'Doctorate', 'Other'];
    }

    private function attachEmployeeRoleIfAvailable(User $user): void
    {
        if (!Schema::hasTable('roles') || !Schema::hasTable('organization_user_roles') || ! $this->tenantId()) {
            return;
        }

        $role = Role::query()->where('code', 'EMPLOYEE')->first();
        if (!$role) {
            return;
        }

        $currentRoleIds = $user->organizationRoles($this->tenantId())->pluck('id')->all();
        $user->syncRoles([...$currentRoleIds, $role->id], $this->tenantId());
    }

    private function documentAccessPolicies(): array
    {
        return ['public', 'internal', 'confidential', 'restricted'];
    }

    private function skillLevels(): array
    {
        return ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    }

    private function employmentTypes(): array
    {
        return ['Permanent', 'Contract', 'Part-time', 'Internship', 'Consultant'];
    }

    private function kpiStatuses(): array
    {
        return ['ACTIVE', 'ON_TRACK', 'AT_RISK', 'COMPLETED', 'PAUSED'];
    }

    private function parseMetadataInput(mixed $metadata): ?array
    {
        if ($metadata === null || $metadata === '') {
            return null;
        }

        if (is_array($metadata)) {
            return $metadata;
        }

        if (is_string($metadata)) {
            $decoded = json_decode($metadata, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw ValidationException::withMessages([
                    'metadata_json' => 'Metadata must be valid JSON.',
                ]);
            }

            return $decoded;
        }

        throw ValidationException::withMessages([
            'metadata_json' => 'Metadata format is invalid.',
        ]);
    }

    private function ensureEmployeeOwnsDocument(Employee $employee, Document $document): void
    {
        abort_unless($document->owner_employee_id === $employee->id, 404);
    }

    private function ensureEmployeeOwnsNextOfKin(Employee $employee, EmployeeNextOfKin $nextOfKin): void
    {
        abort_unless($nextOfKin->employee_id === $employee->id, 404);
    }

    private function ensureEmployeeOwnsSkill(Employee $employee, EmployeeSkill $skill): void
    {
        abort_unless($skill->employee_id === $employee->id, 404);
    }

    private function ensureEmployeeOwnsKpi(Employee $employee, EmployeeKpi $kpi): void
    {
        abort_unless($kpi->employee_id === $employee->id, 404);
    }
}
