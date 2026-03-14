import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    Database,
    FileText,
    History,
    Info,
    LayoutTemplate,
    Lock,
    Pencil,
    Settings2,
    ShieldCheck,
    Trash2,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function DocumentTypeShow() {
    const { documentType, canDelete } = usePage().props as any;
    const basePath = '/document-types';

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // --- Safe Data Mapping ---
    const name = documentType?.name || 'Unknown Document Type';
    const code = documentType?.code || 'N/A';
    const sensitivity = documentType?.sensitivity_level || 'internal';
    const retention =
        documentType?.retention_policy ||
        'No specific retention policy defined.';
    const docCount = documentType?.documents_count || 0;
    const created = documentType?.created_at
        ? moment(documentType.created_at).format('MMM DD, YYYY')
        : 'Unknown Date';
    const updated = documentType?.updated_at
        ? moment(documentType.updated_at).format('MMM DD, YYYY')
        : 'Unknown Date';

    // --- Handlers ---
    const handleDelete = () => {
        router.delete(`${basePath}/${documentType.id}`, {
            preserveScroll: true,
        });
    };

    // --- Aesthetic Helpers ---
    const getSensitivityBadge = (level: string) => {
        const l = level?.toLowerCase() || '';
        if (l === 'restricted') {
            return (
                <Badge
                    variant="outline"
                    className="border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-xs font-bold tracking-wider text-destructive uppercase shadow-none"
                >
                    Restricted
                </Badge>
            );
        }
        if (l === 'confidential') {
            return (
                <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold tracking-wider text-primary uppercase shadow-none"
                >
                    Confidential
                </Badge>
            );
        }
        return (
            <Badge
                variant="secondary"
                className="border-transparent bg-muted px-2.5 py-0.5 text-xs font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                {level}
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Governance', href: basePath },
                { title: 'Document Types', href: basePath },
                { title: name, href: '#' },
            ]}
        >
            <Head title={`${name} - Document Type`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Top Info Alert (Monochromatic) */}
                <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Info className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            New HR Generalist View
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                            We've simplified this view to help you understand
                            governance rules. Hover over the icons for simple
                            explanations.
                        </p>
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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
                                    {name}
                                </h1>
                                {getSensitivityBadge(sensitivity)}
                            </div>
                            <p className="mt-2 text-sm font-medium text-muted-foreground">
                                Managed legal document for employment terms
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                            asChild
                        >
                            <Link href={`${basePath}/${documentType.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Details
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Main Grid - Full Width */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-8">
                    {/* LEFT COLUMN: Main Content (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* How it's Configured */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Settings2 className="h-5 w-5 text-primary" />
                                    How it's Configured
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            System Code{' '}
                                            <Info className="h-3 w-3 opacity-50" />
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="border border-border/50 bg-muted px-3 py-1 font-mono text-sm font-semibold tracking-wider text-foreground uppercase shadow-none"
                                        >
                                            {code}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Public Name{' '}
                                            <Info className="h-3 w-3 opacity-50" />
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {name}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Retention Rules */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Retention Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="rounded-xl border border-border bg-muted/10 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm">
                                            <History className="h-5 w-5" />
                                        </div>
                                        <div className="w-full space-y-3">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-base font-bold text-foreground">
                                                    Defined Life Cycle
                                                </h4>
                                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-muted-foreground">
                                                {retention}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2">
                                                <Button
                                                    variant="link"
                                                    className="h-auto p-0 text-xs font-bold text-primary"
                                                >
                                                    <FileText className="mr-1.5 h-3.5 w-3.5" />{' '}
                                                    View Policy Policy
                                                </Button>
                                                <span className="border-l border-border pl-4 text-xs font-medium text-muted-foreground italic">
                                                    Legally Required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Visibility */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Security & Visibility
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Access Control{' '}
                                            <Info className="h-3 w-3 opacity-50" />
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant="outline"
                                                className="bg-background text-muted-foreground shadow-none"
                                            >
                                                HR Directors
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-background text-muted-foreground shadow-none"
                                            >
                                                Legal Counsel
                                            </Badge>
                                        </div>
                                        <div className="mt-6 flex items-start gap-3">
                                            <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <CheckCircle2 className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Audit Active
                                                </p>
                                                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                    Every time someone opens
                                                    this file, it is recorded in
                                                    our security log.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Internal Note
                                        </p>
                                        <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                            Multi-factor authentication (MFA) is
                                            required based on sensitivity level.
                                            This means even with a password,
                                            users need an extra code from their
                                            phone to view these contracts.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Layout (Mock Placeholder) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <LayoutTemplate className="h-5 w-5 text-primary" />
                                    Document Layout{' '}
                                    <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-bold text-primary"
                                >
                                    <FileText className="mr-1.5 h-3.5 w-3.5" />{' '}
                                    Change Template
                                </Button>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="flex h-64 w-full flex-col items-center justify-center space-y-3 rounded-xl border-2 border-dashed border-border bg-muted/5 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            Standard Contract Template v2.4
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            Live preview disabled for
                                            high-sensitivity types
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Quick Stats */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Active Files
                                            </p>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Total Count
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-extrabold text-foreground">
                                        {docCount.toLocaleString()}
                                    </span>
                                </div>

                                <Separator />

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Set Up Date
                                        </p>
                                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />{' '}
                                            {created}
                                        </p>
                                        <p className="text-xs text-muted-foreground italic">
                                            by Administrator
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Last Modification
                                        </p>
                                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <History className="h-4 w-4 text-muted-foreground" />{' '}
                                            {updated}
                                        </p>
                                        <p className="text-xs text-muted-foreground italic">
                                            by Legal Department
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        <span>System Storage</span>
                                        <span>4.2 GB Used</span>
                                    </div>
                                    <Progress
                                        value={45}
                                        className="h-2 border border-border bg-muted"
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">
                                        Storage used by these contract files.
                                    </p>
                                </div>

                                <Button className="w-full bg-primary font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
                                    <BarChart3 className="mr-2 h-4 w-4" /> Run
                                    Audit Report
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Careful Actions */}
                        <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    Careful Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs leading-relaxed font-medium text-destructive/80">
                                    Deleting this document type will affect all{' '}
                                    {docCount.toLocaleString()} linked files.
                                    This action cannot be undone.
                                </p>

                                <AlertDialog
                                    open={deleteDialogOpen}
                                    onOpenChange={setDeleteDialogOpen}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full border-destructive/30 bg-background font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            disabled={!canDelete}
                                            title={
                                                !canDelete
                                                    ? 'Cannot delete: Documents are linked'
                                                    : 'Delete Document Type'
                                            }
                                        >
                                            Delete Document Type
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-destructive">
                                                Delete Document Type?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to
                                                permanently delete{' '}
                                                <strong>{name}</strong>? This
                                                action cannot be undone.
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 md:flex-row">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2025 Providence Human Resource Management System.
                </p>
                <div className="flex items-center gap-6 text-[11px] font-medium text-muted-foreground">
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Legal Policy
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Data Protection
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Support
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
