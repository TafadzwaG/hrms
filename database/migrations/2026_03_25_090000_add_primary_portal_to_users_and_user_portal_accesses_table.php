<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            if (! Schema::hasColumn('users', 'primary_portal')) {
                $table->string('primary_portal', 32)->default('employee')->after('password');
                $table->index('primary_portal');
            }
        });

        if (! Schema::hasTable('user_portal_accesses')) {
            Schema::create('user_portal_accesses', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('portal', 32);
                $table->timestamps();

                $table->unique(['user_id', 'portal']);
                $table->index('portal');
            });
        }

        $this->backfillPortalAccesses();
    }

    public function down(): void
    {
        Schema::dropIfExists('user_portal_accesses');

        Schema::table('users', function (Blueprint $table): void {
            if (Schema::hasColumn('users', 'primary_portal')) {
                $table->dropIndex(['primary_portal']);
                $table->dropColumn('primary_portal');
            }
        });
    }

    private function backfillPortalAccesses(): void
    {
        if (! Schema::hasTable('users') || ! Schema::hasTable('user_portal_accesses')) {
            return;
        }

        $now = now();
        $userIds = DB::table('users')->pluck('id');

        foreach ($userIds as $userId) {
            $portals = collect();

            $hasEmployeeAccess = Schema::hasTable('employees')
                && DB::table('employees')->where('user_id', $userId)->exists();

            if (! $hasEmployeeAccess && Schema::hasTable('organization_user')) {
                $hasEmployeeAccess = DB::table('organization_user')->where('user_id', $userId)->exists();
            }

            if ($hasEmployeeAccess) {
                $portals->push('employee');
            }

            if (Schema::hasTable('company_profiles') && DB::table('company_profiles')->where('owner_user_id', $userId)->exists()) {
                $portals->push('employer');
            }

            if (Schema::hasTable('candidate_profiles') && DB::table('candidate_profiles')->where('user_id', $userId)->exists()) {
                $portals->push('candidate');
            }

            if ($portals->isEmpty()) {
                $portals->push('employee');
            }

            $portals = $portals->unique()->values();

            foreach ($portals as $portal) {
                DB::table('user_portal_accesses')->updateOrInsert(
                    [
                        'user_id' => $userId,
                        'portal' => $portal,
                    ],
                    [
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                );
            }

            $primaryPortal = collect(['employee', 'employer', 'candidate'])
                ->first(fn (string $portal) => $portals->contains($portal), 'employee');

            DB::table('users')->where('id', $userId)->update([
                'primary_portal' => $primaryPortal,
            ]);
        }
    }
};
