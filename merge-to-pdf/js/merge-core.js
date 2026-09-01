/**
 * merge-core.js — teras logik gabungan fail → PDF (UMD: berfungsi dalam browser & Node).
 *
 * Guna PDFLib (pdf-lib). Setiap imej diletak pada satu halaman A4 (595.28 x 841.89 pt)
 * dengan skala "fit halaman" (tiada bahagian terpotong, imej di-tengah halaman).
 * Fail PDF sedia ada digabung halaman demi halaman melalui copyPages().
 *
 * Fungsi `rasterize(pdfDoc, file)` mesti dihantar dari persekitaran browser untuk
 * format yang tidak boleh di-embed terus oleh pdf-lib (gif/webp/bmp/svg) atau apabila
 * embed langsung JPEG/PNG gagal (cth: JPEG CMYK/progresif). Dalam Node, rasterize = null
 * dan format tersebut akan dibuang dengan mesej error.
 */
(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node / CommonJS
    module.exports = factory(require('./../vendor/pdf-lib.min.js'));
  } else {
    // Browser (script tag biasa)
    global.MergeToPdf = factory(global.PDFLib);
  }
})(typeof self !== 'undefined' ? self : this, function (PDFLib) {
  'use strict';

  // Saiz halaman A4 dalam mata (points): 595.28 x 841.89
  var A4 = { width: 595.28, height: 841.89 };

  var MIME_BY_EXT = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf'
  };

  function guessMime(name) {
    var parts = (name || '').split('.');
    var ext = (parts[parts.length - 1] || '').toLowerCase();
    return MIME_BY_EXT[ext] || '';
  }

  function isPdfFile(file) {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
  }

  function isImageFile(file) {
    return /^image\//.test(file.type || '') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name || '');
  }

  /**
   * Kira dimensi imej supaya muat penuh dalam halaman (fit) tanpa terpotong.
   */
  function scaleToFit(imgW, imgH, pageW, pageH) {
    var s = Math.min(pageW / imgW, pageH / imgH);
    if (!isFinite(s) || s <= 0) s = 1;
    return { width: imgW * s, height: imgH * s };
  }

  /**
   * Embed imej ke dalam PDF. Jalan cepat: embed terus JPEG/PNG daripada bait asal.
   * Jalan fallback: `rasterize` (browser) → raster ke kanvas → embed PNG.
   */
  async function embedImage(pdfDoc, file, rasterize) {
    var buf = new Uint8Array(await file.arrayBuffer());
    var mime = file.type || guessMime(file.name);

    if (mime === 'image/jpeg' || mime === 'image/png') {
      try {
        return mime === 'image/jpeg' ? await pdfDoc.embedJpg(buf) : await pdfDoc.embedPng(buf);
      } catch (e) {
        // JPEG progresif/CMYK atau PNG aneh — jatuh ke rasterize
      }
    }

    if (typeof rasterize === 'function') {
      return await rasterize(pdfDoc, file);
    }
    throw new Error('Format "' + mime + '" tidak disokong secara terus; perlukan browser untuk rasterize.');
  }

  /**
   * Tambah satu fail (imej atau PDF) ke dokumen output. Pulangkan bilangan halaman yang ditambah.
   */
  async function addFileToDoc(outDoc, file, rasterize) {
    if (isPdfFile(file)) {
      var src = await PDFLib.PDFDocument.load(
        new Uint8Array(await file.arrayBuffer()),
        { ignoreEncryption: true, updateMetadata: false }
      );
      var pages = await outDoc.copyPages(src, src.getPageIndices());
      for (var i = 0; i < pages.length; i++) {
        outDoc.addPage(pages[i]);
      }
      return pages.length;
    }

    // Embed imej DAHULU, baru tambah halaman — supaya jika imej gagal
    // diproses, tiada halaman kosong tertinggal dalam output.
    var img = await embedImage(outDoc, file, rasterize);
    var page = outDoc.addPage([A4.width, A4.height]);
    var dims = scaleToFit(img.width, img.height, A4.width, A4.height);
    var x = (A4.width - dims.width) / 2;
    var y = (A4.height - dims.height) / 2;
    page.drawImage(img, { x: x, y: y, width: dims.width, height: dims.height });
    return 1;
  }

  /**
   * Gabung senarai fail menjadi satu PDF.
   *
   * @param {Array} files — objek menyerupai File: { name, type, arrayBuffer() }
   * @param {Object} opts — { rasterize, onProgress }
   *   rasterize: fungsi (pdfDoc, file) => Promise<EmbeddedImage> (dari browser).
   *   onProgress: fungsi (selesai, jumlah, namaFail).
   * @returns {Promise<{bytes: Uint8Array, pageCount: number, size: number, errors: Array}>}
   */
  async function mergeFiles(files, opts) {
    opts = opts || {};
    var rasterize = opts.rasterize || null;
    var onProgress = opts.onProgress || null;

    var outDoc = await PDFLib.PDFDocument.create();
    var pageCount = 0;
    var errors = [];

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (onProgress) onProgress(i + 1, files.length, file.name || ('Fail ' + (i + 1)));

      try {
        pageCount += await addFileToDoc(outDoc, file, rasterize);
      } catch (e) {
        errors.push({
          file: file.name || ('Fail ' + (i + 1)),
          message: (e && e.message) ? e.message : String(e)
        });
      }
    }

    var bytes = await outDoc.save();
    return { bytes: bytes, pageCount: pageCount, size: bytes.length, errors: errors };
  }

  return {
    A4: A4,
    mergeFiles: mergeFiles,
    addFileToDoc: addFileToDoc,
    scaleToFit: scaleToFit,
    isPdfFile: isPdfFile,
    isImageFile: isImageFile,
    guessMime: guessMime
  };
});