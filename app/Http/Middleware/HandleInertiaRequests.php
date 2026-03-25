<?php

namespace App\Http\Middleware;

use App\Models\Role;
use App\Models\User;
use App\Support\Auth\PortalAccessResolver;
use App\Support\Auth\UserImpersonationService;
use App\Support\Rbac\PermissionRegistry;
use App\Support\Settings\SystemSettingsService;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        $impersonationPayload = null;

        if ($user instanceof User) {
            $portalResolver = app(PortalAccessResolver::class);
            $portalResolver->ensureDerivedPortalAccesses($user);

            $user->loadMissing([
                'roles:id,code,name,description',
                'permissions:id,name,module,label,description',
                'roles.permissions:id,name,module,label,description',
                'currentOrganization:id,name,slug,code,status,timezone',
                'portalAccesses:id,user_id,portal',
            ]);

            $orgId = $activeOrganization?->id;
            $effectiveRoles = $user->effectiveRoles($orgId);

            $roles = $effectiveRoles
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'code' => $role->code,
                    'name' => $role->name,
                    'description' => $role->description,
                ])
                ->values()
                ->all();

            // Compute permission names once and reuse for the `can` map.
            $permissionNamesList = $user->permissionNames($orgId);
            $permissions = $permissionNamesList->values()->all();

            // Build the `can` map by matching each registry permission against
            // the already-computed permission names — avoids re-querying the DB
            // for every single permission in the registry.
            $can = collect(PermissionRegistry::names())
                ->mapWithKeys(function (string $ability) use ($permissionNamesList) {
                    $granted = $permissionNamesList->contains(function (string $owned) use ($ability) {
                        return Str::is($owned, $ability) || Str::is($ability, $owned);
                    });

                    return [$ability => $granted];
                })
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

            $availablePortals = $portalResolver->availablePortals($user)->all();
            $activePortal = $portalResolver->activePortalForRequest($request, $user);
            $impersonationPayload = app(UserImpersonationService::class)->payload($request);

            $userPayload = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => optional($user->email_verified_at)->toDateTimeString(),
                'created_at' => optional($user->created_at)->toDateTimeString(),
                'updated_at' => optional($user->updated_at)->toDateTimeString(),
                'two_factor_enabled' => !blank($user->two_factor_secret),
                'is_super_admin' => $user->isSuperAdmin(),
                'primary_portal' => $portalResolver->primaryPortal($user),
                'active_portal' => $activePortal,
                'available_portals' => $availablePortals,
                'portal_switch_urls' => collect($availablePortals)
                    ->mapWithKeys(fn (string $portal) => [$portal => route('portal.switch', $portal)])
                    ->all(),
                'is_impersonated' => (bool) $impersonationPayload,
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

        $brandingOrgId = $activeOrganization?->id;
        $branding = $brandingOrgId ? [
            'primary_color' => $settings->getString('branding', 'primary_color', null, $brandingOrgId),
            'secondary_color' => $settings->getString('branding', 'secondary_color', null, $brandingOrgId),
            'accent_color' => $settings->getString('branding', 'accent_color', null, $brandingOrgId),
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
                'impersonation' => $impersonationPayload,
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
