import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { HubSidebarLayout, type HubNavGroup } from '@/components/hub-shell';
import type { BreadcrumbItem, NavItem } from '@/types';
import {
    Activity,
    Bell,
    Briefcase,
    FileText,
    Gauge,
    GraduationCap,
    LayoutDashboard,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    User,
    Wrench,
    Zap,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import type { CandidateUser } from '../dummyData';

export const candidateStatusColor: Record<string, string> = {
    submitted: 'border-border bg-muted text-muted-foreground',
    shortlisted: 'border-border bg-muted text-foreground',
    interview: 'border-primary/40 bg-primary text-primary-foreground',
    offered: 'border-primary/40 bg-primary text-primary-foreground',
    hired: 'border-primary/40 bg-primary text-primary-foreground',
    rejected: 'border-border bg-background text-muted-foreground',
    withdrawn: 'border-border bg-background text-muted-foreground',
    under_review: 'border-border bg-muted text-muted-foreground',
};

export const candidateVisibilityColor: Record<string, string> = {
    active: 'border-primary/40 bg-primary text-primary-foreground',
    draft: 'border-border bg-muted text-muted-foreground',
    expired: 'border-border bg-muted text-muted-foreground',
    pending_payment: 'border-border bg-muted text-foreground',
};

export const candidateSkillLevelColor: Record<string, string> = {
    beginner: 'bg-muted text-muted-foreground',
    intermediate: 'bg-muted text-foreground',
    advanced: 'bg-secondary text-secondary-foreground',
    expert: 'bg-primary text-primary-foreground',
};

type CandidateHubLayoutProps = {
    title: string;
    subtitle?: string;
    active:
        | 'dashboard'
        | 'applications'
        | 'jobs'
        | 'profile'
        | 'documents'
        | 'education'
        | 'skills'
        | 'settings';
    candidate: CandidateUser;
    completeness?: number;
    children: ReactNode;
    headerActions?: ReactNode;
    breadcrumbs: BreadcrumbItem[];
};

export const candidateLinks = {
    dashboard: '/candidate/dashboard',
    applications: '/candidate/applications',
    jobs: '/candidate/jobs',
    profile: '/candidate/profile',
    documents: '/candidate/documents',
    education: '/candidate/education',
    skills: '/candidate/skills',
    settings: '/candidate/settings',
} as const;

export function candidateBreadcrumbs(
    ...items: Array<string | BreadcrumbItem>
): BreadcrumbItem[] {
    const root: BreadcrumbItem = {
        title: 'Dashboard',
        href: candidateLinks.dashboard,
    };

    if (items.length === 0) {
        return [root];
    }

    return [
        root,
        ...items.map((item) =>
            typeof item === 'string' ? { title: item } : item,
        ),
    ];
}

export function CandidateHubLayout({
    title,
    subtitle,
    active,
    candidate,
    completeness,
    children,
    headerActions,
    breadcrumbs,
}: CandidateHubLayoutProps) {
    const primaryItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: candidateLinks.dashboard,
            icon: LayoutDashboard,
        },
        {
            title: 'My Applications',
            href: candidateLinks.applications,
            icon: Briefcase,
        },
        {
            title: 'Browse Jobs',
            href: candidateLinks.jobs,
            icon: Search,
        },
    ];

    const secondaryGroups: HubNavGroup[] = [
        {
            title: 'Profile',
            icon: User,
            items: [
                {
                    title: 'My Profile',
                    href: candidateLinks.profile,
                    icon: User,
                },
                {
                    title: 'Documents',
                    href: candidateLinks.documents,
                    icon: FileText,
                },
            ],
        },
        {
            title: 'Career',
            icon: GraduationCap,
            items: [
                {
                    title: 'Education',
                    href: candidateLinks.education,
                    icon: GraduationCap,
                },
                {
                    title: 'Skills',
                    href: candidateLinks.skills,
                    icon: Wrench,
                },
                {
                    title: 'Settings',
                    href: candidateLinks.settings,
                    icon: Settings,
                },
            ],
        },
    ];

    return (
        <HubSidebarLayout
            headTitle={`${title} - Candidate Hub`}
            title={title}
            subtitle={subtitle}
            breadcrumbs={breadcrumbs}
            badge="Candidate hub"
            heroMeta={
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant="outline"
                        className="h-7 rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground shadow-none"
                    >
                        <User className="mr-1.5 h-3.5 w-3.5" />
                        Workspace
                    </Badge>

                    {candidate.is_verified ? (
                        <Badge
                            variant="outline"
                            className="h-7 rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground shadow-none"
                        >
                            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                            Verified
                        </Badge>
                    ) : null}

                    {candidate.headline ? (
                        <Badge
                            variant="outline"
                            className="h-7 max-w-[220px] rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground shadow-none"
                        >
                            <Sparkles className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{candidate.headline}</span>
                        </Badge>
                    ) : null}

                    {typeof completeness === 'number' ? (
                        <div className="flex h-7 items-center gap-2 rounded-md border border-border/70 bg-muted/20 px-2.5">
                            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                Profile
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${completeness}%` }}
                                />
                            </div>
                            <span className="text-[11px] font-semibold text-foreground">
                                {completeness}%
                            </span>
                        </div>
                    ) : null}
                </div>
            }
            headerActions={headerActions}
            brand={{
                title: 'HRX Hub',
                subtitle: 'Candidate workspace',
                href: candidateLinks.dashboard,
                mark: <Zap className="h-4 w-4" fill="currentColor" />,
            }}
            navLabel="Candidate Hub"
            primaryItems={primaryItems}
            secondaryGroups={secondaryGroups}
            identity={{
                name: candidate.full_name || 'Candidate',
                secondary: candidate.email || 'No email provided',
                initials: getInitials(candidate.full_name),
                tertiary: candidate.headline ? (
                    <p className="truncate">{candidate.headline}</p>
                ) : null,
            }}
        >
            {children}
        </HubSidebarLayout>
    );
}

export function CandidateSectionCard({
    title,
    icon,
    action,
    description,
    children,
    className,
}: {
    title: string;
    icon?: ReactNode;
    action?: ReactNode;
    description?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Card className={className ?? 'border-border/70 bg-background/95 shadow-sm'}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 px-4 py-3">
                <div className="space-y-0.5">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold leading-none">
                        {icon ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                {icon}
                            </span>
                        ) : null}
                        <span>{title}</span>
                    </CardTitle>
                    {description ? (
                        <CardDescription className="pl-9 text-[11px] leading-4">
                            {description}
                        </CardDescription>
                    ) : null}
                </div>
                {action}
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>
        </Card>
    );
}

export function CandidateInfoField({
    label,
    value,
    icon,
}: {
    label: string;
    value: ReactNode | null | undefined;
    icon?: ReactNode;
}) {
    return (
        <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/10 px-2.5 py-2 transition-colors hover:bg-muted/20">
            {icon && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50">
                    {icon}
                </div>
            )}

            <div className="flex min-w-0 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {label}
                </span>
                <div className="truncate text-[13px] font-medium leading-tight text-foreground">
                    {value ?? (
                        <span className="text-[11px] font-normal italic text-muted-foreground/60">
                            Not provided
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CandidateEmptyState({ message }: { message: string }) {
    return (
        <Card className="border-dashed border-border/70 bg-background/80 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-2.5 py-8 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bell className="h-4 w-4" />
                </div>
                <p className="max-w-lg text-sm leading-5 text-muted-foreground">
                    {message}
                </p>
            </CardContent>
        </Card>
    );
}

export function CandidateMetricCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: ReactNode;
    label: string;
    value: string | number;
    helper: string;
}) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardContent className="flex items-start justify-between gap-3 p-3.5">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        {label}
                    </div>
                    <div className="text-xl font-semibold leading-none tracking-tight text-foreground">
                        {value}
                    </div>
                    <div className="text-[11px] leading-4 text-muted-foreground">
                        {helper}
                    </div>
                </div>
                <div className="rounded-md bg-muted p-2 text-muted-foreground">
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

export function formatCandidateDate(date: string | null | undefined): string {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        day: date.length > 7 ? 'numeric' : undefined,
    });
}

export function getInitials(name?: string | null): string {
    if (!name) {
        return 'C';
    }

    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

export function CandidateGhostActionButton({
    children,
    className,
    ...props
}: ComponentProps<typeof Button>) {
    return (
        <Button
            variant="outline"
            size="sm"
            className={
                className ??
                'h-7 border-border/70 bg-background px-2.5 text-[11px] font-medium text-foreground shadow-sm hover:bg-muted'
            }
            {...props}
        >
            {children}
        </Button>
    );
}