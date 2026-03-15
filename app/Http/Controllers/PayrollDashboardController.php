<?php

namespace App\Http\Controllers;

use App\Models\EmployeePayrollProfile;
use App\Models\PayrollInput;
use App\Models\PayrollPeriod;
use App\Support\Payroll\PayrollCatalogueSynchronizer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollDashboardController extends Controller
{
    public function __invoke(Request $request, PayrollCatalogueSynchronizer $catalogueSynchronizer): Response
    {
        $tenantId = $this->tenantId();
        abort_unless($tenantId, 403, 'An active organization is required to use payroll.');

        $payCodes = $catalogueSynchronizer->sync($tenantId);

        $periods = PayrollPeriod::query()
            ->with('latestRun')
            ->orderByDesc('period_end')
            ->limit(6)
            ->get();

        $currentPeriod = PayrollPeriod::query()
            ->with(['latestRun', 'latestRun.results'])
            ->whereIn('status', ['DRAFT', 'PROCESSED', 'APPROVED'])
            ->orderByDesc('period_end')
            ->first();

        $latestClosedRun = PayrollPeriod::query()
            ->with('latestRun')
            ->where('status', 'CLOSED')
            ->orderByDesc('period_end')
            ->first()?->latestRun;

        return Inertia::render('Payroll/Index', [
            'summary' => [
                'periods_total' => PayrollPeriod::query()->count(),
                'draft_periods' => PayrollPeriod::query()->where('status', 'DRAFT')->count(),
                'closed_periods' => PayrollPeriod::query()->where('status', 'CLOSED')->count(),
                'active_profiles' => EmployeePayrollProfile::query()->where('active', true)->where('employment_status', 'ACTIVE')->count(),
                'pay_codes' => $payCodes->count(),
                'pending_inputs' => PayrollInput::query()->whereHas('period', fn ($query) => $query->whereIn('status', ['DRAFT', 'PROCESSED']))->count(),
                'latest_closed_net_total' => $latestClosedRun ? (float) $latestClosedRun->net_total : 0,
            ],
            'currentPeriod' => $currentPeriod ? $this->mapPeriod($currentPeriod, true) : null,
            'recentPeriods' => $periods->map(fn (PayrollPeriod $period) => $this->mapPeriod($period))->values(),
            'quickActions' => [
                ['label' => 'Open payroll period', 'href' => '/payroll/periods'],
                ['label' => 'Payroll results', 'href' => '/payroll/results'],
                ['label' => 'Manage pay codes', 'href' => '/payroll/pay-codes'],
                ['label' => 'Manage profiles', 'href' => '/payroll/profiles'],
                ['label' => 'Capture inputs', 'href' => '/payroll/inputs'],
                ['label' => 'Payslip distribution', 'href' => '/payroll/payslips'],
                ['label' => 'Payroll reports', 'href' => '/payroll/reports'],
            ],
        ]);
    }

    private function mapPeriod(PayrollPeriod $period, bool $includeRunSummary = false): array
    {
        $latestRun = $period->latestRun;

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
            'run_number' => $latestRun?->run_number,
            'gross_total' => $latestRun ? (float) $latestRun->gross_total : 0,
            'net_total' => $latestRun ? (float) $latestRun->net_total : 0,
            'employee_count' => $latestRun ? (int) $latestRun->employee_count : 0,
            'show_url' => "/payroll/periods/{$period->id}",
            'latest_run' => $includeRunSummary && $latestRun ? [
                'id' => $latestRun->id,
                'run_number' => $latestRun->run_number,
                'status' => $latestRun->status,
                'employee_count' => (int) $latestRun->employee_count,
                'gross_total' => (float) $latestRun->gross_total,
                'taxable_total' => (float) $latestRun->taxable_total,
                'deduction_total' => (float) $latestRun->deduction_total,
                'net_total' => (float) $latestRun->net_total,
            ] : null,
        ];
    }
}
