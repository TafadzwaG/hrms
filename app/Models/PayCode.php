<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayCode extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'payroll';

    protected $fillable = [
        'organization_id',
        'code',
        'description',
        'category',
        'type',
        'taxable',
        'recurring',
        'affects_gross',
        'affects_net',
        'is_pre_tax',
        'active',
        'system_generated',
        'gl_account_code',
        'sort_order',
        'rules',
    ];

    protected function casts(): array
    {
        return [
            'taxable' => 'boolean',
            'recurring' => 'boolean',
            'affects_gross' => 'boolean',
            'affects_net' => 'boolean',
            'is_pre_tax' => 'boolean',
            'active' => 'boolean',
            'system_generated' => 'boolean',
            'rules' => 'array',
        ];
    }

    public function recurringItems(): HasMany
    {
        return $this->hasMany(EmployeeRecurringPayItem::class);
    }

    public function inputs(): HasMany
    {
        return $this->hasMany(PayrollInput::class);
    }

    public function resultLines(): HasMany
    {
        return $this->hasMany(PayrollResultLine::class);
    }
}
