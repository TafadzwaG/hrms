<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->date('work_date');
            $table->dateTime('clock_in')->nullable();
            $table->dateTime('clock_out')->nullable();
            $table->unsignedInteger('minutes_worked')->nullable();
            $table->string('exception_status', 40)->default('NORMAL');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['employee_id']);
            $table->index(['work_date']);
            $table->index(['exception_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};
