<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString(),
        ];

        $query = Role::query()
            ->withCount('users')
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('code', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
            });
        }

        $roles = $query
            ->paginate(15)
            ->withQueryString()
            ->through(function (Role $r) {
                return [
                    'id' => $r->id,
                    'code' => $r->code,
                    'name' => $r->name,
                    'description' => $r->description,
                    'users_count' => $r->users_count ?? 0,
                    'created_at' => optional($r->created_at)->toDateTimeString(),
                    'updated_at' => optional($r->updated_at)->toDateTimeString(),
                ];
            });

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create');
    }

    public function store(Request $request)
    {
        $data = $this->validateRole($request);

        $role = Role::create($data);

        return redirect()
            ->route('roles.show', $role->id)
            ->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        $role->load(['users:id,name,email']);

        return Inertia::render('Roles/Show', [
            'role' => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => $role->users->count(),
                'users' => $role->users->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                ])->values(),
                'created_at' => optional($role->created_at)->toDateTimeString(),
                'updated_at' => optional($role->updated_at)->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Role $role)
    {
        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
            ],
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $data = $this->validateRole($request, $role->id);

        $role->update($data);

        return redirect()
            ->route('roles.show', $role->id)
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if ($role->users()->exists()) {
            return back()->withErrors([
                'delete' => 'Cannot delete this role because it is assigned to users.',
            ]);
        }

        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    private function validateRole(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'code' => [
                'required',
                'string',
                'max:64',
                'unique:roles,code' . ($ignoreId ? ',' . $ignoreId : ''),
            ],
            'name' => ['required', 'string', 'max:128'],
            'description' => ['nullable', 'string'],
        ]);
    }
}