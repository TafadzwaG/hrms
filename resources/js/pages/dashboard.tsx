import { Head } from '@inertiajs/react';
import { Activity, Clock3, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-2 my-6 rounded-2xl border bg-gradient-to-br from-indigo-50/95 via-white to-teal-100/70 p-1 shadow-sm sm:mx-4 md:mx-8 md:p-6 dark:from-indigo-950/25 dark:via-background dark:to-teal-950/20">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="bg-gradient-to-r from-indigo-700 to-teal-600 bg-clip-text text-2xl font-bold text-transparent">
                            Operations Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Live pulse of your HR modules and workflows.
                        </p>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-100">
                        Today
                    </Badge>
                </div>

                <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
                    <Card className="border-white/70 bg-background/90 backdrop-blur">
                        <CardHeader>
                            <CardDescription>Total Employees</CardDescription>
                            <CardTitle className="text-3xl">680</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                +18 this week
                            </span>
                            <Users className="h-5 w-5 text-indigo-600" />
                        </CardContent>
                    </Card>

                    <Card className="border-white/70 bg-background/90 backdrop-blur">
                        <CardHeader>
                            <CardDescription>
                                Attendance Compliance
                            </CardDescription>
                            <CardTitle className="text-3xl">94%</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Progress value={94} className="h-2" />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Target: 90%</span>
                                <Activity className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/70 bg-background/90 backdrop-blur">
                        <CardHeader>
                            <CardDescription>Pending Reviews</CardDescription>
                            <CardTitle className="text-3xl">27</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Due within 5 days
                            </span>
                            <Clock3 className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-4 border-white/70 bg-background/90 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Snapshot</CardTitle>
                        <CardDescription>
                            Color-coded progress indicators to quickly spot
                            where follow-up is needed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border bg-cyan-50/80 p-4 dark:bg-cyan-950/20">
                            <div className="text-xs text-muted-foreground">
                                Leave Requests
                            </div>
                            <div className="mt-1 text-xl font-semibold">
                                42 open
                            </div>
                        </div>
                        <div className="rounded-xl border bg-violet-50/80 p-4 dark:bg-violet-950/20">
                            <div className="text-xs text-muted-foreground">
                                Timesheets
                            </div>
                            <div className="mt-1 text-xl font-semibold">
                                88% submitted
                            </div>
                        </div>
                        <div className="rounded-xl border bg-emerald-50/80 p-4 dark:bg-emerald-950/20">
                            <div className="text-xs text-muted-foreground">
                                Onboarding
                            </div>
                            <div className="mt-1 text-xl font-semibold">
                                16 active
                            </div>
                        </div>
                        <div className="rounded-xl border bg-amber-50/80 p-4 dark:bg-amber-950/20">
                            <div className="text-xs text-muted-foreground">
                                Payroll
                            </div>
                            <div className="mt-1 text-xl font-semibold">
                                2 exports queued
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
