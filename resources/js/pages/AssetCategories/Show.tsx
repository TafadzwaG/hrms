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
    ArrowLeft,
    Calculator,
    CheckCircle2,
    ArrowRight,
    Layers,
    Network,
    Package,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

type AssetRow = {
    id: number;
    name: string;
    asset_tag: string;
    status: string;
    condition: string;
    location: string | null;
    purchase_price: string | null;
    currency: string | null;
    links: { show: string };
};

type CategoryDetail = {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    depreciation_method: string | null;
    useful_life_years: number | null;
    depreciation_rate: string | null;
    parent: { id: number; name: string } | null;
    children: { id: number; name: string; code: string | null }[];
    assets_count: number;
    recent_assets: AssetRow[];
};

const statusClass: Record<string, string> = {
    available: 'bg-zinc-900 text-white border-zinc-900',
    assigned: 'bg-zinc-200 text-zinc-800 border-zinc-300',
    in_maintenance: 'bg-zinc-300 text-zinc-700 border-zinc-400',
    retired: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    disposed: 'bg-white text-zinc-400 border-zinc-200',
    lost: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    damaged: 'bg-zinc-200 text-zinc-600 border-zinc-300',
};

const conditionClass: Record<string, string> = {
    new: 'bg-zinc-900 text-white border-zinc-900',
    good: 'bg-zinc-200 text-zinc-800 border-zinc-300',
    fair: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    poor: 'bg-zinc-100 text-zinc-400 border-zinc-200',
    non_functional: 'bg-white text-zinc-400 border-zinc-200',
};

function StatusBadge({ value, map }: { value: string; map: Record<string, string> }) {
    const cls = map[value] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200';
    return (
        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${cls}`}>
            {value.replace(/_/g, ' ')}
        </span>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground w-40 shrink-0">{label}</span>
            <span className="text-sm text-foreground text-right">{value ?? <span className="text-muted-foreground">—</span>}</span>
        </div>
    );
}

export default function AssetCategoryShow() {
    const { category } = usePage<{ category: CategoryDetail }>().props;
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/asset-categories/${category.id}`, {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Categories', href: '/asset-categories' },
                { title: category.name, href: '#' },
            ]}
        >
            <Head title={`Category – ${category.name}`} />

            <div className="w-full space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/asset-categories">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {category.name}
                                </h1>
                                {category.code && (
                                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                        {category.code}
                                    </code>
                                )}
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {category.parent ? `Sub-category of ${category.parent.name}` : 'Top-level category'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/asset-categories/${category.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                            onClick={() => setDeleteOpen(true)}
                            disabled={category.assets_count > 0 || category.children.length > 0}
                        >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Assets', value: category.assets_count, icon: Package },
                        { label: 'Sub-Categories', value: category.children.length, icon: Layers },
                        {
                            label: 'Depreciation Method',
                            value: category.depreciation_method?.replace(/_/g, ' ') ?? 'Not set',
                            icon: Calculator,
                        },
                        {
                            label: 'Useful Life',
                            value: category.useful_life_years ? `${category.useful_life_years} yrs` : 'Not set',
                            icon: CheckCircle2,
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold capitalize">{stat.value}</p>
                            </div>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Details */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Category Details */}
                        <div className="rounded-lg border border-border bg-background p-5">
                            <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                <Layers className="h-3.5 w-3.5" /> Category Details
                            </h2>
                            <InfoRow label="Name" value={category.name} />
                            <InfoRow label="Code" value={category.code} />
                            <InfoRow
                                label="Parent"
                                value={
                                    category.parent ? (
                                        <Link
                                            href={`/asset-categories/${category.parent.id}`}
                                            className="font-medium underline underline-offset-2 hover:text-foreground/70"
                                        >
                                            {category.parent.name}
                                        </Link>
                                    ) : 'None'
                                }
                            />
                            {category.description && (
                                <div className="pt-3">
                                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">Description</p>
                                    <p className="text-sm text-foreground">{category.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Depreciation */}
                        <div className="rounded-lg border border-border bg-background p-5">
                            <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                <Calculator className="h-3.5 w-3.5" /> Depreciation Settings
                            </h2>
                            <InfoRow
                                label="Method"
                                value={category.depreciation_method?.replace(/_/g, ' ')}
                            />
                            <InfoRow
                                label="Useful Life"
                                value={category.useful_life_years ? `${category.useful_life_years} years` : null}
                            />
                            <InfoRow
                                label="Rate"
                                value={category.depreciation_rate ? `${category.depreciation_rate}%` : null}
                            />
                        </div>

                        {/* Sub-categories */}
                        {category.children.length > 0 && (
                            <div className="rounded-lg border border-border bg-background p-5">
                                <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                    <Network className="h-3.5 w-3.5" /> Sub-Categories ({category.children.length})
                                </h2>
                                <div className="space-y-2">
                                    {category.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/asset-categories/${child.id}`}
                                            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/40 transition-colors"
                                        >
                                            <span className="font-medium">{child.name}</span>
                                            {child.code && (
                                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                    {child.code}
                                                </code>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Assets Table */}
                    <div className="lg:col-span-8">
                        <div className="rounded-lg border border-border bg-background p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                    <Package className="h-3.5 w-3.5" /> Assets in this Category
                                    <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                                        {category.assets_count}
                                    </span>
                                </h2>
                                <Link href={`/assets?category_id=${category.id}`}>
                                    <Button variant="outline" size="sm" className="text-xs">
                                        View All
                                        <ArrowRight className="ml-1.5 h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>

                            {category.recent_assets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">No assets in this category yet.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="py-3 font-semibold text-foreground">Asset</TableHead>
                                            <TableHead className="font-semibold text-foreground">Tag</TableHead>
                                            <TableHead className="font-semibold text-foreground">Status</TableHead>
                                            <TableHead className="font-semibold text-foreground">Condition</TableHead>
                                            <TableHead className="font-semibold text-foreground">Location</TableHead>
                                            <TableHead className="text-right font-semibold text-foreground">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {category.recent_assets.map((asset) => (
                                            <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium text-foreground">
                                                    <Link
                                                        href={asset.links.show}
                                                        className="hover:underline underline-offset-2"
                                                    >
                                                        {asset.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                        {asset.asset_tag}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge value={asset.status} map={statusClass} />
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge value={asset.condition} map={conditionClass} />
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {asset.location ?? '—'}
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-medium">
                                                    {asset.purchase_price
                                                        ? `${asset.currency ?? ''} ${parseFloat(asset.purchase_price).toLocaleString()}`
                                                        : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
