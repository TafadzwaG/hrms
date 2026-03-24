import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart2,
    BookOpen,
    Calendar as CalendarIcon,
    Info,
    UploadCloud,
} from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

export default function LeaveRequestCreate() {
    const { module } = usePage().props as any;

    const { data, setData, post, processing } = useForm({
        employee_id: 'Marcus Aurelius (Admin)',
        department: 'Engineering',
        leave_type: 'Annual Leave',
        start_date: '',
        end_date: '',
        reason: '',
        attachment: null as File | null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper to calculate approximate weekdays
    const calculateDays = (start: string, end: string) => {
        if (!start || !end) return 0;
        const startDate = moment(start);
        const endDate = moment(end);
        if (endDate.isBefore(startDate)) return 0;

        let days = 0;
        let current = startDate.clone();
        while (current.isSameOrBefore(endDate)) {
            // Skip weekends
            if (current.isoWeekday() !== 6 && current.isoWeekday() !== 7) {
                days++;
            }
            current.add(1, 'days');
        }
        return days;
    };

    const requestedDays = useMemo(
        () => calculateDays(data.start_date, data.end_date),
        [data.start_date, data.end_date],
    );

    const currentBalance = 24.5;
    const remainingBalance = currentBalance - requestedDays;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(`${API}/${module.slug}`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Leave Management', href: `${API}/${module.slug}` },
                {
                    title: 'Apply for Leave',
                    href: `${API}/${module.slug}/create`,
                },
            ]}
        >
            <Head title="Apply for Leave" />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-8 bg-muted/10 p-4 md:p-8">
                {/* Top Header */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Apply for Leave
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Plan your time off effortlessly with our chronological
                        request process.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid w-full grid-cols-1 gap-8 pb-24 lg:grid-cols-12"
                >
                    {/* LEFT COLUMN: Form Steps Timeline */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        {/* Step 1: Employee Info */}
                        <div className="relative flex gap-6 pb-12">
                            {/* Connecting Line */}
                            <div className="absolute top-10 bottom-0 left-4 w-px -translate-x-1/2 bg-border md:left-5"></div>

                            <div className="mt-0.5 shrink-0">
                                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm md:h-10 md:w-10">
                                    1
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl font-bold tracking-tight">
                                    Employee Information
                                </h2>
                                <Card className="shadow-sm">
                                    <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Employee Name
                                            </Label>
                                            <Select
                                                value={data.employee_id}
                                                onValueChange={(val) =>
                                                    setData('employee_id', val)
                                                }
                                            >
                                                <SelectTrigger className="h-11 bg-background">
                                                    <SelectValue placeholder="Select employee" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Marcus Aurelius (Admin)">
                                                        Marcus Aurelius (Admin)
                                                    </SelectItem>
                                                    <SelectItem value="Sarah Jenkins">
                                                        Sarah Jenkins
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Department
                                            </Label>
                                            <Input
                                                value={data.department}
                                                readOnly
                                                className="h-11 cursor-not-allowed bg-muted/50 text-muted-foreground"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Step 2: Leave Details */}
                        <div className="relative flex gap-6 pb-12">
                            {/* Connecting Line */}
                            <div className="absolute top-10 bottom-0 left-4 w-px -translate-x-1/2 bg-border md:left-5"></div>

                            <div className="mt-0.5 shrink-0">
                                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm md:h-10 md:w-10">
                                    2
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl font-bold tracking-tight">
                                    Leave Details
                                </h2>
                                <Card className="shadow-sm">
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Leave Type
                                            </Label>
                                            <Select
                                                value={data.leave_type}
                                                onValueChange={(val) =>
                                                    setData('leave_type', val)
                                                }
                                            >
                                                <SelectTrigger className="h-11 bg-background">
                                                    <SelectValue placeholder="Select leave type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Annual Leave">
                                                        Annual Leave
                                                    </SelectItem>
                                                    <SelectItem value="Sick Leave">
                                                        Sick Leave
                                                    </SelectItem>
                                                    <SelectItem value="Unpaid Leave">
                                                        Unpaid Leave
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Start Date
                                                </Label>
                                                <div className="relative">
                                                    <CalendarIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                'start_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    End Date
                                                </Label>
                                                <div className="relative">
                                                    <CalendarIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="date"
                                                        value={data.end_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                'end_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 bg-background pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Step 3: Reason & Documentation */}
                        <div className="relative flex gap-6">
                            {/* No connecting line on the last step */}
                            <div className="mt-0.5 shrink-0">
                                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm md:h-10 md:w-10">
                                    3
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl font-bold tracking-tight">
                                    Reason & Documentation
                                </h2>
                                <Card className="shadow-sm">
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Reason for Leave
                                            </Label>
                                            <Textarea
                                                placeholder="Briefly describe why you are taking this leave..."
                                                value={data.reason}
                                                onChange={(e) =>
                                                    setData(
                                                        'reason',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[120px] resize-none bg-background text-base"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Attachments
                                            </Label>
                                            <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 px-6 py-8 transition-colors hover:bg-muted/30">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                    <UploadCloud className="h-5 w-5" />
                                                </div>
                                                <p className="mt-3 text-sm font-semibold text-foreground">
                                                    Upload medical certificate
                                                    or supporting docs
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    PDF, JPG up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Live Summary Widget */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <Card className="sticky top-6 shadow-sm">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <BarChart2 className="h-5 w-5 text-primary" />
                                    Live Leave Summary
                                </CardTitle>
                                <CardDescription className="mt-1 text-[10px] font-bold tracking-wider uppercase">
                                    Real-time balance projection
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Selected Dates */}
                                <div className="border-b p-6">
                                    <p className="mb-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Selected Dates
                                    </p>
                                    <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            {data.start_date && data.end_date
                                                ? `${moment(data.start_date).format('MMM DD')} — ${moment(data.end_date).format('MMM DD, YYYY')}`
                                                : 'No dates selected'}
                                        </div>
                                        <div className="text-sm font-bold text-primary">
                                            {requestedDays} Days
                                        </div>
                                    </div>
                                    <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <Info className="h-3.5 w-3.5" />
                                        Excludes weekends (Sat, Sun)
                                    </p>
                                </div>

                                {/* Balance Impact */}
                                <div className="p-6">
                                    <p className="mb-4 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Balance Impact
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-muted-foreground">
                                                Current Annual Balance
                                            </span>
                                            <span className="font-bold">
                                                {currentBalance} Days
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-primary">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                Days Requested
                                            </span>
                                            <span className="font-bold">
                                                - {requestedDays.toFixed(1)}{' '}
                                                Days
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between border-t pt-3">
                                            <span className="text-base font-bold">
                                                Remaining Balance
                                            </span>
                                            <span className="text-xl font-extrabold">
                                                {remainingBalance.toFixed(1)}{' '}
                                                <span className="text-sm font-semibold text-muted-foreground">
                                                    Days
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Warning Box */}
                                    <div className="mt-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                        <p className="text-xs leading-relaxed font-medium">
                                            Selecting "{data.leave_type}" will
                                            consume your paid time off pool.
                                            Ensure your reason matches the
                                            policy.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center border-t bg-muted/20 p-4">
                                <Button
                                    variant="link"
                                    className="text-xs font-bold text-primary hover:no-underline"
                                    type="button"
                                >
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    View Leave Policy Details
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Bottom Actions */}
                    <div className="col-span-1 mt-4 flex items-center justify-end gap-6 lg:col-span-12">
                        <Button
                            type="button"
                            variant="ghost"
                            className="font-bold"
                            onClick={() =>
                                router.visit(`${API}/${module.slug}`)
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            className="px-8 font-bold shadow-sm"
                            disabled={processing || isSubmitting}
                        >
                            {processing || isSubmitting
                                ? 'Submitting...'
                                : 'Submit Leave Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
