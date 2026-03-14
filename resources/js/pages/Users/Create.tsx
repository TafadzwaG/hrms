import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Copy,
    Hash,
    Info,
    KeyRound,
    Mail,
    Save,
    Shield,
    ShieldCheck,
    User,
    Wand2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function generateStrongPassword(length = 12) {
    const charset =
        'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    const arr = new Uint32Array(length);

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(arr);
    } else {
        for (let i = 0; i < length; i++)
            arr[i] = Math.floor(Math.random() * charset.length);
    }

    return Array.from(arr, (x) => charset[x % charset.length]).join('');
}

export default function UserCreate() {
    const { roles, meta } = usePage().props as any;

    const PATHS = useMemo(
        () => ({
            index: `${API}/users`,
            store: `${API}/users`,
        }),
        [],
    );

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        email: '',
        username: '',
        role: 'employee',

        password: '',
        password_confirmation: '',

        mark_email_verified: false,
        unverify_email: false,

        send_password_email: true,

        role_ids: [] as number[],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleRole = (id: number) => {
        setData(
            'role_ids',
            data.role_ids.includes(id)
                ? data.role_ids.filter((x) => x !== id)
                : [...data.role_ids, id],
        );
    };

    const handleGeneratePassword = () => {
        const pwd = generateStrongPassword(12);
        setData('password', pwd);
        setData('password_confirmation', pwd);
        setData('send_password_email', true);
    };

    const copyPassword = async () => {
        if (!data.password) return;
        try {
            await navigator.clipboard.writeText(data.password);
        } catch {
            // ignore
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(PATHS.store, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: PATHS.index },
                { title: 'Create User', href: '#' },
            ]}
        >
            <Head title="Create User" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Visual Context Breadcrumb */}
                <div className="mb-6 flex items-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    <span
                        className="cursor-pointer transition-colors hover:text-foreground"
                        onClick={() => router.visit(PATHS.index)}
                    >
                        Users
                    </span>
                    <span className="mx-2">&rsaquo;</span>
                    <span className="text-foreground">Create Profile</span>
                </div>

                <div className="mb-8 flex w-full flex-col gap-6 border-b border-border/50 pb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm sm:flex"
                            onClick={() => router.visit(PATHS.index)}
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                                Create User
                            </h1>
                            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Badge
                                    variant="outline"
                                    className="border-dashed bg-background px-1.5 py-0 text-[9px] tracking-widest text-muted-foreground uppercase shadow-none"
                                >
                                    New Account
                                </Badge>
                                <span className="opacity-50">•</span>
                                <span className="font-mono">ID Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form
                    id="create-user-form"
                    onSubmit={handleSubmit}
                    className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-8"
                >
                    {/* LEFT COLUMN: Main Form (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* User Information */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-bold">
                                            <User className="h-4 w-4 text-muted-foreground" />{' '}
                                            Full Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            placeholder="John Doe"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className={`h-11 bg-background text-base ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {errors.name && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-bold">
                                            <Mail className="h-4 w-4 text-muted-foreground" />{' '}
                                            Email Address{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="email"
                                            placeholder="j.doe@providence-hrms.com"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className={`h-11 bg-background text-base ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {errors.email && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {meta?.supportsUsername && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-bold">
                                                <Hash className="h-4 w-4 text-muted-foreground" />{' '}
                                                Username
                                            </Label>
                                            <Input
                                                placeholder="jdoe_admin_01"
                                                value={data.username}
                                                onChange={(e) =>
                                                    setData(
                                                        'username',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background text-base ${errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.username && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {meta?.supportsRoleColumn && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-bold">
                                                <Shield className="h-4 w-4 text-muted-foreground" />{' '}
                                                Legacy Role
                                            </Label>
                                            <Input
                                                placeholder="Enterprise Admin"
                                                value={data.role}
                                                onChange={(e) =>
                                                    setData(
                                                        'role',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background text-base ${errors.role ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.role && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.role}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Password */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="text-sm font-bold tracking-widest text-foreground uppercase">
                                    Security & Password
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGeneratePassword}
                                        className="h-8 bg-muted/20 text-xs font-bold"
                                    >
                                        <Wand2 className="mr-2 h-3.5 w-3.5" />{' '}
                                        Generate
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={copyPassword}
                                        disabled={!data.password}
                                        className="h-8 bg-muted/20 text-xs font-bold"
                                    >
                                        <Copy className="mr-2 h-3.5 w-3.5" />{' '}
                                        Copy
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">
                                            Initial Password{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-11 bg-background font-mono text-base ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            required
                                        />
                                        {errors.password && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">
                                            Confirm Password{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-11 bg-background font-mono text-base ${errors.password_confirmation ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            required
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                    <Checkbox
                                        id="send_email"
                                        checked={!!data.send_password_email}
                                        onCheckedChange={(v) =>
                                            setData('send_password_email', !!v)
                                        }
                                        disabled={!data.email || !data.password}
                                        className="mt-0.5"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="send_email"
                                            className="cursor-pointer text-sm font-bold text-primary"
                                        >
                                            Email password to user
                                        </Label>
                                        <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                            Recommended if you generated a
                                            temporary password. This will
                                            trigger an automated secure
                                            notification.
                                        </p>
                                    </div>
                                </div>

                                {meta?.supportsEmailVerification && (
                                    <>
                                        <Separator className="my-6 bg-border/50" />
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Email Verification Status
                                            </p>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/10">
                                                    <Checkbox
                                                        checked={
                                                            !!data.mark_email_verified
                                                        }
                                                        onCheckedChange={(v) =>
                                                            setData(
                                                                'mark_email_verified',
                                                                !!v,
                                                            )
                                                        }
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">
                                                            Mark as verified
                                                        </p>
                                                    </div>
                                                </label>
                                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/10">
                                                    <Checkbox
                                                        checked={
                                                            !!data.unverify_email
                                                        }
                                                        onCheckedChange={(v) =>
                                                            setData(
                                                                'unverify_email',
                                                                !!v,
                                                            )
                                                        }
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">
                                                            Unverify email
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Assign Roles */}
                        <Card className="border-border bg-muted/5 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Assign Roles (RBAC)
                                </CardTitle>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                    v3.2.0-secure
                                </span>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {roles.map((r: any) => (
                                        <label
                                            key={r.id}
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${data.role_ids.includes(r.id) ? 'border-primary/50 bg-background shadow-sm' : 'border-border bg-background hover:bg-muted/20'}`}
                                        >
                                            <Checkbox
                                                checked={data.role_ids.includes(
                                                    r.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleRole(r.id)
                                                }
                                                className="mt-0.5"
                                            />
                                            <div className="w-full space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="mr-2 truncate text-sm font-bold text-foreground">
                                                        {r.name}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-muted px-1.5 py-0 font-mono text-[9px] tracking-widest text-foreground uppercase shadow-none"
                                                >
                                                    {r.code}
                                                </Badge>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.role_ids && (
                                    <p className="mt-3 text-xs font-medium text-destructive">
                                        {errors.role_ids}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* System Tip */}
                        <Card className="relative overflow-hidden border-transparent bg-foreground text-background shadow-md">
                            <div className="pointer-events-none absolute -top-4 -right-4 opacity-5">
                                <Shield className="h-32 w-32" />
                            </div>
                            <CardContent className="relative z-10 space-y-4 p-6">
                                <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                                    <KeyRound className="h-4 w-4" /> System Tip
                                </h3>
                                <p className="text-xs leading-relaxed font-medium opacity-90">
                                    When setting a user's password, use the{' '}
                                    <strong className="rounded bg-foreground/20 px-1 text-background">
                                        'Generate'
                                    </strong>{' '}
                                    tool to create a cryptographically secure
                                    string.
                                </p>
                                <p className="text-xs leading-relaxed font-medium opacity-90">
                                    Checking{' '}
                                    <strong className="rounded bg-foreground/20 px-1 text-background">
                                        'Email password to user'
                                    </strong>{' '}
                                    will trigger an automated secure
                                    notification containing the credentials.
                                </p>
                                <Button
                                    variant="secondary"
                                    className="mt-2 h-10 w-full text-xs font-bold shadow-none"
                                >
                                    Learn More About RBAC
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Security Policy Note */}
                        <Card className="relative overflow-hidden border-border bg-zinc-950 text-zinc-50 shadow-sm">
                            <CardContent className="relative z-10 space-y-4 p-6">
                                <h3 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                    Security Policy
                                </h3>
                                <p className="text-xs leading-relaxed font-medium text-zinc-300">
                                    This user will hold system privileges based
                                    on assigned roles. All role assignments are
                                    logged for annual compliance audit.
                                </p>
                                <div className="mt-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                                    <Info className="h-4 w-4 shrink-0" /> Audits
                                    are strictly enforced.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>

                {/* Sticky Footer Actions */}
                <div className="sticky bottom-0 z-40 mt-4 flex w-full items-center justify-end gap-4 border-t bg-background p-4 px-6 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-12">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => router.visit(PATHS.index)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-user-form"
                        className="h-11 min-w-[160px] bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                        disabled={processing || isSubmitting}
                    >
                        {processing || isSubmitting ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Create User
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
