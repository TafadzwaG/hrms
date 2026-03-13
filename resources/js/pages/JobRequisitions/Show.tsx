import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    Clock,
    FileText,
    Globe,
    History,
    MoreVertical,
    Pencil,
    Settings,
    Trash2,
    Users,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function JobRequisitionShow() {
    const { module, record } = usePage().props as any;
    const basePath = `/${module?.slug || 'job-requisitions'}`;

    // Safely mapping data
    const title = record?.title || 'Untitled Role';
    const code = record?.requisition_code || 'N/A';
    const department = record?.department || 'Unassigned';
    const manager = record?.hiring_manager || 'Unassigned';
    const openings = record?.openings || 1;
    const status = record?.status || 'Draft';
    const targetDate = record?.target_start_date
        ? moment(record.target_start_date).format('MMM DD, YYYY')
        : 'Not Set';
    const created = record?.created_at
        ? moment(record.created_at).format('MMM DD, YYYY • hh:mm A')
        : 'Unknown';
    const modified = record?.updated_at
        ? moment(record.updated_at).format('MMM DD, YYYY • hh:mm A')
        : 'Unknown';

    // Helper for Status Badge
    const getStatusDisplay = (stat: string) => {
        const s = stat?.toLowerCase() || 'draft';
        if (s === 'open') return 'bg-primary/10 text-primary border-primary/20';
        if (s === 'filled' || s === 'closed')
            return 'bg-foreground/5 text-foreground border-foreground/20';
        if (s === 'on hold')
            return 'bg-secondary text-secondary-foreground border-transparent';
        return 'bg-muted text-muted-foreground border-transparent';
    };

    const handleDelete = () => {
        router.delete(`${basePath}/${record?.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module?.name || 'Requisitions', href: basePath },
                { title: code, href: '#' },
            ]}
        >
            <Head title={`${title} - Requisition`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-0.5 h-10 w-10 shrink-0 border-border bg-background shadow-sm"
                            onClick={() => router.visit(basePath)}
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {title}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-none ${getStatusDisplay(status)}`}
                                >
                                    {status}
                                </Badge>
                            </div>
                            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <span>{code}</span>
                                <span className="text-muted-foreground/30">
                                    •
                                </span>
                                <span>{department} Department</span>
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
                            Edit Requisition
                        </Button>
                        <Button className="bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                            <Globe className="mr-2 h-4 w-4" />
                            Publish to Job Board
                        </Button>

                        <AlertDialog>
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
                                        Delete Requisition?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to permanently
                                        delete <strong>{title}</strong>? This
                                        will remove all associated pipeline data
                                        and applicant tracking history.
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

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Core Details Grid */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Requisition Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-8 pt-6 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Req Code
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {code}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Department
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {department}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Hiring Manager
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
                                            {manager ? manager.charAt(0) : '?'}
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {manager}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Openings
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {openings.toString().padStart(2, '0')}{' '}
                                        Total
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Target Start
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {targetDate}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Employment Type
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                        Full-time, Hybrid
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description (Mocked text representation) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Job Description & Requirements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-foreground">
                                        About the Role
                                    </h3>
                                    <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                        We are seeking a {title} to join our
                                        growing team. You will be responsible
                                        for building high-quality, scalable
                                        solutions and contributing to core
                                        system architecture. You'll work closely
                                        with cross-functional partners to
                                        deliver exceptional experiences.
                                    </p>
                                    <h3 className="pt-2 text-sm font-bold text-foreground">
                                        Requirements
                                    </h3>
                                    <ul className="list-inside list-disc space-y-2 text-sm font-medium text-muted-foreground marker:text-primary">
                                        <li>
                                            5+ years of professional experience
                                            in a related field.
                                        </li>
                                        <li>
                                            Expert knowledge of
                                            industry-standard tools and
                                            frameworks.
                                        </li>
                                        <li>
                                            Strong experience with responsive
                                            design and scalable systems.
                                        </li>
                                        <li>
                                            Proven ability to architect complex
                                            solutions independently.
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Applicant Pipeline (Mock Table) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Users className="h-5 w-5 text-primary" />
                                    Applicant Pipeline
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-bold text-primary"
                                >
                                    View All Candidates
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                                            <TableHead className="h-10 pl-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Name
                                            </TableHead>
                                            <TableHead className="h-10 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Stage
                                            </TableHead>
                                            <TableHead className="h-10 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Applied Date
                                            </TableHead>
                                            <TableHead className="h-10 pr-6 text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Mock Rows matching screenshot */}
                                        <TableRow className="group hover:bg-muted/30">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                                        SS
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                                            Sarah Smith
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            San Francisco, CA
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-transparent bg-primary/10 text-xs text-primary shadow-none"
                                                >
                                                    Technical Interview
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                Oct 12, 2023
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow className="group hover:bg-muted/30">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                                        MJ
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                                            Marcus Johnson
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Remote, US
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted text-xs text-muted-foreground shadow-none"
                                                >
                                                    Screening
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                Oct 14, 2023
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow className="group hover:bg-muted/30">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                                        ER
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                                            Elena Rodriguez
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Austin, TX
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-transparent bg-secondary text-xs text-secondary-foreground shadow-none"
                                                >
                                                    Application Review
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                Oct 15, 2023
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Hiring Progress */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Hiring Progress
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary shadow-none"
                                >
                                    50%
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <Progress value={50} className="h-3" />
                                <p className="text-sm font-medium text-foreground">
                                    <strong>1 of {openings}</strong> positions
                                    filled
                                </p>

                                <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                        JC
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Hired Candidate:{' '}
                                        <span className="font-bold text-foreground">
                                            James Chen
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline & SLA */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <History className="h-5 w-5 text-muted-foreground" />
                                    Timeline & SLA
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="relative ml-3 space-y-6 border-l-2 border-muted">
                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Published to Board
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            Oct 11, 2023 • 09:15 AM
                                        </p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Requisition Approved
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            Oct 10, 2023 • 04:30 PM
                                        </p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">
                                            Created
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            Oct 09, 2023 • 11:20 AM
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Registry */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    System Registry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-5 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        Created by:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        System Admin
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        Created date:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {created}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                    <span className="font-medium text-muted-foreground">
                                        Last Modified:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {modified}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer matching the screenshot */}
            <div className="flex items-center justify-between border-t bg-background px-8 py-6">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 Providence HRMS. Confidential Enterprise System.
                </p>
                <div className="flex items-center gap-6 text-[11px] font-medium text-muted-foreground">
                    <a href="#" className="hover:text-foreground">
                        Help Center
                    </a>
                    <a href="#" className="hover:text-foreground">
                        Privacy Policy
                    </a>
                    <span>Release Notes v4.2</span>
                </div>
            </div>
        </AppLayout>
    );
}
