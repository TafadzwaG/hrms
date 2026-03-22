import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Database,
    Eye,
    FileText,
    Pencil,
    Plus,
    Search,
    Settings2,
    Trash2,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import ReactPaginate from 'react-paginate';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type ModuleField = {
    name: string;
    label: string;
    type: string;
};

type ModuleMeta = {
    slug: string;
    name: string;
    description: string;
    fields: ModuleField[];
    index_columns: string[];
};

type ModuleRecord = Record<string, unknown> & { id: number | string };

type PaginatedRecords = {
    data?: ModuleRecord[];
    current_page?: number;
    last_page?: number;
    total?: number;
};

type ModuleIndexPageProps = {
    module: ModuleMeta;
    records: PaginatedRecords;
    filters: { search?: string };
};

const formatValue = (value: unknown, field?: ModuleField): ReactNode => {
    if (value === null || value === undefined || value === '') return '—';

    if (
        field?.type === 'date' ||
        field?.type === 'datetime' ||
        field?.type === 'datetime-local'
    ) {
        const parsed = moment(String(value));
        return parsed.isValid()
            ? parsed.format(field.type === 'date' ? 'll' : 'lll')
            : String(value);
    }

    if (typeof value === 'boolean') {
        return (
            <Badge
                variant={value ? 'default' : 'secondary'}
                className="font-normal"
            >
                {value ? 'Yes' : 'No'}
            </Badge>
        );
    }

    return String(value);
};

export default function ModuleIndex() {
    const { module, records, filters } = usePage<ModuleIndexPageProps>().props;

    const [search, setSearch] = useState<string>(filters?.search ?? '');

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<
        number | string | null
    >(null);

    const fieldsByName = useMemo(() => {
        return new Map(module.fields.map((field) => [field.name, field]));
    }, [module.fields]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `${API}/${module.slug}`,
                { search },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, module.slug]);

    const handlePageChange = (selected: { selected: number }) => {
        router.get(
            `${API}/${module.slug}`,
            { page: selected.selected + 1, search },
            { preserveState: true },
        );
    };

    const openDeleteDialog = (id: number | string) => {
        setRecordToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!recordToDelete) return;

        router.delete(`${API}/${module.slug}/${recordToDelete}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
            },
        });
    };

    const pageData = records?.data ?? [];

    return (
        <AppLayout
            breadcrumbs={[
                { title: module.name, href: `${API}/${module.slug}` },
            ]}
        >
            <Head title={module.name} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/30 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
                            <Database className="h-6 w-6 text-primary" />
                            {module.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {module.description}
                        </p>
                    </div>

                    <Button asChild className="w-full shadow-sm sm:w-auto">
                        <Link
                            href={`${API}/${module.slug}/create`}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Record
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards with Color Highlights */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Records
                                </p>
                                <p className="text-2xl font-bold">
                                    {records?.total ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Module
                                </p>
                                <p
                                    className="max-w-[150px] truncate text-2xl font-bold capitalize"
                                    title={module.slug.replace(/-/g, ' ')}
                                >
                                    {module.slug.replace(/-/g, ' ')}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Settings2 className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold">
                                {module.name} Directory
                            </CardTitle>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={`Search ${module.name.toLowerCase()}...`}
                                    className="h-10 pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent
                        className="p-0"
                        style={{
                            padding: '20px',
                        }}
                    >
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        {module.index_columns.map(
                                            (columnName) => (
                                                <TableHead
                                                    key={columnName}
                                                    className="py-4"
                                                >
                                                    {fieldsByName.get(
                                                        columnName,
                                                    )?.label ?? columnName}
                                                </TableHead>
                                            ),
                                        )}
                                        <TableHead className="py-4 text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pageData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    module.index_columns
                                                        .length + 1
                                                }
                                                className="py-12 text-center text-sm text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Search className="h-8 w-8 text-muted-foreground/50" />
                                                    <p>
                                                        No records found. Try
                                                        adjusting your search.
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pageData.map(
                                            (item: Record<string, unknown>) => (
                                                <TableRow
                                                    key={String(item.id)}
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    {module.index_columns.map(
                                                        (columnName) => (
                                                            <TableCell
                                                                key={`${String(item.id)}-${columnName}`}
                                                                className="py-3"
                                                            >
                                                                {formatValue(
                                                                    item[
                                                                        columnName
                                                                    ],
                                                                    fieldsByName.get(
                                                                        columnName,
                                                                    ),
                                                                )}
                                                            </TableCell>
                                                        ),
                                                    )}
                                                    <TableCell className="py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`${API}/${module.slug}/${String(item.id)}`}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
                                                                title="View"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={`${API}/${module.slug}/${String(item.id)}/edit`}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:outline-none"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        item.id as
                                                                            | string
                                                                            | number,
                                                                    )
                                                                }
                                                                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-1 focus:outline-none"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {(records?.last_page ?? 1) > 1 && (
                    <div className="flex justify-center pt-4">
                        <ReactPaginate
                            pageCount={records!.last_page!}
                            forcePage={(records!.current_page ?? 1) - 1}
                            onPageChange={handlePageChange}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            previousLabel="Previous"
                            nextLabel="Next"
                            breakLabel="..."
                            containerClassName="flex items-center gap-1 text-sm font-medium"
                            pageClassName=""
                            pageLinkClassName="flex h-9 min-w-9 items-center justify-center rounded-md border border-input bg-background px-3 hover:bg-muted"
                            activeLinkClassName="bg-primary text-primary-foreground hover:bg-primary border-primary"
                            previousClassName=""
                            previousLinkClassName="flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 hover:bg-muted"
                            nextClassName=""
                            nextLinkClassName="flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 hover:bg-muted"
                            breakClassName="flex h-9 items-center justify-center px-2 text-muted-foreground"
                            disabledClassName="opacity-50 pointer-events-none"
                        />
                    </div>
                )}

                {/* Delete Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                Delete Record
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-base">
                                Are you sure you want to delete this record from{' '}
                                <strong className="font-semibold text-foreground">
                                    {module.name}
                                </strong>
                                ? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
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
