import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpen,
    Briefcase,
    ClipboardList,
    Download,
    FileText,
    GraduationCap,
    Pencil,
    Plus,
    Star,
    Tags,
    Trash2,
    Upload,
    User,
} from 'lucide-react';
import { useState } from 'react';

type Resume = {
    id: number;
    file_name: string;
    is_primary: boolean;
    created_at: string | null;
};

type Education = {
    id: number;
    institution: string;
    qualification: string;
    field_of_study: string;
    start_date: string | null;
    end_date: string | null;
};

type Experience = {
    id: number;
    company_name: string;
    job_title: string;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
};

type Skill = {
    id: number;
    name: string;
    proficiency: string | null;
};

type Application = {
    id: number;
    vacancy: { id: number; title: string; company: string };
    status: string;
    applied_at: string | null;
};

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    alt_phone: string | null;
    national_id: string | null;
    gender: string | null;
    date_of_birth: string | null;
    location: string | null;
    headline: string | null;
    professional_summary: string | null;
    expected_salary: string | number | null;
    salary_currency: string | null;
    years_experience: number | null;
    highest_education: string | null;
    visibility_status: string;
    is_public: boolean;
    listing_activated_at: string | null;
    listing_expires_at: string | null;
    resumes: Resume[];
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    applications: Application[];
};

type ShowPageProps = {
    candidate: Candidate;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    pending_payment: 'border-transparent bg-amber-100 text-amber-700',
    expired: 'border-transparent bg-slate-100 text-slate-600',
    suspended: 'border-transparent bg-red-100 text-red-700',
    applied: 'border-transparent bg-blue-100 text-blue-700',
    shortlisted: 'border-transparent bg-purple-100 text-purple-700',
    interviewed: 'border-transparent bg-orange-100 text-orange-700',
    offered: 'border-transparent bg-teal-100 text-teal-700',
    hired: 'border-transparent bg-emerald-100 text-emerald-700',
    rejected: 'border-transparent bg-red-100 text-red-700',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') return '—';
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function CandidateShow() {
    const { candidate } = usePage<ShowPageProps>().props;

    const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number; name: string } | null>(null);

    // Resume upload form
    const resumeForm = useForm<{ resume: File | null }>({
        resume: null,
    });

    // Education form
    const eduForm = useForm({
        institution: '',
        qualification: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
    });

    // Experience form
    const expForm = useForm({
        company_name: '',
        job_title: '',
        start_date: '',
        end_date: '',
        is_current: false,
    });

    // Skill form
    const skillForm = useForm({
        name: '',
        proficiency: '',
    });

    const handleResumeUpload = (e: React.FormEvent) => {
        e.preventDefault();
        resumeForm.post(`/candidate-profiles/${candidate.id}/resumes`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => resumeForm.reset(),
        });
    };

    const handleAddEducation = (e: React.FormEvent) => {
        e.preventDefault();
        eduForm.post(`/candidate-profiles/${candidate.id}/education`, {
            preserveScroll: true,
            onSuccess: () => eduForm.reset(),
        });
    };

    const handleAddExperience = (e: React.FormEvent) => {
        e.preventDefault();
        expForm.post(`/candidate-profiles/${candidate.id}/experience`, {
            preserveScroll: true,
            onSuccess: () => expForm.reset(),
        });
    };

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        skillForm.post(`/candidate-profiles/${candidate.id}/skills`, {
            preserveScroll: true,
            onSuccess: () => skillForm.reset(),
        });
    };

    const handleDeleteItem = () => {
        if (!itemToDelete) return;
        router.delete(
            `/candidate-profiles/${candidate.id}/${itemToDelete.type}/${itemToDelete.id}`,
            {
                preserveScroll: true,
                onSuccess: () => setItemToDelete(null),
            },
        );
    };

    const handleSetPrimary = (resumeId: number) => {
        router.put(
            `/candidate-profiles/${candidate.id}/resumes/${resumeId}/primary`,
            {},
            { preserveScroll: true },
        );
    };

    const canActivate = candidate.visibility_status === 'draft' || candidate.visibility_status === 'pending_payment';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates', href: '/candidate-profiles' },
                { title: candidate.full_name },
            ]}
        >
            <Head title={candidate.full_name} />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                                {candidate.full_name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={`${statusStyles[candidate.visibility_status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                            >
                                {formatLabel(candidate.visibility_status)}
                            </Badge>
                        </div>
                        <p className="text-lg text-zinc-500">
                            {candidate.headline ?? 'No headline set'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {canActivate && (
                            <Link href={`/candidate-profiles/${candidate.id}/checkout`}>
                                <Button className="h-11 rounded-md bg-emerald-600 px-6 text-white shadow-sm transition-all hover:bg-emerald-700">
                                    <Banknote className="mr-2 h-5 w-5" /> Pay to Activate
                                </Button>
                            </Link>
                        )}
                        <Link href={`/candidate-profiles/${candidate.id}/edit`}>
                            <Button variant="outline" className="h-11 border-zinc-200">
                                <Pencil className="mr-2 h-5 w-5" /> Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="resumes">Resumes</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="border-zinc-200 shadow-none">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    {[
                                        { label: 'Email', value: candidate.email },
                                        { label: 'Phone', value: candidate.phone },
                                        { label: 'Alt Phone', value: candidate.alt_phone },
                                        { label: 'National ID', value: candidate.national_id },
                                        { label: 'Gender', value: candidate.gender ? formatLabel(candidate.gender) : null },
                                        { label: 'Date of Birth', value: formatDate(candidate.date_of_birth) },
                                        { label: 'Location', value: candidate.location },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">{item.label}</span>
                                            <span className="text-right font-semibold text-zinc-700">
                                                {item.value ?? '—'}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-zinc-200 shadow-none">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                                        Professional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    {[
                                        { label: 'Headline', value: candidate.headline },
                                        { label: 'Expected Salary', value: candidate.expected_salary ? `${candidate.salary_currency ?? ''} ${formatMoney(candidate.expected_salary)}` : null },
                                        { label: 'Years Experience', value: candidate.years_experience != null ? String(candidate.years_experience) : null },
                                        { label: 'Highest Education', value: candidate.highest_education ? formatLabel(candidate.highest_education) : null },
                                        { label: 'Public Profile', value: candidate.is_public ? 'Yes' : 'No' },
                                        { label: 'Listing Activated', value: formatDate(candidate.listing_activated_at) },
                                        { label: 'Listing Expires', value: formatDate(candidate.listing_expires_at) },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between gap-3 text-sm">
                                            <span className="text-zinc-400">{item.label}</span>
                                            <span className="text-right font-semibold text-zinc-700">
                                                {item.value ?? '—'}
                                            </span>
                                        </div>
                                    ))}
                                    {candidate.professional_summary && (
                                        <div className="border-t border-zinc-100 pt-4">
                                            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Summary</p>
                                            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{candidate.professional_summary}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Resumes Tab */}
                    <TabsContent value="resumes" className="space-y-6">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    Upload Resume
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleResumeUpload} className="flex items-end gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="resume">Resume File</Label>
                                        <Input
                                            id="resume"
                                            type="file"
                                            className="h-11 border-zinc-200"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => resumeForm.setData('resume', e.target.files?.[0] ?? null)}
                                        />
                                        {resumeForm.errors.resume && <p className="text-sm text-red-500">{resumeForm.errors.resume}</p>}
                                    </div>
                                    <Button type="submit" disabled={resumeForm.processing} className="h-11 bg-zinc-900 text-white hover:bg-zinc-800">
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-200 shadow-none">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">File Name</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Primary</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Uploaded</TableHead>
                                            <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(candidate.resumes ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-8 text-center text-zinc-400">
                                                    No resumes uploaded.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            candidate.resumes.map((resume) => (
                                                <TableRow key={resume.id} className="hover:bg-zinc-50/50">
                                                    <TableCell className="font-medium text-zinc-700">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-zinc-400" />
                                                            {resume.file_name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${resume.is_primary ? 'border-transparent bg-emerald-100 text-emerald-700' : 'border-transparent bg-zinc-100 text-zinc-600'} font-semibold`}
                                                        >
                                                            {resume.is_primary ? 'Primary' : 'Secondary'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">{formatDate(resume.created_at)}</TableCell>
                                                    <TableCell className="px-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                                <a href={`/candidate-profiles/${candidate.id}/resumes/${resume.id}/download`}>
                                                                    <Download className="h-4 w-4 text-zinc-400" />
                                                                </a>
                                                            </Button>
                                                            {!resume.is_primary && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleSetPrimary(resume.id)}
                                                                    type="button"
                                                                >
                                                                    <Star className="h-4 w-4 text-amber-400" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => setItemToDelete({ type: 'resumes', id: resume.id, name: resume.file_name })}
                                                                type="button"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-400" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="space-y-6">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                    Add Education
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleAddEducation} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Institution *</Label>
                                        <Input className="h-11 border-zinc-200" value={eduForm.data.institution} onChange={(e) => eduForm.setData('institution', e.target.value)} />
                                        {eduForm.errors.institution && <p className="text-sm text-red-500">{eduForm.errors.institution}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Qualification *</Label>
                                        <Input className="h-11 border-zinc-200" value={eduForm.data.qualification} onChange={(e) => eduForm.setData('qualification', e.target.value)} />
                                        {eduForm.errors.qualification && <p className="text-sm text-red-500">{eduForm.errors.qualification}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Field of Study</Label>
                                        <Input className="h-11 border-zinc-200" value={eduForm.data.field_of_study} onChange={(e) => eduForm.setData('field_of_study', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input type="date" className="h-11 border-zinc-200" value={eduForm.data.start_date} onChange={(e) => eduForm.setData('start_date', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input type="date" className="h-11 border-zinc-200" value={eduForm.data.end_date} onChange={(e) => eduForm.setData('end_date', e.target.value)} />
                                    </div>
                                    <div className="flex items-end">
                                        <Button type="submit" disabled={eduForm.processing} className="h-11 bg-zinc-900 text-white hover:bg-zinc-800">
                                            <Plus className="mr-2 h-4 w-4" /> Add Education
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-200 shadow-none">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Institution</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Qualification</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Field</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Period</TableHead>
                                            <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(candidate.education ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-8 text-center text-zinc-400">
                                                    No education records.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            candidate.education.map((edu) => (
                                                <TableRow key={edu.id} className="hover:bg-zinc-50/50">
                                                    <TableCell className="font-bold text-zinc-900">{edu.institution}</TableCell>
                                                    <TableCell className="text-zinc-700">{edu.qualification}</TableCell>
                                                    <TableCell className="text-zinc-500">{edu.field_of_study || '—'}</TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setItemToDelete({ type: 'education', id: edu.id, name: edu.institution })}
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Experience Tab */}
                    <TabsContent value="experience" className="space-y-6">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                    Add Experience
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleAddExperience} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Company Name *</Label>
                                        <Input className="h-11 border-zinc-200" value={expForm.data.company_name} onChange={(e) => expForm.setData('company_name', e.target.value)} />
                                        {expForm.errors.company_name && <p className="text-sm text-red-500">{expForm.errors.company_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Job Title *</Label>
                                        <Input className="h-11 border-zinc-200" value={expForm.data.job_title} onChange={(e) => expForm.setData('job_title', e.target.value)} />
                                        {expForm.errors.job_title && <p className="text-sm text-red-500">{expForm.errors.job_title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input type="date" className="h-11 border-zinc-200" value={expForm.data.start_date} onChange={(e) => expForm.setData('start_date', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input type="date" className="h-11 border-zinc-200" value={expForm.data.end_date} onChange={(e) => expForm.setData('end_date', e.target.value)} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_current"
                                            checked={expForm.data.is_current}
                                            onChange={(e) => expForm.setData('is_current', e.target.checked)}
                                            className="rounded border-zinc-300"
                                        />
                                        <Label htmlFor="is_current">Currently working here</Label>
                                    </div>
                                    <div className="flex items-end">
                                        <Button type="submit" disabled={expForm.processing} className="h-11 bg-zinc-900 text-white hover:bg-zinc-800">
                                            <Plus className="mr-2 h-4 w-4" /> Add Experience
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-200 shadow-none">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Company</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Job Title</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Period</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Current</TableHead>
                                            <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(candidate.experience ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-8 text-center text-zinc-400">
                                                    No experience records.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            candidate.experience.map((exp) => (
                                                <TableRow key={exp.id} className="hover:bg-zinc-50/50">
                                                    <TableCell className="font-bold text-zinc-900">{exp.company_name}</TableCell>
                                                    <TableCell className="text-zinc-700">{exp.job_title}</TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${exp.is_current ? 'border-transparent bg-emerald-100 text-emerald-700' : 'border-transparent bg-zinc-100 text-zinc-600'} font-semibold`}>
                                                            {exp.is_current ? 'Yes' : 'No'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-6 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setItemToDelete({ type: 'experience', id: exp.id, name: exp.company_name })}
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Skills Tab */}
                    <TabsContent value="skills" className="space-y-6">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                    Add Skill
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleAddSkill} className="flex items-end gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Skill Name *</Label>
                                        <Input className="h-11 border-zinc-200" value={skillForm.data.name} onChange={(e) => skillForm.setData('name', e.target.value)} />
                                        {skillForm.errors.name && <p className="text-sm text-red-500">{skillForm.errors.name}</p>}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label>Proficiency</Label>
                                        <Input className="h-11 border-zinc-200" placeholder="e.g. Expert, Intermediate" value={skillForm.data.proficiency} onChange={(e) => skillForm.setData('proficiency', e.target.value)} />
                                    </div>
                                    <Button type="submit" disabled={skillForm.processing} className="h-11 bg-zinc-900 text-white hover:bg-zinc-800">
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-200 shadow-none">
                            <CardContent className="p-6">
                                {(candidate.skills ?? []).length === 0 ? (
                                    <p className="py-4 text-center text-sm text-zinc-400">No skills added.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.map((skill) => (
                                            <div key={skill.id} className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                                                <Tags className="h-3 w-3 text-zinc-400" />
                                                <span className="text-sm font-medium text-zinc-700">{skill.name}</span>
                                                {skill.proficiency && (
                                                    <span className="text-xs text-zinc-400">({skill.proficiency})</span>
                                                )}
                                                <button
                                                    type="button"
                                                    className="ml-1 text-red-400 hover:text-red-600"
                                                    onClick={() => setItemToDelete({ type: 'skills', id: skill.id, name: skill.name })}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-6">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                                    Applications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Vacancy</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Company</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Applied</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(candidate.applications ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-8 text-center text-zinc-400">
                                                    No applications yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            candidate.applications.map((app) => (
                                                <TableRow key={app.id} className="hover:bg-zinc-50/50">
                                                    <TableCell className="font-bold text-zinc-900">
                                                        <Link href={`/vacancies/${app.vacancy.id}`} className="hover:underline">
                                                            {app.vacancy.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">{app.vacancy.company}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${statusStyles[app.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                                        >
                                                            {formatLabel(app.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">{formatDate(app.applied_at)}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Alert */}
            <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
                <AlertDialogContent className="rounded-none border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            You are about to remove{' '}
                            <span className="font-bold text-zinc-900">
                                {itemToDelete?.name}
                            </span>
                            . This action is permanent and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="border-none bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteItem}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
