<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A batch groups the inputs posted together by one import, bulk action or grid post,
        // so they can be checked against control totals and reversed as a unit.
        Schema::create('payroll_input_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->string('batch_number', 32);
            $table->string('source', 16);
            $table->string('action', 16)->default('INSERT');
            $table->string('description', 255)->nullable();
            $table->decimal('control_total', 14, 2)->nullable();
            $table->unsignedInteger('control_count')->nullable();
            $table->decimal('entered_total', 14, 2)->default(0);
            $table->unsignedInteger('entered_count')->default(0);
            $table->string('status', 16)->default('POSTED');
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reversed_at')->nullable();
            $table->foreignId('reversed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['organization_id', 'batch_number'], 'payroll_input_batches_org_number_unique');
            $table->index(['organization_id', 'payroll_period_id']);
        });

        Schema::table('payroll_inputs', function (Blueprint $table) {
            $table->foreignId('payroll_input_batch_id')->nullable()->after('pay_code_id')
                ->constrained('payroll_input_batches')->nullOnDelete();
        });

        // Saved column layouts for the spreadsheet grid, reused every period.
        Schema::create('payroll_input_layouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('name', 100);
            $table->json('pay_code_ids');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['organization_id', 'name'], 'payroll_input_layouts_org_name_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_input_layouts');

        Schema::table('payroll_inputs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payroll_input_batch_id');
        });

        Schema::dropIfExists('payroll_input_batches');
    }
};
