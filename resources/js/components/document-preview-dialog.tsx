import { Download } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PreviewableDocument = {
    file_name: string;
    document_type?: string | null;
    mime_type?: string | null;
    size?: number | null;
    preview_url: string;
    download_url: string;
};

type DocumentPreviewDialogProps = {
    document: PreviewableDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DocumentPreviewDialog({ document, open, onOpenChange }: DocumentPreviewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="7xl" className="overflow-hidden border-zinc-200 bg-white p-0">
                {document ? (
                    <>
                        <DialogHeader className="border-b border-zinc-200 px-8 py-6 pr-14">
                            <DialogTitle className="text-left text-xl font-black tracking-tight text-black">
                                {document.file_name}
                            </DialogTitle>
                            <DialogDescription className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                {[
                                    document.document_type?.replace(/_/g, ' '),
                                    document.mime_type,
                                    document.size != null ? formatDocumentSize(document.size) : null,
                                ].filter(Boolean).join(' · ') || 'Candidate document preview'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-zinc-50 px-8 py-4">
                            <p className="text-xs font-medium text-zinc-500">
                                Preview the document inline. Close the dialog to return to the page.
                            </p>
                            <a
                                href={document.download_url}
                                className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 transition-colors hover:border-black hover:text-black"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download
                            </a>
                        </div>

                        <div className="bg-zinc-100 p-6">
                            <iframe
                                key={document.preview_url}
                                src={document.preview_url}
                                title={`${document.file_name} preview`}
                                className="h-[78vh] w-full rounded-sm border border-zinc-200 bg-white"
                            />
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function formatDocumentSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 102.4) / 10} KB`;
    }

    return `${Math.round(bytes / (1024 * 102.4)) / 10} MB`;
}
