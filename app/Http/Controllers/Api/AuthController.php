<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validación (Como las anotaciones @Valid en Spring)


        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Verificar si el usuario existe
        $user = User::where('email', $request->email)->first();

        // 3. Comprobar password (Equivalente a PasswordEncoder)
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // 4. GENERAR EL TOKEN (La magia de Sanctum)
        // Le damos un nombre al token y le asignamos 
        // el rol del usuario como "habilidad"

        $token = $user->createToken('auth_token', [$user->role])->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'name' => $user->name,
                'role' => $user->role
            ]
        ]);

    }

}