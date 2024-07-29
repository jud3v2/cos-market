<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SteamAuthController;
use Tymon\JWTAuth\Facades\JWTAuth;


Route::get('/', function () {
    return view('welcome');
});

