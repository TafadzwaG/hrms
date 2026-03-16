<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractDocument extends Model
{
    use Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'employee_contract_id',
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'uploaded_by',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(EmployeeContract::class, 'employee_contract_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function auditModule(): string
    {
        return 'contract_documents';
    }

    public function auditLabel(): string
    {
        return $this->file_name ?: 'Document #'.$this->getKey();
    }
}
