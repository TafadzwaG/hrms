import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Trash2,
    Eye,
    Filter,
    User,
    Clock,
    UploadCloud,
    Search,
    Settings2,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const DEFAULT_VISIBLE = [
    'staff_number',
    'full_name',
    'pay_point',
    'contact_number',
    'date_of_birth',
] as const;

export default function EmployeeIndex() {
    const { employees, filters } = usePage().props as any;

    const [search, setSearch] = useState<string>(filters.search || '');
    const [payPoint, setPayPoint] = useState<string>(
        filters.pay_point || 'all',
    );
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

    // Fetch filtered data
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `${API}/employees`,
                { search, pay_point: payPoint },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, payPoint]);

    const handlePayPointChange = (val: string) => setPayPoint(val);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this employee? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`${API}/employees/${id}`, {
                    preserveScroll: true,
                    onSuccess: () =>
                        Swal.fire(
                            'Deleted!',
                            'The employee has been deleted.',
                            'success',
                        ),
                    onError: () =>
                        Swal.fire(
                            'Error!',
                            'Failed to delete employee.',
                            'error',
                        ),
                });
            }
        });
    };

    const openDeleteDialog = (employee: any) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!employeeToDelete) return;
        router.delete(`${API}/employees/${employeeToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
                Swal.fire(
                    'Deleted!',
                    'Employee has been deleted successfully.',
                    'success',
                );
            },
            onError: (err) => {
                Swal.fire('Error', 'Failed to delete employee', 'error');
                console.error(err);
            },
        });
    };

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            `${API}/employees`,
            { page: selected.selected + 1, search, pay_point: payPoint },
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

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const mdiff = today.getMonth() - birthDate.getMonth();
        if (mdiff < 0 || (mdiff === 0 && today.getDate() < birthDate.getDate()))
            age--;
        return age;
    };

    const getPayPointBadge = (pp: string) => {
        const map: Record<string, string> = {
            'Head Office': 'bg-blue-600',
            'Staffing Solutions': 'bg-green-600',
            Health: 'bg-red-600',
            Consultancy: 'bg-purple-600',
        };
        return map[pp] || 'bg-gray-600';
    };

    const pageData = employees?.data ?? [];

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
            <Head title="Employees" />

            <div className="mx-2 my-6 rounded-xl bg-background p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Employee Management
                    </h1>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button
                            size="sm"
                            variant="secondary"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link
                                href={`${API}/employees/upload`}
                                className="flex items-center"
                            >
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Bulk Upload Employees
                            </Link>
                        </Button>

                        <Button
                            size="sm"
                            variant="secondary"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link
                                href={`${API}/employees/create`}
                                className="flex items-center"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Employee
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters — Mobile (Sheet) */}
                <div className="mb-4 sm:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                                <Settings2 className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="top" className="space-y-4 p-4">
                            <SheetHeader>
                                <SheetTitle>Filter Employees</SheetTitle>
                            </SheetHeader>

                            <div className="grid grid-cols-1 gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Label
                                        htmlFor="m-search"
                                        className="sr-only"
                                    >
                                        Search
                                    </Label>
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="m-search"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search by name or staff number…"
                                        className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                                    />
                                </div>

                                {/* Pay Point */}
                                <div>
                                    <Label className="sr-only">Pay Point</Label>
                                    <Select
                                        value={payPoint}
                                        onValueChange={handlePayPointChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by pay point" />
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

                                {/* Columns */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                            Columns
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-64"
                                    >
                                        <DropdownMenuLabel>
                                            Toggle Columns
                                        </DropdownMenuLabel>
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
                                            Reset to defaults
                                        </Button>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="w-full gap-2"
                                        title="Reset all filters"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>

                                    {/* Close Sheet */}
                                    <SheetTrigger asChild>
                                        <Button className="w-full">
                                            Apply & Close
                                        </Button>
                                    </SheetTrigger>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Filters — Desktop (inline toolbar) */}
                <div className="mb-4 hidden flex-wrap items-center gap-2 sm:flex">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or staff number…"
                            className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-sm"
                        />
                    </div>

                    {/* Pay point */}
                    <Select
                        value={payPoint}
                        onValueChange={handlePayPointChange}
                    >
                        <SelectTrigger className="w-full sm:w-64">
                            <SelectValue placeholder="Filter by pay point" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Pay Points</SelectItem>
                            <SelectItem value="Head Office">
                                Head Office
                            </SelectItem>
                            <SelectItem value="Staffing Solutions">
                                Staffing Solutions
                            </SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Consultancy">
                                Consultancy
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Columns */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            {allColumns.map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.key}
                                    checked={visibleColumns.includes(col.key)}
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
                                Reset to defaults
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="ml-auto flex w-full items-center gap-2 sm:w-auto"
                        title="Reset all filters"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Employees
                                </p>
                                <p className="text-2xl font-bold">
                                    {employees.total}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Head Office
                                </p>
                                <p className="text-2xl font-bold">
                                    {headOfficeCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <div className="h-6 w-6 rounded-full bg-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Staffing Solutions
                                </p>
                                <p className="text-2xl font-bold">
                                    {staffingCount}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <div className="h-6 w-6 rounded-full bg-green-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Health & Consultancy
                                </p>
                                <p className="text-2xl font-bold">
                                    {healthConsultancy}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <div className="h-6 w-6 rounded-full bg-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                    {pageData.length === 0 ? (
                        <Card className="p-4 text-sm text-muted-foreground">
                            No employees found.
                        </Card>
                    ) : (
                        pageData.map((emp: any) => (
                            <Card key={emp.id} className="space-y-2 border p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="font-semibold">
                                            {emp.first_name} {emp.surname}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {emp.user?.email ?? '—'}
                                        </div>
                                        <div className="mt-1 text-sm">
                                            <span className="font-medium">
                                                Staff #:
                                            </span>{' '}
                                            {emp.staff_number || '—'}
                                        </div>
                                        <div className="text-sm">
                                            <Badge
                                                className={`${getPayPointBadge(
                                                    emp.pay_point,
                                                )} mt-1`}
                                            >
                                                {emp.pay_point ?? '—'}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {emp.contact_number || '—'}
                                        </div>
                                        {emp.date_of_birth && (
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(emp.date_of_birth)}{' '}
                                                •{' '}
                                                {calculateAge(
                                                    emp.date_of_birth,
                                                )}{' '}
                                                yrs
                                            </div>
                                        )}
                                        {emp.address && (
                                            <div className="truncate text-sm text-muted-foreground">
                                                {emp.address}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2 pt-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link
                                            href={`${API}/employees/${emp.id}`}
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link
                                            href={`${API}/employees/${emp.id}/edit`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="h-8 gap-1 px-3"
                                        onClick={() => openDeleteDialog(emp)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="h-8 gap-1 px-3"
                                    >
                                        <Link
                                            href={`${API}/leave-applications/create?employee=${emp.id}`}
                                        >
                                            <Clock className="h-4 w-4" />
                                            Leave
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto rounded-xl border md:block">
                    <Table>
                        <TableCaption>
                            List of Employees ({employees.total} total)
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                {visibleColumns.map((col) => {
                                    const column = allColumns.find(
                                        (c) => c.key === col,
                                    );
                                    return column ? (
                                        <TableHead key={col}>
                                            {column.label}
                                        </TableHead>
                                    ) : null;
                                })}
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData.length > 0 ? (
                                pageData.map((employee: any) => (
                                    <TableRow key={employee.id}>
                                        {visibleColumns.includes(
                                            'staff_number',
                                        ) && (
                                            <TableCell className="font-medium">
                                                {employee.staff_number}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes(
                                            'full_name',
                                        ) && (
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                                                            <User className="h-6 w-6 text-gray-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                employee?.first_name
                                                            }{' '}
                                                            {employee?.surname}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                employee.user
                                                                    ?.email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes(
                                            'pay_point',
                                        ) && (
                                            <TableCell>
                                                <Badge
                                                    className={getPayPointBadge(
                                                        employee.pay_point,
                                                    )}
                                                >
                                                    {employee.pay_point}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes(
                                            'contact_number',
                                        ) && (
                                            <TableCell>
                                                {employee.contact_number}
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes(
                                            'date_of_birth',
                                        ) && (
                                            <TableCell>
                                                <div>
                                                    {formatDate(
                                                        employee.date_of_birth,
                                                    )}
                                                    <div className="text-sm text-muted-foreground">
                                                        {calculateAge(
                                                            employee.date_of_birth,
                                                        )}{' '}
                                                        years old
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes('address') && (
                                            <TableCell className="max-w-xs truncate">
                                                {employee.address}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`${API}/employees/${employee.id}`}
                                                    className="inline-flex items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`${API}/employees/${employee.id}/edit`}
                                                    className="inline-flex items-center justify-center rounded-full bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openDeleteDialog(
                                                            employee,
                                                        )
                                                    }
                                                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <Link
                                                    href={`${API}/leave-applications/create?employee=${employee.id}`}
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <Clock className="h-4 w-4" />
                                                        Leave Application
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={visibleColumns.length + 1}
                                        className="text-center text-gray-500"
                                    >
                                        No employees found. Try adjusting your
                                        filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Employee</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the employee{' '}
                                <strong className="text-foreground">
                                    {employeeToDelete?.first_name}{' '}
                                    {employeeToDelete?.surname}
                                </strong>
                                ? This action cannot be undone and will remove
                                all associated data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                variant="destructive"
                            >
                                Confirm Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Pagination */}
                {employees.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        <ReactPaginate
                            pageCount={employees.last_page}
                            forcePage={employees.current_page - 1}
                            onPageChange={handlePageChange}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            previousLabel="← Previous"
                            nextLabel="Next →"
                            breakLabel="..."
                            containerClassName="flex items-center gap-2 text-sm"
                            pageClassName="px-3 py-1 border rounded hover:bg-muted"
                            activeClassName="bg-blue-600 text-white"
                            previousClassName="px-3 py-1 border rounded hover:bg-muted"
                            nextClassName="px-3 py-1 border rounded hover:bg-muted"
                            breakClassName="px-2"
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
