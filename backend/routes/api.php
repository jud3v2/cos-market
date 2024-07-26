<?php

use App\Http\Controllers\AgentsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollectibleController;
use App\Http\Controllers\CollectionsController;
use App\Http\Controllers\CratesController;
use App\Http\Controllers\GraffitiController;
use App\Http\Controllers\KeysController;
use App\Http\Controllers\MusicKitsController;
use App\Http\Controllers\PatchesController;
use App\Http\Controllers\SkinController;
use App\Http\Controllers\StickersController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::resource('skin', SkinController::class)->except(['create', 'edit']);
Route::resource('agent', AgentsController::class)->except(['create', 'edit']);
Route::resource('collectible', CollectibleController::class)->except(['create', 'edit']);
Route::resource('collection', CollectionsController::class)->except(['create', 'edit']);
Route::resource('crate', CratesController::class)->except(['create', 'edit']);
Route::resource('graffiti', GraffitiController::class)->except(['create', 'edit']);
Route::resource('key', KeysController::class)->except(['create', 'edit']);
Route::resource('music-kit', MusicKitsController::class)->except(['create', 'edit']);
Route::resource('patches', PatchesController::class)->except(['create', 'edit']);
Route::resource('stickers', StickersController::class)->except(['create', 'edit']);
