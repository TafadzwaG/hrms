# Multi-Tenancy

## Overview

The HRMS now supports multiple organizations in a single shared database.

The tenancy model is row-level isolation:

- `organizations` is the tenant root entity
- users can belong to one or many organizations
- the active organization is resolved per request
- tenant-owned records are filtered server-side by `organization_id`
- super admins retain cross-organization visibility

The implementation was added on top of the existing Laravel, Inertia, React, and RBAC architecture rather than replacing it with a separate SaaS starter.

## Why Shared-DB Row-Level Tenancy

Shared-db tenancy was chosen because it fits the existing codebase and upgrade path:

- the app already had a single shared schema
- most modules already used Eloquent models, which made reusable row scoping practical
- existing routes, layouts, controllers, and Inertia pages could be adapted incrementally
- seeded roles and permission catalogue could remain global

This keeps operations simpler while still enforcing tenant isolation in application code and queries.

## Database Changes

### New Tables

- `organizations`
- `organization_user`
- `organization_user_roles`

### Updated Tables

The following tenant-owned tables now carry `organization_id`:

- `org_units`
- `locations`
- `positions`
- `employees`
- `document_types`
- `documents`
- `workflow_definitions`
- `leave_requests`
- `attendance_records`
- `timesheets`
- `payroll_exports`
- `job_requisitions`
- `candidate_profiles`
- `onboarding_tasks`
- `offboarding_tasks`
- `performance_reviews`
- `learning_courses`
- `audit_logs`

### User Table

- `users.current_organization_id` stores the last active organization for the user

### Upgrade Backfill

The tenancy migration:

- creates a default organization from existing company/app metadata
- backfills existing users into that organization
- backfills tenant-owned tables with the default organization
- migrates existing non-system-admin role assignments from `role_users` into `organization_user_roles`

## Tenant Ownership Model

### Tenant-Owned

- employees and employee-related profile data
- org units
- locations
- positions
- attendance
- leave
- timesheets
- payroll exports
- recruiting records
- onboarding and offboarding
- learning and performance
- workflows
- document types and documents
- audit logs tied to tenant activity

### Global / Shared

- permission catalogue
- role catalogue
- system-wide super-admin assignments in `role_users`
- application config and framework-level settings

## How Tenant Context Is Resolved

Tenant resolution is handled by `App\Support\Tenancy\TenantContext` and `App\Http\Middleware\ResolveCurrentOrganization`.

On each authenticated web request:

1. the middleware loads the user
2. it resolves the list of accessible organizations
3. it restores `current_organization_id` from session or `users.current_organization_id`
4. it falls back to the first accessible organization if needed
5. it shares the active organization and organization list through Inertia props

For users with no accessible organization:

- super admins can still log in
- non-super-admins resolve to a null tenant context and tenant-owned queries return no results

## How Organization Switching Works

The organization switcher posts to `organizations.switch`.

The controller:

- validates the requested organization
- confirms the current user can access it
- writes the selection to session
- updates `users.current_organization_id`
- writes an audit event for the switch

The active organization is then reflected in shared Inertia props and all tenant-scoped queries.

## How Tenant Isolation Is Enforced

Isolation is enforced server-side in multiple layers:

- tenant-owned models use `App\Concerns\BelongsToOrganization`
- that trait applies `App\Models\Scopes\OrganizationScope`
- creates auto-fill `organization_id` from the active tenant where possible
- controllers use tenant-aware validation rules and membership checks
- route handlers check organization access before sensitive actions
- shared props only expose the active organization context
- RBAC summaries and counts use organization-aware assignment queries

Do not rely on frontend filtering for tenancy.

## RBAC and Tenancy

Roles and permissions remain globally defined, but assignments are tenant-aware.

Current structure:

- global roles: `role_users`
- tenant-specific role assignments: `organization_user_roles`
- direct permissions: `user_permissions`

Permission checks use the active organization context:

- global roles are considered only when relevant to the visible user scope
- organization roles are resolved from `organization_user_roles`
- shared Inertia `auth.can` values are generated from effective tenant-aware permissions

The organizations module adds these permission keys:

- `organizations.view`
- `organizations.create`
- `organizations.update`
- `organizations.delete`
- `organizations.manage_members`
- `organizations.switch`

## Making a New Model Tenant-Aware

For a new tenant-owned model:

1. add an `organization_id` foreign key
2. add the `BelongsToOrganization` trait
3. expose the `organization()` relation if useful in the UI
4. ensure create/import flows do not override tenant context from user input
5. validate related foreign keys within the active organization

Example pattern:

```php
use App\Concerns\BelongsToOrganization;

class ExampleRecord extends Model
{
    use BelongsToOrganization;
}
```

## Protecting a New Route, Controller, or Page

For tenant-safe module work:

1. protect the route with permission middleware
2. use tenant-scoped models or tenant-aware query helpers in the controller
3. validate related IDs with `where('organization_id', $this->tenantId())`
4. use `ensureUserBelongsToCurrentOrganization()` or `ensureCanAccessOrganization()` where appropriate
5. share only tenant-safe props to Inertia

## Shared Frontend Tenant Data

`HandleInertiaRequests` now shares:

- `tenant.active_organization`
- `tenant.organizations`
- `tenant.can_switch`
- `tenant.is_super_admin`

The header organization switcher uses this payload to let users change context without changing the existing layout structure.

## Migration and Upgrade Notes

- run the new organization migrations before using tenant-aware pages
- reseed permissions so the organizations module appears in RBAC screens
- review any custom or legacy seeders that create tenant-owned rows and ensure they set `organization_id`
- system admin seeders should attach the admin user to current organizations for best UI coverage
- custom reports or raw query code that bypasses Eloquent scopes must apply tenant constraints manually

## Assumptions

- the existing app was effectively single-tenant before this change
- seeded roles should remain valid and not be destroyed
- `SYS_ADMIN` remains a global system-wide role
- most daily operations should be scoped to the active organization
- public/self-service registration is not the primary onboarding path for tenant membership

## Future Extensions

This structure is compatible with later enhancements such as:

- subdomain-based organization resolution
- invitation flows for organization membership
- per-organization branding and settings
- stronger organization-level role presets
- separate-database tenancy if the product ever outgrows shared-db isolation
