<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Absence;



class AbsenceController extends Controller
{
    public function misFaltas(Request $request)
    {
        $userId = $request->user()->id;

        $faltas = Absence::mine($userId)->get();

        return response()->json([
            'total' => $faltas->count(),
            'data' => $faltas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        $falta = Absence::create([
            'user_id' => $request->user_id,
            'date' => $request->date,
            'justified' => false
        ]);

        return response()->json(['message' => 'Falta registrada', 'data' => $falta], 201);
    }


}
