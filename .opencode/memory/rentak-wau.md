# Memori Projek — rentak-wau

## Last session (7/9/2026) — Pacing Step-by-Step (mesin langkah + animasi perlahan)

**Kerja:**
- `js/app.js` — aliran round direka semula kepada **mesin langkah turn-based**. Selepas pemilihan wau selesai & angin dibuka, permainan berhenti pada setiap fasa dan menunggu klik butang **"Next ▶"** (`#btn-next`) / **"⏩ Auto"** (`#btn-auto`). Langkah round: buang tak padan → sediakan dadu → (gulung dadu → tentukan pemenang | hasil auto/none) → tuntut kad angin → bersih & isi semula → endRound (pusingan seterusnya / lihat keputusan).
- Mesin: `runStepMachine(steps)` + `advanceStep()`; setiap langkah `{should(), run(done)}`; `should()` skip langkah tidak perlu (roll/winner hanya bila 'roll'). Butang Next muncul selepas animasi setiap langkah selesai. Butang Auto (`app.autoRun=true`) memajukan baki langkah & round seterusnya secara pantas.
- **Animasi baru (CSS)**: kad dibuang keluar padang (`#field{position:relative}` + `.discard-ghost` @keyframes `discard-out` 0.8s fade+slide); tuntut kad angin → panel pemain berkelip (`.player-panel.claim-glow`) + `.won-mini.claim-pop`; dadu roll via JS interval (~1s, `dur(1000)`) menggantikan `animateDie` lama. Semua animasi hormat `@media (prefers-reduced-motion: reduce)` (dinyahtaktifkan).
- **Log berjujukan**: setiap langkah `addLog()` entri berasingan dengan emoji penanda (❌/🎲/🏆/💨/🗑️/🔄) — log TIDAK diclear antara langkah.
- **Mod test**: `dur(ms)` pulangkan 20ms bila URL ada `uitest`/`audit` → animasi/delay pantas supaya `?uitest=1` (auto-klik butang setiap 150ms) selesai dalam had 45s. Butang `#btn-roll` lama dibuang (roll kini langkah via Next) — selftest masih klik (tiada kesan).
- Fungsi lama diganti: `runCompatibility`/`runDicePhase`/`animateDie`/`finishRound` → `runStepMachine`/`buildRoundSteps`/`do*` langkah/`endRound`. Enjin `js/engine.js` + `cards.js` + `ai.js` + `pixel.js` TIDAK disentuh.

**Pengujian (semua PASS):**
- Node `test/engine-test.js`: **221 lulus, 0 gagal** (enjin tak disentuh).
- `node --check` semua JS: OK.
- Headless Edge `--dump-dom --virtual-time-budget=90000 --allow-file-access-from-files`:
  - `test/harness.html` → HARNESS RESULT: PASS (0 error)
  - `index.html?uitest=1` → SELFTEST: PASS (3 AI, isGameOver benar, 6 kad angin, 0 error)
  - `index.html?audit=1` → AUDIT: PASS (1280 & 390 — tiada h-scroll, 0 error)
- Nota: `test/ui-human-test.html` & `test/ui-hotseat-test.html` ialah harness tanpa DOM index.html (`startWith()` lempar null #screen-game) — PRA-SEDIA ADA, bukan regresi; ujian berwibawa ialah harness/uitest/audit + engine-test.

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