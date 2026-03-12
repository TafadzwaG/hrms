<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class PerformanceReview extends Model
{    protected $fillable = [
        'employee_id',
        'cycle_name',
        'reviewer_name',
        'rating',
        'status',
        'review_date',
        'comments'
    ];
    protected $casts = [
        'rating' => 'decimal:2',
        'review_date' => 'date'
    ];
}

