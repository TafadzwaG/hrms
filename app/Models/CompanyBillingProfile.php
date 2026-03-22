<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyBillingProfile extends Model
{
    protected $fillable = [
        'company_profile_id',
        'billing_name',
        'billing_email',
        'billing_phone',
        'billing_address',
        'tax_number',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class, 'company_profile_id');
    }
}
