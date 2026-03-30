import type { Auth } from '@/types/auth';

export type DocumentationEntry = {
    section: 'modules' | 'roles' | 'references';
    slug: string;
    title: string;
    summary: string;
    href: string;
    path: string;
    updated_at: string;
};

export type DocumentationSections = {
    modules: DocumentationEntry[];
    roles: DocumentationEntry[];
    references: DocumentationEntry[];
};

const roleRecommendations: Record<string, string[]> = {
    system_admin: ['system-admin', 'dashboard', 'organization-structure', 'user-access-and-control-center', 'audit-trail', 'system-settings'],
    hr_admin: ['hr-admin', 'employees', 'leave-management', 'onboarding', 'offboarding', 'benefits'],
    payroll: ['payroll-officer', 'payroll', 'payslips', 'timesheets', 'attendance', 'reports'],
    manager: ['manager', 'dashboard', 'employees', 'leave-management', 'timesheets', 'performance-management'],
    authoriser: ['authoriser', 'leave-management', 'timesheets', 'payroll', 'documents-repository', 'reports'],
    auditor: ['auditor', 'audit-trail', 'reports', 'documents-repository', 'payroll', 'user-access-and-control-center'],
    employee: ['employee', 'dashboard', 'leave-management', 'attendance', 'timesheets', 'benefits'],
    candidate: ['candidate', 'candidate-hub', 'recruitment-marketplace', 'candidate-records'],
    employer: ['employer', 'employer-hub', 'recruitment-marketplace', 'reports'],
};

export const sectionTitles: Record<keyof DocumentationSections, string> = {
    modules: 'Module Documentation',
    roles: 'Role Guides',
    references: 'Technical References',
};

export function recommendedDocumentation(auth: Auth | undefined, sections: DocumentationSections): DocumentationEntry[] {
    const context = auth?.user?.active_portal === 'candidate'
        ? 'candidate'
        : auth?.user?.active_portal === 'employer'
            ? 'employer'
            : auth?.user?.dashboard_role ?? 'employee';

    const slugs = roleRecommendations[context] ?? roleRecommendations.employee;
    const allEntries = [...sections.roles, ...sections.modules, ...sections.references];

    return slugs
        .map((slug) => allEntries.find((entry) => entry.slug === slug))
        .filter((entry): entry is DocumentationEntry => Boolean(entry));
}
