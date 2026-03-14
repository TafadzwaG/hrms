<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePhysicalProfile extends Model
{
    use Auditable;

    protected $fillable = [
        'employee_id',
        'uniform_size',
        'shirt_size',
        'trouser_size',
        'shoe_size',
        'height_cm',
        'weight_kg',
        'blood_type',
        'emergency_medical_notes',
        'ppe_notes',
    ];

    protected function casts(): array
    {
        return [
            'height_cm' => 'decimal:2',
            'weight_kg' => 'decimal:2',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
