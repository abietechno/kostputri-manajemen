import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Users, Wallet, LogOut, Building2, TrendingUp, Settings, Wrench, ArrowUpRight, AlertCircle,
  CreditCard, Moon, Sun, ArrowDownRight, BedDouble, Info, CheckCircle2, Search, MapPin, FileText, X, Crown
} from 'lucide-react';
import { ViewState, Room, Tenant, Payment, Employee, OperationalExpense, Property } from '../types';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockOwner, mockProperty } from '../data';

interface OwnerDashboardProps {
  onLogout: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

type Tab = 'home' | 'property' | 'tenants' | 'finance' | 'employees' | 'settings' | 'subscription';

export default function OwnerDashboard({ onLogout, toggleDarkMode, isDarkMode }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [expenses, setExpenses] = useState<OperationalExpense[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [roomsRes, tenantsRes, paymentsRes, employeesRes, expensesRes, propertiesRes] = await Promise.all([
          supabase.from('rooms').select('*').order('room_number'),
          supabase.from('tenants').select('*'),
          supabase.from('payments').select('*').order('due_date', { ascending: false }),
          supabase.from('employees').select('*'),
          supabase.from('operational_expenses').select('*').order('date', { ascending: false }),
          supabase.from('properties').select('*').limit(1)
        ]);

                if (roomsRes.data) {
          setRooms(roomsRes.data.map((r: any) => ({ ...r, propertyId: r.property_id, roomNumber: r.room_number, pricePerMonth: r.price_per_month })));
        }
        if (tenantsRes.data) {
          setTenants(tenantsRes.data.map((t: any) => ({ ...t, roomId: t.room_id, roomNumber: t.room_number, entryDate: t.entry_date })));
        }
        if (paymentsRes.data) {
          setPayments(paymentsRes.data.map((p: any) => ({ ...p, tenantId: p.tenant_id, roomId: p.room_id, dueDate: p.due_date, paymentMethod: p.payment_method, paymentDate: p.payment_date })));
        }
        if (employeesRes.data) {
          setEmployees(employeesRes.data);
        }
        if (expensesRes.data) {
          setExpenses(expensesRes.data);
        }
        if (propertiesRes.data && propertiesRes.data.length > 0) {
          const p = propertiesRes.data[0];
          setProperty({ ...p, totalRooms: p.total_rooms });
        } else {
          setProperty(mockProperty as any);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isAddingTenant, setIsAddingTenant] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'1' | '6' | '12'>('1');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

    const stats = {
    totalIncome: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    activeTenants: tenants.filter(t => t.status === 'active').length,
    availableRooms: rooms.filter(r => r.status === 'available').length
  };

  const overduePayments = payments.filter(p => p.status === 'overdue');
  const recentPayments = payments.filter(p => p.status === 'paid').slice(0, 5);
  const totalOperational = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = stats.totalIncome - totalOperational;

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all ${isActive ? 'bg-primary-light text-primary font-bold' : 'text-text-sec hover:bg-bg-hover font-medium'}`}
      >
        <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-text-sec'}`} />
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
          <p className="text-text-sec text-sm mt-1">{(property || mockProperty).name} • {(property || mockProperty).totalRooms} Total Kamar</p>
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
          <p className="font-heading text-2xl lg:text-3xl font-bold text-text-main mb-1">{formatCurrency(stats.totalIncome)}</p>
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
                const tenant = tenants.find(t => t.id === payment.tenantId);
                return (
                  <div key={payment.id} className="bg-ios-card rounded-[20px] p-4 flex items-center justify-between border border-[#FF3B30]/20 hover:border-[#FF3B30]/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3">
                      <img src={tenant?.avatar} alt={tenant?.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm text-text-main">{tenant?.name} <span className="text-text-sec font-normal">(Kmr {tenant?.roomNumber})</span></p>
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
              const tenant = tenants.find(t => t.id === payment.tenantId);
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

  const renderProperty = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto w-full py-8 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-main">Properti & Kamar</h1>
        <button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">
          Tambah Kamar
        </button>
      </div>

      <div className="bg-ios-card rounded-[24px] p-6 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
         <div>
            <h2 className="font-heading font-bold text-xl text-text-main mb-2">{(property || mockProperty).name}</h2>
            <p className="text-text-sec flex items-center gap-2 text-sm mb-4"><MapPin className="w-4 h-4"/> {(property || mockProperty).address}</p>
            <div className="flex flex-wrap gap-2">
              {(property || mockProperty).facilities.map((f, i) => (
                <span key={i} className="bg-bg-subtle text-text-sec px-3 py-1 rounded-full text-xs border border-border-subtle">{f}</span>
              ))}
            </div>
         </div>
         <div className="flex gap-6">
            <div className="text-center">
              <p className="text-text-sec text-xs mb-1">Total Kamar</p>
              <p className="font-heading font-bold text-2xl text-text-main">{(property || mockProperty).totalRooms}</p>
            </div>
            <div className="text-center">
              <p className="text-text-sec text-xs mb-1">Tersedia</p>
              <p className="font-heading font-bold text-2xl text-[#34C759]">{stats.availableRooms}</p>
            </div>
         </div>
      </div>

      <h3 className="font-heading font-bold text-lg text-text-main mb-4">Daftar Kamar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="bg-ios-card rounded-[24px] p-5 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-[14px] bg-primary-light flex items-center justify-center">
                  <BedDouble className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-main text-lg">Kamar {room.roomNumber}</h3>
                  <p className="text-sm text-text-sec">{room.type}</p>
                </div>
              </div>
              <div>
                {room.status === 'available' && <span className="bg-[#34C759]/10 text-[#34C759] px-3 py-1 rounded-full text-xs font-bold">Kosong</span>}
                {room.status === 'occupied' && <span className="bg-bg-subtle text-text-sec border border-border-subtle px-3 py-1 rounded-full text-xs font-bold">Terisi</span>}
                {room.status === 'maintenance' && <span className="bg-[#FF9F0A]/10 text-[#FF9F0A] px-3 py-1 rounded-full text-xs font-bold">Perbaikan</span>}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {room.facilities.slice(0, 3).map((f, i) => (
                <span key={i} className="bg-bg-subtle text-text-sec px-2 py-0.5 rounded text-[11px] border border-border-subtle">{f}</span>
              ))}
              {room.facilities.length > 3 && <span className="bg-bg-subtle text-text-sec px-2 py-0.5 rounded text-[11px] border border-border-subtle">+{room.facilities.length - 3}</span>}
            </div>

            <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
               <span className="font-heading font-bold text-text-main">{formatCurrency(room.pricePerMonth)}<span className="text-xs text-text-sec font-normal">/bln</span></span>
               <button onClick={() => setEditingRoom(room)} className="text-primary text-sm font-medium hover:underline">Edit</button>
            </div>
          </div>
        ))}
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
        <h1 className="font-heading text-2xl font-bold text-text-main">Manajemen Penghuni</h1>
        <button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">
          Tambah Penghuni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenants.map(tenant => {
          const payment = payments.find(p => p.tenantId === tenant.id);
          return (
            <div 
              key={tenant.id} 
              className="bg-ios-card rounded-[24px] p-5 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer hover:border-text-sec/30 transition-all"
              onClick={() => setSelectedTenant(tenant.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={tenant.avatar} alt={tenant.name} className="w-12 h-12 rounded-full object-cover border border-border-subtle" />
                  <div>
                    <h3 className="font-semibold text-text-main">{tenant.name}</h3>
                    <p className="text-sm text-text-sec">Kamar {tenant.roomNumber} • {tenant.phone}</p>
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
           <p className="font-heading text-2xl font-bold text-[#34C759]">{formatCurrency(stats.totalIncome)}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-4">
           <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowDownRight className="w-5 h-5 text-[#FF3B30]" /> Pengeluaran Operasional</h3>
           <div className="bg-ios-card rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
             {expenses.map((expense, idx) => (
               <div key={expense.id} className={`p-4 flex items-center justify-between ${idx !== expenses.length - 1 ? 'border-b border-border-subtle' : ''}`}>
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
           <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-[#34C759]" /> Transaksi / Invoice Sewa</h3>
           <div className="bg-ios-card rounded-[24px] border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
             {payments.map((payment, idx, arr) => {
                const tenant = tenants.find(t => t.id === payment.tenantId);
                return (
                  <div key={payment.id} className={`p-4 flex items-center justify-between ${idx !== arr.length - 1 ? 'border-b border-border-subtle' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[12px] bg-bg-subtle border border-border-subtle flex items-center justify-center">
                        <FileText className="w-5 h-5 text-text-sec" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-main text-sm">{tenant?.name} (Kmr {tenant?.roomNumber})</p>
                        <p className="text-xs text-text-sec">Jatuh Tempo: {payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-text-main mb-1">{formatCurrency(payment.amount)}</p>
                      {payment.status === 'paid' && <span className="bg-[#34C759]/10 text-[#34C759] px-2 py-0.5 rounded text-[10px] font-bold">Lunas ({payment.paymentMethod})</span>}
                      {payment.status === 'pending' && <span className="bg-[#FF9F0A]/10 text-[#FF9F0A] px-2 py-0.5 rounded text-[10px] font-bold">Menunggu</span>}
                      {payment.status === 'overdue' && <span className="bg-[#FF3B30]/10 text-[#FF3B30] px-2 py-0.5 rounded text-[10px] font-bold">Overdue</span>}
                    </div>
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
        <button onClick={() => setIsAddingEmployee(true)} className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">
          Tambah Pegawai
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map(employee => (
          <div key={employee.id} className="bg-ios-card rounded-[24px] p-5 border border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover border border-border-subtle" />
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

  const renderSubscription = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto w-full py-8 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-main">Berlangganan</h1>
      </div>

      <div className="bg-ios-card rounded-[24px] p-8 border border-border-subtle shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl text-text-main">Akses Penuh Manajemen Kost</h2>
              <p className="text-text-sec">Status: <span className="text-[#FF9F0A] font-bold">Uji Coba Gratis</span></p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              onClick={() => setSubscriptionPlan('1')}
              className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all ${subscriptionPlan === '1' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-text-sec/30'}`}
            >
              <h3 className="font-bold text-lg mb-2 text-text-main">1 Bulan</h3>
              <p className="font-heading font-bold text-2xl text-text-main">Rp 15.000<span className="text-sm font-normal text-text-sec">/bln</span></p>
            </div>
            <div 
              onClick={() => setSubscriptionPlan('6')}
              className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all ${subscriptionPlan === '6' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-text-sec/30'}`}
            >
              <h3 className="font-bold text-lg mb-2 text-text-main">6 Bulan</h3>
              <p className="font-heading font-bold text-2xl text-text-main">Rp 90.000<span className="text-sm font-normal text-text-sec">/total</span></p>
            </div>
            <div 
              onClick={() => setSubscriptionPlan('12')}
              className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all ${subscriptionPlan === '12' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-text-sec/30'}`}
            >
              <h3 className="font-bold text-lg mb-2 text-text-main">12 Bulan</h3>
              <p className="font-heading font-bold text-2xl text-text-main">Rp 180.000<span className="text-sm font-normal text-text-sec">/total</span></p>
            </div>
          </div>

          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex justify-center items-center gap-2"
          >
            Bayar dengan Mayar.id <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-bg-subtle p-6 rounded-[24px] border border-border-subtle">
            <h4 className="font-bold text-text-main mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary"/> Fitur Premium</h4>
            <ul className="space-y-3 text-text-sec text-sm">
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Manajemen tanpa batas kamar</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Laporan keuangan otomatis</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Kirim tagihan via WhatsApp</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Integrasi payment gateway untuk penyewa</li>
            </ul>
         </div>
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
             <span className="font-heading font-bold text-xl text-text-main tracking-tight">KOST PUTRI KREMBANGAN</span>
           </div>
           <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-bg-hover text-text-main transition-colors">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem tab="home" icon={Home} label="Beranda" />
          <NavItem tab="property" icon={BedDouble} label="Properti & Kamar" />
          <NavItem tab="tenants" icon={Users} label="Penghuni" />
          <NavItem tab="finance" icon={Wallet} label="Keuangan & Transaksi" />
          <NavItem tab="employees" icon={CreditCard} label="Pegawai & Gaji" />
        </nav>

        <div className="pt-6 border-t border-border-subtle">
          <NavItem tab="subscription" icon={Crown} label="Berlangganan" />
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-[20px] text-text-sec hover:bg-bg-hover font-medium transition-colors mb-2">
            <Settings className="w-6 h-6" />
            <span className="text-[15px] hidden lg:block">Pengaturan</span>
          </button>
          <div className="flex items-center gap-3 p-4 bg-bg-subtle rounded-[20px] cursor-pointer hover:bg-bg-hover transition-colors border border-border-subtle">
            <img src={mockOwner.avatar} alt={mockOwner.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-border-subtle" />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm text-text-main truncate">{mockOwner.name}</p>
              <p className="text-xs text-text-sec">Pemilik Kost</p>
            </div>
            <LogOut className="w-5 h-5 text-text-sec hover:text-[#FF3B30] transition-colors shrink-0" onClick={onLogout} />
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
          {activeTab === 'property' && renderProperty()}
          {activeTab === 'tenants' && renderTenants()}
          {activeTab === 'finance' && renderFinance()}
          {activeTab === 'employees' && renderEmployees()}
          {activeTab === 'subscription' && renderSubscription()}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ios-card/90 backdrop-blur-md border-t border-border-subtle pb-safe pt-2 px-6 flex justify-between items-center z-50 overflow-x-auto">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 min-w-[64px] ${activeTab === 'home' ? 'text-primary' : 'text-text-sec'}`}>
          <Home className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('property')} className={`flex flex-col items-center p-2 min-w-[64px] ${activeTab === 'property' ? 'text-primary' : 'text-text-sec'}`}>
          <BedDouble className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('tenants')} className={`flex flex-col items-center p-2 min-w-[64px] ${activeTab === 'tenants' ? 'text-primary' : 'text-text-sec'}`}>
          <Users className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('finance')} className={`flex flex-col items-center p-2 min-w-[64px] ${activeTab === 'finance' ? 'text-primary' : 'text-text-sec'}`}>
          <Wallet className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('employees')} className={`flex flex-col items-center p-2 min-w-[64px] ${activeTab === 'employees' ? 'text-primary' : 'text-text-sec'}`}>
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
               {tenants.find(t => t.id === selectedTenant) && (() => {
                  const tenant = tenants.find(t => t.id === selectedTenant)!;
                  const payment = payments.find(p => p.tenantId === tenant.id);
                  return (
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <img src={tenant.avatar} alt={tenant.name} className="w-16 h-16 rounded-full object-cover border border-border-subtle" />
                        <div>
                          <h3 className="font-heading text-xl font-bold text-text-main">{tenant.name}</h3>
                          <p className="text-text-sec">Kamar {tenant.roomNumber}</p>
                        </div>
                      </div>
                      
                      <div className="bg-bg-subtle rounded-[20px] p-4 mb-6 border border-border-subtle">
                        <div className="flex justify-between py-2 border-b border-border-subtle">
                          <span className="text-text-sec text-sm">Nomor HP</span>
                          <span className="font-medium text-sm text-text-main">{tenant.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border-subtle">
                          <span className="text-text-sec text-sm">No KTP</span>
                          <span className="font-medium text-sm text-text-main">{tenant.ktp}</span>
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

        {editingRoom && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setEditingRoom(null)}
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-text-main">Edit Kamar {editingRoom.roomNumber}</h2>
                 <button onClick={() => setEditingRoom(null)} className="p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              
                            <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const type = formData.get('type') as string;
                const price = Number(formData.get('price'));
                const status = formData.get('status') as any;
                const facilitiesStr = formData.get('facilities') as string;
                const facilities = facilitiesStr.split(',').map(f => f.trim()).filter(f => f);
                
                try {
                  const { error } = await supabase
                    .from('rooms')
                    .update({ type, price_per_month: price, status, facilities })
                    .eq('id', editingRoom.id);
                    
                  if (error) throw error;
                  
                  setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, type, pricePerMonth: price, status, facilities } : r));
                  setEditingRoom(null);
                } catch (err) {
                  console.error('Error updating room:', err);
                  alert('Gagal menyimpan perubahan.');
                }
              }} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Tipe Kamar</label>
                    <input name="type" defaultValue={editingRoom.type} required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Harga per Bulan (Rp)</label>
                    <input name="price" type="number" defaultValue={editingRoom.pricePerMonth} required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Status</label>
                    <select name="status" defaultValue={editingRoom.status} className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary">
                      <option value="available">Kosong</option>
                      <option value="occupied">Terisi</option>
                      <option value="maintenance">Perbaikan</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Fasilitas (pisahkan dengan koma)</label>
                    <textarea name="facilities" defaultValue={editingRoom.facilities.join(', ')} required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary min-h-[80px] resize-none"></textarea>
                 </div>
                 <button type="submit" className="w-full bg-primary text-ios-bg font-bold rounded-[20px] py-4 mt-6 hover:opacity-90 transition-opacity">Simpan Perubahan</button>
              </form>
            </motion.div>
          </>
        )}


        {isEditingProperty && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsEditingProperty(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-text-main">Edit Properti</h2>
                 <button onClick={() => setIsEditingProperty(false)} className="p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const address = formData.get('address') as string;
                const totalRooms = Number(formData.get('totalRooms'));
                const facilitiesStr = formData.get('facilities') as string;
                const facilities = facilitiesStr.split(',').map(f => f.trim()).filter(f => f);
                
                try {
                  const { error } = await supabase.from('properties').update({ name, address, total_rooms: totalRooms, facilities }).eq('id', (property || mockProperty).id);
                  if (error) throw error;
                  setProperty(prev => prev ? { ...prev, name, address, totalRooms, facilities } : null);
                  setIsEditingProperty(false);
                } catch (err) {
                  console.error(err);
                  alert('Gagal menyimpan perubahan.');
                }
              }} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Nama Kos</label>
                    <input name="name" defaultValue={(property || mockProperty).name} required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Alamat</label>
                    <input name="address" defaultValue={(property || mockProperty).address} required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Total Kamar</label>
                    <input name="totalRooms" type="number" defaultValue={(property || mockProperty).totalRooms} required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Fasilitas (pisahkan dengan koma)</label>
                    <input name="facilities" defaultValue={(property || mockProperty).facilities.join(', ')} className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 
                 <div className="flex gap-4 mt-6">
                   <button type="button" onClick={async () => {
                      if (!confirm('Apakah anda yakin ingin menghapus kamar ini?')) return;
                      try {
                        const { error } = await supabase.from('rooms').delete().eq('id', editingRoom.id);
                        if (error) throw error;
                        setRooms(prev => prev.filter(r => r.id !== editingRoom.id));
                        setEditingRoom(null);
                      } catch(err) {
                        console.error(err);
                        alert('Gagal menghapus kamar');
                      }
                   }} className="flex-1 bg-[#FF3B30]/10 text-[#FF3B30] font-bold rounded-[20px] py-4">Hapus</button>
                   <button type="submit" className="flex-1 bg-primary text-white font-bold rounded-[20px] py-4">Simpan</button>
                 </div>
              </form>

            </motion.div>
          </>
        )}

        {isAddingRoom && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsAddingRoom(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-text-main">Tambah Kamar</h2>
                 <button onClick={() => setIsAddingRoom(false)} className="p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const roomNumber = formData.get('roomNumber') as string;
                const type = formData.get('type') as string;
                const price = Number(formData.get('price'));
                const status = formData.get('status') as any;
                const facilitiesStr = formData.get('facilities') as string;
                const facilities = facilitiesStr.split(',').map(f => f.trim()).filter(f => f);
                
                try {
                  const { data, error } = await supabase.from('rooms').insert({
                      property_id: (property || mockProperty).id,
                      room_number: roomNumber,
                      type,
                      price_per_month: price,
                      status,
                      facilities
                  }).select().single();
                  
                  if (error) throw error;
                  setRooms(prev => [...prev, { ...data, propertyId: data.property_id, roomNumber: data.room_number, pricePerMonth: data.price_per_month }]);
                  setIsAddingRoom(false);
                } catch (err) {
                  console.error(err);
                  alert('Gagal menambah kamar.');
                }
              }} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Nomor Kamar</label>
                    <input name="roomNumber" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Tipe Kamar</label>
                    <input name="type" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Harga per Bulan (Rp)</label>
                    <input name="price" type="number" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Status</label>
                    <select name="status" className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary">
                      <option value="available">Kosong</option>
                      <option value="occupied">Terisi</option>
                      <option value="maintenance">Perbaikan</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Fasilitas (pisahkan dengan koma)</label>
                    <input name="facilities" className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <button type="submit" className="w-full bg-primary text-white font-bold rounded-[20px] py-4 mt-6">Tambah Kamar</button>
              </form>
            </motion.div>
          </>
        )}

        {isAddingTenant && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsAddingTenant(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-text-main">Tambah Penghuni</h2>
                 <button onClick={() => setIsAddingTenant(false)} className="p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const phone = formData.get('phone') as string;
                const ktp = formData.get('ktp') as string;
                const roomId = formData.get('roomId') as string;
                const entryDate = formData.get('entryDate') as string;
                
                try {
                  const room = rooms.find(r => r.id === roomId);
                  const { data, error } = await supabase.from('tenants').insert({
                      name, phone, ktp, room_id: roomId, room_number: room?.roomNumber, entry_date: entryDate, status: 'active', avatar: `https://i.pravatar.cc/150?u=${name}`
                  }).select().single();
                  
                  if (error) throw error;
                  setTenants(prev => [...prev, { ...data, roomId: data.room_id, roomNumber: data.room_number, entryDate: data.entry_date }]);
                  
                  // Update room status
                  await supabase.from('rooms').update({ status: 'occupied' }).eq('id', roomId);
                  setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'occupied' } : r));
                  
                  setIsAddingTenant(false);
                } catch (err) {
                  console.error(err);
                  alert('Gagal menambah penghuni.');
                }
              }} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Nama Lengkap</label>
                    <input name="name" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Nomor HP</label>
                    <input name="phone" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">No. KTP</label>
                    <input name="ktp" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Pilih Kamar (Tersedia)</label>
                    <select name="roomId" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary">
                      {rooms.filter(r => r.status === 'available').map(r => (
                          <option key={r.id} value={r.id}>Kamar {r.roomNumber} - {r.type}</option>
                      ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Tanggal Masuk</label>
                    <input name="entryDate" type="date" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <button type="submit" className="w-full bg-primary text-white font-bold rounded-[20px] py-4 mt-6">Tambah Penghuni</button>
              </form>
            </motion.div>
          </>
        )}
        
        {isAddingExpense && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsAddingExpense(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-text-main">Catat Pengeluaran</h2>
                 <button onClick={() => setIsAddingExpense(false)} className="p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const description = formData.get('description') as string;
                const amount = Number(formData.get('amount'));
                const category = formData.get('category') as any;
                const date = formData.get('date') as string;
                
                try {
                  const { data, error } = await supabase.from('operational_expenses').insert({
                      description, amount, category, date
                  }).select().single();
                  
                  if (error) throw error;
                  setExpenses(prev => [data, ...prev]);
                  setIsAddingExpense(false);
                } catch (err) {
                  console.error(err);
                  alert('Gagal menambah pengeluaran.');
                }
              }} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Deskripsi</label>
                    <input name="description" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Jumlah (Rp)</label>
                    <input name="amount" type="number" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Kategori</label>
                    <select name="category" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary">
                      <option value="salary">Gaji Pegawai</option>
                      <option value="maintenance">Perawatan/Perbaikan</option>
                      <option value="utilities">Tagihan (Listrik/Air/Internet)</option>
                      <option value="other">Lainnya</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Tanggal</label>
                    <input name="date" type="date" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <button type="submit" className="w-full bg-primary text-white font-bold rounded-[20px] py-4 mt-6">Simpan Pengeluaran</button>
              </form>
            </motion.div>
          </>
        )}

        {isAddingEmployee && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsAddingEmployee(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 w-full md:max-w-md bg-ios-card md:rounded-[32px] rounded-t-[32px] p-8 z-[70] border border-border-subtle overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-heading font-bold text-xl text-text-main">Tambah Pegawai</h2>
                 <button onClick={() => setIsAddingEmployee(false)} className="p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const role = formData.get('role') as string;
                const salary = Number(formData.get('salary'));
                const status = formData.get('status') as any;
                
                try {
                  const { data, error } = await supabase.from('employees').insert({
                      name, role, salary, status, avatar: `https://i.pravatar.cc/150?u=${name}`
                  }).select().single();
                  
                  if (error) throw error;
                  setEmployees(prev => [...prev, data]);
                  setIsAddingEmployee(false);
                } catch (err) {
                  console.error(err);
                  alert('Gagal menambah pegawai.');
                }
              }} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Nama Lengkap</label>
                    <input name="name" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Jabatan / Peran</label>
                    <input name="role" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Gaji Bulanan (Rp)</label>
                    <input name="salary" type="number" required className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Status</label>
                    <select name="status" className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] px-4 py-3 text-text-main focus:outline-none focus:border-primary">
                      <option value="active">Aktif</option>
                      <option value="inactive">Non-aktif</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full bg-primary text-white font-bold rounded-[20px] py-4 mt-6">Tambah Pegawai</button>
              </form>
            </motion.div>
          </>
        )}

        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-ios-card rounded-[32px] p-6 w-full max-w-md shadow-2xl relative"
            >
              {!paymentSuccess ? (
                <>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 p-2 text-text-sec hover:bg-bg-subtle rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center mb-6 mt-4">
                    <img src="https://ui-avatars.com/api/?name=Mayar&background=007AFF&color=fff&rounded=true" alt="Mayar.id" className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="font-heading font-bold text-xl text-text-main">Pembayaran Mayar.id</h2>
                    <p className="text-sm text-text-sec">Pilih metode pembayaran</p>
                  </div>
                  
                  <div className="space-y-4">
                     {['QRIS (Gratis Biaya Admin)', 'BCA Virtual Account', 'Mandiri Virtual Account', 'E-Wallet (GoPay/OVO)'].map((method, idx) => (
                       <button 
                         key={idx}
                         onClick={() => {
                           setPaymentSuccess(true);
                           setTimeout(() => {
                             setPaymentSuccess(false);
                             setIsPaymentModalOpen(false);
                             alert('Pembayaran Berhasil! Akun Anda sekarang dalam mode Premium.');
                           }, 2000);
                         }}
                         className="w-full bg-bg-subtle border border-border-subtle p-4 rounded-[16px] text-left hover:bg-primary/5 hover:border-primary transition-all font-medium text-text-main flex justify-between items-center"
                       >
                         {method}
                         <ArrowUpRight className="w-4 h-4 text-text-sec" />
                       </button>
                     ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                   <div className="w-20 h-20 bg-[#34C759]/10 rounded-full flex items-center justify-center mb-2">
                     <CheckCircle2 className="w-10 h-10 text-[#34C759]" />
                   </div>
                   <h2 className="font-heading font-bold text-2xl text-text-main">Pembayaran Berhasil!</h2>
                   <p className="text-sm text-text-sec">Terima kasih, pembayaran langganan Anda telah kami terima.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
