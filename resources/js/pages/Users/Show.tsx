import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Ban,
    CheckCircle2,
    ChevronRight,
    Edit,
    FileText,
    Hash,
    Info,
    Key,
    Link as LinkIcon,
    LogOut,
    Mail,
    Plus,
    Shield,
    Trash2,
    UserCircle,
    UserMinus,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function UserShow() {
    const { user, meta, errors } = usePage().props as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const PATHS = {
        index: `${API}/users`,
        edit: `${API}/users/${user.id}/edit`,
        destroy: `${API}/users/${user.id}`,
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '—';
        const m = moment(dateString);
        if (!m.isValid()) return '—';
        return m.format('MMM DD, YYYY');
    };

    const cannotDelete = !!errors?.delete || !!user.employee;

    const confirmDelete = () => {
        setDeleteDialogOpen(false);
        router.delete(PATHS.destroy, { preserveScroll: true });
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: PATHS.index },
                { title: user.name, href: '#' },
            ]}
        >
            <Head title={`${user.name} - User Details`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Visual Context Breadcrumb (From Screenshot) */}
                <div className="flex items-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    <span
                        className="cursor-pointer transition-colors hover:text-foreground"
                        onClick={() => router.visit(PATHS.index)}
                    >
                        Users
                    </span>
                    <ChevronRight className="mx-2 h-3 w-3" />
                    <span className="text-foreground">
                        Administrative Action
                    </span>
                </div>

                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 border-b border-border/50 pb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                            {user.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <span>
                                {user.employee?.job_title || 'System User'}
                            </span>
                            <span className="opacity-50">•</span>
                            <span className="font-mono">
                                USR-{user.id.toString().padStart(5, '0')}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="destructive"
                            className="h-11 font-bold shadow-sm"
                            disabled={cannotDelete}
                            onClick={() => setDeleteDialogOpen(true)}
                            title={
                                cannotDelete
                                    ? 'Cannot delete user linked to an employee'
                                    : 'Terminate User'
                            }
                        >
                            <UserMinus className="mr-2 h-4 w-4" /> Terminate
                            User
                        </Button>
                    </div>
                </div>

                {/* Error Banner */}
                {errors?.delete && (
                    <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                        <Info className="h-5 w-5 shrink-0" />
                        {errors.delete}
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid w-full grid-cols-1 gap-8 pt-2 lg:grid-cols-12 xl:gap-8">
                    {/* LEFT COLUMN: Main Profile (Spans 8/12) */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Account Profile Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                                    Account Profile
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs font-bold"
                                    asChild
                                >
                                    <Link href={PATHS.edit}>
                                        <Edit className="mr-2 h-3.5 w-3.5" />{' '}
                                        Edit Profile
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Full Name
                                        </p>
                                        <p className="text-base font-bold text-foreground">
                                            {user.name}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Email Address
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-base font-bold text-foreground">
                                                {user.email}
                                            </p>
                                            {meta?.supportsEmailVerification &&
                                                (user.email_verified_at ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-border/50 bg-muted px-1.5 py-0 text-[9px] tracking-widest text-foreground uppercase"
                                                    >
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />{' '}
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-dashed px-1.5 py-0 text-[9px] tracking-widest text-muted-foreground uppercase"
                                                    >
                                                        Unverified
                                                    </Badge>
                                                ))}
                                        </div>
                                    </div>
                                    {meta?.supportsUsername && (
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Username
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                {user.username ?? '—'}
                                            </p>
                                        </div>
                                    )}
                                    {meta?.supportsRoleColumn && (
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Legacy Access
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                {user.role ?? '—'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Linked Employee Sub-section */}
                                <div className="flex flex-col justify-between gap-4 rounded-xl border border-dashed border-border bg-muted/10 p-6 sm:flex-row sm:items-center">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                            Linked Employee Identity
                                        </p>
                                        {user.employee ? (
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border border-border shadow-sm">
                                                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                                        {getInitials(
                                                            user.employee
                                                                .full_name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">
                                                        {
                                                            user.employee
                                                                .full_name
                                                        }
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                        {user.employee
                                                            .job_title ||
                                                            'Employee'}{' '}
                                                        •{' '}
                                                        {user.employee
                                                            .department ||
                                                            'General'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <LinkIcon className="h-5 w-5" />
                                                <p className="text-sm font-medium">
                                                    No employee record linked to
                                                    this account.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {user.employee && (
                                        <Button
                                            className="shrink-0 bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                            asChild
                                        >
                                            <Link
                                                href={`${API}/employees/${user.employee.id}`}
                                            >
                                                View Employee File
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Access Control Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                    Security Access Control
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs font-bold"
                                >
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add
                                    Role
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                {(user.roles?.length ?? 0) === 0 ? (
                                    <div className="rounded-lg border border-dashed py-4 text-center text-sm font-medium text-muted-foreground">
                                        No RBAC roles assigned. User has default
                                        minimal access.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        {user.roles.map(
                                            (r: any, idx: number) => (
                                                <div
                                                    key={r.id}
                                                    className="group flex items-center justify-between rounded-lg border border-border bg-muted/5 p-3"
                                                >
                                                    <div>
                                                        <p className="mb-0.5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Level {idx + 1}
                                                        </p>
                                                        <p className="text-sm font-bold text-foreground">
                                                            {r.code}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs font-bold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                    <Info className="h-4 w-4" />
                                    Privileges are hierarchical. Highest role
                                    takes precedence across all modules.
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Side Panels (Spans 4/12) */}
                    <div className="space-y-8 lg:col-span-4">
                        {/* User Summary */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                                User Summary
                            </h3>
                            <Card className="border-border bg-background shadow-sm">
                                <CardContent className="space-y-6 p-6">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Current Status
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                                        >
                                            Active
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-border bg-muted/10 p-4">
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Roles
                                            </p>
                                            <p className="text-2xl font-extrabold text-foreground">
                                                {(user.roles?.length ?? 0)
                                                    .toString()
                                                    .padStart(2, '0')}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-border bg-muted/10 p-4">
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Logins
                                            </p>
                                            <p className="text-2xl font-extrabold text-foreground">
                                                {/* Mock data to match screenshot design */}
                                                124
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="h-11 w-full border-border bg-background font-bold text-foreground shadow-sm"
                                    >
                                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
                                        Audit Full Log
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Administrative Actions */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                                Administrative Actions
                            </h3>
                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="outline"
                                    className="h-12 w-full justify-start border-border bg-background font-bold shadow-sm"
                                >
                                    <Key className="mr-3 h-4 w-4 text-muted-foreground" />{' '}
                                    Force Password Reset
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 w-full justify-start border-border bg-background font-bold shadow-sm"
                                >
                                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />{' '}
                                    Logout All Sessions
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 w-full justify-start border-border bg-background font-bold text-destructive shadow-sm hover:bg-destructive/5 hover:text-destructive"
                                >
                                    <Ban className="mr-3 h-4 w-4" /> Suspend
                                    Account
                                </Button>
                            </div>
                        </div>

                        {/* Policy Required Banner */}
                        <Card className="relative overflow-hidden border-transparent bg-foreground text-background shadow-md">
                            <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-5">
                                <Shield className="h-32 w-32" />
                            </div>
                            <CardContent className="relative z-10 space-y-4 p-6">
                                <h3 className="text-sm font-bold tracking-widest uppercase">
                                    Policy Required
                                </h3>
                                <p className="text-xs leading-relaxed font-medium opacity-90">
                                    This user holds high-level system
                                    privileges. All role changes are logged for
                                    annual compliance audit.
                                </p>
                                <Button
                                    variant="secondary"
                                    className="mt-2 h-10 w-full text-xs font-bold shadow-none"
                                >
                                    Review Access Policy
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Global Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">
                            Terminate User Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>
                                Are you sure you want to permanently delete the
                                user account for{' '}
                                <strong className="text-foreground">
                                    {user.name}
                                </strong>
                                ?
                            </p>
                            {user.employee && (
                                <div className="mt-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs font-bold text-destructive">
                                    Warning: This user is linked to employee{' '}
                                    {user.employee.staff_number}. System
                                    constraints block deletion to preserve audit
                                    trails.
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={!!user.employee}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Confirm Termination
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Minimal Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:flex-row">
                <p>
                    © 2024 Providence HRMS • Security Enforced Environment •
                    Session ID: PHRMS-88-AF12
                </p>
                <div className="flex items-center gap-6">
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Privacy
                    </a>
                    <a
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        System Status
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
