<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Location extends Model
{
    protected $table = 'locations';

    protected $fillable = [
        'name',
        'timezone',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function orgUnits(): BelongsToMany
    {
        return $this->belongsToMany(OrgUnit::class, 'org_unit_locations')
            ->withPivot(['is_primary', 'effective_from', 'effective_to'])
            ->withTimestamps();
    }
}
