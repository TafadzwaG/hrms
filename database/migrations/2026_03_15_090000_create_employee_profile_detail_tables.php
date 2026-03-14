<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_next_of_kin', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('employee_id');
            $table->string('full_name', 255);
            $table->string('relationship', 100);
            $table->string('contact_number', 64);
            $table->string('alternate_contact_number', 64)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('address');
            $table->boolean('is_primary')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('id')->on('employees')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->index(['employee_id']);
        });

        Schema::create('employee_physical_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('employee_id')->unique();
            $table->string('uniform_size', 32)->nullable();
            $table->string('shirt_size', 32)->nullable();
            $table->string('trouser_size', 32)->nullable();
            $table->string('shoe_size', 32)->nullable();
            $table->decimal('height_cm', 5, 2)->nullable();
            $table->decimal('weight_kg', 6, 2)->nullable();
            $table->string('blood_type', 8)->nullable();
            $table->text('emergency_medical_notes')->nullable();
            $table->text('ppe_notes')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('id')->on('employees')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create('employee_skills', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('employee_id');
            $table->string('name', 255);
            $table->string('category', 100)->nullable();
            $table->string('proficiency_level', 32)->default('Beginner');
            $table->unsignedTinyInteger('proficiency_percent')->default(0);
            $table->string('certification_name', 255)->nullable();
            $table->string('certification_issuer', 255)->nullable();
            $table->date('certified_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('id')->on('employees')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->index(['employee_id']);
            $table->index(['employee_id', 'proficiency_level']);
        });

        Schema::create('employee_job_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('employee_id')->unique();
            $table->string('title', 255)->nullable();
            $table->string('employment_type', 64)->nullable();
            $table->string('reports_to', 255)->nullable();
            $table->string('working_hours', 128)->nullable();
            $table->string('location_summary', 255)->nullable();
            $table->text('summary')->nullable();
            $table->text('responsibilities')->nullable();
            $table->text('requirements')->nullable();
            $table->date('review_date')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('id')->on('employees')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create('employee_kpis', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('employee_id');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('target_value', 255)->nullable();
            $table->string('current_value', 255)->nullable();
            $table->string('measurement_period', 64)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->unsignedTinyInteger('progress_percent')->default(0);
            $table->date('due_date')->nullable();
            $table->string('status', 32)->default('ACTIVE');
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('id')->on('employees')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->index(['employee_id']);
            $table->index(['employee_id', 'status']);
            $table->index(['due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_kpis');
        Schema::dropIfExists('employee_job_profiles');
        Schema::dropIfExists('employee_skills');
        Schema::dropIfExists('employee_physical_profiles');
        Schema::dropIfExists('employee_next_of_kin');
    }
};
