export type ViewState = 'landing' | 'owner' | 'tenant' | 'login' | 'register';

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
