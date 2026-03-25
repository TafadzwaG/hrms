<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeScorecard;
use App\Models\PerformanceImprovementPlan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceImprovementPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', '')) ?: 'all';

        $plans = PerformanceImprovementPlan::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'scorecard.cycle:id,title',
            ])
            ->when($search !== '', function (Builder $q) use ($search) {
                $q->where(function (Builder $builder) use ($search) {
                    $builder
                        ->where('title', 'like', "%{$search}%")
                        ->orWhereHas('employee', function (Builder $employeeQuery) use ($search) {
                            $employeeQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('middle_name', 'like', "%{$search}%")
                                ->orWhere('surname', 'like', "%{$search}%")
                                ->orWhere('staff_number', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== 'all', fn (Builder $q) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Performance/ImprovementPlans/Index', [
            'plans' => $plans,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statuses' => PerformanceImprovementPlan::STATUSES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Performance/ImprovementPlans/Create', [
            'employees' => $this->employees(),
            'scorecards' => $this->eligibleScorecards(),
            'statuses' => PerformanceImprovementPlan::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $validated['created_by'] = $request->user()?->id;

        $plan = PerformanceImprovementPlan::create($validated);

        return redirect()
            ->route('improvement-plans.show', $plan)
            ->with('success', 'Performance improvement plan created successfully.');
    }

    public function show(PerformanceImprovementPlan $performanceImprovementPlan): Response
    {
        $performanceImprovementPlan->load([
            'employee:id,first_name,middle_name,surname,staff_number',
            'scorecard.cycle:id,title',
            'scorecard.items',
            'creator:id,name',
        ]);

        return Inertia::render('Performance/ImprovementPlans/Show', [
            'plan' => $performanceImprovementPlan,
            'statuses' => PerformanceImprovementPlan::STATUSES,
        ]);
    }

    public function edit(PerformanceImprovementPlan $performanceImprovementPlan): Response
    {
        $performanceImprovementPlan->load([
            'employee:id,first_name,middle_name,surname,staff_number',
            'scorecard.cycle:id,title',
        ]);

        return Inertia::render('Performance/ImprovementPlans/Edit', [
            'plan' => $performanceImprovementPlan,
            'employees' => $this->employees(),
            'scorecards' => $this->eligibleScorecards(),
            'statuses' => PerformanceImprovementPlan::STATUSES,
        ]);
    }

    public function update(Request $request, PerformanceImprovementPlan $performanceImprovementPlan): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        $performanceImprovementPlan->update($validated);

        return redirect()
            ->route('improvement-plans.show', $performanceImprovementPlan)
            ->with('success', 'Performance improvement plan updated successfully.');
    }

    public function destroy(PerformanceImprovementPlan $performanceImprovementPlan): RedirectResponse
    {
        $performanceImprovementPlan->delete();

        return redirect()
            ->route('improvement-plans.index')
            ->with('success', 'Performance improvement plan deleted successfully.');
    }

    private function employees()
    {
        return Employee::query()
            ->select('id', 'first_name', 'middle_name', 'surname', 'staff_number')
            ->orderBy('first_name')
            ->orderBy('surname')
            ->get();
    }

    private function eligibleScorecards()
    {
        return EmployeeScorecard::query()
            ->with([
                'employee:id,first_name,middle_name,surname,staff_number',
                'cycle:id,title',
            ])
            ->where('status', 'finalized')
            ->where(function (Builder $q) {
                $q->where('overall_rating', 'Needs Improvement')
                    ->orWhere('overall_rating', 'Unsatisfactory');
            })
            ->select('id', 'employee_id', 'performance_cycle_id', 'overall_score', 'overall_rating')
            ->orderByDesc('finalized_at')
            ->get();
    }

    private function rules(): array
    {
        return [
            'employee_scorecard_id' => ['required', 'exists:employee_scorecards,id'],
            'employee_id' => ['required', 'exists:employees,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
            'support_required' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'status' => ['required', 'in:' . implode(',', PerformanceImprovementPlan::STATUSES)],
            'outcome' => ['nullable', 'string'],
        ];
    }
}
