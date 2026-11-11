<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SALARIED employees get BASIC from basic_salary; HOURLY employees are paid for the
        // hours captured each period at their hourly rate.
        Schema::table('employee_payroll_profiles', function (Blueprint $table) {
            $table->string('pay_basis', 16)->default('SALARIED')->after('pay_frequency');
        });

        // How a pay code's quantity is measured. HOURS codes are paid at the employee's
        // hourly rate times rate_multiplier; UNITS codes (such as mileage) at default_rate
        // unless a rate is entered.
        Schema::table('pay_codes', function (Blueprint $table) {
            $table->string('unit', 16)->default('AMOUNT')->after('type');
            $table->decimal('rate_multiplier', 8, 4)->nullable()->after('unit');
            $table->decimal('default_rate', 14, 4)->nullable()->after('rate_multiplier');
        });

        Schema::table('payroll_inputs', function (Blueprint $table) {
            $table->date('work_date')->nullable()->after('rate');
            $table->string('cost_centre', 100)->nullable()->after('work_date');
        });

        Schema::table('payroll_results', function (Blueprint $table) {
            $table->string('cost_centre_snapshot', 100)->nullable()->after('pay_point_snapshot');
        });

        DB::table('pay_codes')->where('code', 'OT')->update(['unit' => 'HOURS']);
    }

    public function down(): void
    {
        Schema::table('payroll_results', fn (Blueprint $table) => $table->dropColumn('cost_centre_snapshot'));
        Schema::table('payroll_inputs', fn (Blueprint $table) => $table->dropColumn(['work_date', 'cost_centre']));
        Schema::table('pay_codes', fn (Blueprint $table) => $table->dropColumn(['unit', 'rate_multiplier', 'default_rate']));
        Schema::table('employee_payroll_profiles', fn (Blueprint $table) => $table->dropColumn('pay_basis'));
    }
};
