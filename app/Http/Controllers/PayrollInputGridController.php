<?php

namespace App\Http\Controllers;

use App\Models\PayCode;
use App\Models\PayrollInput;
use App\Models\PayrollInputBatch;
use App\Models\PayrollInputLayout;
use App\Models\PayrollPeriod;
use App\Support\Payroll\Inputs\PayrollInputBatchService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Spreadsheet Input: a grid of the period's employees against chosen pay codes.
 *
 * Each cell is one input with the reference GRID. Posting saves the changed cells as a
 * batch: a value creates or replaces the GRID input, an emptied cell removes it. Inputs
 * captured in other ways are left alone and shown beside the cell for reference.
 */
class PayrollInputGridController extends Controller
{
    public const REFERENCE = 'GRID';

    public function show(Request $request, int $period, PayrollInputBatchService $batches): Response
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $eligible = $this->eligiblePayCodes()->get(['id', 'code', 'description', 'type']);

        $layout = $request->integer('layout') ? PayrollInputLayout::query()->find($request->integer('layout')) : null;
        $chosen = collect($layout?->pay_code_ids ?? $request->input('codes', []))
            ->map(fn ($id) => (int) $id)
            ->filter(fn ($id) => $eligible->contains('id', $id))
            ->unique()
            ->values();
        $columns = $chosen->map(fn ($id) => $eligible->firstWhere('id', $id))->values();

        $profiles = $batches->payrollProfiles($period);
        $inputs = PayrollInput::query()
            ->where('payroll_period_id', $period->id)
            ->whereIn('pay_code_id', $chosen)
            ->get()
            ->groupBy(fn (PayrollInput $input) => $input->employee_id.'|'.$input->pay_code_id);

        $rows = $profiles->map(function ($profile) use ($columns, $inputs) {
            $cells = [];
            $other = [];

            foreach ($columns as $code) {
                $group = $inputs->get($profile->employee_id.'|'.$code->id, collect());
                $grid = $group->firstWhere('reference', self::REFERENCE);
                $cells[$code->id] = $grid ? $grid->resolvedAmount() : null;
                $other[$code->id] = round((float) $group->where('reference', '!=', self::REFERENCE)->sum(fn (PayrollInput $input) => $input->resolvedAmount()), 2);
            }

            return [
                'employee_id' => $profile->employee_id,
                'staff_number' => $profile->employee?->staff_number,
                'full_name' => $profile->employee?->full_name,
                'department' => $profile->employee?->orgUnit?->name,
                'cost_centre' => $profile->cost_centre,
                'cells' => $cells,
                'other' => $other,
            ];
        })->values();

        return Inertia::render('Payroll/Inputs/Grid', [
            'period' => [
                'id' => $period->id,
                'code' => $period->code,
                'name' => $period->name,
                'status' => $period->status,
                'editable' => ! in_array($period->status, ['APPROVED', 'CLOSED'], true),
            ],
            'payCodes' => $eligible->values(),
            'columns' => $columns,
            'rows' => $rows,
            'layouts' => PayrollInputLayout::query()->orderBy('name')->get(['id', 'name', 'pay_code_ids'])->values(),
            'activeLayoutId' => $layout?->id,
        ]);
    }

    public function post(Request $request, int $period, PayrollInputBatchService $batches): RedirectResponse
    {
        /** @var PayrollPeriod $period */
        $period = $this->findTenantModelOrFail(PayrollPeriod::class, $period);
        $validated = $request->validate([
            'cells' => ['required', 'array', 'min:1', 'max:5000'],
            'cells.*.employee_id' => ['required', 'integer'],
            'cells.*.pay_code_id' => ['required', 'integer'],
            'cells.*.amount' => ['nullable', 'numeric', 'min:0'],
            'control_total' => ['nullable', 'numeric'],
            'control_count' => ['nullable', 'integer', 'min:0'],
            'accept_mismatch' => ['nullable', 'boolean'],
        ]);

        $payCodeIds = $this->eligiblePayCodes()->pluck('id');
        $employeeIds = $batches->payrollProfiles($period)->pluck('employee_id');
        $cells = collect($validated['cells']);

        if ($cells->contains(fn ($cell) => ! $payCodeIds->contains((int) $cell['pay_code_id']) || ! $employeeIds->contains((int) $cell['employee_id']))) {
            throw ValidationException::withMessages(['cells' => 'Some cells are for an employee outside this period\'s payroll or a pay code that cannot be entered here. Reload the grid and try again.']);
        }

        $cleared = 0;

        $batch = $batches->post($period, $request->user(), [
            'source' => PayrollInputBatch::SOURCE_GRID,
            'description' => 'Spreadsheet input: '.$cells->count().' cell(s) changed',
            'control_total' => $validated['control_total'] ?? null,
            'control_count' => $validated['control_count'] ?? null,
            'accept_mismatch' => (bool) ($validated['accept_mismatch'] ?? false),
        ], function (PayrollInputBatch $batch) use ($cells, $period, $batches, &$cleared): Collection {
            $written = collect();

            foreach ($cells as $cell) {
                $keys = [
                    'organization_id' => $period->organization_id,
                    'payroll_period_id' => $period->id,
                    'employee_id' => (int) $cell['employee_id'],
                    'pay_code_id' => (int) $cell['pay_code_id'],
                    'reference' => self::REFERENCE,
                ];
                $amount = $cell['amount'] ?? null;

                if ($amount === null || $amount === '') {
                    $existing = PayrollInput::query()->where($keys)->first();

                    if ($existing) {
                        $batches->remove($batch, $existing);
                        $cleared++;
                    }

                    continue;
                }

                $written->push($batches->upsert($batch, $keys, [
                    'input_mode' => 'FIXED',
                    'amount' => (float) $amount,
                    'quantity' => null,
                    'rate' => null,
                    'source' => 'GRID',
                    'updated_by' => request()->user()?->id,
                    'created_by' => request()->user()?->id,
                ]));
            }

            return $written;
        });

        return back()->with('success', "Batch {$batch->batch_number}: {$batch->entered_count} cell(s) posted totalling "
            .number_format((float) $batch->entered_total, 2).($cleared > 0 ? ", {$cleared} cleared" : '').'.');
    }

    public function storeLayout(Request $request): RedirectResponse
    {
        $tenantId = $this->tenantId();
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('payroll_input_layouts', 'name')->where(fn ($query) => $query->where('organization_id', $tenantId))],
            'pay_code_ids' => ['required', 'array', 'min:1', 'max:30'],
            'pay_code_ids.*' => ['integer', Rule::in($this->eligiblePayCodes()->pluck('id')->all())],
        ]);

        $layout = PayrollInputLayout::query()->create([
            'organization_id' => $tenantId,
            'name' => $validated['name'],
            'pay_code_ids' => array_values(array_unique(array_map('intval', $validated['pay_code_ids']))),
            'created_by' => $request->user()?->id,
        ]);

        return back()->with('success', "Layout \"{$layout->name}\" saved.");
    }

    public function destroyLayout(int $layout): RedirectResponse
    {
        /** @var PayrollInputLayout $layout */
        $layout = $this->findTenantModelOrFail(PayrollInputLayout::class, $layout);
        $layout->delete();

        return back()->with('success', 'Layout removed.');
    }

    /**
     * Pay codes a person may type a value for: not the ones HRX calculates itself.
     */
    private function eligiblePayCodes(): Builder
    {
        return PayCode::query()
            ->where('active', true)
            ->whereNotIn('category', ['TAX', 'STATUTORY'])
            ->where('code', '!=', 'BASIC')
            // Hour and unit codes are paid at a rate, so they are captured in Hourly input.
            ->where('unit', 'AMOUNT')
            ->where('system_generated', false)
            ->orderBy('sort_order')
            ->orderBy('code');
    }
}
