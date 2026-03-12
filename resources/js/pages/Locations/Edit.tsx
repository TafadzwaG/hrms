import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Save, MapPin, Globe, Clock, Hash } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LocationEdit() {
  const { location } = usePage().props as any;

  const PATHS = useMemo(
    () => ({
      index: `${API}/locations`,
      show: `${API}/locations/${location.id}`,
      edit: `${API}/locations/${location.id}/edit`,
      update: `${API}/locations/${location.id}`,
    }),
    [location?.id]
  );

  const { data, setData, errors, put, processing } = useForm({
    name: location?.name ?? "",
    timezone: location?.timezone ?? "Africa/Harare",
    address_line1: location?.address_line1 ?? "",
    address_line2: location?.address_line2 ?? "",
    city: location?.city ?? "",
    state: location?.state ?? "",
    country: location?.country ?? "Zimbabwe",
    postal_code: location?.postal_code ?? "",
    latitude: location?.latitude ?? "",
    longitude: location?.longitude ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    put(PATHS.update, {
      preserveScroll: true,
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Locations", href: `${API}/locations` },
        { title: location?.name ?? "Location", href: `${API}/locations/${location.id}` },
        { title: "Edit", href: `${API}/locations/${location.id}/edit` },
      ]}
    >
      <Head title={`Edit Location: ${location?.name ?? ""}`} />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.visit(PATHS.show)}
              className="h-8 w-8"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Edit Location</h1>
              <p className="text-muted-foreground">Update location details for {location?.name}</p>
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
                <CardDescription>Modify details and save changes</CardDescription>
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
                        className={errors.address_line2 ? "border-red-500" : ""}
                      />
                      {errors.address_line2 && <p className="text-sm text-red-500">{errors.address_line2}</p>}
                    </div>

                    {/* Postal */}
                    <div className="space-y-2">
                      <Label htmlFor="postal_code" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Postal Code
                      </Label>
                      <Input
                        id="postal_code"
                        value={data.postal_code}
                        onChange={(e) => setData("postal_code", e.target.value)}
                        className={errors.postal_code ? "border-red-500" : ""}
                      />
                      {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code}</p>}
                    </div>

                    {/* Lat */}
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={data.latitude}
                        onChange={(e) => setData("latitude", e.target.value)}
                        className={errors.latitude ? "border-red-500" : ""}
                      />
                      {errors.latitude && <p className="text-sm text-red-500">{errors.latitude}</p>}
                    </div>

                    {/* Lng */}
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={data.longitude}
                        onChange={(e) => setData("longitude", e.target.value)}
                        className={errors.longitude ? "border-red-500" : ""}
                      />
                      {errors.longitude && <p className="text-sm text-red-500">{errors.longitude}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.visit(PATHS.show)} disabled={processing}>
                      Cancel
                    </Button>

                    <Button type="submit" disabled={processing || isSubmitting} className="min-w-[160px]" style={{ cursor: "pointer" }}>
                      {processing || isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Editing Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Keep timezone accurate for attendance and reporting.
                </p>
                <p>
                  If you use mobile clock-in, GPS coordinates improve geo-fencing reliability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}