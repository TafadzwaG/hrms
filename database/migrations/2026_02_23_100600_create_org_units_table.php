<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('org_units', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name'); // e.g. "ProCanteen", "IT", "Finance"
            $table->string('type', 32)->default('COMPANY');
            // COMPANY, SBU, DEPARTMENT, TEAM, SECTION, etc.

            $table->unsignedBigInteger('parent_id')->nullable(); // self hierarchy

            $table->string('code', 64)->nullable();    // optional internal code
            $table->string('cost_center')->nullable(); // optional accounting ref

            $table->date('effective_from')->nullable();
            $table->date('effective_to')->nullable();

            $table->timestamps();

            $table->foreign('parent_id')
                ->references('id')->on('org_units')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->index(['parent_id']);
            $table->index(['type']);

            // Prevent duplicates under same parent/type, but allow same name in different SBUs
            $table->unique(['parent_id', 'name', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('org_units');
    }
};
