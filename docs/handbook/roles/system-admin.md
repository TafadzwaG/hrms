# System Administrator

System Administrator is the highest operational role in the employee portal. This role oversees tenant setup, access control, auditability, and platform-wide health.

## User documentation

### Workflow
```mermaid
flowchart LR
    A["Open system dashboard"] --> B["Review governance and platform KPIs"]
    B --> C["Manage organizations, roles, and settings"]
    C --> D["Investigate audit or access issues"]
```

### Primary modules
- Dashboard
- Organization Structure
- User Access and Control Center
- Audit Trail
- System Settings

## Technical documentation

- Resolved dashboard role: `system_admin`
- Source of truth: `app/Support/Dashboard/RoleDashboardResolver.php`
- Typical permissions: `*` for seeded `SYS_ADMIN`
- Portal context: employee portal with broad cross-module visibility

