import { useForm, usePage } from '@inertiajs/react';
import { Download, FileText, Star, Upload, Calendar, Database, Trash2 } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { DocumentPreviewDialog } from '@/components/document-preview-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    CandidateEmptyState,
    CandidateHubLayout,
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
    const [activeDocumentId, setActiveDocumentId] = useState<number | null>(documents[0]?.id ?? null);
    const [previewOpen, setPreviewOpen] = useState(false);

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

    const activeDocument = useMemo(
        () => documents.find((document) => document.id === activeDocumentId) ?? documents[0] ?? null,
        [activeDocumentId, documents],
    );

    const togglePreview = (documentId: number) => {
        if (activeDocumentId === documentId && previewOpen) {
            setPreviewOpen(false);
            return;
        }

        setActiveDocumentId(documentId);
        setPreviewOpen(true);
    };

    return (
        <CandidateHubLayout
            title="Documents"
            active="documents"
            candidate={candidate}
        >
            <div className="w-full px-4 md:px-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Documents.</h1>
                    <p className="text-zinc-500 max-w-xl text-sm font-medium">Upload resumes, portfolios, and supporting documents.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Upload Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-3">
                                <Upload className="h-4 w-4 text-black" />
                                <h2 className="text-sm font-bold tracking-tight text-black uppercase">Upload Document</h2>
                            </div>

                            <form className="space-y-5">
                                {/* File Input Styled for Archive Look */}
                                <FormField label="Select File" error={form.errors.document}>
                                    <div className="border-2 border-dashed border-zinc-300 bg-white rounded-sm p-5 flex flex-col items-center justify-center text-center hover:bg-zinc-50 hover:border-black transition-all cursor-pointer relative group">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="h-3.5 w-3.5 text-black" />
                                        </div>
                                        <span className="text-xs font-bold text-black block mb-0.5">Choose a file</span>
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">PDF, DOCX (Max 10MB)</span>
                                        <input 
                                            type="file" 
                                            onChange={(event) => form.setData('document', event.target.files?.[0] ?? null)} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        />
                                    </div>
                                    {form.data.document && (
                                        <p className="text-[10px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                                            File selected: {form.data.document.name}
                                        </p>
                                    )}
                                </FormField>

                                <FormField label="Document Type" error={form.errors.document_type}>
                                    <select 
                                        value={form.data.document_type} 
                                        onChange={(event) => form.setData('document_type', event.target.value)} 
                                        className={underlinedInput}
                                    >
                                        {documentTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Description" error={form.errors.description}>
                                    <Textarea
                                        rows={2}
                                        value={form.data.description}
                                        onChange={(event) => form.setData('description', event.target.value)}
                                        className="w-full bg-transparent border-0 border-b border-zinc-300 focus:ring-0 focus:border-black px-0 py-1.5 transition-all text-xs font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none resize-none"
                                        placeholder="Briefly describe this version..."
                                    />
                                </FormField>

                                <label className="flex items-center gap-2 py-1 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_primary}
                                        onChange={(event) => form.setData('is_primary', event.target.checked)}
                                        className="h-3.5 w-3.5 rounded-none border-zinc-300 text-black focus:ring-black transition-all cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-zinc-700 group-hover:text-black">Set as primary document</span>
                                </label>

                                <div className="pt-2">
                                    <Button
                                        type="button"
                                        className="w-full bg-black text-white py-4 h-auto text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-sm flex items-center justify-center gap-2"
                                        onClick={() => form.post('/candidate/documents', { forceFormData: true, preserveScroll: true })}
                                        disabled={form.processing}
                                    >
                                        <Upload className="h-3.5 w-3.5" />
                                        Process Document
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Saved Documents */}
                    <div className="lg:col-span-7">
                        <div className="flex items-end justify-between mb-6 border-b border-zinc-200 pb-3">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-black">Saved Documents</h2>
                                <p className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 mt-0.5">Managing {documents.length} active assets</p>
                            </div>
                        </div>

                        {documents.length > 0 ? (
                            <div className="space-y-3">
                                {documents.map((document) => (
                                    <div key={document.id} className="bg-white p-5 flex flex-col sm:flex-row items-start gap-4 group relative shadow-sm border border-zinc-200 hover:border-black transition-all rounded-sm">
                                        <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-sm shrink-0">
                                            <FileText className="text-black h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <h3 className="font-bold text-sm truncate tracking-tight text-black">{document.file_name}</h3>
                                                    {document.is_primary ? (
                                                        <span className="px-1.5 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-sm shrink-0">
                                                            Primary
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {document.document_type?.replace(/_/g, ' ')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatCandidateDate(document.uploaded_at)}
                                                </span>
                                                {document.size != null ? (
                                                    <span className="flex items-center gap-1">
                                                        <Database className="h-3 w-3" />
                                                        {(document.size / 1024).toFixed(1)} KB
                                                    </span>
                                                ) : null}
                                            </div>

                                            {document.description ? (
                                                <p className="text-xs text-zinc-600 line-clamp-2 italic mb-3">"{document.description}"</p>
                                            ) : null}

                                            {/* Actions Row */}
                                            <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => togglePreview(document.id)}
                                                    className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors ${
                                                        activeDocument?.id === document.id && previewOpen
                                                            ? 'text-black'
                                                            : 'text-zinc-500 hover:text-black'
                                                    }`}
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    {activeDocument?.id === document.id && previewOpen ? 'Close Preview' : 'Open Preview'}
                                                </button>

                                                {!document.is_primary ? (
                                                    <button 
                                                        type="button"
                                                        onClick={() => form.put(`/candidate/documents/${document.id}/primary`, { preserveScroll: true })}
                                                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
                                                    >
                                                        <Star className="h-3 w-3" /> Set Primary
                                                    </button>
                                                ) : null}
                                                
                                                <a href={document.download_url} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                                                    <Download className="h-3 w-3" /> Download
                                                </a>
                                                
                                                <button 
                                                    type="button"
                                                    onClick={() => window.confirm('Delete this document?') && form.delete(`/candidate/documents/${document.id}`, { preserveScroll: true })}
                                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors ml-auto sm:ml-0"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CandidateEmptyState message="Upload your CV or resume to start applying for roles." />
                        )}
                    </div>
                </div>
            </div>
            <DocumentPreviewDialog document={activeDocument} open={previewOpen} onOpenChange={setPreviewOpen} />
        </CandidateHubLayout>
    );
}

function FormField({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
    return (
        <div className={`space-y-1 ${className ?? ''}`}>
            <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-300 focus:ring-0 focus:border-black px-0 py-1.5 transition-all text-xs font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";