<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // Este es el Read All();
    public function index()
    {

        $alumnos = User::where('role', 'ALUMNO')->get();

        return response()->json([
            'total' => $alumnos->count(),
            'data' => $alumnos
        ]);
    }

    // FIND BY ID (Read One)
    public function show($id)
    {
        $alumno = User::where('role', 'ALUMNO')->findOrFail($id);
        return response()->json($alumno);
    }

    // CREATE (Solo Admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'age' => 'required|integer|min:12|max:18',
            'grade' => 'required|string'
        ]);

        $alumno = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'role' => 'ALUMNO', // Forzamos el rol por seguridad
            'age' => $request->age,
            'grade' => $request->grade,
        ]);

        return response()->json(['message' => 'Alumno creado', 'data' => $alumno], 201);
    }

    // UPDATE (Solo Admin)
    public function update(Request $request, $id)
    {
        $alumno = User::where('role', 'ALUMNO')->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$id,
            'age' => 'sometimes|integer|min:12|max:18',
            'grade' => 'sometimes|string'
        ]);

        $alumno->update($request->all());

        return response()->json(['message' => 'Alumno actualizado', 'data' => $alumno]);
    }

    // DELETE (Solo Admin)
    public function destroy($id)
    {
        $alumno = User::where('role', 'ALUMNO')->findOrFail($id);
        $alumno->delete();

        return response()->json(['message' => 'Alumno eliminado correctamente']);
    }

}


