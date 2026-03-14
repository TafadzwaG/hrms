<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeSkill extends Model
{
    use Auditable;

    protected $fillable = [
        'employee_id',
        'name',
        'category',
        'proficiency_level',
        'proficiency_percent',
        'certification_name',
        'certification_issuer',
        'certified_at',
        'expires_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'certified_at' => 'date',
            'expires_at' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
