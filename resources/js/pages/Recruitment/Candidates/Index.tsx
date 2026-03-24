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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    GraduationCap,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
    UserCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type CandidateRow = {
    id: number;
    full_name: string;
    email: string;
    headline: string | null;
    visibility_status: string;
    is_public: boolean;
    listing_activated_at: string | null;
    gender: string | null;
    highest_education: string | null;
};

type CandidateStats = {
    total: number;
    active: number;
    public: number;
    draft: number;
};

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
    };
    stats?: CandidateStats;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    pending_payment: 'border-transparent bg-amber-100 text-amber-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    suspended: 'border-transparent bg-red-100 text-red-700',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function CandidatesIndex() {
    const {
        candidates,
        filters,
        stats,
    } = usePage<CandidatesPageProps>().props;

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
                {
                    search: search || undefined,
                    visibility_status: visibilityStatus !== 'all' ? visibilityStatus : undefined,
                    gender: gender !== 'all' ? gender : undefined,
                    education: education !== 'all' ? education : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, visibilityStatus, gender, education]);

    const handleResetFilters = () => {
        setSearch('');
        setVisibilityStatus('all');
        setGender('all');
        setEducation('all');
        setShowFilters(false);
    };

    const handleDeleteCandidate = () => {
        if (!candidateToDelete) return;

        router.delete(`/candidate-profiles/${candidateToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setCandidateToDelete(null),
        });
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/candidate-profiles',
            {
                page: selected + 1,
                search: search || undefined,
                visibility_status: visibilityStatus !== 'all' ? visibilityStatus : undefined,
                gender: gender !== 'all' ? gender : undefined,
                education: education !== 'all' ? education : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = candidates.per_page ?? (candidates.data.length || 1);
    const showingFrom =
        candidates.from ??
        (candidates.total === 0 ? 0 : (candidates.current_page - 1) * perPage + 1);
    const showingTo =
        candidates.to ?? Math.min(candidates.current_page * perPage, candidates.total);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates' },
            ]}
        >
            <Head title="Candidates" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Candidates
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Manage candidate profiles and listings.
                        </p>
                    </div>
                    <Link href="/candidate-profiles/create">
                        <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                            <Plus className="mr-2 h-5 w-5" /> New Candidate
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Candidates', val: computedStats.total, icon: Users },
                        { label: 'Active', val: computedStats.active, icon: CheckCircle2 },
                        { label: 'Public', val: computedStats.public, icon: UserCheck },
                        { label: 'Draft', val: computedStats.draft, icon: GraduationCap },
                    ].map((item, index) => (
                        <Card key={index} className="border-zinc-200 shadow-none">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium tracking-wider text-zinc-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-zinc-900">
                                        {item.val}
                                    </p>
                                </div>
                                <item.icon className="h-6 w-6 text-zinc-400" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-11 border-zinc-200"
                                onClick={() => setShowFilters((current) => !current)}
                                type="button"
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" /> More Filters
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-11 text-zinc-500"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Visibility Status</p>
                                <Select value={visibilityStatus} onValueChange={setVisibilityStatus}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending_payment">Pending Payment</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Gender</p>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All genders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All genders</SelectItem>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Education</p>
                                <Select value={education} onValueChange={setEducation}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All levels" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All levels</SelectItem>
                                        <SelectItem value="high_school">High School</SelectItem>
                                        <SelectItem value="diploma">Diploma</SelectItem>
                                        <SelectItem value="bachelors">Bachelors</SelectItem>
                                        <SelectItem value="masters">Masters</SelectItem>
                                        <SelectItem value="doctorate">Doctorate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-md border border-zinc-200">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="font-bold text-zinc-900">Name</TableHead>
                                <TableHead className="font-bold text-zinc-900">Email</TableHead>
                                <TableHead className="font-bold text-zinc-900">Headline</TableHead>
                                <TableHead className="font-bold text-zinc-900">Visibility</TableHead>
                                <TableHead className="font-bold text-zinc-900">Public</TableHead>
                                <TableHead className="font-bold text-zinc-900">Activated</TableHead>
                                <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-zinc-400">
                                        No candidates found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                candidates.data.map((candidate) => (
                                    <TableRow key={candidate.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-bold text-zinc-900">
                                            {candidate.full_name}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {candidate.email}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-zinc-500">
                                            {candidate.headline ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${statusStyles[candidate.visibility_status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                            >
                                                {formatLabel(candidate.visibility_status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`${candidate.is_public ? 'border-transparent bg-emerald-100 text-emerald-700' : 'border-transparent bg-zinc-100 text-zinc-600'} font-semibold`}
                                            >
                                                {candidate.is_public ? 'Yes' : 'No'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {formatDate(candidate.listing_activated_at)}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/candidate-profiles/${candidate.id}`}>
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/candidate-profiles/${candidate.id}/edit`}>
                                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setCandidateToDelete(candidate)}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 md:flex-row">
                    <p className="text-sm font-medium text-zinc-500">
                        Showing{' '}
                        <span className="text-zinc-900">
                            {showingFrom}-{showingTo}
                        </span>{' '}
                        of <span className="text-zinc-900">{candidates.total}</span> candidates
                    </p>
                    <ReactPaginate
                        pageCount={candidates.last_page}
                        forcePage={Math.max((candidates.current_page ?? 1) - 1, 0)}
                        onPageChange={handlePageChange}
                        containerClassName="flex gap-1"
                        pageLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors hover:bg-zinc-50"
                        activeLinkClassName="!border-zinc-900 !bg-zinc-900 !text-white"
                        previousLabel="←"
                        nextLabel="→"
                        previousLinkClassName="mr-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        nextLinkClassName="ml-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        disabledClassName="pointer-events-none opacity-30"
                        breakLabel="..."
                        breakLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold"
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                    />
                </div>
            </div>

            {/* Delete Alert */}
            <AlertDialog
                open={!!candidateToDelete}
                onOpenChange={() => setCandidateToDelete(null)}
            >
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove{' '}
                            <span className="font-bold text-zinc-900">
                                {candidateToDelete?.full_name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteCandidate}
                        >
                            Delete Candidate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
