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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    Globe2,
    HardDrive,
    Palette,
    RefreshCw,
    Save,
    Settings,
    Shield,
    UploadCloud,
    type LucideIcon,
} from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

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

type SettingsTab = 'general' | 'branding' | 'preferences' | 'backups';

const UNSET_SELECT_VALUE = '__unset__';
const surfaceClass =
    'rounded-2xl border border-border/70 bg-background shadow-sm';

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>
    );
}

function SectionIntro({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="space-y-3 lg:pr-8">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function isHexColor(value: string) {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function ColorField({
    label,
    value,
    onChange,
    disabled,
    error,
    fallback,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    error?: string;
    fallback: string;
    placeholder: string;
}) {
    const pickerValue = isHexColor(value) ? value : fallback;

    return (
        <div className="space-y-2">
            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {label}
            </Label>

            <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={pickerValue}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                    />

                    <div
                        className="h-10 w-10 rounded-xl border border-border/70 shadow-sm"
                        style={{ backgroundColor: pickerValue }}
                    />

                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                </div>
            </div>

            <FieldError message={error} />
        </div>
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

function activityDotClass(status: string | null) {
    switch ((status ?? '').toLowerCase()) {
        case 'success':
        case 'sent':
        case 'completed':
            return 'bg-emerald-500';
        case 'failed':
        case 'error':
            return 'bg-red-500';
        case 'queued':
        case 'running':
            return 'bg-amber-500';
        default:
            return 'bg-muted-foreground/60';
    }
}

function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DropzoneUploadCard({
    title,
    subtitle,
    existingUrl,
    file,
    onFileSelect,
    onSubmit,
    error,
    disabled,
    processing,
    Icon,
    buttonLabel,
}: {
    title: string;
    subtitle: string;
    existingUrl: string | null;
    file: File | null;
    onFileSelect: (file: File | null) => void;
    onSubmit: (e: FormEvent) => void;
    error?: string;
    disabled: boolean;
    processing: boolean;
    Icon: LucideIcon;
    buttonLabel: string;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }

        setPreviewUrl(existingUrl ?? null);
    }, [file, existingUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            onFileSelect(acceptedFiles[0] ?? null);
        },
        multiple: false,
        maxFiles: 1,
        disabled,
        accept: {
            'image/*': [],
        },
    });

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <Label className="text-sm font-medium">{title}</Label>

            <div
                {...getRootProps()}
                className={[
                    'cursor-pointer rounded-2xl border-2 border-dashed p-6 transition',
                    isDragActive
                        ? 'border-foreground bg-muted/40'
                        : 'border-border bg-muted/20 hover:bg-muted/30',
                    disabled ? 'cursor-not-allowed opacity-60' : '',
                ].join(' ')}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt={title}
                                className="h-12 w-12 rounded-xl object-contain"
                            />
                        ) : (
                            <Icon className="h-7 w-7 text-muted-foreground" />
                        )}
                    </div>

                    <p className="text-sm font-semibold text-foreground">
                        {title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {subtitle}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <UploadCloud className="h-4 w-4" />
                        {isDragActive
                            ? 'Drop the file here'
                            : 'Drag & drop or click to browse'}
                    </div>

                    {file ? (
                        <div className="mt-4 rounded-xl border border-border/70 bg-background px-3 py-2 text-xs text-foreground">
                            <div className="font-medium">{file.name}</div>
                            <div className="text-muted-foreground">
                                {formatFileSize(file.size)}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <FieldError message={error} />

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl"
                    onClick={() => onFileSelect(null)}
                    disabled={disabled || processing || !file}
                >
                    Clear
                </Button>

                <Button
                    type="submit"
                    variant="outline"
                    className="h-10 rounded-xl"
                    disabled={disabled || processing || !file}
                >
                    {processing ? 'Uploading...' : buttonLabel}
                </Button>
            </div>
        </form>
    );
}

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
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

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
            onSuccess: () => systemLogoForm.reset(),
        });
    };

    const submitCompanyLogo = (e: FormEvent) => {
        e.preventDefault();
        companyLogoForm.post(links.branding_company_logo, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => companyLogoForm.reset(),
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

    const discardActiveTabChanges = () => {
        switch (activeTab) {
            case 'general':
                generalForm.reset();
                break;
            case 'branding':
                themeForm.reset();
                systemLogoForm.reset();
                companyLogoForm.reset();
                break;
            case 'preferences':
                preferencesForm.reset();
                break;
            case 'backups':
                backupsForm.reset();
                break;
        }
    };

    const activeTabProcessing =
        generalForm.processing ||
        themeForm.processing ||
        systemLogoForm.processing ||
        companyLogoForm.processing ||
        preferencesForm.processing ||
        backupsForm.processing ||
        runBackupForm.processing;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'System Settings', href: '/system-settings' },
            ]}
        >
            <Head title="System Settings" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10">
                <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-10 xl:px-12">
                    <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    System Settings
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-none"
                                >
                                    <Shield className="mr-1.5 h-3.5 w-3.5" />
                                    Admin control
                                </Badge>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Configure global parameters, branding,
                                preferences, and backup operations for your
                                HRMS.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 rounded-xl border-border/70 bg-background px-4"
                            >
                                <a href="/control-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Control Center
                                </a>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-xl border-border/70 bg-background px-4"
                                onClick={discardActiveTabChanges}
                                disabled={activeTabProcessing}
                            >
                                Discard Changes
                            </Button>
                        </div>
                    </header>

                    <div className="space-y-4">
                        {flash?.success ? (
                            <Alert className="border-border/70 bg-background shadow-sm">
                                <Save className="h-4 w-4" />
                                <AlertTitle>Saved</AlertTitle>
                                <AlertDescription>
                                    {flash.success}
                                </AlertDescription>
                            </Alert>
                        ) : null}

                        {flash?.error ? (
                            <Alert
                                variant="destructive"
                                className="border-border/70 shadow-sm"
                            >
                                <Shield className="h-4 w-4" />
                                <AlertTitle>Action blocked</AlertTitle>
                                <AlertDescription>
                                    {flash.error}
                                </AlertDescription>
                            </Alert>
                        ) : null}

                        {!hasActiveOrg ? (
                            <Alert
                                variant="destructive"
                                className="border-border/70 shadow-sm"
                            >
                                <Building2 className="h-4 w-4" />
                                <AlertTitle>No active organization</AlertTitle>
                                <AlertDescription>
                                    Select an active organization to manage
                                    company and tenant-specific settings.
                                </AlertDescription>
                            </Alert>
                        ) : null}
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={(value) =>
                            setActiveTab(value as SettingsTab)
                        }
                        className="mt-8 w-full"
                    >
                        <div className="mb-8 border-b border-border/70">
                            <TabsList className="h-auto w-full justify-start gap-8 rounded-none bg-transparent p-0">
                                <TabsTrigger
                                    value="general"
                                    className={tabClass}
                                >
                                    General
                                </TabsTrigger>
                                <TabsTrigger
                                    value="branding"
                                    className={tabClass}
                                >
                                    Branding
                                </TabsTrigger>
                                <TabsTrigger
                                    value="preferences"
                                    className={tabClass}
                                >
                                    Preferences
                                </TabsTrigger>
                                <TabsTrigger
                                    value="backups"
                                    className={tabClass}
                                >
                                    Backups
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent
                            value="general"
                            className="mt-0 space-y-6 focus-visible:ring-0"
                        >
                            <form
                                onSubmit={submitGeneral}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    <SectionIntro
                                        icon={Building2}
                                        title="Company Identity"
                                        description="Essential information used across system communications, reports, and default organization settings."
                                    />

                                    <Card
                                        className={`${surfaceClass} lg:col-span-2`}
                                    >
                                        <CardContent className="space-y-8 p-6 md:p-8">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="system_name">
                                                        System Name{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="system_name"
                                                        value={
                                                            generalForm.data
                                                                .system_name
                                                        }
                                                        onChange={(e) =>
                                                            generalForm.setData(
                                                                'system_name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageGeneral
                                                        }
                                                        placeholder="HRMS Enterprise Portal"
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .system_name
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
                                                        disabled={
                                                            !canManageGeneral
                                                        }
                                                        placeholder="HRMS"
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .system_short_name
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="h-px bg-border/70" />

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                                                            generalForm.data
                                                                .company_name
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .company_name
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
                                                            generalForm.data
                                                                .support_email
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .support_email
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
                                                            generalForm.data
                                                                .company_email
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .company_email
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
                                                            generalForm.data
                                                                .company_phone
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .company_phone
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
                                                            generalForm.data
                                                                .company_website
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .company_website
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
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            generalForm.setData(
                                                                'default_timezone',
                                                                value ===
                                                                    UNSET_SELECT_VALUE
                                                                    ? ''
                                                                    : value,
                                                            )
                                                        }
                                                        disabled={
                                                            !canManageGeneral ||
                                                            !hasActiveOrg
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="default_timezone"
                                                            className="h-11 rounded-xl"
                                                        >
                                                            <SelectValue placeholder="Select timezone" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value={
                                                                    UNSET_SELECT_VALUE
                                                                }
                                                            >
                                                                (Not set)
                                                            </SelectItem>
                                                            {options.timezones.map(
                                                                (tz) => (
                                                                    <SelectItem
                                                                        key={tz}
                                                                        value={
                                                                            tz
                                                                        }
                                                                    >
                                                                        {tz}
                                                                    </SelectItem>
                                                                ),
                                                            )}
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
                                                        className="h-11 rounded-xl"
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
                                                        value={
                                                            generalForm.data
                                                                .date_format
                                                        }
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .date_format
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
                                                            generalForm.data
                                                                .company_address
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
                                                        rows={4}
                                                        placeholder="Street, city, country"
                                                        className="rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            generalForm.errors
                                                                .company_address
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {canManageGeneral ? (
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
                                            disabled={
                                                generalForm.processing ||
                                                !hasActiveOrg
                                            }
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {generalForm.processing
                                                ? 'Saving...'
                                                : 'Save Settings'}
                                        </Button>
                                    </div>
                                ) : null}
                            </form>
                        </TabsContent>

                        <TabsContent
                            value="branding"
                            className="mt-0 space-y-6 focus-visible:ring-0"
                        >
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                <SectionIntro
                                    icon={Brush}
                                    title="Visual Identity"
                                    description="Customize the portal look and feel with logos and theme colors."
                                />

                                <div className="space-y-6 lg:col-span-2">
                                    <Card className={surfaceClass}>
                                        <CardContent className="space-y-8 p-6 md:p-8">
                                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                                <DropzoneUploadCard
                                                    title="System Logo"
                                                    subtitle="PNG, JPG, SVG up to 2MB"
                                                    existingUrl={
                                                        system.system_logo_url
                                                    }
                                                    file={
                                                        systemLogoForm.data
                                                            .system_logo
                                                    }
                                                    onFileSelect={(file) =>
                                                        systemLogoForm.setData(
                                                            'system_logo',
                                                            file,
                                                        )
                                                    }
                                                    onSubmit={submitSystemLogo}
                                                    error={
                                                        systemLogoForm.errors
                                                            .system_logo
                                                    }
                                                    disabled={
                                                        !canManageBranding
                                                    }
                                                    processing={
                                                        systemLogoForm.processing
                                                    }
                                                    Icon={Palette}
                                                    buttonLabel="Upload System Logo"
                                                />

                                                <DropzoneUploadCard
                                                    title="Company Logo"
                                                    subtitle="Stored per organization"
                                                    existingUrl={
                                                        company.company_logo_url
                                                    }
                                                    file={
                                                        companyLogoForm.data
                                                            .company_logo
                                                    }
                                                    onFileSelect={(file) =>
                                                        companyLogoForm.setData(
                                                            'company_logo',
                                                            file,
                                                        )
                                                    }
                                                    onSubmit={submitCompanyLogo}
                                                    error={
                                                        companyLogoForm.errors
                                                            .company_logo
                                                    }
                                                    disabled={
                                                        !canManageBranding ||
                                                        !hasActiveOrg
                                                    }
                                                    processing={
                                                        companyLogoForm.processing
                                                    }
                                                    Icon={Building2}
                                                    buttonLabel="Upload Company Logo"
                                                />
                                            </div>

                                            <div className="border-t border-border/70 pt-6">
                                                <div className="mb-5 flex items-center gap-2">
                                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                                    <h4 className="text-sm font-semibold text-foreground">
                                                        Theme Colors
                                                    </h4>
                                                </div>

                                                <form
                                                    onSubmit={submitTheme}
                                                    className="space-y-6"
                                                >
                                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                                        <ColorField
                                                            label="Primary"
                                                            value={
                                                                themeForm.data
                                                                    .primary_color
                                                            }
                                                            onChange={(value) =>
                                                                themeForm.setData(
                                                                    'primary_color',
                                                                    value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBranding ||
                                                                !hasActiveOrg
                                                            }
                                                            error={
                                                                themeForm.errors
                                                                    .primary_color
                                                            }
                                                            fallback="#18181B"
                                                            placeholder="#18181B or oklch(...)"
                                                        />

                                                        <ColorField
                                                            label="Secondary"
                                                            value={
                                                                themeForm.data
                                                                    .secondary_color
                                                            }
                                                            onChange={(value) =>
                                                                themeForm.setData(
                                                                    'secondary_color',
                                                                    value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBranding ||
                                                                !hasActiveOrg
                                                            }
                                                            error={
                                                                themeForm.errors
                                                                    .secondary_color
                                                            }
                                                            fallback="#F4F4F5"
                                                            placeholder="#F4F4F5 or oklch(...)"
                                                        />

                                                        <ColorField
                                                            label="Accent"
                                                            value={
                                                                themeForm.data
                                                                    .accent_color
                                                            }
                                                            onChange={(value) =>
                                                                themeForm.setData(
                                                                    'accent_color',
                                                                    value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBranding ||
                                                                !hasActiveOrg
                                                            }
                                                            error={
                                                                themeForm.errors
                                                                    .accent_color
                                                            }
                                                            fallback="#3B82F6"
                                                            placeholder="#3B82F6 or oklch(...)"
                                                        />
                                                    </div>

                                                    {canManageBranding ? (
                                                        <div className="flex justify-end">
                                                            <Button
                                                                type="submit"
                                                                className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
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
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="preferences"
                            className="mt-0 space-y-6 focus-visible:ring-0"
                        >
                            <form
                                onSubmit={submitPreferences}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    <SectionIntro
                                        icon={Globe2}
                                        title="System Behavior"
                                        description="Manage defaults for list views, locale preferences, messages, and document footers."
                                    />

                                    <Card
                                        className={`${surfaceClass} lg:col-span-2`}
                                    >
                                        <CardContent className="space-y-8 p-6 md:p-8">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                                                            const raw =
                                                                e.target.value;
                                                            preferencesForm.setData(
                                                                'pagination_size',
                                                                raw === ''
                                                                    ? ('' as unknown as number)
                                                                    : Number(
                                                                          raw,
                                                                      ),
                                                            );
                                                        }}
                                                        disabled={
                                                            !canManageGeneral ||
                                                            !hasActiveOrg
                                                        }
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            preferencesForm
                                                                .errors
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            preferencesForm
                                                                .errors
                                                                .default_locale
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
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
                                                        className="h-11 rounded-xl"
                                                    />
                                                    <FieldError
                                                        message={
                                                            preferencesForm
                                                                .errors
                                                                .employee_code_prefix
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t border-border/70 pt-6">
                                                <div className="mb-3">
                                                    <Label htmlFor="maintenance_banner">
                                                        Maintenance Banner
                                                    </Label>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Display a message to
                                                        users when maintenance
                                                        or downtime is planned.
                                                    </p>
                                                </div>
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
                                                    rows={4}
                                                    placeholder="Scheduled maintenance on Sunday at 2:00 AM..."
                                                    className="rounded-xl"
                                                />
                                                <FieldError
                                                    message={
                                                        preferencesForm.errors
                                                            .maintenance_banner
                                                    }
                                                />
                                            </div>

                                            <div className="border-t border-border/70 pt-6">
                                                <div className="grid grid-cols-1 gap-5">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="payslip_footer_text">
                                                            Payslip Footer Text
                                                        </Label>
                                                        <Textarea
                                                            id="payslip_footer_text"
                                                            value={
                                                                preferencesForm
                                                                    .data
                                                                    .payslip_footer_text
                                                            }
                                                            onChange={(e) =>
                                                                preferencesForm.setData(
                                                                    'payslip_footer_text',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageGeneral ||
                                                                !hasActiveOrg
                                                            }
                                                            rows={3}
                                                            placeholder="Displayed on employee payslips."
                                                            className="rounded-xl"
                                                        />
                                                        <FieldError
                                                            message={
                                                                preferencesForm
                                                                    .errors
                                                                    .payslip_footer_text
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="report_footer_text">
                                                            Report Footer Text
                                                        </Label>
                                                        <Textarea
                                                            id="report_footer_text"
                                                            value={
                                                                preferencesForm
                                                                    .data
                                                                    .report_footer_text
                                                            }
                                                            onChange={(e) =>
                                                                preferencesForm.setData(
                                                                    'report_footer_text',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageGeneral ||
                                                                !hasActiveOrg
                                                            }
                                                            rows={3}
                                                            placeholder="Displayed on exports and report PDFs."
                                                            className="rounded-xl"
                                                        />
                                                        <FieldError
                                                            message={
                                                                preferencesForm
                                                                    .errors
                                                                    .report_footer_text
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {canManageGeneral ? (
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
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
                            className="mt-0 space-y-6 focus-visible:ring-0"
                        >
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                <div className="space-y-6 xl:col-span-2">
                                    <form
                                        onSubmit={submitBackups}
                                        className="space-y-6"
                                    >
                                        <Card className={surfaceClass}>
                                            <CardContent className="space-y-8 p-6 md:p-8">
                                                <div className="flex items-center gap-2">
                                                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        Backup Scheduling
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label>
                                                            Automatic Backups
                                                        </Label>
                                                        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    backupsForm
                                                                        .data
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
                                                                className="h-4 w-4 rounded border-gray-300"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground">
                                                                    Enable
                                                                    scheduled
                                                                    backups
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Run backups
                                                                    using the
                                                                    saved
                                                                    configuration.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <FieldError
                                                            message={
                                                                backupsForm
                                                                    .errors
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
                                                            <SelectTrigger className="h-11 rounded-xl">
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
                                                                backupsForm
                                                                    .errors
                                                                    .backup_frequency
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            Day of Week
                                                        </Label>
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
                                                            <SelectTrigger className="h-11 rounded-xl">
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
                                                                backupsForm
                                                                    .errors
                                                                    .backup_day_of_week
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            Backup Time
                                                        </Label>
                                                        <Input
                                                            type="time"
                                                            value={
                                                                backupsForm.data
                                                                    .backup_time
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'backup_time',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                            className="h-11 rounded-xl"
                                                        />
                                                        <FieldError
                                                            message={
                                                                backupsForm
                                                                    .errors
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
                                                            className="h-11 rounded-xl"
                                                        />
                                                        <FieldError
                                                            message={
                                                                backupsForm
                                                                    .errors
                                                                    .backup_retention_days
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            Backup Folder
                                                        </Label>
                                                        <Input
                                                            value={
                                                                backupsForm.data
                                                                    .backup_local_path
                                                            }
                                                            onChange={(e) =>
                                                                backupsForm.setData(
                                                                    'backup_local_path',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !canManageBackups
                                                            }
                                                            placeholder="backups"
                                                            className="h-11 rounded-xl"
                                                        />
                                                        <FieldError
                                                            message={
                                                                backupsForm
                                                                    .errors
                                                                    .backup_local_path
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="border-t border-border/70 pt-6">
                                                    <h4 className="mb-4 text-sm font-semibold text-foreground">
                                                        Storage Configuration
                                                    </h4>

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    backupsForm
                                                                        .data
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
                                                                className="h-4 w-4 rounded border-gray-300"
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-foreground">
                                                                    Local Server
                                                                </p>
                                                                <p className="truncate text-xs text-muted-foreground">
                                                                    {backupsForm
                                                                        .data
                                                                        .backup_local_path ||
                                                                        'backups'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    backupsForm
                                                                        .data
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
                                                                className="h-4 w-4 rounded border-gray-300"
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-foreground">
                                                                    Uploads
                                                                    Archive
                                                                </p>
                                                                <p className="truncate text-xs text-muted-foreground">
                                                                    Include
                                                                    stored
                                                                    uploads in
                                                                    the backup
                                                                    package
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_local_enabled
                                                        }
                                                    />
                                                    <FieldError
                                                        message={
                                                            backupsForm.errors
                                                                .backup_include_uploads
                                                        }
                                                    />
                                                </div>

                                                <div className="border-t border-border/70 pt-6">
                                                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">
                                                                Email Delivery
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Send backup
                                                                reports to
                                                                administrators.
                                                            </p>
                                                        </div>
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
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-5">
                                                        <div className="space-y-2">
                                                            <Label>
                                                                Email Recipients
                                                            </Label>
                                                            <Textarea
                                                                value={
                                                                    backupsForm
                                                                        .data
                                                                        .backup_email_recipients
                                                                }
                                                                onChange={(e) =>
                                                                    backupsForm.setData(
                                                                        'backup_email_recipients',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !canManageBackups ||
                                                                    !backupsForm
                                                                        .data
                                                                        .backup_email_enabled
                                                                }
                                                                rows={2}
                                                                placeholder="admin@company.com, it@company.com"
                                                                className="rounded-xl"
                                                            />
                                                            <FieldError
                                                                message={
                                                                    backupsForm
                                                                        .errors
                                                                        .backup_email_recipients
                                                                }
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <Label>
                                                                    Email
                                                                    Subject
                                                                    Prefix
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        backupsForm
                                                                            .data
                                                                            .backup_email_subject_prefix
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        backupsForm.setData(
                                                                            'backup_email_subject_prefix',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !canManageBackups ||
                                                                        !backupsForm
                                                                            .data
                                                                            .backup_email_enabled
                                                                    }
                                                                    placeholder="[HRMS]"
                                                                    className="h-11 rounded-xl"
                                                                />
                                                                <FieldError
                                                                    message={
                                                                        backupsForm
                                                                            .errors
                                                                            .backup_email_subject_prefix
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>
                                                                    Include
                                                                    Database
                                                                </Label>
                                                                <div className="flex h-11 items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            backupsForm
                                                                                .data
                                                                                .backup_include_database
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            backupsForm.setData(
                                                                                'backup_include_database',
                                                                                e
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            !canManageBackups
                                                                        }
                                                                        className="h-4 w-4 rounded border-gray-300"
                                                                    />
                                                                    <span className="text-sm text-foreground">
                                                                        Dump
                                                                        database
                                                                    </span>
                                                                </div>
                                                                <FieldError
                                                                    message={
                                                                        backupsForm
                                                                            .errors
                                                                            .backup_include_database
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>
                                                                Email Message
                                                            </Label>
                                                            <Textarea
                                                                value={
                                                                    backupsForm
                                                                        .data
                                                                        .backup_email_message
                                                                }
                                                                onChange={(e) =>
                                                                    backupsForm.setData(
                                                                        'backup_email_message',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !canManageBackups ||
                                                                    !backupsForm
                                                                        .data
                                                                        .backup_email_enabled
                                                                }
                                                                rows={3}
                                                                placeholder="Backup created automatically by HRMS."
                                                                className="rounded-xl"
                                                            />
                                                            <FieldError
                                                                message={
                                                                    backupsForm
                                                                        .errors
                                                                        .backup_email_message
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {canManageBackups ? (
                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="submit"
                                                            className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
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
                                                    <Alert className="border-border/70 bg-muted/20">
                                                        <Shield className="h-4 w-4" />
                                                        <AlertTitle>
                                                            No backup
                                                            permissions
                                                        </AlertTitle>
                                                        <AlertDescription>
                                                            You can view backup
                                                            status, but you do
                                                            not have permission
                                                            to update backup
                                                            settings.
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </form>
                                </div>

                                <div className="space-y-6 xl:col-span-1">
                                    <Card className={surfaceClass}>
                                        <CardContent className="p-6">
                                            <h4 className="mb-4 text-sm font-semibold text-foreground">
                                                Manual Operations
                                            </h4>

                                            <Button
                                                type="button"
                                                className="mb-6 h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground"
                                                disabled={
                                                    !canRunBackups ||
                                                    runBackupForm.processing
                                                }
                                                onClick={() =>
                                                    setConfirmRunBackup(true)
                                                }
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                {runBackupForm.processing
                                                    ? 'Queuing...'
                                                    : 'Run Manual Backup'}
                                            </Button>

                                            {!canRunBackups ? (
                                                <p className="mb-4 text-xs font-medium text-muted-foreground">
                                                    You do not have permission
                                                    to run backups.
                                                </p>
                                            ) : null}

                                            <div className="space-y-4">
                                                <h5 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                                    Recent Activity
                                                </h5>

                                                <div className="flex items-start gap-3 text-sm">
                                                    <div
                                                        className={`mt-1.5 h-2.5 w-2.5 rounded-full ${activityDotClass(
                                                            backups.last_backup_status,
                                                        )}`}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium break-all text-foreground">
                                                            {backups.last_backup_file ||
                                                                'No backup file yet'}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {backups.last_backup_at ||
                                                                'Not yet run'}
                                                        </p>
                                                        <Badge
                                                            variant={statusBadgeVariant(
                                                                backups.last_backup_status,
                                                            )}
                                                            className="mt-2"
                                                        >
                                                            {backups.last_backup_status ||
                                                                'unknown'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {backups.last_backup_error ? (
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-foreground">
                                                                Last backup
                                                                error
                                                            </p>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {
                                                                    backups.last_backup_error
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>

                                            {backups.last_backup_file ? (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="mt-6 h-10 w-full rounded-xl"
                                                    disabled={!canManageBackups}
                                                >
                                                    <a
                                                        href={`/system-settings/backups/download/${encodeURIComponent(
                                                            backups.last_backup_file,
                                                        )}`}
                                                    >
                                                        Download Latest Backup
                                                    </a>
                                                </Button>
                                            ) : null}
                                        </CardContent>
                                    </Card>

                                    <Card className={surfaceClass}>
                                        <CardContent className="space-y-4 p-6">
                                            <div className="flex items-center gap-2">
                                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                <h4 className="text-sm font-semibold text-foreground">
                                                    Backup Status
                                                </h4>
                                            </div>

                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">
                                                        Last status
                                                    </span>
                                                    <Badge
                                                        variant={statusBadgeVariant(
                                                            backups.last_backup_status,
                                                        )}
                                                    >
                                                        {backups.last_backup_status ||
                                                            'unknown'}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        Last run
                                                    </span>
                                                    <span className="text-right font-medium text-foreground">
                                                        {backups.last_backup_at ||
                                                            'Not yet run'}
                                                    </span>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        Local storage
                                                    </span>
                                                    <span className="text-right font-medium text-foreground">
                                                        {backupsForm.data
                                                            .backup_local_enabled
                                                            ? 'Enabled'
                                                            : 'Disabled'}
                                                    </span>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        Email delivery
                                                    </span>
                                                    <span className="text-right font-medium text-foreground">
                                                        {backupsForm.data
                                                            .backup_email_enabled
                                                            ? 'Enabled'
                                                            : 'Disabled'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <AlertDialog
                open={confirmRunBackup}
                onOpenChange={setConfirmRunBackup}
            >
                <AlertDialogContent className="rounded-2xl p-6 sm:max-w-[480px]">
                    <AlertDialogHeader className="pb-2">
                        <AlertDialogTitle className="text-xl font-bold text-foreground">
                            Run backup now?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                            This will generate a backup using the current
                            configuration. Large backups may take a few minutes
                            to complete.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
                        <AlertDialogCancel className="mt-0 h-11 w-full rounded-xl border-border px-8 font-semibold shadow-sm sm:w-auto">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={triggerBackupRun}
                            className="h-11 w-full rounded-xl bg-primary px-8 font-semibold text-primary-foreground shadow-sm sm:w-auto"
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
    'relative rounded-none border-b-2 border-transparent bg-transparent px-1 pb-4 text-sm font-medium text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
