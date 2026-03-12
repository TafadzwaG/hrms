import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ChevronRight,
    Download,
    Edit,
    Eye,
    File,
    FileText,
    Filter,
    GitBranch,
    IdCard,
    Layers3,
    MapPin,
    MoreHorizontal,
    Network,
    Search,
    ShieldCheck,
    TableProperties,
    Trash2,
    Users,
    Wallet,
} from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { Badge as UiBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';

type Child = { id: number; name: string; type: string; code: string | null };
type LocationItem = {
    id: number;
    name: string;
    timezone: string;
    pivot: {
        is_primary: boolean;
        effective_from: string | null;
        effective_to: string | null;
    };
};

type OrgUnit = {
    id: number;
    name: string;
    type: string;
    code: string | null;
    cost_center: string | null;
    effective_from: string | null;
    effective_to: string | null;
    parent: { id: number; name: string; type: string } | null;
    children: Child[];
    locations: LocationItem[];
    created_at: string | null;
    updated_at: string | null;
};

type PageProps = {
    orgUnit: OrgUnit;
};

const PATHS = {
    index: `${API}/org-units`,
    show: (id: number) => `${API}/org-units/${id}`,
    edit: (id: number) => `${API}/org-units/${id}/edit`,
    destroy: (id: number) => `${API}/org-units/${id}`,
};

function getTypeIcon(type: string, className = 'h-4 w-4') {
    if (type === 'COMPANY') return <Building2 className={className} />;
    if (type === 'SBU') return <GitBranch className={className} />;
    if (type === 'DEPARTMENT') return <Layers3 className={className} />;
    return <Network className={className} />;
}

// Dummy Data for tabs
const dummyDocuments = [
    {
        id: 1,
        name: 'Standard Operating Procedures 2026.pdf',
        type: 'PDF',
        size: '2.4 MB',
        date: '2026-01-15',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Q1 Operations Budget.xlsx',
        type: 'Spreadsheet',
        size: '845 KB',
        date: '2026-02-01',
        status: 'Draft',
    },
    {
        id: 3,
        name: 'Compliance Guidelines.docx',
        type: 'Document',
        size: '1.2 MB',
        date: '2025-11-20',
        status: 'Active',
    },
    {
        id: 4,
        name: 'Safety Protocols V2.pdf',
        type: 'PDF',
        size: '4.1 MB',
        date: '2026-03-05',
        status: 'Under Review',
    },
    {
        id: 5,
        name: 'Emergency Response Plan.pdf',
        type: 'PDF',
        size: '3.6 MB',
        date: '2025-08-12',
        status: 'Active',
    },
];

export default function Show() {
    const { orgUnit } = usePage<PageProps>().props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const cannotDelete = (orgUnit?.children?.length || 0) > 0;

    const primaryLocations = useMemo(() => {
        return (orgUnit?.locations ?? []).filter(
            (l: LocationItem) => l.pivot?.is_primary,
        );
    }, [orgUnit]);

    // Fallback dummy locations if none exist
    const displayLocations =
        orgUnit?.locations?.length > 0
            ? orgUnit.locations
            : [
                  {
                      id: 991,
                      name: 'Harare Main Office',
                      timezone: 'Africa/Harare',
                      pivot: { is_primary: true, effective_from: '2024-01-01' },
                  },
                  {
                      id: 992,
                      name: 'Bulawayo Regional Hub',
                      timezone: 'Africa/Harare',
                      pivot: {
                          is_primary: false,
                          effective_from: '2024-03-15',
                      },
                  },
                  {
                      id: 993,
                      name: 'Mutare Logistics Center',
                      timezone: 'Africa/Harare',
                      pivot: {
                          is_primary: false,
                          effective_from: '2024-06-01',
                      },
                  },
              ];

    const isEffective = useMemo(() => {
        if (!orgUnit.effective_from) return true;
        const now = moment();
        const start = moment(orgUnit.effective_from);
        const end = orgUnit.effective_to ? moment(orgUnit.effective_to) : null;

        if (now.isBefore(start)) return false;
        if (end && now.isAfter(end)) return false;
        return true;
    }, [orgUnit]);

    const handleDelete = () => {
        setDeleteDialogOpen(false);

        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete org unit "${orgUnit.name}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(PATHS.destroy(orgUnit.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'The org unit has been deleted.',
                            'success',
                        );
                        router.visit(PATHS.index);
                    },
                    onError: () => {
                        Swal.fire(
                            'Error!',
                            'Failed to delete org unit. It may have child units or related records.',
                            'error',
                        );
                    },
                });
            }
        });
    };

    const getTabClass = (tabName: string) => {
        return activeTab === tabName
            ? 'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm'
            : 'inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted-foreground/10 rounded-sm';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Org Units', href: PATHS.index },
                { title: orgUnit.name, href: PATHS.show(orgUnit.id) },
            ]}
        >
            <Head title={`${orgUnit.name}`} />

            {/* Added bg-muted/40 and min-h-[calc(100vh-100px)] for the off-white background */}
            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/40 p-4 md:p-8">
                {/* Header Profile Section */}
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                    <div className="flex items-start gap-5">
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                            {getTypeIcon(
                                orgUnit.type,
                                'h-10 w-10 text-muted-foreground',
                            )}
                        </div>
                        <div>
                            <div className="mb-1 flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {orgUnit.name}
                                </h1>
                                <UiBadge
                                    variant={
                                        isEffective ? 'default' : 'secondary'
                                    }
                                    className="uppercase"
                                >
                                    {isEffective ? 'Active' : 'Inactive'}
                                </UiBadge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {orgUnit.type} Division{' '}
                                {orgUnit.parent
                                    ? `• Part of ${orgUnit.parent.name}`
                                    : ''}
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <IdCard className="h-4 w-4" />
                                    {orgUnit.code || `ID-${orgUnit.id}`}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <MapPin className="h-4 w-4" />
                                    {primaryLocations[0]?.name ||
                                        'Harare Main Office'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button
                            onClick={() => router.visit(PATHS.edit(orgUnit.id))}
                            variant="outline"
                            className="gap-2 bg-background shadow-sm"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                        </Button>
                        <Button
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={cannotDelete}
                            variant="destructive"
                            className="gap-2 shadow-sm"
                            title={
                                cannotDelete
                                    ? 'Cannot delete: has child units'
                                    : ''
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Unit
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="no-scrollbar flex h-10 w-full items-center justify-start overflow-x-auto rounded-md bg-muted/80 p-1 sm:w-auto md:w-fit">
                    <div
                        onClick={() => setActiveTab('overview')}
                        className={getTabClass('overview')}
                    >
                        Performance Overview
                    </div>
                    <div
                        onClick={() => setActiveTab('structure')}
                        className={getTabClass('structure')}
                    >
                        Structure
                    </div>
                    <div
                        onClick={() => setActiveTab('locations')}
                        className={getTabClass('locations')}
                    >
                        Locations
                    </div>
                    <div
                        onClick={() => setActiveTab('documents')}
                        className={getTabClass('documents')}
                    >
                        Documents
                    </div>
                </div>

                {/* Tab Content: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="animate-in space-y-6 duration-300 fade-in">
                        {/* Metrics Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Sub-Units Count
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {orgUnit.children?.length || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Active in structure
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Cost Center Util.
                                    </CardTitle>
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {orgUnit.cost_center || 'None'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {orgUnit.cost_center
                                            ? 'Budget tracking active'
                                            : 'No tracking assigned'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Compliance Status
                                    </CardTitle>
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        98.2%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Next audit in 14 days
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tables Row */}
                        <div className="grid gap-6 xl:grid-cols-2">
                            {/* Key Leadership (Placeholder) */}
                            <Card>
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>Key Leadership</CardTitle>
                                        <CardDescription>
                                            Unit decision makers & direct
                                            reports
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-32 sm:w-48">
                                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search..."
                                                className="h-9 pl-8"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Leader</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>
                                                    Department
                                                </TableHead>
                                                <TableHead className="text-right"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                                                            MC
                                                        </div>
                                                        <span className="font-medium">
                                                            Marcus Chen
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>COO</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    Executive
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                                                            SW
                                                        </div>
                                                        <span className="font-medium">
                                                            Sarah Williams
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    VP Logistics
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    Logistics
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <div className="flex items-center justify-between border-t bg-muted/50 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Showing 2 placeholders
                                        </p>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs"
                                        >
                                            View Directory
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Organization Sub-Units */}
                            <Card>
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>
                                            Organization Sub-Units
                                        </CardTitle>
                                        <CardDescription>
                                            Hierarchical divisions under{' '}
                                            {orgUnit.name}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-32 sm:w-48">
                                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search..."
                                                className="h-9 pl-8"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Sub-Unit Name
                                                </TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orgUnit.children &&
                                            orgUnit.children.length > 0 ? (
                                                orgUnit.children
                                                    .slice(0, 5)
                                                    .map((child) => (
                                                        <TableRow
                                                            key={child.id}
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    {getTypeIcon(
                                                                        child.type,
                                                                        'h-4 w-4 text-muted-foreground',
                                                                    )}
                                                                    <Link
                                                                        href={PATHS.show(
                                                                            child.id,
                                                                        )}
                                                                        className="font-medium hover:underline"
                                                                    >
                                                                        {
                                                                            child.name
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {child.code ||
                                                                    '—'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <UiBadge
                                                                    variant="secondary"
                                                                    className="text-[10px] uppercase"
                                                                >
                                                                    {child.type}
                                                                </UiBadge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={PATHS.show(
                                                                            child.id,
                                                                        )}
                                                                    >
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="py-6 text-center text-sm text-muted-foreground"
                                                    >
                                                        No sub-units found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    <div className="flex items-center justify-between border-t bg-muted/50 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Showing{' '}
                                            {Math.min(
                                                5,
                                                orgUnit.children?.length || 0,
                                            )}{' '}
                                            of {orgUnit.children?.length || 0}{' '}
                                            sub-units
                                        </p>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() =>
                                                setActiveTab('structure')
                                            }
                                            className="h-auto p-0 text-xs"
                                        >
                                            View Full Hierarchy
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bottom Row */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Productivity Chart (Placeholder) */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>
                                        Monthly Productivity Index
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex h-48 items-end justify-between gap-4 px-2">
                                        {[60, 75, 90, 65, 80, 70].map(
                                            (val, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`group relative w-full rounded-t-md ${val === 90 ? 'bg-primary' : 'bg-secondary'}`}
                                                    style={{
                                                        height: `${val}%`,
                                                    }}
                                                >
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                                                        {val}%
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-between px-2">
                                        {[
                                            'Jan',
                                            'Feb',
                                            'Mar',
                                            'Apr',
                                            'May',
                                            'Jun',
                                        ].map((month, idx) => (
                                            <span
                                                key={month}
                                                className={`text-[10px] uppercase ${idx === 2 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
                                            >
                                                {month}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sidebar Elements */}
                            <div className="space-y-6">
                                {/* Unit HQ */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">
                                            Primary Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative mb-4 aspect-video overflow-hidden rounded-md border bg-muted">
                                            <div className="absolute inset-0 bg-secondary opacity-50"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <MapPin className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {primaryLocations[0]?.name ||
                                                'Harare Main Office (Default)'}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Timezone:{' '}
                                            {primaryLocations[0]?.timezone ||
                                                'Africa/Harare'}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-4 w-full bg-background text-xs"
                                            onClick={() =>
                                                setActiveTab('locations')
                                            }
                                        >
                                            View All Locations
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: STRUCTURE */}
                {activeTab === 'structure' && (
                    <div className="animate-in duration-300 fade-in">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organizational Structure</CardTitle>
                                <CardDescription>
                                    Visual representation of the hierarchy under{' '}
                                    {orgUnit.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="no-scrollbar flex w-full overflow-x-auto py-8">
                                    <div className="mx-auto flex min-w-max flex-col items-center">
                                        {/* Parent Node */}
                                        <Card className="z-10 w-64 border-2 border-primary shadow-md">
                                            <CardHeader className="p-4 pb-2 text-center">
                                                <CardTitle className="text-base">
                                                    {orgUnit.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 text-center">
                                                <UiBadge
                                                    variant="secondary"
                                                    className="uppercase"
                                                >
                                                    {orgUnit.type}
                                                </UiBadge>
                                            </CardContent>
                                        </Card>

                                        {/* Connecting Line Down */}
                                        {orgUnit.children?.length > 0 && (
                                            <>
                                                <div className="h-8 w-px bg-border"></div>

                                                {/* Horizontal Branching Line */}
                                                <div
                                                    className="relative h-px w-full bg-border"
                                                    style={{
                                                        width: `calc(100% - ${100 / orgUnit.children.length}%)`,
                                                    }}
                                                ></div>

                                                {/* Children Nodes */}
                                                <div className="flex w-full justify-between gap-8 px-4 pt-6">
                                                    {orgUnit.children.map(
                                                        (child, index) => (
                                                            <div
                                                                key={child.id}
                                                                className="relative flex flex-col items-center"
                                                            >
                                                                {/* Vertical line connecting to horizontal line */}
                                                                <div className="absolute -top-6 h-6 w-px bg-border"></div>
                                                                <Card
                                                                    className="w-52 cursor-pointer transition-colors hover:border-primary/50"
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            PATHS.show(
                                                                                child.id,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <CardContent className="p-4 text-center">
                                                                        <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-muted">
                                                                            {getTypeIcon(
                                                                                child.type,
                                                                                'h-4 w-4 text-muted-foreground',
                                                                            )}
                                                                        </div>
                                                                        <h4 className="mb-1 text-sm font-semibold">
                                                                            {
                                                                                child.name
                                                                            }
                                                                        </h4>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {
                                                                                child.type
                                                                            }
                                                                        </p>
                                                                        {child.code && (
                                                                            <p className="mt-1 text-[10px] text-muted-foreground">
                                                                                {
                                                                                    child.code
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {orgUnit.children?.length === 0 && (
                                            <div className="mt-8 text-sm text-muted-foreground">
                                                No child units exist under this
                                                organization.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tab Content: LOCATIONS */}
                {activeTab === 'locations' && (
                    <div className="animate-in space-y-6 duration-300 fade-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold">
                                    Linked Locations
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Geographical locations assigned to this
                                    unit.
                                </p>
                            </div>
                            <Button className="gap-2">
                                <MapPin className="h-4 w-4" />
                                Assign Location
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {displayLocations.map((loc, idx) => (
                                <Card key={loc.id || idx}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-primary/10 p-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                </div>
                                                <CardTitle className="text-base">
                                                    {loc.name}
                                                </CardTitle>
                                            </div>
                                            {(loc.pivot?.is_primary ||
                                                (displayLocations.length ===
                                                    3 &&
                                                    idx === 0)) && (
                                                <UiBadge>Primary</UiBadge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Timezone:
                                            </span>
                                            <span className="font-medium">
                                                {loc.timezone}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Effective From:
                                            </span>
                                            <span className="font-medium">
                                                {loc.pivot?.effective_from
                                                    ? moment(
                                                          loc.pivot
                                                              .effective_from,
                                                      ).format('ll')
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex gap-2 border-t pt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full bg-background text-xs"
                                            >
                                                View Map
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Content: DOCUMENTS */}
                {activeTab === 'documents' && (
                    <div className="animate-in space-y-6 duration-300 fade-in">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>
                                        Unit Documents & Resources
                                    </CardTitle>
                                    <CardDescription>
                                        Files, policies, and operational
                                        guidelines.
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative w-48 sm:w-64">
                                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search files..."
                                            className="h-9 bg-background pl-8"
                                        />
                                    </div>
                                    <Button className="h-9">Upload File</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>File Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Date Modified</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dummyDocuments.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <File className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {doc.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {doc.type}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {doc.size}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {moment(doc.date).format(
                                                        'll',
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <UiBadge
                                                        variant={
                                                            doc.status ===
                                                            'Active'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="text-[10px] font-normal"
                                                    >
                                                        {doc.status}
                                                    </UiBadge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Org Unit</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                <strong className="text-foreground">
                                    {orgUnit.name}
                                </strong>
                                ?
                                {cannotDelete && (
                                    <span className="mt-2 block font-medium text-destructive">
                                        This org unit has{' '}
                                        {orgUnit.children?.length ?? 0} child
                                        org units and cannot be deleted.
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-4 flex justify-end gap-2">
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
            </div>
        </AppLayout>
    );
}
