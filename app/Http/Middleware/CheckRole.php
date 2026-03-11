<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     * 
     *  El parámetro $roles recibirá los roles 
     *  que permitamos en la ruta (ej: ADMIN, PROFESOR)
     */

    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Acceso denegado. No tienes permisos para ver esto.'
            ], 403); 
        }

        return $next($request);
    }
}


