<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetMaintenanceRecord;
use App\Models\AssetStatusHistory;
use App\Models\AssetVendor;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssetMaintenanceController extends Controller
{
    public function index(Asset $asset)
    {
        $records = $asset->maintenanceRecords()
            ->with('vendor:id,name')
            ->paginate(25);

        return Inertia::render('AssetMaintenance/Index', [
            'asset' => $this->mapAssetSummary($asset),
            'records' => $records,
        ]);
    }

    public function create(Asset $asset)
    {
        return Inertia::render('AssetMaintenance/Create', [
            'asset' => $this->mapAssetSummary($asset),
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request, Asset $asset): RedirectResponse
    {
        $data = $this->validateRecord($request);

        $record = $asset->maintenanceRecords()->create([
            ...$data,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        return redirect("/assets/{$asset->id}")
            ->with('success', 'Maintenance record created successfully.');
    }

    public function show(Asset $asset, AssetMaintenanceRecord $maintenance)
    {
        $this->ensureAssetOwnsMaintenance($asset, $maintenance);
        $maintenance->load(['vendor:id,name', 'createdBy:id,name', 'updatedBy:id,name']);

        return Inertia::render('AssetMaintenance/Show', [
            'asset' => $this->mapAssetSummary($asset),
            'record' => $maintenance,
        ]);
    }

    public function edit(Asset $asset, AssetMaintenanceRecord $maintenance)
    {
        $this->ensureAssetOwnsMaintenance($asset, $maintenance);
        $maintenance->load('vendor:id,name');

        return Inertia::render('AssetMaintenance/Edit', [
            'asset' => $this->mapAssetSummary($asset),
            'record' => $maintenance,
            'options' => $this->formOptions(),
        ]);
    }

    public function update(Request $request, Asset $asset, AssetMaintenanceRecord $maintenance): RedirectResponse
    {
        $this->ensureAssetOwnsMaintenance($asset, $maintenance);
        $data = $this->validateRecord($request);

        $oldStatus = $maintenance->status;

        DB::transaction(function () use ($asset, $maintenance, $data, $request, $oldStatus) {
            $maintenance->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);

            // If maintenance started, set asset to in_maintenance
            if ($oldStatus !== 'in_progress' && $maintenance->status === 'in_progress') {
                $prevAssetStatus = $asset->status;
                $asset->update([
                    'status' => 'in_maintenance',
                    'updated_by' => $request->user()?->id,
                ]);

                AssetStatusHistory::create([
                    'asset_id' => $asset->id,
                    'from_status' => $prevAssetStatus,
                    'to_status' => 'in_maintenance',
                    'reason' => "Maintenance started: {$maintenance->title}",
                    'changed_by' => $request->user()?->id,
                ]);
            }

            // If maintenance completed, set asset back to available
            if ($oldStatus !== 'completed' && $maintenance->status === 'completed') {
                if ($asset->status === 'in_maintenance') {
                    $asset->update([
                        'status' => 'available',
                        'updated_by' => $request->user()?->id,
                    ]);

                    AssetStatusHistory::create([
                        'asset_id' => $asset->id,
                        'from_status' => 'in_maintenance',
                        'to_status' => 'available',
                        'reason' => "Maintenance completed: {$maintenance->title}",
                        'changed_by' => $request->user()?->id,
                    ]);
                }
            }
        });

        return redirect("/assets/{$asset->id}")
            ->with('success', 'Maintenance record updated successfully.');
    }

    public function destroy(Asset $asset, AssetMaintenanceRecord $maintenance): RedirectResponse
    {
        $this->ensureAssetOwnsMaintenance($asset, $maintenance);
        $maintenance->delete();

        return redirect("/assets/{$asset->id}")
            ->with('success', 'Maintenance record deleted successfully.');
    }

    private function ensureAssetOwnsMaintenance(Asset $asset, AssetMaintenanceRecord $maintenance): void
    {
        abort_unless((int) $maintenance->asset_id === (int) $asset->id, 404);
    }

    private function validateRecord(Request $request): array
    {
        return $request->validate([
            'maintenance_type' => ['required', 'string', Rule::in(AssetMaintenanceRecord::TYPES)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'vendor_id' => ['nullable', 'integer', 'exists:asset_vendors,id'],
            'performed_by' => ['nullable', 'string', 'max:255'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'scheduled_date' => ['nullable', 'date'],
            'started_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date'],
            'next_maintenance_date' => ['nullable', 'date'],
            'status' => ['required', 'string', Rule::in(AssetMaintenanceRecord::STATUSES)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function formOptions(): array
    {
        $vendors = AssetVendor::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (AssetVendor $v) => ['id' => $v->id, 'name' => $v->name])
            ->values()
            ->all();

        return [
            'types' => AssetMaintenanceRecord::TYPES,
            'statuses' => AssetMaintenanceRecord::STATUSES,
            'vendors' => $vendors,
            'currencies' => Asset::CURRENCIES,
        ];
    }

    private function mapAssetSummary(Asset $asset): array
    {
        return [
            'id' => $asset->id,
            'asset_tag' => $asset->asset_tag,
            'name' => $asset->name,
            'status' => $asset->status,
        ];
    }
}
