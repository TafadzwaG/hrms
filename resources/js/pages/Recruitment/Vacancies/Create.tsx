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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, Save, X } from 'lucide-react';

type Company = {
    id: number;
    company_name: string;
};

type CreatePageProps = {
    companies: Company[];
    categories: string[];
    employment_types: string[];
    work_modes: string[];
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function VacancyCreate() {
    const {
        companies = [],
        categories = [],
        employment_types = [],
        work_modes = [],
    } = usePage<CreatePageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        company_profile_id: '',
        title: '',
        department: '',
        category: '',
        employment_type: '',
        work_mode: '',
        location: '',
        description: '',
        requirements: '',
        responsibilities: '',
        salary_min: '',
        salary_max: '',
        currency: 'USD',
        application_deadline: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vacancies');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Vacancies', href: '/vacancies' },
                { title: 'Create' },
            ]}
        >
            <Head title="Create Vacancy" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Create Vacancy
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Post a new job vacancy.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                Vacancy Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company_profile_id">Company *</Label>
                                <Select value={data.company_profile_id} onValueChange={(val) => setData('company_profile_id', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={String(company.id)}>
                                                {company.company_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.company_profile_id && <p className="text-sm text-red-500">{errors.company_profile_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    className="h-11 border-zinc-200"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    className="h-11 border-zinc-200"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                />
                                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={data.category} onValueChange={(val) => setData('category', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {formatLabel(cat)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employment_type">Employment Type</Label>
                                <Select value={data.employment_type} onValueChange={(val) => setData('employment_type', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employment_types.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {formatLabel(type)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.employment_type && <p className="text-sm text-red-500">{errors.employment_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="work_mode">Work Mode</Label>
                                <Select value={data.work_mode} onValueChange={(val) => setData('work_mode', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {work_modes.map((mode) => (
                                            <SelectItem key={mode} value={mode}>
                                                {formatLabel(mode)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.work_mode && <p className="text-sm text-red-500">{errors.work_mode}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    className="h-11 border-zinc-200"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="application_deadline">Application Deadline</Label>
                                <Input
                                    id="application_deadline"
                                    type="date"
                                    className="h-11 border-zinc-200"
                                    value={data.application_deadline}
                                    onChange={(e) => setData('application_deadline', e.target.value)}
                                />
                                {errors.application_deadline && <p className="text-sm text-red-500">{errors.application_deadline}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-[120px] border-zinc-200"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="requirements">Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    className="min-h-[120px] border-zinc-200"
                                    value={data.requirements}
                                    onChange={(e) => setData('requirements', e.target.value)}
                                />
                                {errors.requirements && <p className="text-sm text-red-500">{errors.requirements}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="responsibilities">Responsibilities</Label>
                                <Textarea
                                    id="responsibilities"
                                    className="min-h-[120px] border-zinc-200"
                                    value={data.responsibilities}
                                    onChange={(e) => setData('responsibilities', e.target.value)}
                                />
                                {errors.responsibilities && <p className="text-sm text-red-500">{errors.responsibilities}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary_min">Salary Min</Label>
                                <Input
                                    id="salary_min"
                                    type="number"
                                    step="0.01"
                                    className="h-11 border-zinc-200"
                                    value={data.salary_min}
                                    onChange={(e) => setData('salary_min', e.target.value)}
                                />
                                {errors.salary_min && <p className="text-sm text-red-500">{errors.salary_min}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary_max">Salary Max</Label>
                                <Input
                                    id="salary_max"
                                    type="number"
                                    step="0.01"
                                    className="h-11 border-zinc-200"
                                    value={data.salary_max}
                                    onChange={(e) => setData('salary_max', e.target.value)}
                                />
                                {errors.salary_max && <p className="text-sm text-red-500">{errors.salary_max}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={data.currency} onValueChange={(val) => setData('currency', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="ZWL">ZWL</SelectItem>
                                        <SelectItem value="ZAR">ZAR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/vacancies">
                            <Button type="button" variant="outline" className="h-11 border-zinc-200">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800"
                        >
                            <Save className="mr-2 h-4 w-4" /> Save Vacancy
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
