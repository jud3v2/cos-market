<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;
use Illuminate\Support\Facades\Route;

//ROUTE ADMIN
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// ROUTE CLIENTS
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
