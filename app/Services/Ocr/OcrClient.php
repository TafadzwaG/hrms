<?php

namespace App\Services\Ocr;

use App\Models\Document;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class OcrClient
{
    public function __construct(
        private readonly HttpFactory $http,
    ) {
    }

    public function extract(Document $document, bool $returnBoxes = true): array
    {
        $url = rtrim((string) config('services.ocr.url'), '/');

        if ($url === '') {
            throw new RuntimeException('OCR service URL is not configured.');
        }

        $diskName = $this->resolveDiskName($document);

        if ($diskName === 'external' || filter_var($document->file_uri, FILTER_VALIDATE_URL)) {
            throw new RuntimeException('External document URIs are not supported for OCR processing.');
        }

        $storage = Storage::disk($diskName);

        if (! $storage->exists($document->file_uri)) {
            throw new RuntimeException('The OCR source document could not be found in storage.');
        }

        $metadata = (array) ($document->metadata_json ?? []);
        $fileName = (string) ($metadata['original_name'] ?? basename($document->file_uri));
        $mimeType = (string) ($metadata['mime_type'] ?? 'application/octet-stream');

        $response = $this->http
            ->withToken((string) config('services.ocr.token'))
            ->timeout((int) config('services.ocr.timeout', 120))
            ->acceptJson()
            ->attach('file', $storage->get($document->file_uri), $fileName, [
                'Content-Type' => $mimeType,
            ])
            ->post("{$url}/v1/ocr/extract", [
                'language' => $document->ocr_language ?: config('services.ocr.default_language', 'en'),
                'engine' => $document->ocr_engine ?: config('services.ocr.default_engine', 'paddleocr'),
                'return_boxes' => $returnBoxes ? 'true' : 'false',
            ]);

        try {
            $response->throw();
        } catch (RequestException $exception) {
            $message = $response->json('message')
                ?? $response->json('detail')
                ?? $exception->getMessage();

            throw new RuntimeException((string) $message, previous: $exception);
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            throw new RuntimeException('The OCR service returned an invalid response payload.');
        }

        return $payload;
    }

    private function resolveDiskName(Document $document): string
    {
        $disk = data_get($document->metadata_json, 'storage_disk');

        return is_string($disk) && $disk !== '' ? $disk : 'public';
    }
}
