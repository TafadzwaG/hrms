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
    Building2,
    CheckCircle2,
    Eye,
    Pencil,
} from 'lucide-react';

type Vacancy = {
    id: number;
    title: string;
    category: string | null;
    employment_type: string | null;
    status: string;
    applications_count: number;
    application_deadline: string | null;
};

type Company = {
    id: number;
    company_name: string;
    industry: string | null;
    registration_number: string | null;
    email: string;
    phone: string | null;
    website: string | null;
    address: string | null;
    description: string | null;
    status: string;
    vacancies: Vacancy[];
};

type ShowPageProps = {
    company: Company;
};

const statusStyles: Record<string, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-700',
    pending: 'border-transparent bg-amber-100 text-amber-700',
    suspended: 'border-transparent bg-red-100 text-red-700',
    rejected: 'border-transparent bg-slate-100 text-slate-600',
    open: 'border-transparent bg-emerald-100 text-emerald-700',
    closed: 'border-transparent bg-zinc-100 text-zinc-600',
    draft: 'border-transparent bg-zinc-100 text-zinc-600',
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

export default function CompanyShow() {
    const { company } = usePage<ShowPageProps>().props;

    const handleApprove = () => {
        router.put(`/company-profiles/${company.id}/approve`, {}, { preserveScroll: true });
    };

    const handleSuspend = () => {
        router.put(`/company-profiles/${company.id}/suspend`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Companies', href: '/company-profiles' },
                { title: company.company_name },
            ]}
        >
            <Head title={company.company_name} />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                                {company.company_name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={`${statusStyles[company.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                            >
                                {formatLabel(company.status)}
                            </Badge>
                        </div>
                        <p className="text-lg text-zinc-500">
                            {company.industry ? formatLabel(company.industry) : 'Company Profile'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {company.status !== 'active' && (
                            <Button
                                onClick={handleApprove}
                                className="h-11 rounded-md bg-emerald-600 px-6 text-white shadow-sm transition-all hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" /> Approve
                            </Button>
                        )}
                        {company.status === 'active' && (
                            <Button
                                onClick={handleSuspend}
                                variant="outline"
                                className="h-11 border-red-200 text-red-600 hover:bg-red-50"
                            >
                                <Ban className="mr-2 h-5 w-5" /> Suspend
                            </Button>
                        )}
                        <Link href={`/company-profiles/${company.id}/edit`}>
                            <Button variant="outline" className="h-11 border-zinc-200">
                                <Pencil className="mr-2 h-5 w-5" /> Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="vacancies">Vacancies</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="border-zinc-200 shadow-none">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        Company Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    {[
                                        { label: 'Company Name', value: company.company_name },
                                        { label: 'Industry', value: company.industry ? formatLabel(company.industry) : null },
                                        { label: 'Registration Number', value: company.registration_number },
                                        { label: 'Email', value: company.email },
                                        { label: 'Phone', value: company.phone },
                                        { label: 'Website', value: company.website },
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
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        Additional Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-zinc-400">Status</span>
                                        <Badge
                                            variant="outline"
                                            className={`${statusStyles[company.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                        >
                                            {formatLabel(company.status)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-zinc-400">Total Vacancies</span>
                                        <span className="font-semibold text-zinc-700">{(company.vacancies ?? []).length}</span>
                                    </div>
                                    {company.address && (
                                        <div className="border-t border-zinc-100 pt-4">
                                            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Address</p>
                                            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{company.address}</p>
                                        </div>
                                    )}
                                    {company.description && (
                                        <div className="border-t border-zinc-100 pt-4">
                                            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Description</p>
                                            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{company.description}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Vacancies Tab */}
                    <TabsContent value="vacancies" className="space-y-6">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader className="bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                                        Vacancies
                                    </CardTitle>
                                    <Link href={`/vacancies/create?company_profile_id=${company.id}`}>
                                        <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800">
                                            Post Vacancy
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-zinc-900">Title</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Category</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Type</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Deadline</TableHead>
                                            <TableHead className="font-bold text-zinc-900">Applications</TableHead>
                                            <TableHead className="px-6 text-right font-bold text-zinc-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(company.vacancies ?? []).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="py-8 text-center text-zinc-400">
                                                    No vacancies posted yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            company.vacancies.map((vacancy) => (
                                                <TableRow key={vacancy.id} className="hover:bg-zinc-50/50">
                                                    <TableCell className="font-bold text-zinc-900">{vacancy.title}</TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {vacancy.category ? formatLabel(vacancy.category) : '—'}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">
                                                        {vacancy.employment_type ? formatLabel(vacancy.employment_type) : '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${statusStyles[vacancy.status] ?? 'border-zinc-200 bg-zinc-50 text-zinc-700'} font-semibold`}
                                                        >
                                                            {formatLabel(vacancy.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500">{formatDate(vacancy.application_deadline)}</TableCell>
                                                    <TableCell className="text-zinc-700">{vacancy.applications_count}</TableCell>
                                                    <TableCell className="px-6 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                            <Link href={`/vacancies/${vacancy.id}`}>
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
