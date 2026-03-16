<?php

namespace App\Http\Controllers\Reports;

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\AssetMaintenanceRecord;
use Illuminate\Http\Request;

class AssetReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, Asset::class, 'asset-register', [
            'id', 'asset_tag', 'name', 'serial_number', 'status', 'condition',
            'asset_category_id', 'asset_vendor_id', 'asset_location_id',
            'purchase_date', 'purchase_price', 'currency',
            'warranty_expiry_date', 'book_value',
        ]);
    }

    public function byCategory(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Asset::class, 'asset_category_id', 'assets-by-category');
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Asset::class, 'status', 'assets-by-status');
    }

    public function byLocation(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Asset::class, 'asset_location_id', 'assets-by-location');
    }

    public function byCondition(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Asset::class, 'condition', 'assets-by-condition');
    }

    public function warrantyExpiring(Request $request)
    {
        return $this->downloadExpiringReport(
            $request,
            Asset::class,
            'warranty_expiry_date',
            'assets-warranty-expiring',
            ['id', 'asset_tag', 'name', 'serial_number', 'status', 'warranty_expiry_date'],
        );
    }

    public function assignments(Request $request)
    {
        $rows = AssetAssignment::query()
            ->with(['asset:id,asset_tag,name', 'employee:id,first_name,surname,staff_number'])
            ->orderByDesc('assigned_at')
            ->get()
            ->map(function (AssetAssignment $a) {
                return [
                    'asset_tag' => $a->asset?->asset_tag,
                    'asset_name' => $a->asset?->name,
                    'employee_staff_number' => $a->employee?->staff_number,
                    'employee_name' => $a->employee?->full_name,
                    'assigned_at' => optional($a->assigned_at)->toDateTimeString(),
                    'returned_at' => optional($a->returned_at)->toDateTimeString(),
                    'status' => $a->status,
                    'condition_on_assignment' => $a->condition_on_assignment,
                    'condition_on_return' => $a->condition_on_return,
                ];
            })->all();

        return $this->exportRows($request, 'asset-assignment-history', [
            'asset_tag', 'asset_name', 'employee_staff_number', 'employee_name',
            'assigned_at', 'returned_at', 'status',
            'condition_on_assignment', 'condition_on_return',
        ], $rows);
    }

    public function maintenance(Request $request)
    {
        $rows = AssetMaintenanceRecord::query()
            ->with(['asset:id,asset_tag,name', 'vendor:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (AssetMaintenanceRecord $m) {
                return [
                    'asset_tag' => $m->asset?->asset_tag,
                    'asset_name' => $m->asset?->name,
                    'maintenance_type' => $m->maintenance_type,
                    'title' => $m->title,
                    'vendor' => $m->vendor?->name,
                    'cost' => $m->cost,
                    'currency' => $m->currency,
                    'status' => $m->status,
                    'scheduled_date' => optional($m->scheduled_date)->toDateString(),
                    'started_at' => optional($m->started_at)->toDateTimeString(),
                    'completed_at' => optional($m->completed_at)->toDateTimeString(),
                ];
            })->all();

        return $this->exportRows($request, 'asset-maintenance-history', [
            'asset_tag', 'asset_name', 'maintenance_type', 'title', 'vendor',
            'cost', 'currency', 'status', 'scheduled_date', 'started_at', 'completed_at',
        ], $rows);
    }

    public function depreciation(Request $request)
    {
        $rows = Asset::query()
            ->whereNotNull('purchase_price')
            ->orderBy('asset_tag')
            ->get(['id', 'asset_tag', 'name', 'purchase_date', 'purchase_price', 'currency',
                'depreciation_method', 'useful_life_years', 'depreciation_rate',
                'salvage_value', 'book_value', 'status'])
            ->map(function (Asset $a) {
                return [
                    'asset_tag' => $a->asset_tag,
                    'name' => $a->name,
                    'purchase_date' => optional($a->purchase_date)->toDateString(),
                    'purchase_price' => $a->purchase_price,
                    'currency' => $a->currency,
                    'depreciation_method' => $a->depreciation_method,
                    'useful_life_years' => $a->useful_life_years,
                    'depreciation_rate' => $a->depreciation_rate,
                    'salvage_value' => $a->salvage_value,
                    'book_value' => $a->book_value,
                    'status' => $a->status,
                ];
            })->all();

        return $this->exportRows($request, 'asset-depreciation-schedule', [
            'asset_tag', 'name', 'purchase_date', 'purchase_price', 'currency',
            'depreciation_method', 'useful_life_years', 'depreciation_rate',
            'salvage_value', 'book_value', 'status',
        ], $rows);
    }
}
