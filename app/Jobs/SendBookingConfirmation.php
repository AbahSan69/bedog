<?php

namespace App\Jobs;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class SendBookingConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public function __construct(public Booking $booking) {}

    public function handle(): void
{
    // 1. Generate PDF
    $pdf = Pdf::loadView('pdf.booking-confirmation', ['booking' => $this->booking]);
    $pdfContent = $pdf->output();

    $filename = 'booking-' . $this->booking->id . '-' . time() . '.pdf';
    Storage::disk('public')->put('bookings/' . $filename, $pdfContent);

    // 2. Encode PDF ke base64 (kirim langsung, tidak perlu fileUrl lagi)
    $fileBase64 = base64_encode($pdfContent);

    // 3. Normalisasi nomor HP ke format internasional (62xxx)
    $target = preg_replace('/[^0-9]/', '', $this->booking->no_hp);
    if (str_starts_with($target, '0')) {
        $target = '62' . substr($target, 1);
    } elseif (str_starts_with($target, '+62')) {
        $target = substr($target, 1);
    }

    // 4. Kirim ke gateway WhatsApp
    $response = Http::timeout(30)->withHeaders([
        'x-api-key' => config('services.wa_gateway.key'),
    ])->post(config('services.wa_gateway.url') . '/send-document', [
        'target'      => $target,
        'message'     => "Halo {$this->booking->nama}! 🎉\n\nBooking Anda di *Golden Barber* telah *dikonfirmasi*.\n\nDetail lengkap ada di file terlampir. Sampai jumpa!",
        'fileBase64'  => $fileBase64,
        'fileName'    => "Booking-{$this->booking->id}.pdf",
    ]);

    Log::info('WA Gateway Response', [
        'booking_id' => $this->booking->id,
        'target'     => $target,
        'status'     => $response->status(),
        'body'       => $response->body(),
    ]);

    if (!$response->successful()) {
        throw new \Exception('Gagal kirim WA: ' . $response->body());
    }
}

    public function failed(\Throwable $exception): void
    {
        Log::error('Job SendBookingConfirmation gagal total: ' . $exception->getMessage(), [
            'booking_id' => $this->booking->id,
        ]);
    }
}