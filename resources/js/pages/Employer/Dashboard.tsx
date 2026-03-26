import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Briefcase,
    Building2,
    CalendarClock,
    CircleDollarSign,
    Eye,
    FileText,
    MapPin,
    Plus,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    employerBreadcrumbs,
    EmployerEmptyState,
    EmployerGhostActionButton,
    EmployerHubLayout,
    EmployerInfoField,
    EmployerMetricCard,
    EmployerPrimaryButton,
    EmployerSectionCard,
    EmployerStatusBadge,
    formatEmployerDate,
} from './components/hub';
import type {
    BillingProfile,
    Company,
    RecentApplication,
    RecommendedTalent,
    Subscription,
    User,
    Vacancy,
} from './dummyData';

type Metrics = {
    total_vacancies: number;
    published_vacancies: number;
    total_applications: number;
    company_status: string;
};

type PageProps = {
    user: User;
    company: Company;
    metrics: Metrics;
    applicationsByStatus: Record<string, number>;
    vacancies: Vacancy[];
    recentApplications: RecentApplication[];
    recommendedTalent?: RecommendedTalent[];
    billingSummary?: {
        profile: BillingProfile;
        subscription: Subscription;
    };
};

export default function EmployerDashboard() {
    const {
        user,
        company,
        metrics,
        vacancies,
        recentApplications,
        applicationsByStatus,
        recommendedTalent = [],
        billingSummary,
    } = usePage<PageProps>().props;

    const firstName = user?.name?.split(' ')[0] ?? 'there';
    const pipelineCount =
        countFor(applicationsByStatus, 'shortlisted') +
        countFor(applicationsByStatus, 'interview') +
        countFor(applicationsByStatus, 'offered');

    return (
        <EmployerHubLayout
            title={`Welcome back, ${firstName}`}
            subtitle={company.company_name || 'Employer dashboard'}
            active="dashboard"
            company={company}
            user={user}
            breadcrumbs={employerBreadcrumbs()}
            headerActions={
                <div className="flex flex-wrap items-center gap-2">
                    <Link href="/employer/candidates">
                        <EmployerGhostActionButton>
                            <Users className="mr-1.5 h-3.5 w-3.5" />
                            Review Candidates
                        </EmployerGhostActionButton>
                    </Link>
                    <EmployerPrimaryButton href="/employer/vacancies/create">
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Post Vacancy
                    </EmployerPrimaryButton>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <EmployerMetricCard
                        icon={<Briefcase className="h-4 w-4" />}
                        label="Open Roles"
                        value={metrics.total_vacancies}
                        helper="Tracked vacancies"
                    />
                    <EmployerMetricCard
                        icon={<TrendingUp className="h-4 w-4" />}
                        label="Live Listings"
                        value={metrics.published_vacancies}
                        helper="Currently published"
                    />
                    <EmployerMetricCard
                        icon={<Users className="h-4 w-4" />}
                        label="Applications"
                        value={metrics.total_applications}
                        helper="Across all vacancies"
                    />
                    <EmployerMetricCard
                        icon={<CalendarClock className="h-4 w-4" />}
                        label="In Pipeline"
                        value={pipelineCount}
                        helper="Shortlist to offer"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <EmployerSectionCard
                            title="Hiring Pipeline"
                            icon={<BarChart3 className="h-4 w-4" />}
                            description="Live application status distribution across your active hiring workflow."
                            action={
                                <Link href="/employer/reports">
                                    <EmployerGhostActionButton>
                                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                                        Open Reports
                                    </EmployerGhostActionButton>
                                </Link>
                            }
                        >
                            {Object.keys(applicationsByStatus).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(applicationsByStatus).map(([status, count]) => {
                                        const percentage = metrics.total_applications > 0
                                            ? Math.round((count / metrics.total_applications) * 100)
                                            : 0;

                                        return (
                                            <div key={status} className="space-y-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <EmployerStatusBadge status={humanize(status)} />
                                                        <span className="text-xs text-muted-foreground">
                                                            {count} applications
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-foreground">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <Progress value={percentage} className="h-2 bg-muted" />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmployerEmptyState message="No applications have entered the hiring pipeline yet." />
                            )}
                        </EmployerSectionCard>

                        <EmployerSectionCard
                            title="Active Vacancies"
                            icon={<Briefcase className="h-4 w-4" />}
                            description="Current requisitions, publication status, and application load."
                            action={
                                <Link href="/employer/vacancies">
                                    <EmployerGhostActionButton>
                                        View All
                                    </EmployerGhostActionButton>
                                </Link>
                            }
                        >
                            {vacancies.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-border/70 bg-muted/30 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                            <tr>
                                                <th className="px-3 py-2.5">Vacancy</th>
                                                <th className="px-3 py-2.5">Details</th>
                                                <th className="px-3 py-2.5">Applications</th>
                                                <th className="px-3 py-2.5">Status</th>
                                                <th className="px-3 py-2.5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60 text-sm">
                                            {vacancies.slice(0, 6).map((vacancy) => (
                                                <tr key={vacancy.id} className="transition-colors hover:bg-muted/20">
                                                    <td className="px-3 py-3 align-top">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-foreground">
                                                                {vacancy.title}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                {vacancy.department || 'General'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 align-top">
                                                        <div className="space-y-1 text-[11px] text-muted-foreground">
                                                            <p>{vacancy.location || 'Remote / unspecified'}</p>
                                                            <p>{vacancy.employment_type || 'Employment type not set'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 align-top">
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {vacancy.applications_count}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 align-top">
                                                        <EmployerStatusBadge status={vacancy.status} />
                                                    </td>
                                                    <td className="px-3 py-3 text-right align-top">
                                                        <Link href={`/employer/vacancies/${vacancy.id}`}>
                                                            <EmployerGhostActionButton>
                                                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                                View
                                                            </EmployerGhostActionButton>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmployerEmptyState message="Create your first vacancy to start receiving applications." />
                            )}
                        </EmployerSectionCard>

                        <EmployerSectionCard
                            title="Recent Applications"
                            icon={<FileText className="h-4 w-4" />}
                            description="The most recent candidates entering your pipeline."
                            action={
                                <Link href="/employer/candidates">
                                    <EmployerGhostActionButton>
                                        <Users className="mr-1.5 h-3.5 w-3.5" />
                                        Candidate Queue
                                    </EmployerGhostActionButton>
                                </Link>
                            }
                        >
                            {recentApplications.length > 0 ? (
                                <div className="space-y-3">
                                    {recentApplications.slice(0, 5).map((application) => (
                                        <div
                                            key={application.id}
                                            className="flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/10 p-4 md:flex-row md:items-start md:justify-between"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {application.candidate_name || 'Candidate'}
                                                    </p>
                                                    <EmployerStatusBadge status={humanize(application.status)} />
                                                    {application.match ? (
                                                        <span className="rounded-md border border-primary/40 bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                                                            {application.match.score}% match
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Applied for <span className="font-medium text-foreground">{application.vacancy_title}</span>
                                                    {' · '}
                                                    {application.applied_at}
                                                </p>
                                                {application.candidate_headline ? (
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {application.candidate_headline}
                                                    </p>
                                                ) : null}
                                                {application.match?.reasons?.length ? (
                                                    <ul className="space-y-1">
                                                        {application.match.reasons.slice(0, 2).map((reason) => (
                                                            <li
                                                                key={reason}
                                                                className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                                                            >
                                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                                <span>{reason}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link href={`/employer/candidates/${application.id}`}>
                                                    <EmployerGhostActionButton>
                                                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                        View Profile
                                                    </EmployerGhostActionButton>
                                                </Link>
                                                {application.resume?.download_url ? (
                                                    <a href={application.resume.download_url}>
                                                        <EmployerGhostActionButton>
                                                            <FileText className="mr-1.5 h-3.5 w-3.5" />
                                                            Resume
                                                        </EmployerGhostActionButton>
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmployerEmptyState message="Applications will appear here once candidates start applying." />
                            )}
                        </EmployerSectionCard>
                    </div>

                    <div className="space-y-6">
                        <EmployerSectionCard
                            title="Company Snapshot"
                            icon={<Building2 className="h-4 w-4" />}
                            description="Your company profile and current hiring readiness."
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <EmployerInfoField
                                        label="Company"
                                        value={company.company_name}
                                        icon={<Building2 className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Status"
                                        value={humanize(company.status)}
                                        icon={<Sparkles className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Industry"
                                        value={company.industry}
                                        icon={<BarChart3 className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Location"
                                        value={company.address}
                                        icon={<MapPin className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Contact"
                                        value={company.email}
                                        icon={<FileText className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Approved"
                                        value={formatEmployerDate(company.approved_at)}
                                        icon={<CalendarClock className="h-3.5 w-3.5" />}
                                    />
                                </div>

                                {company.description ? (
                                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                            Summary
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {company.description}
                                        </p>
                                    </div>
                                ) : null}

                                <Link href="/employer/company">
                                    <Button variant="outline" className="w-full">
                                        <Building2 className="mr-1.5 h-4 w-4" />
                                        Manage Company Profile
                                    </Button>
                                </Link>
                            </div>
                        </EmployerSectionCard>

                        <EmployerSectionCard
                            title="Recommended Talent"
                            icon={<Sparkles className="h-4 w-4" />}
                            description="Candidates the exchange engine rates highly for your open roles."
                        >
                            {recommendedTalent.length > 0 ? (
                                <div className="space-y-3">
                                    {recommendedTalent.slice(0, 4).map((candidate) => (
                                        <div
                                            key={candidate.id}
                                            className="rounded-lg border border-border/70 bg-muted/10 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-[11px] font-bold text-muted-foreground ring-1 ring-border/50">
                                                            {candidate.initials}
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {candidate.name}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                {candidate.headline}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {candidate.location ? (
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {candidate.location}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                {candidate.match ? (
                                                    <span className="rounded-md border border-primary/40 bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                                                        {candidate.match.score}%
                                                    </span>
                                                ) : null}
                                            </div>

                                            {candidate.match?.reasons?.length ? (
                                                <ul className="mt-3 space-y-1.5">
                                                    {candidate.match.reasons.slice(0, 2).map((reason) => (
                                                        <li
                                                            key={reason}
                                                            className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                                                        >
                                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                            <span>{reason}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmployerEmptyState message="Recommended talent will appear here as soon as you have active vacancies." />
                            )}
                        </EmployerSectionCard>

                        <EmployerSectionCard
                            title="Billing Overview"
                            icon={<CircleDollarSign className="h-4 w-4" />}
                            description="Active subscription status and billing profile information."
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <EmployerInfoField
                                        label="Plan"
                                        value={billingSummary?.subscription?.plan?.name ?? 'No active plan'}
                                        icon={<CircleDollarSign className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Billing Email"
                                        value={billingSummary?.profile?.billing_email || company.email}
                                        icon={<FileText className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Seats"
                                        value={billingSummary?.subscription?.seats ?? '—'}
                                        icon={<Users className="h-3.5 w-3.5" />}
                                    />
                                    <EmployerInfoField
                                        label="Renews"
                                        value={formatEmployerDate(billingSummary?.subscription?.renews_at)}
                                        icon={<CalendarClock className="h-3.5 w-3.5" />}
                                    />
                                </div>

                                <Link href="/employer/billing">
                                    <Button variant="outline" className="w-full">
                                        <CircleDollarSign className="mr-1.5 h-4 w-4" />
                                        Open Billing
                                    </Button>
                                </Link>
                            </div>
                        </EmployerSectionCard>
                    </div>
                </div>
            </div>
        </EmployerHubLayout>
    );
}

function countFor(map: Record<string, number>, key: string): number {
    return Number(map[key] ?? 0);
}

function humanize(value: string | null | undefined): string {
    if (!value) {
        return 'N/A';
    }

    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
