import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
            {required && <span className="ml-1 text-destructive">*</span>}
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

export default function AssetVendorCreate() {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        notes: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/asset-vendors', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Vendors', href: '/asset-vendors' },
                { title: 'New Vendor', href: '#' },
            ]}
        >
            <Head title="New Asset Vendor" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/asset-vendors">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Vendor</h1>
                        <p className="text-sm text-muted-foreground">
                            Register a new asset vendor.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vendor Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Name</FieldLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dell Technologies"
                                />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <FieldLabel>Code</FieldLabel>
                                <Input
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="e.g. DELL"
                                />
                                <FieldError message={errors.code} />
                            </div>
                            <div>
                                <FieldLabel>Contact Person</FieldLabel>
                                <Input
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                    placeholder="Full name"
                                />
                                <FieldError message={errors.contact_person} />
                            </div>
                            <div>
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="vendor@example.com"
                                />
                                <FieldError message={errors.email} />
                            </div>
                            <div>
                                <FieldLabel>Phone</FieldLabel>
                                <Input
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+1 234 567 890"
                                />
                                <FieldError message={errors.phone} />
                            </div>
                            <div>
                                <FieldLabel>Website</FieldLabel>
                                <Input
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="https://example.com"
                                />
                                <FieldError message={errors.website} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Address</FieldLabel>
                                <Textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={2}
                                    placeholder="Full address..."
                                />
                                <FieldError message={errors.address} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Notes</FieldLabel>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Any additional notes..."
                                />
                                <FieldError message={errors.notes} />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="is_active"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Active vendor
                                    </label>
                                </div>
                                <FieldError message={errors.is_active} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/asset-vendors">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Vendor'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
