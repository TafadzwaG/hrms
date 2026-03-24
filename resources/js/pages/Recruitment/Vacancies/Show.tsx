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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Ban,
    Briefcase,
    Calendar,
    CheckCircle2,
    ClipboardList,
    DollarSign,
    Eye,
    MapPin,
    Pencil,
    Send,
} from 'lucide-react';

type Application = {
    id: number;
    candidate: { id: number; full_name: string; email: string };
    status: string;
    applied_at: string | null;
    updated_at: string | null;
};

type Vacancy = {
    id: number;
    title: string;
    company: { id: number; company_name: string } | null;
    department: string | null;
    category: string | null;
    employment_type: string | null;
    work_mode: string | null;
    location: string | null;
    description: string | null;
    requirements: string | null;
    responsibilities: string | null;
    salary_min: string | number | null;
    salary_max: string | number | null;
    currency: string | null;
    application_deadline: string | null;
    status: string;
    applications: Application[];
};

type ShowPageProps = {
    vacancy: Vacancy;
};

const statusStyles: Record<string, string> = {
    open: 'border-transparent bg-emerald-100 text-emerald-700',
    published: 'border-transparent bg-emerald-100 text-emerald-700',
    closed: 'border-transparent bg-slate-100 text-slate-600',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
    expired: 'border-transparent bg-amber-100 text-amber-700',
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

export default function VacancyShow() {
    const { vacancy } = usePage<ShowPageProps>().props;

    const handlePublish = () => {
        router.put(`/vacancies/${vacancy.id}/publish`, {}, { preserveScroll: true });
    };

    const handleClose = () => {
        router.put(`/vacancies/${vacancy.id}/close`, {}, { preserveScroll: true });
    };

    const salaryRange = (() => {
        if (!vacancy.salary_min && !vacancy.salary_max) return '—';
        const currency = vacancy.currency ?? 'USD';
        if (vacancy.salary_min && vacancy.salary_max) {
            return `${currency} ${formatMoney(vacancy.salary_min)} - ${formatMoney(vacancy.salary_max)}`;
        }
        if (vacancy.salary_min) return `${currency} ${formatMoney(vacancy.salary_min)}+`;
        return `Up to ${currency} ${formatMoney(vacancy.salary_max)}`;
    })();

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Vacancies', href: '/vacancies' },
                { title: vacancy.title },
            ]}
        >
            <Head title={vacancy.title} />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                                {vacancy.title}
                            </h1>
                            <Badge
                                variant="outline"
                                className={`${statusStyles[vacancy.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                            >
                                {formatLabel(vacancy.status)}
                            </Badge>
                        </div>
                        <p className="text-lg text-zinc-500">
                            {vacancy.company?.company_name ?? 'No Company'} {vacancy.department ? `- ${vacancy.department}` : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {(vacancy.status === 'draft' || vacancy.status === 'closed') && (
                            <Button
                                onClick={handlePublish}
                                className="h-11 rounded-md bg-emerald-600 px-6 text-white shadow-sm transition-all hover:bg-emerald-700"
                            >
                                <Send className="mr-2 h-5 w-5" /> Publish
                            </Button>
                        )}
                        {(vacancy.status === 'open' || vacancy.status === 'published') && (
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                className="h-11 border-red-200 text-red-600 hover:bg-red-50"
                            >
                                <Ban className="mr-2 h-5 w-5" /> Close
                            </Button>
                        )}
                        <Link href={`/vacancies/${vacancy.id}/edit`}>
                            <Button variant="outline" className="h-11 border-zinc-200">
                                <Pencil className="mr-2 h-5 w-5" /> Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="applications">Applications ({(vacancy.applications ?? []).length})</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="border-zinc-200 shadow-none">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                                        Vacancy Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    {[
                                        { label: 'Title', value: vacancy.title },
                                        { label: 'Company', value: vacancy.company?.company_name },
                                        { label: 'Department', value: vacancy.department },
                                        { label: 'Category', value: vacancy.category ? formatLabel(vacancy.category) : null },
                                        { label: 'Employment Type', value: vacancy.employment_type ? formatLabel(vacancy.employment_type) : null },
                                        { label: 'Work Mode', value: vacancy.work_mode ? formatLabel(vacancy.work_mode) : null },
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
                                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                                        Salary & Deadline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-zinc-400">Salary Range</span>
                                        <span className="font-semibold text-zinc-700">{salaryRange}</span>
                                    </div>
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-zinc-400">Location</span>
                                        <span className="flex items-center gap-1 font-semibold text-zinc-700">
                                            {vacancy.location ? (
                                                <>
                                                    <MapPin className="h-3 w-3" />
                                                    {vacancy.location}
                                                </>
                                            ) : '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-zinc-400">Application Deadline</span>
                                        <span className="flex items-center gap-1 font-semibold text-zinc-700">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(vacancy.application_deadline)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-zinc-400">Total Applications</span>
                                        <span className="font-semibold text-zinc-700">{(vacancy.applications ?? []).length}</span>
                                    </div>

                                    {vacancy.description && (
                                        <div className="border-t border-zinc-100 pt-4">
                                            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Description</p>
                                            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{vacancy.description}</p>
                                        </div>
                                    )}
                                    {vacancy.requirements && (
                                        <div className="border-t border-zinc-100 pt-4">
                                            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Requirements</p>
                                            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{vacancy.requirements}</p>
                                        </div>
                                    )}
                                    {vacancy.responsibilities && (
                                        <div className="border-t border-zinc-100 pt-4">
                                            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Responsibilities</p>
                                            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{vacancy.responsibilities}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
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
                                            <TableHead className="font-bold text-zinc-900">Candidate</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Email</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Applied</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Updated</TableHead>
                                            <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(vacancy.applications ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-8 text-center text-zinc-400">
                                                    No applications yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            vacancy.applications.map((app) => (
                                                <TableRow key={app.id} className="hover:bg-zinc-50/50">
                                                    <TableCell className="font-bold text-zinc-900">
                                                        {app.candidate.full_name}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {app.candidate.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${statusStyles[app.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                                        >
                                                            {formatLabel(app.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {formatDate(app.applied_at)}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {formatDate(app.updated_at)}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                            <Link href={`/candidate-profiles/${app.candidate.id}`}>
                                                                <Eye className="h-4 w-4 text-zinc-400" />
                                                            </Link>
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
                </Tabs>
            </div>
        </AppLayout>
    );
}
