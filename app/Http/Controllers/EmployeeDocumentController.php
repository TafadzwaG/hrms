<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Jobs\ProcessOcrDocument;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Models\OcrResult;
use App\Support\Access\RolePageScopeResolver;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EmployeeDocumentController extends Controller
{
    use ResolvesRolePageScope;

    public function index(Request $request, Employee $employee): Response
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $ocrEnabled = Document::supportsOcr();

        $documents = $employee->documents()
            ->with(['documentType:id,code,name,sensitivity_level'])
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Document $document) => $this->mapDocument($employee, $document));

        return Inertia::render('Employees/Documents/Index', [
            'employee' => $this->employeeSummary($employee),
            'documents' => $documents,
            'stats' => $this->buildStats($employee, $ocrEnabled),
        ]);
    }

    public function create(Request $request, Employee $employee): Response
    {
        $this->authorizeEmployeeRecord($request, $employee);

        return Inertia::render('Employees/Documents/Upload', [
            'employee' => $this->employeeSummary($employee),
            'options' => [
                'document_types' => $this->documentTypes(),
                'document_access_policies' => $this->documentAccessPolicies(),
                'default_engine' => (string) config('services.ocr.default_engine', 'paddleocr'),
                'default_language' => (string) config('services.ocr.default_language', 'en'),
                'accepted_extensions' => ['pdf', 'png', 'jpg', 'jpeg', 'webp'],
                'ocr_enabled' => Document::supportsOcr(),
            ],
            'links' => [
                'index' => "/employees/{$employee->id}/documents",
                'store' => "/employees/{$employee->id}/documents",
            ],
        ]);
    }

    public function store(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorizeEmployeeRecord($request, $employee);

        $validated = $this->validatePayload($request);
        $processOcr = (bool) ($validated['process_ocr'] ?? false);
        $metadata = $this->parseMetadataInput($validated['metadata_json'] ?? null) ?? [];

        if ($processOcr) {
            $file = $request->file('file');
            $fileUri = $file->store("documents/employees/{$employee->id}/ocr", 'local');
            $storageDisk = 'local';
        } elseif ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileUri = $file->store("documents/employees/{$employee->id}", 'public');
            $storageDisk = 'public';
        } else {
            $file = null;
            $fileUri = $validated['file_uri'];
            $storageDisk = 'external';
        }

        if ($file) {
            $metadata = array_merge($metadata, [
                'storage_disk' => $storageDisk,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size_bytes' => $file->getSize(),
            ]);
        } else {
            $metadata = array_merge($metadata, [
                'storage_disk' => $storageDisk,
            ]);
        }

        $metadata['uploaded_by_user_id'] = $request->user()?->getAuthIdentifier();

        $document = Document::query()->create([
            'owner_employee_id' => $employee->id,
            'document_type_id' => (int) $validated['document_type_id'],
            'title' => $validated['title'],
            'file_uri' => $fileUri,
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'metadata_json' => empty($metadata) ? null : $metadata,
            'access_policy' => $validated['access_policy'],
            'ocr_status' => $processOcr ? 'uploaded' : null,
            'ocr_engine' => $processOcr ? ($validated['engine'] ?: config('services.ocr.default_engine', 'paddleocr')) : null,
            'ocr_language' => $processOcr ? ($validated['language'] ?: config('services.ocr.default_language', 'en')) : null,
        ]);

        if ($processOcr) {
            $document->forceFill([
                'ocr_status' => 'queued',
            ])->saveQuietly();

            ProcessOcrDocument::dispatch($document->id)->onQueue('ocr');

            app(AuditLogger::class)->logCustom('ocr_queued', $document, [
                'module' => 'documents',
                'description' => "Queued OCR processing for {$document->title}.",
                'metadata' => [
                    'employee_id' => $employee->id,
                    'document_id' => $document->id,
                ],
            ]);

            return redirect()
                ->to("/employees/{$employee->id}/documents/{$document->id}")
                ->with('success', 'Document uploaded and queued for OCR processing.');
        }

        return back()->with('success', 'Employee document attached successfully.');
    }

    public function show(Request $request, Employee $employee, Document $document): Response
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $this->ensureEmployeeOwnsDocument($employee, $document);

        $document->load(['documentType:id,code,name,sensitivity_level']);

        if (Document::supportsOcr()) {
            $document->load([
                'ocrResults' => fn ($query) => $query->orderBy('page_number'),
            ]);
        }

        return Inertia::render('Employees/Documents/Show', [
            'employee' => $this->employeeSummary($employee),
            'document' => $this->mapDocument($employee, $document, includeResults: true),
        ]);
    }

    public function download(Request $request, Employee $employee, Document $document): StreamedResponse|RedirectResponse
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $this->ensureEmployeeOwnsDocument($employee, $document);

        app(AuditLogger::class)->logCustom('export', $document, [
            'module' => 'documents',
            'description' => "Downloaded employee document {$document->title}.",
            'metadata' => [
                'employee_id' => $employee->id,
            ],
        ]);

        if (filter_var($document->file_uri, FILTER_VALIDATE_URL)) {
            return redirect()->away($document->file_uri);
        }

        $disk = Storage::disk($this->storageDiskName($document));

        if (! $disk->exists($document->file_uri)) {
            return back()->with('error', 'The requested document file could not be located.');
        }

        $downloadName = data_get($document->metadata_json, 'original_name') ?: basename($document->file_uri);

        return $disk->download($document->file_uri, $downloadName);
    }

    public function destroy(Request $request, Employee $employee, Document $document): RedirectResponse
    {
        $this->authorizeEmployeeRecord($request, $employee);
        $this->ensureEmployeeOwnsDocument($employee, $document);

        $document->delete();

        return back()->with('success', 'Employee document deleted successfully.');
    }

    private function buildStats(Employee $employee, bool $ocrEnabled): array
    {
        if (! $ocrEnabled) {
            return ['total' => $employee->documents()->count(), 'queued' => 0, 'completed' => 0, 'failed' => 0];
        }

        $row = $employee->documents()
            ->selectRaw("COUNT(*) as total,
                SUM(CASE WHEN ocr_status IN ('queued','processing') THEN 1 ELSE 0 END) as queued,
                SUM(CASE WHEN ocr_status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN ocr_status = 'failed' THEN 1 ELSE 0 END) as failed")
            ->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'queued' => (int) ($row->queued ?? 0),
            'completed' => (int) ($row->completed ?? 0),
            'failed' => (int) ($row->failed ?? 0),
        ];
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

    private function validatePayload(Request $request): array
    {
        $tenantId = $this->tenantId();
        $processOcr = $request->boolean('process_ocr');

        $validator = validator($request->all(), [
            'document_type_id' => ['required', 'integer', Rule::exists('document_types', 'id')->where(fn ($query) => $query->where('organization_id', $tenantId))],
            'title' => ['required', 'string', 'max:255'],
            'file' => $processOcr
                ? ['required', 'file', 'mimes:pdf,png,jpg,jpeg,webp', 'max:20480']
                : ['nullable', 'file', 'max:10240'],
            'file_uri' => ['nullable', 'string', 'max:2048'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'access_policy' => ['required', 'in:'.implode(',', $this->documentAccessPolicies())],
            'metadata_json' => ['nullable', 'string'],
            'process_ocr' => ['nullable', 'boolean'],
            'language' => ['nullable', 'string', 'max:16'],
            'engine' => ['nullable', 'string', 'max:64'],
        ]);

        $validator->after(function ($validator) use ($request, $processOcr): void {
            if ($processOcr && ! Document::supportsOcr()) {
                $validator->errors()->add('file', 'OCR database support is not available yet. Run php artisan migrate and try again.');
            }

            if ($processOcr && ! $request->hasFile('file')) {
                $validator->errors()->add('file', 'Attach a PDF or image file for OCR processing.');
            }

            if (! $processOcr && ! $request->hasFile('file') && blank($request->input('file_uri'))) {
                $validator->errors()->add('file', 'Attach a file or provide a file URI.');
            }
        });

        return $validator->validate();
    }

    private function documentAccessPolicies(): array
    {
        return ['public', 'internal', 'confidential', 'restricted'];
    }

    private function documentTypes(): array
    {
        return DocumentType::query()
            ->select('id', 'code', 'name', 'sensitivity_level')
            ->orderBy('name')
            ->get()
            ->map(fn (DocumentType $type) => [
                'id' => $type->id,
                'code' => $type->code,
                'name' => $type->name,
                'sensitivity_level' => $type->sensitivity_level,
            ])
            ->values()
            ->all();
    }

    private function employeeSummary(Employee $employee): array
    {
        $employee->loadMissing(['position:id,name', 'orgUnit:id,name']);

        return [
            'id' => $employee->id,
            'full_name' => $employee->full_name,
            'staff_number' => $employee->staff_number,
            'position' => $employee->position ? [
                'id' => $employee->position->id,
                'name' => $employee->position->name,
            ] : null,
            'department' => $employee->orgUnit ? [
                'id' => $employee->orgUnit->id,
                'name' => $employee->orgUnit->name,
            ] : null,
            'show_url' => "/employees/{$employee->id}",
            'documents_url' => "/employees/{$employee->id}/documents",
            'upload_url' => "/employees/{$employee->id}/documents/upload",
            'ocr_enabled' => Document::supportsOcr(),
        ];
    }

    private function mapDocument(Employee $employee, Document $document, bool $includeResults = false): array
    {
        $ocrEnabled = Document::supportsOcr();

        return [
            'id' => $document->id,
            'document_type_id' => $document->document_type_id,
            'title' => $document->title,
            'file_uri' => $document->file_uri,
            'file_name' => data_get($document->metadata_json, 'original_name') ?: basename($document->file_uri),
            'issue_date' => optional($document->issue_date)->toDateString(),
            'expiry_date' => optional($document->expiry_date)->toDateString(),
            'access_policy' => $document->access_policy,
            'metadata_json' => $document->metadata_json,
            'metadata_pretty' => $document->metadata_pretty,
            'created_at' => optional($document->created_at)->toDateTimeString(),
            'updated_at' => optional($document->updated_at)->toDateTimeString(),
            'document_type' => $document->documentType ? [
                'id' => $document->documentType->id,
                'code' => $document->documentType->code,
                'name' => $document->documentType->name,
                'sensitivity_level' => $document->documentType->sensitivity_level,
            ] : null,
            'ocr_status' => $ocrEnabled ? $document->ocr_status : null,
            'ocr_engine' => $ocrEnabled ? $document->ocr_engine : null,
            'ocr_language' => $ocrEnabled ? $document->ocr_language : null,
            'ocr_page_count' => $ocrEnabled ? $document->ocr_page_count : null,
            'ocr_avg_confidence' => $ocrEnabled && $document->ocr_avg_confidence !== null ? (float) $document->ocr_avg_confidence : null,
            'ocr_error_message' => $ocrEnabled ? $document->ocr_error_message : null,
            'ocr_processed_at' => $ocrEnabled ? optional($document->ocr_processed_at)->toDateTimeString() : null,
            'ocr_full_text' => $ocrEnabled && $includeResults ? $document->ocr_full_text : null,
            'ocr_excerpt' => $ocrEnabled && filled($document->ocr_full_text) ? Str::limit(trim((string) $document->ocr_full_text), 240) : null,
            'ocr_results' => $ocrEnabled && $includeResults
                ? $document->ocrResults
                    ->map(fn (OcrResult $result) => [
                        'id' => $result->id,
                        'page_number' => $result->page_number,
                        'text' => $result->text,
                        'confidence' => $result->confidence,
                        'raw_json' => $result->raw_json,
                    ])
                    ->values()
                    ->all()
                : [],
            'ocr_enabled' => $ocrEnabled,
            'download_url' => "/employees/{$employee->id}/documents/{$document->id}/download",
            'delete_url' => "/employees/{$employee->id}/documents/{$document->id}",
            'show_url' => "/employees/{$employee->id}/documents/{$document->id}",
            'ocr_result_url' => "/employees/{$employee->id}/documents/{$document->id}/ocr",
            'retry_ocr_url' => "/employees/{$employee->id}/documents/{$document->id}/ocr/retry",
            'process_now_url' => "/employees/{$employee->id}/documents/{$document->id}/ocr/process-now",
        ];
    }

    private function parseMetadataInput(?string $value): ?array
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $decoded = json_decode($value, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            throw ValidationException::withMessages([
                'metadata_json' => 'Metadata must be valid JSON.',
            ]);
        }

        return $decoded;
    }

    private function storageDiskName(Document $document): string
    {
        $disk = data_get($document->metadata_json, 'storage_disk');

        return is_string($disk) && $disk !== '' ? $disk : 'public';
    }
}
