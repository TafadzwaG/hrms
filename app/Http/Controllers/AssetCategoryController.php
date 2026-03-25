<?php

namespace App\Http\Controllers;

use App\Models\AssetCategory;
use App\Support\IndexTables\IndexTableSorter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssetCategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sortMap = [
            'name' => 'name',
            'code' => 'code',
            'parent' => fn ($query, $direction) => $query->orderBy(
                AssetCategory::query()
                    ->from('asset_categories as parent_categories')
                    ->select('parent_categories.name')
                    ->whereColumn('parent_categories.id', 'asset_categories.parent_id')
                    ->limit(1),
                $direction,
            ),
            'assets_count' => 'assets_count',
        ];
        $sorting = IndexTableSorter::resolve($request, $sortMap, 'name');

        $categories = AssetCategory::query()
            ->with('parent:id,name')
            ->withCount('assets')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%"))
            ->tap(fn ($query) => IndexTableSorter::apply($query, $sortMap, $sorting['sort'], $sorting['direction']))
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('AssetCategories/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'sort' => $sorting['sort'],
                'direction' => $sorting['direction'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetCategories/Create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateCategory($request);

        AssetCategory::create($data);

        return redirect('/asset-categories')
            ->with('success', 'Asset category created successfully.');
    }

    public function show(AssetCategory $assetCategory)
    {
        $assetCategory->load(['parent:id,name', 'children:id,name,code']);

        $recentAssets = $assetCategory->assets()
            ->with('location:id,name')
            ->select(['id', 'name', 'asset_tag', 'status', 'condition', 'asset_location_id', 'purchase_price', 'currency'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'asset_tag' => $a->asset_tag,
                'status' => $a->status,
                'condition' => $a->condition,
                'location' => $a->location?->name,
                'purchase_price' => $a->purchase_price,
                'currency' => $a->currency,
                'links' => ['show' => "/assets/{$a->id}"],
            ]);

        return Inertia::render('AssetCategories/Show', [
            'category' => [
                'id' => $assetCategory->id,
                'name' => $assetCategory->name,
                'code' => $assetCategory->code,
                'description' => $assetCategory->description,
                'depreciation_method' => $assetCategory->depreciation_method,
                'useful_life_years' => $assetCategory->useful_life_years,
                'depreciation_rate' => $assetCategory->depreciation_rate,
                'parent' => $assetCategory->parent ? ['id' => $assetCategory->parent->id, 'name' => $assetCategory->parent->name] : null,
                'children' => $assetCategory->children->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'code' => $c->code]),
                'assets_count' => $assetCategory->assets()->count(),
                'recent_assets' => $recentAssets,
            ],
        ]);
    }

    public function edit(AssetCategory $assetCategory)
    {
        return Inertia::render('AssetCategories/Edit', [
            'category' => $assetCategory,
            'options' => $this->formOptions($assetCategory->id),
        ]);
    }

    public function update(Request $request, AssetCategory $assetCategory): RedirectResponse
    {
        $data = $this->validateCategory($request, $assetCategory);

        $assetCategory->update($data);

        return redirect('/asset-categories')
            ->with('success', 'Asset category updated successfully.');
    }

    public function destroy(AssetCategory $assetCategory): RedirectResponse
    {
        if ($assetCategory->assets()->exists()) {
            return back()->with('error', 'Cannot delete a category that has assets.');
        }

        if ($assetCategory->children()->exists()) {
            return back()->with('error', 'Cannot delete a category that has sub-categories.');
        }

        $assetCategory->delete();

        return redirect('/asset-categories')
            ->with('success', 'Asset category deleted successfully.');
    }

    private function validateCategory(Request $request, ?AssetCategory $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('asset_categories', 'code')
                    ->where('organization_id', auth()->user()?->current_organization_id)
                    ->ignore($category?->id),
            ],
            'parent_id' => ['nullable', 'integer', 'exists:asset_categories,id'],
            'description' => ['nullable', 'string', 'max:2000'],
            'depreciation_method' => ['nullable', 'string', 'max:50'],
            'useful_life_years' => ['nullable', 'integer', 'min:0'],
            'depreciation_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);
    }

    private function formOptions(?int $excludeId = null): array
    {
        $parents = AssetCategory::query()
            ->select(['id', 'name'])
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
            ->orderBy('name')
            ->get()
            ->map(fn (AssetCategory $c) => ['id' => $c->id, 'name' => $c->name])
            ->values()
            ->all();

        return [
            'parents' => $parents,
            'depreciation_methods' => \App\Models\Asset::DEPRECIATION_METHODS,
        ];
    }
}
