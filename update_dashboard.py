import re

with open('src/components/OwnerDashboard.tsx', 'r') as f:
    content = f.read()

# Add states for modals
new_states = """  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isAddingTenant, setIsAddingTenant] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);"""

content = re.sub(r'const \[editingRoom, setEditingRoom\] = useState<any \| null>\(null\);', r'const [editingRoom, setEditingRoom] = useState<any | null>(null);\n' + new_states, content)

# 1. Update Tambah Kamar button
content = content.replace(
    '<button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">\n          Tambah Kamar\n        </button>',
    '<button onClick={() => setIsAddingRoom(true)} className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">\n          Tambah Kamar\n        </button>'
)

# 2. Update Edit Property button (Wait, there is none, let's add one near property name)
prop_header = '<h2 className="font-heading font-bold text-xl text-text-main mb-2">{(property || mockProperty).name}</h2>'
prop_header_new = """<div className="flex justify-between items-center mb-2">
              <h2 className="font-heading font-bold text-xl text-text-main">{(property || mockProperty).name}</h2>
              <button onClick={() => setIsEditingProperty(true)} className="text-primary text-sm font-medium hover:underline">Edit</button>
            </div>"""
content = content.replace(prop_header, prop_header_new)

# 3. Update Tambah Penghuni button
content = content.replace(
    '<button className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">\n          Tambah Penghuni\n        </button>',
    '<button onClick={() => setIsAddingTenant(true)} className="bg-text-main text-ios-bg px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-80 transition-colors">\n          Tambah Penghuni\n        </button>'
)

# 4. We need a "Tambah Pengeluaran" button in Finance
# There is a button with "Catat Pengeluaran" maybe? Let's check Finance section.
