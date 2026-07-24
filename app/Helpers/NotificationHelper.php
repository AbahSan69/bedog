<?php
// 13. Helper Notifikasi & Google Calendar: app/Helpers/NotificationHelper.php

namespace App\Helpers;

use App\Models\Booking;
use Carbon\Carbon;

class NotificationHelper
{
    /**
     * Menghasilkan URL Google Calendar Event (Gratis Tanpa API Key)
     */
    public static function generateGoogleCalendarUrl(Booking $booking): string
    {
        $start = Carbon::parse($booking->tanggal->format('Y-m-d') . ' ' . $booking->waktu, 'Asia/Jakarta')->utc();
        $end = (clone $start)->addHour();

        $startIso = $start->format('Ymd\\THis\\Z');
        $endIso = $end->format('Ymd\\THis\\Z');

        $title = urlencode("✂️ Booking Barbershop - " . $booking->layanan . " (#" . $booking->id . ")");
        $details = urlencode(
            "Konfirmasi Booking Barbershop Barbercraft\\n\\n" .
            "👤 Pelanggan: " . $booking->nama . "\\n" .
            "📱 WhatsApp: " . $booking->no_hp . "\\n" .
            "✂️ Layanan: " . $booking->layanan . "\\n" .
            "💈 Kapster: " . $booking->barber . "\\n" .
            "📅 Waktu: " . $booking->tanggal->format('d-M-Y') . " jam " . $booking->waktu . " WIB"
        );
        $location = urlencode("Barbercraft Barbershop, Jl. Utama No. 8, Jakarta");

        return "https://calendar.google.com/calendar/render?action=TEMPLATE&text={$title}&dates={$startIso}/{$endIso}&details={$details}&location={$location}";
    }

    /**
     * Menghasilkan Draf Pesan Konfirmasi WhatsApp Direct Link
     */
    public static function generateWhatsAppUrl(Booking $booking, string $role = 'customer'): string
    {
        $cleanPhone = preg_replace('/[^0-9]/', '', $booking->no_hp);
        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = '62' . substr($cleanPhone, 1);
        }

        if ($role === 'admin') {
            $message = "Halo Sdr. {$booking->nama},\\n\\nBooking Anda di *Barbercraft* (#{$booking->id}) untuk layanan {$booking->layanan} pada {$booking->tanggal->format('d-M-Y')} jam {$booking->waktu} WIB telah kami *KONFIRMASI*! ✅\\n\\nSampai jumpa di lokasi!";
            return "https://wa.me/{$cleanPhone}?text=" . urlencode($message);
        } else {
            $message = "Halo Admin Barbercraft, saya ingin konfirmasi booking #{$booking->id} atas nama {$booking->nama} untuk tanggal {$booking->tanggal->format('d-M-Y')} jam {$booking->waktu} WIB.";
            return "https://wa.me/6281234567890?text=" . urlencode($message);
        }
    }
};