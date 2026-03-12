import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Shield, Hash, Info } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RoleCreate() {
  const PATHS = useMemo(
    () => ({
      index: `${API}/roles`,
      store: `${API}/roles`,
      create: `${API}/roles/create`,
    }),
    []
  );

  const { data, setData, errors, post, processing } = useForm({
    code: "",
    name: "",
    description: "",
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
        { title: "Roles", href: `${API}/roles` },
        { title: "Create Role", href: `${API}/roles/create` },
      ]}
    >
      <Head title="Create Role" />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.visit(PATHS.index)} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Role</h1>
              <p className="text-muted-foreground">Add a new permission role for users</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
                <CardDescription>Enter role details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Code */}
                    <div className="space-y-2">
                      <Label htmlFor="code" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Role Code *
                      </Label>
                      <Input
                        id="code"
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value.toUpperCase())}
                        placeholder="e.g., HR_ADMIN"
                        className={errors.code ? "border-red-500" : ""}
                        required
                      />
                      {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role Name *
                      </Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="e.g., HR Admin"
                        className={errors.name ? "border-red-500" : ""}
                        required
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                        placeholder="What can this role do?"
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.visit(PATHS.index)} disabled={processing}>
                      Cancel
                    </Button>

                    <Button type="submit" disabled={processing || isSubmitting} className="min-w-[160px]">
                      {processing || isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Role
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
                <CardTitle className="text-lg">Best Practice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Use stable codes</strong> like <code>HR_ADMIN</code>. Codes are used by imports and permissions logic.</p>
                <p><strong>Keep names human-friendly</strong> like “HR Admin”.</p>
                <p><strong>Don’t delete roles</strong> used by active users—create new ones and migrate users.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}