<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{
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

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Listen for the 'creating' event to auto-generate the requisition code
        static::creating(function ($model) {
            if (empty($model->requisition_code)) {
                $model->requisition_code = self::generateUniqueCode();
            }
        });
    }

    /**
     * Generate a unique Requisition Code.
     * Format: REQ-{YEAR}-{000X}
     */
    private static function generateUniqueCode(): string
    {
        $year = date('Y');

        // Get the latest requisition created this year
        $latestRequisition = self::where('requisition_code', 'like', "REQ-{$year}-%")
            ->orderBy('id', 'desc')
            ->first();

        if (! $latestRequisition) {
            $number = 1;
        } else {
            // Extract the sequence number from the latest code (e.g., "REQ-2024-012" -> "012")
            $parts = explode('-', $latestRequisition->requisition_code);
            $number = intval(end($parts)) + 1;
        }

        // Format the new code with padding (e.g., REQ-2024-001)
        do {
            $code = sprintf('REQ-%s-%03d', $year, $number);
            $number++;
        } while (self::where('requisition_code', $code)->exists()); // Double check uniqueness

        return $code;
    }
}
