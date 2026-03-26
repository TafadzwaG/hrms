<?php

namespace App\Services\Ocr;

use RuntimeException;

class OcrParser
{
    public function parse(array $payload): array
    {
        if (($payload['success'] ?? false) !== true) {
            throw new RuntimeException((string) ($payload['message'] ?? 'OCR extraction failed.'));
        }

        $rawPages = $payload['pages'] ?? null;

        if (! is_array($rawPages)) {
            throw new RuntimeException('The OCR response did not include any pages.');
        }

        $pages = collect($rawPages)
            ->map(function (mixed $page, int $index): array {
                if (! is_array($page)) {
                    throw new RuntimeException('Malformed OCR page payload.');
                }

                $pageNumber = max(1, (int) ($page['page'] ?? $index + 1));
                $text = trim((string) ($page['text'] ?? ''));
                $confidence = $this->normalizeConfidence($page['confidence'] ?? null);
                $lines = collect($page['lines'] ?? [])
                    ->filter(fn (mixed $line): bool => is_array($line))
                    ->map(fn (array $line): array => [
                        'text' => trim((string) ($line['text'] ?? '')),
                        'confidence' => $this->normalizeConfidence($line['confidence'] ?? null),
                        'bbox' => $this->normalizeBoundingBox($line['bbox'] ?? null),
                    ])
                    ->values()
                    ->all();

                return [
                    'page_number' => $pageNumber,
                    'text' => $text,
                    'confidence' => $confidence,
                    'raw_json' => [
                        ...$page,
                        'page' => $pageNumber,
                        'text' => $text,
                        'confidence' => $confidence,
                        'lines' => $lines,
                    ],
                ];
            })
            ->sortBy('page_number')
            ->values();

        $pageCount = $pages->count();
        $confidences = $pages->pluck('confidence')->filter(fn ($value) => $value !== null);
        $avgConfidence = $confidences->isNotEmpty()
            ? round((float) $confidences->avg(), 4)
            : null;

        return [
            'engine' => (string) ($payload['engine'] ?? config('services.ocr.default_engine', 'paddleocr')),
            'language' => (string) ($payload['language'] ?? config('services.ocr.default_language', 'en')),
            'full_text' => trim((string) ($payload['full_text'] ?? $pages->pluck('text')->implode("\n\n"))),
            'processing_ms' => max(0, (int) ($payload['processing_ms'] ?? 0)),
            'page_count' => $pageCount,
            'avg_confidence' => $avgConfidence,
            'pages' => $pages->all(),
            'raw_json' => $payload,
            'metadata' => [
                'processing_ms' => max(0, (int) ($payload['processing_ms'] ?? 0)),
                'page_count' => $pageCount,
                'line_count' => $pages->sum(fn (array $page) => count($page['raw_json']['lines'] ?? [])),
            ],
        ];
    }

    private function normalizeConfidence(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return round((float) $value, 4);
    }

    private function normalizeBoundingBox(mixed $bbox): array
    {
        if (! is_array($bbox) || $bbox === []) {
            return [];
        }

        if (count($bbox) === 4 && collect($bbox)->every(fn (mixed $value) => is_numeric($value))) {
            return array_map(fn (mixed $value): int => (int) round((float) $value), $bbox);
        }

        $points = collect($bbox)
            ->filter(fn (mixed $value): bool => is_array($value) && count($value) >= 2)
            ->map(fn (array $point): array => [(float) $point[0], (float) $point[1]])
            ->values();

        if ($points->isEmpty()) {
            return [];
        }

        $xs = $points->pluck(0);
        $ys = $points->pluck(1);

        return [
            (int) round((float) $xs->min()),
            (int) round((float) $ys->min()),
            (int) round((float) $xs->max()),
            (int) round((float) $ys->max()),
        ];
    }
}
