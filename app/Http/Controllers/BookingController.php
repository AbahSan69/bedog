<?php
// 5. Kode Controller Booking: app/Http/Controllers/BookingController.php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $barbers = \App\Models\Capster::where('status', 'Aktif')->get(); 

        return view('welcome', compact('layananList', 'barbers'));
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

    $booking = DB::transaction(function () use ($validated) {
        // lock baris booking di tanggal yang sama, supaya tidak ada request lain
        // menghitung count() secara bersamaan sebelum insert selesai
        $nomorAntrian = Booking::whereDate('tanggal', $validated['tanggal'])
            ->lockForUpdate()
            ->count() + 1;

        $validated['status'] = 'Pending';
        $validated['nomor_antrian'] = $nomorAntrian;

        return Booking::create($validated);
    });

    return redirect()->back()->with(
        'success',
        'Pemesanan Anda berhasil dibuat! Nomor antrian Anda: #' . $booking->nomor_antrian .
        ' (tanggal ' . \Carbon\Carbon::parse($booking->tanggal)->format('d M Y') . '). Kami akan menghubungi Anda via WhatsApp.'
    );
}    /**
     * Menampilkan Halaman Admin (Daftar Booking)
     * Terproteksi Middleware Auth (Hanya bisa diakses setelah login)
     * URL: GET /admin
     */
    public function admin()
    {
        $bookings = Booking::orderBy('created_at', 'desc')->get();

        return view('admin.index', compact('bookings'));
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
    $oldStatus = $booking->status; // tangkap status LAMA dulu, sebelum update

    $booking->update(['status' => $request->status]);

    // hanya kirim notif kalau status BERUBAH dari selain Confirmed → jadi Confirmed
    if ($oldStatus !== 'Confirmed' && $booking->status === 'Confirmed') {
        \App\Jobs\SendBookingConfirmation::dispatch($booking);
    }

    return redirect()->back()->with('success', 'Status booking #' . $id . ' berhasil diperbarui.');
}
public function destroy($id)
{
    $booking = Booking::findOrFail($id);
    $booking->delete();

    return redirect()->back()->with('success', 'Booking #' . $id . ' berhasil dihapus.');   
}}