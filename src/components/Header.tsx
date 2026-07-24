import React from 'react';
import { Scissors, ShieldCheck, Code2, Sparkles, Search, UserCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  bookingCount: number;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, bookingCount, isAdminLoggedIn }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('booking')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-amber-500/20">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                BARBERCRAFT
              </span>
              <p className="text-xs text-slate-400 font-medium">Gentlemen Barbershop & Grooming</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'booking'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Form Booking Pelanggan</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 relative ${
                activeTab === 'admin'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-emerald-400' : ''}`} />
              <span>Dashboard Admin</span>
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Admin Logged In"></span>
              )}
              {bookingCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                  {bookingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'services'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Layanan & Barber</span>
            </button>

            <button
              onClick={() => setActiveTab('check-booking')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'check-booking'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Cek Booking</span>
            </button>

            <button
              onClick={() => setActiveTab('laravel-guide')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'laravel-guide'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-800/40'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Panduan Kode Laravel</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </button>
          </nav>

          {/* Quick Action Badge */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-3 py-2 rounded-md text-xs font-bold ${
                activeTab === 'booking' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200'
              }`}
            >
              Booking
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-md text-xs font-bold ${
                activeTab === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200'
              }`}
            >
              Admin ({bookingCount})
            </button>
            <button
              onClick={() => setActiveTab('laravel-guide')}
              className="px-3 py-2 rounded-md text-xs font-bold bg-emerald-600 text-white"
            >
              Laravel
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
