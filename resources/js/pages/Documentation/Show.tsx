import { DocumentationMarkdown } from '@/components/documentation/documentation-markdown';
import { FlowDiagram } from '@/components/documentation/flow-diagram';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { sectionTitles, type DocumentationEntry, type DocumentationSections } from '@/lib/documentation';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Download, FileCode2 } from 'lucide-react';

type FlowNode = { id: string; label: string; type: string };
type FlowEdge = { from: string; to: string; label: string | null };

type DocumentationDocument = DocumentationEntry & {
    markdown: string;
    blocks: Array<
        | { type: 'markdown'; html: string }
        | { type: 'flowchart'; source: string; svg: string; nodes: FlowNode[]; edges: FlowEdge[]; direction: string }
    >;
};

export default function DocumentationShow() {
    const { document, sections } = usePage<{
        document: DocumentationDocument;
        sections: DocumentationSections;
    }>().props;

    const siblingEntries = sections[document.section].filter((entry) => entry.slug !== document.slug);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Documentation', href: '/documentation' },
                { title: document.title, href: document.href },
            ]}
        >
            <Head title={document.title} />

            <div className="w-full space-y-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-md border-border bg-muted/30 text-[11px] text-muted-foreground shadow-none">
                                <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                                {sectionTitles[document.section]}
                            </Badge>
                            <Badge variant="outline" className="rounded-md border-border bg-muted/30 text-[11px] text-muted-foreground shadow-none">
                                Markdown
                            </Badge>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {document.title}
                            </h1>
                            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                                {document.summary}
                            </p>
                        </div>
                    </div>

                    <Link href="/documentation">
                        <span className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/40">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to documentation
                        </span>
                    </Link>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <Card className="border-border/70 bg-background/95 shadow-sm">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {document.blocks.map((block, index) =>
                                    block.type === 'markdown' ? (
                                        <DocumentationMarkdown key={`md-${index}`} html={block.html} />
                                    ) : (
                                        <FlowDiagram
                                            key={`flow-${index}`}
                                            nodes={block.nodes}
                                            edges={block.edges}
                                            direction={block.direction}
                                        />
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/70 bg-background/95 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Document metadata</CardTitle>
                                <CardDescription>Source and update details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <a
                                    href={`/documentation/${document.section}/${document.slug}/pdf`}
                                    className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/40"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </a>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Source file</p>
                                    <p className="mt-1 break-all text-foreground">{document.path}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Updated</p>
                                    <p className="mt-1 text-foreground">{new Date(document.updated_at).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/70 bg-background/95 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <FileCode2 className="h-4 w-4" />
                                    More in this section
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {siblingEntries.map((entry) => (
                                    <Link
                                        key={`${entry.section}:${entry.slug}`}
                                        href={entry.href}
                                        className="block rounded-lg border border-border/70 bg-card px-3 py-2 transition-colors hover:bg-muted/40"
                                    >
                                        <p className="text-sm font-medium text-foreground">{entry.title}</p>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.summary}</p>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
