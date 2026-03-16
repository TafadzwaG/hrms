<?php

namespace App\Http\Controllers;

use App\Models\AssetVendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssetVendorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $vendors = AssetVendor::query()
            ->withCount('assets')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('AssetVendors/Index', [
            'vendors' => $vendors,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetVendors/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateVendor($request);

        AssetVendor::create($data);

        return redirect('/asset-vendors')
            ->with('success', 'Asset vendor created successfully.');
    }

    public function edit(AssetVendor $assetVendor)
    {
        return Inertia::render('AssetVendors/Edit', [
            'vendor' => $assetVendor,
        ]);
    }

    public function update(Request $request, AssetVendor $assetVendor): RedirectResponse
    {
        $data = $this->validateVendor($request, $assetVendor);

        $assetVendor->update($data);

        return redirect('/asset-vendors')
            ->with('success', 'Asset vendor updated successfully.');
    }

    public function destroy(AssetVendor $assetVendor): RedirectResponse
    {
        if ($assetVendor->assets()->exists()) {
            return back()->with('error', 'Cannot delete a vendor that has assets.');
        }

        $assetVendor->delete();

        return redirect('/asset-vendors')
            ->with('success', 'Asset vendor deleted successfully.');
    }

    private function validateVendor(Request $request, ?AssetVendor $vendor = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('asset_vendors', 'code')
                    ->where('organization_id', auth()->user()?->current_organization_id)
                    ->ignore($vendor?->id),
            ],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:2000'],
            'website' => ['nullable', 'string', 'url', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
