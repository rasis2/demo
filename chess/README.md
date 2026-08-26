# Ejen Directory

Direktori visual untuk 17 ejen dalam sistem OpenCode. Snapshot automatik dari `.opencode/memory/*.md`.

## Struktur

```
demo/chess/
  index.html          — Halaman utama (filters, summary, ejen grid)
  app.js              — Render logic + silent-dedup (FNV-1a hash)
  style.css           — Dark theme (selaras dengan demo\opencode-usage)
  data.json           — Snapshot data ejen (dijana oleh update-ejen.ps1)
  icon.svg            — Favicon
  update-ejen.ps1     — Skrip regenerasi data.json (cron-friendly)
  .gitignore          — Tak track .last-hash & .update.log
```

## Cara run

Sekali (manual regen):
```powershell
cd C:\Users\Rasis\Documents\GitHub\demo\chess
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\update-ejen.ps1
```

Kembangkan tempatan (tidak commit) — buka `index.html` dalam pelayar atau guna apa-apa static server.

## Cara kerja silent-dedup

1. Skrip gabung SEMUA `.md` dalam `.opencode\memory\` (kecuali `ejen-directory.md`).
2. Kira SHA256 gabungan content.
3. Banding dengan `.last-hash` — **jika sama: exit 0 (tiada apa-apa)**.
4. Jika beza → tulis `data.json` baru + `.last-hash` baru + git commit/push.
5. `app.js` clone logik: hash FNV-1a content → skip render jika sama.

## Cron

Daftarkan melalui Ejen Cron:

```json
{
  "name": "ejen-chess-update",
  "schedule": "*/15 * * * *",
  "command": "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\\Users\\Rasis\\Documents\\GitHub\\demo\\chess\\update-ejen.ps1\"",
  "type": "no_agent",
  "deliver": "local",
  "description": "Regenerate ejen directory data.json setiap 15 minit (silent dedup)"
}
```
