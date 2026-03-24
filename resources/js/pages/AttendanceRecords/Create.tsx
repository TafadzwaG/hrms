import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    Info,
    LifeBuoy,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function AttendanceRecordCreate() {
    const { module } = usePage().props as any;

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        work_date: '2023-10-05',
        clock_in: '',
        clock_out: '',
        break_duration: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(`${API}/${module?.slug || 'attendance-records'}`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Helper for the visual calendar mock
    const renderCalendarGrid = () => {
        const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        const dates = [
            // Empty slots for visual alignment
            [null, null, null, 1, 2, 3, 4],
            [5, 6, 7, 8, 9, 10, 11],
            [12, 13, 14, 15, 16, 17, 18],
            [19, 20, 21, 22, 23, 24, 25],
            [26, 27, 28, 29, 30, 31, null],
        ];

        return (
            <div className="w-full select-none">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between px-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-[11px] font-bold tracking-widest text-foreground uppercase">
                        October 2023
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Days row */}
                <div className="mb-3 grid grid-cols-7 text-center">
                    {days.map((day) => (
                        <div
                            key={day}
                            className="text-[10px] font-bold tracking-wider text-muted-foreground"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Dates grid */}
                <div className="grid gap-y-2">
                    {dates.map((week, wIdx) => (
                        <div
                            key={wIdx}
                            className="grid grid-cols-7 text-center"
                        >
                            {week.map((date, dIdx) => {
                                if (!date) return <div key={`empty-${dIdx}`} />;

                                const isSelected =
                                    data.work_date ===
                                    `2023-10-${date.toString().padStart(2, '0')}`;

                                return (
                                    <div
                                        key={date}
                                        className="flex justify-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    'work_date',
                                                    `2023-10-${date.toString().padStart(2, '0')}`,
                                                )
                                            }
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-foreground hover:bg-muted'
                                            }`}
                                        >
                                            {date}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Attendance',
                    href: `${API}/${module?.slug || 'attendance-records'}`,
                },
                { title: 'Create Record', href: '#' },
            ]}
        >
            <Head title="Create Attendance Record" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* LEFT SIDEBAR: Guidelines & Notice */}
                    <div className="w-full shrink-0 space-y-6 lg:w-64 xl:w-72">
                        <Card className="border-border shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-bold">
                                    Quick Check
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Time Entry Guidelines
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1 p-2 pt-0">
                                <Button
                                    variant="secondary"
                                    className="w-full justify-start bg-primary/10 font-semibold text-primary shadow-none hover:bg-primary/20"
                                >
                                    <Info className="mr-3 h-4 w-4" />
                                    Rules Overview
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-medium text-muted-foreground hover:text-foreground"
                                >
                                    <Clock className="mr-3 h-4 w-4" />
                                    Overtime Policy
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-medium text-muted-foreground hover:text-foreground"
                                >
                                    <Coffee className="mr-3 h-4 w-4" />
                                    Break Periods
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-medium text-muted-foreground hover:text-foreground"
                                >
                                    <CalendarIcon className="mr-3 h-4 w-4" />
                                    Holiday Calendar
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-medium text-muted-foreground hover:text-foreground"
                                >
                                    <LifeBuoy className="mr-3 h-4 w-4" />
                                    Contact Support
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                            <h4 className="mb-3 text-[11px] font-bold tracking-widest text-primary uppercase">
                                Notice
                            </h4>
                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                Attendance records submitted manually are
                                flagged for manager approval. Please ensure all
                                timestamps are accurate to prevent payroll
                                delays.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT MAIN CONTENT: Form */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Create Attendance Record
                            </h1>
                            <p className="mt-2 text-base text-muted-foreground">
                                Manually record employee clock-in and clock-out
                                times for audit purposes.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                                {/* Row 1: Employee & Times */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Select Employee
                                    </Label>
                                    <Select
                                        value={data.employee_id}
                                        onValueChange={(val) =>
                                            setData('employee_id', val)
                                        }
                                    >
                                        <SelectTrigger
                                            className={`h-12 bg-background ${errors.employee_id ? 'border-destructive' : ''}`}
                                        >
                                            <SelectValue placeholder="Search and select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Alex Rivera (EMP-2049)
                                            </SelectItem>
                                            <SelectItem value="2">
                                                Sarah Jenkins (EMP-9021)
                                            </SelectItem>
                                            <SelectItem value="3">
                                                Marcus Aurelius (EMP-1001)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.employee_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Clock-In Time
                                        </Label>
                                        <Input
                                            type="time"
                                            value={data.clock_in}
                                            onChange={(e) =>
                                                setData(
                                                    'clock_in',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-12 bg-background ${errors.clock_in ? 'border-destructive' : ''}`}
                                        />
                                        {errors.clock_in && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors.clock_in}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Clock-Out Time
                                        </Label>
                                        <Input
                                            type="time"
                                            value={data.clock_out}
                                            onChange={(e) =>
                                                setData(
                                                    'clock_out',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-12 bg-background ${errors.clock_out ? 'border-destructive' : ''}`}
                                        />
                                        {errors.clock_out && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors.clock_out}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Date & Notes */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Work Date
                                    </Label>
                                    <Card className="border bg-background shadow-sm">
                                        <CardContent className="p-6">
                                            {renderCalendarGrid()}
                                        </CardContent>
                                    </Card>
                                    {errors.work_date && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.work_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Break Duration (Minutes)
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 60"
                                            value={data.break_duration}
                                            onChange={(e) =>
                                                setData(
                                                    'break_duration',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 bg-background"
                                        />
                                    </div>
                                    <div className="flex h-[calc(100%-80px)] flex-1 flex-col space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Notes & Remarks
                                        </Label>
                                        <Textarea
                                            placeholder="Provide reason for manual entry (e.g. technical issue, forgot to clock in)..."
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            className={`min-h-[160px] flex-1 resize-none bg-background ${errors.notes ? 'border-destructive' : ''}`}
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 px-6 font-semibold"
                                    onClick={() =>
                                        router.visit(
                                            `${API}/${module?.slug || 'attendance-records'}`,
                                        )
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-11 px-8 font-semibold shadow-sm"
                                    disabled={processing || isSubmitting}
                                >
                                    {processing || isSubmitting
                                        ? 'Creating...'
                                        : 'Create Record'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
