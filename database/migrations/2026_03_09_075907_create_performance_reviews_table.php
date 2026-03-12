<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->string('cycle_name', 120);
            $table->string('reviewer_name', 150)->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->string('status', 32)->default('PLANNED');
            $table->date('review_date')->nullable();
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->index(['employee_id']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_reviews');
    }
};
