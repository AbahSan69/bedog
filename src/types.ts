export interface Booking {
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

export interface ServiceItem {
  id: string;
  nama: string;
  harga: string;
  durasi: string;
  deskripsi: string;
}

export interface BarberItem {
  id: string;
  nama: string;
  spesialisasi: string;
  pengalaman: string;
}

export type ActiveTab = 'booking' | 'admin' | 'laravel-guide' | 'services' | 'check-booking';
