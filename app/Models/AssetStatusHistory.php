<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetStatusHistory extends Model
{
    protected $table = 'asset_status_history';

    protected $fillable = [
        'asset_id',
        'from_status',
        'to_status',
        'reason',
        'changed_by',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
