<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('requisition_code', 64)->nullable();
            $table->string('full_name', 150);
            $table->string('email', 150)->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('stage', 32)->default('APPLIED');
            $table->string('status', 32)->default('ACTIVE');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['stage']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_profiles');
    }
};
