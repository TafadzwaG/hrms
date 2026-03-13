import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    History,
    Info,
    Search,
    Shield,
    Trash2,
    UserMinus,
    UserPlus,
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
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function RoleShow() {
    const { role } = usePage().props as any;

    const [search, setSearch] = useState('');

    const name = role?.name || 'HR_ADMIN';
    const code = role?.code || 'HR_ADMIN';
    const description =
        role?.description ||
        'Manage permissions, visibility levels, and assigned personnel for the Human Resources Administrator tier.';
    const created_at = role?.created_at
        ? moment(role.created_at).format('MMM DD, YYYY')
        : 'Jan 12, 2024';
    const usersCount = role?.users_count || role?.users?.length || 0;

    // Fallback Mock Users if backend returns empty for demonstration
    const users =
        role?.users && role.users.length > 0
            ? role.users
            : [
                  {
                      id: 1,
                      name: 'Sarah Jenkins',
                      email: 's.jenkins@providence.io',
                      assigned_at: 'Feb 04, 2024',
                      status: 'Active',
                  },
                  {
                      id: 2,
                      name: 'Marcus Thorne',
                      email: 'm.thorne@providence.io',
                      assigned_at: 'Mar 12, 2024',
                      status: 'Active',
                  },
                  {
                      id: 3,
                      name: 'Elena Rodriguez',
                      email: 'e.rodriguez@providence.io',
                      assigned_at: 'Apr 22, 2024',
                      status: 'On Leave',
                  },
              ];

    const handleDelete = () => {
        router.delete(`${API}/roles/${role?.id}`, {
            preserveScroll: true,
        });
    };

    const getInitials = (fullName: string) => {
        const parts = fullName.split(' ');
        if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0].substring(0, 2).toUpperCase();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Settings', href: '#' },
                { title: 'Roles', href: `${API}/roles` },
                { title: code, href: '#' },
            ]}
        >
            <Head title={`Role: ${name}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                        <Badge
                            variant="secondary"
                            className="mb-3 border-transparent bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                        >
                            System Managed Role
                        </Badge>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Role: {code}
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="bg-primary px-6 font-bold text-primary-foreground shadow-sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign User
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: Role Details (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Description & Stats */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Info className="h-5 w-5 text-primary" />
                                    Role Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-5">
                                <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                    The {code} role provides full access to
                                    employee records, payroll processing, and
                                    system-wide HR settings. This role is
                                    responsible for maintaining data integrity
                                    and compliance across the entire
                                    organization.
                                </p>

                                <div className="space-y-3 pt-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Created At
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {created_at}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Total Users
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {usersCount} Active
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-muted-foreground">
                                            Access Level
                                        </span>
                                        <span className="font-bold text-primary">
                                            Level 4 (High)
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mini Cards Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                <CardContent className="flex flex-col justify-center p-5">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Reports Access
                                    </p>
                                    <p className="text-3xl font-extrabold tracking-tight text-foreground">
                                        Full
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                <CardContent className="flex flex-col justify-center p-5">
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        MFA Required
                                    </p>
                                    <p className="text-3xl font-extrabold tracking-tight text-foreground">
                                        Yes
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Assigned Users & Audit (Spans 8/12) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Assigned Users */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="flex flex-col justify-between gap-4 border-b pb-3 sm:flex-row sm:items-center">
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Assigned Users
                                </CardTitle>
                                <div className="relative w-full sm:w-[280px]">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search assigned users..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="h-10 border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                                                <TableHead className="h-10 pl-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    User Details
                                                </TableHead>
                                                <TableHead className="h-10 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Status
                                                </TableHead>
                                                <TableHead className="h-10 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Assigned Since
                                                </TableHead>
                                                <TableHead className="h-10 pr-6 text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="h-32 text-center text-muted-foreground"
                                                    >
                                                        No users are currently
                                                        assigned to this role.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                users.map((user: any) => (
                                                    <TableRow
                                                        key={user.id}
                                                        className="hover:bg-muted/30"
                                                    >
                                                        <TableCell className="py-4 pl-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-foreground">
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs font-medium text-muted-foreground">
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.status ===
                                                            'On Leave' ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600 shadow-none"
                                                                >
                                                                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                                    On Leave
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 shadow-none"
                                                                >
                                                                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                                    Active
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm font-medium text-muted-foreground">
                                                            {user.assigned_at ||
                                                                'Feb 04, 2024'}
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            >
                                                                <UserMinus className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex items-center justify-between border-t bg-muted/10 p-3 text-sm font-medium text-muted-foreground">
                                    <div className="pl-3">
                                        Showing 1 to {users.length} of{' '}
                                        {usersCount} users
                                    </div>
                                    <div className="flex items-center gap-1 pr-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 shadow-none"
                                            disabled
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 shadow-none"
                                            disabled
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Role Changes Audit */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <History className="h-5 w-5 text-muted-foreground" />
                                    Recent Role Changes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 px-6 pb-6">
                                <div className="relative ml-2 space-y-6 border-l-2 border-muted">
                                    <div className="relative pl-5">
                                        <div className="absolute top-1.5 -left-[5px] h-2 w-2 rounded-full bg-primary ring-4 ring-background"></div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Elena Rodriguez was assigned to{' '}
                                            {code}
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            by SuperAdmin • 2 days ago
                                        </p>
                                    </div>
                                    <div className="relative pl-5">
                                        <div className="absolute top-1.5 -left-[5px] h-2 w-2 rounded-full bg-muted-foreground/40 ring-4 ring-background"></div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Role permissions updated:
                                            'payroll.edit'
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                            System • 1 week ago
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
