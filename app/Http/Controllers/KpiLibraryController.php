<?php

namespace App\Http\Controllers;

use App\Models\KpiLibrary;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KpiLibraryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $perspective = (string) $request->input('perspective', 'all');
        $isActive = $request->input('is_active', 'all');

        $kpis = KpiLibrary::query()
            ->when($search !== '', function (Builder $q) use ($search) {
                $q->where(function (Builder $builder) use ($search) {
                    $builder
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($perspective !== 'all', fn (Builder $q) => $q->where('perspective', $perspective))
            ->when($isActive !== 'all', fn (Builder $q) => $q->where('is_active', $isActive === '1' || $isActive === 'true'))
            ->orderBy('perspective')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Performance/KpiLibrary/Index', [
            'kpis' => $kpis,
            'filters' => [
                'search' => $search,
                'perspective' => $perspective,
                'is_active' => $isActive,
            ],
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Performance/KpiLibrary/Create', [
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $kpi = KpiLibrary::create($validated);

        return redirect()
            ->route('kpi-library.show', $kpi)
            ->with('success', 'KPI created successfully.');
    }

    public function show(KpiLibrary $kpiLibrary): Response
    {
        return Inertia::render('Performance/KpiLibrary/Show', [
            'kpi' => $kpiLibrary,
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
        ]);
    }

    public function edit(KpiLibrary $kpiLibrary): Response
    {
        return Inertia::render('Performance/KpiLibrary/Edit', [
            'kpi' => $kpiLibrary,
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
        ]);
    }

    public function update(Request $request, KpiLibrary $kpiLibrary): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $kpiLibrary->update($validated);

        return redirect()
            ->route('kpi-library.show', $kpiLibrary)
            ->with('success', 'KPI updated successfully.');
    }

    public function destroy(KpiLibrary $kpiLibrary): RedirectResponse
    {
        if ($kpiLibrary->scorecardItems()->exists()) {
            return back()->with('error', 'Cannot delete KPI that is used in scorecard items.');
        }

        $kpiLibrary->delete();

        return redirect()
            ->route('kpi-library.index')
            ->with('success', 'KPI deleted successfully.');
    }

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'perspective' => ['required', 'in:' . implode(',', KpiLibrary::PERSPECTIVES)],
            'description' => ['nullable', 'string'],
            'target_type' => ['required', 'in:' . implode(',', KpiLibrary::TARGET_TYPES)],
            'default_target' => ['nullable', 'numeric', 'min:0'],
            'default_weight' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'unit' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ];
    }
}
