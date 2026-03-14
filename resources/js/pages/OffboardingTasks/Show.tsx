import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    BarChart,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Fingerprint,
    HelpCircle,
    MapPin,
    MessageSquare,
    Package,
    Pencil,
    Plus,
    Settings,
    Truck,
    User,
    UserCheck,
} from 'lucide-react';
import moment from 'moment';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function OnboardingTaskShow() {
    const { task } = usePage().props as any;
    const basePath = '/onboarding-tasks';

    // Fallbacks
    const taskName = task?.task_name || 'Untitled Task';
    const team = task?.owner_team || 'Unassigned Team';
    const status = task?.status || 'pending';
    const dueDate = task?.due_date
        ? moment(task.due_date).format('MMM DD, YYYY')
        : 'Not Set';
    const notes = task?.notes || 'No additional notes provided for this task.';

    // Employee Data
    const emp = task?.employee || {};
    const fullName =
        emp.full_name ||
        [emp.first_name, emp.middle_name, emp.surname]
            .filter(Boolean)
            .join(' ') ||
        'Unknown Employee';
    const initials = fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    const staffNumber = emp.staff_number || 'N/A';

    // Calculate Progress State
    let progressValue = 0;
    let currentStep = 1;
    if (status === 'in_progress') {
        progressValue = 50;
        currentStep = 2;
    } else if (status === 'completed') {
        progressValue = 100;
        currentStep = 3;
    } else if (status === 'cancelled') {
        progressValue = 0;
        currentStep = 0;
    }

    const handleDelete = () => {
        router.delete(`${basePath}/${task.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tasks', href: basePath },
                { title: 'Task Details', href: '#' },
            ]}
        >
            <Head title={`${taskName} - Task Details`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm sm:flex"
                            onClick={() => router.visit(basePath)}
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {taskName}
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="bg-muted px-2.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase shadow-none"
                                >
                                    TSK-
                                    {task?.id?.toString().padStart(4, '0') ||
                                        '0000'}
                                </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    Updated {moment(task?.updated_at).fromNow()}
                                </span>
                                <span className="hidden opacity-30 sm:inline">
                                    •
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Briefcase className="h-4 w-4" />
                                    {team}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                            asChild
                        >
                            <Link href={`${basePath}/${task.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Task
                            </Link>
                        </Button>
                        <Button className="bg-foreground font-semibold text-background shadow-sm hover:bg-foreground/90">
                            <Archive className="mr-2 h-4 w-4" />
                            Archive Task
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Main Content (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8 xl:col-span-8">
                        {/* Task Progress Stepper */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
                                <div className="flex items-center gap-2">
                                    <BarChart className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base font-bold text-foreground">
                                        Task Progress
                                    </CardTitle>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 font-bold text-primary shadow-none"
                                >
                                    {progressValue}% Completed
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-10 pt-8">
                                {/* Stepper Visual */}
                                <div className="relative flex justify-between px-2 sm:px-8">
                                    <div className="absolute top-5 right-10 left-10 z-0 h-[2px] bg-muted"></div>
                                    <div
                                        className="absolute top-5 left-10 z-0 h-[2px] bg-primary transition-all duration-500"
                                        style={{
                                            width: `calc(${progressValue}% - 1.5rem)`,
                                        }}
                                    ></div>

                                    {/* Step 1 */}
                                    <div className="relative z-10 flex flex-col items-center gap-3 bg-background px-2">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 1 ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border bg-background text-muted-foreground'}`}
                                        >
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <p
                                            className={`text-[10px] font-bold tracking-widest uppercase ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            Assigned
                                        </p>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="relative z-10 flex flex-col items-center gap-3 bg-background px-2">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 2 ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border bg-background text-muted-foreground'}`}
                                        >
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <p
                                            className={`text-[10px] font-bold tracking-widest uppercase ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            In Progress
                                        </p>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="relative z-10 flex flex-col items-center gap-3 bg-background px-2">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep >= 3 ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border bg-background text-muted-foreground'}`}
                                        >
                                            <UserCheck className="h-5 w-5" />
                                        </div>
                                        <p
                                            className={`text-[10px] font-bold tracking-widest uppercase ${currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            Completed
                                        </p>
                                    </div>
                                </div>

                                {/* Recommended Next Steps (Mocked Action Blocks) */}
                                {status !== 'completed' &&
                                    status !== 'cancelled' && (
                                        <div className="rounded-xl border border-border bg-muted/20 p-1">
                                            <div className="p-3 pb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Recommended Next Steps
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2">
                                                <div className="flex cursor-pointer items-center gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:border-primary/50">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                        <MessageSquare className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">
                                                            Request Update
                                                        </p>
                                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                            Send a ping to task
                                                            owner
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex cursor-pointer items-center gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:border-primary/50">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">
                                                            Mark Completed
                                                        </p>
                                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                            Advance pipeline to
                                                            done
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                <Separator />

                                {/* Meta Grid */}
                                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Due Date
                                        </p>
                                        <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />{' '}
                                            {dueDate}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Task Priority
                                        </p>
                                        <p className="flex items-center gap-1.5 text-sm font-bold text-destructive">
                                            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />{' '}
                                            High Priority
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Task Status
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="px-2 text-[10px] tracking-wider uppercase shadow-none"
                                        >
                                            {status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Feed */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Activity Feed
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 font-semibold text-primary"
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Add Note
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6 pl-4">
                                <div className="relative ml-4 space-y-8 border-l-2 border-muted pb-4">
                                    {/* Most Recent Event (Status Update) */}
                                    <div className="relative pl-6">
                                        <div className="absolute top-0 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
                                            <Settings className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-foreground">
                                                <strong className="font-bold">
                                                    System Automation
                                                </strong>{' '}
                                                updated status to{' '}
                                                <strong className="font-bold">
                                                    {status.replace('_', ' ')}
                                                </strong>
                                            </p>
                                            <span className="text-xs font-medium text-muted-foreground">
                                                Just now
                                            </span>
                                        </div>
                                    </div>

                                    {/* Comment / Notes Event */}
                                    {notes && (
                                        <div className="relative pl-6">
                                            <div className="absolute top-0 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-sm font-medium text-foreground">
                                                    <strong className="font-bold">
                                                        Task Owner
                                                    </strong>{' '}
                                                    left a note
                                                </p>
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {moment(
                                                        task?.updated_at,
                                                    ).fromNow()}
                                                </span>
                                            </div>
                                            <div className="rounded-lg border-l-4 border-primary bg-muted/20 p-4">
                                                <p className="text-sm leading-relaxed font-medium text-muted-foreground italic">
                                                    "{notes}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Creation Event */}
                                    <div className="relative pl-6">
                                        <div className="absolute top-0 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-sm font-medium text-foreground">
                                                <strong className="font-bold">
                                                    HR System
                                                </strong>{' '}
                                                created task
                                            </p>
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {moment(
                                                    task?.created_at,
                                                ).format('MMM DD, hh:mm A')}
                                            </span>
                                        </div>
                                        <ul className="list-inside list-disc space-y-1.5 text-xs font-medium text-muted-foreground">
                                            <li>Task assigned to {team}</li>
                                            <li>Employee profile linked</li>
                                            <li>
                                                Initial status set to Pending
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Context & Side Panels (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4 xl:col-span-4">
                        {/* Employee Profile Card */}
                        <Card className="overflow-hidden border-border bg-background shadow-sm">
                            {/* Decorative Header */}
                            <div className="h-24 w-full border-b border-border/50 bg-muted"></div>

                            <CardContent className="relative px-6 pt-0 pb-6">
                                {/* Overlapping Avatar */}
                                <div className="absolute -top-10 left-6">
                                    <Avatar className="h-20 w-20 border-4 border-background bg-muted shadow-sm">
                                        <AvatarFallback className="text-xl font-bold text-muted-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Empty space to clear the absolute avatar */}
                                <div className="h-12 w-full"></div>

                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">
                                            {fullName}
                                        </h2>
                                        <p className="mt-0.5 text-sm font-medium text-primary">
                                            New Hire / Onboarding
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="border-transparent bg-primary/10 px-2 py-0 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                                    >
                                        Active
                                    </Badge>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Department
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                Engineering
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Office Location
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                Headquarters
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                                            <Fingerprint className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Staff Number
                                            </p>
                                            <p className="font-mono text-sm font-bold text-foreground">
                                                {staffNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="mt-6 w-full bg-background font-bold shadow-sm hover:bg-muted"
                                    asChild
                                >
                                    <Link href={`/employees/${emp.id || '#'}`}>
                                        View Employee Profile
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Help / Support Block */}
                        <Card className="border-dashed border-border bg-muted/30 shadow-sm">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-primary">
                                        <HelpCircle className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground">
                                        System Support
                                    </h3>
                                </div>
                                <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                    Need help configuring complex task
                                    dependencies or experiencing workflow
                                    issues?
                                </p>
                                <Button
                                    variant="link"
                                    className="mt-1 h-auto p-0 text-xs font-bold text-primary"
                                >
                                    Contact IT Service Desk &rarr;
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex items-center justify-between border-t bg-background px-8 py-6">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 Providence HRMS. Confidential Enterprise System.
                </p>
                <div className="flex items-center gap-6 text-[11px] font-medium text-muted-foreground">
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Security Policy
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        API Documentation
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
