/**
 * test-merge.js — ujian Node untuk logik gabungan fail → PDF.
 * Guna modul SEBENAR `js/merge-core.js` + library SEBENAR `vendor/pdf-lib.min.js`
 * (umumnya kod yang sama dengan yang berjalan dalam browser).
 *
 * Liputan ujian (dalam Node, tanpa canvas):
 *  - JPEG (embed terus)
 *  - PNG (embed terus)
 *  - PDF sedia ada (merge copyPages, 2 halaman)
 *  - Fail tidak disokong (format .txt) → dilapor dalam errors tanpa menggagalkan merge
 *  - Susunan halaman output ikut urutan input
 *  - Saiz halaman imej = A4 (595.28 x 841.89)
 *  - Gabungan keseluruhan boleh dimuat semula sebagai PDF sah (pageCount betul)
 */
const path = require('path');
const fs = require('fs');

const mergeCore = require('../js/merge-core.js');
const { PDFDocument } = require('../vendor/pdf-lib.min.js');

const ASSETS = path.join(__dirname, 'assets');

function mockFile(name, type, bytes) {
  return {
    name,
    type,
    size: bytes.length,
    async arrayBuffer() { return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength); }
  };
}

function read(name) {
  return new Uint8Array(fs.readFileSync(path.join(ASSETS, name)));
}

function fmt(n) { return n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB'; }

(async function () {
  let pass = 0, fail = 0;
  function check(cond, label) {
    if (cond) { pass++; console.log('  \u2713 ' + label); }
    else { fail++; console.log('  \u2717 ' + label); }
  }

  console.log('=== Ujian 1: gabung 4 fail (PNG + JPEG + PDF 2 halaman + fail invalid) ===');
  const files = [
    mockFile('merah.png', 'image/png', read('merah.png')),
    mockFile('biru.jpg', 'image/jpeg', read('biru.jpg')),
    mockFile('bingkai.pdf', 'application/pdf', read('bingkai.pdf')),
    mockFile('nota.txt', 'text/plain', new TextEncoder().encode('bukan imej/pdf'))
  ];

  const progress = [];
  const res = await mergeCore.mergeFiles(files, {
    onProgress: (d, t, n) => progress.push(`${d}/${t} ${n}`)
  });

  console.log('  Output: ' + fmt(res.size) + ', halaman=' + res.pageCount + ', errors=' + res.errors.length);
  check(res.bytes instanceof Uint8Array && res.bytes.length > 0, 'bytes output dihasilkan');
  check(res.pageCount === 4, 'pageCount = 4 (3 imej + 1 halaman PDF = 4, PDF 2 halaman semestinya 2)');
  check(res.errors.length === 1 && res.errors[0].file === 'nota.txt', 'fail .txt dilaporkan sebagai error');
  check(progress.length === 4, 'onProgress dipanggil untuk setiap fail');
  check(progress[3] === '4/4 nota.txt', 'urutan progress ikut susunan fail');

  console.log('=== Ujian 2: output sah & boleh dimuat semula ===');
  const outDoc = await PDFDocument.load(res.bytes);
  const pageCount2 = outDoc.getPageCount();
  check(pageCount2 === 4, 'output dimuat semula = ' + pageCount2 + ' halaman');
  const sizes = outDoc.getPages().map(p => [p.getWidth().toFixed(2), p.getHeight().toFixed(2)]);
  check(sizes.every(([w, h]) => w === '595.28' && h === '841.89'), 'semua halaman bersaiz A4 (595.28 x 841.89)');
  console.log('  Dimensi halaman: ' + JSON.stringify(sizes));

  console.log('=== Ujian 3: gabung hanya 2 imej, susunan betul ===');
  const res2 = await mergeCore.mergeFiles([
    mockFile('biru.jpg', 'image/jpeg', read('biru.jpg')),
    mockFile('merah.png', 'image/png', read('merah.png'))
  ]);
  check(res2.pageCount === 2 && res2.errors.length === 0, '2 imej -> 2 halaman, tanpa error');
  const outDoc2 = await PDFDocument.load(res2.bytes);
  check(outDoc2.getPageCount() === 2, 'output 2 halaman sah');

  console.log('=== Ujian 4: fail kosong / senarai kosong ===');
  const res3 = await mergeCore.mergeFiles([]);
  check(res3.pageCount === 0 && res3.size > 0, 'senarai kosong -> PDF kosong sah (0 halaman)');

  // Tulis output ujian untuk pemeriksaan visual
  const outPath = path.join(__dirname, 'output-ujian.pdf');
  fs.writeFileSync(outPath, Buffer.from(res.bytes));
  console.log('\nOutput ujian disimpan: ' + outPath + ' (' + fmt(res.size) + ')');

  console.log('\n=== KEPUTUSAN: ' + pass + ' lulus, ' + fail + ' gagal ===');
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => {
  console.error('Ralat semasa ujian:', e);
  process.exit(1);
});