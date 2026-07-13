import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

delete_tenant = """
                      <div className="flex gap-4">
                        <button type="button" onClick={async () => {
                          if (!confirm('Apakah anda yakin ingin menghapus penghuni ini?')) return;
                          try {
                            const { error } = await supabase.from('tenants').delete().eq('id', tenant.id);
                            if (error) throw error;
                            setTenants(prev => prev.filter(t => t.id !== tenant.id));
                            setSelectedTenant(null);
                          } catch(err) {
                            console.error(err);
                            alert('Gagal menghapus penghuni');
                          }
                        }} className="w-full bg-[#FF3B30]/10 text-[#FF3B30] font-bold rounded-[20px] py-4">Hapus</button>
                        <button 
                          onClick={() => setSelectedTenant(null)}
                          className="w-full bg-bg-hover text-text-main font-bold rounded-[20px] py-4"
                        >
                          Tutup
                        </button>
                      </div>
"""

content = content.replace("""                      <button 
                         onClick={() => setSelectedTenant(null)}
                        className="w-full bg-bg-hover text-text-main font-bold rounded-[20px] py-4"
                      >
                        Tutup
                      </button>""", delete_tenant)

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)
