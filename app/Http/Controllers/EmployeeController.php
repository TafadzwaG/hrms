<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\OrgUnit;
use App\Models\Position;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
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
                    ->orWhere('contact_number', 'like', "%{$s}%")
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

        $employees = $query->paginate(15)->withQueryString()->through(function (Employee $e) {
            return [
                'id' => $e->id,
                'staff_number' => $e->staff_number,
                'first_name' => $e->first_name,
                'middle_name' => $e->middle_name,
                'surname' => $e->surname,
                'full_name' => trim($e->first_name . ' ' . ($e->middle_name ? $e->middle_name . ' ' : '') . $e->surname),

                'date_of_birth' => optional($e->date_of_birth)->toDateString(),
                'pay_point' => $e->pay_point,
                'contact_number' => $e->contact_number,
                'address' => $e->address,

                'user' => $e->user ? [
                    'id' => $e->user->id,
                    'name' => $e->user->name,
                    'email' => $e->user->email,
                ] : null,

                'department' => $e->orgUnit ? [
                    'id' => $e->orgUnit->id,
                    'name' => $e->orgUnit->name,
                    'type' => $e->orgUnit->type,
                ] : null,

                'position' => $e->position ? [
                    'id' => $e->position->id,
                    'name' => $e->position->name,
                ] : null,

                'created_at' => optional($e->created_at)->toDateTimeString(),
            ];
        });

        // Useful for filter dropdown (optional)
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

            Employee::create([
                'user_id' => $user?->id,
                'staff_number' => $data['staff_number'],
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'surname' => $data['surname'],
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'pay_point' => $data['pay_point'] ?? null,
                'contact_number' => $data['contact_number'] ?? null,
                'address' => $data['address'] ?? null,
                'org_unit_id' => $data['department_id'] ?? null,
                'position_id' => $data['position_id'] ?? null,
                'status' => 'ACTIVE',
            ]);
        });

        return redirect()
            ->to('/employees')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee)
    {
        $employee->load([
            'user',
            'orgUnit:id,name,type',
            'position:id,name',
            'manager:id,first_name,surname,staff_number',
        ]);

        // If you don’t have leave tables yet, keep counts at 0 safely.
        $leaveApplicationsCount = 0;
        $leaveBalancesCount = 0;

        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'user_id' => $employee->user_id,
                'staff_number' => $employee->staff_number,
                'first_name' => $employee->first_name,
                'middle_name' => $employee->middle_name,
                'surname' => $employee->surname,
                'date_of_birth' => optional($employee->date_of_birth)->toDateString(),
                'pay_point' => $employee->pay_point,
                'contact_number' => $employee->contact_number,
                'address' => $employee->address,

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
                    'full_name' => trim($employee->manager->first_name . ' ' . $employee->manager->surname),
                ] : null,

                'user' => $employee->user ? [
                    'id' => $employee->user->id,
                    'name' => $employee->user->name,
                    'email' => $employee->user->email,
                    'username' => Schema::hasColumn('users', 'username') ? $employee->user->username : null,
                    'role' => Schema::hasColumn('users', 'role') ? $employee->user->role : null,
                    'created_at' => optional($employee->user->created_at)->toDateTimeString(),
                    'updated_at' => optional($employee->user->updated_at)->toDateTimeString(),
                    'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                        ? optional($employee->user->email_verified_at)->toDateTimeString()
                        : null,
                ] : null,

                // counts to match your UI pattern
                'leave_applications_count' => $leaveApplicationsCount,
                'leave_balances_count' => $leaveBalancesCount,

                'created_at' => optional($employee->created_at)->toDateTimeString(),
                'updated_at' => optional($employee->updated_at)->toDateTimeString(),
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
                'pay_point' => $employee->pay_point,
                'contact_number' => $employee->contact_number,
                'address' => $employee->address,
                'email' => $employee->user?->email,
                'department_id' => $employee->org_unit_id,
                'position_id' => $employee->position_id,
            ],
            'departments' => $departments,
            'positions' => $positions,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $data = $this->validateEmployee($request, $employee->id);

        DB::transaction(function () use ($employee, $data) {
            // Update user if email supplied
            if (!empty($data['email'])) {
                $user = $this->createOrUpdateUserForEmployee($data, $employee->user_id);
                $employee->user_id = $user->id;
                $this->attachEmployeeRoleIfAvailable($user);
            }

            $employee->update([
                'staff_number' => $data['staff_number'],
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'surname' => $data['surname'],
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'pay_point' => $data['pay_point'] ?? null,
                'contact_number' => $data['contact_number'] ?? null,
                'address' => $data['address'] ?? null,
                'org_unit_id' => $data['department_id'] ?? null,
                'position_id' => $data['position_id'] ?? null,
            ]);
        });

        return redirect()
            ->to("/employees/{$employee->id}")
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        // Add “cannot delete” business rules later (leave, payroll etc.)
        $userId = $employee->user_id;

        $employee->delete();

        // Optional: delete the user account if you want (comment out if you prefer keeping user accounts)
        // if ($userId) {
        //     User::whereKey($userId)->delete();
        // }

        return redirect()
            ->to('/employees')
            ->with('success', 'Employee deleted successfully.');
    }

    // ---------------------------
    // Upload / Import
    // ---------------------------

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
                'pay_point',
                'contact_number',
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
                'Head Office',
                '+263771234567',
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

            $header = array_map(fn ($h) => Str::of($h)->trim()->lower()->toString(), $header);
            $idx = array_flip($header);

            foreach (['staff_number', 'first_name', 'surname'] as $col) {
                if (!array_key_exists($col, $idx)) {
                    fclose($handle);
                    throw new \RuntimeException("Missing required column: {$col}");
                }
            }

            while (($row = fgetcsv($handle)) !== false) {
                $staffNumber = trim($row[$idx['staff_number']] ?? '');
                $firstName = trim($row[$idx['first_name']] ?? '');
                $surname = trim($row[$idx['surname']] ?? '');

                if ($staffNumber === '' || $firstName === '' || $surname === '') {
                    $skipped++;
                    continue;
                }

                $payload = [
                    'staff_number' => $staffNumber,
                    'first_name' => $firstName,
                    'middle_name' => trim($row[$idx['middle_name']] ?? '') ?: null,
                    'surname' => $surname,
                    'date_of_birth' => trim($row[$idx['date_of_birth']] ?? '') ?: null,
                    'pay_point' => trim($row[$idx['pay_point']] ?? '') ?: null,
                    'contact_number' => trim($row[$idx['contact_number']] ?? '') ?: null,
                    'address' => trim($row[$idx['address']] ?? '') ?: null,
                    'email' => trim($row[$idx['email']] ?? '') ?: null,
                    'department_id' => trim($row[$idx['department_id']] ?? '') ?: null,
                    'position_id' => trim($row[$idx['position_id']] ?? '') ?: null,
                ];

                $existing = Employee::where('staff_number', $staffNumber)->first();

                // Create/update user if email exists
                $userId = $existing?->user_id;
                if (!empty($payload['email'])) {
                    $user = $this->createOrUpdateUserForEmployee($payload, $userId);
                    $this->attachEmployeeRoleIfAvailable($user);
                    $userId = $user->id;
                }

                $saveData = [
                    'user_id' => $userId,
                    'staff_number' => $payload['staff_number'],
                    'first_name' => $payload['first_name'],
                    'middle_name' => $payload['middle_name'],
                    'surname' => $payload['surname'],
                    'date_of_birth' => $payload['date_of_birth'],
                    'pay_point' => $payload['pay_point'],
                    'contact_number' => $payload['contact_number'],
                    'address' => $payload['address'],
                    'org_unit_id' => $payload['department_id'] ? (int)$payload['department_id'] : null,
                    'position_id' => $payload['position_id'] ? (int)$payload['position_id'] : null,
                    'status' => 'ACTIVE',
                ];

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

        return redirect()
            ->to('/employees')
            ->with('success', "Import completed. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
    }

    // ---------------------------
    // Helpers
    // ---------------------------

    private function validateEmployee(Request $request, ?int $ignoreEmployeeId = null): array
    {
        return $request->validate([
            'staff_number' => [
                'required', 'string', 'max:64',
                'unique:employees,staff_number' . ($ignoreEmployeeId ? ',' . $ignoreEmployeeId : ''),
            ],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'surname' => ['required', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date'],
            'pay_point' => ['nullable', 'string', 'max:64'],
            'contact_number' => ['nullable', 'string', 'max:64'],
            'address' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'department_id' => ['nullable', 'integer', 'exists:org_units,id'],
            'position_id' => ['nullable', 'integer', 'exists:positions,id'],
        ]);
    }

    private function createOrUpdateUserForEmployee(array $data, ?int $existingUserId = null): User
    {
        $email = $data['email'];
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
            'name' => trim($first . ' ' . $last),
            'email' => $email,
        ];

        // Default password only when creating new user
        if (!$user) {
            $userData['password'] = Hash::make('PHC@2025!');
        }

        if (Schema::hasColumn('users', 'username')) {
            $base = Str::lower(Str::slug($first . '.' . $last, '.'));
            $candidate = $base;
            $n = 1;
            while (User::where('username', $candidate)->when($user, fn($q) => $q->where('id', '!=', $user->id))->exists()) {
                $n++;
                $candidate = $base . $n;
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
            return $user;
        }

        return User::create($userData);
    }

    private function attachEmployeeRoleIfAvailable(User $user): void
    {
        if (!Schema::hasTable('roles') || !Schema::hasTable('role_user')) return;

        $role = Role::query()->where('code', 'EMPLOYEE')->first();
        if (!$role) return;

        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}