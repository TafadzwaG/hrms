import {
    Bold,
    Heading3,
    Heading4,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    RemoveFormatting,
    Undo,
    Underline,
} from 'lucide-react';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

type RichTextContentProps = {
    html?: string | null;
    className?: string;
};

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Start writing…',
    className,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isEmpty = useMemo(() => richTextToPlainText(value).trim().length === 0, [value]);

    useEffect(() => {
        if (!editorRef.current || editorRef.current.innerHTML === value) {
            return;
        }

        editorRef.current.innerHTML = value;
    }, [value]);

    const syncValue = () => {
        const nextValue = normalizeEditorHtml(editorRef.current?.innerHTML ?? '');

        if (nextValue !== value) {
            onChange(nextValue);
        }
    };

    const runCommand = (command: string, commandValue?: string) => {
        if (!editorRef.current || typeof document === 'undefined') {
            return;
        }

        editorRef.current.focus();
        document.execCommand(command, false, commandValue);
        syncValue();
    };

    const insertLink = () => {
        const href = window.prompt('Enter a URL', 'https://');

        if (!href) {
            return;
        }

        const trimmed = href.trim();

        if (!trimmed) {
            return;
        }

        const normalized = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed) ? trimmed : `https://${trimmed}`;

        runCommand('createLink', normalized);
    };

    return (
        <div className={cn('rounded-lg border border-zinc-200 bg-white shadow-sm', className)}>
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
                <ToolbarButton icon={<Undo className="h-3.5 w-3.5" />} label="Undo" onClick={() => runCommand('undo')} />
                <ToolbarButton icon={<Redo className="h-3.5 w-3.5" />} label="Redo" onClick={() => runCommand('redo')} />
                <ToolbarDivider />
                <ToolbarButton icon={<Heading3 className="h-3.5 w-3.5" />} label="Heading 3" onClick={() => runCommand('formatBlock', '<h3>')} />
                <ToolbarButton icon={<Heading4 className="h-3.5 w-3.5" />} label="Heading 4" onClick={() => runCommand('formatBlock', '<h4>')} />
                <ToolbarButton icon={<Bold className="h-3.5 w-3.5" />} label="Bold" onClick={() => runCommand('bold')} />
                <ToolbarButton icon={<Italic className="h-3.5 w-3.5" />} label="Italic" onClick={() => runCommand('italic')} />
                <ToolbarButton icon={<Underline className="h-3.5 w-3.5" />} label="Underline" onClick={() => runCommand('underline')} />
                <ToolbarDivider />
                <ToolbarButton icon={<List className="h-3.5 w-3.5" />} label="Bullet list" onClick={() => runCommand('insertUnorderedList')} />
                <ToolbarButton icon={<ListOrdered className="h-3.5 w-3.5" />} label="Numbered list" onClick={() => runCommand('insertOrderedList')} />
                <ToolbarButton icon={<Quote className="h-3.5 w-3.5" />} label="Quote" onClick={() => runCommand('formatBlock', '<blockquote>')} />
                <ToolbarButton icon={<LinkIcon className="h-3.5 w-3.5" />} label="Insert link" onClick={insertLink} />
                <ToolbarButton icon={<RemoveFormatting className="h-3.5 w-3.5" />} label="Clear formatting" onClick={() => runCommand('removeFormat')} />
            </div>

            <div className="relative">
                {isEmpty ? (
                    <div className="pointer-events-none absolute inset-x-0 top-0 px-4 py-3 text-sm text-zinc-400">
                        {placeholder}
                    </div>
                ) : null}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="rich-text-editor min-h-[180px] px-4 py-3 text-sm leading-6 text-black outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_h3]:text-lg [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:text-black [&_h4]:text-base [&_h4]:font-bold [&_h4]:tracking-tight [&_h4]:text-black [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                    onInput={syncValue}
                    onBlur={syncValue}
                    onPaste={(event) => {
                        event.preventDefault();
                        const text = event.clipboardData.getData('text/plain');
                        document.execCommand('insertText', false, text);
                        syncValue();
                    }}
                />
            </div>

            <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Supports headings, bold, italic, underline, lists, quotes, links, undo, and redo.
            </div>
        </div>
    );
}

export function RichTextContent({ html, className }: RichTextContentProps) {
    if (!html || richTextToPlainText(html).trim().length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'rich-text-content text-sm leading-6 text-zinc-600 [&_a]:font-semibold [&_a]:text-black [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-black [&_h3]:tracking-tight [&_h4]:mb-3 [&_h4]:text-base [&_h4]:font-bold [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export function richTextToPlainText(html?: string | null): string {
    if (!html) {
        return '';
    }

    const normalized = html
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<\/(p|div|h[1-6]|blockquote|li)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'");

    return normalized
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function ToolbarButton({
    icon,
    label,
    onClick,
}: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClick}
            className="inline-flex h-8 items-center justify-center rounded-sm border border-transparent px-2 text-zinc-500 transition-colors hover:border-zinc-200 hover:bg-white hover:text-black"
        >
            {icon}
        </button>
    );
}

function ToolbarDivider() {
    return <span className="mx-1 h-5 w-px bg-zinc-200" />;
}

function normalizeEditorHtml(html: string): string {
    const normalized = html
        .replace(/<div><br><\/div>/gi, '')
        .replace(/<p><br><\/p>/gi, '')
        .trim();

    return richTextToPlainText(normalized) ? normalized : '';
}
