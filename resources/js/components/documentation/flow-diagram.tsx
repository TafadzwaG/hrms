import dagre from '@dagrejs/dagre';
import { Background, MarkerType, ReactFlow, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type PhpNode = { id: string; label: string; type: string };
type PhpEdge = { from: string; to: string; label: string | null };

export type FlowDiagramProps = {
    nodes: PhpNode[];
    edges: PhpEdge[];
    direction: string;
};

const NODE_W = 180;
const NODE_H = 52;

const nodeStyle = (type: string): React.CSSProperties => ({
    fontSize: 12,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    padding: '8px 14px',
    borderRadius: type === 'round' ? 999 : type === 'diamond' ? 6 : 8,
    background: type === 'diamond' ? '#fefce8' : '#f8fafc',
    border: `0.75px solid ${type === 'diamond' ? '#fbbf24' : '#94a3b8'}`,
    color: '#0f172a',
    width: NODE_W,
    textAlign: 'center' as const,
    lineHeight: '1.4',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
});

function buildLayout(phpNodes: PhpNode[], phpEdges: PhpEdge[], direction: string) {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: direction === 'LR' ? 'LR' : 'TB',
        nodesep: 50,
        ranksep: 70,
        marginx: 24,
        marginy: 24,
    });

    phpNodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
    phpEdges.forEach((e) => g.setEdge(e.from, e.to));
    dagre.layout(g);

    const graphInfo = g.graph();

    const nodes: Node[] = phpNodes.map((n) => {
        const pos = g.node(n.id);
        return {
            id: n.id,
            position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
            data: { label: n.label },
            style: nodeStyle(n.type),
        };
    });

    const edges: Edge[] = phpEdges.map((e, i) => ({
        id: `e${i}`,
        source: e.from,
        target: e.to,
        label: e.label ?? undefined,
        type: 'smoothstep',
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: '#64748b',
        },
        style: { stroke: '#64748b', strokeWidth: 1 },
        labelStyle: { fontSize: 10, fill: '#475569', fontFamily: 'ui-sans-serif, system-ui, sans-serif' },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 1 },
        labelBgPadding: [4, 6] as [number, number],
        labelBgBorderRadius: 4,
    }));

    return {
        nodes,
        edges,
        height: Math.max(240, (graphInfo.height ?? 300) + 80),
    };
}

export function FlowDiagram({ nodes: phpNodes, edges: phpEdges, direction }: FlowDiagramProps) {
    const { nodes, edges, height } = buildLayout(phpNodes, phpEdges, direction);

    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden border border-border/60">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#e2e8f0" gap={24} size={1} />
            </ReactFlow>
        </div>
    );
}
