import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Download,
    Info,
    Plus,
    Search,
    ShieldCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

type RoleOption = { id: number; code: string; name: string };
type UserOption = {
    id: number;
    name: string;
    email: string;
    is_member: boolean;
};

type Member = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    joined_at: string | null;
    roles: RoleOption[];
    role_ids: number[];
    update_url: string;
    remove_url: string;
};

type PaginatedMembers = {
    data: Member[];
    total: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
};

type PageProps = {
    organization: { id: number; name: string; slug: string; status: string };
    summary: {
        users_count: number;
        employees_count: number;
        departments_count: number;
        positions_count: number;
    };
    members: PaginatedMembers;
    filters: { search?: string; role?: string };
    availableUsers: UserOption[];
    roles: RoleOption[];
};

export default function OrganizationMembers() {
    const { organization, summary, members, filters, availableUsers, roles } =
        usePage<PageProps>().props;

    // --- Search & Filtering State ---
    const [search, setSearch] = useState(filters?.search ?? '');
    const [roleFilter, setRoleFilter] = useState(filters?.role ?? 'all');

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                `/organizations/${organization.id}/members`,
                {
                    search,
                    role: roleFilter === 'all' ? '' : roleFilter,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, roleFilter, organization.id]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > members.last_page) return;
        router.get(
            `/organizations/${organization.id}/members`,
            { page, search, role: roleFilter === 'all' ? '' : roleFilter },
            { preserveScroll: true, preserveState: true },
        );
    };

    // --- Form for Adding New Member ---
    const addForm = useForm({
        user_id: '',
        role_ids: [] as number[],
        is_active: true,
    });

    const toggleAddRole = (roleId: number) => {
        addForm.setData(
            'role_ids',
            addForm.data.role_ids.includes(roleId)
                ? addForm.data.role_ids.filter((id) => id !== roleId)
                : [...addForm.data.role_ids, roleId],
        );
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(`/organizations/${organization.id}/members`, {
            preserveScroll: true,
            onSuccess: () => addForm.reset(),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Organizations', href: '/organizations' },
                {
                    title: organization.name,
                    href: `/organizations/${organization.id}`,
                },
                { title: 'Members', href: '#' },
            ]}
        >
            <Head title={`${organization.name} Members`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Organization Members
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                            >
                                {organization.name} - {organization.status}
                            </Badge>
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Manage your organization's workforce, define system
                            roles, and control access permissions.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                        >
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Total Members"
                        value={summary.users_count}
                        icon={Users}
                    />
                    <MetricCard
                        label="Active Employees"
                        value={summary.employees_count}
                        icon={Briefcase}
                    />
                    <MetricCard
                        label="Departments"
                        value={summary.departments_count}
                        icon={Building2}
                    />
                    <MetricCard
                        label="Positions"
                        value={summary.positions_count}
                        icon={ShieldCheck}
                    />
                </div>

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Members List (Spans 8/12) */}
                    <div className="flex flex-col space-y-6 lg:col-span-8">
                        <Card className="flex flex-1 flex-col overflow-hidden border-border bg-background shadow-sm">
                            <CardHeader className="flex shrink-0 flex-col justify-between gap-4 border-b border-border/50 bg-muted/5 pb-4 sm:flex-row sm:items-center">
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Current Members
                                </CardTitle>
                                <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                                    <div className="relative w-full sm:w-56">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search members..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="h-9 w-full border-border bg-background pl-9 text-xs font-medium shadow-sm"
                                        />
                                    </div>
                                    <div className="flex w-full items-center gap-2 sm:w-auto">
                                        <span className="shrink-0 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Filter by:
                                        </span>
                                        <Select
                                            value={roleFilter}
                                            onValueChange={setRoleFilter}
                                        >
                                            <SelectTrigger className="h-9 w-full border-border bg-background text-xs font-medium shadow-sm sm:w-36">
                                                <SelectValue placeholder="All Roles" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Roles
                                                </SelectItem>
                                                {roles.map((r) => (
                                                    <SelectItem
                                                        key={r.id}
                                                        value={r.code}
                                                    >
                                                        {r.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                            <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Member
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Roles
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Joined
                                            </TableHead>
                                            <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members.data.length > 0 ? (
                                            members.data.map((member) => (
                                                <MemberRow
                                                    key={member.id}
                                                    member={member}
                                                    roles={roles}
                                                />
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="h-48 text-center text-sm font-medium text-muted-foreground"
                                                >
                                                    No members match the current
                                                    search or filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>

                            {/* Pagination Footer */}
                            {members.last_page > 1 && (
                                <div className="flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-4">
                                    <span className="text-xs font-bold text-muted-foreground">
                                        Showing {members.from || 0} to{' '}
                                        {members.to || 0} of {members.total}{' '}
                                        members
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="h-8 border-border bg-background px-4 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
                                            disabled={members.current_page <= 1}
                                            onClick={() =>
                                                handlePageChange(
                                                    members.current_page - 1,
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            className="h-8 border border-foreground bg-foreground px-4 text-xs font-bold text-background shadow-sm transition-colors hover:bg-foreground/90"
                                            disabled={
                                                members.current_page >=
                                                members.last_page
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    members.current_page + 1,
                                                )
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Add Member & Info (Spans 4/12) */}
                    <div className="flex flex-col space-y-6 lg:col-span-4">
                        {/* Add New Member Card */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <UserPlus className="h-5 w-5 text-muted-foreground" />{' '}
                                    Add New Member
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form
                                    onSubmit={handleAddMember}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-widest text-foreground text-muted-foreground uppercase">
                                            Select User
                                        </Label>
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Select
                                                value={addForm.data.user_id}
                                                onValueChange={(v) =>
                                                    addForm.setData(
                                                        'user_id',
                                                        v,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-11 w-full border-border bg-background pl-9 text-sm font-medium shadow-sm">
                                                    <SelectValue placeholder="Search by name or email..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableUsers.map((u) => (
                                                        <SelectItem
                                                            key={u.id}
                                                            value={String(u.id)}
                                                            disabled={
                                                                u.is_member
                                                            }
                                                        >
                                                            {u.name} ({u.email}){' '}
                                                            {u.is_member &&
                                                                '- Existing'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold tracking-widest text-foreground text-muted-foreground uppercase">
                                            Assign Roles
                                        </Label>
                                        <div className="max-h-48 space-y-3 overflow-y-auto rounded-xl border border-border bg-muted/10 p-4">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    className="group flex cursor-pointer items-center gap-3"
                                                >
                                                    <Checkbox
                                                        checked={addForm.data.role_ids.includes(
                                                            role.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleAddRole(
                                                                role.id,
                                                            )
                                                        }
                                                        className="border-border/50 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                                    />
                                                    <span className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                        {role.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-11 w-full bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                        disabled={
                                            addForm.processing ||
                                            !addForm.data.user_id
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add to
                                        Organization
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Info Banner */}
                        <Card className="border-border bg-muted/20 shadow-sm">
                            <CardContent className="flex items-start gap-4 p-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                                    <Info className="h-5 w-5" />
                                </div>
                                <div className="mt-0.5 space-y-1.5">
                                    <h4 className="text-sm font-bold text-foreground">
                                        Role Hierarchy
                                    </h4>
                                    <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                        Members can have multiple roles.
                                        Administrators have full system access
                                        while Department Leads are restricted to
                                        their assigned teams.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Sub Components ---

function MetricCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number | string;
    icon: any;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardContent className="flex flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </p>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Handles the individual row and its expanded "Manage" state.
 */
function MemberRow({ member, roles }: { member: Member; roles: RoleOption[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
        role_ids: member.role_ids,
        is_active: member.is_active,
    });

    const toggleRole = (roleId: number) => {
        form.setData(
            'role_ids',
            form.data.role_ids.includes(roleId)
                ? form.data.role_ids.filter((id) => id !== roleId)
                : [...form.data.role_ids, roleId],
        );
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const handleSave = () => {
        form.put(member.update_url, {
            preserveScroll: true,
            onSuccess: () => setIsOpen(false),
        });
    };

    const handleRemove = () => {
        if (
            confirm(
                `Are you sure you want to remove ${member.name} from the organization?`,
            )
        ) {
            router.delete(member.remove_url, { preserveScroll: true });
        }
    };

    return (
        <>
            {/* Primary Row */}
            <TableRow
                className={`transition-colors ${isOpen ? 'bg-muted/10 hover:bg-muted/10' : 'hover:bg-muted/30'}`}
            >
                <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border bg-muted text-foreground shadow-sm">
                            <AvatarFallback className="text-xs font-bold">
                                {getInitials(member.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">
                                {member.name}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground">
                                {member.email}
                            </p>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <div
                            className={`h-2 w-2 rounded-full ${member.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                        />
                        {member.is_active ? 'Active' : 'Inactive'}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                        {member.roles.length > 0 ? (
                            member.roles.map((r) => (
                                <Badge
                                    key={r.id}
                                    variant="secondary"
                                    className="border-transparent bg-muted px-2 py-0 text-[9px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                >
                                    {r.code}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                —
                            </span>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-muted-foreground">
                    {member.joined_at
                        ? moment(member.joined_at).format('MMM DD, YYYY')
                        : 'Unknown'}
                </TableCell>
                <TableCell className="pr-6 text-right">
                    <Button
                        variant="link"
                        className={`h-auto p-0 text-xs font-bold tracking-widest uppercase ${isOpen ? 'text-muted-foreground' : 'text-foreground hover:text-primary'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? 'Collapse' : 'Manage'}
                    </Button>
                </TableCell>
            </TableRow>

            {/* Expanded Manage Row */}
            {isOpen && (
                <TableRow className="border-b-2 border-border/50 bg-muted/5 hover:bg-muted/5">
                    <TableCell colSpan={5} className="p-0">
                        <div className="animate-in p-6 duration-200 slide-in-from-top-2 md:p-8">
                            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {/* Member Status Toggle */}
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Member Status
                                        </Label>
                                        <div className="flex w-fit items-center rounded-lg border border-border bg-muted/20 p-1">
                                            <Button
                                                type="button"
                                                variant={
                                                    form.data.is_active
                                                        ? 'default'
                                                        : 'ghost'
                                                }
                                                className={`h-9 px-6 font-bold shadow-none ${form.data.is_active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() =>
                                                    form.setData(
                                                        'is_active',
                                                        true,
                                                    )
                                                }
                                            >
                                                Active
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={
                                                    !form.data.is_active
                                                        ? 'default'
                                                        : 'ghost'
                                                }
                                                className={`h-9 px-6 font-bold shadow-none ${!form.data.is_active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() =>
                                                    form.setData(
                                                        'is_active',
                                                        false,
                                                    )
                                                }
                                            >
                                                Inactive
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Update Roles Checkboxes */}
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Update Roles
                                        </Label>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {roles.map((role) => {
                                                const isChecked =
                                                    form.data.role_ids.includes(
                                                        role.id,
                                                    );
                                                return (
                                                    <label
                                                        key={role.id}
                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${isChecked ? 'border-foreground/30 bg-muted/20' : 'border-border bg-transparent hover:bg-muted/10'}`}
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={() =>
                                                                toggleRole(
                                                                    role.id,
                                                                )
                                                            }
                                                            className="border-border/50 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                                        />
                                                        <span
                                                            className={`text-sm font-bold ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}
                                                        >
                                                            {role.name}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-auto px-0 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={handleRemove}
                                    >
                                        <UserPlus className="mr-2 h-4 w-4 rotate-45" />{' '}
                                        {/* Makeshift remove icon */}
                                        Remove from Organization
                                    </Button>
                                    <div className="flex w-full items-center gap-3 sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full border-border font-bold shadow-sm sm:w-auto"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="w-full bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90 sm:w-auto"
                                            onClick={handleSave}
                                            disabled={form.processing}
                                        >
                                            {form.processing
                                                ? 'Saving...'
                                                : 'Save Changes'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}
