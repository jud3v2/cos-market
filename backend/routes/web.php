<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SteamAuthController;
use Tymon\JWTAuth\Facades\JWTAuth;


Route::get('/', function () {
    return view('welcome');
});

<<<<<<< HEAD
=======
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

Route::get('auth/steam', [SteamAuthController::class, 'redirectToSteam'])->name('steam.login');
Route::get('auth/steam/callback', [SteamAuthController::class, 'handleSteamCallback'])->name('steam.callback');

Route::middleware('auth.jwt')->get('/user', function (Request $request) {
    return $request->user();
});
>>>>>>> ea7608b ([MERGE] branch flo)
