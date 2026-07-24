import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface Booking {
  id: number;
  nama: string;
  no_hp: string;
  layanan: string;
  barber: string;
  tanggal: string;
  waktu: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
}

// Initial pre-seeded sample data
let bookings: Booking[] = [
  {
    id: 1,
    nama: 'Ahmad Rizki',
    no_hp: '081234567890',
    layanan: 'Full Package',
    barber: 'Barber 1 (Budi)',
    tanggal: '2026-07-25',
    waktu: '10:00',
    status: 'Confirmed',
    created_at: '2026-07-24 09:15:00',
  },
  {
    id: 2,
    nama: 'Budi Santoso',
    no_hp: '085712345678',
    layanan: 'Haircut',
    barber: 'Barber 2 (Andi)',
    tanggal: '2026-07-25',
    waktu: '13:00',
    status: 'Pending',
    created_at: '2026-07-24 09:45:00',
  },
  {
    id: 3,
    nama: 'Citra Dewi',
    no_hp: '081987654321',
    layanan: 'Hair Color',
    barber: 'Barber 3 (Rian)',
    tanggal: '2026-07-26',
    waktu: '15:00',
    status: 'Pending',
    created_at: '2026-07-24 10:00:00',
  },
  {
    id: 4,
    nama: 'Dedi Kurniawan',
    no_hp: '082133445566',
    layanan: 'Shaving',
    barber: 'Barber 1 (Budi)',
    tanggal: '2026-07-24',
    waktu: '16:00',
    status: 'Completed',
    created_at: '2026-07-23 14:20:00',
  },
];

let nextId = 5;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Services list
  const services = [
    { id: 'haircut', nama: 'Haircut (Potong Rambut)', harga: 'Rp 50.000', durasi: '30 menit', deskripsi: 'Cuci rambut, pangkas rambut gaya modern/klasik, styling & pomade.' },
    { id: 'shaving', nama: 'Shaving (Cukur Jenggot & Kumis)', harga: 'Rp 30.000', durasi: '20 menit', deskripsi: 'Handuk hangat, pencukuran halus dengan razor steril, & aftershave lotion.' },
    { id: 'hair_color', nama: 'Hair Color (Pewarnaan Rambut)', harga: 'Rp 100.000', durasi: '60 menit', deskripsi: 'Pewarnaan rambut kualitas profesional, bleaching (opsional), & perawatan keratin.' },
    { id: 'full_package', nama: 'Full Package (Lengkap)', harga: 'Rp 150.000', durasi: '90 menit', deskripsi: 'Potong rambut + Shaving + Pijat Kepala & Pundak + Hair Mask & Styling.' },
  ];

  // Barbers list
  const barbers = [
    { id: 'budi', nama: 'Barber 1 (Budi)', spesialisasi: 'Fade & Modern Crop', pengalaman: '5 Tahun' },
    { id: 'andi', nama: 'Barber 2 (Andi)', spesialisasi: 'Gentleman Classic & Beard Trim', pengalaman: '7 Tahun' },
    { id: 'rian', nama: 'Barber 3 (Rian)', spesialisasi: 'Hair Coloring & Korean Style', pengalaman: '4 Tahun' },
  ];

  // Admin Auth API Endpoints
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    const validUsernames = ['admin', 'admin@barbershop.com', 'admin@barbercraft.com'];
    const validPasswords = ['admin123', 'password123', 'password'];

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Username/Email dan Password wajib diisi.',
      });
      return;
    }

    if (validUsernames.includes(email.toLowerCase().trim()) && validPasswords.includes(password)) {
      res.json({
        success: true,
        message: 'Login berhasil! Selamat datang Admin.',
        admin: {
          id: 1,
          name: 'Administrator Barbercraft',
          email: 'admin@barbershop.com',
          role: 'Super Admin',
        },
        token: 'demo_bearer_token_barbercraft_2026',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Kredensial salah! Gunakan username "admin" dan password "admin123".',
    });
  });

  app.post('/api/admin/logout', (_req, res) => {
    res.json({
      success: true,
      message: 'Logout berhasil.',
    });
  });

  // API Endpoints
  app.get('/api/services', (_req, res) => {
    res.json(services);
  });

  app.get('/api/barbers', (_req, res) => {
    res.json(barbers);
  });

  // Get all bookings sorted by created_at DESC
  app.get('/api/bookings', (_req, res) => {
    const sorted = [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(sorted);
  });

  // Create booking with validation
  app.post('/api/bookings', (req, res) => {
    const { nama, no_hp, layanan, barber, tanggal, waktu } = req.body;

    const errors: Record<string, string> = {};

    if (!nama || typeof nama !== 'string' || nama.trim().length === 0) {
      errors.nama = 'Nama lengkap wajib diisi.';
    }
    if (!no_hp || typeof no_hp !== 'string' || no_hp.trim().length === 0) {
      errors.no_hp = 'Nomor HP/WhatsApp wajib diisi.';
    } else if (!/^[0-9+--\s]{8,15}$/.test(no_hp.trim())) {
      errors.no_hp = 'Format nomor HP/WhatsApp tidak valid (contoh: 081234567890).';
    }
    if (!layanan || typeof layanan !== 'string' || layanan.trim().length === 0) {
      errors.layanan = 'Pilihan layanan wajib dipilih.';
    }
    if (!barber || typeof barber !== 'string' || barber.trim().length === 0) {
      errors.barber = 'Pilihan kapster/barber wajib dipilih.';
    }
    if (!tanggal || typeof tanggal !== 'string' || tanggal.trim().length === 0) {
      errors.tanggal = 'Tanggal booking wajib diisi.';
    }
    if (!waktu || typeof waktu !== 'string' || waktu.trim().length === 0) {
      errors.waktu = 'Waktu/Jam booking wajib diisi.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(422).json({
        success: false,
        message: 'Validasi gagal. Silakan periksa inputan Anda.',
        errors,
      });
      return;
    }

    const now = new Date();
    const formattedNow = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const newBooking: Booking = {
      id: nextId++,
      nama: nama.trim(),
      no_hp: no_hp.trim(),
      layanan: layanan.trim(),
      barber: barber.trim(),
      tanggal: tanggal.trim(),
      waktu: waktu.trim(),
      status: 'Pending',
      created_at: formattedNow,
    };

    bookings.push(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking berhasil disimpan! Kami akan mengonfirmasi jadwal Anda melalui WhatsApp.',
      data: newBooking,
    });
  });

  // Update status
  app.patch('/api/bookings/:id/status', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const bookingIndex = bookings.findIndex((b) => b.id === id);
    if (bookingIndex === -1) {
      res.status(404).json({ success: false, message: 'Data booking tidak ditemukan.' });
      return;
    }

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status tidak valid.' });
      return;
    }

    bookings[bookingIndex].status = status;
    res.json({
      success: true,
      message: `Status booking #${id} berhasil diubah menjadi ${status}`,
      data: bookings[bookingIndex],
    });
  });

  // Delete booking
  app.delete('/api/bookings/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const initialLength = bookings.length;
    bookings = bookings.filter((b) => b.id !== id);

    if (bookings.length === initialLength) {
      res.status(404).json({ success: false, message: 'Data booking tidak ditemukan.' });
      return;
    }

    res.json({ success: true, message: `Booking #${id} berhasil dihapus.` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
