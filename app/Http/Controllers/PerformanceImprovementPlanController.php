<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Models\Employee;
use App\Models\EmployeeScorecard;
use App\Models\PerformanceImprovementPlan;
use App\Support\Access\RolePageScopeResolver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceImprovementPlanController extends Controller
{
    use ResolvesRolePageScope;

    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', '')) ?: 'all';

        $plansQuery = PerformanceImprovementPlan::query()
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
            ->when($status !== 'all', fn (Builder $q) => $q->where('status', $status));
        $scope = $this->applyRolePageScope($plansQuery, $request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS);
        $plans = $plansQuery
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Performance/ImprovementPlans/Index', [
            'plans' => $plans,
            'filters' => $this->roleScopedFilters([
                'search' => $search,
                'status' => $status,
            ], $scope),
            'statuses' => PerformanceImprovementPlan::STATUSES,
            'scope' => $scope,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Performance/ImprovementPlans/Create', [
            'employees' => $this->employees($request),
            'scorecards' => $this->eligibleScorecards($request),
            'statuses' => PerformanceImprovementPlan::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $this->ensureRoleScopedEmployeeIdAllowed($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS, $validated['employee_id'] ?? null);
        $validated['created_by'] = $request->user()?->id;

        $plan = PerformanceImprovementPlan::create($validated);

        return redirect()
            ->route('improvement-plans.show', $plan)
            ->with('success', 'Performance improvement plan created successfully.');
    }

    public function show(Request $request, PerformanceImprovementPlan $performanceImprovementPlan): Response
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS, $performanceImprovementPlan);
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

    public function edit(Request $request, PerformanceImprovementPlan $performanceImprovementPlan): Response
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS, $performanceImprovementPlan);
        $performanceImprovementPlan->load([
            'employee:id,first_name,middle_name,surname,staff_number',
            'scorecard.cycle:id,title',
        ]);

        return Inertia::render('Performance/ImprovementPlans/Edit', [
            'plan' => $performanceImprovementPlan,
            'employees' => $this->employees($request),
            'scorecards' => $this->eligibleScorecards($request),
            'statuses' => PerformanceImprovementPlan::STATUSES,
        ]);
    }

    public function update(Request $request, PerformanceImprovementPlan $performanceImprovementPlan): RedirectResponse
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS, $performanceImprovementPlan);
        $validated = $request->validate($this->rules());
        $this->ensureRoleScopedEmployeeIdAllowed($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS, $validated['employee_id'] ?? null);

        $performanceImprovementPlan->update($validated);

        return redirect()
            ->route('improvement-plans.show', $performanceImprovementPlan)
            ->with('success', 'Performance improvement plan updated successfully.');
    }

    public function destroy(Request $request, PerformanceImprovementPlan $performanceImprovementPlan): RedirectResponse
    {
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS, $performanceImprovementPlan);
        $performanceImprovementPlan->delete();

        return redirect()
            ->route('improvement-plans.index')
            ->with('success', 'Performance improvement plan deleted successfully.');
    }

    private function employees(Request $request)
    {
        return $this->roleScopedEmployees($request, RolePageScopeResolver::MODULE_IMPROVEMENT_PLANS);
    }

    private function eligibleScorecards(Request $request)
    {
        $query = EmployeeScorecard::query()
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
            ->orderByDesc('finalized_at');
        $this->applyRolePageScope($query, $request, RolePageScopeResolver::MODULE_SCORECARDS);

        return $query->get();
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
