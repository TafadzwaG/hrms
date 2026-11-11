<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Reports\BaseReportController;
use App\Models\PayrollExport;
use App\Models\PayrollPeriod;
use App\Models\PayrollRun;
use App\Models\PayrollTaxLedgerEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PayrollReportController extends BaseReportController
{
    public function index(Request $request): Response
    {
        $selectedRunId = $request->integer('run_id');

        $periods = PayrollPeriod::query()
            ->with('latestRun')
            ->orderByDesc('period_end')
            ->limit(24)
            ->get();

        $selectedRun = $selectedRunId
            ? $this->findTenantModelOrFail(PayrollRun::class, $selectedRunId, ['period', 'results.lines', 'results.settlements', 'statutorySummaries'])
            : $periods->first()?->latestRun?->load(['period', 'results.lines', 'results.settlements', 'statutorySummaries']);

        return Inertia::render('Payroll/Reports/Index', [
            'periods' => $periods
                ->map(fn (PayrollPeriod $period) => [
                    'id' => $period->id,
                    'code' => $period->code,
                    'name' => $period->name,
                    'status' => $period->status,
                    'latest_run' => $period->latestRun ? [
                        'id' => $period->latestRun->id,
                        'run_number' => $period->latestRun->run_number,
                        'net_total' => (float) $period->latestRun->net_total,
                        'status' => $period->latestRun->status,
                    ] : null,
                ])
                ->values(),
            'selectedRun' => $selectedRun ? [
                'id' => $selectedRun->id,
                'period' => [
                    'id' => $selectedRun->period?->id,
                    'code' => $selectedRun->period?->code,
                    'name' => $selectedRun->period?->name,
                    'period_start' => optional($selectedRun->period?->period_start)->toDateString(),
                    'period_end' => optional($selectedRun->period?->period_end)->toDateString(),
                ],
                'run_number' => $selectedRun->run_number,
                'status' => $selectedRun->status,
                'employee_count' => (int) $selectedRun->employee_count,
                'gross_total' => (float) $selectedRun->gross_total,
                'taxable_total' => (float) $selectedRun->taxable_total,
                'deduction_total' => (float) $selectedRun->deduction_total,
                'net_total' => (float) $selectedRun->net_total,
                'earnings_total' => round((float) $selectedRun->results->flatMap->lines->where('type', 'EARNING')->sum('amount'), 2),
                'statutory_total' => round((float) $selectedRun->statutorySummaries->sum('total_amount'), 2),
                'settlement_totals' => $selectedRun->results
                    ->flatMap->settlements
                    ->groupBy('currency')
                    ->map(fn ($items, $currency) => [
                        'currency' => $currency,
                        'settlement_total' => round((float) $items->sum('settlement_amount'), 2),
                    ])
                    ->values(),
                'register_url' => "/payroll/reports/runs/{$selectedRun->id}/register",
                'earnings_url' => "/payroll/reports/runs/{$selectedRun->id}/earnings",
                'deductions_url' => "/payroll/reports/runs/{$selectedRun->id}/deductions",
                'statutory_url' => "/payroll/reports/runs/{$selectedRun->id}/statutory",
                'bank_url' => "/payroll/reports/runs/{$selectedRun->id}/bank",
                'journal_url' => "/payroll/reports/runs/{$selectedRun->id}/journal",
                'tax_comparison_url' => "/payroll/reports/runs/{$selectedRun->id}/tax-comparison",
            ] : null,
            'exportHistory' => PayrollExport::query()
                ->whereNotNull('payroll_run_id')
                ->latest('created_at')
                ->limit(10)
                ->get()
                ->map(fn (PayrollExport $export) => [
                    'id' => $export->id,
                    'export_type' => $export->export_type,
                    'status' => $export->status,
                    'export_version' => $export->export_version,
                    'file_reference' => $export->file_reference,
                    'created_at' => optional($export->created_at)->toDateTimeString(),
                ])
                ->values(),
        ]);
    }

    public function register(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);
        $rows = $run->results()->get()->map(fn ($result) => [
            'staff_number' => $result->staff_number_snapshot,
            'employee_name' => $result->employee_name_snapshot,
            'department' => $result->department_snapshot,
            'position' => $result->position_snapshot,
            'gross_pay' => (float) $result->gross_pay,
            'tax_amount' => (float) $result->tax_amount,
            'total_deductions' => (float) $result->total_deductions,
            'net_pay' => (float) $result->net_pay,
        ])->all();

        $this->recordExport($run, 'REGISTER', count($rows));

        return $this->exportRows($request, "payroll-register-run-{$run->run_number}", ['staff_number', 'employee_name', 'department', 'position', 'gross_pay', 'tax_amount', 'total_deductions', 'net_pay'], $rows);
    }

    public function earnings(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);
        $rows = $run->results()
            ->with('lines')
            ->get()
            ->flatMap->lines
            ->where('type', 'EARNING')
            ->groupBy('code_snapshot')
            ->map(fn ($lines, $code) => [
                'code' => $code,
                'description' => $lines->first()->description_snapshot,
                'employees' => $lines->count(),
                'total_amount' => round((float) $lines->sum('amount'), 2),
            ])
            ->values()
            ->all();

        $this->recordExport($run, 'EARNINGS', count($rows));

        return $this->exportRows($request, "payroll-earnings-run-{$run->run_number}", ['code', 'description', 'employees', 'total_amount'], $rows);
    }

    public function deductions(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);
        $rows = $run->results()
            ->with('lines')
            ->get()
            ->flatMap->lines
            ->where('type', 'DEDUCTION')
            ->groupBy('code_snapshot')
            ->map(fn ($lines, $code) => [
                'code' => $code,
                'description' => $lines->first()->description_snapshot,
                'employees' => $lines->count(),
                'total_amount' => round((float) $lines->sum('amount'), 2),
            ])
            ->values()
            ->all();

        $this->recordExport($run, 'DEDUCTIONS', count($rows));

        return $this->exportRows($request, "payroll-deductions-run-{$run->run_number}", ['code', 'description', 'employees', 'total_amount'], $rows);
    }

    public function statutory(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);
        $rows = $run->statutorySummaries()
            ->get()
            ->map(fn ($summary) => [
                'code' => $summary->code,
                'description' => $summary->description,
                'employee_count' => (int) $summary->employee_count,
                'total_amount' => (float) $summary->total_amount,
            ])
            ->all();

        $this->recordExport($run, 'STATUTORY', count($rows));

        return $this->exportRows($request, "payroll-statutory-run-{$run->run_number}", ['code', 'description', 'employee_count', 'total_amount'], $rows);
    }

    public function bank(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);
        $rows = $run->results()
            ->with('settlements')
            ->get()
            ->flatMap(function ($result) {
                return $result->settlements->map(fn ($settlement) => [
                    'staff_number' => $result->staff_number_snapshot,
                    'employee_name' => $result->employee_name_snapshot,
                    'bank_name' => $result->bank_name_snapshot,
                    'account_name' => $result->bank_account_name_snapshot,
                    'account_number' => $result->bank_account_number_snapshot,
                    'base_currency' => $settlement->base_currency,
                    'currency' => $settlement->currency,
                    'base_amount' => (float) $settlement->base_amount,
                    'settlement_amount' => (float) $settlement->settlement_amount,
                    'exchange_rate' => $settlement->exchange_rate !== null ? (float) $settlement->exchange_rate : null,
                ]);
            })
            ->all();

        $this->recordExport($run, 'BANK', count($rows));

        return $this->exportRows(
            $request,
            "payroll-bank-summary-run-{$run->run_number}",
            ['staff_number', 'employee_name', 'bank_name', 'account_name', 'account_number', 'base_currency', 'currency', 'base_amount', 'settlement_amount', 'exchange_rate'],
            $rows
        );
    }

    public function journal(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);

        // One row per GL account, pay code and cost centre. Hours captured against another
        // cost centre are charged there; everything else goes to the employee's own.
        $rows = $run->results()
            ->with('lines.payCode')
            ->get()
            ->flatMap(function ($result) {
                return $result->lines->flatMap(function ($line) use ($result) {
                    $amount = round((float) $line->amount, 2);
                    $split = collect($line->metadata['cost_centres'] ?? [])->map(fn ($value) => round((float) $value, 2));

                    if ($split->isEmpty()) {
                        $split = collect([(string) $result->cost_centre_snapshot => $amount]);
                    }

                    // Keep the line total exact if the split was rounded.
                    $difference = round($amount - $split->sum(), 2);

                    if ($difference !== 0.0) {
                        $first = $split->keys()->first();
                        $split[$first] = round($split[$first] + $difference, 2);
                    }

                    return $split->map(fn ($value, $centre) => [
                        'line' => $line,
                        'cost_centre' => (string) $centre,
                        'amount' => $value,
                    ])->values();
                });
            })
            ->groupBy(fn ($item) => $item['line']->code_snapshot.'|'.$item['line']->type.'|'.$item['cost_centre'])
            ->flatMap(function ($items) {
                $line = $items->first()['line'];
                $total = round((float) $items->sum('amount'), 2);
                $row = [
                    'gl_account_code' => $line->payCode?->gl_account_code ?? null,
                    'cost_centre' => $items->first()['cost_centre'] !== '' ? $items->first()['cost_centre'] : null,
                    'code' => $line->code_snapshot,
                    'description' => $line->description_snapshot,
                ];

                // An employer contribution is an expense and an amount owed to the scheme.
                if ($line->type === 'EMPLOYER') {
                    return [
                        [...$row, 'debit' => $total, 'credit' => 0.0],
                        [...$row, 'description' => $line->description_snapshot.' payable', 'debit' => 0.0, 'credit' => $total],
                    ];
                }

                return [[
                    ...$row,
                    'debit' => $line->type === 'EARNING' ? $total : 0.0,
                    'credit' => $line->type === 'DEDUCTION' ? $total : 0.0,
                ]];
            })
            ->sortBy(['code', 'cost_centre'])
            ->values()
            ->all();

        $this->recordExport($run, 'JOURNAL', count($rows));

        return $this->exportRows($request, "payroll-journal-run-{$run->run_number}", ['gl_account_code', 'cost_centre', 'code', 'description', 'debit', 'credit'], $rows);
    }

    /**
     * Parallel-run check: what each employee was charged, next to what Non-FDS and
     * FDS Average would each have charged for the same period.
     */
    public function taxComparison(Request $request, int $run): BinaryFileResponse
    {
        /** @var PayrollRun $run */
        $run = $this->findTenantModelOrFail(PayrollRun::class, $run);
        $rows = PayrollTaxLedgerEntry::query()
            ->with('employee')
            ->where('payroll_run_id', $run->id)
            ->get()
            ->sortBy(fn (PayrollTaxLedgerEntry $entry) => $entry->employee?->staff_number)
            ->map(function (PayrollTaxLedgerEntry $entry) {
                $nonFds = round((float) $entry->standalone_paye + (float) $entry->standalone_aids_levy, 2);
                $average = $entry->fds_average_paye !== null
                    ? round((float) $entry->fds_average_paye + (float) $entry->fds_average_aids_levy, 2)
                    : null;

                return [
                    'staff_number' => $entry->employee?->staff_number,
                    'employee_name' => $entry->employee?->full_name,
                    'tax_method_applied' => $entry->tax_method,
                    'regular_taxable' => (float) $entry->regular_taxable,
                    'irregular_taxable' => (float) $entry->irregular_taxable,
                    'bonus_exempt' => (float) $entry->bonus_exempt,
                    'credits_applied' => (float) $entry->credits_applied,
                    'paye_charged' => (float) $entry->paye,
                    'aids_levy_charged' => (float) $entry->aids_levy,
                    'non_fds_tax' => $nonFds,
                    'fds_average_tax' => $average,
                    'fds_average_minus_non_fds' => $average !== null ? round($average - $nonFds, 2) : null,
                ];
            })
            ->values()
            ->all();

        $this->recordExport($run, 'TAX_COMPARISON', count($rows));

        return $this->exportRows(
            $request,
            "payroll-tax-comparison-run-{$run->run_number}",
            ['staff_number', 'employee_name', 'tax_method_applied', 'regular_taxable', 'irregular_taxable', 'bonus_exempt', 'credits_applied', 'paye_charged', 'aids_levy_charged', 'non_fds_tax', 'fds_average_tax', 'fds_average_minus_non_fds'],
            $rows
        );
    }

    private function recordExport(PayrollRun $run, string $type, int $rows): void
    {
        PayrollExport::query()->create([
            'organization_id' => $run->organization_id,
            'payroll_period_id' => $run->payroll_period_id,
            'payroll_run_id' => $run->id,
            'period_start' => $run->period?->period_start,
            'period_end' => $run->period?->period_end,
            'export_version' => sprintf('run-%s-%s', $run->run_number, now()->format('YmdHis')),
            'status' => 'EXPORTED',
            'exported_at' => now(),
            'file_reference' => sprintf('payroll/%s/%s-%s', strtolower($type), $run->id, now()->format('YmdHis')),
            'export_type' => $type,
            'generated_by' => request()->user()?->id,
            'notes' => 'Generated from payroll report center.',
            'summary_json' => [
                'row_count' => $rows,
                'run_number' => $run->run_number,
            ],
        ]);
    }
}
