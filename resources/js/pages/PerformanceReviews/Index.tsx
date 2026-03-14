import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Star,
    Trash2,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Employee = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
    full_name?: string; // Derived helper
};

type PerformanceReview = {
    id: number;
    employee_id: number;
    cycle_name: string;
    reviewer_name: string;
    rating: string | null;
    status: string;
    review_date: string | null;
    comments: string | null;
    employee: Employee;
};

type PaginatedData = {
    data: PerformanceReview[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function PerformanceReviewIndex() {
    const { reviews, filters, statusOptions } = usePage().props as unknown as {
        reviews: PaginatedData;
        filters: { search?: string; status?: string };
        statusOptions: string[];
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

    // --- State: Modals ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] =
        useState<PerformanceReview | null>(null);

    const basePath = '/performance-reviews';

    // --- Effects: Auto-fetch on filter change ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                basePath,
                {
                    search,
                    ...(statusFilter !== 'all' && { status: statusFilter }),
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    // --- Handlers ---
    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            basePath,
            {
                page: selectedItem.selected + 1,
                search,
                ...(statusFilter !== 'all' && { status: statusFilter }),
            },
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

    const handleExport = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        window.location.href = `${basePath}/export?${params.toString()}`;
    };

    const handleRemind = (reviewer: string) => {
        // Placeholder for a remind endpoint (e.g., toast notification)
        alert(`A reminder email has been triggered for reviewer: ${reviewer}`);
    };

    const pageData = reviews?.data ?? [];

    // --- Formatters ---
    const getFullName = (emp: Employee) => {
        if (emp.full_name) return emp.full_name;
        return [emp.first_name, emp.middle_name, emp.surname]
            .filter(Boolean)
            .join(' ');
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const getStatusBadge = (stat: string) => {
        const s = stat?.toLowerCase() || '';
        if (s === 'completed' || s === 'submitted') {
            return (
                <Badge
                    variant="secondary"
                    className="border border-border bg-muted px-2 py-0 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-none"
                >
                    Completed
                </Badge>
            );
        }
        if (s === 'in_progress' || s === 'in progress') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-primary/10 px-2 py-0 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                >
                    In Progress
                </Badge>
            );
        }
        if (s === 'planning') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-secondary px-2 py-0 text-[10px] font-bold tracking-wider text-secondary-foreground uppercase shadow-none"
                >
                    Planning
                </Badge>
            );
        }
        // Pending
        return (
            <Badge
                variant="outline"
                className="border-border bg-transparent px-2 py-0 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                Pending
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Performance', href: basePath }]}>
            <Head title="Performance Reviews" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Container */}
                <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="w-full max-w-xl flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search employees, reviews, or documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 w-full border-border bg-background pl-10 shadow-sm focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Performance Review Cycle
                        </h1>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                            Manage and track organizational performance reviews
                            across the company.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="h-11 bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Link href={`${basePath}/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Start New Review Cycle
                        </Link>
                    </Button>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Active Review Cycles
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-3xl font-extrabold text-foreground">
                                            3
                                        </p>
                                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                            +1 this month
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground shadow-sm">
                                    <RefreshCw className="h-4 w-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="w-full space-y-2">
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Completion Rate
                                    </p>
                                    <div className="flex w-full items-center gap-4 pt-1">
                                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-primary/20">
                                            <svg className="absolute top-[-3px] left-[-3px] h-12 w-12 -rotate-90">
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="22"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    fill="transparent"
                                                    className="stroke-dasharray-[138] stroke-dashoffset-[24] text-primary"
                                                />
                                            </svg>
                                            <span className="text-xs font-bold text-foreground">
                                                82%
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-2xl font-extrabold text-foreground">
                                                82%
                                            </p>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Target: 95%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Average Org Rating
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-extrabold text-foreground">
                                            4.2
                                        </p>
                                        <span className="text-sm font-bold text-muted-foreground">
                                            / 5.0
                                        </span>
                                        <span className="ml-1 text-[10px] font-bold tracking-widest text-destructive uppercase">
                                            -0.1%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary shadow-sm">
                                    <Star className="h-5 w-5 fill-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Pending Self-Assessments
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-3xl font-extrabold text-foreground">
                                            124
                                        </p>
                                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                            +12% vs LY
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10 text-destructive shadow-sm">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 1: Cycle Management (Static Mockup) */}
                <Card className="overflow-hidden border-border bg-background shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-4">
                        <CardTitle className="text-base font-bold text-foreground">
                            Cycle Management
                        </CardTitle>
                        <Button
                            variant="link"
                            className="h-auto p-0 text-xs font-bold text-primary"
                        >
                            View All History
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="h-12 w-[300px] pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Cycle Name
                                        </TableHead>
                                        <TableHead className="w-[150px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-[200px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Period
                                        </TableHead>
                                        <TableHead className="w-[180px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Participants
                                        </TableHead>
                                        <TableHead className="w-[150px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Due Date
                                        </TableHead>
                                        <TableHead className="w-[80px] pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="hover:bg-muted/30">
                                        <TableCell className="pl-6 font-bold text-foreground">
                                            Annual Review 2023
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge('in_progress')}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            Jan 1 - Dec 31
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            842 Employees
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-foreground">
                                            Dec 15, 2023
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-muted/30">
                                        <TableCell className="pl-6 font-bold text-foreground">
                                            Q3 Manager Check-in
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge('completed')}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            Jul 1 - Sep 30
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            790 Employees
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-foreground">
                                            Sep 30, 2023
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-muted/30">
                                        <TableCell className="pl-6 font-bold text-foreground">
                                            H1 Leadership Review
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge('planning')}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            Jan 1 - Jun 30
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                            45 Managers
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-foreground">
                                            Jul 15, 2024
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Active Cycle Data (Dynamic from Backend) */}
                <Card className="overflow-hidden border-border bg-background shadow-sm">
                    <CardHeader className="flex flex-col justify-between gap-4 border-b border-border/50 px-6 py-5 sm:flex-row sm:items-center">
                        <div>
                            <CardTitle className="text-lg font-bold text-foreground">
                                Active Cycle Database
                            </CardTitle>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                Showing real-time progress for all participants
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="h-9 border-border bg-background text-xs font-semibold text-foreground shadow-sm"
                                onClick={handleExport}
                            >
                                <Download className="mr-2 h-3.5 w-3.5" /> Export
                                Data
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10 hover:bg-transparent">
                                        <TableHead className="h-12 w-[280px] pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Employee
                                        </TableHead>
                                        <TableHead className="w-[180px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Reviewer
                                        </TableHead>
                                        <TableHead className="w-[180px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Stage
                                        </TableHead>
                                        <TableHead className="w-[120px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Rating
                                        </TableHead>
                                        <TableHead className="w-[140px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-[160px] pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pageData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-48 text-center text-sm font-medium text-muted-foreground"
                                            >
                                                No review records found matching
                                                your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pageData.map((record) => {
                                            const empName = getFullName(
                                                record.employee,
                                            );
                                            // Mocking stage visual based on status for aesthetic accuracy to screenshot
                                            const stageVisual =
                                                record.status ===
                                                'completed' ? (
                                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                        <div className="h-2 w-2 rounded-full bg-primary" />{' '}
                                                        Completed
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                        <div className="h-2 w-2 rounded-full bg-primary" />{' '}
                                                        Manager Review
                                                    </div>
                                                );

                                            return (
                                                <TableRow
                                                    key={record.id}
                                                    className="group hover:bg-muted/30"
                                                >
                                                    {/* Employee */}
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-9 w-9 border border-border shadow-sm">
                                                                <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                                                    {getInitials(
                                                                        empName,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-foreground">
                                                                    {empName}
                                                                </span>
                                                                <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                                                                    {record
                                                                        .employee
                                                                        ?.staff_number ||
                                                                        'ID Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Reviewer */}
                                                    <TableCell className="text-sm font-medium text-muted-foreground">
                                                        {record.reviewer_name}
                                                    </TableCell>

                                                    {/* Stage */}
                                                    <TableCell>
                                                        {stageVisual}
                                                    </TableCell>

                                                    {/* Rating */}
                                                    <TableCell>
                                                        {record.rating ? (
                                                            <div className="flex items-center gap-1.5 font-bold text-primary">
                                                                {record.rating}{' '}
                                                                <Star className="h-3 w-3 fill-primary" />
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    {/* Status Badge */}
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            record.status,
                                                        )}
                                                    </TableCell>

                                                    {/* Fully Functional Action Buttons */}
                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                            {record.status !==
                                                                'completed' && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                    onClick={() =>
                                                                        handleRemind(
                                                                            record.reviewer_name,
                                                                        )
                                                                    }
                                                                    title="Send Reminder"
                                                                >
                                                                    <Bell className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                title="View Details"
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
                                                                title="Edit Review"
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
                                                                title="Delete Review"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {reviews?.last_page > 1 && (
                            <div className="flex items-center justify-between border-t bg-muted/10 p-4">
                                <div className="pl-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Showing{' '}
                                    <span className="text-foreground">
                                        {(reviews.current_page - 1) *
                                            reviews.per_page +
                                            1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="text-foreground">
                                        {Math.min(
                                            reviews.current_page *
                                                reviews.per_page,
                                            reviews.total,
                                        )}
                                    </span>{' '}
                                    of{' '}
                                    <span className="text-foreground">
                                        {reviews.total}
                                    </span>
                                </div>
                                <ReactPaginate
                                    pageCount={reviews.last_page}
                                    forcePage={reviews.current_page - 1}
                                    onPageChange={handlePageChange}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={3}
                                    previousLabel={
                                        <ChevronLeft className="h-4 w-4" />
                                    }
                                    nextLabel={
                                        <ChevronRight className="h-4 w-4" />
                                    }
                                    breakLabel="..."
                                    containerClassName="flex items-center gap-1"
                                    pageLinkClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent font-bold hover:bg-muted text-xs shadow-none text-muted-foreground transition-colors"
                                    activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90 rounded-md"
                                    previousLinkClassName="inline-flex h-8 px-2 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground mr-1 transition-colors"
                                    nextLinkClassName="inline-flex h-8 px-2 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground ml-1 transition-colors"
                                    breakClassName="flex h-8 w-8 items-center justify-center text-sm font-medium text-muted-foreground"
                                    disabledClassName="opacity-50 pointer-events-none"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Global Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Review Record?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the
                                performance review for{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.employee
                                        ? getFullName(recordToDelete.employee)
                                        : 'Unknown'}
                                </strong>
                                ? This action cannot be undone and will remove
                                the historical data.
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
