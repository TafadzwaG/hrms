<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetDocument extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'asset_id',
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'document_type',
        'uploaded_by',
    ];

    public const DOCUMENT_TYPES = [
        'purchase_receipt',
        'warranty',
        'manual',
        'insurance',
        'photo',
        'other',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function auditModule(): string
    {
        return 'asset_documents';
    }

    public function auditLabel(): string
    {
        return $this->file_name ?: 'Document #'.$this->getKey();
    }
}
