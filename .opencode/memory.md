# Memori Repo demo (rasis2/demo)

## Last session
- 31/8/2026 (ejen-setup): ubah `demo\.github\workflows\heartbeat-monitor.yml` supaya run ALWAYS berakhir success (exit 0) selepas alert Telegram dihantar — elak email notifikasi kegagalan GitHub semasa gateway down. Commit `69b1ece` (main), push OK.
- Ujian: workflow_dispatch force_stale=true → alert Telegram `[UJIAN SETUP]` sampai + run success; workflow_dispatch fresh → senyap + success.
- Nota: run failed hanya berlaku jika curl Telegram gagal atau secret TELEGRAM_BOT_TOKEN tiada (email wajar dalam kes itu).
- 31/8/2026 (audit-performance): Siasatan struktur SEMUA 16 sub-folder demo (chess, chess-kaplay, gmi-slides, halau, internet, kesuma-jmb, mobile-device-eduscan, opencode-usage, parameswara, parameswara-phaser, resume, signature-stamp-app, software-eng-slides, utube, video-editor, zoo-radio). Penemuan utama:
  - `utube/` : 488 video ID dibakar dalam app.js (102KB), 17 saluran + custom. Semua img guna `loading=lazy`, tapi img src `i.ytimg.com/vi/{id}/hqdefault.jpg` di-render SEMUA SEKALIGUS bila filterVideo() loop — tiada pagination.
  - `video-editor/` : 0 aset tempatan; FFmpeg.wasm (~30MB) dimuat dari unpkg CDN (`@ffmpeg/core@0.12.10`). Wrapper telah di-vendor dalam `vendor/ffmpeg/` (tapi vendor kosong dalam repo).
  - `gmi-slides/` : 14 fail HTML modul (~9-15KB setiap satu) + index.html. ZERO image/video/audio — semua emoji CSS. Risiko rendah dari segi media.
  - `halau/` : 1 HTML monolith 422KB (CSS 19KB, JS 45KB, markup 337KB — i18n inline BM/EN/ZH/TA + banyak teks). NO image/video.
  - `parameswara/` : Twine HTML 506KB inline JS + `jong.jpg` 274KB + 5 mp3 kecil + 1 mp3 4.3MB.
  - `parameswara-phaser/` : phaser game.js 29KB, jong.jpg 274KB, 6 mp3 (1 besar 4.3MB).
  - `zoo-radio/` : 24 stesen radio distrim (mp3/aac luar), canvas game — tiada image file tempatan.
  - `internet/` : 58 plan ISP + logo dari Google Favicon API (`/s2/favicons?domain=...`). Logo menggunakan `loading=lazy`. NO caching.
  - `kesuma-jmb/` : 211KB supabase.min.js di-vendor. Parcel/Announcement list — `.select('*')` TIDAK ada limit, semua di-render sekaligus dengan img biasa (tiada `loading=lazy`).
  - `chess/` : 17 ejen directory, data-driven dari data.json (12KB). NO image.
  - `chess-kaplay/` : chess.js + kaplay.js di-vendor, sprite dibina runtime dari data-URI.
  - `mobile-device-eduscan/` : Web Bluetooth — tiada media.
  - `signature-stamp-app/` : pdf.js + pdf-lib client-side preview.
  - `resume/` : React build dengan 100+ node_modules. qr.jpg 125KB, tiada image lain.
  - `opencode-usage/` : data-driven UI (log parse). NO image.
  - `software-eng-slides/` : 1 HTML 25KB sahaja.
- Cadangan umum: (a) utube → perlu pagination/filter; (b) kesuma-jmb → tambah `.limit()` di supabase query + `loading=lazy`; (c) zoom-internet → cache favicon ke localStorage.
- Sesi READ-ONLY (tidak edit apa-apa selain memory).