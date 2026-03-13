import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Clock,
    Eye,
    Info,
    Layers,
    Network,
    Save,
    Settings,
    Users,
} from 'lucide-react';
import { useState } from 'react';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type OrgUnit = {
    id: number;
    name: string;
    type: string;
};

export default function PositionCreate() {
    const { departments } = usePage().props as unknown as {
        departments: OrgUnit[];
    };

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        org_unit_id: '',
        description: '',
        is_active: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(`${API}/positions`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Helper to get department name for the live preview
    const selectedDepartmentName =
        departments.find((d) => d.id.toString() === data.org_unit_id)?.name ||
        'Unassigned';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Positions', href: `${API}/positions` },
                { title: 'Create Position', href: '#' },
            ]}
        >
            <Head title="Create New Position" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Create New Position
                            </h1>
                            <p className="mt-2 text-base text-muted-foreground">
                                Configure organizational role parameters and
                                hierarchy details.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
                            DRAFTING MODE
                        </div>
                    </div>

                    <form id="position-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12">
                            {/* LEFT COLUMN: Form Sections */}
                            <div className="space-y-8 lg:col-span-8">
                                {/* Basic Details */}
                                <div className="space-y-4">
                                    <div className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-wider text-foreground uppercase">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                        Basic Details
                                    </div>
                                    <Card className="border-border shadow-sm">
                                        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                    Position Title
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Senior Software Engineer"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-xs font-medium text-destructive">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                    Job Code
                                                </Label>
                                                <Input
                                                    placeholder="e.g. SWE-001"
                                                    value={data.code}
                                                    onChange={(e) =>
                                                        setData(
                                                            'code',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                {errors.code ? (
                                                    <p className="mt-1 text-xs font-medium text-destructive">
                                                        {errors.code}
                                                    </p>
                                                ) : (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Job Code must be unique
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Hierarchy & Assignment */}
                                <div className="space-y-4">
                                    <div className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-wider text-foreground uppercase">
                                        <Network className="h-4 w-4 text-primary" />
                                        Hierarchy & Assignment
                                    </div>
                                    <Card className="border-border shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="max-w-md space-y-2">
                                                <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                    Department / Org Unit
                                                </Label>
                                                <Select
                                                    value={data.org_unit_id}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'org_unit_id',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.org_unit_id ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select Department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map(
                                                            (dept) => (
                                                                <SelectItem
                                                                    key={
                                                                        dept.id
                                                                    }
                                                                    value={dept.id.toString()}
                                                                >
                                                                    {dept.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.org_unit_id && (
                                                    <p className="mt-1 text-xs font-medium text-destructive">
                                                        {errors.org_unit_id}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Configuration */}
                                <div className="space-y-4">
                                    <div className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-wider text-foreground uppercase">
                                        <Settings className="h-4 w-4 text-primary" />
                                        Configuration
                                    </div>
                                    <Card className="border-border shadow-sm">
                                        <CardContent className="space-y-8 p-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                    Role Description
                                                </Label>
                                                <Textarea
                                                    placeholder="Briefly describe the responsibilities and scope of this role..."
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`min-h-[120px] resize-none bg-background text-base ${errors.description ? 'border-destructive' : ''}`}
                                                />
                                                {errors.description && (
                                                    <p className="mt-1 text-xs font-medium text-destructive">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-row items-center justify-between rounded-lg border bg-muted/20 p-4">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base font-bold text-foreground">
                                                        Active Status
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Mark this position as
                                                        open for recruitment and
                                                        headcount tracking.
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={data.is_active}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setData(
                                                            'is_active',
                                                            checked,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Preview & Context */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Live Preview Card */}
                                <Card className="overflow-hidden border-transparent bg-primary text-primary-foreground shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between border-b border-primary-foreground/10 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-90">
                                            <Eye className="h-4 w-4" />
                                            Position Live Preview
                                        </CardTitle>
                                        {data.is_active ? (
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-500/30 bg-emerald-500/20 px-2 py-0 text-[9px] tracking-widest text-emerald-300 uppercase"
                                            >
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="border-transparent bg-primary-foreground/10 px-2 py-0 text-[9px] tracking-widest text-primary-foreground/70 uppercase"
                                            >
                                                Inactive
                                            </Badge>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-60">
                                                Position Title
                                            </p>
                                            <h3 className="text-xl leading-tight font-bold">
                                                {data.name || 'Position Title'}
                                            </h3>
                                            <p className="mt-1 text-sm font-medium text-primary-foreground/70">
                                                {data.code || 'JOB-CODE'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 border-y border-primary-foreground/10 py-4">
                                            <div>
                                                <p className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-60">
                                                    Department
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {selectedDepartmentName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-60">
                                                    Org Level
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    Standard Role
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-1.5 text-[10px] font-bold tracking-widest uppercase opacity-60">
                                                Role Summary
                                            </p>
                                            <p className="line-clamp-4 min-h-[80px] text-sm leading-relaxed opacity-90">
                                                {data.description ||
                                                    'Description will appear here...'}
                                            </p>
                                        </div>
                                    </CardContent>
                                    <div className="flex items-center gap-3 bg-primary-foreground/5 p-4 text-xs opacity-80">
                                        <Users className="h-4 w-4 shrink-0" />
                                        <p>
                                            This role will be visible to all
                                            department heads once saved.
                                        </p>
                                    </div>
                                </Card>

                                {/* Guidelines Card */}
                                <Card className="border-border bg-muted/30 shadow-sm">
                                    <CardHeader className="border-b pb-3">
                                        <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-foreground uppercase">
                                            <Info className="h-4 w-4 text-primary" />
                                            HR Guidelines
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <ul className="list-disc space-y-4 pl-4 text-sm font-medium text-muted-foreground marker:text-primary">
                                            <li className="pl-1">
                                                Job Codes are essential for
                                                cross-system integration
                                                (ERP/Payroll).
                                            </li>
                                            <li className="pl-1">
                                                Inactive status stops new job
                                                postings without terminating
                                                existing contracts.
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 z-40 flex flex-col items-center justify-between gap-4 border-t bg-background p-4 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:flex-row md:px-8">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Last saved: Just now
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full font-bold text-muted-foreground hover:text-foreground sm:w-auto"
                            onClick={() => router.visit(`${API}/positions`)}
                        >
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            form="position-form"
                            className="w-full px-8 font-bold shadow-sm sm:w-auto"
                            disabled={processing || isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing || isSubmitting
                                ? 'Saving...'
                                : 'Finalize Position'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
