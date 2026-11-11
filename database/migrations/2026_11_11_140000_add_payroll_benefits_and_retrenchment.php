<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Retrenchment exemption (Finance Act 13 of 2023): the greater of a share of the
        // package or a minimum amount, capped. Null = not entered, so nothing is exempt.
        Schema::table('payroll_tax_settings', function (Blueprint $table) {
            $table->decimal('retrenchment_exempt_percent', 7, 4)->nullable()->after('medical_credit_percent');
            $table->decimal('retrenchment_exempt_minimum', 14, 2)->nullable()->after('retrenchment_exempt_percent');
            $table->decimal('retrenchment_exempt_cap', 14, 2)->nullable()->after('retrenchment_exempt_minimum');
        });

        Schema::table('payroll_tax_ledger', function (Blueprint $table) {
            $table->decimal('retrenchment_gross', 14, 2)->default(0)->after('bonus_exempt');
            $table->decimal('retrenchment_exempt', 14, 2)->default(0)->after('retrenchment_gross');
        });

        // How a benefit reaches payroll. NONE keeps it out of payroll (the old behaviour).
        Schema::table('benefits', function (Blueprint $table) {
            $table->string('payroll_type', 16)->default('NONE')->after('payroll_deductible');
        });

        // Monthly premium per covered person. When set, an enrolment's premium is worked
        // out from the member and their dependants instead of fixed amounts.
        Schema::table('benefit_plans', function (Blueprint $table) {
            $table->decimal('rate_member', 14, 2)->nullable()->after('employee_contribution_value');
            $table->decimal('rate_spouse', 14, 2)->nullable()->after('rate_member');
            $table->decimal('rate_child', 14, 2)->nullable()->after('rate_spouse');
            $table->decimal('rate_other_dependant', 14, 2)->nullable()->after('rate_child');
        });

        // A child over 18 counts as immediate family for medical aid while a full-time student.
        Schema::table('employee_benefit_dependants', function (Blueprint $table) {
            $table->boolean('is_student')->default(false)->after('date_of_birth');
        });

        // USD retrenchment values as described in Belina's guide. Unverified, like the
        // other seeded figures, until a payroll specialist checks them.
        DB::table('payroll_tax_settings')
            ->whereNull('organization_id')
            ->where('currency', 'USD')
            ->update([
                'retrenchment_exempt_percent' => 33.3333,
                'retrenchment_exempt_minimum' => 3200,
                'retrenchment_exempt_cap' => 5033.33,
            ]);

        // CILL now means cash in lieu of leave. Where it was set up as the cellphone
        // allowance, keep that pay code (and every input and recurring item using it)
        // under the new code CELL, so the catalogue sync can create the real CILL.
        $organizations = DB::table('pay_codes')
            ->where('code', 'CILL')
            ->where('description', 'Cellphone allowance')
            ->pluck('organization_id');

        foreach ($organizations as $organizationId) {
            $hasCell = DB::table('pay_codes')->where('organization_id', $organizationId)->where('code', 'CELL')->exists();

            if (! $hasCell) {
                DB::table('pay_codes')
                    ->where('organization_id', $organizationId)
                    ->where('code', 'CILL')
                    ->update(['code' => 'CELL', 'updated_at' => now()]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('employee_benefit_dependants', fn (Blueprint $table) => $table->dropColumn('is_student'));
        Schema::table('benefit_plans', fn (Blueprint $table) => $table->dropColumn(['rate_member', 'rate_spouse', 'rate_child', 'rate_other_dependant']));
        Schema::table('benefits', fn (Blueprint $table) => $table->dropColumn('payroll_type'));
        Schema::table('payroll_tax_ledger', fn (Blueprint $table) => $table->dropColumn(['retrenchment_gross', 'retrenchment_exempt']));
        Schema::table('payroll_tax_settings', fn (Blueprint $table) => $table->dropColumn(['retrenchment_exempt_percent', 'retrenchment_exempt_minimum', 'retrenchment_exempt_cap']));
    }
};
