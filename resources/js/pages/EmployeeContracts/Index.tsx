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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,

    CheckCircle2,
    Eye,
    FileText,
    Pencil,
    Plus,
    Power,
    Rows3,
    Trash2,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type EmployeeSummary = {
    id: number;
    staff_number: string;
    full_name: string;
    first_name: string;
    surname: string;
};

type ContractRow = {
    id: number;
    contract_number: string;
    contract_type: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    job_title: string | null;
    department: { id: number; name: string } | null;
    position: { id: number; name: string } | null;
    basic_salary: string | null;
    currency: string | null;
    is_current: boolean;
    created_at: string | null;
    links: {
        show: string;
        edit: string;
        activate: string;
        terminate: string;
    };
};

const CONTRACT_TYPE_LABELS: Record<string, string> = {
    permanent: 'Permanent',
    fixed_term: 'Fixed Term',
    temporary: 'Temporary',
    internship: 'Internship',
    consultancy: 'Consultancy',
    probation: 'Probation',
};

function statusBadgeVariant(status: string) {
    switch (status) {
        case 'active':
            return 'default';
        case 'draft':
            return 'secondary';
        case 'pending_approval':
            return 'outline';
        case 'expired':
        case 'terminated':
            return 'destructive';
        case 'suspended':
            return 'outline';
        case 'archived':
            return 'secondary';
        default:
            return 'secondary';
    }
}

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string | null) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function formatMoney(amount: string | null, currency?: string | null) {
    if (!amount) return '—';

    return `${currency || ''} ${Number(amount).toLocaleString()}`.trim();
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <Card className="border-border/60 shadow-sm">
            <CardContent className="flex items-start justify-between p-5">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="rounded-xl border bg-muted/50 p-2.5">
                    <Icon className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="space-y-1 rounded-xl border bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
    );
}

function ContractActions({
    contract,
    canUpdate,
    canDelete,
    canActivate,
    canTerminate,
    onActivate,
    onDelete,
    onTerminate,
}: {
    contract: ContractRow;
    canUpdate: boolean;
    canDelete: boolean;
    canActivate: boolean;
    canTerminate: boolean;
    onActivate: (contract: ContractRow) => void;
    onDelete: (contract: ContractRow) => void;
    onTerminate: (contract: ContractRow) => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Link href={contract.links.show}>
                <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </Button>
            </Link>

            {canUpdate && (
                <Link href={contract.links.edit}>
                    <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </Link>
            )}

            {canActivate && !contract.is_current && contract.status !== 'terminated' && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onActivate(contract)}
                >
                    <Power className="mr-2 h-4 w-4" />
                    Set Current
                </Button>
            )}

            {canTerminate && contract.status === 'active' && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTerminate(contract)}
                >
                    <XCircle className="mr-2 h-4 w-4 text-destructive" />
                    Terminate
                </Button>
            )}

            {canDelete && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(contract)}
                >
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete
                </Button>
            )}
        </div>
    );
}

export default function ContractIndex() {
    const { employee, contracts } = usePage<{
        employee: EmployeeSummary;
        contracts: ContractRow[];
    }>().props;

    const { can } = useAuthorization();
    const [contractToDelete, setContractToDelete] = useState<ContractRow | null>(null);
    const [contractToTerminate, setContractToTerminate] =
        useState<ContractRow | null>(null);

    const canCreate = can('contracts.create');
    const canUpdate = can('contracts.update');
    const canDelete = can('contracts.delete');
    const canActivate = can('contracts.activate');
    const canTerminate = can('contracts.terminate');

    const handleDelete = () => {
        if (!contractToDelete) return;

        router.delete(`/employees/${employee.id}/contracts/${contractToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => setContractToDelete(null),
        });
    };

    const handleTerminate = () => {
        if (!contractToTerminate) return;

        router.post(contractToTerminate.links.terminate, undefined, {
            preserveScroll: true,
            onFinish: () => setContractToTerminate(null),
        });
    };

    const handleActivate = (contract: ContractRow) => {
        router.post(contract.links.activate, undefined, {
            preserveScroll: true,
        });
    };

    const currentContract = contracts.find((c) => c.is_current);
    const activeContracts = contracts.filter((c) => c.status === 'active').length;
    const draftContracts = contracts.filter((c) => c.status === 'draft').length;
    const terminatedContracts = contracts.filter(
        (c) => c.status === 'terminated',
    ).length;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                {
                    title: employee.full_name,
                    href: `/employees/${employee.id}`,
                },
                { title: 'Contracts', href: '#' },
            ]}
        >
            <Head title={`Contracts - ${employee.full_name}`} />

            <div className="min-h-screen w-full bg-muted/20">
                <div className="flex min-h-screen flex-col">
                    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex items-start gap-3">
                                    <Link href={`/employees/${employee.id}`}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <div className="min-w-0">
                                        <div className="mb-2 inline-flex items-center rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                                            Contract Management
                                        </div>
                                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                            Contracts
                                        </h1>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Manage contract history for{' '}
                                            <span className="font-medium text-foreground">
                                                {employee.full_name}
                                            </span>{' '}
                                            · {employee.staff_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Link href={`/employees/${employee.id}`}>
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            <Briefcase className="mr-2 h-4 w-4" />
                                            Employee Profile
                                        </Button>
                                    </Link>
                                    {canCreate && (
                                        <Link href={`/employees/${employee.id}/contracts/create`}>
                                            <Button className="w-full sm:w-auto">
                                                <Plus className="mr-2 h-4 w-4" />
                                                New Contract
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard
                                    title="Total Contracts"
                                    value={contracts.length}
                                    description="All contracts on record"
                                    icon={Rows3}
                                />
                                <StatCard
                                    title="Current Contract"
                                    value={currentContract ? 'Yes' : 'None'}
                                    description="Primary active contract assignment"
                                    icon={CheckCircle2}
                                />
                                <StatCard
                                    title="Active Contracts"
                                    value={activeContracts}
                                    description="Contracts currently marked active"
                                    icon={FileText}
                                />
                                <StatCard
                                    title="Terminated"
                                    value={terminatedContracts}
                                    description="Closed or terminated agreements"
                                    icon={XCircle}
                                />
                            </div>

                            {currentContract ? (
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="rounded-xl border bg-muted/50 p-2.5">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <CardTitle className="text-xl">
                                                        Current Contract
                                                    </CardTitle>
                                                    <Badge variant="default">Current</Badge>
                                                    <Badge
                                                        variant={statusBadgeVariant(
                                                            currentContract.status,
                                                        )}
                                                    >
                                                        {formatStatus(currentContract.status)}
                                                    </Badge>
                                                </div>
                                                <CardDescription>
                                                    Highlighted summary of the employee’s primary contract.
                                                </CardDescription>
                                            </div>

                                            <ContractActions
                                                contract={currentContract}
                                                canUpdate={canUpdate}
                                                canDelete={canDelete}
                                                canActivate={canActivate}
                                                canTerminate={canTerminate}
                                                onActivate={handleActivate}
                                                onDelete={setContractToDelete}
                                                onTerminate={setContractToTerminate}
                                            />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div className="rounded-2xl border bg-muted/30 p-5">
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Contract Number
                                                    </p>
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        {currentContract.contract_number}
                                                    </h2>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline">
                                                        {CONTRACT_TYPE_LABELS[
                                                            currentContract.contract_type
                                                        ] || currentContract.contract_type}
                                                    </Badge>
                                                    {currentContract.job_title && (
                                                        <Badge variant="secondary">
                                                            {currentContract.job_title}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                            <DetailItem
                                                label="Start Date"
                                                value={formatDate(currentContract.start_date)}
                                            />
                                            <DetailItem
                                                label="End Date"
                                                value={
                                                    currentContract.end_date
                                                        ? formatDate(currentContract.end_date)
                                                        : 'Open-ended'
                                                }
                                            />
                                            <DetailItem
                                                label="Salary"
                                                value={formatMoney(
                                                    currentContract.basic_salary,
                                                    currentContract.currency,
                                                )}
                                            />
                                            <DetailItem
                                                label="Type"
                                                value={
                                                    CONTRACT_TYPE_LABELS[
                                                        currentContract.contract_type
                                                    ] || currentContract.contract_type
                                                }
                                            />
                                            <DetailItem
                                                label="Department"
                                                value={currentContract.department?.name || 'Not set'}
                                            />
                                            <DetailItem
                                                label="Position"
                                                value={currentContract.position?.name || 'Not set'}
                                            />
                                            <DetailItem
                                                label="Job Title"
                                                value={currentContract.job_title || 'Not set'}
                                            />
                                            <DetailItem
                                                label="Status"
                                                value={formatStatus(currentContract.status)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-border/60 shadow-sm">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="mb-4 rounded-2xl border bg-muted/50 p-4">
                                            <FileText className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold">No current contract</h3>
                                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                                            There is no contract currently marked as the active contract
                                            for this employee.
                                        </p>
                                        {canCreate && (
                                            <Link
                                                href={`/employees/${employee.id}/contracts/create`}
                                                className="mt-5"
                                            >
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Contract
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <CardTitle className="text-xl">
                                                Contract History
                                            </CardTitle>
                                            <CardDescription>
                                                {contracts.length} contract
                                                {contracts.length !== 1 ? 's' : ''} on record ·{' '}
                                                {draftContracts} draft
                                                {draftContracts !== 1 ? 's' : ''}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    {contracts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-14 text-center">
                                            <div className="mb-4 rounded-2xl border bg-muted/50 p-4">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold">No contracts yet</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Create the first contract for this employee.
                                            </p>
                                            {canCreate && (
                                                <Link
                                                    href={`/employees/${employee.id}/contracts/create`}
                                                    className="mt-5"
                                                >
                                                    <Button variant="outline">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Create Contract
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="hidden overflow-x-auto lg:block">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Contract</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Dates</TableHead>
                                                            <TableHead>Organisation</TableHead>
                                                            <TableHead>Salary</TableHead>
                                                            <TableHead className="text-right">
                                                                Actions
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {contracts.map((contract) => (
                                                            <TableRow key={contract.id}>
                                                                <TableCell className="align-top">
                                                                    <div className="space-y-1">
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            <span className="font-medium">
                                                                                {contract.contract_number}
                                                                            </span>
                                                                            {contract.is_current && (
                                                                                <Badge
                                                                                    variant="default"
                                                                                    className="text-xs"
                                                                                >
                                                                                    Current
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {CONTRACT_TYPE_LABELS[
                                                                                contract.contract_type
                                                                            ] || contract.contract_type}
                                                                        </p>
                                                                        {contract.job_title && (
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {contract.job_title}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="align-top">
                                                                    <Badge
                                                                        variant={statusBadgeVariant(
                                                                            contract.status,
                                                                        )}
                                                                    >
                                                                        {formatStatus(contract.status)}
                                                                    </Badge>
                                                                </TableCell>

                                                                <TableCell className="align-top">
                                                                    <div className="space-y-1 text-sm">
                                                                        <p>
                                                                            Start:{' '}
                                                                            {formatDate(contract.start_date)}
                                                                        </p>
                                                                        <p className="text-muted-foreground">
                                                                            End:{' '}
                                                                            {contract.end_date
                                                                                ? formatDate(
                                                                                      contract.end_date,
                                                                                  )
                                                                                : 'Open-ended'}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="align-top">
                                                                    <div className="space-y-1 text-sm">
                                                                        <p>{contract.department?.name || '—'}</p>
                                                                        <p className="text-muted-foreground">
                                                                            {contract.position?.name || '—'}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="align-top">
                                                                    {formatMoney(
                                                                        contract.basic_salary,
                                                                        contract.currency,
                                                                    )}
                                                                </TableCell>

                                                                <TableCell className="align-top text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <Link href={contract.links.show}>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                title="View"
                                                                            >
                                                                                <Eye className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>

                                                                        {canUpdate && (
                                                                            <Link href={contract.links.edit}>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    title="Edit"
                                                                                >
                                                                                    <Pencil className="h-4 w-4" />
                                                                                </Button>
                                                                            </Link>
                                                                        )}

                                                                        {canActivate &&
                                                                            !contract.is_current &&
                                                                            contract.status !==
                                                                                'terminated' && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    title="Set as current"
                                                                                    onClick={() =>
                                                                                        handleActivate(contract)
                                                                                    }
                                                                                >
                                                                                    <Power className="h-4 w-4" />
                                                                                </Button>
                                                                            )}

                                                                        {canTerminate &&
                                                                            contract.status === 'active' && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    title="Terminate"
                                                                                    onClick={() =>
                                                                                        setContractToTerminate(
                                                                                            contract,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                                                </Button>
                                                                            )}

                                                                        {canDelete && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                title="Delete"
                                                                                onClick={() =>
                                                                                    setContractToDelete(
                                                                                        contract,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            <div className="grid gap-4 lg:hidden">
                                                {contracts.map((contract) => (
                                                    <Card
                                                        key={contract.id}
                                                        className="border-border/60 shadow-none"
                                                    >
                                                        <CardContent className="space-y-4 p-5">
                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <p className="font-semibold">
                                                                            {contract.contract_number}
                                                                        </p>
                                                                        {contract.is_current && (
                                                                            <Badge variant="default">
                                                                                Current
                                                                            </Badge>
                                                                        )}
                                                                        <Badge
                                                                            variant={statusBadgeVariant(
                                                                                contract.status,
                                                                            )}
                                                                        >
                                                                            {formatStatus(contract.status)}
                                                                        </Badge>
                                                                    </div>

                                                                    <p className="text-sm text-muted-foreground">
                                                                        {CONTRACT_TYPE_LABELS[
                                                                            contract.contract_type
                                                                        ] || contract.contract_type}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid gap-3 sm:grid-cols-2">
                                                                <DetailItem
                                                                    label="Start Date"
                                                                    value={formatDate(contract.start_date)}
                                                                />
                                                                <DetailItem
                                                                    label="End Date"
                                                                    value={
                                                                        contract.end_date
                                                                            ? formatDate(contract.end_date)
                                                                            : 'Open-ended'
                                                                    }
                                                                />
                                                                <DetailItem
                                                                    label="Department"
                                                                    value={
                                                                        contract.department?.name || 'Not set'
                                                                    }
                                                                />
                                                                <DetailItem
                                                                    label="Position"
                                                                    value={
                                                                        contract.position?.name || 'Not set'
                                                                    }
                                                                />
                                                                <DetailItem
                                                                    label="Job Title"
                                                                    value={contract.job_title || 'Not set'}
                                                                />
                                                                <DetailItem
                                                                    label="Salary"
                                                                    value={formatMoney(
                                                                        contract.basic_salary,
                                                                        contract.currency,
                                                                    )}
                                                                />
                                                            </div>

                                                            <ContractActions
                                                                contract={contract}
                                                                canUpdate={canUpdate}
                                                                canDelete={canDelete}
                                                                canActivate={canActivate}
                                                                canTerminate={canTerminate}
                                                                onActivate={handleActivate}
                                                                onDelete={setContractToDelete}
                                                                onTerminate={setContractToTerminate}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={!!contractToDelete}
                onOpenChange={(open) => !open && setContractToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete contract{' '}
                            <strong>{contractToDelete?.contract_number}</strong>? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={!!contractToTerminate}
                onOpenChange={(open) => !open && setContractToTerminate(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terminate Contract</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to terminate contract{' '}
                            <strong>{contractToTerminate?.contract_number}</strong>? This
                            will set the status to terminated and remove it as the current
                            contract.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleTerminate}>
                            Terminate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}