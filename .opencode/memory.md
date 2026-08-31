# Memori Repo demo (rasis2/demo)

## Last session
- 31/8/2026 (ejen-setup): ubah `demo\.github\workflows\heartbeat-monitor.yml` supaya run ALWAYS berakhir success (exit 0) selepas alert Telegram dihantar — elak email notifikasi kegagalan GitHub semasa gateway down. Commit `69b1ece` (main), push OK.
- Ujian: workflow_dispatch force_stale=true → alert Telegram `[UJIAN SETUP]` sampai + run success; workflow_dispatch fresh → senyap + success.
- Nota: run failed hanya berlaku jika curl Telegram gagal atau secret TELEGRAM_BOT_TOKEN tiada (email wajar dalam kes itu).