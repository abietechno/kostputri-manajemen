const fs = require('fs');

const ownerDashboardCode = `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Users, Wallet, LogOut, Building2, TrendingUp, Settings, Wrench, ArrowUpRight, AlertCircle,
  CreditCard, Moon, Sun, ArrowDownRight, History
} from 'lucide-react';
import { ViewState } from '../types';
import { mockTenants, mockPayments, mockStats, mockEmployees, mockExpenses } from '../data';

interface OwnerDashboardProps {
  onLogout: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

type Tab = 'home' | 'tenants' | 'finance' | 'employees' | 'settings';

export default function OwnerDashboard({ onLogout, toggleDarkMode, isDarkMode }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const overduePayments = mockPayments.filter(p => p.status === 'overdue');
  const recentPayments = mockPayments.filter(p => p.status === 'paid').slice(0, 5);
  const totalOperational = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = mockStats.totalIncome - totalOperational;

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={\`w-full flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all \${isActive ? 'bg-primary-light text-primary font-bold' : 'text-text-sec hover:bg-bg-hover font-medium'}\`}
      >
        <Icon className={\`w-6 h-6 \${isActive ? 'text-primary' : 'text-text-sec'}\`} />
        <span className="text-[15px] hidden lg:block">{label}</span>
      </button>
    );
  };

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto w-full py-8 space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-main">Dashboard Utama</h1>
          <p className="text-text-sec text-sm mt-1">Ringkasan operasional properti hari ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-ios-card rounded-[24px] p-6 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-main text-sm">Pemasukan (Juli)</h3>
            <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#34C759]" />
            </div>
          </div>
          <p className="font-heading text-2xl lg:text-3xl font-bold text-text-main mb-1">{formatCurrency(mockStats.totalIncome)}</p>
        </div>

        <div className="bg-ios-card rounded-[24px] p-6 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-main text-sm">Pengeluaran Operasional</h3>
            <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-[#FF3B30]" />
            </div>
          </div>
          <p className="font-heading text-2xl lg:text-3xl font-bold text-text-main mb-1">{formatCurrency(totalOperational)}</p>
        </div>

        <div className="bg-ios-card rounded-[24px] p-6 border border-primary/20 shadow-[0_4px_20px_rgba(255,140,66,0.05)] bg-primary-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Laba Bersih</h3>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
               <Wallet className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="font-heading text-2xl lg:text-3xl font-bold text-primary mb-1">{formatCurrency(netProfit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-lg text-text-main">Perlu Perhatian</h3>
          {overduePayments.length > 0 ? (
            <div className="space-y-3">
              {overduePayments.map(payment => {
                const tenant = mockTenants.find(t => t.id === payment.tenantId);
                return (
                  <div key={payment.id} className="bg-ios-card rounded-[20px] p-4 flex items-center justify-between border border-[#FF3B30]/20 hover:border-[#FF3B30]/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3">
                      <img src={tenant?.avatar} alt={tenant?.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm text-text-main">{tenant?.name} <span className="text-text-sec font-normal">(Kmr {tenant?.room})</span></p>
                        <p className="text-xs text-[#FF3B30] font-medium">Overdue: {payment.dueDate}</p>
                      </div>
                    </div>
                    <button className="text-xs bg-[#FF3B30]/10 text-[#FF3B30] px-3 py-1.5 rounded-full font-bold hover:bg-[#FF3B30]/20 transition-colors">
                      Tagih
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
             <p className="text-sm text-text-sec">Semua tagihan aman terkendali.</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-heading font-bold text-lg text-text-main">Riwayat Pembayaran Terbaru</h3>
             <button onClick={() => setActiveTab('finance')} className="text-sm text-primary font-medium">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {recentPayments.map(payment => {
              const tenant = mockTenants.find(t => t.id === payment.tenantId);
              return (
                <div key={payment.id} className="bg-ios-card rounded-[20px] p-4 flex items-center justify-between border border-border-subtle hover:border-border-subtle/80 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-main">{tenant?.name}</p>
                      <p className="text-xs text-text-sec">{payment.paymentDate} • {payment.paymentMethod}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-[#34C759]">+{formatCurrency(payment.amount)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTenants = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto w-full py-8 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-main">Manajemen Penyewa</h1>
        <button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">
          Tambah Penyewa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTenants.map(tenant => {
          const payment = mockPayments.find(p => p.tenantId === tenant.id);
          return (
            <div 
              key={tenant.id} 
              className="bg-ios-card rounded-[24px] p-5 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer hover:border-text-sec/30 transition-all"
              onClick={() => setSelectedTenant(tenant.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={tenant.avatar} alt={tenant.name} className="w-12 h-12 rounded-full border border-border-subtle" />
                  <div>
                    <h3 className="font-semibold text-text-main">{tenant.name}</h3>
                    <p className="text-sm text-text-sec">Kamar {tenant.room}</p>
                  </div>
                </div>
                <div className="bg-bg-subtle px-2.5 py-1 rounded-md text-xs font-semibold text-text-sec border border-border-subtle">
                  Aktif
                </div>
              </div>
              
              <div className="pt-4 border-t border-border-subtle flex justify-between items-center text-sm">
                <span className="text-text-sec">Status Pembayaran:</span>
                {payment?.status === 'paid' && <span className="text-[#34C759] font-semibold">Lunas</span>}
                {payment?.status === 'pending' && <span className="text-[#FF9F0A] font-semibold">Menunggu</span>}
                {payment?.status === 'overdue' && <span className="text-[#FF3B30] font-semibold">Overdue</span>}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderFinance = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto w-full py-8 space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-2xl font-bold text-text-main">Keuangan & Transaksi</h1>
      </div>

      <div className="bg-ios-card rounded-[24px] p-6 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-8">
         <div className="flex-1">
           <p className="text-sm text-text-sec mb-1">Total Pemasukan Sewa</p>
           <p className="font-heading text-2xl font-bold text-[#34C759]">{formatCurrency(mockStats.totalIncome)}</p>
         </div>
         <div className="hidden md:block w-px bg-border-subtle"></div>
         <div className="flex-1">
           <p className="text-sm text-text-sec mb-1">Total Operasional (Keluaran)</p>
           <p className="font-heading text-2xl font-bold text-[#FF3B30]">{formatCurrency(totalOperational)}</p>
         </div>
         <div className="hidden md:block w-px bg-border-subtle"></div>
         <div className="flex-1">
           <p className="text-sm text-text-sec mb-1">Laba Bersih</p>
           <p className="font-heading text-2xl font-bold text-primary">{formatCurrency(netProfit)}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
           <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowDownRight className="w-5 h-5 text-[#FF3B30]" /> Pengeluaran Operasional</h3>
           <div className="bg-ios-card rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
             {mockExpenses.map((expense, idx) => (
               <div key={expense.id} className={\`p-4 flex items-center justify-between \${idx !== mockExpenses.length - 1 ? 'border-b border-border-subtle' : ''}\`}>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30]">
                     {expense.category === 'salary' && <Users className="w-5 h-5" />}
                     {expense.category === 'utilities' && <TrendingUp className="w-5 h-5" />}
                     {expense.category === 'maintenance' && <Wrench className="w-5 h-5" />}
                   </div>
                   <div>
                     <p className="font-semibold text-text-main text-sm">{expense.description}</p>
                     <p className="text-xs text-text-sec">{expense.date} • {expense.category}</p>
                   </div>
                 </div>
                 <p className="font-semibold text-sm text-[#FF3B30] max-w-[120px] truncate">-{formatCurrency(expense.amount)}</p>
               </div>
             ))}
           </div>
         </div>
         <div className="space-y-4">
           <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-[#34C759]" /> Histori Pembayaran Masuk</h3>
           <div className="bg-ios-card rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
             {mockPayments.filter(p => p.status === 'paid').map((payment, idx, arr) => {
                const tenant = mockTenants.find(t => t.id === payment.tenantId);
                return (
                  <div key={payment.id} className={\`p-4 flex items-center justify-between \${idx !== arr.length - 1 ? 'border-b border-border-subtle' : ''}\`}>
                    <div className="flex items-center gap-4">
                      <img src={tenant?.avatar} alt={tenant?.name} className="w-10 h-10 rounded-full border border-border-subtle" />
                      <div>
                        <p className="font-semibold text-text-main text-sm">{tenant?.name} (Kmr {tenant?.room})</p>
                        <p className="text-xs text-text-sec">{payment.paymentDate} • {payment.paymentMethod}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-[#34C759]">+{formatCurrency(payment.amount)}</p>
                  </div>
                );
             })}
           </div>
         </div>
      </div>
    </motion.div>
  );

  const renderEmployees = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto w-full py-8 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-main">Manajemen Pegawai</h1>
        <button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">
          Tambah Pegawai
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockEmployees.map(employee => (
          <div key={employee.id} className="bg-ios-card rounded-[24px] p-5 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full border border-border-subtle" />
              <div>
                <h3 className="font-semibold text-text-main">{employee.name}</h3>
                <p className="text-sm text-text-sec">{employee.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-sec mb-1">Gaji Bulanan</p>
              <p className="font-semibold text-text-main">{formatCurrency(employee.salary)}</p>
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
             <div className="w-10 h-10 bg-primary-light rounded-[12px] flex items-center justify-center">
               <Building2 className="w-5 h-5 text-primary" />
             </div>
             <span className="font-heading font-bold text-xl text-text-main tracking-tight">EstateFlow</span>
           </div>
           <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-bg-hover text-text-main transition-colors">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem tab="home" icon={Home} label="Beranda" />
          <NavItem tab="tenants" icon={Users} label="Penyewa" />
          <NavItem tab="finance" icon={Wallet} label="Keuangan" />
          <NavItem tab="employees" icon={CreditCard} label="Pegawai & Gaji" />
        </nav>

        <div className="pt-6 border-t border-border-subtle">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-[20px] text-text-sec hover:bg-bg-hover font-medium transition-colors mb-2">
            <Settings className="w-6 h-6" />
            <span className="text-[15px] hidden lg:block">Pengaturan</span>
          </button>
          <div className="flex items-center gap-3 p-4 bg-bg-subtle rounded-[20px] cursor-pointer hover:bg-bg-hover transition-colors border border-border-subtle">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm text-text-main truncate">Andi Darmawan</p>
              <p className="text-xs text-text-sec">Pemilik Kost</p>
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
          {activeTab === 'tenants' && renderTenants()}
          {activeTab === 'finance' && renderFinance()}
          {activeTab === 'employees' && renderEmployees()}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ios-card/90 backdrop-blur-md border-t border-border-subtle pb-safe pt-2 px-6 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('home')} className={\`flex flex-col items-center p-2 \${activeTab === 'home' ? 'text-primary' : 'text-text-sec'}\`}>
          <Home className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('tenants')} className={\`flex flex-col items-center p-2 \${activeTab === 'tenants' ? 'text-primary' : 'text-text-sec'}\`}>
          <Users className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('finance')} className={\`flex flex-col items-center p-2 \${activeTab === 'finance' ? 'text-primary' : 'text-text-sec'}\`}>
          <Wallet className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('employees')} className={\`flex flex-col items-center p-2 \${activeTab === 'employees' ? 'text-primary' : 'text-text-sec'}\`}>
          <CreditCard className="w-6 h-6" />
        </button>
      </div>

      {/* Detail Modal Tenant */}
      <AnimatePresence>
        {selectedTenant && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setSelectedTenant(null)}
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle"
            >
               {mockTenants.find(t => t.id === selectedTenant) && (() => {
                  const tenant = mockTenants.find(t => t.id === selectedTenant)!;
                  const payment = mockPayments.find(p => p.tenantId === tenant.id);
                  return (
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <img src={tenant.avatar} alt={tenant.name} className="w-16 h-16 rounded-full border border-border-subtle" />
                        <div>
                          <h3 className="font-heading text-xl font-bold text-text-main">{tenant.name}</h3>
                          <p className="text-text-sec">Kamar {tenant.room}</p>
                        </div>
                      </div>
                      
                      <div className="bg-bg-subtle rounded-[20px] p-4 mb-6 border border-border-subtle">
                        <div className="flex justify-between py-2 border-b border-border-subtle">
                          <span className="text-text-sec text-sm">Nomor HP</span>
                          <span className="font-medium text-sm text-text-main">{tenant.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border-subtle">
                          <span className="text-text-sec text-sm">Tanggal Masuk</span>
                          <span className="font-medium text-sm text-text-main">{tenant.entryDate}</span>
                        </div>
                        <div className="flex justify-between py-2">
                           <button className="text-[#007AFF] font-medium text-sm w-full text-center mt-2">Kirim Pesan WhatsApp</button>
                        </div>
                      </div>

                      <h4 className="font-heading font-semibold text-lg mb-3 text-text-main">Status Tagihan Terakhir</h4>
                      <div className="bg-ios-card border border-border-subtle rounded-[20px] p-4 flex items-center justify-between mb-6">
                         <div>
                           <p className="font-semibold text-text-main">{payment?.month || 'Bulan Ini'}</p>
                           <p className="text-sm text-text-sec">{formatCurrency(payment?.amount || 0)}</p>
                         </div>
                         <div>
                           {payment?.status === 'paid' && <span className="bg-[#34C759]/10 text-[#34C759] px-3 py-1 rounded-full text-xs font-bold">Lunas</span>}
                           {payment?.status === 'pending' && <span className="bg-[#FF9F0A]/10 text-[#FF9F0A] px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>}
                           {payment?.status === 'overdue' && <span className="bg-[#FF3B30]/10 text-[#FF3B30] px-3 py-1 rounded-full text-xs font-bold">Terlambat</span>}
                         </div>
                      </div>

                      <button 
                        onClick={() => setSelectedTenant(null)}
                        className="w-full bg-bg-hover text-text-main font-bold rounded-[20px] py-4"
                      >
                        Tutup
                      </button>
                    </div>
                  );
               })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
`;
fs.writeFileSync('src/components/OwnerDashboard.tsx', ownerDashboardCode);
