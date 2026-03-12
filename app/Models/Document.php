<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{    use SoftDeletes;

    protected $fillable = [
        'owner_employee_id',
        'document_type_id',
        'title',
        'file_uri',
        'issue_date',
        'expiry_date',
        'metadata_json',
        'access_policy'
    ];
    protected $casts = [
        'issue_date' => 'date',
        'metadata_json' => 'array',
        'expiry_date' => 'date'
    ];
    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function ownerEmployee()
    {
        return $this->belongsTo(Employee::class, 'owner_employee_id');
    }}

