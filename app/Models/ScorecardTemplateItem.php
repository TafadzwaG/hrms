<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScorecardTemplateItem extends Model
{
    use Auditable;

    protected string $auditModule = 'performance';

    protected $fillable = [
        'scorecard_template_id',
        'kpi_library_id',
        'perspective',
        'objective',
        'kpi_name',
        'target_type',
        'target_value',
        'weight',
        'sort_order',
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'weight' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(ScorecardTemplate::class, 'scorecard_template_id');
    }

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(KpiLibrary::class, 'kpi_library_id');
    }
}
