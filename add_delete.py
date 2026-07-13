import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

delete_room = """
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
"""

content = content.replace('<button type="submit" className="w-full bg-primary text-white font-bold rounded-[20px] py-4 mt-6">Simpan Perubahan</button>\n              </form>', delete_room)

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)
