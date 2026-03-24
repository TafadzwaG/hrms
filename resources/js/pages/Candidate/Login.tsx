import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User } from 'lucide-react';
import { FormEventHandler } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function CandidateLogin({ status, canResetPassword = true }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/candidate/login');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans">
            <Head title="Candidate Login" />

            <div className="mb-8 flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">
                    <AppLogoIcon className="h-6 w-6 fill-white" />
                </div>
                <span className="text-lg font-semibold text-zinc-900">HRX Candidate Portal</span>
            </div>

            <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-8 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-zinc-500">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium uppercase tracking-wide">Candidate Portal</span>
                    </div>
                    <p className="text-sm text-zinc-500">Log in to manage your applications and profile</p>
                </div>

                {status ? (
                    <div className="mb-6 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-center text-sm font-medium text-zinc-700">
                        {status}
                    </div>
                ) : null}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-zinc-700">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
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
                            <Label htmlFor="password" className="text-zinc-700">
                                Password
                            </Label>
                            {canResetPassword ? (
                                <Link href="/candidate/forgot-password" className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900">
                                    Forgot password?
                                </Link>
                            ) : null}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="********"
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(event) => setData('remember', event.target.checked)}
                            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                        />
                        <Label htmlFor="remember" className="text-sm text-zinc-600">
                            Remember me
                        </Label>
                    </div>

                    <Button type="submit" className="mt-2 w-full bg-zinc-900 py-5 font-semibold text-white hover:bg-zinc-800" disabled={processing}>
                        {processing ? <Spinner className="mr-2" /> : null}
                        Log In
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-zinc-400 uppercase tracking-wide">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-500">
                Don&apos;t have an account?{' '}
                <Link href="/candidate/register" className="font-semibold text-zinc-900 hover:underline">
                    Create candidate account
                </Link>
            </p>
        </div>
    );
}
