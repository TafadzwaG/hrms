import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { FileImage, FileText, UploadCloud } from 'lucide-react';
import * as React from 'react';

type UploadErrorBag = {
    file?: string;
};

export function DocumentUploadCard({
    file,
    setFile,
    processing,
    progress,
    errors,
}: {
    file: File | null;
    setFile: (file: File | null) => void;
    processing: boolean;
    progress?: number | null;
    errors?: UploadErrorBag;
}) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            setFile(acceptedFiles?.[0] ?? null);
        },
        [setFile],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp'],
        },
        maxFiles: 1,
    });

    const fileIcon = file?.type === 'application/pdf' ? FileText : FileImage;
    const FileIcon = fileIcon;

    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader>
                <CardTitle>OCR Document Upload</CardTitle>
                <CardDescription>
                    Upload PDF or image files for private storage and queued OCR processing.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {errors?.file && (
                    <Alert variant="destructive">
                        <AlertTitle>Upload error</AlertTitle>
                        <AlertDescription>{errors.file}</AlertDescription>
                    </Alert>
                )}

                <div
                    {...getRootProps()}
                    className={[
                        'cursor-pointer rounded-lg border border-dashed p-8 text-center transition-colors',
                        isDragActive ? 'bg-muted' : 'bg-background',
                    ].join(' ')}
                >
                    <input {...getInputProps()} />
                    <div className="mx-auto max-w-md space-y-2">
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? 'Drop the document here...'
                                : 'Drag & drop your OCR document here, or click to select'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Accepted: PDF, PNG, JPG, JPEG, WEBP (max 20MB)
                        </p>
                    </div>
                </div>

                {file ? (
                    <div className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">Selected</Badge>
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                <FileIcon className="h-4 w-4" />
                            </div>
                            <Button variant="ghost" type="button" onClick={() => setFile(null)}>
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No file selected.</p>
                )}

                {progress != null && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>{processing ? 'Uploading...' : 'Upload progress'}</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                )}

                <div className="flex items-center gap-2 rounded-md border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <UploadCloud className="h-4 w-4" />
                    OCR uploads are stored privately and processed by the queue worker.
                </div>
            </CardContent>
        </Card>
    );
}
