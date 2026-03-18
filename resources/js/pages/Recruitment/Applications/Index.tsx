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
import { ClipboardList, Eye, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type Company = {
    id: number;
    name: string;
};

type Vacancy = {
    id: number;
    title: string;
    status: string;
    company: Company | null;
};

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
};

type Application = {
    id: number;
    vacancy: Vacancy | null;
    candidate: Candidate | null;
    status: string;
    applied_at: string | null;
    updated_at: string | null;
    links: {
        show: string;
    };
};

type PaginatedApplications = {
    data: Application[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Filters = {
    search: string | null;
    vacancy_id: string | null;
    candidate_profile_id: string | null;
    status: string | null;
};

type Stats = {
    total: number;
    submitted: number;
    shortlisted: number;
    rejected: number;
};

type PageProps = {
    applications: PaginatedApplications;
    filters: Filters;
    statuses: string[];
    stats: Stats;
};

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'submitted':
            return 'default';
        case 'under_review':
        case 'interview':
            return 'secondary';
        case 'shortlisted':
        case 'offered':
        case 'hired':
            return 'default';
        case 'rejected':
        case 'withdrawn':
            return 'destructive';
        default:
            return 'outline';
    }
};

const formatLabel = (value: string | null): string => {
    if (!value) return '—';
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ApplicationsIndex() {
    const { applications, filters, statuses, stats } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/vacancy-applications',
                {
                    search: search || undefined,
                    status: status || undefined,
                    vacancy_id: filters.vacancy_id || undefined,
                    candidate_profile_id: filters.candidate_profile_id || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, status]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/vacancy-applications',
            {
                page: selectedItem.selected + 1,
                search: search || undefined,
                status: status || undefined,
            },
            { preserveScroll: true },
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/vacancy-applications/${deleteId}`, { preserveScroll: true });
            setDeleteId(null);
        }
    };

    const breadcrumbs = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Applications', href: '/vacancy-applications' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vacancy Applications" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Vacancy Applications</h1>
                        <p className="text-muted-foreground">Manage and review candidate applications.</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-muted-foreground text-sm">Total</div>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-muted-foreground text-sm">Submitted</div>
                            <div className="text-2xl font-bold">{stats.submitted}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-muted-foreground text-sm">Shortlisted</div>
                            <div className="text-2xl font-bold">{stats.shortlisted}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-muted-foreground text-sm">Rejected</div>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Input
                                placeholder="Search by candidate or vacancy..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select value={status} onValueChange={(val) => setStatus(val === 'all' ? '' : val)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {formatLabel(s)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Candidate</TableHead>
                                    <TableHead>Vacancy</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center">
                                            <div className="text-muted-foreground flex flex-col items-center gap-2">
                                                <ClipboardList className="h-8 w-8 opacity-50" />
                                                <p>No applications found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applications.data.map((application) => (
                                        <TableRow key={application.id}>
                                            <TableCell>
                                                <div className="font-medium">{application.candidate?.full_name ?? '—'}</div>
                                                <div className="text-muted-foreground text-sm">{application.candidate?.email ?? ''}</div>
                                            </TableCell>
                                            <TableCell>{application.vacancy?.title ?? '—'}</TableCell>
                                            <TableCell>{application.vacancy?.company?.name ?? '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariant(application.status)}>
                                                    {formatLabel(application.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {application.applied_at
                                                    ? new Date(application.applied_at).toLocaleDateString()
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={application.links.show}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteId(application.id)}
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

                        {applications.last_page > 1 && (
                            <div className="flex justify-center border-t p-4">
                                <ReactPaginate
                                    pageCount={applications.last_page}
                                    forcePage={applications.current_page - 1}
                                    onPageChange={handlePageChange}
                                    containerClassName="flex items-center gap-1"
                                    pageClassName="flex"
                                    pageLinkClassName="px-3 py-1 rounded text-sm hover:bg-accent"
                                    activeClassName="bg-primary text-primary-foreground rounded"
                                    previousLabel="← Prev"
                                    nextLabel="Next →"
                                    previousClassName="flex"
                                    nextClassName="flex"
                                    previousLinkClassName="px-3 py-1 rounded text-sm hover:bg-accent"
                                    nextLinkClassName="px-3 py-1 rounded text-sm hover:bg-accent"
                                    disabledClassName="opacity-50 pointer-events-none"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Application</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this application? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
