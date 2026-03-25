import type { ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Building2,
    ClipboardList,
    DollarSign,
    Download,
    FileSpreadsheet,
    Heart,
    Shield,
    Users,
    UserX,
} from 'lucide-react';
import { useState } from 'react';

type ReportConfig = {
    key: string;
    title: string;
    description: string;
    icon: ElementType;
    endpoint: string;
};

const reports: ReportConfig[] = [
    {
        key: 'register',
        title: 'Benefits Register',
        description: 'Complete list of all benefits with configuration details, categories, and status.',
        icon: Shield,
        endpoint: '/benefits/reports/register',
    },
    {
        key: 'active-enrollments',
        title: 'Active Enrollments',
        description: 'All currently active benefit enrollments with employee details and contribution amounts.',
        icon: Users,
        endpoint: '/benefits/reports/active-enrollments',
    },
    {
        key: 'by-department',
        title: 'Enrollments by Department',
        description: 'Breakdown of benefit enrollments organized by department with cost summaries.',
        icon: Building2,
        endpoint: '/benefits/reports/by-department',
    },
    {
        key: 'employer-contributions',
        title: 'Employer Contributions',
        description: 'Summary of employer contribution amounts per benefit, plan, and employee.',
        icon: DollarSign,
        endpoint: '/benefits/reports/employer-contributions',
    },
    {
        key: 'employee-contributions',
        title: 'Employee Contributions',
        description: 'Summary of employee deduction amounts per benefit, plan, and employee.',
        icon: ClipboardList,
        endpoint: '/benefits/reports/employee-contributions',
    },
    {
        key: 'dependants',
        title: 'Dependants Report',
        description: 'List of all registered dependants across benefit enrollments with their details.',
        icon: Heart,
        endpoint: '/benefits/reports/dependants',
    },
    {
        key: 'by-cost-category',
        title: 'Benefits by Cost Category',
        description: 'Benefits grouped by category with total costs, enrollment counts, and averages.',
        icon: FileSpreadsheet,
        endpoint: '/benefits/reports/by-cost-category',
    },
    {
        key: 'expired-suspended',
        title: 'Expired & Suspended',
        description: 'List of expired, suspended, and terminated enrollments with dates and reasons.',
        icon: UserX,
        endpoint: '/benefits/reports/expired-suspended',
    },
];

export default function BenefitsReports() {
    const [formats, setFormats] = useState<Record<string, string>>(
        Object.fromEntries(reports.map((r) => [r.key, 'xlsx'])),
    );

    const handleDownload = (report: ReportConfig) => {
        const format = formats[report.key] ?? 'xlsx';
        window.location.href = `${report.endpoint}?format=${format}`;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Benefits', href: '/benefits' },
                { title: 'Reports' },
            ]}
        >
            <Head title="Benefits Reports" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                        Benefits Reports
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground">
                        Generate and download benefits management reports.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {reports.map((report) => (
                        <Card key={report.key} className="border-border bg-background shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader className="border-b border-border/70 bg-muted/10">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <report.icon className="h-5 w-5 text-muted-foreground" />
                                    {report.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {report.description}
                                </p>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={formats[report.key]}
                                        onValueChange={(v) =>
                                            setFormats((prev) => ({ ...prev, [report.key]: v }))
                                        }
                                    >
                                        <SelectTrigger className="h-9 w-24 border-border bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="xlsx">XLSX</SelectItem>
                                            <SelectItem value="csv">CSV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        className="flex-1 shadow-sm"
                                        onClick={() => handleDownload(report)}
                                        type="button"
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
