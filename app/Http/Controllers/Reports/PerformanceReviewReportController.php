<?php

namespace App\Http\Controllers\Reports;

use App\Models\PerformanceReview;
use Illuminate\Http\Request;

class PerformanceReviewReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, PerformanceReview::class, 'performance-review-register', [
            'id', 'employee_id', 'reviewer_id', 'cycle', 'status', 'rating', 'due_date', 'completed_at', 'notes',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, PerformanceReview::class, 'status', 'performance-review-by-status');
    }

    public function byCycle(Request $request)
    {
        return $this->downloadGroupedCountReport($request, PerformanceReview::class, 'cycle', 'performance-review-by-cycle');
    }

    public function byReviewer(Request $request)
    {
        return $this->downloadGroupedCountReport($request, PerformanceReview::class, 'reviewer_id', 'performance-review-by-reviewer');
    }

    public function byRating(Request $request)
    {
        return $this->downloadGroupedCountReport($request, PerformanceReview::class, 'rating', 'performance-review-by-rating');
    }

    public function overdue(Request $request)
    {
        return $this->downloadOverdueReport(
            $request,
            PerformanceReview::class,
            'due_date',
            'status',
            ['completed', 'done'],
            'performance-review-overdue',
            ['id', 'employee_id', 'reviewer_id', 'cycle', 'status', 'rating', 'due_date', 'completed_at']
        );
    }
}
