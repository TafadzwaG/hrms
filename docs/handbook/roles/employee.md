# Employee

Employee is the self-service role for personal requests, profile visibility, payslips, and day-to-day workforce interactions.

## User documentation

### Workflow
```mermaid
flowchart LR
    A["Open employee dashboard"] --> B["Review personal alerts and balances"]
    B --> C["Submit leave or timesheet actions"]
    C --> D["Access payslips, benefits, learning, and scorecards"]
```

### Primary modules
- Dashboard
- Leave Management
- Attendance
- Timesheets
- Benefits
- Payslips

## Technical documentation

- Resolved dashboard role: `employee`
- Seeded role code: `EMPLOYEE`
- Shared page scoping defaults to self-only records where applied
- Key permissions are self-service oriented and defined in `config/rbac.php`

