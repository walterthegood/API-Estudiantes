<?php

namespace App\Policies;

use App\Models\Incident;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IncidentPolicy
{
    /**
     * Determine ¿Quién puede ver la LISTA de incidencias?
     */
    public function viewAny(User $user): bool
    {
        // Admin y Profesor ven todas. Alumno solo puede entrar a la ruta.
        return true;
    }

    /**
     * ¿Quién puede ver UNA incidencia concreta?
     */
    public function view(User $user, Incident $incident): bool
    {
        if ($user->role === 'ADMIN' || $user->role === 'PROFESOR'){
            return true;
        }
        // El alumno SOLO ve la suya 
        // (su ID debe coincidir con el user_id de la incidencia)
        return $user->id === $incident->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
       // Solo el Profesor
        return $user->role === 'PROFESOR';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Incident $incident): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Incident $incident): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Incident $incident): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Incident $incident): bool
    {
        return false;
    }
}
