import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Folder,
    Link as LinkIcon,
    ListFilter,
    Lock,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

type DocumentType = {
    id: number;
    code: string;
    name: string;
    retention_policy: string | null;
    sensitivity_level: string;
    documents_count: number;
};

type PaginatedData = {
    data: DocumentType[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function DocumentTypeIndex() {
    const { documentTypes, filters, sensitivityOptions, stats } = usePage()
        .props as unknown as {
        documentTypes: PaginatedData;
        filters: { search?: string; sensitivity_level?: string };
        sensitivityOptions: string[];
        stats: {
            total: number;
            confidential: number;
            restricted: number;
            total_documents: number;
        };
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [sensitivity, setSensitivity] = useState(
        filters?.sensitivity_level || 'all',
    );

    // --- State: Modals ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<DocumentType | null>(
        null,
    );

    const basePath = '/document-types';

    // --- Effects: Auto-fetch on filter change ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                basePath,
                {
                    search,
                    ...(sensitivity !== 'all' && {
                        sensitivity_level: sensitivity,
                    }),
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sensitivity]);

    // --- Handlers ---
    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            basePath,
            {
                page: selectedItem.selected + 1,
                search,
                ...(sensitivity !== 'all' && {
                    sensitivity_level: sensitivity,
                }),
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setSensitivity('all');
    };

    const confirmDelete = () => {
        if (!recordToDelete) return;
        router.delete(`${basePath}/${recordToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
            },
        });
    };

    const pageData = documentTypes?.data ?? [];

    // --- Aesthetic Helpers ---
    const getSensitivityBadge = (level: string) => {
        const l = level?.toLowerCase() || '';
        if (l === 'restricted') {
            return (
                <Badge
                    variant="outline"
                    className="border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-destructive uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                    Restricted
                </Badge>
            );
        }
        if (l === 'confidential') {
            return (
                <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    Confidential
                </Badge>
            );
        }
        if (l === 'internal') {
            return (
                <Badge
                    variant="secondary"
                    className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-none"
                >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Internal
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-border bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none"
            >
                Public
            </Badge>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Documents', href: '#' },
                { title: 'Document Types', href: basePath },
            ]}
        >
            <Head title="Document Types" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Document Types
                        </h1>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                            Manage document classifications, retention policies,
                            and sensitivity levels for the entire organization.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="h-11 bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Link href={`${basePath}/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Document Type
                        </Link>
                    </Button>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Types
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold tracking-tight text-foreground">
                                            {stats?.total || 0}
                                        </p>
                                        <span className="text-xs font-semibold text-primary">
                                            +2% from last month
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                    <Folder className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Confidential Types
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold tracking-tight text-foreground">
                                            {stats?.confidential || 0}
                                        </p>
                                        <span className="text-xs font-semibold text-primary">
                                            Requires review
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Lock className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Restricted Types
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold tracking-tight text-foreground">
                                            {stats?.restricted || 0}
                                        </p>
                                        <span className="text-xs font-semibold text-destructive">
                                            High-risk assets
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Linked Documents
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold tracking-tight text-foreground">
                                            {stats?.total_documents?.toLocaleString() ||
                                                0}
                                        </p>
                                        <span className="text-xs font-semibold text-primary">
                                            +12% growth
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground">
                                    <LinkIcon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Container */}
                <div className="rounded-xl border bg-background shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b p-4 lg:flex-row lg:items-center">
                        <div className="flex w-full flex-1 flex-wrap items-center gap-3 lg:w-auto">
                            <div className="relative w-full sm:w-[320px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or code..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full border-border bg-muted/20 pl-9 shadow-none focus-visible:bg-background"
                                />
                            </div>

                            <Select
                                value={sensitivity}
                                onValueChange={setSensitivity}
                            >
                                <SelectTrigger className="h-10 w-[180px] border-border shadow-none">
                                    <SelectValue placeholder="Sensitivity Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Sensitivity Level
                                    </SelectItem>
                                    {(sensitivityOptions || []).map((opt) => (
                                        <SelectItem
                                            key={opt}
                                            value={opt}
                                            className="capitalize"
                                        >
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(search || sensitivity !== 'all') && (
                                <Button
                                    variant="ghost"
                                    onClick={resetFilters}
                                    className="h-10 px-4 text-muted-foreground hover:text-foreground"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset Filters
                                </Button>
                            )}
                        </div>

                        {/* Right side static actions to match screenshot */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-border text-muted-foreground shadow-sm"
                            >
                                <ListFilter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-border text-muted-foreground shadow-sm"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10 hover:bg-transparent">
                                    <TableHead className="h-14 w-[160px] pl-6 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Code
                                    </TableHead>
                                    <TableHead className="w-[300px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Name
                                    </TableHead>
                                    <TableHead className="w-[200px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Retention Policy
                                    </TableHead>
                                    <TableHead className="w-[180px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Sensitivity Level
                                    </TableHead>
                                    <TableHead className="w-[140px] text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Linked Docs
                                    </TableHead>
                                    <TableHead className="w-[140px] pr-6 text-right text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-48 text-center text-sm font-medium text-muted-foreground"
                                        >
                                            No document types found matching
                                            your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pageData.map((record) => (
                                        <TableRow
                                            key={record.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            {/* Code */}
                                            <TableCell className="py-5 pl-6 font-mono text-sm font-medium tracking-wider text-muted-foreground uppercase">
                                                {record.code}
                                            </TableCell>

                                            {/* Name */}
                                            <TableCell className="text-sm font-bold text-foreground">
                                                {record.name}
                                            </TableCell>

                                            {/* Retention Policy */}
                                            <TableCell className="text-sm font-medium text-muted-foreground">
                                                {record.retention_policy || '—'}
                                            </TableCell>

                                            {/* Sensitivity Level */}
                                            <TableCell>
                                                {getSensitivityBadge(
                                                    record.sensitivity_level,
                                                )}
                                            </TableCell>

                                            {/* Linked Docs */}
                                            <TableCell className="text-sm font-medium text-foreground">
                                                {record.documents_count?.toLocaleString() ||
                                                    0}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="View Document Type"
                                                    >
                                                        <Link
                                                            href={`${basePath}/${record.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Edit Document Type"
                                                    >
                                                        <Link
                                                            href={`${basePath}/${record.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {/* Conditional Delete Logic - Backend dictates it cannot be deleted if docs are attached */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={
                                                            record.documents_count >
                                                            0
                                                        }
                                                        className={`h-8 w-8 ${record.documents_count > 0 ? 'cursor-not-allowed text-muted-foreground opacity-30' : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'}`}
                                                        onClick={() => {
                                                            if (
                                                                record.documents_count ===
                                                                0
                                                            ) {
                                                                setRecordToDelete(
                                                                    record,
                                                                );
                                                                setDeleteDialogOpen(
                                                                    true,
                                                                );
                                                            }
                                                        }}
                                                        title={
                                                            record.documents_count >
                                                            0
                                                                ? 'Cannot delete: Documents are linked'
                                                                : 'Delete Document Type'
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {documentTypes?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t bg-muted/10 p-4 px-6">
                            <div className="text-xs font-medium text-muted-foreground">
                                Showing{' '}
                                <span className="font-bold text-foreground">
                                    {(documentTypes.current_page - 1) *
                                        documentTypes.per_page +
                                        1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-foreground">
                                    {Math.min(
                                        documentTypes.current_page *
                                            documentTypes.per_page,
                                        documentTypes.total,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-foreground">
                                    {documentTypes.total}
                                </span>{' '}
                                types
                            </div>
                            <ReactPaginate
                                pageCount={documentTypes.last_page}
                                forcePage={documentTypes.current_page - 1}
                                onPageChange={handlePageChange}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                previousLabel={
                                    <ChevronLeft className="h-4 w-4" />
                                }
                                nextLabel={<ChevronRight className="h-4 w-4" />}
                                breakLabel="..."
                                containerClassName="flex items-center gap-1"
                                pageLinkClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent font-medium hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                activeLinkClassName="!bg-primary text-primary-foreground font-bold border-primary hover:!bg-primary/90 rounded-md"
                                previousLinkClassName="inline-flex h-8 px-2 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground mr-1 transition-colors"
                                nextLinkClassName="inline-flex h-8 px-2 items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-muted text-sm font-medium text-muted-foreground ml-1 transition-colors"
                                breakClassName="flex h-8 w-8 items-center justify-center text-sm font-medium text-muted-foreground"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    )}
                </div>

                {/* Global Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Delete Document Type?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete the
                                document type classification{' '}
                                <strong className="text-foreground">
                                    {recordToDelete?.name} (
                                    {recordToDelete?.code})
                                </strong>
                                ? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setRecordToDelete(null)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
