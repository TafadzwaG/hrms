<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OcrResult extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'documents';

    protected $fillable = [
        'organization_id',
        'document_id',
        'page_number',
        'text',
        'confidence',
        'raw_json',
    ];

    protected $casts = [
        'confidence' => 'float',
        'raw_json' => 'array',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
