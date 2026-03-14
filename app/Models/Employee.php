<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use Auditable;

    protected $fillable = [
        'user_id',
        'staff_number',
        'first_name',
        'middle_name',
        'surname',
        'date_of_birth',
        'pay_point',
        'contact_number',
        'address',
        'org_unit_id',
        'location_id',
        'position_id',
        'manager_id',
        'status',
        'hire_date',
        'termination_date',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'termination_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function leaveRequest(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function orgUnit(): BelongsTo
    {
        return $this->belongsTo(OrgUnit::class, 'org_unit_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function onboardingTasks(): HasMany
    {
        return $this->hasMany(OnboardingTask::class);
    }

    public function performanceReviews(): HasMany
    {
        return $this->hasMany(PerformanceReview::class);
    }

    public function directReports(): HasMany
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'owner_employee_id');
    }

    // Helpful computed full name (optional)
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.($this->middle_name ? $this->middle_name.' ' : '').$this->surname);
    }
}
