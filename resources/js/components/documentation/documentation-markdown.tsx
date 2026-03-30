import { cn } from '@/lib/utils';

export function DocumentationMarkdown({
    html,
    className,
}: {
    html: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'documentation-markdown text-sm leading-6 text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.92em] [&_h1]:mt-0 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_li]:text-muted-foreground [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_p]:text-muted-foreground [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-4 [&_table]:w-full [&_tbody_td]:border-b [&_tbody_td]:border-border [&_tbody_td]:px-3 [&_tbody_td]:py-2 [&_thead_th]:border-b [&_thead_th]:border-border [&_thead_th]:px-3 [&_thead_th]:py-2 [&_thead_th]:text-left [&_thead_th]:text-xs [&_thead_th]:font-semibold [&_thead_th]:uppercase [&_thead_th]:tracking-wide [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
