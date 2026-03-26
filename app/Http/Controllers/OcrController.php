<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Jobs\ProcessOcrDocument;
use App\Models\Document;
use App\Models\Employee;
use App\Models\OcrResult;
use App\Support\Access\RolePageScopeResolver;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OcrController extends Controller
{
    use ResolvesRolePageScope;

    public function show(Request $request, Employee $employee, Document $document): Response|RedirectResponse
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $this->ensureEmployeeOwnsDocument($employee, $document);

        if (! Document::supportsOcr()) {
            return redirect()
                ->to("/employees/{$employee->id}/documents")
                ->with('error', 'OCR database support is not available yet. Run php artisan migrate and try again.');
        }

        $document->load([
            'documentType:id,code,name,sensitivity_level',
            'ocrResults' => fn ($query) => $query->orderBy('page_number'),
        ]);

        return Inertia::render('Employees/Documents/OcrResult', [
            'employee' => [
                'id' => $employee->id,
                'full_name' => $employee->full_name,
                'staff_number' => $employee->staff_number,
                'show_url' => "/employees/{$employee->id}",
                'documents_url' => "/employees/{$employee->id}/documents",
            ],
            'document' => [
                'id' => $document->id,
                'title' => $document->title,
                'file_name' => data_get($document->metadata_json, 'original_name') ?: basename($document->file_uri),
                'document_type' => $document->documentType ? [
                    'id' => $document->documentType->id,
                    'code' => $document->documentType->code,
                    'name' => $document->documentType->name,
                    'sensitivity_level' => $document->documentType->sensitivity_level,
                ] : null,
                'ocr_status' => $document->ocr_status,
                'ocr_engine' => $document->ocr_engine,
                'ocr_language' => $document->ocr_language,
                'ocr_page_count' => $document->ocr_page_count,
                'ocr_avg_confidence' => $document->ocr_avg_confidence !== null ? (float) $document->ocr_avg_confidence : null,
                'ocr_error_message' => $document->ocr_error_message,
                'ocr_processed_at' => optional($document->ocr_processed_at)->toDateTimeString(),
                'ocr_full_text' => $document->ocr_full_text,
                'ocr_raw_json' => $document->ocr_raw_json,
                'ocr_metadata_json' => $document->ocr_metadata_json,
                'ocr_results' => $document->ocrResults
                    ->map(fn (OcrResult $result) => [
                        'id' => $result->id,
                        'page_number' => $result->page_number,
                        'text' => $result->text,
                        'confidence' => $result->confidence,
                        'raw_json' => $result->raw_json,
                    ])
                    ->values()
                    ->all(),
                'show_url' => "/employees/{$employee->id}/documents/{$document->id}",
                'retry_ocr_url' => "/employees/{$employee->id}/documents/{$document->id}/ocr/retry",
                'process_now_url' => "/employees/{$employee->id}/documents/{$document->id}/ocr/process-now",
            ],
        ]);
    }

    public function processNow(Request $request, Employee $employee, Document $document): RedirectResponse
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $this->ensureEmployeeOwnsDocument($employee, $document);

        if (! Document::supportsOcr()) {
            return back()->with('error', 'OCR database support is not available yet.');
        }

        if (! in_array($document->ocr_status, ['queued', 'uploaded', 'failed'], true)) {
            return back()->with('error', 'This document is not eligible for immediate processing.');
        }

        $document->ocrResults()->delete();

        $document->forceFill([
            'ocr_status' => 'queued',
            'ocr_error_message' => null,
            'ocr_processed_at' => null,
        ])->saveQuietly();

        try {
            ProcessOcrDocument::dispatchSync($document->id);
        } catch (\Throwable $e) {
            return back()->with('error', 'OCR processing failed: ' . $e->getMessage());
        }

        return redirect()
            ->to("/employees/{$employee->id}/documents/{$document->id}")
            ->with('success', 'Document processed successfully.');
    }

    public function retry(Request $request, Employee $employee, Document $document): RedirectResponse
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $this->ensureEmployeeOwnsDocument($employee, $document);

        if (! Document::supportsOcr()) {
            return redirect()
                ->to("/employees/{$employee->id}/documents")
                ->with('error', 'OCR database support is not available yet. Run php artisan migrate and try again.');
        }

        if ($document->ocr_status !== 'failed') {
            return back()->with('error', 'Only failed OCR documents can be retried.');
        }

        $document->ocrResults()->delete();

        $document->forceFill([
            'ocr_status' => 'queued',
            'ocr_error_message' => null,
            'ocr_processed_at' => null,
        ])->saveQuietly();

        ProcessOcrDocument::dispatch($document->id)->onQueue('ocr');

        app(AuditLogger::class)->logCustom('ocr_retried', $document, [
            'module' => 'documents',
            'description' => "Retried OCR processing for {$document->title}.",
            'metadata' => [
                'employee_id' => $employee->id,
                'document_id' => $document->id,
            ],
        ]);

        return redirect()
            ->to("/employees/{$employee->id}/documents/{$document->id}")
            ->with('success', 'OCR processing has been queued again.');
    }

    private function authorizeEmployeeRecord(Request $request, Employee $employee): void
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_EMPLOYEES, $employee);
    }

    private function ensureEmployeeOwnsDocument(Employee $employee, Document $document): void
    {
        if ((int) $document->owner_employee_id !== (int) $employee->id) {
            abort(404);
        }
    }
}
