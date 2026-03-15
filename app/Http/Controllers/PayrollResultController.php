<?php

namespace App\Http\Controllers;

use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class PayrollResultController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($this->tenantId(), 403, 'An active organization is required to access payroll results.');

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:150'],
            'payroll_period_id' => ['nullable', 'integer'],
            'department' => ['nullable', 'string', 'max:150'],
            'pay_point' => ['nullable', 'string', 'max:150'],
            'status' => ['nullable', 'string', 'max:32'],
            'currency' => ['nullable', 'string', 'max:8'],
            'page' => ['nullable', 'integer'],
        ]);

        $query = PayrollResult::query()
            ->with([
                'run:id,payroll_period_id,run_number,status',
                'run.period:id,code,name,pay_date',
                'settlements:id,payroll_result_id,currency,settlement_amount,base_amount,exchange_rate,allocation_method,sort_order',
            ])
            ->withCount('lines')
            ->orderByDesc(
                PayrollPeriod::query()
                    ->select('pay_date')
                    ->whereColumn('payroll_periods.id', 'payroll_results.payroll_period_id')
                    ->limit(1)
            )
            ->orderByDesc('payroll_results.id');

        $query->when($filters['search'] ?? null, function ($builder, string $search): void {
            $builder->where(function ($nested) use ($search): void {
                $nested->where('employee_name_snapshot', 'like', '%'.$search.'%')
                    ->orWhere('staff_number_snapshot', 'like', '%'.$search.'%')
                    ->orWhere('position_snapshot', 'like', '%'.$search.'%');
            });
        });
        $query->when($filters['payroll_period_id'] ?? null, fn ($builder, $periodId) => $builder->where('payroll_period_id', $periodId));
        $query->when($filters['department'] ?? null, fn ($builder, $department) => $builder->where('department_snapshot', $department));
        $query->when($filters['pay_point'] ?? null, fn ($builder, $payPoint) => $builder->where('pay_point_snapshot', $payPoint));
        $query->when($filters['currency'] ?? null, fn ($builder, $currency) => $builder->where('currency_snapshot', strtoupper((string) $currency)));
        $query->when($filters['status'] ?? null, fn ($builder, $status) => $builder->whereHas('run', fn ($runQuery) => $runQuery->where('status', $status)));

        $totalResults = (clone $query)->count();
        $coveredPeriods = (clone $query)->distinct()->count('payroll_period_id');
        $grossTotal = round((float) (clone $query)->sum('gross_pay'), 2);
        $netTotal = round((float) (clone $query)->sum('net_pay'), 2);

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->paginate(15)->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(function (PayrollResult $result) {
                $settlementPreview = $result->settlements->count() > 0
                    ? $result->settlements
                        ->map(fn ($settlement) => sprintf('%s %.2f', $settlement->currency, (float) $settlement->settlement_amount))
                        ->implode(' + ')
                    : sprintf('%s %.2f', $result->currency_snapshot, (float) $result->net_pay);

                return [
                    'id' => $result->id,
                    'employee' => [
                        'id' => $result->employee_id,
                        'staff_number' => $result->staff_number_snapshot,
                        'full_name' => $result->employee_name_snapshot,
                        'department' => $result->department_snapshot,
                        'position' => $result->position_snapshot,
                        'pay_point' => $result->pay_point_snapshot,
                    ],
                    'period' => [
                        'id' => $result->payroll_period_id,
                        'code' => $result->run?->period?->code,
                        'name' => $result->run?->period?->name,
                        'pay_date' => optional($result->run?->period?->pay_date)->toDateString(),
                        'run_number' => $result->run?->run_number,
                        'run_status' => $result->run?->status ?? $result->status,
                    ],
                    'totals' => [
                        'currency' => $result->currency_snapshot,
                        'gross_pay' => (float) $result->gross_pay,
                        'tax_amount' => (float) $result->tax_amount,
                        'total_deductions' => (float) $result->total_deductions,
                        'net_pay' => (float) $result->net_pay,
                    ],
                    'line_count' => (int) $result->lines_count,
                    'settlements_preview' => $settlementPreview,
                    'payslip_url' => "/payroll/payslips/{$result->id}",
                    'download_url' => "/payroll/payslips/{$result->id}/download",
                    'period_url' => "/payroll/periods/{$result->payroll_period_id}",
                ];
            })
        );

        return Inertia::render('Payroll/Results/Index', [
            'results' => [
                'data' => $paginator->items(),
                'total' => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
            ],
            'filters' => [
                'search' => $filters['search'] ?? '',
                'payroll_period_id' => $filters['payroll_period_id'] ?? '',
                'department' => $filters['department'] ?? '',
                'pay_point' => $filters['pay_point'] ?? '',
                'status' => $filters['status'] ?? '',
                'currency' => $filters['currency'] ?? '',
            ],
            'periods' => PayrollPeriod::query()
                ->orderByDesc('period_end')
                ->get(['id', 'code', 'name', 'pay_date'])
                ->map(fn (PayrollPeriod $period) => [
                    'id' => $period->id,
                    'label' => trim(($period->name ?: $period->code).' ('.optional($period->pay_date)->toDateString().')'),
                ])
                ->values(),
            'departments' => PayrollResult::query()
                ->whereNotNull('department_snapshot')
                ->distinct()
                ->orderBy('department_snapshot')
                ->pluck('department_snapshot')
                ->values(),
            'payPoints' => PayrollResult::query()
                ->whereNotNull('pay_point_snapshot')
                ->distinct()
                ->orderBy('pay_point_snapshot')
                ->pluck('pay_point_snapshot')
                ->values(),
            'statuses' => collect(config('payroll.run_statuses', []))->values(),
            'currencies' => collect(config('payroll.currencies', []))
                ->map(fn (array $currency) => [
                    'code' => strtoupper((string) $currency['code']),
                    'label' => $currency['label'] ?? strtoupper((string) $currency['code']),
                ])
                ->values(),
            'stats' => [
                'results_total' => $totalResults,
                'covered_periods' => $coveredPeriods,
                'gross_total' => $grossTotal,
                'net_total' => $netTotal,
            ],
        ]);
    }
}
