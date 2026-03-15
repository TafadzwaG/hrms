<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code', 64)->nullable()->unique();
            $table->string('email')->nullable();
            $table->string('phone', 64)->nullable();
            $table->text('address')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('status', 32)->default('ACTIVE');
            $table->string('timezone', 64)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['name']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('current_organization_id')
                ->nullable()
                ->after('id')
                ->constrained('organizations')
                ->nullOnDelete();
        });

        Schema::create('organization_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'user_id']);
            $table->index(['user_id', 'is_active']);
        });

        Schema::create('organization_user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['organization_id', 'user_id', 'role_id']);
            $table->index(['user_id', 'organization_id']);
        });

        $this->backfillDefaultOrganization();
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_user_roles');
        Schema::dropIfExists('organization_user');

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('current_organization_id');
        });

        Schema::dropIfExists('organizations');
    }

    private function backfillDefaultOrganization(): void
    {
        $organizationId = $this->defaultOrganizationId();

        if (! Schema::hasTable('users')) {
            return;
        }

        $now = now();
        $userIds = DB::table('users')->pluck('id');

        foreach ($userIds as $userId) {
            DB::table('organization_user')->updateOrInsert(
                [
                    'organization_id' => $organizationId,
                    'user_id' => $userId,
                ],
                [
                    'is_active' => true,
                    'joined_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        DB::table('users')->whereNull('current_organization_id')->update([
            'current_organization_id' => $organizationId,
        ]);

        if (! Schema::hasTable('role_users') || ! Schema::hasTable('roles')) {
            return;
        }

        $systemAdminRoleId = DB::table('roles')->where('code', 'SYS_ADMIN')->value('id');
        $roleAssignments = DB::table('role_users')->get(['role_id', 'user_id']);

        foreach ($roleAssignments as $assignment) {
            if ($systemAdminRoleId && (int) $assignment->role_id === (int) $systemAdminRoleId) {
                continue;
            }

            DB::table('organization_user_roles')->updateOrInsert(
                [
                    'organization_id' => $organizationId,
                    'user_id' => $assignment->user_id,
                    'role_id' => $assignment->role_id,
                ],
                [
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        if ($systemAdminRoleId) {
            DB::table('role_users')->where('role_id', '!=', $systemAdminRoleId)->delete();
        } else {
            DB::table('role_users')->delete();
        }
    }

    private function defaultOrganizationId(): int
    {
        $name = $this->defaultOrganizationName();
        $baseSlug = Str::slug($name) ?: 'default-organization';
        $slug = $baseSlug;
        $suffix = 1;

        $existingId = DB::table('organizations')->where('slug', $slug)->value('id');
        if ($existingId) {
            return (int) $existingId;
        }

        while (DB::table('organizations')->where('slug', $slug)->exists()) {
            $suffix++;
            $slug = $baseSlug.'-'.$suffix;
        }

        $code = DB::table('org_units')->where('type', 'COMPANY')->orderBy('id')->value('code');
        $timezone = config('app.timezone');
        $now = now();

        return (int) DB::table('organizations')->insertGetId([
            'name' => $name,
            'slug' => $slug,
            'code' => filled($code) ? (string) $code : 'PRIMARY',
            'status' => 'ACTIVE',
            'timezone' => filled($timezone) ? (string) $timezone : null,
            'metadata' => json_encode([
                'source' => 'multi_tenancy_upgrade',
                'upgraded_at' => $now->toIso8601String(),
            ], JSON_UNESCAPED_SLASHES),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    private function defaultOrganizationName(): string
    {
        $companyName = Schema::hasTable('org_units')
            ? DB::table('org_units')->where('type', 'COMPANY')->orderBy('id')->value('name')
            : null;

        return filled($companyName)
            ? (string) $companyName
            : (string) config('app.name', 'Primary Organization');
    }
};
