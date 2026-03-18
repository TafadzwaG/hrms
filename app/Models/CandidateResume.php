<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateResume extends Model
{
    protected $fillable = [
        'candidate_profile_id',
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'is_primary',
        'uploaded_at',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'size' => 'integer',
        'uploaded_at' => 'datetime',
    ];

    public function candidateProfile(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class);
    }
}
