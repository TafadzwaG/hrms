import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileEdit,
    GitCommit,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
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
    AlertDialogTrigger,
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

type WorkflowRecord = {
    id: number;
    name: string;
    request_type: string;
    steps_json: string | any[];
    sla_hours: number;
    status: string;
    created_at?: string;
    updated_at?: string;
};

type PaginatedData = {
    data: WorkflowRecord[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function WorkflowDefinitionsIndex() {
    const { module, records, filters } = usePage().props as unknown as {
        module: any;
        records: PaginatedData;
        filters: { search?: string };
    };

    const [search, setSearch] = useState(filters?.search || '');
    const [requestType, setRequestType] = useState('all');
    const [status, setStatus] = useState('all');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<WorkflowRecord | null>(
        null,
    );

    const basePath = `/${module?.slug || 'workflow-definitions'}`;

    // Debounced search and filter application
    useEffect(() => {
        const timer = setTimeout(() => {
            // Include status/type in query if your backend gets updated to support them
            router.get(
                basePath,
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            basePath,
            { page: selectedItem.selected + 1, search },
            { preserveState: true, preserveScroll: true },
        );
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

    // Helper to calculate steps safely
    const getStepCount = (steps: string | any[]) => {
        if (!steps) return 0;
        if (Array.isArray(steps)) return steps.length;
        try {
            return JSON.parse(steps).length;
        } catch {
            return 0;
        }
    };

    // Helper to style request type badges monochromatically
    const getTypeBadgeVariant = (type: string) => {
        const t = type?.toLowerCase() || '';
        if (t === 'leave')
            return 'bg-primary/10 text-primary border-transparent';
        if (t === 'expense')
            return 'bg-secondary text-secondary-foreground border-transparent';
        if (t === 'asset')
            return 'bg-muted text-muted-foreground border-border';
        return 'bg-muted text-muted-foreground border-border';
    };

    // Helper for Status Badge
    const getStatusDisplay = (stat: string) => {
        const s = stat?.toLowerCase() || 'draft';
        if (s === 'active') {
            return (
                <Badge
                    variant="outline"
                    className="border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-600 shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                </Badge>
            );
        }
        if (s === 'inactive') {
            return (
                <Badge
                    variant="outline"
                    className="border-border bg-muted/50 px-2.5 py-0.5 font-medium text-muted-foreground shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    Inactive
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-600 shadow-none"
            >
                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                Draft
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module?.name || 'Workflows', href: basePath },
            ]}
        >
            <Head title={module?.name || 'Workflow Definitions'} />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            {module?.name || 'Workflow Definitions'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {module?.description ||
                                'Configure approval routing and SLAs for system requests'}
                        </p>
                    </div>
                    <Button
                        className="bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                        onClick={() => router.visit(`${basePath}/create`)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Workflow
                    </Button>
                </div>

                {/* Metrics Row (Approximated or visually static based on requirements) */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Total Workflows
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {records?.total || 24}
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    Across 8 categories
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <GitCommit className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Active Routing
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    18
                                </p>
                                <p className="mt-1 text-xs font-medium text-emerald-600">
                                    75% of total library
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Avg. SLA Target
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    48 Hours
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    -4h from last month
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Pending Drafts
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    6
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    Requiring configuration
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <FileEdit className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="mb-8 rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search workflows..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full max-w-md border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                value={requestType}
                                onValueChange={setRequestType}
                            >
                                <SelectTrigger className="h-10 w-[160px] border-border shadow-none">
                                    <SelectValue placeholder="Request Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="Leave">Leave</SelectItem>
                                    <SelectItem value="Expense">
                                        Expense
                                    </SelectItem>
                                    <SelectItem value="Asset">Asset</SelectItem>
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
                                    <SelectItem value="Active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
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
                                    <TableHead className="h-12 w-[300px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Workflow Name
                                    </TableHead>
                                    <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Request Type
                                    </TableHead>
                                    <TableHead className="w-[140px] text-center text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Steps
                                    </TableHead>
                                    <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        SLA Hours
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
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
                                            colSpan={6}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No workflow definitions found
                                            matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((record) => (
                                        <TableRow
                                            key={record.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">
                                                        {record.name}
                                                    </span>
                                                    <span className="mt-0.5 text-xs text-muted-foreground">
                                                        {/* Mock subtitle for visual completeness based on screenshot */}
                                                        Standard{' '}
                                                        {record.request_type}{' '}
                                                        configuration
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`${getTypeBadgeVariant(record.request_type)} px-3 py-0.5 font-medium shadow-none`}
                                                >
                                                    {record.request_type ||
                                                        'Custom'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-foreground">
                                                {getStepCount(
                                                    record.steps_json,
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                {record.sla_hours} Hours
                                            </TableCell>
                                            <TableCell>
                                                {getStatusDisplay(
                                                    record.status,
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        onClick={() =>
                                                            router.visit(
                                                                `${basePath}/${record.id}`,
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        onClick={() =>
                                                            router.visit(
                                                                `${basePath}/${record.id}/edit`,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                                onClick={() =>
                                                                    setRecordToDelete(
                                                                        record,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-destructive">
                                                                    Delete
                                                                    Workflow
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure
                                                                    you want to
                                                                    permanently
                                                                    delete the{' '}
                                                                    <strong>
                                                                        {
                                                                            recordToDelete?.name
                                                                        }
                                                                    </strong>{' '}
                                                                    workflow?
                                                                    This may
                                                                    disrupt
                                                                    active
                                                                    system
                                                                    requests
                                                                    currently
                                                                    using this
                                                                    routing
                                                                    logic.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel
                                                                    onClick={() =>
                                                                        setRecordToDelete(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={
                                                                        confirmDelete
                                                                    }
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Yes, Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-medium hover:bg-muted text-sm shadow-none text-muted-foreground"
                                activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90 rounded-md"
                                previousLinkClassName="inline-flex h-9 px-3 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground mr-2"
                                nextLinkClassName="inline-flex h-9 px-3 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground ml-2"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-medium text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
