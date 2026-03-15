<?php

namespace App\Models\Scopes;

use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class OrganizationScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $context = app(TenantContext::class);

        if ($context->isDisabled()) {
            return;
        }

        if ($context->id()) {
            $builder->where($model->qualifyColumn('organization_id'), $context->id());

            return;
        }

        if ($context->shouldRestrictToNoResults()) {
            $builder->whereRaw('1 = 0');
        }
    }
}
