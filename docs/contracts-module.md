# Employee Contracts Module

## Overview

The Employee Contracts module extends the existing Employee module to support contract lifecycle management. Each employee can have multiple contracts over time, with exactly one marked as the **current active** contract at any given time.

Contracts serve as historical snapshots of employment terms. Changes to employee master data do not retroactively alter existing contract records.

## Database Schema

### `employee_contracts`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| employee_id | FK → employees | no | Owner employee |
| organization_id | FK → organizations | yes | Tenant scope |
| contract_number | varchar(100) | no | Unique per organization |
| contract_type | varchar(50) | no | See contract types below |
| status | varchar(50) | no | See statuses below (default: draft) |
| start_date | date | no | Contract effective start |
| end_date | date | yes | Contract end (null = open-ended) |
| probation_end_date | date | yes | End of probation period |
| job_title | varchar(255) | yes | Snapshot of job title |
| department_id | FK → org_units | yes | Snapshot of department |
| position_id | FK → positions | yes | Snapshot of position |
| pay_point | varchar(100) | yes | Pay location |
| basic_salary | decimal(15,2) | yes | Base salary |
| currency | varchar(10) | yes | Salary currency code |
| pay_frequency | varchar(50) | yes | Payment schedule |
| working_hours_per_week | decimal(5,2) | yes | Weekly working hours |
| notice_period_days | smallint unsigned | yes | Notice period |
| leave_days_per_year | smallint unsigned | yes | Annual leave entitlement |
| is_current | boolean | no | Whether this is the active contract (default: false) |
| signed_at | timestamp | yes | Date contract was signed |
| terminated_at | timestamp | yes | Date contract was terminated |
| termination_reason | varchar(500) | yes | Reason for termination |
| renewal_notes | text | yes | Notes about renewal |
| benefits | json | yes | Structured benefits data |
| metadata | json | yes | Additional metadata |
| created_by | FK → users | yes | User who created |
| updated_by | FK → users | yes | User who last updated |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Indexes:** employee_id, organization_id, status, contract_type, is_current, start_date, end_date
**Unique:** (organization_id, contract_number)

### `contract_documents`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| employee_contract_id | FK → employee_contracts | no | Parent contract |
| organization_id | FK → organizations | yes | Tenant scope |
| file_name | varchar(255) | no | Original file name |
| file_path | varchar(500) | no | Storage path |
| mime_type | varchar(100) | yes | File MIME type |
| size | bigint unsigned | yes | File size in bytes |
| uploaded_by | FK → users | yes | Who uploaded |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

## Model Relationships

```
Employee
  ├── hasMany → EmployeeContract (contracts)
  └── hasOne  → EmployeeContract (currentContract, where is_current = true)

EmployeeContract
  ├── belongsTo → Employee
  ├── belongsTo → OrgUnit (department)
  ├── belongsTo → Position
  ├── belongsTo → User (createdBy)
  ├── belongsTo → User (updatedBy)
  └── hasMany   → ContractDocument (documents)

ContractDocument
  ├── belongsTo → EmployeeContract (contract)
  └── belongsTo → User (uploader)
```

## Business Rules

1. **One current contract per employee**: Only one contract can have `is_current = true` per employee. When a new contract is activated, all other contracts for that employee have `is_current` set to `false`.

2. **Fixed-term end date required**: Contracts of type `fixed_term` must have an `end_date`.

3. **Permanent contracts**: May have `end_date = null` (open-ended).

4. **Historical snapshots**: Contract records store department, position, and salary at the time of creation. Changes to employee master data do not alter existing contracts.

5. **Status transitions**: Status changes are managed through dedicated actions (activate, terminate) or manual edit.

6. **Termination**: Terminating a contract sets status to `terminated`, `is_current` to `false`, and records `terminated_at` and optional `termination_reason`.

## Contract Types

| Value | Label |
|-------|-------|
| `permanent` | Permanent |
| `fixed_term` | Fixed Term |
| `temporary` | Temporary |
| `internship` | Internship |
| `consultancy` | Consultancy |
| `probation` | Probation |

## Status Values

| Value | Label |
|-------|-------|
| `draft` | Draft |
| `pending_approval` | Pending Approval |
| `active` | Active |
| `expired` | Expired |
| `terminated` | Terminated |
| `suspended` | Suspended |
| `archived` | Archived |

## Employee Profile Integration

The Employee Show page includes a **Contracts** tab with:
- **Current Contract summary card**: contract number, type, dates, salary, department, position
- **Contract History table**: all contracts with status badges, dates, and view links

## Permissions

| Permission | Description |
|------------|-------------|
| `contracts.view` | Browse employee contracts |
| `contracts.create` | Create new contracts |
| `contracts.update` | Edit contract details |
| `contracts.delete` | Delete contracts |
| `contracts.activate` | Activate / set as current |
| `contracts.terminate` | Terminate contracts |
| `contracts.documents.manage` | Upload, download, delete contract documents |

### Default Role Assignments
- **SYS_ADMIN**: All (`contracts.*`)
- **HR_ADMIN**: All (`contracts.*`)
- **MANAGER**: View only (`contracts.view`)
- **EMPLOYEE**: View only (`contracts.view`)
- **AUDITOR**: View only (`contracts.view`)

## Multi-Tenancy

- Both `employee_contracts` and `contract_documents` include `organization_id`
- Models use the `BelongsToOrganization` trait with automatic `OrganizationScope`
- Contract number uniqueness is scoped to organization
- Cross-tenant access is prevented by the global scope

## Audit Trail

Both `EmployeeContract` and `ContractDocument` use the `Auditable` trait, which automatically logs:
- Contract creation
- Contract updates (with old/new values)
- Contract deletion
- Custom events: activate, terminate (via `AuditLogger::logCustom`)
- Document upload and download (via `AuditLogger::logCustom`)

## Contract Documents

Files are stored at: `storage/app/public/contracts/{employee_id}/{contract_id}/`

Supported operations:
- Upload (max 20MB)
- Download
- Delete (also removes file from storage)

## Routes

All routes are nested under `/employees/{employee}/contracts`:

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| GET | `/` | List contracts | contracts.view |
| GET | `/create` | Create form | contracts.create |
| POST | `/` | Store contract | contracts.create |
| GET | `/{contract}` | Show detail | contracts.view |
| GET | `/{contract}/edit` | Edit form | contracts.update |
| PUT | `/{contract}` | Update contract | contracts.update |
| DELETE | `/{contract}` | Delete contract | contracts.delete |
| POST | `/{contract}/activate` | Set as current | contracts.activate |
| POST | `/{contract}/terminate` | Terminate | contracts.terminate |
| POST | `/{contract}/documents` | Upload document | contracts.documents.manage |
| GET | `/{contract}/documents/{document}/download` | Download | contracts.documents.manage |
| DELETE | `/{contract}/documents/{document}` | Delete document | contracts.documents.manage |

## Frontend Pages

| Page | Path | Description |
|------|------|-------------|
| `EmployeeContracts/Index.tsx` | `/employees/{id}/contracts` | Contract list with current contract card |
| `EmployeeContracts/Create.tsx` | `/employees/{id}/contracts/create` | Multi-section create form |
| `EmployeeContracts/Edit.tsx` | `/employees/{id}/contracts/{id}/edit` | Edit form |
| `EmployeeContracts/Show.tsx` | `/employees/{id}/contracts/{id}` | Full detail view with documents |

## Migration / Upgrade Notes

1. Run migrations: `php artisan migrate`
2. Sync permissions: Ensure `config/rbac.php` permission seeds are synced to the `permissions` table
3. Assign `contracts.*` permissions to relevant roles via the Permission Matrix
4. No existing data is modified — this is a purely additive migration
5. Existing employee records remain unchanged
