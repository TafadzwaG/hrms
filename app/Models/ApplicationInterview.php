<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationInterview extends Model
{
    public const STATUSES = [
        'scheduled',
        'accepted',
        'rejected',
        'completed',
        'cancelled',
    ];

    public const MEETING_TYPES = [
        'video',
        'onsite',
        'phone',
    ];

    protected $fillable = [
        'vacancy_application_id',
        'company_profile_id',
        'candidate_profile_id',
        'vacancy_id',
        'scheduled_at',
        'ends_at',
        'timezone',
        'meeting_type',
        'location',
        'instructions',
        'status',
        'responded_at',
        'candidate_response_note',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'ends_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(VacancyApplication::class, 'vacancy_application_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class, 'company_profile_id');
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class, 'candidate_profile_id');
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
