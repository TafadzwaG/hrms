<?php

use App\Jobs\RunDatabaseBackupJob;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function createSystemSettingsOrg(): Organization
{
    return Organization::query()->create([
        'name' => 'Settings Tenant',
        'slug' => 'settings-tenant',
        'code' => 'SET',
        'status' => 'ACTIVE',
        'timezone' => 'Africa/Johannesburg',
    ]);
}

function systemSettingsUserWithPermissions(Organization $organization, array $permissionNames): User
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => str($name)->before('.')->toString(),
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for system settings feature tests.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'SETTINGS_TEST_'.str()->upper(str()->random(6)),
        'name' => 'Settings Test Role',
        'description' => 'Temporary role for system settings tests.',
    ]);

    $role->permissions()->sync($permissionIds);

    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $user;
}

test('system settings page requires permission', function () {
    $organization = createSystemSettingsOrg();
    $user = User::factory()->create();
    $user->attachToOrganization($organization);
    $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();

    $this->actingAs($user);

    $this->get('/system-settings')
        ->assertRedirect('/dashboard')
        ->assertSessionHas('error');
});

test('system settings page loads with settings.view permission', function () {
    $organization = createSystemSettingsOrg();
    $user = systemSettingsUserWithPermissions($organization, ['settings.view']);

    $this->actingAs($user);

    $this->get('/system-settings')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('SystemSettings/Index')
            ->where('company.organization_id', $organization->id)
        );
});

test('general settings can be updated', function () {
    $organization = createSystemSettingsOrg();
    $user = systemSettingsUserWithPermissions($organization, ['settings.view', 'settings.manage']);

    $this->actingAs($user);

    $response = $this->put('/system-settings/general', [
        'system_name' => 'HRMS Prime',
        'system_short_name' => 'HRMS',
        'company_name' => 'Settings Tenant Updated',
        'company_email' => 'info@example.com',
        'company_phone' => '+263 77 000 0000',
        'company_address' => '1 Main Street',
        'company_website' => 'https://example.com',
        'support_email' => 'support@example.com',
        'default_timezone' => 'Africa/Johannesburg',
        'default_currency' => 'USD',
        'date_format' => 'Y-m-d',
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($organization->fresh()->name)->toBe('Settings Tenant Updated');

    $systemSetting = DB::table('system_settings')
        ->where('organization_id', 0)
        ->where('group', 'general')
        ->where('key', 'system_name')
        ->value('value');

    expect($systemSetting)->toContain('HRMS Prime');
});

test('system logo can be uploaded', function () {
    Storage::fake('public');

    $organization = createSystemSettingsOrg();
    $user = systemSettingsUserWithPermissions($organization, ['settings.view', 'branding.manage']);

    $this->actingAs($user);

    $png = base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+lmf8AAAAASUVORK5CYII='
    );

    $response = $this->post('/system-settings/branding/system-logo', [
        'system_logo' => UploadedFile::fake()->createWithContent('system-logo.png', $png),
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('success');

    $path = DB::table('system_settings')
        ->where('organization_id', 0)
        ->where('group', 'branding')
        ->where('key', 'system_logo_path')
        ->value('value');

    expect($path)->not->toBeNull();

    $decodedPath = json_decode((string) $path, true);
    $effectivePath = is_string($decodedPath) ? $decodedPath : trim((string) $path, '"');

    Storage::disk('public')->assertExists($effectivePath);
});

test('manual backup run dispatches a job when permitted', function () {
    Queue::fake();

    $organization = createSystemSettingsOrg();
    $user = systemSettingsUserWithPermissions($organization, ['settings.view', 'backups.run']);

    $this->actingAs($user);

    $this->post('/system-settings/backups/run')
        ->assertRedirect()
        ->assertSessionHas('success');

    Queue::assertPushed(RunDatabaseBackupJob::class);
});

test('backup settings validation rejects invalid email recipients', function () {
    $organization = createSystemSettingsOrg();
    $user = systemSettingsUserWithPermissions($organization, ['settings.view', 'backups.manage']);

    $this->actingAs($user);

    $response = $this->put('/system-settings/backups', [
        'enable_automatic_backups' => true,
        'backup_frequency' => 'daily',
        'backup_day_of_week' => 'sunday',
        'backup_time' => '02:00',
        'backup_retention_days' => 14,
        'backup_local_enabled' => true,
        'backup_local_path' => 'backups',
        'backup_email_enabled' => true,
        'backup_email_recipients' => 'not-an-email',
        'backup_include_database' => true,
        'backup_include_uploads' => false,
        'backup_email_subject_prefix' => '',
        'backup_email_message' => '',
    ]);

    $response->assertSessionHasErrors('backup_email_recipients');
});
