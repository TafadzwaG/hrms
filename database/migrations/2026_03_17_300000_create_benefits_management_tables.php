<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create benefits table
        Schema::create('benefits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code', 50)->nullable();
            $table->string('name');
            $table->string('category', 50);
            $table->text('description')->nullable();
            $table->string('benefit_type', 50);
            $table->boolean('taxable')->default(false);
            $table->boolean('cash_benefit')->default(true);
            $table->boolean('employer_funded')->default(false);
            $table->boolean('employee_funded')->default(false);
            $table->boolean('shared_contribution')->default(false);
            $table->boolean('requires_dependants')->default(false);
            $table->boolean('requires_plan_selection')->default(false);
            $table->boolean('payroll_deductible')->default(false);
            $table->boolean('active')->default(true);
            $table->date('effective_from')->nullable();
            $table->date('effective_to')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'code']);
            $table->index('organization_id');
            $table->index('category');
            $table->index('benefit_type');
            $table->index('active');
        });

        // 2. Create benefit_plans table
        Schema::create('benefit_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('benefit_id')->constrained('benefits')->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->text('description')->nullable();
            $table->boolean('active')->default(true);
            $table->string('employer_contribution_type', 50)->nullable();
            $table->decimal('employer_contribution_value', 15, 2)->nullable();
            $table->string('employee_contribution_type', 50)->nullable();
            $table->decimal('employee_contribution_value', 15, 2)->nullable();
            $table->decimal('coverage_limit', 15, 2)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('benefit_id');
            $table->index('organization_id');
        });

        // 3. Create employee_benefit_enrollments table
        Schema::create('employee_benefit_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('benefit_id')->constrained('benefits')->restrictOnDelete();
            $table->foreignId('benefit_plan_id')->nullable()->constrained('benefit_plans')->nullOnDelete();
            $table->string('status', 50)->default('draft');
            $table->date('effective_date');
            $table->date('end_date')->nullable();
            $table->decimal('employee_contribution', 15, 2)->nullable();
            $table->decimal('employer_contribution', 15, 2)->nullable();
            $table->string('payroll_deduction_code', 50)->nullable();
            $table->string('enrollment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('organization_id');
            $table->index('employee_id');
            $table->index('benefit_id');
            $table->index('benefit_plan_id');
            $table->index('status');
            $table->index('effective_date');
        });

        // 4. Create employee_benefit_dependants table
        Schema::create('employee_benefit_dependants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('employee_benefit_enrollment_id')->constrained('employee_benefit_enrollments')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('relationship', 50);
            $table->date('date_of_birth')->nullable();
            $table->string('national_id')->nullable();
            $table->string('contact_number')->nullable();
            $table->date('effective_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status', 50)->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('employee_benefit_enrollment_id');
            $table->index('organization_id');
        });

        // 5. Create benefit_contribution_rules table
        Schema::create('benefit_contribution_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('benefit_id')->constrained('benefits')->cascadeOnDelete();
            $table->foreignId('benefit_plan_id')->nullable()->constrained('benefit_plans')->nullOnDelete();
            $table->string('rule_name');
            $table->string('contribution_basis', 50);
            $table->string('employer_contribution_type', 50);
            $table->decimal('employer_contribution_value', 15, 2)->nullable();
            $table->string('employee_contribution_type', 50);
            $table->decimal('employee_contribution_value', 15, 2)->nullable();
            $table->decimal('min_value', 15, 2)->nullable();
            $table->decimal('max_value', 15, 2)->nullable();
            $table->date('effective_from')->nullable();
            $table->date('effective_to')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index('benefit_id');
            $table->index('benefit_plan_id');
            $table->index('organization_id');
        });

        // 6. Create benefit_documents table
        Schema::create('benefit_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('employee_benefit_enrollment_id')->constrained('employee_benefit_enrollments')->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('document_type', 50)->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('employee_benefit_enrollment_id');
            $table->index('organization_id');
        });

        // 7. Create benefit_change_logs table
        Schema::create('benefit_change_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('employee_benefit_enrollment_id')->constrained('employee_benefit_enrollments')->cascadeOnDelete();
            $table->string('event', 50);
            $table->string('from_status', 50)->nullable();
            $table->string('to_status', 50)->nullable();
            $table->json('from_values')->nullable();
            $table->json('to_values')->nullable();
            $table->text('reason')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('employee_benefit_enrollment_id');
            $table->index('organization_id');
            $table->index('event');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('benefit_change_logs');
        Schema::dropIfExists('benefit_documents');
        Schema::dropIfExists('benefit_contribution_rules');
        Schema::dropIfExists('employee_benefit_dependants');
        Schema::dropIfExists('employee_benefit_enrollments');
        Schema::dropIfExists('benefit_plans');
        Schema::dropIfExists('benefits');
    }
};
