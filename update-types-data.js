const fs = require('fs');

// 1. Update src/types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf8');
if (!typesContent.includes('Employee')) {
  typesContent += `
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
}

// 2. Update src/data.ts
let dataContent = fs.readFileSync('src/data.ts', 'utf8');
if (!dataContent.includes('mockEmployees')) {
  dataContent = dataContent.replace(
    "import { Tenant, Payment, FinancialStats } from './types';",
    "import { Tenant, Payment, FinancialStats, Employee, OperationalExpense } from './types';"
  );
  
  dataContent += `
export const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Pak Yanto', role: 'Keamanan', salary: 3000000, status: 'active', avatar: 'https://i.pravatar.cc/150?u=yanto' },
  { id: 'e2', name: 'Bu Siti', role: 'Kebersihan', salary: 2500000, status: 'active', avatar: 'https://i.pravatar.cc/150?u=sitik' },
];

export const mockExpenses: OperationalExpense[] = [
  { id: 'op1', description: 'Gaji Karyawan (Juli)', amount: 5500000, date: '2026-07-01', category: 'salary' },
  { id: 'op2', description: 'Listrik & Air (Juni)', amount: 1200000, date: '2026-07-05', category: 'utilities' },
  { id: 'op3', description: 'Perbaikan Pompa Air', amount: 850000, date: '2026-07-12', category: 'maintenance' },
];
`;
  fs.writeFileSync('src/data.ts', dataContent);
}
