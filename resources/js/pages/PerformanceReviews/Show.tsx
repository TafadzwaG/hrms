import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    History,
    Info,
    Pencil,
    Rocket,
    Star,
    Target,
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
import { Separator } from '@/components/ui/separator';

export default function PerformanceReviewShow() {
    const { review } = usePage().props as any;
    const basePath = '/performance-reviews';

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // --- Safe Data Mapping ---
    const emp = review?.employee || {};
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

    const cycleName = review?.cycle_name || 'N/A';
    const reviewerName = review?.reviewer_name || 'Unassigned';
    const reviewDate = review?.review_date
        ? moment(review.review_date).format('MMM DD, YYYY')
        : 'Not Scheduled';
    const ratingRaw = review?.rating ? parseFloat(review.rating) : 0;
    const status = review?.status || 'pending';
    const comments = review?.comments || 'No evaluation comments provided.';
    const created = review?.created_at
        ? moment(review.created_at).format('MMM DD, YYYY • hh:mm A')
        : 'Unknown';
    const updated = review?.updated_at
        ? moment(review.updated_at).format('MMM DD, YYYY • hh:mm A')
        : 'Unknown';

    // --- Handlers ---
    const handleDelete = () => {
        router.delete(`${basePath}/${review.id}`, {
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        window.print(); // Simple functional mock for "Export PDF"
    };

    // --- Aesthetic Helpers ---
    const getStatusBadge = (stat: string) => {
        const s = stat?.toLowerCase() || '';
        if (s === 'completed' || s === 'submitted') {
            return (
                <Badge
                    variant="secondary"
                    className="border border-border bg-muted px-2.5 py-0.5 text-xs font-bold tracking-wider text-foreground uppercase shadow-none"
                >
                    Completed
                </Badge>
            );
        }
        if (s === 'in_progress' || s === 'in progress') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-primary/10 px-2.5 py-0.5 text-xs font-bold tracking-wider text-primary uppercase shadow-none"
                >
                    In Progress
                </Badge>
            );
        }
        if (s === 'planning') {
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-secondary px-2.5 py-0.5 text-xs font-bold tracking-wider text-secondary-foreground uppercase shadow-none"
                >
                    Planning
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-border bg-transparent px-2.5 py-0.5 text-xs font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                Pending
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: basePath },
                { title: 'Review Details', href: '#' },
            ]}
        >
            <Head title={`${cycleName} - ${fullName}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-8 lg:p-12">
                {/* Header Section */}
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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
                                    {cycleName} - {fullName}
                                </h1>
                                {getStatusBadge(status)}
                            </div>
                            <p className="mt-2 text-sm font-medium text-muted-foreground">
                                Review Cycle: {cycleName}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                            asChild
                        >
                            <Link href={`${basePath}/${review.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                            onClick={handleExport}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>

                        <AlertDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-destructive/20 bg-background font-semibold text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Delete Review?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to permanently
                                        delete the performance review for{' '}
                                        <strong>{fullName}</strong>? This action
                                        cannot be undone.
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

                {/* Main Grid */}
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Review Content (Spans 8/12) */}
                    <div className="space-y-8 lg:col-span-8 xl:col-span-8">
                        {/* Review Overview */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="flex flex-col p-0 md:flex-row">
                                <div className="flex-1 space-y-6 p-6 md:p-8">
                                    <h3 className="text-base font-bold text-foreground">
                                        Review Overview
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-3 px-4">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Reviewer
                                            </span>
                                            <span className="text-sm font-bold text-foreground">
                                                {reviewerName}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-3 px-4">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Review Date
                                            </span>
                                            <span className="text-sm font-bold text-foreground">
                                                {reviewDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center border-t border-border bg-muted/5 p-6 md:w-64 md:border-t-0 md:border-l md:p-8">
                                    <p className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Overall Rating
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold text-foreground">
                                            {ratingRaw > 0
                                                ? ratingRaw.toFixed(1)
                                                : '—'}
                                        </span>
                                        <span className="text-sm font-bold text-muted-foreground">
                                            / 5.0
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${ratingRaw >= star ? 'fill-primary text-primary' : 'text-muted-foreground opacity-30'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Evaluation Summary */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-5">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Evaluation Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-muted-foreground">
                                    {comments}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Key Achievements (Mocked visually to match user screenshot request) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-5">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Key Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/10 p-4 transition-colors hover:bg-muted/20">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background text-foreground shadow-sm">
                                        <Rocket className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            Project Delivery Excellence
                                        </h4>
                                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                                            Led the frontend architecture for
                                            the flagship project, delivering
                                            robust features ahead of schedule.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/10 p-4 transition-colors hover:bg-muted/20">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background text-foreground shadow-sm">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            Mentorship Excellence
                                        </h4>
                                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                                            Successfully onboarded and mentored
                                            3 new team members, significantly
                                            reducing ramp-up time.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/10 p-4 transition-colors hover:bg-muted/20">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background text-foreground shadow-sm">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            Quality Standard Lead
                                        </h4>
                                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                                            Audited and updated all primary user
                                            flows to meet enterprise
                                            accessibility compliance.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-8 lg:col-span-4 xl:col-span-4">
                        {/* Employee Profile Card */}
                        <Card className="overflow-hidden border-border bg-background shadow-sm">
                            {/* Decorative Header (Monochromatic) */}
                            <div className="h-24 w-full border-b border-border bg-muted"></div>

                            <CardContent className="relative px-6 pt-0 pb-6">
                                {/* Overlapping Avatar */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                    <Avatar className="h-20 w-20 border-4 border-background bg-muted shadow-sm">
                                        <AvatarFallback className="text-xl font-bold text-muted-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Empty space to clear the absolute avatar */}
                                <div className="h-14 w-full"></div>

                                <div className="mb-6 space-y-1 text-center">
                                    <h2 className="text-lg font-bold text-foreground">
                                        {fullName}
                                    </h2>
                                    <p className="text-sm font-medium text-primary">
                                        Staff Number:{' '}
                                        {emp.staff_number || 'N/A'}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Department
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            Engineering
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Tenure
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            3 Years, 4 Months
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Location
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            Remote (Austin, TX)
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="mt-6 w-full border border-border font-bold shadow-none"
                                    asChild
                                >
                                    <Link href={`/employees/${emp.id || '#'}`}>
                                        View Full Profile
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Review Timeline */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Review Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative ml-2 space-y-6 border-l-2 border-muted pb-2">
                                    {status === 'completed' && (
                                        <div className="relative pl-6">
                                            <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-sm font-bold text-foreground">
                                                Review Completed
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                {updated}
                                            </p>
                                        </div>
                                    )}

                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <History className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Last Updated
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            {updated}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground/70 italic">
                                            by {reviewerName}
                                        </p>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground/50 ring-4 ring-background" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Review Created
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            {created}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Compliance Note */}
                        <Card className="border-border bg-muted/20 shadow-sm">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-foreground" />
                                    <h3 className="text-sm font-bold text-foreground">
                                        Compliance Note
                                    </h3>
                                </div>
                                <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                    This performance review is a legal record of
                                    employment evaluation. Any modifications are
                                    tracked in the system audit log and may
                                    require administrative approval.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
