# Performance Management Module - Balanced Scorecard

## Overview

The Performance Management module implements a **Balanced Scorecard (BSC)** approach to employee performance evaluation. It supports the four standard BSC perspectives, weighted KPI scoring, multi-step review workflows, and performance improvement plans.

## Balanced Scorecard Perspectives

| Key | Label |
|-----|-------|
| `financial` | Financial |
| `customer` | Customer / Stakeholder |
| `internal_process` | Internal Process |
| `learning_and_growth` | Learning & Growth |

Each perspective can contain multiple KPIs with individual targets, weights, and scores that roll up into an overall employee performance score.

## Database Schema

### Tables Created

| Table | Description |
|-------|-------------|
| `performance_cycles` | Review periods with start/end dates and status |
| `kpi_library` | Reusable KPI definitions with perspectives and target types |
| `scorecard_templates` | Pre-configured scorecard layouts with KPI items |
| `scorecard_template_items` | Individual KPI rows within a template |
| `employee_scorecards` | Per-employee, per-cycle scorecard instances |
| `employee_scorecard_items` | Individual KPI entries on a scorecard with targets, actuals, scores |
| `performance_comments` | Typed comments on scorecards (general, self_assessment, manager, hr) |
| `performance_evidence` | File attachments linked to scorecards or specific items |
| `performance_improvement_plans` | PIPs for employees with low performance ratings |

### Modified Tables

| Table | Changes |
|-------|---------|
| `performance_reviews` | Added `organization_id`, `performance_cycle_id`, `employee_scorecard_id` columns |

## Model Relationships

```
PerformanceCycle
  ├── hasMany EmployeeScorecard
  └── belongsTo User (creator)

ScorecardTemplate
  ├── hasMany ScorecardTemplateItem
  └── hasMany EmployeeScorecard

EmployeeScorecard
  ├── belongsTo Employee
  ├── belongsTo PerformanceCycle
  ├── belongsTo ScorecardTemplate (optional)
  ├── hasMany EmployeeScorecardItem
  ├── hasMany PerformanceComment
  ├── hasMany PerformanceEvidence
  └── hasOne PerformanceImprovementPlan

Employee
  ├── hasMany EmployeeScorecard (scorecards)
  ├── hasOne EmployeeScorecard (currentScorecard - latest)
  └── hasMany PerformanceImprovementPlan
```

## Scoring Model

### Weighted Score Calculation

1. Each KPI item has a `weight` (0-100) and a `score` (0-100)
2. The overall score is calculated as a weighted average:
   ```
   overall_score = SUM(item.score * item.weight) / SUM(item.weight)
   ```
3. Scores are calculated per perspective and then rolled up

### Rating Bands

| Band | Score Range |
|------|------------|
| Outstanding | 90 - 100 |
| Very Good | 75 - 89 |
| Good | 60 - 74 |
| Needs Improvement | 45 - 59 |
| Unsatisfactory | 0 - 44 |

### KPI Target Types

| Type | Description |
|------|-------------|
| `percentage` | Percentage-based target (e.g., 95%) |
| `numeric` | Numeric target (e.g., 1000 units) |
| `yes_no` | Binary achievement (0 or 100) |
| `rating_scale` | Rating on a defined scale |
| `currency` | Monetary target |
| `text` | Qualitative with manual scoring |

## Review Workflow

### Scorecard Statuses

```
draft
  -> self_assessment_pending
    -> self_assessment_submitted
      -> manager_review_pending
        -> manager_reviewed
          -> hr_moderation_pending
            -> finalized
              -> archived
```

### Workflow Steps

1. **HR creates review cycle** - Defines period with title, dates, and status
2. **HR/managers create templates** - Define KPIs by perspective with weights
3. **Scorecards assigned to employees** - Optionally from a template
4. **Employee self-assessment** - Employee scores their own KPIs with comments
5. **Manager review** - Manager scores KPIs, adjusts if needed, adds comments
6. **HR moderation** (optional) - HR reviews and moderates scores
7. **Finalization** - Scorecard is locked with final score and rating
8. **Improvement plans** - Created for employees with low ratings

## Controllers

| Controller | Purpose |
|------------|---------|
| `PerformanceDashboardController` | Dashboard metrics, score distribution, perspective averages |
| `PerformanceCycleController` | CRUD for review cycles |
| `KpiLibraryController` | CRUD for KPI definitions |
| `ScorecardTemplateController` | CRUD for templates with nested items |
| `EmployeeScorecardController` | Scorecard CRUD, workflow actions, evidence, comments |
| `PerformanceImprovementPlanController` | CRUD for PIPs |
| `PerformanceScorecardReportController` | 7 downloadable reports |

## Frontend Pages

| Page | Path |
|------|------|
| Dashboard | `Performance/Dashboard.tsx` |
| Cycles Index | `Performance/Cycles/Index.tsx` |
| Cycles Create | `Performance/Cycles/Create.tsx` |
| Cycles Edit | `Performance/Cycles/Edit.tsx` |
| Cycles Show | `Performance/Cycles/Show.tsx` |
| KPIs Index | `Performance/Kpis/Index.tsx` |
| KPIs Create | `Performance/Kpis/Create.tsx` |
| KPIs Edit | `Performance/Kpis/Edit.tsx` |
| Templates Index | `Performance/Templates/Index.tsx` |
| Templates Create | `Performance/Templates/Create.tsx` |
| Templates Edit | `Performance/Templates/Edit.tsx` |
| Scorecards Index | `Performance/Scorecards/Index.tsx` |
| Scorecards Create | `Performance/Scorecards/Create.tsx` |
| Scorecards Edit | `Performance/Scorecards/Edit.tsx` |
| Scorecards Show | `Performance/Scorecards/Show.tsx` |
| Improvement Plans Index | `Performance/ImprovementPlans/Index.tsx` |
| Improvement Plans Create | `Performance/ImprovementPlans/Create.tsx` |
| Improvement Plans Edit | `Performance/ImprovementPlans/Edit.tsx` |
| Improvement Plans Show | `Performance/ImprovementPlans/Show.tsx` |

## Permissions

| Permission | Description |
|------------|-------------|
| `performance.view` | Browse performance dashboard and scorecards |
| `performance.dashboard.view` | Access performance dashboard |
| `performance.cycles.manage` | Create, edit, manage review cycles |
| `performance.kpis.manage` | Create, edit, manage KPI library |
| `performance.templates.manage` | Create, edit, manage scorecard templates |
| `performance.scorecards.view` | View employee scorecards |
| `performance.scorecards.manage` | Create, assign, edit scorecards |
| `performance.self_assess` | Submit self-assessment on own scorecard |
| `performance.review` | Complete manager review |
| `performance.finalize` | Finalize and lock scorecards |
| `performance.improvement_plans.manage` | Manage PIPs |
| `performance.reports.view` | Access performance reports |

### Default Role Assignments

- **SYS_ADMIN**: All performance permissions
- **HR_ADMIN**: All performance permissions
- **MANAGER**: View, dashboard, scorecards view, review, improvement plans, reports
- **EMPLOYEE**: View, scorecards view, self-assess
- **AUDITOR**: View, scorecards view, reports

## Reports

| Report | Description |
|--------|-------------|
| Scorecard Register | All scorecards with scores and ratings |
| By Perspective | Scores broken down by BSC perspective |
| By Cycle | Performance grouped by review cycle |
| By Rating | Distribution of rating bands |
| Pending Reviews | Scorecards awaiting review actions |
| Top Performers | Highest-scoring employees |
| Improvement Plans | Active PIPs with status |

All reports extend `BaseReportController` and support XLSX/CSV/ODS export.

## Multi-Tenant Support

All models use the `BelongsToOrganization` trait and `OrganizationScope` global scope:
- `PerformanceCycle`
- `KpiLibrary`
- `ScorecardTemplate`
- `EmployeeScorecard`
- `PerformanceEvidence`
- `PerformanceImprovementPlan`

Child models (template items, scorecard items, comments) inherit tenant isolation through their parent relationships.

## Audit Trail

All models use the `Auditable` trait with `protected string $auditModule = 'performance'`, which automatically logs:
- Create events
- Update events with before/after values
- Delete events

## Evidence / Document Support

- Files stored via `Storage::disk('public')` at `performance-evidence/{scorecard_id}/`
- Metadata stored: file_name, file_path, mime_type, size, description, uploaded_by
- File validation: max 10MB, supported types: pdf, doc, docx, xls, xlsx, csv, jpg, jpeg, png, gif, txt
- Evidence can optionally link to a specific scorecard item

## Migration / Upgrade Notes

1. Run migration: `php artisan migrate`
2. The migration creates 9 new tables and alters `performance_reviews`
3. Existing performance review data is preserved
4. Run `php artisan test --filter=BalancedScorecard` to verify
