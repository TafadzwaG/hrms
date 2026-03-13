import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Columns,
    Eye,
    Filter,
    HeartPulse,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UploadCloud,
    User,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const DEFAULT_VISIBLE = [
    'staff_number',
    'full_name',
    'pay_point',
    'contact_number',
    'date_of_birth',
] as const;

export default function EmployeeIndex() {
    const { employees, filters } = usePage().props as any;

    // Filters
    const [search, setSearch] = useState<string>(filters.search || '');
    const [payPoint, setPayPoint] = useState<string>(
        filters.pay_point || 'all',
    );

    // UI State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        ...DEFAULT_VISIBLE,
    ]);

    const allColumns = [
        { key: 'staff_number', label: 'Staff Number' },
        { key: 'full_name', label: 'Full Name' },
        { key: 'pay_point', label: 'Pay Point' },
        { key: 'contact_number', label: 'Contact Number' },
        { key: 'date_of_birth', label: 'Date of Birth' },
        { key: 'address', label: 'Address' },
    ] as const;

    const toggleColumn = (col: string) =>
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
        );

    const resetColumns = () => setVisibleColumns([...DEFAULT_VISIBLE]);

    // Fetch filtered data (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `${API}/employees`,
                { search, pay_point: payPoint === 'all' ? '' : payPoint },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, payPoint]);

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            `${API}/employees`,
            {
                page: selected.selected + 1,
                search,
                pay_point: payPoint === 'all' ? '' : payPoint,
            },
            { preserveState: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setPayPoint('all');
        router.get(
            `${API}/employees`,
            {},
            { preserveState: true, replace: true },
        );
    };

    const confirmDelete = () => {
        if (!employeeToDelete) return;
        router.delete(`${API}/employees/${employeeToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        return moment(dateString).format('MMM DD, YYYY');
    };

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return '—';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const mdiff = today.getMonth() - birthDate.getMonth();
        if (mdiff < 0 || (mdiff === 0 && today.getDate() < birthDate.getDate()))
            age--;
        return age;
    };

    // Refactored to use semantic monochromatic classes
    const getPayPointBadge = (pp: string) => {
        const map: Record<string, string> = {
            'Head Office':
                'bg-foreground text-background hover:bg-foreground border-transparent shadow-sm',
            'Staffing Solutions':
                'bg-primary/20 text-primary hover:bg-primary/30 border-transparent',
            Health: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
            Consultancy:
                'bg-muted text-muted-foreground hover:bg-muted/80 border-border',
        };
        return map[pp] || 'bg-muted text-muted-foreground border-border';
    };

    const pageData = employees?.data ?? [];

    // Stats
    const headOfficeCount = useMemo(
        () => pageData.filter((e: any) => e.pay_point === 'Head Office').length,
        [pageData],
    );
    const staffingCount = useMemo(
        () =>
            pageData.filter((e: any) => e.pay_point === 'Staffing Solutions')
                .length,
        [pageData],
    );
    const healthConsultancy = useMemo(
        () =>
            pageData.filter(
                (e: any) =>
                    e.pay_point === 'Health' || e.pay_point === 'Consultancy',
            ).length,
        [pageData],
    );

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Employees', href: `${API}/employees` }]}
        >
            <Head title="Employee Directory" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Employee Directory
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage staff profiles, organizational placement, and
                            core personnel records.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button
                            variant="outline"
                            asChild
                            className="w-full bg-background shadow-sm sm:w-auto"
                        >
                            <Link href={`${API}/employees/upload`}>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Bulk Upload
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="w-full font-semibold shadow-sm sm:w-auto"
                        >
                            <Link href={`${API}/employees/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Employee
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Total Employees
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {employees.total}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Head Office
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {headOfficeCount}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Staffing Solutions
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {staffingCount}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Briefcase className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-start justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Consultancy
                                </p>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {healthConsultancy}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <HeartPulse className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-[320px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, ID, or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                                />
                            </div>

                            {/* Pay Point Filter */}
                            <Select
                                value={payPoint}
                                onValueChange={setPayPoint}
                            >
                                <SelectTrigger className="h-10 w-full border-border shadow-none sm:w-[200px]">
                                    <SelectValue placeholder="All Pay Points" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Pay Points
                                    </SelectItem>
                                    <SelectItem value="Head Office">
                                        Head Office
                                    </SelectItem>
                                    <SelectItem value="Staffing Solutions">
                                        Staffing Solutions
                                    </SelectItem>
                                    <SelectItem value="Health">
                                        Health
                                    </SelectItem>
                                    <SelectItem value="Consultancy">
                                        Consultancy
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex w-full items-center gap-3 lg:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-full border-border bg-background font-medium shadow-sm sm:w-auto"
                                    >
                                        <Columns className="mr-2 h-4 w-4 text-muted-foreground" />
                                        Columns
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuLabel>
                                        Toggle Columns
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {allColumns.map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col.key}
                                            checked={visibleColumns.includes(
                                                col.key,
                                            )}
                                            onCheckedChange={() =>
                                                toggleColumn(col.key)
                                            }
                                        >
                                            {col.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-full justify-start px-2 text-sm"
                                        onClick={resetColumns}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Reset defaults
                                    </Button>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="h-10 w-full border-border bg-background font-medium shadow-sm sm:w-auto"
                                title="Reset all filters"
                            >
                                <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-transparent">
                                    {visibleColumns.includes(
                                        'staff_number',
                                    ) && (
                                        <TableHead className="h-12 w-[140px] pl-6 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Staff ID
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('full_name') && (
                                        <TableHead className="min-w-[240px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Employee Details
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('pay_point') && (
                                        <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Pay Point
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes(
                                        'contact_number',
                                    ) && (
                                        <TableHead className="w-[160px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Contact Info
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes(
                                        'date_of_birth',
                                    ) && (
                                        <TableHead className="w-[180px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Demographics
                                        </TableHead>
                                    )}
                                    {visibleColumns.includes('address') && (
                                        <TableHead className="min-w-[200px] text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Address
                                        </TableHead>
                                    )}
                                    <TableHead className="w-[180px] pr-6 text-right text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={visibleColumns.length + 1}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No employees found matching your
                                            search criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((employee: any) => (
                                        <TableRow
                                            key={employee.id}
                                            className="hover:bg-muted/30"
                                        >
                                            {visibleColumns.includes(
                                                'staff_number',
                                            ) && (
                                                <TableCell className="py-4 pl-6 font-mono text-xs font-medium text-muted-foreground">
                                                    {employee.staff_number ||
                                                        '—'}
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'full_name',
                                            ) && (
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-muted-foreground uppercase">
                                                            {
                                                                employee
                                                                    .first_name?.[0]
                                                            }
                                                            {
                                                                employee
                                                                    .surname?.[0]
                                                            }
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={`${API}/employees/${employee.id}`}
                                                                className="text-sm font-bold text-foreground transition-colors hover:text-primary"
                                                            >
                                                                {
                                                                    employee.first_name
                                                                }{' '}
                                                                {
                                                                    employee.surname
                                                                }
                                                            </Link>
                                                            <span className="mt-0.5 text-xs text-muted-foreground">
                                                                {employee.user
                                                                    ?.email ??
                                                                    'No email mapped'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'pay_point',
                                            ) && (
                                                <TableCell>
                                                    <Badge
                                                        className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${getPayPointBadge(employee.pay_point)}`}
                                                    >
                                                        {employee.pay_point ||
                                                            'Unassigned'}
                                                    </Badge>
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'contact_number',
                                            ) && (
                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    {employee.contact_number ||
                                                        '—'}
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'date_of_birth',
                                            ) && (
                                                <TableCell className="text-sm text-muted-foreground">
                                                    <div className="font-medium text-foreground">
                                                        {formatDate(
                                                            employee.date_of_birth,
                                                        )}
                                                    </div>
                                                    <div className="mt-0.5 text-xs">
                                                        {calculateAge(
                                                            employee.date_of_birth,
                                                        )}{' '}
                                                        years old
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.includes(
                                                'address',
                                            ) && (
                                                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                                                    {employee.address || '—'}
                                                </TableCell>
                                            )}

                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Profile"
                                                    >
                                                        <Link
                                                            href={`${API}/employees/${employee.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Edit Profile"
                                                    >
                                                        <Link
                                                            href={`${API}/employees/${employee.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                        title="File Leave Application"
                                                    >
                                                        <Link
                                                            href={`${API}/leave-applications/create?employee=${employee.id}`}
                                                        >
                                                            <Clock className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => {
                                                            setEmployeeToDelete(
                                                                employee,
                                                            );
                                                            setDeleteDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                        title="Delete Employee"
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
                    {employees.last_page > 1 && (
                        <div className="flex items-center justify-between border-t bg-muted/10 p-4">
                            <div className="pl-2 text-sm font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {(employees.current_page - 1) *
                                        employees.per_page +
                                        1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-foreground">
                                    {Math.min(
                                        employees.current_page *
                                            employees.per_page,
                                        employees.total,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {employees.total}
                                </span>{' '}
                                entries
                            </div>
                            <ReactPaginate
                                pageCount={employees.last_page}
                                forcePage={employees.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <span className="flex items-center text-sm font-medium">
                                        <ChevronLeft className="mr-1 h-4 w-4" />{' '}
                                        Prev
                                    </span>
                                }
                                nextLabel={
                                    <span className="flex items-center text-sm font-medium">
                                        Next{' '}
                                        <ChevronRight className="ml-1 h-4 w-4" />
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

                {/* Delete Confirmation Dialog replacing SweetAlert */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Employee Record?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the
                                profile for{' '}
                                <strong>
                                    {employeeToDelete?.first_name}{' '}
                                    {employeeToDelete?.surname}
                                </strong>
                                ?
                                <br />
                                <br />
                                This action cannot be undone and will
                                permanently remove all associated personnel
                                data, hierarchy links, and historical records.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setEmployeeToDelete(null)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, Delete Employee
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
