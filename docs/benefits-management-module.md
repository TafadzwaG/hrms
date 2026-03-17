# Benefits Management Module

## Overview

The Benefits Management module provides comprehensive tracking of employee benefits including health plans, retirement funds, allowances, insurance, wellness programs, education assistance, loans, and other benefit types. It supports the full enrollment lifecycle, dependant management, contribution rules, document storage, and payroll integration. The module enforces multi-tenancy, audit logging, and role-based access control.

## Database Schema

### `benefits`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| code | varchar(50) | yes | Unique code per organization |
| name | varchar(255) | no | Benefit name |
| category | varchar(50) | no | See categories below |
| description | text | yes | Detailed description |
| benefit_type | varchar(50) | no | See types below |
| taxable | boolean | no | Whether benefit is taxable (default: false) |
| cash_benefit | boolean | no | Whether benefit is cash-based (default: true) |
| employer_funded | boolean | no | Whether employer funds benefit (default: false) |
| employee_funded | boolean | no | Whether employee funds benefit (default: false) |
| shared_contribution | boolean | no | Whether contribution is shared (default: false) |
| requires_dependants | boolean | no | Whether dependants can be added (default: false) |
| requires_plan_selection | boolean | no | Whether plan must be selected (default: false) |
| payroll_deductible | boolean | no | Whether deducted via payroll (default: false) |
| active | boolean | no | Active status (default: true) |
| effective_from | date | yes | Benefit availability start |
| effective_to | date | yes | Benefit availability end |
| metadata | json | yes | Additional structured data |
| created_by | FK -> users | yes | User who created |
| updated_by | FK -> users | yes | User who last updated |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |
| deleted_at | timestamp | yes | Soft delete |

**Unique:** (organization_id, code)
**Indexes:** organization_id, category, benefit_type, active

### `benefit_plans`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| benefit_id | FK -> benefits | no | Parent benefit |
| name | varchar(255) | no | Plan name |
| code | varchar(50) | yes | Unique code per benefit |
| description | text | yes | Plan description |
| active | boolean | no | Active status (default: true) |
| employer_contribution_type | varchar(50) | yes | fixed or percentage |
| employer_contribution_value | decimal(15,2) | yes | Employer contribution amount |
| employee_contribution_type | varchar(50) | yes | fixed or percentage |
| employee_contribution_value | decimal(15,2) | yes | Employee contribution amount |
| coverage_limit | decimal(15,2) | yes | Maximum coverage amount |
| metadata | json | yes | Additional structured data |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** benefit_id, organization_id

### `employee_benefit_enrollments`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| employee_id | FK -> employees | no | Enrolled employee |
| benefit_id | FK -> benefits | no | Enrolled benefit |
| benefit_plan_id | FK -> benefit_plans | yes | Selected plan |
| status | varchar(50) | no | See statuses below (default: draft) |
| effective_date | date | no | Enrollment start date |
| end_date | date | yes | Enrollment end date |
| employee_contribution | decimal(15,2) | yes | Employee contribution amount |
| employer_contribution | decimal(15,2) | yes | Employer contribution amount |
| payroll_deduction_code | varchar(50) | yes | Code for payroll integration |
| enrollment_reference | varchar(255) | yes | External reference number |
| notes | text | yes | Additional notes |
| metadata | json | yes | Additional structured data |
| created_by | FK -> users | yes | User who created |
| updated_by | FK -> users | yes | User who last updated |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** organization_id, employee_id, benefit_id, benefit_plan_id, status, effective_date

### `employee_benefit_dependants`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| employee_benefit_enrollment_id | FK -> employee_benefit_enrollments | no | Parent enrollment |
| full_name | varchar(255) | no | Dependant full name |
| relationship | varchar(50) | no | Relationship to employee |
| date_of_birth | date | yes | Date of birth |
| national_id | varchar(255) | yes | National ID number |
| contact_number | varchar(50) | yes | Phone number |
| effective_date | date | yes | Coverage start |
| end_date | date | yes | Coverage end |
| status | varchar(50) | no | active, inactive, removed (default: active) |
| notes | text | yes | Additional notes |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** employee_benefit_enrollment_id, organization_id

### `benefit_contribution_rules`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| benefit_id | FK -> benefits | no | Parent benefit |
| benefit_plan_id | FK -> benefit_plans | yes | Optional plan scope |
| rule_name | varchar(255) | no | Rule name |
| contribution_basis | varchar(50) | no | Basis for calculation (e.g., basic_salary, gross_salary) |
| employer_contribution_type | varchar(50) | no | fixed or percentage |
| employer_contribution_value | decimal(15,2) | yes | Employer contribution amount |
| employee_contribution_type | varchar(50) | no | fixed or percentage |
| employee_contribution_value | decimal(15,2) | yes | Employee contribution amount |
| min_value | decimal(15,2) | yes | Minimum contribution cap |
| max_value | decimal(15,2) | yes | Maximum contribution cap |
| effective_from | date | yes | Rule validity start |
| effective_to | date | yes | Rule validity end |
| active | boolean | no | Active status (default: true) |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** benefit_id, benefit_plan_id, organization_id

### `benefit_documents`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| employee_benefit_enrollment_id | FK -> employee_benefit_enrollments | no | Parent enrollment |
| file_name | varchar(255) | no | Original file name |
| file_path | varchar(255) | no | Storage path |
| mime_type | varchar(255) | yes | File MIME type |
| size | bigint unsigned | yes | File size in bytes |
| document_type | varchar(50) | yes | Document classification |
| uploaded_by | FK -> users | yes | Who uploaded |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** employee_benefit_enrollment_id, organization_id

### `benefit_change_logs`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| employee_benefit_enrollment_id | FK -> employee_benefit_enrollments | no | Parent enrollment |
| event | varchar(50) | no | Event type (enrolled, suspended, terminated, reinstated, status_changed) |
| from_status | varchar(50) | yes | Previous status |
| to_status | varchar(50) | yes | New status |
| from_values | json | yes | Previous values snapshot |
| to_values | json | yes | New values snapshot |
| reason | text | yes | Reason for change |
| changed_by | FK -> users | yes | Who made the change |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** employee_benefit_enrollment_id, organization_id, event

## Model Relationships

```
Benefit
  ├── hasMany   -> BenefitPlan (plans)
  ├── hasMany   -> EmployeeBenefitEnrollment (enrollments)
  ├── hasMany   -> BenefitContributionRule (contributionRules)
  ├── belongsTo -> User (creator / createdBy)
  └── belongsTo -> User (updater / updatedBy)

BenefitPlan
  ├── belongsTo -> Benefit (benefit)
  ├── hasMany   -> EmployeeBenefitEnrollment (enrollments)
  └── hasMany   -> BenefitContributionRule (contributionRules)

EmployeeBenefitEnrollment
  ├── belongsTo -> Employee (employee)
  ├── belongsTo -> Benefit (benefit)
  ├── belongsTo -> BenefitPlan (plan)
  ├── hasMany   -> EmployeeBenefitDependant (dependants)
  ├── hasMany   -> BenefitDocument (documents)
  ├── hasMany   -> BenefitChangeLog (changeLogs)
  ├── belongsTo -> User (createdBy)
  └── belongsTo -> User (updatedBy)

EmployeeBenefitDependant
  └── belongsTo -> EmployeeBenefitEnrollment (enrollment)

BenefitContributionRule
  ├── belongsTo -> Benefit (benefit)
  └── belongsTo -> BenefitPlan (plan)

BenefitDocument
  ├── belongsTo -> EmployeeBenefitEnrollment (enrollment)
  └── belongsTo -> User (uploader)

BenefitChangeLog
  ├── belongsTo -> EmployeeBenefitEnrollment (enrollment)
  └── belongsTo -> User (changer)

Employee
  └── hasMany -> EmployeeBenefitEnrollment (benefitEnrollments)
```

## Benefits Lifecycle

The enrollment lifecycle tracks each employee's participation in a benefit from initial enrollment through completion or termination:

```
draft
  -> active          (enrollment confirmed)
    -> suspended     (temporarily paused, e.g., unpaid leave)
      -> active      (reinstated)
    -> terminated    (permanently ended, sets end_date to current date)
  -> cancelled       (enrollment cancelled before activation)
  -> expired         (end_date passed)
```

Every status transition is recorded in the `benefit_change_logs` table with the event type, previous and new status, reason, and the user who made the change.

## Benefit Categories

| Value | Description |
|-------|-------------|
| `health` | Medical aid, hospital plans, dental, optical |
| `retirement` | Pension funds, provident funds, retirement annuities |
| `allowance` | Housing, transport, meal, phone allowances |
| `insurance` | Life cover, disability, funeral cover |
| `wellness` | Gym memberships, EAP, wellness programs |
| `education` | Study assistance, training budgets, bursaries |
| `loan` | Staff loans, salary advances |
| `other` | Any benefit not covered by above categories |

## Benefit Types

| Value | Label | Description |
|-------|-------|-------------|
| `employer_paid` | Employer Paid | Fully funded by the employer |
| `employee_paid` | Employee Paid | Fully funded by the employee |
| `shared` | Shared | Both employer and employee contribute |
| `reimbursement` | Reimbursement | Employee pays upfront, employer reimburses |
| `non_cash` | Non-Cash | Non-monetary benefit (e.g., company car, housing) |

## Contribution Types

| Value | Description |
|-------|-------------|
| `fixed` | Fixed monetary amount |
| `percentage` | Percentage of a basis (e.g., basic salary, gross salary) |

## Enrollment Statuses

| Value | Label | Description |
|-------|-------|-------------|
| `draft` | Draft | Enrollment created but not yet confirmed |
| `active` | Active | Employee is actively enrolled |
| `suspended` | Suspended | Enrollment temporarily paused |
| `terminated` | Terminated | Enrollment permanently ended |
| `expired` | Expired | Enrollment end date has passed |
| `cancelled` | Cancelled | Enrollment cancelled before activation |

## Employee Integration

The Employee Show page includes a **Benefits** tab with:
- **Active Enrollments**: Table showing current benefit enrollments with benefit name, category, plan, status, contribution amounts, and effective dates
- **Enrollment History**: All past and current enrollments accessible via the show URL (`/benefit-enrollments/{id}`)

The Employee model exposes a `benefitEnrollments` relationship and the show page provides `benefit_enrollments` and `benefit_enrollments_count` in the stats object.

## Payroll Readiness

Each enrollment supports payroll integration through:
- **payroll_deduction_code**: A string code that maps to payroll deduction line items (e.g., `MED-001`, `PEN-002`)
- **employee_contribution**: The amount deducted from the employee's pay
- **employer_contribution**: The amount contributed by the employer

Contribution rules on the benefit or plan level define how contributions are calculated:
- **contribution_basis**: The salary component used as the calculation base (e.g., `basic_salary`, `gross_salary`)
- **employer/employee_contribution_type**: Either `fixed` (flat amount) or `percentage` (of the basis)
- **min_value / max_value**: Optional caps on contribution amounts
- **effective_from / effective_to**: Date range for rule validity

## Permissions

| Permission | Description |
|------------|-------------|
| `benefits.view` | Browse benefits, enrollments, and dashboard |
| `benefits.create` | Create new benefits |
| `benefits.update` | Edit benefits and manage contribution rules |
| `benefits.delete` | Delete benefits (blocked if active enrollments exist) |
| `benefits.plans.manage` | Create, edit, delete benefit plans |
| `benefits.enrollments.manage` | Create, edit, suspend, terminate, reinstate enrollments |
| `benefits.dependants.manage` | Add, edit, remove dependants on enrollments |
| `benefits.documents.manage` | Upload and delete enrollment documents |
| `reports.view` | Access benefit reports (shared with other report modules) |

### Default Role Assignments

- **SYS_ADMIN**: All (`benefits.*`)
- **HR_ADMIN**: All (`benefits.*`)
- **MANAGER**: View, enrollments manage, dependants manage, reports
- **EMPLOYEE**: View only (`benefits.view`)
- **AUDITOR**: View, reports

## Multi-Tenancy

All benefit tables include `organization_id`. Models use the `BelongsToOrganization` trait with automatic `OrganizationScope`:
- `Benefit`
- `BenefitPlan`
- `EmployeeBenefitEnrollment`
- `EmployeeBenefitDependant`
- `BenefitContributionRule`
- `BenefitDocument`
- `BenefitChangeLog`

Benefit codes are unique per organization. Cross-tenant access is prevented by the global scope.

## Audit Trail

Models use the `Auditable` trait with `protected string $auditModule = 'benefits'`:
- `Benefit` (also uses `SoftDeletes`)
- `BenefitPlan`

This automatically logs create, update, and delete operations with before/after values.

Enrollment lifecycle events (enroll, suspend, terminate, reinstate) are additionally tracked in the `benefit_change_logs` table with full status transition history.

## Document Storage

Files are stored at: `storage/app/public/benefits/enrollments/{enrollment_id}/`

Supported operations:
- **Upload**: Max 20MB per file, with optional document type classification
- **Download**: Authenticated download via streaming response
- **Delete**: Removes both the database record and the file from storage

Documents are scoped to individual enrollments and include metadata: file_name, file_path, mime_type, size, document_type, uploaded_by.

## Reports

| Report | Route | Description |
|--------|-------|-------------|
| Benefit Register | `/reports/benefits/register` | Full register of all benefits |
| Active Enrollments | `/reports/benefits/active-enrollments` | All active employee enrollments with contributions |
| By Department | `/reports/benefits/by-department` | Enrollments grouped by employee department |
| Employer Contributions | `/reports/benefits/employer-contributions` | Employer contribution breakdown by employee |
| Employee Contributions | `/reports/benefits/employee-contributions` | Employee contribution breakdown |
| Dependants | `/reports/benefits/dependants` | All registered dependants across enrollments |
| Cost by Category | `/reports/benefits/by-cost` | Enrollment counts and total costs by benefit category |
| Expired/Suspended | `/reports/benefits/expired-suspended` | Enrollments in expired, suspended, or terminated status |

All reports extend `BaseReportController` and support XLSX/CSV/ODS export.

## Controllers

| Controller | Purpose |
|------------|---------|
| `BenefitController` | CRUD for benefits |
| `BenefitPlanController` | CRUD for benefit plans (nested under benefits) |
| `EmployeeBenefitEnrollmentController` | Enrollment CRUD, suspend/terminate/reinstate, documents |
| `EmployeeBenefitDependantController` | Dependant CRUD on enrollments |
| `BenefitContributionRuleController` | Contribution rule CRUD on benefits |
| `BenefitsDashboardController` | Dashboard metrics, enrollment distributions |
| `BenefitReportController` | 8 downloadable reports |

## Routes

### Benefits Routes (`/benefits`)

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| GET | `/benefits` | List benefits | benefits.view |
| GET | `/benefits/create` | Create form | benefits.create |
| POST | `/benefits` | Store benefit | benefits.create |
| GET | `/benefits/{benefit}` | Show detail | benefits.view |
| GET | `/benefits/{benefit}/edit` | Edit form | benefits.update |
| PUT | `/benefits/{benefit}` | Update benefit | benefits.update |
| DELETE | `/benefits/{benefit}` | Delete benefit | benefits.delete |
| GET | `/benefits/dashboard` | Dashboard | benefits.view |

### Plan Routes (`/benefits/{benefit}/plans`)

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| GET | `/` | List plans | benefits.view |
| GET | `/create` | Create form | benefits.plans.manage |
| POST | `/` | Store plan | benefits.plans.manage |
| GET | `/{plan}/edit` | Edit form | benefits.plans.manage |
| PUT | `/{plan}` | Update plan | benefits.plans.manage |
| DELETE | `/{plan}` | Delete plan | benefits.plans.manage |

### Contribution Rule Routes (`/benefits/{benefit}/contribution-rules`)

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| POST | `/` | Store rule | benefits.update |
| PUT | `/{rule}` | Update rule | benefits.update |
| DELETE | `/{rule}` | Delete rule | benefits.update |

### Enrollment Routes (`/benefit-enrollments`)

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| GET | `/` | List enrollments | benefits.view |
| GET | `/create` | Create form | benefits.enrollments.manage |
| POST | `/` | Store enrollment | benefits.enrollments.manage |
| GET | `/{enrollment}` | Show detail | benefits.view |
| GET | `/{enrollment}/edit` | Edit form | benefits.enrollments.manage |
| PUT | `/{enrollment}` | Update enrollment | benefits.enrollments.manage |
| DELETE | `/{enrollment}` | Delete enrollment | benefits.enrollments.manage |
| POST | `/{enrollment}/suspend` | Suspend enrollment | benefits.enrollments.manage |
| POST | `/{enrollment}/terminate` | Terminate enrollment | benefits.enrollments.manage |
| POST | `/{enrollment}/reinstate` | Reinstate enrollment | benefits.enrollments.manage |

### Enrollment Document Routes

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| POST | `/{enrollment}/documents` | Upload document | benefits.documents.manage |
| GET | `/{enrollment}/documents/{document}/download` | Download | benefits.view |
| DELETE | `/{enrollment}/documents/{document}` | Delete document | benefits.documents.manage |

### Enrollment Dependant Routes

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| POST | `/{enrollment}/dependants` | Add dependant | benefits.dependants.manage |
| PUT | `/{enrollment}/dependants/{dependant}` | Update dependant | benefits.dependants.manage |
| DELETE | `/{enrollment}/dependants/{dependant}` | Remove dependant | benefits.dependants.manage |

### Report Routes (`/reports/benefits`)

| Method | Path | Report | Permission |
|--------|------|--------|------------|
| GET | `/register` | Benefit register | reports.view |
| GET | `/active-enrollments` | Active enrollments | reports.view |
| GET | `/by-department` | Enrollments by department | reports.view |
| GET | `/employer-contributions` | Employer contributions | reports.view |
| GET | `/employee-contributions` | Employee contributions | reports.view |
| GET | `/dependants` | Dependants register | reports.view |
| GET | `/by-cost` | Cost by category | reports.view |
| GET | `/expired-suspended` | Expired/suspended enrollments | reports.view |

## Frontend Pages

| Page | Path | Description |
|------|------|-------------|
| `Benefits/Index.tsx` | `/benefits` | Benefit list with search, category/type filters, stats |
| `Benefits/Create.tsx` | `/benefits/create` | Benefit create form |
| `Benefits/Edit.tsx` | `/benefits/{id}/edit` | Benefit edit form |
| `Benefits/Show.tsx` | `/benefits/{id}` | Benefit detail with plans, enrollments, contribution rules |
| `Benefits/Dashboard.tsx` | `/benefits/dashboard` | Dashboard with metrics, category/status distributions |
| `Benefits/Plans/Index.tsx` | `/benefits/{id}/plans` | Plan list for a benefit |
| `Benefits/Plans/Create.tsx` | `/benefits/{id}/plans/create` | Plan create form |
| `Benefits/Plans/Edit.tsx` | `/benefits/{id}/plans/{id}/edit` | Plan edit form |
| `Benefits/Enrollments/Index.tsx` | `/benefit-enrollments` | Enrollment list with filters |
| `Benefits/Enrollments/Create.tsx` | `/benefit-enrollments/create` | Enrollment create form |
| `Benefits/Enrollments/Edit.tsx` | `/benefit-enrollments/{id}/edit` | Enrollment edit form |
| `Benefits/Enrollments/Show.tsx` | `/benefit-enrollments/{id}` | Enrollment detail with dependants, documents, change log |

## Migration / Upgrade Notes

1. Run migrations: `php artisan migrate`
2. The migration creates 7 new tables: `benefits`, `benefit_plans`, `employee_benefit_enrollments`, `employee_benefit_dependants`, `benefit_contribution_rules`, `benefit_documents`, `benefit_change_logs`
3. Sync permissions: Ensure `config/rbac.php` permission seeds are synced
4. Assign `benefits.*` permissions to relevant roles via the Permission Matrix
5. No existing data is modified -- this is a purely additive migration
6. Run `php artisan test --filter=BenefitsManagement` to verify
