<?php

use App\Http\Controllers\AgentsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BulletCoinController;
use App\Http\Controllers\CollectibleController;
use App\Http\Controllers\CollectionsController;
use App\Http\Controllers\CratesController;
use App\Http\Controllers\GraffitiController;
use App\Http\Controllers\KeysController;
use App\Http\Controllers\MusicKitsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PatchesController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SkinController;
use App\Http\Controllers\StickersController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\SteamAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\VerifyUser;

// ROUTES SANS AUTHENTIFICATION
Route::post('/payment/create-client-secret', [PaymentController::class, 'createClientSecret']);

Route::put('/product/block/{id}', [ProductController::class, 'blockProduct'])->name('product.block');
Route::put('/product/unblock/{id}', [ProductController::class, 'unblockProduct'])->name('product.block');
// ROUTE CLIENTS
Route::get('steam/login', [SteamAuthController::class, 'loginWithSteam']);
Route::get('steam/callback', [SteamAuthController::class, 'steamCallback'])->name('steam.callback');
Route::get('/steam/profile-url', [SteamAuthController::class, 'getSteamProfileUrl'])->name('steam.profile.url')->withoutMiddleware('user');
Route::get('/user-profile/{id}', [SteamAuthController::class, 'getUserProfile'])->name('user.profile');

Route::get('/cart-remove/', [CartController::class, 'remove'])->name('cart-remove');
Route::get('/product/check-available/{id}', [ProductController::class, "isProductBlocked"])->name('product.check-available');

// ressource routes
Route::resource('product', ProductController::class)->except(['create', 'edit']);
Route::resource('cart', CartController::class)->except(['create', 'edit']);

// ROUTE ADMIN
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// ROUTES AVEC AUTHENTIFICATION
Route::middleware('user')->group(function () {
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
    Route::resource('bulletcoin', BulletCoinController::class)->except(['create', 'edit', 'index', 'destroy']);
    Route::resource('transaction', TransactionController::class)->except(['create', 'edit', 'update', 'destroy']);
    Route::resource('order', OrderController::class)->except(['create', 'edit']);
    Route::get('/user/orders', [OrderController::class, 'getOrders']);
    Route::get('/transaction/{id}/last', [TransactionController::class, 'getLastTransaction']);
    Route::post('/sync/game/{id}', [BulletCoinController::class, 'syncGameAttempts']);
    Route::get('/sync/game/check-if-user-can-play/{id}', [BulletCoinController::class, 'checkIfUserCanPlay']);
});

// ROUTES AVEC AUTHENTIFICATION ADMIN
Route::middleware('admin')->group(function () {
    Route::get('/admin/users', [AdminAuthController::class, 'getAllUsers']);
    Route::get('/admin/users/{id}/orders', [OrderController::class, 'getOrdersForUser']);
});
