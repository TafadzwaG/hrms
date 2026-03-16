// 1. The Dialog-style Alert (requires user interaction)
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

// 2. The Inline Alert (for displaying messages)
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useAuthorization } from '@/lib/authorization';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Brush,
    Building2,
    HardDrive,
    Palette,
    Save,
    Settings,
    Shield,
} from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';

type BackupsPayload = {
    enable_automatic_backups: boolean;
    backup_frequency: 'daily' | 'weekly';
    backup_day_of_week:
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday';
    backup_time: string;
    backup_retention_days: number;
    backup_local_enabled: boolean;
    backup_local_path: string;
    backup_email_enabled: boolean;
    backup_email_recipients: string[];
    backup_include_database: boolean;
    backup_include_uploads: boolean;
    backup_email_subject_prefix: string | null;
    backup_email_message: string | null;
    last_backup_at: string | null;
    last_backup_status: string | null;
    last_backup_file: string | null;
    last_backup_error: string | null;
};

type OptionsPayload = {
    timezones: string[];
    backup_frequencies: Array<'daily' | 'weekly'>;
    days_of_week: Array<
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday'
    >;
};

type LinksPayload = {
    general_update: string;
    branding_theme_update: string;
    branding_system_logo: string;
    branding_company_logo: string;
    preferences_update: string;
    backups_update: string;
    backups_run: string;
};

type PageProps = {
    system: {
        system_name: string;
        system_short_name: string | null;
        system_logo_url: string | null;
        system_logo_path: string | null;
    };
    company: {
        organization_id: number | null;
        company_name: string | null;
        company_email: string | null;
        company_phone: string | null;
        company_address: string | null;
        company_website: string | null;
        support_email: string | null;
        default_timezone: string | null;
        default_currency: string | null;
        date_format: string | null;
        company_logo_url: string | null;
        company_logo_path: string | null;
    };
    branding: {
        primary_color: string | null;
        secondary_color: string | null;
        accent_color: string | null;
    };
    preferences: {
        pagination_size: number;
        default_locale: string | null;
        maintenance_banner: string | null;
        employee_code_prefix: string | null;
        payslip_footer_text: string | null;
        report_footer_text: string | null;
    };
    backups: BackupsPayload;
    options: OptionsPayload;
    links: LinksPayload;
    flash?: { success?: string | null; error?: string | null };
};

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>
    );
}

function formatDayLabel(day: string) {
    return day.charAt(0).toUpperCase() + day.slice(1);
}

function statusBadgeVariant(status: string | null) {
    switch ((status ?? '').toLowerCase()) {
        case 'success':
        case 'sent':
        case 'completed':
            return 'default';
        case 'queued':
        case 'running':
            return 'secondary';
        case 'failed':
        case 'error':
            return 'destructive';
        default:
            return 'outline';
    }
}

const UNSET_SELECT_VALUE = '__unset__';

export default function SystemSettingsIndex() {
    const {
        system,
        company,
        branding,
        preferences,
        backups,
        options,
        links,
        flash,
    } = usePage<PageProps>().props;

    const { can } = useAuthorization();

    const canManageGeneral = can('settings.manage');
    const canManageBranding = can('branding.manage');
    const canManageBackups = can('backups.manage');
    const canRunBackups = can('backups.run');

    const hasActiveOrg = Boolean(company.organization_id);

    const generalForm = useForm({
        system_name: system.system_name ?? '',
        system_short_name: system.system_short_name ?? '',
        company_name: company.company_name ?? '',
        company_email: company.company_email ?? '',
        company_phone: company.company_phone ?? '',
        company_address: company.company_address ?? '',
        company_website: company.company_website ?? '',
        support_email: company.support_email ?? '',
        default_timezone: company.default_timezone ?? '',
        default_currency: company.default_currency ?? '',
        date_format: company.date_format ?? '',
    });

    const themeForm = useForm({
        primary_color: branding.primary_color ?? '',
        secondary_color: branding.secondary_color ?? '',
        accent_color: branding.accent_color ?? '',
    });

    const systemLogoForm = useForm<{ system_logo: File | null }>({
        system_logo: null,
    });

    const companyLogoForm = useForm<{ company_logo: File | null }>({
        company_logo: null,
    });

    const preferencesForm = useForm({
        pagination_size: preferences.pagination_size ?? 15,
        default_locale: preferences.default_locale ?? '',
        maintenance_banner: preferences.maintenance_banner ?? '',
        employee_code_prefix: preferences.employee_code_prefix ?? '',
        payslip_footer_text: preferences.payslip_footer_text ?? '',
        report_footer_text: preferences.report_footer_text ?? '',
    });

    const recipientsCsv = useMemo(() => {
        return (backups.backup_email_recipients ?? []).join(', ');
    }, [backups.backup_email_recipients]);

    const backupsForm = useForm({
        enable_automatic_backups: backups.enable_automatic_backups ?? false,
        backup_frequency: backups.backup_frequency ?? 'daily',
        backup_day_of_week: backups.backup_day_of_week ?? 'sunday',
        backup_time: backups.backup_time ?? '02:00',
        backup_retention_days: backups.backup_retention_days ?? 14,
        backup_local_enabled: backups.backup_local_enabled ?? true,
        backup_local_path: backups.backup_local_path ?? 'backups',
        backup_email_enabled: backups.backup_email_enabled ?? false,
        backup_email_recipients: recipientsCsv,
        backup_include_database: backups.backup_include_database ?? true,
        backup_include_uploads: backups.backup_include_uploads ?? false,
        backup_email_subject_prefix: backups.backup_email_subject_prefix ?? '',
        backup_email_message: backups.backup_email_message ?? '',
    });

    const runBackupForm = useForm({});
    const [confirmRunBackup, setConfirmRunBackup] = useState(false);

    const submitGeneral = (e: FormEvent) => {
        e.preventDefault();
        generalForm.put(links.general_update, { preserveScroll: true });
    };

    const submitTheme = (e: FormEvent) => {
        e.preventDefault();
        themeForm.put(links.branding_theme_update, { preserveScroll: true });
    };

    const submitSystemLogo = (e: FormEvent) => {
        e.preventDefault();
        systemLogoForm.post(links.branding_system_logo, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => systemLogoForm.setData('system_logo', null),
        });
    };

    const submitCompanyLogo = (e: FormEvent) => {
        e.preventDefault();
        companyLogoForm.post(links.branding_company_logo, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => companyLogoForm.setData('company_logo', null),
        });
    };

    const submitPreferences = (e: FormEvent) => {
        e.preventDefault();
        preferencesForm.put(links.preferences_update, { preserveScroll: true });
    };

    const submitBackups = (e: FormEvent) => {
        e.preventDefault();
        backupsForm.put(links.backups_update, { preserveScroll: true });
    };

    const triggerBackupRun = () => {
        runBackupForm.post(links.backups_run, {
            preserveScroll: true,
            onSuccess: () => setConfirmRunBackup(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'System Settings', href: '/system-settings' },
            ]}
        >
            <Head title="System Settings" />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                System Settings
                            </h1>
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 border border-border/50 bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none"
                            >
                                <Shield className="h-3 w-3" /> Admin control
                            </Badge>
                        </div>
                        <p className="max-w-2xl text-sm leading-relaxed font-medium text-muted-foreground">
                            Manage system identity, company branding, timezone,
                            operational preferences, and backup automation.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 border-border bg-background px-6 font-bold shadow-sm"
                        >
                            <a href="/control-center">
                                <Settings className="mr-2 h-4 w-4" /> Control
                                Center
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success ? (
                    <Alert className="border-border bg-background shadow-sm">
                        <Save className="h-4 w-4" />
                        <AlertTitle>Saved</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                ) : null}

                {flash?.error ? (
                    <Alert
                        variant="destructive"
                        className="border-border shadow-sm"
                    >
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Action blocked</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                ) : null}

                {!hasActiveOrg ? (
                    <Alert
                        variant="destructive"
                        className="border-border shadow-sm"
                    >
                        <Building2 className="h-4 w-4" />
                        <AlertTitle>No active organization</AlertTitle>
                        <AlertDescription>
                            Select an active organization to manage company and
                            tenant-specific settings.
                        </AlertDescription>
                    </Alert>
                ) : null}

                <Tabs defaultValue="general" className="w-full">
                    <div className="border-b border-border/60">
                        <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
                            <TabsTrigger value="general" className={tabClass}>
                                General
                            </TabsTrigger>
                            <TabsTrigger value="branding" className={tabClass}>
                                Branding
                            </TabsTrigger>
                            <TabsTrigger
                                value="preferences"
                                className={tabClass}
                            >
                                Preferences
                            </TabsTrigger>
                            <TabsTrigger value="backups" className={tabClass}>
                                Backups
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent
                        value="general"
                        className="mt-8 space-y-6 focus-visible:ring-0"
                    >
                        <form onSubmit={submitGeneral} className="space-y-6">
                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                        <Settings className="h-5 w-5 text-muted-foreground" />{' '}
                                        System Identity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:p-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="system_name">
                                            System Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="system_name"
                                            value={generalForm.data.system_name}
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'system_name',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={!canManageGeneral}
                                            placeholder="HRMS Enterprise Portal"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors.system_name
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="system_short_name">
                                            System Short Name
                                        </Label>
                                        <Input
                                            id="system_short_name"
                                            value={
                                                generalForm.data
                                                    .system_short_name
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'system_short_name',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={!canManageGeneral}
                                            placeholder="HRMS"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors
                                                    .system_short_name
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />{' '}
                                        Company Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:p-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">
                                            Company Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="company_name"
                                            value={
                                                generalForm.data.company_name
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="Acme Holdings"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors.company_name
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_email">
                                            Company Email
                                        </Label>
                                        <Input
                                            id="company_email"
                                            type="email"
                                            value={
                                                generalForm.data.company_email
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'company_email',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="info@company.com"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors.company_email
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_phone">
                                            Company Phone
                                        </Label>
                                        <Input
                                            id="company_phone"
                                            value={
                                                generalForm.data.company_phone
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'company_phone',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="+263 77 000 0000"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors.company_phone
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company_website">
                                            Company Website
                                        </Label>
                                        <Input
                                            id="company_website"
                                            value={
                                                generalForm.data.company_website
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'company_website',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="https://company.com"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors
                                                    .company_website
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="support_email">
                                            Support Email
                                        </Label>
                                        <Input
                                            id="support_email"
                                            type="email"
                                            value={
                                                generalForm.data.support_email
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'support_email',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="support@company.com"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors.support_email
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="default_timezone">
                                            Default Timezone
                                        </Label>
                                        <Select
                                            value={
                                                generalForm.data
                                                    .default_timezone ||
                                                UNSET_SELECT_VALUE
                                            }
                                            onValueChange={(value) =>
                                                generalForm.setData(
                                                    'default_timezone',
                                                    value === UNSET_SELECT_VALUE
                                                        ? ''
                                                        : value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                        >
                                            <SelectTrigger id="default_timezone">
                                                <SelectValue placeholder="Select timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={UNSET_SELECT_VALUE}
                                                >
                                                    (Not set)
                                                </SelectItem>
                                                {options.timezones.map((tz) => (
                                                    <SelectItem
                                                        key={tz}
                                                        value={tz}
                                                    >
                                                        {tz}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            message={
                                                generalForm.errors
                                                    .default_timezone
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="default_currency">
                                            Default Currency
                                        </Label>
                                        <Input
                                            id="default_currency"
                                            value={
                                                generalForm.data
                                                    .default_currency
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'default_currency',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="USD"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors
                                                    .default_currency
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_format">
                                            Date Format
                                        </Label>
                                        <Input
                                            id="date_format"
                                            value={generalForm.data.date_format}
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'date_format',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="Y-m-d"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors.date_format
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="company_address">
                                            Company Address
                                        </Label>
                                        <Textarea
                                            id="company_address"
                                            value={
                                                generalForm.data.company_address
                                            }
                                            onChange={(e) =>
                                                generalForm.setData(
                                                    'company_address',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            rows={3}
                                            placeholder="Street, city, country"
                                        />
                                        <FieldError
                                            message={
                                                generalForm.errors
                                                    .company_address
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {canManageGeneral ? (
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                                        disabled={
                                            generalForm.processing ||
                                            !hasActiveOrg
                                        }
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {generalForm.processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            ) : null}
                        </form>
                    </TabsContent>

                    <TabsContent
                        value="branding"
                        className="mt-8 space-y-6 focus-visible:ring-0"
                    >
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                        <Brush className="h-5 w-5 text-muted-foreground" />{' '}
                                        System Logo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6 md:p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-muted/10">
                                            {system.system_logo_url ? (
                                                <img
                                                    src={system.system_logo_url}
                                                    alt="System logo"
                                                    className="h-10 w-10 rounded object-contain"
                                                />
                                            ) : (
                                                <Palette className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-foreground">
                                                {system.system_name}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                                                Upload a square PNG/JPG (max
                                                2MB).
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={submitSystemLogo}
                                        className="space-y-3"
                                    >
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={!canManageBranding}
                                            onChange={(e) =>
                                                systemLogoForm.setData(
                                                    'system_logo',
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={
                                                systemLogoForm.errors
                                                    .system_logo
                                            }
                                        />
                                        {canManageBranding ? (
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="h-11 w-full border-border bg-background font-bold shadow-sm"
                                                disabled={
                                                    systemLogoForm.processing ||
                                                    !systemLogoForm.data
                                                        .system_logo
                                                }
                                            >
                                                {systemLogoForm.processing
                                                    ? 'Uploading...'
                                                    : 'Upload System Logo'}
                                            </Button>
                                        ) : null}
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />{' '}
                                        Company Logo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6 md:p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-muted/10">
                                            {company.company_logo_url ? (
                                                <img
                                                    src={
                                                        company.company_logo_url
                                                    }
                                                    alt="Company logo"
                                                    className="h-10 w-10 rounded object-contain"
                                                />
                                            ) : (
                                                <Building2 className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-foreground">
                                                {company.company_name ||
                                                    'Company'}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                                                Stored per organization.
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={submitCompanyLogo}
                                        className="space-y-3"
                                    >
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={
                                                !canManageBranding ||
                                                !hasActiveOrg
                                            }
                                            onChange={(e) =>
                                                companyLogoForm.setData(
                                                    'company_logo',
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={
                                                companyLogoForm.errors
                                                    .company_logo
                                            }
                                        />
                                        {canManageBranding ? (
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="h-11 w-full border-border bg-background font-bold shadow-sm"
                                                disabled={
                                                    companyLogoForm.processing ||
                                                    !companyLogoForm.data
                                                        .company_logo ||
                                                    !hasActiveOrg
                                                }
                                            >
                                                {companyLogoForm.processing
                                                    ? 'Uploading...'
                                                    : 'Upload Company Logo'}
                                            </Button>
                                        ) : null}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <Palette className="h-5 w-5 text-muted-foreground" />{' '}
                                    Theme Colors
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <form
                                    onSubmit={submitTheme}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="primary_color">
                                                Primary Color
                                            </Label>
                                            <Input
                                                id="primary_color"
                                                value={
                                                    themeForm.data.primary_color
                                                }
                                                onChange={(e) =>
                                                    themeForm.setData(
                                                        'primary_color',
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={
                                                    !canManageBranding ||
                                                    !hasActiveOrg
                                                }
                                                placeholder="oklch(...) or #000000"
                                            />
                                            <FieldError
                                                message={
                                                    themeForm.errors
                                                        .primary_color
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="secondary_color">
                                                Secondary Color
                                            </Label>
                                            <Input
                                                id="secondary_color"
                                                value={
                                                    themeForm.data
                                                        .secondary_color
                                                }
                                                onChange={(e) =>
                                                    themeForm.setData(
                                                        'secondary_color',
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={
                                                    !canManageBranding ||
                                                    !hasActiveOrg
                                                }
                                                placeholder="oklch(...) or #FFFFFF"
                                            />
                                            <FieldError
                                                message={
                                                    themeForm.errors
                                                        .secondary_color
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="accent_color">
                                                Accent Color
                                            </Label>
                                            <Input
                                                id="accent_color"
                                                value={
                                                    themeForm.data.accent_color
                                                }
                                                onChange={(e) =>
                                                    themeForm.setData(
                                                        'accent_color',
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={
                                                    !canManageBranding ||
                                                    !hasActiveOrg
                                                }
                                                placeholder="oklch(...) or #F59E0B"
                                            />
                                            <FieldError
                                                message={
                                                    themeForm.errors
                                                        .accent_color
                                                }
                                            />
                                        </div>
                                    </div>

                                    {canManageBranding ? (
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                                                disabled={
                                                    themeForm.processing ||
                                                    !hasActiveOrg
                                                }
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {themeForm.processing
                                                    ? 'Saving...'
                                                    : 'Save Theme'}
                                            </Button>
                                        </div>
                                    ) : null}
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent
                        value="preferences"
                        className="mt-8 space-y-6 focus-visible:ring-0"
                    >
                        <form
                            onSubmit={submitPreferences}
                            className="space-y-6"
                        >
                            <Card className="border-border bg-background shadow-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                        <Settings className="h-5 w-5 text-muted-foreground" />{' '}
                                        System Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:p-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="pagination_size">
                                            Default Pagination Size
                                        </Label>
                                        <Input
                                            id="pagination_size"
                                            type="number"
                                            min={5}
                                            max={200}
                                            value={
                                                preferencesForm.data
                                                    .pagination_size
                                            }
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                preferencesForm.setData(
                                                    'pagination_size',
                                                    raw === ''
                                                        ? ('' as unknown as number)
                                                        : Number(raw),
                                                );
                                            }}
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                        />
                                        <FieldError
                                            message={
                                                preferencesForm.errors
                                                    .pagination_size
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="default_locale">
                                            Default Locale
                                        </Label>
                                        <Input
                                            id="default_locale"
                                            value={
                                                preferencesForm.data
                                                    .default_locale
                                            }
                                            onChange={(e) =>
                                                preferencesForm.setData(
                                                    'default_locale',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="en"
                                        />
                                        <FieldError
                                            message={
                                                preferencesForm.errors
                                                    .default_locale
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="employee_code_prefix">
                                            Employee Code Prefix
                                        </Label>
                                        <Input
                                            id="employee_code_prefix"
                                            value={
                                                preferencesForm.data
                                                    .employee_code_prefix
                                            }
                                            onChange={(e) =>
                                                preferencesForm.setData(
                                                    'employee_code_prefix',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            placeholder="EMP-"
                                        />
                                        <FieldError
                                            message={
                                                preferencesForm.errors
                                                    .employee_code_prefix
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="maintenance_banner">
                                            Maintenance Banner (optional)
                                        </Label>
                                        <Textarea
                                            id="maintenance_banner"
                                            value={
                                                preferencesForm.data
                                                    .maintenance_banner
                                            }
                                            onChange={(e) =>
                                                preferencesForm.setData(
                                                    'maintenance_banner',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            rows={3}
                                            placeholder="Shown at the top of the system when set."
                                        />
                                        <FieldError
                                            message={
                                                preferencesForm.errors
                                                    .maintenance_banner
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="payslip_footer_text">
                                            Payslip Footer Text
                                        </Label>
                                        <Textarea
                                            id="payslip_footer_text"
                                            value={
                                                preferencesForm.data
                                                    .payslip_footer_text
                                            }
                                            onChange={(e) =>
                                                preferencesForm.setData(
                                                    'payslip_footer_text',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            rows={3}
                                            placeholder="Displayed on employee payslips."
                                        />
                                        <FieldError
                                            message={
                                                preferencesForm.errors
                                                    .payslip_footer_text
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="report_footer_text">
                                            Report Footer Text
                                        </Label>
                                        <Textarea
                                            id="report_footer_text"
                                            value={
                                                preferencesForm.data
                                                    .report_footer_text
                                            }
                                            onChange={(e) =>
                                                preferencesForm.setData(
                                                    'report_footer_text',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={
                                                !canManageGeneral ||
                                                !hasActiveOrg
                                            }
                                            rows={3}
                                            placeholder="Displayed on exports and report PDFs."
                                        />
                                        <FieldError
                                            message={
                                                preferencesForm.errors
                                                    .report_footer_text
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {canManageGeneral ? (
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                                        disabled={
                                            preferencesForm.processing ||
                                            !hasActiveOrg
                                        }
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {preferencesForm.processing
                                            ? 'Saving...'
                                            : 'Save Preferences'}
                                    </Button>
                                </div>
                            ) : null}
                        </form>
                    </TabsContent>

                    <TabsContent
                        value="backups"
                        className="mt-8 space-y-6 focus-visible:ring-0"
                    >
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            <div className="space-y-6 lg:col-span-8">
                                <form
                                    onSubmit={submitBackups}
                                    className="space-y-6"
                                >
                                    <Card className="border-border bg-background shadow-sm">
                                        <CardHeader className="border-b border-border/50 pb-4">
                                            <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                                <HardDrive className="h-5 w-5 text-muted-foreground" />{' '}
                                                Backup Configuration
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6 p-6 md:p-8">
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>
                                                        Automatic Backups
                                                    </Label>
                                                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                backupsForm.data
                                                                    .enable_automatic_backups
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'enable_automatic_backups',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                        />
                                                        <span className="text-sm font-medium text-foreground">
                                                            Enable scheduled
                                                            backups
                                                        </span>
                                                    </div>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .enable_automatic_backups
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Backup Frequency
                                                    </Label>
                                                    <Select
                                                        value={
                                                            backupsForm.data
                                                                .backup_frequency
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            backupsForm.setData(
                                                                'backup_frequency',
                                                                value as
                                                                    | 'daily'
                                                                    | 'weekly',
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {options.backup_frequencies.map(
                                                                (freq) => (
                                                                    <SelectItem
                                                                        key={
                                                                            freq
                                                                        }
                                                                        value={
                                                                            freq
                                                                        }
                                                                    >
                                                                        {freq.toUpperCase()}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_frequency
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Day of Week</Label>
                                                    <Select
                                                        value={
                                                            backupsForm.data
                                                                .backup_day_of_week
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            backupsForm.setData(
                                                                'backup_day_of_week',
                                                                value as BackupsPayload['backup_day_of_week'],
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups ||
                                                            backupsForm.data
                                                                .backup_frequency !==
                                                                'weekly'
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {options.days_of_week.map(
                                                                (day) => (
                                                                    <SelectItem
                                                                        key={
                                                                            day
                                                                        }
                                                                        value={
                                                                            day
                                                                        }
                                                                    >
                                                                        {formatDayLabel(
                                                                            day,
                                                                        )}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_day_of_week
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Backup Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={
                                                            backupsForm.data
                                                                .backup_time
                                                        }
                                                        onChange={(e) =>
                                                            backupsForm.setData(
                                                                'backup_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups
                                                        }
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_time
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Retention (days)
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={365}
                                                        value={
                                                            backupsForm.data
                                                                .backup_retention_days
                                                        }
                                                        onChange={(e) =>
                                                            backupsForm.setData(
                                                                'backup_retention_days',
                                                                Number(
                                                                    e.target
                                                                        .value ||
                                                                        0,
                                                                ),
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups
                                                        }
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_retention_days
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Local Storage</Label>
                                                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                backupsForm.data
                                                                    .backup_local_enabled
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'backup_local_enabled',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                        />
                                                        <span className="text-sm font-medium text-foreground">
                                                            Store backups on the
                                                            server
                                                        </span>
                                                    </div>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_local_enabled
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>
                                                        Backup Folder (private
                                                        disk)
                                                    </Label>
                                                    <Input
                                                        value={
                                                            backupsForm.data
                                                                .backup_local_path
                                                        }
                                                        onChange={(e) =>
                                                            backupsForm.setData(
                                                                'backup_local_path',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups
                                                        }
                                                        placeholder="backups"
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_local_path
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Email Delivery
                                                    </Label>
                                                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                backupsForm.data
                                                                    .backup_email_enabled
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'backup_email_enabled',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                        />
                                                        <span className="text-sm font-medium text-foreground">
                                                            Email backup after
                                                            creation
                                                        </span>
                                                    </div>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_email_enabled
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Include Database
                                                    </Label>
                                                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                backupsForm.data
                                                                    .backup_include_database
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'backup_include_database',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                        />
                                                        <span className="text-sm font-medium text-foreground">
                                                            Dump database
                                                        </span>
                                                    </div>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_include_database
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>
                                                        Include Uploads
                                                        (optional)
                                                    </Label>
                                                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                backupsForm.data
                                                                    .backup_include_uploads
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'backup_include_uploads',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                        />
                                                        <span className="text-sm font-medium text-foreground">
                                                            Attach uploads
                                                            archive (can be
                                                            large)
                                                        </span>
                                                    </div>
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_include_uploads
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>
                                                        Email Recipients (comma
                                                        separated)
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            backupsForm.data
                                                                .backup_email_recipients
                                                        }
                                                        onChange={(e) =>
                                                            backupsForm.setData(
                                                                'backup_email_recipients',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups ||
                                                            !backupsForm.data
                                                                .backup_email_enabled
                                                        }
                                                        rows={2}
                                                        placeholder="admin@company.com, it@company.com"
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_email_recipients
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>
                                                        Email Subject Prefix
                                                        (optional)
                                                    </Label>
                                                    <Input
                                                        value={
                                                            backupsForm.data
                                                                .backup_email_subject_prefix
                                                        }
                                                        onChange={(e) =>
                                                            backupsForm.setData(
                                                                'backup_email_subject_prefix',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups ||
                                                            !backupsForm.data
                                                                .backup_email_enabled
                                                        }
                                                        placeholder="[HRMS]"
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_email_subject_prefix
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>
                                                        Email Message (optional)
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            backupsForm.data
                                                                .backup_email_message
                                                        }
                                                        onChange={(e) =>
                                                            backupsForm.setData(
                                                                'backup_email_message',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageBackups ||
                                                            !backupsForm.data
                                                                .backup_email_enabled
                                                        }
                                                        rows={3}
                                                        placeholder="Backup created automatically by HRMS."
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_email_message
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {canManageBackups ? (
                                                <div className="flex justify-end">
                                                    <Button
                                                        type="submit"
                                                        className="h-11 bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90"
                                                        disabled={
                                                            backupsForm.processing
                                                        }
                                                    >
                                                        <Save className="mr-2 h-4 w-4" />
                                                        {backupsForm.processing
                                                            ? 'Saving...'
                                                            : 'Save Backup Settings'}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Alert className="border-border bg-muted/10">
                                                    <Shield className="h-4 w-4" />
                                                    <AlertTitle>
                                                        No backup permissions
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        You can view backup
                                                        status, but you do not
                                                        have permission to
                                                        update backup settings.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                </form>
                            </div>

                            <div className="space-y-6 lg:col-span-4">
                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                            <HardDrive className="h-4 w-4" />{' '}
                                            Backup Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-muted-foreground uppercase">
                                                Last status
                                            </span>
                                            <Badge
                                                variant={statusBadgeVariant(
                                                    backups.last_backup_status,
                                                )}
                                                className="text-[10px] font-bold tracking-widest uppercase"
                                            >
                                                {backups.last_backup_status ||
                                                    'unknown'}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">
                                                Last run
                                            </p>
                                            <p className="text-sm font-medium text-foreground">
                                                {backups.last_backup_at ||
                                                    'Not yet run'}
                                            </p>
                                        </div>
                                        {backups.last_backup_file ? (
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">
                                                    Latest file
                                                </p>
                                                <p className="text-sm font-medium break-all text-foreground">
                                                    {backups.last_backup_file}
                                                </p>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="mt-2 h-10 w-full border-border bg-background font-bold shadow-sm"
                                                    disabled={!canManageBackups}
                                                >
                                                    <a
                                                        href={`/system-settings/backups/download/${encodeURIComponent(
                                                            backups.last_backup_file,
                                                        )}`}
                                                    >
                                                        Download
                                                    </a>
                                                </Button>
                                                {!canManageBackups ? (
                                                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                                                        You need backup manage
                                                        permission to download.
                                                    </p>
                                                ) : null}
                                            </div>
                                        ) : null}

                                        {backups.last_backup_error ? (
                                            <Alert
                                                variant="destructive"
                                                className="border-border"
                                            >
                                                <Shield className="h-4 w-4" />
                                                <AlertTitle>
                                                    Last error
                                                </AlertTitle>
                                                <AlertDescription>
                                                    {backups.last_backup_error}
                                                </AlertDescription>
                                            </Alert>
                                        ) : null}
                                    </CardContent>
                                </Card>

                                <Card className="border-border bg-background shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                            <HardDrive className="h-4 w-4" />{' '}
                                            Manual Run
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                                            Trigger a database backup manually.
                                            For large datasets, this may take a
                                            few minutes.
                                        </p>
                                        <Button
                                            type="button"
                                            className="h-11 w-full bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90"
                                            disabled={
                                                !canRunBackups ||
                                                runBackupForm.processing
                                            }
                                            onClick={() =>
                                                setConfirmRunBackup(true)
                                            }
                                        >
                                            {runBackupForm.processing
                                                ? 'Queuing...'
                                                : 'Run Backup Now'}
                                        </Button>
                                        {!canRunBackups ? (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                You do not have permission to
                                                run backups.
                                            </p>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <AlertDialog
                open={confirmRunBackup}
                onOpenChange={setConfirmRunBackup}
            >
                <AlertDialogContent className="p-6 sm:max-w-[480px]">
                    <AlertDialogHeader className="pb-2">
                        <AlertDialogTitle className="text-xl font-extrabold text-foreground">
                            Run backup now?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                            This will generate a database backup using the
                            current configuration. Large backups may take a few
                            minutes to complete.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
                        <AlertDialogCancel className="mt-0 h-11 w-full border-border px-8 font-bold shadow-sm sm:mt-0 sm:w-auto">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={triggerBackupRun}
                            className="h-11 w-full bg-foreground px-8 font-bold text-background shadow-sm hover:bg-foreground/90 sm:w-auto"
                            disabled={
                                runBackupForm.processing || !canRunBackups
                            }
                        >
                            Confirm Run
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

const tabClass =
    'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
