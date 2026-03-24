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
    ArrowRight,
    Building2,
    ExternalLink,
    Mail,
    Package,
    Pencil,
    Phone,
    Store,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

type AssetRow = {
    id: number;
    name: string;
    asset_tag: string;
    status: string;
    condition: string;
    category: string | null;
    location: string | null;
    purchase_price: string | null;
    currency: string | null;
    links: { show: string };
};

type VendorDetail = {
    id: number;
    name: string;
    code: string | null;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    website: string | null;
    notes: string | null;
    is_active: boolean;
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
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground w-36 shrink-0">{label}</span>
            <span className="text-sm text-foreground text-right break-all">{value ?? <span className="text-muted-foreground">—</span>}</span>
        </div>
    );
}

export default function AssetVendorShow() {
    const { vendor } = usePage<{ vendor: VendorDetail }>().props;
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/asset-vendors/${vendor.id}`, {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Vendors', href: '/asset-vendors' },
                { title: vendor.name, href: '#' },
            ]}
        >
            <Head title={`Vendor – ${vendor.name}`} />

            <div className="w-full space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/asset-vendors">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {vendor.name}
                                </h1>
                                {vendor.code && (
                                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                        {vendor.code}
                                    </code>
                                )}
                                <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${vendor.is_active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                    {vendor.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {vendor.assets_count} asset{vendor.assets_count !== 1 ? 's' : ''} supplied
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/asset-vendors/${vendor.id}/edit`}>
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
                            disabled={vendor.assets_count > 0}
                        >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Assets', value: vendor.assets_count, icon: Package },
                        { label: 'Status', value: vendor.is_active ? 'Active' : 'Inactive', icon: Store },
                        { label: 'Contact', value: vendor.contact_person ?? '—', icon: User },
                        { label: 'Email', value: vendor.email ?? '—', icon: Mail },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-lg font-semibold truncate">{stat.value}</p>
                            </div>
                            <stat.icon className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Details */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="rounded-lg border border-border bg-background p-5">
                            <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                <Store className="h-3.5 w-3.5" /> Vendor Information
                            </h2>
                            <InfoRow label="Name" value={vendor.name} />
                            <InfoRow label="Code" value={vendor.code} />
                            <InfoRow
                                label="Contact"
                                value={vendor.contact_person ? (
                                    <span className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        {vendor.contact_person}
                                    </span>
                                ) : null}
                            />
                            <InfoRow
                                label="Email"
                                value={vendor.email ? (
                                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-1 hover:underline underline-offset-2">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        {vendor.email}
                                    </a>
                                ) : null}
                            />
                            <InfoRow
                                label="Phone"
                                value={vendor.phone ? (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                        {vendor.phone}
                                    </span>
                                ) : null}
                            />
                            <InfoRow
                                label="Website"
                                value={vendor.website ? (
                                    <a
                                        href={vendor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:underline underline-offset-2"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                        {vendor.website}
                                    </a>
                                ) : null}
                            />
                        </div>

                        {(vendor.address || vendor.notes) && (
                            <div className="rounded-lg border border-border bg-background p-5">
                                <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                    <Building2 className="h-3.5 w-3.5" /> Additional Details
                                </h2>
                                {vendor.address && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">Address</p>
                                        <p className="text-sm text-foreground whitespace-pre-line">{vendor.address}</p>
                                    </div>
                                )}
                                {vendor.notes && (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">Notes</p>
                                        <p className="text-sm text-foreground whitespace-pre-line">{vendor.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Assets Table */}
                    <div className="lg:col-span-8">
                        <div className="rounded-lg border border-border bg-background p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                    <Package className="h-3.5 w-3.5" /> Supplied Assets
                                    <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                                        {vendor.assets_count}
                                    </span>
                                </h2>
                                <Link href={`/assets?vendor_id=${vendor.id}`}>
                                    <Button variant="outline" size="sm" className="text-xs">
                                        View All
                                        <ArrowRight className="ml-1.5 h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>

                            {vendor.recent_assets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">No assets from this vendor yet.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="py-3 font-semibold text-foreground">Asset</TableHead>
                                            <TableHead className="font-semibold text-foreground">Tag</TableHead>
                                            <TableHead className="font-semibold text-foreground">Category</TableHead>
                                            <TableHead className="font-semibold text-foreground">Status</TableHead>
                                            <TableHead className="font-semibold text-foreground">Condition</TableHead>
                                            <TableHead className="text-right font-semibold text-foreground">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vendor.recent_assets.map((asset) => (
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
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {asset.category ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge value={asset.status} map={statusClass} />
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge value={asset.condition} map={conditionClass} />
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
                        <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{vendor.name}"? This cannot be undone.
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
