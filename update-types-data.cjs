const fs = require('fs');

const typesContent = `export type ViewState = 'landing' | 'owner' | 'tenant';

export interface Owner {
  id: string;
  name: string;
  contact: string;
  email: string;
  avatar: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  facilities: string[];
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  type: string;
  pricePerMonth: number;
  status: 'available' | 'occupied' | 'maintenance';
  facilities: string[];
}

export interface Tenant {
  id: string;
  name: string;
  roomId: string;
  roomNumber: string;
  phone: string;
  ktp: string;
  entryDate: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  roomId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
  paymentMethod?: string;
  paymentDate?: string;
}

export interface FinancialStats {
  totalIncome: number;
  pendingPayments: number;
  activeTenants: number;
  availableRooms: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface OperationalExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'salary' | 'maintenance' | 'utilities' | 'other';
}
`;

fs.writeFileSync('src/types.ts', typesContent);

const dataContent = `import { Tenant, Payment, FinancialStats, Employee, OperationalExpense, Owner, Property, Room } from './types';

export const mockOwner: Owner = {
  id: 'o1',
  name: 'Andi Darmawan',
  contact: '08123456789',
  email: 'andi@estateflow.com',
  avatar: 'AD'
};

export const mockProperty: Property = {
  id: 'prop1',
  name: 'Kost Mawar Elite',
  address: 'Jl. Mawar No. 12, Jakarta Selatan',
  totalRooms: 50,
  facilities: ['WiFi', 'Parkir Motor/Mobil', 'CCTV 24 Jam', 'Dapur Bersama', 'Ruang Tamu']
};

export const mockRooms: Room[] = [
  { id: 'r101', propertyId: 'prop1', roomNumber: '101', type: 'VIP', pricePerMonth: 2000000, status: 'occupied', facilities: ['AC', 'Kamar Mandi Dalam', 'Water Heater', 'TV'] },
  { id: 'r102', propertyId: 'prop1', roomNumber: '102', type: 'Standar', pricePerMonth: 1500000, status: 'occupied', facilities: ['AC', 'Kamar Mandi Luar'] },
  { id: 'r201', propertyId: 'prop1', roomNumber: '201', type: 'VIP', pricePerMonth: 2000000, status: 'occupied', facilities: ['AC', 'Kamar Mandi Dalam', 'Water Heater', 'TV'] },
  { id: 'r205', propertyId: 'prop1', roomNumber: '205', type: 'Standar', pricePerMonth: 1500000, status: 'occupied', facilities: ['AC', 'Kamar Mandi Luar'] },
  { id: 'r206', propertyId: 'prop1', roomNumber: '206', type: 'Standar', pricePerMonth: 1500000, status: 'available', facilities: ['AC', 'Kamar Mandi Luar'] },
  { id: 'r301', propertyId: 'prop1', roomNumber: '301', type: 'VIP', pricePerMonth: 2000000, status: 'maintenance', facilities: ['AC', 'Kamar Mandi Dalam'] },
];

export const mockTenants: Tenant[] = [
  { id: 't1', name: 'Budi Santoso', roomId: 'r101', roomNumber: '101', phone: '081234567890', ktp: '3171234567890001', entryDate: '2025-01-10', status: 'active', avatar: 'https://i.pravatar.cc/150?u=budi' },
  { id: 't2', name: 'Siti Aminah', roomId: 'r102', roomNumber: '102', phone: '081298765432', ktp: '3171234567890002', entryDate: '2024-11-15', status: 'active', avatar: 'https://i.pravatar.cc/150?u=siti' },
  { id: 't3', name: 'Andi Wijaya', roomId: 'r201', roomNumber: '201', phone: '085678901234', ktp: '3171234567890003', entryDate: '2025-03-01', status: 'active', avatar: 'https://i.pravatar.cc/150?u=andi' },
  { id: 't4', name: 'Rina Kusuma', roomId: 'r205', roomNumber: '205', phone: '081345678901', ktp: '3171234567890004', entryDate: '2024-05-20', status: 'active', avatar: 'https://i.pravatar.cc/150?u=rina' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', tenantId: 't1', roomId: 'r101', amount: 2000000, dueDate: '2026-07-10', status: 'pending', month: 'Juli 2026' },
  { id: 'p2', tenantId: 't2', roomId: 'r102', amount: 1500000, dueDate: '2026-07-15', status: 'paid', month: 'Juli 2026', paymentMethod: 'BCA Virtual Account', paymentDate: '2026-07-02' },
  { id: 'p3', tenantId: 't3', roomId: 'r201', amount: 2000000, dueDate: '2026-07-01', status: 'overdue', month: 'Juli 2026' },
  { id: 'p4', tenantId: 't4', roomId: 'r205', amount: 1500000, dueDate: '2026-06-20', status: 'paid', month: 'Juni 2026', paymentMethod: 'QRIS', paymentDate: '2026-06-19' },
];

export const mockStats: FinancialStats = {
  totalIncome: 12500000,
  pendingPayments: 4000000,
  activeTenants: 42,
  availableRooms: 8,
};

export const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Pak Yanto', role: 'Keamanan', salary: 3000000, status: 'active', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 'e2', name: 'Bu Siti', role: 'Kebersihan', salary: 2500000, status: 'active', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
];

export const mockExpenses: OperationalExpense[] = [
  { id: 'op1', description: 'Gaji Karyawan (Juli)', amount: 5500000, date: '2026-07-01', category: 'salary' },
  { id: 'op2', description: 'Listrik & Air (Juni)', amount: 1200000, date: '2026-07-05', category: 'utilities' },
  { id: 'op3', description: 'Perbaikan Pompa Air', amount: 850000, date: '2026-07-12', category: 'maintenance' },
];
`;

fs.writeFileSync('src/data.ts', dataContent);
