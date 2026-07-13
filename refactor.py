import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { ViewState } from '../types';", "import { ViewState, Room, Tenant, Payment, Employee, OperationalExpense, Property } from '../types';\nimport { useEffect } from 'react';\nimport { supabase } from '../lib/supabase';")

# Replace states
state_declarations = """  const [rooms, setRooms] = useState<Room[]>([]);
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

        if (roomsRes.data) setRooms(roomsRes.data as any);
        if (tenantsRes.data) setTenants(tenantsRes.data as any);
        if (paymentsRes.data) setPayments(paymentsRes.data as any);
        if (employeesRes.data) setEmployees(employeesRes.data as any);
        if (expensesRes.data) setExpenses(expensesRes.data as any);
        if (propertiesRes.data && propertiesRes.data.length > 0) {
          setProperty(propertiesRes.data[0] as any);
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
"""
content = re.sub(r"const \[rooms, setRooms\] = useState\(mockRooms\);", state_declarations, content)

# Calculate stats
stats_calc = """  const stats = {
    totalIncome: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    activeTenants: tenants.filter(t => t.status === 'active').length,
    availableRooms: rooms.filter(r => r.status === 'available').length
  };
"""

content = re.sub(r"const overduePayments = mockPayments", stats_calc + "\n  const overduePayments = payments", content)

# Replace remaining mock usages
content = content.replace("mockTenants", "tenants")
content = content.replace("mockPayments", "payments")
content = content.replace("mockEmployees", "employees")
content = content.replace("mockExpenses", "expenses")
content = content.replace("mockStats", "stats")
content = content.replace("mockRooms", "rooms")
content = content.replace("mockProperty", "(property || mockProperty)")

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)
