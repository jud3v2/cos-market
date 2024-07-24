<?php

use Illuminate\Support\Facades\Route;

Route::post('/api/login', 'AuthController@login');
Route::post('/api/register', 'AuthController@register');
