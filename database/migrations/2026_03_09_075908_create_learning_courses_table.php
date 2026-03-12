<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_code', 64)->unique();
            $table->string('title', 150);
            $table->string('category', 120)->nullable();
            $table->decimal('duration_hours', 6, 2)->nullable();
            $table->boolean('compliance_required')->default(false);
            $table->unsignedInteger('expires_after_days')->nullable();
            $table->string('status', 32)->default('ACTIVE');
            $table->timestamps();

            $table->index(['status']);
            $table->index(['category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_courses');
    }
};
