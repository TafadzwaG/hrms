<?php

namespace App\Http\Middleware;

use App\Models\Role;
use App\Models\User;
use App\Support\Rbac\PermissionRegistry;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        $roles = [];
        $permissions = [];
        $can = [];
        $userPayload = null;

        if ($user instanceof User) {
            $user->loadMissing([
                'roles:id,code,name,description',
                'permissions:id,name,module,label,description',
                'roles.permissions:id,name,module,label,description',
            ]);

            $roles = $user->roles
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'code' => $role->code,
                    'name' => $role->name,
                    'description' => $role->description,
                ])
                ->values()
                ->all();

            $permissions = $user->permissionNames()->values()->all();
            $can = collect(PermissionRegistry::names())
                ->mapWithKeys(fn (string $permission) => [$permission => $user->canAccess($permission)])
                ->all();

            $userPayload = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => optional($user->email_verified_at)->toDateTimeString(),
                'created_at' => optional($user->created_at)->toDateTimeString(),
                'updated_at' => optional($user->updated_at)->toDateTimeString(),
                'two_factor_enabled' => !blank($user->two_factor_secret),
                'roles' => $roles,
                'permissions' => $permissions,
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $userPayload,
                'roles' => $roles,
                'permissions' => $permissions,
                'can' => $can,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
