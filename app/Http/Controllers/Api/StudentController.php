<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {

        $alumnos = User::where('role', 'ALUMNO')->get();

        return response()->json([
            'total' => $alumnos->count(),
            'data' => $alumnos
        ]);
    }
}


