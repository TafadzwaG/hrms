import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

let initialized = false;

function ensureInit() {
    if (initialized) return;
    initialized = true;
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
            primaryColor: '#f8fafc',
            primaryTextColor: '#0f172a',
            primaryBorderColor: '#94a3b8',
            lineColor: '#475569',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#f8fafc',
            nodeBorder: '#94a3b8',
            clusterBkg: '#f1f5f9',
            titleColor: '#0f172a',
            edgeLabelBackground: '#ffffff',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
        },
        flowchart: {
            curve: 'basis',
            padding: 24,
            htmlLabels: false,
            nodeSpacing: 60,
            rankSpacing: 80,
        },
        securityLevel: 'loose',
    });
}

function normalizeSvg(raw: string): string {
    // Remove the inline max-width so the SVG can fill its container
    let svg = raw.replace(/style="([^"]*max-width:[^;]*;?\s*)/g, (_, inner) => {
        const cleaned = inner.replace(/max-width:[^;]*;?\s*/g, '').trim();
        return cleaned ? `style="${cleaned}"` : '';
    });
    // Force responsive width / auto height
    svg = svg.replace(/<svg([^>]*)>/, (_, attrs) => {
        let a = attrs
            .replace(/\bwidth="[^"]*"/g, '')
            .replace(/\bheight="[^"]*"/g, '')
            .trim();
        return `<svg${a ? ' ' + a : ''} width="100%" style="height:auto;display:block;">`;
    });
    return svg;
}

let idCounter = 0;

export function MermaidDiagram({ source }: { source: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState(false);
    const idRef = useRef(`mermaid-${++idCounter}`);

    useEffect(() => {
        ensureInit();
        let cancelled = false;

        mermaid
            .render(idRef.current, source)
            .then(({ svg: rendered }) => {
                if (!cancelled) setSvg(normalizeSvg(rendered));
            })
            .catch(() => {
                if (!cancelled) setError(true);
            });

        return () => {
            cancelled = true;
        };
    }, [source]);

    if (error) {
        return (
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                {source}
            </pre>
        );
    }

    if (!svg) {
        return (
            <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">Rendering diagram…</span>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className="w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
