# Memori Subprojek — todo-list

## Last session (5/9/2026)

**HIAS SEMULA dengan Tailwind Play CDN — SELESAI, zero regresi.**

- Arah pemilik (Rasis): guna `https://cdn.tailwindcss.com` (static GitHub Pages, tiada build step), design dark theme moden mobile-first, SEMUA 16/16 ciri kekal.
- **Diubah**: `index.html` (ditulis semula penuh — Tailwind utilities + `tailwind.config` yang petakan palet ke CSS variables `--c-*` RGB-triplet dengan `<alpha-value>`; responsive `sm:`/`md:`/`lg:`), `style.css` (disusutkan ~473→~380 baris — hanya custom untuk kelas dinamik yang dikawal js/app.js: task-item/`.prio.prio-*`/checkbox/drag placeholder/toast/imp-result/modal/`.tabs`/`.active`/chips/`.btn.danger.solid` untuk `#btnConfirmYes`), `test/test-browser.js` (SATU ubahan: tapis console.warning notis Play CDN `cdn.tailwindcss.com should not be used in production` — bukan ralat app), `README.md` (nota CDN + kiraan test).
- **TIDAK diubah**: `js/core.js`, `js/app.js` (766+569 baris kekal sama), `test/test-core.js`, `test/test-harness.html`.
- **Pembaikan penting**: `.select-row` flex-col + `flex-1` → select runtuh 25px @375px; fix `flex-1`→`grow` → h-11/44px kekal.
- **Ujian LULUS**: Node **36/36**; Browser penuh **21/21** (harness 9/9); audit 375px & 768px — 0 horizontal scroll, 0 elemen terpotong, kawasan sentuh ≥44px @375 (btnAdd 48, search/import/export/theme/catFilter/tab 44), font input 16px, modal muat, tabs 0 overflow.
- **Keadaan semasa**: siap, belum di-push ke GitHub (push oleh ejen lain selepas ini). Jika sesi baru perlu bekerja semula pada folder ini, run: `node test/test-core.js` dulu, kemudian `node test/test-browser.js` (perlu internet untuk Play CDN).
- **Cadangan seterusnya**: push & semak GitHub Pages; pertimbangkan dompurify/tambahan ciri bila diminta pemilik sahaja.