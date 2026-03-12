<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('requisition_code', 64)->unique();
            $table->string('title', 150);
            $table->string('department', 120)->nullable();
            $table->string('hiring_manager', 150)->nullable();
            $table->unsignedInteger('openings')->default(1);
            $table->string('status', 32)->default('OPEN');
            $table->date('target_start_date')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['department']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_requisitions');
    }
};
