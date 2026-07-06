import { motion } from 'motion/react';
import { Building2, User, KeySquare, Moon, Sun } from 'lucide-react';
import { ViewState } from '../types';

interface LandingProps {
  onSelectRole: (role: ViewState) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export default function Landing({ onSelectRole, toggleDarkMode, isDarkMode }: LandingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-ios-bg relative"
    >
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-6 right-6 p-3 rounded-full bg-ios-card border border-border-subtle shadow-sm hover:scale-105 transition-transform"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-text-main" /> : <Moon className="w-5 h-5 text-text-main" />}
      </button>

      <div className="w-full max-w-lg text-center flex flex-col items-center">
        <div className="font-heading text-2xl font-extrabold text-primary flex items-center gap-2 mb-10">
          <Building2 className="w-7 h-7" />
          KOST PUTRI KREMBANGAN
        </div>
        
        <h1 className="font-heading text-[32px] font-bold text-text-main mb-2">
          Selamat Datang Kembali
        </h1>
        <p className="text-text-sec mb-10 text-base">
          Kelola properti Anda dengan mudah dalam satu genggaman
        </p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectRole('owner')}
            className="flex flex-col items-center justify-center p-10 rounded-[28px] bg-ios-card border border-border-subtle shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(255,140,66,0.1)] hover:border-primary hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-20 h-20 rounded-[22px] bg-primary-light flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <KeySquare className="w-10 h-10 text-primary" />
            </div>
            <p className="font-heading font-bold text-xl text-text-main mb-2">Dashboard Pemilik</p>
            <p className="text-sm text-text-sec">Manajemen unit, pelacakan penyewa, & laporan</p>
          </button>

          <button
            onClick={() => onSelectRole('tenant')}
            className="flex flex-col items-center justify-center p-10 rounded-[28px] bg-ios-card border border-border-subtle shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,122,255,0.1)] hover:border-[#007AFF] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-20 h-20 rounded-[22px] bg-[#007AFF]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <User className="w-10 h-10 text-[#007AFF]" />
            </div>
            <p className="font-heading font-bold text-xl text-text-main mb-2">Aplikasi Penyewa</p>
            <p className="text-sm text-text-sec">Pembayaran sewa, cek tagihan, & layanan</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
