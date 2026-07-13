import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

# Update Tambah Pegawai
content = content.replace(
    '<button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">\n          Tambah Pegawai\n        </button>',
    '<button onClick={() => setIsAddingEmployee(true)} className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">\n          Tambah Pegawai\n        </button>'
)

with open('src/components/OwnerDashboard.tsx', 'w') as f:
    f.write(content)
