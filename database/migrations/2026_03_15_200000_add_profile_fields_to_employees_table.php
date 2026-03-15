<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('email')->nullable()->after('address');
            $table->string('national_id', 100)->nullable()->after('date_of_birth');
            $table->string('gender', 20)->nullable()->after('national_id');
            $table->string('occupation', 150)->nullable()->after('pay_point');
            $table->string('alt_phone_number', 64)->nullable()->after('contact_number');
            $table->string('marital_status', 32)->nullable()->after('gender');
            $table->string('nationality', 120)->nullable()->after('marital_status');
            $table->string('educational_level', 32)->nullable()->after('nationality');

            $table->unique(['organization_id', 'national_id'], 'employees_org_national_id_unique');
            $table->index(['organization_id', 'email'], 'employees_org_email_idx');
            $table->index(['organization_id', 'gender'], 'employees_org_gender_idx');
            $table->index(['organization_id', 'marital_status'], 'employees_org_marital_status_idx');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_org_national_id_unique');
            $table->dropIndex('employees_org_email_idx');
            $table->dropIndex('employees_org_gender_idx');
            $table->dropIndex('employees_org_marital_status_idx');
            $table->dropColumn([
                'email',
                'national_id',
                'gender',
                'occupation',
                'alt_phone_number',
                'marital_status',
                'nationality',
                'educational_level',
            ]);
        });
    }
};
