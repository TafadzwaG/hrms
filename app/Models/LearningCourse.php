<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class LearningCourse extends Model
{
    use Auditable;

    protected string $auditModule = 'learning';

    protected $fillable = [
        'course_code',
        'title',
        'category',
        'duration_hours',
        'compliance_required',
        'expires_after_days',
        'status',
    ];

    protected $casts = [
        'duration_hours' => 'decimal:2',
        'compliance_required' => 'boolean',
    ];
}

