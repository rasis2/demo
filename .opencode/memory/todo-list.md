# Memori Subprojek — todo-list

## Last session (5/9/2026)

**TUKAR NAMA APP → "List Anje" (teks paparan sahaja) — SELESAI, zero regresi.**

- Arah pemilik (Rasis): tukar nama app todo-list kepada "List Anje". Hanya teks paparan — TIADA ubah JS/structure/href.
- **Diubah**: `todo-list/index.html` (baris 6 `<title>`, baris 7 meta description, baris 103 `<h1>`, baris 104 tagline → "Urus tugas harian Anje — disimpan terus dalam pelayar.", baris 175 footer — semua "Todo List"→"List Anje"); `demo/index.html` (baris 356 `<h3>List Anje</h3>`, baris 572 butang "Cuba List Anje"). Deskripsi kad kekal. JANGAN ubah href/fail/folder.
- Rujukan lama "Todo List" yang kekal hanyalah dalam fail bukan paparan (js/core.js, js/app.js, style.css, README.md, test/* — komentar & tajuk ujian) — sengaja dikekalkan, bukan teks UI.
- **Ujian LULUS selepas tukar nama**: Node **36/36**; Browser penuh **21/21** (harness 9/9); 0 error console. HTML pengesanan via grep — tiada "Todo List" tinggal dalam kedua-dua index.html.
- **Keadaan semasa**: siap, belum di-push ke GitHub (push = ejen-github). Jika sesi baru perlu kerja folder ini: `node test/test-core.js` dulu, kemudian `node test/test-browser.js` (perlu internet untuk Play CDN).
- **Cadangan seterusnya**: push & semak GitHub Pages; pertimbangkan dompurify/tambahan ciri bila diminta pemilik sahaja.