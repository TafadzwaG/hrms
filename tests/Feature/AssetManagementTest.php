<?php

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\AssetCategory;
use App\Models\AssetDocument;
use App\Models\AssetLocation;
use App\Models\AssetMaintenanceRecord;
use App\Models\AssetVendor;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function assetOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'asset-test-tenant'],
        [
            'name' => 'Asset Test Tenant',
            'code' => 'ATEST',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantAssetPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for asset feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'ASSET_'.str()->upper(str()->random(8)),
        'name' => 'Asset '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for asset tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $organization = assetOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function createAssetEmployee(Organization $organization): Employee
{
    return Employee::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'AST-'.str()->random(6),
        'first_name' => 'Asset',
        'surname' => 'Holder',
        'contact_number' => '+263700000002',
        'address' => '2 Test Lane',
        'national_id' => 'NID-'.str()->random(8),
        'gender' => 'Male',
        'marital_status' => 'Single',
    ]);
}

function createTestCategory(Organization $organization): AssetCategory
{
    return AssetCategory::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'IT Equipment',
        'code' => 'IT-'.str()->random(4),
    ]);
}

function createTestAsset(Organization $organization, AssetCategory $category): Asset
{
    return Asset::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'asset_category_id' => $category->id,
        'asset_tag' => 'TAG-'.str()->random(6),
        'name' => 'Test Laptop',
        'status' => 'available',
        'condition' => 'new',
    ]);
}

// ── Asset CRUD ──────────────────────────────────────────

test('asset index page loads for authorized user', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view']);

    $this->actingAs($user)
        ->get('/assets')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Assets/Index')
            ->has('assets')
            ->has('statuses')
        );
});

test('asset create page loads for authorized user', function () {
    $user = User::factory()->create();
    grantAssetPermissions($user, ['assets.view', 'assets.create']);

    $this->actingAs($user)
        ->get('/assets/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Assets/Create')
            ->has('options')
        );
});

test('can create an asset', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.create']);
    $category = createTestCategory($org);

    $this->actingAs($user)
        ->post('/assets', [
            'asset_tag' => 'AST-CREATE-001',
            'name' => 'New Laptop',
            'asset_category_id' => $category->id,
            'status' => 'available',
            'condition' => 'new',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('assets', [
        'asset_tag' => 'AST-CREATE-001',
        'name' => 'New Laptop',
        'status' => 'available',
    ]);

    // Verify status history was recorded
    $this->assertDatabaseHas('asset_status_history', [
        'to_status' => 'available',
    ]);
});

test('can update an asset', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.update']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->put("/assets/{$asset->id}", [
            'asset_tag' => $asset->asset_tag,
            'name' => 'Updated Laptop',
            'asset_category_id' => $category->id,
            'status' => 'available',
            'condition' => 'good',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect($asset->name)->toBe('Updated Laptop');
    expect($asset->condition)->toBe('good');
});

test('can delete an asset', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.delete']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->delete("/assets/{$asset->id}")
        ->assertRedirect();

    // Soft deleted
    expect(Asset::withoutGlobalScopes()->find($asset->id)->trashed())->toBeTrue();
});

test('asset tag is unique per organization', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.create']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->post('/assets', [
            'asset_tag' => $asset->asset_tag,
            'name' => 'Duplicate Asset',
            'asset_category_id' => $category->id,
            'status' => 'available',
            'condition' => 'new',
        ])
        ->assertSessionHasErrors('asset_tag');
});

// ── Assignment ──────────────────────────────────────────

test('can assign an asset to an employee', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.assign']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);
    $employee = createAssetEmployee($org);

    $this->actingAs($user)
        ->post("/assets/{$asset->id}/assign", [
            'employee_id' => $employee->id,
            'condition_on_assignment' => 'new',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect($asset->status)->toBe('assigned');

    $this->assertDatabaseHas('asset_assignments', [
        'asset_id' => $asset->id,
        'employee_id' => $employee->id,
        'status' => 'active',
    ]);
});

test('can return an asset from an employee', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.assign']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);
    $employee = createAssetEmployee($org);

    // First assign
    $asset->update(['status' => 'assigned']);
    AssetAssignment::withoutGlobalScopes()->create([
        'organization_id' => $org->id,
        'asset_id' => $asset->id,
        'employee_id' => $employee->id,
        'assigned_by' => $user->id,
        'assigned_at' => now(),
        'condition_on_assignment' => 'new',
        'status' => 'active',
    ]);

    // Then return
    $this->actingAs($user)
        ->post("/assets/{$asset->id}/return", [
            'condition_on_return' => 'good',
            'return_notes' => 'All good',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect($asset->status)->toBe('available');
    expect($asset->condition)->toBe('good');
});

test('cannot assign a non-available asset', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.assign']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);
    $employee = createAssetEmployee($org);

    $asset->update(['status' => 'assigned']);

    $this->actingAs($user)
        ->post("/assets/{$asset->id}/assign", [
            'employee_id' => $employee->id,
        ])
        ->assertRedirect()
        ->assertSessionHas('error');
});

// ── Dispose ─────────────────────────────────────────────

test('can dispose an asset', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.dispose']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->post("/assets/{$asset->id}/dispose", [
            'reason' => 'End of life',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect($asset->status)->toBe('disposed');
});

// ── Documents ───────────────────────────────────────────

test('can upload and download asset document', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.documents.manage']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $file = UploadedFile::fake()->create('manual.pdf', 1024, 'application/pdf');

    $this->actingAs($user)
        ->post("/assets/{$asset->id}/documents", [
            'file' => $file,
            'document_type' => 'manual',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('asset_documents', [
        'asset_id' => $asset->id,
        'file_name' => 'manual.pdf',
        'document_type' => 'manual',
    ]);

    $document = AssetDocument::withoutGlobalScopes()->where('asset_id', $asset->id)->first();

    $this->actingAs($user)
        ->get("/assets/{$asset->id}/documents/{$document->id}/download")
        ->assertOk();
});

// ── Maintenance ─────────────────────────────────────────

test('can create a maintenance record', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view', 'assets.maintenance.manage']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->post("/assets/{$asset->id}/maintenance", [
            'maintenance_type' => 'preventive',
            'title' => 'Annual servicing',
            'status' => 'scheduled',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('asset_maintenance_records', [
        'asset_id' => $asset->id,
        'title' => 'Annual servicing',
        'maintenance_type' => 'preventive',
    ]);
});

// ── Categories ──────────────────────────────────────────

test('can create and list categories', function () {
    $user = User::factory()->create();
    grantAssetPermissions($user, ['assets.categories.view', 'assets.categories.manage']);

    $this->actingAs($user)
        ->post('/asset-categories', [
            'name' => 'Furniture',
            'code' => 'FUR-'.str()->random(3),
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->get('/asset-categories')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('AssetCategories/Index')
            ->has('categories')
        );
});

test('cannot delete category with assets', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.categories.view', 'assets.categories.manage']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->delete("/asset-categories/{$category->id}")
        ->assertRedirect()
        ->assertSessionHas('error');
});

// ── Vendors ─────────────────────────────────────────────

test('can create and list vendors', function () {
    $user = User::factory()->create();
    grantAssetPermissions($user, ['assets.vendors.view', 'assets.vendors.manage']);

    $this->actingAs($user)
        ->post('/asset-vendors', [
            'name' => 'Dell Technologies',
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->get('/asset-vendors')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('AssetVendors/Index')
            ->has('vendors')
        );
});

// ── Locations ───────────────────────────────────────────

test('can create and list asset locations', function () {
    $user = User::factory()->create();
    grantAssetPermissions($user, ['assets.locations.view', 'assets.locations.manage']);

    $this->actingAs($user)
        ->post('/asset-locations', [
            'name' => 'Warehouse A',
            'building' => 'Main Building',
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->get('/asset-locations')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('AssetLocations/Index')
            ->has('locations')
        );
});

// ── Authorization ───────────────────────────────────────

test('unauthorized user cannot access asset pages', function () {
    $user = User::factory()->create();
    grantAssetPermissions($user, ['employees.view']);

    $this->actingAs($user)
        ->get('/assets')
        ->assertForbidden();

    $this->actingAs($user)
        ->get('/assets/create')
        ->assertForbidden();
});

// ── Show page ───────────────────────────────────────────

test('asset show page loads with all tabs data', function () {
    $user = User::factory()->create();
    $org = grantAssetPermissions($user, ['assets.view']);
    $category = createTestCategory($org);
    $asset = createTestAsset($org, $category);

    $this->actingAs($user)
        ->get("/assets/{$asset->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Assets/Show')
            ->has('asset')
            ->has('employees')
            ->has('conditions')
        );
});
