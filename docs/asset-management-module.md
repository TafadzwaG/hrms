# Asset Management Module

## Overview

The Asset Management module provides comprehensive tracking of organizational assets through their full lifecycle: procurement, categorization, assignment to employees, maintenance, depreciation, and disposal. It supports multi-tenancy, audit logging, and role-based access control.

## Database Schema

### `asset_categories`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| parent_id | FK → asset_categories | yes | Parent category (hierarchical) |
| name | varchar(255) | no | Category name |
| code | varchar(50) | yes | Unique code per organization |
| description | text | yes | Category description |
| depreciation_method | varchar(50) | yes | Default depreciation method |
| useful_life_years | smallint unsigned | yes | Default useful life |
| depreciation_rate | decimal(8,4) | yes | Default depreciation rate |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Unique:** (organization_id, code)

### `asset_vendors`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| name | varchar(255) | no | Vendor name |
| code | varchar(50) | yes | Unique code per organization |
| contact_person | varchar(255) | yes | Primary contact |
| email | varchar(255) | yes | Contact email |
| phone | varchar(50) | yes | Phone number |
| address | text | yes | Physical address |
| website | varchar(255) | yes | Website URL |
| notes | text | yes | Additional notes |
| is_active | boolean | no | Active status (default: true) |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Unique:** (organization_id, code)

### `asset_locations`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| name | varchar(255) | no | Location name |
| code | varchar(50) | yes | Unique code per organization |
| address | text | yes | Physical address |
| building | varchar(255) | yes | Building name |
| floor | varchar(50) | yes | Floor number/name |
| room | varchar(100) | yes | Room identifier |
| description | text | yes | Additional description |
| is_active | boolean | no | Active status (default: true) |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Unique:** (organization_id, code)

### `assets`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| asset_category_id | FK → asset_categories | no | Category |
| asset_vendor_id | FK → asset_vendors | yes | Purchase vendor |
| asset_location_id | FK → asset_locations | yes | Current location |
| asset_tag | varchar(100) | no | Unique tag per organization |
| serial_number | varchar(255) | yes | Manufacturer serial number |
| name | varchar(255) | no | Asset name/description |
| description | text | yes | Detailed description |
| status | varchar(50) | no | See statuses below (default: available) |
| condition | varchar(50) | no | See conditions below (default: new) |
| purchase_date | date | yes | Date of purchase |
| purchase_price | decimal(15,2) | yes | Original purchase price |
| currency | varchar(10) | yes | Currency code |
| warranty_expiry_date | date | yes | Warranty expiration |
| warranty_notes | text | yes | Warranty details |
| depreciation_method | varchar(50) | yes | See depreciation methods below |
| useful_life_years | smallint unsigned | yes | Expected useful life |
| depreciation_rate | decimal(8,4) | yes | Annual depreciation rate |
| salvage_value | decimal(15,2) | yes | Expected value at end of life |
| book_value | decimal(15,2) | yes | Current book value |
| barcode | varchar(255) | yes | Barcode string |
| image_path | varchar(500) | yes | Path to asset image |
| notes | text | yes | General notes |
| metadata | json | yes | Additional structured data |
| created_by | FK → users | yes | User who created |
| updated_by | FK → users | yes | User who last updated |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |
| deleted_at | timestamp | yes | Soft delete |

**Unique:** (organization_id, asset_tag)
**Indexes:** organization_id, asset_category_id, asset_vendor_id, asset_location_id, status, condition, purchase_date, warranty_expiry_date

### `asset_assignments`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| asset_id | FK → assets | no | Assigned asset |
| employee_id | FK → employees | no | Assigned employee |
| assigned_by | FK → users | yes | Who assigned |
| returned_to | FK → users | yes | Who received return |
| assigned_at | timestamp | no | Assignment date |
| expected_return_date | date | yes | Expected return |
| returned_at | timestamp | yes | Actual return date |
| condition_on_assignment | varchar(50) | yes | Condition when assigned |
| condition_on_return | varchar(50) | yes | Condition when returned |
| notes | text | yes | Assignment notes |
| return_notes | text | yes | Return notes |
| status | varchar(50) | no | active, returned, overdue |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `asset_maintenance_records`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| asset_id | FK → assets | no | Asset being maintained |
| maintenance_type | varchar(50) | no | See types below |
| title | varchar(255) | no | Maintenance title |
| description | text | yes | Detailed description |
| vendor_id | FK → asset_vendors | yes | Service vendor |
| performed_by | varchar(255) | yes | Person who performed |
| cost | decimal(15,2) | yes | Maintenance cost |
| currency | varchar(10) | yes | Cost currency |
| scheduled_date | date | yes | Scheduled date |
| started_at | timestamp | yes | Start date |
| completed_at | timestamp | yes | Completion date |
| next_maintenance_date | date | yes | Next scheduled maintenance |
| status | varchar(50) | no | See statuses below |
| notes | text | yes | Additional notes |
| created_by | FK → users | yes | |
| updated_by | FK → users | yes | |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `asset_documents`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK → organizations | yes | Tenant scope |
| asset_id | FK → assets | no | Parent asset |
| file_name | varchar(255) | no | Original file name |
| file_path | varchar(500) | no | Storage path |
| mime_type | varchar(100) | yes | File MIME type |
| size | bigint unsigned | yes | File size in bytes |
| document_type | varchar(50) | no | See document types below |
| uploaded_by | FK → users | yes | Who uploaded |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `asset_status_history`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| asset_id | FK → assets | no | Asset |
| from_status | varchar(50) | yes | Previous status |
| to_status | varchar(50) | no | New status |
| reason | text | yes | Reason for change |
| changed_by | FK → users | yes | Who made the change |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

## Model Relationships

```
Asset
  ├── belongsTo → AssetCategory (category)
  ├── belongsTo → AssetVendor (vendor)
  ├── belongsTo → AssetLocation (location)
  ├── hasMany   → AssetAssignment (assignments)
  ├── hasOne    → AssetAssignment (currentAssignment, where status = active)
  ├── hasMany   → AssetMaintenanceRecord (maintenanceRecords)
  ├── hasMany   → AssetDocument (documents)
  ├── hasMany   → AssetStatusHistory (statusHistory)
  ├── belongsTo → User (createdBy)
  └── belongsTo → User (updatedBy)

AssetCategory
  ├── belongsTo → AssetCategory (parent)
  ├── hasMany   → AssetCategory (children)
  └── hasMany   → Asset (assets)

AssetVendor
  ├── hasMany → Asset (assets)
  └── hasMany → AssetMaintenanceRecord (maintenanceRecords)

AssetLocation
  └── hasMany → Asset (assets)

AssetAssignment
  ├── belongsTo → Asset
  ├── belongsTo → Employee
  ├── belongsTo → User (assignedByUser)
  └── belongsTo → User (returnedToUser)

AssetMaintenanceRecord
  ├── belongsTo → Asset
  ├── belongsTo → AssetVendor (vendor)
  ├── belongsTo → User (createdBy)
  └── belongsTo → User (updatedBy)

AssetDocument
  ├── belongsTo → Asset
  └── belongsTo → User (uploader)

Employee
  ├── hasMany → AssetAssignment (assetAssignments)
  └── hasMany → AssetAssignment (currentAssetAssignments, where status = active)
```

## Business Rules

1. **Asset Tag Uniqueness**: Asset tags are unique per organization.
2. **Assignment**: Only assets with status `available` can be assigned. Assignment sets status to `assigned`.
3. **Return**: Returning an asset closes the active assignment and sets status back to `available`. Asset condition is updated to match return condition.
4. **Disposal**: Assigned assets cannot be disposed — they must be returned first.
5. **Maintenance**: Starting maintenance sets asset status to `in_maintenance`. Completing maintenance returns it to `available`.
6. **Status History**: Every status change is recorded in the `asset_status_history` table with the reason and user who made the change.
7. **Soft Delete**: Assets use soft deletes. Deleted assets are hidden from listings but retain audit history.
8. **Category Protection**: Categories with assets cannot be deleted. Categories with child categories cannot be deleted.
9. **Vendor Protection**: Vendors with associated assets cannot be deleted.
10. **Location Protection**: Locations with associated assets cannot be deleted.

## Asset Statuses

| Value | Label | Description |
|-------|-------|-------------|
| `available` | Available | Ready for assignment |
| `assigned` | Assigned | Currently assigned to an employee |
| `in_maintenance` | In Maintenance | Undergoing maintenance |
| `retired` | Retired | No longer in active use |
| `disposed` | Disposed | Permanently removed |
| `lost` | Lost | Lost or unaccounted for |
| `damaged` | Damaged | Damaged and not operational |

## Asset Conditions

| Value | Label |
|-------|-------|
| `new` | New |
| `good` | Good |
| `fair` | Fair |
| `poor` | Poor |
| `non_functional` | Non-Functional |

## Depreciation Methods

| Value | Label |
|-------|-------|
| `straight_line` | Straight Line |
| `declining_balance` | Declining Balance |
| `sum_of_years` | Sum of Years |
| `units_of_production` | Units of Production |
| `none` | None |

## Maintenance Types

| Value | Label |
|-------|-------|
| `preventive` | Preventive |
| `corrective` | Corrective |
| `inspection` | Inspection |
| `calibration` | Calibration |

## Maintenance Statuses

| Value | Label |
|-------|-------|
| `scheduled` | Scheduled |
| `in_progress` | In Progress |
| `completed` | Completed |
| `cancelled` | Cancelled |

## Document Types

| Value | Label |
|-------|-------|
| `purchase_receipt` | Purchase Receipt |
| `warranty` | Warranty Document |
| `manual` | User Manual |
| `insurance` | Insurance Document |
| `photo` | Photo |
| `other` | Other |

## Permissions

| Permission | Description |
|------------|-------------|
| `assets.view` | Browse assets |
| `assets.create` | Create assets |
| `assets.update` | Edit assets |
| `assets.delete` | Delete assets |
| `assets.assign` | Assign and return assets |
| `assets.dispose` | Dispose/retire assets |
| `assets.documents.manage` | Upload, download, delete asset documents |
| `assets.maintenance.view` | View maintenance records |
| `assets.maintenance.manage` | Create/edit/delete maintenance records |
| `assets.categories.view` | View asset categories |
| `assets.categories.manage` | Create/edit/delete categories |
| `assets.vendors.view` | View asset vendors |
| `assets.vendors.manage` | Create/edit/delete vendors |
| `assets.locations.view` | View asset locations |
| `assets.locations.manage` | Create/edit/delete locations |
| `assets.reports` | Access asset reports |

### Default Role Assignments

- **SYS_ADMIN**: All (`assets.*`)
- **HR_ADMIN**: All (`assets.*`)
- **MANAGER**: View, assign, view maintenance/categories/vendors/locations, reports
- **EMPLOYEE**: View only (`assets.view`)
- **AUDITOR**: View, maintenance view, reports

## Multi-Tenancy

- All asset tables include `organization_id`
- Models use the `BelongsToOrganization` trait with automatic `OrganizationScope`
- Asset tag and category/vendor/location codes are unique per organization
- Cross-tenant access is prevented by the global scope

## Audit Trail

All models (except `AssetStatusHistory`) use the `Auditable` trait:
- Auto-logs create, update, delete operations
- Custom audit events: assign, return, dispose (via `AuditLogger::logCustom`)
- Document upload/download logged as custom audit events

## Asset Documents

Files are stored at: `storage/app/public/assets/{asset_id}/`

Supported operations:
- Upload (max 20MB, with document type classification)
- Download
- Delete (also removes file from storage)

## Routes

### Core Asset Routes (`/assets`)

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| GET | `/` | List assets | assets.view |
| GET | `/create` | Create form | assets.create |
| POST | `/` | Store asset | assets.create |
| GET | `/{asset}` | Show detail | assets.view |
| GET | `/{asset}/edit` | Edit form | assets.update |
| PUT | `/{asset}` | Update asset | assets.update |
| DELETE | `/{asset}` | Delete asset | assets.delete |
| POST | `/{asset}/assign` | Assign to employee | assets.assign |
| POST | `/{asset}/return` | Return from employee | assets.assign |
| POST | `/{asset}/dispose` | Dispose asset | assets.dispose |
| POST | `/{asset}/documents` | Upload document | assets.documents.manage |
| GET | `/{asset}/documents/{document}/download` | Download | assets.documents.manage |
| DELETE | `/{asset}/documents/{document}` | Delete document | assets.documents.manage |

### Maintenance Routes (`/assets/{asset}/maintenance`)

| Method | Path | Action | Permission |
|--------|------|--------|------------|
| GET | `/` | List records | assets.maintenance.view |
| GET | `/create` | Create form | assets.maintenance.manage |
| POST | `/` | Store record | assets.maintenance.manage |
| GET | `/{maintenance}` | Show detail | assets.maintenance.view |
| GET | `/{maintenance}/edit` | Edit form | assets.maintenance.manage |
| PUT | `/{maintenance}` | Update record | assets.maintenance.manage |
| DELETE | `/{maintenance}` | Delete record | assets.maintenance.manage |

### Settings Routes

| Prefix | Controller | Permissions |
|--------|-----------|-------------|
| `/asset-categories` | AssetCategoryController | assets.categories.* |
| `/asset-vendors` | AssetVendorController | assets.vendors.* |
| `/asset-locations` | AssetLocationController | assets.locations.* |

### Report Routes (`/reports/assets`)

| Method | Path | Report |
|--------|------|--------|
| GET | `/register` | Full asset register |
| GET | `/by-category` | Assets grouped by category |
| GET | `/by-status` | Assets grouped by status |
| GET | `/by-location` | Assets grouped by location |
| GET | `/by-condition` | Assets grouped by condition |
| GET | `/warranty-expiring` | Warranty expiring soon |
| GET | `/assignments` | Assignment history |
| GET | `/maintenance` | Maintenance history |
| GET | `/depreciation` | Depreciation schedule |

## Frontend Pages

| Page | Path | Description |
|------|------|-------------|
| `Assets/Index.tsx` | `/assets` | Asset list with search, filters, status badges |
| `Assets/Create.tsx` | `/assets/create` | Multi-card create form |
| `Assets/Edit.tsx` | `/assets/{id}/edit` | Edit form |
| `Assets/Show.tsx` | `/assets/{id}` | Tabbed detail: Overview, Assignments, Maintenance, Documents, Status History |
| `AssetCategories/Index.tsx` | `/asset-categories` | Category list |
| `AssetCategories/Create.tsx` | `/asset-categories/create` | Category form |
| `AssetCategories/Edit.tsx` | `/asset-categories/{id}/edit` | Category edit |
| `AssetVendors/Index.tsx` | `/asset-vendors` | Vendor list |
| `AssetVendors/Create.tsx` | `/asset-vendors/create` | Vendor form |
| `AssetVendors/Edit.tsx` | `/asset-vendors/{id}/edit` | Vendor edit |
| `AssetLocations/Index.tsx` | `/asset-locations` | Location list |
| `AssetLocations/Create.tsx` | `/asset-locations/create` | Location form |
| `AssetLocations/Edit.tsx` | `/asset-locations/{id}/edit` | Location edit |
| `AssetMaintenance/Create.tsx` | `/assets/{id}/maintenance/create` | Maintenance form |
| `AssetMaintenance/Edit.tsx` | `/assets/{id}/maintenance/{id}/edit` | Maintenance edit |
| `AssetMaintenance/Show.tsx` | `/assets/{id}/maintenance/{id}` | Maintenance detail |

## Employee Profile Integration

The Employee Show page includes an **Assets** tab with:
- **Currently Assigned Assets**: Table showing active asset assignments
- **Assignment History**: Table showing all past assignments with return dates and conditions

## Sidebar Navigation

Assets appear in the main navigation between Payroll and Reports:
- **Assets** (`/assets`) — requires `assets.view`

Asset settings pages (Categories, Vendors, Locations) are accessible from within the Assets module.

## Migration / Upgrade Notes

1. Run migrations: `php artisan migrate`
2. Sync permissions: Ensure `config/rbac.php` permission seeds are synced
3. Assign `assets.*` permissions to relevant roles via the Permission Matrix
4. No existing data is modified — this is a purely additive migration
