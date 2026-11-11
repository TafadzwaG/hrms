<?php

namespace App\Support\Payroll\Inputs;

use App\Models\EmployeePayrollProfile;
use App\Models\PayrollInput;
use App\Models\PayrollInputBatch;
use App\Models\PayrollPeriod;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Shared rules for inputs posted in groups: imports, bulk actions and the grid.
 *
 * Every group becomes a numbered batch. When control totals are given, the batch is
 * only posted if the entered amount and row count match them, unless the user chose to
 * post anyway. A posted batch can be reversed while the period is still open.
 */
class PayrollInputBatchService
{
    /** Attributes restored when a batch is reversed. */
    private const RESTORABLE = ['organization_id', 'payroll_period_id', 'employee_id', 'pay_code_id', 'payroll_input_batch_id', 'input_mode', 'amount', 'quantity', 'rate', 'source', 'reference', 'notes', 'created_by', 'updated_by'];

    /** @var array<int, array<int, array<string, mixed>>> undo steps per batch id */
    private array $undo = [];

    public function __construct(private readonly AuditLogger $auditLogger) {}

    /**
     * Create or update the input identified by $keys as part of the batch, remembering
     * what was there before so the batch can be reversed exactly.
     *
     * @param  array<string, mixed>  $keys
     * @param  array<string, mixed>  $values
     */
    public function upsert(PayrollInputBatch $batch, array $keys, array $values): PayrollInput
    {
        $existing = PayrollInput::query()->where($keys)->first();

        if ($existing) {
            $this->undo[$batch->id][] = ['op' => 'updated', 'id' => $existing->id, 'before' => $existing->only(self::RESTORABLE)];
            $existing->update([...$values, 'payroll_input_batch_id' => $batch->id]);

            return $existing;
        }

        $input = PayrollInput::query()->create([...$keys, ...$values, 'payroll_input_batch_id' => $batch->id]);
        $this->undo[$batch->id][] = ['op' => 'created', 'id' => $input->id];

        return $input;
    }

    /**
     * Delete an input as part of the batch, keeping a copy so a reversal can restore it.
     */
    public function remove(PayrollInputBatch $batch, PayrollInput $input): void
    {
        $this->undo[$batch->id][] = ['op' => 'deleted', 'id' => $input->id, 'before' => $input->only(self::RESTORABLE)];
        $input->delete();
    }

    public function ensurePeriodOpen(PayrollPeriod $period, string $field = 'payroll_period_id'): void
    {
        if (in_array($period->status, ['APPROVED', 'CLOSED'], true)) {
            throw ValidationException::withMessages([
                $field => 'Inputs cannot be changed once the payroll period is approved or closed. Reopen the period first.',
            ]);
        }
    }

    /**
     * Run $post inside a transaction with a new batch, then check control totals.
     *
     * $post receives the batch and returns the inputs it wrote (for INSERT) or removed
     * (for DELETE), as a collection of PayrollInput or ['amount' => float] items.
     *
     * @param  array{source: string, action?: string, description?: string|null, control_total?: float|string|null, control_count?: int|string|null, accept_mismatch?: bool, metadata?: array<string, mixed>}  $options
     * @param  callable(PayrollInputBatch): Collection<int, mixed>  $post
     */
    public function post(PayrollPeriod $period, User $actor, array $options, callable $post): PayrollInputBatch
    {
        $this->ensurePeriodOpen($period);

        $controlTotal = $this->blankToNull($options['control_total'] ?? null);
        $controlCount = $this->blankToNull($options['control_count'] ?? null);

        $batch = DB::transaction(function () use ($period, $actor, $options, $post, $controlTotal, $controlCount) {
            $batch = PayrollInputBatch::query()->create([
                'organization_id' => $period->organization_id,
                'payroll_period_id' => $period->id,
                'batch_number' => $this->nextNumber((int) $period->organization_id),
                'source' => $options['source'],
                'action' => $options['action'] ?? 'INSERT',
                'description' => $options['description'] ?? null,
                'control_total' => $controlTotal,
                'control_count' => $controlCount,
                'status' => PayrollInputBatch::STATUS_POSTED,
                'metadata' => $options['metadata'] ?? null,
                'created_by' => $actor->id,
            ]);

            $rows = $post($batch);
            $enteredTotal = round((float) $rows->sum(fn ($row) => $row instanceof PayrollInput ? $row->resolvedAmount() : (float) ($row['amount'] ?? 0)), 2);
            $enteredCount = $rows->count();

            $differences = [];

            if ($controlTotal !== null && abs($enteredTotal - (float) $controlTotal) > 0.004) {
                $differences[] = sprintf('amounts total %s, but the control total is %s (difference %s)',
                    number_format($enteredTotal, 2), number_format((float) $controlTotal, 2), number_format($enteredTotal - (float) $controlTotal, 2));
            }

            if ($controlCount !== null && $enteredCount !== (int) $controlCount) {
                $differences[] = sprintf('%d rows were entered, but the control count is %d', $enteredCount, (int) $controlCount);
            }

            if ($differences !== [] && ! ($options['accept_mismatch'] ?? false)) {
                // Roll back: nothing is posted until the totals agree or the user accepts the difference.
                throw ValidationException::withMessages([
                    'control_total' => 'Nothing was posted. The batch does not match its control totals: '.implode('; ', $differences).'. Correct the entries or the control totals, or tick "Post even if totals differ".',
                ]);
            }

            $batch->update([
                'entered_total' => $enteredTotal,
                'entered_count' => $enteredCount,
                'metadata' => [
                    ...($batch->metadata ?? []),
                    'control_differences' => $differences,
                    'undo' => $this->undo[$batch->id] ?? [],
                ],
            ]);
            unset($this->undo[$batch->id]);

            return $batch;
        });

        $this->auditLogger->logCustom('input_batch_posted', $period, [
            'actor' => $actor,
            'module' => 'payroll',
            'category' => 'bulk',
            'organization_id' => $period->organization_id,
            'description' => "Posted payroll input batch {$batch->batch_number} ({$batch->source}, {$batch->action}).",
            'new_values' => [
                'batch_number' => $batch->batch_number,
                'entered_total' => (float) $batch->entered_total,
                'entered_count' => $batch->entered_count,
                'control_total' => $batch->control_total !== null ? (float) $batch->control_total : null,
                'control_count' => $batch->control_count,
                'control_differences' => $batch->metadata['control_differences'] ?? [],
            ],
        ]);

        return $batch;
    }

    /**
     * Undo a batch: inputs it created are removed, inputs it changed get their earlier
     * values back, and inputs it deleted are restored. Refused if any of those inputs has
     * been changed since, so a reversal never overwrites later work.
     */
    public function reverse(PayrollInputBatch $batch, User $actor): int
    {
        $period = $batch->period;
        $this->ensurePeriodOpen($period, 'batch');

        if ($batch->status !== PayrollInputBatch::STATUS_POSTED) {
            throw ValidationException::withMessages(['batch' => 'This batch has already been reversed.']);
        }

        $steps = collect($batch->metadata['undo'] ?? []);
        $touched = $steps->whereIn('op', ['created', 'updated'])->pluck('id');
        $current = PayrollInput::query()->whereIn('id', $touched)->get()->keyBy('id');

        $changed = $touched->filter(fn ($id) => ! $current->has($id) || (int) $current[$id]->payroll_input_batch_id !== $batch->id);

        if ($changed->isNotEmpty()) {
            throw ValidationException::withMessages([
                'batch' => "{$changed->count()} input(s) from this batch were changed or deleted after it was posted. Reverse any later batch first, or correct those inputs by hand.",
            ]);
        }

        $affected = DB::transaction(function () use ($batch, $actor, $steps, $current) {
            foreach ($steps->reverse() as $step) {
                match ($step['op']) {
                    'created' => $current[$step['id']]->delete(),
                    'updated' => $current[$step['id']]->update($step['before']),
                    'deleted' => PayrollInput::query()->create($step['before']),
                };
            }

            $batch->update([
                'status' => PayrollInputBatch::STATUS_REVERSED,
                'reversed_at' => now(),
                'reversed_by' => $actor->id,
            ]);

            return $steps->count();
        });

        $this->auditLogger->logCustom('input_batch_reversed', $period, [
            'actor' => $actor,
            'module' => 'payroll',
            'category' => 'bulk',
            'organization_id' => $period->organization_id,
            'description' => "Reversed payroll input batch {$batch->batch_number}.",
            'new_values' => ['batch_number' => $batch->batch_number, 'inputs_restored' => $affected],
        ]);

        return $affected;
    }

    /**
     * Employees who will be in this period's payroll run: an active profile effective at
     * the period end, optionally narrowed to departments, cost centres or named employees.
     *
     * @param  array{org_unit_ids?: array<int, int|string>, cost_centres?: array<int, string>, employee_ids?: array<int, int|string>}  $filters
     * @return Collection<int, EmployeePayrollProfile>
     */
    public function payrollProfiles(PayrollPeriod $period, array $filters = []): Collection
    {
        $orgUnits = collect($filters['org_unit_ids'] ?? [])->filter()->map(fn ($id) => (int) $id)->values();
        $costCentres = collect($filters['cost_centres'] ?? [])->filter()->map(fn ($value) => (string) $value)->values();
        $employees = collect($filters['employee_ids'] ?? [])->filter()->map(fn ($id) => (int) $id)->values();

        return EmployeePayrollProfile::query()
            ->forOrganization((int) $period->organization_id)
            ->with(['employee.orgUnit'])
            ->where('active', true)
            ->where('employment_status', 'ACTIVE')
            ->effectiveFor(optional($period->period_end)->toDateString() ?: now()->toDateString())
            ->whereHas('employee', fn ($query) => $query->where('status', 'ACTIVE'))
            ->orderByDesc('effective_from')
            ->get()
            ->unique('employee_id')
            ->filter(function (EmployeePayrollProfile $profile) use ($orgUnits, $costCentres, $employees) {
                if ($orgUnits->isNotEmpty() && ! $orgUnits->contains((int) $profile->employee?->org_unit_id)) {
                    return false;
                }

                if ($costCentres->isNotEmpty() && ! $costCentres->contains((string) $profile->cost_centre)) {
                    return false;
                }

                return $employees->isEmpty() || $employees->contains((int) $profile->employee_id);
            })
            ->sortBy(fn (EmployeePayrollProfile $profile) => $profile->employee?->staff_number)
            ->values();
    }

    private function nextNumber(int $organizationId): string
    {
        $count = PayrollInputBatch::query()->withoutGlobalScopes()->where('organization_id', $organizationId)->lockForUpdate()->count();

        return sprintf('B-%05d', $count + 1);
    }

    private function blankToNull(mixed $value): mixed
    {
        return $value === '' || $value === null ? null : $value;
    }
}
