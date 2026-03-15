<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('code', 64);
            $table->string('name', 150);
            $table->string('frequency', 32)->default('MONTHLY');
            $table->date('period_start');
            $table->date('period_end');
            $table->date('pay_date');
            $table->string('currency', 8)->default(config('payroll.default_currency', 'USD'));
            $table->string('status', 32)->default('DRAFT');
            $table->text('notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('closed_at')->nullable();
            $table->foreignId('closed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['organization_id', 'code'], 'payroll_periods_org_code_unique');
            $table->unique(['organization_id', 'period_start', 'period_end', 'frequency'], 'payroll_periods_org_window_unique');
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'pay_date']);
        });

        Schema::create('pay_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('code', 64);
            $table->string('description', 150);
            $table->string('category', 32)->default('EARNING');
            $table->string('type', 32)->default('EARNING');
            $table->boolean('taxable')->default(true);
            $table->boolean('recurring')->default(false);
            $table->boolean('affects_gross')->default(true);
            $table->boolean('affects_net')->default(true);
            $table->boolean('is_pre_tax')->default(false);
            $table->boolean('active')->default(true);
            $table->boolean('system_generated')->default(false);
            $table->string('gl_account_code', 64)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('rules')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'code'], 'pay_codes_org_code_unique');
            $table->index(['organization_id', 'type', 'active']);
            $table->index(['organization_id', 'category']);
        });

        Schema::create('employee_payroll_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->string('pay_frequency', 32)->default('MONTHLY');
            $table->string('currency', 8)->default(config('payroll.default_currency', 'USD'));
            $table->decimal('basic_salary', 14, 2)->default(0);
            $table->decimal('hourly_rate', 12, 2)->nullable();
            $table->decimal('overtime_multiplier', 8, 2)->default(1.5);
            $table->string('bank_name', 150)->nullable();
            $table->string('bank_branch', 150)->nullable();
            $table->string('bank_account_name', 150)->nullable();
            $table->string('bank_account_number', 100)->nullable();
            $table->string('bank_account_type', 60)->nullable();
            $table->string('tax_number', 100)->nullable();
            $table->string('tax_table', 60)->nullable();
            $table->string('pension_number', 100)->nullable();
            $table->decimal('pension_percent', 8, 4)->default(0);
            $table->string('nssa_number', 100)->nullable();
            $table->decimal('nssa_percent', 8, 4)->default(0);
            $table->string('nec_number', 100)->nullable();
            $table->decimal('nec_percent', 8, 4)->default(0);
            $table->string('union_number', 100)->nullable();
            $table->decimal('union_percent', 8, 4)->default(0);
            $table->string('cost_centre', 100)->nullable();
            $table->string('employment_status', 32)->default('ACTIVE');
            $table->boolean('tax_enabled')->default(true);
            $table->boolean('active')->default(true);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'employee_id', 'effective_from'], 'epp_org_emp_effective_unq');
            $table->index(['organization_id', 'employee_id', 'active'], 'epp_org_emp_active_idx');
            $table->index(['organization_id', 'employment_status'], 'epp_org_employment_status_idx');
        });

        Schema::create('employee_recurring_pay_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('employee_payroll_profile_id')->nullable()->constrained('employee_payroll_profiles')->nullOnDelete();
            $table->foreignId('pay_code_id')->constrained('pay_codes')->cascadeOnDelete();
            $table->string('input_mode', 32)->default('FIXED');
            $table->decimal('amount', 14, 2)->nullable();
            $table->decimal('quantity', 12, 4)->nullable();
            $table->decimal('rate', 12, 4)->nullable();
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('reference', 150)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'employee_id', 'is_active'], 'employee_recurring_pay_items_org_employee_active_idx');
            $table->index(['organization_id', 'pay_code_id']);
        });

        Schema::create('payroll_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('pay_code_id')->constrained('pay_codes')->cascadeOnDelete();
            $table->string('input_mode', 32)->default('FIXED');
            $table->decimal('amount', 14, 2)->nullable();
            $table->decimal('quantity', 12, 4)->nullable();
            $table->decimal('rate', 12, 4)->nullable();
            $table->string('source', 32)->default('MANUAL');
            $table->string('reference', 150)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['organization_id', 'payroll_period_id', 'employee_id'], 'payroll_inputs_org_period_employee_idx');
            $table->index(['organization_id', 'source']);
        });

        Schema::create('payroll_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->unsignedInteger('run_number')->default(1);
            $table->string('status', 32)->default('PROCESSED');
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('closed_at')->nullable();
            $table->foreignId('closed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('employee_count')->default(0);
            $table->decimal('gross_total', 14, 2)->default(0);
            $table->decimal('taxable_total', 14, 2)->default(0);
            $table->decimal('deduction_total', 14, 2)->default(0);
            $table->decimal('net_total', 14, 2)->default(0);
            $table->string('calculation_version', 32)->default('1.0');
            $table->json('summary_json')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'payroll_period_id', 'run_number'], 'payroll_runs_org_period_run_unique');
            $table->index(['organization_id', 'status']);
        });

        Schema::create('payroll_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_run_id')->constrained('payroll_runs')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('employee_payroll_profile_id')->nullable()->constrained('employee_payroll_profiles')->nullOnDelete();
            $table->string('staff_number_snapshot', 100);
            $table->string('employee_name_snapshot', 160);
            $table->string('department_snapshot', 160)->nullable();
            $table->string('position_snapshot', 160)->nullable();
            $table->string('pay_point_snapshot', 100)->nullable();
            $table->string('currency_snapshot', 8);
            $table->string('bank_account_name_snapshot', 150)->nullable();
            $table->string('bank_account_number_snapshot', 100)->nullable();
            $table->string('bank_name_snapshot', 150)->nullable();
            $table->string('tax_number_snapshot', 100)->nullable();
            $table->decimal('basic_salary_snapshot', 14, 2)->default(0);
            $table->decimal('gross_pay', 14, 2)->default(0);
            $table->decimal('pre_tax_deductions', 14, 2)->default(0);
            $table->decimal('taxable_income', 14, 2)->default(0);
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->decimal('statutory_deductions', 14, 2)->default(0);
            $table->decimal('voluntary_deductions', 14, 2)->default(0);
            $table->decimal('total_deductions', 14, 2)->default(0);
            $table->decimal('net_pay', 14, 2)->default(0);
            $table->string('status', 32)->default('PROCESSED');
            $table->json('snapshot')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'payroll_run_id', 'employee_id'], 'payroll_results_org_run_employee_unique');
            $table->index(['organization_id', 'employee_id']);
        });

        Schema::create('payroll_result_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_result_id')->constrained('payroll_results')->cascadeOnDelete();
            $table->foreignId('pay_code_id')->nullable()->constrained('pay_codes')->nullOnDelete();
            $table->string('code_snapshot', 64);
            $table->string('description_snapshot', 150);
            $table->string('type', 32);
            $table->string('category', 32)->nullable();
            $table->string('input_source', 32)->nullable();
            $table->decimal('amount', 14, 2)->default(0);
            $table->decimal('quantity', 12, 4)->nullable();
            $table->decimal('rate', 12, 4)->nullable();
            $table->boolean('taxable')->default(false);
            $table->boolean('affects_gross')->default(false);
            $table->boolean('affects_net')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'payroll_result_id'], 'payroll_result_lines_org_result_idx');
            $table->index(['organization_id', 'code_snapshot']);
        });

        Schema::create('payroll_statutory_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_run_id')->constrained('payroll_runs')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->string('code', 64);
            $table->string('description', 150);
            $table->unsignedInteger('employee_count')->default(0);
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'payroll_run_id', 'code'], 'payroll_statutory_summaries_org_run_code_unique');
        });

        Schema::table('payroll_exports', function (Blueprint $table) {
            $table->foreignId('payroll_period_id')->nullable()->after('organization_id')->constrained('payroll_periods')->nullOnDelete();
            $table->foreignId('payroll_run_id')->nullable()->after('payroll_period_id')->constrained('payroll_runs')->nullOnDelete();
            $table->string('export_type', 60)->nullable()->after('file_reference');
            $table->foreignId('generated_by')->nullable()->after('export_type')->constrained('users')->nullOnDelete();
            $table->json('summary_json')->nullable()->after('notes');

            $table->index(['organization_id', 'export_type'], 'payroll_exports_org_type_idx');
        });
    }

    public function down(): void
    {
        Schema::table('payroll_exports', function (Blueprint $table) {
            $table->dropIndex('payroll_exports_org_type_idx');
            $table->dropConstrainedForeignId('payroll_period_id');
            $table->dropConstrainedForeignId('payroll_run_id');
            $table->dropConstrainedForeignId('generated_by');
            $table->dropColumn(['export_type', 'summary_json']);
        });

        Schema::dropIfExists('payroll_statutory_summaries');
        Schema::dropIfExists('payroll_result_lines');
        Schema::dropIfExists('payroll_results');
        Schema::dropIfExists('payroll_runs');
        Schema::dropIfExists('payroll_inputs');
        Schema::dropIfExists('employee_recurring_pay_items');
        Schema::dropIfExists('employee_payroll_profiles');
        Schema::dropIfExists('pay_codes');
        Schema::dropIfExists('payroll_periods');
    }
};
