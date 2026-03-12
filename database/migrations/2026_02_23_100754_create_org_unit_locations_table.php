<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('org_unit_locations', function (Blueprint $table) {
            $table->unsignedBigInteger('org_unit_id');
            $table->unsignedBigInteger('location_id');

            $table->boolean('is_primary')->default(false);
            $table->date('effective_from')->nullable();
            $table->date('effective_to')->nullable();

            $table->timestamps();

            // Composite PK (pivot-style)
            $table->primary(['org_unit_id', 'location_id']);

            $table->foreign('org_unit_id')
                ->references('id')->on('org_units')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('location_id')
                ->references('id')->on('locations')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->index('location_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('org_unit_locations');
    }
};