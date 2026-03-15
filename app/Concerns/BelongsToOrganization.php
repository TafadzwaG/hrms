<?php

namespace App\Concerns;

use App\Models\Organization;
use App\Models\Scopes\OrganizationScope;
use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToOrganization
{
    public static function bootBelongsToOrganization(): void
    {
        static::addGlobalScope(new OrganizationScope);

        static::creating(function (Model $model): void {
            if (! blank($model->getAttribute('organization_id'))) {
                return;
            }

            $organizationId = app(TenantContext::class)->id();

            if ($organizationId) {
                $model->setAttribute('organization_id', $organizationId);
            }
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function scopeForOrganization(Builder $query, int|Organization|null $organization = null): Builder
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;
        $organizationId ??= app(TenantContext::class)->id();

        if (! $organizationId) {
            return $query;
        }

        /** @var Model $model */
        $model = $query->getModel();

        return $query
            ->withoutGlobalScope(OrganizationScope::class)
            ->where($model->qualifyColumn('organization_id'), $organizationId);
    }
}
