<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'user_id',
        'staff_number',
        'first_name',
        'middle_name',
        'surname',
        'date_of_birth',
        'email',
        'national_id',
        'gender',
        'pay_point',
        'occupation',
        'contact_number',
        'alt_phone_number',
        'address',
        'marital_status',
        'nationality',
        'educational_level',
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

    public function nextOfKin(): HasMany
    {
        return $this->hasMany(EmployeeNextOfKin::class)->orderByDesc('is_primary')->orderBy('full_name');
    }

    public function physicalProfile(): HasOne
    {
        return $this->hasOne(EmployeePhysicalProfile::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(EmployeeSkill::class)->orderByDesc('proficiency_percent')->orderBy('name');
    }

    public function jobProfile(): HasOne
    {
        return $this->hasOne(EmployeeJobProfile::class);
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(EmployeeKpi::class)->orderByDesc('progress_percent')->orderBy('title');
    }

    public function payrollProfiles(): HasMany
    {
        return $this->hasMany(EmployeePayrollProfile::class)->orderByDesc('effective_from');
    }

    public function recurringPayItems(): HasMany
    {
        return $this->hasMany(EmployeeRecurringPayItem::class)->orderByDesc('effective_from');
    }

    public function payrollInputs(): HasMany
    {
        return $this->hasMany(PayrollInput::class);
    }

    public function payrollResults(): HasMany
    {
        return $this->hasMany(PayrollResult::class);
    }

    // Helpful computed full name (optional)
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.($this->middle_name ? $this->middle_name.' ' : '').$this->surname);
    }
}
