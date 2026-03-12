<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_exports', function (Blueprint $table) {
            $table->id();
            $table->date('period_start');
            $table->date('period_end');
            $table->string('export_version', 32);
            $table->string('status', 32)->default('PREPARED');
            $table->dateTime('exported_at')->nullable();
            $table->string('file_reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['period_start', 'period_end']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_exports');
    }
};
