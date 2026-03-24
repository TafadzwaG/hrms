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
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Save, X } from 'lucide-react';

export default function CompanyCreate() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        industry: '',
        registration_number: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/company-profiles');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Companies', href: '/company-profiles' },
                { title: 'Create' },
            ]}
        >
            <Head title="Create Company" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Create Company
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Register a new company profile.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                Company Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Company Name *</Label>
                                <Input
                                    id="company_name"
                                    className="h-11 border-zinc-200"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                />
                                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Select value={data.industry} onValueChange={(val) => setData('industry', val)}>
                                    <SelectTrigger className="h-11 border-zinc-200">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                        <SelectItem value="healthcare">Healthcare</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="retail">Retail</SelectItem>
                                        <SelectItem value="construction">Construction</SelectItem>
                                        <SelectItem value="mining">Mining</SelectItem>
                                        <SelectItem value="agriculture">Agriculture</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registration_number">Registration Number</Label>
                                <Input
                                    id="registration_number"
                                    className="h-11 border-zinc-200"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                />
                                {errors.registration_number && <p className="text-sm text-red-500">{errors.registration_number}</p>}
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
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    className="h-11 border-zinc-200"
                                    placeholder="https://"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                />
                                {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    className="min-h-[80px] border-zinc-200"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
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
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/company-profiles">
                            <Button type="button" variant="outline" className="h-11 border-zinc-200">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-md bg-zinc-900 px-6 text-white shadow-sm transition-all hover:bg-zinc-800"
                        >
                            <Save className="mr-2 h-4 w-4" /> Save Company
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
