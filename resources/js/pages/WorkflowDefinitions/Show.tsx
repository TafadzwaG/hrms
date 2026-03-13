import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock,
    FileSignature,
    Info,
    Landmark,
    Pencil,
    Settings,
    Trash2,
    User,
    XCircle,
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

export default function WorkflowDefinitionShow() {
    const { module, record } = usePage().props as any;

    const basePath = `/${module?.slug || 'workflow-definitions'}`;

    // Safety fallbacks matching the DB schema and screenshot
    const name = record?.name || 'Standard Leave Approval';
    const requestType = record?.request_type || 'Leave';
    const status = record?.status || 'Active';
    const slaHours = record?.sla_hours || 48;
    const created = record?.created_at
        ? moment(record.created_at).format('MMM DD, YYYY, hh:mm A')
        : 'Jan 12, 2024, 09:45 AM';
    const modified = record?.updated_at
        ? moment(record.updated_at).format('MMM DD, YYYY, hh:mm A')
        : 'Mar 05, 2024, 02:20 PM';

    // Mock steps if steps_json is empty or invalid
    let steps = [];
    try {
        steps =
            typeof record?.steps_json === 'string'
                ? JSON.parse(record.steps_json)
                : record?.steps_json;
        if (!Array.isArray(steps) || steps.length === 0) throw new Error();
    } catch {
        steps = [
            {
                id: 1,
                title: 'Direct Manager',
                description: 'Reviews primary request and team capacity',
                condition: 'Always Required',
                icon: User,
            },
            {
                id: 2,
                title: 'HR Department',
                description: 'Validates policy compliance and accrual',
                condition: 'Always Required',
                icon: Building2,
            },
            {
                id: 3,
                title: 'Finance Team',
                description: 'Reviews budgetary impact for extended leave',
                condition: 'Conditional - Only if > 5 days',
                icon: Landmark,
                isConditional: true,
            },
        ];
    }

    const handleDelete = () => {
        router.delete(`${basePath}/${record?.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Workflows', href: basePath },
                { title: name, href: '#' },
            ]}
        >
            <Head title={`Workflow: ${name}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                                    {name}
                                </h1>
                                {status.toLowerCase() === 'active' ? (
                                    <Badge
                                        variant="outline"
                                        className="border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                                    >
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="border-border bg-muted px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                                    >
                                        {status}
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <span>Workflows</span>
                                <span className="text-muted-foreground/30">
                                    /
                                </span>
                                <span className="text-primary">
                                    {requestType} Approval
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-border bg-background font-semibold shadow-sm"
                            onClick={() =>
                                router.visit(
                                    `${basePath}/${record?.id || 1}/edit`,
                                )
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Workflow
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
                                        Delete Workflow?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the{' '}
                                        <strong>{name}</strong> workflow? This
                                        may disrupt active system requests
                                        currently using this routing logic.
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
                    {/* LEFT COLUMN: Approval Sequence (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Approval Sequence
                                </CardTitle>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {steps.length} Total Steps
                                </span>
                            </CardHeader>
                            <CardContent className="px-8 pt-8 pb-10">
                                {/* Vertical Timeline */}
                                <div className="relative ml-6 space-y-12 border-l-2 border-muted/60">
                                    {steps.map((step: any, index: number) => {
                                        const StepIcon = step.icon || User;

                                        return (
                                            <div
                                                key={step.id || index}
                                                className="relative pl-8"
                                            >
                                                {/* Timeline Node */}
                                                <div className="absolute top-0 -left-[21px] flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-background text-muted-foreground shadow-sm">
                                                    <StepIcon className="h-4 w-4" />
                                                </div>

                                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-base font-bold text-foreground">
                                                                {step.title}
                                                            </h3>
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-muted px-2 py-0 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                                            >
                                                                Step{' '}
                                                                {(index + 1)
                                                                    .toString()
                                                                    .padStart(
                                                                        2,
                                                                        '0',
                                                                    )}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            {step.description}
                                                        </p>

                                                        {/* Action Buttons Mockup */}
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="border-primary/30 bg-primary/5 px-2 py-0.5 text-[9px] font-bold tracking-widest text-primary uppercase"
                                                            >
                                                                Action: Approve
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="border-destructive/30 bg-destructive/5 px-2 py-0.5 text-[9px] font-bold tracking-widest text-destructive uppercase"
                                                            >
                                                                Action: Reject
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Condition Badge */}
                                                    <div className="shrink-0 pt-1">
                                                        <Badge
                                                            variant={
                                                                step.isConditional
                                                                    ? 'secondary'
                                                                    : 'default'
                                                            }
                                                            className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-none ${
                                                                step.isConditional
                                                                    ? 'bg-primary/10 text-primary hover:bg-primary/10'
                                                                    : 'bg-foreground text-background hover:bg-foreground'
                                                            }`}
                                                        >
                                                            {step.condition}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Configuration & Meta (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Configuration Details */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Settings className="h-5 w-5 text-primary" />
                                    Configuration Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-5">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Request Type
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                        <FileSignature className="h-4 w-4 text-muted-foreground" />
                                        {requestType}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        SLA Target
                                    </p>
                                    <div className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        {slaHours} Hours
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Expected Turnaround
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                        {Math.round(
                                            slaHours /
                                                Math.max(steps.length, 1),
                                        )}
                                        -
                                        {Math.round(
                                            slaHours /
                                                Math.max(steps.length, 1),
                                        ) + 12}{' '}
                                        Hours per step
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Registry */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Archive className="h-5 w-5 text-primary" />
                                    System Registry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-5 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        Created
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {created}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        Last Modified
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {modified}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                    <span className="font-medium text-muted-foreground">
                                        Sync Status
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        Synchronized
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Note Alert */}
                        <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                                <Info className="h-4 w-4" />
                                Admin Note
                            </div>
                            <p className="text-xs leading-relaxed font-medium text-foreground/80 italic">
                                "This workflow is linked to the Global Employee
                                Policy v2.4. Changes may affect existing pending
                                requests."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="border-t bg-background py-6 text-center">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Providence HRMS © 2024 • Enterprise Workflow Engine
                </p>
            </div>
        </AppLayout>
    );
}
