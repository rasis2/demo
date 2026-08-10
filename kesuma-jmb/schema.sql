-- ════════════════════════════════════════════════════════════
--  Kesuma JMB — Property Management System · Supabase Schema
--  Run this in your Supabase project → SQL Editor → New query.
--  Paste the whole file and click RUN. Then create the Storage
--  bucket (see bottom of file).
-- ════════════════════════════════════════════════════════════

-- ── Enable required extensions ──
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
--  OWNERS (units + resident info + vehicles)
-- ─────────────────────────────────────────────
create table if not exists public.owners (
  unit text primary key,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  ic_no text default '',
  vehicle_plate text default '',
  vehicle_model text default '',
  parking_lot text default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  PARCELS
-- ─────────────────────────────────────────────
create table if not exists public.parcels (
  id uuid primary key default gen_random_uuid(),
  unit text not null references public.owners(unit) on delete cascade,
  courier text not null,
  image_url text not null default '',
  status text not null default 'Pending', -- Pending | Done
  created_at timestamptz not null default now(),
  collected_at timestamptz
);

-- ─────────────────────────────────────────────
--  VISITORS
-- ─────────────────────────────────────────────
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  ref_code text unique not null,
  name text not null,
  ic_no text not null,
  phone text not null,
  unit text references public.owners(unit) on delete cascade,
  purpose text not null default '',
  vehicle_type text not null default '',
  vehicle_plate text not null default '',
  status text not null default 'Pending', -- Pending | Approved | Rejected | Checked In | Checked Out
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  checked_in_at timestamptz,
  checked_out_at timestamptz
);

-- ─────────────────────────────────────────────
--  MAINTENANCE (fault reports)
-- ─────────────────────────────────────────────
create table if not exists public.maintenance (
  id uuid primary key default gen_random_uuid(),
  unit text not null,
  category text not null default 'Lain-lain',
  title text not null,
  description text not null default '',
  priority text not null default 'Medium', -- Low | Medium | High
  status text not null default 'Open',     -- Open | In Progress | Resolved
  notes text not null default '',
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

-- ─────────────────────────────────────────────
--  PAYMENTS
-- ─────────────────────────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  unit text not null,
  period text not null,
  amount numeric not null default 0,
  method text not null default 'Cash',
  status text not null default 'Paid',
  receipt text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  ANNOUNCEMENTS
-- ─────────────────────────────────────────────
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Penting',
  body text not null default '',
  pinned boolean not null default false,
  author text not null default 'JMB Kesuma',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  FACILITIES + BOOKINGS
-- ─────────────────────────────────────────────
create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null default '🏛️',
  capacity int not null default 10,
  cost numeric not null default 0
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  unit text not null,
  facility_id uuid references public.facilities(id) on delete cascade,
  facility_name text not null default '',
  date text not null,
  start text not null,
  "end" text not null,
  status text not null default 'Pending', -- Pending | Approved | Rejected
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  DOCUMENTS
-- ─────────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Borang',
  description text not null default '',
  url text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  SETTINGS (key/value)
-- ─────────────────────────────────────────────
create table if not exists public.settings (
  key text primary key,
  value text not null default ''
);

insert into public.settings (key, value) values
  ('name', 'Residensi Kesuma'),
  ('address', 'Beranang, Selangor, Malaysia'),
  ('monthly_fee', '120'),
  ('pin_admin', '1125'),
  ('pin_guard', '1125'),
  ('pin_dispatcher', '1125'),
  ('seeded', 'true')
on conflict (key) do nothing;

-- ─────────────────────────────────────────────
--  SEED DATA
-- ─────────────────────────────────────────────
-- 475 units generator (floors 4–22 × 25 units). Runs only if owners is empty.
do $$
declare
  f int; u text; fl int; unit text; arr text[] := array['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','23A','25'];
  exists_count int;
begin
  select count(*) into exists_count from public.owners;
  if exists_count = 0 then
    for f in 4..22 loop
      foreach u in array arr loop
        fl := f * 37 + (case when u ~ '^[0-9]+$' then u::int else 1 end) * 11;
        unit := f || '-' || u;
        insert into public.owners (unit, name, email, phone) values (
          unit,
          'Pemilik ' || unit,
          'unit' || f || '-' || lower(replace(u,'A','a')) || '@kesuma.my',
          '01' || lpad(((fl % 900000000) + 100000000)::text, 9, '0')
        );
      end loop;
    end loop;
  end if;
end $$;

insert into public.facilities (id, name, icon, capacity, cost) values
  (gen_random_uuid(), 'Dewan Serbaguna', '🏛️', 100, 80),
  (gen_random_uuid(), 'Gimnasium', '🏋️', 20, 0),
  (gen_random_uuid(), 'Kolam Renang', '🏊', 40, 0),
  (gen_random_uuid(), 'Tapak BBQ', '🍢', 30, 40),
  (gen_random_uuid(), 'Taman Permainan', '🛝', 50, 0),
  (gen_random_uuid(), 'Bilik Bacaan', '📚', 15, 0)
on conflict do nothing;

insert into public.announcements (title, category, body, pinned, author) values
  ('Mesyuarat Agung Tahunan (AGM) 2026', 'AGM', 'Mesyuarat Agung Tahunan akan diadakan pada 15 Mac 2026, jam 10:00 pagi di Dewan Serbaguna. Semua pemilik dijemput hadir.', true, 'JMB Kesuma'),
  ('Kempen Kitar Semula', 'Kemudahan', 'Kempen kitar semula diadakan setiap Ahad pertama bulan. Sila asingkan bahan kitar semula anda.', false, 'JMB Kesuma'),
  ('Servis Lif Berkala', 'Penyelenggaraan', 'Servis lif A dan B pada 20 Februari 2026, 9:00 pagi – 5:00 petang.', false, 'JMB Kesuma')
on conflict do nothing;

-- ─────────────────────────────────────────────
--  ROW LEVEL SECURITY (demo-friendly: anon full access)
--  ⚠️ For production, replace with authenticated policies.
-- ─────────────────────────────────────────────
alter table public.owners      enable row level security;
alter table public.parcels     enable row level security;
alter table public.visitors    enable row level security;
alter table public.maintenance enable row level security;
alter table public.payments    enable row level security;
alter table public.announcements enable row level security;
alter table public.facilities  enable row level security;
alter table public.bookings    enable row level security;
alter table public.documents   enable row level security;
alter table public.settings    enable row level security;

do $$
declare t text;
begin
  foreach t in array array['owners','parcels','visitors','maintenance','payments','announcements','facilities','bookings','documents','settings'] loop
    execute format('drop policy if exists "anon_all_%I" on public.%I', t, t);
    execute format('create policy "anon_all_%I" on public.%I for all using (true) with check (true)', t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────
--  STORAGE BUCKET (run separately in Storage → New bucket)
--  Name: parcel-images  ·  Public bucket: ON
--  Then run these policies in SQL Editor:
-- ─────────────────────────────────────────────
-- insert into storage.buckets (id, name, public) values ('parcel-images', 'parcel-images', true) on conflict do nothing;
-- create policy "public read" on storage.objects for select using (bucket_id = 'parcel-images');
-- create policy "public insert" on storage.objects for insert with check (bucket_id = 'parcel-images');
-- create policy "public update" on storage.objects for update using (bucket_id = 'parcel-images');
-- create policy "public delete" on storage.objects for delete using (bucket_id = 'parcel-images');
