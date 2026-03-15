<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

abstract class Controller
{
    protected function tenantId(): ?int
    {
        return app(TenantContext::class)->id();
    }

    protected function currentOrganization(): ?Organization
    {
        return app(TenantContext::class)->organization();
    }

    protected function applyTenantConstraint(QueryBuilder $query, ?string $qualifiedColumn): QueryBuilder
    {
        $tenantId = $this->tenantId();

        if ($tenantId && $qualifiedColumn) {
            return $query->where($qualifiedColumn, $tenantId);
        }

        if (! $tenantId && app(TenantContext::class)->shouldRestrictToNoResults()) {
            return $query->whereRaw('1 = 0');
        }

        return $query;
    }

    protected function visibleUsersQuery(): EloquentBuilder
    {
        $query = User::query();
        $tenantId = $this->tenantId();

        if ($tenantId) {
            $query->whereHas('organizations', function ($membershipQuery) use ($tenantId): void {
                $membershipQuery
                    ->where('organizations.id', $tenantId)
                    ->where('organization_user.is_active', true);
            });
        } elseif (app(TenantContext::class)->shouldRestrictToNoResults()) {
            $query->whereRaw('1 = 0');
        }

        return $query;
    }

    protected function effectiveRoleAssignmentsQuery(?int $organizationId = null): QueryBuilder
    {
        $organizationId ??= $this->tenantId();

        if ($organizationId) {
            return DB::query()->fromSub(
                DB::table('role_users')
                    ->select(['role_id', 'user_id'])
                    ->whereIn('user_id', function ($query) use ($organizationId): void {
                        $query->select('user_id')
                            ->from('organization_user')
                            ->where('organization_id', $organizationId)
                            ->where('is_active', true);
                    })
                    ->union(
                        DB::table('organization_user_roles')
                            ->select(['role_id', 'user_id'])
                            ->where('organization_id', $organizationId)
                    ),
                'role_assignments'
            );
        }

        $query = DB::table('role_users')->select(['role_id', 'user_id']);

        if (app(TenantContext::class)->shouldRestrictToNoResults()) {
            $query->whereRaw('1 = 0');
        }

        return DB::query()->fromSub($query, 'role_assignments');
    }

    protected function effectiveRoleAssignmentCounts(?int $organizationId = null): Collection
    {
        return $this->effectiveRoleAssignmentsQuery($organizationId)
            ->select('role_id', DB::raw('count(distinct user_id) as total'))
            ->groupBy('role_id')
            ->pluck('total', 'role_id');
    }

    protected function effectiveUsersWithRolesCount(?int $organizationId = null): int
    {
        return (int) $this->effectiveRoleAssignmentsQuery($organizationId)
            ->distinct()
            ->count('user_id');
    }

    protected function effectiveRoleUserIds(int $roleId, ?int $organizationId = null): array
    {
        return $this->effectiveRoleAssignmentsQuery($organizationId)
            ->where('role_id', $roleId)
            ->distinct()
            ->pluck('user_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    protected function tenantUniqueRule(string $table, string $column, mixed $ignore = null): Unique
    {
        $rule = Rule::unique($table, $column);

        if ($ignore !== null) {
            $rule->ignore($ignore);
        }

        $tenantId = $this->tenantId();

        if ($tenantId) {
            $rule->where(fn ($query) => $query->where('organization_id', $tenantId));
        }

        return $rule;
    }

    protected function ensureUserBelongsToCurrentOrganization(User $user): void
    {
        $actor = request()->user();

        if (! $actor instanceof User) {
            abort(403);
        }

        if (! $actor->isSuperAdmin() && ! $user->canAccessOrganization($this->tenantId())) {
            abort(404);
        }
    }

    protected function ensureCanAccessOrganization(Organization $organization): void
    {
        $actor = request()->user();

        if (! $actor instanceof User || ! $actor->canAccessOrganization($organization)) {
            abort(404);
        }
    }
}
