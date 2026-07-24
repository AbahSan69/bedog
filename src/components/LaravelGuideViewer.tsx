import React, { useState } from 'react';
import { laravelCodeSnippets } from '../data/laravelSnippets';
import { Check, Copy, Terminal, FileCode, Database, Layers, Route as RouteIcon, Layout, FileText, Download } from 'lucide-react';

export const LaravelGuideViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof laravelCodeSnippets>('controller');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const tabs: { key: keyof typeof laravelCodeSnippets; label: string; icon: React.ReactNode; path?: string }[] = [
    { key: 'terminalAwal', label: '1. Terminal Awal', icon: <Terminal className="w-4 h-4 text-amber-400" /> },
    { key: 'envConfig', label: '2. Setup .env (MySQL/XAMPP)', icon: <Database className="w-4 h-4 text-emerald-400" />, path: '.env' },
    { key: 'migration', label: '3. Migration', icon: <Layers className="w-4 h-4 text-cyan-400" />, path: 'database/migrations/xxxx_xx_xx_create_bookings_table.php' },
    { key: 'model', label: '4. Model', icon: <FileCode className="w-4 h-4 text-purple-400" />, path: 'app/Models/Booking.php' },
    { key: 'controller', label: '5. Controller Booking', icon: <FileCode className="w-4 h-4 text-yellow-400" />, path: 'app/Http/Controllers/BookingController.php' },
    { key: 'authController', label: '6. Auth Controller (Login)', icon: <FileCode className="w-4 h-4 text-orange-400" />, path: 'app/Http/Controllers/AuthController.php' },
    { key: 'routes', label: '7. Routes (web.php)', icon: <RouteIcon className="w-4 h-4 text-rose-400" />, path: 'routes/web.php' },
    { key: 'authView', label: '8. View Login Admin', icon: <Layout className="w-4 h-4 text-amber-300" />, path: 'resources/views/auth/login.blade.php' },
    { key: 'seeder', label: '9. Seeder Admin Default', icon: <Database className="w-4 h-4 text-blue-400" />, path: 'database/seeders/DatabaseSeeder.php' },
    { key: 'viewBooking', label: '10. View Pelanggan', icon: <Layout className="w-4 h-4 text-indigo-400" />, path: 'resources/views/booking.blade.php' },
    { key: 'viewAdmin', label: '11. View Admin Dashboard', icon: <Layout className="w-4 h-4 text-teal-400" />, path: 'resources/views/admin.blade.php' },
    { key: 'terminalAkhir', label: '12. Terminal & Seeder', icon: <Terminal className="w-4 h-4 text-emerald-400" /> },
  ];

  const handleCopy = (key: keyof typeof laravelCodeSnippets) => {
    navigator.clipboard.writeText(laravelCodeSnippets[key]);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (key: keyof typeof laravelCodeSnippets, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([laravelCodeSnippets[key]], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const currentTabInfo = tabs.find((t) => t.key === activeTab);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-800/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase rounded-full mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Panduan Senior Laravel Developer</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">
            Dokumentasi & Kode Sumber Laravel Lengkap
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Berikut adalah seluruh file kode sumber Laravel (Versi 10/11) dengan arsitektur MVC, database MySQL (XAMPP), validasi controller, dan Blade Templating Bootstrap 5 yang siap Anda gunakan.
          </p>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar Tabs (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl space-y-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2 border-b border-slate-800">
            Daftar File & Langkah
          </h3>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                activeTab === tab.key
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </div>
              {tab.path && (
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline truncate ml-1">
                  {tab.path.split('/').pop()}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Code Content Display (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* File Header Bar */}
          <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              {currentTabInfo?.icon}
              <span className="font-mono text-xs font-bold text-slate-200 truncate">
                {currentTabInfo?.path || currentTabInfo?.label}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(activeTab)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>

              {currentTabInfo?.path && (
                <button
                  onClick={() => handleDownloadFile(activeTab, currentTabInfo.path?.split('/').pop() || 'file.php')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                  title="Unduh File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Textarea / Pre */}
          <div className="p-5 overflow-x-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap select-all">
              {laravelCodeSnippets[activeTab]}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
