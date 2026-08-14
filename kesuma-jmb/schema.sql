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

-- If the owners table already existed (e.g. from the older version),
-- add any missing columns without touching existing data.
alter table public.owners add column if not exists name text not null default '';
alter table public.owners add column if not exists ic_no text default '';
alter table public.owners add column if not exists vehicle_plate text default '';
alter table public.owners add column if not exists vehicle_model text default '';
alter table public.owners add column if not exists parking_lot text default '';
alter table public.owners add column if not exists vehicle_photo text default '';
alter table public.owners add column if not exists card_last4 text default '';
alter table public.owners add column if not exists auto_debit boolean not null default false;
alter table public.owners add column if not exists created_at timestamptz not null default now();

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
  vehicle_model text not null default '',
  status text not null default 'Pending', -- Pending | Approved | Rejected | Checked In | Checked Out
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  checked_in_at timestamptz,
  checked_out_at timestamptz
);
-- If visitors already existed, add any missing columns safely
alter table public.visitors add column if not exists vehicle_type text not null default '';
alter table public.visitors add column if not exists vehicle_plate text not null default '';
alter table public.visitors add column if not exists vehicle_model text not null default '';

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
  attachment text not null default '',
  created_at timestamptz not null default now()
);
-- If announcements already existed, add the attachment column safely
alter table public.announcements add column if not exists attachment text not null default '';

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
--  USERS (login accounts — username + password)
-- ─────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null,
  role text not null default 'owner', -- owner | tenant | admin | guard | dispatcher
  unit text,
  name text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  TENANTS (penyewa / renters per unit)
-- ─────────────────────────────────────────────
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  unit text not null references public.owners(unit) on delete cascade,
  name text not null,
  phone text not null default '',
  email text not null default '',
  ic_no text not null default '',
  start_date text not null default '',
  end_date text not null default '',
  status text not null default 'Active', -- Active | Ended
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
  ('guard_phone', '011-2345 6789'),
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

-- Login accounts: 3 staff + 1 per owner unit (only if users table is empty).
do $$
declare o record;
begin
  if not exists (select 1 from public.users limit 1) then
    insert into public.users (username, password, role, unit, name) values
      ('admin',      'admin123',      'admin',      null, 'Pentadbir'),
      ('guard',      'guard123',      'guard',      null, 'Keselamatan'),
      ('dispatcher', 'dispatcher123', 'dispatcher', null, 'Dispatcher');
    for o in select * from public.owners loop
      insert into public.users (username, password, role, unit, name)
      values (o.unit, 'kesuma123', 'owner', o.unit, coalesce(nullif(o.name, ''), 'Pemilik ' || o.unit));
    end loop;
  end if;
end $$;

insert into public.facilities (id, name, icon, capacity, cost)
select gen_random_uuid(), f.name, f.icon, f.capacity, f.cost
from (values
  ('Dewan Serbaguna', '🏛️', 100, 80),
  ('Gimnasium', '🏋️', 20, 0),
  ('Kolam Renang', '🏊', 40, 0),
  ('Tapak BBQ', '🍢', 30, 40),
  ('Taman Permainan', '🛝', 50, 0),
  ('Bilik Bacaan', '📚', 15, 0)
) as f(name, icon, capacity, cost)
where not exists (select 1 from public.facilities);

insert into public.announcements (title, category, body, pinned, author)
select * from (values
  ('Mesyuarat Agung Tahunan (AGM) 2026', 'AGM', 'Mesyuarat Agung Tahunan akan diadakan pada 15 Mac 2026, jam 10:00 pagi di Dewan Serbaguna. Semua pemilik dijemput hadir.', true, 'JMB Kesuma'),
  ('Kempen Kitar Semula', 'Kemudahan', 'Kempen kitar semula diadakan setiap Ahad pertama bulan. Sila asingkan bahan kitar semula anda.', false, 'JMB Kesuma'),
  ('Servis Lif Berkala', 'Penyelenggaraan', 'Servis lif A dan B pada 20 Februari 2026, 9:00 pagi – 5:00 petang.', false, 'JMB Kesuma')
) as a(title, category, body, pinned, author)
where not exists (select 1 from public.announcements);

-- ─────────────────────────────────────────────
--  MOCK DATA (untuk fitur baharu — hanya jalan jika table kosong)
--  · owners: kenderaan + kad + auto-debit
--  · parcels: senarai parsel untuk filter/monitor
--  · visitors: kenderaan pelawat untuk senarai kenderaan (badge Pelawat)
--  · payments: rekod bayaran termasuk Auto-Debit
-- ─────────────────────────────────────────────

-- 1) Kenderaan & kad pemilik (contoh beberapa unit)
update public.owners set
  vehicle_plate = o.vp, vehicle_model = o.vm, parking_lot = o.pl,
  card_last4 = o.c4, auto_debit = o.ad
from (values
  ('4-1',  'WXK 4521',  'Proton X50',    'A-01', '4242', true),
  ('4-2',  'JHT 3320',  'Perodua Myvi',  'A-02', '1111', true),
  ('5-3',  'VNF 8830',  'Honda Civic',   'B-01', '7888', false),
  ('6-4',  'PNM 1290',  'Toyota Vios',   'B-02', '',    false),
  ('7-5',  'WKT 7712',  'Perodua Axia',  'C-01', '2222', true),
  ('9-8',  'MQQ 5510',  'Mazda CX-5',    'D-01', '',    false),
  ('10-10','JKP 9077',  'Proton Saga',   'D-02', '3333', true)
) as o(unit, vp, vm, pl, c4, ad)
where public.owners.unit = o.unit;

-- 2) Parsel mock — campuran Pending & Done
insert into public.parcels (unit, courier, image_url, status, created_at, collected_at)
select * from (values
  ('4-1',  'J&T Express',            '', 'Pending', now() - interval '3 hours', null),
  ('4-1',  'Shopee Express (SPX)',   '', 'Done',    now() - interval '1 day',   now() - interval '1 day' + interval '6 hours'),
  ('5-3',  'Pos Laju',               '', 'Pending', now() - interval '5 hours', null),
  ('6-4',  'Ninja Van',              '', 'Pending', now() - interval '3 days',  null),
  ('7-5',  'DHL',                    '', 'Done',    now() - interval '2 days',  now() - interval '2 days' + interval '3 hours'),
  ('9-8',  'Lazada Logistics',       '', 'Pending', now() - interval '8 hours', null),
  ('10-10','City-Link',              '', 'Done',    now() - interval '5 days',  now() - interval '5 days' + interval '1 hour')
) as p(unit, courier, image_url, status, created_at, collected_at)
where not exists (select 1 from public.parcels);

-- 3) Pelawat dengan kenderaan (untuk senarai kenderaan → badge Pelawat)
insert into public.visitors (ref_code, name, ic_no, phone, unit, purpose, vehicle_type, vehicle_plate, vehicle_model, status, created_at)
select * from (values
  ('KESDEMO1', 'Ahmad bin Ali',   '900101-01-1234', '012-345 6789', '4-1',  'Ziarah',   'Kereta',    'WXW 1111', 'Perodua Bezza', 'Checked Out', now() - interval '1 day'),
  ('KESDEMO2', 'Siti Nurhaliza',  '880505-14-5678', '013-111 2222', '5-3',  'Hantar Barang', 'Motosikal', 'JHA 2222', 'Yamaha Y15ZR', 'Checked In',  now() - interval '2 hours'),
  ('KESDEMO3', 'Raj Kumar',       '910707-10-9012', '016-333 4444', '6-4',  'Urusan Kerja', 'Kereta',    'VNH 3333', 'Honda City',   'Pending',     now() - interval '30 minutes'),
  ('KESDEMO4', 'Lim Wei Jie',     '950101-08-3456', '017-555 6666', '7-5',  'Pembaikan', 'Lori / Van', 'JKP 4444', 'Toyota Hiace', 'Approved',    now() - interval '1 hour')
) as v(ref_code, name, ic_no, phone, unit, purpose, vehicle_type, vehicle_plate, vehicle_model, status, created_at)
where not exists (select 1 from public.visitors);

-- 4) Bayaran mock — termasuk Auto-Debit untuk unit berauto-debit
insert into public.payments (unit, period, amount, method, status, receipt, created_at)
select * from (values
  ('4-1',   'Januari 2026', 120, 'Auto-Debit', 'Paid', 'R-DEMO001', now() - interval '35 days'),
  ('4-1',   'Februari 2026',120, 'Auto-Debit', 'Paid', 'R-DEMO002', now() - interval '5 days'),
  ('4-2',   'Februari 2026',120, 'Auto-Debit', 'Paid', 'R-DEMO003', now() - interval '4 days'),
  ('5-3',   'Februari 2026',120, 'FPX',        'Paid', 'R-DEMO004', now() - interval '3 days'),
  ('7-5',   'Februari 2026',120, 'DuitNow',    'Paid', 'R-DEMO005', now() - interval '2 days'),
  ('10-10', 'Februari 2026',120, 'Bank Transfer','Paid','R-DEMO006',now() - interval '1 day')
) as pay(unit, period, amount, method, status, receipt, created_at)
where not exists (select 1 from public.payments);

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
alter table public.users       enable row level security;
alter table public.tenants     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['owners','parcels','visitors','maintenance','payments','announcements','facilities','bookings','documents','settings','users','tenants'] loop
    execute format('drop policy if exists "anon_all_%I" on public.%I', t, t);
    execute format('create policy "anon_all_%I" on public.%I for all using (true) with check (true)', t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────
--  STORAGE BUCKETS (run separately in Storage → New bucket, each PUBLIC: ON)
--  parcel-images · notices · vehicles
--  Then run these policies in SQL Editor:
-- ─────────────────────────────────────────────
-- insert into storage.buckets (id, name, public) values
--   ('parcel-images', 'parcel-images', true),
--   ('notices', 'notices', true),
--   ('vehicles', 'vehicles', true)
-- on conflict do nothing;
-- create policy "public read" on storage.objects for select using (bucket_id in ('parcel-images','notices','vehicles'));
-- create policy "public insert" on storage.objects for insert with check (bucket_id in ('parcel-images','notices','vehicles'));
-- create policy "public update" on storage.objects for update using (bucket_id in ('parcel-images','notices','vehicles'));
-- create policy "public delete" on storage.objects for delete using (bucket_id in ('parcel-images','notices','vehicles'));
