const fs = require('fs');

const tenantAppCode = `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Wallet, FileText, UserCircle, Bell, 
  ChevronRight, LogOut, Download, AlertCircle, CheckCircle2,
  Moon, Sun, Clock
} from 'lucide-react';
import { ViewState } from '../types';
import { mockTenants, mockPayments } from '../data';

interface TenantAppProps {
  onLogout: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

type Tab = 'home' | 'payments' | 'profile';

export default function TenantApp({ onLogout, toggleDarkMode, isDarkMode }: TenantAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  // Mock login as the first tenant
  const currentUser = mockTenants[0];
  const myPayments = mockPayments.filter(p => p.tenantId === currentUser.id);
  const currentPayment = myPayments[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={\`w-full flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all \${isActive ? 'bg-[#E5F1FF] text-[#007AFF] font-bold' : 'text-text-sec hover:bg-bg-hover font-medium'}\`}
      >
        <Icon className={\`w-6 h-6 \${isActive ? 'text-[#007AFF]' : 'text-text-sec'}\`} />
        <span className="text-[15px] hidden md:block">{label}</span>
      </button>
    );
  };

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto w-full py-8 space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-main">Halo, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-text-sec text-sm">Kamar {currentUser.room}</p>
        </div>
        <button className="relative p-2 rounded-full bg-ios-card border border-border-subtle text-text-main">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-ios-card"></span>
        </button>
      </div>

      <div className="bg-[#007AFF] rounded-[28px] p-6 text-white shadow-[0_10px_30px_rgba(0,122,255,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Tagihan Bulan Ini ({currentPayment?.month})</p>
          <div className="flex items-end gap-3 mb-4">
            <h2 className="font-heading text-4xl font-bold">{formatCurrency(currentPayment?.amount || 0)}</h2>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-xs text-white/80">Jatuh Tempo</p>
              <p className="font-semibold text-sm">{currentPayment?.dueDate}</p>
            </div>
            <button className="bg-white text-[#007AFF] px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform">
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-ios-card p-5 rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3 items-start hover:border-border-subtle/80 transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#FF9F0A]/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#FF9F0A]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-text-main text-sm">Lapor Kendala</h3>
            <p className="text-xs text-text-sec">AC, air, atau listrik</p>
          </div>
        </button>
        <button className="bg-ios-card p-5 rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3 items-start hover:border-border-subtle/80 transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#34C759]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-text-main text-sm">Peraturan Kost</h3>
            <p className="text-xs text-text-sec">Lihat tata tertib</p>
          </div>
        </button>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-heading font-bold text-lg text-text-main">Aktivitas Terakhir</h3>
        <div className="bg-ios-card rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
            </div>
            <div>
              <p className="font-semibold text-text-main text-sm">Pembayaran Berhasil</p>
              <p className="text-xs text-text-sec">Juni 2026</p>
            </div>
          </div>
          <p className="font-semibold text-sm text-text-main">{formatCurrency(1500000)}</p>
        </div>
      </div>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto w-full py-8 space-y-6"
    >
      <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Riwayat Tagihan</h1>

      <div className="space-y-4">
        {myPayments.map((payment, idx) => (
          <div key={payment.id} className="bg-ios-card rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-text-main">Sewa {payment.month}</h3>
                <p className="text-sm text-text-sec">Jatuh tempo: {payment.dueDate}</p>
              </div>
              {payment.status === 'paid' && <span className="bg-[#34C759]/10 text-[#34C759] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Lunas</span>}
              {payment.status === 'pending' && <span className="bg-[#FF9F0A]/10 text-[#FF9F0A] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Menunggu</span>}
              {payment.status === 'overdue' && <span className="bg-[#FF3B30]/10 text-[#FF3B30] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Terlambat</span>}
            </div>

            <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
              <span className="font-heading font-bold text-lg text-text-main">{formatCurrency(payment.amount)}</span>
              {payment.status === 'paid' ? (
                <button className="flex items-center gap-2 text-sm text-[#007AFF] font-medium hover:opacity-80">
                  <Download className="w-4 h-4" /> Kuitansi
                </button>
              ) : (
                <button className="bg-[#007AFF] text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-colors">
                  Bayar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-ios-bg flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[280px] bg-ios-card border-r border-border-subtle h-full p-6 z-10 sticky top-0 transition-colors duration-300">
        <div className="flex items-center justify-between mb-10 pl-2">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#E5F1FF] rounded-[12px] flex items-center justify-center">
               <UserCircle className="w-5 h-5 text-[#007AFF]" />
             </div>
             <span className="font-heading font-bold text-xl text-text-main tracking-tight">EstateFlow</span>
           </div>
           <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-bg-hover text-text-main transition-colors">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem tab="home" icon={Home} label="Beranda" />
          <NavItem tab="payments" icon={Wallet} label="Tagihan" />
          <NavItem tab="profile" icon={UserCircle} label="Profil Saya" />
        </nav>

        <div className="pt-6 border-t border-border-subtle">
          <div className="flex items-center gap-3 p-4 bg-bg-subtle rounded-[20px] cursor-pointer hover:bg-bg-hover transition-colors border border-border-subtle">
            <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm text-text-main truncate">{currentUser.name}</p>
              <p className="text-xs text-text-sec">Kamar {currentUser.room}</p>
            </div>
            <LogOut className="w-5 h-5 text-text-sec hover:text-[#FF3B30] transition-colors" onClick={onLogout} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-10 px-4">
        <div className="md:hidden flex justify-end p-4 pt-6">
           <button onClick={toggleDarkMode} className="p-2 rounded-full bg-ios-card border border-border-subtle text-text-main shadow-sm">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'profile' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto w-full py-8 space-y-6">
               <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Profil Saya</h1>
               <div className="bg-ios-card rounded-[24px] border border-border-subtle p-6 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-2 border-border-subtle" />
                  <h2 className="font-heading font-bold text-xl text-text-main">{currentUser.name}</h2>
                  <p className="text-text-sec text-sm mb-6">Kamar {currentUser.room} • Masuk sejak {currentUser.entryDate}</p>
                  
                  <div className="w-full space-y-3">
                     <button className="w-full flex justify-between items-center bg-bg-subtle border border-border-subtle p-4 rounded-[20px] text-text-main font-medium hover:bg-bg-hover">
                        Ubah Nomor HP <ChevronRight className="w-5 h-5 text-text-sec" />
                     </button>
                     <button className="w-full flex justify-between items-center bg-bg-subtle border border-border-subtle p-4 rounded-[20px] text-text-main font-medium hover:bg-bg-hover">
                        Syarat & Ketentuan Sewa <ChevronRight className="w-5 h-5 text-text-sec" />
                     </button>
                  </div>

                  <button onClick={onLogout} className="mt-8 text-[#FF3B30] font-bold py-3 px-8 rounded-full bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 transition-colors w-full">
                    Keluar Akun
                  </button>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ios-card/90 backdrop-blur-md border-t border-border-subtle pb-safe pt-2 px-6 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('home')} className={\`flex flex-col items-center p-2 \${activeTab === 'home' ? 'text-[#007AFF]' : 'text-text-sec'}\`}>
          <Home className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('payments')} className={\`flex flex-col items-center p-2 \${activeTab === 'payments' ? 'text-[#007AFF]' : 'text-text-sec'}\`}>
          <Wallet className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('profile')} className={\`flex flex-col items-center p-2 \${activeTab === 'profile' ? 'text-[#007AFF]' : 'text-text-sec'}\`}>
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/TenantApp.tsx', tenantAppCode);
