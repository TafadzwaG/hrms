<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payslip_deliveries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payroll_result_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('channel', 16);
            $table->string('recipient')->nullable();
            $table->string('status', 16)->default('PENDING');
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->string('batch_id', 64)->nullable();
            $table->text('failure_reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'channel', 'status'], 'pdlv_org_channel_status_idx');
            $table->index(['payroll_result_id', 'channel', 'created_at'], 'pdlv_result_channel_created_idx');
            $table->index(['employee_id', 'channel'], 'pdlv_employee_channel_idx');
            $table->index(['payroll_period_id', 'channel'], 'pdlv_period_channel_idx');
            $table->index('batch_id', 'pdlv_batch_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payslip_deliveries');
    }
};
