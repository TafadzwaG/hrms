import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Eye,
    Plus,
    Save,
    Search,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
                { search },
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
                <Badge className="border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Late Arrival
                </Badge>
            );
        }

        if (value.includes('missing')) {
            return (
                <Badge className="border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-100">
                    Missing Clock Out
                </Badge>
            );
        }

        if (value.includes('over')) {
            return (
                <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Overtime
                </Badge>
            );
        }

        return (
            <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
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

    const handlePageChange = (page: number) => {
        router.get(
            `${API}/${module.slug}`,
            { page, search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const footerFrom = useMemo(() => {
        if (records.from) return records.from;
        return pageData.length > 0
            ? (records.current_page - 1) * records.per_page + 1
            : 0;
    }, [records, pageData.length]);

    const footerTo = useMemo(() => {
        if (records.to) return records.to;
        return pageData.length > 0 ? footerFrom + pageData.length - 1 : 0;
    }, [records, footerFrom, pageData.length]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Attendance', href: `${API}/${module.slug}` },
            ]}
        >
            <Head title="Attendance Records" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-background p-4 md:p-8">
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
                            className="h-10 justify-between gap-2 border-slate-200 bg-white font-medium"
                        >
                            <span className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-slate-500" />
                                Date Range: Oct 1 - Oct 31
                            </span>
                        </Button>

                        <Select
                            value={exceptionFilter}
                            onValueChange={setExceptionFilter}
                        >
                            <SelectTrigger className="h-10 w-[180px] border-slate-200 bg-white font-medium">
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
                            <SelectTrigger className="h-10 w-[220px] border-slate-200 bg-white font-medium">
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

                        <div className="hidden h-6 w-px bg-slate-200 md:block" />

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
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search records..."
                                    className="h-10 border-slate-200 bg-slate-50 pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[1100px]">
                                <TableHeader>
                                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                                        <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Employee
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Date
                                        </TableHead>
                                        <TableHead className="w-36 px-4 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Clock In
                                        </TableHead>
                                        <TableHead className="w-36 px-4 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Clock Out
                                        </TableHead>
                                        <TableHead className="w-28 px-4 py-4 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Mins Worked
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pageData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-40 text-center text-muted-foreground"
                                            >
                                                No attendance records found.
                                            </TableCell>
                                        </TableRow>
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
                                                    className="transition-colors hover:bg-slate-50/50"
                                                >
                                                    <TableCell className="px-6 py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                {getInitials(
                                                                    name,
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-slate-900">
                                                                    {name}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {
                                                                        staffNumber
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3 text-sm whitespace-nowrap text-slate-600">
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
                                                            className="h-9 border-slate-200 bg-white text-center text-sm font-medium text-slate-700"
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
                                                                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                                                                    : 'border-slate-200 bg-white text-slate-700'
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
                                                            className="h-9 border-slate-200 bg-slate-50 text-center text-sm text-slate-600"
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
                                                                className="h-8 w-8 text-slate-400 hover:text-slate-700"
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
                    </Card>

                    <div className="flex items-center justify-between px-2 py-6">
                        <p className="hidden text-sm text-slate-500 sm:block">
                            Showing{' '}
                            <span className="font-semibold">{footerFrom}</span>{' '}
                            to <span className="font-semibold">{footerTo}</span>{' '}
                            of{' '}
                            <span className="font-semibold">
                                {records.total}
                            </span>{' '}
                            records
                        </p>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-slate-200"
                                disabled={(records.current_page ?? 1) <= 1}
                                onClick={() =>
                                    handlePageChange(records.current_page - 1)
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                className="h-9 w-9 bg-primary text-sm font-bold text-white hover:bg-primary/90"
                                size="icon"
                            >
                                {records.current_page}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-sm font-medium text-slate-600"
                                disabled={
                                    (records.current_page ?? 1) >=
                                    (records.last_page ?? 1)
                                }
                                onClick={() =>
                                    handlePageChange(records.current_page + 1)
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <footer className="mt-6 border-t border-slate-200 bg-white px-10 py-6 text-center">
                        <p className="text-sm text-slate-500">
                            © 2023 Providence HRMS. All rights reserved.
                        </p>
                    </footer>
                </div>
            </div>
        </AppLayout>
    );
}
