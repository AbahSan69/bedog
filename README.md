# Sistem Manajemen Booking Barbershop (Laravel)

Sistem Web Manajemen Booking Barbershop adalah aplikasi berbasis web yang dibangun dengan framework **Laravel**. Aplikasi ini memudahkan pelanggan untuk melakukan pemesanan (booking) jadwal potong rambut secara online dan membantu pemilik/admin barbershop mengelola daftar pesanan secara terpusat.

---

## 🌟 Fitur Utama

1. **Halaman Pelanggan (`/`)**:
   - Formulir Pemesanan Booking Online (Nama, Nomor HP/WhatsApp, Layanan, Barber, Tanggal, Waktu).
   - Perlindungan Keamanan CSRF (`@csrf`).
   - Validasi input di sisi Controller & pesan error interaktif.
   - Flash Message / Notifikasi Sukses setelah booking berhasil dikirim.
   - Fitur Cek Status Booking berbasis Nomor WhatsApp.

2. **Halaman Admin & Login Proteksi (`/login` & `/admin`)**:
   - **Fitur Login Admin**: Akses terproteksi menggunakan Laravel Auth Middleware (`Route::middleware('auth')`).
   - **Kredensial Default Admin**: Username/Email: `admin@barbershop.com` | Password: `admin123`.
   - Tabel Daftar Booking realtime diurutkan dari yang terbaru (`created_at` descending).
   - Format tanggal & waktu yang rapi (`d-M-Y H:i`).
   - Fitur Filter berdasarkan Barber, Layanan, dan Tanggal.
   - Fitur Pencarian berdasarkan Nama atau Nomor HP Pelanggan.
   - Manajemen Status Booking (*Pending*, *Confirmed*, *Completed*, *Cancelled*).
   - Tombol cepat menghubungi pelanggan via WhatsApp API Direct Link.
   - Tombol Logout Admin dengan keamanan proteksi session invalidation (`Auth::logout()`).

---

## 🛠️ Prasyarat Sistem

Sebelum menjalankan aplikasi ini, pastikan sistem Anda telah memenuhi prasyarat berikut:

- **PHP**: Version `>= 8.1` (Sesuai kebutuhan Laravel 10/11).
- **Composer**: Dependency Manager untuk PHP (`>= 2.x`).
- **MySQL / MariaDB**: Melalui XAMPP Control Panel.
- **Ekstensi PHP**: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `curl`.
- **Web Browser**: Chrome, Edge, Firefox, atau Safari modern.

---

## 🚀 Langkah-Langkah Instalasi & Setup (MySQL / XAMPP)

Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan aplikasi di komputer lokal Anda menggunakan XAMPP:

### 1. Dapatkan Kode Proyek
Buat proyek baru atau extract file proyek ke direktori lokal Anda:
```bash
composer create-project laravel/laravel barbershop-booking
cd barbershop-booking
```

### 2. Jalankan MySQL di XAMPP & Buat Database
1. Buka **XAMPP Control Panel**.
2. Klik tombol **Start** pada modul **Apache** dan **MySQL**.
3. Buka **phpMyAdmin** melalui browser di `http://localhost/phpmyadmin`.
4. Buat database baru bernama `barbershop_booking`.

### 3. Buat Model, Migration, & Controller
Jalankan perintah Artisan berikut untuk membuat struktur komponen MVC:
```bash
php artisan make:model Booking -mc
```
*Keterangan flag:*
- `-m` : Membuat file migration (`database/migrations/xxxx_xx_xx_create_bookings_table.php`)
- `-c` : Membuat file controller (`app/Http/Controllers/BookingController.php`)

### 4. Konfigurasi Database MySQL (.env)
Buka file `.env` di root direktori proyek, lalu atur konfigurasi database MySQL XAMPP:

```env
APP_NAME="Barbershop Booking"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Konfigurasi Database MySQL (XAMPP)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barbershop_booking
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Eksekusi Migrasi Database
Jalankan perintah berikut untuk membuat tabel `bookings` di database MySQL:
```bash
php artisan migrate
```

### 6. Jalankan Development Server
Jalankan server bawaan Laravel:
```bash
php artisan serve
```

Aplikasi sekarang dapat diakses melalui browser di:
- **Halaman Pelanggan**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Halaman Admin**: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

---

## 📁 Struktur Berkas Proyek Laravel

```text
barbershop-booking/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── BookingController.php   # Logic kontroler (index, store, admin)
│   └── Models/
│       └── Booking.php                  # Model Eloquent dengan $fillable
├── database/
│   ├── migrations/
│   │   └── xxxx_xx_xx_create_bookings_table.php  # Schema tabel bookings
│   └── database.sqlite                 # File database SQLite
├── resources/
│   └── views/
│       ├── booking.blade.php           # Tampilan formulir booking pelanggan
│       └── admin.blade.php             # Tampilan dashboard admin
├── routes/
│   └── web.php                         # Routing URL (/ & /admin)
└── .env                                # Konfigurasi lingkungan
```

---

## 💻 Lisensi & Kontribusi
Dikembangkan untuk keperluan manajemen operasional Barbershop. Bebas dimodifikasi dan dikembangkan sesuai kebutuhan.
