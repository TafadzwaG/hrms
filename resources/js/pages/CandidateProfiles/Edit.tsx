import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Archive,
    BarChart,
    Briefcase,
    History,
    Info,
    Save,
    User,
    UserX,
} from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import moment from 'moment';

export default function CandidateProfileEdit() {
    const { module, record, requisitions, stages, statuses } = usePage()
        .props as any;
    const basePath = `/${module?.slug || 'candidate-profiles'}`;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        full_name: record?.full_name || '',
        email: record?.email || '',
        phone: record?.phone || '',
        requisition_code: record?.requisition_code || '',
        stage: record?.stage || 'Applied',
        status: record?.status || 'Active',
        notes: record?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        put(`${basePath}/${record.id}`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleQuickAction = (statusValue: string) => {
        setData('status', statusValue);
        // Optional: you could auto-submit here if desired, but updating the state allows the user to review and click 'Update Candidate'
    };

    const selectedReq = requisitions.find(
        (r: any) => r.requisition_code === data.requisition_code,
    );
    const initials = data.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Helper for badge aesthetics
    const getStatusDisplay = (stat: string) => {
        const s = stat?.toLowerCase();
        if (s === 'active' || s === 'hired')
            return 'bg-primary/10 text-primary border-transparent';
        if (s === 'rejected' || s === 'withdrawn')
            return 'bg-muted text-muted-foreground border-transparent';
        return 'bg-secondary text-secondary-foreground border-transparent';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Candidates', href: basePath },
                {
                    title: record?.full_name || 'Candidate',
                    href: `${basePath}/${record.id}`,
                },
                { title: 'Edit Profile', href: '#' },
            ]}
        >
            <Head title={`Edit ${record?.full_name}`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-4">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Edit Candidate Profile
                            </h1>
                            <Badge
                                variant="outline"
                                className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${getStatusDisplay(data.status)}`}
                            >
                                {data.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border border-border shadow-sm">
                                <AvatarFallback className="bg-muted font-bold text-muted-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-base font-bold text-foreground">
                                    {data.full_name}
                                </p>
                                <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                                        {data.requisition_code}
                                    </span>
                                    {selectedReq?.title ||
                                        'No Requisition Selected'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form id="edit-candidate-form" onSubmit={handleSubmit}>
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
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Full Name
                                                </Label>
                                                <Input
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
                                            {/* Location is mocked as per screenshot, leaving disabled as it isn't in model */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-muted-foreground">
                                                    Location (System Extracted)
                                                </Label>
                                                <Input
                                                    disabled
                                                    value="San Francisco, CA"
                                                    className="h-11 bg-muted/50 text-base text-muted-foreground"
                                                />
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
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
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

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-muted-foreground">
                                                    Application Date (Immutable)
                                                </Label>
                                                <Input
                                                    disabled
                                                    value={moment(
                                                        record?.created_at,
                                                    ).format('MM/DD/YYYY')}
                                                    className="h-11 bg-muted/50 text-base text-muted-foreground"
                                                />
                                            </div>

                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-sm font-semibold">
                                                    Internal Notes
                                                </Label>
                                                <Textarea
                                                    placeholder="Update screening remarks or evaluation notes..."
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
                                                            Target Date
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                            {selectedReq.target_start_date
                                                                ? moment(
                                                                      selectedReq.target_start_date,
                                                                  ).format(
                                                                      'MMM DD, YYYY',
                                                                  )
                                                                : 'Not Set'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-4 text-sm font-medium text-muted-foreground">
                                                No requisition selected.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Management Actions */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Management Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-full justify-start border-border bg-background font-medium text-foreground shadow-sm hover:bg-muted"
                                            onClick={() =>
                                                handleQuickAction('On Hold')
                                            }
                                        >
                                            <Archive className="mr-3 h-4 w-4 text-muted-foreground" />{' '}
                                            Archive Candidate
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-full justify-start border-destructive/20 bg-destructive/5 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() =>
                                                handleQuickAction('Rejected')
                                            }
                                        >
                                            <UserX className="mr-3 h-4 w-4" />{' '}
                                            Reject Candidate
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* System Registry / History */}
                                <Card className="border-dashed border-border bg-muted/20 shadow-sm">
                                    <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                                        <History className="mb-1 h-6 w-6 text-muted-foreground/50" />
                                        <p className="text-sm font-bold text-foreground">
                                            Last updated by Admin
                                        </p>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {moment(record?.updated_at).format(
                                                'MMM DD, YYYY [at] hh:mm A',
                                            )}
                                        </p>
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
                        you click update.
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full font-bold text-muted-foreground hover:text-foreground sm:w-auto"
                            onClick={() =>
                                router.visit(`${basePath}/${record.id}`)
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="edit-candidate-form"
                            className="w-full bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
                            disabled={processing || isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing || isSubmitting
                                ? 'Saving...'
                                : 'Update Candidate'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
