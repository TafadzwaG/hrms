<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_tax_tables', function (Blueprint $table) {
            $table->id();
            // Null = system-wide table. An organization can override with its own row.
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('currency', 8);
            $table->string('pay_frequency', 32);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->decimal('aids_levy_percent', 6, 3)->default(3);
            $table->string('source', 255)->nullable();
            // Set when a payroll specialist has checked the bands against ZIMRA's published tables.
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['currency', 'pay_frequency', 'effective_from'], 'payroll_tax_tables_lookup_index');
        });

        Schema::create('payroll_tax_bands', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_tax_table_id')->constrained('payroll_tax_tables')->cascadeOnDelete();
            $table->decimal('lower_bound', 14, 2);
            $table->decimal('upper_bound', 14, 2)->nullable();
            $table->decimal('rate_percent', 6, 3);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $this->seedUsdTables();
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_tax_bands');
        Schema::dropIfExists('payroll_tax_tables');
    }

    /**
     * ZIMRA USD PAYE bands. The annual table is 0% to 1,200, 20% to 3,600, 25% to 12,000,
     * 30% to 24,000, 35% to 36,000 and 40% above; the other frequencies are that table
     * divided by 12, 26 and 52. These rows are unverified (verified_at is null) until a
     * payroll specialist confirms them against the current ZIMRA tables.
     */
    private function seedUsdTables(): void
    {
        $rates = [0, 20, 25, 30, 35, 40];
        $tables = [
            'MONTHLY' => [100.00, 300.00, 1000.00, 2000.00, 3000.00],
            'FORTNIGHTLY' => [46.15, 138.46, 461.54, 923.08, 1384.62],
            'BI_WEEKLY' => [46.15, 138.46, 461.54, 923.08, 1384.62],
            'WEEKLY' => [23.08, 69.23, 230.77, 461.54, 692.31],
        ];

        foreach ($tables as $frequency => $limits) {
            $tableId = DB::table('payroll_tax_tables')->insertGetId([
                'organization_id' => null,
                'name' => 'ZIMRA PAYE USD '.str_replace('_', ' ', ucfirst(strtolower($frequency))),
                'currency' => 'USD',
                'pay_frequency' => $frequency,
                'effective_from' => '2024-01-01',
                'effective_to' => null,
                'aids_levy_percent' => 3,
                'source' => 'ZIMRA USD PAYE tables. Unverified: confirm against the current tax year at zimra.co.zw/domestic-taxes/tax-tables',
                'verified_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $lower = 0.00;

            foreach ($rates as $index => $rate) {
                $upper = $limits[$index] ?? null;

                DB::table('payroll_tax_bands')->insert([
                    'payroll_tax_table_id' => $tableId,
                    'lower_bound' => $lower,
                    'upper_bound' => $upper,
                    'rate_percent' => $rate,
                    'sort_order' => $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $lower = (float) $upper;
            }
        }
    }
};
