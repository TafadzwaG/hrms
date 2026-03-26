import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type OcrPage = {
    id?: number;
    page_number: number;
    text: string | null;
    confidence: number | null;
};

export function OcrTextViewer({
    fullText,
    pages,
    title = 'Extracted Text',
}: {
    fullText: string | null;
    pages: OcrPage[];
    title?: string;
}) {
    return (
        <Card className="border-border bg-background shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Full Text
                    </p>
                    <div className="max-h-80 overflow-y-auto rounded-lg border bg-muted/20 p-4 text-sm leading-6 whitespace-pre-wrap text-foreground">
                        {fullText?.trim() || 'No extracted text is available yet.'}
                    </div>
                </div>

                {pages.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Per Page
                        </p>
                        {pages.map((page, index) => (
                            <div key={page.id ?? `${page.page_number}-${index}`} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Page {page.page_number}
                                    </h3>
                                    <span className="text-xs text-muted-foreground">
                                        Confidence{' '}
                                        {page.confidence != null
                                            ? `${Math.round(page.confidence * 100)}%`
                                            : '—'}
                                    </span>
                                </div>
                                <div className="rounded-lg border bg-background p-4 text-sm leading-6 whitespace-pre-wrap text-foreground">
                                    {page.text?.trim() || 'No text extracted for this page.'}
                                </div>
                                {index < pages.length - 1 && <Separator />}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
