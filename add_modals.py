import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

modals = """
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
                 <button type="submit" className="w-full bg-primary text-white font-bold rounded-[20px] py-4 mt-6">Simpan Perubahan</button>
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
"""

content = content.replace("        {isPaymentModalOpen && (", modals + "\n        {isPaymentModalOpen && (")

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)

