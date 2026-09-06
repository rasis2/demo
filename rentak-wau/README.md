# Rentak Wau v2 — The Wau Flying Card Game

Permainan kad & dadu untuk **2–4 pemain** (15–30 minit, umur 8+).
Terbangkan wau mengikut rentak angin, tuntut kad angin, dan kumpul mata tertinggi!

## Cara Bermain

1. **Setup** — Setiap pemain mendapat 3 wau (1 paras tinggi, 1 sederhana, 1 rendah).
   Kad angin dikocok sebagai dek.
2. **Setiap pusingan** (10 langkah):
   - Pilih 2 wau secara rahsia.
   - Buka kad angin → wau yang parasnya tidak padan **dibuang**.
   - Jika lebih 1 pemain ada wau padan → setiap wau hidup dapat **1 dadu**.
     Jika hanya 1 pemain yang padan → dia menang automatik.
   - Gulung dadu (wau terbesar gulung dulu). Dadu tertinggi menang;
     **seri → wau lebih kecil menang**.
   - Pemenang tuntut kad angin; wau kalah dibuang; tangan diisi semula ke 2.
3. **Tamad** selepas semua **6 kad angin** digunakan.
4. **Skor** — setiap kad angin = 1 mata, setiap pasangan paras sama = +1 bonus
   (cth: 2 Tinggi = 3 mata). Pemain skor tertinggi menang;
   seri → pemain dengan saiz wau terkecil dalam tangan menang.

## Mod

- **Vs AI** — 1 manusia + 1–3 AI (AI mengira kebarangkalian angin seterusnya
  berdasarkan kad yang telah muncul).
- **Hotseat** — 2–4 manusia berkongsi satu peranti; pemilihan rahsia dilindungi
  dengan skrin "Serahkan Skrin".
- Campuran manusia & AI juga disokong (cth: 2 manusia + 1 AI).

## Teknologi

Zero dependency — HTML/CSS/JS tulen, seni **pixel-art** (canvas), tiada CDN.
Buka terus `index.html` dalam pelayar. Responsif 375px ke atas.

## Lokasi Fail

- `index.html` — halaman utama
- `style.css` — tema pixel-art
- `js/cards.js` — data kad (12 wau, 6 angin)
- `js/pixel.js` — pelukis seni pixel (canvas)
- `js/engine.js` — enjin permainan (logik penuh rulebook, boleh diuji Node)
- `js/ai.js` — strategi AI
- `js/app.js` — UI & aliran permainan
- `test/engine-test.js` — ujian Node (Node.js ≥ 12)
- `test/harness.html`, `test/ui-human-test.html`, `test/ui-hotseat-test.html` — ujian pelayar
- Mod ujian automatik: buka `index.html?uitest=1` untuk simulasi penuh 3 AI

## Ujian

```
node test/engine-test.js
```

- 224 semakan lulus (komponen, setup, skor rulebook, aliran round,
  simulasi penuh 2–4 pemain, tiebreak dadu, auto-menang, tie-break akhir).
- Headless Edge: harness + ui-human + ui-hotseat + `?uitest=1` — semua PASS, 0 error.

## Reka Bentuk

- Setiap wau ada **saiz berbeza** (1–12) — saiz menentukan urutan gulung dan
  memenangi tie-break.
- AI memilih 2 wau dengan mengira kebarangkalian paras angin tinggal
  (membaca wind yang telah muncul), gemar saiz kecil untuk tie-break.
- Kad angin tidak padan yang tidak dituntut (tiada pemenang) disimpan dalam
  longgokan "Angin Terpakai" — tetap dikira sebagai satu daripada 6 pusingan.