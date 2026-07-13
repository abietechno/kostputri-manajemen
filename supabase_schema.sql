-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Properties Table
create table properties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  total_rooms integer not null,
  facilities text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rooms Table
create table rooms (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  room_number text not null,
  type text not null,
  price_per_month integer not null,
  status text not null check (status in ('available', 'occupied', 'maintenance')),
  facilities text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tenants Table
create table tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  room_id uuid references rooms(id) on delete set null,
  room_number text,
  phone text not null,
  ktp text not null,
  entry_date date not null,
  status text not null check (status in ('active', 'inactive')),
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments Table
create table payments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) on delete cascade,
  room_id uuid references rooms(id) on delete set null,
  amount integer not null,
  due_date date not null,
  status text not null check (status in ('paid', 'pending', 'overdue')),
  month text not null,
  payment_method text,
  payment_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Employees Table
create table employees (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  salary integer not null,
  status text not null check (status in ('active', 'inactive')),
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Operational Expenses Table
create table operational_expenses (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  amount integer not null,
  date date not null,
  category text not null check (category in ('salary', 'maintenance', 'utilities', 'other')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

