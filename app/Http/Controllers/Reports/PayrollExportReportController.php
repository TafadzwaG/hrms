<?php

namespace App\Http\Controllers\Reports;

use App\Models\PayrollExport;
use Illuminate\Http\Request;

class PayrollExportReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, PayrollExport::class, 'payroll-export-register', [
            'id', 'period_start', 'period_end', 'export_version', 'status', 'exported_at', 'file_reference', 'notes',
        ]);
    }

    public function byStatus(Request $request)
    {
        return $this->downloadGroupedCountReport($request, PayrollExport::class, 'status', 'payroll-export-by-status');
    }

    public function failed(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            PayrollExport::class,
            'status',
            'fail',
            'payroll-failed-exports',
            ['id', 'period_start', 'period_end', 'export_version', 'status', 'exported_at', 'file_reference', 'notes']
        );
    }

    public function completed(Request $request)
    {
        return $this->downloadContainsReport(
            $request,
            PayrollExport::class,
            'status',
            'complete',
            'payroll-completed-exports',
            ['id', 'period_start', 'period_end', 'export_version', 'status', 'exported_at', 'file_reference']
        );
    }

    public function versionHistory(Request $request)
    {
        return $this->downloadGroupedCountReport($request, PayrollExport::class, 'export_version', 'payroll-export-version-history');
    }

    public function byPeriod(Request $request)
    {
        return $this->downloadDateTrendReport($request, PayrollExport::class, 'period_start', 'payroll-export-by-period');
    }
}
