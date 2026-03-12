<?php

namespace App\Http\Controllers\Reports;

use App\Models\LearningCourse;
use Illuminate\Http\Request;

class LearningCourseReportController extends BaseReportController
{
    public function catalog(Request $request)
    {
        return $this->downloadRegisterReport($request, LearningCourse::class, 'learning-course-catalog', [
            'id', 'title', 'category', 'status', 'mandatory', 'owner_id', 'due_date', 'expiry_date', 'created_at',
        ]);
    }

    public function byCategory(Request $request)
    {
        return $this->downloadGroupedCountReport($request, LearningCourse::class, 'category', 'learning-course-by-category');
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, LearningCourse::class, 'status', 'learning-course-by-status');
    }

    public function mandatory(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            LearningCourse::class,
            'mandatory',
            '1',
            'learning-mandatory-courses',
            ['id', 'title', 'category', 'status', 'mandatory', 'owner_id', 'due_date']
        );
    }

    public function expiring(Request $request)
    {
        return $this->downloadExpiringReport(
            $request,
            LearningCourse::class,
            'expiry_date',
            'learning-course-expiring',
            ['id', 'title', 'category', 'status', 'mandatory', 'expiry_date']
        );
    }

    public function expired(Request $request)
    {
        return $this->downloadExpiredReport(
            $request,
            LearningCourse::class,
            'expiry_date',
            'learning-course-expired',
            ['id', 'title', 'category', 'status', 'mandatory', 'expiry_date']
        );
    }
}
