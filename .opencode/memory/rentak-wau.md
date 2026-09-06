# Memori Projek — rentak-wau

## Last session (7/9/2026)

Projek baru: **Rentak Wau v2** — game kad & dadu layang-layang (rulebook v1.3.6), di `demo\rentak-wau\`. SELESAI & DIUJI.

**Fail dibuat:**
- `index.html`, `style.css`, `README.md`
- `js/cards.js` (12 wau, 6 angin, LEVEL meta, shuffle), `js/pixel.js` (seni pixel canvas — wau/wind/dadu), `js/engine.js` (enjin tulen, boleh Node), `js/ai.js` (AI kebarangkalian angin), `js/app.js` (UI + aliran fasa)
- `test/engine-test.js` (Node), `test/harness.html`, `test/ui-human-test.html`, `test/ui-hotseat-test.html`
- Portal `demo\index.html`: kad "Rentak Wau" di atas grid + butang "Cuba Rentak Wau" (keutamaan paling atas).

**Keputusan reka bentuk:**
- Zero dependency; seni pixel-art canvas (`image-rendering: pixelated`); UI Bahasa Melayu; responsif 390px–1280px.
- Mod: vs AI (1 manusia + 1–3 AI), hotseat (2–4 manusia, overlay "Serahkan Skrin"), campuran manusia+AI (2+ manusia → auto hotseat).
- Draft: auto-deal 1 setiap paras angin (ikuti cadangan rulebook); lebihan wau ke longgokan.
- isGameOver = `windDeck.length === 0` (6 kad angin digunakan) — BUKAN `round > 6` (bug round 7 ditemui & diperbaiki).
- Tiada pemenang round (tiada wau padan) → kad angin ke `windDiscard` ("Angin Terpakai"), tetap dikira satu pusingan.
- AI heuristik: kebarangkalian paras angin baki + gemar saiz kecil (tiebreak) + bonus simpan wau.
- Tiebreak: dadu sama → wau kecil menang; skor = kad + pasangan paras sama (+1); tie akhir → saiz wau terkecil dalam tangan.

**Pengujian (semua PASS):**
- Node `test/engine-test.js`: 221 lulus, 0 gagal (komponen, skor rulebook, aliran round, simulasi penuh 2–4 pemain ×30, tiebreak dadu, auto-menang, tie-break akhir).
- Headless Edge (file:// & http://localhost): harness PASS, ui-human PASS, ui-hotseat PASS, `index.html?uitest=1` → SELFTEST PASS (0 runtime error), `?audit=1` → PASS (tiada h-scroll 390px & 1280px).
- `node --check` semua JS OK.

**Nota:** ujian headless guna `--dump-dom --virtual-time-budget`; untuk error tulen guna HTTP server (file:// sembunyikan detail error sebagai "Script error."). Skrin tamat tidak boleh capai `?uitest=1` jika masa virtual terlalu pendek (90s selamat).