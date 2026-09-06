# Memori Projek — rentak-wau

## Last session (7/9/2026) — Beautify Tailwind + fit-to-screen

**Kerja:**
- `index.html` ditulis semula penuh guna **Tailwind Play CDN** (cdn.tailwindcss.com + `tailwind.config` tema langit senja: sky1-4/land/panel/line/ink/gold/btn dll, font pixel, box-shadow chunky). Layout fit-to-screen: `body h-dvh overflow-hidden`, `.screen.active { display:flex; height:100% }`; desktop 3 kolum (wind 200px / field flex-1 / log 260px) via `lg:flex-row`, mobile stack; log & kawasan main scroll dalaman sahaja — TIADA scroll halaman. Butang ≥44px (min-h-11), font ≥16px.
- `style.css` dikurangkan 639 → ~230 baris: hanya kelas komponen yang `js/app.js` jana/toggle (setup-player/sp-*, pile-*, wind-card/wau-card/die, player-panel/pp-*, log-line, final-row/fr-*, ov-hand, animations, media padat). Gaya visual utama = Tailwind.
- `js/app.js` diubah MINIMAL: hanya template string `class="btn"` (7 butang) + `.ctrl-hint` (2) + `.ov-box/.ov-title/.ov-sub/.rules-scroll` (3 overlay) → Tailwind. Logik enjin/UI tidak disentuh. SEMUA ID & kelas toggle kekal.
- `README.md`: seksyen Teknologi dikemas kini (Tailwind CDN + CSS komponen minimal + fit-to-screen).

**Pengujian (semua PASS):**
- Node `test/engine-test.js`: 221 lulus, 0 gagal.
- Headless Edge `--dump-dom --virtual-time-budget=90000`: harness PASS, `?uitest=1` → SELFTEST PASS (1280 & 390), `?audit=1` → AUDIT PASS (1280 & 390, tiada h-scroll, 0 runtime error).
- CDP emulasi viewport SEBENAR: audit PASS di 390×844 & 1280×800 (scrollW = vw, 0 error); selftest PASS masa-nyata di 1280×800 & 390×844 (mobile:false) — game main penuh 6 pusingan.
- Pengukuran kedudukan: setup noScroll, game body scrollY=0, players+controls nampak penuh dalam viewport di kedua-dua saiz.
- Nota: emulasi CDP `mobile:true` di headless sangat perlahan → `?uitest=1` masa-nyata tak sempat (45s); gunakan virtual-time atau `mobile:false` untuk ujian penuh.

**Nota ujian:** `test/ui-human-test.html` & `test/ui-hotseat-test.html` ialah harness JS berdiri sendiri TANPA DOM index.html → `startWith()` lempar (null #screen-game) — PRA-SEDIA ADA, bukan regresi; ujian berwibawa ialah harness/uitest/audit + engine-test.