import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import moment from 'moment';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';

type ModuleField = {
    name: string;
    label: string;
    type?: string;
};

type ModuleMeta = {
    slug: string;
    name: string;
    fields: ModuleField[];
};

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

const formatValue = (value: unknown, field?: ModuleField): ReactNode => {
    if (value === null || value === undefined || value === '') return '�';

    if (
        field?.type === 'date' ||
        field?.type === 'datetime' ||
        field?.type === 'datetime-local'
    ) {
        const parsed = moment(String(value));
        return parsed.isValid()
            ? parsed.format(field.type === 'date' ? 'll' : 'lll')
            : String(value);
    }

    if (typeof value === 'boolean') {
        return (
            <Badge variant={value ? 'default' : 'secondary'}>
                {value ? 'Yes' : 'No'}
            </Badge>
        );
    }

    return String(value);
};

export default function ModuleShow() {
    const { module, record } = usePage().props as {
        module: ModuleMeta;
        record: Record<string, unknown>;
    };

    const theme = getTheme(module.slug);

    const handleDelete = () => {
        const confirmed = window.confirm(
            'Delete this record? This action cannot be undone.',
        );
        if (!confirmed) return;

        router.delete(`${API}/${module.slug}/${String(record.id)}`, {
            preserveScroll: true,
            onSuccess: () => router.visit(`${API}/${module.slug}`),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: module.name, href: `${API}/${module.slug}` },
                {
                    title: `#${String(record.id)}`,
                    href: `${API}/${module.slug}/${String(record.id)}`,
                },
            ]}
        >
            <Head title={`${module.name} #${String(record.id)}`} />

            <div
                className={`mx-2 my-6 rounded-2xl border bg-gradient-to-br p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6 ${theme.surface}`}
            >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1
                            className={`bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent ${theme.title}`}
                        >
                            {module.name} - #{String(record.id)}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.visit(`${API}/${module.slug}`)
                            }
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button
                            asChild
                            className={`${theme.action} text-white`}
                        >
                            <Link
                                href={`${API}/${module.slug}/${String(record.id)}/edit`}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Card className="border-white/70 bg-background/90 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Record Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {module.fields.map((field) => (
                                <div key={field.name}>
                                    <div className="mb-1 text-xs text-muted-foreground">
                                        {field.label}
                                    </div>
                                    <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
                                        {formatValue(record[field.name], field)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
