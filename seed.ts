import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function seed() {
  const { data: properties } = await supabase.from('properties').select('id');
  if (!properties || properties.length === 0) {
    const { data: insertedProp, error: propErr } = await supabase.from('properties').insert({
      name: 'Kos Andalan',
      address: 'Jl. Merdeka No. 123, Jakarta',
      total_rooms: 20,
      facilities: ['WiFi', 'Parkir', 'CCTV', 'Dapur Bersama']
    }).select().single();
    
    if (propErr) {
        console.error('Error seeding property:', propErr);
        return;
    }
    
    // Seed some rooms
    await supabase.from('rooms').insert([
        { property_id: insertedProp.id, room_number: '101', type: 'Standard', price_per_month: 1500000, status: 'available', facilities: ['AC', 'Kamar Mandi Dalam'] },
        { property_id: insertedProp.id, room_number: '102', type: 'VIP', price_per_month: 2500000, status: 'available', facilities: ['AC', 'TV', 'Kamar Mandi Dalam', 'Kulkas'] }
    ]);
    console.log('Seeded successfully!');
  } else {
    console.log('Database already has data.');
  }
}
seed();
