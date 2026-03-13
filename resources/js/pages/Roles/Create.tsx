import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    FileText,
    Fingerprint,
    Lightbulb,
    Save,
    ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function RoleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(`${API}/roles`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'System Settings', href: '#' },
                { title: 'Roles & Permissions', href: `${API}/roles` },
                { title: 'Configure Role', href: '#' },
            ]}
        >
            <Head title="Configure System Role" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10">
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8 max-w-3xl">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Configure System Role
                        </h1>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                            Roles dictate user access levels and system
                            permissions.
                        </p>
                    </div>

                    <form id="role-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12">
                            {/* LEFT COLUMN: Form Sections */}
                            <div className="space-y-6 lg:col-span-8">
                                {/* Role Identification */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                            <Fingerprint className="h-5 w-5 text-primary" />
                                            Role Identification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Role Name
                                            </Label>
                                            <Input
                                                placeholder="e.g. HR Manager"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background text-base ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs font-medium text-destructive">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Role Code
                                            </Label>
                                            <Input
                                                placeholder="e.g. HR-MGR"
                                                value={data.code}
                                                onChange={(e) =>
                                                    setData(
                                                        'code',
                                                        e.target.value.toUpperCase(),
                                                    )
                                                }
                                                className={`h-11 bg-background text-base uppercase ${errors.code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.code ? (
                                                <p className="mt-1 text-xs font-medium text-destructive">
                                                    <span className="font-bold">
                                                        !
                                                    </span>{' '}
                                                    {errors.code}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Role codes must be unique
                                                    and are used for system
                                                    mapping (no spaces).
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Role Context */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                            <FileText className="h-5 w-5 text-primary" />
                                            Role Context
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 p-6">
                                        <Label className="text-sm font-semibold">
                                            Role Description
                                        </Label>
                                        <Textarea
                                            placeholder="Briefly describe the purpose and scope of this role..."
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className={`min-h-[140px] resize-none bg-background text-base ${errors.description ? 'border-destructive' : ''}`}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-xs font-medium text-destructive">
                                                {errors.description}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT COLUMN: Guidelines & Context */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Guidelines Card */}
                                <Card className="border-border bg-muted/30 shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-3">
                                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Lightbulb className="h-5 w-5 text-primary" />
                                            Configuration Guidelines
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                1
                                            </div>
                                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                                Codes should be{' '}
                                                <span className="font-bold text-foreground">
                                                    UPPERCASE
                                                </span>{' '}
                                                with hyphens for consistency.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                2
                                            </div>
                                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                                Deleting roles is restricted if
                                                users are currently attached.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                3
                                            </div>
                                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                                Permissions can be assigned to
                                                this role in the{' '}
                                                <span className="cursor-pointer text-foreground underline hover:text-primary">
                                                    Permissions Matrix
                                                </span>{' '}
                                                after creation.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* System State Card */}
                                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                    <CardContent className="flex items-center gap-4 p-5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background">
                                            <ShieldAlert className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                System State
                                            </p>
                                            <p className="text-sm font-bold text-foreground">
                                                Creating New Role
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 z-40 flex flex-col items-center justify-end gap-4 border-t bg-background p-4 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:flex-row md:px-8">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full font-bold text-muted-foreground hover:text-foreground sm:w-auto"
                        onClick={() => router.visit(`${API}/roles`)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="role-form"
                        className="w-full bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
                        disabled={processing || isSubmitting}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {processing || isSubmitting ? 'Saving...' : 'Save Role'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
