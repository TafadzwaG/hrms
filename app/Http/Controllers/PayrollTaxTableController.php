<?php

namespace App\Http\Controllers;

use App\Models\PayrollTaxSetting;
use App\Models\PayrollTaxTable;
use App\Support\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Where a payroll specialist enters and verifies the figures PAYE depends on:
 * the tax bands, the AIDS Levy rate, the tax credits and the tax-free bonus amount.
 *
 * System-wide rows (organization_id null) can only be changed by a super admin. When
 * anyone else saves a change to one, it is stored as their organization's own row,
 * which then takes precedence for that organization only.
 */
class PayrollTaxTableController extends Controller
{
    public function index(): Response
    {
        $tenantId = $this->tenantId();
        $ownedOrSystem = function ($query) use ($tenantId): void {
            $query->whereNull('organization_id');

            if ($tenantId) {
                $query->orWhere('organization_id', $tenantId);
            }
        };

        $tables = PayrollTaxTable::query()
            ->with('bands')
            ->where($ownedOrSystem)
            ->orderBy('currency')
            ->orderByRaw("case pay_frequency when 'ANNUAL' then 1 when 'MONTHLY' then 2 when 'FORTNIGHTLY' then 3 when 'BI_WEEKLY' then 4 else 5 end")
            ->orderByDesc('effective_from')
            ->orderByRaw('organization_id is null')
            ->get()
            ->map(fn (PayrollTaxTable $table) => [
                'id' => $table->id,
                'scope' => $table->organization_id ? 'ORGANIZATION' : 'SYSTEM',
                'name' => $table->name,
                'currency' => $table->currency,
                'pay_frequency' => $table->pay_frequency,
                'effective_from' => optional($table->effective_from)->toDateString(),
                'effective_to' => optional($table->effective_to)->toDateString(),
                'aids_levy_percent' => (float) $table->aids_levy_percent,
                'source' => $table->source,
                'verified_at' => optional($table->verified_at)->toDateTimeString(),
                'bands' => $table->bands->map(fn ($band) => [
                    'lower_bound' => (float) $band->lower_bound,
                    'upper_bound' => $band->upper_bound !== null ? (float) $band->upper_bound : null,
                    'rate_percent' => (float) $band->rate_percent,
                ])->values(),
            ]);

        $settings = PayrollTaxSetting::query()
            ->where($ownedOrSystem)
            ->orderBy('currency')
            ->orderByDesc('effective_from')
            ->orderByRaw('organization_id is null')
            ->get()
            ->map(fn (PayrollTaxSetting $setting) => [
                'id' => $setting->id,
                'scope' => $setting->organization_id ? 'ORGANIZATION' : 'SYSTEM',
                'currency' => $setting->currency,
                'effective_from' => optional($setting->effective_from)->toDateString(),
                'effective_to' => optional($setting->effective_to)->toDateString(),
                'bonus_tax_free_amount' => $setting->bonus_tax_free_amount !== null ? (float) $setting->bonus_tax_free_amount : null,
                'elderly_credit_annual' => $setting->elderly_credit_annual !== null ? (float) $setting->elderly_credit_annual : null,
                'blind_credit_annual' => $setting->blind_credit_annual !== null ? (float) $setting->blind_credit_annual : null,
                'disabled_credit_annual' => $setting->disabled_credit_annual !== null ? (float) $setting->disabled_credit_annual : null,
                'medical_credit_percent' => (float) $setting->medical_credit_percent,
                'retrenchment_exempt_percent' => $setting->retrenchment_exempt_percent !== null ? (float) $setting->retrenchment_exempt_percent : null,
                'retrenchment_exempt_minimum' => $setting->retrenchment_exempt_minimum !== null ? (float) $setting->retrenchment_exempt_minimum : null,
                'retrenchment_exempt_cap' => $setting->retrenchment_exempt_cap !== null ? (float) $setting->retrenchment_exempt_cap : null,
                'source' => $setting->source,
                'verified_at' => optional($setting->verified_at)->toDateTimeString(),
            ]);

        return Inertia::render('Payroll/TaxTables/Index', [
            'tables' => $tables,
            'settings' => $settings,
            'currencies' => collect(config('payroll.currencies', []))->pluck('code')->map(fn ($code) => strtoupper((string) $code))->values(),
            'frequencies' => ['ANNUAL', ...config('payroll.frequencies', [])],
            'canEditSystem' => (bool) request()->user()?->isSuperAdmin(),
        ]);
    }

    public function storeTable(Request $request, AuditLogger $auditLogger): RedirectResponse
    {
        $data = $this->validateTable($request);

        $table = DB::transaction(function () use ($data, $request) {
            $table = PayrollTaxTable::query()->create([
                'organization_id' => $this->scopeForNewRow($request),
                ...$this->tableAttributes($data, $request),
            ]);
            $this->replaceBands($table, $data['bands']);

            return $table;
        });

        $this->audit($auditLogger, 'tax_table_created', $table, $data);

        return back()->with('success', 'Tax table created successfully.');
    }

    public function updateTable(Request $request, int $table, AuditLogger $auditLogger): RedirectResponse
    {
        $existing = $this->findTable($table);
        $data = $this->validateTable($request);
        $inPlace = $existing->organization_id !== null || $request->user()?->isSuperAdmin();

        $saved = DB::transaction(function () use ($existing, $data, $request, $inPlace) {
            if ($inPlace) {
                $existing->update($this->tableAttributes($data, $request));
                $saved = $existing;
            } else {
                // A system table edited by an organization user becomes that organization's own table.
                $saved = PayrollTaxTable::query()->create([
                    'organization_id' => $this->tenantId(),
                    ...$this->tableAttributes($data, $request),
                ]);
            }

            $this->replaceBands($saved, $data['bands']);

            return $saved;
        });

        $this->audit($auditLogger, $inPlace ? 'tax_table_updated' : 'tax_table_overridden', $saved, $data);

        return back()->with('success', $inPlace
            ? 'Tax table updated successfully.'
            : 'Saved as a tax table for your organization. It now takes precedence over the system table.');
    }

    public function destroyTable(int $table, AuditLogger $auditLogger): RedirectResponse
    {
        $existing = $this->findTable($table);

        if ($existing->organization_id === null && ! request()->user()?->isSuperAdmin()) {
            throw ValidationException::withMessages(['table' => 'System tax tables can only be removed by a super admin.']);
        }

        $this->audit($auditLogger, 'tax_table_deleted', $existing, ['name' => $existing->name]);
        $existing->delete();

        return back()->with('success', 'Tax table removed successfully.');
    }

    public function storeSetting(Request $request, AuditLogger $auditLogger): RedirectResponse
    {
        $data = $this->validateSetting($request);
        $setting = PayrollTaxSetting::query()->create([
            'organization_id' => $this->scopeForNewRow($request),
            ...$this->settingAttributes($data, $request),
        ]);

        $this->audit($auditLogger, 'tax_setting_created', $setting, $data);

        return back()->with('success', 'Tax credits and bonus amounts saved successfully.');
    }

    public function updateSetting(Request $request, int $setting, AuditLogger $auditLogger): RedirectResponse
    {
        $existing = PayrollTaxSetting::query()
            ->where(function ($query): void {
                $query->whereNull('organization_id')->orWhere('organization_id', $this->tenantId());
            })
            ->findOrFail($setting);
        $data = $this->validateSetting($request);
        $inPlace = $existing->organization_id !== null || $request->user()?->isSuperAdmin();

        if ($inPlace) {
            $existing->update($this->settingAttributes($data, $request));
            $saved = $existing;
        } else {
            $saved = PayrollTaxSetting::query()->create([
                'organization_id' => $this->tenantId(),
                ...$this->settingAttributes($data, $request),
            ]);
        }

        $this->audit($auditLogger, $inPlace ? 'tax_setting_updated' : 'tax_setting_overridden', $saved, $data);

        return back()->with('success', $inPlace
            ? 'Tax credits and bonus amounts updated successfully.'
            : 'Saved for your organization. These amounts now take precedence over the system ones.');
    }

    private function findTable(int $id): PayrollTaxTable
    {
        return PayrollTaxTable::query()
            ->where(function ($query): void {
                $query->whereNull('organization_id')->orWhere('organization_id', $this->tenantId());
            })
            ->findOrFail($id);
    }

    private function scopeForNewRow(Request $request): ?int
    {
        // Only a super admin may create a system-wide row, and only by asking for one.
        if ($request->boolean('system_wide') && $request->user()?->isSuperAdmin()) {
            return null;
        }

        abort_unless($this->tenantId(), 403, 'An active organization is required.');

        return $this->tenantId();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateTable(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'currency' => ['required', 'string', 'max:8'],
            'pay_frequency' => ['required', Rule::in(['ANNUAL', ...config('payroll.frequencies', [])])],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'aids_levy_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'source' => ['nullable', 'string', 'max:255'],
            'verified' => ['nullable', 'boolean'],
            'bands' => ['required', 'array', 'min:1', 'max:20'],
            'bands.*.upper_bound' => ['nullable', 'numeric', 'min:0'],
            'bands.*.rate_percent' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        // Bands run from zero upward with no gaps: each starts where the last one ended,
        // and only the final band is open-ended.
        $lower = 0.0;
        $last = count($data['bands']) - 1;

        foreach ($data['bands'] as $index => $band) {
            $upper = $band['upper_bound'] ?? null;
            $upper = $upper === '' ? null : $upper;

            if ($index === $last && $upper !== null) {
                throw ValidationException::withMessages(['bands' => 'Leave the upper limit of the last band empty so it covers all higher income.']);
            }

            if ($index !== $last && ($upper === null || (float) $upper <= $lower)) {
                throw ValidationException::withMessages(['bands' => 'Each band needs an upper limit higher than the band before it.']);
            }

            $data['bands'][$index] = [
                'lower_bound' => $lower,
                'upper_bound' => $upper !== null ? (float) $upper : null,
                'rate_percent' => (float) $band['rate_percent'],
                'sort_order' => $index + 1,
            ];
            $lower = (float) $upper;
        }

        return $data;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function tableAttributes(array $data, Request $request): array
    {
        return [
            'name' => $data['name'],
            'currency' => strtoupper($data['currency']),
            'pay_frequency' => $data['pay_frequency'],
            'effective_from' => $data['effective_from'],
            'effective_to' => $data['effective_to'] ?? null,
            'aids_levy_percent' => $data['aids_levy_percent'],
            'source' => $data['source'] ?? null,
            ...$this->verification((bool) ($data['verified'] ?? false), $request),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validateSetting(Request $request): array
    {
        return $request->validate([
            'currency' => ['required', 'string', 'max:8'],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'bonus_tax_free_amount' => ['nullable', 'numeric', 'min:0'],
            'elderly_credit_annual' => ['nullable', 'numeric', 'min:0'],
            'blind_credit_annual' => ['nullable', 'numeric', 'min:0'],
            'disabled_credit_annual' => ['nullable', 'numeric', 'min:0'],
            'medical_credit_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'retrenchment_exempt_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'retrenchment_exempt_minimum' => ['nullable', 'numeric', 'min:0'],
            'retrenchment_exempt_cap' => ['nullable', 'numeric', 'min:0'],
            'source' => ['nullable', 'string', 'max:255'],
            'verified' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function settingAttributes(array $data, Request $request): array
    {
        $amount = fn (string $key) => ($data[$key] ?? null) === '' ? null : ($data[$key] ?? null);

        return [
            'currency' => strtoupper($data['currency']),
            'effective_from' => $data['effective_from'],
            'effective_to' => $data['effective_to'] ?? null,
            'bonus_tax_free_amount' => $amount('bonus_tax_free_amount'),
            'elderly_credit_annual' => $amount('elderly_credit_annual'),
            'blind_credit_annual' => $amount('blind_credit_annual'),
            'disabled_credit_annual' => $amount('disabled_credit_annual'),
            'medical_credit_percent' => $data['medical_credit_percent'],
            'retrenchment_exempt_percent' => $amount('retrenchment_exempt_percent'),
            'retrenchment_exempt_minimum' => $amount('retrenchment_exempt_minimum'),
            'retrenchment_exempt_cap' => $amount('retrenchment_exempt_cap'),
            'source' => $data['source'] ?? null,
            ...$this->verification((bool) ($data['verified'] ?? false), $request),
        ];
    }

    /**
     * Verification is a statement by a named person at a point in time. Any save resets it
     * to whoever is saving now; unticking the box clears it.
     *
     * @return array{verified_at: mixed, verified_by: int|null}
     */
    private function verification(bool $verified, Request $request): array
    {
        if (! $verified) {
            return ['verified_at' => null, 'verified_by' => null];
        }

        return ['verified_at' => now(), 'verified_by' => $request->user()?->id];
    }

    /**
     * @param  array<int, array<string, mixed>>  $bands
     */
    private function replaceBands(PayrollTaxTable $table, array $bands): void
    {
        $table->bands()->delete();
        $table->bands()->createMany($bands);
        $table->unsetRelation('bands');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function audit(AuditLogger $auditLogger, string $event, PayrollTaxTable|PayrollTaxSetting $model, array $data): void
    {
        $auditLogger->logCustom($event, $model, [
            'module' => 'payroll',
            'category' => 'configuration',
            'organization_id' => $this->tenantId(),
            'description' => str($event)->replace('_', ' ')->ucfirst()->toString().'.',
            'new_values' => $data,
        ]);
    }
}
