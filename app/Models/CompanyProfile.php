<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyProfile extends Model
{
    use Auditable, BelongsToOrganization, SoftDeletes;

    protected string $auditModule = 'recruitment';

    public const STATUSES = [
        'draft',
        'pending_review',
        'active',
        'suspended',
        'rejected',
    ];

    public const INDUSTRIES = [
        'agriculture',
        'banking',
        'construction',
        'education',
        'energy',
        'healthcare',
        'hospitality',
        'information_technology',
        'legal',
        'manufacturing',
        'media',
        'mining',
        'ngo',
        'real_estate',
        'retail',
        'telecommunications',
        'transport',
        'other',
    ];

    protected $fillable = [
        'organization_id',
        'owner_user_id',
        'company_name',
        'industry',
        'registration_number',
        'email',
        'phone',
        'website',
        'address',
        'description',
        'logo_path',
        'status',
        'approved_at',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }

    public function billingProfile(): HasOne
    {
        return $this->hasOne(CompanyBillingProfile::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(CompanySubscription::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(CompanyInvoice::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(CompanySubscription::class)->where('status', 'active')->latestOfMany('started_at');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->creator();
    }

    public function updatedBy(): BelongsTo
    {
        return $this->updater();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}
