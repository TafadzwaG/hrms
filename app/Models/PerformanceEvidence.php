<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceEvidence extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'performance';

    protected $fillable = [
        'organization_id',
        'employee_scorecard_id',
        'employee_scorecard_item_id',
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'description',
        'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    public function scorecard(): BelongsTo
    {
        return $this->belongsTo(EmployeeScorecard::class, 'employee_scorecard_id');
    }

    public function scorecardItem(): BelongsTo
    {
        return $this->belongsTo(EmployeeScorecardItem::class, 'employee_scorecard_item_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
