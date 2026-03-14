import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Code,
    Download,
    Eye,
    FileText,
    History,
    Info,
    Lock,
    Pencil,
    ShieldAlert,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function DocumentShow() {
    const { document } = usePage().props as any;
    const basePath = '/documents';

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // --- Safe Data Mapping ---
    const title = document?.title || 'Untitled Document';
    const issueDate = document?.issue_date
        ? moment(document.issue_date).format('MMM DD, YYYY')
        : 'Not Set';
    const expiryDate = document?.expiry_date
        ? moment(document.expiry_date).format('MMM DD, YYYY')
        : 'Never';
    const accessPolicy = document?.access_policy || 'Internal';
    const metadataJson =
        document?.metadata_pretty || '{\n  "info": "No metadata provided"\n}';

    // Relations
    const emp = document?.owner_employee || {};
    const fullName =
        [emp.first_name, emp.middle_name, emp.surname]
            .filter(Boolean)
            .join(' ') || 'Unknown Owner';
    const initials = fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    const staffNumber = emp.staff_number || 'N/A';

    const docType = document?.document_type || {};
    const typeName = docType.name || 'Uncategorized';
    const typeCode = docType.code || '';
    const retentionPolicy =
        docType.retention_policy || 'Standard 7 Years Post-Termination';
    const sensitivityLevel = docType.sensitivity_level || 'internal';

    // Status logic
    const isExpired = document?.is_expired;
    const isExpiringSoon = document?.is_expiring_soon;

    const created = document?.created_at
        ? moment(document.created_at).format('MMM DD, YYYY • HH:mm:ss')
        : 'Unknown';
    const updated = document?.updated_at
        ? moment(document.updated_at).format('MMM DD, YYYY • HH:mm:ss')
        : 'Unknown';

    // --- Handlers ---
    const handleDelete = () => {
        router.delete(`${basePath}/${document.id}`, {
            preserveScroll: true,
        });
    };

    // --- Aesthetic Helpers ---
    const getSensitivityBadge = (level: string) => {
        const l = level?.toLowerCase() || '';
        if (l === 'restricted')
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-destructive/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-destructive uppercase"
                >
                    Restricted
                </Badge>
            );
        if (l === 'confidential')
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase"
                >
                    Confidential
                </Badge>
            );
        return (
            <Badge
                variant="secondary"
                className="border-transparent bg-muted px-2 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
            >
                {level}
            </Badge>
        );
    };

    const getStatusBadge = () => {
        if (isExpired)
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-destructive/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-destructive uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />{' '}
                    Expired
                </Badge>
            );
        if (isExpiringSoon)
            return (
                <Badge
                    variant="outline"
                    className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />{' '}
                    Expiring Soon
                </Badge>
            );
        return (
            <Badge
                variant="outline"
                className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
            >
                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />{' '}
                Active
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Registry', href: basePath },
                { title: 'Documents', href: basePath },
                { title: title, href: '#' },
            ]}
        >
            <Head title={`${title} - Document Details`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section - Full Width */}
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
                                    {title}
                                </h1>
                            </div>
                            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Link
                                    href={basePath}
                                    className="transition-colors hover:text-foreground"
                                >
                                    &larr; Back to Registry
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-bold shadow-sm"
                            asChild
                        >
                            <Link href={`${basePath}/${document.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Document
                            </Link>
                        </Button>
                        <AlertDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-destructive/20 bg-background font-bold text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Move to Trash?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete{' '}
                                        <strong>{title}</strong>? It will be
                                        moved to the trash and can be restored
                                        later or permanently deleted from there.
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
                                        Yes, Move to Trash
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Main Grid - Full Width */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-8">
                    {/* LEFT COLUMN: Main Content (Spans 8/12) */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Document Information Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 pb-5">
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Document Information
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Core administrative and ownership
                                        details
                                    </p>
                                </div>
                                <div>
                                    {getSensitivityBadge(sensitivityLevel)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                                    {/* Owner */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Owner
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-border shadow-sm">
                                                <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm leading-none font-bold text-foreground">
                                                    {fullName}
                                                </p>
                                                <p className="mt-1 font-mono text-xs font-medium text-muted-foreground">
                                                    Staff ID: #{staffNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Issue Date */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Issue Date
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                            {issueDate}
                                        </p>
                                    </div>

                                    {/* Expiry Date */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Expiry Date
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                            {expiryDate}
                                        </p>
                                    </div>

                                    {/* Document Type */}
                                    <div className="space-y-2 sm:col-span-2 md:col-span-3">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Document Type
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                            {typeName}{' '}
                                            {typeCode ? `(${typeCode})` : ''}
                                        </p>
                                    </div>

                                    {/* Access Policy */}
                                    <div className="space-y-2 sm:col-span-2 md:col-span-3">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Access Policy
                                        </p>
                                        <div className="flex gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase shadow-none"
                                            >
                                                {accessPolicy}
                                            </Badge>
                                            {sensitivityLevel ===
                                                'restricted' && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase shadow-none"
                                                >
                                                    DIRECTOR_LEVEL
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                {/* View File Button */}
                                <div>
                                    <Button className="h-12 bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
                                        <Eye className="mr-2 h-5 w-5" /> View
                                        Original File{' '}
                                        <span className="ml-1 font-normal opacity-70">
                                            (System Authenticated)
                                        </span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Technical Metadata */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <Code className="h-4 w-4" /> Technical
                                    Metadata (JSON)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="overflow-x-auto rounded-xl border border-border bg-zinc-950 p-6 shadow-inner">
                                    <pre className="font-mono text-sm leading-relaxed text-zinc-50">
                                        <code>{metadataJson}</code>
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-8 lg:col-span-4">
                        {/* Compliance Status */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Compliance Status
                                </CardTitle>
                                {getStatusBadge()}
                            </CardHeader>
                            <CardContent className="space-y-8 p-6">
                                {/* Sensitivity Block */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${sensitivityLevel === 'restricted' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}
                                    >
                                        {sensitivityLevel === 'restricted' ? (
                                            <ShieldAlert className="h-5 w-5" />
                                        ) : (
                                            <ShieldCheck className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="mt-0.5 space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Sensitivity
                                        </p>
                                        <p className="text-sm font-bold text-foreground capitalize">
                                            {sensitivityLevel} Level
                                        </p>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Requires system authorization for
                                            export
                                        </p>
                                    </div>
                                </div>

                                {/* Retention Block */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted text-muted-foreground">
                                        <History className="h-5 w-5" />
                                    </div>
                                    <div className="mt-0.5 space-y-1">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Retention Policy
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {retentionPolicy}
                                        </p>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Monitored by automated purge cycle
                                        </p>
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                {/* Timestamps */}
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Created At
                                        </p>
                                        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />{' '}
                                            {created}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Last Modified
                                        </p>
                                        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <History className="h-4 w-4 text-muted-foreground" />{' '}
                                            {updated}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Audit Activity */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/10 pb-4">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    Recent Audit Activity
                                </CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground opacity-50" />
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Activity 1 */}
                                <div className="flex items-start gap-4 border-b border-border/50 p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                    </div>
                                    <div className="mt-0.5 space-y-0.5">
                                        <p className="text-sm font-bold text-foreground">
                                            Viewed by Admin
                                        </p>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>

                                {/* Activity 2 */}
                                <div className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                                        <History className="h-4 w-4" />
                                    </div>
                                    <div className="mt-0.5 space-y-0.5">
                                        <p className="text-sm font-bold text-foreground">
                                            Metadata updated
                                        </p>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            System Audit •{' '}
                                            {moment(
                                                document?.updated_at,
                                            ).format('MMM DD, YYYY')}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-border/50 bg-muted/5 p-4 text-center">
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-xs font-bold tracking-widest text-primary uppercase"
                                    >
                                        View Full History Log
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer Meta Row */}
                <div className="mt-4 flex flex-col items-center justify-between border-t border-border pt-6 text-[11px] font-medium text-muted-foreground sm:flex-row">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <Lock className="h-3 w-3" /> Encrypted at Rest
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3 w-3" /> GDPR Compliant
                        </span>
                    </div>
                    <p className="mt-4 sm:mt-0">
                        © 2024 HRMS Registry System - Internal Audit Authorized
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
