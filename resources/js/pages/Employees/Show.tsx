import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    CalendarDays,
    ChevronRight,
    Clock3,
    Download,
    FileText,
    Folder,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Shield,
    Trash2,
    User2,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useMemo, useState, type ReactNode } from 'react';
import Swal from 'sweetalert2';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';

export default function EmployeeShow() {
    const { employee } = usePage().props as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');

    const PATHS = {
        index: `${API}/employees`,
        edit: `${API}/employees/${employee.id}/edit`,
        destroy: `${API}/employees/${employee.id}`,
    };

    const cannotDelete =
        (employee.leave_applications_count || 0) > 0 ||
        (employee.leave_balances_count || 0) > 0;

    const fullName = [
        employee?.first_name,
        employee?.middle_name,
        employee?.surname,
    ]
        .filter(Boolean)
        .join(' ')
        .trim();

    const departmentName = employee?.department?.name ?? 'No department';
    const positionName = employee?.position?.name ?? 'No position';
    const roleName = titleCase(employee?.user?.role ?? 'employee');
    const staffNumber = employee?.staff_number || `EMP-${employee?.id ?? '—'}`;
    const payPoint = employee?.pay_point ?? 'Not assigned';
    const joinedAt = employee?.created_at ?? employee?.user?.created_at ?? null;
    const lastUpdatedAt =
        employee?.updated_at ?? employee?.user?.updated_at ?? null;
    const email = employee?.user?.email ?? '—';
    const contactNumber = employee?.contact_number || 'N/A';
    const address = employee?.address || 'N/A';
    const age = employee?.date_of_birth
        ? calculateAge(employee.date_of_birth)
        : null;

    const managerFullName = [
        employee?.manager?.first_name,
        employee?.manager?.surname,
    ]
        .filter(Boolean)
        .join(' ');
    const managerName =
        employee?.manager?.name || managerFullName || 'No manager assigned';
    const managerTitle =
        employee?.manager?.position?.name ??
        employee?.manager?.job_title ??
        'Reporting line unavailable';
    const directReports =
        employee?.direct_reports_count ?? employee?.reports_count ?? 0;

    const emergencyName =
        employee?.emergency_contact_name ??
        employee?.next_of_kin_name ??
        'Not provided';
    const emergencyRelationship =
        employee?.emergency_contact_relationship ??
        employee?.next_of_kin_relationship ??
        'Relationship not provided';
    const emergencyPhone =
        employee?.emergency_contact_phone ??
        employee?.next_of_kin_phone ??
        'No phone number';

    const personalCompletion = completionScore([
        employee?.first_name,
        employee?.surname,
        employee?.staff_number,
        employee?.date_of_birth,
    ]);
    const contactCompletion = completionScore([
        employee?.user?.email,
        employee?.contact_number,
        employee?.address,
        emergencyPhone,
    ]);
    const employmentCompletion = completionScore([
        employee?.pay_point,
        employee?.department?.name,
        employee?.position?.name,
        employee?.user?.role,
    ]);
    const profileCompletion = Math.round(
        (personalCompletion + contactCompletion + employmentCompletion) / 3,
    );

    const tenureLabel = useMemo(() => getTenureLabel(joinedAt), [joinedAt]);

    const timeline = [
        {
            eyebrow: joinedAt ? moment(joinedAt).format('MMM YYYY') : 'No date',
            title: 'Joined Providence',
            subtitle: payPoint,
            isCurrent: false,
        },
        {
            eyebrow: employee?.date_of_birth
                ? `${moment(employee.date_of_birth).format('MMM YYYY')} DOB`
                : 'Profile detail',
            title: employee?.date_of_birth
                ? `${age ?? 0} Years Old`
                : 'Date of birth not set',
            subtitle: employee?.date_of_birth
                ? moment(employee.date_of_birth).format('ll')
                : 'Personal profile data',
            isCurrent: false,
        },
        {
            eyebrow: `${lastUpdatedAt ? moment(lastUpdatedAt).format('MMM YYYY') : 'Current'}${
                lastUpdatedAt ? ' (current)' : ''
            }`,
            title: positionName,
            subtitle: `${departmentName} • ${roleName}`,
            isCurrent: true,
        },
    ];

    const records = [
        {
            id: 'employment',
            name: 'Employment Profile',
            meta: joinedAt
                ? `CREATED ${moment(joinedAt).format('MMM YYYY').toUpperCase()}`
                : 'EMPLOYEE PROFILE',
        },
        {
            id: 'account',
            name: 'Account Summary',
            meta: employee?.user?.created_at
                ? `ACCOUNT ${moment(employee.user.created_at)
                      .format('MMM YYYY')
                      .toUpperCase()}`
                : 'USER ACCOUNT',
        },
        {
            id: 'leave',
            name: 'Leave Records',
            meta: `${employee?.leave_applications_count || 0} APPLICATIONS • ${employee?.leave_balances_count || 0} BALANCES`,
        },
    ];

    const handleDelete = () => {
        router.delete(PATHS.destroy, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                Swal.fire(
                    'Deleted!',
                    'The employee has been deleted.',
                    'success',
                );
                router.visit(PATHS.index);
            },
            onError: () => {
                Swal.fire('Error!', 'Failed to delete employee.', 'error');
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: PATHS.index },
                {
                    title: `${employee.first_name} ${employee.surname}`,
                    href: PATHS.destroy,
                },
            ]}
        >
            <Head title={`${employee.first_name} ${employee.surname}`} />

            <div className="min-h-screen bg-slate-50/50 px-2 py-5 sm:px-4 md:px-8">
                <Card className="mb-6 overflow-hidden border-border bg-card shadow-sm">
                    <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:p-8">
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                            <div className="flex h-full w-full items-center justify-center bg-muted text-4xl font-bold text-muted-foreground">
                                {getInitials(
                                    fullName ||
                                        `${employee.first_name} ${employee.surname}`,
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-5">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        {fullName || 'Employee Name'}
                                    </h1>
                                    <Badge className="rounded-full border-transparent bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase shadow-none hover:bg-emerald-50">
                                        Active
                                    </Badge>
                                </div>
                                <p className="mt-1.5 text-lg font-semibold text-primary">
                                    {positionName}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    {staffNumber}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {departmentName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {address !== 'N/A'
                                        ? address
                                        : 'San Francisco, HQ'}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <Button
                                    variant="outline"
                                    className="h-9 font-semibold"
                                    onClick={() => router.visit(PATHS.edit)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                                <Button
                                    className="h-9 font-semibold"
                                    variant="default"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Export PDF
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border bg-muted/30 px-8">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-8">
                            {[
                                { name: 'Overview', icon: ChevronRight },
                                { name: 'Personal Info', icon: User2 },
                                { name: 'Employment History', icon: Clock3 },
                                { name: 'Reporting Line', icon: Users },
                                { name: 'Documents', icon: Folder },
                                { name: 'Skills & Certs', icon: Shield },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.name;
                                return (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition-colors ${
                                            isActive
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                <div className="w-full">
                    {/* Overview Tab - 2-column grid with all cards */}
                    {activeTab === 'Overview' && (
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Personal Details Card */}
                                <Card className="overflow-hidden border-border bg-card shadow-sm">
                                    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                                        <h2 className="text-base font-bold text-foreground">
                                            Personal Details
                                        </h2>
                                        <button className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                                            Update Information
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                                        <div>
                                            <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Full Legal Name
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {fullName || 'Not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Personal Email
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {employee?.user?.email ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Mobile Phone
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {contactNumber}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Date of Birth
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {employee?.date_of_birth
                                                    ? `${moment(employee.date_of_birth).format('MMMM D, YYYY')} (${age} years old)`
                                                    : 'Not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Home Address
                                            </p>
                                            <p className="text-sm leading-snug font-semibold text-foreground">
                                                {address !== 'N/A'
                                                    ? address
                                                    : 'San Francisco, CA 94122'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                Emergency Contact
                                            </p>
                                            <p className="text-sm leading-snug font-semibold text-foreground">
                                                {emergencyName} (
                                                {emergencyRelationship})<br />
                                                <span className="font-medium text-muted-foreground">
                                                    {emergencyPhone}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Employment History Card */}
                                <Card className="overflow-hidden border-border bg-card shadow-sm">
                                    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                                        <h2 className="text-base font-bold text-foreground">
                                            Employment History
                                        </h2>
                                        <button className="flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                                            <span className="mr-1 mb-0.5 text-base leading-none">
                                                +
                                            </span>{' '}
                                            Add Record
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-border bg-muted/20">
                                                    <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                        Effective Date
                                                    </th>
                                                    <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                        Position
                                                    </th>
                                                    <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3.5 text-right text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                <tr className="transition-colors hover:bg-accent/50">
                                                    <td className="px-6 py-4 font-medium whitespace-nowrap text-foreground">
                                                        Jan 1, 2024
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-foreground">
                                                            Senior Software
                                                            Engineer
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            Promotion •
                                                            Engineering
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge className="rounded border-transparent bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 shadow-none hover:bg-blue-50">
                                                            Promotion
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="h-6 leading-none font-bold tracking-widest text-muted-foreground hover:text-foreground">
                                                            ...
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr className="transition-colors hover:bg-accent/50">
                                                    <td className="px-6 py-4 font-medium whitespace-nowrap text-foreground">
                                                        Mar 15, 2022
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-foreground">
                                                            Software Engineer II
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            Regular •
                                                            Engineering
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded border-transparent bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground shadow-none hover:bg-secondary"
                                                        >
                                                            Annual Review
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="h-6 leading-none font-bold tracking-widest text-muted-foreground hover:text-foreground">
                                                            ...
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr className="transition-colors hover:bg-accent/50">
                                                    <td className="px-6 py-4 font-medium whitespace-nowrap text-foreground">
                                                        Oct 1, 2020
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-foreground">
                                                            Software Engineer I
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            Hired • Engineering
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge className="rounded border-transparent bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 shadow-none hover:bg-emerald-50">
                                                            New Hire
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="h-6 leading-none font-bold tracking-widest text-muted-foreground hover:text-foreground">
                                                            ...
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Reporting Line Card */}
                                <Card className="relative overflow-hidden border-border bg-card p-6 py-7 shadow-sm">
                                    <h2 className="mb-7 text-base font-bold text-foreground">
                                        Reporting Line
                                    </h2>
                                    <div className="relative ml-1 space-y-7 before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-border">
                                        <div className="relative flex gap-4">
                                            <div className="relative z-10 w-10 shrink-0">
                                                <div className="absolute -right-2 -bottom-1 z-20 rounded-full bg-card p-0.5">
                                                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                                                        <ArrowLeft className="h-2.5 w-2.5 rotate-90" />
                                                    </div>
                                                </div>
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-xs font-bold text-secondary-foreground shadow-sm">
                                                    {getInitials(managerName)}
                                                </div>
                                            </div>
                                            <div className="pt-0.5">
                                                <p className="mb-0.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                    Reports to (Manager)
                                                </p>
                                                <p className="text-sm font-bold text-foreground">
                                                    {managerName !==
                                                    'No manager assigned'
                                                        ? managerName
                                                        : 'Sarah Jenkins'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    VP of Engineering
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative flex gap-4">
                                            <div className="relative z-10 w-10 shrink-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-card text-xs font-bold text-foreground shadow-sm ring-4 shadow-primary/20 ring-primary/10">
                                                    {getInitials(
                                                        fullName ||
                                                            'Employee Name',
                                                    )}
                                                </div>
                                            </div>
                                            <div className="pt-0.5">
                                                <p className="mb-0.5 text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
                                                    Current Position
                                                </p>
                                                <p className="text-sm font-bold text-foreground">
                                                    {fullName || 'Jonathan Doe'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {positionName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative flex gap-4 pt-1">
                                            <div className="relative z-10 flex w-10 shrink-0 -space-x-2 pt-1">
                                                <div className="relative z-30 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-emerald-100 text-[9px] font-bold text-emerald-700">
                                                    MW
                                                </div>
                                                <div className="relative z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-blue-100 text-[9px] font-bold text-blue-700">
                                                    JL
                                                </div>
                                                <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-bold text-secondary-foreground">
                                                    +1
                                                </div>
                                            </div>
                                            <div className="ml-2 pt-1.5">
                                                <p className="mb-1 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                    Direct Reports (3)
                                                </p>
                                                <button className="text-xs font-semibold text-primary transition-colors hover:text-primary/80">
                                                    View Team
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Skills & Certs Card */}
                                <Card className="overflow-hidden border-border bg-card p-6 shadow-sm">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-base font-bold text-foreground">
                                            Skills &amp; Certs
                                        </h2>
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <Shield className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                Top Skills
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    'React.js',
                                                    'TypeScript',
                                                    'AWS',
                                                    'PostgreSQL',
                                                    'System Design',
                                                ].map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground shadow-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <p className="mb-4 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                Certifications
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-orange-600">
                                                        <Shield className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm leading-tight font-bold text-foreground">
                                                            AWS Certified
                                                            Solutions Architect
                                                        </p>
                                                        <p className="mt-1 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                                                            Exp: Oct 2025
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                                                        <Shield className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm leading-tight font-bold text-foreground">
                                                            Certified Kubernetes
                                                            Admin (CKA)
                                                        </p>
                                                        <p className="mt-1 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                                                            Exp: Mar 2026
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Documents Card */}
                                <Card className="overflow-hidden border-border bg-card p-6 py-5 shadow-sm">
                                    <div className="mb-5 flex items-center justify-between">
                                        <h2 className="text-base font-bold text-foreground">
                                            Documents
                                        </h2>
                                        <button className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                                            View All
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            'Employment_Contract.pdf',
                                            'Q4_Performance_Review.pdf',
                                            'SSN_Verification.pdf',
                                        ].map((doc) => (
                                            <div
                                                key={doc}
                                                className="flex items-center justify-between rounded-xl border border-border p-2.5 py-3 shadow-sm transition-colors hover:border-border/80 hover:bg-accent"
                                            >
                                                <div className="flex min-w-0 items-center gap-3 px-1">
                                                    <FileText className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                                                    <span className="truncate text-sm font-semibold text-foreground">
                                                        {doc}
                                                    </span>
                                                </div>
                                                <button className="shrink-0 pr-1 text-muted-foreground hover:text-primary">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Personal Info Tab */}
                    {activeTab === 'Personal Info' && (
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-border bg-card shadow-sm">
                                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                                    <h2 className="text-base font-bold text-foreground">
                                        Personal Details
                                    </h2>
                                    <button className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                                        Update Information
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-x-8 gap-y-8 p-6 sm:grid-cols-2 md:grid-cols-3 lg:p-8">
                                    <div>
                                        <p className="mb-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Full Legal Name
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {fullName || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Personal Email
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {employee?.user?.email ||
                                                'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Mobile Phone
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {contactNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Date of Birth
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {employee?.date_of_birth
                                                ? `${moment(employee.date_of_birth).format('MMMM D, YYYY')} (${age} years old)`
                                                : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Home Address
                                        </p>
                                        <p className="text-base leading-snug font-semibold text-foreground">
                                            {address !== 'N/A'
                                                ? address
                                                : 'San Francisco, CA 94122'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Emergency Contact
                                        </p>
                                        <p className="text-base leading-snug font-semibold text-foreground">
                                            {emergencyName} (
                                            {emergencyRelationship})<br />
                                            <span className="font-medium text-muted-foreground">
                                                {emergencyPhone}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Employment History Tab */}
                    {activeTab === 'Employment History' && (
                        <Card className="overflow-hidden border-border bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                                <h2 className="text-base font-bold text-foreground">
                                    Employment History
                                </h2>
                                <button className="flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                                    <span className="mr-1 mb-0.5 text-base leading-none">
                                        +
                                    </span>{' '}
                                    Add Record
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/20">
                                            <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                Effective Date
                                            </th>
                                            <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                Position
                                            </th>
                                            <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                Type
                                            </th>
                                            <th className="px-6 py-3.5 text-right text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr className="transition-colors hover:bg-accent/50">
                                            <td className="px-6 py-4.5 font-medium whitespace-nowrap text-foreground">
                                                Jan 1, 2024
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <p className="font-bold text-foreground">
                                                    Senior Software Engineer
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Promotion • Engineering
                                                </p>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <Badge className="rounded border-transparent bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 shadow-none hover:bg-blue-50">
                                                    Promotion
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4.5 text-right">
                                                <button className="h-6 leading-none font-bold tracking-widest text-muted-foreground hover:text-foreground">
                                                    ...
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="transition-colors hover:bg-accent/50">
                                            <td className="px-6 py-4.5 font-medium whitespace-nowrap text-foreground">
                                                Mar 15, 2022
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <p className="font-semibold text-foreground">
                                                    Software Engineer II
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Regular • Engineering
                                                </p>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded border-transparent bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground shadow-none hover:bg-secondary"
                                                >
                                                    Annual Review
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4.5 text-right">
                                                <button className="h-6 leading-none font-bold tracking-widest text-muted-foreground hover:text-foreground">
                                                    ...
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="transition-colors hover:bg-accent/50">
                                            <td className="px-6 py-4.5 font-medium whitespace-nowrap text-foreground">
                                                Oct 1, 2020
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <p className="font-semibold text-foreground">
                                                    Software Engineer I
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Hired • Engineering
                                                </p>
                                            </td>
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <Badge className="rounded border-transparent bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 shadow-none hover:bg-emerald-50">
                                                    New Hire
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4.5 text-right">
                                                <button className="h-6 leading-none font-bold tracking-widest text-muted-foreground hover:text-foreground">
                                                    ...
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {/* Reporting Line Tab */}
                    {activeTab === 'Reporting Line' && (
                        <Card className="relative overflow-hidden border-border bg-card p-6 py-7 shadow-sm">
                            <h2 className="mb-7 text-base font-bold text-foreground">
                                Reporting Line
                            </h2>
                            <div className="relative ml-1 space-y-7 before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-border">
                                {/* Manager */}
                                <div className="relative flex gap-4">
                                    <div className="relative z-10 w-10 shrink-0">
                                        <div className="absolute -right-2 -bottom-1 z-20 rounded-full bg-card p-0.5">
                                            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                                                <ArrowLeft className="h-2.5 w-2.5 rotate-90" />
                                            </div>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-xs font-bold text-secondary-foreground shadow-sm">
                                            {getInitials(managerName)}
                                        </div>
                                    </div>
                                    <div className="pt-0.5">
                                        <p className="mb-0.5 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                            Reports to (Manager)
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {managerName !==
                                            'No manager assigned'
                                                ? managerName
                                                : 'Sarah Jenkins'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            VP of Engineering
                                        </p>
                                    </div>
                                </div>

                                {/* Employee */}
                                <div className="relative flex gap-4">
                                    <div className="relative z-10 w-10 shrink-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-card text-xs font-bold text-foreground shadow-sm ring-4 shadow-primary/20 ring-primary/10">
                                            {getInitials(
                                                fullName || 'Employee Name',
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-0.5">
                                        <p className="mb-0.5 text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
                                            Current Position
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {fullName || 'Jonathan Doe'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {positionName}
                                        </p>
                                    </div>
                                </div>

                                {/* Direct Reports */}
                                <div className="relative flex gap-4 pt-1">
                                    <div className="relative z-10 flex w-10 shrink-0 -space-x-2 border-t border-transparent pt-1">
                                        <div className="relative z-30 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-emerald-100 text-[9px] font-bold text-emerald-700">
                                            MW
                                        </div>
                                        <div className="relative z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-blue-100 text-[9px] font-bold text-blue-700">
                                            JL
                                        </div>
                                        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-bold text-secondary-foreground">
                                            +1
                                        </div>
                                    </div>
                                    <div className="ml-2 pt-1.5">
                                        <p className="mb-1 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                            Direct Reports (3)
                                        </p>
                                        <button className="text-xs font-semibold text-primary transition-colors hover:text-primary/80">
                                            View Team
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Skills & Certs Tab */}
                    {activeTab === 'Skills & Certs' && (
                        <Card className="overflow-hidden border-border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-base font-bold text-foreground">
                                    Skills & Certs
                                </h2>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <Shield className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                        Top Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'React.js',
                                            'TypeScript',
                                            'AWS',
                                            'PostgreSQL',
                                            'System Design',
                                        ].map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="mb-4 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                                        Certifications
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-orange-600">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm leading-tight font-bold text-foreground">
                                                    AWS Certified Solutions
                                                    Architect
                                                </p>
                                                <p className="mt-1 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                                                    Exp: Oct 2025
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm leading-tight font-bold text-foreground">
                                                    Certified Kubernetes Admin
                                                    (CKA)
                                                </p>
                                                <p className="mt-1 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                                                    Exp: Mar 2026
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'Documents' && (
                        <Card className="overflow-hidden border-border bg-card p-6 py-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-base font-bold text-foreground">
                                    Documents
                                </h2>
                                <button className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    'Employment_Contract.pdf',
                                    'Q4_Performance_Review.pdf',
                                    'SSN_Verification.pdf',
                                ].map((doc, i) => (
                                    <div
                                        key={doc}
                                        className="flex items-center justify-between rounded-xl border border-border p-2.5 py-3 shadow-sm transition-colors hover:border-border/80 hover:bg-accent"
                                    >
                                        <div className="flex min-w-0 items-center gap-3 px-1">
                                            <FileText className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                                            <span className="truncate text-sm font-semibold text-foreground">
                                                {doc}
                                            </span>
                                        </div>
                                        <button className="shrink-0 pr-1 text-muted-foreground hover:text-primary">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <strong className="text-foreground">
                                {employee.first_name} {employee.surname}
                            </strong>
                            ?
                            {cannotDelete && (
                                <span className="mt-2 block text-destructive">
                                    This employee has associated records and
                                    cannot be deleted.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={cannotDelete}
                        >
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// ... Additional helper components (SectionHeader, DetailRow, MetricBar)
// would also be similarly updated if you decide to utilize them in this view later!

function getInitials(value: string) {
    const parts = value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase());

    return parts.length ? parts.join('') : 'EM';
}

function titleCase(value: string) {
    return value
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join(' ');
}

function calculateAge(dateOfBirth: string) {
    const birthDate = moment(dateOfBirth);
    if (!birthDate.isValid()) return 0;
    return moment().diff(birthDate, 'years');
}

function completionScore(fields: Array<string | number | null | undefined>) {
    const total = fields.length || 1;
    const completed = fields.filter(
        (field) => String(field ?? '').trim().length > 0,
    ).length;
    return Math.round((completed / total) * 100);
}

function getTenureLabel(value?: string | null) {
    if (!value) return 'Tenure unavailable';

    const start = moment(value);
    if (!start.isValid()) return 'Tenure unavailable';

    const months = moment().diff(start, 'months');
    const years = months / 12;

    if (years >= 1) {
        return `${years.toFixed(1)} years tenure`;
    }

    return `${Math.max(1, months)} months tenure`;
}
