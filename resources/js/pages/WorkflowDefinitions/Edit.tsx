import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { GripVertical, Info, Plus, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type WorkflowStep = {
    id: string;
    type: string;
    config: string;
};

export default function WorkflowDefinitionEdit() {
    const { record } = usePage().props as any;

    // Safely parse JSON or default to empty array
    let initialSteps = [];
    try {
        initialSteps =
            typeof record?.steps_json === 'string'
                ? JSON.parse(record.steps_json)
                : record?.steps_json || [];
    } catch {
        initialSteps = [];
    }

    const { data, setData, put, processing, errors } = useForm({
        name: record?.name || '',
        request_type: record?.request_type || '',
        sla_hours: record?.sla_hours?.toString() || '48',
        status: record?.status || 'Draft',
        steps_json: initialSteps as WorkflowStep[],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddStep = () => {
        setData('steps_json', [
            ...data.steps_json,
            { id: crypto.randomUUID(), type: '', config: '' },
        ]);
    };

    const handleRemoveStep = (id: string) => {
        setData(
            'steps_json',
            data.steps_json.filter((step: WorkflowStep) => step.id !== id),
        );
    };

    const handleUpdateStep = (
        id: string,
        field: keyof WorkflowStep,
        value: string,
    ) => {
        setData(
            'steps_json',
            data.steps_json.map((step: WorkflowStep) =>
                step.id === id ? { ...step, [field]: value } : step,
            ),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        put(`${API}/workflow_definitions/${record.id}`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const isDraft = data.status === 'Draft';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Workflows', href: `${API}/workflow_definitions` },
                {
                    title: record?.name || 'Edit Workflow',
                    href: `${API}/workflow_definitions/${record?.id}`,
                },
                { title: 'Configure', href: '#' },
            ]}
        >
            <Head title={`Configure: ${record?.name || 'Workflow'}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8 max-w-3xl">
                        <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Providence HRMS
                        </p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Configure Workflow Routing
                        </h1>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                            Define the approval sequence and operational rules
                            for system requests.
                        </p>
                    </div>

                    <form id="workflow-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12">
                            {/* LEFT COLUMN: Form & Builder */}
                            <div className="space-y-8 lg:col-span-8">
                                {/* Basic Details */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-[11px] font-bold tracking-widest text-foreground uppercase">
                                            Basic Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Workflow Name
                                                </Label>
                                                <Input
                                                    placeholder="e.g., Annual Leave Policy"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background ${errors.name ? 'border-destructive' : ''}`}
                                                />
                                                {errors.name && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Request Type
                                                </Label>
                                                <Select
                                                    value={data.request_type}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'request_type',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background ${errors.request_type ? 'border-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Leave Request">
                                                            Leave Request
                                                        </SelectItem>
                                                        <SelectItem value="Expense Claim">
                                                            Expense Claim
                                                        </SelectItem>
                                                        <SelectItem value="Asset Allocation">
                                                            Asset Allocation
                                                        </SelectItem>
                                                        <SelectItem value="Custom">
                                                            Custom Process
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.request_type && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.request_type}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="max-w-[200px] space-y-2">
                                            <Label className="text-sm font-medium">
                                                SLA Hours
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={data.sla_hours}
                                                    onChange={(e) =>
                                                        setData(
                                                            'sla_hours',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 bg-background pr-12 font-mono"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-muted-foreground">
                                                    HRS
                                                </div>
                                            </div>
                                            <p className="pt-1 text-xs text-muted-foreground">
                                                Time allotted for total process
                                                completion before escalation.
                                            </p>
                                            {errors.sla_hours && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.sla_hours}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Approval Steps Builder */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-[11px] font-bold tracking-widest text-foreground uppercase">
                                            Approval Steps
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        {data.steps_json.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className="flex items-stretch gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 transition-all"
                                            >
                                                <div className="flex cursor-grab flex-col items-center justify-center text-muted-foreground hover:text-foreground">
                                                    <GripVertical className="h-5 w-5" />
                                                </div>
                                                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Step {index + 1}
                                                        </Label>
                                                        <Select
                                                            value={step.type}
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                handleUpdateStep(
                                                                    step.id,
                                                                    'type',
                                                                    val,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-10 bg-background">
                                                                <SelectValue placeholder="Approver Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Direct Manager">
                                                                    Direct
                                                                    Manager
                                                                </SelectItem>
                                                                <SelectItem value="Specific Role">
                                                                    Specific
                                                                    Role
                                                                </SelectItem>
                                                                <SelectItem value="Department Head">
                                                                    Department
                                                                    Head
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Configuration
                                                        </Label>
                                                        {step.type ===
                                                        'Direct Manager' ? (
                                                            <Input
                                                                value="Reports to Requestor"
                                                                readOnly
                                                                className="h-10 bg-muted/50 font-medium text-muted-foreground italic"
                                                            />
                                                        ) : (
                                                            <Select
                                                                value={
                                                                    step.config
                                                                }
                                                                onValueChange={(
                                                                    val,
                                                                ) =>
                                                                    handleUpdateStep(
                                                                        step.id,
                                                                        'config',
                                                                        val,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="h-10 bg-background">
                                                                    <SelectValue placeholder="Select Configuration" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="HR Administrator">
                                                                        HR
                                                                        Administrator
                                                                    </SelectItem>
                                                                    <SelectItem value="Finance Lead">
                                                                        Finance
                                                                        Lead
                                                                    </SelectItem>
                                                                    <SelectItem value="IT Support">
                                                                        IT
                                                                        Support
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center pt-5 pl-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            handleRemoveStep(
                                                                step.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        {data.steps_json.length === 0 && (
                                            <div className="rounded-xl border-2 border-dashed bg-background py-8 text-center text-sm text-muted-foreground">
                                                No approval steps defined.
                                                Requests will be auto-approved.
                                            </div>
                                        )}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-4 h-14 w-full border-2 border-dashed bg-background font-semibold text-muted-foreground hover:text-foreground"
                                            onClick={handleAddStep}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add New Step
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN: Settings & Info */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Status Toggle */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-row items-start justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-base font-bold text-foreground">
                                                    Workflow Status
                                                </Label>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {isDraft
                                                        ? 'Currently in draft mode'
                                                        : 'Currently active'}
                                                </p>
                                            </div>
                                            <Switch
                                                checked={!isDraft}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        'status',
                                                        checked
                                                            ? 'Active'
                                                            : 'Draft',
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                                            {isDraft ? (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                                    <span className="text-muted-foreground">
                                                        Inactive - Draft
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                    <span className="text-foreground">
                                                        Active - Published
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Guidelines Card */}
                                <Card className="border-transparent bg-foreground text-background shadow-md">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                            <Info className="h-4 w-4 opacity-80" />
                                            Routing Guidelines
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-2">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold tracking-widest uppercase opacity-90">
                                                SLA Calculation
                                            </h4>
                                            <p className="text-sm leading-relaxed font-medium opacity-80">
                                                SLA hours define the total time
                                                from request submission to final
                                                approval. Business hours (9 AM -
                                                6 PM) are used for calculation.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold tracking-widest uppercase opacity-90">
                                                Sequential Routing
                                            </h4>
                                            <p className="text-sm leading-relaxed font-medium opacity-80">
                                                Steps are processed in the order
                                                shown (top-to-bottom). If a step
                                                is rejected, the entire workflow
                                                is terminated.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold tracking-widest uppercase opacity-90">
                                                Escalation
                                            </h4>
                                            <p className="text-sm leading-relaxed font-medium opacity-80">
                                                If an approver does not act
                                                within 50% of the SLA, a
                                                reminder is sent. Failure to act
                                                within 100% triggers admin
                                                escalation.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 z-40 flex flex-col items-center justify-between gap-4 border-t bg-background p-4 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:flex-row md:px-8">
                    <div className="text-sm font-medium text-muted-foreground">
                        {data.steps_json.length > 0
                            ? 'Unsaved changes detected'
                            : ' '}
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 w-full border-border bg-background px-6 font-bold text-foreground shadow-sm sm:w-auto"
                            onClick={() =>
                                router.visit(
                                    `${API}/workflow_definitions/${record.id}`,
                                )
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="workflow-form"
                            className="h-11 w-full bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90 sm:w-auto"
                            disabled={processing || isSubmitting}
                        >
                            {processing || isSubmitting
                                ? 'Saving...'
                                : 'Save Workflow'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
