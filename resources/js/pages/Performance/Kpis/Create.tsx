import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function KpiCreate() {
    const { perspectives, targetTypes } = usePage<{
        perspectives: string[];
        targetTypes: string[];
    }>().props;

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        perspective: '',
        description: '',
        target_type: '',
        default_target: '',
        default_weight: '',
        unit: '',
        is_active: true as boolean,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/kpi-library', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'KPI Library', href: '/kpi-library' },
                { title: 'New KPI', href: '#' },
            ]}
        >
            <Head title="New KPI" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/kpi-library">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New KPI</h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new key performance indicator to the library.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Name</FieldLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Revenue Growth"
                                />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <FieldLabel required>Code</FieldLabel>
                                <Input
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="e.g. FIN-001"
                                />
                                <FieldError message={errors.code} />
                            </div>
                            <div>
                                <FieldLabel required>Perspective</FieldLabel>
                                <Select
                                    value={data.perspective}
                                    onValueChange={(v) => setData('perspective', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select perspective" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {perspectives.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {formatLabel(p)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.perspective} />
                            </div>
                            <div>
                                <FieldLabel>Unit</FieldLabel>
                                <Input
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    placeholder="e.g. %, $, count"
                                />
                                <FieldError message={errors.unit} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Description</FieldLabel>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Describe how this KPI is measured..."
                                />
                                <FieldError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Target & Weight */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Target &amp; Weight</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <FieldLabel required>Target Type</FieldLabel>
                                <Select
                                    value={data.target_type}
                                    onValueChange={(v) => setData('target_type', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select target type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {targetTypes.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {formatLabel(t)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.target_type} />
                            </div>
                            <div>
                                <FieldLabel>Default Target</FieldLabel>
                                <Input
                                    value={data.default_target}
                                    onChange={(e) => setData('default_target', e.target.value)}
                                    placeholder="e.g. 100"
                                />
                                <FieldError message={errors.default_target} />
                            </div>
                            <div>
                                <FieldLabel>Default Weight (%)</FieldLabel>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.default_weight}
                                    onChange={(e) => setData('default_weight', e.target.value)}
                                    placeholder="e.g. 10"
                                />
                                <FieldError message={errors.default_weight} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium">
                                    Active
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/kpi-library">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save KPI'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
