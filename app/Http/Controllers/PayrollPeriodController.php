<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payroll\UpsertPayrollPeriodRequest;
use App\Http\Requests\Payroll\UpsertPayrollPeriodExchangeRateRequest;
use App\Models\PayrollPeriod;
use App\Models\PayrollPeriodExchangeRate;
use App\Models\PayrollRun;
use App\Support\Payroll\PayrollProcessingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollPeriodController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $periods = PayrollPeriod::query()
            ->with('latestRun')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($builder) use ($search): void {
                    $builder->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('frequency', 'like', "%{$search}%");
                });
            })
            ->when($status !== '' && $status !== 'all', fn ($query) => $query->where('status', $status))
            ->orderByDesc('period_end')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (PayrollPeriod $period) => $this->mapPeriod($period));

        return Inertia::render('Payroll/Periods/Index', [
            'periods' => $periods,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statuses' => config('payroll.period_statuses', []),
            'frequencies' => config('payroll.frequencies', []),
            'defaults' => [
                'code' => sprintf('PAY-%s', now()->format('Ym')),
                'name' => sprintf('Payroll %s', now()->format('F Y')),
                'frequency' => 'MONTHLY',
                'period_start' => now()->startOfMonth()->toDateString(),
                'period_end' => now()->endOfMonth()->toDateString(),
                'pay_date' => now()->endOfMonth()->toDateString(),
                'currency' => config('payroll.default_currency', 'USD'),
                'status' => 'DRAFT',
                'notes' => '',
            ],
            'stats' => [
                'total' => PayrollPeriod::query()->count(),
                'draft' => PayrollPeriod::query()->where('status', 'DRAFT')->count(),
                'processed' => PayrollPeriod::query()->where('status', 'PROCESSED')->count(),
                'closed' => PayrollPeriod::query()->where('status', 'CLOSED')->count(),
            ],
        ]);
    }

    public function store(UpsertPayrollPeriodRequest $request): RedirectResponse
    {
        $period = PayrollPeriod::query()->create([
            'organization_id' => $this->tenantId(),
            ...$request->validated(),
            'status' => $request->validated('status') ?: 'DRAFT',
        ]);

        return redirect()
            ->to("/payroll/periods/{$period->id}")
            ->with('success', 'Payroll period created successfully.');
    }

    public function show(Request $request, int $period): Response
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $search = $request->string('search')->toString();

        $period->load([
            'latestRun.results.employee.user',
            'latestRun.results.lines',
            'latestRun.results.settlements',
            'latestRun.statutorySummaries',
            'runs.processedBy',
            'runs.approvedBy',
            'runs.closedBy',
            'runs.results',
            'inputs.employee',
            'inputs.payCode',
            'exchangeRates',
        ]);

        $latestRun = $period->latestRun;

        $results = collect($latestRun?->results ?? [])
            ->filter(function ($result) use ($search) {
                if ($search === '') {
                    return true;
                }

                return str_contains(strtolower((string) $result->employee_name_snapshot), strtolower($search))
                    || str_contains(strtolower((string) $result->staff_number_snapshot), strtolower($search));
            })
            ->map(function ($result) {
                $settlements = $result->settlements
                    ->map(fn ($settlement) => [
                        'id' => $settlement->id,
                        'currency' => $settlement->currency,
                        'settlement_amount' => (float) $settlement->settlement_amount,
                        'base_amount' => (float) $settlement->base_amount,
                        'exchange_rate' => $settlement->exchange_rate !== null ? (float) $settlement->exchange_rate : null,
                        'allocation_method' => $settlement->allocation_method,
                    ])
                    ->values();

                return [
                    'id' => $result->id,
                    'employee_id' => $result->employee_id,
                    'staff_number' => $result->staff_number_snapshot,
                    'employee_name' => $result->employee_name_snapshot,
                    'currency' => $result->currency_snapshot,
                    'department' => $result->department_snapshot,
                    'position' => $result->position_snapshot,
                    'gross_pay' => (float) $result->gross_pay,
                    'tax_amount' => (float) $result->tax_amount,
                    'total_deductions' => (float) $result->total_deductions,
                    'net_pay' => (float) $result->net_pay,
                    'status' => $result->status,
                    'line_count' => $result->lines->count(),
                    'settlements' => $settlements,
                    'settlements_preview' => $settlements->map(
                        fn (array $settlement) => sprintf('%s %.2f', $settlement['currency'], $settlement['settlement_amount'])
                    )->implode(' + '),
                    'payslip_url' => "/payroll/payslips/{$result->id}",
                ];
            })
            ->values();

        $settlementSummaries = collect($latestRun?->results ?? [])
            ->flatMap->settlements
            ->groupBy('currency')
            ->map(function ($items, $currency) {
                return [
                    'currency' => $currency,
                    'employee_count' => $items->pluck('payroll_result_id')->unique()->count(),
                    'base_total' => round((float) $items->sum('base_amount'), 2),
                    'settlement_total' => round((float) $items->sum('settlement_amount'), 2),
                ];
            })
            ->values();

        return Inertia::render('Payroll/Periods/Show', [
            'period' => [
                'id' => $period->id,
                'code' => $period->code,
                'name' => $period->name,
                'frequency' => $period->frequency,
                'currency' => $period->currency,
                'status' => $period->status,
                'period_start' => optional($period->period_start)->toDateString(),
                'period_end' => optional($period->period_end)->toDateString(),
                'pay_date' => optional($period->pay_date)->toDateString(),
                'notes' => $period->notes,
                'latest_run' => $latestRun ? [
                    'id' => $latestRun->id,
                    'run_number' => $latestRun->run_number,
                    'status' => $latestRun->status,
                    'employee_count' => (int) $latestRun->employee_count,
                    'gross_total' => (float) $latestRun->gross_total,
                    'taxable_total' => (float) $latestRun->taxable_total,
                    'deduction_total' => (float) $latestRun->deduction_total,
                    'net_total' => (float) $latestRun->net_total,
                    'processed_at' => optional($latestRun->processed_at)->toDateTimeString(),
                    'approved_at' => optional($latestRun->approved_at)->toDateTimeString(),
                    'closed_at' => optional($latestRun->closed_at)->toDateTimeString(),
                    'statutory_summaries' => $latestRun->statutorySummaries
                        ->map(fn ($summary) => [
                            'id' => $summary->id,
                            'code' => $summary->code,
                            'description' => $summary->description,
                            'employee_count' => (int) $summary->employee_count,
                            'total_amount' => (float) $summary->total_amount,
                        ])
                        ->values(),
                    'settlement_summaries' => $settlementSummaries,
                ] : null,
                'runs' => $period->runs
                    ->map(fn (PayrollRun $run) => [
                        'id' => $run->id,
                        'run_number' => $run->run_number,
                        'status' => $run->status,
                        'employee_count' => (int) $run->employee_count,
                        'gross_total' => (float) $run->gross_total,
                        'deduction_total' => (float) $run->deduction_total,
                        'net_total' => (float) $run->net_total,
                        'processed_at' => optional($run->processed_at)->toDateTimeString(),
                        'approved_at' => optional($run->approved_at)->toDateTimeString(),
                        'closed_at' => optional($run->closed_at)->toDateTimeString(),
                    ])
                    ->values(),
                'input_summary' => [
                    'total_inputs' => $period->inputs->count(),
                    'employees_with_inputs' => $period->inputs->pluck('employee_id')->unique()->count(),
                ],
                'exchange_rates' => $period->exchangeRates
                    ->map(fn (PayrollPeriodExchangeRate $rate) => [
                        'id' => $rate->id,
                        'from_currency' => strtoupper((string) $rate->from_currency),
                        'to_currency' => strtoupper((string) $rate->to_currency),
                        'rate' => (float) $rate->rate,
                        'effective_at' => optional($rate->effective_at)->toDateTimeString(),
                        'notes' => $rate->notes,
                    ])
                    ->values(),
            ],
            'results' => $results,
            'filters' => [
                'search' => $search,
            ],
            'currencies' => collect(config('payroll.currencies', []))
                ->map(fn (array $currency) => [
                    'code' => strtoupper((string) $currency['code']),
                    'label' => $currency['label'] ?? strtoupper((string) $currency['code']),
                ])
                ->values(),
            'actions' => [
                'process_url' => "/payroll/periods/{$period->id}/process",
                'approve_url' => "/payroll/periods/{$period->id}/approve",
                'close_url' => "/payroll/periods/{$period->id}/close",
                'reopen_url' => "/payroll/periods/{$period->id}/reopen",
                'update_url' => "/payroll/periods/{$period->id}",
                'delete_url' => "/payroll/periods/{$period->id}",
                'exchange_rates_store_url' => "/payroll/periods/{$period->id}/exchange-rates",
            ],
        ]);
    }

    public function update(UpsertPayrollPeriodRequest $request, int $period): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);

        if ($period->status === 'CLOSED') {
            return back()->withErrors([
                'period' => 'Closed payroll periods are read-only.',
            ]);
        }

        $period->update($request->validated());

        return back()->with('success', 'Payroll period updated successfully.');
    }

    public function destroy(int $period): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);

        if ($period->runs()->exists()) {
            return back()->withErrors([
                'period' => 'Payroll periods with existing runs cannot be deleted.',
            ]);
        }

        $period->delete();

        return redirect()
            ->to('/payroll/periods')
            ->with('success', 'Payroll period deleted successfully.');
    }

    public function process(int $period, PayrollProcessingService $processingService): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $processingService->process($period, $this->actor());

        return back()->with('success', 'Payroll processing completed successfully.');
    }

    public function approve(int $period, PayrollProcessingService $processingService): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $processingService->approve($period, $this->actor());

        return back()->with('success', 'Payroll period approved successfully.');
    }

    public function close(int $period, PayrollProcessingService $processingService): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $processingService->close($period, $this->actor());

        return back()->with('success', 'Payroll period closed successfully.');
    }

    public function reopen(int $period, PayrollProcessingService $processingService): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $processingService->reopen($period, $this->actor());

        return back()->with('success', 'Payroll period reopened successfully.');
    }

    public function storeExchangeRate(UpsertPayrollPeriodExchangeRateRequest $request, int $period): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);

        $period->exchangeRates()->create([
            'organization_id' => $this->tenantId(),
            ...$this->normalizeExchangeRate($request->validated()),
        ]);

        return back()->with('success', 'Exchange rate added successfully.');
    }

    public function updateExchangeRate(UpsertPayrollPeriodExchangeRateRequest $request, int $period, int $exchangeRate): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        /** @var PayrollPeriodExchangeRate $exchangeRate */
        $exchangeRate = $this->findTenantModelOrFail(PayrollPeriodExchangeRate::class, $exchangeRate);

        if ((int) $exchangeRate->payroll_period_id !== (int) $period->id) {
            abort(404);
        }

        $exchangeRate->update($this->normalizeExchangeRate($request->validated()));

        return back()->with('success', 'Exchange rate updated successfully.');
    }

    public function destroyExchangeRate(int $period, int $exchangeRate): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        /** @var PayrollPeriodExchangeRate $exchangeRate */
        $exchangeRate = $this->findTenantModelOrFail(PayrollPeriodExchangeRate::class, $exchangeRate);

        if ((int) $exchangeRate->payroll_period_id !== (int) $period->id) {
            abort(404);
        }

        $exchangeRate->delete();

        return back()->with('success', 'Exchange rate removed successfully.');
    }

    private function mapPeriod(PayrollPeriod $period): array
    {
        return [
            'id' => $period->id,
            'code' => $period->code,
            'name' => $period->name,
            'frequency' => $period->frequency,
            'currency' => $period->currency,
            'status' => $period->status,
            'period_start' => optional($period->period_start)->toDateString(),
            'period_end' => optional($period->period_end)->toDateString(),
            'pay_date' => optional($period->pay_date)->toDateString(),
            'employee_count' => $period->latestRun ? (int) $period->latestRun->employee_count : 0,
            'gross_total' => $period->latestRun ? (float) $period->latestRun->gross_total : 0,
            'net_total' => $period->latestRun ? (float) $period->latestRun->net_total : 0,
            'latest_run_number' => $period->latestRun?->run_number,
            'show_url' => "/payroll/periods/{$period->id}",
        ];
    }

    private function actor()
    {
        $actor = request()->user();
        abort_unless($actor, 403);

        return $actor;
    }

    private function normalizeExchangeRate(array $validated): array
    {
        $validated['from_currency'] = strtoupper((string) ($validated['from_currency'] ?? ''));
        $validated['to_currency'] = strtoupper((string) ($validated['to_currency'] ?? ''));

        return $validated;
    }
}
