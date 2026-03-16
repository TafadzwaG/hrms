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
    Eye,
    FileText,
    Pencil,
    Plus,
    Power,
    Trash2,
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

export default function ContractIndex() {
    const { employee, contracts } = usePage<{
        employee: EmployeeSummary;
        contracts: ContractRow[];
    }>().props;

    const { can } = useAuthorization();
    const [contractToDelete, setContractToDelete] =
        useState<ContractRow | null>(null);
    const [contractToTerminate, setContractToTerminate] =
        useState<ContractRow | null>(null);

    const canCreate = can('contracts.create');
    const canUpdate = can('contracts.update');
    const canDelete = can('contracts.delete');
    const canActivate = can('contracts.activate');
    const canTerminate = can('contracts.terminate');

    const handleDelete = () => {
        if (!contractToDelete) return;
        router.delete(
            `/employees/${employee.id}/contracts/${contractToDelete.id}`,
            {
                preserveScroll: true,
                onFinish: () => setContractToDelete(null),
            },
        );
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

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/employees/${employee.id}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Contracts
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {employee.full_name} &middot;{' '}
                                {employee.staff_number}
                            </p>
                        </div>
                    </div>
                    {canCreate && (
                        <Link
                            href={`/employees/${employee.id}/contracts/create`}
                        >
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Contract
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Current Contract Summary */}
                {currentContract && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">
                                    Current Contract
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Active contract details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Contract Number
                                    </p>
                                    <p className="text-sm font-medium">
                                        {currentContract.contract_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Type
                                    </p>
                                    <p className="text-sm font-medium">
                                        {CONTRACT_TYPE_LABELS[
                                            currentContract.contract_type
                                        ] || currentContract.contract_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Start Date
                                    </p>
                                    <p className="text-sm font-medium">
                                        {currentContract.start_date || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        End Date
                                    </p>
                                    <p className="text-sm font-medium">
                                        {currentContract.end_date || 'Open-ended'}
                                    </p>
                                </div>
                                {currentContract.basic_salary && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Basic Salary
                                        </p>
                                        <p className="text-sm font-medium">
                                            {currentContract.currency || ''}{' '}
                                            {Number(
                                                currentContract.basic_salary,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {currentContract.department && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Department
                                        </p>
                                        <p className="text-sm font-medium">
                                            {currentContract.department.name}
                                        </p>
                                    </div>
                                )}
                                {currentContract.position && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Position
                                        </p>
                                        <p className="text-sm font-medium">
                                            {currentContract.position.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contract List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contract History</CardTitle>
                        <CardDescription>
                            {contracts.length} contract
                            {contracts.length !== 1 ? 's' : ''} on record
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {contracts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">
                                    No contracts yet
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Create the first contract for this employee.
                                </p>
                                {canCreate && (
                                    <Link
                                        href={`/employees/${employee.id}/contracts/create`}
                                    >
                                        <Button variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Contract
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contract #</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Salary</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contracts.map((contract) => (
                                            <TableRow key={contract.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {contract.contract_number}
                                                        {contract.is_current && (
                                                            <Badge variant="default" className="text-xs">
                                                                Current
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {CONTRACT_TYPE_LABELS[
                                                        contract.contract_type
                                                    ] ||
                                                        contract.contract_type}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={statusBadgeVariant(
                                                            contract.status,
                                                        )}
                                                    >
                                                        {formatStatus(
                                                            contract.status,
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {contract.start_date ||
                                                        '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {contract.end_date ||
                                                        '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {contract.basic_salary
                                                        ? `${contract.currency || ''} ${Number(contract.basic_salary).toLocaleString()}`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={
                                                                contract.links
                                                                    .show
                                                            }
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="View"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {canUpdate && (
                                                            <Link
                                                                href={
                                                                    contract
                                                                        .links
                                                                        .edit
                                                                }
                                                            >
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
                                                                        handleActivate(
                                                                            contract,
                                                                        )
                                                                    }
                                                                >
                                                                    <Power className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        {canTerminate &&
                                                            contract.status ===
                                                                'active' && (
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
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete dialog */}
            <AlertDialog
                open={!!contractToDelete}
                onOpenChange={(open) => !open && setContractToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete contract{' '}
                            <strong>
                                {contractToDelete?.contract_number}
                            </strong>
                            ? This action cannot be undone.
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

            {/* Terminate dialog */}
            <AlertDialog
                open={!!contractToTerminate}
                onOpenChange={(open) =>
                    !open && setContractToTerminate(null)
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Terminate Contract
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to terminate contract{' '}
                            <strong>
                                {contractToTerminate?.contract_number}
                            </strong>
                            ? This will set the status to terminated and remove
                            it as the current contract.
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
