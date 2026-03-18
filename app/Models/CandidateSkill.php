<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateSkill extends Model
{
    public const LEVELS = [
        'beginner',
        'intermediate',
        'advanced',
        'expert',
    ];

    protected $fillable = [
        'candidate_profile_id',
        'name',
        'level',
        'years_experience',
    ];

    public function candidateProfile(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class);
    }
}
