import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle2, Eye, Pencil, Users } from 'lucide-react';

type ScorecardSummary = {
    id: number;
    employee: { id: number; full_name: string; staff_number: string };
    status: string;
    overall_score: number | null;
    overall_rating: string | null;
};

type CycleDetail = {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: string;
    self_assessment_enabled: boolean;
    created_at: string;
    scorecards: ScorecardSummary[];
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case 'draft':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'active':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'review_in_progress':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'moderation':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'finalized':
            return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'archived':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function scorecardStatusBadgeClass(status: string) {
    switch (status) {
        case 'draft':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'self_assessment_pending':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'self_assessment_submitted':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'manager_review_pending':
            return 'bg-orange-50 text-orange-600 border-orange-200';
        case 'manager_reviewed':
            return 'bg-indigo-50 text-indigo-600 border-indigo-200';
        case 'hr_moderation_pending':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'finalized':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'archived':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

function ratingBadgeClass(rating: string) {
    switch (rating?.toLowerCase()) {
        case 'outstanding':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'very good':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'good':
            return 'bg-teal-50 text-teal-600 border-teal-200';
        case 'needs improvement':
            return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'unsatisfactory':
            return 'bg-red-50 text-red-600 border-red-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

export default function CycleShow() {
    const { cycle } = usePage<{ cycle: CycleDetail }>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Cycles', href: '/performance-cycles' },
                { title: cycle.title, href: '#' },
            ]}
        >
            <Head title={cycle.title} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/performance-cycles">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{cycle.title}</h1>
                                <Badge variant="outline" className={statusBadgeClass(cycle.status)}>
                                    {formatStatus(cycle.status)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {cycle.start_date} &mdash; {cycle.end_date}
                            </p>
                        </div>
                    </div>
                    <Link href={`/performance-cycles/${cycle.id}/edit`}>
                        <Button variant="outline">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Cycle
                        </Button>
                    </Link>
                </div>

                {/* Info Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {cycle.description || 'No description provided.'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Self-Assessment</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline" className={cycle.self_assessment_enabled ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}>
                                {cycle.self_assessment_enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Created</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{cycle.created_at}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Scorecards Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Scorecards</CardTitle>
                        <CardDescription>
                            {cycle.scorecards.length} scorecard{cycle.scorecards.length !== 1 ? 's' : ''} in this cycle
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {cycle.scorecards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No scorecards yet</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Assign employee scorecards to this cycle to get started.
                                </p>
                                <Link href="/employee-scorecards/create">
                                    <Button variant="outline">Assign Scorecard</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Staff Number</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Overall Score</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cycle.scorecards.map((sc) => (
                                            <TableRow key={sc.id}>
                                                <TableCell className="font-medium">{sc.employee.full_name}</TableCell>
                                                <TableCell className="font-mono text-xs">{sc.employee.staff_number}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={scorecardStatusBadgeClass(sc.status)}>
                                                        {formatStatus(sc.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {sc.overall_score != null ? sc.overall_score.toFixed(1) : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {sc.overall_rating ? (
                                                        <Badge variant="outline" className={ratingBadgeClass(sc.overall_rating)}>
                                                            {sc.overall_rating}
                                                        </Badge>
                                                    ) : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/employee-scorecards/${sc.id}`}>
                                                        <Button variant="ghost" size="icon" title="View">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
