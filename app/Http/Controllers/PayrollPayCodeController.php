<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payroll\UpsertPayCodeRequest;
use App\Models\PayCode;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollPayCodeController extends Controller
{
    public function index(Request $request, PayrollCatalogueSynchronizer $catalogueSynchronizer): Response
    {
        $catalogueSynchronizer->sync($this->tenantId());

        $search = $request->string('search')->toString();
        $type = $request->string('type')->toString();
        $state = $request->string('state')->toString();

        $payCodes = PayCode::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($builder) use ($search): void {
                    $builder->where('code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->when($type !== '' && $type !== 'all', fn ($query) => $query->where('type', $type))
            ->when($state !== '' && $state !== 'all', fn ($query) => $query->where('active', $state === 'active'))
            ->orderBy('sort_order')
            ->orderBy('code')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (PayCode $payCode) => $this->mapPayCode($payCode));

        return Inertia::render('Payroll/PayCodes/Index', [
            'payCodes' => $payCodes,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'state' => $state,
            ],
            'stats' => [
                'total' => PayCode::query()->count(),
                'earnings' => PayCode::query()->where('type', 'EARNING')->count(),
                'deductions' => PayCode::query()->where('type', 'DEDUCTION')->count(),
                'system_generated' => PayCode::query()->where('system_generated', true)->count(),
            ],
            'defaults' => [
                'code' => '',
                'description' => '',
                'category' => 'ALLOWANCE',
                'type' => 'EARNING',
                'taxable' => true,
                'recurring' => false,
                'affects_gross' => true,
                'affects_net' => true,
                'is_pre_tax' => false,
                'active' => true,
                'system_generated' => false,
                'gl_account_code' => '',
                'sort_order' => 0,
            ],
            'categories' => ['SALARY', 'ALLOWANCE', 'OVERTIME', 'BONUS', 'STATUTORY', 'VOLUNTARY', 'TAX'],
            'types' => ['EARNING', 'DEDUCTION'],
        ]);
    }

    public function store(UpsertPayCodeRequest $request): RedirectResponse
    {
        PayCode::query()->create([
            'organization_id' => $this->tenantId(),
            ...$this->normalizeFlags($request->validated()),
        ]);

        return back()->with('success', 'Pay code created successfully.');
    }

    public function update(UpsertPayCodeRequest $request, int $payCode): RedirectResponse
    {
        /** @var PayCode $payCode */
        $payCode = $this->findTenantModelOrFail(PayCode::class, $payCode);
        $payCode->update($this->normalizeFlags($request->validated()));

        return back()->with('success', 'Pay code updated successfully.');
    }

    public function destroy(int $payCode): RedirectResponse
    {
        /** @var PayCode $payCode */
        $payCode = $this->findTenantModelOrFail(PayCode::class, $payCode);

        if ($payCode->system_generated) {
            return back()->withErrors([
                'pay_code' => 'System-generated pay codes cannot be deleted.',
            ]);
        }

        if ($payCode->inputs()->exists() || $payCode->recurringItems()->exists() || $payCode->resultLines()->exists()) {
            return back()->withErrors([
                'pay_code' => 'Pay codes with payroll history or assignments cannot be deleted.',
            ]);
        }

        $payCode->delete();

        return back()->with('success', 'Pay code deleted successfully.');
    }

    private function mapPayCode(PayCode $payCode): array
    {
        return [
            'id' => $payCode->id,
            'code' => $payCode->code,
            'description' => $payCode->description,
            'category' => $payCode->category,
            'type' => $payCode->type,
            'taxable' => (bool) $payCode->taxable,
            'recurring' => (bool) $payCode->recurring,
            'affects_gross' => (bool) $payCode->affects_gross,
            'affects_net' => (bool) $payCode->affects_net,
            'is_pre_tax' => (bool) $payCode->is_pre_tax,
            'active' => (bool) $payCode->active,
            'system_generated' => (bool) $payCode->system_generated,
            'gl_account_code' => $payCode->gl_account_code,
            'sort_order' => (int) $payCode->sort_order,
            'created_at' => optional($payCode->created_at)->toDateTimeString(),
            'updated_at' => optional($payCode->updated_at)->toDateTimeString(),
        ];
    }

    private function normalizeFlags(array $validated): array
    {
        foreach (['taxable', 'recurring', 'affects_gross', 'affects_net', 'is_pre_tax', 'active', 'system_generated'] as $flag) {
            $validated[$flag] = (bool) ($validated[$flag] ?? false);
        }

        return $validated;
    }
}
