<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use App\Support\Auth\PortalAccessResolver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class CandidateProfile extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'candidates';

    protected static function booted(): void
    {
        static::saved(function (self $candidateProfile): void {
            if ($candidateProfile->user) {
                app(PortalAccessResolver::class)->grantPortalAccess($candidateProfile->user, PortalAccessResolver::PORTAL_CANDIDATE);
            }
        });
    }

    public const VISIBILITY_STATUSES = [
        'draft',
        'pending_payment',
        'payment_pending',
        'active',
        'expired',
        'hidden',
        'suspended',
        'rejected',
    ];

    public const EDUCATION_LEVELS = [
        'high_school',
        'diploma',
        'bachelors',
        'masters',
        'doctorate',
        'professional',
        'other',
    ];

    protected $fillable = [
        'user_id',
        'organization_id',
        'requisition_code',
        'full_name',
        'email',
        'phone',
        'alt_phone',
        'national_id',
        'gender',
        'date_of_birth',
        'location',
        'headline',
        'professional_summary',
        'expected_salary',
        'salary_currency',
        'years_experience',
        'highest_education',
        'profile_visibility_status',
        'is_public',
        'is_verified',
        'listing_fee_amount',
        'listing_fee_currency',
        'listing_activated_at',
        'listing_expires_at',
        'stage',
        'status',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'expected_salary' => 'decimal:2',
        'listing_fee_amount' => 'decimal:2',
        'is_public' => 'boolean',
        'is_verified' => 'boolean',
        'listing_activated_at' => 'datetime',
        'listing_expires_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function requisition(): BelongsTo
    {
        return $this->belongsTo(JobRequisition::class, 'requisition_code', 'requisition_code');
    }

    public function resumes(): HasMany
    {
        return $this->hasMany(CandidateResume::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(CandidateEducation::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(CandidateExperience::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(CandidateSkill::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(VacancyApplication::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(ApplicationInterview::class);
    }

    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    public function primaryResume(): HasOne
    {
        return $this->hasOne(CandidateResume::class)->where('is_primary', true);
    }

    public function scopePublicListing($query)
    {
        return $query->where('is_public', true)
            ->where('profile_visibility_status', 'active');
    }

    public function scopeByVisibility($query, string $visibility)
    {
        return $query->where('profile_visibility_status', $visibility);
    }
}
