<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class PayrollPayCodeSeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('organizations') || ! Schema::hasTable('pay_codes')) {
            return;
        }

        $synchronizer = app(PayrollCatalogueSynchronizer::class);

        Organization::query()->pluck('id')->each(
            fn ($organizationId) => $synchronizer->sync((int) $organizationId)
        );
    }
}
