<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\BenefitContributionRule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BenefitContributionRuleController extends Controller
{
    public function store(Request $request, Benefit $benefit): RedirectResponse
    {
        $data = $this->validateRule($request, $benefit);

        $benefit->contributionRules()->create([
            'organization_id' => $benefit->organization_id,
            ...$data,
        ]);

        return back()->with('success', 'Contribution rule created successfully.');
    }

    public function update(Request $request, Benefit $benefit, BenefitContributionRule $rule): RedirectResponse
    {
        abort_unless((int) $rule->benefit_id === (int) $benefit->id, 404);

        $data = $this->validateRule($request, $benefit);

        $rule->update($data);

        return back()->with('success', 'Contribution rule updated successfully.');
    }

    public function destroy(Benefit $benefit, BenefitContributionRule $rule): RedirectResponse
    {
        abort_unless((int) $rule->benefit_id === (int) $benefit->id, 404);

        $rule->delete();

        return back()->with('success', 'Contribution rule deleted successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateRule(Request $request, Benefit $benefit): array
    {
        return $request->validate([
            'benefit_plan_id' => ['nullable', 'integer', 'exists:benefit_plans,id'],
            'rule_name' => ['required', 'string', 'max:255'],
            'contribution_basis' => ['required', 'string', 'max:50'],
            'employer_contribution_type' => ['required', 'string', Rule::in(Benefit::CONTRIBUTION_TYPES)],
            'employer_contribution_value' => ['nullable', 'numeric', 'min:0'],
            'employee_contribution_type' => ['required', 'string', Rule::in(Benefit::CONTRIBUTION_TYPES)],
            'employee_contribution_value' => ['nullable', 'numeric', 'min:0'],
            'min_value' => ['nullable', 'numeric', 'min:0'],
            'max_value' => ['nullable', 'numeric', 'min:0'],
            'effective_from' => ['nullable', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'active' => ['nullable', 'boolean'],
        ]);
    }
}
