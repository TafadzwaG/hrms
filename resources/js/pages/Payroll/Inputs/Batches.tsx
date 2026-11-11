import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Undo2 } from 'lucide-react';
import { useState } from 'react';
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
import { useAuthorization } from '@/lib/authorization';

type Batch = {
    id: number;
    batch_number: string;
    source: string;
    action: string;
    description: string | null;
    period: { id: number; code: string; status: string } | null;
    control_total: number | null;
    control_count: number | null;
    entered_total: number;
    entered_count: number;
    differences: string[];
    status: string;
    created_by: string | null;
    created_at: string | null;
    reversed_by: string | null;
    reversed_at: string | null;
};

type Props = {
    batches: {
        data: Batch[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { period_id: number | null };
    periods: Array<{ id: number; code: string; name: string }>;
    errors: Record<string, string>;
};

const money = (value: number) =>
    value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function PayrollInputBatches() {
    const { batches, filters, periods, errors } = usePage<Props>().props;
    const { can } = useAuthorization();
    const [reversing, setReversing] = useState<Batch | null>(null);

    const canReverse = (batch: Batch) =>
        can('payroll.inputs.manage') &&
        batch.status === 'POSTED' &&
        !['APPROVED', 'CLOSED'].includes(batch.period?.status ?? '');

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payroll', href: '/payroll' },
                { title: 'Inputs', href: '/payroll/inputs' },
                { title: 'Batches', href: '#' },
            ]}
        >
            <Head title="Payroll Input Batches" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/5 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm sm:flex"
                            onClick={() => router.visit('/payroll/inputs')}
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                                Input batches
                            </h1>
                            <p className="mt-1 max-w-3xl text-sm font-medium text-muted-foreground">
                                Every import, bulk action and grid post is a
                                batch. Reversing a batch puts the inputs back to
                                how they were before it was posted.
                            </p>
                        </div>
                    </div>
                    <Select
                        value={
                            filters.period_id
                                ? String(filters.period_id)
                                : 'all'
                        }
                        onValueChange={(value) =>
                            router.get(
                                '/payroll/inputs/batches',
                                { period_id: value === 'all' ? '' : value },
                                { preserveState: true, replace: true },
                            )
                        }
                    >
                        <SelectTrigger className="h-10 w-56 bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All periods</SelectItem>
                            {periods.map((period) => (
                                <SelectItem
                                    key={period.id}
                                    value={String(period.id)}
                                >
                                    {period.code}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {errors.batch && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm font-medium text-destructive">
                        {errors.batch}
                    </div>
                )}

                <Card className="overflow-hidden border-border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Batch</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>What</TableHead>
                                <TableHead className="text-right">
                                    Rows
                                </TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                                <TableHead>Posted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-10 text-center text-sm text-muted-foreground"
                                    >
                                        No batches yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {batches.data.map((batch) => (
                                <TableRow key={batch.id}>
                                    <TableCell className="font-mono font-bold">
                                        {batch.batch_number}
                                    </TableCell>
                                    <TableCell>{batch.period?.code}</TableCell>
                                    <TableCell>
                                        <p className="text-sm font-medium">
                                            {batch.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {batch.source} ·{' '}
                                            {batch.action === 'DELETE'
                                                ? 'removed inputs'
                                                : 'added inputs'}
                                        </p>
                                        {batch.differences.length > 0 && (
                                            <p className="mt-1 flex items-start gap-1 text-xs font-medium text-amber-700">
                                                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                                                Posted despite:{' '}
                                                {batch.differences.join('; ')}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {batch.entered_count}
                                        {batch.control_count !== null && (
                                            <span className="block text-[10px] text-muted-foreground">
                                                control {batch.control_count}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {money(batch.entered_total)}
                                        {batch.control_total !== null && (
                                            <span className="block text-[10px] text-muted-foreground">
                                                control{' '}
                                                {money(batch.control_total)}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {batch.created_at}
                                        <span className="block text-muted-foreground">
                                            {batch.created_by}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] font-bold tracking-widest uppercase ${batch.status === 'REVERSED' ? 'text-muted-foreground' : ''}`}
                                        >
                                            {batch.status}
                                        </Badge>
                                        {batch.reversed_at && (
                                            <span className="mt-1 block text-[10px] text-muted-foreground">
                                                {batch.reversed_at} by{' '}
                                                {batch.reversed_by}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {canReverse(batch) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="font-bold"
                                                onClick={() =>
                                                    setReversing(batch)
                                                }
                                            >
                                                <Undo2 className="mr-1 h-3.5 w-3.5" />
                                                Reverse
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {batches.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {batches.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                open={reversing !== null}
                onOpenChange={(open) => !open && setReversing(null)}
            >
                <DialogContent className="border-border sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">
                            Reverse {reversing?.batch_number}?
                        </DialogTitle>
                        <DialogDescription>
                            {reversing?.action === 'DELETE'
                                ? `The ${reversing?.entered_count} input(s) this batch removed will be restored.`
                                : `The ${reversing?.entered_count} input(s) this batch added or changed go back to how they were before it was posted.`}{' '}
                            Reprocess the period afterwards.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setReversing(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-foreground font-bold text-background hover:bg-foreground/90"
                            onClick={() =>
                                reversing &&
                                router.post(
                                    `/payroll/inputs/batches/${reversing.id}/reverse`,
                                    {},
                                    {
                                        preserveScroll: true,
                                        onFinish: () => setReversing(null),
                                    },
                                )
                            }
                        >
                            Reverse batch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
