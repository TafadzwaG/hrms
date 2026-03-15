<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'code',
        'email',
        'phone',
        'address',
        'logo_path',
        'status',
        'timezone',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organization_user')
            ->withPivot(['is_active', 'joined_at'])
            ->withTimestamps();
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function orgUnits(): HasMany
    {
        return $this->hasMany(OrgUnit::class);
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function payCodes(): HasMany
    {
        return $this->hasMany(PayCode::class);
    }

    public function payrollPeriods(): HasMany
    {
        return $this->hasMany(PayrollPeriod::class);
    }

    public function payrollProfiles(): HasMany
    {
        return $this->hasMany(EmployeePayrollProfile::class);
    }

    public function payrollInputs(): HasMany
    {
        return $this->hasMany(PayrollInput::class);
    }

    public function payrollRuns(): HasMany
    {
        return $this->hasMany(PayrollRun::class);
    }

    public function payrollResults(): HasMany
    {
        return $this->hasMany(PayrollResult::class);
    }

    public function payrollExchangeRates(): HasMany
    {
        return $this->hasMany(PayrollPeriodExchangeRate::class);
    }

    public function payrollSettlementRules(): HasMany
    {
        return $this->hasMany(EmployeePayrollSettlementRule::class);
    }

    public function payrollResultSettlements(): HasMany
    {
        return $this->hasMany(PayrollResultSettlement::class);
    }
}
