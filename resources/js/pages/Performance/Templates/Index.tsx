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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    FileText,
    Filter,
    FolderKanban,
    Layers3,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

type TemplateRow = {
    id: number;
    name: string;
    scope_type: string | null;
    scope_value: string | null;
    items_count: number;
    scorecards_count: number;
    is_active: boolean;
};

type PaginatedTemplates = {
    data: TemplateRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

function formatLabel(value: string | null | undefined) {
    if (!value) return '—';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function MetricCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    helper: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TemplateIndex() {
    const { templates, filters } = usePage<{
        templates: PaginatedTemplates;
        filters: { search?: string; is_active?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [isActive, setIsActive] = useState(filters.is_active ?? 'all');
    const [templateToDelete, setTemplateToDelete] = useState<TemplateRow | null>(null);

    useEffect(() => {
        const params: Record<string, string> = {};

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (isActive !== 'all') {
            params.is_active = isActive;
        }

        const timer = window.setTimeout(() => {
            router.get('/scorecard-templates', params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search, isActive]);

    const handleDelete = () => {
        if (!templateToDelete) return;

        router.delete(`/scorecard-templates/${templateToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setTemplateToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        const params: Record<string, string | number> = {
            page: selectedItem.selected + 1,
        };

        if (search.trim() !== '') {
            params.search = search.trim();
        }

        if (isActive !== 'all') {
            params.is_active = isActive;
        }

        router.get('/scorecard-templates', params, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const summary = useMemo(() => {
        const rows = templates.data ?? [];

        return {
            activeCount: rows.filter((template) => template.is_active).length,
            totalItems: rows.reduce((sum, template) => sum + Number(template.items_count || 0), 0),
            linkedScorecards: rows.reduce(
                (sum, template) => sum + Number(template.scorecards_count || 0),
                0,
            ),
        };
    }, [templates.data]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Performance', href: '/performance' },
                { title: 'Templates', href: '/scorecard-templates' },
            ]}
        >
            <Head title="Scorecard Templates" />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Performance Management</span>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold tracking-tight">
                                        Scorecard Templates
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        Manage reusable scorecard templates, organize KPI building blocks,
                                        and keep template scope definitions consistent in one workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/scorecard-templates/create">
                                    <Button className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Template
                                    </Button>
                                </Link>

                                <Link href="/performance">
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <FolderKanban className="mr-2 h-4 w-4" />
                                        Back to Performance
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid gap-4 md:grid-cols-3">
                            <MetricCard
                                icon={<Layers3 className="h-4 w-4" />}
                                label="Visible Templates"
                                value={templates.total}
                                helper="Current filtered result set"
                            />
                            <MetricCard
                                icon={<Target className="h-4 w-4" />}
                                label="Active on Page"
                                value={summary.activeCount}
                                helper="Based on the current page"
                            />
                            <MetricCard
                                icon={<FileText className="h-4 w-4" />}
                                label="Template Items"
                                value={summary.totalItems}
                                helper="Current page item count"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Refine Results
                                </CardTitle>
                                <CardDescription>
                                    Search by template name or narrow the list by active state.
                                </CardDescription>
                            </div>

                            <Badge variant="outline" className="w-fit">
                                {templates.total} result{templates.total === 1 ? '' : 's'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={isActive} onValueChange={setIsActive}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="0">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Target className="h-4 w-4" />
                                <span>{summary.linkedScorecards} linked scorecards on this page</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Layers3 className="h-4 w-4" />
                                    Templates Directory
                                </CardTitle>
                                <CardDescription>
                                    Review, edit, and manage reusable scorecard templates.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>
                                    Page {templates.current_page} of {templates.last_page}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {templates.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
                                <Layers3 className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">No templates found</h3>
                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Try adjusting your filters or create a new template.
                                </p>
                                <div className="mt-6">
                                    <Link href="/scorecard-templates/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Template
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Scope</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Linked Scorecards</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {templates.data.map((template) => (
                                            <TableRow key={template.id}>
                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Layers3 className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {template.name}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Template #{template.id}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="space-y-1">
                                                        <Badge variant="outline">
                                                            {formatLabel(template.scope_type)}
                                                        </Badge>
                                                        <p className="text-xs text-muted-foreground">
                                                            {template.scope_value || 'No scope value'}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {template.items_count}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {template.scorecards_count}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <Badge variant={template.is_active ? 'default' : 'outline'}>
                                                        {template.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/scorecard-templates/${template.id}`}>
                                                            <Button variant="outline" size="icon" title="View">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Link href={`/scorecard-templates/${template.id}/edit`}>
                                                            <Button variant="outline" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setTemplateToDelete(template)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {templates.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Showing page {templates.current_page} of {templates.last_page}
                                </span>
                                <ReactPaginate
                                    pageCount={templates.last_page}
                                    forcePage={templates.current_page - 1}
                                    onPageChange={handlePageChange}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={3}
                                    previousLabel="Previous"
                                    nextLabel="Next"
                                    breakLabel="..."
                                    containerClassName="flex items-center gap-1"
                                    pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                                    activeLinkClassName="!border-border !bg-foreground !text-background"
                                    previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    breakClassName="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                                    disabledClassName="pointer-events-none opacity-50"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={!!templateToDelete}
                onOpenChange={(open) => !open && setTemplateToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Template
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete template{' '}
                            <strong>{templateToDelete?.name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
