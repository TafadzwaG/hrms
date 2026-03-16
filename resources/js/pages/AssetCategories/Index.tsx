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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Eye, FolderTree, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryRow | null>(null);

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

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Asset Categories</h1>
                        <p className="text-sm text-muted-foreground">
                            Organize assets into categories for better management.
                        </p>
                    </div>
                    <Link href="/asset-categories/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Category
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories..."
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                            {categories.total} categor{categories.total !== 1 ? 'ies' : 'y'} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categories.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FolderTree className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-semibold">No categories found</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Create your first asset category.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Parent</TableHead>
                                            <TableHead>Assets Count</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.data.map((cat) => (
                                            <TableRow key={cat.id}>
                                                <TableCell className="font-medium">{cat.name}</TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {cat.code ?? '—'}
                                                </TableCell>
                                                <TableCell>{cat.parent?.name ?? '—'}</TableCell>
                                                <TableCell>{cat.assets_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/asset-categories/${cat.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setCategoryToDelete(cat)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pagination */}
                        {categories.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <span className="text-xs font-bold text-muted-foreground">
                                    Page {categories.current_page} of {categories.last_page}
                                </span>
                                <ReactPaginate
                                    pageCount={categories.last_page}
                                    forcePage={categories.current_page - 1}
                                    onPageChange={handlePageChange}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={3}
                                    previousLabel="Previous"
                                    nextLabel="Next"
                                    breakLabel="..."
                                    containerClassName="flex items-center gap-1"
                                    pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent font-bold hover:bg-muted text-sm shadow-none text-muted-foreground transition-colors"
                                    activeLinkClassName="!bg-foreground text-background font-bold border-foreground hover:!bg-foreground/90 rounded-md"
                                    previousLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                    nextLinkClassName="inline-flex h-9 px-4 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-sm font-bold text-foreground transition-colors"
                                    breakClassName="flex h-9 w-9 items-center justify-center text-sm font-bold text-muted-foreground"
                                    disabledClassName="opacity-50 pointer-events-none"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={!!categoryToDelete}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            {categoryToDelete && categoryToDelete.assets_count > 0 ? (
                                <>
                                    Cannot delete <strong>{categoryToDelete.name}</strong> because it
                                    has {categoryToDelete.assets_count} asset
                                    {categoryToDelete.assets_count !== 1 ? 's' : ''} associated with it.
                                    Please reassign or remove those assets first.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete{' '}
                                    <strong>{categoryToDelete?.name}</strong>? This action cannot be
                                    undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {categoryToDelete && categoryToDelete.assets_count === 0 && (
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
