import { Link, usePage } from '@inertiajs/react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    CandidateSectionCard,
    candidateStatusColor,
    formatCandidateDate,
} from './components/hub';
import type { CandidateApplication, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    applications: {
        data: CandidateApplication[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status: string;
    };
    statuses: string[];
};

export default function CandidateApplicationsPage() {
    const { candidate, applications, filters, statuses } = usePage<PageProps>().props;

    return (
        <CandidateHubLayout
            title="My Applications"
            subtitle="Track every application and its current hiring stage."
            active="applications"
            candidate={candidate}
        >
            <div className="space-y-6">
                <CandidateSectionCard title="Filter Applications" icon={<Briefcase className="h-4 w-4" />}>
                    <form className="grid gap-4 md:grid-cols-[minmax(0,220px)_auto]">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Status</label>
                            <select
                                name="status"
                                defaultValue={filters.status ?? ''}
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                onChange={(event) => {
                                    window.location.href = `/candidate/applications${event.target.value ? `?status=${event.target.value}` : ''}`;
                                }}
                            >
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Link href="/candidate/jobs">
                                <Button type="button">Browse Jobs</Button>
                            </Link>
                        </div>
                    </form>
                </CandidateSectionCard>

                <CandidateSectionCard title="Application History" icon={<Briefcase className="h-4 w-4" />}>
                    {applications.data.length > 0 ? (
                        <div className="space-y-4">
                            {applications.data.map((application) => (
                                <div key={application.id} className="rounded-xl border border-border bg-background p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-semibold text-foreground">{application.vacancy_title}</p>
                                                <Badge variant="outline" className={`text-xs capitalize ${candidateStatusColor[application.status] || ''}`}>
                                                    {application.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{application.company_name}</p>
                                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                {application.location && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {application.location}
                                                    </span>
                                                )}
                                                {application.employment_type && <span>{application.employment_type}</span>}
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Applied {formatCandidateDate(application.applied_at)}
                                                </span>
                                            </div>
                                            {application.resume?.file_name && (
                                                <p className="mt-2 text-xs text-muted-foreground">Document: {application.resume.file_name}</p>
                                            )}
                                            {application.cover_letter && (
                                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{application.cover_letter}</p>
                                            )}
                                        </div>
                                        {(application.salary_min || application.salary_max) && (
                                            <div className="rounded-lg bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground">
                                                {application.currency ?? 'USD'} {application.salary_min ?? '—'} - {application.salary_max ?? '—'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                {applications.links.map((link, index) => (
                                    <a
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? '#'}
                                        className={`rounded-md border px-3 py-1.5 text-xs ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <CandidateEmptyState message="No applications match the current filter." />
                    )}
                </CandidateSectionCard>
            </div>
        </CandidateHubLayout>
    );
}
