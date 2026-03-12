import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Eye,
    GitBranch,
    Info,
    Layers3,
    Lightbulb,
    Maximize,
    Network,
    Plus,
    Save,
    Search,
    ZoomIn,
    ZoomOut,
    History,
    Activity,
    LifeBuoy,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type ParentOption = { id: number; name: string; type: string };

export default function OrgUnitCreate() {
    const { parents, types } = usePage().props as any as {
        parents: ParentOption[];
        types: string[];
    };

    const PATHS = useMemo(
        () => ({
            index: `${API}/org-units`,
            store: `${API}/org-units`,
            create: `${API}/org-units/create`,
        }),
        [],
    );

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        type: 'Department',
        parent_id: '' as string | number | '',
        code: '',
        cost_center: '',
        effective_from: '',
        effective_to: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        post(PATHS.store, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getParentLabel = (id: string | number) => {
        const parent = parents.find((p) => String(p.id) === String(id));
        return parent
            ? `${parent.name} (${parent.type})`
            : 'Select parent (optional)';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Organizations', href: PATHS.index },
                { title: 'Create New Unit', href: PATHS.create },
            ]}
        >
            <Head title="Create Org Unit" />

            <div className="min-h-screen space-y-6 bg-muted/20 p-4 md:p-8">
                {/* Top Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Create New Org Unit
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Configure and visualize your organizational
                            architecture.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(PATHS.index)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="org-unit-form"
                            disabled={processing || isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Unit
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Form Details */}
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <Card className="flex-1 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Layers3 className="h-5 w-5 text-muted-foreground" />
                                    Unit Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form
                                    id="org-unit-form"
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="flex items-center gap-2"
                                        >
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                            Unit Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="e.g. IT Operations"
                                            className={
                                                errors.name
                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                    : ''
                                            }
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm font-medium text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">
                                                Type{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.type}
                                                onValueChange={(value) =>
                                                    setData('type', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.type
                                                            ? 'border-destructive focus-visible:ring-destructive'
                                                            : ''
                                                    }
                                                >
                                                    <SelectValue>
                                                        {data.type ||
                                                            'Select type'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {types.map((t) => (
                                                        <SelectItem
                                                            key={t}
                                                            value={t}
                                                        >
                                                            {t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.type && (
                                                <p className="text-sm font-medium text-destructive">
                                                    {errors.type}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="code">
                                                Unit Code
                                            </Label>
                                            <Input
                                                id="code"
                                                value={data.code}
                                                onChange={(e) =>
                                                    setData(
                                                        'code',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="IT-OPS-01"
                                                className={
                                                    errors.code
                                                        ? 'border-destructive focus-visible:ring-destructive'
                                                        : ''
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="parent_id"
                                            className="flex items-center gap-2"
                                        >
                                            <Network className="h-4 w-4 text-muted-foreground" />
                                            Parent Unit{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={
                                                data.parent_id === ''
                                                    ? 'NONE'
                                                    : String(data.parent_id)
                                            }
                                            onValueChange={(value) =>
                                                setData(
                                                    'parent_id',
                                                    value === 'NONE'
                                                        ? ''
                                                        : Number(value),
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.parent_id
                                                        ? 'border-destructive focus-visible:ring-destructive'
                                                        : ''
                                                }
                                            >
                                                <SelectValue>
                                                    {data.parent_id
                                                        ? getParentLabel(
                                                              data.parent_id,
                                                          )
                                                        : 'Technology Services (SBU)'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">
                                                    No Parent (Top Level)
                                                </SelectItem>
                                                {parents.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={String(p.id)}
                                                    >
                                                        {p.name} ({p.type})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground italic">
                                            This placement will be reflected in
                                            the real-time hierarchy on the
                                            right.
                                        </p>
                                        {errors.parent_id && (
                                            <p className="text-sm font-medium text-destructive">
                                                {errors.parent_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cost_center">
                                            Cost Center
                                        </Label>
                                        <Input
                                            id="cost_center"
                                            value={data.cost_center}
                                            onChange={(e) =>
                                                setData(
                                                    'cost_center',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="CC-5001"
                                            className={
                                                errors.cost_center
                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                    : ''
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="effective_from">
                                                Effective From
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="effective_from"
                                                    type="date"
                                                    value={data.effective_from}
                                                    onChange={(e) =>
                                                        setData(
                                                            'effective_from',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`pl-9 ${errors.effective_from ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="effective_to">
                                                Effective To
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="effective_to"
                                                    type="date"
                                                    value={data.effective_to}
                                                    onChange={(e) =>
                                                        setData(
                                                            'effective_to',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`pl-9 ${errors.effective_to ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Architect's Tip */}
                        <div className="flex gap-3 rounded-lg border bg-muted/50 p-4">
                            <Lightbulb className="h-5 w-5 shrink-0 text-primary" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-foreground">
                                    Architect's Tip
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Placing this unit under{' '}
                                    <span className="font-semibold text-foreground">
                                        Technology Services
                                    </span>{' '}
                                    will automatically inherit regional
                                    compliance policies for the EMEA region.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hierarchy Preview */}
                    <div className="flex flex-col gap-6 lg:col-span-8">
                        <Card className="flex flex-1 flex-col overflow-hidden shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b py-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Network className="h-5 w-5 text-muted-foreground" />
                                    Hierarchy Preview
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="ml-2 h-8 w-8"
                                    >
                                        <Maximize className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Diagram Area with Dot Pattern Background */}
                            <CardContent className="relative min-h-[500px] flex-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-0 dark:bg-[radial-gradient(#374151_1px,transparent_1px)]">
                                {/* Visual Tree */}
                                <div className="absolute inset-0 flex flex-col items-center overflow-auto pt-12">
                                    {/* Root Node */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative z-10 flex w-64 items-center justify-center gap-3 rounded-md border bg-primary px-6 py-3 text-primary-foreground shadow-sm">
                                            <Building2 className="h-5 w-5" />
                                            <div className="text-left">
                                                <div className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                                                    Company
                                                </div>
                                                <div className="font-semibold">
                                                    Global Corp
                                                </div>
                                            </div>
                                        </div>
                                        {/* Vertical Line */}
                                        <div className="h-8 w-px bg-border"></div>
                                    </div>

                                    {/* Level 2 Container */}
                                    <div className="relative flex w-full max-w-2xl justify-center gap-24">
                                        {/* Horizontal Connection Line */}
                                        <div className="absolute top-0 right-[25%] left-[25%] h-px bg-border"></div>

                                        {/* SBU Node 1 */}
                                        <div className="relative flex flex-col items-center">
                                            <div className="absolute top-0 h-8 w-px bg-border"></div>
                                            <div className="relative z-10 mt-8 flex w-64 items-center gap-3 rounded-md border-2 border-primary bg-card px-6 py-3 shadow-sm">
                                                <GitBranch className="h-5 w-5 text-primary" />
                                                <div className="text-left">
                                                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                        SBU
                                                    </div>
                                                    <div className="font-semibold text-foreground">
                                                        Technology Services
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Level 3 Children (Under Technology Services) */}
                                            <div className="relative mt-6 ml-12 flex flex-col items-start border-l border-border pb-4">
                                                {/* Child 1 */}
                                                <div className="relative flex h-14 items-center">
                                                    <div className="h-px w-8 bg-border"></div>
                                                    <div className="flex w-56 items-center gap-2 rounded-md border bg-background px-4 py-2 shadow-sm">
                                                        <Layers3 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">
                                                            Software Eng.
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Child 2 (NEW ITEM) */}
                                                <div className="relative flex h-14 items-center">
                                                    <div className="h-px w-8 border-2 border-t border-dashed border-primary"></div>
                                                    <div className="flex w-56 items-center gap-2 rounded-md border-2 border-dashed border-primary bg-primary/5 px-4 py-2 shadow-sm">
                                                        <Plus className="h-4 w-4 text-primary" />
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-primary italic">
                                                                New:{' '}
                                                                {data.type ||
                                                                    'Unit'}
                                                            </span>
                                                            <span className="max-w-[150px] truncate text-sm font-bold text-primary">
                                                                {data.name ||
                                                                    'Pending Name...'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Child 3 */}
                                                <div className="relative flex h-14 items-center">
                                                    <div className="h-px w-8 bg-border"></div>
                                                    <div className="flex w-56 items-center gap-2 rounded-md border bg-background px-4 py-2 shadow-sm">
                                                        <Layers3 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">
                                                            Cloud Infra
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SBU Node 2 (Ghosted) */}
                                        <div className="relative flex flex-col items-center opacity-50">
                                            <div className="absolute top-0 h-8 w-px bg-border"></div>
                                            <div className="relative z-10 mt-8 flex w-64 items-center gap-3 rounded-md border border-dashed bg-background px-6 py-3">
                                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                                <div className="text-left">
                                                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                        SBU
                                                    </div>
                                                    <div className="font-semibold text-muted-foreground">
                                                        Financial Services
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Right Metrics */}
                                <div className="absolute right-6 bottom-6 flex gap-4 rounded-md border bg-background/80 p-3 shadow-sm backdrop-blur-sm">
                                    <div className="px-2 text-center">
                                        <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Total Units
                                        </div>
                                        <div className="text-xl font-bold">
                                            42
                                        </div>
                                    </div>
                                    <div className="w-px bg-border"></div>
                                    <div className="px-2 text-center">
                                        <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            Max Depth
                                        </div>
                                        <div className="text-xl font-bold">
                                            4
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Bottom Banner */}
                            <div className="flex items-center justify-between border-t bg-muted/30 p-4">
                                <div className="flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-primary" />
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            Interactive Preview Active
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            Visualizing hierarchy for the{' '}
                                            <strong className="text-foreground">
                                                Technology Services
                                            </strong>{' '}
                                            cluster.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="text-primary hover:bg-primary/10 hover:text-primary"
                                >
                                    Download Map
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Bottom Status Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardContent className="flex gap-4 p-4">
                            <History className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                            <div>
                                <h4 className="mb-1 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Recent Updates
                                </h4>
                                <p className="text-sm text-foreground">
                                    Architect "m_smith" rearranged 'Marketing'
                                    sub-units 2 hours ago.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex gap-4 p-4">
                            <Activity className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                            <div>
                                <h4 className="mb-1 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    System Status
                                </h4>
                                <p className="text-sm text-foreground">
                                    Global Org Chart cache updated. Latency:
                                    45ms.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex gap-4 p-4">
                            <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                            <div>
                                <h4 className="mb-1 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Arch Support
                                </h4>
                                <p className="text-sm text-foreground">
                                    Need to bulk import? Use our{' '}
                                    <span className="cursor-pointer text-primary hover:underline">
                                        CSV Architect Tool
                                    </span>
                                    .
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
