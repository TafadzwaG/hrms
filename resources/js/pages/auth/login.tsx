import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title={
                <span className="font-bold text-slate-900">
                    Employee Portal Login
                </span>
            }
            description="Welcome back! Please enter your credentials to access the HRMS."
        >
            <Head title="Employee Login" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                    Work Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    className="border-slate-200 focus:ring-slate-500 focus:border-slate-500 transition-all"
                                    placeholder="name@company.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-900"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    className="border-slate-200 focus:ring-slate-500 focus:border-slate-500 transition-all"
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    className="border-slate-300 text-slate-900 focus:ring-slate-500"
                                />
                                <Label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Keep me signed in
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 shadow-sm transition-all duration-300 border-none"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner className="mr-2" /> : null}
                                Sign in to Workspace
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-slate-500">
                                New hire?{' '}
                                <TextLink
                                    href={register()}
                                    className="font-bold text-slate-900 hover:text-slate-700 underline-offset-4"
                                    tabIndex={5}
                                >
                                    Initialize account
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-6 p-3 rounded-lg bg-emerald-50 text-center text-sm font-medium text-emerald-700 border border-emerald-100">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
