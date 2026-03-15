<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SystemAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $name = (string) env('SYSTEM_ADMIN_NAME', 'System Administrator');
        $email = (string) env('SYSTEM_ADMIN_EMAIL', 'admin@hrms.test');
        $password = (string) env('SYSTEM_ADMIN_PASSWORD', 'Password@123');

        $sysAdminRole = Role::query()->updateOrCreate(
            ['code' => 'SYS_ADMIN'],
            [
                'name' => 'System Administrator',
                'description' => 'Full system access and administration.',
            ],
        );

        if (Permission::query()->count() === 0) {
            $this->call(PermissionSeeder::class);
        }

        $allPermissionIds = Permission::query()->pluck('id')->all();

        DB::transaction(function () use ($name, $email, $password, $sysAdminRole, $allPermissionIds): void {
            $userAttributes = [
                'name' => $name,
                'email' => $email,
                'password' => $password,
            ];

            if (Schema::hasColumn('users', 'username')) {
                $userAttributes['username'] = $userAttributes['username'] ?? $email;
            }

            if (Schema::hasColumn('users', 'role')) {
                $userAttributes['role'] = 'sys_admin';
            }

            if (Schema::hasColumn('users', 'email_verified_at')) {
                $userAttributes['email_verified_at'] = now();
            }

            $user = User::query()->updateOrCreate(
                ['email' => $email],
                $userAttributes,
            );

            $user->roles()->syncWithoutDetaching([$sysAdminRole->id]);
            $user->permissions()->sync($allPermissionIds);

            if (Schema::hasTable('organizations')) {
                $organizations = Organization::query()->orderBy('name')->get(['id']);

                if ($organizations->isEmpty()) {
                    $organizations = collect([
                        Organization::query()->create([
                            'name' => 'Primary Organization',
                            'slug' => 'primary-organization',
                            'code' => 'PRIMARY',
                            'status' => 'ACTIVE',
                            'timezone' => config('app.timezone'),
                            'metadata' => [
                                'source' => 'system_admin_user_seeder',
                            ],
                        ]),
                    ]);
                }

                foreach ($organizations as $organization) {
                    $user->attachToOrganization($organization->id);
                }

                $currentOrganizationId = Organization::query()
                    ->whereKey($user->current_organization_id)
                    ->exists()
                    ? $user->current_organization_id
                    : $organizations->first()->id;

                $user->forceFill([
                    'current_organization_id' => $currentOrganizationId,
                ])->saveQuietly();
            }
        });

        $this->command?->info('System admin user seeded successfully.');
        $this->command?->line('Email: '.$email);
        $this->command?->line('Password: '.$password);
    }
}
