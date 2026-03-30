# Employer

Employer is the external portal role used by company accounts to manage vacancies, candidates, interviews, billing, and employer branding.

## User documentation

### Workflow
```mermaid
flowchart LR
    A["Open employer hub"] --> B["Maintain company profile"]
    B --> C["Create and manage vacancies"]
    C --> D["Review candidates and interviews"]
    D --> E["Check reports and billing"]
```

### Primary modules
- Employer Hub
- Recruitment Marketplace
- Reports

## Technical documentation

- Portal type: `employer`
- Primary routes live under `/employer/*`
- Controllers live under `app/Http/Controllers/Employer/`
- Employer access is resolved through the unified portal access layer and company profile ownership

