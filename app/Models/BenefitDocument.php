<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BenefitDocument extends Model
{
    use Auditable, BelongsToOrganization;

    public const DOCUMENT_TYPES = ['policy', 'membership_form', 'approval_letter', 'dependant_document', 'enrollment_form', 'other'];

    protected $fillable = [
        'organization_id',
        'employee_benefit_enrollment_id',
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'document_type',
        'uploaded_by',
    ];

    protected string $auditModule = 'benefits';

    public function auditLabel(): string
    {
        return $this->file_name ?: 'Document #'.$this->getKey();
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(EmployeeBenefitEnrollment::class, 'employee_benefit_enrollment_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
