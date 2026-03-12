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
        Schema::create('employees', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Login account (optional but recommended)
            $table->unsignedBigInteger('user_id')->nullable()->unique();

            // Core identity
            $table->string('staff_number', 64)->unique();
            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('surname', 100);

            $table->date('date_of_birth')->nullable();

                                                         // HR fields
            $table->string('pay_point', 64)->nullable(); // Head Office, Staffing Solutions, etc.
            $table->string('contact_number', 64)->nullable();
            $table->text('address')->nullable();

                                                                   // Org placement
            $table->unsignedBigInteger('org_unit_id')->nullable(); // dept/team
            $table->unsignedBigInteger('location_id')->nullable(); // home location
            $table->unsignedBigInteger('position_id')->nullable(); // optional

                                                                  // Reporting line
            $table->unsignedBigInteger('manager_id')->nullable(); // self reference

                                                             // Lifecycle
            $table->string('status', 32)->default('ACTIVE'); // ACTIVE/SUSPENDED/TERMINATED
            $table->date('hire_date')->nullable();
            $table->date('termination_date')->nullable();

            $table->timestamps();

            // FKs
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('org_unit_id')
                ->references('id')->on('org_units')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('location_id')
                ->references('id')->on('locations')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('position_id')
                ->references('id')->on('positions')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('manager_id')
                ->references('id')->on('employees')
                ->onDelete('set null')
                ->onUpdate('cascade');

            // Indexes
            $table->index(['org_unit_id']);
            $table->index(['location_id']);
            $table->index(['pay_point']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
