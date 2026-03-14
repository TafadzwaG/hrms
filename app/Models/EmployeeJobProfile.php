<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeJobProfile extends Model
{
    use Auditable;

    protected $fillable = [
        'employee_id',
        'title',
        'employment_type',
        'reports_to',
        'working_hours',
        'location_summary',
        'summary',
        'responsibilities',
        'requirements',
        'review_date',
    ];

    protected function casts(): array
    {
        return [
            'review_date' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
