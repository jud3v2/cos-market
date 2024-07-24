<?php

use Illuminate\Support\Facades\Route;

require __DIR__ . '/api/users/index.php';

Route::get('/', function () {
    return view('welcome');
});
