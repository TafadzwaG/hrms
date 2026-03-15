import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ArrowLeft, FileDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function EmployeesUpload() {
  const { flash, errors } = usePage().props as any;

  const PATHS = {
    index: `${API}/employees`,
    template: `${API}/employees/template`,
    import: `${API}/employees/import`,
  };

  const { data, setData, post, processing, progress } = useForm<{ file: File | null }>({
    file: null,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setData("file", acceptedFiles?.[0] ?? null);
    },
    [setData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/csv": [".csv"], "text/plain": [".txt"] },
    maxFiles: 1,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(PATHS.import, {
      forceFormData: true,
      onSuccess: () => setData("file", null),
    });
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Employees", href: `${API}/employees` }, { title: "Upload", href: `${API}/employees/upload` }]}>
      <Head title="Upload Employees" />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link href={PATHS.index}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Bulk Upload Employees</h1>
              <p className="text-muted-foreground">Download template, fill it, and upload CSV</p>
            </div>
          </div>

          <Button asChild variant="secondary" className="gap-2">
            <a href={PATHS.template}>
              <FileDown className="h-4 w-4" />
              Download Template
            </a>
          </Button>
        </div>

        {flash?.success && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{flash.success}</AlertDescription>
          </Alert>
        )}
        {flash?.error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{flash.error}</AlertDescription>
          </Alert>
        )}
        {errors?.file && (
          <Alert variant="destructive">
            <AlertTitle>Upload error</AlertTitle>
            <AlertDescription>{errors.file}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>CSV Upload</CardTitle>
            <CardDescription>
              Columns: staff_number, first_name, surname, national_id, gender, marital_status, email, nationality, educational_level, occupation, alt_phone_number, department_id, position_id…
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={[
                "rounded-lg border border-dashed p-8 text-center transition",
                isDragActive ? "bg-muted" : "bg-background",
                "cursor-pointer",
              ].join(" ")}
            >
              <input {...getInputProps()} />
              <div className="mx-auto max-w-md space-y-2">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the file here..." : "Drag & drop your CSV here, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground">Accepted: .csv (max 5MB)</p>
              </div>
            </div>

            {data.file ? (
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Selected</Badge>
                    <span className="text-sm font-medium">{data.file.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{(data.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button variant="ghost" onClick={() => setData("file", null)}>
                  Remove
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No file selected.</p>
            )}

            {progress?.percentage != null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress.percentage}%</span>
                </div>
                <Progress value={progress.percentage} />
              </div>
            )}

            <form onSubmit={submit} className="flex justify-end gap-2">
              <Button type="button" variant="secondary" asChild className="gap-2">
                <a href={PATHS.template}>
                  <FileDown className="h-4 w-4" />
                  Download Template
                </a>
              </Button>
              <Button type="submit" disabled={processing || !data.file} className="gap-2">
                <UploadCloud className="h-4 w-4" />
                {processing ? "Uploading..." : "Upload & Import"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
