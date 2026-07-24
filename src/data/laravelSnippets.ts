export const laravelCodeSnippets = {
  terminalAwal: `# 1. Perintah Terminal Awal

# Buat proyek Laravel baru versi terbaru
composer create-project laravel/laravel barbershop-booking

# Masuk ke direktori proyek
cd barbershop-booking

# Jalankan MySQL di XAMPP Control Panel (Start Apache & MySQL)
# Buat database baru di phpMyAdmin (http://localhost/phpmyadmin) dengan nama 'barbershop_booking'
# Atau jalankan query SQL: CREATE DATABASE barbershop_booking;

# Buat Model 'Booking' beserta file Migration (-m) dan Controller (-c)
php artisan make:model Booking -mc

# Buat Auth Controller untuk fitur Login Admin
php artisan make:controller AuthController`,

  envConfig: `# 2. Konfigurasi Database MySQL (XAMPP) (.env)
# Sesuaikan kredensial MySQL dengan server XAMPP lokal Anda.

APP_NAME="Barbershop Booking"
APP_ENV=local
APP_KEY=base64:X8k9Lp...
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# --- Konfigurasi MySQL (XAMPP) ---
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barbershop_booking
DB_USERNAME=root
DB_PASSWORD=
`,

  migration: `<?php
// 3. Kode Migration: database/migrations/2026_01_01_000000_create_bookings_table.php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Jalankan skema migrasi tabel bookings.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();                     // Primary Key
            $table->string('nama');           // Nama Lengkap Pelanggan
            $table->string('no_hp');          // Nomor HP/WhatsApp Pelanggan
            $table->string('layanan');        // Pilihan Layanan Barbershop
            $table->string('barber');         // Pilihan Kapster / Barber
            $table->date('tanggal');          // Tanggal Booking
            $table->string('waktu');          // Jam / Slot Waktu Booking
            $table->enum('status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'])->default('Pending');
            $table->timestamps();             // Column created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi (Rollback).
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};`,

  model: `<?php
// 4. Kode Model: app/Models/Booking.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Booking extends Model
{
    use HasFactory;

    // Nama tabel di database (opsional jika sesuai konvensi jamak 'bookings')
    protected $table = 'bookings';

    // Kolom yang diizinkan untuk diisi secara Mass Assignment
    protected $fillable = [
        'nama',
        'no_hp',
        'layanan',
        'barber',
        'tanggal',
        'waktu',
        'status',
    ];

    // Format casting kolom tanggal jika diperlukan
    protected $casts = [
        'tanggal' => 'date',
        'created_at' => 'datetime',
    ];
}`,

  controller: `<?php
// 5. Kode Controller Booking: app/Http/Controllers/BookingController.php

namespace App\\Http\\Controllers;

use App\\Models\\Booking;
use Illuminate\\Http\\Request;

class BookingController extends Controller
{
    /**
     * Menampilkan Halaman Pelanggan (Formulir Booking)
     * URL: GET /
     */
    public function index()
    {
        $layananList = [
            'Haircut (Potong Rambut)',
            'Shaving (Cukur Jenggot)',
            'Hair Color (Pewarnaan)',
            'Full Package (Lengkap)',
        ];

        $barberList = [
            'Barber 1 (Budi)',
            'Barber 2 (Andi)',
            'Barber 3 (Rian)',
        ];

        return view('booking', compact('layananList', 'barberList'));
    }

    /**
     * Menyimpan data booking dari formulir pelanggan ke database
     * URL: POST /booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'    => 'required|string|max:255',
            'no_hp'   => 'required|string|max:20',
            'layanan' => 'required|string',
            'barber'  => 'required|string',
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu'   => 'required|string',
        ], [
            'nama.required'    => 'Nama lengkap wajib diisi.',
            'no_hp.required'   => 'Nomor HP/WhatsApp wajib diisi.',
            'layanan.required' => 'Silakan pilih layanan yang diinginkan.',
            'barber.required'  => 'Silakan pilih kapster/barber yang diinginkan.',
            'tanggal.required' => 'Tanggal booking wajib dipilih.',
            'tanggal.after_or_equal' => 'Tanggal booking tidak boleh hari yang lalu.',
            'waktu.required'   => 'Waktu booking wajib dipilih.',
        ]);

        $validated['status'] = 'Pending';

        $booking = Booking::create($validated);

        return redirect()->back()->with('success', 'Pemesanan Anda berhasil dibuat! ID Pesanan Anda: #' . $booking->id . '. Kami akan menghubungi Anda via WhatsApp.');
    }

    /**
     * Menampilkan Halaman Admin (Daftar Booking)
     * Terproteksi Middleware Auth (Hanya bisa diakses setelah login)
     * URL: GET /admin
     */
    public function admin()
    {
        $bookings = Booking::orderBy('created_at', 'desc')->get();

        return view('admin', compact('bookings'));
    }

    /**
     * Mengubah status booking (Admin Action)
     * URL: PATCH /admin/booking/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Completed,Cancelled',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status booking #' . $id . ' berhasil diperbarui.');
    }
}`,

  authController: `<?php
// 6. Kode Auth Controller: app/Http/Controllers/AuthController.php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class AuthController extends Controller
{
    /**
     * Menampilkan Halaman Formulir Login Admin
     * URL: GET /login
     */
    public function showLoginForm()
    {
        if (Auth::check()) {
            return redirect()->route('admin.index');
        }

        return view('auth.login');
    }

    /**
     * Memproses Authentikasi Login Admin
     * URL: POST /login
     */
    public function login(Request $request)
    {
        // 1. Validasi Inputan Login
        $credentials = $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ], [
            'email.required'    => 'Username atau email wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        // 2. Coba autentikasi menggunakan Auth::attempt()
        // Mengizinkan login baik menggunakan Email atau Username
        $fieldType = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (Auth::attempt([$fieldType => $request->email, 'password' => $request->password], $request->remember)) {
            $request->session()->regenerate();

            return redirect()->intended(route('admin.index'))
                ->with('success', 'Selamat datang kembali, ' . Auth::user()->name . '!');
        }

        // 3. Jika Kredensial Salah
        return back()->withErrors([
            'email' => 'Username/Email atau password yang Anda masukkan salah.',
        ])->onlyInput('email');
    }

    /**
     * Memproses Logout Admin
     * URL: POST /logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Anda telah berhasil logout.');
    }
}`,

  routes: `<?php
// 7. Kode Routes: routes/web.php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\BookingController;
use App\\Http\\Controllers\\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes - Sistem Manajemen Booking Barbershop
|--------------------------------------------------------------------------
*/

// --- HALAMAN PUBLIK / PELANGGAN ---
Route::get('/', [BookingController::class, 'index'])->name('booking.index');
Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');

// --- AUTHENTIKASI ADMIN ---
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// --- HALAMAN ADMIN (TERPROTEKSI AUTH MIDDLEWARE) ---
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [BookingController::class, 'admin'])->name('admin.index');
    Route::patch('/admin/booking/{id}/status', [BookingController::class, 'updateStatus'])->name('admin.updateStatus');
});`,

  authView: `<!-- 8. View Login Admin: resources/views/auth/login.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Barbershop Booking</title>
    <!-- Bootstrap 5 CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-h: 100vh; display: flex; align-items: center; }
        .card-login { background: #1e293b; border: 1px solid #334155; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 700; border: none; }
        .btn-gold:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .form-control { background-color: #0f172a; border: 1px solid #475569; color: #fff; }
        .form-control:focus { background-color: #0f172a; border-color: #f59e0b; color: #fff; box-shadow: 0 0 0 0.25rem rgba(245, 158, 11, 0.25); }
    </style>
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card card-login p-4">
                    
                    <div class="text-center mb-4">
                        <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                            <i class="fa-solid fa-user-shield fa-2x"></i>
                        </div>
                        <h3 class="fw-bold text-white mb-1">Login Admin</h3>
                        <p class="text-secondary small">Barbercraft Management Portal</p>
                    </div>

                    <!-- Alert Kredensial Demo -->
                    <div class="alert alert-dark border-secondary text-warning small mb-3">
                        <i class="fa-solid fa-lightbulb me-1"></i> <strong>Akun Demo:</strong><br>
                        Email/User: <code>admin@barbershop.com</code><br>
                        Password: <code>admin123</code>
                    </div>

                    <!-- Notification Alert -->
                    @if(session('success'))
                        <div class="alert alert-success small mb-3">
                            {{ session('success') }}
                        </div>
                    @endif

                    @if($errors->any())
                        <div class="alert alert-danger small mb-3">
                            <ul class="mb-0 ps-3">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form action="{{ route('login.post') }}" method="POST">
                        @csrf
                        
                        <div class="mb-3">
                            <label for="email" class="form-label text-secondary small text-uppercase font-weight-bold">Email / Username</label>
                            <div class="input-group">
                                <span class="input-group-text bg-dark border-secondary text-secondary"><i class="fa-solid fa-user"></i></span>
                                <input type="text" class="form-control" id="email" name="email" value="{{ old('email', 'admin@barbershop.com') }}" required placeholder="admin@barbershop.com">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="password" class="form-label text-secondary small text-uppercase font-weight-bold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-dark border-secondary text-secondary"><i class="fa-solid fa-key"></i></span>
                                <input type="password" class="form-control" id="password" name="password" value="admin123" required placeholder="••••••••">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-gold w-100 py-2.5">
                            <i class="fa-solid fa-right-to-bracket me-2"></i> Masuk ke Dashboard
                        </button>
                    </form>

                    <div class="text-center mt-4 pt-2 border-top border-secondary">
                        <a href="{{ route('booking.index') }}" class="text-secondary text-decoration-none small">
                            <i class="fa-solid fa-arrow-left me-1"></i> Kembali ke Form Booking
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</body>
</html>`,

  seeder: `<?php
// 9. Kode Seeder User Admin: database/seeders/DatabaseSeeder.php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan seeder database untuk membuat akun Admin default.
     */
    public function run(): void
    {
        // Buat atau perbarui akun Super Admin
        User::updateOrCreate(
            ['email' => 'admin@barbershop.com'],
            [
                'name'     => 'Administrator Barbershop',
                'password' => Hash::make('admin123'),
            ]
        );
    }
}`,

  viewBooking: `<!-- 10. View Pelanggan: resources/views/booking.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Jadwal - Barbershop Premier</title>
    <!-- Bootstrap 5 CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
        .btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 600; border: none; }
        .btn-gold:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .form-control, .form-select { background-color: #0f172a; border: 1px solid #475569; color: #fff; }
        .form-control:focus, .form-select:focus { background-color: #0f172a; border-color: #f59e0b; color: #fff; box-shadow: 0 0 0 0.25rem rgba(245, 158, 11, 0.25); }
    </style>
</head>
<body class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                
                <div class="text-center mb-4">
                    <h1 class="fw-bold text-warning"><i class="fa-solid fa-scissors me-2"></i>BARBERCRAFT</h1>
                    <p class="text-secondary">Pesan Jadwal Potong Rambut & Grooming Pria Online</p>
                </div>

                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="fa-solid fa-circle-check me-2"></i> {{ session('success') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                <div class="card card-custom p-4 shadow-lg">
                    <h4 class="mb-3 text-light border-bottom border-secondary pb-2">Formulir Booking Pelanggan</h4>
                    
                    <form action="{{ route('booking.store') }}" method="POST">
                        @csrf
                        
                        <!-- Nama Lengkap -->
                        <div class="mb-3">
                            <label for="nama" class="form-label text-secondary">Nama Lengkap <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="nama" name="nama" value="{{ old('nama') }}" required placeholder="Contoh: Ahmad Rizki">
                        </div>

                        <!-- Nomor HP / WhatsApp -->
                        <div class="mb-3">
                            <label for="no_hp" class="form-label text-secondary">Nomor WhatsApp / HP <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="no_hp" name="no_hp" value="{{ old('no_hp') }}" required placeholder="Contoh: 081234567890">
                        </div>

                        <!-- Pilihan Layanan -->
                        <div class="mb-3">
                            <label for="layanan" class="form-label text-secondary">Pilihan Layanan <span class="text-danger">*</span></label>
                            <select class="form-select" id="layanan" name="layanan" required>
                                <option value="" disabled {{ old('layanan') ? '' : 'selected' }}>-- Pilih Layanan Barbershop --</option>
                                <option value="Haircut (Potong Rambut)" {{ old('layanan') == 'Haircut (Potong Rambut)' ? 'selected' : '' }}>Haircut (Potong Rambut)</option>
                                <option value="Shaving (Cukur Jenggot)" {{ old('layanan') == 'Shaving (Cukur Jenggot)' ? 'selected' : '' }}>Shaving (Cukur Jenggot)</option>
                                <option value="Hair Color (Pewarnaan)" {{ old('layanan') == 'Hair Color (Pewarnaan)' ? 'selected' : '' }}>Hair Color (Pewarnaan Rambut)</option>
                                <option value="Full Package (Lengkap)" {{ old('layanan') == 'Full Package (Lengkap)' ? 'selected' : '' }}>Full Package (Lengkap)</option>
                            </select>
                        </div>

                        <!-- Pilihan Barber -->
                        <div class="mb-3">
                            <label for="barber" class="form-label text-secondary">Pilihan Kapster / Barber <span class="text-danger">*</span></label>
                            <select class="form-select" id="barber" name="barber" required>
                                <option value="" disabled {{ old('barber') ? '' : 'selected' }}>-- Pilih Kapster Favorit --</option>
                                <option value="Barber 1 (Budi)" {{ old('barber') == 'Barber 1 (Budi)' ? 'selected' : '' }}>Barber 1 (Budi)</option>
                                <option value="Barber 2 (Andi)" {{ old('barber') == 'Barber 2 (Andi)' ? 'selected' : '' }}>Barber 2 (Andi)</option>
                                <option value="Barber 3 (Rian)" {{ old('barber') == 'Barber 3 (Rian)' ? 'selected' : '' }}>Barber 3 (Rian)</option>
                            </select>
                        </div>

                        <!-- Tanggal & Waktu -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="tanggal" class="form-label text-secondary">Tanggal <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="tanggal" name="tanggal" value="{{ old('tanggal', date('Y-m-d')) }}" min="{{ date('Y-m-d') }}" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="waktu" class="form-label text-secondary">Waktu / Jam <span class="text-danger">*</span></label>
                                <input type="time" class="form-control" id="waktu" name="waktu" value="{{ old('waktu') }}" required>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-gold w-100 py-3 mt-3 fs-5">
                            <i class="fa-solid fa-calendar-check me-2"></i> Kirim Pesanan Booking
                        </button>
                    </form>
                </div>
                
                <div class="text-center mt-4">
                    <a href="{{ route('admin.index') }}" class="text-secondary text-decoration-none small">
                        <i class="fa-solid fa-lock me-1"></i> Masuk ke Dashboard Admin
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"></script>
</body>
</html>`,

  viewAdmin: `<!-- 11. View Admin: resources/views/admin.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Daftar Booking Barbershop</title>
    <!-- Bootstrap 5 CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
        .table-dark-custom { background-color: #1e293b; color: #f8fafc; }
        .table-dark-custom th { background-color: #334155; color: #f59e0b; border-color: #475569; }
        .table-dark-custom td { border-color: #334155; vertical-align: middle; }
    </style>
</head>
<body class="py-4">
    <div class="container-fluid px-lg-5">
        
        <!-- Navigation Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
            <div>
                <h2 class="fw-bold text-warning mb-0"><i class="fa-solid fa-scissors me-2"></i>BARBERCRAFT - DASHBOARD ADMIN</h2>
                <p class="text-secondary small mb-0">Halaman Pengelolaan Data Booking Pelanggan (Terproteksi Login)</p>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="text-light small"><i class="fa-solid fa-user-circle me-1 text-warning"></i> {{ Auth::user()->name }}</span>
                <form action="{{ route('logout') }}" method="POST" class="d-inline">
                    @csrf
                    <button type="submit" class="btn btn-outline-danger btn-sm">
                        <i class="fa-solid fa-right-from-bracket me-1"></i> Logout
                    </button>
                </form>
            </div>
        </div>

        <!-- Table Data -->
        <div class="card card-custom p-3 shadow-lg">
            <div class="table-responsive">
                <table class="table table-dark-custom table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th>Nama Pelanggan</th>
                            <th>No. WhatsApp</th>
                            <th>Layanan</th>
                            <th>Kapster/Barber</th>
                            <th>Tanggal & Waktu</th>
                            <th>Status</th>
                            <th>Waktu Buat</th>
                            <th className="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($bookings as $item)
                            <tr>
                                <td class="text-center font-monospace fw-bold text-warning">#{{ $item->id }}</td>
                                <td class="fw-bold text-light">{{ $item->nama }}</td>
                                <td>
                                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $item->no_hp) }}" target="_blank" class="text-success text-decoration-none">
                                        <i class="fa-brands fa-whatsapp me-1"></i>{{ $item->no_hp }}
                                    </a>
                                </td>
                                <td><span class="badge bg-secondary">{{ $item->layanan }}</span></td>
                                <td><span class="badge bg-dark text-warning border border-warning">{{ $item->barber }}</span></td>
                                <td class="font-monospace">
                                    {{ $item->tanggal->format('Y-m-d') }} <br>
                                    <span class="text-warning fw-bold">{{ $item->waktu }} WIB</span>
                                </td>
                                <td>
                                    @if($item->status == 'Confirmed')
                                        <span class="badge bg-success">Confirmed</span>
                                    @elseif($item->status == 'Completed')
                                        <span class="badge bg-info text-dark">Completed</span>
                                    @elseif($item->status == 'Cancelled')
                                        <span class="badge bg-danger">Cancelled</span>
                                    @else
                                        <span class="badge bg-warning text-dark">Pending</span>
                                    @endif
                                </td>
                                <td class="small text-secondary">
                                    {{ $item->created_at ? $item->created_at->format('d-M-Y H:i') : '-' }}
                                </td>
                                <td class="text-center">
                                    <form action="{{ route('admin.updateStatus', $item->id) }}" method="POST" class="d-inline-block">
                                        @csrf
                                        @method('PATCH')
                                        <select name="status" onchange="this.form.submit()" class="form-select form-select-sm bg-dark text-light border-secondary">
                                            <option value="Pending" {{ $item->status == 'Pending' ? 'selected' : '' }}>Pending</option>
                                            <option value="Confirmed" {{ $item->status == 'Confirmed' ? 'selected' : '' }}>Confirmed</option>
                                            <option value="Completed" {{ $item->status == 'Completed' ? 'selected' : '' }}>Completed</option>
                                            <option value="Cancelled" {{ $item->status == 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
                                        </select>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center py-5 text-secondary">
                                    <i class="fa-regular fa-folder-open fa-2x mb-2 d-block"></i>
                                    Belum ada data pesanan booking yang masuk.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`,

  terminalAkhir: `# 12. Perintah Terminal Akhir (XAMPP MySQL, Migration & Seeder)

# Langkah A: Pastikan MySQL di XAMPP Control Panel sudah AKTIF (Start MySQL & Apache)

# Langkah B: Buka phpMyAdmin (http://localhost/phpmyadmin)
# Buat database baru bernama: barbershop_booking

# Langkah C: Jalankan Migrasi dan Seeder Admin Default
php artisan migrate --seed

# Langkah D: Jalankan Server Lokal Laravel
php artisan serve

# Aplikasi dapat diakses di browser:
# Halaman Utama Pelanggan: http://127.0.0.1:8000/
# Halaman Login Admin:     http://127.0.0.1:8000/login
# Halaman Dashboard Admin: http://127.0.0.1:8000/admin`,
};
