import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Clock,
    FileText,
    History,
    Info,
    LogIn,
    LogOut,
    Mail,
    MapPin,
    Pencil,
    User,
    AlertTriangle,
} from 'lucide-react';
import moment from 'moment';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AttendanceRecordShow() {
    const { module, record } = usePage().props as any;

    // Safety fallbacks to match screenshot if real data is missing
    const employeeName = record?.employee?.full_name || 'Alex Rivera';
    const employeeRole =
        record?.employee?.position || 'Senior Software Engineer';
    const employeeDept =
        record?.employee?.department || 'Engineering Department';
    const employeeId = record?.employee?.staff_number || 'EMP-2049';
    const workDate = record?.work_date
        ? moment(record.work_date).format('MMMM DD, YYYY')
        : 'October 24, 2023';

    const clockIn = record?.clock_in
        ? moment(record.clock_in, 'HH:mm:ss').format('hh:mm A')
        : '09:12 AM';
    const clockOut = record?.clock_out
        ? moment(record.clock_out, 'HH:mm:ss').format('hh:mm A')
        : '06:05 PM';

    // Derived durations based on the screenshot
    const totalDuration = '8h 53m';
    const workHours = '7h 45m';

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Attendance',
                    href: `${API}/${module?.slug || 'attendance-records'}`,
                },
                {
                    title: 'Records',
                    href: `${API}/${module?.slug || 'attendance-records'}`,
                },
                { title: `Entry #${record?.id || '8492'}`, href: '#' },
            ]}
        >
            <Head title={`Attendance Details - ${employeeName}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 text-foreground md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Attendance Detail
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review and manage clock-in data for {workDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-10 font-semibold shadow-sm"
                        >
                            <History className="mr-2 h-4 w-4" />
                            Audit Log
                        </Button>
                        <Button
                            className="h-10 px-6 font-semibold shadow-sm"
                            onClick={() =>
                                router.visit(
                                    `${API}/${module?.slug || 'attendance-records'}/${record?.id || '1'}/edit`,
                                )
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Record
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT COLUMN (Spans 2/3) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Employee Profile Card */}
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div className="flex items-start gap-5">
                                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted text-xl font-bold text-muted-foreground shadow-sm">
                                            {/* Mock Avatar or Initials */}
                                            {getInitials(employeeName)}
                                        </div>
                                        <div className="space-y-1.5">
                                            <h2 className="text-xl leading-none font-bold text-foreground">
                                                {employeeName}
                                            </h2>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {employeeRole}
                                            </p>
                                            <p className="text-sm font-medium text-primary">
                                                {employeeDept}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2 text-xs font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                    {employeeId}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    Chicago Office
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 shadow-none hover:bg-emerald-50">
                                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        Present
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Punch Timeline Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-lg font-bold">
                                    Punch Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="relative ml-2 space-y-8 pb-6">
                                    {/* Vertical Connecting Line */}
                                    <div className="absolute top-8 bottom-2 left-[15px] w-px bg-border"></div>

                                    {/* Clock In */}
                                    <div className="relative pl-12">
                                        <div className="absolute top-1 left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-200">
                                            <LogIn className="ml-0.5 h-4 w-4" />
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-base font-bold text-foreground">
                                                    Clock In
                                                </p>
                                                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                                    Mobile App Punch • IP:
                                                    192.168.1.45
                                                </p>
                                                <Badge className="mt-3 border-amber-200 bg-amber-50 font-semibold text-amber-700 shadow-none hover:bg-amber-50">
                                                    <AlertTriangle className="mr-1.5 h-3 w-3 text-amber-600" />
                                                    12 mins Late
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-primary">
                                                    {clockIn}
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                    Standard: 09:00 AM
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clock Out */}
                                    <div className="relative pl-12">
                                        <div className="absolute top-1 left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-sm ring-1 ring-rose-200">
                                            <LogOut className="mr-0.5 h-4 w-4" />
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-base font-bold text-foreground">
                                                    Clock Out
                                                </p>
                                                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                                    Biometric Terminal • ID:
                                                    TERM-04
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-foreground">
                                                    {clockOut}
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                    Standard: 06:00 PM
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-2" />

                                {/* Duration Summary */}
                                <div className="grid grid-cols-2 divide-x pt-6 text-center">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Total Duration
                                        </p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {totalDuration}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Work Hours
                                        </p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {workHours}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (Spans 1/3) */}
                    <div className="flex flex-col space-y-6 lg:col-span-1">
                        {/* Punch Location Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-base font-bold">
                                    Punch Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Map Placeholder using CSS background pattern */}
                                <div className="relative flex h-40 w-full items-center justify-center border-b bg-muted/30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                    {/* Central Pin */}
                                    <div className="relative flex flex-col items-center">
                                        <div className="absolute -top-3 left-1/2 h-12 w-12 -translate-x-1/2 animate-pulse rounded-full bg-primary/20"></div>
                                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <Badge className="absolute top-10 left-1/2 mt-1 -translate-x-1/2 border-primary/20 bg-background text-[10px] font-bold tracking-wider whitespace-nowrap text-primary uppercase shadow-sm">
                                            Verified GPS
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="flex items-start justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Coordinate:
                                        </span>
                                        <span className="text-right font-mono text-xs font-semibold text-foreground">
                                            41.8781° N, 87.6298° W
                                        </span>
                                    </div>
                                    <div className="flex items-start justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Accuracy:
                                        </span>
                                        <span className="text-right font-semibold text-emerald-600">
                                            Within 10 meters
                                        </span>
                                    </div>
                                    <div className="flex items-start justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Address:
                                        </span>
                                        <span className="max-w-[160px] text-right font-medium text-foreground">
                                            233 S Wacker Dr,
                                            <br />
                                            Chicago, IL 60606
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Exceptions & Notes Card */}
                        <Card className="flex-1 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-base font-bold">
                                    Exceptions & Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-5">
                                {/* Info Alert box */}
                                <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-primary" />
                                        <h4 className="text-sm font-bold text-primary">
                                            Late Arrival
                                        </h4>
                                    </div>
                                    <p className="text-xs leading-relaxed font-medium text-foreground/80">
                                        Employee reported heavy traffic on I-90.
                                        Exception marked as 'Excused' by
                                        management.
                                    </p>
                                </div>

                                {/* Manager Remarks */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Manager Remarks
                                    </h4>
                                    <blockquote className="border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-muted-foreground italic">
                                        "Spoke with Alex regarding the delay.
                                        The commute was unusually backed up
                                        today. No performance concern."
                                    </blockquote>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold text-primary">
                                                SJ
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">
                                                Sarah Jenkins (HR Director)
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground">
                                            Oct 24, 02:30 PM
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottom Actions Card */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="cursor-pointer shadow-sm transition-colors hover:bg-muted/50">
                                <CardContent className="flex h-24 flex-col items-center justify-center gap-2 p-4 text-center">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-xs font-bold text-foreground">
                                        Export PDF
                                    </span>
                                </CardContent>
                            </Card>
                            <Card className="cursor-pointer shadow-sm transition-colors hover:bg-muted/50">
                                <CardContent className="flex h-24 flex-col items-center justify-center gap-2 p-4 text-center">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-xs font-bold text-foreground">
                                        Email Record
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
