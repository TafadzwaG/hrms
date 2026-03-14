import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UserCheck,
    Users,
    UserX,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type CandidateProfile = {
    id: number;
    requisition_code: string;
    full_name: string;
    email: string;
    phone: string;
    stage: string;
    status: string;
    notes: string | null;
    created_at: string;
    requisition?: {
        title: string;
        department: string;
        requisition_code: string;
    };
};

type PaginatedData = {
    data: CandidateProfile[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function CandidateProfileIndex() {
    const { module, records, filters } = usePage().props as unknown as {
        module: any;
        records: PaginatedData;
        filters: {
            search?: string;
            requisition?: string;
            stage?: string;
            status?: string;
        };
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [requisition, setRequisition] = useState(
        filters?.requisition || 'all',
    );
    const [stage, setStage] = useState(filters?.stage || 'all');
    const [status, setStatus] = useState(filters?.status || 'all');

    // --- State: Modals ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] =
        useState<CandidateProfile | null>(null);

    const basePath = `/${module?.slug || 'candidate-profiles'}`;

    // --- Effects: Auto-fetch on filter change ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                basePath,
                {
                    search,
                    ...(requisition !== 'all' && { requisition }),
                    ...(stage !== 'all' && { stage }),
                    ...(status !== 'all' && { status }),
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, requisition, stage, status]);

    // --- Handlers ---
    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            basePath,
            {
                page: selectedItem.selected + 1,
                search,
                ...(requisition !== 'all' && { requisition }),
                ...(stage !== 'all' && { stage }),
                ...(status !== 'all' && { status }),
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setRequisition('all');
        setStage('all');
        setStatus('all');
    };

    const confirmDelete = () => {
        if (!recordToDelete) return;
        router.delete(`${basePath}/${recordToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
            },
        });
    };

    const pageData = records?.data ?? [];

    // --- Aesthetic Helpers ---
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const getStatusIndicator = (stat: string) => {
        const s = stat?.toLowerCase();
        if (s === 'active' || s === 'hired') {
            return <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />;
        }
        if (s === 'rejected' || s === 'withdrawn') {
            return (
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            );
        }
        return (
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-secondary-foreground/50" />
        );
    };

    const getStageBadge = (stage: string) => {
        const s = stage?.toLowerCase() || '';
        if (s.includes('interview') || s === 'offer') {
            return 'bg-primary/10 text-primary border-transparent';
        }
        if (s.includes('screen') || s === 'applied') {
            return 'bg-muted text-muted-foreground border-transparent';
        }
        return 'bg-secondary text-secondary-foreground border-transparent';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module?.name || 'Candidates', href: basePath },
            ]}
        >
            <Head title="Candidate Profiles" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Candidate Profiles
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage applicants across job requisitions.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Create from Requisition
                        </Button>
                        <Button
                            asChild
                            className="bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            <Link href={`${basePath}/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Candidate
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metrics Row (Mocked metrics for visual completeness based on screenshot) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                                    <Users className="h-5 w-5" />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary shadow-none"
                                >
                                    +5.2%
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Candidates
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {records?.total || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                                    <UserCheck className="h-5 w-5" />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary shadow-none"
                                >
                                    +2.1%
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Shortlisted
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    86
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary shadow-none"
                                >
                                    +0.5%
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Hired
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    12
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                                    <UserX className="h-5 w-5" />
                                </div>
                                <Badge
                                    variant="outline"
                                    className="border-border bg-muted text-muted-foreground shadow-none"
                                >
                                    -1.2%
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Rejected
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    154
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:w-[360px]">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or requisition..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full border-border bg-muted/20 pl-9 text-sm shadow-none focus-visible:bg-background"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={requisition}
                                onValueChange={setRequisition}
                            >
                                <SelectTrigger className="h-10 w-[160px] border-border shadow-none">
                                    <SelectValue placeholder="Requisition: All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Requisition: All
                                    </SelectItem>
                                    <SelectItem value="ENG-442">
                                        ENG-442
                                    </SelectItem>
                                    <SelectItem value="PROD-012">
                                        PROD-012
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={stage} onValueChange={setStage}>
                                <SelectTrigger className="h-10 w-[140px] border-border shadow-none">
                                    <SelectValue placeholder="Stage: All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Stage: All
                                    </SelectItem>
                                    <SelectItem value="Applied">
                                        Applied
                                    </SelectItem>
                                    <SelectItem value="Screening">
                                        Screening
                                    </SelectItem>
                                    <SelectItem value="Interview">
                                        Interview
                                    </SelectItem>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-10 w-[140px] border-border shadow-none">
                                    <SelectValue placeholder="Status: Active" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Status: All
                                    </SelectItem>
                                    <SelectItem value="Active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="On Hold">
                                        On Hold
                                    </SelectItem>
                                    <SelectItem value="Hired">Hired</SelectItem>
                                    <SelectItem value="Rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {(search ||
                                requisition !== 'all' ||
                                stage !== 'all' ||
                                status !== 'all') && (
                                <Button
                                    variant="ghost"
                                    onClick={resetFilters}
                                    className="h-10 px-3 text-muted-foreground"
                                    title="Clear Filters"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    <TableHead className="h-12 w-[300px] pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Candidate
                                    </TableHead>
                                    <TableHead className="w-[240px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Contact Details
                                    </TableHead>
                                    <TableHead className="w-[240px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Requisition
                                    </TableHead>
                                    <TableHead className="w-[160px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Stage
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[140px] pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No candidates found matching your
                                            search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((record) => (
                                        <TableRow
                                            key={record.id}
                                            className="group hover:bg-muted/30"
                                        >
                                            {/* Candidate */}
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-border">
                                                        {/* Optional: <AvatarImage src={record.avatar_url} /> */}
                                                        <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                                            {getInitials(
                                                                record.full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground">
                                                            {record.full_name}
                                                        </span>
                                                        <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                            Applied{' '}
                                                            {moment(
                                                                record.created_at,
                                                            ).fromNow()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Contact Details */}
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {record.email}
                                                    </span>
                                                    <span className="mt-0.5 text-xs text-muted-foreground">
                                                        {record.phone}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Requisition */}
                                            <TableCell>
                                                <div className="flex flex-col items-start gap-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-muted px-2 py-0 font-mono text-[10px] tracking-wider text-muted-foreground uppercase shadow-none"
                                                    >
                                                        {
                                                            record.requisition_code
                                                        }
                                                    </Badge>
                                                    <span className="max-w-[200px] truncate text-sm font-medium text-foreground">
                                                        {record.requisition
                                                            ?.title ||
                                                            'Unknown Role'}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Stage */}
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`px-2.5 py-0.5 text-xs font-semibold shadow-none ${getStageBadge(record.stage)}`}
                                                >
                                                    {record.stage}
                                                </Badge>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <div className="flex items-center text-xs font-bold tracking-widest text-foreground uppercase">
                                                    {getStatusIndicator(
                                                        record.status,
                                                    )}
                                                    {record.status}
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Profile"
                                                    >
                                                        <Link
                                                            href={`${basePath}/${record.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Edit Profile"
                                                    >
                                                        <Link
                                                            href={`${basePath}/${record.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => {
                                                            setRecordToDelete(
                                                                record,
                                                            );
                                                            setDeleteDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                        title="Delete Candidate"
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
                    </div>

                    {/* Pagination */}
                    {records?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t bg-muted/10 p-4">
                            <div className="pl-2 text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {(records.current_page - 1) *
                                        records.per_page +
                                        1}
                                </span>
                                -
                                <span className="font-bold text-foreground">
                                    {Math.min(
                                        records.current_page * records.per_page,
                                        records.total,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {records.total}
                                </span>{' '}
                                results
                            </div>
                            <ReactPaginate
                                pageCount={records.last_page}
                                forcePage={records.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <ChevronLeft className="h-4 w-4" />
                                }
                                nextLabel={<ChevronRight className="h-4 w-4" />}
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent font-medium hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90 rounded-md"
                                previousLinkClassName="inline-flex h-8 px-2 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground mr-1 transition-colors"
                                nextLinkClassName="inline-flex h-8 px-2 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground ml-1 transition-colors"
                                breakClassName="flex h-8 w-8 items-center justify-center text-sm font-medium text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>

                {/* Single, globally rendered Alert Dialog for deletes */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Candidate Profile?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the
                                profile for{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.full_name}
                                </strong>
                                ? This action cannot be undone and will remove
                                them from the pipeline.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setRecordToDelete(null)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
