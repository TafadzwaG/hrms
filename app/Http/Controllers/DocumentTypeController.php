<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use App\Support\IndexTables\IndexTableSorter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DocumentTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $sensitivity = (string) $request->input('sensitivity_level', 'all');
        $sortMap = [
            'name' => 'name',
            'code' => 'code',
            'sensitivity_level' => 'sensitivity_level',
            'documents_count' => 'documents_count',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'name');

        $documentTypes = DocumentType::query()
            ->withCount('documents')
            ->search($search)
            ->sensitivity($sensitivity)
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(10)
            ->withQueryString();

        $statsBase = DocumentType::query();

        return Inertia::render('DocumentTypes/Index', [
            'documentTypes' => $documentTypes,
            'filters' => [
                'search' => $search,
                'sensitivity_level' => $sensitivity,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'sensitivityOptions' => $this->sensitivityOptions(),
            'stats' => [
                'total' => (clone $statsBase)->count(),
                'confidential' => (clone $statsBase)->where('sensitivity_level', 'confidential')->count(),
                'restricted' => (clone $statsBase)->where('sensitivity_level', 'restricted')->count(),
                'total_documents' => DocumentType::query()->withCount('documents')->get()->sum('documents_count'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('DocumentTypes/Create', [
            'sensitivityOptions' => $this->sensitivityOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $documentType = DocumentType::create($validated);

        return redirect()
            ->route('document-types.show', $documentType)
            ->with('success', 'Document type created successfully.');
    }

    public function show(DocumentType $documentType): Response
    {
        $documentType->loadCount('documents');

        return Inertia::render('DocumentTypes/Show', [
            'documentType' => $documentType,
            'canDelete' => $documentType->canBeDeleted(),
        ]);
    }

    public function edit(DocumentType $documentType): Response
    {
        $documentType->loadCount('documents');

        return Inertia::render('DocumentTypes/Edit', [
            'documentType' => $documentType,
            'sensitivityOptions' => $this->sensitivityOptions(),
            'canDelete' => $documentType->canBeDeleted(),
        ]);
    }

    public function update(Request $request, DocumentType $documentType): RedirectResponse
    {
        $validated = $request->validate($this->rules($documentType->id));

        $documentType->update($validated);

        return redirect()
            ->route('document-types.show', $documentType)
            ->with('success', 'Document type updated successfully.');
    }

    public function destroy(DocumentType $documentType): RedirectResponse
    {
        $documentType->loadCount('documents');

        if (! $documentType->canBeDeleted()) {
            return redirect()
                ->route('document-types.show', $documentType)
                ->with('error', 'This document type cannot be deleted because documents are already linked to it.');
        }

        $documentType->delete();

        return redirect()
            ->route('document-types.index')
            ->with('success', 'Document type deleted successfully.');
    }

    private function sensitivityOptions(): array
    {
        return ['public', 'internal', 'confidential', 'restricted'];
    }

    private function rules(?int $ignoreId = null): array
    {
        return [
            'code' => ['required', 'string', 'max:50', $this->tenantUniqueRule('document_types', 'code', $ignoreId)],
            'name' => ['required', 'string', 'max:255', $this->tenantUniqueRule('document_types', 'name', $ignoreId)],
            'retention_policy' => ['nullable', 'string', 'max:255'],
            'sensitivity_level' => ['required', 'in:'.implode(',', $this->sensitivityOptions())],
        ];
    }
}
