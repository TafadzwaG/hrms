<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'owner_employee_id',
        'document_type_id',
        'title',
        'file_uri',
        'issue_date',
        'expiry_date',
        'metadata_json',
        'access_policy',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'metadata_json' => 'array',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function ownerEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'owner_employee_id');
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        $search = trim((string) $search);

        if ($search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search) {
            $builder
                ->where('title', 'like', "%{$search}%")
                ->orWhere('file_uri', 'like', "%{$search}%")
                ->orWhere('access_policy', 'like', "%{$search}%")
                ->orWhereHas('documentType', function (Builder $typeQuery) use ($search) {
                    $typeQuery
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('sensitivity_level', 'like', "%{$search}%");
                })
                ->orWhereHas('ownerEmployee', function (Builder $employeeQuery) use ($search) {
                    $employeeQuery
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('surname', 'like', "%{$search}%")
                        ->orWhere('staff_number', 'like', "%{$search}%");
                });
        });
    }

    public function scopeAccessPolicy(Builder $query, ?string $policy): Builder
    {
        $policy = trim((string) $policy);

        if ($policy === '' || $policy === 'all') {
            return $query;
        }

        return $query->where('access_policy', $policy);
    }

    public function scopeDocumentTypeFilter(Builder $query, mixed $documentTypeId): Builder
    {
        if (blank($documentTypeId) || $documentTypeId === 'all') {
            return $query;
        }

        return $query->where('document_type_id', $documentTypeId);
    }

    public function scopeOwnerFilter(Builder $query, mixed $ownerEmployeeId): Builder
    {
        if (blank($ownerEmployeeId) || $ownerEmployeeId === 'all') {
            return $query;
        }

        return $query->where('owner_employee_id', $ownerEmployeeId);
    }

    public function scopeExpiryState(Builder $query, ?string $state): Builder
    {
        $state = trim((string) $state);
        $today = now()->startOfDay();
        $inThirtyDays = now()->addDays(30)->endOfDay();

        return match ($state) {
            'expired' => $query->whereDate('expiry_date', '<', $today),
            'expiring_30' => $query->whereDate('expiry_date', '>=', $today)->whereDate('expiry_date', '<=', $inThirtyDays),
            'active' => $query->where(function (Builder $builder) use ($today) {
                $builder->whereNull('expiry_date')->orWhereDate('expiry_date', '>=', $today);
            }),
            'no_expiry' => $query->whereNull('expiry_date'),
            default => $query,
        };
    }

    public function hasExpiry(): bool
    {
        return $this->expiry_date !== null;
    }

    public function isExpired(): bool
    {
        return $this->expiry_date !== null && $this->expiry_date->isPast();
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->expiry_date !== null
            && ! $this->isExpired()
            && $this->expiry_date->lte(now()->addDays($days));
    }

    public function getMetadataPrettyAttribute(): string
    {
        return empty($this->metadata_json)
            ? ''
            : json_encode($this->metadata_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
