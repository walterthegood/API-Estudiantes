<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    
    protected $fillable = [
    'user_id',
    'teacher_id',
    'description',
    'type'
    ];
}
