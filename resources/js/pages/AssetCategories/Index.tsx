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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Package,
    Layers,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type CategoryRow = {
    id: number;
    name: string;
    code: string | null;
    parent: { id: number; name: string } | null;
    assets_count: number;
};

type PaginatedCategories = {
    data: CategoryRow[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

export default function AssetCategoryIndex() {
    const { categories, filters } = usePage<{
        categories: PaginatedCategories;
        filters: { search?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryToDelete, setCategoryToDelete] =
        useState<CategoryRow | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/asset-categories',
                { search },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search]);

    const handleDelete = () => {
        if (!categoryToDelete) return;
        router.delete(`/asset-categories/${categoryToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setCategoryToDelete(null),
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        router.get(
            '/asset-categories',
            { page: selectedItem.selected + 1, search },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Categories', href: '/asset-categories' },
            ]}
        >
            <Head title="Asset Categories" />

            <div className="w-full space-y-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Asset Categories
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Organize assets into categories for better
                            management and reporting.
                        </p>
                    </div>
                    <Link href="/asset-categories/create">
                        <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black">
                            <Plus className="mr-2 h-4 w-4" />
                            New Category
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid - Monochromatic Boxes */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Total Categories',
                            value: categories.total,
                            icon: Layers,
                        },
                        {
                            label: 'Parent Categories',
                            value: categories.data.filter((c) => !c.parent)
                                .length,
                            icon: Package,
                        },
                        {
                            label: 'Sub-Categories',
                            value: categories.data.filter((c) => c.parent)
                                .length,
                            icon: Layers,
                        },
                        {
                            label: 'Empty Categories',
                            value: categories.data.filter(
                                (c) => c.assets_count === 0,
                            ).length,
                            icon: AlertCircle,
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Description, category tag, code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 border-border pl-10 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="h-10 w-[160px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="parent">
                                    Parent Only
                                </SelectItem>
                                <SelectItem value="sub">
                                    Sub-Categories
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => setSearch('')}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div
                    className="rounded-lg border border-border bg-background"
                    style={{
                        padding: '20px',
                    }}
                >
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[300px] py-4 font-semibold text-foreground">
                                    Name
                                </TableHead>
                                <TableHead className="font-semibold text-foreground">
                                    Code
                                </TableHead>
                                <TableHead className="font-semibold text-foreground">
                                    Parent
                                </TableHead>
                                <TableHead className="text-center font-semibold text-foreground">
                                    Assets Count
                                </TableHead>
                                <TableHead className="text-right font-semibold text-foreground">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-48 text-center text-muted-foreground"
                                    >
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.data.map((cat) => (
                                    <TableRow
                                        key={cat.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="py-4 font-bold text-foreground">
                                            {cat.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                {cat.code ?? '—'}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {cat.parent?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-center font-medium">
                                            {cat.assets_count}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/asset-categories/${cat.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/asset-categories/${cat.id}/edit`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        setCategoryToDelete(cat)
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

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-between border-t border-border px-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">1-10</span> of{' '}
                            <span className="font-medium text-foreground">
                                {categories.total}
                            </span>{' '}
                            categories
                        </p>
                        <ReactPaginate
                            pageCount={categories.last_page}
                            forcePage={categories.current_page - 1}
                            onPageChange={handlePageChange}
                            containerClassName="flex items-center gap-1"
                            pageLinkClassName="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            activeLinkClassName="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90"
                            previousLabel={
                                <span className="mr-1 flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted">
                                    Previous
                                </span>
                            }
                            nextLabel={
                                <span className="ml-1 flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted">
                                    Next
                                </span>
                            }
                            breakLabel="..."
                            disabledClassName="opacity-40 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={!!categoryToDelete}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            {categoryToDelete?.assets_count
                                ? `This category contains ${categoryToDelete.assets_count} assets and cannot be deleted.`
                                : `Are you sure you want to delete "${categoryToDelete?.name}"? This cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">
                            Cancel
                        </AlertDialogCancel>
                        {categoryToDelete &&
                            categoryToDelete.assets_count === 0 && (
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
