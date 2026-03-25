import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';

type Plan = {
    id: number;
    title: string;
    description: string | null;
    objectives: string | null;
    support_required: string | null;
    start_date: string;
    end_date: string;
    status: string;
    outcome: string | null;
    created_at: string;
    updated_at: string;
    employee: {
        id: number;
        first_name: string;
        middle_name: string | null;
        surname: string;
        staff_number: string;
    } | null;
    scorecard: {
        id: number;
        overall_score: number | null;
        overall_rating: string | null;
        cycle: { id: number; title: string } | null;
        items: Array<{
            id: number;
            perspective: string;
            kpi_name: string;
            score: number | null;
            weight: number | null;
        }>;
    } | null;
    creator: { id: number; name: string } | null;
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case 'active':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'on_track':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'at_risk':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'completed':
            return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'cancelled':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function employeeName(emp: Plan['employee']) {
    if (!emp) return '—';
    return [emp.first_name, emp.middle_name, emp.surname].filter(Boolean).join(' ');
}

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

export default function ImprovementPlanShow() {
    const { plan } = usePage<{ plan: Plan }>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Improvement Plans', href: '/improvement-plans' },
                { title: plan.title, href: '#' },
            ]}
        >
            <Head title={plan.title} />

            <div className="mx-auto w-full space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/improvement-plans">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{plan.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Performance Improvement Plan
                            </p>
                        </div>
                    </div>
                    <Link href={`/improvement-plans/${plan.id}/edit`}>
                        <Button variant="outline">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Plan
                        </Button>
                    </Link>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">Employee</div>
                            <div className="mt-1 text-lg font-semibold">{employeeName(plan.employee)}</div>
                            {plan.employee && (
                                <p className="text-xs text-muted-foreground">{plan.employee.staff_number}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">Status</div>
                            <div className="mt-2">
                                <Badge variant="outline" className={statusBadgeClass(plan.status)}>
                                    {formatStatus(plan.status)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">Period</div>
                            <div className="mt-1 text-sm font-semibold">
                                {plan.start_date} &mdash; {plan.end_date}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">Review Cycle</div>
                            <div className="mt-1 text-lg font-semibold">
                                {plan.scorecard?.cycle?.title ?? '—'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Plan Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {plan.description && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                <p className="mt-1 whitespace-pre-line text-sm">{plan.description}</p>
                            </div>
                        )}
                        {plan.objectives && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Objectives</h4>
                                <p className="mt-1 whitespace-pre-line text-sm">{plan.objectives}</p>
                            </div>
                        )}
                        {plan.support_required && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Support Required</h4>
                                <p className="mt-1 whitespace-pre-line text-sm">{plan.support_required}</p>
                            </div>
                        )}
                        {plan.outcome && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Outcome</h4>
                                <p className="mt-1 whitespace-pre-line text-sm">{plan.outcome}</p>
                            </div>
                        )}
                        {plan.creator && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                                <p className="mt-1 text-sm">{plan.creator.name}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Linked Scorecard */}
                {plan.scorecard && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Linked Scorecard</CardTitle>
                            <CardDescription>
                                Score: {plan.scorecard.overall_score ? `${Number(plan.scorecard.overall_score).toFixed(1)}%` : '—'}
                                {plan.scorecard.overall_rating ? ` (${plan.scorecard.overall_rating})` : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {plan.scorecard.items && plan.scorecard.items.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="pb-2 font-medium">KPI</th>
                                                <th className="pb-2 font-medium">Perspective</th>
                                                <th className="pb-2 font-medium">Weight</th>
                                                <th className="pb-2 font-medium">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plan.scorecard.items.map((item) => (
                                                <tr key={item.id} className="border-b last:border-0">
                                                    <td className="py-2">{item.kpi_name}</td>
                                                    <td className="py-2">
                                                        {perspectiveLabels[item.perspective] ?? item.perspective}
                                                    </td>
                                                    <td className="py-2">{item.weight ?? '—'}</td>
                                                    <td className="py-2">{item.score ?? '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No scorecard items.</p>
                            )}
                            <div className="mt-4">
                                <Link href={`/employee-scorecards/${plan.scorecard.id}`}>
                                    <Button variant="outline" size="sm">View Full Scorecard</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
