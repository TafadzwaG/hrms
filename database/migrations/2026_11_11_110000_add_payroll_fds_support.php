<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pay_codes', function (Blueprint $table) {
            // REGULAR earnings are annualised under FDS. IRREGULAR and BONUS are added at their
            // actual amount; BONUS also qualifies for the annual tax-free bonus amount.
            $table->string('income_type', 16)->default('REGULAR')->after('is_pre_tax');
            // MEDICAL marks a medical aid contribution, which earns a tax credit under FDS.
            $table->string('tax_credit', 16)->nullable()->after('income_type');
        });

        Schema::table('employee_payroll_profiles', function (Blueprint $table) {
            $table->string('tax_method', 24)->default('NON_FDS')->after('tax_table');
            $table->boolean('tax_credit_elderly')->default(false)->after('tax_method');
            $table->boolean('tax_credit_blind')->default(false)->after('tax_credit_elderly');
            $table->boolean('tax_credit_disabled')->default(false)->after('tax_credit_blind');
        });

        Schema::create('payroll_tax_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->cascadeOnDelete();
            $table->string('currency', 8);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            // All amounts are per tax year. Null means "not entered yet": nothing is applied.
            $table->decimal('bonus_tax_free_amount', 14, 2)->nullable();
            $table->decimal('elderly_credit_annual', 14, 2)->nullable();
            $table->decimal('blind_credit_annual', 14, 2)->nullable();
            $table->decimal('disabled_credit_annual', 14, 2)->nullable();
            $table->decimal('medical_credit_percent', 6, 3)->default(50);
            $table->string('source', 255)->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['currency', 'effective_from'], 'payroll_tax_settings_lookup_index');
        });

        Schema::create('payroll_tax_ledger', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            // Null for an opening balance brought in from a previous payroll system.
            $table->foreignId('payroll_period_id')->nullable()->constrained('payroll_periods')->cascadeOnDelete();
            $table->foreignId('payroll_run_id')->nullable()->constrained('payroll_runs')->nullOnDelete();
            $table->unsignedSmallInteger('tax_year');
            $table->date('period_end');
            $table->string('currency', 8);
            $table->unsignedSmallInteger('periods_covered')->default(1);
            $table->boolean('is_opening_balance')->default(false);
            $table->string('tax_method', 24)->default('NON_FDS');
            $table->decimal('regular_taxable', 14, 2)->default(0);
            $table->decimal('irregular_taxable', 14, 2)->default(0);
            $table->decimal('bonus_gross', 14, 2)->default(0);
            $table->decimal('bonus_exempt', 14, 2)->default(0);
            $table->decimal('medical_contributions', 14, 2)->default(0);
            $table->decimal('credits_applied', 14, 2)->default(0);
            $table->decimal('paye', 14, 2)->default(0);
            $table->decimal('aids_levy', 14, 2)->default(0);
            // What each method would have charged, kept for the parallel-run comparison.
            $table->decimal('standalone_paye', 14, 2)->default(0);
            $table->decimal('standalone_aids_levy', 14, 2)->default(0);
            $table->decimal('fds_average_paye', 14, 2)->nullable();
            $table->decimal('fds_average_aids_levy', 14, 2)->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'employee_id', 'payroll_period_id'], 'payroll_tax_ledger_employee_period_unique');
            $table->index(['organization_id', 'tax_year', 'employee_id'], 'payroll_tax_ledger_ytd_index');
        });

        DB::table('pay_codes')->where('code', 'BONUS')->update(['income_type' => 'BONUS']);

        DB::table('payroll_tax_settings')->insert([
            'organization_id' => null,
            'currency' => 'USD',
            'effective_from' => '2024-01-01',
            'medical_credit_percent' => 50,
            'source' => 'Amounts not entered. A payroll specialist must enter and verify them from ZIMRA.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // FDS works on the annual table. Unverified, like the tables seeded with it.
        $tableId = DB::table('payroll_tax_tables')->insertGetId([
            'organization_id' => null,
            'name' => 'ZIMRA PAYE USD Annual',
            'currency' => 'USD',
            'pay_frequency' => 'ANNUAL',
            'effective_from' => '2024-01-01',
            'aids_levy_percent' => 3,
            'source' => 'ZIMRA USD PAYE tables. Unverified: confirm against the current tax year at zimra.co.zw/domestic-taxes/tax-tables',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $lower = 0.00;

        foreach ([[1200.00, 0], [3600.00, 20], [12000.00, 25], [24000.00, 30], [36000.00, 35], [null, 40]] as $index => [$upper, $rate]) {
            DB::table('payroll_tax_bands')->insert([
                'payroll_tax_table_id' => $tableId,
                'lower_bound' => $lower,
                'upper_bound' => $upper,
                'rate_percent' => $rate,
                'sort_order' => $index + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $lower = (float) $upper;
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_tax_ledger');
        Schema::dropIfExists('payroll_tax_settings');

        DB::table('payroll_tax_tables')->where('pay_frequency', 'ANNUAL')->delete();

        Schema::table('employee_payroll_profiles', function (Blueprint $table) {
            $table->dropColumn(['tax_method', 'tax_credit_elderly', 'tax_credit_blind', 'tax_credit_disabled']);
        });

        Schema::table('pay_codes', function (Blueprint $table) {
            $table->dropColumn(['income_type', 'tax_credit']);
        });
    }
};
