import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { recommendedDocumentation, sectionTitles, type DocumentationEntry, type DocumentationSections } from '@/lib/documentation';
import type { Auth } from '@/types/auth';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    BookOpen,
    Briefcase,
    Building2,
    ChevronRight,
    ClipboardList,
    Clock,
    FileCode2,
    FileText,
    GraduationCap,
    Heart,
    Layers3,
    LayoutDashboard,
    Lock,
    type LucideIcon,
    Package,
    Receipt,
    Settings,
    ShieldCheck,
    Store,
    UserCheck,
    UserCog,
    UserMinus,
    UserPlus,
    Users,
    Workflow,
    Wrench,
} from 'lucide-react';

const slugIcons: Record<string, LucideIcon> = {
    // modules
    dashboard: LayoutDashboard,
    employees: Users,
    contracts: FileText,
    'asset-management': Package,
    'organization-structure': Building2,
    'user-access-and-control-center': Lock,
    'audit-trail': AlertCircle,
    'system-settings': Settings,
    workflows: Workflow,
    'leave-management': Clock,
    attendance: UserCheck,
    timesheets: ClipboardList,
    payroll: Receipt,
    payslips: Receipt,
    requisitions: ClipboardList,
    'candidate-records': FileText,
    onboarding: UserPlus,
    offboarding: UserMinus,
    'performance-management': BarChart3,
    learning: GraduationCap,
    benefits: Heart,
    'documents-repository': FileText,
    reports: BarChart3,
    'recruitment-marketplace': Store,
    'candidate-hub': Briefcase,
    'employer-hub': Store,
    // roles
    'system-admin': Wrench,
    'hr-admin': UserCog,
    'payroll-officer': Receipt,
    manager: Briefcase,
    authoriser: ShieldCheck,
    employee: Users,
    auditor: AlertCircle,
    candidate: UserPlus,
    employer: Building2,
    // references fallback
    default: FileCode2,
};

function getSlugIcon(slug: string): LucideIcon {
    return slugIcons[slug] ?? slugIcons.default;
}

function SectionCard({
    title,
    icon: SectionIcon,
    items,
}: {
    title: string;
    icon: LucideIcon;
    items: DocumentationEntry[];
}) {
    return (
        <Card className="border-border/70 bg-background/95 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <SectionIcon className="h-4 w-4 text-muted-foreground" />
                    {title}
                </CardTitle>
                <CardDescription>{items.length} document{items.length === 1 ? '' : 's'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.map((item) => {
                    const ItemIcon = getSlugIcon(item.slug);
                    return (
                        <Link
                            key={`${item.section}:${item.slug}`}
                            href={item.href}
                            className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex items-start gap-3">
                                <ItemIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                                    <p className="text-xs leading-5 text-muted-foreground">{item.summary}</p>
                                </div>
                            </div>
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export default function DocumentationIndex() {
    const { sections, auth } = usePage<{ sections: DocumentationSections; auth: Auth }>().props;
    const recommended = recommendedDocumentation(auth, sections);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Documentation', href: '/documentation' },
            ]}
        >
            <Head title="Documentation" />

            <div className="w-full space-y-6 p-4 md:p-6">
                <Card className="border-border/70 bg-background/95 shadow-sm">
                    <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="rounded-md border-border bg-muted/30 text-[11px] text-muted-foreground shadow-none">
                                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                                    Documentation
                                </Badge>
                                <Badge variant="outline" className="rounded-md border-border bg-muted/30 text-[11px] text-muted-foreground shadow-none">
                                    User + Technical
                                </Badge>
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    HRMS Documentation
                                </h1>
                                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                                    Module guides, role handbooks, and technical references for the full HRMS workflow.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[260px]">
                            <div className="rounded-lg border border-border/70 bg-card px-4 py-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Layers3 className="h-4 w-4" />
                                    Modules
                                </div>
                                <p className="mt-1 text-xl font-semibold text-foreground">{sections.modules.length}</p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-card px-4 py-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4" />
                                    Roles
                                </div>
                                <p className="mt-1 text-xl font-semibold text-foreground">{sections.roles.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {recommended.length > 0 ? (
                    <Card className="border-border/70 bg-background/95 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Recommended for your role</CardTitle>
                            <CardDescription>
                                Prioritized from your active portal and dashboard role.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {recommended.map((item) => {
                                const ItemIcon = getSlugIcon(item.slug);
                                return (
                                    <Link
                                        key={`${item.section}:${item.slug}`}
                                        href={item.href}
                                        className="rounded-lg border border-border/70 bg-card px-4 py-3 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <ItemIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                <p className="text-sm font-medium text-foreground">{item.title}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        </div>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.summary}</p>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-3">
                    <SectionCard title={sectionTitles.modules} icon={Layers3} items={sections.modules} />
                    <SectionCard title={sectionTitles.roles} icon={ShieldCheck} items={sections.roles} />
                    <SectionCard title={sectionTitles.references} icon={FileCode2} items={sections.references} />
                </div>
            </div>
        </AppLayout>
    );
}
