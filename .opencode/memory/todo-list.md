# Memori Subprojek: todo-list

## Last session (5/9/2026) — Perbaiki responsive design mobile (SELESAI)

- **Tugas**: UI mobile todo-list webapp buruk. Perbaiki responsive design untuk mobile view sahaja; JANGAN ubah struktur/JS logic (core.js & app.js tidak disentuh).
- **Fail diubah**:
  - `style.css` — perbaikan responsive: ambil medan saiz sentuh, susun topbar, pencegahan overflow.
  - `test/test-browser.js` — ganti satu ujian responsif lama dengan dua ujian audit penuh (375px & 768px).
- **Isu yang dibaiki** (semua dalam CSS, tiada HTML/JS diubah):
  1. **Topbar berselerak** → pada ≤599px `.topbar-inner` jadi lajur 2 baris (brand + baris tindakan `justify-content:space-between`); brand-icon/h1 dikecilkan, tagline disembunyi.
  2. **Saiz sentuh** → `.icon-btn` 30px visual tapi kawasan sentuh 44px via `::before`; pada ≤599px: `.btn` min-height 44px, `.btn.sm` 42px, `.btn.big` 100% lebar + 50px, `.icon-btn` 38px, `.tab` 40px, `.check` 26px, select/search input 44px. `.task-actions` `opacity:1` (skrin sentuh tiada hover).
  3. **Input mudah guna** → font-size 16px untuk search/select/field input (elak auto-zoom iOS), `-webkit-appearance:none` pada search.
  4. **Progress bar & filter muat** → `.tabs` tambah `flex-wrap:wrap` + hidden scrollbar; pada ≤520px `.select-row` jadi lajur (2 select menegak supaya teks panjang tak terpotong).
  5. **Tiada overflow** → `.task-title/.task-note` tambah `overflow-wrap:anywhere`; `.field-row .field` min-width 120px; `.modal` padding 10px, `.modal-box` padding lebih kecil + max-height. Tiada `overflow-x:hidden` global (elak pecahkan sticky topbar).
- **Ujian LULUS**:
  - `node test/test-core.js` → 36/36.
  - `node test/test-browser.js` → 21/21 (termasuk ujian baru: **375px** — 0 limpahan mendatar, tiada task/tabs/select/stats overflow, butang & input ≥44px, modal muat; **768px** — 0 limpahan, filter selari mendatar, tabs & selects dalam toolbar; harness 9/9; tiada error console).
- **Status**: siap, tiada commit/push (ejen-github akan buat). Lokasi repo: `demo/todo-list`, live di https://rasis2.github.io/demo/todo-list/.
- **Cadangan seterusnya**: sahkan visual akhir pada peranti sebenar (emulator Pixel_8) jika perlu; elak ubah blok `@media (max-width:599px)` tanpa uji semula 375px & 768px.