import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    MapPin,
    Network,
    Pencil,
    Trash2,
    Download,
    CheckCircle2,
    Clock,
    History,
    Plus,
    Sun,
    ChevronLeft,
} from 'lucide-react';
import moment from 'moment';
import 'moment-timezone';
import { useState, useEffect } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function LocationShow() {
    const { location } = usePage().props as any;

    const [currentTime, setCurrentTime] = useState('');

    // Safety fallbacks matching the DB schema
    const name = location?.name || 'Downtown Providence HQ';
    const uuid =
        `LOC-${location?.id?.toString().padStart(4, '0')}-89B-RI` ||
        'LOC-7702-89B-RI';
    const timezone = location?.timezone || 'America/New_York';
    const address1 = location?.address_line1 || '100 Westminster St';
    const address2 = location?.address_line2 || 'Suite 1200, Finance Plaza';
    const cityState =
        [location?.city, location?.state].filter(Boolean).join(', ') ||
        'Providence, Rhode Island';
    const zipCountry =
        [location?.postal_code, location?.country].filter(Boolean).join(', ') ||
        '02903, United States';
    const lat = location?.latitude || '41.8240';
    const lng = location?.longitude || '-71.4128';

    const orgUnits = location?.org_units || [
        {
            id: 1,
            name: 'Global Finance Operations',
            type: 'SBU',
            employees: 142,
            is_primary: true,
            effective_from: '2023-01-01',
        },
        {
            id: 2,
            name: 'North American Sales',
            type: 'DEPARTMENT',
            employees: 56,
            is_primary: false,
            effective_from: '2024-03-15',
        },
        {
            id: 3,
            name: 'Executive Leadership Team',
            type: 'TEAM',
            employees: 12,
            is_primary: true,
            effective_from: '2020-10-12',
        },
    ];

    // Live clock based on timezone
    useEffect(() => {
        const updateTime = () => {
            try {
                setCurrentTime(moment().tz(timezone).format('hh:mm A'));
            } catch (e) {
                setCurrentTime(moment().format('hh:mm A'));
            }
        };
        updateTime();
        const interval = setInterval(updateTime, 10000);
        return () => clearInterval(interval);
    }, [timezone]);

    const handleDelete = () => {
        router.delete(`${API}/locations/${location?.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Locations', href: `${API}/locations` },
                { title: name, href: '#' },
            ]}
        >
            <Head title={`Location: ${name}`} />

            <div className="min-h-[calc(100vh-64px)] w-full space-y-6 bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 h-8 w-8 rounded-full shadow-sm"
                            onClick={() => router.visit(`${API}/locations`)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {name}
                                </h1>
                                <Badge className="bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase shadow-none hover:bg-emerald-100">
                                    Active
                                </Badge>
                            </div>
                            <p className="mt-1 font-mono text-sm tracking-tight text-muted-foreground">
                                UUID: {uuid}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="bg-background font-semibold shadow-sm"
                            onClick={() =>
                                router.visit(
                                    `${API}/locations/${location?.id}/edit`,
                                )
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-destructive/20 bg-background font-semibold text-destructive shadow-sm hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">
                                        Delete Location?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete{' '}
                                        <strong>{name}</strong>? Ensure no
                                        Organization Units are actively bound to
                                        this location before proceeding.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Yes, Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button className="px-6 font-semibold shadow-sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT COLUMN (Spans 2/3) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Address Details Card */}
                        <Card className="overflow-hidden shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="space-y-6 p-6">
                                    <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Address Details
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Address Line 1
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {address1 || '—'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Address Line 2
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {address2 || '—'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                City & State
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {cityState}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Postal Code & Country
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {zipCountry}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Representation */}
                                <div className="relative min-h-[240px] overflow-hidden border-l bg-muted/30 p-4 md:min-h-full">
                                    {/* Abstract map pattern */}
                                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                                    {/* Map Pin UI */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="relative flex flex-col items-center">
                                            <div className="absolute -top-3 left-1/2 h-16 w-16 -translate-x-1/2 animate-pulse rounded-full bg-primary/20"></div>
                                            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div className="z-10 mt-2 flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-md">
                                                <CheckCircle2 className="h-3 w-3" />{' '}
                                                Verified GPS
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coordinates Box */}
                                    <div className="absolute bottom-4 left-4 z-10 rounded border bg-background/90 px-3 py-2 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
                                        LAT: {lat}° N<br />
                                        LONG: {lng}° W
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Associated Org Units */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                                    <Network className="h-5 w-5 text-primary" />
                                    Associated Organization Units
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="px-0 font-semibold text-primary"
                                >
                                    Link New Unit
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableHead className="h-12 pl-6 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Department / Unit
                                                </TableHead>
                                                <TableHead className="h-12 text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Primary HQ
                                                </TableHead>
                                                <TableHead className="h-12 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Effective Date
                                                </TableHead>
                                                <TableHead className="h-12 pr-6 text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Employees
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orgUnits.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="h-32 text-center text-muted-foreground"
                                                    >
                                                        No Organization Units
                                                        linked to this location.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                orgUnits.map((ou: any) => (
                                                    <TableRow
                                                        key={ou.id}
                                                        className="transition-colors hover:bg-muted/20"
                                                    >
                                                        <TableCell className="py-4 pl-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-foreground">
                                                                    {ou.name}
                                                                </span>
                                                                <span className="mt-0.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                                                    ID: ORG-
                                                                    {ou.type.substring(
                                                                        0,
                                                                        3,
                                                                    )}
                                                                    -
                                                                    {ou.id
                                                                        .toString()
                                                                        .padStart(
                                                                            2,
                                                                            '0',
                                                                        )}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {ou.is_primary !==
                                                            false ? (
                                                                <Badge className="bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-none hover:bg-primary/20">
                                                                    YES
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-muted px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-none hover:bg-muted">
                                                                    NO
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-medium text-muted-foreground">
                                                            {ou.effective_from
                                                                ? moment(
                                                                      ou.effective_from,
                                                                  ).format(
                                                                      'MMM DD, YYYY',
                                                                  )
                                                                : '—'}
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right text-base font-bold text-foreground">
                                                            {ou.employees ||
                                                                Math.floor(
                                                                    Math.random() *
                                                                        150,
                                                                ) + 10}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (Spans 1/3) */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Local Context Widget */}
                        <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground shadow-md">
                            {/* Decorative element */}
                            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl"></div>

                            <CardContent className="relative z-10 space-y-6 p-6">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary-foreground/80 uppercase">
                                    <Clock className="h-4 w-4" />
                                    Local Context
                                </div>

                                <div>
                                    <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
                                        {currentTime || '10:45 AM'}
                                    </h2>
                                    <p className="mt-1 text-sm font-medium text-primary-foreground/90 drop-shadow-sm">
                                        {timezone.replace('_', ' ')}
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-primary-foreground/70">
                                        UTC {moment().tz(timezone).format('Z')}
                                    </p>
                                </div>

                                <div className="flex items-end justify-between border-t border-primary-foreground/20 pt-4">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-primary-foreground/70 uppercase">
                                            Work Shift
                                        </p>
                                        <p className="mt-0.5 text-base font-bold drop-shadow-sm">
                                            Active: Morning
                                        </p>
                                    </div>
                                    <Sun className="h-6 w-6 text-primary-foreground/90 drop-shadow-sm" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Audit Trail Summary */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <History className="h-4 w-4 text-primary" />
                                    Audit Trail Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="relative ml-3 space-y-8 border-l-2 border-muted pb-4">
                                    <div className="relative pl-6">
                                        <div className="absolute top-0 -left-[21px] z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm">
                                            <Plus className="h-4 w-4" />
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-sm font-bold text-foreground">
                                                Location Created
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                By Sarah Miller • 2 years ago
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute top-0 -left-[21px] z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-sm font-bold text-foreground">
                                                Address Verified
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                By Auto-Sys • 3 months ago
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute top-0 -left-[21px] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-sm">
                                            <Network className="h-4 w-4" />
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-sm font-bold text-foreground">
                                                Org Unit Linked
                                            </p>
                                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                                By Admin User • 2 days ago
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="mt-2 w-full font-bold shadow-none"
                                >
                                    View Full Audit Log
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Occupancy Stats */}
                        <Card className="shadow-sm">
                            <CardContent className="space-y-6 p-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Occupancy
                                        </p>
                                        <p className="text-sm font-bold text-primary">
                                            82%
                                        </p>
                                    </div>
                                    <Progress value={82} className="h-2" />
                                </div>

                                <div className="grid grid-cols-2 divide-x border-t pt-4">
                                    <div className="pl-1">
                                        <p className="text-2xl font-extrabold text-foreground">
                                            210
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Employees
                                        </p>
                                    </div>
                                    <div className="pl-6">
                                        <p className="text-2xl font-extrabold text-foreground">
                                            14
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            Conference Rms
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
