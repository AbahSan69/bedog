import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CustomerBookingForm } from './components/CustomerBookingForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginForm } from './components/AdminLoginForm';
import { LaravelGuideViewer } from './components/LaravelGuideViewer';
import { CheckBookingModal } from './components/CheckBookingModal';
import { ServicesBarbersList } from './components/ServicesBarbersList';
import { Booking, ServiceItem, BarberItem, ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('barbercraft_admin_logged_in') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = sessionStorage.getItem('barbercraft_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAdminLoginSuccess = (user: { name: string; email: string; role: string }) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    sessionStorage.setItem('barbercraft_admin_logged_in', 'true');
    sessionStorage.setItem('barbercraft_admin_user', JSON.stringify(user));
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    sessionStorage.removeItem('barbercraft_admin_logged_in');
    sessionStorage.removeItem('barbercraft_admin_user');
  };

  // Sync route URL path simulation for / and /admin
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setActiveTab('admin');
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const fetchServicesAndBarbers = async () => {
    try {
      const [resSvc, resBrb] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/barbers'),
      ]);
      if (resSvc.ok) setServices(await resSvc.json());
      if (resBrb.ok) setBarbers(await resBrb.json());
    } catch (err) {
      console.error('Failed to fetch services/barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchServicesAndBarbers();
  }, []);

  // Handlers for Admin actions
  const handleUpdateStatus = async (id: number, status: Booking['status']) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data booking #${id}?`)) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  const handleAddManualBooking = async (newManual: Omit<Booking, 'id' | 'created_at'>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newManual),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to add manual booking:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Global Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={bookings.length}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 space-x-3">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Memuat Data Barbershop...</span>
          </div>
        ) : (
          <>
            {activeTab === 'booking' && (
              <CustomerBookingForm
                services={services}
                barbers={barbers}
                onBookingSuccess={() => fetchBookings()}
                onNavigateToAdmin={() => setActiveTab('admin')}
              />
            )}

            {activeTab === 'admin' && (
              isAdminLoggedIn ? (
                <AdminDashboard
                  bookings={bookings}
                  services={services}
                  barbers={barbers}
                  adminUser={adminUser}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteBooking={handleDeleteBooking}
                  onAddManualBooking={handleAddManualBooking}
                  onRefresh={fetchBookings}
                  onLogout={handleAdminLogout}
                />
              ) : (
                <AdminLoginForm
                  onLoginSuccess={handleAdminLoginSuccess}
                  onNavigateToCustomer={() => setActiveTab('booking')}
                />
              )
            )}

            {activeTab === 'laravel-guide' && <LaravelGuideViewer />}

            {activeTab === 'check-booking' && <CheckBookingModal bookings={bookings} />}

            {activeTab === 'services' && (
              <ServicesBarbersList
                services={services}
                barbers={barbers}
                onSelectService={(svcName) => {
                  setActiveTab('booking');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-400">© 2026 BARBERCRAFT - Sistem Manajemen Booking Barbershop</p>
            <p className="text-slate-600">Built with Laravel 10/11 Architecture • Blade & React Interface • SQLite Database</p>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('booking')} className="hover:text-amber-400">Halaman Pelanggan (/)</button>
            <span>•</span>
            <button onClick={() => setActiveTab('admin')} className="hover:text-amber-400">Halaman Admin (/admin)</button>
            <span>•</span>
            <button onClick={() => setActiveTab('laravel-guide')} className="text-emerald-400 hover:underline">Kode Laravel</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
