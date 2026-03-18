# Recruitment / Job Marketplace Module

## Overview

The Recruitment / Job Marketplace module provides a full-featured candidate marketplace and job board within the HRMS. It supports four core workflows:

- **Candidate Marketplace** -- Job seekers create profiles with resumes, education, experience, and skills, then pay a listing fee (default $1 USD) to become visible in a searchable candidate directory.
- **Company Vacancy Posting** -- Employers register company profiles, receive admin approval, and post vacancies that candidates can apply to.
- **Candidate Directory** -- Approved employers browse and search the candidate directory to find talent matching their needs.
- **Admin Moderation** -- Administrators review company registrations, moderate listings, manage payments, and generate recruitment reports.

The module integrates a payment gateway abstraction layer supporting Paynow (EcoCash/InnBucks) and manual admin-confirmed payments.

---

## Database Schema

All tables are created by the migration `2026_03_17_400000_create_recruitment_marketplace_tables.php`, with an additional `payment_attempts` table added by `2026_03_18_100000_create_payment_attempts_and_fix_webhook_logs.php`.

### `candidate_profiles`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| user_id | FK -> users | no | Owning user |
| location | varchar(255) | yes | Candidate location |
| headline | varchar(255) | yes | Professional headline |
| summary | text | yes | Profile summary / bio |
| expected_salary | decimal(12,2) | yes | Expected salary amount |
| visibility_status | varchar(50) | no | draft, pending_payment, active, expired, suspended |
| is_public | boolean | no | Whether visible in directory (default: false) |
| listing_fee_paid | decimal(12,2) | yes | Amount paid for listing |
| listing_activated_at | timestamp | yes | When listing became active |
| listing_expires_at | timestamp | yes | When listing expires |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `candidate_resumes`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| candidate_profile_id | FK -> candidate_profiles | no | Parent profile |
| file_name | varchar(255) | no | Original file name |
| file_path | varchar(500) | no | Storage path |
| mime_type | varchar(100) | no | File MIME type |
| size | bigint unsigned | no | File size in bytes |
| is_primary | boolean | no | Primary resume flag (default: false) |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `candidate_educations`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| candidate_profile_id | FK -> candidate_profiles | no | Parent profile |
| institution | varchar(255) | no | Institution name |
| qualification | varchar(255) | no | Degree / diploma / certificate |
| field_of_study | varchar(255) | yes | Major / specialization |
| start_date | date | yes | Start date |
| end_date | date | yes | End date |
| grade | varchar(100) | yes | Grade / GPA / class |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `candidate_experiences`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| candidate_profile_id | FK -> candidate_profiles | no | Parent profile |
| employer_name | varchar(255) | no | Employer / company name |
| job_title | varchar(255) | no | Job title held |
| start_date | date | yes | Start date |
| end_date | date | yes | End date (null if current) |
| currently_working | boolean | no | Still employed here (default: false) |
| description | text | yes | Role description / responsibilities |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `candidate_skills`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| candidate_profile_id | FK -> candidate_profiles | no | Parent profile |
| name | varchar(255) | no | Skill name |
| level | varchar(50) | yes | beginner, intermediate, advanced, expert |
| years_experience | smallint unsigned | yes | Years of experience with skill |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `company_profiles`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| organization_id | FK -> organizations | yes | Tenant scope |
| user_id | FK -> users | no | Owning user |
| company_name | varchar(255) | no | Registered company name |
| industry | varchar(255) | yes | Industry sector |
| registration_number | varchar(100) | yes | Company registration number |
| email | varchar(255) | yes | Contact email |
| phone | varchar(50) | yes | Contact phone |
| website | varchar(255) | yes | Company website |
| address | text | yes | Physical address |
| description | text | yes | Company description |
| logo_path | varchar(500) | yes | Path to uploaded logo |
| status | varchar(50) | no | pending, approved, suspended (default: pending) |
| approved_at | timestamp | yes | When admin approved the profile |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `vacancies`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| company_profile_id | FK -> company_profiles | no | Posting company |
| title | varchar(255) | no | Job title |
| department | varchar(255) | yes | Department |
| category | varchar(255) | yes | Job category |
| employment_type | varchar(50) | no | full_time, part_time, contract, internship, temporary |
| work_mode | varchar(50) | yes | on_site, remote, hybrid |
| location | varchar(255) | yes | Job location |
| description | text | no | Full job description |
| requirements | text | yes | Qualification requirements |
| responsibilities | text | yes | Key responsibilities |
| salary_min | decimal(12,2) | yes | Minimum salary |
| salary_max | decimal(12,2) | yes | Maximum salary |
| application_deadline | date | yes | Deadline for applications |
| status | varchar(50) | no | draft, published, closed (default: draft) |
| published_at | timestamp | yes | When vacancy was published |
| closed_at | timestamp | yes | When vacancy was closed |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `vacancy_applications`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| vacancy_id | FK -> vacancies | no | Target vacancy |
| candidate_profile_id | FK -> candidate_profiles | no | Applying candidate |
| resume_id | FK -> candidate_resumes | yes | Attached resume |
| cover_letter | text | yes | Cover letter text |
| status | varchar(50) | no | applied, shortlisted, interviewed, offered, hired, rejected, withdrawn (default: applied) |
| applied_at | timestamp | yes | Application timestamp |
| shortlisted_at | timestamp | yes | When shortlisted |
| rejected_at | timestamp | yes | When rejected |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `payments`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| payable_type | varchar(255) | no | Polymorphic model type |
| payable_id | bigint unsigned | no | Polymorphic model ID |
| amount | decimal(12,2) | no | Payment amount |
| currency | varchar(10) | no | Currency code (e.g. USD) |
| provider | varchar(50) | no | Payment provider (paynow, manual) |
| provider_reference | varchar(255) | yes | Reference from provider |
| status | varchar(50) | no | pending, paid, failed, cancelled (default: pending) |
| paid_at | timestamp | yes | When payment was confirmed |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

**Polymorphic index:** (payable_type, payable_id)

### `payment_webhook_logs`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| provider | varchar(50) | no | Payment provider |
| payload | json | no | Raw webhook payload |
| processed | boolean | no | Whether processed (default: false) |
| event | varchar(100) | yes | Webhook event type |
| ip_address | varchar(45) | yes | Source IP address |
| received_at | timestamp | yes | When webhook was received |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

### `payment_attempts`

Added by migration `2026_03_18_100000_create_payment_attempts_and_fix_webhook_logs.php`.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | no | |
| payment_id | FK -> payments | no | Parent payment |
| provider | varchar(50) | no | Provider used for this attempt |
| provider_reference | varchar(255) | yes | Provider transaction reference |
| status | varchar(50) | no | Attempt status |
| response_payload | json | yes | Raw provider response |
| created_at | timestamp | no | |
| updated_at | timestamp | no | |

---

## Candidate Flow

1. **Registration** -- User registers or logs in to the HRMS.
2. **Profile Creation** -- Candidate creates a profile with headline, summary, location, and expected salary. The profile starts in `draft` visibility status.
3. **Resume Upload** -- One or more resumes are uploaded (validated by file type and size). One resume can be marked as primary.
4. **Education** -- Candidate adds education records (institution, qualification, field of study, dates, grade).
5. **Experience** -- Candidate adds work experience records (employer, title, dates, description, currently-working flag).
6. **Skills** -- Candidate adds skills with proficiency level and years of experience.
7. **Checkout** -- Candidate proceeds to checkout. The visibility status moves to `pending_payment`.
8. **Payment** -- A $1 USD listing fee is charged via the configured payment gateway (Paynow or manual).
9. **Listing Activation** -- On successful payment, the listing is activated: `is_public` is set to `true`, `visibility_status` to `active`, `listing_activated_at` to now, and `listing_expires_at` set based on configured duration (default 365 days).
10. **Directory Visibility** -- The candidate profile appears in the searchable candidate directory for approved employers.

---

## Company Flow

1. **Profile Creation** -- Employer creates a company profile with company name, industry, registration number, contact details, description, and logo. The profile starts in `pending` status.
2. **Admin Review** -- An administrator reviews the company profile and either approves or suspends it. On approval, `status` is set to `approved` and `approved_at` is timestamped.
3. **Post Vacancies** -- Approved companies can create and publish vacancies.
4. **Search Candidates** -- Employers browse the candidate directory, filtering by skills, location, experience, and other criteria.
5. **Review Applications** -- Employers review applications received for their vacancies and progress candidates through the hiring pipeline.

---

## Vacancy Flow

1. **Create Draft** -- Company user creates a vacancy with title, department, category, employment type, work mode, location, description, requirements, responsibilities, salary range, and application deadline. The vacancy starts in `draft` status.
2. **Publish** -- The vacancy is published, setting `status` to `published` and recording `published_at`.
3. **Receive Applications** -- Candidates apply to published vacancies, attaching a resume and optional cover letter. Each application is recorded with status `applied`.
4. **Shortlist** -- Employer shortlists promising candidates (`shortlisted`, `shortlisted_at` set).
5. **Interview** -- Shortlisted candidates move to `interviewed` status.
6. **Offer / Hire** -- Employer extends an offer (`offered`) and finalizes hiring (`hired`).
7. **Reject** -- Candidates not progressing are rejected (`rejected`, `rejected_at` set).
8. **Withdraw** -- Candidates may withdraw their own applications (`withdrawn`).
9. **Close** -- When the position is filled or no longer needed, the vacancy is closed (`closed`, `closed_at` set).

---

## Payment Activation Flow

```
Candidate initiates payment
        |
        v
Payment record created (status: pending, payable -> CandidateProfile)
        |
        v
PaymentService calls gateway->initiatePayment()
        |
        v
Gateway returns redirect URL or poll reference
        |
        v
Candidate completes payment on gateway
        |
        v
Gateway sends webhook callback to /webhooks/paynow
        |
        v
PaymentWebhookController logs webhook in payment_webhook_logs
        |
        v
Payment verified -> Payment marked paid (status: paid, paid_at set)
        |
        v
CandidateListingActivationService triggered:
  - candidate_profile.is_public = true
  - candidate_profile.visibility_status = 'active'
  - candidate_profile.listing_activated_at = now()
  - candidate_profile.listing_expires_at = now() + listing_duration_days
  - candidate_profile.listing_fee_paid = amount
```

---

## Gateway Abstraction Design

All payment gateway logic resides in `app/Support/Payments/`. The design follows a strategy pattern so new providers can be added without modifying existing code.

### PaymentGatewayInterface

Defines the contract every gateway must implement:

```php
interface PaymentGatewayInterface
{
    public function initiatePayment(Payment $payment, array $options = []): array;
    public function verifyPayment(string $reference): array;
    public function getProviderName(): string;
}
```

- `initiatePayment()` -- Creates a transaction with the provider. Returns an array with redirect URL, poll URL, or status information.
- `verifyPayment()` -- Checks the status of a transaction by its provider reference.
- `getProviderName()` -- Returns the provider identifier string (e.g. `paynow`, `manual`).

### PaynowGateway

Integrates with the Paynow Zimbabwe payment platform, supporting EcoCash and InnBucks mobile money channels.

- Uses Paynow PHP SDK or direct API integration.
- Reads credentials from `config/recruitment.php` (sourced from `PAYNOW_INTEGRATION_ID`, `PAYNOW_INTEGRATION_KEY`, `PAYNOW_RESULT_URL`, `PAYNOW_RETURN_URL` environment variables).
- `initiatePayment()` creates a Paynow transaction and returns the redirect/poll URL.
- `verifyPayment()` polls Paynow for transaction status.

### ManualGateway

Supports admin-confirmed payments for scenarios where electronic payment is not available.

- `initiatePayment()` creates a payment record with `pending` status and returns instructions for the candidate.
- `verifyPayment()` checks the local payment record status (admin marks as paid via the admin panel).
- Useful for bank transfers, cash payments, or other offline methods.

### PaymentService

The orchestrator that coordinates payment creation and gateway interaction:

- Resolves the appropriate gateway implementation based on configuration or request.
- Creates the `Payment` Eloquent model (polymorphic to the payable entity).
- Calls `gateway->initiatePayment()` and returns the result to the controller.
- Handles payment verification and status updates.

### CandidateListingActivationService

Activates a candidate listing upon successful payment:

- Triggered after payment is marked as `paid`.
- Sets `is_public = true`, `visibility_status = 'active'` on the candidate profile.
- Records `listing_activated_at` and calculates `listing_expires_at` based on `config('recruitment.listing_duration_days')`.
- Stores the paid amount in `listing_fee_paid`.

---

## Routes

### Public (no authentication)

| Method | URI | Description |
|--------|-----|-------------|
| POST | `/webhooks/paynow` | Paynow webhook callback endpoint |

### Authenticated

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/recruitment` | Recruitment dashboard |

#### Candidate Profiles

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/candidate-profiles` | List candidate profiles |
| GET | `/candidate-profiles/create` | Create form |
| POST | `/candidate-profiles` | Store new profile |
| GET | `/candidate-profiles/{id}` | Show profile |
| GET | `/candidate-profiles/{id}/edit` | Edit form |
| PUT | `/candidate-profiles/{id}` | Update profile |
| DELETE | `/candidate-profiles/{id}` | Delete profile |
| POST | `/candidate-profiles/{id}/checkout` | Initiate listing payment |

#### Company Profiles

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/company-profiles` | List company profiles |
| GET | `/company-profiles/create` | Create form |
| POST | `/company-profiles` | Store new profile |
| GET | `/company-profiles/{id}` | Show profile |
| GET | `/company-profiles/{id}/edit` | Edit form |
| PUT | `/company-profiles/{id}` | Update profile |
| DELETE | `/company-profiles/{id}` | Delete profile |
| POST | `/company-profiles/{id}/approve` | Admin approve company |
| POST | `/company-profiles/{id}/suspend` | Admin suspend company |

#### Vacancies

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/vacancies` | List vacancies |
| GET | `/vacancies/create` | Create form |
| POST | `/vacancies` | Store new vacancy |
| GET | `/vacancies/{id}` | Show vacancy |
| GET | `/vacancies/{id}/edit` | Edit form |
| PUT | `/vacancies/{id}` | Update vacancy |
| DELETE | `/vacancies/{id}` | Delete vacancy |
| POST | `/vacancies/{id}/publish` | Publish vacancy |
| POST | `/vacancies/{id}/close` | Close vacancy |

#### Vacancy Applications

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/vacancy-applications` | List applications |
| GET | `/vacancy-applications/create` | Create form |
| POST | `/vacancy-applications` | Submit application |
| GET | `/vacancy-applications/{id}` | Show application |
| PUT | `/vacancy-applications/{id}` | Update application |
| POST | `/vacancy-applications/{id}/shortlist` | Shortlist candidate |
| POST | `/vacancy-applications/{id}/reject` | Reject candidate |
| POST | `/vacancy-applications/{id}/status` | Update application status |

#### Candidate Directory

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/candidate-directory` | Browse candidate directory |
| GET | `/candidate-directory/{id}` | View candidate details |

#### Reports

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/reports/recruitment/candidate-listings` | Candidate listings report |
| GET | `/reports/recruitment/vacancies-by-company` | Vacancies grouped by company |
| GET | `/reports/recruitment/applications-by-vacancy` | Applications per vacancy |
| GET | `/reports/recruitment/payment-summary` | Payment summary |
| GET | `/reports/recruitment/listing-revenue` | Listing revenue report |
| GET | `/reports/recruitment/employer-activity` | Employer activity report |
| GET | `/reports/recruitment/candidates-by-profession` | Candidates grouped by profession |
| GET | `/reports/recruitment/pending-listings` | Pending / unpaid listings |

---

## Permissions

| Permission | Description |
|------------|-------------|
| `recruitment.view` | View the recruitment dashboard |
| `recruitment.candidates.manage` | Create, edit, and delete candidate profiles |
| `recruitment.companies.manage` | Create, edit, delete, approve, and suspend company profiles |
| `recruitment.vacancies.manage` | Create, edit, publish, close, and delete vacancies |
| `recruitment.applications.manage` | View and update vacancy applications, change statuses |
| `recruitment.directory.view` | Browse the candidate directory |
| `recruitment.payments.manage` | View and manage payments, confirm manual payments |
| `recruitment.moderation.manage` | Moderate listings, approve/suspend companies |
| `recruitment.reports.view` | Access recruitment reports |

---

## Tenant and Audit Support

### Multi-Tenancy

- `candidate_profiles` and `company_profiles` have a nullable `organization_id` foreign key, allowing profiles to be scoped to a tenant or to exist globally (when `organization_id` is null).
- Tenant-scoped queries filter by the authenticated user's organization when applicable.

### Audit Trail

- All recruitment models use the `Auditable` trait for automatic change tracking.
- `AuditLogger` is used for custom audit events such as:
  - Company approval / suspension
  - Vacancy publishing / closing
  - Application status changes
  - Payment confirmation
  - Listing activation / expiration

---

## File Storage

### Resume Storage

- Resumes are stored using Laravel's Storage facade on the `public` disk.
- Each uploaded file is tracked in the `candidate_resumes` table with its original file name, storage path, MIME type, and file size.
- Validation enforces allowed file types (PDF, DOC, DOCX) and maximum file size.
- One resume per candidate profile can be marked as `is_primary`.

### Resume Downloads

- Resumes are served via `CandidateResumeController`, which checks authorization before streaming the file.
- Employers with `recruitment.directory.view` permission can download resumes from the candidate directory.

---

## Reports

Eight reports are available via `RecruitmentReportController`, which extends `BaseReportController`. All reports support export in XLSX, CSV, and ODS formats.

| Report | Description |
|--------|-------------|
| **candidate-listings** | All candidate listings with profile details, payment status, and activation dates |
| **vacancies-by-company** | Vacancies grouped by company profile, with counts and statuses |
| **applications-by-vacancy** | Application counts and status breakdown per vacancy |
| **payment-summary** | Payment records with amounts, providers, statuses, and dates |
| **listing-revenue** | Revenue from listing fees, grouped by period |
| **employer-activity** | Company activity metrics: vacancies posted, applications reviewed, hires made |
| **candidates-by-profession** | Candidate profiles grouped by headline / profession category |
| **pending-listings** | Candidate profiles in `pending_payment` or `draft` status awaiting activation |

---

## Configuration

Configuration is stored in `config/recruitment.php`:

```php
return [
    // Listing fee charged to candidates
    'listing_fee_amount' => env('RECRUITMENT_LISTING_FEE', 1),

    // Currency for listing fee
    'listing_fee_currency' => env('RECRUITMENT_LISTING_CURRENCY', 'USD'),

    // How long a listing stays active (days)
    'listing_duration_days' => env('RECRUITMENT_LISTING_DURATION', 365),

    // Available payment providers
    'payment_providers' => ['paynow', 'manual'],

    // Paynow gateway credentials
    'paynow' => [
        'integration_id'  => env('PAYNOW_INTEGRATION_ID'),
        'integration_key' => env('PAYNOW_INTEGRATION_KEY'),
        'result_url'      => env('PAYNOW_RESULT_URL'),
        'return_url'      => env('PAYNOW_RETURN_URL'),
    ],
];
```

---

## Frontend Pages

Twenty React/TypeScript pages are located in `resources/js/pages/Recruitment/`:

```
Recruitment/
  Dashboard.tsx
  Candidates/
    Index.tsx          -- List all candidate profiles
    Create.tsx         -- Multi-step candidate profile creation form
    Edit.tsx           -- Edit candidate profile, education, experience, skills
    Show.tsx           -- View candidate profile details
    Checkout.tsx       -- Payment checkout for listing activation
    ListingStatus.tsx  -- View listing status, activation, and expiry
  Companies/
    Index.tsx          -- List all company profiles
    Create.tsx         -- Company registration form
    Edit.tsx           -- Edit company profile
    Show.tsx           -- View company details and approval status
  Vacancies/
    Index.tsx          -- List vacancies with filters
    Create.tsx         -- Create vacancy form
    Edit.tsx           -- Edit vacancy
    Show.tsx           -- View vacancy details and applications summary
  Applications/
    Index.tsx          -- List applications with status filters
    Show.tsx           -- View application details, update status
  Directory/
    Index.tsx          -- Searchable candidate directory for employers
    Show.tsx           -- View candidate public profile from directory
  Admin/
    Payments.tsx       -- Admin payment management (confirm manual payments, view logs)
```

All pages use Inertia.js for server-driven SPA navigation with Laravel controllers providing data via `Inertia::render()`.

---

## Migration and Upgrade Notes

### Initial Setup

1. **Run migrations:**

   ```bash
   php artisan migrate
   ```

   This executes:
   - `2026_03_17_400000_create_recruitment_marketplace_tables.php` (10 tables)
   - `2026_03_18_100000_create_payment_attempts_and_fix_webhook_logs.php` (payment_attempts table)

2. **Seed permissions:**

   ```bash
   php artisan permissions:seed
   ```

   Seeds the nine recruitment permissions listed above. Assign them to roles as needed.

3. **Configure environment variables:**

   Add the following to your `.env` file:

   ```dotenv
   # Recruitment listing settings (optional, defaults shown)
   RECRUITMENT_LISTING_FEE=1
   RECRUITMENT_LISTING_CURRENCY=USD
   RECRUITMENT_LISTING_DURATION=365

   # Paynow gateway credentials (required if using Paynow)
   PAYNOW_INTEGRATION_ID=your_integration_id
   PAYNOW_INTEGRATION_KEY=your_integration_key
   PAYNOW_RESULT_URL=https://yourdomain.com/webhooks/paynow
   PAYNOW_RETURN_URL=https://yourdomain.com/recruitment
   ```

4. **Storage link:**

   Ensure the public storage symlink exists for resume file access:

   ```bash
   php artisan storage:link
   ```

### Upgrading

- If upgrading from an earlier version without the `payment_attempts` table, run `php artisan migrate` to apply the `2026_03_18_100000` migration.
- Review and re-seed permissions if new permissions have been added.
