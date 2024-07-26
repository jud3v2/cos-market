<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SkinController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::resource('skin', SkinController::class)->except(['create', 'edit']);
