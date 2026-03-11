<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

// Esta ruta es pública: http://walter-laravel-11.test/api/login
Route::post('/login', [AuthController::class, 'login']);

// TODAS las rutas de aquí dentro requieren 
// que estés logueado (Token Bearer válido)
Route::middleware(['auth:sanctum'])->group(function () {
    
    // GRUPO 1: ADMIN y PROFESOR (Pueden Ver)
    Route::middleware(CheckRole::class.':ADMIN,PROFESOR')->group(function () {
        Route::get('/alumnos', [StudentController::class, 'index']);
        Route::get('/alumnos/{id}', [StudentController::class, 'show']);
    });

    // GRUPO 2: SOLO ADMIN (Pueden Modificar)
    Route::middleware(CheckRole::class.':ADMIN')->group(function () {
        Route::post('/alumnos', [StudentController::class, 'store']);
        Route::put('/alumnos/{id}', [StudentController::class, 'update']);
        Route::delete('/alumnos/{id}', [StudentController::class, 'destroy']);
    });

});