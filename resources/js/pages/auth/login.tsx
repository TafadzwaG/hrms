import { Head, Link, useForm } from '@inertiajs/react';
import { BriefcaseBusiness, Building2, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react';
import type { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import type { PortalType } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    defaultPortal?: PortalType | null;
};

const portalCards: Array<{
    portal: PortalType;
    label: string;
    description: string;
    icon: typeof BriefcaseBusiness;
}> = [
    {
        portal: 'employee',
        label: 'Employee',
        description: 'HRMS workspace, payroll, leave, and internal operations.',
        icon: BriefcaseBusiness,
    },
    {
        portal: 'candidate',
        label: 'Candidate',
        description: 'Applications, profile management, and recruitment activity.',
        icon: UserRound,
    },
    {
        portal: 'employer',
        label: 'Employer',
        description: 'Company hiring, vacancies, candidates, and reports.',
        icon: Building2,
    },
];

export default function LoginPage({
    status,
    canResetPassword,
    canRegister,
    defaultPortal = null,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(store.url(), {
            onSuccess: () => setData('password', ''),
        });
    };

    const registerHref = register(
        defaultPortal ? { query: { portal: defaultPortal } } : undefined,
    );

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <Head title="Portal Login" />

            <div className="mb-8 flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
                    <ShieldCheck className="h-6 w-6 text-background" />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold text-foreground">Unified Portal Sign In</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Use one account. We route you to your default portal after sign in.
                    </p>
                </div>
            </div>

            <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                Access Portals
                            </p>
                            <h2 className="mt-2 text-lg font-semibold text-foreground">
                                One login, explicit home portal routing
                            </h2>
                        </div>
                        {defaultPortal ? <Badge variant="secondary">Preferred: {defaultPortal}</Badge> : null}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {portalCards.map((card) => {
                            const Icon = card.icon;
                            const isActive = defaultPortal === card.portal;

                            return (
                                <div
                                    key={card.portal}
                                    className={`rounded-xl border px-4 py-4 transition-colors ${
                                        isActive
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border bg-background/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{card.label}</p>
                                            {isActive ? (
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                                                    Link matched
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                        {card.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
                    <div className="mb-8 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                            Sign in
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Enter your account credentials to continue.
                        </p>
                    </div>

                    {status ? (
                        <div className="mb-6 rounded-md border border-border bg-muted p-3 text-center text-sm font-medium text-foreground">
                            {status}
                        </div>
                    ) : null}

                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-foreground">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="pl-10"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-foreground">
                                    Password
                                </Label>
                                {canResetPassword ? (
                                    <Link
                                        href={request()}
                                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Forgot password?
                                    </Link>
                                ) : null}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                            />
                            <Label htmlFor="remember" className="text-sm text-muted-foreground">
                                Keep me signed in
                            </Label>
                        </div>

                        <Button type="submit" className="mt-2 w-full" disabled={processing}>
                            {processing ? <Spinner className="mr-2" /> : null}
                            Sign In
                        </Button>
                    </form>

                    {canRegister ? (
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Need a new portal account?{' '}
                            <Link href={registerHref} className="font-semibold text-foreground hover:underline">
                                Register here
                            </Link>
                        </p>
                    ) : null}

                    <div className="mt-8 rounded-xl border border-border bg-background/60 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Routing
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Default destination is driven by your account portal identity. If you have multiple portals,
                            you can switch after sign in from the user menu.
                        </p>
                        <div className="mt-4">
                            <Button asChild variant="outline" className="w-full">
                                <Link href={login()}>Refresh login state</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}