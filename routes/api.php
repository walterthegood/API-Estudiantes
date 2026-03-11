<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Esta ruta es pública: http://walter-laravel-11.test/api/login
Route::post('/login', [AuthController::class, 'login']);
