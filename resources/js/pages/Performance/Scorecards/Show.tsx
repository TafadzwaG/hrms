import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    FileText,
    MessageSquare,
    Pencil,
    Send,
    Target,
    Upload,
    User,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type ScorecardItem = {
    id: number;
    perspective: string;
    kpi_name: string;
    description: string | null;
    weight: number;
    target_type: string;
    target_value: number | null;
    actual_value: number | null;
    self_score: number | null;
    manager_score: number | null;
    final_score: number | null;
    comments: string | null;
};

type Comment = {
    id: number;
    comment_type: string;
    content: string;
    created_at: string;
    user: { id: number; name: string } | null;
};

type Evidence = {
    id: number;
    title: string;
    file_path: string | null;
    description: string | null;
    created_at: string;
};

type ImprovementPlan = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
};

type ScorecardDetail = {
    id: number;
    status: string;
    overall_score: number | null;
    overall_rating: string | null;
    notes: string | null;
    finalized_at: string | null;
    created_at: string;
    updated_at: string;
    employee: { id: number; full_name: string; staff_number: string };
    cycle: { id: number; title: string; start_date: string; end_date: string };
    items: ScorecardItem[];
    comments: Comment[];
    evidence: Evidence[];
    improvement_plan: ImprovementPlan | null;
};

type PerspectiveBreakdown = {
    items_count: number;
    total_weight: number;
    average_score: number | null;
};

const perspectiveLabels: Record<string, string> = {
    financial: 'Financial',
    customer: 'Customer',
    internal_process: 'Internal Process',
    learning_and_growth: 'Learning & Growth',
};

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClass(status: string) {
    switch (status) {
        case 'draft':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'self_assessment_pending':
            return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        case 'self_assessment_submitted':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'manager_review_pending':
            return 'bg-orange-50 text-orange-600 border-orange-200';
        case 'manager_reviewed':
            return 'bg-indigo-50 text-indigo-600 border-indigo-200';
        case 'hr_moderation_pending':
            return 'bg-purple-50 text-purple-600 border-purple-200';
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

export default function ScorecardShow() {
    const {
        scorecard,
        perspectiveBreakdown,
        perspectives,
        commentTypes,
    } = usePage<{
        scorecard: ScorecardDetail;
        perspectiveBreakdown: Record<string, PerspectiveBreakdown>;
        ratingBands: string[];
        statuses: string[];
        perspectives: string[];
        targetTypes: string[];
        commentTypes: string[];
    }>().props;

    const [activePerspective, setActivePerspective] = useState(perspectives[0] ?? 'financial');

    // Comment form
    const commentForm = useForm({
        comment_type: commentTypes[0] ?? 'general',
        content: '',
    });

    const handleCommentSubmit = (e: FormEvent) => {
        e.preventDefault();
        commentForm.post(`/employee-scorecards/${scorecard.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset('content'),
        });
    };

    // Evidence form
    const evidenceForm = useForm({
        title: '',
        description: '',
        file: null as File | null,
    });

    const handleEvidenceSubmit = (e: FormEvent) => {
        e.preventDefault();
        evidenceForm.post(`/employee-scorecards/${scorecard.id}/evidence`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => evidenceForm.reset(),
        });
    };

    // Workflow actions
    const handleWorkflowAction = (action: string) => {
        router.post(`/employee-scorecards/${scorecard.id}/${action}`, {}, {
            preserveScroll: true,
        });
    };

    const perspectiveItems = scorecard.items.filter(
        (item) => item.perspective === activePerspective,
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Scorecards', href: '/employee-scorecards' },
                { title: scorecard.employee.full_name, href: '#' },
            ]}
        >
            <Head title={`Scorecard - ${scorecard.employee.full_name}`} />

            <div className="mx-auto w-full space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/employee-scorecards">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {scorecard.employee.full_name}
                                </h1>
                                <Badge variant="outline" className={statusBadgeClass(scorecard.status)}>
                                    {formatStatus(scorecard.status)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {scorecard.cycle.title} &mdash; {scorecard.employee.staff_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {scorecard.status === 'self_assessment_pending' && (
                            <Button onClick={() => handleWorkflowAction('submit-self-assessment')}>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Self-Assessment
                            </Button>
                        )}
                        {scorecard.status === 'manager_review_pending' && (
                            <Button onClick={() => handleWorkflowAction('submit-manager-review')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Submit Manager Review
                            </Button>
                        )}
                        {scorecard.status === 'hr_moderation_pending' && (
                            <Button onClick={() => handleWorkflowAction('finalize')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Finalize
                            </Button>
                        )}
                        <Link href={`/employee-scorecards/${scorecard.id}/edit`}>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="perspectives">Perspectives</TabsTrigger>
                        <TabsTrigger value="evidence">Evidence</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Employee</CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-semibold">{scorecard.employee.full_name}</div>
                                    <p className="text-xs font-mono text-muted-foreground">{scorecard.employee.staff_number}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Cycle</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-semibold">{scorecard.cycle.title}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {scorecard.cycle.start_date} &mdash; {scorecard.cycle.end_date}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {scorecard.overall_score != null ? scorecard.overall_score.toFixed(1) : '--'}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Rating</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {scorecard.overall_rating ? (
                                        <Badge variant="outline" className={ratingBadgeClass(scorecard.overall_rating)}>
                                            {scorecard.overall_rating}
                                        </Badge>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Not yet rated</span>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Perspective Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Perspective Summary</CardTitle>
                                <CardDescription>
                                    Balanced scorecard breakdown by perspective.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Perspective</TableHead>
                                                <TableHead>KPIs</TableHead>
                                                <TableHead>Total Weight</TableHead>
                                                <TableHead>Average Score</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {perspectives.map((p) => {
                                                const bd = perspectiveBreakdown[p];
                                                return (
                                                    <TableRow key={p}>
                                                        <TableCell className="font-medium">
                                                            {perspectiveLabels[p] ?? formatStatus(p)}
                                                        </TableCell>
                                                        <TableCell>{bd?.items_count ?? 0}</TableCell>
                                                        <TableCell>{bd?.total_weight ?? 0}%</TableCell>
                                                        <TableCell>
                                                            {bd?.average_score != null
                                                                ? bd.average_score.toFixed(1)
                                                                : '--'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        {scorecard.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {scorecard.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Improvement Plan */}
                        {scorecard.improvement_plan && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Improvement Plan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <span className="text-sm font-medium">Title:</span>{' '}
                                        <span className="text-sm">{scorecard.improvement_plan.title}</span>
                                    </div>
                                    {scorecard.improvement_plan.description && (
                                        <div>
                                            <span className="text-sm font-medium">Description:</span>{' '}
                                            <span className="text-sm text-muted-foreground">
                                                {scorecard.improvement_plan.description}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm">
                                        <span>
                                            <span className="font-medium">Status:</span>{' '}
                                            {formatStatus(scorecard.improvement_plan.status)}
                                        </span>
                                        {scorecard.improvement_plan.start_date && (
                                            <span>
                                                <span className="font-medium">Period:</span>{' '}
                                                {scorecard.improvement_plan.start_date} &mdash; {scorecard.improvement_plan.end_date}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Perspectives Tab */}
                    <TabsContent value="perspectives" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>KPI Items by Perspective</CardTitle>
                                <CardDescription>
                                    Review individual KPIs grouped by balanced scorecard perspective.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Perspective Sub-Tabs */}
                                <Tabs value={activePerspective} onValueChange={setActivePerspective}>
                                    <TabsList>
                                        {perspectives.map((p) => (
                                            <TabsTrigger key={p} value={p}>
                                                {perspectiveLabels[p] ?? formatStatus(p)}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {perspectives.map((p) => (
                                        <TabsContent key={p} value={p}>
                                            {scorecard.items.filter((item) => item.perspective === p).length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <Target className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                                    <h3 className="mb-1 text-lg font-semibold">No KPIs</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        No KPI items have been added for this perspective.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>KPI</TableHead>
                                                                <TableHead>Target Type</TableHead>
                                                                <TableHead>Target</TableHead>
                                                                <TableHead>Actual</TableHead>
                                                                <TableHead>Weight</TableHead>
                                                                <TableHead>Self Score</TableHead>
                                                                <TableHead>Manager Score</TableHead>
                                                                <TableHead>Final Score</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {scorecard.items
                                                                .filter((item) => item.perspective === p)
                                                                .map((item) => (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell>
                                                                            <div className="font-medium">{item.kpi_name}</div>
                                                                            {item.description && (
                                                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                                                    {item.description}
                                                                                </div>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="text-sm">
                                                                            {formatStatus(item.target_type)}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.target_value != null ? item.target_value : '--'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.actual_value != null ? item.actual_value : '--'}
                                                                        </TableCell>
                                                                        <TableCell>{item.weight}%</TableCell>
                                                                        <TableCell>
                                                                            {item.self_score != null ? item.self_score.toFixed(1) : '--'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.manager_score != null ? item.manager_score.toFixed(1) : '--'}
                                                                        </TableCell>
                                                                        <TableCell className="font-semibold">
                                                                            {item.final_score != null ? item.final_score.toFixed(1) : '--'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Evidence Tab */}
                    <TabsContent value="evidence" className="space-y-6">
                        {/* Upload Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Evidence</CardTitle>
                                <CardDescription>
                                    Attach supporting documents for this scorecard.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleEvidenceSubmit} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm leading-none font-medium">
                                                Title<span className="ml-1 text-destructive">*</span>
                                            </label>
                                            <Input
                                                value={evidenceForm.data.title}
                                                onChange={(e) => evidenceForm.setData('title', e.target.value)}
                                                placeholder="Evidence title"
                                            />
                                            {evidenceForm.errors.title && (
                                                <p className="mt-1.5 text-sm font-medium text-destructive">
                                                    {evidenceForm.errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm leading-none font-medium">
                                                File
                                            </label>
                                            <Input
                                                type="file"
                                                onChange={(e) =>
                                                    evidenceForm.setData('file', e.target.files?.[0] ?? null)
                                                }
                                            />
                                            {evidenceForm.errors.file && (
                                                <p className="mt-1.5 text-sm font-medium text-destructive">
                                                    {evidenceForm.errors.file}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm leading-none font-medium">
                                            Description
                                        </label>
                                        <Textarea
                                            value={evidenceForm.data.description}
                                            onChange={(e) => evidenceForm.setData('description', e.target.value)}
                                            rows={2}
                                            placeholder="Brief description of this evidence..."
                                        />
                                        {evidenceForm.errors.description && (
                                            <p className="mt-1.5 text-sm font-medium text-destructive">
                                                {evidenceForm.errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={evidenceForm.processing}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {evidenceForm.processing ? 'Uploading...' : 'Upload Evidence'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Evidence List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Evidence Documents</CardTitle>
                                <CardDescription>
                                    {scorecard.evidence.length} document{scorecard.evidence.length !== 1 ? 's' : ''} attached
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {scorecard.evidence.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                        <h3 className="mb-1 text-lg font-semibold">No evidence uploaded</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Upload supporting documents using the form above.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {scorecard.evidence.map((ev) => (
                                                    <TableRow key={ev.id}>
                                                        <TableCell className="font-medium">{ev.title}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {ev.description || '--'}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {ev.created_at}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {ev.file_path && (
                                                                <a
                                                                    href={ev.file_path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Button variant="ghost" size="sm">
                                                                        <FileText className="mr-1 h-4 w-4" />
                                                                        View
                                                                    </Button>
                                                                </a>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="space-y-6">
                        {/* Add Comment Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Comment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCommentSubmit} className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm leading-none font-medium">
                                            Comment Type
                                        </label>
                                        <Select
                                            value={commentForm.data.comment_type}
                                            onValueChange={(v) => commentForm.setData('comment_type', v)}
                                        >
                                            <SelectTrigger className="w-full sm:w-48">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {commentTypes.map((ct) => (
                                                    <SelectItem key={ct} value={ct}>
                                                        {formatStatus(ct)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {commentForm.errors.comment_type && (
                                            <p className="mt-1.5 text-sm font-medium text-destructive">
                                                {commentForm.errors.comment_type}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm leading-none font-medium">
                                            Comment<span className="ml-1 text-destructive">*</span>
                                        </label>
                                        <Textarea
                                            value={commentForm.data.content}
                                            onChange={(e) => commentForm.setData('content', e.target.value)}
                                            rows={3}
                                            placeholder="Write your comment..."
                                        />
                                        {commentForm.errors.content && (
                                            <p className="mt-1.5 text-sm font-medium text-destructive">
                                                {commentForm.errors.content}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={commentForm.processing}>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            {commentForm.processing ? 'Posting...' : 'Post Comment'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Comments List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Comments</CardTitle>
                                <CardDescription>
                                    {scorecard.comments.length} comment{scorecard.comments.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {scorecard.comments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                        <h3 className="mb-1 text-lg font-semibold">No comments yet</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Use the form above to add the first comment.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {scorecard.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold">
                                                            {comment.user?.name ?? 'System'}
                                                        </span>
                                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                                            {formatStatus(comment.comment_type)}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {comment.created_at}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
