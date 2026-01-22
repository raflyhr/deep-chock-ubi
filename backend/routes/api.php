<?php

use App\Http\Controllers\Api\Auth\{
    LoginController,
    LogoutController,
};
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// contact
Route::get('/menu', [MenuController::class, 'menu']);
Route::post('/contact', [MessageController::class, 'store']);

// order
Route::post('/order-buat', [OrderController::class, 'store']);
Route::get('/order/{code}', [OrderController::class, 'show']);

Route::post('/login', [LoginController::class, 'login']);
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/logout', [LogoutController::class, 'logout']);

    // dashboard
    Route::get('/stats', [DashboardController::class, 'index']);

    // messages
    Route::get('/messages', [MessageController::class, 'index']);
    // menu
    Route::get('/menu', [MenuController::class, 'index']);
    Route::post('/menu-tambah', [MenuController::class, 'store']);
    Route::post('/menu-update/{menu}', [MenuController::class, 'update']);
    Route::delete('/menu-hapus/{menu}', [MenuController::class, 'destroy']);

    // order
    Route::get('/order', [OrderController::class, 'index']);
    Route::get('/order/export', [OrderController::class, 'export']);
    Route::post('/order-status/{order}', [OrderController::class, 'updateStatus']);
});
