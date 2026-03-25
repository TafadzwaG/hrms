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
    company: '/employer/company-profile',
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
                <EmployerStatusBadge status={company.status || 'Active'} />
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
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2 text-base">
                        {icon ? (
                            <span className="text-muted-foreground">{icon}</span>
                        ) : null}
                        <span>{title}</span>
                    </CardTitle>
                    {description ? (
                        <CardDescription>{description}</CardDescription>
                    ) : null}
                </div>
                {action}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export function EmployerStatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    return (
        <Badge
            className={`rounded-md border px-3 py-1 shadow-none ${
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
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Briefcase className="h-5 w-5" />
                </div>
                <p className="max-w-lg text-sm leading-6 text-muted-foreground">
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
                    'h-auto rounded-md px-6 py-3 text-sm font-medium shadow-sm'
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
                'border-border/70 bg-background text-foreground shadow-sm hover:bg-muted'
            }
            {...props}
        >
            {children}
        </Button>
    );
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
