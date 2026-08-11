# OpenCode Usage

Dashboard penggunaan OpenCode — model LLM, gunaan alat, dan kuota OpenCode Go. Data sebenar dari `opencode.log` + `opencode.db`.

## Kemas kini data

```bash
node parse-log.js
```

Menjana `data.json` (stream, alat, sesi, token & kos opencode-go).

## Cron / auto-update

`update.ps1` menjana semula `data.json`, kemudian auto-commit + push jika ada perubahan.

Daftar sebagai Task Scheduler (dijalankan setiap hari):

```powershell
schtasks /Create /TN "OpenCodeUsageUpdate" `
  /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"C:\Users\Rasis\Documents\GitHub\demo\opencode-usage\update.ps1`"" `
  /SC DAILY /ST 06:45 /F
```

> Task berjalan dalam mod "Interactive only" (hanya bila pengguna log masuk) supaya kredensial git boleh dipakai. Pastikan mesin hidup pada masa yang dijadualkan.

## Kuota OpenCode Go

Had bulanan **$60** (dari [opencode.ai/docs/go](https://opencode.ai/docs/go/)). Kos dikira dari token sebenar guna harga DeepSeek V4 Flash ($0.14 input / $0.28 output / $0.0028 cache read per 1M token). Meter: **Baik** (<50%), **Sederhana** (50–80%), **Bahaya** (>80%).
