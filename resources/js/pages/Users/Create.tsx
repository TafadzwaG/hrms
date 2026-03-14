import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Fingerprint, KeyRound, Save, ShieldCheck, Users } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

type RoleOption = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    users_count: number;
    permissions_count: number;
};

type Meta = {
    supportsUsername: boolean;
    supportsRoleColumn: boolean;
    supportsEmailVerification: boolean;
};

function generatePassword(length = 12) {
    const charset =
        'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    return Array.from(values, (value) => charset[value % charset.length]).join(
        '',
    );
}

export default function UserCreate() {
    const { roles, meta } = usePage<{ roles: RoleOption[]; meta: Meta }>()
        .props;
    const { can } = useAuthorization();
    const canAssignRoles = can('users.assign_roles');

    const form = useForm({
        name: '',
        email: '',
        username: '',
        role: 'employee',
        password: '',
        password_confirmation: '',
        mark_email_verified: false,
        send_password_email: true,
        role_ids: [] as number[],
    });

    const toggleRole = (roleId: number) => {
        form.setData(
            'role_ids',
            form.data.role_ids.includes(roleId)
                ? form.data.role_ids.filter((id) => id !== roleId)
                : [...form.data.role_ids, roleId],
        );
    };

    const fillGeneratedPassword = () => {
        const password = generatePassword();
        form.setData('password', password);
        form.setData('password_confirmation', password);
        form.setData('send_password_email', true);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/users');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Users', href: '/users' },
                { title: 'Create User', href: '#' },
            ]}
        >
            <Head title="Create User" />

            <form
                onSubmit={submit}
                className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12"
            >
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 border-b border-border/50 pb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Create user
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Establish a new user profile, configure credentials,
                            and assign initial access roles.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold text-foreground shadow-sm"
                        >
                            <Link href="/users">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Saving...' : 'Create user'}
                        </Button>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Identity (Spans 5/12) */}
                    <div className="space-y-6 lg:col-span-5">
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <Fingerprint className="h-5 w-5 text-muted-foreground" />{' '}
                                    Identity
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Maintain the account profile and credential
                                    state.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Field
                                        label="Full Name"
                                        error={form.errors.name}
                                    >
                                        <Input
                                            value={form.data.name}
                                            onChange={(event) =>
                                                form.setData(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            className="h-11 bg-background text-base shadow-sm"
                                            placeholder="e.g. John Doe"
                                        />
                                    </Field>

                                    {meta.supportsUsername ? (
                                        <Field
                                            label="Username"
                                            error={form.errors.username}
                                        >
                                            <Input
                                                value={form.data.username}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'username',
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background text-base shadow-sm"
                                            />
                                        </Field>
                                    ) : null}
                                </div>

                                <Field
                                    label="Email Address"
                                    error={form.errors.email}
                                >
                                    <Input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        className="h-11 bg-background text-base shadow-sm"
                                        placeholder="user@company.com"
                                    />
                                </Field>

                                {meta.supportsRoleColumn ? (
                                    <Field
                                        label="Legacy Role Column"
                                        error={form.errors.role}
                                    >
                                        <Input
                                            value={form.data.role}
                                            onChange={(event) =>
                                                form.setData(
                                                    'role',
                                                    event.target.value,
                                                )
                                            }
                                            className="h-11 bg-background text-base shadow-sm"
                                        />
                                    </Field>
                                ) : null}

                                <div className="border-t border-border/50 pt-6">
                                    <h4 className="mb-4 text-sm font-bold text-foreground">
                                        Security & Verification
                                    </h4>

                                    <div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <Field
                                            label="Initial Password"
                                            error={form.errors.password}
                                        >
                                            <Input
                                                type="text"
                                                value={form.data.password}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'password',
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background font-mono text-base shadow-sm"
                                            />
                                        </Field>
                                        <Field
                                            label="Confirm Password"
                                            error={
                                                form.errors
                                                    .password_confirmation
                                            }
                                        >
                                            <Input
                                                type="text"
                                                value={
                                                    form.data
                                                        .password_confirmation
                                                }
                                                onChange={(event) =>
                                                    form.setData(
                                                        'password_confirmation',
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background font-mono text-base shadow-sm"
                                            />
                                        </Field>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mb-6 h-11 w-full border-border/50 bg-muted/10 font-bold text-muted-foreground shadow-none hover:text-foreground"
                                        onClick={fillGeneratedPassword}
                                    >
                                        <KeyRound className="mr-2 h-4 w-4" />
                                        Generate secure password
                                    </Button>

                                    <div className="space-y-4">
                                        <label className="flex cursor-pointer items-center gap-3">
                                            <Checkbox
                                                checked={
                                                    form.data
                                                        .send_password_email
                                                }
                                                onCheckedChange={(value) =>
                                                    form.setData(
                                                        'send_password_email',
                                                        Boolean(value),
                                                    )
                                                }
                                                className="border-border/50 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                            />
                                            <span className="text-sm font-medium text-foreground">
                                                Email password to user
                                            </span>
                                        </label>
                                        {meta.supportsEmailVerification ? (
                                            <label className="flex cursor-pointer items-center gap-3">
                                                <Checkbox
                                                    checked={
                                                        form.data
                                                            .mark_email_verified
                                                    }
                                                    onCheckedChange={(value) =>
                                                        form.setData(
                                                            'mark_email_verified',
                                                            Boolean(value),
                                                        )
                                                    }
                                                    className="border-border/50 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                                />
                                                <span className="text-sm font-medium text-foreground">
                                                    Mark account as verified
                                                </span>
                                            </label>
                                        ) : null}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Role Assignment (Spans 7/12) */}
                    <div className="space-y-6 lg:col-span-7">
                        <Card className="h-full border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />{' '}
                                    Role assignment
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {canAssignRoles
                                        ? 'Adjust role memberships for this account.'
                                        : 'You do not have permission to assign roles.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 md:p-8">
                                {canAssignRoles ? (
                                    roles.map((roleOption) => {
                                        const checked =
                                            form.data.role_ids.includes(
                                                roleOption.id,
                                            );

                                        return (
                                            <label
                                                key={roleOption.id}
                                                className={`flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition-colors ${checked ? 'border-foreground bg-muted/5 shadow-sm' : 'border-border/50 bg-background hover:bg-muted/10'}`}
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() =>
                                                        toggleRole(
                                                            roleOption.id,
                                                        )
                                                    }
                                                    className="mt-1 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                                />
                                                <div className="w-full space-y-3">
                                                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                        <div className="flex items-center gap-3">
                                                            <Badge
                                                                variant="secondary"
                                                                className={`px-1.5 py-0 font-mono text-[9px] tracking-widest uppercase shadow-none ${checked ? 'border-transparent bg-foreground text-background' : 'border-transparent bg-muted text-muted-foreground'}`}
                                                            >
                                                                {roleOption.name.substring(
                                                                    0,
                                                                    3,
                                                                )}
                                                            </Badge>
                                                            <span className="text-base leading-none font-bold text-foreground">
                                                                {
                                                                    roleOption.name
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                                            Code:{' '}
                                                            {roleOption.code}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                                        {roleOption.description ||
                                                            'No role description provided.'}
                                                    </p>
                                                    <div className="flex items-center gap-6 pt-1 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        <span className="flex items-center gap-1.5">
                                                            <KeyRound className="h-3.5 w-3.5 opacity-70" />{' '}
                                                            {
                                                                roleOption.permissions_count
                                                            }{' '}
                                                            Permissions
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Users className="h-3.5 w-3.5 opacity-70" />{' '}
                                                            {
                                                                roleOption.users_count
                                                            }{' '}
                                                            Assigned
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm font-medium text-muted-foreground">
                                        Role assignments are controlled by the{' '}
                                        <strong className="text-foreground">
                                            users.assign_roles
                                        </strong>{' '}
                                        permission.
                                    </div>
                                )}
                                {form.errors.role_ids && (
                                    <p className="mt-2 text-sm font-bold text-destructive">
                                        {form.errors.role_ids}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Minimal Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 md:flex-row">
                <p className="text-[11px] font-medium text-muted-foreground">
                    © 2024 Enterprise HRMS Portal. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Help Center
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
        </div>
    );
}
