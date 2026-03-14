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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    Pencil,
    Search,
    Trash2,
    UploadCloud,
    UserPlus,
    ShieldAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type EmployeeRow = {
    id: number;
    staff_number: string;
    first_name: string;
    middle_name: string | null;
    surname: string;
    full_name: string;
    date_of_birth: string | null;
    pay_point: string | null;
    contact_number: string | null;
    address: string | null;
    avatar_url?: string | null;
    user: { id: number; name: string; email: string } | null;
    department: { id: number; name: string; type: string } | null;
    position: { id: number; name: string } | null;
    created_at: string | null;
};

type PaginatedEmployees = {
    data: EmployeeRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

export default function EmployeeIndex() {
    const { employees, filters, payPoints } = usePage<{
        employees: PaginatedEmployees;
        filters: { search?: string; pay_point?: string };
        payPoints: string[];
    }>().props;

    const { can } = useAuthorization();
    const [search, setSearch] = useState(filters.search ?? '');
    const [payPoint, setPayPoint] = useState(filters.pay_point ?? 'all');
    const [employeeToDelete, setEmployeeToDelete] =
        useState<EmployeeRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/employees',
                { search, pay_point: payPoint === 'all' ? '' : payPoint },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, payPoint]);

    const confirmDelete = () => {
        if (!employeeToDelete) return;

        router.delete(`/employees/${employeeToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setEmployeeToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/employees',
            {
                page: selectedItem.selected + 1,
                search,
                pay_point: payPoint === 'all' ? '' : payPoint,
            },
            { preserveScroll: true, preserveState: true },
        );
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Employees', href: '/employees' }]}>
            <Head title="Employee Directory" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Employee directory
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Browse employee records, linked accounts, and
                            organizational placement across all departments and
                            pay points.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('employees.bulk_upload') && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                            >
                                <Link href="/employees/upload">
                                    <UploadCloud className="mr-2 h-4 w-4" />{' '}
                                    Bulk upload
                                </Link>
                            </Button>
                        )}
                        {can('employees.create') && (
                            <Button
                                asChild
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Link href="/employees/create">
                                    <UserPlus className="mr-2 h-4 w-4" /> Add
                                    employee
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Directory Card */}
                <Card className="flex h-[calc(100vh-220px)] w-full flex-col overflow-hidden border-border bg-background shadow-sm">
                    {/* Toolbar Section */}
                    <div className="flex shrink-0 flex-col justify-between gap-4 border-b border-border/50 p-4 sm:flex-row sm:items-center md:p-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-bold text-foreground">
                                Employee records
                            </h2>
                            <Badge
                                variant="secondary"
                                className="border-transparent bg-muted px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                            >
                                {employees.total} total
                            </Badge>
                        </div>

                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search records..."
                                    className="h-10 w-full border-border/50 bg-background pl-9 text-sm shadow-sm"
                                />
                            </div>
                            <Select
                                value={payPoint}
                                onValueChange={setPayPoint}
                            >
                                <SelectTrigger className="h-10 w-full border-border/50 bg-background text-sm font-medium shadow-sm sm:w-48">
                                    <SelectValue placeholder="All Pay Points" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Pay Points
                                    </SelectItem>
                                    {payPoints.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="flex-1 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                    <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Employee
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Assignment
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Contact
                                    </TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Pay Point
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.data.length > 0 ? (
                                    employees.data.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-border shadow-sm">
                                                        <AvatarImage
                                                            src={
                                                                employee.avatar_url ||
                                                                ''
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-muted text-xs font-bold text-foreground">
                                                            {getInitials(
                                                                employee.full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <Link
                                                            href={`/employees/${employee.id}`}
                                                            className="text-sm font-bold text-foreground hover:underline"
                                                        >
                                                            {employee.full_name}
                                                        </Link>
                                                        <div className="font-mono text-xs text-muted-foreground">
                                                            STF-
                                                            {
                                                                employee.staff_number
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-foreground">
                                                        {employee.department
                                                            ?.name ||
                                                            'Unassigned Department'}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {employee.position
                                                            ?.name ||
                                                            'No Position'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    {employee.user?.email ||
                                                        employee.contact_number ||
                                                        'No contact info'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground shadow-none"
                                                >
                                                    {employee.pay_point ||
                                                        'Not Set'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* View Detailed Page Action */}
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Record"
                                                    >
                                                        <Link
                                                            href={`/employees/${employee.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {/* Edit Action */}
                                                    {can(
                                                        'employees.update',
                                                    ) && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="Edit Record"
                                                        >
                                                            <Link
                                                                href={`/employees/${employee.id}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {/* Delete Action */}
                                                    {can(
                                                        'employees.delete',
                                                    ) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                setEmployeeToDelete(
                                                                    employee,
                                                                )
                                                            }
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No employees match the current
                                            filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {employees.last_page > 1 && (
                        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row">
                            <span className="text-xs font-bold text-muted-foreground">
                                Page {employees.current_page} of{' '}
                                {employees.last_page}
                            </span>
                            <ReactPaginate
                                pageCount={employees.last_page}
                                forcePage={employees.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel="Previous"
                                nextLabel="Next"
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-bold hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                activeLinkClassName="!bg-foreground text-background font-bold border-foreground hover:!bg-foreground/90 rounded-md"
                                previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-bold text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </Card>
            </div>

            {/* Monochromatic Delete Alert Dialog */}
            <AlertDialog
                open={Boolean(employeeToDelete)}
                onOpenChange={(open) => !open && setEmployeeToDelete(null)}
            >
                <AlertDialogContent className="p-6 sm:max-w-[425px]">
                    <AlertDialogHeader className="flex flex-col items-center gap-2 pb-2 text-center">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <AlertDialogTitle className="text-xl font-extrabold text-foreground">
                            Delete employee?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                            Are you sure you want to delete{' '}
                            <strong className="text-foreground">
                                {employeeToDelete?.full_name}
                            </strong>{' '}
                            (STF-{employeeToDelete?.staff_number})? This action
                            cannot be undone and all associated records will be
                            archived.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="mt-0 h-11 w-full border-border px-8 font-bold shadow-sm sm:mt-0 sm:w-auto">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-11 w-full bg-destructive px-8 font-bold text-destructive-foreground shadow-sm hover:bg-destructive/90 sm:w-auto"
                        >
                            Confirm Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
