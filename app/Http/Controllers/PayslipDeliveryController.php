<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payslips\DispatchPayslipBatchRequest;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use App\Support\Payslips\PayslipDeliveryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;

class PayslipDeliveryController extends Controller
{
    public function email(int $result, PayslipDeliveryService $deliveryService): RedirectResponse
    {
        /** @var User $actor */
        $actor = request()->user();
        /** @var PayrollResult $result */
        $result = $this->findTenantModelOrFail(PayrollResult::class, $result, ['employee.user', 'run.period']);

        $response = $deliveryService->queueEmail($result, $actor);

        return back()->with(
            $response['queued'] ? 'success' : 'error',
            $response['queued']
                ? 'Payslip email has been queued for delivery.'
                : ($response['reason'] ?? 'The payslip email could not be queued.')
        );
    }

    public function sms(int $result, PayslipDeliveryService $deliveryService): RedirectResponse
    {
        /** @var User $actor */
        $actor = request()->user();
        /** @var PayrollResult $result */
        $result = $this->findTenantModelOrFail(PayrollResult::class, $result, ['employee.user', 'run.period']);

        $response = $deliveryService->queueSms($result, $actor);

        return back()->with(
            $response['queued'] ? 'success' : 'error',
            $response['queued']
                ? 'Payslip SMS summary has been queued for delivery.'
                : ($response['reason'] ?? 'The payslip SMS could not be queued.')
        );
    }

    public function bulkEmail(DispatchPayslipBatchRequest $request, PayslipDeliveryService $deliveryService, AuditLogger $auditLogger): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $results = $this->resolveResults($request->validated());

        $summary = $deliveryService->queueBulkEmail($results, $actor);
        $this->logBulkAction($auditLogger, 'payslip_bulk_email_queued', $results, $summary);

        return back()->with(
            'success',
            "Queued {$summary['queued']} payslip email(s). {$summary['failed']} record(s) were skipped."
        );
    }

    public function bulkSms(DispatchPayslipBatchRequest $request, PayslipDeliveryService $deliveryService, AuditLogger $auditLogger): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $results = $this->resolveResults($request->validated());

        $summary = $deliveryService->queueBulkSms($results, $actor);
        $this->logBulkAction($auditLogger, 'payslip_bulk_sms_queued', $results, $summary);

        return back()->with(
            'success',
            "Queued {$summary['queued']} payslip SMS message(s). {$summary['failed']} record(s) were skipped."
        );
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return Collection<int, PayrollResult>
     */
    private function resolveResults(array $validated): Collection
    {
        $query = PayrollResult::query()->with(['employee.user', 'run.period']);

        $resultIds = collect($validated['payroll_result_ids'] ?? [])
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->values();

        if ($resultIds->isNotEmpty()) {
            return $query->whereIn('id', $resultIds)->get();
        }

        if (! empty($validated['payroll_period_id'])) {
            return $query->where('payroll_period_id', (int) $validated['payroll_period_id'])->get();
        }

        return collect();
    }

    /**
     * @param  Collection<int, PayrollResult>  $results
     * @param  array{batch_id: string, queued: int, failed: int}  $summary
     */
    private function logBulkAction(AuditLogger $auditLogger, string $event, Collection $results, array $summary): void
    {
        $periodId = $results->first()?->payroll_period_id;
        $period = $periodId ? PayrollPeriod::query()->find($periodId) : null;

        $auditLogger->logCustom($event, $period, [
            'module' => 'payroll',
            'category' => 'communication',
            'organization_id' => $this->tenantId(),
            'description' => $event === 'payslip_bulk_email_queued'
                ? 'Queued payslip emails in bulk.'
                : 'Queued payslip SMS summaries in bulk.',
            'metadata' => [
                'batch_id' => $summary['batch_id'],
                'queued' => $summary['queued'],
                'failed' => $summary['failed'],
                'payroll_result_ids' => $results->pluck('id')->values()->all(),
            ],
        ]);
    }
}
