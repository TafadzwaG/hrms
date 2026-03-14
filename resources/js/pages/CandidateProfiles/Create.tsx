import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    BarChart,
    Briefcase,
    Building2,
    Calendar,
    ChevronLeft,
    Info,
    Save,
    User,
} from 'lucide-react';
import { useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';

export default function CandidateProfileCreate() {
    const {
        module,
        requisitions,
        selected_requisition_code,
        stages,
        statuses,
    } = usePage().props as any;
    const basePath = `/${module?.slug || 'candidate-profiles'}`;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone: '',
        requisition_code: selected_requisition_code || '',
        stage: 'Applied',
        status: 'Active',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(basePath, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Auto-populate the Requisition Summary side-card
    const selectedReq = requisitions.find(
        (r: any) => r.requisition_code === data.requisition_code,
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Candidates', href: basePath },
                { title: 'Add Candidate', href: '#' },
            ]}
        >
            <Head title="Add Candidate Profile" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            New Candidate Profile
                        </h1>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                            Manually add a candidate and assign them to an
                            active job requisition.
                        </p>
                    </div>

                    <form id="create-candidate-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN: Form Fields */}
                            <div className="space-y-6 lg:col-span-8">
                                {/* Personal Information */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <User className="h-5 w-5 text-primary" />
                                            Personal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Full Name
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Sarah Miller"
                                                    value={data.full_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'full_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.full_name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.full_name && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.full_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    type="email"
                                                    placeholder="e.g. sarah.miller@example.com"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    type="tel"
                                                    placeholder="+1 (555) 0123-4567"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.phone && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Application Details */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <BarChart className="h-5 w-5 text-primary" />
                                            Application Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 md:p-8">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-sm font-semibold">
                                                    Target Requisition
                                                </Label>
                                                <Select
                                                    value={
                                                        data.requisition_code
                                                    }
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'requisition_code',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.requisition_code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select a job requisition" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {requisitions.map(
                                                            (req: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        req.requisition_code
                                                                    }
                                                                    value={
                                                                        req.requisition_code
                                                                    }
                                                                >
                                                                    {req.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.requisition_code && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {
                                                            errors.requisition_code
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Current Stage
                                                </Label>
                                                <Select
                                                    value={data.stage}
                                                    onValueChange={(val) =>
                                                        setData('stage', val)
                                                    }
                                                >
                                                    <SelectTrigger className="h-11 bg-background text-base">
                                                        <SelectValue placeholder="Select Stage" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {stages.map(
                                                            (st: string) => (
                                                                <SelectItem
                                                                    key={st}
                                                                    value={st}
                                                                >
                                                                    {st}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.stage && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.stage}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Candidate Status
                                                </Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(val) =>
                                                        setData('status', val)
                                                    }
                                                >
                                                    <SelectTrigger className="h-11 bg-background text-base">
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statuses.map(
                                                            (st: string) => (
                                                                <SelectItem
                                                                    key={st}
                                                                    value={st}
                                                                >
                                                                    {st}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-sm font-semibold">
                                                    Internal Notes
                                                </Label>
                                                <Textarea
                                                    placeholder="Add screening remarks or preliminary evaluation notes..."
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            'notes',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="min-h-[120px] resize-none bg-background text-base"
                                                />
                                                {errors.notes && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN: Side Panels */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Requisition Summary */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Requisition Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        {selectedReq ? (
                                            <>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Hiring Manager
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                            {selectedReq.hiring_manager ||
                                                                'Unassigned'}
                                                        </p>
                                                    </div>
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                        <Briefcase className="h-4 w-4" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Department
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                            {
                                                                selectedReq.department
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Req Status
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                            {selectedReq.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="rounded-lg border-2 border-dashed border-border py-6 text-center text-sm font-medium text-muted-foreground">
                                                Select a target requisition to
                                                view summary.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* System Help */}
                                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                    <CardContent className="flex items-start gap-3 p-5">
                                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                        <div className="text-sm leading-relaxed font-medium text-primary/90">
                                            Candidates added manually will be
                                            placed directly into the selected
                                            stage. They will not receive
                                            automated confirmation emails unless
                                            configured in global settings.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-between border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:flex">
                        <Info className="h-4 w-4" /> Changes are only saved once
                        you click create.
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full font-bold text-muted-foreground hover:text-foreground sm:w-auto"
                            onClick={() => router.visit(basePath)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="create-candidate-form"
                            className="w-full bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
                            disabled={processing || isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing || isSubmitting
                                ? 'Saving...'
                                : 'Add Candidate'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
