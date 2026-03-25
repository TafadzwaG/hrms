<?php

use App\Models\Employee;
use App\Models\EmployeeScorecard;
use App\Models\EmployeeScorecardItem;
use App\Models\KpiLibrary;
use App\Models\Organization;
use App\Models\PerformanceCycle;
use App\Models\PerformanceComment;
use App\Models\PerformanceEvidence;
use App\Models\PerformanceImprovementPlan;
use App\Models\Permission;
use App\Models\Role;
use App\Models\ScorecardTemplate;
use App\Models\ScorecardTemplateItem;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function bscOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'bsc-test-tenant'],
        [
            'name' => 'BSC Test Tenant',
            'code' => 'BSCTEST',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantBscPermissions(User $user, array $permissionNames): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for BSC feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->create([
        'code' => 'BSC_'.str()->upper(str()->random(8)),
        'name' => 'BSC '.str()->upper(str()->random(4)),
        'description' => 'Temporary role for BSC tests.',
    ]);

    $role->permissions()->sync($permissionIds);
    $organization = bscOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function createBscEmployee(Organization $organization): Employee
{
    return Employee::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'staff_number' => 'BSC-'.str()->random(6),
        'first_name' => 'Test',
        'surname' => 'Employee',
        'contact_number' => '+263700000099',
        'address' => '99 Test Lane',
        'national_id' => 'NID-'.str()->random(8),
        'gender' => 'Male',
        'marital_status' => 'Single',
    ]);
}

function createBscCycle(Organization $organization): PerformanceCycle
{
    return PerformanceCycle::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'title' => 'Q1 2026 Review',
        'start_date' => '2026-01-01',
        'end_date' => '2026-03-31',
        'status' => 'active',
        'created_by' => null,
    ]);
}

// ── Performance Cycle CRUD ─────────────────────────────

it('can list performance cycles', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.cycles.manage']);
    createBscCycle($organization);

    $this->actingAs($user)
        ->get('/performance-cycles')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Cycles/Index')
            ->has('cycles.data', 1)
        );
});

it('treats an empty performance cycle status filter as all', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.cycles.manage']);
    createBscCycle($organization);

    $this->actingAs($user)
        ->get('/performance-cycles?status=')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Cycles/Index')
            ->has('cycles.data', 1)
            ->where('filters.status', 'all')
        );
});

it('can create a performance cycle', function () {
    $user = User::factory()->create();
    grantBscPermissions($user, ['performance.cycles.manage']);

    $this->actingAs($user)
        ->post('/performance-cycles', [
            'title' => 'Annual Review 2026',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'status' => 'draft',
            'description' => 'Full year review cycle.',
        ])
        ->assertRedirect();

    expect(PerformanceCycle::withoutGlobalScopes()->where('title', 'Annual Review 2026')->exists())->toBeTrue();
});

it('can update a performance cycle', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.cycles.manage']);
    $cycle = createBscCycle($organization);

    $this->actingAs($user)
        ->put("/performance-cycles/{$cycle->id}", [
            'title' => 'Updated Cycle',
            'start_date' => '2026-01-01',
            'end_date' => '2026-06-30',
            'status' => 'active',
        ])
        ->assertRedirect();

    expect($cycle->fresh()->title)->toBe('Updated Cycle');
});

// ── KPI Library CRUD ────────────────────────────────────

it('can list KPI library items', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.kpis.manage']);

    KpiLibrary::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'Revenue Growth',
        'code' => 'KPI-'.str()->random(4),
        'perspective' => 'financial',
        'target_type' => 'percentage',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get('/kpi-library')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Kpis/Index')
            ->has('kpis.data', 1)
        );
});

it('treats empty KPI library filters as all', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.kpis.manage']);

    KpiLibrary::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'Customer Retention',
        'code' => 'KPI-'.str()->random(4),
        'perspective' => 'customer',
        'target_type' => 'percentage',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get('/kpi-library?perspective=&is_active=')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Kpis/Index')
            ->has('kpis.data', 1)
            ->where('filters.perspective', 'all')
            ->where('filters.is_active', 'all')
        );
});

it('can create a KPI', function () {
    $user = User::factory()->create();
    grantBscPermissions($user, ['performance.kpis.manage']);

    $this->actingAs($user)
        ->post('/kpi-library', [
            'name' => 'Customer Satisfaction',
            'code' => 'CSAT-001',
            'perspective' => 'customer',
            'target_type' => 'percentage',
            'default_target' => 95,
            'default_weight' => 25,
            'description' => 'Customer satisfaction index',
            'is_active' => true,
        ])
        ->assertRedirect();

    expect(KpiLibrary::withoutGlobalScopes()->where('name', 'Customer Satisfaction')->exists())->toBeTrue();
});

// ── Scorecard Template CRUD ─────────────────────────────

it('can list scorecard templates', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.templates.manage']);

    ScorecardTemplate::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'Operations Template',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get('/scorecard-templates')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Templates/Index')
            ->has('templates.data', 1)
        );
});

it('treats empty scorecard template filters as all', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.templates.manage']);

    ScorecardTemplate::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'Leadership Template',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get('/scorecard-templates?is_active=')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Templates/Index')
            ->has('templates.data', 1)
            ->where('filters.is_active', 'all')
        );
});

it('can create a scorecard template with items', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.templates.manage']);

    $kpi = KpiLibrary::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'Revenue Growth',
        'code' => 'RG-'.str()->random(4),
        'perspective' => 'financial',
        'target_type' => 'percentage',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->post('/scorecard-templates', [
            'name' => 'Manager Template',
            'description' => 'Template for managers',
            'is_active' => true,
            'items' => [
                [
                    'kpi_library_id' => $kpi->id,
                    'perspective' => 'financial',
                    'objective' => 'Increase Revenue',
                    'kpi_name' => 'Revenue Growth',
                    'target_type' => 'percentage',
                    'target_value' => 10,
                    'weight' => 25,
                    'sort_order' => 1,
                ],
            ],
        ])
        ->assertRedirect();

    $template = ScorecardTemplate::withoutGlobalScopes()->where('name', 'Manager Template')->first();
    expect($template)->not->toBeNull();
    expect($template->items)->toHaveCount(1);
});

it('can view a scorecard template', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.templates.manage']);

    $template = ScorecardTemplate::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'name' => 'Balanced Template',
        'description' => 'Reusable template',
        'is_active' => true,
        'scope_type' => 'department',
        'scope_value' => 'Operations',
    ]);

    ScorecardTemplateItem::create([
        'scorecard_template_id' => $template->id,
        'perspective' => 'financial',
        'objective' => 'Improve margin',
        'kpi_name' => 'Gross Margin',
        'target_type' => 'percentage',
        'target_value' => 25,
        'weight' => 25,
        'sort_order' => 1,
    ]);

    $this->actingAs($user)
        ->get("/scorecard-templates/{$template->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Templates/Show')
            ->has('template')
            ->has('template.items', 1)
            ->where('template.items_count', 1)
        );
});

// ── Employee Scorecard CRUD ─────────────────────────────

it('can create an employee scorecard', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $this->actingAs($user)
        ->post('/employee-scorecards', [
            'employee_id' => $employee->id,
            'performance_cycle_id' => $cycle->id,
            'status' => 'draft',
            'notes' => 'Initial scorecard',
        ])
        ->assertRedirect();

    expect(EmployeeScorecard::withoutGlobalScopes()->where('employee_id', $employee->id)->exists())->toBeTrue();
});

it('can view an employee scorecard', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.view', 'performance.scorecards.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->get("/employee-scorecards/{$scorecard->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Scorecards/Show')
            ->has('scorecard')
            ->has('perspectiveBreakdown')
        );
});

it('can list employee scorecards', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.view']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->get('/employee-scorecards')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Scorecards/Index')
            ->has('scorecards.data', 1)
        );
});

it('treats empty employee scorecard filters as all', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.view']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->get('/employee-scorecards?cycle_id=&status=')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Scorecards/Index')
            ->has('scorecards.data', 1)
            ->where('filters.cycle_id', 'all')
            ->where('filters.status', 'all')
        );
});

// ── Weighted Score Calculation ──────────────────────────

it('calculates weighted overall score correctly', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'manager_reviewed',
    ]);

    // Financial perspective: 2 items
    EmployeeScorecardItem::create([
        'employee_scorecard_id' => $scorecard->id,
        'perspective' => 'financial',
        'objective' => 'Revenue Growth',
        'kpi_name' => 'Revenue %',
        'target_type' => 'percentage',
        'target_value' => 10,
        'weight' => 30,
        'score' => 80,
    ]);

    EmployeeScorecardItem::create([
        'employee_scorecard_id' => $scorecard->id,
        'perspective' => 'customer',
        'objective' => 'Customer Satisfaction',
        'kpi_name' => 'CSAT',
        'target_type' => 'percentage',
        'target_value' => 90,
        'weight' => 30,
        'score' => 90,
    ]);

    EmployeeScorecardItem::create([
        'employee_scorecard_id' => $scorecard->id,
        'perspective' => 'internal_process',
        'objective' => 'Process Efficiency',
        'kpi_name' => 'Cycle Time',
        'target_type' => 'numeric',
        'target_value' => 5,
        'weight' => 20,
        'score' => 70,
    ]);

    EmployeeScorecardItem::create([
        'employee_scorecard_id' => $scorecard->id,
        'perspective' => 'learning_and_growth',
        'objective' => 'Training Completion',
        'kpi_name' => 'Courses Completed',
        'target_type' => 'numeric',
        'target_value' => 10,
        'weight' => 20,
        'score' => 85,
    ]);

    $scorecard->load('items');
    $scorecard->calculateOverallScore();
    $scorecard->refresh();

    // Weighted: (80*30 + 90*30 + 70*20 + 85*20) / (30+30+20+20) = (2400+2700+1400+1700)/100 = 82.0
    expect((float) $scorecard->overall_score)->toBe(82.0);
    expect($scorecard->overall_rating)->toBe('Very Good');
});

// ── Self-Assessment Workflow ────────────────────────────

it('can submit self-assessment', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.self_assess', 'performance.scorecards.view', 'performance.scorecards.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'self_assessment_pending',
    ]);

    $item = EmployeeScorecardItem::create([
        'employee_scorecard_id' => $scorecard->id,
        'perspective' => 'financial',
        'objective' => 'Revenue Growth',
        'kpi_name' => 'Revenue %',
        'target_type' => 'percentage',
        'target_value' => 10,
        'weight' => 100,
    ]);

    $this->actingAs($user)
        ->post("/employee-scorecards/{$scorecard->id}/submit-self-assessment", [
            'items' => [
                [
                    'id' => $item->id,
                    'self_assessment_score' => 75,
                    'self_assessment_comment' => 'Met most targets.',
                ],
            ],
        ])
        ->assertRedirect();

    expect($scorecard->fresh()->status)->toBe('self_assessment_submitted');
    expect($item->fresh()->self_assessment_score)->toBe(75.0);
});

// ── Manager Review Workflow ─────────────────────────────

it('can submit manager review', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.review', 'performance.scorecards.view', 'performance.scorecards.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'self_assessment_submitted',
    ]);

    $item = EmployeeScorecardItem::create([
        'employee_scorecard_id' => $scorecard->id,
        'perspective' => 'financial',
        'objective' => 'Revenue Growth',
        'kpi_name' => 'Revenue %',
        'target_type' => 'percentage',
        'target_value' => 10,
        'weight' => 100,
    ]);

    $this->actingAs($user)
        ->post("/employee-scorecards/{$scorecard->id}/submit-manager-review", [
            'items' => [
                [
                    'id' => $item->id,
                    'manager_score' => 82,
                    'manager_comment' => 'Good performance overall.',
                ],
            ],
        ])
        ->assertRedirect();

    expect($scorecard->fresh()->status)->toBe('manager_reviewed');
    expect($item->fresh()->manager_score)->toBe(82.0);
});

// ── Finalization ────────────────────────────────────────

it('can finalize a scorecard', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.finalize', 'performance.scorecards.view', 'performance.scorecards.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'manager_reviewed',
        'overall_score' => 82.0,
        'overall_rating' => 'Very Good',
    ]);

    $this->actingAs($user)
        ->post("/employee-scorecards/{$scorecard->id}/finalize")
        ->assertRedirect();

    $fresh = $scorecard->fresh();
    expect($fresh->status)->toBe('finalized');
    expect($fresh->finalized_at)->not->toBeNull();
});

// ── Evidence Upload ─────────────────────────────────────

it('can upload evidence to a scorecard', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.manage', 'performance.scorecards.view']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->post("/employee-scorecards/{$scorecard->id}/evidence", [
            'file' => UploadedFile::fake()->create('proof.pdf', 512, 'application/pdf'),
            'description' => 'Achievement proof',
        ])
        ->assertRedirect();

    expect(PerformanceEvidence::where('employee_scorecard_id', $scorecard->id)->exists())->toBeTrue();
});

// ── Improvement Plan ────────────────────────────────────

it('can create an improvement plan', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.improvement_plans.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'finalized',
        'overall_score' => 35.0,
        'overall_rating' => 'Unsatisfactory',
    ]);

    $this->actingAs($user)
        ->post('/improvement-plans', [
            'employee_scorecard_id' => $scorecard->id,
            'employee_id' => $employee->id,
            'title' => 'Q1 Improvement Plan',
            'description' => 'Improve financial KPIs.',
            'start_date' => '2026-04-01',
            'end_date' => '2026-06-30',
            'status' => 'active',
        ])
        ->assertRedirect();

    expect(PerformanceImprovementPlan::withoutGlobalScopes()->where('title', 'Q1 Improvement Plan')->exists())->toBeTrue();
});

it('can list improvement plans', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.improvement_plans.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);
    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'finalized',
        'overall_score' => 45,
        'overall_rating' => 'Needs Improvement',
    ]);

    PerformanceImprovementPlan::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_scorecard_id' => $scorecard->id,
        'employee_id' => $employee->id,
        'title' => 'Recover Service Quality',
        'start_date' => '2026-04-01',
        'end_date' => '2026-06-30',
        'status' => 'active',
    ]);

    $this->actingAs($user)
        ->get('/improvement-plans')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/ImprovementPlans/Index')
            ->has('plans.data', 1)
        );
});

it('treats empty improvement plan filters as all', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.view', 'performance.improvement_plans.manage']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);
    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'finalized',
        'overall_score' => 35,
        'overall_rating' => 'Unsatisfactory',
    ]);

    PerformanceImprovementPlan::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_scorecard_id' => $scorecard->id,
        'employee_id' => $employee->id,
        'title' => 'Stabilize Delivery',
        'start_date' => '2026-04-01',
        'end_date' => '2026-06-30',
        'status' => 'active',
    ]);

    $this->actingAs($user)
        ->get('/improvement-plans?status=')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/ImprovementPlans/Index')
            ->has('plans.data', 1)
            ->where('filters.status', 'all')
        );
});

// ── Comments ────────────────────────────────────────────

it('can add a comment to a scorecard', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.manage', 'performance.scorecards.view']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->post("/employee-scorecards/{$scorecard->id}/comments", [
            'comment' => 'Looking good so far.',
            'type' => 'general',
        ])
        ->assertRedirect();

    expect(PerformanceComment::where('employee_scorecard_id', $scorecard->id)->exists())->toBeTrue();
});

// ── Dashboard ───────────────────────────────────────────

it('can view the performance dashboard', function () {
    $user = User::factory()->create();
    grantBscPermissions($user, ['performance.view', 'performance.dashboard.view']);

    $this->actingAs($user)
        ->get('/performance')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Performance/Dashboard')
            ->has('metrics')
            ->has('scoreDistribution')
            ->has('perspectiveAverages')
        );
});

// ── Authorization ───────────────────────────────────────

it('denies access to performance cycles without permission', function () {
    $user = User::factory()->create();
    grantBscPermissions($user, ['dashboard.view']);

    $this->actingAs($user)
        ->get('/performance-cycles')
        ->assertForbidden();
});

it('denies scorecard creation without permission', function () {
    $user = User::factory()->create();
    grantBscPermissions($user, ['performance.view']);

    $this->actingAs($user)
        ->get('/employee-scorecards/create')
        ->assertForbidden();
});

// ── Draft-only Deletion ─────────────────────────────────

it('prevents deleting non-draft scorecards', function () {
    $user = User::factory()->create();
    $organization = grantBscPermissions($user, ['performance.scorecards.manage', 'performance.scorecards.view']);
    $employee = createBscEmployee($organization);
    $cycle = createBscCycle($organization);

    $scorecard = EmployeeScorecard::withoutGlobalScopes()->create([
        'organization_id' => $organization->id,
        'employee_id' => $employee->id,
        'performance_cycle_id' => $cycle->id,
        'status' => 'finalized',
        'overall_score' => 82.0,
        'overall_rating' => 'Very Good',
    ]);

    $this->actingAs($user)
        ->delete("/employee-scorecards/{$scorecard->id}")
        ->assertRedirect();

    expect(EmployeeScorecard::withoutGlobalScopes()->find($scorecard->id))->not->toBeNull();
});

// ── Rating Band Mapping ─────────────────────────────────

it('maps scores to correct rating bands', function () {
    expect(EmployeeScorecard::ratingBandFor(95))->toBe('Outstanding');
    expect(EmployeeScorecard::ratingBandFor(82))->toBe('Very Good');
    expect(EmployeeScorecard::ratingBandFor(68))->toBe('Good');
    expect(EmployeeScorecard::ratingBandFor(52))->toBe('Needs Improvement');
    expect(EmployeeScorecard::ratingBandFor(30))->toBe('Unsatisfactory');
});
