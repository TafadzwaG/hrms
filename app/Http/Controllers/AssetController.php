<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\AssetCategory;
use App\Models\AssetDocument;
use App\Models\AssetLocation;
use App\Models\AssetMaintenanceRecord;
use App\Models\AssetStatusHistory;
use App\Models\AssetVendor;
use App\Models\Employee;
use App\Support\IndexTables\IndexTableSorter;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $categoryId = $request->input('category_id');
        $locationId = $request->input('location_id');
        $sortMap = [
            'asset_tag' => 'asset_tag',
            'name' => 'name',
            'status' => 'status',
            'condition' => 'condition',
            'category' => fn ($query, $direction) => $query->orderBy(
                AssetCategory::query()
                    ->select('name')
                    ->whereColumn('asset_categories.id', 'assets.asset_category_id')
                    ->limit(1),
                $direction,
            ),
            'location' => fn ($query, $direction) => $query->orderBy(
                AssetLocation::query()
                    ->select('name')
                    ->whereColumn('asset_locations.id', 'assets.asset_location_id')
                    ->limit(1),
                $direction,
            ),
            'assigned_to' => fn ($query, $direction) => $query
                ->orderBy(
                    AssetAssignment::query()
                        ->select('employees.surname')
                        ->join('employees', 'employees.id', '=', 'asset_assignments.employee_id')
                        ->whereColumn('asset_assignments.asset_id', 'assets.id')
                        ->where('asset_assignments.status', 'active')
                        ->limit(1),
                    $direction,
                )
                ->orderBy(
                    AssetAssignment::query()
                        ->select('employees.first_name')
                        ->join('employees', 'employees.id', '=', 'asset_assignments.employee_id')
                        ->whereColumn('asset_assignments.asset_id', 'assets.id')
                        ->where('asset_assignments.status', 'active')
                        ->limit(1),
                    $direction,
                ),
            'purchase_price' => 'purchase_price',
            'updated_at' => 'updated_at',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'updated_at', 'desc');

        $baseQuery = Asset::query()
            ->with([
                'category:id,name',
                'location:id,name',
                'currentAssignment.employee:id,first_name,surname,staff_number',
            ])
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('asset_tag', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            }))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($categoryId, fn ($q) => $q->where('asset_category_id', $categoryId))
            ->when($locationId, fn ($q) => $q->where('asset_location_id', $locationId));

        $assets = (clone $baseQuery)
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->through(fn (Asset $asset) => $this->mapAsset($asset))
            ->withQueryString();

        $statsBaseQuery = Asset::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('asset_tag', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            }))
            ->when($categoryId, fn ($q) => $q->where('asset_category_id', $categoryId))
            ->when($locationId, fn ($q) => $q->where('asset_location_id', $locationId));

        $categories = AssetCategory::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        $locations = AssetLocation::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'category_id' => $categoryId,
                'location_id' => $locationId,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
            'statuses' => Asset::STATUSES,
            'categories' => $categories,
            'locations' => $locations,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'assigned' => (clone $statsBaseQuery)->where('status', 'assigned')->count(),
                'available' => (clone $statsBaseQuery)->where('status', 'available')->count(),
                'maintenance' => (clone $statsBaseQuery)
                    ->whereIn('status', ['maintenance', 'in_maintenance'])
                    ->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Assets/Create', [
            'options' => $this->assetFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAsset($request);

        $request->validate(['image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120']]);

        $asset = DB::transaction(function () use ($data, $request) {
            $asset = Asset::create([
                ...$data,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);

            AssetStatusHistory::create([
                'asset_id' => $asset->id,
                'from_status' => null,
                'to_status' => $asset->status,
                'reason' => 'Asset created.',
                'changed_by' => $request->user()?->id,
            ]);

            return $asset;
        });

        if ($request->hasFile('image')) {
            $slug = \Illuminate\Support\Str::slug($asset->name);
            $ext = $request->file('image')->getClientOriginalExtension();
            $path = $request->file('image')->storeAs('assets', "{$slug}-{$asset->id}.{$ext}", 'public');
            $asset->update(['image_path' => $path]);
        }

        return redirect("/assets/{$asset->id}")
            ->with('success', 'Asset created successfully.');
    }

    public function show(Asset $asset)
    {
        $asset->load([
            'category:id,name',
            'vendor:id,name',
            'location:id,name,building,floor,room',
            'currentAssignment.employee:id,first_name,surname,staff_number',
            'assignments.employee:id,first_name,surname,staff_number',
            'assignments.assignedByUser:id,name',
            'assignments.returnedToUser:id,name',
            'maintenanceRecords.vendor:id,name',
            'documents',
            'statusHistory.changedBy:id,name',
            'createdBy:id,name',
            'updatedBy:id,name',
        ]);

        return Inertia::render('Assets/Show', [
            'asset' => $this->mapAssetDetail($asset),
            'employees' => Employee::withoutGlobalScopes()
                ->where('organization_id', $asset->organization_id)
                ->select(['id', 'first_name', 'surname', 'staff_number'])
                ->orderBy('first_name')
                ->get()
                ->map(fn (Employee $e) => [
                    'id' => $e->id,
                    'full_name' => $e->full_name,
                    'staff_number' => $e->staff_number,
                ]),
            'conditions' => Asset::CONDITIONS,
        ]);
    }

    public function edit(Asset $asset)
    {
        $asset->load(['category:id,name', 'vendor:id,name', 'location:id,name']);

        return Inertia::render('Assets/Edit', [
            'asset' => $this->mapAssetDetail($asset),
            'options' => $this->assetFormOptions(),
        ]);
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $data = $this->validateAsset($request, $asset);
        $request->validate(['image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120']]);
        $oldStatus = $asset->status;

        DB::transaction(function () use ($asset, $data, $request, $oldStatus) {
            $asset->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);

            if ($oldStatus !== $asset->status) {
                AssetStatusHistory::create([
                    'asset_id' => $asset->id,
                    'from_status' => $oldStatus,
                    'to_status' => $asset->status,
                    'reason' => 'Asset updated.',
                    'changed_by' => $request->user()?->id,
                ]);
            }
        });

        if ($request->hasFile('image')) {
            if ($asset->image_path) {
                Storage::disk('public')->delete($asset->image_path);
            }
            $slug = \Illuminate\Support\Str::slug($asset->name);
            $ext = $request->file('image')->getClientOriginalExtension();
            $path = $request->file('image')->storeAs('assets', "{$slug}-{$asset->id}.{$ext}", 'public');
            $asset->update(['image_path' => $path]);
        }

        return redirect("/assets/{$asset->id}")
            ->with('success', 'Asset updated successfully.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $asset->delete();

        return redirect('/assets')
            ->with('success', 'Asset deleted successfully.');
    }

    // ── Asset Actions ────────────────────────────────────────

    public function assign(Request $request, Asset $asset): RedirectResponse
    {
        $request->validate([
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'condition_on_assignment' => ['nullable', 'string', Rule::in(Asset::CONDITIONS)],
            'expected_return_date' => ['nullable', 'date', 'after:today'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($asset->status !== 'available') {
            return back()->with('error', 'Only available assets can be assigned.');
        }

        DB::transaction(function () use ($asset, $request) {
            $asset->update([
                'status' => 'assigned',
                'updated_by' => $request->user()?->id,
            ]);

            AssetAssignment::create([
                'asset_id' => $asset->id,
                'employee_id' => $request->input('employee_id'),
                'assigned_by' => $request->user()?->id,
                'assigned_at' => now(),
                'condition_on_assignment' => $request->input('condition_on_assignment', $asset->condition),
                'expected_return_date' => $request->input('expected_return_date'),
                'notes' => $request->input('notes'),
                'status' => 'active',
            ]);

            AssetStatusHistory::create([
                'asset_id' => $asset->id,
                'from_status' => 'available',
                'to_status' => 'assigned',
                'reason' => 'Assigned to employee #'.$request->input('employee_id'),
                'changed_by' => $request->user()?->id,
            ]);
        });

        app(AuditLogger::class)->logCustom('assign', $asset, [
            'module' => 'assets',
            'description' => "Asset {$asset->asset_tag} assigned to employee #{$request->input('employee_id')}.",
        ]);

        return back()->with('success', 'Asset assigned successfully.');
    }

    public function returnAsset(Request $request, Asset $asset): RedirectResponse
    {
        $request->validate([
            'condition_on_return' => ['nullable', 'string', Rule::in(Asset::CONDITIONS)],
            'return_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $activeAssignment = $asset->currentAssignment;
        if (! $activeAssignment) {
            return back()->with('error', 'This asset has no active assignment.');
        }

        DB::transaction(function () use ($asset, $activeAssignment, $request) {
            $returnCondition = $request->input('condition_on_return', $asset->condition);

            $activeAssignment->update([
                'returned_at' => now(),
                'returned_to' => $request->user()?->id,
                'condition_on_return' => $returnCondition,
                'return_notes' => $request->input('return_notes'),
                'status' => 'returned',
            ]);

            $asset->update([
                'status' => 'available',
                'condition' => $returnCondition,
                'updated_by' => $request->user()?->id,
            ]);

            AssetStatusHistory::create([
                'asset_id' => $asset->id,
                'from_status' => 'assigned',
                'to_status' => 'available',
                'reason' => 'Returned from employee #'.$activeAssignment->employee_id,
                'changed_by' => $request->user()?->id,
            ]);
        });

        app(AuditLogger::class)->logCustom('return', $asset, [
            'module' => 'assets',
            'description' => "Asset {$asset->asset_tag} returned from employee #{$activeAssignment->employee_id}.",
        ]);

        return back()->with('success', 'Asset returned successfully.');
    }

    public function dispose(Request $request, Asset $asset): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($asset->status === 'assigned') {
            return back()->with('error', 'Cannot dispose an asset that is currently assigned. Return it first.');
        }

        $oldStatus = $asset->status;

        DB::transaction(function () use ($asset, $request, $oldStatus) {
            $asset->update([
                'status' => 'disposed',
                'updated_by' => $request->user()?->id,
            ]);

            AssetStatusHistory::create([
                'asset_id' => $asset->id,
                'from_status' => $oldStatus,
                'to_status' => 'disposed',
                'reason' => $request->input('reason', 'Disposed.'),
                'changed_by' => $request->user()?->id,
            ]);
        });

        app(AuditLogger::class)->logCustom('dispose', $asset, [
            'module' => 'assets',
            'description' => "Asset {$asset->asset_tag} disposed.",
        ]);

        return back()->with('success', 'Asset disposed successfully.');
    }

    // ── Documents ────────────────────────────────────────────

    public function storeDocument(Request $request, Asset $asset): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'],
            'document_type' => ['nullable', 'string', Rule::in(AssetDocument::DOCUMENT_TYPES)],
        ]);

        $file = $request->file('file');
        $filePath = $file->store("assets/{$asset->id}", 'public');

        $asset->documents()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'document_type' => $request->input('document_type', 'other'),
            'uploaded_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function downloadDocument(Asset $asset, AssetDocument $document)
    {
        abort_unless((int) $document->asset_id === (int) $asset->id, 404);

        app(AuditLogger::class)->logCustom('export', $document, [
            'module' => 'asset_documents',
            'description' => "Downloaded asset document {$document->file_name}.",
            'metadata' => ['asset_id' => $asset->id],
        ]);

        $disk = Storage::disk('public');
        if ($disk->exists($document->file_path)) {
            return $disk->download($document->file_path, $document->file_name);
        }

        return back()->with('error', 'The requested document file could not be located.');
    }

    public function destroyDocument(Asset $asset, AssetDocument $document): RedirectResponse
    {
        abort_unless((int) $document->asset_id === (int) $asset->id, 404);

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateAsset(Request $request, ?Asset $asset = null): array
    {
        return $request->validate([
            'asset_tag' => [
                'required',
                'string',
                'max:100',
                Rule::unique('assets', 'asset_tag')
                    ->where('organization_id', auth()->user()?->current_organization_id)
                    ->ignore($asset?->id),
            ],
            'asset_category_id' => ['required', 'integer', 'exists:asset_categories,id'],
            'asset_vendor_id' => ['nullable', 'integer', 'exists:asset_vendors,id'],
            'asset_location_id' => ['nullable', 'integer', 'exists:asset_locations,id'],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'string', Rule::in(Asset::STATUSES)],
            'condition' => ['required', 'string', Rule::in(Asset::CONDITIONS)],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'warranty_expiry_date' => ['nullable', 'date'],
            'warranty_notes' => ['nullable', 'string', 'max:2000'],
            'depreciation_method' => ['nullable', 'string', Rule::in(Asset::DEPRECIATION_METHODS)],
            'useful_life_years' => ['nullable', 'integer', 'min:0'],
            'depreciation_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'salvage_value' => ['nullable', 'numeric', 'min:0'],
            'book_value' => ['nullable', 'numeric', 'min:0'],
            'barcode' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function assetFormOptions(): array
    {
        $categories = AssetCategory::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(fn (AssetCategory $c) => ['id' => $c->id, 'name' => $c->name])
            ->values()
            ->all();

        $vendors = AssetVendor::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (AssetVendor $v) => ['id' => $v->id, 'name' => $v->name])
            ->values()
            ->all();

        $locations = AssetLocation::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (AssetLocation $l) => ['id' => $l->id, 'name' => $l->name])
            ->values()
            ->all();

        return [
            'categories' => $categories,
            'vendors' => $vendors,
            'locations' => $locations,
            'statuses' => Asset::STATUSES,
            'conditions' => Asset::CONDITIONS,
            'depreciation_methods' => Asset::DEPRECIATION_METHODS,
            'currencies' => Asset::CURRENCIES,
        ];
    }

    private function mapAsset(Asset $asset): array
    {
        return [
            'id' => $asset->id,
            'asset_tag' => $asset->asset_tag,
            'name' => $asset->name,
            'serial_number' => $asset->serial_number,
            'status' => $asset->status,
            'condition' => $asset->condition,
            'category' => $asset->category ? ['id' => $asset->category->id, 'name' => $asset->category->name] : null,
            'location' => $asset->location ? ['id' => $asset->location->id, 'name' => $asset->location->name] : null,
            'purchase_date' => optional($asset->purchase_date)->toDateString(),
            'purchase_price' => $asset->purchase_price,
            'currency' => $asset->currency,
            'current_assignment' => $asset->currentAssignment ? [
                'employee' => [
                    'id' => $asset->currentAssignment->employee->id,
                    'full_name' => $asset->currentAssignment->employee->full_name,
                    'staff_number' => $asset->currentAssignment->employee->staff_number,
                ],
                'assigned_at' => optional($asset->currentAssignment->assigned_at)->toDateTimeString(),
            ] : null,
            'updated_at' => optional($asset->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/assets/{$asset->id}",
                'edit' => "/assets/{$asset->id}/edit",
            ],
        ];
    }

    private function mapAssetDetail(Asset $asset): array
    {
        return [
            ...$this->mapAsset($asset),
            'description' => $asset->description,
            'vendor' => $asset->vendor ? ['id' => $asset->vendor->id, 'name' => $asset->vendor->name] : null,
            'warranty_expiry_date' => optional($asset->warranty_expiry_date)->toDateString(),
            'warranty_notes' => $asset->warranty_notes,
            'depreciation_method' => $asset->depreciation_method,
            'useful_life_years' => $asset->useful_life_years,
            'depreciation_rate' => $asset->depreciation_rate,
            'salvage_value' => $asset->salvage_value,
            'book_value' => $asset->book_value,
            'barcode' => $asset->barcode,
            'image_path' => $asset->image_path,
            'notes' => $asset->notes,
            'metadata' => $asset->metadata,
            'created_by' => $asset->createdBy ? ['id' => $asset->createdBy->id, 'name' => $asset->createdBy->name] : null,
            'updated_by' => $asset->updatedBy ? ['id' => $asset->updatedBy->id, 'name' => $asset->updatedBy->name] : null,
            'created_at' => optional($asset->created_at)->toDateTimeString(),
            'location_detail' => $asset->location ? [
                'id' => $asset->location->id,
                'name' => $asset->location->name,
                'building' => $asset->location->building,
                'floor' => $asset->location->floor,
                'room' => $asset->location->room,
            ] : null,
            'assignments' => $asset->assignments->map(fn (AssetAssignment $a) => [
                'id' => $a->id,
                'employee' => $a->employee ? [
                    'id' => $a->employee->id,
                    'full_name' => $a->employee->full_name,
                    'staff_number' => $a->employee->staff_number,
                ] : null,
                'assigned_by' => $a->assignedByUser ? ['id' => $a->assignedByUser->id, 'name' => $a->assignedByUser->name] : null,
                'returned_to' => $a->returnedToUser ? ['id' => $a->returnedToUser->id, 'name' => $a->returnedToUser->name] : null,
                'assigned_at' => optional($a->assigned_at)->toDateTimeString(),
                'expected_return_date' => optional($a->expected_return_date)->toDateString(),
                'returned_at' => optional($a->returned_at)->toDateTimeString(),
                'condition_on_assignment' => $a->condition_on_assignment,
                'condition_on_return' => $a->condition_on_return,
                'notes' => $a->notes,
                'return_notes' => $a->return_notes,
                'status' => $a->status,
            ])->values()->all(),
            'maintenance_records' => $asset->maintenanceRecords->map(fn (AssetMaintenanceRecord $m) => [
                'id' => $m->id,
                'maintenance_type' => $m->maintenance_type,
                'title' => $m->title,
                'vendor' => $m->vendor ? ['id' => $m->vendor->id, 'name' => $m->vendor->name] : null,
                'cost' => $m->cost,
                'currency' => $m->currency,
                'status' => $m->status,
                'scheduled_date' => optional($m->scheduled_date)->toDateString(),
                'started_at' => optional($m->started_at)->toDateTimeString(),
                'completed_at' => optional($m->completed_at)->toDateTimeString(),
                'links' => [
                    'show' => "/assets/{$asset->id}/maintenance/{$m->id}",
                    'edit' => "/assets/{$asset->id}/maintenance/{$m->id}/edit",
                ],
            ])->values()->all(),
            'documents' => $asset->documents->map(fn (AssetDocument $doc) => [
                'id' => $doc->id,
                'file_name' => $doc->file_name,
                'mime_type' => $doc->mime_type,
                'size' => $doc->size,
                'document_type' => $doc->document_type,
                'created_at' => optional($doc->created_at)->toDateTimeString(),
                'download_url' => "/assets/{$asset->id}/documents/{$doc->id}/download",
                'delete_url' => "/assets/{$asset->id}/documents/{$doc->id}",
            ])->values()->all(),
            'status_history' => $asset->statusHistory->map(fn (AssetStatusHistory $h) => [
                'id' => $h->id,
                'from_status' => $h->from_status,
                'to_status' => $h->to_status,
                'reason' => $h->reason,
                'changed_by' => $h->changedBy ? ['id' => $h->changedBy->id, 'name' => $h->changedBy->name] : null,
                'created_at' => optional($h->created_at)->toDateTimeString(),
            ])->values()->all(),
            'links' => [
                'show' => "/assets/{$asset->id}",
                'edit' => "/assets/{$asset->id}/edit",
                'assign' => "/assets/{$asset->id}/assign",
                'return' => "/assets/{$asset->id}/return",
                'dispose' => "/assets/{$asset->id}/dispose",
                'document_store' => "/assets/{$asset->id}/documents",
                'maintenance_create' => "/assets/{$asset->id}/maintenance/create",
            ],
        ];
    }
}
