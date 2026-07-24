import React from 'react';
import { Scissors, UserCheck, Clock, Award } from 'lucide-react';
import { ServiceItem, BarberItem } from '../types';

interface ServicesBarbersListProps {
  services: ServiceItem[];
  barbers: BarberItem[];
  onSelectService: (serviceName: string) => void;
}

export const ServicesBarbersList: React.FC<ServicesBarbersListProps> = ({
  services,
  barbers,
  onSelectService,
}) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Layanan Barbershop */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Daftar Menu & Harga
          </span>
          <h2 className="text-3xl font-black text-white">Layanan Barbershop Kami</h2>
          <p className="text-sm text-slate-400">Pilih layanan perawatan pria sesuai dengan kebutuhan gaya rambut Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-amber-500/50 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-amber-400" />
                    <span>{svc.nama}</span>
                  </h3>
                  <span className="text-lg font-extrabold text-amber-400">{svc.harga}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Estimasi Durasi: {svc.durasi}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  {svc.deskripsi}
                </p>
              </div>

              <button
                onClick={() => onSelectService(svc.nama)}
                className="w-full py-2.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>Pesan Layanan Ini</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Barber & Kapster */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Tim Stylist Profesional
          </span>
          <h2 className="text-3xl font-black text-white">Kapster & Barber Kami</h2>
          <p className="text-sm text-slate-400">Para ahli pangkas rambut dengan keahlian khusus dan pengalaman bertahun-tahun</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
                <UserCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{b.nama}</h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">{b.spesialisasi}</p>
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs text-slate-400">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Pengalaman: {b.pengalaman}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
