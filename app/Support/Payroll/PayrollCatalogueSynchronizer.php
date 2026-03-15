<?php

namespace App\Support\Payroll;

use App\Models\PayCode;
use App\Support\Tenancy\TenantContext;
use Illuminate\Support\Collection;

class PayrollCatalogueSynchronizer
{
    public function sync(?int $organizationId = null): Collection
    {
        $organizationId ??= app(TenantContext::class)->id();

        if (! $organizationId) {
            return collect();
        }

        $definitions = collect(config('payroll.default_pay_codes', []))
            ->keyBy('code');

        if ($definitions->isEmpty()) {
            return collect();
        }

        $existing = PayCode::query()
            ->withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->whereIn('code', $definitions->keys()->all())
            ->get()
            ->keyBy('code');

        foreach ($definitions as $code => $definition) {
            $payCode = $existing->get($code);

            if (! $payCode) {
                $payCode = PayCode::query()->withoutGlobalScopes()->create([
                    'organization_id' => $organizationId,
                    ...$definition,
                ]);

                $existing->put($code, $payCode);

                continue;
            }

            $payCode->fill($definition);

            if ($payCode->isDirty()) {
                $payCode->save();
            }
        }

        return PayCode::query()
            ->forOrganization($organizationId)
            ->orderBy('sort_order')
            ->orderBy('code')
            ->get();
    }
}
