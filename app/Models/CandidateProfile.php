<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class CandidateProfile extends Model
{    protected $fillable = [
        'requisition_code',
        'full_name',
        'email',
        'phone',
        'stage',
        'status',
        'notes'
    ];
}

