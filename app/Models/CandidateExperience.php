<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateExperience extends Model
{
    protected $fillable = [
        'candidate_profile_id',
        'employer_name',
        'job_title',
        'start_date',
        'end_date',
        'currently_working',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'currently_working' => 'boolean',
    ];

    public function candidateProfile(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class);
    }
}
