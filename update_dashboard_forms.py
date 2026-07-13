import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

# Replace <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowDownRight className="w-5 h-5 text-[#FF3B30]" /> Pengeluaran Operasional</h3>
# with a flex container holding the title and an "Add" button
finance_expenses_title = '<h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowDownRight className="w-5 h-5 text-[#FF3B30]" /> Pengeluaran Operasional</h3>'
finance_expenses_title_new = """<div className="flex justify-between items-center mb-4">
             <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2"><ArrowDownRight className="w-5 h-5 text-[#FF3B30]" /> Pengeluaran Operasional</h3>
             <button onClick={() => setIsAddingExpense(true)} className="bg-text-main text-ios-bg px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-colors">Tambah</button>
           </div>"""
content = content.replace(finance_expenses_title, finance_expenses_title_new)

# Similarly for Pegawai (Employees)
employees_title = '<h1 className="font-heading text-2xl font-bold text-text-main">Pegawai & Gaji</h1>'
employees_title_new = """<div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-main">Pegawai & Gaji</h1>
        <button onClick={() => setIsAddingEmployee(true)} className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">
          Tambah Pegawai
        </button>
      </div>"""
# The employees tab already has a header, let's see how it looks
# "Manajemen Pegawai"? Let's grep it.
