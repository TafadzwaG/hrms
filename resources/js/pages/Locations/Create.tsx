import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, MapPin, Globe, Clock, Hash } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LocationCreate() {
  const PATHS = useMemo(
    () => ({
      index: `${API}/locations`,
      store: `${API}/locations`,
      create: `${API}/locations/create`,
    }),
    []
  );

  const { data, setData, errors, post, processing } = useForm({
    name: "",
    timezone: "Africa/Harare",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "Zimbabwe",
    postal_code: "",
    latitude: "",
    longitude: "",
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

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Locations", href: `${API}/locations` },
        { title: "Create Location", href: `${API}/locations/create` },
      ]}
    >
      <Head title="Create Location" />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.visit(PATHS.index)}
              className="h-8 w-8"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Create New Location</h1>
              <p className="text-muted-foreground">Add a new branch/office/site</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
                <CardDescription>Enter details for the new location</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location Name *
                      </Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="e.g., Harare HQ"
                        className={errors.name ? "border-red-500" : ""}
                        required
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Timezone *
                      </Label>
                      <Input
                        id="timezone"
                        value={data.timezone}
                        onChange={(e) => setData("timezone", e.target.value)}
                        placeholder="e.g., Africa/Harare"
                        className={errors.timezone ? "border-red-500" : ""}
                        required
                      />
                      {errors.timezone && <p className="text-sm text-red-500">{errors.timezone}</p>}
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={data.country}
                        onChange={(e) => setData("country", e.target.value)}
                        placeholder="e.g., Zimbabwe"
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={data.city}
                        onChange={(e) => setData("city", e.target.value)}
                        placeholder="e.g., Harare"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={data.state}
                        onChange={(e) => setData("state", e.target.value)}
                        placeholder="e.g., Harare Province"
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                    </div>

                    {/* Address 1 */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address_line1">Address Line 1</Label>
                      <Input
                        id="address_line1"
                        value={data.address_line1}
                        onChange={(e) => setData("address_line1", e.target.value)}
                        placeholder="e.g., 123 Samora Machel Ave"
                        className={errors.address_line1 ? "border-red-500" : ""}
                      />
                      {errors.address_line1 && <p className="text-sm text-red-500">{errors.address_line1}</p>}
                    </div>

                    {/* Address 2 */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        value={data.address_line2}
                        onChange={(e) => setData("address_line2", e.target.value)}
                        placeholder="e.g., Building/Floor"
                        className={errors.address_line2 ? "border-red-500" : ""}
                      />
                      {errors.address_line2 && <p className="text-sm text-red-500">{errors.address_line2}</p>}
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-2">
                      <Label htmlFor="postal_code" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Postal Code
                      </Label>
                      <Input
                        id="postal_code"
                        value={data.postal_code}
                        onChange={(e) => setData("postal_code", e.target.value)}
                        placeholder="e.g., 00263"
                        className={errors.postal_code ? "border-red-500" : ""}
                      />
                      {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code}</p>}
                    </div>

                    {/* Latitude */}
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={data.latitude}
                        onChange={(e) => setData("latitude", e.target.value)}
                        placeholder="e.g., -17.8252"
                        className={errors.latitude ? "border-red-500" : ""}
                      />
                      {errors.latitude && <p className="text-sm text-red-500">{errors.latitude}</p>}
                    </div>

                    {/* Longitude */}
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={data.longitude}
                        onChange={(e) => setData("longitude", e.target.value)}
                        placeholder="e.g., 31.0335"
                        className={errors.longitude ? "border-red-500" : ""}
                      />
                      {errors.longitude && <p className="text-sm text-red-500">{errors.longitude}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.visit(PATHS.index)} disabled={processing}>
                      Cancel
                    </Button>

                    <Button type="submit" disabled={processing || isSubmitting} className="min-w-[160px]" style={{ cursor: "pointer" }}>
                      {processing || isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Location
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Why Locations Matter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary p-1">
                    <Clock className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Timezone</p>
                    <p className="text-muted-foreground">
                      Time & Attendance calculations use timezone to compute shifts, lateness, overtime, and pay periods accurately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary p-1">
                    <MapPin className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Address & GPS</p>
                    <p className="text-muted-foreground">
                      Address and optional GPS help with geo-fencing for mobile clock-in and reporting by site.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800">Required Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    Location Name
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    Timezone
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}