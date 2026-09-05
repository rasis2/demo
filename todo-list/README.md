# ✅ Todo List

Webapp **pengurusan tugas harian** — statik (HTML + JavaScript tulen + **Tailwind CSS** via Play CDN untuk gaya). Semua data disimpan automatik di **localStorage** pelayar anda; tiada pendaftaran, tiada muat naik ke pelayan.

## Cara Guna

1. Buka `index.html` dalam mana-mana pelayar moden (Chrome, Edge, Firefox, Safari) — atau deploy folder ini ke mana-mana hosting statik.
2. Tekan **"+ Tambah Task"** untuk menambah task — isi tajuk (wajib), nota, keutamaan, kategori, dan tarikh/masa akhir (semua pilihan kecuali tajuk).
3. **Togol siap** dengan klik kotak semak; task siap dipaparkan *strikethrough*.
4. **Filter** dengan tab *Semua / Aktif / Selesai*, **carian** teks (tajuk + nota), dan **tapis kategori**.
5. **Susun semula** dengan seret tombol ⋮⋮ (berfungsi untuk tetikus & sentuh), atau tukar ke **"Susun: Ikut Prioriti"** untuk urutan automatik.
6. **Import / Eksport** — bawa data masuk daripada teks copy-paste, atau muat turun sebagai `.txt` / `.json`.

## Ciri

| Ciri | Butiran |
|---|---|
| Tambah / Edit / Padam | Modal penuh, padam dengan pengesahan |
| Tanda selesai | Togol checkbox, gaya *strikethrough* + redup |
| Filter | Semua / Aktif / Selesai (dengan kiraan) + tapis kategori |
| Carian | Teks dalam tajuk & nota (multi-perkataan = AND) |
| Keutamaan | Rendah / Sederhana / Tinggi — badge berwarna, boleh susun ikut prioriti |
| Kategori | Label bebas, boleh tambah kategori baru; chip kemajuan per kategori |
| Deadline | Tarikh + opsyen masa; task lewat ditanda **"Terlewat"** (overdue) |
| Progress | Bar peratusan keseluruhan + per kategori |
| Drag & drop | Pointer Events (HTML5-free) — jalan di desktop & peranti sentuh |
| Simpanan | localStorage automatik, kekal selepas refresh |
| Import | Teks copy-paste — tambah atau ganti (dengan pengesahan) |
| Eksport | `.txt` (format import semula) dan `.json` (struktur penuh) |
| Tema | Gelap (default) + toggle terang/gelap |
| Bahasa | 100% Bahasa Melayu |

### Format Import (satu baris = satu task)

```
[Tinggi] Siapkan laporan bulanan #Kerja @2026-09-10
[x] [Rendah] Beli susu #Rumah @2026-09-12T14:30 | susu rendah lemak
Beli hadiah hari jadi #Personal | jangan lupa bungkus
```

- `[x]` / `[ ]` — status siap / belum
- `[Tinggi]` / `[Sedang]` / `[Rendah]` (alias: `T`/`S`/`R`, `high`/`medium`/`low`) — keutamaan
- `#kategori` — kategori task
- `@YYYY-MM-DD` — tarikh akhir; `@YYYY-MM-DDTHH:mm` — termasuk masa
- `| nota` — nota task
- Baris kosong / bermula `//` atau `--` diabaikan

## Struktur Folder

```
todo-list/
├── index.html            # Halaman utama (UI Bahasa Melayu, Tailwind Play CDN + CSS variables tema)
├── style.css             # Custom CSS untuk komponen dinamik (task item, modal, toast, dsb.)
├── js/
│   ├── core.js           # Teras logik (UMD — berfungsi browser & Node)
│   └── app.js            # Logik UI: modal, filter, drag & drop, import/eksport
├── test/
│   ├── test-core.js      # Ujian Node (36 ujian logik teras)
│   ├── test-browser.js   # Ujian browser penuh (headless Edge via CDP, 20 ujian)
│   └── test-harness.html # Harness browser (buka terus / headless)
└── README.md
```

## Cara Deploy

Folder ini adalah **statik** — tiada build/pemampatan diperlukan:

> **Nota:** Tailwind Play CDN (`cdn.tailwindcss.com`) dimuatkan terus oleh pelayar pada waktu jalan — sambungan internet diperlukan pada pertama muat (dan disimpan dalam cache). Semua fungsi aplikasi (CRUD, localStorage, import/eksport) tidak bergantung pada CDN dan terus berfungsi jika CDN tidak dapat dimuat.

- **GitHub Pages** — push folder ini dan letak servis dari akar repo, atau gunakan folder `/docs`.
- **Netlify / Vercel / Cloudflare Pages** — drag & drop folder `todo-list` atau sambungkan repo (publish directory: `todo-list`).
- **Servidor sendiri** — salin folder ke mana-mana folder web (nginx/Apache) atau jalankan `npx serve .` / `python -m http.server 8000`.

Data pengguna kekal dalam pelayar (localStorage) — hosting hanya menghidangkan fail statik.

## Ujian

| Tetapan | Hasil |
|---|---|
| **Node** (`node test/test-core.js`) | ✅ **36/36 lulus** — CRUD, filter, carian, import parse, round-trip eksport TXT, JSON, localStorage, overdue, susun semula, statistik |
| **Browser penuh** (`node test/test-browser.js`) | ✅ **21/21 lulus** — smoke boot, tambah/edit/padam/togol via UI sebenar, filter, carian, import (tambah & ganti), eksport, persist selepas refresh, drag & drop, tema, responsif 375px & 768px, tiada error console |
| **Harness browser** (`test/test-harness.html`) | ✅ **9/9 lulus** — logik teras dalam persekitaran pelayar sebenar |

## Nota / Batasan

- Data terikat pada pelayar/peranti (localStorage) — guna eksport `.txt`/`.json` untuk sandaran atau pindah peranti.
- Task tanpa tarikh tidak dianggap terlewat; deadline tarikh sahaja masih dianggap sah sehingga hujung hari tersebut.
- Masa bagi deadline ditetapkan dalam zon waktu setempat pelayar.