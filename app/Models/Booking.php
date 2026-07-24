<?php
// 4. Kode Model: app/Models/Booking.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Nama tabel di database (opsional jika sesuai konvensi jamak 'bookings')
    protected $table = 'bookings';

    // Kolom yang diizinkan untuk diisi secara Mass Assignment
    protected $fillable = [
        
        'nomor_antrian',
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
}