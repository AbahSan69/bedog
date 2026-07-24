<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #1e293b; }
        h2 { color: #f59e0b; margin-bottom: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        td { padding: 6px 4px; border-bottom: 1px solid #e2e8f0; }
        td.label { width: 160px; font-weight: bold; color: #475569; }
        .badge { padding: 3px 10px; border-radius: 6px; background: #16a34a; color: white; font-weight: bold; }
    </style>
</head>
<body>
    <h2>GOLDEN BARBERSHOP</h2>
    <p style="color:#64748b;">Bukti Konfirmasi Booking</p>

    <table>
        <tr><td class="label">ID Booking</td><td>#{{ $booking->id }}</td></tr>
        <tr><td class="label">Nomor Antrian</td><td>{{ $booking->nomor_antrian }}</td></tr>
        <tr><td class="label">Nama Pelanggan</td><td>{{ $booking->nama }}</td></tr>
        <tr><td class="label">No. WhatsApp</td><td>{{ $booking->no_hp }}</td></tr>
        <tr><td class="label">Layanan</td><td>{{ $booking->layanan }}</td></tr>
        <tr><td class="label">Kapster/Barber</td><td>{{ $booking->barber }}</td></tr>
        <tr><td class="label">Tanggal</td><td>{{ $booking->tanggal->format('d F Y') }}</td></tr>
        <tr><td class="label">Waktu</td><td>{{ $booking->waktu }} WIB</td></tr>
        <tr><td class="label">Status</td><td><span class="badge">{{ $booking->status }}</span></td></tr>
    </table>

    <p style="margin-top:30px; color:#94a3b8; font-size:11px;">
        Dokumen ini digenerate otomatis oleh sistem BarberCraft pada {{ now()->format('d-m-Y H:i') }}.
    </p>
</body>
</html>