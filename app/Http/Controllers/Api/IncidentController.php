<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Incident;
use Illuminate\Support\Facades\Gate; 

class IncidentController extends Controller
{
    public function store(Request $request)
    {
        Gate::authorize('create', Incident::class);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'description' => 'required|string',
            'type' => 'required|in:MALA_CONDUCTA,OBSERVACION,PREMIO'
        ]);
        
        $incident = Incident::create([
            'user_id' => $request->user_id,
            // Forma correcta y sin errores de sacar el ID del token:
            'teacher_id' => $request->user()->id, 
            'description' => $request->description,
            'type' => $request->type,   
        ]);

        return response()->json($incident, 201);
    }
}
