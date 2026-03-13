import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Filter,
    LineChart,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    TrendingUp,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function PositionShow() {
    const { position } = usePage().props as any;

    // Safety fallbacks matching the DB schema
    const name = position?.name || 'Senior Software Engineer';
    const code = position?.code || 'SWE-001';
    const description =
        position?.description ||
        'Architecting scalable systems, mentoring junior developers, and leading technical initiatives. Focus on 99.9% uptime targets and CI/CD optimization within the Engineering vertical.';
    const isActive = position?.is_active ?? true;
    const orgUnit = position?.org_unit?.name || 'Engineering';
    const employeesCount =
        position?.employees_count || position?.employees?.length || 15;
    const employees = position?.employees || [];

    const created = position?.created_at
        ? moment(position.created_at).format('MMM DD, YYYY')
        : 'Jan 12, 2024';
    const modified = position?.updated_at
        ? moment(position.updated_at).format('MMM DD, YYYY')
        : 'Mar 05, 2024';

    // Mock analytical data to match the screenshot layout
    const targetHeadcount = 20;
    const occupancyRate = Math.min(
        100,
        Math.round((employeesCount / targetHeadcount) * 100),
    );

    const handleDelete = () => {
        router.delete(`${API}/positions/${position?.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Positions', href: `${API}/positions` },
                { title: name, href: '#' },
            ]}
        >
            <Head title={`Position: ${name}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-0.5 h-10 w-10 shrink-0 bg-background shadow-sm"
                            onClick={() => router.visit(`${API}/positions`)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {name}
                                </h1>
                                {isActive ? (
                                    <Badge
                                        variant="outline"
                                        className="border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                                    >
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="bg-muted px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
                                    >
                                        Inactive
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <span>
                                    Job Code:{' '}
                                    <span className="font-bold text-foreground">
                                        {code}
                                    </span>
                                </span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                                <span>{orgUnit} Dept</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="bg-background font-semibold shadow-sm"
                            onClick={() =>
                                router.visit(
                                    `${API}/positions/${position?.id}/edit`,
                                )
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Position
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-destructive/20 bg-background font-semibold text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Delete Position?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the{' '}
                                        <strong>{name}</strong> role? This
                                        cannot be done if there are employees
                                        currently assigned to this position.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Yes, Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: Metrics & System Stats (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Headcount Top Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-border shadow-sm">
                                <CardContent className="p-5">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Active Headcount
                                    </p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-4xl font-extrabold tracking-tight text-foreground">
                                            {employeesCount}
                                        </p>
                                        <div className="mb-1 flex items-center text-xs font-bold text-emerald-500">
                                            <TrendingUp className="mr-1 h-3 w-3" />
                                            20%
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border shadow-sm">
                                <CardContent className="p-5">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Target
                                    </p>
                                    <div className="flex flex-col">
                                        <p className="text-4xl font-extrabold tracking-tight text-foreground">
                                            {targetHeadcount}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            {Math.max(
                                                0,
                                                targetHeadcount -
                                                    employeesCount,
                                            )}{' '}
                                            Seats Available
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Occupancy Rate */}
                        <Card className="border-border shadow-sm">
                            <CardContent className="space-y-4 p-6">
                                <div className="flex items-end justify-between">
                                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        Occupancy Rate
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                        {occupancyRate}%
                                    </p>
                                </div>
                                <Progress
                                    value={occupancyRate}
                                    className="h-3"
                                />
                                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <span>Capacity Reached</span>
                                    <span>Q1 Target</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vacancies / Hiring */}
                        <Card className="border-dashed border-border bg-muted/30 shadow-sm">
                            <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">
                                        05 Open Vacancies
                                    </h3>
                                    <p className="mt-1 px-4 text-sm leading-relaxed text-muted-foreground">
                                        Strategic hiring phase active for Senior
                                        engineering roles.
                                    </p>
                                </div>
                                <Button className="w-full font-bold shadow-sm">
                                    Create Requisition
                                </Button>
                            </CardContent>
                        </Card>

                        {/* System Registry */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    System Registry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        Record Created
                                    </span>
                                    <span className="font-bold text-foreground">
                                        {created}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        Last Modified
                                    </span>
                                    <span className="font-bold text-foreground">
                                        {modified}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t pt-1">
                                    <span className="font-medium text-muted-foreground">
                                        Data Integrity
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="border-emerald-200 bg-emerald-50 text-[9px] font-bold tracking-widest text-emerald-600 uppercase shadow-none"
                                    >
                                        Synced
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Specs, Staff, Insights (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Role Specifications */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Role Specifications
                                </CardTitle>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                    ID: #{position?.id}-POS
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-1.5 rounded-lg border bg-muted/30 p-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Department
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {orgUnit}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5 rounded-lg border bg-muted/30 p-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Reports To
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            CTO Office
                                        </p>
                                    </div>
                                    <div className="space-y-1.5 rounded-lg border bg-muted/30 p-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Work Type
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            Full-Time Hybrid
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Primary Accountability
                                    </p>
                                    <p className="text-sm leading-relaxed font-medium text-foreground/80">
                                        {description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assigned Staff */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Assigned Staff
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs font-bold shadow-none"
                                    >
                                        {employeesCount} Records
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-muted"
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-muted"
                                    >
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                                                <TableHead className="h-10 pl-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Staff ID
                                                </TableHead>
                                                <TableHead className="h-10 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Full Name
                                                </TableHead>
                                                <TableHead className="h-10 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Tenure/Status
                                                </TableHead>
                                                <TableHead className="h-10 pr-6 text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Analytical View
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {employees.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="h-32 text-center text-muted-foreground"
                                                    >
                                                        No employees assigned to
                                                        this position.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                employees.map(
                                                    (
                                                        emp: any,
                                                        index: number,
                                                    ) => {
                                                        // Mock visual variation for demonstration
                                                        const tenureMock = [
                                                            '5Y+ TENURE',
                                                            'PROBATION',
                                                            '2Y+ TENURE',
                                                            '4Y+ TENURE',
                                                        ][index % 4];
                                                        const tagMock = [
                                                            '',
                                                            'NEW HIRE',
                                                            'TOP PERF',
                                                            '',
                                                        ][index % 4];
                                                        const tenureColor =
                                                            index % 2 === 0
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'bg-amber-100 text-amber-700';

                                                        return (
                                                            <TableRow
                                                                key={emp.id}
                                                                className="hover:bg-muted/30"
                                                            >
                                                                <TableCell className="py-3 pl-6 font-mono text-xs text-muted-foreground">
                                                                    {emp.staff_number ||
                                                                        `#${101 + index}-ALJ`}
                                                                </TableCell>
                                                                <TableCell className="text-sm font-bold text-foreground">
                                                                    {
                                                                        emp.full_name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`${tenureColor} border-transparent px-1.5 py-0 text-[9px] font-bold tracking-widest uppercase shadow-none`}
                                                                        >
                                                                            {
                                                                                tenureMock
                                                                            }
                                                                        </Badge>
                                                                        {tagMock && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="bg-muted px-1.5 py-0 text-[9px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                                                                            >
                                                                                {
                                                                                    tagMock
                                                                                }
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="pr-6 text-right">
                                                                    <Button
                                                                        variant="link"
                                                                        className="h-auto px-0 text-xs font-bold text-primary"
                                                                    >
                                                                        Metrics
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    },
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {employeesCount > employees.length && (
                                    <div className="w-full border-t bg-muted/10 p-3 text-center">
                                        <Button
                                            variant="ghost"
                                            className="text-xs font-bold text-muted-foreground hover:text-foreground"
                                        >
                                            View Detailed Personnel Report (
                                            {employeesCount - employees.length}{' '}
                                            more){' '}
                                            <ChevronDown className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bottom Analytics Row */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Image/Insight Card Placeholder */}
                            <Card className="relative flex min-h-[180px] items-end overflow-hidden border-transparent bg-muted shadow-sm">
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <LineChart className="h-32 w-32" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                                <CardContent className="relative z-10 space-y-2 p-5">
                                    <h4 className="text-[10px] font-bold tracking-widest text-foreground uppercase">
                                        Utilization Insight
                                    </h4>
                                    <p className="text-xs leading-relaxed font-medium text-foreground/80">
                                        Engineering bandwidth is currently
                                        optimized. High retention in the {code}{' '}
                                        cohort (94%).
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Recommendation Card */}
                            <Card className="flex flex-col border-border shadow-sm">
                                <CardContent className="flex flex-1 flex-col justify-between space-y-4 p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                            </div>
                                            <h4 className="text-sm font-bold text-foreground">
                                                Analyst Recommendation
                                            </h4>
                                        </div>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            No immediate churn risk detected for
                                            this position code. Budget approved
                                            for 2 additional Senior hires in Q3.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 border-t pt-4">
                                        <div>
                                            <p className="mb-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Avg Tenure
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                3.8 Years
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Retention
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                High
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
