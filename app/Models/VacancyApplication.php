<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VacancyApplication extends Model
{
    use Auditable;

    protected string $auditModule = 'recruitment';

    public const STATUSES = [
        'submitted',
        'under_review',
        'shortlisted',
        'interview',
        'offered',
        'rejected',
        'withdrawn',
    ];

    protected $fillable = [
        'vacancy_id',
        'candidate_profile_id',
        'resume_id',
        'cover_letter',
        'status',
        'applied_at',
        'shortlisted_at',
        'rejected_at',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
        'shortlisted_at' => 'datetime',
        'rejected_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class, 'candidate_profile_id');
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(CandidateResume::class, 'resume_id');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(ApplicationInterview::class, 'vacancy_application_id');
    }

    public function latestInterview(): HasOne
    {
        return $this->hasOne(ApplicationInterview::class, 'vacancy_application_id')->latestOfMany('scheduled_at');
    }
}
