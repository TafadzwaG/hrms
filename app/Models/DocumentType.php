<?php

namespace App\Models;

use App\Concerns\Auditable;
use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentType extends Model
{
    use Auditable, BelongsToOrganization;

    protected string $auditModule = 'document_types';

    protected $fillable = [
        'code',
        'name',
        'retention_policy',
        'sensitivity_level',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        $search = trim((string) $search);

        if ($search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search) {
            $builder
                ->where('code', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('retention_policy', 'like', "%{$search}%")
                ->orWhere('sensitivity_level', 'like', "%{$search}%");
        });
    }

    public function scopeSensitivity(Builder $query, ?string $level): Builder
    {
        $level = trim((string) $level);

        if ($level === '' || $level === 'all') {
            return $query;
        }

        return $query->where('sensitivity_level', $level);
    }

    public function canBeDeleted(): bool
    {
        $count = $this->documents_count ?? $this->documents()->count();

        return $count === 0;
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->code !== '' ? "{$this->code} - {$this->name}" : $this->name;
    }
}
