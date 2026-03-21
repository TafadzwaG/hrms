export type Company = {
    id: number;
    company_name: string;
    status: string;
};

export type User = {
    name: string;
    email: string;
};

export type Vacancy = {
    id: number;
    title: string;
    status: string;
    department?: string;
    location: string | null;
    applications_count: number;
};

export type RecentApplication = {
    id: number;
    candidate_name: string;
    candidate_headline: string | null;
    vacancy_title: string;
    status: string;
    applied_at: string;
    match_score?: number;
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
    },
    {
        id: 2,
        candidate_name: 'Nomsa Dube',
        candidate_headline: 'HR Specialist',
        vacancy_title: 'HR Business Partner',
        status: 'shortlisted',
        applied_at: '4 hours ago',
        match_score: 96,
    },
    {
        id: 3,
        candidate_name: 'Brian Chitauro',
        candidate_headline: 'Finance Lead',
        vacancy_title: 'Finance Manager',
        status: 'interview',
        applied_at: 'Today, 08:30 AM',
        match_score: 94,
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