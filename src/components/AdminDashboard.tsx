import React, { useState } from 'react';
import { Shield, Scissors, Search, Trash2, CheckCircle2, Clock, Plus, Phone, RefreshCw, X, MessageSquare, AlertCircle, LogOut, UserCheck } from 'lucide-react';
import { Booking, ServiceItem, BarberItem } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  services: ServiceItem[];
  barbers: BarberItem[];
  adminUser?: { name: string; email: string; role: string } | null;
  onUpdateStatus: (id: number, status: Booking['status']) => void;
  onDeleteBooking: (id: number) => void;
  onAddManualBooking: (newBooking: Omit<Booking, 'id' | 'created_at'>) => void;
  onRefresh: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  services,
  barbers,
  adminUser,
  onUpdateStatus,
  onDeleteBooking,
  onAddManualBooking,
  onRefresh,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Manual Booking State
  const [newManual, setNewManual] = useState({
    nama: '',
    no_hp: '',
    layanan: services[0]?.nama || 'Haircut',
    barber: barbers[0]?.nama || 'Barber 1 (Budi)',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '11:00',
    status: 'Confirmed' as Booking['status'],
  });

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.no_hp.includes(searchTerm) ||
      b.id.toString().includes(searchTerm);

    const matchesBarber = !selectedBarber || b.barber === selectedBarber;
    const matchesService = !selectedService || b.layanan === selectedService;
    const matchesStatus = !selectedStatus || b.status === selectedStatus;

    return matchesSearch && matchesBarber && matchesService && matchesStatus;
  });

  // Quick Statistics
  const totalBookings = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.tanggal === todayStr).length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  const handleCreateManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManual.nama || !newManual.no_hp) return;
    onAddManualBooking(newManual);
    setShowAddModal(false);
    setNewManual({
      nama: '',
      no_hp: '',
      layanan: services[0]?.nama || 'Haircut',
      barber: barbers[0]?.nama || 'Barber 1 (Budi)',
      tanggal: todayStr,
      waktu: '11:00',
      status: 'Confirmed',
    });
  };

  const formatCreatedAt = (isoStr: string) => {
    if (!isoStr) return '-';
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;
      
      const day = String(date.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">Confirmed</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold">Pending</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>URL: /admin • Auth Protected</span>
            </span>
            {adminUser && (
              <span className="flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2 py-0.5 rounded">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login sebagai: <strong>{adminUser.name}</strong> ({adminUser.email})</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Dashboard Admin Barbershop</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola seluruh pesanan pelanggan (Diurutkan dari yang terbaru: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">created_at DESC</code>)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-sm flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Booking Walk-In</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 hover:border-rose-700 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all"
              title="Keluar / Logout Admin"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Total Booking</span>
            <Scissors className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalBookings}</p>
          <p className="text-xs text-slate-400 mt-1">Keseluruhan entri database</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Booking Hari Ini</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400">{todayBookings}</p>
          <p className="text-xs text-slate-400 mt-1">Tanggal: {todayStr}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Perlu Konfirmasi</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">Status: Pending</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Terkonfirmasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{confirmedCount}</p>
          <p className="text-xs text-slate-400 mt-1">Siap dilayani kapster</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:space-x-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pelanggan, nomor WA, atau ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Barber Filter */}
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Barber</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.nama}>{b.nama}</option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Layanan</option>
            {services.map((s) => (
              <option key={s.id} value={s.nama}>{s.nama}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {(selectedBarber || selectedService || selectedStatus || searchTerm) && (
            <button
              onClick={() => {
                setSelectedBarber('');
                setSelectedService('');
                setSelectedStatus('');
                setSearchTerm('');
              }}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase font-bold text-amber-400 tracking-wider">
                <th className="py-4 px-4 text-center">ID</th>
                <th className="py-4 px-4">Nama Pelanggan</th>
                <th className="py-4 px-4">Nomor HP/WA</th>
                <th className="py-4 px-4">Layanan</th>
                <th className="py-4 px-4">Barber/Kapster</th>
                <th className="py-4 px-4">Tanggal & Waktu</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Tanggal Pesan (created_at)</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm text-slate-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* ID */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-amber-400">
                      #{b.id}
                    </td>

                    {/* Nama */}
                    <td className="py-4 px-4 font-semibold text-white">
                      {b.nama}
                    </td>

                    {/* Nomor HP/WA */}
                    <td className="py-4 px-4">
                      <a
                        href={`https://wa.me/${b.no_hp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-xs bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{b.no_hp}</span>
                      </a>
                    </td>

                    {/* Layanan */}
                    <td className="py-4 px-4">
                      <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 border border-slate-700">
                        {b.layanan}
                      </span>
                    </td>

                    {/* Barber */}
                    <td className="py-4 px-4">
                      <span className="bg-amber-950/40 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300 border border-amber-900/40">
                        {b.barber}
                      </span>
                    </td>

                    {/* Tanggal & Waktu */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="text-white font-bold">{b.tanggal}</div>
                      <div className="text-amber-400 font-semibold">{b.waktu} WIB</div>
                    </td>

                    {/* Status Toggle Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateStatus(b.id, e.target.value as Booking['status'])}
                        className="bg-slate-950 text-xs font-bold rounded-lg border border-slate-700 px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Pending" className="text-amber-400">🟡 Pending</option>
                        <option value="Confirmed" className="text-emerald-400">🟢 Confirmed</option>
                        <option value="Completed" className="text-cyan-400">🔵 Completed</option>
                        <option value="Cancelled" className="text-rose-400">🔴 Cancelled</option>
                      </select>
                    </td>

                    {/* created_at formatted */}
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">
                      {formatCreatedAt(b.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <a
                          href={`https://wa.me/${b.no_hp.replace(/[^0-9]/g, '')}?text=Halo%20Kak%20${encodeURIComponent(b.nama)},%20kami%20dari%20Barbercraft%20mengenai%20booking%20%23${b.id}%20tanggal%20${b.tanggal}%20jam%20${b.waktu}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => onDeleteBooking(b.id)}
                          className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                          title="Hapus Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Scissors className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-base font-semibold text-slate-400">Tidak ada data booking yang cocok.</p>
                    <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci atau filter Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Tambah Booking Walk-In / Manual</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  value={newManual.nama}
                  onChange={(e) => setNewManual({ ...newManual, nama: e.target.value })}
                  placeholder="Contoh: Doni Perkasa"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nomor HP/WA</label>
                <input
                  type="text"
                  required
                  value={newManual.no_hp}
                  onChange={(e) => setNewManual({ ...newManual, no_hp: e.target.value })}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Layanan</label>
                  <select
                    value={newManual.layanan}
                    onChange={(e) => setNewManual({ ...newManual, layanan: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.nama}>{s.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Barber</label>
                  <select
                    value={newManual.barber}
                    onChange={(e) => setNewManual({ ...newManual, barber: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.nama}>{b.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={newManual.tanggal}
                    onChange={(e) => setNewManual({ ...newManual, tanggal: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Jam/Waktu</label>
                  <input
                    type="time"
                    required
                    value={newManual.waktu}
                    onChange={(e) => setNewManual({ ...newManual, waktu: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl"
                >
                  Simpan Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
