<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Employee;
use App\Support\Access\RolePageScopeResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    use ResolvesRolePageScope;

    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $accessPolicy = (string) $request->input('access_policy', 'all');
        $documentTypeId = $request->input('document_type_id', 'all');
        $ownerEmployeeId = $request->input('owner_employee_id', 'all');
        $expiryState = (string) $request->input('expiry_state', 'all');

        $documentsQuery = Document::query()
            ->with([
                'documentType:id,code,name,sensitivity_level',
                'ownerEmployee:id,first_name,middle_name,surname,staff_number',
            ])
            ->search($search)
            ->accessPolicy($accessPolicy)
            ->documentTypeFilter($documentTypeId)
            ->ownerFilter($ownerEmployeeId)
            ->expiryState($expiryState);
        $scope = $this->applyRolePageScope($documentsQuery, $request, RolePageScopeResolver::MODULE_DOCUMENTS);
        $documents = $documentsQuery
            ->orderByDesc('issue_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $statsBase = Document::query();
        $this->applyRolePageScope($statsBase, $request, RolePageScopeResolver::MODULE_DOCUMENTS);

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'filters' => $this->roleScopedFilters([
                'search' => $search,
                'access_policy' => $accessPolicy,
                'document_type_id' => (string) $documentTypeId,
                'owner_employee_id' => (string) $ownerEmployeeId,
                'expiry_state' => $expiryState,
            ], $scope),
            'accessPolicyOptions' => $this->accessPolicyOptions(),
            'expiryStateOptions' => $this->expiryStateOptions(),
            'documentTypes' => $this->documentTypes(),
            'employees' => $this->employees($request),
            'stats' => [
                'total' => (clone $statsBase)->count(),
                'expired' => (clone $statsBase)->whereDate('expiry_date', '<', now()->startOfDay())->count(),
                'expiring_30' => (clone $statsBase)
                    ->whereDate('expiry_date', '>=', now()->startOfDay())
                    ->whereDate('expiry_date', '<=', now()->addDays(30)->endOfDay())
                    ->count(),
                'restricted' => (clone $statsBase)->where('access_policy', 'restricted')->count(),
            ],
            'scope' => $scope,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Documents/Create', [
            'employees' => $this->employees($request),
            'documentTypes' => $this->documentTypes(),
            'accessPolicyOptions' => $this->accessPolicyOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedPayload($request);
        $this->ensureRoleScopedEmployeeIdAllowed($request, RolePageScopeResolver::MODULE_DOCUMENTS, $validated['owner_employee_id'] ?? null);

        $document = Document::create($validated);

        return redirect()
            ->route('documents.show', $document)
            ->with('success', 'Document created successfully.');
    }

    public function show(Request $request, Document $document): Response
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_DOCUMENTS, $document);
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

    public function edit(Request $request, Document $document): Response
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_DOCUMENTS, $document);
        $document->load([
            'documentType:id,code,name,sensitivity_level',
            'ownerEmployee:id,first_name,middle_name,surname,staff_number',
        ]);

        return Inertia::render('Documents/Edit', [
            'document' => [
                ...$document->toArray(),
                'metadata_pretty' => $document->metadata_pretty,
            ],
            'employees' => $this->employees($request),
            'documentTypes' => $this->documentTypes(),
            'accessPolicyOptions' => $this->accessPolicyOptions(),
        ]);
    }

    public function update(Request $request, Document $document): RedirectResponse
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_DOCUMENTS, $document);
        $validated = $this->validatedPayload($request);
        $this->ensureRoleScopedEmployeeIdAllowed($request, RolePageScopeResolver::MODULE_DOCUMENTS, $validated['owner_employee_id'] ?? null);

        $document->update($validated);

        return redirect()
            ->route('documents.show', $document)
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(Request $request, Document $document): RedirectResponse
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_DOCUMENTS, $document);
        $document->delete();

        return redirect()
            ->route('documents.index')
            ->with('success', 'Document moved to trash successfully.');
    }

    public function trash(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $documentsQuery = Document::onlyTrashed()
            ->with([
                'documentType:id,code,name',
                'ownerEmployee:id,first_name,middle_name,surname,staff_number',
            ])
            ->search($search)
            ->orderByDesc('deleted_at');
        $scope = $this->applyRolePageScope($documentsQuery, $request, RolePageScopeResolver::MODULE_DOCUMENTS);
        $documents = $documentsQuery
            ->paginate(10)
            ->withQueryString();

        $statsBase = Document::onlyTrashed()->search($search);
        $this->applyRolePageScope($statsBase, $request, RolePageScopeResolver::MODULE_DOCUMENTS);

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'filters' => $this->roleScopedFilters([
                'search' => $search,
                'access_policy' => 'all',
                'document_type_id' => 'all',
                'owner_employee_id' => 'all',
                'expiry_state' => 'all',
            ], $scope),
            'accessPolicyOptions' => $this->accessPolicyOptions(),
            'expiryStateOptions' => $this->expiryStateOptions(),
            'documentTypes' => $this->documentTypes(),
            'employees' => $this->employees($request),
            'stats' => [
                'total' => (clone $statsBase)->count(),
                'expired' => 0,
                'expiring_30' => 0,
                'restricted' => (clone $statsBase)->where('access_policy', 'restricted')->count(),
            ],
            'isTrashView' => true,
            'scope' => $scope,
        ]);
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $document = Document::withTrashed()->findOrFail($id);
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_DOCUMENTS, $document);
        $document->restore();

        return redirect()
            ->route('documents.show', $document->id)
            ->with('success', 'Document restored successfully.');
    }

    public function forceDestroy(Request $request, int $id): RedirectResponse
    {
        $document = Document::withTrashed()->findOrFail($id);
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_DOCUMENTS, $document);
        $document->forceDelete();

        return redirect()
            ->route('documents.trash')
            ->with('success', 'Document permanently deleted successfully.');
    }

    private function employees(Request $request)
    {
        return $this->roleScopedEmployees($request, RolePageScopeResolver::MODULE_DOCUMENTS);
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
