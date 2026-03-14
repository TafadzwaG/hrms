import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Clock,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
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

type Employee = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
    full_name?: string; // Appended helper
};

type Task = {
    id: number;
    task_name: string;
    owner_team: string;
    due_date: string | null;
    status: string;
    employee: Employee;
};

type PaginatedData = {
    data: Task[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function OnboardingTaskIndex() {
    const { tasks, filters, metrics } = usePage().props as unknown as {
        tasks: PaginatedData;
        filters: { search?: string; status?: string };
        metrics?: any; // Mocked below if not provided by backend
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');

    // --- State: Modals ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<Task | null>(null);

    const basePath = `/onboarding-tasks`;

    // --- Effects: Auto-fetch on filter change ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                basePath,
                {
                    search,
                    ...(status !== 'all' && { status }),
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status]);

    // --- Handlers ---
    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            basePath,
            {
                page: selectedItem.selected + 1,
                search,
                ...(status !== 'all' && { status }),
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
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

    const pageData = tasks?.data ?? [];

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

    const getStatusStyles = (stat: string) => {
        const s = stat?.toLowerCase() || '';
        if (s === 'completed') {
            return { badge: 'bg-primary/10 text-primary', dot: 'bg-primary' };
        }
        if (s === 'cancelled' || s === 'overdue') {
            return {
                badge: 'bg-destructive/10 text-destructive',
                dot: 'bg-destructive',
            };
        }
        if (s === 'in_progress' || s === 'in progress') {
            return {
                badge: 'bg-primary/5 text-primary border-primary/20',
                dot: 'bg-primary',
            };
        }
        // Pending
        return {
            badge: 'bg-muted text-muted-foreground',
            dot: 'bg-muted-foreground',
        };
    };

    const formatStatusName = (stat: string) => {
        if (stat === 'in_progress') return 'In Progress';
        return stat.charAt(0).toUpperCase() + stat.slice(1);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '#' },
                { title: 'Task Management', href: basePath },
            ]}
        >
            <Head title="Task Management" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Task Management
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Oversee and track onboarding and offboarding tasks
                            across the organization.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Link href={`${basePath}/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                        </Link>
                    </Button>
                </div>

                {/* Metrics Row (Mocked for visual completeness as per screenshot) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Tasks
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        {tasks?.total || 0}
                                    </p>
                                    <span className="text-xs font-semibold text-primary">
                                        +12% vs last month
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pending / In Progress
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        {metrics?.pending || 52}
                                    </p>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        21% of total
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        {metrics?.completed || 184}
                                    </p>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        74% completion rate
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Overdue
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold tracking-tight text-foreground">
                                        {metrics?.overdue || 12}
                                    </p>
                                    <span className="text-xs font-semibold text-destructive">
                                        Needs attention
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                                <AlertCircle className="h-5 w-5" />
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
                                placeholder="Search tasks, employees or teams..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-10 w-[160px] border-border shadow-none">
                                    <SelectValue placeholder="Status: All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Status: All
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {(search || status !== 'all') && (
                                <Button
                                    variant="ghost"
                                    onClick={resetFilters}
                                    className="h-10 px-4 text-muted-foreground hover:text-foreground"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    <TableHead className="h-12 w-[250px] pl-6 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Employee
                                    </TableHead>
                                    <TableHead className="w-[120px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Staff #
                                    </TableHead>
                                    <TableHead className="w-[280px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Task Name
                                    </TableHead>
                                    <TableHead className="w-[150px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Owner Team
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Due Date
                                    </TableHead>
                                    <TableHead className="w-[160px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[120px] pr-6 text-right text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No tasks found matching your search
                                            criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((record) => {
                                        const statusStyle = getStatusStyles(
                                            record.status,
                                        );
                                        const empName = getFullName(
                                            record.employee,
                                        );

                                        return (
                                            <TableRow
                                                key={record.id}
                                                className="group hover:bg-muted/30"
                                            >
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-border shadow-sm">
                                                            <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                                                {getInitials(
                                                                    empName,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm font-bold text-foreground">
                                                            {empName}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                                    {record.employee
                                                        ?.staff_number || '—'}
                                                </TableCell>

                                                <TableCell className="max-w-[250px] truncate text-sm font-medium text-foreground">
                                                    {record.task_name}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-muted px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase shadow-none"
                                                    >
                                                        {record.owner_team}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    {record.due_date
                                                        ? moment(
                                                              record.due_date,
                                                          ).format(
                                                              'MMM DD, YYYY',
                                                          )
                                                        : '—'}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`border-transparent px-2.5 py-0.5 shadow-none ${statusStyle.badge}`}
                                                    >
                                                        <div
                                                            className={`mr-2 h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                                        />
                                                        {formatStatusName(
                                                            record.status,
                                                        )}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="View Task"
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
                                                            title="Edit Task"
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
                                                            title="Delete Task"
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
                    {tasks?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t bg-muted/10 p-4">
                            <div className="pl-2 text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {(tasks.current_page - 1) * tasks.per_page +
                                        1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-foreground">
                                    {Math.min(
                                        tasks.current_page * tasks.per_page,
                                        tasks.total,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {tasks.total}
                                </span>{' '}
                                tasks
                            </div>
                            <ReactPaginate
                                pageCount={tasks.last_page}
                                forcePage={tasks.current_page - 1}
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

                {/* Global Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Task?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the
                                task{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.task_name}
                                </strong>{' '}
                                assigned to{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.employee
                                        ? getFullName(recordToDelete.employee)
                                        : 'Unknown'}
                                </strong>
                                ? This action cannot be undone.
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
