import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Link as LinkIcon,
    Mail,
    Megaphone,
    MessageSquare,
    MoreVertical,
    Paperclip,
    Pencil,
    Phone,
    Plus,
    User,
    UserX,
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
import { Separator } from '@/components/ui/separator';

export default function CandidateProfileShow() {
    const { module, record } = usePage().props as any;
    const basePath = `/${module?.slug || 'candidate-profiles'}`;

    // Safely mapping data
    const fullName = record?.full_name || 'Unknown Candidate';
    const email = record?.email || 'No email provided';
    const phone = record?.phone || 'No phone provided';
    const stage = record?.stage || 'Applied';
    const status = record?.status || 'Active';
    const notes = record?.notes || 'No remarks added yet.';
    const created = record?.created_at
        ? moment(record.created_at).format('MMMM DD, YYYY')
        : 'Unknown';

    const reqCode = record?.requisition_code || 'N/A';
    const reqTitle = record?.requisition?.title || 'General Application';
    const reqDept = record?.requisition?.department || 'Unassigned';
    const reqManager = record?.requisition?.hiring_manager || 'Unassigned';
    const reqStatus = record?.requisition?.status || 'Open';

    // Helpers for Monochromatic Badges
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const getStatusIndicator = (stat: string) => {
        const s = stat?.toLowerCase();
        if (s === 'active' || s === 'hired')
            return <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />;
        if (s === 'rejected' || s === 'withdrawn')
            return (
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            );
        return (
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-secondary-foreground/50" />
        );
    };

    const handleDelete = () => {
        router.delete(`${basePath}/${record?.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module?.name || 'Candidates', href: basePath },
                { title: fullName, href: '#' },
            ]}
        >
            <Head title={`${fullName} - Candidate Profile`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-8 bg-muted/10 p-4 md:p-6 lg:p-8">
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
                                    {fullName}
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground shadow-none"
                                >
                                    {stage}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-border bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                >
                                    {getStatusIndicator(status)}
                                    {status}
                                </Badge>
                            </div>
                            <p className="mt-2 text-sm font-medium text-muted-foreground">
                                {reqTitle} Candidate{' '}
                                <span className="mx-1 opacity-50">•</span>{' '}
                                {reqCode}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                            onClick={() =>
                                router.visit(`${basePath}/${record.id}/edit`)
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                        >
                            <Activity className="mr-2 h-4 w-4" />
                            Move Stage
                        </Button>
                        <Button className="bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark Hired
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-destructive/20 bg-background font-semibold text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <UserX className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Reject Candidate?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to reject{' '}
                                        <strong>{fullName}</strong>? You can
                                        optionally trigger an automated
                                        rejection email after confirming.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Confirm Rejection
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Contact Information */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <User className="h-5 w-5 text-primary" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Email Address
                                            </p>
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Phone Number
                                            </p>
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed font-medium text-muted-foreground">
                                    <span className="mr-1 font-bold text-foreground">
                                        Current Standing:
                                    </span>
                                    {fullName.split(' ')[0]} is currently in the{' '}
                                    <strong>{stage}</strong> stage. Review
                                    interviewer remarks below before advancing
                                    the candidate.
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interviewer Remarks */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Interviewer Remarks
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-bold text-primary"
                                >
                                    <Plus className="mr-1 h-3 w-3" /> Add Note
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    {/* Mocked Note based on screenshot, falling back to DB notes if present */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-border">
                                                    <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                                        HR
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                        System Recruiter
                                                        <Badge
                                                            variant="secondary"
                                                            className="px-1.5 py-0 text-[9px] tracking-widest uppercase shadow-none"
                                                        >
                                                            Recruiter
                                                        </Badge>
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground italic">
                                                Latest Note
                                            </span>
                                        </div>
                                        <p className="pl-11 text-sm leading-relaxed font-medium text-muted-foreground">
                                            {notes}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recruitment Timeline (Mocked visual representation) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Recruitment Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 pl-4">
                                <div className="relative ml-2 space-y-8 border-l-2 border-muted">
                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Advanced to {stage}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            Recent activity • Handled by{' '}
                                            {reqManager}
                                        </p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Screening Completed
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            Rating: 4.5/5.0
                                        </p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Applied
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            {created} • Source: Direct
                                            Application
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Linked Requisition */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <LinkIcon className="h-4 w-4" /> Linked
                                    Requisition
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-5">
                                <div>
                                    <h3 className="text-base font-bold text-foreground">
                                        {reqTitle}
                                    </h3>
                                    <p className="mt-0.5 font-mono text-xs font-medium text-muted-foreground">
                                        {reqCode}
                                    </p>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Department
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {reqDept}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Hiring Manager
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {reqManager}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Status
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="px-2 text-[10px] tracking-wider uppercase shadow-none"
                                        >
                                            {reqStatus}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full border-border bg-background font-bold shadow-sm"
                                    asChild
                                >
                                    <Link
                                        href={`/job-requisitions/${record?.requisition?.id || '#'}`}
                                    >
                                        View Job Details
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Insights */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Quick Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Application Date
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                            {created}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Megaphone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Source
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                            Corporate Careers Page
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Time in Stage
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                            4 Days
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="w-full">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Internal Files
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="cursor-pointer bg-muted font-mono text-[10px] text-muted-foreground shadow-none hover:bg-muted/80"
                                            >
                                                <Paperclip className="mr-1 h-3 w-3" />{' '}
                                                Resume.pdf
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="cursor-pointer bg-muted font-mono text-[10px] text-muted-foreground shadow-none hover:bg-muted/80"
                                            >
                                                <Paperclip className="mr-1 h-3 w-3" />{' '}
                                                Portfolio.zip
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Skills (Mocked for visual completeness) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Top Skills Extracted
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className="bg-background text-foreground shadow-none"
                                    >
                                        React
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="bg-background text-foreground shadow-none"
                                    >
                                        TypeScript
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="bg-background text-foreground shadow-none"
                                    >
                                        Node.js
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="bg-background text-foreground shadow-none"
                                    >
                                        Kubernetes
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="bg-background text-foreground shadow-none"
                                    >
                                        AWS
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
