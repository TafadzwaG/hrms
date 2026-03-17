<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeeScorecard;
use App\Models\EmployeeScorecardItem;
use App\Models\KpiLibrary;
use App\Models\PerformanceComment;
use App\Models\PerformanceCycle;
use App\Models\PerformanceImprovementPlan;
use App\Models\ScorecardTemplate;
use App\Models\ScorecardTemplateItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PerformanceManagementSeeder extends Seeder
{
    public function run(): void
    {
        $faker = fake();

        $defaultOrganizationId = Schema::hasTable('organizations')
            ? DB::table('organizations')->orderBy('id')->value('id')
            : null;

        if (! $defaultOrganizationId) {
            $this->command?->warn('No organization found. Seed organizations first.');
            return;
        }

        $employees = Employee::query()
            ->where('organization_id', $defaultOrganizationId)
            ->where('status', 'ACTIVE')
            ->with('user')
            ->get();

        if ($employees->isEmpty()) {
            $this->command?->warn('No active employees found. Seed employees first.');
            return;
        }

        $adminUser = User::query()
            ->where('current_organization_id', $defaultOrganizationId)
            ->first();

        $adminUserId = $adminUser?->id;

        DB::transaction(function () use ($faker, $defaultOrganizationId, $employees, $adminUserId) {

            // ── KPI Library ──────────────────────────────────────────
            $kpis = $this->seedKpiLibrary($defaultOrganizationId);
            $this->command?->info('Seeded ' . count($kpis) . ' KPI library items.');

            // ── Performance Cycles ───────────────────────────────────
            $cycles = $this->seedCycles($defaultOrganizationId, $adminUserId);
            $this->command?->info('Seeded ' . count($cycles) . ' performance cycles.');

            // ── Scorecard Templates ──────────────────────────────────
            $templates = $this->seedTemplates($defaultOrganizationId, $kpis);
            $this->command?->info('Seeded ' . count($templates) . ' scorecard templates.');

            // ── Employee Scorecards ──────────────────────────────────
            $scorecardCount = $this->seedScorecards(
                $defaultOrganizationId,
                $cycles,
                $templates,
                $employees,
                $adminUserId,
                $faker
            );
            $this->command?->info('Created ' . $scorecardCount . ' employee scorecards with items.');

            // ── Comments ─────────────────────────────────────────────
            $commentCount = $this->seedComments($defaultOrganizationId, $employees, $faker);
            $this->command?->info('Created ' . $commentCount . ' performance comments.');

            // ── Improvement Plans ────────────────────────────────────
            $pipCount = $this->seedImprovementPlans($defaultOrganizationId, $adminUserId, $faker);
            $this->command?->info('Created ' . $pipCount . ' improvement plans.');
        });

        $this->command?->info('PerformanceManagementSeeder completed successfully.');
    }

    // ── KPI Library ──────────────────────────────────────────────────

    private function seedKpiLibrary(int $organizationId): array
    {
        $kpiDefinitions = [
            // ── Financial ──
            [
                'name' => 'Revenue Growth',
                'code' => 'FIN-REV',
                'perspective' => 'financial',
                'description' => 'Year-over-year revenue growth percentage',
                'target_type' => 'percentage',
                'default_target' => 15.00,
                'default_weight' => 8.00,
                'unit' => '%',
            ],
            [
                'name' => 'Cost Reduction',
                'code' => 'FIN-CST',
                'perspective' => 'financial',
                'description' => 'Operational cost reduction achieved',
                'target_type' => 'percentage',
                'default_target' => 10.00,
                'default_weight' => 6.00,
                'unit' => '%',
            ],
            [
                'name' => 'Budget Adherence',
                'code' => 'FIN-BUD',
                'perspective' => 'financial',
                'description' => 'Percentage of budget utilised within approved limits',
                'target_type' => 'percentage',
                'default_target' => 95.00,
                'default_weight' => 5.00,
                'unit' => '%',
            ],
            [
                'name' => 'Return on Investment',
                'code' => 'FIN-ROI',
                'perspective' => 'financial',
                'description' => 'ROI on department initiatives',
                'target_type' => 'percentage',
                'default_target' => 20.00,
                'default_weight' => 6.00,
                'unit' => '%',
            ],

            // ── Customer / Stakeholder ──
            [
                'name' => 'Customer Satisfaction Score',
                'code' => 'CUS-SAT',
                'perspective' => 'customer',
                'description' => 'Average customer satisfaction survey rating',
                'target_type' => 'rating_scale',
                'default_target' => 4.00,
                'default_weight' => 8.00,
                'unit' => '/5',
            ],
            [
                'name' => 'Customer Retention Rate',
                'code' => 'CUS-RET',
                'perspective' => 'customer',
                'description' => 'Percentage of clients retained year-over-year',
                'target_type' => 'percentage',
                'default_target' => 90.00,
                'default_weight' => 6.00,
                'unit' => '%',
            ],
            [
                'name' => 'Net Promoter Score',
                'code' => 'CUS-NPS',
                'perspective' => 'customer',
                'description' => 'Willingness of customers to recommend services',
                'target_type' => 'numeric',
                'default_target' => 50.00,
                'default_weight' => 5.00,
                'unit' => 'score',
            ],
            [
                'name' => 'Client Complaint Resolution',
                'code' => 'CUS-CMP',
                'perspective' => 'customer',
                'description' => 'Percentage of complaints resolved within SLA',
                'target_type' => 'percentage',
                'default_target' => 95.00,
                'default_weight' => 6.00,
                'unit' => '%',
            ],

            // ── Internal Process ──
            [
                'name' => 'Process Compliance Rate',
                'code' => 'INT-CMP',
                'perspective' => 'internal_process',
                'description' => 'Adherence to standard operating procedures',
                'target_type' => 'percentage',
                'default_target' => 98.00,
                'default_weight' => 6.00,
                'unit' => '%',
            ],
            [
                'name' => 'Project Delivery On Time',
                'code' => 'INT-DEL',
                'perspective' => 'internal_process',
                'description' => 'Percentage of projects delivered within deadline',
                'target_type' => 'percentage',
                'default_target' => 85.00,
                'default_weight' => 7.00,
                'unit' => '%',
            ],
            [
                'name' => 'Report Submission Timeliness',
                'code' => 'INT-RPT',
                'perspective' => 'internal_process',
                'description' => 'Monthly/quarterly reports submitted on time',
                'target_type' => 'yes_no',
                'default_target' => 1.00,
                'default_weight' => 4.00,
                'unit' => 'Y/N',
            ],
            [
                'name' => 'Error / Defect Rate',
                'code' => 'INT-ERR',
                'perspective' => 'internal_process',
                'description' => 'Percentage of work output free from errors',
                'target_type' => 'percentage',
                'default_target' => 98.00,
                'default_weight' => 5.00,
                'unit' => '%',
            ],
            [
                'name' => 'SLA Achievement Rate',
                'code' => 'INT-SLA',
                'perspective' => 'internal_process',
                'description' => 'Service level agreements met on time',
                'target_type' => 'percentage',
                'default_target' => 95.00,
                'default_weight' => 5.00,
                'unit' => '%',
            ],

            // ── Learning & Growth ──
            [
                'name' => 'Training Hours Completed',
                'code' => 'LNG-TRN',
                'perspective' => 'learning_and_growth',
                'description' => 'Hours of professional development completed',
                'target_type' => 'numeric',
                'default_target' => 40.00,
                'default_weight' => 5.00,
                'unit' => 'hours',
            ],
            [
                'name' => 'Certifications Obtained',
                'code' => 'LNG-CRT',
                'perspective' => 'learning_and_growth',
                'description' => 'Number of professional certifications achieved',
                'target_type' => 'numeric',
                'default_target' => 1.00,
                'default_weight' => 4.00,
                'unit' => 'count',
            ],
            [
                'name' => 'Knowledge Sharing Sessions',
                'code' => 'LNG-KSH',
                'perspective' => 'learning_and_growth',
                'description' => 'Number of sessions presented to colleagues',
                'target_type' => 'numeric',
                'default_target' => 4.00,
                'default_weight' => 4.00,
                'unit' => 'sessions',
            ],
            [
                'name' => 'Employee Engagement Score',
                'code' => 'LNG-ENG',
                'perspective' => 'learning_and_growth',
                'description' => 'Self/peer engagement survey score',
                'target_type' => 'rating_scale',
                'default_target' => 4.00,
                'default_weight' => 5.00,
                'unit' => '/5',
            ],
            [
                'name' => 'Innovation Initiatives',
                'code' => 'LNG-INN',
                'perspective' => 'learning_and_growth',
                'description' => 'Number of improvement ideas submitted or implemented',
                'target_type' => 'numeric',
                'default_target' => 2.00,
                'default_weight' => 3.00,
                'unit' => 'count',
            ],
            [
                'name' => 'Mentoring / Coaching',
                'code' => 'LNG-MNT',
                'perspective' => 'learning_and_growth',
                'description' => 'Active participation in mentoring programmes',
                'target_type' => 'yes_no',
                'default_target' => 1.00,
                'default_weight' => 3.00,
                'unit' => 'Y/N',
            ],
        ];

        $kpiIds = [];

        foreach ($kpiDefinitions as $def) {
            $kpi = KpiLibrary::query()->updateOrCreate(
                ['organization_id' => $organizationId, 'code' => $def['code']],
                array_merge($def, [
                    'organization_id' => $organizationId,
                    'is_active' => true,
                ])
            );

            $kpiIds[$def['code']] = $kpi->id;
        }

        return $kpiIds;
    }

    // ── Performance Cycles ───────────────────────────────────────────

    private function seedCycles(int $organizationId, ?int $adminUserId): array
    {
        $cycleDefinitions = [
            [
                'title' => 'FY2024 Annual Review',
                'description' => 'Annual performance review for financial year 2024 (Jan - Dec 2024)',
                'start_date' => '2024-01-01',
                'end_date' => '2024-12-31',
                'status' => 'archived',
                'self_assessment_enabled' => true,
            ],
            [
                'title' => 'FY2025 Annual Review',
                'description' => 'Annual performance review for financial year 2025 (Jan - Dec 2025)',
                'start_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'status' => 'finalized',
                'self_assessment_enabled' => true,
            ],
            [
                'title' => 'FY2026 H1 Mid-Year Review',
                'description' => 'Mid-year review covering January to June 2026',
                'start_date' => '2026-01-01',
                'end_date' => '2026-06-30',
                'status' => 'review_in_progress',
                'self_assessment_enabled' => true,
            ],
            [
                'title' => 'FY2026 Annual Review',
                'description' => 'Annual performance review for financial year 2026 (Jan - Dec 2026)',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'status' => 'active',
                'self_assessment_enabled' => true,
            ],
            [
                'title' => 'FY2026 Q1 Probation Review',
                'description' => 'Quarterly probation review for new hires in Q1 2026',
                'start_date' => '2026-01-01',
                'end_date' => '2026-03-31',
                'status' => 'finalized',
                'self_assessment_enabled' => false,
            ],
        ];

        $cycles = [];

        foreach ($cycleDefinitions as $def) {
            $cycle = PerformanceCycle::query()->updateOrCreate(
                ['organization_id' => $organizationId, 'title' => $def['title']],
                array_merge($def, [
                    'organization_id' => $organizationId,
                    'created_by' => $adminUserId,
                ])
            );

            $cycles[$def['title']] = $cycle;
        }

        return $cycles;
    }

    // ── Scorecard Templates ──────────────────────────────────────────

    private function seedTemplates(int $organizationId, array $kpiIds): array
    {
        $templates = [];

        // ── General Employee Template ──
        $generalTemplate = ScorecardTemplate::query()->updateOrCreate(
            ['organization_id' => $organizationId, 'name' => 'General Employee Scorecard'],
            [
                'organization_id' => $organizationId,
                'name' => 'General Employee Scorecard',
                'description' => 'Standard balanced scorecard template for all employees',
                'is_active' => true,
                'scope_type' => 'organization',
                'scope_value' => null,
            ]
        );

        $this->syncTemplateItems($generalTemplate, [
            // Financial 25%
            ['code' => 'FIN-BUD', 'objective' => 'Manage department budget effectively', 'weight' => 10.00],
            ['code' => 'FIN-CST', 'objective' => 'Identify and implement cost savings', 'weight' => 8.00],
            ['code' => 'FIN-REV', 'objective' => 'Contribute to revenue growth targets', 'weight' => 7.00],
            // Customer 25%
            ['code' => 'CUS-SAT', 'objective' => 'Maintain high stakeholder satisfaction', 'weight' => 10.00],
            ['code' => 'CUS-CMP', 'objective' => 'Resolve complaints within SLA', 'weight' => 8.00],
            ['code' => 'CUS-RET', 'objective' => 'Retain existing clients and relationships', 'weight' => 7.00],
            // Internal Process 25%
            ['code' => 'INT-DEL', 'objective' => 'Deliver projects and tasks on schedule', 'weight' => 8.00],
            ['code' => 'INT-CMP', 'objective' => 'Follow standard operating procedures', 'weight' => 6.00],
            ['code' => 'INT-ERR', 'objective' => 'Maintain quality output with minimal errors', 'weight' => 6.00],
            ['code' => 'INT-RPT', 'objective' => 'Submit all reports on time', 'weight' => 5.00],
            // Learning & Growth 25%
            ['code' => 'LNG-TRN', 'objective' => 'Complete required training hours', 'weight' => 8.00],
            ['code' => 'LNG-ENG', 'objective' => 'Actively engage with team and culture', 'weight' => 6.00],
            ['code' => 'LNG-KSH', 'objective' => 'Share knowledge with colleagues', 'weight' => 6.00],
            ['code' => 'LNG-INN', 'objective' => 'Propose improvement initiatives', 'weight' => 5.00],
        ], $kpiIds);

        $templates['general'] = $generalTemplate;

        // ── Management Template ──
        $mgmtTemplate = ScorecardTemplate::query()->updateOrCreate(
            ['organization_id' => $organizationId, 'name' => 'Management Scorecard'],
            [
                'organization_id' => $organizationId,
                'name' => 'Management Scorecard',
                'description' => 'Balanced scorecard for managers and team leads with leadership KPIs',
                'is_active' => true,
                'scope_type' => 'organization',
                'scope_value' => null,
            ]
        );

        $this->syncTemplateItems($mgmtTemplate, [
            // Financial 30%
            ['code' => 'FIN-REV', 'objective' => 'Drive revenue growth for business unit', 'weight' => 10.00],
            ['code' => 'FIN-ROI', 'objective' => 'Ensure strong ROI on department initiatives', 'weight' => 10.00],
            ['code' => 'FIN-BUD', 'objective' => 'Manage and control department budget', 'weight' => 10.00],
            // Customer 25%
            ['code' => 'CUS-SAT', 'objective' => 'Achieve excellent client satisfaction scores', 'weight' => 10.00],
            ['code' => 'CUS-NPS', 'objective' => 'Improve Net Promoter Score', 'weight' => 8.00],
            ['code' => 'CUS-RET', 'objective' => 'Maintain high client retention', 'weight' => 7.00],
            // Internal Process 25%
            ['code' => 'INT-DEL', 'objective' => 'Ensure team delivers on time', 'weight' => 8.00],
            ['code' => 'INT-SLA', 'objective' => 'Meet all service level agreements', 'weight' => 7.00],
            ['code' => 'INT-CMP', 'objective' => 'Enforce process compliance in team', 'weight' => 5.00],
            ['code' => 'INT-ERR', 'objective' => 'Reduce errors across team output', 'weight' => 5.00],
            // Learning & Growth 20%
            ['code' => 'LNG-MNT', 'objective' => 'Mentor and coach junior team members', 'weight' => 7.00],
            ['code' => 'LNG-TRN', 'objective' => 'Ensure team completes development plans', 'weight' => 7.00],
            ['code' => 'LNG-CRT', 'objective' => 'Obtain or maintain professional certification', 'weight' => 6.00],
        ], $kpiIds);

        $templates['management'] = $mgmtTemplate;

        // ── IT Department Template ──
        $itTemplate = ScorecardTemplate::query()->updateOrCreate(
            ['organization_id' => $organizationId, 'name' => 'IT Department Scorecard'],
            [
                'organization_id' => $organizationId,
                'name' => 'IT Department Scorecard',
                'description' => 'Scorecard tailored for IT department employees',
                'is_active' => true,
                'scope_type' => 'department',
                'scope_value' => 'IT',
            ]
        );

        $this->syncTemplateItems($itTemplate, [
            // Financial 20%
            ['code' => 'FIN-BUD', 'objective' => 'Manage IT budget and licensing costs', 'weight' => 10.00],
            ['code' => 'FIN-CST', 'objective' => 'Optimise infrastructure costs', 'weight' => 10.00],
            // Customer 25%
            ['code' => 'CUS-SAT', 'objective' => 'Maintain high internal user satisfaction', 'weight' => 10.00],
            ['code' => 'CUS-CMP', 'objective' => 'Resolve helpdesk tickets within SLA', 'weight' => 8.00],
            ['code' => 'CUS-NPS', 'objective' => 'Improve IT service perception', 'weight' => 7.00],
            // Internal Process 30%
            ['code' => 'INT-SLA', 'objective' => 'Maintain 99.9% system uptime', 'weight' => 10.00],
            ['code' => 'INT-DEL', 'objective' => 'Deliver IT projects on time and within scope', 'weight' => 8.00],
            ['code' => 'INT-ERR', 'objective' => 'Minimise production incidents', 'weight' => 7.00],
            ['code' => 'INT-CMP', 'objective' => 'Follow IT change management procedures', 'weight' => 5.00],
            // Learning & Growth 25%
            ['code' => 'LNG-CRT', 'objective' => 'Obtain technical certifications', 'weight' => 8.00],
            ['code' => 'LNG-TRN', 'objective' => 'Complete technology training hours', 'weight' => 7.00],
            ['code' => 'LNG-INN', 'objective' => 'Propose and pilot new technologies', 'weight' => 5.00],
            ['code' => 'LNG-KSH', 'objective' => 'Conduct tech lunch-and-learns', 'weight' => 5.00],
        ], $kpiIds);

        $templates['it'] = $itTemplate;

        return $templates;
    }

    private function syncTemplateItems(ScorecardTemplate $template, array $items, array $kpiIds): void
    {
        // Delete existing items to avoid duplicates on re-run
        $template->items()->delete();

        $sortOrder = 0;

        foreach ($items as $item) {
            $kpiId = $kpiIds[$item['code']] ?? null;
            $kpi = $kpiId ? KpiLibrary::find($kpiId) : null;

            ScorecardTemplateItem::query()->create([
                'scorecard_template_id' => $template->id,
                'kpi_library_id' => $kpiId,
                'perspective' => $kpi?->perspective ?? 'financial',
                'objective' => $item['objective'],
                'kpi_name' => $kpi?->name ?? $item['code'],
                'target_type' => $kpi?->target_type ?? 'percentage',
                'target_value' => $kpi?->default_target ?? 100.00,
                'weight' => $item['weight'],
                'sort_order' => $sortOrder++,
            ]);
        }
    }

    // ── Employee Scorecards ──────────────────────────────────────────

    private function seedScorecards(
        int    $organizationId,
        array  $cycles,
        array  $templates,
        $employees,
        ?int   $adminUserId,
        $faker
    ): int {
        $count = 0;

        // Define which cycles get scorecards and in what status
        $cycleConfig = [
            'FY2024 Annual Review' => ['template' => 'general', 'statuses' => ['finalized', 'archived']],
            'FY2025 Annual Review' => ['template' => 'general', 'statuses' => ['finalized']],
            'FY2026 H1 Mid-Year Review' => ['template' => 'general', 'statuses' => ['self_assessment_submitted', 'manager_review_pending', 'manager_reviewed']],
            'FY2026 Annual Review' => ['template' => 'general', 'statuses' => ['draft', 'self_assessment_pending']],
            'FY2026 Q1 Probation Review' => ['template' => 'management', 'statuses' => ['finalized']],
        ];

        foreach ($cycleConfig as $cycleTitle => $config) {
            $cycle = $cycles[$cycleTitle] ?? null;
            if (! $cycle) continue;

            $template = $templates[$config['template']] ?? $templates['general'];
            $templateItems = ScorecardTemplateItem::query()
                ->where('scorecard_template_id', $template->id)
                ->orderBy('sort_order')
                ->get();

            // Assign scorecards to employees
            $employeeSubset = $cycleTitle === 'FY2026 Q1 Probation Review'
                ? $employees->take(2)  // Only 2 employees for probation
                : $employees;

            $statusIndex = 0;

            foreach ($employeeSubset as $employee) {
                $status = $config['statuses'][$statusIndex % count($config['statuses'])];
                $statusIndex++;

                $scorecard = EmployeeScorecard::query()->updateOrCreate(
                    [
                        'organization_id' => $organizationId,
                        'performance_cycle_id' => $cycle->id,
                        'employee_id' => $employee->id,
                    ],
                    [
                        'organization_id' => $organizationId,
                        'performance_cycle_id' => $cycle->id,
                        'employee_id' => $employee->id,
                        'scorecard_template_id' => $template->id,
                        'status' => $status,
                        'notes' => null,
                        'created_by' => $adminUserId,
                    ]
                );

                // Create scorecard items from template
                if ($scorecard->items()->count() === 0) {
                    $this->createScorecardItems($scorecard, $templateItems, $status, $faker);
                }

                // Calculate scores for scorecards that have progressed
                if (in_array($status, ['self_assessment_submitted', 'manager_review_pending', 'manager_reviewed', 'finalized', 'archived'])) {
                    $this->populateScores($scorecard, $status, $faker);
                    $scorecard->calculateOverallScore();

                    // Set timestamps based on status
                    $updates = [];
                    if (in_array($status, ['self_assessment_submitted', 'manager_review_pending', 'manager_reviewed', 'finalized', 'archived'])) {
                        $updates['self_assessment_completed_at'] = $faker->dateTimeBetween($cycle->start_date, 'now');
                    }
                    if (in_array($status, ['manager_reviewed', 'finalized', 'archived'])) {
                        $updates['manager_review_completed_at'] = $faker->dateTimeBetween($cycle->start_date, 'now');
                    }
                    if (in_array($status, ['finalized', 'archived'])) {
                        $updates['finalized_at'] = $faker->dateTimeBetween($cycle->start_date, 'now');
                        $updates['finalized_by'] = $adminUserId;
                    }
                    if (! empty($updates)) {
                        $scorecard->update($updates);
                    }
                }

                $count++;
            }
        }

        return $count;
    }

    private function createScorecardItems(
        EmployeeScorecard $scorecard,
        $templateItems,
        string $status,
        $faker
    ): void {
        $sortOrder = 0;

        foreach ($templateItems as $templateItem) {
            EmployeeScorecardItem::query()->create([
                'employee_scorecard_id' => $scorecard->id,
                'kpi_library_id' => $templateItem->kpi_library_id,
                'perspective' => $templateItem->perspective,
                'objective' => $templateItem->objective,
                'kpi_name' => $templateItem->kpi_name,
                'target_type' => $templateItem->target_type,
                'target_value' => $templateItem->target_value,
                'actual_value' => null,
                'score' => null,
                'weight' => $templateItem->weight,
                'self_assessment_score' => null,
                'self_assessment_comment' => null,
                'manager_score' => null,
                'manager_comment' => null,
                'sort_order' => $sortOrder++,
            ]);
        }
    }

    private function populateScores(EmployeeScorecard $scorecard, string $status, $faker): void
    {
        $items = $scorecard->items;

        foreach ($items as $item) {
            $updates = [];

            // Generate realistic actual values based on target type
            $targetValue = (float) $item->target_value;

            $actualValue = match ($item->target_type) {
                'percentage' => $faker->randomFloat(2, $targetValue * 0.6, min($targetValue * 1.15, 100)),
                'numeric' => $faker->randomFloat(2, $targetValue * 0.5, $targetValue * 1.3),
                'yes_no' => $faker->boolean(80) ? 1.00 : 0.00,
                'rating_scale' => $faker->randomFloat(2, 2.5, 5.0),
                default => $faker->randomFloat(2, $targetValue * 0.6, $targetValue * 1.1),
            };

            $updates['actual_value'] = $actualValue;

            // Self-assessment
            if (in_array($status, ['self_assessment_submitted', 'manager_review_pending', 'manager_reviewed', 'finalized', 'archived'])) {
                $selfScore = match ($item->target_type) {
                    'percentage' => $targetValue > 0 ? ($actualValue / $targetValue) * 100 : 0,
                    'numeric' => $targetValue > 0 ? min(($actualValue / $targetValue) * 100, 100) : 0,
                    'yes_no' => $actualValue >= 1 ? 100 : 0,
                    'rating_scale' => ($actualValue / 5) * 100,
                    default => $faker->randomFloat(2, 50, 95),
                };

                // Employees tend to rate themselves a bit higher
                $selfScore = min(100, $selfScore * $faker->randomFloat(2, 1.0, 1.1));

                $updates['self_assessment_score'] = round($selfScore, 2);
                $updates['self_assessment_comment'] = $faker->randomElement([
                    'I believe I have met the target requirements for this period.',
                    'Strong progress made. Exceeded expectations in several areas.',
                    'Achieved target through consistent effort and teamwork.',
                    'Good progress. Some challenges encountered but managed effectively.',
                    'Partially achieved. Will focus on improvement in the next cycle.',
                    'Exceeded target. Implemented new approaches that delivered results.',
                    'On track with targets. Supporting documentation attached.',
                ]);
            }

            // Manager review
            if (in_array($status, ['manager_reviewed', 'finalized', 'archived'])) {
                // Managers are slightly more conservative
                $managerScore = match ($item->target_type) {
                    'percentage' => $targetValue > 0 ? ($actualValue / $targetValue) * 100 : 0,
                    'numeric' => $targetValue > 0 ? min(($actualValue / $targetValue) * 100, 100) : 0,
                    'yes_no' => $actualValue >= 1 ? 100 : 0,
                    'rating_scale' => ($actualValue / 5) * 100,
                    default => $faker->randomFloat(2, 45, 90),
                };

                $managerScore = min(100, $managerScore * $faker->randomFloat(2, 0.9, 1.05));

                $updates['manager_score'] = round($managerScore, 2);
                $updates['manager_comment'] = $faker->randomElement([
                    'Good performance overall. Consistent delivery throughout the period.',
                    'Meets expectations. Some room for improvement in timeliness.',
                    'Excellent work. Demonstrates strong commitment to objectives.',
                    'Satisfactory progress. Recommend additional support in upcoming cycle.',
                    'Below target. Discussed improvement plan in one-on-one.',
                    'Above average performance. Key contributor to team success.',
                    'Solid output. Recommend continued development in this area.',
                ]);

                // Final score is manager score for finalized
                $updates['score'] = $updates['manager_score'];
            } elseif (in_array($status, ['self_assessment_submitted', 'manager_review_pending'])) {
                // Use self-assessment as interim score
                $updates['score'] = $updates['self_assessment_score'] ?? null;
            }

            $item->update($updates);
        }
    }

    // ── Comments ─────────────────────────────────────────────────────

    private function seedComments(int $organizationId, $employees, $faker): int
    {
        $count = 0;

        // Add comments to finalized and in-progress scorecards
        $scorecards = EmployeeScorecard::query()
            ->where('organization_id', $organizationId)
            ->whereIn('status', ['self_assessment_submitted', 'manager_reviewed', 'finalized'])
            ->with('employee.user')
            ->get();

        foreach ($scorecards as $scorecard) {
            $employeeUserId = $scorecard->employee?->user_id;

            // Self-assessment comment
            if ($scorecard->self_assessment_completed_at && $employeeUserId) {
                PerformanceComment::query()->firstOrCreate(
                    [
                        'employee_scorecard_id' => $scorecard->id,
                        'type' => 'self_assessment',
                        'user_id' => $employeeUserId,
                    ],
                    [
                        'employee_scorecard_id' => $scorecard->id,
                        'user_id' => $employeeUserId,
                        'comment' => $faker->randomElement([
                            'I have completed my self-assessment based on documented evidence and actual results for this review period.',
                            'Self-assessment completed. I am confident the targets were largely met. Evidence has been uploaded where applicable.',
                            'I have reviewed my performance against all KPIs and provided honest scores with supporting comments.',
                        ]),
                        'type' => 'self_assessment',
                    ]
                );
                $count++;
            }

            // Manager review comment
            if ($scorecard->manager_review_completed_at) {
                $managerId = $scorecard->employee?->manager_id;
                $managerUserId = $managerId
                    ? Employee::find($managerId)?->user_id
                    : null;

                if ($managerUserId) {
                    PerformanceComment::query()->firstOrCreate(
                        [
                            'employee_scorecard_id' => $scorecard->id,
                            'type' => 'manager_review',
                            'user_id' => $managerUserId,
                        ],
                        [
                            'employee_scorecard_id' => $scorecard->id,
                            'user_id' => $managerUserId,
                            'comment' => $faker->randomElement([
                                'Review completed. Overall a solid performance this cycle. Discussed development areas in our 1-on-1.',
                                'Manager review done. Employee has shown good progress. Recommending continued focus on process compliance.',
                                'Reviewed all KPIs with employee. Scores adjusted to reflect actual verified results.',
                            ]),
                            'type' => 'manager_review',
                        ]
                    );
                    $count++;
                }
            }

            // General feedback on some finalized scorecards
            if ($scorecard->status === 'finalized' && $faker->boolean(60)) {
                PerformanceComment::query()->firstOrCreate(
                    [
                        'employee_scorecard_id' => $scorecard->id,
                        'type' => 'feedback',
                    ],
                    [
                        'employee_scorecard_id' => $scorecard->id,
                        'user_id' => $employeeUserId,
                        'comment' => $faker->randomElement([
                            'Thank you for the feedback. I will work on the improvement areas identified.',
                            'Acknowledged. Looking forward to applying the development plan in the next cycle.',
                            'Fair assessment. Will focus on the areas highlighted for growth.',
                        ]),
                        'type' => 'feedback',
                    ]
                );
                $count++;
            }
        }

        return $count;
    }

    // ── Improvement Plans ────────────────────────────────────────────

    private function seedImprovementPlans(int $organizationId, ?int $adminUserId, $faker): int
    {
        $count = 0;

        // Find finalized scorecards with low scores (Needs Improvement or Unsatisfactory)
        $lowScorecards = EmployeeScorecard::query()
            ->where('organization_id', $organizationId)
            ->whereIn('status', ['finalized', 'archived'])
            ->whereIn('overall_rating', ['Needs Improvement', 'Unsatisfactory'])
            ->with('employee')
            ->get();

        foreach ($lowScorecards as $scorecard) {
            $employee = $scorecard->employee;
            if (! $employee) continue;

            PerformanceImprovementPlan::query()->firstOrCreate(
                [
                    'organization_id' => $organizationId,
                    'employee_scorecard_id' => $scorecard->id,
                    'employee_id' => $employee->id,
                ],
                [
                    'organization_id' => $organizationId,
                    'employee_scorecard_id' => $scorecard->id,
                    'employee_id' => $employee->id,
                    'title' => 'Performance Improvement Plan - ' . $employee->first_name . ' ' . $employee->surname,
                    'description' => 'This improvement plan has been created following the ' . ($scorecard->cycle?->title ?? 'review cycle') . ' performance review where the employee scored below expectations.',
                    'objectives' => implode("\n", [
                        '1. Improve delivery timeliness to meet at least 85% on-time target',
                        '2. Complete all outstanding training requirements within 60 days',
                        '3. Achieve a minimum of "Good" rating in the next review period',
                        '4. Attend weekly check-ins with line manager to track progress',
                    ]),
                    'support_required' => implode("\n", [
                        '- Weekly 1-on-1 coaching sessions with line manager',
                        '- Access to relevant online training courses',
                        '- Mentorship pairing with a senior team member',
                        '- Reduced project load during the first 30 days to focus on development',
                    ]),
                    'start_date' => now()->subMonths(1)->format('Y-m-d'),
                    'end_date' => now()->addMonths(2)->format('Y-m-d'),
                    'status' => $faker->randomElement(['active', 'on_track']),
                    'outcome' => null,
                    'created_by' => $adminUserId,
                    'completed_at' => null,
                ]
            );

            $count++;
        }

        // Also create a completed PIP for historical data
        $goodScorecards = EmployeeScorecard::query()
            ->where('organization_id', $organizationId)
            ->where('status', 'finalized')
            ->whereIn('overall_rating', ['Good', 'Very Good'])
            ->with('employee')
            ->limit(1)
            ->get();

        foreach ($goodScorecards as $scorecard) {
            $employee = $scorecard->employee;
            if (! $employee) continue;

            // Check this employee doesn't already have a PIP for this scorecard
            $exists = PerformanceImprovementPlan::query()
                ->where('employee_scorecard_id', $scorecard->id)
                ->exists();

            if (! $exists) {
                PerformanceImprovementPlan::query()->create([
                    'organization_id' => $organizationId,
                    'employee_scorecard_id' => $scorecard->id,
                    'employee_id' => $employee->id,
                    'title' => 'Completed PIP - ' . $employee->first_name . ' ' . $employee->surname,
                    'description' => 'Historical improvement plan that was successfully completed. Employee improved performance significantly.',
                    'objectives' => implode("\n", [
                        '1. Improve customer satisfaction scores to above 80%',
                        '2. Complete project management certification',
                        '3. Reduce error rate to below 2%',
                    ]),
                    'support_required' => '- Manager coaching and training budget allocation',
                    'start_date' => now()->subMonths(6)->format('Y-m-d'),
                    'end_date' => now()->subMonths(3)->format('Y-m-d'),
                    'status' => 'completed',
                    'outcome' => 'Employee successfully completed all PIP objectives. Performance improved from "Needs Improvement" to "Good" in subsequent review.',
                    'created_by' => $adminUserId,
                    'completed_at' => now()->subMonths(3),
                ]);

                $count++;
            }
        }

        return $count;
    }
}
