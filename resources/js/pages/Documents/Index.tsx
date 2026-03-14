import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArchiveRestore,
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    FileText,
    Filter,
    Lock,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import moment from 'moment';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Employee = {
    id: number;
    first_name: string;
    middle_name: string | null;
    surname: string;
    staff_number: string;
};

type DocumentType = {
    id: number;
    code: string;
    name: string;
    sensitivity_level?: string;
};

type DocumentRecord = {
    id: number;
    title: string;
    file_uri: string;
    issue_date: string | null;
    expiry_date: string | null;
    access_policy: string;
    metadata_json: any;
    document_type: DocumentType;
    owner_employee: Employee;
    deleted_at?: string;
    created_at: string;
    updated_at: string;
};

type PaginatedData = {
    data: DocumentRecord[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export default function DocumentIndex() {
    const {
        documents,
        filters,
        accessPolicyOptions,
        expiryStateOptions,
        documentTypes,
        employees,
        stats,
        isTrashView,
    } = usePage().props as unknown as {
        documents: PaginatedData;
        filters: any;
        accessPolicyOptions: string[];
        expiryStateOptions: string[];
        documentTypes: DocumentType[];
        employees: Employee[];
        stats: any;
        isTrashView?: boolean;
    };

    // --- State: Filters ---
    const [search, setSearch] = useState(filters?.search || '');
    const [accessPolicy, setAccessPolicy] = useState(
        filters?.access_policy || 'all',
    );
    const [docType, setDocType] = useState(filters?.document_type_id || 'all');
    const [expiryState, setExpiryState] = useState(
        filters?.expiry_state || 'all',
    );

    // --- State: UI ---
    const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(
        documents.data[0] || null,
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [forceDeleteDialogOpen, setForceDeleteDialogOpen] = useState(false);

    const basePath = '/documents';

    // --- Effects ---
    // Ensure selected doc updates if page changes and it's no longer in the list
    useEffect(() => {
        if (documents.data.length > 0) {
            if (
                !selectedDoc ||
                !documents.data.find((d) => d.id === selectedDoc.id)
            ) {
                setSelectedDoc(documents.data[0]);
            }
        } else {
            setSelectedDoc(null);
        }
    }, [documents]);

    // Auto-fetch on filter change
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = { search };
            if (accessPolicy !== 'all') params.access_policy = accessPolicy;
            if (docType !== 'all') params.document_type_id = docType;
            if (expiryState !== 'all') params.expiry_state = expiryState;

            router.get(isTrashView ? `${basePath}/trash` : basePath, params, {
                preserveState: true,
                replace: true,
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, accessPolicy, docType, expiryState, isTrashView]);

    // --- Handlers ---
    const handlePageChange = (selectedItem: { selected: number }) => {
        const params: any = { page: selectedItem.selected + 1, search };
        if (accessPolicy !== 'all') params.access_policy = accessPolicy;
        if (docType !== 'all') params.document_type_id = docType;
        if (expiryState !== 'all') params.expiry_state = expiryState;

        router.get(isTrashView ? `${basePath}/trash` : basePath, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setAccessPolicy('all');
        setDocType('all');
        setExpiryState('all');
    };

    const handleSoftDelete = () => {
        if (!selectedDoc) return;
        router.delete(`${basePath}/${selectedDoc.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteDialogOpen(false),
        });
    };

    const handleForceDelete = () => {
        if (!selectedDoc) return;
        router.delete(`${basePath}/${selectedDoc.id}/force`, {
            preserveScroll: true,
            onSuccess: () => setForceDeleteDialogOpen(false),
        });
    };

    const handleRestore = () => {
        if (!selectedDoc) return;
        router.post(
            `${basePath}/${selectedDoc.id}/restore`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const pageData = documents?.data ?? [];

    // --- Formatters ---
    const getFullName = (emp: Employee) => {
        if (!emp) return 'Unknown';
        return [emp.first_name, emp.middle_name, emp.surname]
            .filter(Boolean)
            .join(' ');
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

    const getExpiryStatus = (dateStr: string | null) => {
        if (!dateStr)
            return {
                label: 'Never Expires',
                color: 'text-muted-foreground',
                dot: 'bg-muted-foreground',
            };

        const expiry = moment(dateStr);
        const now = moment();

        if (expiry.isBefore(now, 'day')) {
            return {
                label: 'Expired',
                color: 'text-destructive',
                dot: 'bg-destructive',
            };
        }

        const daysLeft = expiry.diff(now, 'days');
        if (daysLeft <= 30) {
            return {
                label: `In ${daysLeft} days`,
                color: 'text-foreground font-bold',
                dot: 'bg-foreground',
            };
        }

        const yearsLeft = expiry.diff(now, 'years');
        const displayLabel =
            yearsLeft > 0
                ? `Active (${yearsLeft}y remaining)`
                : `Active (${daysLeft}d remaining)`;

        return {
            label: displayLabel,
            color: 'text-primary',
            dot: 'bg-primary',
        };
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Documents', href: basePath },
                { title: isTrashView ? 'Trash' : 'Registry', href: '#' },
            ]}
        >
            <Head
                title={isTrashView ? 'Document Trash' : 'Document Registry'}
            />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-6 bg-muted/10 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            {isTrashView
                                ? 'Document Trash'
                                : 'Document Registry'}
                        </h1>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                            {isTrashView
                                ? 'Review and restore deleted organizational documents.'
                                : 'Manage and audit organizational documents across classifications.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {isTrashView ? (
                            <Button
                                variant="outline"
                                className="h-10 border-border bg-background font-semibold shadow-sm"
                                asChild
                            >
                                <Link href={basePath}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    to Registry
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="h-10 border-border bg-background font-semibold text-muted-foreground shadow-sm hover:text-foreground"
                                    asChild
                                >
                                    <Link href={`${basePath}/trash`}>
                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                        Trash
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="h-10 bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                                >
                                    <Link href={`${basePath}/create`}>
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        Document
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Metrics Row */}
                {!isTrashView && (
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Total
                                    </p>
                                    <p className="text-2xl font-extrabold text-foreground">
                                        {stats?.total || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Expired
                                    </p>
                                    <p className="text-2xl font-extrabold text-foreground">
                                        {stats?.expired || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        In 30d
                                    </p>
                                    <p className="text-2xl font-extrabold text-foreground">
                                        {stats?.expiring_30 || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-background shadow-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Restricted
                                    </p>
                                    <p className="text-2xl font-extrabold text-foreground">
                                        {stats?.restricted || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Split Layout */}
                <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-12">
                    {/* LEFT PANE: Filters + List */}
                    <Card className="flex h-[calc(100vh-280px)] flex-col overflow-hidden border-border bg-background shadow-sm md:col-span-5 xl:col-span-4">
                        {/* Toolbar / Filters */}
                        <div className="shrink-0 space-y-3 border-b border-border/50 bg-muted/10 p-4">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full border-border bg-background pl-9 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={accessPolicy}
                                    onValueChange={setAccessPolicy}
                                >
                                    <SelectTrigger className="h-9 w-full border-border bg-background text-xs font-medium shadow-sm">
                                        <SelectValue placeholder="Policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Policies
                                        </SelectItem>
                                        {(accessPolicyOptions || []).map(
                                            (opt) => (
                                                <SelectItem
                                                    key={opt}
                                                    value={opt}
                                                    className="capitalize"
                                                >
                                                    {opt}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={expiryState}
                                    onValueChange={setExpiryState}
                                >
                                    <SelectTrigger className="h-9 w-full border-border bg-background text-xs font-medium shadow-sm">
                                        <SelectValue placeholder="Expiry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(expiryStateOptions || []).map(
                                            (opt) => (
                                                <SelectItem
                                                    key={opt}
                                                    value={opt}
                                                    className="capitalize"
                                                >
                                                    {opt.replace('_', ' ')}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 shrink-0 text-muted-foreground hover:bg-muted"
                                    onClick={resetFilters}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto p-0">
                            <div className="border-b border-border/50 bg-muted/5 px-4 py-3">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Documents ({documents?.total || 0})
                                </p>
                            </div>

                            {pageData.length === 0 ? (
                                <div className="p-8 text-center text-sm font-medium text-muted-foreground">
                                    No documents found.
                                </div>
                            ) : (
                                pageData.map((doc) => {
                                    const isSelected =
                                        selectedDoc?.id === doc.id;
                                    const expiry = getExpiryStatus(
                                        doc.expiry_date,
                                    );

                                    return (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc)}
                                            className={`flex cursor-pointer items-start gap-4 border-b border-border/50 p-4 transition-colors ${isSelected ? 'border-l-4 border-l-primary bg-primary/5' : 'border-l-4 border-l-transparent bg-background hover:bg-muted/30'}`}
                                        >
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${isSelected ? 'border-primary bg-background text-primary shadow-sm' : 'border-border bg-muted/50 text-muted-foreground'}`}
                                            >
                                                {expiry.label === 'Expired' ? (
                                                    <ShieldAlert className="h-5 w-5" />
                                                ) : (
                                                    <FileText className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <p
                                                    className={`truncate text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}
                                                >
                                                    {doc.title}
                                                </p>
                                                <div className="flex items-center text-xs font-medium">
                                                    <span
                                                        className={`${expiry.color}`}
                                                    >
                                                        {expiry.label}
                                                    </span>
                                                    <span className="mx-2 text-muted-foreground/30">
                                                        •
                                                    </span>
                                                    <span className="truncate text-muted-foreground">
                                                        {getFullName(
                                                            doc.owner_employee,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination */}
                        {documents?.last_page > 1 && (
                            <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/10 p-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {documents.current_page} of{' '}
                                    {documents.last_page}
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 bg-background shadow-none"
                                        disabled={documents.current_page === 1}
                                        onClick={() =>
                                            handlePageChange({
                                                selected:
                                                    documents.current_page - 2,
                                            })
                                        }
                                    >
                                        <ChevronLeft className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 bg-background shadow-none"
                                        disabled={
                                            documents.current_page ===
                                            documents.last_page
                                        }
                                        onClick={() =>
                                            handlePageChange({
                                                selected:
                                                    documents.current_page,
                                            })
                                        }
                                    >
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* RIGHT PANE: Details View */}
                    {selectedDoc ? (
                        <div className="flex flex-col gap-6 md:col-span-7 xl:col-span-8">
                            {/* Top Card: Document Info & Actions */}
                            <Card className="border-border bg-background shadow-sm">
                                <CardContent className="space-y-8 p-6 md:p-8">
                                    {/* Header & Actions */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                                <FileText className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-foreground">
                                                    {selectedDoc.title}
                                                </h2>
                                                <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                    <Badge
                                                        variant="secondary"
                                                        className="border border-border/50 bg-muted px-2 py-0 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase shadow-none"
                                                    >
                                                        {selectedDoc
                                                            .document_type
                                                            ?.name ||
                                                            'Uncategorized'}
                                                    </Badge>
                                                    <span className="opacity-50">
                                                        •
                                                    </span>
                                                    <span className="font-mono text-xs">
                                                        ID: DOC-
                                                        {moment().year()}-
                                                        {selectedDoc.id
                                                            .toString()
                                                            .padStart(3, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            {!isTrashView ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 border-border text-muted-foreground shadow-sm hover:text-foreground"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`${basePath}/${selectedDoc.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 border-border text-muted-foreground shadow-sm hover:text-foreground"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`${basePath}/${selectedDoc.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 border-destructive/20 text-destructive shadow-sm hover:bg-destructive/10"
                                                        onClick={() =>
                                                            setDeleteDialogOpen(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="h-10 border-border text-foreground shadow-sm hover:bg-muted"
                                                        onClick={handleRestore}
                                                    >
                                                        <ArchiveRestore className="mr-2 h-4 w-4" />{' '}
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="h-10 font-bold shadow-sm"
                                                        onClick={() =>
                                                            setForceDeleteDialogOpen(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                        Permanently Delete
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Data Grid */}
                                    <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {/* Owner Block */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Owner
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-border shadow-sm">
                                                    <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                                        {getInitials(
                                                            getFullName(
                                                                selectedDoc.owner_employee,
                                                            ),
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm leading-none font-bold text-foreground">
                                                        {getFullName(
                                                            selectedDoc.owner_employee,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                        Staff No:{' '}
                                                        {
                                                            selectedDoc
                                                                .owner_employee
                                                                ?.staff_number
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates Block */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Issue Date
                                            </p>
                                            <p className="text-sm font-bold text-foreground">
                                                {selectedDoc.issue_date
                                                    ? moment(
                                                          selectedDoc.issue_date,
                                                      ).format('MMM DD, YYYY')
                                                    : 'Not Set'}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Expiry Date
                                            </p>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    {selectedDoc.expiry_date
                                                        ? moment(
                                                              selectedDoc.expiry_date,
                                                          ).format(
                                                              'MMM DD, YYYY',
                                                          )
                                                        : 'Never'}
                                                </p>
                                                <p
                                                    className={`mt-0.5 text-xs font-medium ${getExpiryStatus(selectedDoc.expiry_date).color}`}
                                                >
                                                    {
                                                        getExpiryStatus(
                                                            selectedDoc.expiry_date,
                                                        ).label
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Policy Block */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Access Policy
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="border border-border/50 bg-muted px-3 py-0.5 font-bold text-foreground capitalize shadow-none"
                                            >
                                                {selectedDoc.access_policy}
                                            </Badge>
                                        </div>

                                        {/* Status Block */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Status
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2.5 w-2.5 rounded-full ${getExpiryStatus(selectedDoc.expiry_date).dot}`}
                                                />
                                                <span className="text-sm font-bold text-foreground">
                                                    {getExpiryStatus(
                                                        selectedDoc.expiry_date,
                                                    ).label === 'Expired'
                                                        ? 'Expired'
                                                        : 'Current & Valid'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Description & Audit Card */}
                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Description & Audit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6 md:p-8">
                                    <p className="text-sm leading-relaxed font-medium text-foreground">
                                        {selectedDoc.metadata_json
                                            ?.description ||
                                            'No specific description or metadata has been appended to this document record.'}
                                    </p>

                                    <div className="flex items-center gap-6 pt-2 text-xs font-medium text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />{' '}
                                            Last updated{' '}
                                            {moment(
                                                selectedDoc.updated_at,
                                            ).fromNow()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Lock className="h-3.5 w-3.5" />{' '}
                                            Secure Storage
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/5 md:col-span-7 xl:col-span-8">
                            <div className="max-w-sm space-y-3 px-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-bold text-foreground">
                                    No Document Selected
                                </p>
                                <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                    Select a document from the registry list on
                                    the left to view its details, status, and
                                    metadata.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Soft Delete Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Move to Trash?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to move{' '}
                                <strong>{selectedDoc?.title}</strong> to the
                                trash? You can restore it later from the Trash
                                view.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleSoftDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Move to Trash
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Force Delete Dialog */}
                <AlertDialog
                    open={forceDeleteDialogOpen}
                    onOpenChange={setForceDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Permanently Delete?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to permanently delete{' '}
                                <strong>{selectedDoc?.title}</strong>? This
                                action cannot be undone and will erase all
                                metadata.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleForceDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Permanently Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
