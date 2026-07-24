<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan skema migrasi tabel bookings.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();                     // Primary Key (ID Auto Increment)
            $table->string('nama');           // Nama Lengkap Pelanggan
            $table->string('no_hp');          // Nomor HP/WhatsApp
            $table->string('layanan');        // Pilihan Layanan
            $table->string('barber');         // Pilihan Kapster/Barber
            $table->date('tanggal');          // Tanggal Booking
            $table->string('waktu');          // Waktu/Jam Booking
            $table->enum('status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'])->default('Pending'); // Status
            $table->timestamps();             // Otomatis created_at dan updated_at
        });
    }

    /**
     * Batalkan migrasi (drop table).
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};