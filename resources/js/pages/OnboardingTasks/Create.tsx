import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    CheckCircle2,
    ClipboardList,
    Clock,
    Info,
    HelpCircle,
    Calendar,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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

export default function OnboardingTaskCreate() {
    const { employees, statusOptions } = usePage().props as unknown as {
        employees: Employee[];
        statusOptions: string[];
    };

    const basePath = '/onboarding-tasks';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        task_name: '',
        owner_team: '',
        due_date: '',
        status: 'pending',
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

    // Helper to format status labels
    const formatStatus = (stat: string) => {
        if (stat === 'in_progress') return 'In Progress';
        return stat.charAt(0).toUpperCase() + stat.slice(1);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tasks', href: basePath },
                { title: 'Create Task', href: '#' },
            ]}
        >
            <Head title="Create New Task" />

            {/* Changed from max-w-6xl mx-auto to w-full to span the screen */}
            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                <div className="w-full flex-1 p-4 md:p-8 lg:p-12">
                    {/* Header */}
                    <div className="mb-8 space-y-4">
                        <Button
                            variant="ghost"
                            className="h-8 px-0 font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
                            onClick={() => router.visit(basePath)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Dashboard
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Create New Task
                            </h1>
                            <p className="mt-1 text-base text-muted-foreground">
                                Assign and schedule a new task for your team
                                members.
                            </p>
                        </div>
                    </div>

                    <form id="create-task-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                            {/* LEFT COLUMN: Form Section */}
                            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="text-lg font-bold text-foreground">
                                            Task Information
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Provide specific details for the
                                            task assignment.
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-4 md:p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                            {/* Assigned Employee */}
                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-sm font-semibold">
                                                    Assigned Employee
                                                </Label>
                                                <Select
                                                    value={data.employee_id}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'employee_id',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.employee_id ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Search employee name..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employees.map(
                                                            (emp) => (
                                                                <SelectItem
                                                                    key={emp.id}
                                                                    value={emp.id.toString()}
                                                                >
                                                                    {
                                                                        emp.first_name
                                                                    }{' '}
                                                                    {
                                                                        emp.surname
                                                                    }{' '}
                                                                    (
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

                                            {/* Task Name */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Task Name
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Q4 Performance Review"
                                                    value={data.task_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'task_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`h-11 bg-background text-base ${errors.task_name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    required
                                                />
                                                {errors.task_name && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.task_name}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Owner Team */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Owner Team
                                                </Label>
                                                <Select
                                                    value={data.owner_team}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'owner_team',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 bg-background text-base ${errors.owner_team ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    >
                                                        <SelectValue placeholder="Select Team" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="IT Department">
                                                            IT Department
                                                        </SelectItem>
                                                        <SelectItem value="Human Resources">
                                                            Human Resources
                                                        </SelectItem>
                                                        <SelectItem value="Finance">
                                                            Finance
                                                        </SelectItem>
                                                        <SelectItem value="Operations">
                                                            Operations
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.owner_team && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.owner_team}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Due Date */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Due Date
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="date"
                                                        value={data.due_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                'due_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`h-11 bg-background pl-10 text-base ${errors.due_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    />
                                                </div>
                                                {errors.due_date && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.due_date}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Initial Status */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold">
                                                    Initial Status
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
                                                        {statusOptions.map(
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

                                            {/* Task Notes */}
                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-sm font-semibold">
                                                    Task Notes & Instructions
                                                </Label>
                                                <Textarea
                                                    placeholder="Describe the task expectations, required resources, or specific steps to be taken..."
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            'notes',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="min-h-[140px] resize-none bg-background text-base"
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

                            {/* RIGHT COLUMN: Context & Guidelines */}
                            <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                                {/* Guidelines Card */}
                                <Card className="border-border bg-muted/20 shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                            <Info className="h-5 w-5 text-primary" />
                                            Task Guidelines
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Clear Ownership
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                    Ensure the assigned team
                                                    matches the task's technical
                                                    or operational domain.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    SLA Reminders
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                    Most tasks have a default
                                                    48-hour response time. Set
                                                    due dates accordingly.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Bell className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Employee Notifications
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-muted-foreground">
                                                    The employee will receive an
                                                    instant email and push
                                                    notification once you save
                                                    this task.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-start gap-3 rounded-md border border-border bg-background p-4">
                                            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                            <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                                Need help? Contact the Admin
                                                Support team for complex task
                                                orchestration.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Capacity Metric */}
                                <Card className="border-dashed border-border bg-muted/40 shadow-sm">
                                    <CardContent className="space-y-4 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
                                                <ClipboardList className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                                    Pending Tasks
                                                </p>
                                                <p className="mt-0.5 text-2xl font-extrabold text-foreground">
                                                    12
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 pt-2">
                                            <Progress
                                                value={68}
                                                className="h-2.5 border border-border bg-background"
                                            />
                                            <p className="text-[10px] font-medium text-muted-foreground">
                                                Your department capacity: 68%
                                                utilized
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer Navigation - Stretches full width */}
                <div className="sticky bottom-0 z-40 flex w-full items-center justify-end gap-4 border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-12">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-border bg-background px-8 font-bold text-foreground shadow-sm"
                        onClick={() => router.visit(basePath)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-task-form"
                        className="h-11 bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                        disabled={processing || isSubmitting}
                    >
                        {processing || isSubmitting ? 'Saving...' : 'Save Task'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
