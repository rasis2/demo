# Memori Subprojek — todo-list

## Last session (5 Sep 2026)

**Dibina**: Webapp "Todo List" lengkap di `demo/todo-list/` (statik murni, zero-dependency, Bahasa Melayu, dark theme default + toggle terang/gelap).

**Fail**:
- `index.html`, `style.css` — UI mobile-first (modal tambah/edit, confirm padam, modal import, toast)
- `js/core.js` — teras logik UMD (CRUD, filter, carian, import parse `[x] [Tinggi] Tajuk #kat @date | nota`, eksport TXT/JSON, localStorage, overdue, statistik). Boleh diuji Node & browser.
- `js/app.js` — UI: render, pointer-event drag & drop (manual/prioriti), import tambah/ganti, eksport, tema, API `window.TodoApp` untuk ujian.
- `test/test-core.js` (Node 36/36 lulus), `test/test-browser.js` (headless Edge via CDP, 20/20 lulus), `test/test-harness.html` (9/9).

**Ujian terakhir**: Node 36 ✅, Browser CDP 20 ✅ (smoke boot, CRUD via UI, filter/carian, import tambah+ganti, eksport, persist reload, drag&drop, responsif 375px, tiada error console), dump-dom smoke `{"ok":true}` ✅.

**Keputusan**: data tersimpan `todoListData:v1` di localStorage; kategori dikekalkan walau task dipadam (nilai pilihan pengguna); deadline tarikh sahaja sah sehingga hujung hari; susunan priority = tinggi→sederhana→rendah, terlewat dahulu, deadline terdekat dahulu.

**Kemas kini portal**: `demo/index.html` — kad "Todo List" (✅, Terbaru, pautan `todo-list/`) ditambah selepas merge-to-pdf + butang "Cuba Todo List" di bahagian hubungi.

**Belum siap / cadangan seterusnya**:
- Belum di-commit/push (akan dikendalikan ejen-github).
- Idea lanjut: subtask, recurring tasks, pemberitahuan deadline, tema light refinement, PWA.