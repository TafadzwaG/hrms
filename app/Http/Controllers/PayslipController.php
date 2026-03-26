<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesRolePageScope;
use App\Models\PayslipDelivery;
use App\Models\PayrollExport;
use App\Models\PayrollPeriod;
use App\Models\PayrollResult;
use App\Support\Access\RolePageScopeResolver;
use App\Support\Audit\AuditLogger;
use App\Support\Payslips\PayslipPdfService;
use App\Support\Payslips\PayslipViewService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PayslipController extends Controller
{
    use ResolvesRolePageScope;

    public function index(Request $request, PayslipViewService $viewService): Response
    {
        abort_unless($this->tenantId(), 403, 'An active organization is required to access payslips.');

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:150'],
            'payroll_period_id' => ['nullable', 'integer'],
            'department' => ['nullable', 'string', 'max:150'],
            'pay_point' => ['nullable', 'string', 'max:150'],
            'email_status' => ['nullable', 'string', 'max:32'],
            'sms_status' => ['nullable', 'string', 'max:32'],
            'page' => ['nullable', 'integer'],
        ]);

        $query = PayrollResult::query()
            ->with(['run.period:id,code,name,pay_date', 'employee.user:id,email'])
            ->select('payroll_results.*')
            ->selectSub($this->latestDeliveryStatusSubquery(PayslipDelivery::CHANNEL_EMAIL), 'email_delivery_status')
            ->selectSub($this->latestDeliveryStatusSubquery(PayslipDelivery::CHANNEL_SMS), 'sms_delivery_status')
            ->selectSub($this->latestDeliverySentAtSubquery(PayslipDelivery::CHANNEL_EMAIL), 'email_sent_at')
            ->selectSub($this->latestDeliverySentAtSubquery(PayslipDelivery::CHANNEL_SMS), 'sms_sent_at')
            ->orderByDesc(
                PayrollPeriod::query()
                    ->select('pay_date')
                    ->whereColumn('payroll_periods.id', 'payroll_results.payroll_period_id')
                    ->limit(1)
            )
            ->orderByDesc('payroll_results.id');
        $scope = $this->applyRolePageScope($query, $request, RolePageScopeResolver::MODULE_PAYSLIPS);

        $query->when($filters['search'] ?? null, function ($builder, string $search): void {
            $builder->where(function ($nested) use ($search): void {
                $nested->where('employee_name_snapshot', 'like', '%'.$search.'%')
                    ->orWhere('staff_number_snapshot', 'like', '%'.$search.'%');
            });
        });
        $query->when($filters['payroll_period_id'] ?? null, fn ($builder, $periodId) => $builder->where('payroll_period_id', $periodId));
        $query->when($filters['department'] ?? null, fn ($builder, $department) => $builder->where('department_snapshot', $department));
        $query->when($filters['pay_point'] ?? null, fn ($builder, $payPoint) => $builder->where('pay_point_snapshot', $payPoint));
        $query->when($filters['email_status'] ?? null, fn ($builder, $status) => $this->applyDeliveryStatusFilter($builder, PayslipDelivery::CHANNEL_EMAIL, $status));
        $query->when($filters['sms_status'] ?? null, fn ($builder, $status) => $this->applyDeliveryStatusFilter($builder, PayslipDelivery::CHANNEL_SMS, $status));

        /** @var LengthAwarePaginator $paginator */
        $paginator = $query->paginate(15)->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(function (PayrollResult $result) use ($viewService) {
                $emailStatus = $result->getAttribute('email_delivery_status') ?: 'NOT_SENT';
                $smsStatus = $result->getAttribute('sms_delivery_status') ?: 'NOT_SENT';

                return [
                    'id' => $result->id,
                    'employee' => [
                        'id' => $result->employee_id,
                        'staff_number' => $result->staff_number_snapshot,
                        'full_name' => $result->employee_name_snapshot,
                        'department' => $result->department_snapshot,
                        'position' => $result->position_snapshot,
                        'pay_point' => $result->pay_point_snapshot,
                        'email' => $result->employee?->user?->email,
                        'contact_number' => $result->employee?->contact_number,
                    ],
                    'period' => [
                        'id' => $result->payroll_period_id,
                        'code' => $result->run?->period?->code,
                        'name' => $result->run?->period?->name,
                        'pay_date' => optional($result->run?->period?->pay_date)->toDateString(),
                        'run_number' => $result->run?->run_number,
                    ],
                    'totals' => [
                        'currency' => $result->currency_snapshot,
                        'gross_pay' => (float) $result->gross_pay,
                        'net_pay' => (float) $result->net_pay,
                    ],
                    'delivery' => [
                        'email_status' => $emailStatus,
                        'sms_status' => $smsStatus,
                        'email_sent_at' => $result->getAttribute('email_sent_at'),
                        'sms_sent_at' => $result->getAttribute('sms_sent_at'),
                    ],
                    'sms_summary_preview' => $viewService->smsSummary($result),
                    'view_url' => "/payroll/payslips/{$result->id}",
                    'download_url' => "/payroll/payslips/{$result->id}/download",
                ];
            })
        );

        return Inertia::render('Payroll/Payslips/Index', [
            'payslips' => [
                'data' => $paginator->items(),
                'total' => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
            ],
            'filters' => $this->roleScopedFilters([
                'search' => $filters['search'] ?? '',
                'payroll_period_id' => $filters['payroll_period_id'] ?? '',
                'department' => $filters['department'] ?? '',
                'pay_point' => $filters['pay_point'] ?? '',
                'email_status' => $filters['email_status'] ?? '',
                'sms_status' => $filters['sms_status'] ?? '',
            ], $scope),
            'periods' => tap(PayrollPeriod::query()
                ->orderByDesc('period_end')
                ->get(['id', 'code', 'name', 'pay_date']))
                ->map(fn (PayrollPeriod $period) => [
                    'id' => $period->id,
                    'label' => trim(($period->name ?: $period->code).' ('.optional($period->pay_date)->toDateString().')'),
                ])
                ->values(),
            'departments' => tap(PayrollResult::query()
                ->whereNotNull('department_snapshot')
                ->distinct(), fn ($builder) => $this->applyRolePageScope($builder, $request, RolePageScopeResolver::MODULE_PAYSLIPS))
                ->orderBy('department_snapshot')
                ->pluck('department_snapshot')
                ->values(),
            'payPoints' => tap(PayrollResult::query()
                ->whereNotNull('pay_point_snapshot')
                ->distinct(), fn ($builder) => $this->applyRolePageScope($builder, $request, RolePageScopeResolver::MODULE_PAYSLIPS))
                ->orderBy('pay_point_snapshot')
                ->pluck('pay_point_snapshot')
                ->values(),
            'deliveryStatuses' => ['NOT_SENT', 'PENDING', 'SENT', 'FAILED'],
            'scope' => $scope,
        ]);
    }

    public function show(Request $request, int $result, PayslipViewService $viewService): Response
    {
        /** @var PayrollResult $result */
        $result = $this->findTenantModelOrFail(PayrollResult::class, $result);
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_PAYSLIPS, $result);

        return Inertia::render('Payroll/Payslips/Show', [
            'payslip' => $viewService->payload($result),
        ]);
    }

    public function download(Request $request, int $result, PayslipPdfService $pdfService, PayslipViewService $viewService, AuditLogger $auditLogger): HttpResponse
    {
        /** @var PayrollResult $result */
        $result = $this->findTenantModelOrFail(PayrollResult::class, $result);
        $this->authorizeRoleScopedRecord($request, RolePageScopeResolver::MODULE_PAYSLIPS, $result);
        $payslip = $viewService->payload($result);

        PayrollExport::query()->create([
            'organization_id' => $result->organization_id,
            'payroll_period_id' => $result->payroll_period_id,
            'payroll_run_id' => $result->payroll_run_id,
            'period_start' => $result->run?->period?->period_start,
            'period_end' => $result->run?->period?->period_end,
            'export_version' => sprintf('payslip-%s-%s', $result->id, now()->format('YmdHis')),
            'status' => 'EXPORTED',
            'exported_at' => now(),
            'file_reference' => sprintf('payroll/payslips/%s-%s.pdf', $result->id, now()->format('YmdHis')),
            'export_type' => 'PAYSLIP',
            'generated_by' => $request->user()?->id,
            'notes' => 'Generated payroll payslip PDF.',
            'summary_json' => [
                'payroll_result_id' => $result->id,
                'net_pay' => (float) $result->net_pay,
            ],
        ]);

        $auditLogger->logCustom('download', $result, [
            'module' => 'payroll',
            'category' => 'communication',
            'description' => 'Downloaded a payslip PDF.',
            'organization_id' => $result->organization_id,
            'metadata' => [
                'payroll_result_id' => $result->id,
                'period_code' => $result->run?->period?->code,
                'period_name' => $result->run?->period?->name,
            ],
        ]);

        return $pdfService->render($result)->download($viewService->filename($result));
    }

    private function latestDeliveryStatusSubquery(string $channel): \Illuminate\Database\Eloquent\Builder
    {
        return PayslipDelivery::query()
            ->select('status')
            ->whereColumn('payroll_result_id', 'payroll_results.id')
            ->where('channel', $channel)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(1);
    }

    private function latestDeliverySentAtSubquery(string $channel): \Illuminate\Database\Eloquent\Builder
    {
        return PayslipDelivery::query()
            ->select('sent_at')
            ->whereColumn('payroll_result_id', 'payroll_results.id')
            ->where('channel', $channel)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(1);
    }

    private function applyDeliveryStatusFilter($query, string $channel, string $status): void
    {
        if ($status === 'NOT_SENT') {
            $query->whereDoesntHave('deliveries', fn ($deliveryQuery) => $deliveryQuery->where('channel', $channel));

            return;
        }

        $query->whereRaw(
            '(select status from payslip_deliveries where payroll_result_id = payroll_results.id and channel = ? order by created_at desc, id desc limit 1) = ?',
            [$channel, $status]
        );
    }
}
