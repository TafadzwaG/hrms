<?php

namespace App\Http\Controllers\Reports;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, Document::class, 'document-register', [
            'id', 'employee_id', 'document_type', 'issue_date', 'expiry_date', 'file_reference', 'status', 'uploaded_at', 'created_at',
        ]);
    }

    public function byType(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Document::class, 'document_type', 'document-by-type');
    }

    public function byEmployee(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Document::class, 'employee_id', 'document-by-employee');
    }

    public function expiring(Request $request)
    {
        return $this->downloadExpiringReport(
            $request,
            Document::class,
            'expiry_date',
            'document-expiring',
            ['id', 'employee_id', 'document_type', 'issue_date', 'expiry_date', 'file_reference', 'status']
        );
    }

    public function expired(Request $request)
    {
        return $this->downloadExpiredReport(
            $request,
            Document::class,
            'expiry_date',
            'document-expired',
            ['id', 'employee_id', 'document_type', 'issue_date', 'expiry_date', 'file_reference', 'status']
        );
    }

    public function missingFileReference(Request $request)
    {
        return $this->downloadMissingValuesReport(
            $request,
            Document::class,
            ['file_reference'],
            'document-missing-file-reference',
            ['id', 'employee_id', 'document_type', 'issue_date', 'expiry_date', 'file_reference', 'status']
        );
    }
}
