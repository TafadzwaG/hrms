<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\BenefitPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BenefitPlanController extends Controller
{
    public function index(Request $request, Benefit $benefit)
    {
        $search = $request->input('search');
        $active = $request->input('active');

        $plans = $benefit->plans()
            ->withCount('enrollments')
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            }))
            ->when($active !== null && $active !== '', fn ($q) => $q->where('active', (bool) $active))
            ->orderByDesc('updated_at')
            ->paginate(25)
            ->through(fn (BenefitPlan $plan) => $this->mapPlan($benefit, $plan))
            ->withQueryString();

        return Inertia::render('Benefits/Plans/Index', [
            'benefit' => ['id' => $benefit->id, 'name' => $benefit->name, 'code' => $benefit->code],
            'plans' => $plans,
            'filters' => [
                'search' => $search,
                'active' => $active,
            ],
        ]);
    }

    public function create(Benefit $benefit)
    {
        return Inertia::render('Benefits/Plans/Create', [
            'benefit' => ['id' => $benefit->id, 'name' => $benefit->name, 'code' => $benefit->code],
            'options' => $this->planFormOptions(),
        ]);
    }

    public function store(Request $request, Benefit $benefit): RedirectResponse
    {
        $data = $this->validatePlan($request, $benefit);

        $benefit->plans()->create($data);

        return redirect("/benefits/{$benefit->id}")
            ->with('success', 'Plan created successfully.');
    }

    public function edit(Benefit $benefit, BenefitPlan $plan)
    {
        return Inertia::render('Benefits/Plans/Edit', [
            'benefit' => ['id' => $benefit->id, 'name' => $benefit->name, 'code' => $benefit->code],
            'plan' => $this->mapPlan($benefit, $plan),
            'options' => $this->planFormOptions(),
        ]);
    }

    public function update(Request $request, Benefit $benefit, BenefitPlan $plan): RedirectResponse
    {
        $data = $this->validatePlan($request, $benefit, $plan);

        $plan->update($data);

        return redirect("/benefits/{$benefit->id}")
            ->with('success', 'Plan updated successfully.');
    }

    public function destroy(Benefit $benefit, BenefitPlan $plan): RedirectResponse
    {
        $activeEnrollments = $plan->enrollments()->where('status', 'active')->count();

        if ($activeEnrollments > 0) {
            return back()->with('error', 'Cannot delete a plan that has active enrollments.');
        }

        $plan->delete();

        return redirect("/benefits/{$benefit->id}")
            ->with('success', 'Plan deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validatePlan(Request $request, Benefit $benefit, ?BenefitPlan $plan = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('benefit_plans', 'code')
                    ->where('benefit_id', $benefit->id)
                    ->ignore($plan?->id),
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'active' => ['nullable', 'boolean'],
            'employer_contribution_type' => ['nullable', 'string', Rule::in(Benefit::CONTRIBUTION_TYPES)],
            'employer_contribution_value' => ['nullable', 'numeric', 'min:0'],
            'employee_contribution_type' => ['nullable', 'string', Rule::in(Benefit::CONTRIBUTION_TYPES)],
            'employee_contribution_value' => ['nullable', 'numeric', 'min:0'],
            'coverage_limit' => ['nullable', 'numeric', 'min:0'],
        ]);
    }

    private function mapPlan(Benefit $benefit, BenefitPlan $plan): array
    {
        return [
            'id' => $plan->id,
            'benefit_id' => $benefit->id,
            'name' => $plan->name,
            'code' => $plan->code,
            'description' => $plan->description,
            'active' => $plan->active,
            'employer_contribution_type' => $plan->employer_contribution_type,
            'employer_contribution_value' => $plan->employer_contribution_value,
            'employee_contribution_type' => $plan->employee_contribution_type,
            'employee_contribution_value' => $plan->employee_contribution_value,
            'coverage_limit' => $plan->coverage_limit,
            'enrollments_count' => $plan->enrollments_count ?? 0,
            'updated_at' => optional($plan->updated_at)->toDateTimeString(),
            'links' => [
                'edit' => "/benefits/{$benefit->id}/plans/{$plan->id}/edit",
            ],
        ];
    }

    private function planFormOptions(): array
    {
        return [
            'contribution_types' => Benefit::CONTRIBUTION_TYPES,
        ];
    }
}
