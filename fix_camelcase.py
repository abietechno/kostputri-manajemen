import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

fetch_logic = """        if (roomsRes.data) {
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
        }"""

content = re.sub(r'if \(roomsRes\.data\) setRooms\(roomsRes\.data as any\);[\s\S]*?setProperty\(\(property \|\| mockProperty\) as any\);\n        \}', fetch_logic, content)

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)
