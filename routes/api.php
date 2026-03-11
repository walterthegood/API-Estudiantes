<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

// Esta ruta es pública: http://walter-laravel-11.test/api/login
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Ruta protegida por Sanctum Y por nuestro Middleware de Roles
    Route::get('/alumnos', [StudentController::class, 'index'])
        ->middleware(CheckRole::class.':ADMIN,PROFESOR'); 
        
});
