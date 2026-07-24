import React, { useState } from 'react';
import { Calendar, Clock, Scissors, User, Phone, CheckCircle2, Shield, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';
import { ServiceItem, BarberItem, Booking } from '../types';

interface CustomerBookingFormProps {
  services: ServiceItem[];
  barbers: BarberItem[];
  onBookingSuccess: (booking: Booking) => void;
  onNavigateToAdmin: () => void;
}

export const CustomerBookingForm: React.FC<CustomerBookingFormProps> = ({
  services,
  barbers,
  onBookingSuccess,
  onNavigateToAdmin,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    layanan: '',
    barber: '',
    tanggal: todayStr,
    waktu: '10:00',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [flashSuccess, setFlashSuccess] = useState<Booking | null>(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00'
  ];

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.nama.trim()) errs.nama = 'Nama lengkap wajib diisi.';
    if (!formData.no_hp.trim()) {
      errs.no_hp = 'Nomor HP/WhatsApp wajib diisi.';
    } else if (!/^[0-9+--\s]{8,15}$/.test(formData.no_hp.trim())) {
      errs.no_hp = 'Format nomor HP/WhatsApp tidak valid (contoh: 081234567890).';
    }
    if (!formData.layanan) errs.layanan = 'Pilihan layanan wajib dipilih.';
    if (!formData.barber) errs.barber = 'Pilihan kapster/barber wajib dipilih.';
    if (!formData.tanggal) errs.tanggal = 'Tanggal booking wajib dipilih.';
    if (!formData.waktu) errs.waktu = 'Waktu/Jam booking wajib diisi.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFlashSuccess(result.data);
        onBookingSuccess(result.data);
        // Reset form
        setFormData({
          nama: '',
          no_hp: '',
          layanan: '',
          barber: '',
          tanggal: todayStr,
          waktu: '10:00',
        });
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || 'Terjadi kesalahan saat menyimpan booking.' });
        }
      }
    } catch (err) {
      setErrors({ general: 'Gagal terhubung ke server. Silakan coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceObj = services.find((s) => s.nama === formData.layanan);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-8 sm:p-12 border border-slate-700/60 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Scissors className="w-3.5 h-3.5" />
            <span>Reservasi Online Barbershop</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Pengalaman Cukur Klasik & Stylist Profesional
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Pesan jadwal potong rambut tanpa antre. Pilih kapster favorit Anda, tentukan jam kedatangan, dan nikmati pelayanan eksklusif dengan garansi kepuasan.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Kapster Berpengalaman</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Garansi On-Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Peralatan Steril & Higienis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-400" />
                <span>Formulir Booking Pelanggan</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Lengkapi data berikut untuk reservasi jadwal Anda</p>
            </div>
            
            {/* CSRF Token Security Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-emerald-400 text-xs font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>@csrf Protected</span>
            </div>
          </div>

          {/* Flash Message Sukses */}
          {flashSuccess && (
            <div className="mb-6 bg-emerald-950/80 border-2 border-emerald-500/80 rounded-xl p-5 text-emerald-200 shadow-lg relative animate-fade-in">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-base">Booking Berhasil Dibuat!</h4>
                  <p className="text-xs text-emerald-300 leading-relaxed">
                    Terima kasih <strong>{flashSuccess.nama}</strong>! Pesanan Anda telah tersimpan dengan Kode Booking: <span className="font-mono bg-emerald-900 px-2 py-0.5 rounded text-amber-300 font-bold">#{flashSuccess.id}</span>.
                  </p>
                  <div className="bg-slate-900/80 p-3 rounded-lg text-xs space-y-1 font-mono text-slate-300">
                    <p>✂️ Layanan: <strong className="text-amber-400">{flashSuccess.layanan}</strong></p>
                    <p>💈 Barber: <strong className="text-amber-400">{flashSuccess.barber}</strong></p>
                    <p>📅 Tanggal & Jam: <strong className="text-amber-400">{flashSuccess.tanggal} jam {flashSuccess.waktu} WIB</strong></p>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Barbercraft,%20saya%20sudah%20membuat%20booking%20%23${flashSuccess.id}%20atas%20nama%20${encodeURIComponent(flashSuccess.nama)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Konfirmasi via WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setFlashSuccess(null)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                    >
                      Buat Booking Lainnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation General Error */}
          {errors.general && (
            <div className="mb-6 bg-red-950/80 border border-red-500/80 rounded-xl p-4 text-red-200 text-sm flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="nama" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Lengkap <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Ahmad Rizki"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                    errors.nama ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                />
              </div>
              {errors.nama && <p className="text-xs text-red-400 mt-1">{errors.nama}</p>}
            </div>

            {/* Nomor HP / WhatsApp */}
            <div>
              <label htmlFor="no_hp" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nomor HP / WhatsApp <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="no_hp"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                    errors.no_hp ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                />
              </div>
              {errors.no_hp && <p className="text-xs text-red-400 mt-1">{errors.no_hp}</p>}
            </div>

            {/* Pilihan Layanan */}
            <div>
              <label htmlFor="layanan" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Pilihan Layanan <span className="text-amber-400">*</span>
              </label>
              <select
                id="layanan"
                value={formData.layanan}
                onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
                className={`w-full px-4 py-3 bg-slate-950 border ${
                  errors.layanan ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
              >
                <option value="">-- Pilih Layanan Barbershop --</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.nama}>
                    {svc.nama} ({svc.harga})
                  </option>
                ))}
              </select>
              {errors.layanan && <p className="text-xs text-red-400 mt-1">{errors.layanan}</p>}
            </div>

            {/* Pilihan Kapster / Barber */}
            <div>
              <label htmlFor="barber" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Pilihan Kapster / Barber <span className="text-amber-400">*</span>
              </label>
              <select
                id="barber"
                value={formData.barber}
                onChange={(e) => setFormData({ ...formData, barber: e.target.value })}
                className={`w-full px-4 py-3 bg-slate-950 border ${
                  errors.barber ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
              >
                <option value="">-- Pilih Barber Favorit --</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.nama}>
                    {b.nama} • Spesialis: {b.spesialisasi}
                  </option>
                ))}
              </select>
              {errors.barber && <p className="text-xs text-red-400 mt-1">{errors.barber}</p>}
            </div>

            {/* Tanggal & Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tanggal" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tanggal Booking <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    id="tanggal"
                    min={todayStr}
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                      errors.tanggal ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                    } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                  />
                </div>
                {errors.tanggal && <p className="text-xs text-red-400 mt-1">{errors.tanggal}</p>}
              </div>

              <div>
                <label htmlFor="waktu" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Waktu / Slot Jam <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="time"
                    id="waktu"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                      errors.waktu ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                    } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                  />
                </div>
                {errors.waktu && <p className="text-xs text-red-400 mt-1">{errors.waktu}</p>}
              </div>
            </div>

            {/* Time Slot Quick Selector */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Pilih Slot Jam Cepat:</p>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, waktu: slot })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      formData.waktu === slot
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Memproses Booking...</span>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>Kirim Pesanan Booking Sekarang</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Dynamic Preview Card (4 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ringkasan Pesanan Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Ringkasan Booking</span>
              <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md font-mono">Pratinjau</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Nama Pelanggan:</span>
                <span className="font-semibold text-white">{formData.nama || '-'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Nomor WhatsApp:</span>
                <span className="font-semibold text-amber-400">{formData.no_hp || '-'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Layanan:</span>
                <span className="font-semibold text-white">{formData.layanan || '-'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Kapster/Barber:</span>
                <span className="font-semibold text-white">{formData.barber || '-'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Jadwal Kedatangan:</span>
                <span className="font-semibold text-amber-300">
                  {formData.tanggal} jam {formData.waktu} WIB
                </span>
              </div>

              {selectedServiceObj && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-2 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Perkiraan Biaya:</span>
                    <span className="text-lg font-black text-amber-400">{selectedServiceObj.harga}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Estimasi Durasi:</span>
                    <span>{selectedServiceObj.durasi}</span>
                  </div>
                  <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-800">
                    "{selectedServiceObj.deskripsi}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl text-xs text-amber-200 leading-relaxed">
              💡 <strong>Tips:</strong> Silakan datang 5-10 menit sebelum jam booking untuk menikmati kehangatan handuk pangkas & minuman selamat datang gratis.
            </div>
          </div>

          {/* Admin Dashboard Quick Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700/80 shadow-xl space-y-3">
            <div className="flex items-center space-x-3 text-amber-400">
              <Shield className="w-5 h-5" />
              <h4 className="font-bold text-white text-sm">Pemilik / Admin Barbershop?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anda dapat memantau seluruh daftar booking yang masuk, mengonfirmasi jadwal, dan memperbarui status pemesanan di Dashboard Admin.
            </p>
            <button
              onClick={onNavigateToAdmin}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <span>Buka Dashboard Admin (URL: /admin)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
