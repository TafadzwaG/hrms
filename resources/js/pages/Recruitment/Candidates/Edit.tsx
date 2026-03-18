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
import { Briefcase, Save, User, X } from 'lucide-react';

type Candidate = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    alt_phone: string;
    national_id: string;
    gender: string;
    date_of_birth: string;
    location: string;
    headline: string;
    professional_summary: string;
    expected_salary: string;
    salary_currency: string;
    years_experience: string;
    highest_education: string;
};

type EditPageProps = {
    candidate: Candidate;
};

export default function CandidateEdit() {
    const { candidate } = usePage<EditPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        full_name: candidate.full_name ?? '',
        email: candidate.email ?? '',
        phone: candidate.phone ?? '',
        alt_phone: candidate.alt_phone ?? '',
        national_id: candidate.national_id ?? '',
        gender: candidate.gender ?? '',
        date_of_birth: candidate.date_of_birth ?? '',
        location: candidate.location ?? '',
        headline: candidate.headline ?? '',
        professional_summary: candidate.professional_summary ?? '',
        expected_salary: candidate.expected_salary ?? '',
        salary_currency: candidate.salary_currency ?? 'USD',
        years_experience: candidate.years_experience ?? '',
        highest_education: candidate.highest_education ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/candidate-profiles/${candidate.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidates', href: '/candidate-profiles' },
                { title: candidate.full_name, href: `/candidate-profiles/${candidate.id}` },
                { title: 'Edit' },
            ]}
        >
            <Head title={`Edit ${candidate.full_name}`} />

            <div className="w-full space-y-8 bg-white p-6 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Edit Candidate
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Update profile for {candidate.full_name}.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-muted-foreground" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name *</Label>
                                <Input
                                    id="full_name"
                                    className="h-11 border-zinc-200"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                />
                                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="h-11 border-zinc-200"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    className="h-11 border-zinc-200"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alt_phone">Alt Phone</Label>
                                <Input
                                    id="alt_phone"
                                    className="h-11 border-zinc-200"
                                    value={data.alt_phone}
                                    onChange={(e) => setData('alt_phone', e.target.value)}
                                />
                                {errors.alt_phone && <p className="text-sm text-red-500">{errors.alt_phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="national_id">National ID</Label>
                                <Input
                                    id="national_id"
                                    className="h-11 border-zinc-200"
                                    value={data.national_id}
                                    onChange={(e) => setData('national_id', e.target.value)}
                                />
                                {errors.national_id && <p className="text-sm text-red-500">{errors.national_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    className="h-11 border-zinc-200"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
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
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="headline">Headline</Label>
                                <Input
                                    id="headline"
                                    className="h-11 border-zinc-200"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={data.headline}
                                    onChange={(e) => setData('headline', e.target.value)}
                                />
                                {errors.headline && <p className="text-sm text-red-500">{errors.headline}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="professional_summary">Professional Summary</Label>
                                <Textarea
                                    id="professional_summary"
                                    className="min-h-[120px] border-zinc-200"
                                    value={data.professional_summary}
                                    onChange={(e) => setData('professional_summary', e.target.value)}
                                />
                                {errors.professional_summary && <p className="text-sm text-red-500">{errors.professional_summary}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expected_salary">Expected Salary</Label>
                                <Input
                                    id="expected_salary"
                                    type="number"
                                    step="0.01"
                                    className="h-11 border-zinc-200"
                                    value={data.expected_salary}
                                    onChange={(e) => setData('expected_salary', e.target.value)}
                                />
                                {errors.expected_salary && <p className="text-sm text-red-500">{errors.expected_salary}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary_currency">Currency</Label>
                                <Select value={data.salary_currency} onValueChange={(val) => setData('salary_currency', val)}>
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
                                {errors.salary_currency && <p className="text-sm text-red-500">{errors.salary_currency}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="years_experience">Years of Experience</Label>
                                <Input
                                    id="years_experience"
                                    type="number"
                                    className="h-11 border-zinc-200"
                                    value={data.years_experience}
                                    onChange={(e) => setData('years_experience', e.target.value)}
                                />
                                {errors.years_experience && <p className="text-sm text-red-500">{errors.years_experience}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="highest_education">Highest Education</Label>
                                <Select value={data.highest_education} onValueChange={(val) => setData('highest_education', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select education level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high_school">High School</SelectItem>
                                        <SelectItem value="diploma">Diploma</SelectItem>
                                        <SelectItem value="bachelors">Bachelors</SelectItem>
                                        <SelectItem value="masters">Masters</SelectItem>
                                        <SelectItem value="doctorate">Doctorate</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.highest_education && <p className="text-sm text-red-500">{errors.highest_education}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={`/candidate-profiles/${candidate.id}`}>
                            <Button type="button" variant="outline" className="h-11 border-zinc-200">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800"
                        >
                            <Save className="mr-2 h-4 w-4" /> Update Candidate
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
