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

export default function AssetLocationCreate() {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        address: '',
        building: '',
        floor: '',
        room: '',
        description: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/asset-locations', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Locations', href: '/asset-locations' },
                { title: 'New Location', href: '#' },
            ]}
        >
            <Head title="New Asset Location" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/asset-locations">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Location</h1>
                        <p className="text-sm text-muted-foreground">
                            Register a new asset location.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Name</FieldLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Main Office"
                                />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <FieldLabel>Code</FieldLabel>
                                <Input
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="e.g. MO-01"
                                />
                                <FieldError message={errors.code} />
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
                            <div>
                                <FieldLabel>Building</FieldLabel>
                                <Input
                                    value={data.building}
                                    onChange={(e) => setData('building', e.target.value)}
                                    placeholder="e.g. Building A"
                                />
                                <FieldError message={errors.building} />
                            </div>
                            <div>
                                <FieldLabel>Floor</FieldLabel>
                                <Input
                                    value={data.floor}
                                    onChange={(e) => setData('floor', e.target.value)}
                                    placeholder="e.g. 3rd Floor"
                                />
                                <FieldError message={errors.floor} />
                            </div>
                            <div>
                                <FieldLabel>Room</FieldLabel>
                                <Input
                                    value={data.room}
                                    onChange={(e) => setData('room', e.target.value)}
                                    placeholder="e.g. Room 302"
                                />
                                <FieldError message={errors.room} />
                            </div>
                            <div>
                                <FieldLabel>Description</FieldLabel>
                                <Input
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description..."
                                />
                                <FieldError message={errors.description} />
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
                                        Active location
                                    </label>
                                </div>
                                <FieldError message={errors.is_active} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/asset-locations">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Location'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
