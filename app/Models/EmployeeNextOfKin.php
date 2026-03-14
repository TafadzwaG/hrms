<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeNextOfKin extends Model
{
    use Auditable;

    protected $table = 'employee_next_of_kin';

    protected $fillable = [
        'employee_id',
        'full_name',
        'relationship',
        'contact_number',
        'alternate_contact_number',
        'email',
        'address',
        'is_primary',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
