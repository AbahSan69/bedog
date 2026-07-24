import React, { useState } from 'react';
import { Search, Scissors, MessageSquare, Phone, Calendar, Clock } from 'lucide-react';
import { Booking } from '../types';

interface CheckBookingModalProps {
  bookings: Booking[];
}

export const CheckBookingModal: React.FC<CheckBookingModalProps> = ({ bookings }) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Booking[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toLowerCase();
    const found = bookings.filter(
      (b) =>
        b.no_hp.replace(/[^0-9]/g, '').includes(trimmed.replace(/[^0-9]/g, '')) ||
        b.nama.toLowerCase().includes(trimmed) ||
        b.id.toString() === trimmed
    );

    setResults(found);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Cek Status Booking Anda</h2>
          <p className="text-sm text-slate-400">Masukkan Nomor HP/WhatsApp atau Nama yang digunakan saat mendaftar</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: 081234567890 atau Ahmad"
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
          >
            Cari
          </button>
        </form>

        {searched && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-300">
              Hasil Pencarian ({results.length} ditemukan)
            </h3>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((b) => (
                  <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs text-amber-400 font-mono font-bold">Booking #{b.id}</span>
                        <h4 className="text-base font-bold text-white">{b.nama}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        b.status === 'Completed' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        b.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Layanan:</span>
                        <span className="font-semibold">{b.layanan}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Barber/Kapster:</span>
                        <span className="font-semibold">{b.barber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Tanggal:</span>
                        <span className="font-semibold">{b.tanggal}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Waktu:</span>
                        <span className="font-semibold text-amber-400">{b.waktu} WIB</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://wa.me/6281234567890?text=Halo%20Barbercraft,%20saya%20mau%20tanya%20mengenai%20booking%20%23${b.id}%20atas%20nama%20${encodeURIComponent(b.nama)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat CS WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">
                Data pesanan tidak ditemukan untuk kata kunci "{query}". Pastikan nomor HP sesuai saat pengisian form.
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
