# RK1 — Sistem Pengurusan Harta (Supabase)

Sistem pengurusan harta bersepadu untuk **Residensi Kesuma, Beranang** (475 unit, 19 tingkat) dengan backend **Supabase** sebenar — semua data kekal & dikemas kini dalam pangkalan data awan, bukan localstorage.

🎨 **UI:** Single-Page App moden — sidebar, dashboard stats, modal, toast, 4 tema (Obsidian / Light / Breeze / Candy), 4 bahasa (🇲🇾 BM · 🇬🇧 EN · 🇨🇳 中文 · 🇮🇳 தமிழ்), responsif penuh.

---

## 🔌 Setup (penting — sekali sahaja)

App tidak berfungsi sehingga ia disambungkan ke projek Supabase anda:

1. **Buat projek Supabase** percuma di [supabase.com](https://supabase.com) (atau guna projek sedia ada).
2. Buka **SQL Editor** dalam dashboard Supabase → tampal keseluruhan kandungan **`schema.sql`** → **RUN**. (Ini mencipta semua jadual: `owners`, `parcels`, `visitors`, `maintenance`, `payments`, `announcements`, `facilities`, `bookings`, `documents`, `settings` + seed 475 unit.)
3. Buat **Storage bucket** `parcel-images` (public) dan jalankan 4 baris policy storage di bahagian bawah `schema.sql`.
4. Buka app → skrin **"Sambungkan Supabase"** akan muncul → masukkan:
   - **Project URL** (Supabase → Settings → API)
   - **Anon public key** (Settings → API)
   - Klik **Sambungkan**.
5. Selesai! Data disimpan terus ke Supabase.

> Alternatif: isi terus `SUPABASE_URL` & `SUPABASE_ANON` dalam `js/config.js` (atau dari skrin Tetapan → Sambungan).

---

## 🧩 Modul (Full Property Management)

| Modul | Fungsi |
|-------|--------|
| 📊 **Dashboard** | Statistik (unit, parsel, pelawat, aduan, kutipan bayaran, tempahan) + notis + akses pantas |
| 📦 **Parsel** | Dispatcher daftar (foto → Supabase Storage), pemilik tandai diambil, pemantauan pentadbir |
| 🪪 **Pelawat** | Daftar lawatan + QR code + kod rujukan, kelulusan pemilik, guard check in/out |
| 🔧 **Penyelenggaraan** | Aduan kerosakan (kategori/keutamaan), status kerja, nota pengurusan |
| 💰 **Pembayaran** | Caj bulanan (boleh set), bayaran (FPX/DuitNow/Tunai/dll), resit, baki & sejarah |
| 📢 **Notis** | Pengumuman JMB, boleh disemat (pinned) |
| 📅 **Tempahan** | Tempah dewan/gim/BBQ dll dengan semakan konflik slot, kelulusan pentadbir |
| 🚗 **Kenderaan** | Daftar kenderaan & lot parkir per unit |
| 📄 **Dokumen** | Minuta, borang, laporan (pautan) |
| 👥 **Penduduk** | Direktori 475 unit dengan carian (admin) |
| 🏠 **Penyewa (Tenant)** | Urus penyewa sewa unit + akaun login mereka (admin) |
| ⚙️ **Tetapan** | Info bangunan, caj bulanan, PIN, ujian sambungan Supabase |

---

## 🔐 Akses (username + password)

Semua peranan log masuk dengan **username & password** (jadual `users`):

| Peranan | Username | Password |
|---------|----------|----------|
| Pentadbir (Admin) | `admin` | `admin123` |
| Keselamatan (Guard) | `guard` | `guard123` |
| Dispatcher | `dispatcher` | `dispatcher123` |
| Pemilik (cth. unit 4-1) | `4-1` | `kesuma123` |
| Penyewa / Tenant (cth.) | `t-4-1` | `kesuma123` |

> Semua 475 unit ada akaun pemilik (username = unit, password `kesuma123`). Tenant diurus oleh admin dalam modul **Penyewa (Tenants)** — bila tambah tenant, akaun login mereka turut dicipta.

---

## 🗄️ Skema (ringkasan)

```sql
owners        unit, name, email, phone, ic_no, vehicle_plate, vehicle_model, parking_lot
parcels       unit, courier, image_url, status, created_at, collected_at
visitors      ref_code, name, ic_no, phone, unit, purpose, vehicle_type, vehicle_plate, status, timestamps
maintenance   unit, category, title, description, priority, status, notes, closed_at
payments      unit, period, amount, method, status, receipt
announcements title, category, body, pinned, author
facilities    name, icon, capacity, cost
bookings      unit, facility_id, facility_name, date, start, end, status
documents     title, category, description, url
settings      key/value (name, address, monthly_fee, pin_admin, pin_guard, pin_dispatcher)
```

RLS diaktifkan dengan policy anon (sesuai demo) — untuk produksi, hadkan kepada authenticated user.

---

## 🛠️ Teknologi

- **Frontend:** HTML5, CSS3, Vanilla JS (SPA tanpa build step)
- **Backend:** [Supabase](https://supabase.com) — PostgreSQL + PostgREST + Storage (supabase-js v2, di-vendor secara tempatan → tanpa CDN)
- **QR:** [qrcodejs](https://github.com/davidshimjs/qrcodejs)
- **Hosting:** GitHub Pages / Netlify (statik sahaja)

---

## 📁 Struktur

```
kesuma-jmb/
├── index.html            # SPA shell
├── schema.sql            # SQL lengkap (jalankan dalam Supabase SQL Editor)
├── css/style.css         # Design system (4 tema)
├── vendor/supabase.min.js# supabase-js v2 (ditempatkan tempatan)
└── js/
    ├── config.js         # Konfigurasi Supabase (atau guna skrin setup)
    ├── i18n.js           # 4 bahasa + helpers
    ├── api.js            # Lapisan data Supabase (CRUD + Storage)
    ├── app.js            # Teras SPA: router, nav, sesi, dashboard, setup
    └── views-1..3.js     # View modul (parsel, pelawat, dll.)
```

*475 unit · 19 tingkat · 11 modul · 0 pelayan sendiri · Supabase sebagai backend*
