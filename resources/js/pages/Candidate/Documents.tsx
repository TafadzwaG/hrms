import { useForm, usePage } from '@inertiajs/react';
import { Download, FileText, Star, Upload } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    CandidateEmptyState,
    CandidateHubLayout,
    CandidateSectionCard,
    formatCandidateDate,
} from './components/hub';
import type { CandidateDocument, CandidateUser } from './dummyData';

type PageProps = {
    candidate: CandidateUser;
    documents: CandidateDocument[];
    documentTypes: string[];
};

export default function CandidateDocumentsPage() {
    const { candidate, documents, documentTypes } = usePage<PageProps>().props;

    const form = useForm<{
        document: File | null;
        document_type: string;
        description: string;
        is_primary: boolean;
    }>({
        document: null,
        document_type: 'resume',
        description: '',
        is_primary: false,
    });

    return (
        <CandidateHubLayout
            title="Documents"
            subtitle="Upload resumes, portfolios, and supporting documents."
            active="documents"
            candidate={candidate}
        >
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <CandidateSectionCard title="Upload Document" icon={<Upload className="h-4 w-4" />}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">File</label>
                            <input
                                type="file"
                                onChange={(event) => form.setData('document', event.target.files?.[0] ?? null)}
                                className={inputClassName}
                            />
                            <InputError message={form.errors.document} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Document Type</label>
                            <select value={form.data.document_type} onChange={(event) => form.setData('document_type', event.target.value)} className={inputClassName}>
                                {documentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.document_type} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <textarea
                                rows={4}
                                value={form.data.description}
                                onChange={(event) => form.setData('description', event.target.value)}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                placeholder="Describe this document."
                            />
                            <InputError message={form.errors.description} />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-foreground">
                            <input type="checkbox" checked={form.data.is_primary} onChange={(event) => form.setData('is_primary', event.target.checked)} />
                            Set as primary document
                        </label>
                        <Button
                            onClick={() => form.post('/candidate/documents', { forceFormData: true, preserveScroll: true })}
                            disabled={form.processing}
                        >
                            Upload Document
                        </Button>
                    </div>
                </CandidateSectionCard>

                <CandidateSectionCard title="Saved Documents" icon={<FileText className="h-4 w-4" />}>
                    {documents.length > 0 ? (
                        <div className="space-y-4">
                            {documents.map((document) => (
                                <div key={document.id} className="rounded-xl border border-border bg-background p-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-foreground">{document.file_name}</p>
                                                {document.is_primary && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                        <Star className="h-3 w-3" /> Primary
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span>{document.document_type?.replace(/_/g, ' ')}</span>
                                                <span>{formatCandidateDate(document.uploaded_at)}</span>
                                                {document.size != null && <span>{(document.size / 1024).toFixed(1)} KB</span>}
                                            </div>
                                            {document.description && <p className="mt-2 text-sm text-muted-foreground">{document.description}</p>}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <a href={document.download_url}>
                                                <Button type="button" variant="outline" size="sm">
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </Button>
                                            </a>
                                            {!document.is_primary && (
                                                <Button type="button" variant="outline" size="sm" onClick={() => form.put(`/candidate/documents/${document.id}/primary`, { preserveScroll: true })}>
                                                    Set Primary
                                                </Button>
                                            )}
                                            <Button type="button" variant="destructive" size="sm" onClick={() => window.confirm('Delete this document?') && form.delete(`/candidate/documents/${document.id}`, { preserveScroll: true })}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <CandidateEmptyState message="No documents uploaded yet." />
                    )}
                </CandidateSectionCard>
            </div>
        </CandidateHubLayout>
    );
}

const inputClassName = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm';
