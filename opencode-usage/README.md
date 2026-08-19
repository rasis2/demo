# OpenCode Usage

Dashboard penggunaan OpenCode — kuota (mingguan/bulanan), ranking kos mengikut ejen, model LLM, dan gunaan alat. Data sebenar dari `opencode.log` + `opencode.db` + `hermes state.db`.

## Format data.json (BARU)

```
quota.monthly → $60/bln (OpenCode Go monthly limit)
quota.weekly  → $30/minggu (per-user weekly limit)
consumers[]   → ranking kos ikut sumber (Hermes gateway, CLI/build, subagents, cron)
stats/models/tools → dari opencode.log
```

> ⚠️ Data lama guna format `go` (satu meter sahaja). Format baru guna `quota.monthly` + `quota.weekly` + `consumers`. Jangan downgrade balik.

## Kemas kini data (manual)

```bash
node parse-log.js
```

Menjana `data.json` (stream, alat, sesi, token, kos & kuota).

## Auto-update — Cron (Hermes)

Cron job `opencode-usage-hourly` (job ID `a5bf056d081c`) lari **setiap jam**:

| Item | Nilai |
|------|-------|
| Schedule | `0 * * * *` (setiap jam) |
| Script | `opencode-usage-daily.py` |
| Mode | `no_agent` (0 token, tanpa AI) |
| Deliver | Telegram (origin) |

**Kelakuan:**
- Data berubah → commit + push + notif Telegram ringkasan kuota
- Tiada perubahan → silent (tiada mesej, 0 token)

**Script:** `C:\Users\Rasis\AppData\Local\hermes\scripts\opencode-usage-daily.py`
- Panggil `update.ps1` (parse-log → data.json → git commit+push)
- ⚠️ **JANGAN guna versi `.sh`** — MSYS/bash pada Windows makan backslash path (`C:\Users\...` → `C:Users...`, exit 127). Python handle path dengan betul.

## Auto-update — Windows Task Scheduler (alternatif)

Kalau Hermes cron tak jalan (contoh: mesin off):

```powershell
schtasks /Create /TN "OpenCodeUsageUpdate" `
  /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"C:\Users\Rasis\Documents\GitHub\demo\opencode-usage\update.ps1`"" `
  /SC HOURLY /F
```

> Task berjalan "Interactive only" (hanya bila pengguna log masuk) supaya kredensial git boleh dipakai.

## Fail-fail

```
opencode-usage/
├── index.html    # Layout dashboard (stats → kuota → ranking → model/tools)
├── style.css     # Tema gelap, quota grid, consumer rows
├── app.js        # Render data.json (BM/EN), 2 meter, ranking kos
├── data.json     # Data format baru (auto- regenerate)
├── parse-log.js  # Penjana data.json (format baru)
├── update.ps1    # parse + commit + push
└── icon.svg
```

## Kuota

- **Mingguan:** $30/7 hari (reset setiap Isnin 08:00)
- **Bulanan:** $60/bln
- **Pricing** (DeepSeek V4 Flash, off-peak): $0.14 input / $0.28 output / $0.0028 cache-read per 1M token
- Meter: **Baik** (<50%), **Sederhana** (50–80%), **Bahaya** (>80%), **HABIS** (100%)
- Sumber authoritative: [dashboard opencode.ai](https://opencode.ai)