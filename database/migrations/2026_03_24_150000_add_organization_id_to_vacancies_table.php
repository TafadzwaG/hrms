<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('vacancies', 'organization_id')) {
            Schema::table('vacancies', function (Blueprint $table): void {
                $table->foreignId('organization_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('organizations')
                    ->nullOnDelete();
            });
        }

        DB::table('vacancies')
            ->select('id', 'company_profile_id')
            ->orderBy('id')
            ->get()
            ->each(function (object $vacancy): void {
                $organizationId = DB::table('company_profiles')
                    ->where('id', $vacancy->company_profile_id)
                    ->value('organization_id');

                if (! $organizationId) {
                    return;
                }

                DB::table('vacancies')
                    ->where('id', $vacancy->id)
                    ->update(['organization_id' => $organizationId]);
            });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('vacancies', 'organization_id')) {
            return;
        }

        Schema::table('vacancies', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('organization_id');
        });
    }
};
