import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    Filter,
    GraduationCap,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
    UserCheck,
} from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    IndexTableCard,
    IndexTableEmptyRow,
    IndexTableHeaderRow,
    IndexTableHead,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
import { buildIndexParams } from '@/lib/index-table';
import AppLayout from '@/layouts/app-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    formatCandidateDate,
    formatCandidateLabel,
    recruitmentCandidateMutedCardClassName,
    recruitmentCandidateSectionClassName,
} from './profile-primitives';

type CandidateRow = {
    id: number;
    full_name: string;
    email: string;
    phone?: string | null;
    headline: string | null;
    location?: string | null;
    visibility_status: string;
    is_public: boolean;
    highest_education: string | null;
    years_experience?: number | null;
    applications_count?: number;
    resumes_count?: number;
    listing_activated_at: string | null;
    links?: {
        show?: string;
        edit?: string;
    };
};

type CandidateStats = {
    total: number;
    active: number;
    public: number;
    draft: number;
};

type SortDirection = 'asc' | 'desc';

type CandidatesPageProps = {
    candidates: {
        data: CandidateRow[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        visibility_status?: string | null;
        gender?: string | null;
        education?: string | null;
        sort?: string | null;
        direction?: SortDirection | null;
        page?: number | null;
    };
    stats?: CandidateStats;
    visibilityStatuses?: string[];
    educationLevels?: string[];
};

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

const statusVariants: Record<string, BadgeVariant> = {
    active: 'success',
    draft: 'secondary',
    pending_payment: 'warning',
    expired: 'muted',
    suspended: 'danger',
};

export default function CandidatesIndex() {
    const { candidates, filters, stats, visibilityStatuses = [], educationLevels = [] } =
        usePage<CandidatesPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [visibilityStatus, setVisibilityStatus] = useState(filters.visibility_status ?? 'all');
    const [gender, setGender] = useState(filters.gender ?? 'all');
    const [education, setEducation] = useState(filters.education ?? 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<CandidateRow | null>(null);
    const initialRender = useRef(true);

    const computedStats = {
        total: stats?.total ?? candidates.total ?? 0,
        active: stats?.active ?? 0,
        public: stats?.public ?? 0,
        draft: stats?.draft ?? 0,
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/candidate-profiles',
                buildIndexParams(filters, {
                    search,
                    visibility_status: visibilityStatus !== 'all' ? visibilityStatus : null,
                    gender: gender !== 'all' ? gender : null,
                    education: education !== 'all' ? education : null,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [education, filters, gender, search, visibilityStatus]);

    const handleResetFilters = () => {
        setSearch('');
        setVisibilityStatus('all');
        setGender('all');
        setEducation('all');
        setShowFilters(false);
    };

    const handleDeleteCandidate = () => {
        if (!candidateToDelete) {
            return;
        }

        router.delete(`/candidate-profiles/${candidateToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setCandidateToDelete(null),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates' },
            ]}
        >
            <Head title="Candidates" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                            Candidates
                        </h1>
                        <p className="text-sm font-medium text-muted-foreground">
                            Manage candidate profiles and listings using the same information rhythm as the self-service profile pages.
                        </p>
                    </div>
                    <Link href="/candidate-profiles/create">
                        <Button className="h-auto rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            New Candidate
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-8">
                        <section className={recruitmentCandidateSectionClassName}>
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Search & Filter
                                    </p>
                                    <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                        Candidate Directory
                                    </h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-md border-border"
                                    onClick={() => setShowFilters((current) => !current)}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-5 border-b border-border/70 pb-6 md:grid-cols-[1fr_auto] md:items-end">
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Search
                                    </label>
                                    <div className="flex items-center gap-3 border-b border-border px-0 py-2">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <input
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            className="w-full border-none bg-transparent px-0 py-0 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
                                            placeholder="Search by name, email, headline, or location"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-md border-border"
                                    onClick={handleResetFilters}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </div>

                            {showFilters ? (
                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <SelectCard
                                        label="Visibility"
                                        value={visibilityStatus}
                                        onChange={setVisibilityStatus}
                                        options={[
                                            { value: 'all', label: 'All statuses' },
                                            ...visibilityStatuses.map((status) => ({
                                                value: status,
                                                label: formatCandidateLabel(status),
                                            })),
                                        ]}
                                    />
                                    <SelectCard
                                        label="Gender"
                                        value={gender}
                                        onChange={setGender}
                                        options={[
                                            { value: 'all', label: 'All genders' },
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                            { value: 'other', label: 'Other' },
                                            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                                        ]}
                                    />
                                    <SelectCard
                                        label="Education"
                                        value={education}
                                        onChange={setEducation}
                                        options={[
                                            { value: 'all', label: 'All levels' },
                                            ...educationLevels.map((level) => ({
                                                value: level,
                                                label: formatCandidateLabel(level),
                                            })),
                                        ]}
                                    />
                                </div>
                            ) : null}
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Talent pool
                                    </p>
                                    <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                        Profiles
                                    </h2>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {candidates.total} candidate{candidates.total === 1 ? '' : 's'} in view
                                </p>
                            </div>

                            <IndexTableCard>
                                <Table>
                                    <TableHeader>
                                        <IndexTableHeaderRow>
                                            <SortableTableHead filters={filters} sortKey="full_name" path="/candidate-profiles">
                                                Candidate
                                            </SortableTableHead>
                                            <SortableTableHead filters={filters} sortKey="headline" path="/candidate-profiles">
                                                Headline
                                            </SortableTableHead>
                                            <SortableTableHead filters={filters} sortKey="profile_visibility_status" path="/candidate-profiles">
                                                Visibility
                                            </SortableTableHead>
                                            <SortableTableHead filters={filters} sortKey="highest_education" path="/candidate-profiles">
                                                Education
                                            </SortableTableHead>
                                            <SortableTableHead filters={filters} sortKey="listing_activated_at" path="/candidate-profiles">
                                                Activated
                                            </SortableTableHead>
                                            <IndexTableHead align="right">Actions</IndexTableHead>
                                        </IndexTableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {candidates.data.length === 0 ? (
                                            <IndexTableEmptyRow colSpan={6}>
                                                No candidate profiles match the current filters.
                                            </IndexTableEmptyRow>
                                        ) : (
                                            candidates.data.map((candidate) => (
                                                <TableRow key={candidate.id} className="border-border/60 hover:bg-muted/20">
                                                    <TableCell className="py-4 align-top">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {candidate.full_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {candidate.email}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                <Badge variant={candidate.is_public ? 'success' : 'secondary'}>
                                                                    {candidate.is_public ? 'Public' : 'Private'}
                                                                </Badge>
                                                                {candidate.applications_count ? (
                                                                    <Badge variant="info">
                                                                        {candidate.applications_count} applications
                                                                    </Badge>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                                        <div className="space-y-1">
                                                            <p>{candidate.headline || 'No headline set'}</p>
                                                            <p className="text-xs">
                                                                {candidate.location || 'Location not set'}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 align-top">
                                                        <StatusBadge status={candidate.visibility_status} />
                                                    </TableCell>
                                                    <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                                        {candidate.highest_education
                                                            ? formatCandidateLabel(candidate.highest_education)
                                                            : '—'}
                                                    </TableCell>
                                                    <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                                        {formatCandidateDate(candidate.listing_activated_at)}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right align-top">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={candidate.links?.show || `/candidate-profiles/${candidate.id}`}>
                                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link href={candidate.links?.edit || `/candidate-profiles/${candidate.id}/edit`}>
                                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-md border-destructive/30 text-destructive hover:bg-destructive/10"
                                                                onClick={() => setCandidateToDelete(candidate)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                                <IndexTablePagination
                                    pagination={candidates}
                                    filters={filters}
                                    path="/candidate-profiles"
                                    label="candidates"
                                />
                            </IndexTableCard>
                        </section>
                    </div>
                    <div className="space-y-8">
                        <section className={recruitmentCandidateSectionClassName}>
                            <div className="mb-6 flex items-center gap-2">
                                <Users className="h-5 w-5 text-foreground" />
                                <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                    Talent Pool Summary
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <StatCard
                                    icon={Users}
                                    label="Total"
                                    value={computedStats.total}
                                />
                                <StatCard
                                    icon={CheckCircle2}
                                    label="Active"
                                    value={computedStats.active}
                                />
                                <StatCard
                                    icon={UserCheck}
                                    label="Public"
                                    value={computedStats.public}
                                />
                                <StatCard
                                    icon={GraduationCap}
                                    label="Draft"
                                    value={computedStats.draft}
                                />
                            </div>
                        </section>

                        <section className={recruitmentCandidateSectionClassName}>
                            <div className="mb-6 flex items-center gap-2">
                                <Filter className="h-5 w-5 text-foreground" />
                                <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                    Filter Snapshot
                                </h2>
                            </div>

                            <div className="space-y-3">
                                <SnapshotRow label="Search" value={search || 'All candidates'} />
                                <SnapshotRow
                                    label="Visibility"
                                    value={
                                        visibilityStatus === 'all'
                                            ? 'All statuses'
                                            : formatCandidateLabel(visibilityStatus)
                                    }
                                />
                                <SnapshotRow
                                    label="Gender"
                                    value={
                                        gender === 'all' ? 'All genders' : formatCandidateLabel(gender)
                                    }
                                />
                                <SnapshotRow
                                    label="Education"
                                    value={
                                        education === 'all'
                                            ? 'All levels'
                                            : formatCandidateLabel(education)
                                    }
                                />
                            </div>
                        </section>

                        <section className={recruitmentCandidateMutedCardClassName}>
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Admin guidance
                            </p>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-foreground/80">
                                <li>Open a profile to manage resume uploads, skills, education, and experience.</li>
                                <li>Use sorting to review the most recently activated or updated candidate records.</li>
                                <li>Public and active profiles are the candidates currently visible to employers.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <AlertDialog open={!!candidateToDelete} onOpenChange={() => setCandidateToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete candidate profile</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove{' '}
                            <span className="font-semibold text-foreground">
                                {candidateToDelete?.full_name}
                            </span>{' '}
                            from recruitment administration. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteCandidate}
                        >
                            Delete candidate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={statusVariants[status] ?? 'secondary'}>
            {formatCandidateLabel(status)}
        </Badge>
    );
}

function SelectCard({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div className={recruitmentCandidateMutedCardClassName}>
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </label>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-3 w-full cursor-pointer border-none bg-transparent px-0 py-0 text-sm font-semibold text-foreground focus:ring-0"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Users;
    label: string;
    value: number;
}) {
    return (
        <div className={recruitmentCandidateMutedCardClassName}>
            <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {label}
                </p>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
        </div>
    );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 text-sm last:border-none last:pb-0">
            <span className="font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
            <span className="text-right font-semibold text-foreground">{value}</span>
        </div>
    );
}
