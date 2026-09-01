# 📄 Gabung ke PDF

Webapp statik untuk **menggabungkan semua imej & fail PDF menjadi SATU fail PDF** — berjalan sepenuhnya dalam browser, tiada backend, tiada muat naik ke pelayan. Data anda kekal pada peranti anda.

## Cara Guna

1. Buka `index.html` dalam mana-mana browser moden (Chrome, Edge, Firefox, Safari).
2. **Pilih fail** — klik zon "Pilih Fail" atau **seret & lepas** banyak fail sekaligus.
   - Disokong: `PNG`, `JPG/JPEG`, `GIF`, `WebP`, `BMP`, `SVG` dan fail `PDF` sedia ada.
3. Susun semula fail ikut kehendak (urutan = urutan muka surat dalam PDF):
   - Gunakan butang **↑ / ↓** pada setiap baris, atau
   - **Seret baris** ke kedudukan baharu.
4. Klik **"Gabung ke PDF"** — tunggu proses siap.
5. Muat turun PDF siap melalui pautan. Paparan menunjukkan **bilangan muka surat** dan **saiz fail**.

Semua imej diletak pada halaman **A4 (595.28 × 841.89 pt)** dengan skala *fit halaman* (imej muat penuh, tiada bahagian terpotong, di-tengah halaman).

## Struktur Folder

```
merge-to-pdf/
├── index.html            # Halaman utama (UI Bahasa Melayu)
├── style.css             # Gaya (responsive: desktop & mobile)
├── js/
│   ├── merge-core.js     # Teras logik merge (UMD — berfungsi browser & Node)
│   └── app.js            # Logik UI: drag & drop, senarai fail, thumbnail, progress
├── vendor/
│   └── pdf-lib.min.js    # Library pdf-lib v1.17.1 (ditempatkan secara lokal = offline)
├── test/
│   ├── assets/           # Aset ujian (4 imej + PDF 2 halaman)
│   ├── test-merge.js     # Ujian Node (logik merge)
│   ├── test-harness.html # Ujian browser (harness headless)
│   └── harness-data.js   # Aset ujian dalam base64 (untuk harness)
└── README.md
```

## Cara Ia Berfungsi

- **Library**: [pdf-lib](https://pdf-lib.js.org/) v1.17.1 — murni JavaScript, tanpa dependency lain. Dimuat turun dan diletak dalam `vendor/` supaya webapp berfungsi **offline** (tiada CDN wajib).
- **Imej**: 
  - `JPEG` / `PNG` di-embed **terus** daripada bait asal (kualiti asal dikekalkan).
  - Format lain (`GIF`, `WebP`, `BMP`, `SVG`) dan JPEG/PNG yang bermasalah (cth: CMYK/progresif) di-raster melalui `<canvas>` → ditukar ke PNG → di-embed.
  - Setiap imej diletak pada satu halaman A4 dengan pengiraan `scaleToFit()` — saiz dikira supaya muat penuh dan dipusatkan.
- **PDF sedia ada**: dimuat dengan `PDFDocument.load(..., { ignoreEncryption: true })`, halamannya disalin satu-satu dengan `copyPages()` dan ditambah ke dokumen output — susunan halaman dikekalkan.
- **Urutan**: output PDF mengikut susunan fail dalam senarai UI (boleh disusun semula).
- **Kesilapan fail**: jika satu fail gagal diproses, fail lain diteruskan; senarai kegagalan dipaparkan dalam panel hasil.

## Ujian (2 September 2026)

| Ujian | Hasil |
|---|---|
| **Node** (`test/test-merge.js`) — 4 fail (PNG + JPEG + PDF 2 halaman + fail .txt invalid) | ✅ 10/10 lulus — pageCount betul, output sah (dimuat semula), semua halaman A4, fail invalid dilaporkan tanpa halaman kosong, urutan betul |
| **Browser headless** (Edge, `test/test-harness.html`) — 5 fail (PNG/JPEG/BMP/GIF + PDF 2 halaman) | ✅ LULUS — 6 halaman A4 (`595x842`), dimuat semula = 6 halaman, 0 error, saiz 40,391 B |
| **UI smoke** (Edge headless buka `index.html`) | ✅ LULUS — dropzone & senarai dirender, butang merge disabled pada mulanya, tiada ralat JS |

## Nota / Isu

- GIF beranimasi digabung sebagai **frame pertama** sahaja (sifat `canvas.toDataURL`).
- PDF yang disulitkan (dengan kata laluan) mungkin tidak dapat digabung jika kandungannya disulitkan — kegagalan akan dilaporkan per fail.
- Fail besar (berjuta piksel) di-raster dengan had maksimum 4000px untuk mengelak kanvas gergasi.
- Tiada kebergantungan internet — semuanya dalam folder ini.