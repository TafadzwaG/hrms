import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Save, Mail, User, Hash, Shield, KeyRound, Wand2, Copy } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

function generateStrongPassword(length = 12) {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";
  const arr = new Uint32Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * charset.length);
  }

  return Array.from(arr, (x) => charset[x % charset.length]).join("");
}

export default function UserEdit() {
  const { user, roles, meta } = usePage().props as any;

  const PATHS = useMemo(
    () => ({
      index: `${API}/users`,
      show: `${API}/users/${user.id}`,
      update: `${API}/users/${user.id}`,
    }),
    [user?.id]
  );

  const { data, setData, errors, put, processing } = useForm({
    name: user.name ?? "",
    email: user.email ?? "",
    username: user.username ?? "",
    role: user.role ?? "employee",

    // password optional on edit
    password: "",
    password_confirmation: "",

    mark_email_verified: false,
    unverify_email: false,

    // ✅ new
    send_password_email: true,

    role_ids: (user.role_ids ?? []) as number[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleRole = (id: number) => {
    setData(
      "role_ids",
      data.role_ids.includes(id) ? data.role_ids.filter((x) => x !== id) : [...data.role_ids, id]
    );
  };

  const handleGeneratePassword = () => {
    const pwd = generateStrongPassword(12);
    setData("password", pwd);
    setData("password_confirmation", pwd);
    setData("send_password_email", true);
  };

  const copyPassword = async () => {
    if (!data.password) return;
    try {
      await navigator.clipboard.writeText(data.password);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    put(PATHS.update, { preserveScroll: true, onFinish: () => setIsSubmitting(false) });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Users", href: `${API}/users` },
        { title: user.name, href: `${API}/users/${user.id}` },
        { title: "Edit", href: `${API}/users/${user.id}/edit` },
      ]}
    >
      <Head title={`Edit User: ${user.name}`} />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.visit(PATHS.show)} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit User</h1>
              <p className="text-muted-foreground">Update account and access details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Modify details and save changes</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name *
                      </Label>
                      <Input value={data.name} onChange={(e) => setData("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email *
                      </Label>
                      <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {meta?.supportsUsername && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Hash className="h-4 w-4" /> Username
                        </Label>
                        <Input value={data.username} onChange={(e) => setData("username", e.target.value)} className={errors.username ? "border-red-500" : ""} />
                        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                      </div>
                    )}

                    {meta?.supportsRoleColumn && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Shield className="h-4 w-4" /> Legacy Role
                        </Label>
                        <Input value={data.role} onChange={(e) => setData("role", e.target.value)} className={errors.role ? "border-red-500" : ""} />
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                      </div>
                    )}

                    {/* Password (optional on edit) */}
                    <div className="space-y-2">
                      <Label className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4" /> New Password (optional)
                        </span>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={handleGeneratePassword} className="gap-1">
                            <Wand2 className="h-4 w-4" />
                            Generate
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={copyPassword} disabled={!data.password} className="gap-1">
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                      </Label>
                      <Input
                        type="text"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className={errors.password ? "border-red-500" : ""}
                        placeholder="Leave blank to keep current password"
                      />
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      <p className="text-xs text-muted-foreground">
                        If you set a new password, it can be emailed to the user.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" /> Confirm Password
                      </Label>
                      <Input
                        type="text"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        className={errors.password_confirmation ? "border-red-500" : ""}
                        placeholder="Must match new password"
                      />
                      {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                    </div>
                  </div>

                  {/* Send password email (only relevant if password is set) */}
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox
                      checked={!!data.send_password_email}
                      onCheckedChange={(v) => setData("send_password_email", !!v)}
                      disabled={!data.email || !data.password}
                    />
                    <div className="text-sm">
                      <div className="font-medium">Email new password to user</div>
                      <div className="text-muted-foreground">
                        Enabled only when an email exists and a new password is set.
                      </div>
                    </div>
                  </div>

                  {meta?.supportsEmailVerification && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                        <Checkbox checked={!!data.mark_email_verified} onCheckedChange={(v) => setData("mark_email_verified", !!v)} />
                        <div className="text-sm">
                          <div className="font-medium">Mark email as verified</div>
                          <div className="text-muted-foreground">Sets verification date if not already verified</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                        <Checkbox checked={!!data.unverify_email} onCheckedChange={(v) => setData("unverify_email", !!v)} />
                        <div className="text-sm">
                          <div className="font-medium">Unverify email</div>
                          <div className="text-muted-foreground">Clears email_verified_at</div>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Roles */}
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">Assign Roles (RBAC)</CardTitle>
                      <CardDescription>Select one or more roles for this user</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roles.map((r: any) => (
                        <label key={r.id} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                          <Checkbox checked={data.role_ids.includes(r.id)} onCheckedChange={() => toggleRole(r.id)} />
                          <div className="min-w-0">
                            <div className="font-medium flex items-center gap-2">
                              {r.name} <Badge className="bg-slate-700 text-white">{r.code}</Badge>
                            </div>
                          </div>
                        </label>
                      ))}
                      {errors.role_ids && <p className="text-sm text-red-500">{errors.role_ids}</p>}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-4 pt-2">
                    <Button type="button" variant="outline" onClick={() => router.visit(PATHS.show)} disabled={processing}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={processing || isSubmitting} className="min-w-[160px]">
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

          <div className="space-y-6">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Tip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Generate a new password when user forgets login details.</p>
                <p>The email will only send if you set a new password and enable the checkbox.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}