import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import moment from 'moment';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';

type ModuleField = {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
};

type ModuleMeta = {
    slug: string;
    name: string;
    description: string;
    fields: ModuleField[];
};

type ModuleFormPageProps = {
    module: ModuleMeta;
    mode: 'create' | 'edit';
    record: Record<string, unknown> | null;
};

type ModuleFormData = Record<string, string | boolean>;

type ModuleTheme = {
    surface: string;
    title: string;
    action: string;
};

const moduleThemes: Record<string, ModuleTheme> = {
    'leave-requests': {
        surface:
            'from-cyan-50/95 via-white to-sky-100/70 dark:from-cyan-950/30 dark:via-background dark:to-sky-950/20',
        title: 'from-cyan-700 to-sky-600',
        action: 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500',
    },
    'attendance-records': {
        surface:
            'from-violet-50/95 via-white to-indigo-100/70 dark:from-violet-950/25 dark:via-background dark:to-indigo-950/20',
        title: 'from-violet-700 to-indigo-600',
        action: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500',
    },
    timesheets: {
        surface:
            'from-emerald-50/95 via-white to-green-100/70 dark:from-emerald-950/25 dark:via-background dark:to-green-950/20',
        title: 'from-emerald-700 to-green-600',
        action: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500',
    },
    'payroll-exports': {
        surface:
            'from-amber-50/95 via-white to-orange-100/70 dark:from-amber-950/25 dark:via-background dark:to-orange-950/20',
        title: 'from-amber-700 to-orange-600',
        action: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
    },
};

const defaultTheme: ModuleTheme = {
    surface:
        'from-indigo-50/95 via-white to-teal-100/70 dark:from-indigo-950/30 dark:via-background dark:to-teal-950/20',
    title: 'from-indigo-700 to-teal-600',
    action: 'bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500',
};

const getTheme = (slug: string): ModuleTheme =>
    moduleThemes[slug] ?? defaultTheme;

const valueForInput = (field: ModuleField, value: unknown): string => {
    if (value === null || value === undefined) return '';

    if (field.type === 'date') {
        const parsed = moment(String(value));
        return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '';
    }

    if (field.type === 'datetime-local') {
        const parsed = moment(String(value));
        return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm') : '';
    }

    return String(value);
};

export default function ModuleForm() {
    const { module, mode, record } = usePage<ModuleFormPageProps>().props;

    const theme = getTheme(module.slug);

    const initialData = useMemo(() => {
        const obj: ModuleFormData = {};

        module.fields.forEach((field) => {
            if (field.type === 'checkbox') {
                obj[field.name] = Boolean(record?.[field.name] ?? false);
            } else {
                obj[field.name] = valueForInput(field, record?.[field.name]);
            }
        });

        return obj;
    }, [module.fields, record]);

    const { data, setData, post, put, processing, errors } =
        useForm<ModuleFormData>(initialData);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post(`${API}/${module.slug}`);
            return;
        }

        put(`${API}/${module.slug}/${String(record?.id)}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module.name, href: `${API}/${module.slug}` },
                {
                    title: mode === 'create' ? 'Create' : 'Edit',
                    href:
                        mode === 'create'
                            ? `${API}/${module.slug}/create`
                            : `${API}/${module.slug}/${String(record?.id)}/edit`,
                },
            ]}
        >
            <Head
                title={`${mode === 'create' ? 'Create' : 'Edit'} ${module.name}`}
            />

            <div
                className={`mx-2 my-6 rounded-2xl border bg-gradient-to-br p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6 ${theme.surface}`}
            >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1
                            className={`bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent ${theme.title}`}
                        >
                            {mode === 'create' ? 'Create' : 'Edit'}{' '}
                            {module.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {module.description}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => router.visit(`${API}/${module.slug}`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

                <Card className="border-white/70 bg-background/85 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {module.fields.map((field) => (
                                    <div
                                        key={field.name}
                                        className={
                                            field.type === 'textarea'
                                                ? 'md:col-span-2'
                                                : ''
                                        }
                                    >
                                        <Label htmlFor={field.name}>
                                            {field.label}
                                        </Label>

                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                id={field.name}
                                                value={String(
                                                    data[field.name] ?? '',
                                                )}
                                                onChange={(e) =>
                                                    setData(
                                                        field.name,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    field.placeholder ?? ''
                                                }
                                                className="mt-1"
                                            />
                                        ) : field.type === 'select' ? (
                                            <Select
                                                value={String(
                                                    data[field.name] ?? '',
                                                )}
                                                onValueChange={(value) =>
                                                    setData(field.name, value)
                                                }
                                            >
                                                <SelectTrigger className="mt-1 w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            field.placeholder ??
                                                            'Select an option'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(field.options ?? []).map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : field.type === 'checkbox' ? (
                                            <div className="mt-2 flex items-center gap-2 rounded-md border border-border/70 bg-muted/20 p-3">
                                                <Checkbox
                                                    id={field.name}
                                                    checked={Boolean(
                                                        data[field.name],
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setData(
                                                            field.name,
                                                            checked === true,
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={field.name}
                                                    className="font-normal"
                                                >
                                                    Enabled
                                                </Label>
                                            </div>
                                        ) : (
                                            <Input
                                                id={field.name}
                                                type={
                                                    field.type ===
                                                    'datetime-local'
                                                        ? 'datetime-local'
                                                        : field.type ===
                                                            'number'
                                                          ? 'number'
                                                          : field.type ===
                                                              'date'
                                                            ? 'date'
                                                            : 'text'
                                                }
                                                value={String(
                                                    data[field.name] ?? '',
                                                )}
                                                onChange={(e) =>
                                                    setData(
                                                        field.name,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    field.placeholder ?? ''
                                                }
                                                className="mt-1"
                                            />
                                        )}

                                        {errors[field.name] && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {String(errors[field.name])}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(`${API}/${module.slug}`)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={`${theme.action} text-white`}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
