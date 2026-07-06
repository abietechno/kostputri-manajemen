# Deployment Manual: Vercel + Supabase

Panduan ini akan membantu Anda mendeploy aplikasi web manajemen kost ini (KOST PUTRI KREMBANGAN) ke Vercel dan menghubungkannya dengan database Supabase.

## 1. Persiapan Database (Supabase)

1. Buka [Supabase](https://supabase.com/) dan buat akun/login.
2. Klik **"New Project"**, pilih organisasi Anda, beri nama proyek (misal: \`estateflow-db\`), buat password database, dan pilih region terdekat (misal: Singapore). Tunggu beberapa menit hingga proyek selesai dibuat.
3. Masuk ke menu **"SQL Editor"** di dashboard Supabase (ikon terminal di sidebar kiri) lalu buat tabel-tabel berikut dengan menjalankan query SQL ini:

\`\`\`sql
-- Tabel Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "totalRooms" INTEGER NOT NULL,
  facilities TEXT[]
);

-- Tabel Rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "propertyId" UUID REFERENCES properties(id),
  "roomNumber" TEXT NOT NULL,
  type TEXT NOT NULL,
  "pricePerMonth" INTEGER NOT NULL,
  status TEXT CHECK (status IN ('available', 'occupied', 'maintenance')),
  facilities TEXT[]
);

-- Tabel Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  "roomId" UUID REFERENCES rooms(id),
  "roomNumber" TEXT NOT NULL,
  phone TEXT NOT NULL,
  ktp TEXT NOT NULL,
  "entryDate" DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')),
  avatar TEXT
);

-- Tabel Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenantId" UUID REFERENCES tenants(id),
  "roomId" UUID REFERENCES rooms(id),
  amount INTEGER NOT NULL,
  "dueDate" DATE NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue')),
  month TEXT NOT NULL,
  "paymentMethod" TEXT,
  "paymentDate" DATE
);
\`\`\`

4. Jangan lupa matikan/setel RLS (Row Level Security) sesuai kebutuhan. Untuk tahap awal (pengembangan), Anda bisa mematikan RLS pada tabel agar API bisa langsung diakses (Pilih menu **Authentication** -> **Policies** -> Disable RLS, *Note: Nyalakan kembali di Production untuk keamanan*).
5. Buka menu **"Project Settings"** (ikon roda gigi) -> **"API"**. 
6. Salin **Project URL** dan **Project API Keys (anon, public)**. Anda akan membutuhkannya untuk Vercel.

## 2. Persiapan Deployment (Vercel)

1. Pastikan kode aplikasi Anda sudah di-push ke repository GitHub, GitLab, atau Bitbucket.
2. Buka [Vercel](https://vercel.com/) dan login.
3. Klik **"Add New"** -> **"Project"**.
4. Import repository aplikasi Anda.
5. Pada bagian **"Configure Project"**, biarkan Framework Preset sebagai **Vite**. Build Command (\`npm run build\`) dan Output Directory (\`dist\`) akan terdeteksi otomatis.
6. Buka bagian **"Environment Variables"**. Tambahkan kredensial Supabase Anda di sini:
   * **Name**: \`VITE_SUPABASE_URL\`
     * **Value**: *(Paste URL dari Supabase)*
   * **Name**: \`VITE_SUPABASE_ANON_KEY\`
     * **Value**: *(Paste anon key dari Supabase)*
7. Klik **"Deploy"**.
8. Tunggu proses build selesai. Setelah selesai, Vercel akan memberikan URL live aplikasi Anda (misal: \`https://estateflow.vercel.app\`).

## 3. Integrasi Aplikasi dengan Endpoint

Aplikasi ini telah disiapkan dengan \`src/lib/supabase.ts\` sebagai klien koneksi database dan \`src/services/api.ts\` yang berisi fungsi CRUD lengkap (Properties, Rooms, Tenants, Payments, Stats). 

Untuk menghubungkan UI dengan database sungguhan:
- Buka \`src/components/OwnerDashboard.tsx\` dan \`src/components/TenantApp.tsx\`.
- Ubah pengambilan data dari \`import { mockTenants... } from '../data'\` menjadi pemanggilan fungsi API menggunakan \`useEffect\` React.
- Contoh di OwnerDashboard:
  \`\`\`tsx
  import { useEffect, useState } from 'react';
  import { tenantApi, paymentApi, roomApi } from '../services/api';
  
  // Di dalam komponen:
  const [tenants, setTenants] = useState([]);
  
  useEffect(() => {
    async function loadData() {
      const data = await tenantApi.getTenants();
      setTenants(data);
    }
    loadData();
  }, []);
  \`\`\`

Selamat! Aplikasi Anda sekarang sudah full-stack dan siap digunakan dengan database nyata di cloud.
