import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Save, Briefcase, Hash, Building2, Info } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Department = { id: number; name: string; type: string };

export default function PositionEdit() {
  const { position, departments } = usePage().props as any as {
    position: any;
    departments: Department[];
  };

  const PATHS = useMemo(
    () => ({
      index: `${API}/positions`,
      show: `${API}/positions/${position.id}`,
      update: `${API}/positions/${position.id}`,
      edit: `${API}/positions/${position.id}/edit`,
    }),
    [position?.id]
  );

  const { data, setData, errors, put, processing } = useForm({
    name: position?.name ?? "",
    code: position?.code ?? "",
    org_unit_id: (position?.org_unit_id ?? "") as string | number | "",
    description: position?.description ?? "",
    is_active: !!position?.is_active,
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

  const getDepartmentName = (id: string | number) => {
    const d = departments.find((x) => String(x.id) === String(id));
    return d ? d.name : "Select department";
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Positions", href: `${API}/positions` },
        { title: position.name, href: `${API}/positions/${position.id}` },
        { title: "Edit", href: `${API}/positions/${position.id}/edit` },
      ]}
    >
      <Head title={`Edit Position: ${position?.name ?? ""}`} />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.visit(PATHS.show)} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Position</h1>
              <p className="text-muted-foreground">Update details for {position.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Position Information</CardTitle>
                <CardDescription>Modify details and save changes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Position Name *
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

                    {/* Code */}
                    <div className="space-y-2">
                      <Label htmlFor="code" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Code (optional)
                      </Label>
                      <Input
                        id="code"
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value)}
                        className={errors.code ? "border-red-500" : ""}
                      />
                      {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <Label htmlFor="org_unit_id" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Department (optional)
                      </Label>
                      <Select
                        value={data.org_unit_id === "" ? "NONE" : String(data.org_unit_id)}
                        onValueChange={(val) => setData("org_unit_id", val === "NONE" ? "" : Number(val))}
                      >
                        <SelectTrigger className={errors.org_unit_id ? "border-red-500" : ""}>
                          <SelectValue>
                            {data.org_unit_id ? getDepartmentName(data.org_unit_id) : "No department"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">No department</SelectItem>
                          {departments.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.org_unit_id && <p className="text-sm text-red-500">{errors.org_unit_id}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {/* Active */}
                    <div className="space-y-2">
                      <Label htmlFor="is_active">Status</Label>
                      <Select value={data.is_active ? "1" : "0"} onValueChange={(val) => setData("is_active", val === "1")}>
                        <SelectTrigger className={errors.is_active ? "border-red-500" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Active</SelectItem>
                          <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.is_active && <p className="text-sm text-red-500">{errors.is_active}</p>}
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
                <p>Deactivating a position is safer than deleting it (history remains intact).</p>
                <p>If a position is assigned to employees, deletion will be blocked.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}