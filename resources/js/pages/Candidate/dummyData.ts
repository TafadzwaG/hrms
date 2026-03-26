export type CandidateUser = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    location: string;
    gender: string;
    date_of_birth: string;
    years_experience: number;
    expected_salary: string;
    salary_currency: string;
    highest_education: string;
    professional_summary: string;
    profile_visibility_status: string;
    is_verified: boolean;
    stage: string;
    status: string;
    listing_activated_at: string;
    listing_expires_at: string;
    headline: string;
    profile_image_url?: string | null;
};

export type CandidateMetrics = {
    total_applications: number;
    resumes_uploaded: number;
    profile_views: number;
    skills_count: number;
};

export type CandidateRecentApplication = {
    id: number;
    vacancy_title: string;
    company_name: string;
    location: string | null;
    employment_type: string | null;
    status: string;
    applied_at: string;
};

export type CandidateEducation = {
    id: number;
    institution: string;
    qualification: string;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    grade: string | null;
};

export type CandidateExperience = {
    id: number;
    employer_name: string;
    job_title: string;
    start_date: string | null;
    end_date: string | null;
    currently_working: boolean;
    description: string | null;
};

export type CandidateSkill = {
    id: number;
    name: string;
    level: string | null;
    years_experience: number | null;
};

export type CandidateResume = {
    id: number;
    file_name: string;
    is_primary: boolean;
    uploaded_at: string;
};

export type CandidateVacancyMatch = {
    score: number;
    label: string;
    reasons: string[];
};

export type CandidateRecommendedVacancy = {
    id: number;
    title: string;
    company_name: string;
    location: string | null;
    employment_type: string | null;
    work_mode?: string | null;
    salary_min: string | null;
    salary_max: string | null;
    currency: string | null;
    department?: string | null;
    category?: string | null;
    description?: string | null;
    requirements?: string | null;
    responsibilities?: string | null;
    application_deadline?: string | null;
    status?: string | null;
    published_at?: string | null;
    has_applied?: boolean;
    application_status?: string | null;
    match?: CandidateVacancyMatch | null;
};

export type CandidateApplication = CandidateRecentApplication & {
    vacancy_id?: number | null;
    work_mode?: string | null;
    salary_min?: string | null;
    salary_max?: string | null;
    currency?: string | null;
    cover_letter?: string | null;
    notes?: string | null;
    resume?: {
        id: number;
        file_name: string;
        download_url?: string;
    } | null;
    interviews?: CandidateInterview[];
};

export type CandidateInterview = {
    id: number;
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
    can_respond?: boolean;
    response_url?: string;
};

export type CandidateDocument = CandidateResume & {
    document_type: string | null;
    description: string | null;
    mime_type: string | null;
    size: number | null;
    preview_url: string;
    download_url: string;
};

export type CandidateSettings = {
    preferences: {
        job_alerts: boolean;
        newsletter: boolean;
        remote_only: boolean;
        preferred_work_modes: string[];
    };
};

export const candidateUser: CandidateUser = {
    id: 1,
    full_name: 'Rumbidzai Moyo',
    email: 'rumbidzai.moyo@example.com',
    phone: '+263 77 123 4567',
    location: 'Harare, Zimbabwe',
    gender: 'Female',
    date_of_birth: '1998-04-12',
    years_experience: 5,
    expected_salary: '2200',
    salary_currency: 'USD',
    highest_education: 'bachelors_degree',
    professional_summary:
        'Product-focused frontend developer with experience building modern web applications, design systems, and user-friendly dashboards across HR and recruitment platforms.',
    profile_visibility_status: 'active',
    is_verified: true,
    stage: 'listed',
    status: 'available',
    listing_activated_at: '2026-01-10',
    listing_expires_at: '2026-06-30',
    headline: 'Frontend Developer • React • TypeScript',
};

export const candidateMetrics: CandidateMetrics = {
    total_applications: 18,
    resumes_uploaded: 3,
    profile_views: 146,
    skills_count: 8,
};

export const candidateCompleteness = 86;

export const candidateApplicationsByStatus: Record<string, number> = {
    submitted: 8,
    shortlisted: 4,
    interview: 3,
    offered: 2,
    hired: 1,
};

export const candidateRecentApplications: CandidateRecentApplication[] = [
    {
        id: 1,
        vacancy_title: 'Senior Frontend Developer',
        company_name: 'Providence HR',
        location: 'Harare',
        employment_type: 'Full-time',
        status: 'shortlisted',
        applied_at: '2026-02-10',
    },
    {
        id: 2,
        vacancy_title: 'UI Engineer',
        company_name: 'Nova Labs',
        location: 'Remote',
        employment_type: 'Contract',
        status: 'interview',
        applied_at: '2026-02-18',
    },
    {
        id: 3,
        vacancy_title: 'Product Designer',
        company_name: 'BluePeak',
        location: 'Bulawayo',
        employment_type: 'Full-time',
        status: 'submitted',
        applied_at: '2026-03-02',
    },
];

export const candidateEducations: CandidateEducation[] = [
    {
        id: 1,
        institution: 'University of Zimbabwe',
        qualification: 'BSc Computer Science',
        field_of_study: 'Software Engineering',
        start_date: '2016-08-01',
        end_date: '2020-11-30',
        grade: '2.1',
    },
    {
        id: 2,
        institution: 'Google Career Certificates',
        qualification: 'UX Design Certificate',
        field_of_study: 'UX Design',
        start_date: '2022-01-01',
        end_date: '2022-06-30',
        grade: null,
    },
];

export const candidateExperiences: CandidateExperience[] = [
    {
        id: 1,
        employer_name: 'Providence Digital',
        job_title: 'Frontend Developer',
        start_date: '2023-01-01',
        end_date: null,
        currently_working: true,
        description: 'Building internal dashboards, candidate portals, and HR workflow tools using React, TypeScript, and Tailwind CSS.',
    },
    {
        id: 2,
        employer_name: 'ZimTech Solutions',
        job_title: 'Junior Web Developer',
        start_date: '2020-02-01',
        end_date: '2022-12-01',
        currently_working: false,
        description: 'Worked on company websites, recruitment landing pages, and CMS integrations for business clients.',
    },
];

export const candidateSkills: CandidateSkill[] = [
    { id: 1, name: 'React', level: 'expert', years_experience: 5 },
    { id: 2, name: 'TypeScript', level: 'advanced', years_experience: 4 },
    { id: 3, name: 'Tailwind CSS', level: 'advanced', years_experience: 4 },
    { id: 4, name: 'JavaScript', level: 'expert', years_experience: 5 },
    { id: 5, name: 'UI Design', level: 'intermediate', years_experience: 3 },
    { id: 6, name: 'Figma', level: 'intermediate', years_experience: 3 },
    { id: 7, name: 'Inertia.js', level: 'intermediate', years_experience: 2 },
    { id: 8, name: 'Laravel', level: 'beginner', years_experience: 1 },
];

export const candidateResumes: CandidateResume[] = [
    {
        id: 1,
        file_name: 'Rumbidzai_Moyo_CV_2026.pdf',
        is_primary: true,
        uploaded_at: '2026-01-15',
    },
    {
        id: 2,
        file_name: 'Rumbidzai_Moyo_Portfolio.pdf',
        is_primary: false,
        uploaded_at: '2026-02-01',
    },
    {
        id: 3,
        file_name: 'Rumbidzai_Moyo_Resume_Design.pdf',
        is_primary: false,
        uploaded_at: '2026-02-20',
    },
];

export const candidateRecommendedVacancies: CandidateRecommendedVacancy[] = [
    {
        id: 101,
        title: 'Frontend Engineer',
        company_name: 'Apex Systems',
        location: 'Remote',
        employment_type: 'Full-time',
        salary_min: '1800',
        salary_max: '2600',
        currency: 'USD',
        match: {
            score: 92,
            label: 'Strong Match',
            reasons: ['Matches your React skills.', 'Matches your remote work preference.'],
        },
    },
    {
        id: 102,
        title: 'UI/UX Developer',
        company_name: 'PixelForge',
        location: 'Harare',
        employment_type: 'Hybrid',
        salary_min: '1500',
        salary_max: '2300',
        currency: 'USD',
        match: {
            score: 78,
            label: 'Good Match',
            reasons: ['Role keywords align with your profile and experience.'],
        },
    },
    {
        id: 103,
        title: 'React Developer',
        company_name: 'CloudBridge',
        location: 'Bulawayo',
        employment_type: 'Contract',
        salary_min: '1700',
        salary_max: '2500',
        currency: 'USD',
    },
    {
        id: 104,
        title: 'Product Frontend Engineer',
        company_name: 'TalentSync',
        location: 'Remote',
        employment_type: 'Full-time',
        salary_min: '2000',
        salary_max: '3000',
        currency: 'USD',
    },
];
