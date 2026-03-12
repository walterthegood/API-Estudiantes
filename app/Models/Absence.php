<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;


class Absence extends Model
{
    protected $fillable = ['user_id', 'date', 'justified'];

    /**
     * SCOPE: Filtra las faltas del usuario autenticado.
     * En el controlador lo uso como: Absence::mine()->get()
     */
    public function scopeMine(Builder $query, $userId): void
    {
        $query->where('user_id', $userId);    
    }

    // Relación: Una falta pertenece a un Alumno (User)
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
