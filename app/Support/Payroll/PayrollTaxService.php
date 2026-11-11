<?php

namespace App\Support\Payroll;

use App\Models\PayrollTaxTable;

class PayrollTaxService
{
    /** @var array<string, PayrollTaxTable|null> */
    private array $resolved = [];

    /**
     * PAYE and AIDS Levy for one pay period.
     *
     * Uses the dated tax table for the currency, pay frequency and date. When no table
     * exists (for example a currency with no table loaded yet), it falls back to the
     * legacy bands in config/payroll.php and says so in 'fallback'.
     *
     * @return array{paye: float, aids_levy: float, aids_levy_percent: float, tax_table_id: int|null, tax_table: string|null, verified: bool, fallback: bool}
     */
    public function calculate(
        float $taxableIncome,
        string $currency,
        string $frequency,
        string $date,
        ?int $organizationId = null,
    ): array {
        $table = $this->resolveTable($currency, $frequency, $date, $organizationId);

        if (! $table) {
            $paye = $this->calculatePaye($taxableIncome);
            $levyPercent = (float) config('payroll.tax.aids_levy_percent', 3);

            return [
                'paye' => $paye,
                'aids_levy' => round($paye * $levyPercent / 100, 2),
                'aids_levy_percent' => $levyPercent,
                'tax_table_id' => null,
                'tax_table' => null,
                'verified' => false,
                'fallback' => true,
            ];
        }

        $paye = $this->progressiveTax(
            $taxableIncome,
            $table->bands->map(fn ($band) => [
                'lower' => (float) $band->lower_bound,
                'upper' => $band->upper_bound !== null ? (float) $band->upper_bound : null,
                'rate' => (float) $band->rate_percent / 100,
            ])->all(),
        );
        $levyPercent = (float) $table->aids_levy_percent;

        return [
            'paye' => $paye,
            'aids_levy' => round($paye * $levyPercent / 100, 2),
            'aids_levy_percent' => $levyPercent,
            'tax_table_id' => $table->id,
            'tax_table' => $table->name,
            'verified' => $table->verified_at !== null,
            'fallback' => false,
        ];
    }

    public function resolveTable(string $currency, string $frequency, string $date, ?int $organizationId = null): ?PayrollTaxTable
    {
        $key = implode('|', [$currency, $frequency, $date, $organizationId ?? 'system']);

        if (array_key_exists($key, $this->resolved)) {
            return $this->resolved[$key];
        }

        // An organization's own table wins over the system-wide one; then the latest effective date.
        return $this->resolved[$key] = PayrollTaxTable::query()
            ->with('bands')
            ->where('currency', strtoupper($currency))
            ->where('pay_frequency', strtoupper($frequency))
            ->whereDate('effective_from', '<=', $date)
            ->where(function ($query) use ($date): void {
                $query->whereNull('effective_to')->orWhereDate('effective_to', '>=', $date);
            })
            ->where(function ($query) use ($organizationId): void {
                $query->whereNull('organization_id');

                if ($organizationId) {
                    $query->orWhere('organization_id', $organizationId);
                }
            })
            ->orderByRaw('organization_id is null')
            ->orderByDesc('effective_from')
            ->orderByDesc('id')
            ->first();
    }

    /**
     * Legacy calculation from the bands in config/payroll.php. Kept only as the
     * fallback for a currency or frequency that has no dated tax table.
     */
    public function calculatePaye(float $taxableIncome): float
    {
        $bands = [];
        $lower = 0.0;

        foreach (config('payroll.tax.bands', []) as $band) {
            $rateValue = (float) ($band['rate'] ?? 0);
            $upper = $band['up_to'] ?? null;

            $bands[] = [
                'lower' => $lower,
                'upper' => $upper !== null ? (float) $upper : null,
                'rate' => $rateValue > 1 ? $rateValue / 100 : $rateValue,
            ];

            if ($upper === null) {
                break;
            }

            $lower = (float) $upper;
        }

        return $this->progressiveTax($taxableIncome, $bands);
    }

    /**
     * @param  array<int, array{lower: float, upper: float|null, rate: float}>  $bands
     */
    private function progressiveTax(float $taxableIncome, array $bands): float
    {
        $income = max(0, $taxableIncome);
        $tax = 0.0;

        foreach ($bands as $band) {
            if ($income <= $band['lower']) {
                break;
            }

            $ceiling = $band['upper'] === null ? $income : min($income, $band['upper']);
            $tax += ($ceiling - $band['lower']) * $band['rate'];
        }

        return round($tax, 2);
    }
}
