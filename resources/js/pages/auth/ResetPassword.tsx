import { API } from "@/config";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { KeyRound, Mail, Save } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PageProps = {
  token: string;
  email: string;
  errors?: Record<string, string>;
  flash?: { success?: string; error?: string };
};

export default function ResetPassword() {
  const { token, email, errors, flash } = usePage<PageProps>().props;

  const { data, setData, post, processing } = useForm({
    token,
    email,
    password: "",
    password_confirmation: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`${API}/reset-password`, { preserveScroll: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Head title="Reset Password" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Set a new password for your account.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {flash?.success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {flash.success}
            </div>
          )}
          {(flash?.error || errors?.reset) && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {flash?.error ?? errors?.reset}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </label>
              <Input value={data.email} readOnly />
              {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> New Password
              </label>
              <Input
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className={errors?.password ? "border-red-500" : ""}
              />
              {errors?.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Confirm Password
              </label>
              <Input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                className={errors?.password_confirmation ? "border-red-500" : ""}
              />
              {errors?.password_confirmation && (
                <p className="text-sm text-red-500">{errors.password_confirmation}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={processing}>
              <Save className="h-4 w-4" />
              {processing ? "Saving..." : "Reset Password"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.visit("/login")}
            >
              Back to login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}