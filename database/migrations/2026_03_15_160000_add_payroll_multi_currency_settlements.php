<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_period_exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->string('from_currency', 8);
            $table->string('to_currency', 8);
            $table->decimal('rate', 18, 8);
            $table->timestamp('effective_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(
                ['organization_id', 'payroll_period_id', 'from_currency', 'to_currency'],
                'payroll_period_exchange_rates_org_period_pair_unique'
            );
            $table->index(['organization_id', 'payroll_period_id'], 'payroll_period_exchange_rates_org_period_idx');
        });

        Schema::create('employee_payroll_settlement_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('employee_payroll_profile_id');
            $table->foreign('employee_payroll_profile_id', 'epsr_profile_fk')
                ->references('id')
                ->on('employee_payroll_profiles')
                ->cascadeOnDelete();
            $table->string('currency', 8);
            $table->string('allocation_method', 32);
            $table->decimal('amount', 14, 2)->nullable();
            $table->decimal('percentage', 8, 4)->nullable();
            $table->unsignedSmallInteger('priority')->default(0);
            $table->boolean('active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(
                ['organization_id', 'employee_payroll_profile_id', 'active'],
                'employee_payroll_settlement_rules_org_profile_active_idx'
            );
        });

        Schema::create('payroll_result_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_run_id')->constrained('payroll_runs')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->foreignId('payroll_result_id')->constrained('payroll_results')->cascadeOnDelete();
            $table->foreignId('employee_payroll_settlement_rule_id')->nullable();
            $table->foreign('employee_payroll_settlement_rule_id', 'prs_settlement_rule_fk')
                ->references('id')
                ->on('employee_payroll_settlement_rules')
                ->nullOnDelete();
            $table->string('base_currency', 8);
            $table->string('currency', 8);
            $table->string('allocation_method', 32);
            $table->decimal('base_amount', 14, 2)->default(0);
            $table->decimal('settlement_amount', 14, 2)->default(0);
            $table->decimal('exchange_rate', 18, 8)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'payroll_result_id'], 'payroll_result_settlements_org_result_idx');
            $table->index(['organization_id', 'payroll_run_id', 'currency'], 'payroll_result_settlements_org_run_currency_idx');
            $table->index(['organization_id', 'payroll_period_id', 'currency'], 'payroll_result_settlements_org_period_currency_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_result_settlements');
        Schema::dropIfExists('employee_payroll_settlement_rules');
        Schema::dropIfExists('payroll_period_exchange_rates');
    }
};
