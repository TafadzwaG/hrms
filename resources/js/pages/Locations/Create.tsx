import { API } from '@/config';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Compass,
    Info,
    MapPin,
    Minus,
    Plus,
    Search,
    Settings,
} from 'lucide-react';
import { useState } from 'react';

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

export default function LocationCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        timezone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: 'United States',
        postal_code: '',
        latitude: '',
        longitude: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(`${API}/locations`, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '#' },
                { title: 'Settings', href: '#' },
                {
                    title: 'Create New Location',
                    href: `${API}/locations/create`,
                },
            ]}
        >
            <Head title="Create Location" />

            <div className="min-h-[calc(100vh-64px)] w-full bg-muted/10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 max-w-3xl">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Location Setup
                    </h1>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                        Select a location on the interactive map below to
                        automatically populate the address and geographical
                        details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="pb-24">
                    {/* Interactive Map Area (Mock) */}
                    <div className="relative mb-8 flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 shadow-sm">
                        {/* Map Pattern Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                        {/* Search Bar Overlay */}
                        <div className="absolute top-6 left-6 z-10 w-full max-w-md">
                            <div className="relative overflow-hidden rounded-md bg-background shadow-md">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search for a city, address or landmark..."
                                    className="h-12 border-none pl-10 text-base shadow-none focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {/* Zoom Controls Overlay */}
                        <div className="absolute right-6 bottom-6 z-10 flex flex-col overflow-hidden rounded-md bg-background shadow-md">
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center border-b border-border text-muted-foreground hover:bg-muted"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-muted"
                            >
                                <Minus className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Central Map Pin Graphic */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-2 flex h-20 w-14 justify-center text-primary opacity-90 drop-shadow-xl">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-full w-full"
                                >
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            <div className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase shadow-md backdrop-blur-sm transition-colors hover:bg-background">
                                <MapPin className="h-3 w-3" />
                                Click anywhere on the map to set location
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: Form Fields */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Primary Address Details */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Primary Address Details
                                    </CardTitle>
                                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Auto-Populated from Map
                                    </span>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Address Line 1
                                        </Label>
                                        <Input
                                            placeholder="101 Spear Street"
                                            value={data.address_line1}
                                            onChange={(e) =>
                                                setData(
                                                    'address_line1',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-11 bg-background ${errors.address_line1 ? 'border-destructive' : ''}`}
                                        />
                                        {errors.address_line1 && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.address_line1}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Address Line 2 (Optional)
                                        </Label>
                                        <Input
                                            placeholder="Apartment, suite, unit, building, floor"
                                            value={data.address_line2}
                                            onChange={(e) =>
                                                setData(
                                                    'address_line2',
                                                    e.target.value,
                                                )
                                            }
                                            className={`h-11 bg-background ${errors.address_line2 ? 'border-destructive' : ''}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                City
                                            </Label>
                                            <Input
                                                placeholder="San Francisco"
                                                value={data.city}
                                                onChange={(e) =>
                                                    setData(
                                                        'city',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background ${errors.city ? 'border-destructive' : ''}`}
                                            />
                                            {errors.city && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                State / Province
                                            </Label>
                                            <Input
                                                placeholder="California"
                                                value={data.state}
                                                onChange={(e) =>
                                                    setData(
                                                        'state',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background ${errors.state ? 'border-destructive' : ''}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Country
                                            </Label>
                                            <Select
                                                value={data.country}
                                                onValueChange={(val) =>
                                                    setData('country', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`h-11 bg-background ${errors.country ? 'border-destructive' : ''}`}
                                                >
                                                    <SelectValue placeholder="Select Country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="United States">
                                                        United States
                                                    </SelectItem>
                                                    <SelectItem value="United Kingdom">
                                                        United Kingdom
                                                    </SelectItem>
                                                    <SelectItem value="Zimbabwe">
                                                        Zimbabwe
                                                    </SelectItem>
                                                    <SelectItem value="Singapore">
                                                        Singapore
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.country && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.country}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Postal Code
                                            </Label>
                                            <Input
                                                placeholder="94105"
                                                value={data.postal_code}
                                                onChange={(e) =>
                                                    setData(
                                                        'postal_code',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background ${errors.postal_code ? 'border-destructive' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Split Row: Settings & Coordinates */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Settings */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold">
                                            <Settings className="h-5 w-5 text-primary" />
                                            Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Location Name
                                            </Label>
                                            <Input
                                                placeholder="e.g. SF Headquarters"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-11 bg-background ${errors.name ? 'border-destructive' : ''}`}
                                            />
                                            {errors.name && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Timezone
                                            </Label>
                                            <Select
                                                value={data.timezone}
                                                onValueChange={(val) =>
                                                    setData('timezone', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`h-11 bg-background ${errors.timezone ? 'border-destructive' : ''}`}
                                                >
                                                    <SelectValue placeholder="Select Timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="(GMT-08:00) Pacific Time (US & Canada)">
                                                        (GMT-08:00) Pacific Time
                                                        (US & Canada)
                                                    </SelectItem>
                                                    <SelectItem value="(GMT-05:00) Eastern Time (US & Canada)">
                                                        (GMT-05:00) Eastern Time
                                                        (US & Canada)
                                                    </SelectItem>
                                                    <SelectItem value="(GMT+00:00) London">
                                                        (GMT+00:00) London
                                                    </SelectItem>
                                                    <SelectItem value="(GMT+02:00) Harare">
                                                        (GMT+02:00) Harare
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.timezone && (
                                                <p className="text-xs font-medium text-destructive">
                                                    {errors.timezone}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Coordinates */}
                                <Card className="border-border shadow-sm">
                                    <CardHeader className="border-b border-border/50 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold">
                                            <Compass className="h-5 w-5 text-primary" />
                                            Coordinates
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Latitude
                                            </Label>
                                            <Input
                                                placeholder="37.7749"
                                                value={data.latitude}
                                                readOnly
                                                className="h-11 cursor-not-allowed bg-muted/50 font-mono text-muted-foreground"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Longitude
                                            </Label>
                                            <Input
                                                placeholder="-122.4194"
                                                value={data.longitude}
                                                readOnly
                                                className="h-11 cursor-not-allowed bg-muted/50 font-mono text-muted-foreground"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">
                                            These values are locked to map
                                            selection for precision.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Info Context */}
                        <div className="space-y-6 lg:col-span-4">
                            <Card className="border-primary/20 bg-primary/5 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-bold text-primary">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary font-serif text-xs text-primary-foreground italic">
                                            ?
                                        </div>
                                        Why this matters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <p className="text-sm leading-relaxed text-foreground/80">
                                        Accurate location data drives essential
                                        HR functions:
                                    </p>
                                    <ul className="space-y-3 text-sm font-medium text-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <span className="leading-snug">
                                                Ensures tax compliance based on
                                                physical workplace location.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <span className="leading-snug">
                                                Automates holiday calendars and
                                                working hour policies.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <span className="leading-snug">
                                                Enables proximity-based
                                                check-ins for onsite employees.
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-transparent bg-primary text-primary-foreground shadow-md">
                                {/* Abstract chart graphic */}
                                <div className="absolute right-0 bottom-0 opacity-20">
                                    <svg
                                        width="120"
                                        height="100"
                                        viewBox="0 0 120 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            x="10"
                                            y="60"
                                            width="20"
                                            height="40"
                                            rx="4"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="40"
                                            y="30"
                                            width="20"
                                            height="70"
                                            rx="4"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="70"
                                            y="45"
                                            width="20"
                                            height="55"
                                            rx="4"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="100"
                                            y="10"
                                            width="20"
                                            height="90"
                                            rx="4"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                                <CardContent className="relative z-10 space-y-4 p-6">
                                    <p className="text-[10px] font-bold tracking-widest text-primary-foreground/70 uppercase">
                                        Regional Analytics
                                    </p>
                                    <p className="text-sm leading-relaxed font-medium text-primary-foreground/90">
                                        Adding this location will create a new
                                        reporting node for your regional HR
                                        managers.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-emerald-400">
                                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></div>
                                        Ready for geofencing
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t pt-6 pb-4 sm:flex-row">
                        <Button
                            type="button"
                            variant="ghost"
                            className="font-bold text-muted-foreground hover:text-foreground"
                            onClick={() => router.visit(`${API}/locations`)}
                        >
                            Cancel
                        </Button>
                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full font-bold shadow-sm sm:w-auto"
                                disabled={processing || isSubmitting}
                            >
                                Save Draft
                            </Button>
                            <Button
                                type="submit"
                                className="w-full px-8 font-bold shadow-sm sm:w-auto"
                                disabled={processing || isSubmitting}
                            >
                                {processing || isSubmitting
                                    ? 'Saving...'
                                    : 'Save Location'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
