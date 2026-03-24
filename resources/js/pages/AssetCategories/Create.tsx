import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    Save,
    Database,
    Network,
    Calculator,
    FileText,
    Info,
    HelpCircle,
    AlertTriangle,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';

type CategoryOptions = {
    parents: { id: number; name: string }[];
    depreciation_methods: string[];
};

// Reusable Section Header Component
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="mb-6 flex items-center gap-2 border-b border-border/60 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-foreground">
            <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold tracking-wider text-foreground uppercase">
            {title}
        </h2>
    </div>
);

export default function AssetCategoryCreate() {
    const { options } = usePage<{ options: CategoryOptions }>().props;

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        parent_id: '',
        description: '',
        depreciation_method: '',
        useful_life_years: '',
        depreciation_rate: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/asset-categories', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Categories', href: '/asset-categories' },
                { title: 'New Category', href: '#' },
            ]}
        >
            <Head title="Create New Asset Category" />

            <div className="w-full p-6 lg:p-10">
                {/* Top Navigation */}
                <Link
                    href="/asset-categories"
                    className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Categories
                </Link>

                {/* Page Title */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                        Create New Asset Category
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Define classification and depreciation rules for company
                        assets.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-10 lg:grid-cols-12"
                >
                    {/* Left Column: Form Fields */}
                    <div className="space-y-12 lg:col-span-8">
                        {/* Basic Identity Section */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                            <SectionHeader
                                icon={Database}
                                title="Basic Identity"
                            />
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">
                                        Category Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g. IT Equipment"
                                        className={
                                            errors.name
                                                ? 'border-destructive focus-visible:ring-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">
                                        Category Code
                                    </label>
                                    <Input
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="IT-001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hierarchy Section */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                            <SectionHeader icon={Network} title="Hierarchy" />
                            <div className="space-y-2">
                                <label className="text-sm font-bold">
                                    Parent Category
                                </label>
                                <Select
                                    value={data.parent_id}
                                    onValueChange={(v) =>
                                        setData('parent_id', v)
                                    }
                                >
                                    <SelectTrigger className="w-full sm:w-1/2">
                                        <SelectValue placeholder="None (Root Category)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None (Root Category)
                                        </SelectItem>
                                        {options.parents.map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={String(p.id)}
                                            >
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Depreciation Logic Section */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                            <SectionHeader
                                icon={Calculator}
                                title="Depreciation Logic"
                            />
                            <div className="grid gap-6 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">
                                        Method
                                    </label>
                                    <Select
                                        value={data.depreciation_method}
                                        onValueChange={(v) =>
                                            setData('depreciation_method', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {options.depreciation_methods.map(
                                                (m) => (
                                                    <SelectItem
                                                        key={m}
                                                        value={m}
                                                    >
                                                        {m
                                                            .replace(/_/g, ' ')
                                                            .toUpperCase()}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">
                                        Useful Life (Years)
                                    </label>
                                    <Input
                                        type="number"
                                        value={data.useful_life_years}
                                        onChange={(e) =>
                                            setData(
                                                'useful_life_years',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">
                                        Rate (%)
                                    </label>
                                    <Input
                                        type="number"
                                        value={data.depreciation_rate}
                                        onChange={(e) =>
                                            setData(
                                                'depreciation_rate',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="20%"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                            <SectionHeader
                                icon={FileText}
                                title="Description"
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-bold">
                                    Internal Notes
                                </label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Provide details about what assets belong in this category..."
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Guidance & Actions */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Guidance Sidebar */}
                        <div className="rounded-xl border border-border bg-muted/30 p-8 shadow-sm">
                            <h3 className="mb-6 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                Guidance
                            </h3>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="rounded bg-primary/10 p-1.5 text-primary">
                                            <Info className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">
                                            Hierarchy & Inheritance
                                        </h4>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            Parent categories allow
                                            sub-categories to inherit
                                            depreciation rules and tax
                                            treatments.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="rounded bg-orange-500/10 p-1.5 text-orange-600">
                                            <HelpCircle className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">
                                            Depreciation Methods
                                        </h4>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            Choose{' '}
                                            <span className="font-semibold text-foreground">
                                                Straight Line
                                            </span>{' '}
                                            for consistent expense reports over
                                            time.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="rounded bg-amber-500/10 p-1.5 text-amber-600">
                                            <AlertTriangle className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">
                                            Valuation Impact
                                        </h4>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            Useful life directly impacts your
                                            balance sheet. Shorter cycles
                                            increase monthly expenses.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Need Help Box */}
                            <div className="mt-10 rounded-lg border border-orange-500/10 bg-orange-500/5 p-5">
                                <h4 className="text-sm font-bold text-orange-900">
                                    Need help?
                                </h4>
                                <p className="mt-1 text-xs leading-relaxed text-orange-800/80">
                                    Refer to our asset management documentation
                                    for tax compliance guidelines.
                                </p>
                                <a
                                    href="#"
                                    className="mt-3 inline-block text-xs font-bold text-orange-700 underline decoration-orange-700/30 hover:decoration-orange-700"
                                >
                                    View Documentation
                                </a>
                            </div>
                        </div>

                        {/* Sticky Action Footer-like behavior for desktop */}
                        <div className="flex items-center gap-3 lg:flex-col lg:items-stretch">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 flex-1 bg-orange-600 font-bold text-white transition-all hover:bg-orange-700"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Category'}
                            </Button>
                            <Link href="/asset-categories" className="flex-1">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-12 w-full border-border font-bold hover:bg-muted"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                        <p className="text-center text-[10px] text-muted-foreground italic">
                            All changes are drafted locally until saved.
                        </p>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
