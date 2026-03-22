<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vacancy extends Model
{
    use Auditable, BelongsToOrganization, SoftDeletes;

    protected string $auditModule = 'recruitment';

    public const STATUSES = [
        'draft',
        'published',
        'closed',
        'archived',
    ];

    public const EMPLOYMENT_TYPES = [
        'full_time',
        'part_time',
        'contract',
        'temporary',
        'internship',
        'volunteer',
    ];

    public const WORK_MODES = [
        'onsite',
        'remote',
        'hybrid',
    ];

    public const CATEGORIES = [
        'accounting',
        'administration',
        'engineering',
        'finance',
        'human_resources',
        'information_technology',
        'legal',
        'marketing',
        'operations',
        'sales',
        'other',
    ];

    protected $fillable = [
        'company_profile_id',
        'title',
        'department',
        'category',
        'employment_type',
        'work_mode',
        'location',
        'description',
        'requirements',
        'responsibilities',
        'salary_min',
        'salary_max',
        'currency',
        'application_deadline',
        'status',
        'published_at',
        'closed_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'application_deadline' => 'date',
        'published_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class, 'company_profile_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(VacancyApplication::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->creator();
    }

    public function updatedBy(): BelongsTo
    {
        return $this->updater();
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByEmploymentType($query, string $type)
    {
        return $query->where('employment_type', $type);
    }
}
