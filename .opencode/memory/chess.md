# Memori Chess — Ejen Directory

## Tujuan
Webpage statik `demo/chess/` — direktori visual 17 ejen dalam sistem OpenCode. Snapshot automatik dari `.opencode/memory/*.md` melalui `update-ejen.ps1`.

## Last session
- 26/8/2026: Webpage Ejen Directory dicipta dari kosong — index.html, app.js, style.css, data.json, update-ejen.ps1, .gitignore, icon.svg, README.md.
- Status semasa: 17 ejen dikesan (1 Komunikasi + 5 Operasional + 8 Teknikal + 3 Gremlin). Status summary: 9 aktif, 6 ringan, 2 terbeban, 0 tak-aktif. (ejen-maestro SEKAT sampai SVM BIOS di-enable.)
- Update skrip silent-dedup tested — hash SHA256 file memory, skip jika sama, tulis data.json + hash + git commit/push bila berubah.
- Format data.json: meta + ringkasan + kategori (dict susun ikut kategori) + senarai ejen dengan status badge, workload bar, meta, indikator.
- Arahan cron JSON siap untuk diberikan kepada Ejen Cron (lihat README.md).

## Key decisions
- Style diwarisi dari `demo\opencode-usage` (dark theme, accent #38bdf8) tapi diubahsuai: ejen cards dengan border-kiri warna status, workload bar mini 0-8.
- i18n BM/EN dikekalkan dari opencode-usage untuk konsistensi.
- Silent-dedup lapisan dua: server-side (skrip SHA256 file) dan client-side (app.js FNV-1a content). Jika hash sama, tiada re-render.
- Skrip guna PowerShell 5.1 native (lebih stabil dari Python pada Windows + available everywhere).
- Hash file (`.last-hash`) dan log (`.update.log`) TIDAK di-track dalam git.

## Suggested next steps
- Daftarkan cron `ejen-chess-update` (every 15 min) melalui Ejen Cron — arahan JSON sudah sedia dalam README.md.
- Uji live webpage: open `index.html` dalam browser → periksa filter, sort, search berfungsi.
- (Opsyen) Visual polish: tambah ikon SVG lebih menarik per ejen, atau tambah trend mini per kategori.
