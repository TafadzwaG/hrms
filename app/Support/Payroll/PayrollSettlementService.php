<?php

namespace App\Support\Payroll;

use App\Models\EmployeePayrollProfile;
use App\Models\EmployeePayrollSettlementRule;
use App\Models\PayrollPeriod;
use App\Models\PayrollPeriodExchangeRate;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class PayrollSettlementService
{
    public function allocate(EmployeePayrollProfile $profile, PayrollPeriod $period, float $netPay): array
    {
        $baseCurrency = strtoupper((string) $profile->currency);
        $rules = $this->activeRules($profile);

        if ($rules->isEmpty()) {
            return [$this->makeSettlementRow(
                baseCurrency: $baseCurrency,
                settlementCurrency: $baseCurrency,
                allocationMethod: 'REMAINDER',
                baseAmount: round($netPay, 2),
                settlementAmount: round($netPay, 2),
                exchangeRate: 1.0,
                sortOrder: 0,
                metadata: ['source' => 'SYSTEM_FULL_SETTLEMENT'],
            )];
        }

        $this->validateRuleSet($rules);

        $rates = $this->exchangeRates($period);
        $settlements = [];
        $remainingBase = round($netPay, 2);
        $sortOrder = 0;
        $hasRemainderRule = false;

        foreach ($rules as $rule) {
            $targetCurrency = strtoupper((string) $rule->currency);
            $method = strtoupper((string) $rule->allocation_method);
            $exchangeRate = $this->resolveRate($rates, $baseCurrency, $targetCurrency);
            $baseAmount = 0.0;
            $settlementAmount = 0.0;

            if ($method === 'FIXED_AMOUNT') {
                $settlementAmount = round((float) $rule->amount, 2);
                $baseAmount = $targetCurrency === $baseCurrency
                    ? $settlementAmount
                    : round($settlementAmount / $exchangeRate, 2);

                if ($baseAmount - $remainingBase > 0.01) {
                    throw ValidationException::withMessages([
                        'settlements' => "Settlement rules for {$profile->employee?->full_name} exceed the employee net pay.",
                    ]);
                }

                $remainingBase = round($remainingBase - $baseAmount, 2);
            } elseif ($method === 'PERCENTAGE') {
                $baseAmount = round($netPay * ((float) $rule->percentage / 100), 2);
                $baseAmount = min($baseAmount, $remainingBase);
                $settlementAmount = $targetCurrency === $baseCurrency
                    ? $baseAmount
                    : round($baseAmount * $exchangeRate, 2);
                $remainingBase = round($remainingBase - $baseAmount, 2);
            } elseif ($method === 'REMAINDER') {
                $hasRemainderRule = true;
                $baseAmount = round($remainingBase, 2);
                $settlementAmount = $targetCurrency === $baseCurrency
                    ? $baseAmount
                    : round($baseAmount * $exchangeRate, 2);
                $remainingBase = 0.0;
            }

            if ($baseAmount <= 0 && $settlementAmount <= 0) {
                continue;
            }

            $settlements[] = $this->makeSettlementRow(
                baseCurrency: $baseCurrency,
                settlementCurrency: $targetCurrency,
                allocationMethod: $method,
                baseAmount: $baseAmount,
                settlementAmount: $settlementAmount,
                exchangeRate: $exchangeRate,
                sortOrder: $sortOrder++,
                sourceRuleId: $rule->id,
                metadata: [
                    'rule_priority' => $rule->priority,
                    'rule_amount' => $rule->amount !== null ? round((float) $rule->amount, 2) : null,
                    'rule_percentage' => $rule->percentage !== null ? round((float) $rule->percentage, 4) : null,
                ],
            );
        }

        if ($remainingBase > 0.01 && ! $hasRemainderRule) {
            $settlements[] = $this->makeSettlementRow(
                baseCurrency: $baseCurrency,
                settlementCurrency: $baseCurrency,
                allocationMethod: 'REMAINDER',
                baseAmount: round($remainingBase, 2),
                settlementAmount: round($remainingBase, 2),
                exchangeRate: 1.0,
                sortOrder: $sortOrder,
                metadata: ['source' => 'SYSTEM_BALANCING_REMAINDER'],
            );
        }

        return $settlements;
    }

    /**
     * @return Collection<int,EmployeePayrollSettlementRule>
     */
    private function activeRules(EmployeePayrollProfile $profile): Collection
    {
        if ($profile->relationLoaded('settlementRules')) {
            return $profile->settlementRules->where('active', true)->sortBy(['priority', 'currency'])->values();
        }

        return $profile->settlementRules()
            ->where('active', true)
            ->orderBy('priority')
            ->orderBy('currency')
            ->get();
    }

    private function validateRuleSet(Collection $rules): void
    {
        $fixedRules = $rules->where('allocation_method', 'FIXED_AMOUNT');
        $percentageRules = $rules->where('allocation_method', 'PERCENTAGE');
        $remainderRules = $rules->where('allocation_method', 'REMAINDER');

        if ($fixedRules->isNotEmpty() && $percentageRules->isNotEmpty()) {
            throw ValidationException::withMessages([
                'settlements' => 'Settlement rules cannot mix fixed-amount and percentage-based allocation methods.',
            ]);
        }

        if ($remainderRules->count() > 1) {
            throw ValidationException::withMessages([
                'settlements' => 'Only one remainder settlement rule can be active at a time.',
            ]);
        }

        $percentageTotal = round((float) $percentageRules->sum('percentage'), 4);

        if ($percentageTotal > 100.0000) {
            throw ValidationException::withMessages([
                'settlements' => 'Percentage settlement rules cannot exceed 100% in total.',
            ]);
        }
    }

    /**
     * @return Collection<string,float>
     */
    private function exchangeRates(PayrollPeriod $period): Collection
    {
        $rates = $period->relationLoaded('exchangeRates')
            ? $period->exchangeRates
            : $period->exchangeRates()->get();

        return $rates
            ->mapWithKeys(fn (PayrollPeriodExchangeRate $rate) => [
                $this->pairKey($rate->from_currency, $rate->to_currency) => (float) $rate->rate,
            ]);
    }

    private function resolveRate(Collection $rates, string $fromCurrency, string $toCurrency): float
    {
        if ($fromCurrency === $toCurrency) {
            return 1.0;
        }

        $directKey = $this->pairKey($fromCurrency, $toCurrency);
        $inverseKey = $this->pairKey($toCurrency, $fromCurrency);

        if ($rates->has($directKey)) {
            return (float) $rates->get($directKey);
        }

        if ($rates->has($inverseKey)) {
            $inverseRate = (float) $rates->get($inverseKey);

            if ($inverseRate <= 0) {
                throw ValidationException::withMessages([
                    'exchange_rates' => "Invalid inverse exchange rate for {$toCurrency} to {$fromCurrency} on the selected payroll period.",
                ]);
            }

            return round(1 / $inverseRate, 8);
        }

        throw ValidationException::withMessages([
            'exchange_rates' => "Missing exchange rate for {$fromCurrency} to {$toCurrency} on the selected payroll period.",
        ]);
    }

    private function pairKey(string $fromCurrency, string $toCurrency): string
    {
        return strtoupper($fromCurrency).'->'.strtoupper($toCurrency);
    }

    private function makeSettlementRow(
        string $baseCurrency,
        string $settlementCurrency,
        string $allocationMethod,
        float $baseAmount,
        float $settlementAmount,
        float $exchangeRate,
        int $sortOrder,
        ?int $sourceRuleId = null,
        array $metadata = [],
    ): array {
        return [
            'employee_payroll_settlement_rule_id' => $sourceRuleId,
            'base_currency' => $baseCurrency,
            'currency' => $settlementCurrency,
            'allocation_method' => $allocationMethod,
            'base_amount' => round($baseAmount, 2),
            'settlement_amount' => round($settlementAmount, 2),
            'exchange_rate' => round($exchangeRate, 8),
            'sort_order' => $sortOrder,
            'metadata' => $metadata,
        ];
    }
}
