# Memory: gmi-slides

Subprojek dalam repo `demo`. Slide interaktif untuk **Cisco IT Essentials 8.0** (14 module).

## Struktur fail
- `index.html` — hub pemilih module (14 kad, English)
- `css/theme.css` — theme dikongsi "Cyber/Circuit" (navy + cyan + green, gaya terminal/teknikal)
- `js/deck.js` — navigasi dikongsi (← → Space, swipe, progress bar)
- `module-01.html` … `module-14.html` — deck berasingan setiap module

## Pautan
- Hub: `https://rasis2.github.io/demo/gmi-slides/index.html`
- Setiap module: `https://rasis2.github.io/demo/gmi-slides/module-0X.html`
- Portal demo root (`demo/index.html`) ada kad "GMI Slides — IT Essentials 8" merujuk ke hub.

## Modul (tajuk)
01 Intro to PC Hardware · 02 PC Assembly · 03 Advanced Computer Hardware · 04 Preventive Maintenance & Troubleshooting · 05 Networking Concepts · 06 Applied Networking · 07 Laptops & Mobile Devices · 08 Printers · 09 Virtualization & Cloud · 10 Windows Installation · 11 Windows Configuration · 12 Mobile/Linux/macOS · 13 Security · 14 The IT Professional

## Kiraan slaid sebenar (penting — counter mesti sepadan)
- M01: 11 · M02: 11 · M03: 10 · M04: 15 · M05: 10 · M06: 10 · M07: 11 · M08: 10 · M09: 10 · M10: 10 · M11: 9 · M12: 11 · M13: 10 · M14: 9

## Nota
- Kandungan kini **100% Bahasa Inggeris** (sejak 27/8/2026). Semua deck guna theme.css + deck.js dikongsi — nak tukar theme, edit css/theme.css sahaja (kesan ke semua deck).
- Module 04 dahulu single-file (`gmi-slides/index.html`) — kini hub; deck module 04 ialah `module-04.html`.
- Semua perubahan besar mesti dipush ke `rasis2/demo` dan pengesahan GitHub Pages selepas push (delay ~30 saat).

## Last session
- (27/8/2026) **Semua 14 deck + hub diterjemah kepada Bahasa Inggeris penuh** (dulu dwibahasa). 5 ejen web selari mengendalikan translate; struktur HTML, class, emoji, theme.css & deck.js dipelihara. Counter dibetulkan: M04 1/15, M07 1/11, M12 1/11.
- Status: SELESAI. Cadangan seterusnya: (a) butang "next/prev module" merentas deck, (b) versi dwibahasa pilihan pengguna.