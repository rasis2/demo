# Catur Kaplay

Permainan catur web pemain-lawan-komputer dibina dengan **Kaplay** (render dan
input) serta **chess.js** (semua peraturan catur). Antara muka dalam Bahasa
Melayu. Berfungsi sepenuhnya luar talian.

## Cara Main

1. Buka `index.html` terus dalam pelayar, ATAU jalankan pelayan lokal:

   ```
   python -m http.server 8000
   ```

   kemudian layari `http://localhost:8000`.

2. Anda memegang bidak **putih** (bawah); komputer memegang bidak hitam
   (atas). Untuk menukar sisi, tekan butang **Main sebagai Hitam**.
3. Klik bidak sendiri untuk melihat langkah sah:
   - bulatan hijau = langkah biasa,
   - halo merah = tangkapan (termasuk en passant).
4. Klik petak sasaran untuk bergerak. Promosi bidak membuka dialog pilihan
   (Menteri / Benteng / Gajah / Kuda).
5. Status permainan dipaparkan pada panel: giliran, skak, skakmat, pat, dan
   pelbagai keadaan seri.

## Kesukaran

Tekan butang kesukaran pada panel bila-bila masa; ia berkuat kuasa pada
langkah komputer seterusnya:

| Tahap     | Tingkah laku |
|-----------|--------------|
| Mudah     | Kedalaman carian 1, kadangkala memilih antara beberapa langkah teratas secara rawak - boleh dikalahkan. |
| Sederhana | Kedalaman 2 (naik ke 3 pada posisi jarang). |
| Sukar     | Kedalaman 3 (naik ke 4 pada posisi jarang) dengan move ordering MVV-LVA. |

Butang lain:

- **Permainan Baru** - reset papan.
- **Undur** - undur sepasang langkah (langkah anda + balasan komputer).

Panel juga memaparkan senarai langkah dalam notasi algebra (SAN) dan bidak
yang telah ditangkap oleh setiap pihak.

## Struktur Fail

```
chess-kaplay/
  index.html        halaman utama
  css/style.css     tema gelap moden, susun atur responsif
  js/game.js        render Kaplay, interaksi klik, UI panel
  js/ai.js          enjin minimax + alpha-beta pruning (tiada pergantungan Kaplay)
  libs/kaplay.js    Kaplay v3001.0.19 (vendor lokal)
  libs/chess.min.js chess.js v0.10.3 (vendor lokal)
  test/ai_test.js   ujian logik AI tanpa pelayar
```

Semua library di-vendor secara lokal, jadi permainan tidak perlukan internet.
Jika fail dalam `libs/` tiada atau rosak, muat turun semula:

- `https://cdn.jsdelivr.net/npm/kaplay@3001.0.19/dist/kaplay.js`
- `https://cdn.jsdelivr.net/npm/chess.js@0.10.3/chess.min.js`

Nota: versi chess.js sengaja kekal 0.10.2-era build global (0.10.3) kerana
versi baharu (0.13.4 dan 1.x) adalah ES module sahaja dan tidak boleh dimuat
melalui script tag biasa tanpa bundler.

## Ujian Enjin AI

Ujian aras kod tanpa pelayar (Node diperlukan):

```
node test\ai_test.js
```

Ujian meliputi: pengesanan skakmat satu langkah, langkah en passant,
promosi queen, dan simulasi 20 setengah-langkah bagi setiap tahap kesukaran
dengan semakan masa maksimum di bawah 2 saat.

## Teknologi dan Kredit

- [Kaplay](https://kaplayjs.com/) - pustaka permainan 2D (lesen MIT).
  Hak cipta penyumbang Kaplay.
- [chess.js](https://github.com/jhlywa/chess.js) v0.10.3 - logik peraturan
  catur (lesen BSD-2-Clause). Hak cipta Jeff Hlywa dan penyumbang.

Kedua-dua library disertakan dalam folder `libs/` mengikut lesen asal
masing-masing.

## Batasan Diketahui

- Glif bidak dirender daripada fon sistem (contoh: Segoe UI Symbol di
  Windows, Noto Sans Symbols 2 di Linux). Pada sistem yang sangat minimum
  tanpa fon simbol catur, bentuk bidak mungkin tidak terpapar betul.
- Enjin AI adalah minimax ringkas tanpa jadual transposisi atau quiescence
  search - cukup untuk permainan santai, bukan aras pertandingan.
- Susun atur dioptimumkan untuk pelayar desktop; sokongan mudah alih adalah
  sekunder (papan mengecil mengikut lebar skrin).
