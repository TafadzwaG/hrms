<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->string('leave_type', 100);
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('days', 6, 2)->default(0);
            $table->string('status', 32)->default('PENDING');
            $table->text('reason')->nullable();
            $table->string('approver_name', 150)->nullable();
            $table->timestamps();

            $table->index(['employee_id']);
            $table->index(['status']);
            $table->index(['leave_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
