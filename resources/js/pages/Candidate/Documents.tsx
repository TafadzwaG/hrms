import { useForm, usePage } from '@inertiajs/react';
import { Download, FileText, Star, Upload, Calendar, Database, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

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
            active="documents"
            candidate={candidate}
        >
            <div className="w-full px-6 md:px-10">
                {/* Page Title */}
                <div className="mb-12">
                    <h1 className="text-[2.5rem] font-black tracking-tighter leading-none text-black mb-2 uppercase">Documents.</h1>
                    <p className="text-zinc-500 max-w-xl font-medium">Upload resumes, portfolios, and supporting documents.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: Upload Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 pb-4">
                                <Upload className="h-5 w-5 text-black" />
                                <h2 className="text-lg font-bold tracking-tight text-black uppercase">Upload Document</h2>
                            </div>

                            <form className="space-y-6">
                                {/* File Input Styled for Archive Look */}
                                <FormField label="Select File" error={form.errors.document}>
                                    <div className="border-2 border-dashed border-zinc-300 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-50 hover:border-black transition-all cursor-pointer relative group">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="h-4 w-4 text-black" />
                                        </div>
                                        <span className="text-sm font-bold text-black block mb-1">Choose a file</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">PDF, DOCX (Max 10MB)</span>
                                        <input 
                                            type="file" 
                                            onChange={(event) => form.setData('document', event.target.files?.[0] ?? null)} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        />
                                    </div>
                                    {form.data.document && (
                                        <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
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
                                        rows={3}
                                        value={form.data.description}
                                        onChange={(event) => form.setData('description', event.target.value)}
                                        className="w-full bg-transparent border-0 border-b border-zinc-300 focus:ring-0 focus:border-black px-0 py-2 transition-all text-sm font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none resize-none"
                                        placeholder="Briefly describe this version..."
                                    />
                                </FormField>

                                <label className="flex items-center gap-3 py-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_primary}
                                        onChange={(event) => form.setData('is_primary', event.target.checked)}
                                        className="w-4 h-4 rounded-none border-zinc-300 text-black focus:ring-black transition-all cursor-pointer"
                                    />
                                    <span className="text-sm font-bold text-zinc-700 group-hover:text-black">Set as primary document</span>
                                </label>

                                <div className="pt-4">
                                    <Button
                                        type="button"
                                        className="w-full bg-black text-white py-6 h-auto text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-sm flex items-center justify-center gap-2"
                                        onClick={() => form.post('/candidate/documents', { forceFormData: true, preserveScroll: true })}
                                        disabled={form.processing}
                                    >
                                        <Upload className="h-4 w-4" />
                                        Process Document
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Saved Documents */}
                    <div className="lg:col-span-7">
                        <div className="flex items-end justify-between mb-8 border-b border-zinc-200 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-black">Saved Documents</h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1">Managing {documents.length} active assets</p>
                            </div>
                        </div>

                        {documents.length > 0 ? (
                            <div className="space-y-4">
                                {documents.map((document) => (
                                    <div key={document.id} className="bg-white p-6 flex flex-col sm:flex-row items-start gap-5 group relative shadow-sm border border-zinc-200 hover:border-black transition-all rounded-lg">
                                        <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center rounded-md shrink-0">
                                            <FileText className="text-black h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <h3 className="font-bold text-base truncate tracking-tight text-black">{document.file_name}</h3>
                                                    {document.is_primary ? (
                                                        <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shrink-0">
                                                            Primary
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    {document.document_type?.replace(/_/g, ' ')}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatCandidateDate(document.uploaded_at)}
                                                </span>
                                                {document.size != null ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <Database className="h-3.5 w-3.5" />
                                                        {(document.size / 1024).toFixed(1)} KB
                                                    </span>
                                                ) : null}
                                            </div>

                                            {document.description ? (
                                                <p className="text-sm text-zinc-600 line-clamp-2 italic mb-4">"{document.description}"</p>
                                            ) : null}

                                            {/* Actions Row */}
                                            <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center gap-4">
                                                {!document.is_primary ? (
                                                    <button 
                                                        type="button"
                                                        onClick={() => form.put(`/candidate/documents/${document.id}/primary`, { preserveScroll: true })}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
                                                    >
                                                        <Star className="h-3.5 w-3.5" /> Set Primary
                                                    </button>
                                                ) : null}
                                                
                                                <a href={document.download_url} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                                                    <Download className="h-3.5 w-3.5" /> Download
                                                </a>
                                                
                                                <button 
                                                    type="button"
                                                    onClick={() => window.confirm('Delete this document?') && form.delete(`/candidate/documents/${document.id}`, { preserveScroll: true })}
                                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors ml-auto sm:ml-0"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
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
        </CandidateHubLayout>
    );
}

function FormField({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
    return (
        <div className={`space-y-1.5 ${className ?? ''}`}>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {label}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}

const underlinedInput = "w-full bg-transparent border-0 border-b border-zinc-300 focus:ring-0 focus:border-black px-0 py-2.5 transition-all text-sm font-semibold text-black placeholder:text-zinc-400 appearance-none outline-none";