<?php

namespace App\Http\Middleware;

use App\Models\Role;
use App\Models\User;
use App\Support\Rbac\PermissionRegistry;
use App\Support\Settings\SystemSettingsService;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
        $tenantContext = app(TenantContext::class);
        $activeOrganization = $tenantContext->organization();
        $availableOrganizations = collect();
        $organizationRoleCodes = collect();

        $roles = [];
        $permissions = [];
        $can = [];
        $userPayload = null;

        if ($user instanceof User) {
            $user->loadMissing([
                'roles:id,code,name,description',
                'permissions:id,name,module,label,description',
                'roles.permissions:id,name,module,label,description',
                'currentOrganization:id,name,slug,code,status,timezone',
            ]);

            $effectiveRoles = $user->effectiveRoles($activeOrganization?->id);

            $roles = $effectiveRoles
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'code' => $role->code,
                    'name' => $role->name,
                    'description' => $role->description,
                ])
                ->values()
                ->all();

            $permissions = $user->permissionNames($activeOrganization?->id)->values()->all();
            $can = collect(PermissionRegistry::names())
                ->mapWithKeys(fn (string $permission) => [$permission => $user->canAccess($permission)])
                ->all();

            $availableOrganizations = $tenantContext->availableOrganizationsFor($user);
            $organizationRoleCodes = $availableOrganizations->isNotEmpty()
                ? DB::table('organization_user_roles')
                    ->join('roles', 'roles.id', '=', 'organization_user_roles.role_id')
                    ->where('organization_user_roles.user_id', $user->id)
                    ->whereIn('organization_user_roles.organization_id', $availableOrganizations->pluck('id'))
                    ->select(['organization_user_roles.organization_id', 'roles.code'])
                    ->get()
                    ->groupBy('organization_id')
                    ->map(fn ($rows) => $rows->pluck('code')->values()->all())
                : collect();

            $userPayload = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => optional($user->email_verified_at)->toDateTimeString(),
                'created_at' => optional($user->created_at)->toDateTimeString(),
                'updated_at' => optional($user->updated_at)->toDateTimeString(),
                'two_factor_enabled' => !blank($user->two_factor_secret),
                'is_super_admin' => $user->isSuperAdmin(),
                'roles' => $roles,
                'permissions' => $permissions,
            ];
        }

        $settings = app(SystemSettingsService::class);
        $systemOrgId = $settings->systemOrganizationId();
        $systemName = $settings->getString('general', 'system_name', config('app.name'), $systemOrgId) ?? config('app.name');
        $systemShortName = $settings->getString('general', 'system_short_name', null, $systemOrgId);
        $systemLogoPath = $settings->getString('branding', 'system_logo_path', null, $systemOrgId);
        $systemLogoUrl = $systemLogoPath ? Storage::disk('public')->url($systemLogoPath) : null;

        $orgId = $activeOrganization?->id;
        $branding = $orgId ? [
            'primary_color' => $settings->getString('branding', 'primary_color', null, $orgId),
            'secondary_color' => $settings->getString('branding', 'secondary_color', null, $orgId),
            'accent_color' => $settings->getString('branding', 'accent_color', null, $orgId),
        ] : [
            'primary_color' => null,
            'secondary_color' => null,
            'accent_color' => null,
        ];

        return [
            ...parent::share($request),
            'name' => $systemName,
            'auth' => [
                'user' => $userPayload,
                'roles' => $roles,
                'permissions' => $permissions,
                'can' => $can,
            ],
            'system_settings' => [
                'system' => [
                    'system_name' => $systemName,
                    'system_short_name' => $systemShortName,
                    'system_logo_url' => $systemLogoUrl,
                    'system_logo_path' => $systemLogoPath,
                ],
                'branding' => $branding,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'tenant' => [
                'active_organization' => $activeOrganization ? [
                    'id' => $activeOrganization->id,
                    'name' => $activeOrganization->name,
                    'slug' => $activeOrganization->slug,
                    'code' => $activeOrganization->code,
                    'status' => $activeOrganization->status,
                    'timezone' => $activeOrganization->timezone,
                ] : null,
                'organizations' => $availableOrganizations
                    ->map(function ($organization) use ($activeOrganization, $organizationRoleCodes) {
                        return [
                            'id' => $organization->id,
                            'name' => $organization->name,
                            'slug' => $organization->slug,
                            'code' => $organization->code,
                            'status' => $organization->status,
                            'timezone' => $organization->timezone,
                            'is_active' => $activeOrganization?->id === $organization->id,
                            'role_codes' => $organizationRoleCodes->get($organization->id, []),
                        ];
                    })
                    ->values()
                    ->all(),
                'can_switch' => $availableOrganizations->count() > 1,
                'is_super_admin' => $user instanceof User ? $user->isSuperAdmin() : false,
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
