<?php

namespace App\Jobs;

use App\Models\Document;
use App\Models\OcrResult;
use App\Services\Ocr\OcrClient;
use App\Services\Ocr\OcrParser;
use App\Support\Audit\AuditLogger;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Throwable;

class ProcessOcrDocument implements ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;
    public bool $failOnTimeout = true;

    public function __construct(
        public readonly int $documentId,
    ) {
    }

    public function handle(OcrClient $client, OcrParser $parser): void
    {
        $document = Document::query()->find($this->documentId);

        if (! $document) {
            return;
        }

        if ($document->ocr_status === 'completed') {
            return;
        }

        $document->forceFill([
            'ocr_status' => 'processing',
            'ocr_error_message' => null,
        ])->saveQuietly();

        app(AuditLogger::class)->logCustom('ocr_processing_started', $document, [
            'module' => 'documents',
            'description' => "Started OCR processing for {$document->title}.",
            'metadata' => [
                'document_id' => $document->id,
            ],
        ]);

        $result = $parser->parse($client->extract($document));

        DB::transaction(function () use ($document, $result): void {
            $document->ocrResults()->delete();

            foreach ($result['pages'] as $page) {
                OcrResult::query()->create([
                    'organization_id' => $document->organization_id,
                    'document_id' => $document->id,
                    'page_number' => $page['page_number'],
                    'text' => $page['text'],
                    'confidence' => $page['confidence'],
                    'raw_json' => $page['raw_json'],
                ]);
            }

            $document->forceFill([
                'ocr_status' => 'completed',
                'ocr_engine' => $result['engine'],
                'ocr_language' => $result['language'],
                'ocr_page_count' => $result['page_count'],
                'ocr_avg_confidence' => $result['avg_confidence'],
                'ocr_error_message' => null,
                'ocr_processed_at' => now(),
                'ocr_full_text' => $result['full_text'],
                'ocr_raw_json' => $result['raw_json'],
                'ocr_metadata_json' => $result['metadata'],
            ])->saveQuietly();
        });

        app(AuditLogger::class)->logCustom('ocr_completed', $document, [
            'module' => 'documents',
            'description' => "Completed OCR processing for {$document->title}.",
            'metadata' => [
                'document_id' => $document->id,
                'page_count' => $result['page_count'],
                'avg_confidence' => $result['avg_confidence'],
            ],
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        $document = Document::query()->find($this->documentId);

        if (! $document) {
            return;
        }

        $document->forceFill([
            'ocr_status' => 'failed',
            'ocr_error_message' => $exception?->getMessage() ?: 'OCR processing failed.',
        ])->saveQuietly();

        app(AuditLogger::class)->logCustom('ocr_failed', $document, [
            'module' => 'documents',
            'description' => "Failed OCR processing for {$document->title}.",
            'metadata' => [
                'document_id' => $document->id,
                'error' => $exception?->getMessage(),
            ],
        ]);
    }
}
