# Memory: gmi-slides

Subprojek dalam repo `demo`. Slide interaktif untuk **Cisco IT Essentials 8.0** (14 module).

## Struktur fail
- `index.html` — hub pemilih module (14 kad)
- `css/theme.css` — theme dikongsi "Cyber/Circuit" (navy + cyan + green, gaya terminal/teknikal)
- `js/deck.js` — navigasi dikongsi (← → Space, swipe, progress bar)
- `module-01.html` … `module-14.html` — deck berasingan setiap module

## Pautan
- Hub: `https://rasis2.github.io/demo/gmi-slides/index.html`
- Setiap module: `https://rasis2.github.io/demo/gmi-slides/module-0X.html`
- Portal demo root (`demo/index.html`) ada kad "GMI Slides — IT Essentials 8" merujuk ke hub.

## Modul (tajuk)
01 Intro to PC Hardware · 02 PC Assembly · 03 Advanced Computer Hardware · 04 Preventive Maintenance & Troubleshooting · 05 Networking Concepts · 06 Applied Networking · 07 Laptops & Mobile Devices · 08 Printers · 09 Virtualization & Cloud · 10 Windows Installation · 11 Windows Configuration · 12 Mobile/Linux/macOS · 13 Security · 14 The IT Professional

## Nota
- Kandungan disusun dalam dwibahasa (tajuk English, isi ringkas Bahasa Melayu) berdasarkan kurikulum ITE v8.0.
- Semua deck guna theme.css + deck.js dikongsi — jika nak tukar theme, edit css/theme.css sahaja (kesan ke semua 14 deck).
- Module 04 dahulu single-file (`gmi-slides/index.html`) — kini hub; deck module 04 ialah `module-04.html`.

## Last session
- (27/8/2026) Bina penuh 14 deck module + hub + theme "Cyber/Circuit" baharu, push ke `rasis2/demo` (commit `bba5b0e`; fail awal di-sweep cron auto-update `248b7e4`).
- Kad GMI Slides ditambah ke portal `demo/index.html`.
- Semua pautan GitHub Pages disahkan live (hub, module-13, module-14, portal).
- Status: SELESAI. Cadangan seterusnya: (a) tambah butang "next/prev module" merentas deck, (b) versi Bahasa Inggeris penuh jika perlu.