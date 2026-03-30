import { Link } from '@inertiajs/react';
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
    BarChart3,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    CreditCard,
    LayoutDashboard,
    ShieldCheck,
    Users,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import type { Company, User } from '../dummyData';

type EmployerHubLayoutProps = {
    title: string;
    subtitle: string;
    active:
        | 'dashboard'
        | 'vacancies'
        | 'candidates'
        | 'interviews'
        | 'reports'
        | 'company'
        | 'billing';
    company: Company;
    user: User;
    children: ReactNode;
    headerActions?: ReactNode;
    breadcrumbs: BreadcrumbItem[];
};

export const employerLinks = {
    dashboard: '/employer/dashboard',
    vacancies: '/employer/vacancies',
    candidates: '/employer/candidates',
    interviews: '/employer/interviews',
    reports: '/employer/reports',
    company: '/employer/company',
    billing: '/employer/billing',
} as const;

export const employerStatusColor: Record<string, string> = {
    active: 'border-primary/40 bg-primary text-primary-foreground',
    published: 'border-primary/40 bg-primary text-primary-foreground',
    open: 'border-primary/40 bg-primary text-primary-foreground',
    accepted: 'border-primary/40 bg-primary text-primary-foreground',
    completed: 'border-primary/40 bg-primary text-primary-foreground',
    scheduled: 'border-border bg-muted text-foreground',
    closed: 'border-border bg-muted text-muted-foreground',
    draft: 'border-border bg-muted text-muted-foreground',
    archived: 'border-border bg-background text-muted-foreground',
    suspended: 'border-border bg-muted text-muted-foreground',
    cancelled: 'border-border bg-background text-muted-foreground',
    rejected: 'border-border bg-background text-muted-foreground',
};

export function employerBreadcrumbs(
    ...items: Array<string | BreadcrumbItem>
): BreadcrumbItem[] {
    const root: BreadcrumbItem = {
        title: 'Dashboard',
        href: employerLinks.dashboard,
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

export function EmployerHubLayout({
    title,
    subtitle,
    active,
    company,
    user,
    children,
    headerActions,
    breadcrumbs,
}: EmployerHubLayoutProps) {
    const primaryItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: employerLinks.dashboard,
            icon: LayoutDashboard,
        },
        {
            title: 'Vacancies',
            href: employerLinks.vacancies,
            icon: Briefcase,
        },
        {
            title: 'Candidates',
            href: employerLinks.candidates,
            icon: Users,
        },
        {
            title: 'Interviews',
            href: employerLinks.interviews,
            icon: Calendar,
        },
    ];

    const secondaryGroups: HubNavGroup[] = [
        {
            title: 'Organization',
            icon: Building2,
            items: [
                {
                    title: 'Reports',
                    href: employerLinks.reports,
                    icon: BarChart3,
                },
                {
                    title: 'Company Profile',
                    href: employerLinks.company,
                    icon: Building2,
                },
                {
                    title: 'Billing',
                    href: employerLinks.billing,
                    icon: CreditCard,
                },
                {
                    title: 'Documentation',
                    href: '/documentation',
                    icon: BookOpen,
                },
            ],
        },
    ];

    return (
        <HubSidebarLayout
            headTitle={`${title} - Employer Hub`}
            title={title}
            subtitle={subtitle}
            breadcrumbs={breadcrumbs}
            badge="Employer hub"
            heroMeta={
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant="outline"
                        className="h-7 rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground shadow-none"
                    >
                        <Building2 className="mr-1.5 h-3.5 w-3.5" />
                        {company.company_name}
                    </Badge>
                    <EmployerStatusBadge status={company.status || 'Active'} />
                    {company.industry ? (
                        <Badge
                            variant="outline"
                            className="h-7 rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground shadow-none"
                        >
                            <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                            {company.industry}
                        </Badge>
                    ) : null}
                </div>
            }
            headerActions={headerActions}
            brand={{
                title: 'HRX Hub',
                subtitle: 'Employer workspace',
                href: employerLinks.dashboard,
                mark: <ShieldCheck className="h-4 w-4" />,
            }}
            navLabel="Employer Hub"
            primaryItems={primaryItems}
            secondaryGroups={secondaryGroups}
            identity={{
                name: user?.name || 'Employer',
                secondary: company.company_name || 'Company profile',
                initials: getEmployerInitials(user?.name),
                tertiary: user?.email ? <p className="truncate">{user.email}</p> : null,
            }}
        >
            {children}
        </HubSidebarLayout>
    );
}

export function EmployerSectionCard({
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

export function EmployerStatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    return (
        <Badge
            variant="outline"
            className={`h-7 rounded-md border px-2.5 text-[11px] shadow-none ${
                employerStatusColor[normalized] ||
                'border-border bg-muted text-muted-foreground'
            }`}
        >
            {status}
        </Badge>
    );
}

export function EmployerEmptyState({ message }: { message: string }) {
    return (
        <Card className="border-dashed border-border/70 bg-background/80 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-2.5 py-8 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                </div>
                <p className="max-w-lg text-sm leading-5 text-muted-foreground">
                    {message}
                </p>
            </CardContent>
        </Card>
    );
}

export function EmployerMetricCard({
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

export function EmployerInfoField({
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
            {icon ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50">
                    {icon}
                </div>
            ) : null}

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

export function EmployerPrimaryButton({
    href,
    children,
    className,
}: {
    href: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Link href={href}>
            <Button
                className={
                    className ??
                    'h-9 rounded-md px-3 text-sm font-medium shadow-sm'
                }
            >
                {children}
            </Button>
        </Link>
    );
}

export function EmployerGhostActionButton({
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

export function formatEmployerDate(date: string | null | undefined): string {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        day: date.length > 7 ? 'numeric' : undefined,
    });
}

function getEmployerInitials(name?: string | null): string {
    if (!name) {
        return 'HR';
    }

    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}
