import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';

type LocationPayload = {
    id: number;
    name: string;
    code: string | null;
    address: string | null;
    building: string | null;
    floor: string | null;
    room: string | null;
    description: string | null;
    is_active: boolean;
};

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

export default function AssetLocationEdit() {
    const { location } = usePage<{ location: LocationPayload }>().props;

    const { data, setData, errors, put, processing } = useForm({
        name: location.name ?? '',
        code: location.code ?? '',
        address: location.address ?? '',
        building: location.building ?? '',
        floor: location.floor ?? '',
        room: location.room ?? '',
        description: location.description ?? '',
        is_active: location.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/asset-locations/${location.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Locations', href: '/asset-locations' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit Location - ${location.name}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/asset-locations">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Location</h1>
                        <p className="text-sm text-muted-foreground">{location.name}</p>
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
                                />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <FieldLabel>Code</FieldLabel>
                                <Input
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                />
                                <FieldError message={errors.code} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Address</FieldLabel>
                                <Textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={2}
                                />
                                <FieldError message={errors.address} />
                            </div>
                            <div>
                                <FieldLabel>Building</FieldLabel>
                                <Input
                                    value={data.building}
                                    onChange={(e) => setData('building', e.target.value)}
                                />
                                <FieldError message={errors.building} />
                            </div>
                            <div>
                                <FieldLabel>Floor</FieldLabel>
                                <Input
                                    value={data.floor}
                                    onChange={(e) => setData('floor', e.target.value)}
                                />
                                <FieldError message={errors.floor} />
                            </div>
                            <div>
                                <FieldLabel>Room</FieldLabel>
                                <Input
                                    value={data.room}
                                    onChange={(e) => setData('room', e.target.value)}
                                />
                                <FieldError message={errors.room} />
                            </div>
                            <div>
                                <FieldLabel>Description</FieldLabel>
                                <Input
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
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
                            {processing ? 'Saving...' : 'Update Location'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
