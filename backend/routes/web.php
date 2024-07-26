<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SteamAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

Route::get('auth/steam', [SteamAuthController::class, 'redirectToSteam'])->name('steam.login');
Route::get('auth/steam/callback', [SteamAuthController::class, 'handleSteamCallback'])->name('steam.callback');
Route::get('/steam', [SteamAuthController::class, 'showSteamLogin'])->name('steam');
