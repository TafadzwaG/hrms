import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from '@/components/ui/hover-card';
import { Info } from 'lucide-react';

export default function Register() {
    return (
        <AuthLayout
            title={
                <span className="font-bold text-slate-900">
                    Join the Talent Pool
                </span>
            }
            description="Complete your employee profile to get started with the HRMS portal."
        >
            <Head title="Employee Registration" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Legal Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    className="border-slate-200 focus:ring-slate-500"
                                    placeholder="e.g. Jane Doe"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Work Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Work Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    className="border-slate-200 focus:ring-slate-500"
                                    placeholder="j.doe@company.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password with HoverCard for Security Tips */}
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="password">Security Password</Label>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Info className="size-4 text-slate-400 cursor-help" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80 border-slate-200 bg-white">
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-slate-900">Corporate Security Policy</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Our HRMS requires a strong password to protect your sensitive personal and payroll data.
                                                    Use 8+ characters with a mix of letters, numbers, and symbols.
                                                </p>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    className="border-slate-200 focus:ring-slate-500"
                                    placeholder="Create a strong password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-slate-700 dark:text-slate-300">Verify Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    className="border-slate-200 focus:ring-slate-500"
                                    placeholder="Repeat password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 shadow-sm transition-all duration-300 border-none"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2" />}
                                Complete Enrollment
                            </Button>
                        </div>

                        <div className="text-center text-sm text-slate-500">
                            Already part of the team?{' '}
                            <TextLink
                                href={login()}
                                className="font-bold text-slate-900 hover:text-slate-700 underline-offset-4"
                                tabIndex={6}
                            >
                                Sign in here
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
