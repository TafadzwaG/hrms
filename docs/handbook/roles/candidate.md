# Candidate

Candidate is the external portal role used to maintain a candidate profile and apply for jobs in the marketplace.

## User documentation

### Workflow
```mermaid
flowchart LR
    A["Open candidate hub"] --> B["Complete profile and upload documents"]
    B --> C["Browse jobs"]
    C --> D["Apply and monitor status"]
    D --> E["Respond to interviews"]
```

### Primary modules
- Candidate Hub
- Recruitment Marketplace
- Candidate Records

## Technical documentation

- Portal type: `candidate`
- Primary routes live under `/candidate/*`
- Controllers live under `app/Http/Controllers/Candidate/`
- Candidate portal access is resolved through the unified portal access layer

