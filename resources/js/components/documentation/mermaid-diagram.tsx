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
            fontSize: '3px',
        },
        flowchart: {
            curve: 'basis',
            padding: 2,
            htmlLabels: false,
            nodeSpacing: 6,
            rankSpacing: 8,
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

    // Thin node borders: stroke-width on rect/polygon/circle elements
    svg = svg.replace(/(<(?:rect|polygon|circle|ellipse|path)[^>]*)\bstroke-width="[^"]*"/g, '$1stroke-width="0.4"');
    svg = svg.replace(/(<(?:rect|polygon|circle|ellipse|path)[^>]*)(?=\s*\/>|\s*>)(?![^>]*stroke-width)/g, (m) =>
        m.includes('stroke=') ? m.replace('>', ' stroke-width="0.4">') : m,
    );

    // Thin edge lines
    svg = svg.replace(/(<(?:line|polyline)[^>]*)\bstroke-width="[^"]*"/g, '$1stroke-width="0.4"');

    // Thin arrowhead markers
    svg = svg.replace(/(<marker[^>]*>[\s\S]*?<\/marker>)/g, (marker) =>
        marker.replace(/\bstroke-width="[^"]*"/g, 'stroke-width="0.4"'),
    );

    // Inject a global style override to catch any stroke-width set via CSS class
    svg = svg.replace('</defs>', `<style>
        .flowchart-link { stroke-width: 0.4px !important; }
        .node rect, .node circle, .node ellipse, .node polygon, .node path { stroke-width: 0.4px !important; }
        marker path { stroke-width: 0.4px !important; }
    </style></defs>`);

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
        <div ref={ref} className="w-full overflow-x-auto">
            <div
                style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%' }}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}
