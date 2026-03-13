import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
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

type JobRequisition = {
    id: number;
    requisition_code: string;
    title: string;
    department: string;
    hiring_manager: string;
    openings: number;
    status: string;
    target_start_date: string | null;
    created_at?: string;
};

type PaginatedData = {
    data: JobRequisition[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function JobRequisitionIndex() {
    const { module, records, filters } = usePage().props as unknown as {
        module: any;
        records: PaginatedData;
        filters: { search?: string; department?: string; status?: string };
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [department, setDepartment] = useState(filters?.department || 'all');
    const [status, setStatus] = useState(filters?.status || 'all');

    // --- State: Modals ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<JobRequisition | null>(
        null,
    );

    const basePath = `/${module?.slug || 'job-requisitions'}`;

    // --- Effects: Auto-fetch on filter change ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                basePath,
                {
                    search,
                    ...(department !== 'all' && { department }),
                    ...(status !== 'all' && { status }),
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, department, status]);

    // --- Handlers ---
    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            basePath,
            {
                page: selectedItem.selected + 1,
                search,
                ...(department !== 'all' && { department }),
                ...(status !== 'all' && { status }),
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setDepartment('all');
        setStatus('all');
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (department !== 'all') params.append('department', department);
        if (status !== 'all') params.append('status', status);

        // Triggers a standard browser download
        window.location.href = `${basePath}/export?${params.toString()}`;
    };

    const openDeleteDialog = (record: JobRequisition) => {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
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

    // --- Helpers ---
    const getStatusDisplay = (stat: string) => {
        const s = stat?.toLowerCase() || 'draft';
        if (s === 'open') {
            return (
                <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 px-3 py-0.5 font-medium text-primary shadow-none"
                >
                    Open
                </Badge>
            );
        }
        if (s === 'filled' || s === 'closed') {
            return (
                <Badge
                    variant="outline"
                    className="border-foreground/20 bg-foreground/5 px-3 py-0.5 font-medium text-foreground shadow-none"
                >
                    {stat}
                </Badge>
            );
        }
        if (s === 'on hold') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-secondary px-3 py-0.5 font-medium text-secondary-foreground shadow-none"
                >
                    On Hold
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-transparent bg-muted px-3 py-0.5 font-medium text-muted-foreground shadow-none"
            >
                Draft
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module?.name || 'Requisitions', href: basePath },
            ]}
        >
            <Head title={module?.name || 'Job Requisitions'} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            {module?.name || 'Job Requisitions'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {module?.description ||
                                'Manage and track open hiring requests across departments.'}
                        </p>
                    </div>
                    {/* FIXED: Using Inertia Link with asChild for reliable navigation */}
                    <Button
                        asChild
                        className="bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Link href={`${basePath}/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Requisition
                        </Link>
                    </Button>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Total Requisitions
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {records?.total || 0}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                                <Briefcase className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Open Positions
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {pageData.reduce(
                                        (acc, curr) =>
                                            acc +
                                            (curr.status.toLowerCase() ===
                                            'open'
                                                ? curr.openings
                                                : 0),
                                        0,
                                    ) || 0}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Filled/Closed
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {pageData.reduce(
                                        (acc, curr) =>
                                            acc +
                                            (curr.status.toLowerCase() ===
                                            'filled'
                                                ? curr.openings
                                                : 0),
                                        0,
                                    ) || 0}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Avg. Time to Fill
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    34 Days
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:w-[400px]">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by requisition or title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={department}
                                onValueChange={setDepartment}
                            >
                                <SelectTrigger className="h-10 w-[160px] border-border shadow-none">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Departments
                                    </SelectItem>
                                    <SelectItem value="Engineering">
                                        Engineering
                                    </SelectItem>
                                    <SelectItem value="Marketing">
                                        Marketing
                                    </SelectItem>
                                    <SelectItem value="Human Resources">
                                        Human Resources
                                    </SelectItem>
                                    <SelectItem value="Operations">
                                        Operations
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-10 w-[140px] border-border shadow-none">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="On Hold">
                                        On Hold
                                    </SelectItem>
                                    <SelectItem value="Filled">
                                        Filled
                                    </SelectItem>
                                    <SelectItem value="Cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {(search ||
                                department !== 'all' ||
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

                            <Button
                                onClick={handleExport}
                                variant="outline"
                                className="h-10 border-border bg-background font-medium shadow-sm"
                            >
                                <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    <TableHead className="h-12 w-[140px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Req Code
                                    </TableHead>
                                    <TableHead className="w-[240px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Job Title
                                    </TableHead>
                                    <TableHead className="w-[180px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Department
                                    </TableHead>
                                    <TableHead className="w-[180px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Hiring Manager
                                    </TableHead>
                                    <TableHead className="w-[100px] text-center text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Openings
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Target Start
                                    </TableHead>
                                    <TableHead className="w-[120px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[140px] pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No job requisitions found matching
                                            your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((record) => (
                                        <TableRow
                                            key={record.id}
                                            className="group hover:bg-muted/30"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-muted px-2 py-0.5 font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground shadow-none"
                                                >
                                                    {record.requisition_code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-foreground">
                                                {record.title}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {record.department}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {record.hiring_manager}
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-foreground">
                                                {record.openings
                                                    .toString()
                                                    .padStart(2, '0')}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                <div className="flex flex-col gap-0.5">
                                                    {record.target_start_date ? (
                                                        <>
                                                            <span>
                                                                {moment(
                                                                    record.target_start_date,
                                                                ).format(
                                                                    'MMM DD,',
                                                                )}
                                                            </span>
                                                            <span>
                                                                {moment(
                                                                    record.target_start_date,
                                                                ).format(
                                                                    'YYYY',
                                                                )}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusDisplay(
                                                    record.status,
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                    {/* FIXED: Using Inertia Link with asChild */}
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Requisition"
                                                    >
                                                        <Link
                                                            href={`${basePath}/${record.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {/* FIXED: Using Inertia Link with asChild */}
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Edit Requisition"
                                                    >
                                                        <Link
                                                            href={`${basePath}/${record.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {/* Delete explicitly uses the global dialog state */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            openDeleteDialog(
                                                                record,
                                                            )
                                                        }
                                                        title="Delete Requisition"
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
                                </span>{' '}
                                to{' '}
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
                                    <span className="flex items-center text-sm font-medium">
                                        Previous
                                    </span>
                                }
                                nextLabel={
                                    <span className="flex items-center text-sm font-medium">
                                        Next
                                    </span>
                                }
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent font-medium hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90 rounded-md"
                                previousLinkClassName="inline-flex h-8 px-3 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground mr-2 transition-colors"
                                nextLinkClassName="inline-flex h-8 px-3 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground ml-2 transition-colors"
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
                                Delete Requisition?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.title}
                                </strong>{' '}
                                requisition? This action cannot be undone and
                                will remove it from the pipeline.
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
