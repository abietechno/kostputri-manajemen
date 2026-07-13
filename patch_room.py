import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

onSubmit = """              <form onSubmit={async (e) => {
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
              }} className="space-y-4">"""

content = re.sub(r'<form onSubmit=\{\(e\) => \{[\s\S]*?\}\} className="space-y-4">', onSubmit, content)

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)
