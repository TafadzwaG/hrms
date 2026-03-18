import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Download,
    FileText,
    Mail,
    Phone,
    User,
} from 'lucide-react';
import { useState } from 'react';

type Resume = {
    id: number;
    file_name: string;
    is_primary: boolean;
    download_url: string;
};

type Skill = {
    id: number;
    name: string;
    proficiency_level: string | null;
};

type Company = {
    id: number;
    name: string;
};

type Vacancy = {
    id: number;
    title: string;
    status: string;
    company: Company | null;
};

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    resumes: Resume[];
    skills: Skill[];
};

type Application = {
    id: number;
    vacancy: Vacancy | null;
    candidate: Candidate | null;
    candidate_resume_id: number | null;
    cover_letter: string | null;
    status: string;
    notes: string | null;
    applied_at: string | null;
    shortlisted_at: string | null;
    rejected_at: string | null;
    interviewed_at: string | null;
    offered_at: string | null;
    hired_at: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string | null;
    links: {
        show: string;
        update_status: string;
    };
};

type PageProps = {
    application: Application;
};

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'submitted':
            return 'default';
        case 'under_review':
        case 'interview':
            return 'secondary';
        case 'shortlisted':
        case 'offered':
        case 'hired':
            return 'default';
        case 'rejected':
        case 'withdrawn':
            return 'destructive';
        default:
            return 'outline';
    }
};

const formatLabel = (value: string | null): string => {
    if (!value) return '—';
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (value: string | null): string => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString();
};

const formatDateTime = (value: string | null): string => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

const APPLICATION_STATUSES = [
    'submitted',
    'under_review',
    'shortlisted',
    'interview',
    'offered',
    'hired',
    'rejected',
    'withdrawn',
];

export default function ApplicationShow() {
    const { application } = usePage<PageProps>().props;

    const [showStatusForm, setShowStatusForm] = useState(false);

    const statusForm = useForm({
        status: application.status,
        notes: application.notes ?? '',
    });

    const handleStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.put(application.links.update_status, {
            preserveScroll: true,
            onSuccess: () => setShowStatusForm(false),
        });
    };

    const breadcrumbs = [
        { title: 'Recruitment', href: '/recruitment' },
        { title: 'Applications', href: '/vacancy-applications' },
        { title: `Application #${application.id}`, href: application.links.show },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Application #${application.id}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/vacancy-applications">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Application #{application.id}
                            </h1>
                            <p className="text-muted-foreground">
                                {application.candidate?.full_name ?? 'Unknown'} &rarr;{' '}
                                {application.vacancy?.title ?? 'Unknown Vacancy'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={statusVariant(application.status)} className="text-sm">
                            {formatLabel(application.status)}
                        </Badge>
                        <Button variant="outline" onClick={() => setShowStatusForm(!showStatusForm)}>
                            Update Status
                        </Button>
                    </div>
                </div>

                {/* Status Update Form */}
                {showStatusForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Application Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <Select
                                            value={statusForm.data.status}
                                            onValueChange={(val) => statusForm.setData('status', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {APPLICATION_STATUSES.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {formatLabel(s)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Notes</label>
                                        <Textarea
                                            value={statusForm.data.notes}
                                            onChange={(e) => statusForm.setData('notes', e.target.value)}
                                            placeholder="Add notes about this status change..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={statusForm.processing}>
                                        Save Status
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowStatusForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Vacancy Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Vacancy Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {application.vacancy ? (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-muted-foreground text-sm">Title</span>
                                        <p className="font-medium">
                                            <Link
                                                href={`/vacancies/${application.vacancy.id}`}
                                                className="text-primary hover:underline"
                                            >
                                                {application.vacancy.title}
                                            </Link>
                                        </p>
                                    </div>
                                    {application.vacancy.company && (
                                        <div>
                                            <span className="text-muted-foreground text-sm">Company</span>
                                            <p className="flex items-center gap-1 font-medium">
                                                <Building2 className="h-4 w-4" />
                                                {application.vacancy.company.name}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted-foreground text-sm">Vacancy Status</span>
                                        <p>
                                            <Badge variant="outline">{formatLabel(application.vacancy.status)}</Badge>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Vacancy details unavailable.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Candidate Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Candidate Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {application.candidate ? (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-muted-foreground text-sm">Name</span>
                                        <p className="font-medium">
                                            <Link
                                                href={`/candidate-profiles/${application.candidate.id}`}
                                                className="text-primary hover:underline"
                                            >
                                                {application.candidate.full_name}
                                            </Link>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-sm">Contact</span>
                                        <div className="space-y-1">
                                            <p className="flex items-center gap-1 text-sm">
                                                <Mail className="h-3 w-3" />
                                                {application.candidate.email}
                                            </p>
                                            {application.candidate.phone && (
                                                <p className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3" />
                                                    {application.candidate.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {application.candidate.skills.length > 0 && (
                                        <div>
                                            <span className="text-muted-foreground text-sm">Skills</span>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {application.candidate.skills.map((skill) => (
                                                    <Badge key={skill.id} variant="secondary">
                                                        {skill.name}
                                                        {skill.proficiency_level && (
                                                            <span className="ml-1 opacity-70">
                                                                ({formatLabel(skill.proficiency_level)})
                                                            </span>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Candidate details unavailable.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Cover Letter */}
                {application.cover_letter && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Cover Letter
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none whitespace-pre-wrap text-sm">
                                {application.cover_letter}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Resumes */}
                {application.candidate && application.candidate.resumes.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidate Resumes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>File</TableHead>
                                        <TableHead>Primary</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {application.candidate.resumes.map((resume) => (
                                        <TableRow key={resume.id}>
                                            <TableCell className="font-medium">{resume.file_name}</TableCell>
                                            <TableCell>
                                                {resume.is_primary ? (
                                                    <Badge variant="default">Primary</Badge>
                                                ) : (
                                                    <Badge variant="outline">Secondary</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={resume.download_url} target="_blank" rel="noopener noreferrer">
                                                        <Download className="mr-1 h-4 w-4" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Application Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-sm font-medium">Applied</span>
                                <span className="text-muted-foreground text-sm">
                                    {formatDateTime(application.applied_at)}
                                </span>
                            </div>
                            {application.shortlisted_at && (
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-sm font-medium">Shortlisted</span>
                                    <span className="text-muted-foreground text-sm">
                                        {formatDateTime(application.shortlisted_at)}
                                    </span>
                                </div>
                            )}
                            {application.interviewed_at && (
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-sm font-medium">Interviewed</span>
                                    <span className="text-muted-foreground text-sm">
                                        {formatDateTime(application.interviewed_at)}
                                    </span>
                                </div>
                            )}
                            {application.offered_at && (
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-sm font-medium">Offered</span>
                                    <span className="text-muted-foreground text-sm">
                                        {formatDateTime(application.offered_at)}
                                    </span>
                                </div>
                            )}
                            {application.hired_at && (
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-sm font-medium">Hired</span>
                                    <span className="text-muted-foreground text-sm">
                                        {formatDateTime(application.hired_at)}
                                    </span>
                                </div>
                            )}
                            {application.rejected_at && (
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-sm font-medium">Rejected</span>
                                    <span className="text-muted-foreground text-sm">
                                        {formatDateTime(application.rejected_at)}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Created</span>
                                <span className="text-muted-foreground text-sm">
                                    {formatDateTime(application.created_at)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                {application.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm">{application.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
