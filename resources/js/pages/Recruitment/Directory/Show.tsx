import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Briefcase,
    Download,
    FileText,
    GraduationCap,
    MapPin,
    Tags,
    User,
} from 'lucide-react';

type Resume = {
    id: number;
    file_name: string;
    is_primary: boolean;
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

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    location: string | null;
    headline: string | null;
    professional_summary: string | null;
    years_experience: number | null;
    highest_education: string | null;
    expected_salary: string | number | null;
    salary_currency: string | null;
    resumes: Resume[];
    education: Education[];
    experience: Experience[];
    skills: Skill[];
};

type ShowPageProps = {
    candidate: Candidate;
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

export default function DirectoryShow() {
    const { candidate } = usePage<ShowPageProps>().props;

    const primaryResume = (candidate.resumes ?? []).find((r) => r.is_primary) ?? (candidate.resumes ?? [])[0];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Directory', href: '/recruitment/directory' },
                { title: candidate.full_name },
            ]}
        >
            <Head title={candidate.full_name} />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            {candidate.full_name}
                        </h1>
                        <p className="text-lg text-zinc-500">
                            {candidate.headline ?? 'Candidate Profile'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                            {candidate.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {candidate.location}
                                </span>
                            )}
                            {candidate.years_experience != null && (
                                <span className="flex items-center gap-1">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    {candidate.years_experience} years experience
                                </span>
                            )}
                            {candidate.highest_education && (
                                <Badge variant="outline" className="border-transparent bg-blue-100 text-blue-700 text-xs font-semibold">
                                    {formatLabel(candidate.highest_education)}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {primaryResume && (
                            <a href={`/recruitment/directory/${candidate.id}/resume/${primaryResume.id}/download`}>
                                <Button className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800">
                                    <Download className="mr-2 h-5 w-5" /> Download Resume
                                </Button>
                            </a>
                        )}
                        <Link href="/recruitment/directory">
                            <Button variant="outline" className="h-11 border-zinc-200">
                                Back to Directory
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Summary */}
                        {candidate.professional_summary && (
                            <Card className="border-zinc-200 shadow-none">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        Professional Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed">
                                        {candidate.professional_summary}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Experience */}
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                                    Work Experience
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Company</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Job Title</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Period</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(candidate.experience ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="py-8 text-center text-zinc-400">
                                                    No experience listed.
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
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                    Education
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Institution</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Qualification</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Field</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Period</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(candidate.education ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-8 text-center text-zinc-400">
                                                    No education listed.
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
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Personal Info */}
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    Contact Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {[
                                    { label: 'Email', value: candidate.email },
                                    { label: 'Phone', value: candidate.phone },
                                    { label: 'Location', value: candidate.location },
                                    { label: 'Expected Salary', value: candidate.expected_salary ? `${candidate.salary_currency ?? ''} ${formatMoney(candidate.expected_salary)}` : null },
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

                        {/* Skills */}
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Tags className="h-5 w-5 text-muted-foreground" />
                                    Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {(candidate.skills ?? []).length === 0 ? (
                                    <p className="text-sm text-zinc-400">No skills listed.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700"
                                            >
                                                <Tags className="h-3 w-3 text-zinc-400" />
                                                {skill.name}
                                                {skill.proficiency && (
                                                    <span className="text-xs text-zinc-400">({skill.proficiency})</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Resumes */}
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    Resumes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                                {(candidate.resumes ?? []).length === 0 ? (
                                    <p className="text-sm text-zinc-400">No resumes available.</p>
                                ) : (
                                    candidate.resumes.map((resume) => (
                                        <div key={resume.id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-zinc-400" />
                                                <span className="text-sm font-medium text-zinc-700">{resume.file_name}</span>
                                                {resume.is_primary && (
                                                    <Badge variant="outline" className="border-transparent bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                                        Primary
                                                    </Badge>
                                                )}
                                            </div>
                                            <a href={`/recruitment/directory/${candidate.id}/resume/${resume.id}/download`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Download className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </a>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
