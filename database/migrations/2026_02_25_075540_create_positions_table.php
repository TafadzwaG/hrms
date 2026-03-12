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
       Schema::create('positions', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name', 128);               // e.g. Software Engineer
            $table->string('code', 64)->nullable()->unique(); // optional unique code

            // Optional: define which org unit "owns" this position (e.g., IT Department)
            $table->unsignedBigInteger('org_unit_id')->nullable();

            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->foreign('org_unit_id')
                ->references('id')->on('org_units')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->index(['name']);
            $table->index(['org_unit_id']);
            $table->index(['is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
