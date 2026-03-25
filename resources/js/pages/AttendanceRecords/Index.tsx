import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Edit3,
    Eye,
    Plus,
    Save,
    Search,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import {
    IndexTableCard,
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildIndexParams } from '@/lib/index-table';
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

type Employee = {
    id: number;
    full_name?: string;
    first_name?: string;
    middle_name?: string;
    surname?: string;
    staff_number?: string;
};

type AttendanceRecord = {
    id: number;
    employee_id?: number | null;
    employee?: Employee | null;
    work_date?: string | null;
    clock_in?: string | null;
    clock_out?: string | null;
    minutes_worked?: number | string | null;
    exception_status?: string | null;
    notes?: string | null;
    [key: string]: any;
};

type PaginatedRecords = {
    data: AttendanceRecord[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number;
    to?: number;
};

type PageProps = {
    module: {
        slug: string;
        name: string;
        description?: string;
    };
    records: PaginatedRecords;
    filters: {
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
};

export default function AttendanceRecordsIndex() {
    const { module, records, filters } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters?.search ?? '');
    const [exceptionFilter, setExceptionFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('engineering');
    const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
    const [drafts, setDrafts] = useState<Record<number, AttendanceRecord>>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `${API}/${module.slug}`,
                buildIndexParams(filters, { search }),
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, module.slug]);

    const pageData = records?.data ?? [];

    const getEmployeeName = (record: AttendanceRecord) => {
        if (record.employee?.full_name) return record.employee.full_name;

        const composed = [
            record.employee?.first_name,
            record.employee?.middle_name,
            record.employee?.surname,
        ]
            .filter(Boolean)
            .join(' ')
            .trim();

        if (composed) return composed;

        return (
            record.employee_name ||
            record.name ||
            `Employee #${record.employee_id ?? record.id}`
        );
    };

    const getEmployeeStaffNumber = (record: AttendanceRecord) =>
        record.employee?.staff_number || 'No staff no.';

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

    const getAttendanceDate = (record: AttendanceRecord) =>
        record.work_date ||
        record.attendance_date ||
        record.date ||
        record.record_date ||
        '';

    const formatDate = (value: string) =>
        value ? moment(value).format('MMM DD, YYYY') : '—';

    const normalizeTimeDisplay = (value: string | null | undefined) => {
        if (!value) return '--';

        if (moment(value).isValid()) {
            return moment(value).format('hh:mm A');
        }

        const formats = ['HH:mm:ss', 'HH:mm', 'h:mm A', 'hh:mm A'];
        for (const fmt of formats) {
            const parsed = moment(value, fmt, true);
            if (parsed.isValid()) {
                return parsed.format('hh:mm A');
            }
        }

        return value;
    };

    const parseTimeToMinutes = (value: string | null | undefined) => {
        if (!value || value === '--') return null;

        if (moment(value).isValid()) {
            const parsed = moment(value);
            return parsed.hours() * 60 + parsed.minutes();
        }

        const formats = ['hh:mm A', 'h:mm A', 'HH:mm', 'HH:mm:ss'];
        for (const fmt of formats) {
            const parsed = moment(value, fmt, true);
            if (parsed.isValid()) {
                return parsed.hours() * 60 + parsed.minutes();
            }
        }

        return null;
    };

    const computeWorkedMinutes = (
        clockIn?: string | null,
        clockOut?: string | null,
    ) => {
        const start = parseTimeToMinutes(clockIn);
        const end = parseTimeToMinutes(clockOut);

        if (start === null || end === null || end < start) return '--';
        return String(end - start);
    };

    const getDraftValue = (record: AttendanceRecord, key: string) => {
        if (drafts[record.id]?.[key] !== undefined) {
            return drafts[record.id][key];
        }

        if (key === 'clock_in') return normalizeTimeDisplay(record.clock_in);
        if (key === 'clock_out') return normalizeTimeDisplay(record.clock_out);
        if (key === 'minutes_worked') {
            return (
                record.minutes_worked ??
                computeWorkedMinutes(
                    normalizeTimeDisplay(record.clock_in),
                    normalizeTimeDisplay(record.clock_out),
                )
            );
        }
        if (key === 'exception_status') {
            return record.exception_status ?? getStatus(record);
        }

        return record[key];
    };

    const getStatus = (record: AttendanceRecord) => {
        const raw =
            drafts[record.id]?.exception_status ??
            record.exception_status ??
            '';

        if (String(raw).trim() !== '') return String(raw);

        const clockIn = String(getDraftValue(record, 'clock_in') ?? '');
        const clockOut = String(getDraftValue(record, 'clock_out') ?? '');

        if (!clockOut || clockOut === '--') return 'Missing Clock Out';

        const start = parseTimeToMinutes(clockIn);
        if (start !== null && start > 9 * 60) return 'Late Arrival';

        const mins = getDraftValue(record, 'minutes_worked');
        if (mins !== '--' && Number(mins) > 540) return 'Overtime';

        return 'Regular';
    };

    const getStatusBadge = (status: string) => {
        const value = status.toLowerCase();

        if (value.includes('late')) {
            return (
                <Badge variant="warning">
                    Late Arrival
                </Badge>
            );
        }

        if (value.includes('missing')) {
            return (
                <Badge variant="danger">
                    Missing Clock Out
                </Badge>
            );
        }

        if (value.includes('over')) {
            return (
                <Badge variant="info">
                    Overtime
                </Badge>
            );
        }

        return (
            <Badge variant="success">
                Regular
            </Badge>
        );
    };

    const startEdit = (record: AttendanceRecord) => {
        setEditingRows((prev) => ({ ...prev, [record.id]: true }));
        setDrafts((prev) => ({
            ...prev,
            [record.id]: {
                ...record,
                clock_in: normalizeTimeDisplay(record.clock_in),
                clock_out: normalizeTimeDisplay(record.clock_out),
                minutes_worked:
                    record.minutes_worked ??
                    computeWorkedMinutes(
                        normalizeTimeDisplay(record.clock_in),
                        normalizeTimeDisplay(record.clock_out),
                    ),
                exception_status: record.exception_status ?? '',
            },
        }));
    };

    const updateDraft = (
        record: AttendanceRecord,
        key: string,
        value: string,
    ) => {
        setDrafts((prev) => {
            const next = {
                ...prev,
                [record.id]: {
                    ...(prev[record.id] ?? record),
                    [key]: value,
                },
            };

            const clockIn = next[record.id].clock_in;
            const clockOut = next[record.id].clock_out;
            next[record.id].minutes_worked = computeWorkedMinutes(
                clockIn,
                clockOut,
            );

            return next;
        });
    };

    const saveRow = (record: AttendanceRecord) => {
        const originalOrDraft = drafts[record.id] ?? record;

        const payload = {
            employee_id: record.employee_id,
            work_date: record.work_date,
            clock_in:
                originalOrDraft.clock_in === '--'
                    ? null
                    : originalOrDraft.clock_in,
            clock_out:
                originalOrDraft.clock_out === '--'
                    ? null
                    : originalOrDraft.clock_out,
            minutes_worked:
                originalOrDraft.minutes_worked === '--'
                    ? null
                    : originalOrDraft.minutes_worked,
            exception_status:
                originalOrDraft.exception_status || getStatus(record),
            notes: record.notes ?? null,
        };

        router.put(`${API}/${module.slug}/${record.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingRows((prev) => ({ ...prev, [record.id]: false }));
            },
        });
    };

    const handleView = (record: AttendanceRecord) => {
        router.visit(`${API}/${module.slug}/${record.id}`);
    };

    const tableFilters = useMemo(
        () => ({
            ...filters,
            search,
        }),
        [filters, search],
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Attendance', href: `${API}/${module.slug}` },
            ]}
        >
            <Head title="Attendance Records" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-8">
                <div className="w-full">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Attendance Records
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Manage and track employee daily presence and
                                time logs.
                            </p>
                        </div>

                        <Button
                            className="gap-2 font-bold"
                            onClick={() =>
                                router.visit(`${API}/${module.slug}/create`)
                            }
                        >
                            <Plus className="h-4 w-4" />
                            Manual Entry
                        </Button>
                    </div>

                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-10 justify-between gap-2 font-medium shadow-sm"
                        >
                            <span className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                Date Range: Oct 1 - Oct 31
                            </span>
                        </Button>

                        <Select
                            value={exceptionFilter}
                            onValueChange={setExceptionFilter}
                        >
                            <SelectTrigger className="h-10 w-[180px] bg-background font-medium shadow-sm">
                                <SelectValue placeholder="Exception: All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Exception: All
                                </SelectItem>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="late">
                                    Late Arrival
                                </SelectItem>
                                <SelectItem value="missing">
                                    Missing Clock Out
                                </SelectItem>
                                <SelectItem value="overtime">
                                    Overtime
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={departmentFilter}
                            onValueChange={setDepartmentFilter}
                        >
                            <SelectTrigger className="h-10 w-[220px] bg-background font-medium shadow-sm">
                                <SelectValue placeholder="Department: Engineering" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="engineering">
                                    Department: Engineering
                                </SelectItem>
                                <SelectItem value="hr">
                                    Department: HR
                                </SelectItem>
                                <SelectItem value="payroll">
                                    Department: Payroll
                                </SelectItem>
                                <SelectItem value="operations">
                                    Department: Operations
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="hidden h-6 w-px bg-border md:block" />

                        <Button
                            variant="link"
                            className="px-0 font-semibold text-primary"
                            onClick={() => {
                                setExceptionFilter('all');
                                setDepartmentFilter('engineering');
                            }}
                        >
                            Clear Filters
                        </Button>

                        <div className="ml-auto w-full max-w-64 sm:w-auto">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search records..."
                                    className="h-10 bg-background pl-9 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <IndexTableCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[1100px]">
                                <TableHeader>
                                    <IndexTableHeaderRow>
                                        <SortableTableHead
                                            path={`${API}/${module.slug}`}
                                            filters={tableFilters}
                                            sortKey="employee"
                                            className="px-6 py-4"
                                        >
                                            Employee
                                        </SortableTableHead>
                                        <SortableTableHead
                                            path={`${API}/${module.slug}`}
                                            filters={tableFilters}
                                            sortKey="work_date"
                                            className="px-6 py-4"
                                        >
                                            Date
                                        </SortableTableHead>
                                        <SortableTableHead
                                            path={`${API}/${module.slug}`}
                                            filters={tableFilters}
                                            sortKey="clock_in"
                                            className="w-36 px-4 py-4"
                                        >
                                            Clock In
                                        </SortableTableHead>
                                        <SortableTableHead
                                            path={`${API}/${module.slug}`}
                                            filters={tableFilters}
                                            sortKey="clock_out"
                                            className="w-36 px-4 py-4"
                                        >
                                            Clock Out
                                        </SortableTableHead>
                                        <SortableTableHead
                                            path={`${API}/${module.slug}`}
                                            filters={tableFilters}
                                            sortKey="minutes_worked"
                                            className="w-28 px-4 py-4"
                                            align="center"
                                        >
                                            Mins Worked
                                        </SortableTableHead>
                                        <SortableTableHead
                                            path={`${API}/${module.slug}`}
                                            filters={tableFilters}
                                            sortKey="exception_status"
                                            className="px-6 py-4"
                                        >
                                            Status
                                        </SortableTableHead>
                                        <IndexTableHead align="right" className="px-6 py-4">
                                            Actions
                                        </IndexTableHead>
                                    </IndexTableHeaderRow>
                                </TableHeader>

                                <TableBody>
                                    {pageData.length === 0 ? (
                                        <IndexTableEmptyRow colSpan={7}>
                                            No attendance records found.
                                        </IndexTableEmptyRow>
                                    ) : (
                                        pageData.map((record) => {
                                            const name =
                                                getEmployeeName(record);
                                            const staffNumber =
                                                getEmployeeStaffNumber(record);
                                            const status = getStatus(record);
                                            const isEditing =
                                                editingRows[record.id] ?? true;

                                            return (
                                                <TableRow
                                                    key={record.id}
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    <TableCell className="px-6 py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                {getInitials(
                                                                    name,
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-foreground">
                                                                    {name}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {
                                                                        staffNumber
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3 text-sm whitespace-nowrap text-muted-foreground">
                                                        {formatDate(
                                                            getAttendanceDate(
                                                                record,
                                                            ),
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                                        <Input
                                                            value={String(
                                                                getDraftValue(
                                                                    record,
                                                                    'clock_in',
                                                                ) ?? '',
                                                            )}
                                                            onChange={(e) =>
                                                                updateDraft(
                                                                    record,
                                                                    'clock_in',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !isEditing
                                                            }
                                                            className="h-9 border-border/50 bg-background text-center text-sm font-medium text-foreground"
                                                        />
                                                    </TableCell>

                                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                                        <Input
                                                            value={String(
                                                                getDraftValue(
                                                                    record,
                                                                    'clock_out',
                                                                ) ?? '',
                                                            )}
                                                            onChange={(e) =>
                                                                updateDraft(
                                                                    record,
                                                                    'clock_out',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !isEditing
                                                            }
                                                            className={`h-9 text-center text-sm font-medium ${
                                                                String(
                                                                    getDraftValue(
                                                                        record,
                                                                        'clock_out',
                                                                    ) ?? '',
                                                                ) === '--' ||
                                                                status
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        'missing',
                                                                    )
                                                                    ? 'border-destructive/40 bg-destructive/5 text-destructive'
                                                                    : 'border-border/50 bg-background text-foreground'
                                                            }`}
                                                        />
                                                    </TableCell>

                                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                                        <Input
                                                            readOnly
                                                            value={String(
                                                                getDraftValue(
                                                                    record,
                                                                    'minutes_worked',
                                                                ) ?? '--',
                                                            )}
                                                            className="h-9 border-border/50 bg-muted/20 text-center text-sm text-muted-foreground"
                                                        />
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3 whitespace-nowrap">
                                                        {getStatusBadge(status)}
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() =>
                                                                    handleView(
                                                                        record,
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                className="h-8 px-3 text-xs font-bold"
                                                                onClick={() =>
                                                                    saveRow(
                                                                        record,
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <Save className="mr-1 h-3.5 w-3.5" />
                                                                Save
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                onClick={() =>
                                                                    startEdit(
                                                                        record,
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <Edit3 className="h-4 w-4" />
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
                        <IndexTablePagination
                            pagination={records}
                            filters={tableFilters}
                            path={`${API}/${module.slug}`}
                            label="records"
                        />
                    </IndexTableCard>

                    <footer className="mt-6 border-t border-border/50 bg-background px-10 py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            © 2023 Providence HRMS. All rights reserved.
                        </p>
                    </footer>
                </div>
            </div>
        </AppLayout>
    );
}
