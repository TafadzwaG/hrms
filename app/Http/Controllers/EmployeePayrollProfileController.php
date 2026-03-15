<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payroll\UpsertEmployeePayrollProfileRequest;
use App\Http\Requests\Payroll\UpsertEmployeeRecurringPayItemRequest;
use App\Http\Requests\Payroll\UpsertEmployeePayrollSettlementRuleRequest;
use App\Models\Employee;
use App\Models\EmployeePayrollProfile;
use App\Models\EmployeeRecurringPayItem;
use App\Models\EmployeePayrollSettlementRule;
use App\Models\PayCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class EmployeePayrollProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $profiles = EmployeePayrollProfile::query()
            ->with(['employee.user', 'employee.orgUnit', 'employee.position', 'recurringItems.payCode', 'settlementRules'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->whereHas('employee', function ($employeeQuery) use ($search): void {
                    $employeeQuery->where('staff_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('surname', 'like', "%{$search}%");
                });
            })
            ->when($status !== '' && $status !== 'all', fn ($query) => $query->where('employment_status', $status))
            ->orderByDesc('effective_from')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (EmployeePayrollProfile $profile) => $this->mapProfile($profile));

        return Inertia::render('Payroll/Profiles/Index', [
            'profiles' => $profiles,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'stats' => [
                'total' => EmployeePayrollProfile::query()->count(),
                'active' => EmployeePayrollProfile::query()->where('active', true)->count(),
                'employees_covered' => EmployeePayrollProfile::query()->distinct('employee_id')->count('employee_id'),
                'recurring_items' => EmployeeRecurringPayItem::query()->where('is_active', true)->count(),
            ],
            'employees' => Employee::query()
                ->with(['orgUnit', 'position'])
                ->where('status', 'ACTIVE')
                ->orderBy('first_name')
                ->orderBy('surname')
                ->get()
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'staff_number' => $employee->staff_number,
                    'full_name' => $employee->full_name,
                    'department' => $employee->orgUnit?->name,
                    'position' => $employee->position?->name,
                ])
                ->values(),
            'payCodes' => PayCode::query()
                ->where('active', true)
                ->orderBy('sort_order')
                ->orderBy('code')
                ->get(['id', 'code', 'description', 'type', 'category', 'recurring'])
                ->map(fn (PayCode $payCode) => [
                    'id' => $payCode->id,
                    'code' => $payCode->code,
                    'description' => $payCode->description,
                    'type' => $payCode->type,
                    'category' => $payCode->category,
                    'recurring' => (bool) $payCode->recurring,
                ])
                ->values(),
            'defaults' => [
                'employee_id' => '',
                'pay_frequency' => 'MONTHLY',
                'currency' => config('payroll.default_currency', 'USD'),
                'basic_salary' => 0,
                'hourly_rate' => '',
                'overtime_multiplier' => 1.5,
                'bank_name' => '',
                'bank_branch' => '',
                'bank_account_name' => '',
                'bank_account_number' => '',
                'bank_account_type' => '',
                'tax_number' => '',
                'tax_table' => '',
                'pension_number' => '',
                'pension_percent' => config('payroll.statutory.pension.default_percent', 5),
                'nssa_number' => '',
                'nssa_percent' => config('payroll.statutory.nssa.default_percent', 4.5),
                'nec_number' => '',
                'nec_percent' => config('payroll.statutory.nec.default_percent', 1),
                'union_number' => '',
                'union_percent' => config('payroll.statutory.union.default_percent', 0),
                'cost_centre' => '',
                'employment_status' => 'ACTIVE',
                'tax_enabled' => true,
                'active' => true,
                'effective_from' => now()->startOfMonth()->toDateString(),
                'effective_to' => '',
                'notes' => '',
            ],
            'currencies' => collect(config('payroll.currencies', []))
                ->map(fn (array $currency) => [
                    'code' => strtoupper((string) $currency['code']),
                    'label' => $currency['label'] ?? strtoupper((string) $currency['code']),
                ])
                ->values(),
            'settlementDefaults' => [
                'currency' => config('payroll.default_currency', 'USD'),
                'allocation_method' => 'REMAINDER',
                'amount' => '',
                'percentage' => '',
                'priority' => 0,
                'active' => true,
                'notes' => '',
            ],
            'settlementAllocationMethods' => config('payroll.settlement_allocation_methods', []),
            'frequencies' => config('payroll.frequencies', []),
            'statuses' => ['ACTIVE', 'INACTIVE', 'TERMINATED', 'SUSPENDED'],
        ]);
    }

    public function store(UpsertEmployeePayrollProfileRequest $request): RedirectResponse
    {
        EmployeePayrollProfile::query()->create([
            'organization_id' => $this->tenantId(),
            ...$this->normalizeProfileFlags($request->validated()),
        ]);

        return back()->with('success', 'Payroll profile created successfully.');
    }

    public function update(UpsertEmployeePayrollProfileRequest $request, int $profile): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        $profile->update($this->normalizeProfileFlags($request->validated()));

        return back()->with('success', 'Payroll profile updated successfully.');
    }

    public function destroy(int $profile): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);

        if ($profile->results()->exists()) {
            return back()->withErrors([
                'profile' => 'Payroll profiles with processed payroll history cannot be deleted.',
            ]);
        }

        $profile->delete();

        return back()->with('success', 'Payroll profile deleted successfully.');
    }

    public function storeRecurringItem(UpsertEmployeeRecurringPayItemRequest $request, int $profile): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        $validated = $this->normalizeRecurringItem($request->validated());

        if ((int) $validated['employee_id'] !== (int) $profile->employee_id) {
            return back()->withErrors([
                'recurring_item' => 'Recurring items must belong to the selected payroll profile employee.',
            ]);
        }

        $profile->recurringItems()->create([
            'organization_id' => $this->tenantId(),
            ...$validated,
        ]);

        return back()->with('success', 'Recurring payroll item added successfully.');
    }

    public function updateRecurringItem(UpsertEmployeeRecurringPayItemRequest $request, int $profile, int $item): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        /** @var EmployeeRecurringPayItem $item */
        $item = $this->findTenantModelOrFail(EmployeeRecurringPayItem::class, $item);

        if ((int) $item->employee_payroll_profile_id !== (int) $profile->id) {
            abort(404);
        }

        $item->update($this->normalizeRecurringItem($request->validated()));

        return back()->with('success', 'Recurring payroll item updated successfully.');
    }

    public function destroyRecurringItem(int $profile, int $item): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        /** @var EmployeeRecurringPayItem $item */
        $item = $this->findTenantModelOrFail(EmployeeRecurringPayItem::class, $item);

        if ((int) $item->employee_payroll_profile_id !== (int) $profile->id) {
            abort(404);
        }

        $item->delete();

        return back()->with('success', 'Recurring payroll item removed successfully.');
    }

    public function storeSettlementRule(UpsertEmployeePayrollSettlementRuleRequest $request, int $profile): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        $validated = $this->normalizeSettlementRule($request->validated());

        $this->guardSettlementComposition($profile, $validated);

        $profile->settlementRules()->create([
            'organization_id' => $this->tenantId(),
            ...$validated,
        ]);

        return back()->with('success', 'Settlement rule added successfully.');
    }

    public function updateSettlementRule(UpsertEmployeePayrollSettlementRuleRequest $request, int $profile, int $settlement): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        /** @var EmployeePayrollSettlementRule $settlement */
        $settlement = $this->findTenantModelOrFail(EmployeePayrollSettlementRule::class, $settlement);

        if ((int) $settlement->employee_payroll_profile_id !== (int) $profile->id) {
            abort(404);
        }

        $validated = $this->normalizeSettlementRule($request->validated());
        $this->guardSettlementComposition($profile, $validated, $settlement->id);
        $settlement->update($validated);

        return back()->with('success', 'Settlement rule updated successfully.');
    }

    public function destroySettlementRule(int $profile, int $settlement): RedirectResponse
    {
        /** @var EmployeePayrollProfile $profile */
        $profile = $this->findTenantModelOrFail(EmployeePayrollProfile::class, $profile);
        /** @var EmployeePayrollSettlementRule $settlement */
        $settlement = $this->findTenantModelOrFail(EmployeePayrollSettlementRule::class, $settlement);

        if ((int) $settlement->employee_payroll_profile_id !== (int) $profile->id) {
            abort(404);
        }

        $settlement->delete();

        return back()->with('success', 'Settlement rule removed successfully.');
    }

    private function mapProfile(EmployeePayrollProfile $profile): array
    {
        $employee = $profile->employee;

        return [
            'id' => $profile->id,
            'employee_id' => $profile->employee_id,
            'employee' => $employee ? [
                'id' => $employee->id,
                'staff_number' => $employee->staff_number,
                'full_name' => $employee->full_name,
                'department' => $employee->orgUnit?->name,
                'position' => $employee->position?->name,
            ] : null,
            'pay_frequency' => $profile->pay_frequency,
            'currency' => $profile->currency,
            'basic_salary' => (float) $profile->basic_salary,
            'hourly_rate' => $profile->hourly_rate !== null ? (float) $profile->hourly_rate : null,
            'overtime_multiplier' => (float) $profile->overtime_multiplier,
            'bank_name' => $profile->bank_name,
            'bank_branch' => $profile->bank_branch,
            'bank_account_name' => $profile->bank_account_name,
            'bank_account_number' => $profile->bank_account_number,
            'bank_account_type' => $profile->bank_account_type,
            'tax_number' => $profile->tax_number,
            'tax_table' => $profile->tax_table,
            'pension_number' => $profile->pension_number,
            'pension_percent' => (float) $profile->pension_percent,
            'nssa_number' => $profile->nssa_number,
            'nssa_percent' => (float) $profile->nssa_percent,
            'nec_number' => $profile->nec_number,
            'nec_percent' => (float) $profile->nec_percent,
            'union_number' => $profile->union_number,
            'union_percent' => (float) $profile->union_percent,
            'cost_centre' => $profile->cost_centre,
            'employment_status' => $profile->employment_status,
            'tax_enabled' => (bool) $profile->tax_enabled,
            'active' => (bool) $profile->active,
            'effective_from' => optional($profile->effective_from)->toDateString(),
            'effective_to' => optional($profile->effective_to)->toDateString(),
            'notes' => $profile->notes,
            'settlement_rules' => $profile->settlementRules
                ->map(fn (EmployeePayrollSettlementRule $rule) => [
                    'id' => $rule->id,
                    'currency' => strtoupper((string) $rule->currency),
                    'allocation_method' => $rule->allocation_method,
                    'amount' => $rule->amount !== null ? (float) $rule->amount : null,
                    'percentage' => $rule->percentage !== null ? (float) $rule->percentage : null,
                    'priority' => (int) $rule->priority,
                    'active' => (bool) $rule->active,
                    'notes' => $rule->notes,
                ])
                ->values(),
            'recurring_items' => $profile->recurringItems
                ->map(fn (EmployeeRecurringPayItem $item) => [
                    'id' => $item->id,
                    'employee_id' => $item->employee_id,
                    'employee_payroll_profile_id' => $item->employee_payroll_profile_id,
                    'pay_code_id' => $item->pay_code_id,
                    'pay_code' => $item->payCode ? [
                        'id' => $item->payCode->id,
                        'code' => $item->payCode->code,
                        'description' => $item->payCode->description,
                        'type' => $item->payCode->type,
                    ] : null,
                    'input_mode' => $item->input_mode,
                    'amount' => $item->amount !== null ? (float) $item->amount : null,
                    'quantity' => $item->quantity !== null ? (float) $item->quantity : null,
                    'rate' => $item->rate !== null ? (float) $item->rate : null,
                    'effective_from' => optional($item->effective_from)->toDateString(),
                    'effective_to' => optional($item->effective_to)->toDateString(),
                    'is_active' => (bool) $item->is_active,
                    'reference' => $item->reference,
                    'notes' => $item->notes,
                ])
                ->values(),
        ];
    }

    private function normalizeProfileFlags(array $validated): array
    {
        foreach (['tax_enabled', 'active'] as $flag) {
            $validated[$flag] = (bool) ($validated[$flag] ?? false);
        }

        return $validated;
    }

    private function normalizeRecurringItem(array $validated): array
    {
        $validated['is_active'] = (bool) ($validated['is_active'] ?? true);

        return $validated;
    }

    private function normalizeSettlementRule(array $validated): array
    {
        $validated['currency'] = strtoupper((string) ($validated['currency'] ?? ''));
        $validated['allocation_method'] = strtoupper((string) ($validated['allocation_method'] ?? ''));
        $validated['active'] = (bool) ($validated['active'] ?? true);
        $validated['priority'] = (int) ($validated['priority'] ?? 0);

        if ($validated['allocation_method'] !== 'FIXED_AMOUNT') {
            $validated['amount'] = null;
        }

        if ($validated['allocation_method'] !== 'PERCENTAGE') {
            $validated['percentage'] = null;
        }

        return $validated;
    }

    private function guardSettlementComposition(EmployeePayrollProfile $profile, array $currentRule, ?int $ignoreId = null): void
    {
        $rules = $profile->settlementRules()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where('active', true)
            ->get()
            ->map(fn (EmployeePayrollSettlementRule $rule) => [
                'allocation_method' => strtoupper((string) $rule->allocation_method),
                'percentage' => $rule->percentage !== null ? (float) $rule->percentage : null,
            ]);

        if (($currentRule['active'] ?? false) === true) {
            $rules->push([
                'allocation_method' => strtoupper((string) $currentRule['allocation_method']),
                'percentage' => $currentRule['percentage'] !== null ? (float) $currentRule['percentage'] : null,
            ]);
        }

        $this->validateSettlementComposition($rules);
    }

    private function validateSettlementComposition(Collection $rules): void
    {
        $methods = $rules->pluck('allocation_method')->filter();
        $fixedCount = $methods->filter(fn (string $method) => $method === 'FIXED_AMOUNT')->count();
        $percentageCount = $methods->filter(fn (string $method) => $method === 'PERCENTAGE')->count();
        $remainderCount = $methods->filter(fn (string $method) => $method === 'REMAINDER')->count();

        if ($fixedCount > 0 && $percentageCount > 0) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'settlement_rule' => 'Fixed-amount and percentage settlement rules cannot be mixed on the same payroll profile.',
            ]);
        }

        if ($remainderCount > 1) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'settlement_rule' => 'Only one remainder settlement rule can be active on a payroll profile.',
            ]);
        }

        $percentageTotal = round((float) $rules->sum(fn (array $rule) => (float) ($rule['percentage'] ?? 0)), 4);

        if ($percentageTotal > 100.0000) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'settlement_rule' => 'Total settlement percentages cannot exceed 100%.',
            ]);
        }
    }
}
