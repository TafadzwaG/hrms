<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\BenefitContributionRule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BenefitController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $benefitType = $request->input('benefit_type');
        $active = $request->input('active');

        $baseQuery = Benefit::query()
            ->withCount(['plans', 'enrollments'])
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            }))
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($benefitType, fn ($q) => $q->where('benefit_type', $benefitType))
            ->when($active !== null && $active !== '', fn ($q) => $q->where('active', (bool) $active));

        $benefits = (clone $baseQuery)
            ->orderByDesc('updated_at')
            ->paginate(25)
            ->through(fn (Benefit $benefit) => $this->mapBenefit($benefit))
            ->withQueryString();

        $statsBaseQuery = Benefit::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            }))
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($benefitType, fn ($q) => $q->where('benefit_type', $benefitType));

        $categoryCountsRaw = Benefit::query()
            ->selectRaw('category, count(*) as cnt')
            ->groupBy('category')
            ->pluck('cnt', 'category')
            ->all();

        return Inertia::render('Benefits/Index', [
            'benefits' => $benefits,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'benefit_type' => $benefitType,
                'active' => $active,
            ],
            'categories' => Benefit::CATEGORIES,
            'types' => Benefit::TYPES,
            'stats' => [
                'total' => (clone $statsBaseQuery)->count(),
                'active' => (clone $statsBaseQuery)->where('active', true)->count(),
                'by_category' => $categoryCountsRaw,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Benefits/Create', [
            'options' => $this->benefitFormOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateBenefit($request);

        $benefit = DB::transaction(function () use ($data, $request) {
            return Benefit::create([
                ...$data,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/benefits/{$benefit->id}")
            ->with('success', 'Benefit created successfully.');
    }

    public function show(Benefit $benefit)
    {
        $benefit->load([
            'plans',
            'enrollments.employee:id,first_name,surname,staff_number',
            'contributionRules',
            'createdBy:id,name',
            'updatedBy:id,name',
        ]);

        return Inertia::render('Benefits/Show', [
            'benefit' => $this->mapBenefitDetail($benefit),
        ]);
    }

    public function edit(Benefit $benefit)
    {
        return Inertia::render('Benefits/Edit', [
            'benefit' => $this->mapBenefitDetail($benefit),
            'options' => $this->benefitFormOptions(),
        ]);
    }

    public function update(Request $request, Benefit $benefit): RedirectResponse
    {
        $data = $this->validateBenefit($request, $benefit);

        DB::transaction(function () use ($benefit, $data, $request) {
            $benefit->update([
                ...$data,
                'updated_by' => $request->user()?->id,
            ]);
        });

        return redirect("/benefits/{$benefit->id}")
            ->with('success', 'Benefit updated successfully.');
    }

    public function destroy(Benefit $benefit): RedirectResponse
    {
        $activeEnrollments = $benefit->enrollments()->where('status', 'active')->count();

        if ($activeEnrollments > 0) {
            return back()->with('error', 'Cannot delete a benefit that has active enrollments.');
        }

        $benefit->delete();

        return redirect('/benefits')
            ->with('success', 'Benefit deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateBenefit(Request $request, ?Benefit $benefit = null): array
    {
        return $request->validate([
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('benefits', 'code')
                    ->where('organization_id', auth()->user()?->current_organization_id)
                    ->ignore($benefit?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', Rule::in(Benefit::CATEGORIES)],
            'description' => ['nullable', 'string', 'max:2000'],
            'benefit_type' => ['required', 'string', Rule::in(Benefit::TYPES)],
            'taxable' => ['nullable', 'boolean'],
            'cash_benefit' => ['nullable', 'boolean'],
            'employer_funded' => ['nullable', 'boolean'],
            'employee_funded' => ['nullable', 'boolean'],
            'shared_contribution' => ['nullable', 'boolean'],
            'requires_dependants' => ['nullable', 'boolean'],
            'requires_plan_selection' => ['nullable', 'boolean'],
            'payroll_deductible' => ['nullable', 'boolean'],
            'active' => ['nullable', 'boolean'],
            'effective_from' => ['nullable', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
        ]);
    }

    private function mapBenefit(Benefit $benefit): array
    {
        return [
            'id' => $benefit->id,
            'code' => $benefit->code,
            'name' => $benefit->name,
            'category' => $benefit->category,
            'benefit_type' => $benefit->benefit_type,
            'taxable' => $benefit->taxable,
            'active' => $benefit->active,
            'plans_count' => $benefit->plans_count ?? 0,
            'enrollments_count' => $benefit->enrollments_count ?? 0,
            'updated_at' => optional($benefit->updated_at)->toDateTimeString(),
            'links' => [
                'show' => "/benefits/{$benefit->id}",
                'edit' => "/benefits/{$benefit->id}/edit",
            ],
        ];
    }

    private function mapBenefitDetail(Benefit $benefit): array
    {
        return [
            ...$this->mapBenefit($benefit),
            'description' => $benefit->description,
            'cash_benefit' => $benefit->cash_benefit,
            'employer_funded' => $benefit->employer_funded,
            'employee_funded' => $benefit->employee_funded,
            'shared_contribution' => $benefit->shared_contribution,
            'requires_dependants' => $benefit->requires_dependants,
            'requires_plan_selection' => $benefit->requires_plan_selection,
            'payroll_deductible' => $benefit->payroll_deductible,
            'effective_from' => optional($benefit->effective_from)->toDateString(),
            'effective_to' => optional($benefit->effective_to)->toDateString(),
            'metadata' => $benefit->metadata,
            'created_by' => $benefit->createdBy ? ['id' => $benefit->createdBy->id, 'name' => $benefit->createdBy->name] : null,
            'updated_by' => $benefit->updatedBy ? ['id' => $benefit->updatedBy->id, 'name' => $benefit->updatedBy->name] : null,
            'created_at' => optional($benefit->created_at)->toDateTimeString(),
            'plans' => $benefit->relationLoaded('plans') ? $benefit->plans->map(fn ($plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'code' => $plan->code,
                'active' => $plan->active,
                'employer_contribution_type' => $plan->employer_contribution_type,
                'employer_contribution_value' => $plan->employer_contribution_value,
                'employee_contribution_type' => $plan->employee_contribution_type,
                'employee_contribution_value' => $plan->employee_contribution_value,
                'coverage_limit' => $plan->coverage_limit,
            ])->values()->all() : [],
            'enrollments' => $benefit->relationLoaded('enrollments') ? $benefit->enrollments->map(fn ($enrollment) => [
                'id' => $enrollment->id,
                'employee' => $enrollment->employee ? [
                    'id' => $enrollment->employee->id,
                    'full_name' => $enrollment->employee->full_name,
                    'staff_number' => $enrollment->employee->staff_number,
                ] : null,
                'status' => $enrollment->status,
                'effective_date' => optional($enrollment->effective_date)->toDateString(),
                'end_date' => optional($enrollment->end_date)->toDateString(),
            ])->values()->all() : [],
            'contribution_rules' => $benefit->relationLoaded('contributionRules') ? $benefit->contributionRules->map(fn (BenefitContributionRule $rule) => [
                'id' => $rule->id,
                'rule_name' => $rule->rule_name,
                'contribution_basis' => $rule->contribution_basis,
                'employer_contribution_type' => $rule->employer_contribution_type,
                'employer_contribution_value' => $rule->employer_contribution_value,
                'employee_contribution_type' => $rule->employee_contribution_type,
                'employee_contribution_value' => $rule->employee_contribution_value,
                'min_value' => $rule->min_value,
                'max_value' => $rule->max_value,
                'active' => $rule->active,
            ])->values()->all() : [],
            'links' => [
                'show' => "/benefits/{$benefit->id}",
                'edit' => "/benefits/{$benefit->id}/edit",
                'plans' => "/benefits/{$benefit->id}/plans",
                'plans_create' => "/benefits/{$benefit->id}/plans/create",
            ],
        ];
    }

    private function benefitFormOptions(): array
    {
        return [
            'categories' => Benefit::CATEGORIES,
            'types' => Benefit::TYPES,
            'contribution_types' => Benefit::CONTRIBUTION_TYPES,
        ];
    }
}
