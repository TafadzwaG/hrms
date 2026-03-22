<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateResume extends Model
{
    public const DOCUMENT_TYPES = [
        'resume',
        'cv',
        'portfolio',
        'certificate',
        'cover_letter',
        'other',
    ];

    protected $fillable = [
        'candidate_profile_id',
        'file_name',
        'document_type',
        'file_path',
        'description',
        'mime_type',
        'size',
        'is_primary',
        'uploaded_by',
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

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
