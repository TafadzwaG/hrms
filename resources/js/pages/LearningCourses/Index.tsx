import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    MoreVertical,
    Pencil,
    Plus,
    RefreshCw,
    RotateCcw,
    Search,
    ShieldAlert,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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

type LearningCourse = {
    id: number;
    course_code: string;
    title: string;
    category: string;
    duration_hours: string;
    compliance_required: boolean;
    expires_after_days: number | null;
    status: string;
    created_at: string;
};

type PaginatedData = {
    data: LearningCourse[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function LearningCourseIndex() {
    const { courses, filters, statusOptions } = usePage().props as unknown as {
        courses: PaginatedData;
        filters: { search?: string; status?: string };
        statusOptions: string[];
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

    // --- State: Modals ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<LearningCourse | null>(
        null,
    );

    const basePath = '/learning-courses';

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

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
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

    const pageData = courses?.data ?? [];

    // --- Formatters ---
    const getStatusBadge = (stat: string) => {
        const s = stat?.toLowerCase() || '';
        if (s === 'active') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                >
                    Active
                </Badge>
            );
        }
        if (s === 'archived') {
            return (
                <Badge
                    variant="secondary"
                    className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                >
                    Archived
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-border bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                Inactive
            </Badge>
        );
    };

    const getComplianceBadge = (required: boolean) => {
        if (required) {
            return (
                <Badge className="bg-foreground px-2 py-0 text-[10px] font-bold tracking-wider text-background uppercase shadow-none hover:bg-foreground/90">
                    Mandatory
                </Badge>
            );
        }
        return (
            <Badge
                variant="secondary"
                className="bg-muted px-2 py-0 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                Optional
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Learning', href: basePath }]}>
            <Head title="Course Library" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Course Library
                        </h1>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                            Manage regulatory requirements, optional training,
                            and compliance modules.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="h-11 bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Link href={`${basePath}/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Course
                        </Link>
                    </Button>
                </div>

                {/* Split Dashboard Row (Inspired by Screenshot) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Overall Status Card */}
                    <Card className="border-border bg-background shadow-sm lg:col-span-8">
                        <CardContent className="flex h-full flex-col justify-between space-y-8 p-6 md:p-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        Overall Library Status
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-5xl font-extrabold tracking-tighter text-foreground">
                                            {courses?.total || 0}
                                        </p>
                                        <p className="text-sm font-bold text-muted-foreground">
                                            Total Modules
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        className="h-10 border-border bg-background font-semibold shadow-sm"
                                    >
                                        <FileText className="mr-2 h-4 w-4 text-primary" />{' '}
                                        Full Audit Report
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-10 border-border bg-background font-semibold text-muted-foreground shadow-sm hover:text-foreground"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />{' '}
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-lg border border-border bg-muted/20 p-4">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                                        Active Courses
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {pageData.filter(
                                            (c) => c.status === 'active',
                                        ).length || 0}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-muted/20 p-4">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Mandatory
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {pageData.filter(
                                            (c) => c.compliance_required,
                                        ).length || 0}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-muted/20 p-4">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-destructive uppercase">
                                        Archived
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {pageData.filter(
                                            (c) => c.status === 'archived',
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    <span>Library Active Ratio</span>
                                    <span>Target Reached</span>
                                </div>
                                <Progress
                                    value={85}
                                    className="h-3 border border-border bg-muted"
                                />
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="flex items-center text-xs font-medium text-muted-foreground italic">
                                        <Clock className="mr-1 h-3 w-3" /> Last
                                        updated: Just now
                                    </p>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-xs font-bold text-primary"
                                    >
                                        Manage Regulatory Requirements &rarr;
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Critical Deadlines / System Alerts */}
                    <Card className="border-border bg-background shadow-sm lg:col-span-4">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <ShieldAlert className="h-5 w-5 text-destructive" />
                                    System Alerts
                                </CardTitle>
                                <Badge
                                    variant="destructive"
                                    className="border-transparent bg-destructive/10 px-2 py-0 text-[10px] font-bold tracking-wider text-destructive uppercase shadow-none"
                                >
                                    Action Needed
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            {/* Alert Mockup 1 */}
                            <div className="rounded-r-lg border-l-4 border-destructive bg-muted/20 p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <p className="text-sm font-bold text-foreground">
                                        Data Privacy Policy
                                    </p>
                                    <span className="text-[10px] font-bold text-destructive uppercase">
                                        High Priority
                                    </span>
                                </div>
                                <p className="mb-4 text-xs font-medium text-muted-foreground">
                                    14 Employees pending completion for
                                    mandatory privacy training.
                                </p>
                                <div className="flex gap-2">
                                    <Button className="h-9 w-full bg-foreground text-xs font-bold text-background shadow-sm hover:bg-foreground/90">
                                        Bulk Notify
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 border-border bg-background"
                                    >
                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>

                            {/* Alert Mockup 2 */}
                            <div className="rounded-r-lg border-l-4 border-primary bg-muted/20 p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <p className="text-sm font-bold text-foreground">
                                        Conflict of Interest
                                    </p>
                                    <span className="text-[10px] font-bold text-primary uppercase">
                                        Upcoming
                                    </span>
                                </div>
                                <p className="mb-4 text-xs font-medium text-muted-foreground">
                                    Annual renewal required for Sales and
                                    Operations departments.
                                </p>
                                <Button
                                    variant="outline"
                                    className="h-9 w-full border-border bg-background text-xs font-bold text-foreground shadow-sm"
                                >
                                    Schedule Assignment
                                </Button>
                            </div>

                            <Button
                                variant="outline"
                                className="mt-2 h-11 w-full border-dashed border-border bg-transparent text-xs font-bold text-muted-foreground hover:bg-muted"
                            >
                                <Calendar className="mr-2 h-4 w-4" /> Open
                                Compliance Calendar
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Section */}
                <Card className="overflow-hidden border-border bg-background shadow-sm">
                    <CardHeader className="flex flex-col justify-between gap-4 border-b border-border/50 bg-muted/10 px-6 py-5 sm:flex-row sm:items-end">
                        <div>
                            <CardTitle className="text-lg font-bold text-foreground">
                                Course Catalog
                            </CardTitle>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                Monitoring trackable certifications and standard
                                modules.
                            </p>
                        </div>
                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search catalog..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-9 w-full border-border bg-background pl-9 text-xs shadow-sm"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="h-9 w-[130px] border-border text-xs font-medium shadow-sm">
                                    <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    {(statusOptions || []).map((st) => (
                                        <SelectItem
                                            key={st}
                                            value={st}
                                            className="capitalize"
                                        >
                                            {st}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0 border-border bg-background shadow-sm"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="h-12 w-[180px] pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Course Code
                                        </TableHead>
                                        <TableHead className="w-[300px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Title & Category
                                        </TableHead>
                                        <TableHead className="w-[140px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Duration
                                        </TableHead>
                                        <TableHead className="w-[160px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Requirement
                                        </TableHead>
                                        <TableHead className="w-[140px] text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-[120px] pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
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
                                                No learning courses found
                                                matching your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pageData.map((record) => (
                                            <TableRow
                                                key={record.id}
                                                className="group transition-colors hover:bg-muted/30"
                                            >
                                                {/* Code */}
                                                <TableCell className="py-4 pl-6">
                                                    <Badge
                                                        variant="secondary"
                                                        className="border border-border/50 bg-muted px-2.5 py-0.5 font-mono text-[11px] tracking-wider text-foreground uppercase shadow-none"
                                                    >
                                                        {record.course_code}
                                                    </Badge>
                                                </TableCell>

                                                {/* Title & Category */}
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                            {record.title}
                                                        </span>
                                                        <span className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                            <BookOpen className="h-3 w-3" />{' '}
                                                            {record.category}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* Duration */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        {record.duration_hours}{' '}
                                                        hrs
                                                    </div>
                                                </TableCell>

                                                {/* Compliance */}
                                                <TableCell>
                                                    {getComplianceBadge(
                                                        record.compliance_required,
                                                    )}
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    {getStatusBadge(
                                                        record.status,
                                                    )}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
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
                                                            title="Edit Course"
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
                                                            className="ml-1 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => {
                                                                setRecordToDelete(
                                                                    record,
                                                                );
                                                                setDeleteDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            title="Delete Course"
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
                        {courses?.last_page > 1 && (
                            <div className="flex items-center justify-between border-t bg-muted/10 p-4 px-6">
                                <div className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Showing{' '}
                                    <span className="text-foreground">
                                        {(courses.current_page - 1) *
                                            courses.per_page +
                                            1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="text-foreground">
                                        {Math.min(
                                            courses.current_page *
                                                courses.per_page,
                                            courses.total,
                                        )}
                                    </span>{' '}
                                    of{' '}
                                    <span className="text-foreground">
                                        {courses.total}
                                    </span>
                                </div>
                                <ReactPaginate
                                    pageCount={courses.last_page}
                                    forcePage={courses.current_page - 1}
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
                                Delete Learning Course?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the
                                course{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.course_code} -{' '}
                                    {recordToDelete?.title}
                                </strong>
                                ? This action cannot be undone and will remove
                                it from the catalog.
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
