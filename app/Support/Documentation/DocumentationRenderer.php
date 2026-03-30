<?php

namespace App\Support\Documentation;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class DocumentationRenderer
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function renderBlocks(string $markdown): array
    {
        $segments = preg_split('/```mermaid\s*(.*?)```/s', $markdown, -1, PREG_SPLIT_DELIM_CAPTURE);

        if ($segments === false) {
            return [];
        }

        $blocks = [];

        foreach ($segments as $index => $segment) {
            if ($index % 2 === 0) {
                $html = $this->renderMarkdown(trim($segment));

                if ($html !== '') {
                    $blocks[] = [
                        'type' => 'markdown',
                        'html' => $html,
                    ];
                }

                continue;
            }

            $source = trim($segment);

            if ($source === '') {
                continue;
            }

            $diagram = $this->parseFlowchart($source);

            $blocks[] = [
                'type' => 'flowchart',
                'source' => $source,
                'svg' => $this->renderFlowchartSvg($source),
                'nodes' => $diagram['nodes'],
                'edges' => $diagram['edges'],
                'direction' => $diagram['direction'],
            ];
        }

        return $blocks;
    }

    public function renderMarkdown(string $markdown): string
    {
        if ($markdown === '') {
            return '';
        }

        return Str::markdown($markdown, [
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
    }

    public function renderFlowchartSvg(string $source): string
    {
        $diagram = $this->parseFlowchart($source);

        $direction = $diagram['direction'];
        $nodes = collect($diagram['nodes']);
        $edges = collect($diagram['edges']);

        if ($nodes->isEmpty()) {
            return '';
        }

        $levels = $this->resolveLevels($nodes->pluck('id')->all(), $edges);
        $grouped = $nodes->groupBy(fn (array $node) => $levels[$node['id']] ?? 0)->sortKeys();

        $nodeLayouts = [];
        $marginX = 48;
        $marginY = 40;
        $columnGap = 280;
        $rowGap = 150;
        $defaultWidth = 220;
        $lineHeight = 18;

        foreach ($grouped as $level => $bucket) {
            /** @var Collection<int, array<string, mixed>> $bucket */
            $count = max($bucket->count(), 1);

            foreach ($bucket->values() as $index => $node) {
                $lines = $this->wrapText($node['label'], 24);
                $height = max(64, 38 + (count($lines) * $lineHeight));
                $width = $defaultWidth;

                if ($direction === 'LR') {
                    $x = $marginX + ($level * $columnGap);
                    $y = $marginY + ($index * $rowGap);
                } else {
                    $x = $marginX + ($index * $columnGap);
                    $y = $marginY + ($level * $rowGap);
                }

                $nodeLayouts[$node['id']] = [
                    'id' => $node['id'],
                    'label' => $node['label'],
                    'type' => $node['type'],
                    'x' => $x,
                    'y' => $y,
                    'width' => $width,
                    'height' => $height,
                    'lines' => $lines,
                ];
            }
        }

        $maxX = collect($nodeLayouts)->max(fn (array $node) => $node['x'] + $node['width']) + 48;
        $maxY = collect($nodeLayouts)->max(fn (array $node) => $node['y'] + $node['height']) + 40;

        $svg = [];
        $svg[] = sprintf(
            '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d" role="img" aria-label="%s">',
            $maxX,
            $maxY,
            $maxX,
            $maxY,
            $this->escape('Workflow diagram')
        );
        $svg[] = '<defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#475569" /></marker></defs>';
        $svg[] = sprintf('<rect x="0" y="0" width="%d" height="%d" rx="18" fill="#ffffff" />', $maxX, $maxY);

        foreach ($edges as $edge) {
            $from = $nodeLayouts[$edge['from']] ?? null;
            $to = $nodeLayouts[$edge['to']] ?? null;

            if (! $from || ! $to) {
                continue;
            }

            if ($direction === 'LR') {
                $x1 = $from['x'] + $from['width'];
                $y1 = $from['y'] + ($from['height'] / 2);
                $x2 = $to['x'];
                $y2 = $to['y'] + ($to['height'] / 2);
            } else {
                $x1 = $from['x'] + ($from['width'] / 2);
                $y1 = $from['y'] + $from['height'];
                $x2 = $to['x'] + ($to['width'] / 2);
                $y2 = $to['y'];
            }

            $svg[] = sprintf(
                '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#475569" stroke-width="2.2" marker-end="url(#arrow)" />',
                $x1,
                $y1,
                $x2,
                $y2
            );

            if ($edge['label']) {
                $labelX = ($x1 + $x2) / 2;
                $labelY = ($y1 + $y2) / 2 - 8;
                $svg[] = sprintf(
                    '<rect x="%s" y="%s" width="%s" height="22" rx="11" fill="#ffffff" stroke="#cbd5e1" />',
                    $labelX - 44,
                    $labelY - 12,
                    88
                );
                $svg[] = sprintf(
                    '<text x="%s" y="%s" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#334155">%s</text>',
                    $labelX,
                    $labelY + 3,
                    $this->escape($edge['label'])
                );
            }
        }

        foreach ($nodeLayouts as $node) {
            if ($node['type'] === 'diamond') {
                $halfWidth = $node['width'] / 2;
                $halfHeight = $node['height'] / 2;
                $points = [
                    [$node['x'] + $halfWidth, $node['y']],
                    [$node['x'] + $node['width'], $node['y'] + $halfHeight],
                    [$node['x'] + $halfWidth, $node['y'] + $node['height']],
                    [$node['x'], $node['y'] + $halfHeight],
                ];

                $svg[] = sprintf(
                    '<polygon points="%s" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.6" />',
                    collect($points)->map(fn (array $point) => implode(',', $point))->implode(' ')
                );
            } elseif ($node['type'] === 'round') {
                $svg[] = sprintf(
                    '<rect x="%s" y="%s" width="%s" height="%s" rx="28" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.6" />',
                    $node['x'],
                    $node['y'],
                    $node['width'],
                    $node['height']
                );
            } else {
                $svg[] = sprintf(
                    '<rect x="%s" y="%s" width="%s" height="%s" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.6" />',
                    $node['x'],
                    $node['y'],
                    $node['width'],
                    $node['height']
                );
            }

            $textBaseY = $node['y'] + (($node['height'] - (count($node['lines']) * $lineHeight)) / 2) + 14;

            foreach ($node['lines'] as $lineIndex => $line) {
                $svg[] = sprintf(
                    '<text x="%s" y="%s" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600" fill="#0f172a">%s</text>',
                    $node['x'] + ($node['width'] / 2),
                    $textBaseY + ($lineIndex * $lineHeight),
                    $this->escape($line)
                );
            }
        }

        $svg[] = '</svg>';

        return implode('', $svg);
    }

    /**
     * @return array{direction:string,nodes:array<int,array<string,string>>,edges:array<int,array<string,string|null>>}
     */
    private function parseFlowchart(string $source): array
    {
        $lines = preg_split('/\R/', trim($source)) ?: [];
        $direction = 'TD';
        $nodes = [];
        $edges = [];

        foreach ($lines as $index => $line) {
            $trimmed = trim($line);

            if ($trimmed === '') {
                continue;
            }

            if ($index === 0 && preg_match('/^flowchart\s+([A-Z]+)/i', $trimmed, $matches) === 1) {
                $direction = strtoupper($matches[1]) === 'LR' ? 'LR' : 'TD';
                continue;
            }

            if (! str_contains($trimmed, '-->')) {
                continue;
            }

            if (preg_match('/^(.*?)\s*-->\s*(?:\|([^|]+)\|)?\s*(.*?)$/', $trimmed, $matches) !== 1) {
                continue;
            }

            $from = $this->parseNodeToken(trim($matches[1]));
            $to = $this->parseNodeToken(trim($matches[3]));

            // Only overwrite an existing node entry if the new token carries a real label
            if (! isset($nodes[$from['id']]) || $from['label'] !== $from['id']) {
                $nodes[$from['id']] = $from;
            }
            if (! isset($nodes[$to['id']]) || $to['label'] !== $to['id']) {
                $nodes[$to['id']] = $to;
            }
            $edges[] = [
                'from' => $from['id'],
                'to' => $to['id'],
                'label' => isset($matches[2]) ? trim($matches[2]) : null,
            ];
        }

        $nodes = $this->normalizeNodeLabels(array_values($nodes));

        return [
            'direction' => $direction,
            'nodes' => $nodes,
            'edges' => $edges,
        ];
    }

    /**
     * @return array{id:string,label:string,type:string}
     */
    private function parseNodeToken(string $token): array
    {
        if (preg_match('/^([A-Za-z0-9_]+)\s*\[\s*"(.*)"\s*\]$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => trim($matches[2]), 'type' => 'rect'];
        }

        if (preg_match('/^([A-Za-z0-9_]+)\s*\[\s*(.*)\s*\]$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => trim($matches[2], "\"' "), 'type' => 'rect'];
        }

        if (preg_match('/^([A-Za-z0-9_]+)\s*\{\s*"(.*)"\s*\}$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => trim($matches[2]), 'type' => 'diamond'];
        }

        if (preg_match('/^([A-Za-z0-9_]+)\s*\{\s*(.*)\s*\}$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => trim($matches[2], "\"' "), 'type' => 'diamond'];
        }

        if (preg_match('/^([A-Za-z0-9_]+)\s*\(\s*"(.*)"\s*\)$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => trim($matches[2]), 'type' => 'round'];
        }

        if (preg_match('/^([A-Za-z0-9_]+)\s*\(\s*(.*)\s*\)$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => trim($matches[2], "\"' "), 'type' => 'round'];
        }

        if (preg_match('/^([A-Za-z0-9_]+)$/', $token, $matches) === 1) {
            return ['id' => $matches[1], 'label' => $matches[1], 'type' => 'rect'];
        }

        return ['id' => Str::slug($token, '_'), 'label' => trim($token, '" '), 'type' => 'rect'];
    }

    /**
     * @param array<int, string> $nodeIds
     * @param Collection<int, array<string, string|null>> $edges
     * @return array<string, int>
     */
    private function resolveLevels(array $nodeIds, Collection $edges): array
    {
        $levels = array_fill_keys($nodeIds, 0);

        foreach (range(1, max(count($nodeIds), 1)) as $iteration) {
            foreach ($edges as $edge) {
                $fromLevel = $levels[$edge['from']] ?? 0;
                $nextLevel = $fromLevel + 1;

                if (($levels[$edge['to']] ?? 0) < $nextLevel) {
                    $levels[$edge['to']] = $nextLevel;
                }
            }
        }

        return $levels;
    }

    /**
     * @return array<int, string>
     */
    private function wrapText(string $text, int $targetLength): array
    {
        $words = preg_split('/\s+/', trim($text)) ?: [];
        $lines = [];
        $current = '';

        foreach ($words as $word) {
            $candidate = trim($current.' '.$word);

            if ($candidate !== '' && Str::length($candidate) > $targetLength && $current !== '') {
                $lines[] = $current;
                $current = $word;
                continue;
            }

            $current = $candidate;
        }

        if ($current !== '') {
            $lines[] = $current;
        }

        return $lines === [] ? [''] : $lines;
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * @param array<int, array{id:string,label:string,type:string}> $nodes
     * @return array<int, array{id:string,label:string,type:string}>
     */
    private function normalizeNodeLabels(array $nodes): array
    {
        $step = 1;
        $decision = 1;

        foreach ($nodes as $index => $node) {
            $label = trim($node['label']);

            if ($label !== '' && $label !== $node['id']) {
                continue;
            }

            $nodes[$index]['label'] = match ($node['type']) {
                'diamond' => 'Decision '.$decision++,
                'round' => 'Workflow stage '.$step++,
                default => 'Workflow step '.$step++,
            };
        }

        return $nodes;
    }
}
