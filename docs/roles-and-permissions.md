# Roles and Permissions

## Overview

This HRMS now uses a dynamic RBAC model built around:

- `roles`
- `permissions`
- `role_users`
- `role_permissions`
- `user_permissions`

The existing `roles` table and seeded roles were preserved. New roles created from the UI become assignable immediately without adding hardcoded backend or frontend logic.

## Database Changes

New tables:

- `permissions`
- `role_permissions`
- `user_permissions`

Existing tables preserved:

- `roles`
- `role_users`

The new migrations are additive and do not remove existing role or user-role data.

## Model Relationships

### User

- `roles(): BelongsToMany`
- `permissions(): BelongsToMany` for optional direct grants
- `allPermissions()` merges direct permissions and role permissions
- `permissionNames()` returns the flattened permission list
- `hasRole()` / `hasAnyRole()`
- `hasPermission()` / `canAccess()`
- `syncRoles()` / `syncPermissions()`

### Role

- `users(): BelongsToMany`
- `permissions(): BelongsToMany`
- `permissionNames()`
- `hasPermission()`
- `syncPermissions()`

### Permission

- `roles(): BelongsToMany`
- `users(): BelongsToMany`

## Permission Catalogue

Permissions are defined centrally in [`config/rbac.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/config/rbac.php).

They are grouped by module, including:

- dashboard
- employees
- org_units
- locations
- positions
- users
- roles
- permissions
- workflows
- leave
- attendance
- timesheets
- payroll
- requisitions
- candidates
- onboarding
- offboarding
- performance
- learning
- documents
- document_types
- reports

Examples:

- `employees.view`
- `employees.create`
- `employees.update`
- `employees.delete`
- `employees.bulk_upload`
- `roles.view`
- `roles.create`
- `permissions.assign`
- `dashboard.view`
- `attendance.manage`
- `leave.approve`

## Seeded Role Mapping

Default permission mappings for seeded roles are also defined in [`config/rbac.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/config/rbac.php).

`PermissionSeeder`:

1. upserts the permission catalogue
2. looks up existing seeded roles by `code`
3. attaches the default permissions for those roles

This preserves seeded role behavior while keeping checks permission-based.

## How Roles Are Assigned

User-role assignment is stored in `role_users`.

Assignments are managed through:

- the user create page
- the user edit page
- backend `UserController` role sync logic

If the current operator does not have `users.assign_roles`, the backend ignores requested role changes even if a crafted request is submitted.

## Backend Permission Checks

### Middleware

Permission enforcement is handled primarily by route middleware:

- middleware alias: `permission`
- implementation: [`EnsureUserHasPermission.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Http/Middleware/EnsureUserHasPermission.php)

Routes now use permission middleware instead of hardcoded role-name checks.

### Gates

[`AuthServiceProvider.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Providers/AuthServiceProvider.php) registers a dynamic gate resolver so any permission-like ability such as `employees.view` resolves through `User::canAccess()`.

### Shared Permission Registry

[`PermissionRegistry.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Support/Rbac/PermissionRegistry.php) is the single source of truth for:

- grouped permission definitions
- permission expansion for wildcards like `employees.*`
- seeded role defaults
- protected seeded roles

## Frontend Permission Checks

Shared Inertia auth data is exposed from [`HandleInertiaRequests.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/app/Http/Middleware/HandleInertiaRequests.php):

- `auth.user`
- `auth.roles`
- `auth.permissions`
- `auth.can`

Frontend helpers live in [`authorization.ts`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/lib/authorization.ts).

Use:

- `useAuthorization()`
- `can('employees.create')`
- `canAny(['roles.view', 'permissions.view'])`

This pattern is now used in:

- the Control Center
- Roles pages
- User role assignment pages
- employee actions
- sidebar/navigation filtering

## Control Center

New admin experience:

- [`ControlCenter/Index.tsx`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/ControlCenter/Index.tsx)
- [`Roles/Index.tsx`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/Roles/Index.tsx)
- [`Roles/Create.tsx`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/Roles/Create.tsx)
- [`Roles/Edit.tsx`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/Roles/Edit.tsx)
- [`Roles/Show.tsx`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/Roles/Show.tsx)
- [`Roles/Matrix.tsx`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/resources/js/pages/Roles/Matrix.tsx)

The Control Center provides:

- role summaries
- users by role
- recently updated roles
- grouped permission assignment
- a full permission matrix

## How to Add a New Role

1. Open Control Center.
2. Create the role from `/roles/create`.
3. Select the required permissions.
4. Save the role.
5. Assign the role to users from the user edit flow.

No code changes are required.

## How to Add a New Permission

1. Add the permission definition to [`config/rbac.php`](/C:/Users/tafad/Documents/PROJECTS/HRMS/hrms/config/rbac.php).
2. Run the permission seeder or reseed the database:
   - `php artisan db:seed --class=PermissionSeeder`
3. Apply the permission to the relevant seeded roles if needed by updating the default role mapping in the same config file.
4. Protect routes or buttons using the new permission string.

## How to Protect a New Module or Page

Backend:

1. Add permissions for the module in `config/rbac.php`.
2. Seed them with `PermissionSeeder`.
3. Protect the routes with the `permission` middleware.

Frontend:

1. Use `useAuthorization()`.
2. Hide or disable actions using `can()` / `canAny()`.
3. Add navigation visibility rules where appropriate.

## Migration and Upgrade Notes

- Existing `roles` and `role_users` data are preserved.
- Existing seeded role codes remain valid.
- Existing optional legacy `users.role` compatibility is still supported where present.
- Route authorization now uses permissions.
- The `role_user` table-name drift found in older code paths was corrected to `role_users`.

## Assumptions

- Multiple roles per user are allowed and remain the primary assignment model.
- Direct user permissions are supported but not yet exposed in the Control Center UI.
- Seeded roles are protected from deletion to preserve project stability.
- Existing module controllers continue to rely mainly on route middleware for access control.
