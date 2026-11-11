# Payroll Module

## Overview

The payroll module adds tenant-aware payroll processing to the existing HRMS without replacing the current employee, RBAC, audit, or reporting architecture.

It is designed around:

- shared-database multi-tenancy with row-level isolation
- permission-driven payroll access
- audited payroll workflow actions
- snapshot-based historical payroll results
- reusable calculation and export services

## Core entities

The module introduces these tenant-owned tables:

- `payroll_periods`
- `pay_codes`
- `employee_payroll_profiles`
- `employee_recurring_pay_items`
- `employee_payroll_settlement_rules`
- `payroll_inputs`
- `payroll_runs`
- `payroll_results`
- `payroll_result_lines`
- `payroll_period_exchange_rates`
- `payroll_result_settlements`
- `payroll_statutory_summaries`

It also extends the existing `payroll_exports` table so payroll-generated reports and payslips are traceable back to the period and run that produced them.

## Tenant model

All payroll core records are scoped by `organization_id`.

Tenant isolation is enforced by:

- `BelongsToOrganization` on payroll models
- `TenantContext` resolution per request
- explicit tenant-scoped model resolution in payroll controllers
- tenant-scoped validation rules in payroll form requests

This means payroll periods, profiles, inputs, runs, results, payslips, and exports cannot be accessed across organizations by direct URL manipulation.

## Permissions

Payroll is integrated into the existing dynamic RBAC catalog in `config/rbac.php`.

Registered payroll permissions:

- `payroll.view`
- `payroll.manage`
- `payroll.process`
- `payroll.approve`
- `payroll.close`
- `payroll.export`
- `payroll.profile.manage`
- `payroll.paycodes.manage`
- `payroll.inputs.manage`
- `payroll.reports.view`

The existing legacy export permissions for `payroll-exports` remain in place for backward compatibility.

## Audit coverage

Payroll actions are audited through the existing audit infrastructure.

Audited actions include:

- payroll period create, update, delete
- pay code changes
- payroll profile changes
- recurring pay item changes
- payroll input imports and edits
- payroll processing
- approval
- closure
- reopen
- payslip/report exports

Sensitive profile fields such as bank account and statutory registration numbers are redacted through the model audit configuration.

## Processing flow

Payroll processing is handled by `PayrollProcessingService` and `PayrollCalculationService`.

Processing pipeline:

1. resolve the current organization
2. synchronize default pay codes for that organization
3. resolve the selected payroll period
4. load active employee payroll profiles effective for the period
5. load recurring items, period inputs, and approved timesheet overtime
6. calculate result lines
7. calculate gross pay, pre-tax deductions, taxable income, PAYE, statutory deductions, total deductions, and net pay
8. store a payroll run
9. store employee payroll results and result lines as snapshots
10. split net pay into settlement currencies using period exchange rates and employee settlement rules
11. store settlement snapshots per payroll result
12. store statutory summaries
13. audit the workflow action

Historical integrity is preserved because results store snapshots of employee, profile, and amount data at processing time.

## Payroll outputs

The module provides:

- payroll dashboard
- payroll periods list and detail
- pay code management
- employee payroll profiles
- payroll input capture and CSV import
- payroll processing and workflow actions
- payroll report center
- CSV/XLSX-style exports through the existing report/export infrastructure
- PDF payslips using DomPDF

Report outputs currently include:

- payroll register
- earnings summary
- deductions summary
- statutory summary
- bank summary
- journal summary

The bank summary is now settlement-aware, so a single employee can produce separate USD and ZiG payout rows in the same payroll run.

## UI pages

Frontend pages live under `resources/js/pages/Payroll` and reuse the existing `AppLayout`, breadcrumb, card, table, dialog, and responsive page patterns already used in the employee module.

Pages included:

- `Payroll/Index`
- `Payroll/Periods/Index`
- `Payroll/Periods/Show`
- `Payroll/PayCodes/Index`
- `Payroll/Profiles/Index`
- `Payroll/Inputs/Index`
- `Payroll/Reports/Index`
- `Payroll/Payslips/Show`

## Seed data

`PayrollPayCodeSeeder` provisions default pay codes per organization using `config/payroll.php`.

This seeder is registered in `DatabaseSeeder`.

## Setup

For an existing environment, run:

```bash
php artisan migrate
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=PayrollPayCodeSeeder
cmd /c npm run build
```

If you already run the main `DatabaseSeeder`, the payroll pay code seeder is included there.

## Tests

Payroll feature coverage is in `tests/Feature/PayrollModuleTest.php`.

The suite covers:

- dashboard rendering and pay code synchronization
- payroll processing
- approval and closure
- tenant isolation
- payslip rendering

Recommended targeted verification:

```bash
php artisan test tests/Feature/PayrollModuleTest.php
php artisan test tests/Feature/MultiTenancyTest.php
php artisan test tests/Feature/AuditTrailTest.php
php artisan test tests/Feature/DashboardTest.php
cmd /c npm run build
```

## Configuration

Payroll defaults live in `config/payroll.php`.

Current configuration includes:

- default currency
- supported settlement currencies
- settlement allocation methods
- standard monthly hours
- payroll frequencies
- payroll statuses
- default pay code catalogue
- statutory deduction defaults
- legacy PAYE bands, used only when no tax table exists

To add a new default pay code:

1. add the definition to `config/payroll.php`
2. run `php artisan db:seed --class=PayrollPayCodeSeeder`

To adjust tax rules:

1. add a new row to `payroll_tax_tables` (with its `payroll_tax_bands`) for the currency and pay frequency, with the date it takes effect
2. set `effective_to` on the table it replaces
3. reprocess only open/reopened payroll periods

## Tax tables, AIDS Levy and pre-tax deductions

PAYE comes from dated tax tables, not from `config/payroll.php`.

- `payroll_tax_tables` holds one table per currency, pay frequency and effective date. `organization_id` is null for system-wide tables; an organization can override with its own row.
- `payroll_tax_bands` holds the bands. Tax is charged progressively: each band's rate applies to the income between its lower and upper bound.
- `PayrollTaxService::calculate()` picks the table in force on the period end date, using the employee profile's currency and the period's frequency.
- The AIDS Levy is the table's `aids_levy_percent` (3%) of PAYE, shown as its own `AIDS` line.
- Pension, NSSA, NEC and union contributions are deducted before tax. Union dues are `union_percent` of basic salary.
- If no table exists for a currency and frequency, the legacy `tax.bands` in `config/payroll.php` are used and the run carries a warning.
- A table with no `verified_at` date also puts a warning on the run. Set `verified_at` once a payroll specialist has checked the bands against ZIMRA's published tables.

The USD tables are seeded by the migration and are unverified. No ZiG tables are seeded.

## Tax methods (FDS)

Each payroll profile has a tax method. The default, `NON_FDS`, taxes each period on its own, so nothing changes for an employee until their method is changed.

- `NON_FDS`: the period is taxed on its own from the table for its pay frequency. No credits.
- `FDS_AVERAGE`: year-to-date regular taxable income is averaged and annualised, taxed on the annual table, and the share for the months so far is taken. Irregular income is added at its actual amount. Credits to date are deducted, then the tax already deducted this year.
- `FDS_FORECAST`: the same annual forecast, less forecast credits and tax already deducted, spread evenly over the months that remain. It has no worked example to test against yet and must be checked by a payroll specialist before use.

FDS needs year-to-date figures, which come from `payroll_tax_ledger` (one row per employee and period, written every time a period is processed). An employee on an FDS method is taxed as Non-FDS for a period, with a warning on the run, when:

- the pay frequency is not monthly
- there is no `ANNUAL` tax table for the currency
- the ledger does not cover every earlier month of the tax year (a mid-year joiner, a suspension, or history from before HRX)

An opening balance row (`is_opening_balance`, `periods_covered` = months covered, no period) lets an employee start FDS part-way through a year. There is no screen for opening balances yet.

The tax year is the calendar year of the period end date. Periods must be processed in order: reprocessing an earlier month does not recalculate later ones.

Pay codes carry an income type: `REGULAR`, `IRREGULAR` or `BONUS`. A `BONUS` code is irregular and uses up the tax-free bonus amount for the year. A deduction pay code marked as a medical aid contribution earns the medical credit under FDS.

## Figures the payroll specialist enters

On Payroll > Tax tables and credits (`/payroll/tax-tables`, permission `payroll.tax.manage`):

- tax bands, AIDS Levy rate and effective dates for each currency and pay frequency, including the annual table FDS uses
- the tax-free bonus amount, the elderly, blind and disabled person credits, and the medical credit percentage, per tax year
- a "Verified against ZIMRA" tick on each, which records who verified it and when

Amounts left empty are not applied. System-wide rows can only be changed by a super admin; anyone else's change is saved as a row for their own organization, which then takes precedence.

After deploying, run `php artisan db:seed --class=PermissionSeeder` so the new permissions exist.

## Parallel run

Every processed period records, per employee, what Non-FDS and FDS Average would each have charged. Payroll > Reports > Tax Method Comparison exports this for a run, so FDS can be checked against the current method before any employee is switched.

## Workflow rules

- The period page shows the buttons for the current status: Process (draft), Reprocess and Approve (processed), Close and Reopen (approved), Reopen (closed).
- A period can only be closed after its run is approved.
- Errors from process, approve, close and reopen are shown on the period page.
- Payslips can only be emailed or sent by SMS once the run is approved or closed. A user with `payslips.release_override` can release one earlier by sending an `override_reason` (10 to 500 characters); each use is recorded in the audit trail as `payslip_release_override`.

Closed historical runs are intentionally preserved and not recalculated automatically.

## Multi-currency settlement

The payroll engine now supports Belina-style split settlements such as:

- a fixed USD amount
- the remaining balance in ZiG

The design is intentionally snapshot-based:

- the payroll profile keeps a base calculation currency
- `employee_payroll_settlement_rules` define how net pay is allocated
- `payroll_period_exchange_rates` hold the run-specific FX rate
- `payroll_result_settlements` persist the exact payout breakdown used for that run

Supported allocation methods:

- `FIXED_AMOUNT`
- `PERCENTAGE`
- `REMAINDER`

Validation rules:

- fixed amount and percentage methods cannot be mixed on the same profile
- only one remainder rule can be active
- percentage rules cannot exceed 100%

Recommended Zimbabwe workflow:

1. keep the employee payroll profile base currency in `USD`
2. add a `USD` fixed amount settlement rule
3. add a `ZIG` remainder settlement rule
4. record the period `USD -> ZIG` exchange rate
5. process payroll

Payslips, run summaries, and bank exports will then show the split settlement amounts by currency.

## Current assumptions

- the existing app remains shared-db multi-tenant
- payroll permissions are organization-scoped through the active tenant context
- approved timesheets are the current overtime input source
- leave and attendance can feed future payroll rules without changing the current table design
- `payroll_exports` remains the downstream export ledger rather than the source of payroll truth

## Future extension points

The current structure is ready for:

- leave-based unpaid deductions
- attendance-driven earnings rules
- organization-specific tax tables
- subdomain tenancy
- bank file format variants
- accounting integration
- queued payroll processing for large tenant datasets
