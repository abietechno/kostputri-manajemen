import { Tenant, Payment, FinancialStats, Employee, OperationalExpense, Owner, Property, Room } from './types';

export const mockOwner: Owner = {
  id: 'o1',
  name: 'Ibu Ratna',
  contact: '08123456789',
  email: 'admin@kostputri.com',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
};

export const mockProperty: Property = {
  id: 'prop1',
  name: 'KOST PUTRI KREMBANGAN',
  address: 'Jl. Melati No. 10, Jakarta Selatan',
  totalRooms: 14,
  facilities: ['WiFi', 'AC', 'Dapur Dalam', 'Kamar Mandi Dalam', 'CCTV 24 Jam', 'Parkir Motor']
};

export const mockRooms: Room[] = Array.from({ length: 14 }).map((_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  let status: 'available' | 'occupied' | 'maintenance' = 'available';
  if (i < 4) status = 'occupied';
  else if (i === 13) status = 'maintenance';
  
  return {
    id: `r${num}`,
    propertyId: 'prop1',
    roomNumber: num,
    type: 'Standar AC',
    pricePerMonth: 1500000,
    status,
    facilities: ['AC', 'WiFi', 'Dapur Dalam', 'Kamar Mandi Dalam']
  };
});

export const mockTenants: Tenant[] = [
  { id: 't1', name: 'Siti Aminah', roomId: 'r01', roomNumber: '01', phone: '081298765432', ktp: '3171234567890001', entryDate: '2025-01-10', status: 'active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
  { id: 't2', name: 'Rina Kusuma', roomId: 'r02', roomNumber: '02', phone: '081345678901', ktp: '3171234567890002', entryDate: '2024-11-15', status: 'active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
  { id: 't3', name: 'Dewi Lestari', roomId: 'r03', roomNumber: '03', phone: '085678901234', ktp: '3171234567890003', entryDate: '2025-03-01', status: 'active', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop' },
  { id: 't4', name: 'Ayu Wandira', roomId: 'r04', roomNumber: '04', phone: '081987654321', ktp: '3171234567890004', entryDate: '2024-05-20', status: 'active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', tenantId: 't1', roomId: 'r01', amount: 1500000, dueDate: '2026-07-10', status: 'pending', month: 'Juli 2026' },
  { id: 'p2', tenantId: 't2', roomId: 'r02', amount: 1500000, dueDate: '2026-07-15', status: 'paid', month: 'Juli 2026', paymentMethod: 'BCA Virtual Account', paymentDate: '2026-07-02' },
  { id: 'p3', tenantId: 't3', roomId: 'r03', amount: 1500000, dueDate: '2026-07-01', status: 'overdue', month: 'Juli 2026' },
  { id: 'p4', tenantId: 't4', roomId: 'r04', amount: 1500000, dueDate: '2026-06-20', status: 'paid', month: 'Juni 2026', paymentMethod: 'QRIS', paymentDate: '2026-06-19' },
];

export const mockStats: FinancialStats = {
  totalIncome: 15000000, // Estimasi 10 kamar terisi (contoh sebelumnya) -> kita update untuk 4 kamar saja
  pendingPayments: 3000000,
  activeTenants: 4,
  availableRooms: 9, // 14 total - 4 occupied - 1 maintenance
};
// Update correct stats calculation
mockStats.totalIncome = 6000000;

export const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Pak Yanto', role: 'Keamanan', salary: 3000000, status: 'active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
  { id: 'e2', name: 'Bu Siti', role: 'Kebersihan', salary: 2500000, status: 'active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
];

export const mockExpenses: OperationalExpense[] = [
  { id: 'op1', description: 'Gaji Karyawan (Juli)', amount: 5500000, date: '2026-07-01', category: 'salary' },
  { id: 'op2', description: 'Listrik & Air (Juni)', amount: 1200000, date: '2026-07-05', category: 'utilities' },
  { id: 'op3', description: 'Perbaikan Pompa Air', amount: 850000, date: '2026-07-12', category: 'maintenance' },
];
