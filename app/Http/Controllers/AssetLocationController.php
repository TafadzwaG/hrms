<?php

namespace App\Http\Controllers;

use App\Models\AssetLocation;
use App\Support\IndexTables\IndexTableSorter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssetLocationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sortMap = [
            'name' => 'name',
            'code' => 'code',
            'building' => 'building',
            'assets_count' => 'assets_count',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'name');

        $locations = AssetLocation::query()
            ->withCount('assets')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('building', 'like', "%{$search}%"))
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('AssetLocations/Index', [
            'locations' => $locations,
            'filters' => [
                'search' => $search,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetLocations/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateLocation($request);

        AssetLocation::create($data);

        return redirect('/asset-locations')
            ->with('success', 'Asset location created successfully.');
    }

    public function edit(AssetLocation $assetLocation)
    {
        return Inertia::render('AssetLocations/Edit', [
            'location' => $assetLocation,
        ]);
    }

    public function update(Request $request, AssetLocation $assetLocation): RedirectResponse
    {
        $data = $this->validateLocation($request, $assetLocation);

        $assetLocation->update($data);

        return redirect('/asset-locations')
            ->with('success', 'Asset location updated successfully.');
    }

    public function destroy(AssetLocation $assetLocation): RedirectResponse
    {
        if ($assetLocation->assets()->exists()) {
            return back()->with('error', 'Cannot delete a location that has assets.');
        }

        $assetLocation->delete();

        return redirect('/asset-locations')
            ->with('success', 'Asset location deleted successfully.');
    }

    private function validateLocation(Request $request, ?AssetLocation $location = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('asset_locations', 'code')
                    ->where('organization_id', auth()->user()?->current_organization_id)
                    ->ignore($location?->id),
            ],
            'address' => ['nullable', 'string', 'max:2000'],
            'building' => ['nullable', 'string', 'max:255'],
            'floor' => ['nullable', 'string', 'max:50'],
            'room' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
