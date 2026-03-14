<?php

namespace App\Models;

use App\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobRequisition extends Model
{
    use Auditable;

    protected string $auditModule = 'requisitions';

    protected $fillable = [
        'requisition_code',
        'title',
        'department',
        'hiring_manager',
        'openings',
        'status',
        'target_start_date',
    ];

    protected $casts = [
        'target_start_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->requisition_code)) {
                $model->requisition_code = self::generateUniqueCode();
            }
        });
    }

    public function candidates(): HasMany
    {
        return $this->hasMany(CandidateProfile::class, 'requisition_code', 'requisition_code');
    }

    private static function generateUniqueCode(): string
    {
        $year = date('Y');

        $latestRequisition = self::where('requisition_code', 'like', "REQ-{$year}-%")
            ->orderBy('id', 'desc')
            ->first();

        if (! $latestRequisition) {
            $number = 1;
        } else {
            $parts = explode('-', $latestRequisition->requisition_code);
            $number = intval(end($parts)) + 1;
        }

        do {
            $code = sprintf('REQ-%s-%03d', $year, $number);
            $number++;
        } while (self::where('requisition_code', $code)->exists());

        return $code;
    }
}
