import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRightLeft,
    Banknote,
    Briefcase,
    Building2,
    CheckCircle2,
    Download,
    Edit,
    Filter,
    Pencil,
    Plus,
    PlusCircle,
    Search,
    Shield,
    Trash2,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

// --- Types ---
type EmployeeOption = {
    id: number;
    staff_number: string;
    full_name: string;
    department: string | null;
    position: string | null;
};
type PayCodeOption = {
    id: number;
    code: string;
    description: string;
    type: string;
    category: string;
    recurring: boolean;
};
type SettlementRule = {
    id: number;
    currency: string;
    allocation_method: string;
    amount: number | null;
    percentage: number | null;
    priority: number;
    active: boolean;
    notes: string | null;
};
type RecurringItem = {
    id: number;
    employee_id: number;
    employee_payroll_profile_id: number;
    pay_code: {
        id: number;
        code: string;
        description: string;
        type: string;
    } | null;
    input_mode: string;
    amount: number | null;
    quantity: number | null;
    rate: number | null;
    effective_from: string | null;
    effective_to: string | null;
    is_active: boolean;
    reference: string | null;
    notes: string | null;
};
type ProfileRow = {
    id: number;
    employee_id: number;
    employee: EmployeeOption | null;
    pay_frequency: string;
    currency: string;
    basic_salary: number;
    hourly_rate: number | null;
    overtime_multiplier: number;
    bank_name: string | null;
    bank_branch: string | null;
    bank_account_name: string | null;
    bank_account_number: string | null;
    bank_account_type: string | null;
    tax_number: string | null;
    tax_table: string | null;
    pension_number: string | null;
    pension_percent: number;
    nssa_number: string | null;
    nssa_percent: number;
    nec_number: string | null;
    nec_percent: number;
    union_number: string | null;
    union_percent: number;
    cost_centre: string | null;
    employment_status: string;
    tax_enabled: boolean;
    active: boolean;
    effective_from: string | null;
    effective_to: string | null;
    notes: string | null;
    settlement_rules: SettlementRule[];
    recurring_items: RecurringItem[];
};
type PaginatedProfiles = {
    data: ProfileRow[];
    current_page: number;
    last_page: number;
    total: number;
};
type CurrencyOption = { code: string; label: string };

type ProfileFormData = {
    employee_id: string;
    pay_frequency: string;
    currency: string;
    basic_salary: string | number;
    hourly_rate: string | number;
    overtime_multiplier: string | number;
    bank_name: string;
    bank_branch: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_account_type: string;
    tax_number: string;
    tax_table: string;
    pension_number: string;
    pension_percent: string | number;
    nssa_number: string;
    nssa_percent: string | number;
    nec_number: string;
    nec_percent: string | number;
    union_number: string;
    union_percent: string | number;
    cost_centre: string;
    employment_status: string;
    tax_enabled: boolean;
    active: boolean;
    effective_from: string;
    effective_to: string;
    notes: string;
};
type RecurringFormData = {
    employee_id: string;
    employee_payroll_profile_id: string;
    pay_code_id: string;
    input_mode: string;
    amount: string | number;
    quantity: string | number;
    rate: string | number;
    effective_from: string;
    effective_to: string;
    is_active: boolean;
    reference: string;
    notes: string;
};
type SettlementFormData = {
    currency: string;
    allocation_method: string;
    amount: string | number;
    percentage: string | number;
    priority: string | number;
    active: boolean;
    notes: string;
};

// --- Main Component ---
export default function PayrollProfilesIndex() {
    const {
        profiles,
        filters,
        stats,
        employees,
        payCodes,
        defaults,
        settlementDefaults,
        settlementAllocationMethods,
        currencies,
        frequencies,
        statuses,
    } = usePage<{
        profiles: PaginatedProfiles;
        filters: { search?: string; status?: string };
        stats: {
            total: number;
            active: number;
            employees_covered: number;
            recurring_items: number;
        };
        employees: EmployeeOption[];
        payCodes: PayCodeOption[];
        defaults: ProfileFormData;
        settlementDefaults: SettlementFormData;
        settlementAllocationMethods: string[];
        currencies: CurrencyOption[];
        frequencies: string[];
        statuses: string[];
    }>().props;

    const { can } = useAuthorization();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');

    // Dialog States
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
    const [settlementDialogOpen, setSettlementDialogOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<ProfileRow | null>(
        null,
    );
    const [recurringContext, setRecurringContext] = useState<{
        profile: ProfileRow;
        item: RecurringItem | null;
    } | null>(null);
    const [settlementContext, setSettlementContext] = useState<{
        profile: ProfileRow;
        rule: SettlementRule | null;
    } | null>(null);

    const profileForm = useForm<ProfileFormData>({ ...defaults });
    const recurringForm = useForm<RecurringFormData>({
        employee_id: '',
        employee_payroll_profile_id: '',
        pay_code_id: '',
        input_mode: 'FIXED',
        amount: '',
        quantity: '',
        rate: '',
        effective_from: defaults.effective_from,
        effective_to: '',
        is_active: true,
        reference: '',
        notes: '',
    });
    const settlementForm = useForm<SettlementFormData>({
        ...settlementDefaults,
    });

    const currencyMap = useMemo(
        () =>
            currencies.reduce<Record<string, string>>((carry, currency) => {
                carry[currency.code] = currency.label;
                return carry;
            }, {}),
        [currencies],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => {
            router.get(
                '/payroll/profiles',
                { search, status: status === 'all' ? '' : status },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search, status]);

    const changePage = (page: number) => {
        router.get(
            '/payroll/profiles',
            { page, search, status: status === 'all' ? '' : status },
            { preserveState: true, preserveScroll: true },
        );
    };

    // --- Handlers: Profile ---
    const openCreateProfile = () => {
        setEditingProfile(null);
        profileForm.setData({ ...defaults });
        setProfileDialogOpen(true);
    };

    const openEditProfile = (profile: ProfileRow) => {
        setEditingProfile(profile);
        profileForm.setData({
            employee_id: String(profile.employee_id),
            pay_frequency: profile.pay_frequency,
            currency: profile.currency,
            basic_salary: profile.basic_salary,
            hourly_rate: profile.hourly_rate ?? '',
            overtime_multiplier: profile.overtime_multiplier,
            bank_name: profile.bank_name ?? '',
            bank_branch: profile.bank_branch ?? '',
            bank_account_name: profile.bank_account_name ?? '',
            bank_account_number: profile.bank_account_number ?? '',
            bank_account_type: profile.bank_account_type ?? '',
            tax_number: profile.tax_number ?? '',
            tax_table: profile.tax_table ?? '',
            pension_number: profile.pension_number ?? '',
            pension_percent: profile.pension_percent,
            nssa_number: profile.nssa_number ?? '',
            nssa_percent: profile.nssa_percent,
            nec_number: profile.nec_number ?? '',
            nec_percent: profile.nec_percent,
            union_number: profile.union_number ?? '',
            union_percent: profile.union_percent,
            cost_centre: profile.cost_centre ?? '',
            employment_status: profile.employment_status,
            tax_enabled: profile.tax_enabled,
            active: profile.active,
            effective_from: profile.effective_from ?? defaults.effective_from,
            effective_to: profile.effective_to ?? '',
            notes: profile.notes ?? '',
        });
        setProfileDialogOpen(true);
    };

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const request = editingProfile ? profileForm.put : profileForm.post;
        const url = editingProfile
            ? `/payroll/profiles/${editingProfile.id}`
            : '/payroll/profiles';
        request(url, {
            preserveScroll: true,
            onSuccess: () => {
                setProfileDialogOpen(false);
                setEditingProfile(null);
            },
        });
    };

    const destroyProfile = (profile: ProfileRow) => {
        if (
            window.confirm(
                `Delete the payroll profile for ${profile.employee?.full_name ?? 'this employee'}?`,
            )
        ) {
            router.delete(`/payroll/profiles/${profile.id}`, {
                preserveScroll: true,
            });
        }
    };

    // --- Handlers: Recurring Items ---
    const openCreateRecurring = (profile: ProfileRow) => {
        setRecurringContext({ profile, item: null });
        recurringForm.setData({
            employee_id: String(profile.employee_id),
            employee_payroll_profile_id: String(profile.id),
            pay_code_id: '',
            input_mode: 'FIXED',
            amount: '',
            quantity: '',
            rate: '',
            effective_from: profile.effective_from ?? defaults.effective_from,
            effective_to: '',
            is_active: true,
            reference: '',
            notes: '',
        });
        setRecurringDialogOpen(true);
    };

    const openEditRecurring = (profile: ProfileRow, item: RecurringItem) => {
        setRecurringContext({ profile, item });
        recurringForm.setData({
            employee_id: String(item.employee_id),
            employee_payroll_profile_id: String(
                item.employee_payroll_profile_id,
            ),
            pay_code_id: String(item.pay_code?.id ?? ''),
            input_mode: item.input_mode,
            amount: item.amount ?? '',
            quantity: item.quantity ?? '',
            rate: item.rate ?? '',
            effective_from:
                item.effective_from ??
                profile.effective_from ??
                defaults.effective_from,
            effective_to: item.effective_to ?? '',
            is_active: item.is_active,
            reference: item.reference ?? '',
            notes: item.notes ?? '',
        });
        setRecurringDialogOpen(true);
    };

    const submitRecurring = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recurringContext) return;
        const request = recurringContext.item
            ? recurringForm.put
            : recurringForm.post;
        const url = recurringContext.item
            ? `/payroll/profiles/${recurringContext.profile.id}/recurring-items/${recurringContext.item.id}`
            : `/payroll/profiles/${recurringContext.profile.id}/recurring-items`;
        request(url, {
            preserveScroll: true,
            onSuccess: () => {
                setRecurringDialogOpen(false);
                setRecurringContext(null);
            },
        });
    };

    const destroyRecurring = (profile: ProfileRow, item: RecurringItem) => {
        if (
            window.confirm(
                `Remove recurring item ${item.pay_code?.code ?? 'item'} from this payroll profile?`,
            )
        ) {
            router.delete(
                `/payroll/profiles/${profile.id}/recurring-items/${item.id}`,
                { preserveScroll: true },
            );
        }
    };

    // --- Handlers: Settlements ---
    const openCreateSettlement = (profile: ProfileRow) => {
        const preferredCurrency =
            currencies.find((c) => c.code !== profile.currency)?.code ??
            profile.currency;
        setSettlementContext({ profile, rule: null });
        settlementForm.setData({
            currency: preferredCurrency,
            allocation_method: 'REMAINDER',
            amount: '',
            percentage: '',
            priority: 0,
            active: true,
            notes: '',
        });
        setSettlementDialogOpen(true);
    };

    const openEditSettlement = (profile: ProfileRow, rule: SettlementRule) => {
        setSettlementContext({ profile, rule });
        settlementForm.setData({
            currency: rule.currency,
            allocation_method: rule.allocation_method,
            amount: rule.amount ?? '',
            percentage: rule.percentage ?? '',
            priority: rule.priority,
            active: rule.active,
            notes: rule.notes ?? '',
        });
        setSettlementDialogOpen(true);
    };

    const submitSettlement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!settlementContext) return;
        const request = settlementContext.rule
            ? settlementForm.put
            : settlementForm.post;
        const url = settlementContext.rule
            ? `/payroll/profiles/${settlementContext.profile.id}/settlements/${settlementContext.rule.id}`
            : `/payroll/profiles/${settlementContext.profile.id}/settlements`;
        request(url, {
            preserveScroll: true,
            onSuccess: () => {
                setSettlementDialogOpen(false);
                setSettlementContext(null);
            },
        });
    };

    const destroySettlement = (profile: ProfileRow, rule: SettlementRule) => {
        if (
            window.confirm(
                `Remove ${rule.currency} settlement rule from this payroll profile?`,
            )
        ) {
            router.delete(
                `/payroll/profiles/${profile.id}/settlements/${rule.id}`,
                { preserveScroll: true },
            );
        }
    };

    // UI Helpers
    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const tabClass =
        'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Control Center', href: '/control-center' },
                { title: 'Payroll', href: '/payroll' },
                { title: 'Profiles', href: '#' },
            ]}
        >
            <Head title="Employee Payroll Profiles" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 hidden h-10 w-10 shrink-0 border-border bg-background shadow-sm hover:bg-muted sm:flex"
                            onClick={() => router.visit('/payroll')}
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                Employee payroll profiles
                            </h1>
                            <p className="mt-2 max-w-4xl text-sm leading-relaxed font-medium text-muted-foreground">
                                Manage high-density multi-currency settlement
                                capabilities, including USD and ZiG distribution
                                rules, and complex tax jurisdictions.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('payroll.profile.manage') && (
                            <Button
                                onClick={openCreateProfile}
                                className="h-11 bg-foreground px-6 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add payroll
                                profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                    <MiniStat
                        label="Total Profiles"
                        value={stats.total}
                        icon={Users}
                        trend="+12% from last month"
                    />
                    <MiniStat
                        label="Active Profiles"
                        value={stats.active}
                        icon={CheckCircle2}
                        subtext="97.3% retention rate"
                    />
                    <MiniStat
                        label="Employees Covered"
                        value={stats.employees_covered}
                        icon={Briefcase}
                        trend="+5.2% growth"
                    />
                    <MiniStat
                        label="Recurring Items"
                        value={stats.recurring_items}
                        icon={Banknote}
                        subtext="Across 12 categories"
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex w-full flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">
                            Payroll profile register
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="h-9 border-border bg-background font-bold text-muted-foreground shadow-sm"
                            >
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 border-border bg-background font-bold text-muted-foreground shadow-sm"
                            >
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>

                    {/* Detailed Profile Cards */}
                    {profiles.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-background p-12 text-center shadow-sm">
                            <p className="text-lg font-bold text-foreground">
                                No payroll profiles found
                            </p>
                            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-muted-foreground">
                                Create the first payroll profile for the active
                                organization to start processing payroll and
                                configuring settlement rules.
                            </p>
                        </div>
                    ) : (
                        profiles.data.map((profile) => {
                            const employeeName =
                                profile.employee?.full_name ??
                                'Unknown employee';
                            return (
                                <Card
                                    key={profile.id}
                                    className="flex w-full flex-col overflow-hidden border-border bg-background shadow-sm"
                                >
                                    <div className="border-b border-border/50 bg-muted/5 p-6">
                                        <div className="flex flex-col justify-between gap-6 md:flex-row">
                                            {/* Left: Identity */}
                                            <div className="flex min-w-[300px] items-center gap-4">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-lg font-bold shadow-sm ${profile.active ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}
                                                >
                                                    {getInitials(employeeName)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-lg font-bold text-foreground">
                                                            {employeeName}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-none ${profile.active ? 'border-transparent bg-primary/10 text-primary' : 'border-transparent bg-muted text-muted-foreground'}`}
                                                        >
                                                            {profile.active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                                        Staff ID:{' '}
                                                        {profile.employee
                                                            ?.staff_number ??
                                                            'N/A'}{' '}
                                                        •{' '}
                                                        {profile.employee
                                                            ?.position ??
                                                            'No position'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Core Financials */}
                                            <div className="grid w-full grid-cols-2 gap-x-8 gap-y-4 md:text-right lg:w-auto lg:grid-cols-4">
                                                <div>
                                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:text-right">
                                                        Basic Salary
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-sm font-bold text-foreground md:text-right">
                                                        {formatMoney(
                                                            profile.currency,
                                                            profile.basic_salary,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:text-right">
                                                        Hourly Rate
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-sm font-bold text-foreground md:text-right">
                                                        {profile.hourly_rate !==
                                                        null
                                                            ? formatMoney(
                                                                  profile.currency,
                                                                  profile.hourly_rate,
                                                              )
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:text-right">
                                                        Tax State
                                                    </p>
                                                    <p className="mt-0.5 text-sm font-bold text-foreground md:text-right">
                                                        {profile.tax_enabled
                                                            ? profile.tax_table ||
                                                              'Default'
                                                            : 'Disabled'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:text-right">
                                                        Settlement
                                                    </p>
                                                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-primary md:justify-end">
                                                        <ArrowRightLeft className="h-3.5 w-3.5" />
                                                        {profile
                                                            .settlement_rules
                                                            .length > 0
                                                            ? profile.settlement_rules
                                                                  .map(
                                                                      (r) =>
                                                                          r.currency,
                                                                  )
                                                                  .join(' + ')
                                                            : `${profile.currency} Only`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabs Section */}
                                    <Tabs
                                        defaultValue="overview"
                                        className="flex w-full flex-1 flex-col"
                                    >
                                        <div className="border-b border-border/50 bg-background px-6">
                                            <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
                                                <TabsTrigger
                                                    value="overview"
                                                    className={tabClass}
                                                >
                                                    Overview
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="recurring"
                                                    className={tabClass}
                                                >
                                                    Recurring Items
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="settlements"
                                                    className={tabClass}
                                                >
                                                    Settlements
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <div className="p-6">
                                            <TabsContent
                                                value="overview"
                                                className="m-0 focus-visible:ring-0"
                                            >
                                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                                    <div className="flex flex-col gap-3">
                                                        <h4 className="flex items-center gap-2 border-b border-border/50 pb-2 text-sm font-bold text-foreground">
                                                            <Building2 className="h-4 w-4 text-muted-foreground" />{' '}
                                                            Banking Details
                                                        </h4>
                                                        <div className="mt-1 space-y-1.5">
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Bank:
                                                                </strong>{' '}
                                                                {profile.bank_name ||
                                                                    'Not provided'}
                                                            </p>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Account:
                                                                </strong>{' '}
                                                                <span className="font-mono">
                                                                    {profile.bank_account_number ||
                                                                        'Not provided'}
                                                                </span>
                                                            </p>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Branch:
                                                                </strong>{' '}
                                                                {profile.bank_branch ||
                                                                    'Not provided'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <h4 className="flex items-center gap-2 border-b border-border/50 pb-2 text-sm font-bold text-foreground">
                                                            <Briefcase className="h-4 w-4 text-muted-foreground" />{' '}
                                                            Cost Allocation
                                                        </h4>
                                                        <div className="mt-1 space-y-1.5">
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Department:
                                                                </strong>{' '}
                                                                {profile
                                                                    .employee
                                                                    ?.department ||
                                                                    'Not assigned'}
                                                            </p>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Cost Centre:
                                                                </strong>{' '}
                                                                {profile.cost_centre ||
                                                                    'Not assigned'}
                                                            </p>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Pay Freq:
                                                                </strong>{' '}
                                                                {
                                                                    profile.pay_frequency
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <h4 className="flex items-center gap-2 border-b border-border/50 pb-2 text-sm font-bold text-foreground">
                                                            <Shield className="h-4 w-4 text-muted-foreground" />{' '}
                                                            Statutory & Benefits
                                                        </h4>
                                                        <div className="mt-1 space-y-1.5">
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    Pension:
                                                                </strong>{' '}
                                                                {
                                                                    profile.pension_percent
                                                                }
                                                                %{' '}
                                                                {profile.pension_number
                                                                    ? `(${profile.pension_number})`
                                                                    : ''}
                                                            </p>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    NSSA:
                                                                </strong>{' '}
                                                                {
                                                                    profile.nssa_percent
                                                                }
                                                                %{' '}
                                                                {profile.nssa_number
                                                                    ? `(${profile.nssa_number})`
                                                                    : ''}
                                                            </p>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                <strong className="font-bold text-foreground">
                                                                    NEC/Union:
                                                                </strong>{' '}
                                                                {
                                                                    profile.nec_percent
                                                                }
                                                                % /{' '}
                                                                {
                                                                    profile.union_percent
                                                                }
                                                                %
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent
                                                value="recurring"
                                                className="m-0 focus-visible:ring-0"
                                            >
                                                <div className="overflow-x-auto rounded-xl border border-border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/10 hover:bg-transparent">
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Description
                                                                </TableHead>
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Type
                                                                </TableHead>
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Amount/Value
                                                                </TableHead>
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Status
                                                                </TableHead>
                                                                <TableHead className="h-10 pr-4 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Actions
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {profile
                                                                .recurring_items
                                                                .length ===
                                                            0 ? (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="h-24 text-center text-xs font-medium text-muted-foreground"
                                                                    >
                                                                        No
                                                                        recurring
                                                                        items
                                                                        configured.
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                profile.recurring_items.map(
                                                                    (item) => (
                                                                        <TableRow
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="transition-colors hover:bg-muted/30"
                                                                        >
                                                                            <TableCell className="py-3 text-sm font-bold text-foreground">
                                                                                {item
                                                                                    .pay_code
                                                                                    ?.description ??
                                                                                    'Unknown'}
                                                                                <span className="mt-0.5 block font-mono text-[10px] font-normal text-muted-foreground">
                                                                                    {
                                                                                        item
                                                                                            .pay_code
                                                                                            ?.code
                                                                                    }
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell className="py-3">
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="border-transparent bg-muted/50 px-2 py-0 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                                                >
                                                                                    {
                                                                                        item
                                                                                            .pay_code
                                                                                            ?.type
                                                                                    }
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="py-3 font-mono text-sm font-bold text-foreground">
                                                                                {formatRecurringValue(
                                                                                    profile.currency,
                                                                                    item,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="py-3">
                                                                                {item.is_active ? (
                                                                                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                                                                                ) : (
                                                                                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="py-3 pr-4 text-right">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                                    onClick={() =>
                                                                                        openEditRecurring(
                                                                                            profile,
                                                                                            item,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Pencil className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                                                    onClick={() =>
                                                                                        destroyRecurring(
                                                                                            profile,
                                                                                            item,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TabsContent>

                                            <TabsContent
                                                value="settlements"
                                                className="m-0 focus-visible:ring-0"
                                            >
                                                <div className="overflow-x-auto rounded-xl border border-border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/10 hover:bg-transparent">
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Currency
                                                                </TableHead>
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Method
                                                                </TableHead>
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Value
                                                                </TableHead>
                                                                <TableHead className="h-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Priority
                                                                </TableHead>
                                                                <TableHead className="h-10 pr-4 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                    Actions
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {profile
                                                                .settlement_rules
                                                                .length ===
                                                            0 ? (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="h-24 text-center text-xs font-medium text-muted-foreground"
                                                                    >
                                                                        No
                                                                        specific
                                                                        rules.
                                                                        Receives
                                                                        full net
                                                                        pay in{' '}
                                                                        {
                                                                            profile.currency
                                                                        }
                                                                        .
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                profile.settlement_rules.map(
                                                                    (rule) => (
                                                                        <TableRow
                                                                            key={
                                                                                rule.id
                                                                            }
                                                                            className="transition-colors hover:bg-muted/30"
                                                                        >
                                                                            <TableCell className="py-3 text-sm font-bold text-foreground">
                                                                                {
                                                                                    rule.currency
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="py-3">
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="border-transparent bg-muted/50 px-2 py-0 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                                                >
                                                                                    {rule.allocation_method.replace(
                                                                                        '_',
                                                                                        ' ',
                                                                                    )}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="py-3 font-mono text-sm font-bold text-foreground">
                                                                                {formatSettlementValue(
                                                                                    rule,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="py-3 text-sm font-medium text-muted-foreground">
                                                                                Level{' '}
                                                                                {
                                                                                    rule.priority
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="py-3 pr-4 text-right">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                                    onClick={() =>
                                                                                        openEditSettlement(
                                                                                            profile,
                                                                                            rule,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Pencil className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                                                    onClick={() =>
                                                                                        destroySettlement(
                                                                                            profile,
                                                                                            rule,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TabsContent>
                                        </div>
                                    </Tabs>

                                    {/* Profile Action Bar */}
                                    <div className="mt-auto flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row md:px-6">
                                        <div className="flex w-full gap-3 sm:w-auto">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 flex-1 border-border text-xs font-bold shadow-sm sm:flex-none"
                                                onClick={() =>
                                                    openCreateRecurring(profile)
                                                }
                                            >
                                                <PlusCircle className="mr-2 h-3.5 w-3.5" />{' '}
                                                Add recurring
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 flex-1 border-border text-xs font-bold shadow-sm sm:flex-none"
                                                onClick={() =>
                                                    openCreateSettlement(
                                                        profile,
                                                    )
                                                }
                                            >
                                                <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />{' '}
                                                Add settlement
                                            </Button>
                                        </div>
                                        <div className="flex w-full gap-3 sm:w-auto">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-full text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                                                onClick={() =>
                                                    destroyProfile(profile)
                                                }
                                            >
                                                Delete Profile
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-9 w-full bg-foreground text-xs font-bold text-background shadow-sm hover:bg-foreground/90 sm:w-auto"
                                                onClick={() =>
                                                    openEditProfile(profile)
                                                }
                                            >
                                                <Pencil className="mr-1.5 h-4 w-4" />{' '}
                                                Edit Configuration
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {profiles.last_page > 1 && (
                    <div className="flex items-center justify-between pt-4">
                        <span className="text-sm font-bold text-muted-foreground">
                            Page {profiles.current_page} of {profiles.last_page}
                        </span>
                        <ReactPaginate
                            pageCount={profiles.last_page}
                            forcePage={profiles.current_page - 1}
                            onPageChange={(s) => changePage(s.selected + 1)}
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
            </div>

            {/* ================================================================================================= */}
            {/* --- MODAL: CREATE / EDIT PROFILE --- */}
            <Dialog
                open={profileDialogOpen}
                onOpenChange={setProfileDialogOpen}
            >
                <DialogContent
                    size="6xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={submitProfile}
                        className="flex max-h-[90vh] flex-col"
                    >
                        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                            <DialogTitle className="text-2xl font-extrabold text-foreground">
                                {editingProfile
                                    ? 'Edit payroll profile'
                                    : 'Create payroll profile'}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm font-medium text-muted-foreground">
                                Complete setup of base financials, banking
                                details, and statutory tax parameters.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Modal Body: Scrolled */}
                        <div className="flex-1 space-y-10 overflow-y-auto p-6 md:p-8">
                            {/* Section: Employment & Salary */}
                            <section className="space-y-6">
                                <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Employment & Salary Base
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                    <div className="lg:col-span-2">
                                        <Field
                                            label="Employee"
                                            error={
                                                profileForm.errors.employee_id
                                            }
                                        >
                                            <Select
                                                value={
                                                    profileForm.data.employee_id
                                                }
                                                onValueChange={(v) =>
                                                    profileForm.setData(
                                                        'employee_id',
                                                        v,
                                                    )
                                                }
                                                disabled={!!editingProfile}
                                            >
                                                <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                    <SelectValue placeholder="Select employee" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employees.map((emp) => (
                                                        <SelectItem
                                                            key={emp.id}
                                                            value={String(
                                                                emp.id,
                                                            )}
                                                        >
                                                            {emp.full_name} (
                                                            {emp.staff_number})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>
                                    <Field
                                        label="Pay Frequency"
                                        error={profileForm.errors.pay_frequency}
                                    >
                                        <Select
                                            value={
                                                profileForm.data.pay_frequency
                                            }
                                            onValueChange={(v) =>
                                                profileForm.setData(
                                                    'pay_frequency',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {frequencies.map((freq) => (
                                                    <SelectItem
                                                        key={freq}
                                                        value={freq}
                                                    >
                                                        {freq}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field
                                        label="Base Currency"
                                        error={profileForm.errors.currency}
                                    >
                                        <Select
                                            value={profileForm.data.currency}
                                            onValueChange={(v) =>
                                                profileForm.setData(
                                                    'currency',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((c) => (
                                                    <SelectItem
                                                        key={c.code}
                                                        value={c.code}
                                                    >
                                                        {c.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    <Field
                                        label="Basic Salary"
                                        error={profileForm.errors.basic_salary}
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data.basic_salary ??
                                                    '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'basic_salary',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background text-sm shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="Hourly Rate"
                                        error={profileForm.errors.hourly_rate}
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data.hourly_rate ??
                                                    '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'hourly_rate',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background text-sm shadow-sm"
                                            placeholder="Optional"
                                        />
                                    </Field>
                                    <Field
                                        label="Overtime Multiplier"
                                        error={
                                            profileForm.errors
                                                .overtime_multiplier
                                        }
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data
                                                    .overtime_multiplier ?? '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'overtime_multiplier',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background text-sm shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="Cost Centre"
                                        error={profileForm.errors.cost_centre}
                                    >
                                        <Input
                                            value={profileForm.data.cost_centre}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'cost_centre',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background text-sm shadow-sm"
                                            placeholder="Optional"
                                        />
                                    </Field>
                                </div>
                            </section>

                            {/* Section: Banking Information */}
                            <section className="space-y-6">
                                <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Banking Details
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                                    <div className="lg:col-span-2">
                                        <Field
                                            label="Bank Name"
                                            error={profileForm.errors.bank_name}
                                        >
                                            <Input
                                                value={
                                                    profileForm.data.bank_name
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'bank_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                    <Field
                                        label="Branch"
                                        error={profileForm.errors.bank_branch}
                                    >
                                        <Input
                                            value={profileForm.data.bank_branch}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'bank_branch',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                    <div className="lg:col-span-2">
                                        <Field
                                            label="Account Name"
                                            error={
                                                profileForm.errors
                                                    .bank_account_name
                                            }
                                        >
                                            <Input
                                                value={
                                                    profileForm.data
                                                        .bank_account_name
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'bank_account_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                    <div className="lg:col-span-3">
                                        <Field
                                            label="Account Number"
                                            error={
                                                profileForm.errors
                                                    .bank_account_number
                                            }
                                        >
                                            <Input
                                                value={
                                                    profileForm.data
                                                        .bank_account_number
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'bank_account_number',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background font-mono shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <Field
                                            label="Account Type"
                                            error={
                                                profileForm.errors
                                                    .bank_account_type
                                            }
                                        >
                                            <Input
                                                value={
                                                    profileForm.data
                                                        .bank_account_type
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'bank_account_type',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                                placeholder="e.g. Savings, Current"
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Statutory & Tax Information */}
                            <section className="space-y-6">
                                <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Statutory & Deductions
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                                    <div className="md:col-span-2">
                                        <Field
                                            label="Tax Number (TIN)"
                                            error={
                                                profileForm.errors.tax_number
                                            }
                                        >
                                            <Input
                                                value={
                                                    profileForm.data.tax_number
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'tax_number',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Field
                                            label="Tax Table Code"
                                            error={profileForm.errors.tax_table}
                                        >
                                            <Input
                                                value={
                                                    profileForm.data.tax_table
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'tax_table',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background shadow-sm"
                                                placeholder="Overrides default if set"
                                            />
                                        </Field>
                                    </div>

                                    <Field
                                        label="Pension Number"
                                        error={
                                            profileForm.errors.pension_number
                                        }
                                    >
                                        <Input
                                            value={
                                                profileForm.data.pension_number
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'pension_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="Pension %"
                                        error={
                                            profileForm.errors.pension_percent
                                        }
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data
                                                    .pension_percent ?? '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'pension_percent',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>

                                    <Field
                                        label="NSSA Number"
                                        error={profileForm.errors.nssa_number}
                                    >
                                        <Input
                                            value={profileForm.data.nssa_number}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'nssa_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="NSSA %"
                                        error={profileForm.errors.nssa_percent}
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data.nssa_percent ??
                                                    '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'nssa_percent',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>

                                    <Field
                                        label="NEC Number"
                                        error={profileForm.errors.nec_number}
                                    >
                                        <Input
                                            value={profileForm.data.nec_number}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'nec_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="NEC %"
                                        error={profileForm.errors.nec_percent}
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data.nec_percent ??
                                                    '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'nec_percent',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>

                                    <Field
                                        label="Union Number"
                                        error={profileForm.errors.union_number}
                                    >
                                        <Input
                                            value={
                                                profileForm.data.union_number
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'union_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="Union %"
                                        error={profileForm.errors.union_percent}
                                    >
                                        <Input
                                            type="number"
                                            value={String(
                                                profileForm.data
                                                    .union_percent ?? '',
                                            )}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'union_percent',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                </div>
                            </section>

                            {/* Section: Status & Dates */}
                            <section className="space-y-6">
                                <h3 className="border-b border-border/50 pb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Dates & Control Status
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <Field
                                        label="Employment Status"
                                        error={
                                            profileForm.errors.employment_status
                                        }
                                    >
                                        <Select
                                            value={
                                                profileForm.data
                                                    .employment_status
                                            }
                                            onValueChange={(v) =>
                                                profileForm.setData(
                                                    'employment_status',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field
                                        label="Effective From"
                                        error={
                                            profileForm.errors.effective_from
                                        }
                                    >
                                        <Input
                                            type="date"
                                            value={
                                                profileForm.data.effective_from
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'effective_from',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                        />
                                    </Field>
                                    <Field
                                        label="Effective To"
                                        error={profileForm.errors.effective_to}
                                    >
                                        <Input
                                            type="date"
                                            value={
                                                profileForm.data.effective_to
                                            }
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'effective_to',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 bg-background shadow-sm"
                                            placeholder="Optional"
                                        />
                                    </Field>

                                    <div className="md:col-span-2">
                                        <Field
                                            label="Administrative Notes"
                                            error={profileForm.errors.notes}
                                        >
                                            <Textarea
                                                rows={3}
                                                value={profileForm.data.notes}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'notes',
                                                        e.target.value,
                                                    )
                                                }
                                                className="resize-none bg-background shadow-sm"
                                                placeholder="Internal HR/Payroll notes..."
                                            />
                                        </Field>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Label className="invisible text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Toggles
                                        </Label>
                                        <CheckField
                                            label="Tax Enabled"
                                            description="Calculate statutory taxes"
                                            checked={
                                                profileForm.data.tax_enabled
                                            }
                                            onCheckedChange={(checked) =>
                                                profileForm.setData(
                                                    'tax_enabled',
                                                    !!checked,
                                                )
                                            }
                                        />
                                        <CheckField
                                            label="Profile Active"
                                            description="Include in payroll runs"
                                            checked={profileForm.data.active}
                                            onCheckedChange={(checked) =>
                                                profileForm.setData(
                                                    'active',
                                                    !!checked,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <DialogFooter className="mt-0 flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setProfileDialogOpen(false)}
                                className="h-11 px-6 font-bold shadow-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={profileForm.processing}
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                {editingProfile
                                    ? 'Save changes'
                                    : 'Create profile'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL: CREATE / EDIT RECURRING ITEM --- */}
            <Dialog
                open={recurringDialogOpen}
                onOpenChange={setRecurringDialogOpen}
            >
                <DialogContent
                    size="6xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={submitRecurring}
                        className="flex max-h-[90vh] flex-col"
                    >
                        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                            <DialogTitle className="text-2xl font-extrabold text-foreground">
                                {recurringContext?.item
                                    ? 'Edit recurring item'
                                    : 'Add recurring item'}
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-sm font-medium text-muted-foreground">
                                Automate deductions or earnings for this
                                employee on every payroll run.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 space-y-10 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                <div className="md:col-span-2">
                                    <Field label="Employee">
                                        <Input
                                            value={
                                                recurringContext?.profile
                                                    .employee?.full_name ?? ''
                                            }
                                            disabled
                                            className="h-11 bg-muted/50 font-bold shadow-sm"
                                        />
                                    </Field>
                                </div>
                                <div className="md:col-span-2">
                                    <Field
                                        label="Pay Code"
                                        error={recurringForm.errors.pay_code_id}
                                    >
                                        <Select
                                            value={
                                                recurringForm.data.pay_code_id
                                            }
                                            onValueChange={(v) =>
                                                recurringForm.setData(
                                                    'pay_code_id',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                                <SelectValue placeholder="Select pay code" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {payCodes
                                                    .filter(
                                                        (pc) =>
                                                            pc.recurring ||
                                                            recurringContext
                                                                ?.item?.pay_code
                                                                ?.id === pc.id,
                                                    )
                                                    .map((pc) => (
                                                        <SelectItem
                                                            key={pc.id}
                                                            value={String(
                                                                pc.id,
                                                            )}
                                                        >
                                                            {pc.code} |{' '}
                                                            {pc.description}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                <Field
                                    label="Input Mode"
                                    error={recurringForm.errors.input_mode}
                                >
                                    <Select
                                        value={recurringForm.data.input_mode}
                                        onValueChange={(v) => {
                                            recurringForm.setData(
                                                'input_mode',
                                                v,
                                            );
                                            if (v === 'FIXED') {
                                                recurringForm.setData(
                                                    'quantity',
                                                    '',
                                                );
                                                recurringForm.setData(
                                                    'rate',
                                                    '',
                                                );
                                            } else {
                                                recurringForm.setData(
                                                    'amount',
                                                    '',
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FIXED">
                                                FIXED AMOUNT
                                            </SelectItem>
                                            <SelectItem value="RATE_X_QTY">
                                                RATE X QUANTITY
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {recurringForm.data.input_mode === 'FIXED' ? (
                                    <div className="md:col-span-1">
                                        <Field
                                            label="Amount"
                                            error={recurringForm.errors.amount}
                                        >
                                            <Input
                                                type="number"
                                                value={String(
                                                    recurringForm.data.amount ??
                                                        '',
                                                )}
                                                onChange={(e) =>
                                                    recurringForm.setData(
                                                        'amount',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background text-sm shadow-sm"
                                            />
                                        </Field>
                                    </div>
                                ) : (
                                    <>
                                        <Field
                                            label="Rate"
                                            error={recurringForm.errors.rate}
                                        >
                                            <Input
                                                type="number"
                                                value={String(
                                                    recurringForm.data.rate ??
                                                        '',
                                                )}
                                                onChange={(e) =>
                                                    recurringForm.setData(
                                                        'rate',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background text-sm shadow-sm"
                                            />
                                        </Field>
                                        <Field
                                            label="Quantity"
                                            error={
                                                recurringForm.errors.quantity
                                            }
                                        >
                                            <Input
                                                type="number"
                                                value={String(
                                                    recurringForm.data
                                                        .quantity ?? '',
                                                )}
                                                onChange={(e) =>
                                                    recurringForm.setData(
                                                        'quantity',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 bg-background text-sm shadow-sm"
                                            />
                                        </Field>
                                    </>
                                )}

                                <Field
                                    label="Effective From"
                                    error={recurringForm.errors.effective_from}
                                >
                                    <Input
                                        type="date"
                                        value={
                                            recurringForm.data.effective_from
                                        }
                                        onChange={(e) =>
                                            recurringForm.setData(
                                                'effective_from',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                    />
                                </Field>
                                <Field
                                    label="Effective To"
                                    error={recurringForm.errors.effective_to}
                                >
                                    <Input
                                        type="date"
                                        value={recurringForm.data.effective_to}
                                        onChange={(e) =>
                                            recurringForm.setData(
                                                'effective_to',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                        placeholder="Optional"
                                    />
                                </Field>

                                <Field
                                    label="Reference / PO Number"
                                    error={recurringForm.errors.reference}
                                >
                                    <Input
                                        value={recurringForm.data.reference}
                                        onChange={(e) =>
                                            recurringForm.setData(
                                                'reference',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background shadow-sm"
                                        placeholder="Optional reference"
                                    />
                                </Field>

                                <div className="flex items-center">
                                    <CheckField
                                        label="Item Active"
                                        description="Execute this on the next payroll run"
                                        checked={recurringForm.data.is_active}
                                        onCheckedChange={(checked) =>
                                            recurringForm.setData(
                                                'is_active',
                                                !!checked,
                                            )
                                        }
                                    />
                                </div>

                                <div className="md:col-span-full">
                                    <Field
                                        label="Notes"
                                        error={recurringForm.errors.notes}
                                    >
                                        <Textarea
                                            rows={3}
                                            value={recurringForm.data.notes}
                                            onChange={(e) =>
                                                recurringForm.setData(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            className="resize-none bg-background shadow-sm"
                                            placeholder="Reason for this recurring item..."
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-0 flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRecurringDialogOpen(false)}
                                className="h-11 px-6 font-bold shadow-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={recurringForm.processing}
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                {recurringContext?.item
                                    ? 'Save changes'
                                    : 'Add recurring item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL: CREATE / EDIT SETTLEMENT RULE --- */}
            <Dialog
                open={settlementDialogOpen}
                onOpenChange={setSettlementDialogOpen}
            >
                <DialogContent
                    size="6xl"
                    className="overflow-hidden border-border p-0 shadow-lg"
                >
                    <form
                        onSubmit={submitSettlement}
                        className="flex max-h-[90vh] flex-col"
                    >
                        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/5 p-6 md:p-8">
                            <DialogTitle className="text-2xl font-extrabold text-foreground">
                                {settlementContext?.rule
                                    ? 'Edit settlement rule'
                                    : 'Add settlement rule'}
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-sm font-medium text-muted-foreground">
                                Define how the final net pay should be
                                distributed across currencies.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 space-y-10 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                <Field
                                    label="Target Currency"
                                    error={settlementForm.errors.currency}
                                >
                                    <Select
                                        value={settlementForm.data.currency}
                                        onValueChange={(v) =>
                                            settlementForm.setData(
                                                'currency',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((c) => (
                                                <SelectItem
                                                    key={c.code}
                                                    value={c.code}
                                                >
                                                    {c.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field
                                    label="Allocation Method"
                                    error={
                                        settlementForm.errors.allocation_method
                                    }
                                >
                                    <Select
                                        value={
                                            settlementForm.data
                                                .allocation_method
                                        }
                                        onValueChange={(v) => {
                                            settlementForm.setData(
                                                'allocation_method',
                                                v,
                                            );
                                            if (v !== 'FIXED_AMOUNT')
                                                settlementForm.setData(
                                                    'amount',
                                                    '',
                                                );
                                            if (v !== 'PERCENTAGE')
                                                settlementForm.setData(
                                                    'percentage',
                                                    '',
                                                );
                                        }}
                                    >
                                        <SelectTrigger className="h-11 bg-background text-sm shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {settlementAllocationMethods.map(
                                                (m) => (
                                                    <SelectItem
                                                        key={m}
                                                        value={m}
                                                    >
                                                        {m.replace('_', ' ')}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field
                                    label="Fixed Amount"
                                    error={settlementForm.errors.amount}
                                >
                                    <Input
                                        type="number"
                                        value={String(
                                            settlementForm.data.amount ?? '',
                                        )}
                                        disabled={
                                            settlementForm.data
                                                .allocation_method !==
                                            'FIXED_AMOUNT'
                                        }
                                        onChange={(e) =>
                                            settlementForm.setData(
                                                'amount',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background text-sm shadow-sm disabled:opacity-50"
                                        placeholder="e.g. 500"
                                    />
                                </Field>
                                <Field
                                    label="Percentage (%)"
                                    error={settlementForm.errors.percentage}
                                >
                                    <Input
                                        type="number"
                                        value={String(
                                            settlementForm.data.percentage ??
                                                '',
                                        )}
                                        disabled={
                                            settlementForm.data
                                                .allocation_method !==
                                            'PERCENTAGE'
                                        }
                                        onChange={(e) =>
                                            settlementForm.setData(
                                                'percentage',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background text-sm shadow-sm disabled:opacity-50"
                                        placeholder="e.g. 50"
                                    />
                                </Field>

                                <Field
                                    label="Execution Priority"
                                    error={settlementForm.errors.priority}
                                >
                                    <Input
                                        type="number"
                                        value={String(
                                            settlementForm.data.priority ?? '',
                                        )}
                                        onChange={(e) =>
                                            settlementForm.setData(
                                                'priority',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 bg-background text-sm shadow-sm"
                                        placeholder="Lower number executes first"
                                    />
                                </Field>

                                <div className="flex items-center">
                                    <CheckField
                                        label="Rule Active"
                                        description="Enable this split during processing"
                                        checked={settlementForm.data.active}
                                        onCheckedChange={(checked) =>
                                            settlementForm.setData(
                                                'active',
                                                !!checked,
                                            )
                                        }
                                    />
                                </div>

                                <div className="md:col-span-full">
                                    <div className="rounded-xl border border-border bg-muted/10 p-4 text-xs leading-relaxed font-medium text-muted-foreground">
                                        <strong className="text-foreground">
                                            Hint:
                                        </strong>{' '}
                                        Fixed amount and percentage rules cannot
                                        be mixed on the same profile. Use
                                        exactly one 'REMAINDER' rule with the
                                        lowest priority to sweep the remaining
                                        net pay into the final currency.
                                    </div>
                                </div>

                                <div className="md:col-span-full">
                                    <Field
                                        label="Notes"
                                        error={settlementForm.errors.notes}
                                    >
                                        <Textarea
                                            rows={3}
                                            value={settlementForm.data.notes}
                                            onChange={(e) =>
                                                settlementForm.setData(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            className="resize-none bg-background shadow-sm"
                                            placeholder="Reason for this settlement split..."
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-0 flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/5 p-6 md:p-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSettlementDialogOpen(false)}
                                className="h-11 px-6 font-bold shadow-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={settlementForm.processing}
                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                            >
                                {settlementContext?.rule
                                    ? 'Save changes'
                                    : 'Add settlement rule'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// --- Sub Components ---

const tabClass =
    'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';

function MiniStat({
    label,
    value,
    icon: Icon,
    trend,
    subtext,
}: {
    label: string;
    value: number;
    icon: any;
    trend?: string;
    subtext?: string;
}) {
    return (
        <Card className="h-full border-border bg-background shadow-sm">
            <CardContent className="flex h-full min-h-[140px] flex-col justify-between p-6">
                <div className="mb-4 flex items-start justify-between">
                    <p className="text-[10px] leading-tight font-bold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </p>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-foreground">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div className="mt-auto space-y-1.5">
                    <h3 className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {value.toLocaleString()}
                    </h3>
                    {trend ? (
                        <p className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            <TrendingUp className="h-3 w-3" /> {trend}
                        </p>
                    ) : subtext ? (
                        <p className="text-xs font-medium text-muted-foreground">
                            {subtext}
                        </p>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
            {error && (
                <p className="text-xs font-bold text-destructive">{error}</p>
            )}
        </div>
    );
}

function CheckField({
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label
            className={`flex h-full cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${disabled ? 'cursor-not-allowed border-border/50 bg-muted/5 opacity-50' : checked ? 'border-foreground/30 bg-muted/10' : 'border-border bg-background hover:bg-muted/5'}`}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className="mt-0.5 shrink-0 border-border/50 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
            />
            <div className="space-y-1">
                <p className="text-sm leading-none font-bold text-foreground">
                    {label}
                </p>
                {description && (
                    <p className="text-xs leading-snug font-medium text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </label>
    );
}

function formatMoney(currency: string, amount: number) {
    return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function formatRecurringValue(currency: string, item: RecurringItem) {
    if (item.amount !== null) return formatMoney(currency, item.amount);
    const quantity = item.quantity ?? 0;
    const rate = item.rate ?? 0;
    return `${quantity} x ${formatMoney(currency, rate)}`;
}

function formatSettlementValue(rule: SettlementRule) {
    if (rule.allocation_method === 'FIXED_AMOUNT')
        return `${rule.currency} ${rule.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '0.00'}`;
    if (rule.allocation_method === 'PERCENTAGE')
        return `${rule.percentage?.toFixed(2) ?? '0.00'}% of net pay`;
    return 'Remaining balance';
}
