import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { roleBadgeClass, useAuthorization } from '@/lib/authorization';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    Building2,
    Calendar,
    CreditCard,
    Download,
    FileText,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Ruler,
    Trash2,
    UserCircle2,
} from 'lucide-react';

type EmployeePayload = {
    id: number;
    user_id: number | null;
    staff_number: string;
    first_name: string;
    middle_name: string | null;
    surname: string;
    full_name?: string;
    date_of_birth: string | null;
    pay_point: string | null;
    contact_number: string | null;
    address: string | null;
    department: { id: number; name: string } | null;
    position: { id: number; name: string } | null;
    manager: { id: number; staff_number: string; full_name: string } | null;
    user: {
        id: number;
        name: string;
        email: string;
        username: string | null;
        role: string | null;
        roles: Array<{ id: number; code: string; name: string }>;
        created_at: string | null;
        updated_at: string | null;
        email_verified_at: string | null;
    } | null;
    leave_applications_count: number;
    leave_balances_count: number;
    created_at: string | null;
    updated_at: string | null;
};

export default function EmployeeShow() {
    const { employee } = usePage<{ employee: EmployeePayload }>().props;
    const { can } = useAuthorization();

    // Fallback if full_name is not appended by the backend
    const fullName =
        employee.full_name ||
        [employee.first_name, employee.middle_name, employee.surname]
            .filter(Boolean)
            .join(' ');

    const destroy = () => {
        if (
            confirm(
                `Are you sure you want to delete ${fullName}? This action cannot be undone.`,
            )
        ) {
            router.delete(`/employees/${employee.id}`);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    // Calculate age if DOB exists
    const getAge = (dob: string | null) => {
        if (!dob) return '';
        const ageDifMs = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(ageDifMs);
        return ` (${Math.abs(ageDate.getUTCFullYear() - 1970)} years)`;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Employees', href: '/employees' },
                { title: fullName, href: '#' },
            ]}
        >
            <Head title={`${fullName} - Employee Profile`} />

            <div className="flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 bg-muted/5 p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm ring-1 ring-border">
                            <AvatarFallback className="bg-muted text-xl font-bold text-foreground">
                                {getInitials(fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {fullName}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className="border-transparent bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none"
                                >
                                    Active
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                Staff ID: EMP-{employee.staff_number} •{' '}
                                {employee.position?.name ||
                                    'Unassigned Position'}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {can('employees.update') && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 border-border bg-background px-6 font-bold shadow-sm"
                            >
                                <Link href={`/employees/${employee.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                    Profile
                                </Link>
                            </Button>
                        )}
                        {can('employees.delete') && (
                            <Button
                                onClick={destroy}
                                variant="destructive"
                                className="h-10 px-6 font-bold shadow-sm"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        )}
                    </div>
                </div>

                {/* Top Metric Cards */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Department
                                </p>
                                <p className="mt-0.5 text-base font-bold text-foreground">
                                    {employee.department?.name ||
                                        'Not assigned'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Position
                                </p>
                                <p className="mt-0.5 text-base font-bold text-foreground">
                                    {employee.position?.name || 'Not assigned'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-background shadow-sm">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Pay Point
                                </p>
                                <p className="mt-0.5 text-base font-bold text-foreground">
                                    {employee.pay_point || 'Not assigned'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Layout */}
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
                    {/* LEFT COLUMN: Main Information (Spans 8/12) */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Core Details */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-foreground uppercase">
                                    <UserCircle2 className="h-5 w-5 text-muted-foreground" />{' '}
                                    Core Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <Calendar className="h-3 w-3" />{' '}
                                            Date of Birth
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {employee.date_of_birth
                                                ? `${employee.date_of_birth}${getAge(employee.date_of_birth)}`
                                                : 'Not provided'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <Phone className="h-3 w-3" />{' '}
                                            Contact Number
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {employee.contact_number ||
                                                'Not provided'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <MapPin className="h-3 w-3" /> Home
                                            Address
                                        </p>
                                        <p className="max-w-md text-sm leading-relaxed font-bold text-foreground">
                                            {employee.address || 'Not provided'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 border-t border-border/50 pt-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Reporting Manager
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            {employee.manager ? (
                                                <>
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="border border-border bg-muted text-[10px] text-foreground">
                                                            {getInitials(
                                                                employee.manager
                                                                    .full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <p className="cursor-pointer text-sm font-bold text-foreground hover:underline">
                                                        {
                                                            employee.manager
                                                                .full_name
                                                        }
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-bold text-foreground">
                                                    None assigned
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1 border-t border-border/50 pt-4">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <Mail className="h-3 w-3" /> Work
                                            Email
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {employee.user?.email ||
                                                'No email linked'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs Area */}
                        <Tabs defaultValue="documents" className="w-full">
                            <div className="border-b border-border/60">
                                <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
                                    <TabsTrigger
                                        value="documents"
                                        className={tabClass}
                                    >
                                        Documents
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="family"
                                        className={tabClass}
                                    >
                                        Family & Kin
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="physical"
                                        className={tabClass}
                                    >
                                        Physical Attributes
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="skills"
                                        className={tabClass}
                                    >
                                        Skills
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Documents Tab */}
                            <TabsContent
                                value="documents"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">
                                            Employee Documents
                                        </h3>
                                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                            Manage contracts, identification,
                                            and permits.
                                        </p>
                                    </div>
                                    <Button className="h-10 shrink-0 bg-foreground font-bold text-background shadow-sm hover:bg-foreground/90">
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        Document
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {/* Mock Document 1 */}
                                    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Employment_Contract_2024.pdf
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    PDF • 2.4 MB • Uploaded Jan
                                                    12, 2024
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {/* Mock Document 2 */}
                                    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Passport_Copy.jpg
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    JPG • 1.1 MB • Uploaded Jan
                                                    12, 2024
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Family Tab */}
                            <TabsContent
                                value="family"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">
                                            Family & Next of Kin
                                        </h3>
                                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                            Emergency contacts and dependent
                                            information.
                                        </p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 font-bold text-primary"
                                    >
                                        Manage Info
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <Card className="border-border bg-background shadow-sm">
                                        <CardContent className="space-y-3 p-5">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Next of Kin
                                            </p>
                                            <div>
                                                <p className="text-base font-bold text-foreground">
                                                    Jane Doe
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Spouse
                                                </p>
                                            </div>
                                            <p className="flex items-center gap-2 border-t border-border/50 pt-2 text-sm font-bold text-foreground">
                                                <Phone className="h-3 w-3 text-muted-foreground" />{' '}
                                                +1 (555) 987-6543
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-border bg-background shadow-sm">
                                        <CardContent className="space-y-3 p-5">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Family Information
                                            </p>
                                            <div>
                                                <p className="text-3xl font-extrabold text-foreground">
                                                    2
                                                </p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Children
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-border bg-background shadow-sm">
                                        <CardContent className="space-y-3 p-5">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Marital Status
                                            </p>
                                            <div>
                                                <p className="pt-1 text-xl font-bold text-foreground">
                                                    Married
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                    Status
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Physical Attributes Tab */}
                            <TabsContent
                                value="physical"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">
                                            Physical Attributes
                                        </h3>
                                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                            Sizing for company uniforms and PPE.
                                        </p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 font-bold text-primary"
                                    >
                                        Edit Sizes
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    <div className="space-y-1.5 rounded-xl border border-border bg-background p-5 shadow-sm">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <Ruler className="h-3 w-3" />{' '}
                                            Uniform Size
                                        </p>
                                        <p className="text-lg font-bold text-foreground">
                                            Large (L)
                                        </p>
                                    </div>
                                    <div className="space-y-1.5 rounded-xl border border-border bg-background p-5 shadow-sm">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            <Ruler className="h-3 w-3" /> Shoe
                                            Size
                                        </p>
                                        <p className="text-lg font-bold text-foreground">
                                            10.5 US
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Skills Tab */}
                            <TabsContent
                                value="skills"
                                className="mt-8 space-y-6 focus-visible:ring-0"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">
                                            Skills & Certifications
                                        </h3>
                                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                                            Tracked competencies and technical
                                            proficiency.
                                        </p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 font-bold text-primary"
                                    >
                                        Manage Skills
                                    </Button>
                                </div>
                                <Card className="border-border bg-background shadow-sm">
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-foreground">
                                                    AWS Solutions Architect
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted text-[10px] tracking-widest text-muted-foreground uppercase shadow-none"
                                                >
                                                    Expert
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={90}
                                                className="h-2 border border-border/50 bg-muted [&>div]:bg-foreground"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-foreground">
                                                    React & Node.js
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted text-[10px] tracking-widest text-muted-foreground uppercase shadow-none"
                                                >
                                                    Master
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={98}
                                                className="h-2 border border-border/50 bg-muted [&>div]:bg-foreground"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span className="text-foreground">
                                                    Project Management
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="border-transparent bg-muted text-[10px] tracking-widest text-muted-foreground uppercase shadow-none"
                                                >
                                                    Advanced
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={75}
                                                className="h-2 border border-border/50 bg-muted [&>div]:bg-foreground"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Spans 4/12) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Linked User Account */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Linked User Account
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                {employee.user ? (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border border-border shadow-sm">
                                                <AvatarFallback className="bg-muted font-bold text-foreground">
                                                    {getInitials(
                                                        employee.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    {employee.user.name}
                                                </p>
                                                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                    {employee.user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Access Roles
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {employee.user.roles.length >
                                                0 ? (
                                                    employee.user.roles.map(
                                                        (role) => (
                                                            <Badge
                                                                key={role.id}
                                                                variant="secondary"
                                                                className="border-transparent bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-none"
                                                            >
                                                                {role.code}
                                                            </Badge>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        No roles assigned
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-10 w-full border-border font-bold shadow-sm"
                                        >
                                            <Link
                                                href={`/users/${employee.user.id}`}
                                            >
                                                Manage Permissions
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <div className="space-y-3 py-4 text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No system account is linked to this
                                            employee profile.
                                        </p>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-10 w-full border-border font-bold shadow-sm"
                                        >
                                            <Link href="/users/create">
                                                Create Account
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Physical Attributes Summary (Sidebar version) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    <Ruler className="h-4 w-4" /> Physical
                                    Attributes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 rounded-xl border border-border bg-muted/10 p-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Uniform Size
                                        </p>
                                        <p className="text-base font-bold text-foreground">
                                            Large (L)
                                        </p>
                                    </div>
                                    <div className="space-y-1 rounded-xl border border-border bg-muted/10 p-4">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Shoe Size
                                        </p>
                                        <p className="text-base font-bold text-foreground">
                                            10.5 US
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills Summary (Sidebar version) */}
                        <Card className="border-border bg-background shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    <Award className="h-4 w-4" /> Skills &
                                    Certifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 p-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-foreground">
                                            AWS Solutions Architect
                                        </span>
                                        <span className="text-muted-foreground">
                                            Expert
                                        </span>
                                    </div>
                                    <Progress
                                        value={90}
                                        className="h-1.5 border border-border/50 bg-muted [&>div]:bg-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-foreground">
                                            React & Node.js
                                        </span>
                                        <span className="text-muted-foreground">
                                            Master
                                        </span>
                                    </div>
                                    <Progress
                                        value={98}
                                        className="h-1.5 border border-border/50 bg-muted [&>div]:bg-foreground"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-background px-8 py-6 text-[11px] font-medium text-muted-foreground md:flex-row">
                <p>© 2024 HRMS Enterprise Portal. All rights reserved.</p>
            </div>
        </AppLayout>
    );
}

const tabClass =
    'relative rounded-none border-b-2 border-transparent bg-transparent py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
