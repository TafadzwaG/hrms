import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Briefcase,
    Calendar,
    Check,
    CheckCircle2,
    ChevronLeft,
    Clock,
    History,
    Mail,
    MapPin,
    MessageSquare,
    User,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function LeaveRequestApproval() {
    const { module } = usePage().props as any;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data mapped precisely to the UI elements
    const requestData = {
        id: '#48291',
        status: 'PENDING APPROVAL',
        employee: {
            name: 'Sarah Jenkins',
            role: 'Lead Product Designer',
            id: 'EMP-9021',
            department: 'Design Department',
            email: 's.jenkins@providence.io',
            location: 'London, UK (HQ)',
            initials: 'SJ',
        },
        balance: {
            left: 14,
            total: 22,
            percentage: 65,
            used_last_12m: 8,
            sick_days: 2,
            carry_over: 3,
        },
        current_request: {
            type: 'Annual Leave',
            duration: '5 Working Days',
            from: 'Oct 12, 2024',
            to: 'Oct 16, 2024',
            reason: 'Personal relaxation and family time. No specific reason required.',
        },
    };

    const handleAction = (action: 'approve' | 'deny') => {
        setIsSubmitting(true);
        console.log(`Action: ${action}`);
        setTimeout(() => setIsSubmitting(false), 1000);
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Leave Management',
                    href: `${API}/${module?.slug || 'leave'}`,
                },
                { title: `Request ${requestData.id}`, href: '#' },
            ]}
        >
            <Head title={`Approve Request ${requestData.id}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-8">
                {/* Page Header Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-sm"
                            onClick={() =>
                                router.visit(
                                    `${API}/${module?.slug || 'leave'}`,
                                )
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Review Request {requestData.id}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-destructive font-semibold text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleAction('deny')}
                            disabled={isSubmitting}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Deny Request
                        </Button>
                        <Button
                            className="px-6 font-semibold shadow-sm"
                            onClick={() => handleAction('approve')}
                            disabled={isSubmitting}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    </div>
                </div>

                {/* TOP SECTION: Profile & Balance Split Card */}
                <Card className="overflow-hidden shadow-sm">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side: Profile Info */}
                        <div className="flex-1 p-6 md:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xl font-bold text-primary">
                                    {requestData.employee.initials}
                                </div>
                                <div className="flex-1 space-y-5">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text-foreground">
                                                {requestData.employee.name}
                                            </h2>
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px] font-bold tracking-wider uppercase"
                                            >
                                                Core Team
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-base font-medium text-muted-foreground">
                                            {requestData.employee.role}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 shrink-0 text-foreground/50" />
                                            {requestData.employee.id}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 shrink-0 text-foreground/50" />
                                            {requestData.employee.department}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 shrink-0 text-foreground/50" />
                                            {requestData.employee.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 shrink-0 text-foreground/50" />
                                            {requestData.employee.location}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 font-semibold shadow-sm"
                                        >
                                            <User className="mr-2 h-3.5 w-3.5" />{' '}
                                            View Full Profile
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 font-semibold shadow-sm"
                                        >
                                            <MessageSquare className="mr-2 h-3.5 w-3.5" />{' '}
                                            Message Sarah
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Leave Balance */}
                        <div className="w-full border-t bg-muted/40 p-6 md:p-8 lg:w-[400px] lg:border-t-0 lg:border-l xl:w-[450px]">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Leave Balance
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-foreground">
                                            {requestData.balance.left}
                                        </span>
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            days left
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        {requestData.balance.percentage}% of{' '}
                                        {requestData.balance.total} days
                                        remaining
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8 space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    <span>Annual Usage (Last 12M)</span>
                                    <span>
                                        {requestData.balance.used_last_12m} Days
                                        Used
                                    </span>
                                </div>
                                <Progress
                                    value={35}
                                    className="h-2 bg-border"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 border-t pt-6">
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Sick Days
                                    </p>
                                    <p className="mt-1 text-base font-bold text-foreground">
                                        {requestData.balance.sick_days}{' '}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            days
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Carry-Over
                                    </p>
                                    <p className="mt-1 text-base font-bold text-foreground">
                                        {requestData.balance.carry_over}{' '}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            days
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* HISTORY SECTION (Horizontal scroll layout) */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-end justify-between px-1">
                        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            <History className="h-4 w-4" /> Employee Leave
                            History
                        </h3>
                        <span className="text-xs font-medium text-muted-foreground">
                            Total Requests (2024): 6
                        </span>
                    </div>
                    <div className="flex snap-x gap-4 overflow-x-auto pb-2">
                        <Card className="min-w-[240px] shrink-0 snap-start border-t-2 border-t-primary shadow-sm">
                            <CardContent className="relative p-4">
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary"></div>
                                <p className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Sep 2024
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                    Personal Day
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    1 Day • Sep 18
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="min-w-[240px] shrink-0 snap-start border-t-2 border-t-primary shadow-sm">
                            <CardContent className="relative p-4">
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary"></div>
                                <p className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Aug 2024
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                    Summer Holiday
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    5 Days • Aug 10 - Aug 14
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="min-w-[240px] shrink-0 snap-start border-t-2 border-t-primary shadow-sm">
                            <CardContent className="relative p-4">
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary"></div>
                                <p className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    May 2024
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                    Sick Leave
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    2 Days • May 04 - May 05
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="min-w-[240px] shrink-0 snap-start border-t-2 border-t-destructive bg-muted/30 shadow-sm">
                            <CardContent className="relative p-4">
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-destructive"></div>
                                <p className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Mar 2024
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                    Personal Holiday
                                </p>
                                <p className="mt-1 text-xs font-medium text-destructive">
                                    Denied (Peak Workload)
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* BOTTOM GRID (2/3 Left, 1/3 Right) */}
                <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-3">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Current Request Card */}
                        <Card className="border-border bg-card shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    Current Request
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] font-bold tracking-wider uppercase shadow-none"
                                >
                                    {requestData.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-5">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Leave Type
                                            </p>
                                            <p className="mt-1 text-xl font-bold text-foreground">
                                                {
                                                    requestData.current_request
                                                        .type
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Reason
                                            </p>
                                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                                "
                                                {
                                                    requestData.current_request
                                                        .reason
                                                }
                                                "
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 md:border-l md:pl-8">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Duration
                                            </p>
                                            <p className="mt-1 text-xl font-bold text-foreground">
                                                {
                                                    requestData.current_request
                                                        .duration
                                                }
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    From
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-foreground">
                                                    {
                                                        requestData
                                                            .current_request
                                                            .from
                                                    }
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    To
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-foreground">
                                                    {
                                                        requestData
                                                            .current_request.to
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Coverage Analysis */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    Team Coverage Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-x-auto p-6">
                                <div className="min-w-[600px] space-y-4">
                                    {/* Table Header Grid */}
                                    <div className="mb-2 grid grid-cols-[200px_repeat(5,1fr)] gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <div></div>
                                        <div className="text-center">
                                            12 OCT
                                        </div>
                                        <div className="text-center">
                                            13 OCT
                                        </div>
                                        <div className="text-center">
                                            14 OCT
                                        </div>
                                        <div className="text-center">
                                            15 OCT
                                        </div>
                                        <div className="text-center">
                                            16 OCT
                                        </div>
                                    </div>

                                    {/* Row 1: Requester */}
                                    <div className="grid grid-cols-[200px_1fr] items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                SJ
                                            </div>
                                            <span className="text-sm font-bold text-foreground">
                                                Sarah Jenkins
                                            </span>
                                        </div>
                                        <div className="flex justify-center rounded-md border border-primary bg-primary py-2 text-xs font-bold tracking-wider text-primary-foreground shadow-sm">
                                            REQUESTED
                                        </div>
                                    </div>

                                    <Separator className="my-2" />

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-[200px_1fr] items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                                JJ
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">
                                                John Jacobson
                                            </span>
                                        </div>
                                        <div className="flex justify-center rounded-md border border-border bg-muted/50 py-2 text-xs font-bold tracking-wider text-muted-foreground">
                                            AVAILABLE
                                        </div>
                                    </div>

                                    {/* Row 3 */}
                                    <div className="grid grid-cols-[200px_repeat(5,1fr)] items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                                ER
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Emily Rogers
                                            </span>
                                        </div>
                                        <div className="col-span-2"></div>
                                        <div className="col-span-3 flex justify-center rounded-md border border-destructive/20 bg-destructive/10 py-2 text-xs font-bold tracking-wider text-destructive">
                                            OUT OF OFFICE
                                        </div>
                                    </div>

                                    {/* Row 4 */}
                                    <div className="grid grid-cols-[200px_1fr] items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                                TW
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Tom Wilson
                                            </span>
                                        </div>
                                        <div className="flex justify-center rounded-md border border-border bg-muted/50 py-2 text-xs font-bold tracking-wider text-muted-foreground">
                                            AVAILABLE
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        {/* System Check */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    System Check
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-5">
                                {/* Error Alert */}
                                <div className="flex gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
                                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                                    <div>
                                        <h4 className="text-sm font-bold tracking-tight text-destructive">
                                            Coverage Conflict
                                        </h4>
                                        <p className="mt-1 text-xs leading-relaxed font-medium text-destructive/90">
                                            Overlap with Emily Rogers (Oct
                                            14-16). Design capacity will be &lt;
                                            50%.
                                        </p>
                                    </div>
                                </div>

                                {/* Success Alert */}
                                <div className="flex gap-3 rounded-md border border-primary/20 bg-primary/5 p-4">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <h4 className="text-sm font-bold tracking-tight text-foreground">
                                            Balance Verified
                                        </h4>
                                        <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                            Sarah has sufficient annual leave
                                            balance (14 days remaining).
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Request Activity */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Request Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="relative ml-2 space-y-8">
                                    {/* Vertical Connecting Line */}
                                    <div className="absolute top-6 bottom-4 left-[9px] w-px bg-border"></div>

                                    {/* Item 1 */}
                                    <div className="relative pl-8">
                                        <div className="absolute top-1 left-0 z-10 h-5 w-5 rounded-full border-[4px] border-primary bg-background shadow-sm"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Request Submitted
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                Oct 01, 2024 • 09:12 AM
                                            </p>
                                            <p className="mt-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground italic">
                                                "Planning a short autumn break."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="relative pl-8">
                                        <div className="absolute top-1 left-0 z-10 h-5 w-5 rounded-full border-[4px] border-primary bg-background shadow-sm"></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Viewed by Manager
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                Oct 02, 2024 • 02:45 PM
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 3 (Pending) */}
                                    <div className="relative pl-8">
                                        <div className="absolute top-1 left-0 z-10 h-5 w-5 rounded-full border-[4px] border-background bg-muted shadow-sm"></div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground">
                                                Awaiting Approval
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
