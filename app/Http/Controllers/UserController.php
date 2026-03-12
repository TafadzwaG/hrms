<?php

namespace App\Http\Controllers;

use App\Mail\UserCredentialsMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'role_id' => $request->string('role_id')->toString(),
        ];

        $query = User::query()
            ->with(['roles:id,code,name', 'employee:id,user_id,staff_number,first_name,surname'])
            ->withCount('roles')
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");

                if (Schema::hasColumn('users', 'username')) {
                    $q->orWhere('username', 'like', "%{$s}%");
                }
            });
        }

        if (!empty($filters['role_id'])) {
            $rid = (int) $filters['role_id'];
            $query->whereHas('roles', fn ($rq) => $rq->where('roles.id', $rid));
        }

        $users = $query->paginate(15)->withQueryString()->through(function (User $u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'username' => Schema::hasColumn('users', 'username') ? $u->username : null,
                'role' => Schema::hasColumn('users', 'role') ? $u->role : null,
                'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                    ? optional($u->email_verified_at)->toDateTimeString()
                    : null,
                'roles_count' => $u->roles_count ?? 0,
                'roles' => $u->roles->map(fn ($r) => [
                    'id' => $r->id,
                    'code' => $r->code,
                    'name' => $r->name,
                ])->values(),
                'employee' => $u->employee ? [
                    'id' => $u->employee->id,
                    'staff_number' => $u->employee->staff_number,
                    'full_name' => trim($u->employee->first_name . ' ' . $u->employee->surname),
                ] : null,
                'created_at' => optional($u->created_at)->toDateTimeString(),
                'updated_at' => optional($u->updated_at)->toDateTimeString(),
            ];
        });

        $roles = Role::query()->select(['id','code','name'])->orderBy('name')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'role_id' => $filters['role_id'] ?? '',
            ],
            'roles' => $roles,
            'meta' => [
                'supportsUsername' => Schema::hasColumn('users', 'username'),
                'supportsRoleColumn' => Schema::hasColumn('users', 'role'),
                'supportsEmailVerification' => Schema::hasColumn('users', 'email_verified_at'),
            ],
        ]);
    }

    public function create()
    {
        $roles = Role::query()->select(['id','code','name'])->orderBy('name')->get();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
            'meta' => [
                'supportsUsername' => Schema::hasColumn('users', 'username'),
                'supportsRoleColumn' => Schema::hasColumn('users', 'role'),
                'supportsEmailVerification' => Schema::hasColumn('users', 'email_verified_at'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $supportsUsername = Schema::hasColumn('users', 'username');
        $supportsRoleColumn = Schema::hasColumn('users', 'role');
        $supportsEmailVerification = Schema::hasColumn('users', 'email_verified_at');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'send_password_email' => ['nullable', 'boolean'],

            'role_ids' => ['array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ];

        if ($supportsUsername) {
            $rules['username'] = ['nullable', 'string', 'max:255', 'unique:users,username'];
        }

        if ($supportsRoleColumn) {
            $rules['role'] = ['nullable', 'string', 'max:50'];
        }

        if ($supportsEmailVerification) {
            $rules['mark_email_verified'] = ['nullable', 'boolean'];
        }

        $data = $request->validate($rules);

        $plainPassword = $data['password'];
        $sendPasswordEmail = (bool)($data['send_password_email'] ?? false);

        DB::transaction(function () use ($data, $supportsUsername, $supportsRoleColumn, $supportsEmailVerification, $plainPassword, $sendPasswordEmail) {
            $userPayload = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($plainPassword),
            ];

            if ($supportsUsername) {
                $userPayload['username'] = $data['username'] ?? null;
            }

            if ($supportsRoleColumn) {
                $userPayload['role'] = $data['role'] ?? 'employee';
            }

            if ($supportsEmailVerification) {
                $userPayload['email_verified_at'] = !empty($data['mark_email_verified']) ? now() : null;
            }

            /** @var User $user */
            $user = User::create($userPayload);

            if (Schema::hasTable('role_user')) {
                $roleIds = $data['role_ids'] ?? [];
                $user->roles()->sync($roleIds);
            }

            // Send only if email exists and admin enabled checkbox
            if ($sendPasswordEmail && !empty($user->email)) {
                DB::afterCommit(function () use ($user, $plainPassword) {
                    Mail::to($user->email)->send(new UserCredentialsMail($user, $plainPassword, 'created'));
                });
            }
        });

        return redirect()->to('/users')->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $user->load([
            'roles:id,code,name',
            'employee:id,user_id,staff_number,first_name,surname',
        ]);

        return Inertia::render('Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => Schema::hasColumn('users', 'username') ? $user->username : null,
                'role' => Schema::hasColumn('users', 'role') ? $user->role : null,
                'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                    ? optional($user->email_verified_at)->toDateTimeString()
                    : null,
                'roles' => $user->roles->map(fn ($r) => [
                    'id' => $r->id,
                    'code' => $r->code,
                    'name' => $r->name,
                ])->values(),
                'employee' => $user->employee ? [
                    'id' => $user->employee->id,
                    'staff_number' => $user->employee->staff_number,
                    'full_name' => trim($user->employee->first_name . ' ' . $user->employee->surname),
                ] : null,
                'created_at' => optional($user->created_at)->toDateTimeString(),
                'updated_at' => optional($user->updated_at)->toDateTimeString(),
            ],
            'meta' => [
                'supportsUsername' => Schema::hasColumn('users', 'username'),
                'supportsRoleColumn' => Schema::hasColumn('users', 'role'),
                'supportsEmailVerification' => Schema::hasColumn('users', 'email_verified_at'),
            ],
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles:id');

        $roles = Role::query()->select(['id','code','name'])->orderBy('name')->get();

        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => Schema::hasColumn('users', 'username') ? $user->username : null,
                'role' => Schema::hasColumn('users', 'role') ? $user->role : null,
                'email_verified_at' => Schema::hasColumn('users', 'email_verified_at')
                    ? optional($user->email_verified_at)->toDateTimeString()
                    : null,
                'role_ids' => $user->roles->pluck('id')->values(),
            ],
            'roles' => $roles,
            'meta' => [
                'supportsUsername' => Schema::hasColumn('users', 'username'),
                'supportsRoleColumn' => Schema::hasColumn('users', 'role'),
                'supportsEmailVerification' => Schema::hasColumn('users', 'email_verified_at'),
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $supportsUsername = Schema::hasColumn('users', 'username');
        $supportsRoleColumn = Schema::hasColumn('users', 'role');
        $supportsEmailVerification = Schema::hasColumn('users', 'email_verified_at');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'send_password_email' => ['nullable', 'boolean'],

            'role_ids' => ['array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ];

        if ($supportsUsername) {
            $rules['username'] = ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)];
        }

        if ($supportsRoleColumn) {
            $rules['role'] = ['nullable', 'string', 'max:50'];
        }

        if ($supportsEmailVerification) {
            $rules['mark_email_verified'] = ['nullable', 'boolean'];
            $rules['unverify_email'] = ['nullable', 'boolean'];
        }

        $data = $request->validate($rules);

        $plainPassword = !empty($data['password']) ? $data['password'] : null;
        $sendPasswordEmail = (bool)($data['send_password_email'] ?? false);

        DB::transaction(function () use ($user, $data, $supportsUsername, $supportsRoleColumn, $supportsEmailVerification, $plainPassword, $sendPasswordEmail) {
            $user->name = $data['name'];
            $user->email = $data['email'];

            if ($supportsUsername) {
                $user->username = $data['username'] ?? null;
            }

            if ($supportsRoleColumn) {
                $user->role = $data['role'] ?? $user->role;
            }

            if ($plainPassword) {
                $user->password = Hash::make($plainPassword);
            }

            if ($supportsEmailVerification) {
                if (!empty($data['unverify_email'])) {
                    $user->email_verified_at = null;
                } elseif (!empty($data['mark_email_verified'])) {
                    $user->email_verified_at = $user->email_verified_at ?? now();
                }
            }

            $user->save();

            if (Schema::hasTable('role_user')) {
                $roleIds = $data['role_ids'] ?? [];
                $user->roles()->sync($roleIds);
            }

            // Send only when password was actually changed
            if ($plainPassword && $sendPasswordEmail && !empty($user->email)) {
                DB::afterCommit(function () use ($user, $plainPassword) {
                    Mail::to($user->email)->send(new UserCredentialsMail($user, $plainPassword, 'reset'));
                });
            }
        });

        return redirect()->to("/users/{$user->id}")->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->employee()->exists()) {
            return back()->withErrors([
                'delete' => 'Cannot delete this user because it is linked to an employee record.',
            ]);
        }

        DB::transaction(function () use ($user) {
            if (Schema::hasTable('role_user')) {
                $user->roles()->detach();
            }
            $user->delete();
        });

        return redirect()->to('/users')->with('success', 'User deleted successfully.');
    }
}