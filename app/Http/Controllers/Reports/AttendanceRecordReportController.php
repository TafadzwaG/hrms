<?php

namespace App\Http\Controllers\Reports;

use App\Models\AttendanceRecord;
use Illuminate\Http\Request;

class AttendanceRecordReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, AttendanceRecord::class, 'attendance-register', [
            'id', 'employee_id', 'work_date', 'clock_in', 'clock_out', 'minutes_worked', 'exception_status', 'notes',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, AttendanceRecord::class, 'exception_status', 'attendance-by-status');
    }

    public function byDate(Request $request)
    {
        return $this->downloadDateTrendReport($request, AttendanceRecord::class, 'work_date', 'attendance-by-date', 'day');
    }

    public function missingClockIn(Request $request)
    {
        return $this->downloadMissingValuesReport(
            $request,
            AttendanceRecord::class,
            ['clock_in'],
            'attendance-missing-clock-in',
            ['id', 'employee_id', 'work_date', 'clock_in', 'clock_out', 'minutes_worked', 'exception_status']
        );
    }

    public function missingClockOut(Request $request)
    {
        return $this->downloadMissingValuesReport(
            $request,
            AttendanceRecord::class,
            ['clock_out'],
            'attendance-missing-clock-out',
            ['id', 'employee_id', 'work_date', 'clock_in', 'clock_out', 'minutes_worked', 'exception_status']
        );
    }

    public function lateArrivals(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            AttendanceRecord::class,
            'exception_status',
            'late',
            'attendance-late-arrivals',
            ['id', 'employee_id', 'work_date', 'clock_in', 'clock_out', 'minutes_worked', 'exception_status']
        );
    }

    public function exceptions(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            AttendanceRecord::class,
            'exception_status',
            '',
            'attendance-exceptions',
            ['id', 'employee_id', 'work_date', 'clock_in', 'clock_out', 'minutes_worked', 'exception_status', 'notes']
        );
    }
}
