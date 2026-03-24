import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle2, Info, Users } from 'lucide-react';
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

type Employee = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
};

export default function PerformanceReviewCreate() {
    const { employees, statusOptions } = usePage().props as unknown as {
        employees: Employee[];
        statusOptions: string[];
    };

    const basePath = '/performance-reviews';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        cycle_name: '',
        reviewer_name: '',
        status: 'planning', // Default based on screenshot context
        review_date: '',
        comments: '',
        rating: '',
    });

    const handleSubmit = (e: React.FormEvent, forceDraft: boolean = false) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (forceDraft) {
            setData('status', 'planning');
        }

        post(basePath, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Format helper for status
    const formatStatus = (stat: string) => {
        if (stat === 'in_progress') return 'In Progress';
        return stat.charAt(0).toUpperCase() + stat.slice(1);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: basePath },
                { title: 'Create Review Cycle', href: '#' },
            ]}
        >
            <Head title="Create Review Cycle" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                {/* Changed to full width by removing max-w limits */}
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Create Review Cycle
                        </h1>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                            Initiate a new organizational review period for your
                            employees.
                        </p>
                    </div>

                    <form
                        id="create-review-form"
                        onSubmit={(e) => handleSubmit(e, false)}
                    >
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN: Main Form Sections (Spans wider on large screens) */}
                            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                                {/* Basic Information */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                <Info className="h-4 w-4" />
                                            </div>
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Cycle Name
                                            </Label>
                                            <Input
                                                placeholder="e.g., 2024 Annual Performance Review"
                                                value={data.cycle_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'cycle_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background text-base ${errors.cycle_name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                required
                                            />
                                            {errors.cycle_name && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.cycle_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Target Employee
                                            </Label>
                                            <Select
                                                value={data.employee_id}
                                                onValueChange={(val) =>
                                                    setData('employee_id', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`h-11 bg-background text-base ${errors.employee_id ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                >
                                                    <SelectValue placeholder="Search employee..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(employees || []).map(
                                                        (emp) => (
                                                            <SelectItem
                                                                key={emp.id}
                                                                value={emp.id.toString()}
                                                            >
                                                                {emp.first_name}{' '}
                                                                {emp.surname} (
                                                                {
                                                                    emp.staff_number
                                                                }
                                                                )
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.employee_id && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.employee_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Description / Goals
                                            </Label>
                                            <Textarea
                                                placeholder="Enter a brief overview of the cycle goals..."
                                                value={data.comments}
                                                onChange={(e) =>
                                                    setData(
                                                        'comments',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[120px] resize-none bg-background text-base"
                                            />
                                            {errors.comments && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.comments}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3 md:w-1/2 xl:w-1/3">
                                            <Label className="text-sm font-semibold">
                                                Review Type / Status
                                            </Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(val) =>
                                                    setData('status', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`h-11 bg-background text-base ${errors.status ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                >
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(statusOptions || []).map(
                                                        (stat) => (
                                                            <SelectItem
                                                                key={stat}
                                                                value={stat}
                                                            >
                                                                {formatStatus(
                                                                    stat,
                                                                )}
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
                                    </CardContent>
                                </Card>

                                {/* Timeline Configuration */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            Timeline Configuration
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Review Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={data.review_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'review_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.review_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                {errors.review_date && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.review_date}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Assigned Reviewer
                                                </Label>
                                                <Input
                                                    placeholder="Manager Name"
                                                    value={data.reviewer_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'reviewer_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.reviewer_name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.reviewer_name && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.reviewer_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Participant Eligibility */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-5">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            Participant Eligibility
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6 md:p-8">
                                        <div className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-primary bg-primary/5 p-4">
                                            <div className="h-4 w-4 rounded-full border-[5px] border-primary" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    All Employees
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Include every active member
                                                    of the organization.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-background p-4 opacity-70 transition-colors hover:bg-muted/30">
                                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Specific Departments/Teams
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Select individual units for
                                                    this targeted review.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN: Side Panels */}
                            <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                                {/* Cycle Setup Guide */}
                                <Card className="border-border bg-muted/20 shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Info className="h-4 w-4 text-primary" />
                                            Cycle Setup Guide
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <CheckCircle2 className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Set Realistic Deadlines
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                    Allow at least 2 weeks for
                                                    self-assessments and another
                                                    2 weeks for managers to
                                                    review.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <CheckCircle2 className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Audit Reporting Lines
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                    Ensure all eligible
                                                    employees have an assigned
                                                    manager to avoid workflow
                                                    blocks.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 rounded-md border border-border bg-background p-4">
                                            <p className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Need Help?
                                            </p>
                                            <Button
                                                variant="link"
                                                className="h-auto p-0 text-xs font-bold text-primary"
                                            >
                                                View Documentation &rarr;
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Previous Cycles */}
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                                        <CardTitle className="text-sm font-bold text-foreground">
                                            Previous Cycles
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="cursor-pointer border-b border-border/50 p-4 transition-colors hover:bg-muted/10">
                                            <p className="text-sm font-bold text-foreground">
                                                2023 Mid-Year Review
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                Completed: Aug 2023
                                            </p>
                                        </div>
                                        <div className="cursor-pointer p-4 transition-colors hover:bg-muted/10">
                                            <p className="text-sm font-bold text-foreground">
                                                2023 Annual Review
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                Completed: Dec 2023
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer Actions */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-end gap-4 border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-12">
                    <Button
                        type="button"
                        variant="ghost"
                        className="font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => router.visit(basePath)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-border bg-background px-8 font-bold text-foreground shadow-sm"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={processing || isSubmitting}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        type="submit"
                        form="create-review-form"
                        className="h-11 bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                        disabled={processing || isSubmitting}
                    >
                        {processing || isSubmitting
                            ? 'Saving...'
                            : 'Launch Cycle'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
