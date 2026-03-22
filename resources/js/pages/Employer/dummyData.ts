export type Company = {
    id: number;
    company_name: string;
    status: string;
    industry?: string | null;
    registration_number?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    address?: string | null;
    description?: string | null;
    logo_path?: string | null;
    approved_at?: string | null;
    metadata?: Record<string, unknown>;
};

export type User = {
    name: string;
    email: string;
};

export type Vacancy = {
    id: number;
    title: string;
    status: string;
    status_code?: string;
    department?: string;
    category?: string | null;
    location: string | null;
    employment_type?: string | null;
    work_mode?: string | null;
    applications_count: number;
    description?: string | null;
    requirements?: string | null;
    responsibilities?: string | null;
    salary_min?: string | null;
    salary_max?: string | null;
    currency?: string | null;
    application_deadline?: string | null;
    published_at?: string | null;
    closed_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type RecentApplication = {
    id: number;
    candidate_id?: number | null;
    candidate_name: string;
    candidate_headline: string | null;
    candidate_location?: string | null;
    candidate_email?: string | null;
    candidate_phone?: string | null;
    candidate_years_experience?: number | null;
    vacancy_id?: number | null;
    vacancy_title: string;
    status: string;
    applied_at: string;
    applied_at_date?: string | null;
    cover_letter?: string | null;
    notes?: string | null;
    resume?: {
        id: number;
        file_name: string;
        download_url?: string;
    } | null;
    match_score?: number;
    match?: EmployerMatch | null;
    latest_interview?: EmployerInterview | null;
};

export type Metrics = {
    total_vacancies: number;
    published_vacancies: number;
    total_applications: number;
    company_status: string;
};

export type RecommendedTalent = {
    id: number;
    name: string;
    headline: string;
    initials: string;
    match_score?: number;
    location?: string | null;
    match?: EmployerMatch | null;
};

export type EmployerMatch = {
    score: number;
    label: string;
    reasons: string[];
    vacancy_id?: number | null;
    vacancy_title?: string | null;
};

export type EmployerInterview = {
    id: number;
    application_id: number;
    candidate_id?: number | null;
    vacancy_id?: number | null;
    candidate_name?: string | null;
    candidate_headline?: string | null;
    vacancy_title?: string | null;
    scheduled_at: string | null;
    scheduled_at_label?: string | null;
    ends_at?: string | null;
    ends_at_label?: string | null;
    timezone?: string | null;
    meeting_type: string;
    location?: string | null;
    instructions?: string | null;
    status: string;
    status_label?: string | null;
    candidate_response_note?: string | null;
    responded_at?: string | null;
    responded_at_label?: string | null;
};

export type EmployerCandidateProfile = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    alt_phone?: string | null;
    national_id?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    location?: string | null;
    headline?: string | null;
    professional_summary?: string | null;
    expected_salary?: string | null;
    salary_currency?: string | null;
    years_experience?: number | null;
    highest_education?: string | null;
    profile_visibility_status?: string | null;
    is_public?: boolean;
    is_verified?: boolean;
    stage?: string | null;
    status?: string | null;
    listing_activated_at?: string | null;
    listing_expires_at?: string | null;
    profile_views?: number;
};

export type EmployerCandidateEducation = {
    id: number;
    institution: string;
    qualification: string;
    field_of_study?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    grade?: string | null;
};

export type EmployerCandidateExperience = {
    id: number;
    employer_name: string;
    job_title: string;
    start_date?: string | null;
    end_date?: string | null;
    currently_working: boolean;
    description?: string | null;
};

export type EmployerCandidateSkill = {
    id: number;
    name: string;
    level?: string | null;
    years_experience?: number | null;
};

export type EmployerCandidateDocument = {
    id: number;
    file_name: string;
    document_type?: string | null;
    description?: string | null;
    mime_type?: string | null;
    size?: number | null;
    is_primary: boolean;
    uploaded_at?: string | null;
    preview_url: string;
    download_url: string;
};

export type BillingProfile = {
    billing_name: string | null;
    billing_email: string | null;
    billing_phone: string | null;
    billing_address: string | null;
    tax_number: string | null;
    metadata?: Record<string, unknown>;
};

export type SubscriptionPlan = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    price: string | null;
    currency: string | null;
    billing_interval: string | null;
    seat_limit: number | null;
    features: string[];
    is_active: boolean;
};

export type Subscription = {
    id: number;
    status: string;
    seats: number | null;
    amount: string | null;
    currency: string | null;
    started_at: string | null;
    renews_at: string | null;
    cancelled_at: string | null;
    plan: SubscriptionPlan | null;
    metadata?: Record<string, unknown>;
} | null;

export type Invoice = {
    id: number;
    invoice_number: string;
    amount: string | null;
    currency: string | null;
    status: string;
    description: string | null;
    issued_at: string | null;
    due_at: string | null;
    paid_at: string | null;
};

export const company: Company = {
    id: 1,
    company_name: 'Providence HR',
    status: 'verified',
};

export const user: User = {
    name: 'Amanda Ncube',
    email: 'amanda@providencehr.co.zw',
};

export const metrics: Metrics = {
    total_vacancies: 18,
    published_vacancies: 14,
    total_applications: 246,
    company_status: 'verified',
};

export const vacancies: Vacancy[] = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        status: 'Open',
        department: 'Engineering',
        location: 'Harare',
        applications_count: 34,
    },
    {
        id: 2,
        title: 'HR Business Partner',
        status: 'Reviewing',
        department: 'Human Resources',
        location: 'Bulawayo',
        applications_count: 21,
    },
    {
        id: 3,
        title: 'Finance Manager',
        status: 'Open',
        department: 'Finance',
        location: 'Remote',
        applications_count: 17,
    },
    {
        id: 4,
        title: 'Product Designer',
        status: 'Open',
        department: 'Design',
        location: 'Harare',
        applications_count: 26,
    },
];

export const recentApplications: RecentApplication[] = [
    {
        id: 1,
        candidate_name: 'Tafadzwa Moyo',
        candidate_headline: 'Frontend Developer',
        vacancy_title: 'Senior Frontend Developer',
        status: 'new',
        applied_at: '2 hours ago',
        match_score: 98,
        match: {
            score: 98,
            label: 'Strong Match',
            vacancy_title: 'Senior Frontend Developer',
            reasons: ['Matches your React and Laravel stack.', 'Experience level lines up with this role.'],
        },
    },
    {
        id: 2,
        candidate_name: 'Nomsa Dube',
        candidate_headline: 'HR Specialist',
        vacancy_title: 'HR Business Partner',
        status: 'shortlisted',
        applied_at: '4 hours ago',
        match_score: 96,
        match: {
            score: 96,
            label: 'Strong Match',
            vacancy_title: 'HR Business Partner',
            reasons: ['Role keywords align with your profile and experience.'],
        },
    },
    {
        id: 3,
        candidate_name: 'Brian Chitauro',
        candidate_headline: 'Finance Lead',
        vacancy_title: 'Finance Manager',
        status: 'interview',
        applied_at: 'Today, 08:30 AM',
        match_score: 94,
        match: {
            score: 94,
            label: 'Strong Match',
            vacancy_title: 'Finance Manager',
            reasons: ['Experience level lines up with this role.'],
        },
    },
];

export const applicationsByStatus: Record<string, number> = {
    new: 24,
    shortlisted: 10,
    interview: 6,
    offered: 2,
};

export const recommendedTalent: RecommendedTalent[] = [
    {
        id: 1,
        name: 'Marcus Low',
        headline: 'Fullstack • 8 yrs exp',
        initials: 'ML',
    },
    {
        id: 2,
        name: 'Sara Jensen',
        headline: 'UI/UX • 5 yrs exp',
        initials: 'SJ',
    },
];
