import { supabase } from '../lib/supabase';
import { Property, Room, Tenant, Payment, Employee, OperationalExpense } from '../types';

// -- PROPERTIES --
export const propertyApi = {
  getProperties: async () => {
    const { data, error } = await supabase.from('properties').select('*');
    if (error) throw error;
    return data as Property[];
  },
  createProperty: async (property: Omit<Property, 'id'>) => {
    const { data, error } = await supabase.from('properties').insert(property).select().single();
    if (error) throw error;
    return data as Property;
  },
  updateProperty: async (id: string, updates: Partial<Property>) => {
    const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Property;
  }
};

// -- ROOMS --
export const roomApi = {
  getRooms: async (propertyId?: string) => {
    let query = supabase.from('rooms').select('*');
    if (propertyId) query = query.eq('propertyId', propertyId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Room[];
  },
  createRoom: async (room: Omit<Room, 'id'>) => {
    const { data, error } = await supabase.from('rooms').insert(room).select().single();
    if (error) throw error;
    return data as Room;
  },
  updateRoom: async (id: string, updates: Partial<Room>) => {
    const { data, error } = await supabase.from('rooms').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Room;
  },
  deleteRoom: async (id: string) => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
  }
};

// -- TENANTS --
export const tenantApi = {
  getTenants: async () => {
    const { data, error } = await supabase.from('tenants').select('*');
    if (error) throw error;
    return data as Tenant[];
  },
  createTenant: async (tenant: Omit<Tenant, 'id'>) => {
    const { data, error } = await supabase.from('tenants').insert(tenant).select().single();
    if (error) throw error;
    // Also update room status to occupied
    await roomApi.updateRoom(tenant.roomId, { status: 'occupied' });
    return data as Tenant;
  },
  updateTenant: async (id: string, updates: Partial<Tenant>) => {
    const { data, error } = await supabase.from('tenants').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Tenant;
  }
};

// -- PAYMENTS/INVOICES --
export const paymentApi = {
  getPayments: async (tenantId?: string) => {
    let query = supabase.from('payments').select('*').order('dueDate', { ascending: false });
    if (tenantId) query = query.eq('tenantId', tenantId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Payment[];
  },
  createPayment: async (payment: Omit<Payment, 'id'>) => {
    const { data, error } = await supabase.from('payments').insert(payment).select().single();
    if (error) throw error;
    return data as Payment;
  },
  updatePaymentStatus: async (id: string, status: 'paid' | 'pending' | 'overdue', method?: string) => {
    const updates: Partial<Payment> = { status };
    if (method) updates.paymentMethod = method;
    if (status === 'paid') updates.paymentDate = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase.from('payments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Payment;
  }
};

// -- DASHBOARD STATS --
export const statsApi = {
  getDashboardStats: async () => {
    // In a real scenario, this might be a Postgres View or RPC function in Supabase
    // Here we simulate it by fetching the needed data and aggregating
    const [payments, tenants, rooms] = await Promise.all([
      supabase.from('payments').select('amount, status'),
      supabase.from('tenants').select('id').eq('status', 'active'),
      supabase.from('rooms').select('id, status')
    ]);

    const totalIncome = (payments.data || [])
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
      
    const pendingPayments = (payments.data || [])
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalIncome,
      pendingPayments,
      activeTenants: tenants.data?.length || 0,
      availableRooms: (rooms.data || []).filter(r => r.status === 'available').length
    };
  }
};
