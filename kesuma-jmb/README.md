# Kesuma JMB — Sistem Pengurusan Harta (Property Management System)

Sistem pengurusan harta bersepadu untuk **Residensi Kesuma, Beranang** — 475 unit, 19 tingkat. Berjalan **sepenuhnya dalam pelayar** (localStorage), tanpa pelayan, sedia untuk demo di GitHub Pages / Netlify.

🌐 **Demo live:** `https://rasis2.github.io/demo/kesuma-jmb/`

---

## Modul (Full Property Management)

| Modul | Halaman | Peranan |
|-------|---------|---------|
| 📊 Dashboard | `/dashboard` | Gambaran keseluruhan sistem (PIN 1125) |
| 📦 Sistem Parsel | `/dispatcher`, `/owner` | Dispatcher daftar parsel, pemilik sahkan & ambil |
| 🪪 Sistem Pelawat | `/visitor-register`, `/visitor-check`, `/guard` | Daftar QR, kelulusan pemilik, guard check in/out |
| 🔧 Penyelenggaraan | `/maintenance` | Aduan kerosakan, kategori, keutamaan & status |
| 💰 Pembayaran | `/payments` | Caj penyelenggaraan, bayaran & resit |
| 📢 Notis & Pengumuman | `/announcements` | Pengumuman rasmi JMB (boleh disemat) |
| 📅 Tempahan Kemudahan | `/bookings` | Tempah dewan, gim, BBQ & lain-lain |
| 🚗 Kenderaan & Parkir | `/vehicles` | Daftar kenderaan & lot parkir |
| 📄 Dokumen | `/documents` | Minuta, borang & laporan |
| 👥 Direktori Penduduk | `/residents` | Senarai pemilik unit (PIN 1125) |

---

## Akses Demo

| Peranan | Cara Masuk |
|---------|-----------|
| **Pentadbir / Admin** | PIN `1125` (admin, guard, dispatcher, dashboard, residents) |
| **Pemilik / Owner** | Unit `4-1` → email `unit4-1@kesuma.my` (atau telefon yang dipaparkan) |
| **Pelawat** | Daftar sendiri → kod rujukan + QR |

---

## Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| "Backend" | localStorage (data layer `js/db.js` + API `js/api.js`) — zero server |
| QR Code | [QRCode.js](https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js) |
| Hosting | GitHub Pages / Netlify (statik) |
| Bahasa | 🇲🇾 BM · 🇬🇧 EN · 🇨🇳 中文 · 🇮🇳 தமிழ் (4 bahasa) |
| Tema | 🌑 Obsidian · ☀️ Light · 🌊 Breeze · 🍬 Candy |

> Semua data disimpan dalam `localStorage` pelayar — tiada muat naik, tiada pelayan, privasi terjaga. Sesuai untuk demo; data akan reset bila cache dibersihkan.

---

## Data & Skema (localStorage → `js/db.js`)

Koleksi utama:

```js
owners        // unit, name, email, phone, vehicle_plate, vehicle_model, parking_lot
parcels       // unit, courier, image, status (Pending/Done)
visitors      // ref_code, name, ic_no, phone, unit, purpose, vehicle, status
maintenance   // unit, category, title, desc, priority, status (Open/In Progress/Resolved), notes
payments      // unit, period, amount, method, status, receipt
announcements // title, category, body, pinned, author
bookings      // unit, facility_id, facility_name, date, start, end, status
facilities    // name, icon, capacity, cost
documents     // title, category, desc, url
fees          // monthly (caj bulanan)
settings      // pin_admin / pin_guard / pin_dispatcher, nama & alamat
```

475 unit dijana automatik (tingkat 4–22 × 25 unit), lengkap dengan data demo (parsel, pelawat, aduan, bayaran, notis) supaya sistem "hidup" sebaik dibuka.

---

## Struktur Fail

```
kesuma-jmb/
├── index.html            # Portal utama semua sistem
├── dashboard.html        # Overview stats + akses pantas
├── admin.html            # Console pentadbir (parsel + pelawat + modul)
├── owner.html            # Portal pemilik (parsel, pelawat, notis, baki caj)
├── dispatcher.html       # Daftar parsel
├── guard.html            # Check in/out pelawat
├── visitor-register.html # Daftar lawatan + QR
├── visitor-check.html    # Semak status lawatan
├── maintenance.html      # Aduan & penyelenggaraan
├── payments.html         # Caj & pembayaran
├── announcements.html    # Notis & pengumuman
├── bookings.html         # Tempahan kemudahan
├── vehicles.html         # Kenderaan & parkir
├── documents.html        # Dokumen & borang
├── residents.html        # Direktori penduduk
├── css/style.css         # Design system (4 tema)
└── js/
    ├── db.js             # Enjin data localStorage + seed
    ├── api.js            # Lapisan API (semua modul)
    ├── ui.js             # Helper UI (toast, badge, fmt, dsb.)
    ├── i18n.js           # 4 bahasa
    ├── theme.js          # 4 tema
    └── nav.js            # Navigasi
```

---

## Penyebaran

Statik sahaja — tiada build step. Auto-deploy setiap push ke `main`.

```
GitHub push → GitHub Pages / Netlify → Live dalam ~30 saat
```

Clean URLs dikonfigurasi dalam `netlify.toml` (untuk Netlify).

---

*475 unit · 19 tingkat · 10 modul · 0 pelayan*
