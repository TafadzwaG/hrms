import * as React from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { importMethod as importOrgUnits, index as orgUnitsIndex, template as orgUnitsTemplate } from "@/routes/org-units";

type PageProps = {
  types: string[];
  flash?: { success?: string; error?: string };
  errors?: Record<string, string>;
};

export default function Upload() {
  const { flash, errors } = usePage<PageProps>().props;

  const { data, setData, post, processing, progress } = useForm<{
    file: File | null;
  }>({
    file: null,
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles?.[0] ?? null;
    setData("file", file);
  }, [setData]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(importOrgUnits.url(), {
      forceFormData: true,
      onSuccess: () => setData("file", null),
    });
  }

  const selected = data.file ?? acceptedFiles?.[0];

  return (
    <>
      <Head title="Upload Org Units" />

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Upload Org Units</h1>
            <p className="text-sm text-muted-foreground">
              Upload a CSV template to bulk create/update org units.
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link href={orgUnitsIndex.url()}>Back</Link>
            </Button>
            <Button asChild variant="secondary">
              {/* normal download link */}
              <a href={orgUnitsTemplate.url()}>Download Template</a>
            </Button>
          </div>
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
              Download the template first, fill it, then upload. Existing records will be updated if the <b>code</b> matches.
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

            {selected ? (
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Selected</Badge>
                    <span className="text-sm font-medium">{selected.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(selected.size / 1024).toFixed(1)} KB
                  </p>
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
              <Button type="button" variant="secondary" asChild>
                <a href={orgUnitsTemplate.url()}>Download Template</a>
              </Button>
              <Button type="submit" disabled={processing || !data.file}>
                {processing ? "Uploading..." : "Upload & Import"}
              </Button>
            </form>

            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium mb-2">Template Columns</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><b>name</b> (required)</li>
                <li><b>type</b> (required): COMPANY | SBU | DEPARTMENT | TEAM</li>
                <li><b>parent_code</b> (optional): code of the parent org unit</li>
                <li><b>code</b> (optional): unique identifier (recommended)</li>
                <li><b>cost_center</b> (optional)</li>
                <li><b>effective_from</b>, <b>effective_to</b> (optional): YYYY-MM-DD</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
