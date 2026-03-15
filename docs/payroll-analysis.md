# Payroll Module Analysis

## Current stack

- Backend: Laravel 12 on PHP 8.2
- Frontend: Inertia.js + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + lucide-react
- Auth: Laravel Fortify with Inertia pages
- PDF/export tooling: `barryvdh/laravel-dompdf` and `openspout/openspout`
- Tests: Pest feature tests

## Detected modules

- Dashboard
- Employees
- Organizations / multi-tenancy
- Org Units
- Locations
- Positions
- Users
- Roles / Permissions / Control Center
- Audit Trail
- Leave Requests
- Attendance Records
- Timesheets
- Payroll Exports
- Documents / Document Types
- Job Requisitions
- Candidate Profiles
- Onboarding / Offboarding
- Performance Reviews
- Learning Courses
- Reports
- Workflows

## Employee module patterns to reuse

- Controller-driven Inertia pages with inline validation
- Tenant-aware Eloquent models through `BelongsToOrganization`
- Rich `Show` pages with nested related data and action links
- Filtered/paginated `Index` pages with cards, badges, tables, dialogs, and debounced filters
- Route protection through permission middleware
- Audit logging through `AuditLogger` and model `Auditable` trait

## Existing schema and migration conventions

- Timestamped Laravel migrations
- Mostly additive migrations with indexes and selective unique constraints
- Multi-tenancy added by `organization_id` on tenant-owned tables
- Existing payroll-adjacent table: `payroll_exports`
- Existing employee compensation-adjacent data:
  - `employees.pay_point`
  - `employees.position_id`
  - `employees.org_unit_id`
  - `timesheets.total_minutes`
  - `timesheets.overtime_minutes`
  - `leave_requests`

## Auth, RBAC, and access control

- `EnsureUserHasPermission` middleware protects routes using dynamic permission names
- Roles, permissions, pivots, and permission matrix already exist
- Shared Inertia props expose `auth.roles`, `auth.permissions`, and `auth.can`
- Current payroll permission group exists, but it is export-centric
- Access checks should remain permission-driven, not hardcoded by role code

## Audit and tenancy state

- Application-wide audit logging exists via `audit_logs`, `AuditLogger`, and `Auditable`
- Tenant resolution exists via `TenantContext` and `ResolveCurrentOrganization`
- Tenant-owned models use `BelongsToOrganization` + `OrganizationScope`
- Audit logs already support `organization_id`
- Payroll should be tenant-owned and audited

## UI and routing conventions

- Layout: `AppLayout`
- Header breadcrumbs via shared layout props
- Sidebar visibility based on permissions
- Route usage is mixed: direct paths plus `route(...)` helpers in some pages
- Existing screens are card/table heavy and mobile-responsive

## Reporting, exports, storage, and imports

- Generic export/report infrastructure already exists in `BaseReportController`
- Existing payroll export controller uses OpenSpout and DomPDF
- Files currently use Laravel Storage where persisted files are needed
- Bulk import UX already exists in employee/org-unit/location/timesheet flows

## Service/controller/request patterns

- Controllers currently own most request validation and view shaping
- Shared query helpers live in the base controller
- No repository layer is in active use
- Domain services are appropriate for payroll calculations because historical results must be stable

## Coding and testing style

- Laravel/PHP naming is conventional and explicit
- React pages are strongly typed but pragmatic rather than abstract
- Pest feature tests cover modules, permissions, and tenancy
- Build/test verification is done with targeted feature suites and `npm run build`

## Payroll integration points

- Employees are the core payroll subject
- Timesheets can feed overtime and work-based inputs
- Leave can affect payable days or unpaid deductions later
- Payroll exports can become downstream outputs from processed payroll runs
- Audit trail should record period, input, processing, approval, close, and export actions
- Reports can reuse `BaseReportController`

## Risks and conflicts

- The existing `payroll` permission group is too narrow for a full payroll engine and must be expanded without breaking current seeded roles
- `payroll_exports` already occupies part of the domain, so the new payroll module should treat it as an output/export concern rather than the whole payroll engine
- Historical payroll integrity requires snapshots instead of live joins at view time
- Payroll contains sensitive data, so audit redaction and backend permission checks matter more than normal CRUD

## Recommended implementation decisions

- Payroll should be tenant-owned with `organization_id` on all payroll core tables
- Payroll permissions should stay role/permission-driven
- Payroll actions should be audited
- Payroll calculations should live in dedicated services, not controllers
- Payroll exports/reports should reuse the existing report/export toolchain
- Existing payroll export flows should remain available and can be linked to processed payroll runs
