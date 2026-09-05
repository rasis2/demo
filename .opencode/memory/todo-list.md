# Memori Subprojek — todo-list

## Last session (5/9/2026)

**REKA SEMULA TEMA HIJAU NATURE — SELESAI, zero regresi.**

- Arah pemilik (Rasis): reka semula layout "List Anje" dengan tema HIJAU NATURE. Fail dibenarkan diubah: `index.html` + `style.css` sahaja. `js/core.js` & `js/app.js` TIDAK disentuh (45 ID HTML disahkan semua wujud).
- **Tema**: DARK = hutan malam `#0a1f17`→`#1a4034`, aksen emerald `#34d399`; LIGHT = krim sage `#f0faf4`, aksen `#059669`. Kontras teks AA. Merah dikekalkan untuk "Terlewat"/delete (lembut `#f87171` dark / `#dc2626` light). CSS vars `--c-*` remapped → semua kelas Tailwind sedia ada (`text-amber`, `bg-amber`, `border-amber`, dll) auto-jadi hijau.
- **Sentuhan nature**: corak daun SVG subtle (body background-image data-URI opacity 0.03); ikon brand SVН = daun + tanda semak emerald; emoji 🌿 dalam h1 & footer; rounded organik (task-item 16px, modal 20px, tabs 14px); progress bar gradient emerald 3-warna; tab active emerald.
- **BUG lama dijumpai & diperbaiki**: warna Tailwind custom `base` berlanggar dengan utility paparan `text-base` → sebarang elemen `text-base` tanpa `text-ink` dapat `color:--c-bg` (butang "Tambah Task" terjejas). Fix: rename warna `base`→`deep` dalam tailwind.config + `bg-base/85`→`bg-deep/85` (topbar). Selepas fix,`#btnAdd` text = `#022c22` betul.
- **Diubah (4 fail)**: `todo-list/index.html` (palet, ikon, pattern daun, bentuk organik, fix kolisi warna); `todo-list/style.css` (palet nama sama, radius organik, shadow hijau, hover states hijau); `demo/index.html` (ikon kad portal ✅→🌿); `todo-list/README.md` (tajuk "✅ Todo List"→"🌿 List Anje").
- **Ujian LULUS**: Node **36/36**; Browser penuh **21/21** (harness 9/9); 0 error console. Audit 375px & 768px: 0 hscroll, 0 terpotong, sentuh ≥44px, input 16px, modal muat. 16/16 ciri berfungsi (disahkan test browser).
- **Keadaan semasa**: siap, BELUM di-push — push = ejen-github. Jika sesi baru: `node test/test-core.js` dulu, kemudian `node test/test-browser.js` (perlu internet untuk Play CDN).