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

type CategoryOptions = {
    parents: { id: number; name: string }[];
    depreciation_methods: string[];
};

type CategoryPayload = {
    id: number;
    name: string;
    code: string | null;
    parent_id: number | null;
    description: string | null;
    depreciation_method: string | null;
    useful_life_years: number | null;
    depreciation_rate: string | null;
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

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AssetCategoryEdit() {
    const { category, options } = usePage<{
        category: CategoryPayload;
        options: CategoryOptions;
    }>().props;

    const { data, setData, errors, put, processing } = useForm({
        name: category.name ?? '',
        code: category.code ?? '',
        parent_id: category.parent_id ? String(category.parent_id) : '',
        description: category.description ?? '',
        depreciation_method: category.depreciation_method ?? '',
        useful_life_years: category.useful_life_years ? String(category.useful_life_years) : '',
        depreciation_rate: category.depreciation_rate ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/asset-categories/${category.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Categories', href: '/asset-categories' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit Category - ${category.name}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href="/asset-categories">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
                        <p className="text-sm text-muted-foreground">{category.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
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
                            <div>
                                <FieldLabel>Parent Category</FieldLabel>
                                <Select
                                    value={data.parent_id}
                                    onValueChange={(v) => setData('parent_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="No parent (top-level)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.parents
                                            .filter((p) => p.id !== category.id)
                                            .map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.parent_id} />
                            </div>
                            <div>
                                <FieldLabel>Depreciation Method</FieldLabel>
                                <Select
                                    value={data.depreciation_method}
                                    onValueChange={(v) => setData('depreciation_method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.depreciation_methods.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {formatLabel(m)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.depreciation_method} />
                            </div>
                            <div>
                                <FieldLabel>Useful Life (Years)</FieldLabel>
                                <Input
                                    type="number"
                                    min="0"
                                    value={data.useful_life_years}
                                    onChange={(e) => setData('useful_life_years', e.target.value)}
                                />
                                <FieldError message={errors.useful_life_years} />
                            </div>
                            <div>
                                <FieldLabel>Depreciation Rate (%)</FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.depreciation_rate}
                                    onChange={(e) => setData('depreciation_rate', e.target.value)}
                                />
                                <FieldError message={errors.depreciation_rate} />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel>Description</FieldLabel>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                <FieldError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/asset-categories">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Update Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
