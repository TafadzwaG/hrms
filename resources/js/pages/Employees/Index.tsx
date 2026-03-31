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
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
import { RoleScopeBar } from '@/components/role-scope-bar';
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
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { buildIndexParams } from '@/lib/index-table';
import type { PageRoleScope } from '@/types/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarPlus,
    Eye,
    FileDown,
    Loader2,
    Pencil,
    Search,
    ShieldAlert,
    SlidersHorizontal,
    Trash2,
    UploadCloud,
    UserCheck,
    UserPlus,
    Users,
    UsersRound,
    X,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

type EmployeeRow = {
    id: number;
    staff_number: string;
    first_name: string;
    middle_name: string | null;
    surname: string;
    full_name: string;
    date_of_birth: string | null;
    email: string | null;
    national_id: string | null;
    gender: string | null;
    occupation: string | null;
    pay_point: string | null;
    contact_number: string | null;
    alt_phone_number: string | null;
    address: string | null;
    marital_status: string | null;
    nationality: string | null;
    educational_level: string | null;
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
    const {
        employees,
        filters,
        payPoints,
        occupations,
        genders,
        maritalStatuses,
        nationalities,
        educationalLevels,
        departments,
        positions,
        stats,
        scope,
    } = usePage<{
        employees: PaginatedEmployees;
        stats: { total: number; with_accounts: number; departments: number; new_this_month: number; male: number; female: number };
        filters: {
            search?: string;
            pay_point?: string;
            occupation?: string;
            department_id?: string;
            position_id?: string;
            gender?: string;
            marital_status?: string;
            nationality?: string;
            educational_level?: string;
            per_page?: number;
            sort?: string;
            direction?: 'asc' | 'desc';
            scope_view?: string;
        };
        payPoints: string[];
        occupations: string[];
        genders: string[];
        maritalStatuses: string[];
        nationalities: string[];
        educationalLevels: string[];
        departments: { id: number; name: string }[];
        positions: { id: number; name: string }[];
        scope?: PageRoleScope;
    }>().props;

    const { can } = useAuthorization();

    const [search, setSearch] = useState(filters.search ?? '');
    const [payPoint, setPayPoint] = useState(filters.pay_point ?? 'all');
    const [occupation, setOccupation] = useState(filters.occupation ?? '');
    const [departmentId, setDepartmentId] = useState(filters.department_id ?? '');
    const [positionId, setPositionId] = useState(filters.position_id ?? '');
    const [gender, setGender] = useState(filters.gender ?? '');
    const [maritalStatus, setMaritalStatus] = useState(filters.marital_status ?? '');
    const [nationality, setNationality] = useState(filters.nationality ?? '');
    const [educationalLevel, setEducationalLevel] = useState(filters.educational_level ?? '');
    const [perPage, setPerPage] = useState(filters.per_page ?? 10);
    const [showFilters, setShowFilters] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeRow | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const pageIds = employees.data.map((e) => e.id);
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    const somePageSelected = pageIds.some((id) => selectedIds.has(id));

    const toggleAll = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allPageSelected) {
                pageIds.forEach((id) => next.delete(id));
            } else {
                pageIds.forEach((id) => next.add(id));
            }
            return next;
        });
    };

    const toggleOne = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleExport = () => {
        setIsExporting(true);
        import('axios').then(({ default: axios }) => {
            axios
                .post('/employees/export-selected', { ids: Array.from(selectedIds) }, { responseType: 'blob' })
                .then((res) => {
                    const url = URL.createObjectURL(new Blob([res.data]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `employees_export_${Date.now()}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    setShowExportDialog(false);
                    setSelectedIds(new Set());
                })
                .catch(console.error)
                .finally(() => setIsExporting(false));
        });
    };

    const activeFilterCount = [
        payPoint !== 'all' && payPoint !== '' ? 1 : 0,
        occupation !== '' && occupation !== 'all' ? 1 : 0,
        departmentId !== '' && departmentId !== 'all' ? 1 : 0,
        positionId !== '' && positionId !== 'all' ? 1 : 0,
        gender !== '' && gender !== 'all' ? 1 : 0,
        maritalStatus !== '' && maritalStatus !== 'all' ? 1 : 0,
        nationality !== '' && nationality !== 'all' ? 1 : 0,
        educationalLevel !== '' && educationalLevel !== 'all' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/employees',
                buildIndexParams(filters, {
                    search,
                    pay_point: payPoint === 'all' ? '' : payPoint,
                    occupation: occupation === 'all' ? '' : occupation,
                    department_id: departmentId === 'all' ? '' : departmentId,
                    position_id: positionId === 'all' ? '' : positionId,
                    gender: gender === 'all' ? '' : gender,
                    marital_status: maritalStatus === 'all' ? '' : maritalStatus,
                    nationality: nationality === 'all' ? '' : nationality,
                    educational_level: educationalLevel === 'all' ? '' : educationalLevel,
                    per_page: perPage,
                }),
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [
        search,
        payPoint,
        occupation,
        departmentId,
        positionId,
        gender,
        maritalStatus,
        nationality,
        educationalLevel,
        perPage,
    ]);

    const clearFilters = () => {
        setSearch('');
        setPayPoint('all');
        setOccupation('');
        setDepartmentId('');
        setPositionId('');
        setGender('');
        setMaritalStatus('');
        setNationality('');
        setEducationalLevel('');
    };

    const confirmDelete = () => {
        if (!employeeToDelete) return;
        router.delete(`/employees/${employeeToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setEmployeeToDelete(null),
        });
    };

    const calcAge = (dob: string | null): number | null => {
        if (!dob) return null;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
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

                <RoleScopeBar
                    scope={scope}
                    path="/employees"
                    filters={filters}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                        { label: 'Total Employees', value: stats.total, icon: Users },
                        { label: 'With Accounts', value: stats.with_accounts, icon: UserCheck },
                        { label: 'Departments', value: stats.departments, icon: Building2 },
                        { label: 'Added This Month', value: stats.new_this_month, icon: CalendarPlus },
                        { label: 'Male', value: stats.male, icon: UsersRound },
                        { label: 'Female', value: stats.female, icon: UsersRound },
                    ].map((stat) => (
                        <Card key={stat.label} className="border-border bg-card shadow-none">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                </div>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Directory Card */}
                <Card className="w-full border-border bg-background shadow-sm">
                    {/* Toolbar Section */}
                    <div className="shrink-0 border-b border-border/50">
                        {/* Top toolbar row */}
                        <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center md:p-6">
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
                                {/* Search input with clear button */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search name, staff number, national ID, email..."
                                        className="h-10 w-full border-border/50 bg-background pl-9 pr-9 text-sm shadow-sm"
                                    />
                                    {search !== '' && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            aria-label="Clear search"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Per page selector */}
                                <div className="flex items-center gap-2">
                                    <span className="shrink-0 text-xs font-medium text-muted-foreground">Rows</span>
                                    <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
                                        <SelectTrigger className="h-10 w-20 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            {[10, 25, 50, 100].map((n) => (
                                                <SelectItem key={n} value={String(n)} className="text-sm font-medium">
                                                    {n}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filters toggle button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 shrink-0 border-border/50 bg-background px-4 font-medium shadow-sm"
                                    onClick={() => setShowFilters((v) => !v)}
                                >
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-2 border-transparent bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background shadow-none"
                                        >
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>

                                {selectedIds.size > 0 && (
                                    <Button
                                        size="sm"
                                        className="h-10 shrink-0 px-4 font-medium shadow-sm"
                                        onClick={() => setShowExportDialog(true)}
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Export ({selectedIds.size})
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Expandable filter panel */}
                        {showFilters && (
                            <div className="border-t border-border/50 px-4 py-4 md:px-6">
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                    {/* Pay Point */}
                                    <Select
                                        value={payPoint}
                                        onValueChange={setPayPoint}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Pay Points" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Pay Points</SelectItem>
                                            {payPoints.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Occupation */}
                                    <Select
                                        value={occupation || 'all'}
                                        onValueChange={(v) => setOccupation(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Occupations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Occupations</SelectItem>
                                            {occupations.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Department */}
                                    <Select
                                        value={departmentId || 'all'}
                                        onValueChange={(v) => setDepartmentId(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Departments" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={String(dept.id)}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Position */}
                                    <Select
                                        value={positionId || 'all'}
                                        onValueChange={(v) => setPositionId(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Positions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Positions</SelectItem>
                                            {positions.map((pos) => (
                                                <SelectItem key={pos.id} value={String(pos.id)}>
                                                    {pos.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Gender */}
                                    <Select
                                        value={gender || 'all'}
                                        onValueChange={(v) => setGender(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Genders" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Genders</SelectItem>
                                            {genders.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Marital Status */}
                                    <Select
                                        value={maritalStatus || 'all'}
                                        onValueChange={(v) => setMaritalStatus(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Marital Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Marital Statuses</SelectItem>
                                            {maritalStatuses.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Nationality */}
                                    <Select
                                        value={nationality || 'all'}
                                        onValueChange={(v) => setNationality(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Nationalities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Nationalities</SelectItem>
                                            {nationalities.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Educational Level */}
                                    <Select
                                        value={educationalLevel || 'all'}
                                        onValueChange={(v) => setEducationalLevel(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger className="h-9 border-border/50 bg-background text-sm font-medium shadow-sm">
                                            <SelectValue placeholder="All Educational Levels" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Educational Levels</SelectItem>
                                            {educationalLevels.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(activeFilterCount > 0 || search !== '') && (
                                    <div className="mt-3 flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                                            onClick={clearFilters}
                                        >
                                            <X className="mr-1.5 h-3.5 w-3.5" />
                                            Clear filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Table Area */}
                    <div>
                        <Table>
                            <TableHeader>
                                <IndexTableHeaderRow>
                                    <IndexTableHead className="w-10 pl-6">
                                        <Checkbox
                                            checked={allPageSelected ? true : somePageSelected ? 'indeterminate' : false}
                                            onCheckedChange={toggleAll}
                                            aria-label="Select all on page"
                                        />
                                    </IndexTableHead>
                                    <SortableTableHead
                                        path="/employees"
                                        filters={filters}
                                        sortKey="employee"
                                    >
                                        Employee
                                    </SortableTableHead>
                                    <SortableTableHead
                                        path="/employees"
                                        filters={filters}
                                        sortKey="department"
                                    >
                                        Assignment
                                    </SortableTableHead>
                                    <IndexTableHead>Contact</IndexTableHead>
                                    <SortableTableHead
                                        path="/employees"
                                        filters={filters}
                                        sortKey="pay_point"
                                    >
                                        Pay Point
                                    </SortableTableHead>
                                    <IndexTableHead>Age</IndexTableHead>
                                    <IndexTableHead>Education</IndexTableHead>
                                    <IndexTableHead
                                        align="right"
                                        className="pr-6"
                                    >
                                        Actions
                                    </IndexTableHead>
                                </IndexTableHeaderRow>
                            </TableHeader>
                            <TableBody>
                                {employees.data.length > 0 ? (
                                    employees.data.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="w-10 pl-6">
                                                <Checkbox
                                                    checked={selectedIds.has(employee.id)}
                                                    onCheckedChange={() => toggleOne(employee.id)}
                                                    aria-label={`Select ${employee.full_name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="py-4">
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
                                                        <div className="text-xs font-medium text-muted-foreground">
                                                            {employee.national_id || 'No national ID'}
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
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        Occu: {'   '}
                                                        <Badge color=''>
                                                            {employee.occupation ||
                                                                'No occupation'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm font-medium text-muted-foreground">
                                                    <div>
                                                        {employee.email ||
                                                            employee.user
                                                                ?.email ||
                                                            'No email linked'}
                                                    </div>
                                                    <div>
                                                        {employee.contact_number ||
                                                            employee.alt_phone_number ||
                                                            'No phone number'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-transparent bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground shadow-none"
                                                    >
                                                        {employee.pay_point ||
                                                            'Not Set'}
                                                    </Badge>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {[
                                                            employee.gender,
                                                            employee.marital_status,
                                                            employee.nationality,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' • ') ||
                                                            'No profile details'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium text-foreground">
                                                    {calcAge(employee.date_of_birth) !== null ? calcAge(employee.date_of_birth) : '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {employee.educational_level ? (
                                                    <Badge variant="secondary" className="border-transparent bg-muted font-medium text-foreground shadow-none">
                                                        {employee.educational_level}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* View Detailed Page Action */}
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
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
                                                            className="h-8 w-8 bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
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
                                                            className="h-8 w-8 bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
                                    <IndexTableEmptyRow colSpan={8}>
                                        No employees match the current filters.
                                    </IndexTableEmptyRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <IndexTablePagination
                        pagination={employees}
                        filters={filters}
                        path="/employees"
                        label="employees"
                    />
                </Card>
            </div>

            {/* Export Alert Dialog */}
            <AlertDialog open={showExportDialog} onOpenChange={(open) => !isExporting && setShowExportDialog(open)}>
                <AlertDialogContent className="sm:max-w-[440px]">
                    <AlertDialogHeader>
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            {isExporting ? (
                                <Loader2 className="h-6 w-6 animate-spin text-foreground" />
                            ) : (
                                <FileDown className="h-6 w-6 text-foreground" />
                            )}
                        </div>
                        <AlertDialogTitle className="text-xl font-extrabold text-foreground">
                            {isExporting ? 'Preparing download…' : `Export ${selectedIds.size} employee${selectedIds.size !== 1 ? 's' : ''}?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                            {isExporting
                                ? 'Generating your Excel file. This may take a moment.'
                                : 'This will generate an Excel file with two sheets — employee data and a summary breakdown by department, gender, education level, and pay point. The file will include the time and author of the export.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel className="h-11 border-border font-bold" disabled={isExporting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleExport}
                            className="h-11 font-bold"
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Downloading…
                                </>
                            ) : (
                                <>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Download Excel
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
