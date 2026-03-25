<?php

namespace App\Http\Controllers;

use App\Models\KpiLibrary;
use App\Models\ScorecardTemplate;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ScorecardTemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $isActive = trim((string) $request->input('is_active', '')) ?: 'all';

        $templates = ScorecardTemplate::query()
            ->withCount(['items', 'scorecards'])
            ->when($search !== '', fn (Builder $q) => $q->where('name', 'like', "%{$search}%"))
            ->when($isActive !== 'all', fn (Builder $q) => $q->where('is_active', $isActive === '1' || $isActive === 'true'))
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Performance/Templates/Index', [
            'templates' => $templates,
            'filters' => [
                'search' => $search,
                'is_active' => $isActive,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Performance/Templates/Create', [
            'kpis' => $this->kpiLibraryItems(),
            'kpiLibraryItems' => $this->kpiLibraryItems(),
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
            'scopeTypes' => ScorecardTemplate::SCOPE_TYPES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $itemsData = $request->validate($this->itemRules());

        $template = DB::transaction(function () use ($validated, $itemsData) {
            $template = ScorecardTemplate::create($validated);

            if (! empty($itemsData['items'])) {
                foreach ($itemsData['items'] as $item) {
                    $template->items()->create($item);
                }
            }

            return $template;
        });

        return redirect()
            ->route('scorecard-templates.show', $template)
            ->with('success', 'Scorecard template created successfully.');
    }

    public function show(ScorecardTemplate $scorecardTemplate): Response
    {
        $scorecardTemplate->load([
            'items' => fn ($query) => $query
                ->with('kpi')
                ->orderBy('perspective')
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['items', 'scorecards']);

        return Inertia::render('Performance/Templates/Show', [
            'template' => $scorecardTemplate,
        ]);
    }

    public function edit(ScorecardTemplate $scorecardTemplate): Response
    {
        $scorecardTemplate->load([
            'items' => fn ($query) => $query
                ->with('kpi')
                ->orderBy('perspective')
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['items', 'scorecards']);

        return Inertia::render('Performance/Templates/Edit', [
            'template' => $scorecardTemplate,
            'kpis' => $this->kpiLibraryItems(),
            'kpiLibraryItems' => $this->kpiLibraryItems(),
            'perspectives' => KpiLibrary::PERSPECTIVES,
            'targetTypes' => KpiLibrary::TARGET_TYPES,
            'scopeTypes' => ScorecardTemplate::SCOPE_TYPES,
        ]);
    }

    public function update(Request $request, ScorecardTemplate $scorecardTemplate): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $itemsData = $request->validate($this->itemRules());

        DB::transaction(function () use ($scorecardTemplate, $validated, $itemsData) {
            $scorecardTemplate->update($validated);

            $scorecardTemplate->items()->delete();

            if (! empty($itemsData['items'])) {
                foreach ($itemsData['items'] as $item) {
                    $scorecardTemplate->items()->create($item);
                }
            }
        });

        return redirect()
            ->route('scorecard-templates.show', $scorecardTemplate)
            ->with('success', 'Scorecard template updated successfully.');
    }

    public function destroy(ScorecardTemplate $scorecardTemplate): RedirectResponse
    {
        if ($scorecardTemplate->scorecards()->exists()) {
            return back()->with('error', 'Cannot delete template with existing scorecards.');
        }

        $scorecardTemplate->items()->delete();
        $scorecardTemplate->delete();

        return redirect()
            ->route('scorecard-templates.index')
            ->with('success', 'Scorecard template deleted successfully.');
    }

    private function kpiLibraryItems()
    {
        return KpiLibrary::query()
            ->where('is_active', true)
            ->select('id', 'name', 'code', 'perspective', 'target_type', 'default_target', 'default_weight', 'unit')
            ->orderBy('perspective')
            ->orderBy('name')
            ->get();
    }

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'scope_type' => ['nullable', 'in:' . implode(',', ScorecardTemplate::SCOPE_TYPES)],
            'scope_value' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function itemRules(): array
    {
        return [
            'items' => ['nullable', 'array'],
            'items.*.perspective' => ['required', 'in:' . implode(',', KpiLibrary::PERSPECTIVES)],
            'items.*.objective' => ['required', 'string', 'max:500'],
            'items.*.kpi_name' => ['required', 'string', 'max:255'],
            'items.*.kpi_library_id' => ['nullable', 'exists:kpi_library,id'],
            'items.*.target_type' => ['required', 'in:' . implode(',', KpiLibrary::TARGET_TYPES)],
            'items.*.target_value' => ['nullable', 'numeric', 'min:0'],
            'items.*.weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'items.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
