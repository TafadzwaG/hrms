<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->nullOnDelete();
            $table->string('contract_number', 100);
            $table->string('contract_type', 50);
            $table->string('status', 50)->default('draft');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('probation_end_date')->nullable();
            $table->string('job_title', 255)->nullable();
            $table->foreignId('department_id')->nullable()->constrained('org_units')->nullOnDelete();
            $table->foreignId('position_id')->nullable()->constrained('positions')->nullOnDelete();
            $table->string('pay_point', 100)->nullable();
            $table->decimal('basic_salary', 15, 2)->nullable();
            $table->string('currency', 10)->nullable();
            $table->string('pay_frequency', 50)->nullable();
            $table->decimal('working_hours_per_week', 5, 2)->nullable();
            $table->unsignedSmallInteger('notice_period_days')->nullable();
            $table->unsignedSmallInteger('leave_days_per_year')->nullable();
            $table->boolean('is_current')->default(false);
            $table->timestamp('signed_at')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->string('termination_reason', 500)->nullable();
            $table->text('renewal_notes')->nullable();
            $table->json('benefits')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('employee_id');
            $table->index('organization_id');
            $table->index('status');
            $table->index('contract_type');
            $table->index('is_current');
            $table->index('start_date');
            $table->index('end_date');
            $table->unique(['organization_id', 'contract_number']);
        });

        Schema::create('contract_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_contract_id')->constrained('employee_contracts')->cascadeOnDelete();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->nullOnDelete();
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('employee_contract_id');
            $table->index('organization_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_documents');
        Schema::dropIfExists('employee_contracts');
    }
};
