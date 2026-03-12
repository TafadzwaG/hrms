<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('request_type', 100);
            $table->text('steps_json')->nullable();
            $table->unsignedInteger('sla_hours')->nullable();
            $table->string('status', 32)->default('ACTIVE');
            $table->timestamps();

            $table->index(['request_type']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_definitions');
    }
};
