<?php

namespace App\Http\Controllers;

use App\Models\PerformanceCycle;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceCycleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', 'all');

        $cycles = PerformanceCycle::query()
            ->withCount('scorecards')
            ->when($search !== '', fn (Builder $q) => $q->where('title', 'like', "%{$search}%"))
            ->when($status !== 'all', fn (Builder $q) => $q->where('status', $status))
            ->orderByDesc('start_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Performance/Cycles/Index', [
            'cycles' => $cycles,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statuses' => PerformanceCycle::STATUSES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Performance/Cycles/Create', [
            'statuses' => PerformanceCycle::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $validated['created_by'] = $request->user()?->id;

        PerformanceCycle::create($validated);

        return redirect()
            ->route('performance-cycles.index')
            ->with('success', 'Performance cycle created.');
    }

    public function show(PerformanceCycle $performanceCycle): Response
    {
        $performanceCycle->load(['scorecards.employee:id,first_name,middle_name,surname,staff_number']);
        $performanceCycle->loadCount('scorecards');

        return Inertia::render('Performance/Cycles/Show', [
            'cycle' => $performanceCycle,
            'statuses' => PerformanceCycle::STATUSES,
        ]);
    }

    public function edit(PerformanceCycle $performanceCycle): Response
    {
        return Inertia::render('Performance/Cycles/Edit', [
            'cycle' => $performanceCycle,
            'statuses' => PerformanceCycle::STATUSES,
        ]);
    }

    public function update(Request $request, PerformanceCycle $performanceCycle): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $performanceCycle->update($validated);

        return redirect()
            ->route('performance-cycles.show', $performanceCycle)
            ->with('success', 'Performance cycle updated.');
    }

    public function destroy(PerformanceCycle $performanceCycle): RedirectResponse
    {
        if ($performanceCycle->scorecards()->exists()) {
            return back()->with('error', 'Cannot delete cycle with existing scorecards.');
        }

        $performanceCycle->delete();

        return redirect()
            ->route('performance-cycles.index')
            ->with('success', 'Performance cycle deleted.');
    }

    private function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'status' => ['required', 'in:' . implode(',', PerformanceCycle::STATUSES)],
            'self_assessment_enabled' => ['boolean'],
        ];
    }
}
