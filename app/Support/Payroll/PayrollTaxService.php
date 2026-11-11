<?php

namespace App\Support\Payroll;

use App\Models\PayrollTaxSetting;
use App\Models\PayrollTaxTable;

class PayrollTaxService
{
    public const METHOD_NON_FDS = 'NON_FDS';

    public const METHOD_FDS_AVERAGE = 'FDS_AVERAGE';

    public const METHOD_FDS_FORECAST = 'FDS_FORECAST';

    public const METHODS = [self::METHOD_NON_FDS, self::METHOD_FDS_AVERAGE, self::METHOD_FDS_FORECAST];

    /** @var array<string, PayrollTaxTable|null> */
    private array $resolved = [];

    /** @var array<string, PayrollTaxSetting|null> */
    private array $resolvedSettings = [];

    /**
     * Work out one employee's PAYE and AIDS Levy for a pay period under their tax method.
     *
     * NON_FDS taxes the period on its own, with no credits (they are claimed from ZIMRA at
     * assessment). The two FDS methods are cumulative: they use year-to-date figures from
     * the tax ledger, so the tax for the year balances by the last period.
     *
     * An employee on an FDS method is taxed as NON_FDS for the period, with a warning, when
     * FDS cannot be applied: the pay is not monthly, there is no annual tax table, or the
     * ledger does not cover every earlier month of the tax year (a mid-year joiner, a
     * suspension, or missing history).
     *
     * @param  array{currency: string, frequency: string, date: string, organization_id: int|null, tax_method: string, credit_elderly?: bool, credit_blind?: bool, credit_disabled?: bool, regular_taxable: float, irregular: float, bonus: float, medical: float}  $input
     * @param  array{periods?: int|float, regular_taxable?: float, irregular_taxable?: float, bonus_exempt?: float, medical?: float, credits?: float, paye?: float, aids_levy?: float}  $ytd
     * @return array<string, mixed>
     */
    public function assess(array $input, array $ytd = []): array
    {
        $currency = strtoupper($input['currency']);
        $frequency = strtoupper($input['frequency']);
        $date = $input['date'];
        $organizationId = $input['organization_id'] ?? null;
        $requested = in_array($input['tax_method'], self::METHODS, true) ? $input['tax_method'] : self::METHOD_NON_FDS;
        $warnings = [];

        $settings = $this->resolveSettings($currency, $date, $organizationId);

        // The tax-free bonus amount is per tax year, so only what is left of it applies now.
        $bonus = max(0, (float) $input['bonus']);
        $threshold = (float) ($settings?->bonus_tax_free_amount ?? 0);
        $bonusExempt = round(min($bonus, max(0, $threshold - (float) ($ytd['bonus_exempt'] ?? 0))), 2);

        if ($bonus > 0 && $settings?->bonus_tax_free_amount === null) {
            $warnings[] = 'A bonus was taxed in full because the tax-free bonus amount has not been entered in the tax settings.';
        }

        $regular = round((float) $input['regular_taxable'], 2);
        $irregularTaxable = round(max(0, (float) $input['irregular']) + $bonus - $bonusExempt, 2);
        $periodTaxable = max(0, round($regular + $irregularTaxable, 2));

        $standalone = $this->calculate($periodTaxable, $currency, $frequency, $date, $organizationId);

        if ($standalone['fallback']) {
            $warnings[] = sprintf(
                'No tax table is loaded for %s %s pay, so the legacy bands were used. Load the ZIMRA table for this currency and frequency.',
                $currency,
                strtolower(str_replace('_', ' ', $frequency)),
            );
        } elseif (! $standalone['verified']) {
            $warnings[] = sprintf('The tax table "%s" has not yet been verified against ZIMRA\'s published tables.', (string) $standalone['tax_table']);
        }

        $result = [
            'method_requested' => $requested,
            'method_applied' => self::METHOD_NON_FDS,
            'paye' => $standalone['paye'],
            'aids_levy' => $standalone['aids_levy'],
            'aids_levy_percent' => $standalone['aids_levy_percent'],
            'credits_applied' => 0.0,
            'bonus_exempt' => $bonusExempt,
            'regular_taxable' => $regular,
            'irregular_taxable' => $irregularTaxable,
            'taxable_income' => $periodTaxable,
            'standalone_paye' => $standalone['paye'],
            'standalone_aids_levy' => $standalone['aids_levy'],
            'fds_average_paye' => null,
            'fds_average_aids_levy' => null,
            'tax_table_id' => $standalone['tax_table_id'],
            'tax_table' => $standalone['tax_table'],
            'tax_table_verified' => $standalone['verified'],
            'fallback' => $standalone['fallback'],
        ];

        // --- Can FDS be applied to this employee for this period? ---
        $month = (int) date('n', strtotime($date));
        $annualTable = $frequency === 'MONTHLY' ? $this->resolveTable($currency, 'ANNUAL', $date, $organizationId) : null;
        $periodsToDate = (float) ($ytd['periods'] ?? 0);
        $blocker = match (true) {
            $frequency !== 'MONTHLY' => 'FDS is only available for monthly pay',
            $annualTable === null => "no annual tax table is loaded for {$currency}",
            abs($periodsToDate - ($month - 1)) > 0.001 => 'the tax ledger does not cover every earlier month of this tax year',
            default => null,
        };

        if ($blocker !== null) {
            if ($requested !== self::METHOD_NON_FDS) {
                $warnings[] = "Some employees on an FDS tax method were taxed as Non-FDS this period because {$blocker}.";
            }

            return [...$result, 'warnings' => $warnings];
        }

        $bands = $this->bandsOf($annualTable);
        $levyRate = (float) $annualTable->aids_levy_percent / 100;
        $periods = $month;

        $regularToDate = (float) ($ytd['regular_taxable'] ?? 0) + $regular;
        $irregularToDate = max(0, (float) ($ytd['irregular_taxable'] ?? 0) + $irregularTaxable);
        $medicalToDate = (float) ($ytd['medical'] ?? 0) + max(0, (float) $input['medical']);
        $payeToDate = (float) ($ytd['paye'] ?? 0);
        $levyToDate = (float) ($ytd['aids_levy'] ?? 0);

        // Regular income is averaged and annualised; irregular income is added at its actual amount.
        $annualRegular = max(0, $regularToDate / $periods * 12);
        $annualTaxRegular = $this->progressiveTax($annualRegular, $bands);
        $irregularTax = $this->progressiveTax($annualRegular + $irregularToDate, $bands) - $annualTaxRegular;

        // Credits for the year, and the share of them earned so far.
        $annualFixedCredits = 0.0;
        foreach (['elderly', 'blind', 'disabled'] as $kind) {
            if (empty($input["credit_{$kind}"])) {
                continue;
            }

            $amount = $settings?->getAttribute("{$kind}_credit_annual");

            if ($amount === null) {
                $warnings[] = "The {$kind} persons tax credit was not applied because its amount has not been entered in the tax settings.";

                continue;
            }

            $annualFixedCredits += (float) $amount;
        }
        $medicalRate = (float) ($settings?->medical_credit_percent ?? 50) / 100;
        $creditsToDate = $annualFixedCredits * $periods / 12 + $medicalToDate * $medicalRate;

        if ($settings && $settings->verified_at === null && ($creditsToDate > 0 || $bonusExempt > 0)) {
            $warnings[] = 'The tax credit and bonus amounts in the tax settings have not yet been verified.';
        }

        // FDS Average: tax due to date, less credits, less what has already been deducted.
        $taxToDate = $annualTaxRegular * $periods / 12 + $irregularTax;
        $liabilityToDate = max(0, $taxToDate - $creditsToDate);
        $averagePaye = round($liabilityToDate - $payeToDate, 2);
        $averageLevy = round($liabilityToDate * $levyRate - $levyToDate, 2);

        $result['fds_average_paye'] = $averagePaye;
        $result['fds_average_aids_levy'] = $averageLevy;

        if (! $annualTable->verified_at) {
            $annualWarning = sprintf('The tax table "%s" has not yet been verified against ZIMRA\'s published tables.', $annualTable->name);
        }

        if ($requested === self::METHOD_FDS_AVERAGE) {
            $result['method_applied'] = self::METHOD_FDS_AVERAGE;
            $result['paye'] = $averagePaye;
            $result['aids_levy'] = $averageLevy;
            $result['credits_applied'] = round(min($taxToDate, $creditsToDate) - (float) ($ytd['credits'] ?? 0), 2);
        }

        if ($requested === self::METHOD_FDS_FORECAST) {
            // FDS Forecast: forecast the year's tax and credits, take off what has been
            // deducted, and spread the rest evenly over the periods that remain.
            $annualTax = $annualTaxRegular + $irregularTax;
            $annualCredits = $annualFixedCredits + ($medicalToDate / $periods * 12) * $medicalRate;
            $annualLiability = max(0, $annualTax - $annualCredits);
            $remaining = 12 - ($periods - 1);

            $result['method_applied'] = self::METHOD_FDS_FORECAST;
            $result['paye'] = round(($annualLiability - $payeToDate) / $remaining, 2);
            $result['aids_levy'] = round(($annualLiability * $levyRate - $levyToDate) / $remaining, 2);
            $result['credits_applied'] = round(min($annualTax, $annualCredits) / 12, 2);
        }

        if ($requested !== self::METHOD_NON_FDS) {
            $result['tax_table_id'] = $annualTable->id;
            $result['tax_table'] = $annualTable->name;
            $result['tax_table_verified'] = $annualTable->verified_at !== null;
            $result['aids_levy_percent'] = (float) $annualTable->aids_levy_percent;

            if (isset($annualWarning)) {
                $warnings[] = $annualWarning;
            }
        }

        return [...$result, 'warnings' => array_values(array_unique($warnings))];
    }

    public function resolveSettings(string $currency, string $date, ?int $organizationId = null): ?PayrollTaxSetting
    {
        $key = implode('|', [$currency, $date, $organizationId ?? 'system']);

        if (array_key_exists($key, $this->resolvedSettings)) {
            return $this->resolvedSettings[$key];
        }

        return $this->resolvedSettings[$key] = PayrollTaxSetting::query()
            ->where('currency', strtoupper($currency))
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
     * @return array<int, array{lower: float, upper: float|null, rate: float}>
     */
    private function bandsOf(PayrollTaxTable $table): array
    {
        return $table->bands->map(fn ($band) => [
            'lower' => (float) $band->lower_bound,
            'upper' => $band->upper_bound !== null ? (float) $band->upper_bound : null,
            'rate' => (float) $band->rate_percent / 100,
        ])->all();
    }

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

        $paye = $this->progressiveTax($taxableIncome, $this->bandsOf($table));
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
