import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    Download,
    FileText,
    HelpCircle,
    Info,
    Pencil,
    PlayCircle,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

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

export default function LearningCourseShow() {
    const { course } = usePage().props as any;
    const basePath = '/learning-courses';

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // --- Safe Data Mapping ---
    const title = course?.title || 'Untitled Course';
    const code = course?.course_code || 'N/A';
    const category = course?.category || 'Uncategorized';
    const duration = course?.duration_hours
        ? parseFloat(course.duration_hours).toFixed(1)
        : '0.0';
    const isMandatory = !!course?.compliance_required;
    const expiresDays = course?.expires_after_days;
    const status = course?.status || 'inactive';
    const created = course?.created_at
        ? moment(course.created_at).format('MMM DD, YYYY • hh:mm A')
        : 'Unknown';
    const updated = course?.updated_at
        ? moment(course.updated_at).format('MMM DD, YYYY • hh:mm A')
        : 'Unknown';

    // --- Handlers ---
    const handleDelete = () => {
        router.delete(`${basePath}/${course.id}`, {
            preserveScroll: true,
        });
    };

    // --- Aesthetic Helpers ---
    const getStatusBadge = (stat: string) => {
        const s = stat?.toLowerCase() || '';
        if (s === 'active') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    Active
                </Badge>
            );
        }
        if (s === 'archived') {
            return (
                <Badge
                    variant="secondary"
                    className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Archived
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-border bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                Inactive
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Learning', href: basePath },
                { title: 'Courses', href: basePath },
                { title: code, href: '#' },
            ]}
        >
            <Head title={`${title} - Course Details`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section - Full Width */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <Badge
                                variant="secondary"
                                className="border border-border/50 bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase shadow-none"
                            >
                                {code}
                            </Badge>
                            {getStatusBadge(status)}
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Essential training module for enterprise employees
                            covering {category.toLowerCase()} and related
                            protocols.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-bold shadow-sm"
                            asChild
                        >
                            <Link href={`${basePath}/${course.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Course
                            </Link>
                        </Button>
                        <Button className="bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Enrollments
                        </Button>
                        <AlertDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-destructive/20 bg-background text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Delete Course?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to permanently
                                        delete <strong>{title}</strong>? This
                                        action cannot be undone and will remove
                                        it from the learning catalog.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Yes, Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Main Grid - Full Width */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-8">
                    {/* LEFT COLUMN (Spans 8/12) */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Card className="border-border bg-background shadow-sm">
                                <CardContent className="p-6">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <BookOpen className="h-4 w-4" />
                                        <p className="text-[10px] font-bold tracking-widest uppercase">
                                            Category
                                        </p>
                                    </div>
                                    <p className="text-lg leading-tight font-bold text-foreground">
                                        {category}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-background shadow-sm">
                                <CardContent className="p-6">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <Clock className="h-4 w-4" />
                                        <p className="text-[10px] font-bold tracking-widest uppercase">
                                            Duration
                                        </p>
                                    </div>
                                    <p className="text-lg leading-tight font-bold text-foreground">
                                        {duration} Contact Hours
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-background shadow-sm">
                                <CardContent className="p-6">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <ShieldCheck className="h-4 w-4" />
                                        <p className="text-[10px] font-bold tracking-widest uppercase">
                                            Compliance
                                        </p>
                                    </div>
                                    <p className="text-lg leading-tight font-bold text-foreground">
                                        {isMandatory
                                            ? 'Mandatory Annual'
                                            : 'Optional / Elective'}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Metadata */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-foreground">
                                        Detailed Metadata
                                    </CardTitle>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Created By
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                                                    AD
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm font-semibold text-foreground">
                                                Admin Providence
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Created Date
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {created}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Last Updated
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {updated}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Content Version
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            v2.1.4 Build 88
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recurrence & Expiry Settings */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Recurrence & Expiry Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                {expiresDays ? (
                                    <>
                                        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
                                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Auto-Renewal Enabled
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                    Certificates for this course
                                                    expire {expiresDays} days
                                                    after completion. Employees
                                                    will be automatically
                                                    re-enrolled 30 days prior to
                                                    expiry.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Validity Period
                                                </p>
                                                <p className="text-sm font-bold text-foreground">
                                                    {expiresDays} Days
                                                </p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Renewal Grace Period
                                                </p>
                                                <p className="text-sm font-bold text-foreground">
                                                    30 Days
                                                </p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Notification Trigger
                                                </p>
                                                <p className="text-sm font-bold text-foreground">
                                                    60 Days Before Expiry
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-6 text-center text-sm font-medium text-muted-foreground">
                                        This course does not expire.
                                        Certificates are valid indefinitely.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (Spans 4/12) */}
                    <div className="space-y-8 lg:col-span-4">
                        {/* Course Performance */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    Course Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Total Enrollments
                                        </span>
                                        <span className="text-sm font-bold text-foreground">
                                            1,248
                                        </span>
                                    </div>
                                    <Progress
                                        value={100}
                                        className="h-2 bg-muted [&>div]:bg-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Completion Rate
                                        </span>
                                        <span className="text-sm font-bold text-foreground">
                                            82%
                                        </span>
                                    </div>
                                    <Progress
                                        value={82}
                                        className="h-2 border border-border bg-muted"
                                    />
                                </div>

                                <div className="mt-2 border-t border-border/50 pt-6"></div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-extrabold text-foreground">
                                            4.8
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Avg. Rating
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-extrabold text-foreground">
                                            15m
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Avg. Quiz Time
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Assets */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    Course Assets
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-bold text-primary"
                                >
                                    Add New
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Asset 1 */}
                                <div className="flex items-center justify-between border-b border-border/50 p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted text-primary">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-foreground">
                                                Security_Policy_v2.pdf
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                                                2.4 MB • PDF Document
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Asset 2 */}
                                <div className="flex items-center justify-between border-b border-border/50 p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted text-primary">
                                            <PlayCircle className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-foreground">
                                                Introduction_Video.mp4
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                                                124 MB • Video File
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground"
                                    >
                                        <PlayCircle className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Asset 3 */}
                                <div className="flex items-center justify-between p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted text-primary">
                                            <HelpCircle className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-foreground">
                                                Final_Assessment_Bank.xls
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                                                45 KB • Spreadsheet
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Block */}
                        <Card className="relative overflow-hidden border-border bg-muted/20 shadow-sm">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <HelpCircle className="h-32 w-32" />
                            </div>
                            <CardContent className="relative z-10 space-y-3 p-6">
                                <h3 className="text-sm font-bold text-foreground">
                                    Need content help?
                                </h3>
                                <p className="pr-6 text-xs leading-relaxed font-medium text-muted-foreground">
                                    Contact our Instructional Design team for
                                    updates to this course content.
                                </p>
                                <Button
                                    variant="link"
                                    className="mt-1 h-auto p-0 text-xs font-bold text-primary"
                                >
                                    Open Support Ticket &rarr;
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex items-center justify-center border-t bg-background px-8 py-6">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 HRMS Providence Enterprise. All rights reserved.
                </p>
            </div>
        </AppLayout>
    );
}
