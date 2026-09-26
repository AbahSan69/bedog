<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CapsterController;



/*
|--------------------------------------------------------------------------
| Web Routes - Sistem Manajemen Booking Barbershop
|--------------------------------------------------------------------------
*/

// --- HALAMAN PUBLIK / PELANGGAN ---
Route::get('/', [BookingController::class, 'index'])->name('booking.index');
Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');

// --- FILE PDF BOOKING (untuk diakses gateway WhatsApp) ---
Route::get('/booking-file/{filename}', function ($filename) {
    $path = 'bookings/' . $filename;

    if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return response(\Illuminate\Support\Facades\Storage::disk('public')->get($path), 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
})->name('booking.file');

// --- AUTHENTIKASI ADMIN ---
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// --- HALAMAN ADMIN (TERPROTEKSI AUTH MIDDLEWARE) ---
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [BookingController::class, 'admin'])->name('admin.index');
    Route::patch('/admin/booking/{id}/status', [BookingController::class, 'updateStatus'])->name('admin.updateStatus');
    Route::delete('/admin/booking/{id}', [BookingController::class, 'destroy'])->name('admin.destroy');
    Route::get('/capster', [CapsterController::class, 'index'])->name('admin.capster.index');
    Route::get('/capster/create', [CapsterController::class, 'create'])->name('admin.capster.create');
    Route::post('/capster', [CapsterController::class, 'store'])->name('admin.capster.store');
    Route::get('/capster/{capster}/edit', [CapsterController::class, 'edit'])->name('admin.capster.edit');
    Route::put('/capster/{capster}', [CapsterController::class, 'update'])->name('admin.capster.update');
    Route::delete('/capster/{capster}', [CapsterController::class, 'destroy'])->name('admin.capster.destroy');  
    });