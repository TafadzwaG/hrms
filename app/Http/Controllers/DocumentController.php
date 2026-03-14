<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $accessPolicy = (string) $request->input('access_policy', 'all');
        $documentTypeId = $request->input('document_type_id', 'all');
        $ownerEmployeeId = $request->input('owner_employee_id', 'all');
        $expiryState = (string) $request->input('expiry_state', 'all');

        $documents = Document::query()
            ->with([
                'documentType:id,code,name,sensitivity_level',
                'ownerEmployee:id,first_name,middle_name,surname,staff_number',
            ])
            ->search($search)
            ->accessPolicy($accessPolicy)
            ->documentTypeFilter($documentTypeId)
            ->ownerFilter($ownerEmployeeId)
            ->expiryState($expiryState)
            ->orderByDesc('issue_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $statsBase = Document::query();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'filters' => [
                'search' => $search,
                'access_policy' => $accessPolicy,
                'document_type_id' => (string) $documentTypeId,
                'owner_employee_id' => (string) $ownerEmployeeId,
                'expiry_state' => $expiryState,
            ],
            'accessPolicyOptions' => $this->accessPolicyOptions(),
            'expiryStateOptions' => $this->expiryStateOptions(),
            'documentTypes' => $this->documentTypes(),
            'employees' => $this->employees(),
            'stats' => [
                'total' => (clone $statsBase)->count(),
                'expired' => (clone $statsBase)->whereDate('expiry_date', '<', now()->startOfDay())->count(),
                'expiring_30' => (clone $statsBase)
                    ->whereDate('expiry_date', '>=', now()->startOfDay())
                    ->whereDate('expiry_date', '<=', now()->addDays(30)->endOfDay())
                    ->count(),
                'restricted' => (clone $statsBase)->where('access_policy', 'restricted')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Documents/Create', [
            'employees' => $this->employees(),
            'documentTypes' => $this->documentTypes(),
            'accessPolicyOptions' => $this->accessPolicyOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedPayload($request);

        $document = Document::create($validated);

        return redirect()
            ->route('documents.show', $document)
            ->with('success', 'Document created successfully.');
    }

    public function show(Document $document): Response
    {
        $document->load([
            'documentType:id,code,name,retention_policy,sensitivity_level',
            'ownerEmployee:id,first_name,middle_name,surname,staff_number',
        ]);

        return Inertia::render('Documents/Show', [
            'document' => [
                ...$document->toArray(),
                'metadata_pretty' => $document->metadata_pretty,
                'is_expired' => $document->isExpired(),
                'is_expiring_soon' => $document->isExpiringSoon(),
            ],
        ]);
    }

    public function edit(Document $document): Response
    {
        $document->load([
            'documentType:id,code,name,sensitivity_level',
            'ownerEmployee:id,first_name,middle_name,surname,staff_number',
        ]);

        return Inertia::render('Documents/Edit', [
            'document' => [
                ...$document->toArray(),
                'metadata_pretty' => $document->metadata_pretty,
            ],
            'employees' => $this->employees(),
            'documentTypes' => $this->documentTypes(),
            'accessPolicyOptions' => $this->accessPolicyOptions(),
        ]);
    }

    public function update(Request $request, Document $document): RedirectResponse
    {
        $validated = $this->validatedPayload($request);

        $document->update($validated);

        return redirect()
            ->route('documents.show', $document)
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document): RedirectResponse
    {
        $document->delete();

        return redirect()
            ->route('documents.index')
            ->with('success', 'Document moved to trash successfully.');
    }

    public function trash(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $documents = Document::onlyTrashed()
            ->with([
                'documentType:id,code,name',
                'ownerEmployee:id,first_name,middle_name,surname,staff_number',
            ])
            ->search($search)
            ->orderByDesc('deleted_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'filters' => [
                'search' => $search,
                'access_policy' => 'all',
                'document_type_id' => 'all',
                'owner_employee_id' => 'all',
                'expiry_state' => 'all',
            ],
            'accessPolicyOptions' => $this->accessPolicyOptions(),
            'expiryStateOptions' => $this->expiryStateOptions(),
            'documentTypes' => $this->documentTypes(),
            'employees' => $this->employees(),
            'stats' => [
                'total' => Document::onlyTrashed()->count(),
                'expired' => 0,
                'expiring_30' => 0,
                'restricted' => 0,
            ],
            'isTrashView' => true,
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        $document = Document::withTrashed()->findOrFail($id);
        $document->restore();

        return redirect()
            ->route('documents.show', $document->id)
            ->with('success', 'Document restored successfully.');
    }

    public function forceDestroy(int $id): RedirectResponse
    {
        $document = Document::withTrashed()->findOrFail($id);
        $document->forceDelete();

        return redirect()
            ->route('documents.trash')
            ->with('success', 'Document permanently deleted successfully.');
    }

    private function employees()
    {
        return Employee::query()
            ->select('id', 'first_name', 'middle_name', 'surname', 'staff_number')
            ->orderBy('first_name')
            ->orderBy('surname')
            ->get();
    }

    private function documentTypes()
    {
        return DocumentType::query()
            ->select('id', 'code', 'name', 'sensitivity_level')
            ->orderBy('name')
            ->get();
    }

    private function accessPolicyOptions(): array
    {
        return ['public', 'internal', 'confidential', 'restricted'];
    }

    private function expiryStateOptions(): array
    {
        return ['all', 'active', 'expired', 'expiring_30', 'no_expiry'];
    }

    private function validatedPayload(Request $request): array
    {
        $payload = $request->all();
        $payload['metadata_json'] = $this->parseMetadata($request->input('metadata_json'));

        $validator = validator($payload, $this->rules());

        return $validator->validate();
    }

    private function rules(): array
    {
        return [
            'owner_employee_id' => ['required', 'exists:employees,id'],
            'document_type_id' => ['required', 'exists:document_types,id'],
            'title' => ['required', 'string', 'max:255'],
            'file_uri' => ['required', 'string', 'max:2048'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'metadata_json' => ['nullable', 'array'],
            'access_policy' => ['required', 'in:'.implode(',', $this->accessPolicyOptions())],
        ];
    }

    private function parseMetadata(mixed $metadata): ?array
    {
        if ($metadata === null || $metadata === '') {
            return null;
        }

        if (is_array($metadata)) {
            return $metadata;
        }

        if (is_string($metadata)) {
            $decoded = json_decode($metadata, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw ValidationException::withMessages([
                    'metadata_json' => 'Metadata must be valid JSON.',
                ]);
            }

            return $decoded;
        }

        throw ValidationException::withMessages([
            'metadata_json' => 'Metadata format is invalid.',
        ]);
    }
}
