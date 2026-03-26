<?php

namespace App\Http\Controllers\Concerns;

use App\Support\Access\RolePageScopeResolver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

trait ResolvesRolePageScope
{
    protected function rolePageScopeResolver(): RolePageScopeResolver
    {
        return app(RolePageScopeResolver::class);
    }

    protected function requestedScopeView(Request $request): ?string
    {
        return $this->rolePageScopeResolver()->scopeViewFromRequest($request->string('scope_view')->toString());
    }

    protected function applyRolePageScope(Builder $query, Request $request, string $module): array
    {
        return $this->rolePageScopeResolver()->applyScope(
            $query,
            $request->user(),
            $module,
            $this->requestedScopeView($request),
        );
    }

    protected function rolePageScopeContext(Request $request, string $module): array
    {
        return $this->rolePageScopeResolver()->context(
            $request->user(),
            $module,
            $this->requestedScopeView($request),
        );
    }

    protected function roleScopedFilters(array $filters, array $scope): array
    {
        $filters['scope_view'] = match ($scope['current_view'] ?? null) {
            'self' => 'mine',
            'team' => 'team',
            default => '',
        };

        return $filters;
    }

    protected function authorizeRoleScopedRecord(Request $request, string $module, Model $record): void
    {
        $this->rolePageScopeResolver()->authorizeRecord($request->user(), $module, $record);
    }

    protected function ensureRoleScopedEmployeeIdAllowed(
        Request $request,
        string $module,
        int|string|null $employeeId,
        bool $selfOnlyForManagers = false,
    ): void {
        $this->rolePageScopeResolver()->ensureEmployeeIdAllowed(
            $request->user(),
            $module,
            $employeeId,
            $this->requestedScopeView($request),
            $selfOnlyForManagers,
        );
    }

    protected function roleScopedEmployees(Request $request, string $module): Collection
    {
        return $this->rolePageScopeResolver()->accessibleEmployees(
            $request->user(),
            $module,
            $this->requestedScopeView($request),
        );
    }
}
