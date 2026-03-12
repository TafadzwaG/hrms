<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('onboarding_tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->string('task_name', 150);
            $table->string('owner_team', 120)->nullable();
            $table->date('due_date')->nullable();
            $table->string('status', 32)->default('OPEN');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['employee_id']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('onboarding_tasks');
    }
};
