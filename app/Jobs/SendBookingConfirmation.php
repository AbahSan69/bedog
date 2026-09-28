<?php

namespace App\Jobs;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendBookingConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = 30;
    public $timeout = 120;

    public function __construct(public Booking $booking) {}

    public function handle(): void
    {
        $id = $this->booking->id;
        Log::info("[WA] Mulai proses booking #{$id}");

        // 1. Validasi nomor HP (tidak perlu retry kalau kosong)
        $target = $this->normalizePhone($this->booking->no_hp);
        if (!$target) {
            Log::warning("[WA] Booking #{$id} dilewati: no_hp kosong/tidak valid", [
                'no_hp' => $this->booking->no_hp,
            ]);
            return;
        }

        // 2. Validasi config gateway
        $url = config('services.wa_gateway.url');
        $key = config('services.wa_gateway.key');
        if (!$url || !$key) {
            throw new \RuntimeException(
                'Config services.wa_gateway.url / key kosong. Cek config/services.php dan variabel Railway.'
            );
        }

        // 3. Generate PDF (tidak disimpan ke disk, langsung dikirim)
        $pdfContent = Pdf::loadView('pdf.booking-confirmation', ['booking' => $this->booking])->output();
        Log::info("[WA] PDF booking #{$id} dibuat", ['bytes' => strlen($pdfContent)]);

        // 4. Kirim ke gateway WhatsApp
        $response = Http::timeout(30)
            ->withHeaders(['x-api-key' => $key])
            ->post(rtrim($url, '/') . '/send-document', [
                'target'     => $target,
                'message'    => "Halo {$this->booking->nama}! 🎉\n\nBooking Anda di *Golden Barber* telah *dikonfirmasi*.\n\nDetail lengkap ada di file terlampir. Sampai jumpa!",
                'fileBase64' => base64_encode($pdfContent),
                'fileName'   => "Booking-{$id}.pdf",
            ]);

        Log::info('[WA] Response gateway', [
            'booking_id' => $id,
            'target'     => $target,
            'status'     => $response->status(),
            'body'       => $response->body(),
        ]);

        // 5. Gagal kalau HTTP error ATAU gateway bilang status false
        $json = $response->json();
        $gatewayGagal = is_array($json) && (($json['status'] ?? true) === false);

        if (!$response->successful() || $gatewayGagal) {
            throw new \RuntimeException('Gagal kirim WA: ' . $response->body());
        }
    }

    private function normalizePhone(?string $phone): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $phone);

        if ($digits === '') {
            return null;
        }
        if (str_starts_with($digits, '0')) {
            return '62' . substr($digits, 1);
        }
        if (str_starts_with($digits, '8')) {
            return '62' . $digits;
        }

        return $digits; // sudah berformat 62xxx
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('[WA] Job SendBookingConfirmation gagal total: ' . $exception->getMessage(), [
            'booking_id' => $this->booking->id,
        ]);
    }
}