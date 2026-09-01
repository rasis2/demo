/* app.js — UI browser untuk "Gabung ke PDF" (merge-to-pdf) */
(function () {
  'use strict';

  var M = window.MergeToPdf; // dari js/merge-core.js (memerlukan vendor/pdf-lib.min.js dimuat dahulu)

  // ---- Elemen DOM ----
  var dropzone = document.getElementById('dropzone');
  var fileInput = document.getElementById('file-input');
  var listEl = document.getElementById('file-list');
  var emptyEl = document.getElementById('empty-state');
  var mergeBtn = document.getElementById('merge-btn');
  var progressWrap = document.getElementById('progress-wrap');
  var progressBar = document.getElementById('progress-bar');
  var progressText = document.getElementById('progress-text');
  var resultPanel = document.getElementById('result-panel');
  var resultError = document.getElementById('result-error');
  var downloadLink = document.getElementById('download-link');
  var resultPages = document.getElementById('result-pages');
  var resultSize = document.getElementById('result-size');
  var mergeAgainBtn = document.getElementById('merge-again-btn');
  var clearAllBtn = document.getElementById('clear-all-btn');
  var countBadge = document.getElementById('count-badge');

  // ---- Keadaan (state) ----
  var files = []; // { file, thumbUrl }
  var thumbCache = {}; // objURL per nama+saiz untuk elak pembocoran URL
  var busy = false;

  // Ikon PDF (inline SVG data URI) untuk fail yang bukan imej
  var PDF_ICON = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
    '<rect x="6" y="4" width="52" height="56" rx="6" fill="#e5484d"/>' +
    '<path d="M14 14h36v10H14z" fill="#ffffff" opacity="0.85"/>' +
    '<text x="32" y="45" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">PDF</text>' +
    '</svg>'
  );

  // ---- Format saiz ----
  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function formatCount(n) {
    return n + ' muka surat';
  }

  // ---- Rasterize imej → PNG (untuk gif/webp/bmp/svg atau fallback jpeg/png) ----
  function rasterize(pdfDoc, file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var MAX = 4000; // had dimensi maksimum untuk elak kanvas gergasi
          var s = Math.min(1, MAX / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round((img.naturalWidth || 1) * s));
          c.height = Math.max(1, Math.round((img.naturalHeight || 1) * s));
          var ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, c.width, c.height);
          var dataUrl = c.toDataURL('image/png');
          var bin = atob(dataUrl.split(',')[1]);
          var bytes = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          URL.revokeObjectURL(url);
          pdfDoc.embedPng(bytes).then(resolve, reject);
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Gagal membaca imej: ' + file.name));
      };
      img.src = url;
    });
  }

  // ---- Tambah fail dari FileList ----
  function addFiles(fileList) {
    var added = 0;
    var rejected = 0;
    for (var i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      if (M.isPdfFile(f) || M.isImageFile(f)) {
        files.push({ file: f, thumbUrl: null });
        added++;
      } else {
        rejected++;
      }
    }
    if (rejected > 0) {
      showToast(rejected + ' fail diskip (bukan imej atau PDF).');
    }
    if (added > 0) {
      renderList();
      hideResult();
    }
    return added;
  }

  // ---- Thumbnail ----
  function thumbFor(item) {
    var key = item.file.name + '|' + item.file.size + '|' + item.file.lastModified;
    if (item.thumbUrl) return item.thumbUrl;
    if (M.isPdfFile(item.file)) {
      item.thumbUrl = PDF_ICON;
      return item.thumbUrl;
    }
    var url = URL.createObjectURL(item.file);
    thumbCache[key] = url;
    item.thumbUrl = url;
    return url;
  }

  // ---- Render senarai ----
  function renderList() {
    listEl.innerHTML = '';
    var i, item, row;

    for (i = 0; i < files.length; i++) {
      item = files[i];

      row = document.createElement('div');
      row.className = 'file-row';
      row.draggable = true;
      row.dataset.index = String(i);

      // Badge nombor
      var num = document.createElement('span');
      num.className = 'file-num';
      num.textContent = String(i + 1);

      // Thumbnail
      var thumb = document.createElement('div');
      thumb.className = 'file-thumb';
      var img = document.createElement('img');
      img.src = thumbFor(item);
      img.alt = item.file.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      thumb.appendChild(img);

      // Maklumat
      var info = document.createElement('div');
      info.className = 'file-info';
      var name = document.createElement('div');
      name.className = 'file-name';
      name.title = item.file.name;
      name.textContent = item.file.name;
      var meta = document.createElement('div');
      meta.className = 'file-meta';
      meta.textContent = (M.isPdfFile(item.file) ? 'PDF · ' : 'Imej · ') + formatBytes(item.file.size);
      info.appendChild(name);
      info.appendChild(meta);

      // Butang kawalan
      var ctrl = document.createElement('div');
      ctrl.className = 'file-ctrl';
      ctrl.appendChild(btn('up', '\u2191', 'Naikkan ke atas', function (idx) { moveItem(idx, -1); }));
      ctrl.appendChild(btn('down', '\u2193', 'Turunkan ke bawah', function (idx) { moveItem(idx, 1); }));
      ctrl.appendChild(btn('remove', '\u2715', 'Buang fail ini', function (idx) { removeItem(idx); }));

      row.appendChild(num);
      row.appendChild(thumb);
      row.appendChild(info);
      row.appendChild(ctrl);

      // Drag untuk susun semula
      row.addEventListener('dragstart', onDragStart);
      row.addEventListener('dragover', onDragOver);
      row.addEventListener('drop', onDrop);
      row.addEventListener('dragend', onDragEnd);

      listEl.appendChild(row);
    }

    var hasFiles = files.length > 0;
    emptyEl.style.display = hasFiles ? 'none' : '';
    mergeBtn.disabled = !hasFiles || busy;
    clearAllBtn.disabled = !hasFiles;
    countBadge.textContent = hasFiles ? files.length + ' fail' : '';
  }

  function btn(kind, label, title, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-icon btn-' + kind;
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = label;
    b.addEventListener('click', function () { onClick(parseInt(b.closest('.file-row').dataset.index, 10)); });
    return b;
  }

  function moveItem(idx, delta) {
    var target = idx + delta;
    if (target < 0 || target >= files.length) return;
    var tmp = files[idx];
    files[idx] = files[target];
    files[target] = tmp;
    renderList();
  }

  function removeItem(idx) {
    var item = files[idx];
    if (item.thumbUrl && item.thumbUrl.indexOf('blob:') === 0) {
      URL.revokeObjectURL(item.thumbUrl);
    }
    files.splice(idx, 1);
    renderList();
  }

  function clearAll() {
    files.forEach(function (it) {
      if (it.thumbUrl && it.thumbUrl.indexOf('blob:') === 0) URL.revokeObjectURL(it.thumbUrl);
    });
    files = [];
    renderList();
  }

  // ---- Drag & drop susun semula dalam senarai ----
  var dragIdx = null;
  function onDragStart(e) {
    dragIdx = parseInt(this.dataset.index, 10);
    e.dataTransfer.effectAllowed = 'move';
    this.classList.add('dragging');
  }
  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    var row = e.target.closest('.file-row');
    if (row && row !== this) this.classList.add('drag-over');
  }
  function onDrop(e) {
    e.preventDefault();
    var from = dragIdx;
    var to = parseInt(this.dataset.index, 10);
    if (from !== null && from !== undefined && from !== to) {
      var item = files.splice(from, 1)[0];
      files.splice(to, 0, item);
    }
    dragIdx = null;
    renderList();
  }
  function onDragEnd() {
    dragIdx = null;
    this.classList.remove('dragging', 'drag-over');
    renderList();
  }

  // ---- Drag & drop ke dropzone ----
  ['dragenter', 'dragover'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  });
  dropzone.addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    if (fileInput.files && fileInput.files.length) addFiles(fileInput.files);
    fileInput.value = '';
  });

  // ---- Hasil ----
  function hideResult() {
    resultPanel.style.display = 'none';
  }

  function showResult(res) {
    var blob = new Blob([res.bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'gabungan.pdf');
    resultPages.textContent = formatCount(res.pageCount);
    resultSize.textContent = formatBytes(res.size);

    if (res.errors && res.errors.length) {
      resultError.style.display = 'block';
      resultError.innerHTML = '<strong>' + res.errors.length + ' fail tidak dapat diproses:</strong><br>' +
        res.errors.map(function (e) {
          return '&bull; ' + escapeHtml(e.file) + ' — ' + escapeHtml(e.message);
        }).join('<br>');
    } else {
      resultError.style.display = 'none';
    }

    resultPanel.style.display = 'block';
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  // ---- Toast ----
  var toastTimer = null;
  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  // ---- Merge ----
  function doMerge() {
    if (busy) return;
    if (!files.length) {
      showToast('Tiada fail dipilih.');
      return;
    }
    busy = true;
    mergeBtn.disabled = true;
    clearAllBtn.disabled = true;
    progressWrap.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = 'Menyediakan…';

    M.mergeFiles(files.map(function (it) { return it.file; }), {
      rasterize: rasterize,
      onProgress: function (done, total, name) {
        var pct = Math.round((done / total) * 100);
        progressBar.style.width = pct + '%';
        progressText.textContent = 'Menggabung ' + done + ' daripada ' + total + ' — ' + name;
      }
    }).then(function (res) {
      busy = false;
      progressWrap.style.display = 'none';
      mergeBtn.disabled = files.length === 0;
      clearAllBtn.disabled = files.length === 0;
      if (res.pageCount === 0 && res.errors.length) {
        showToast('Semua fail gagal diproses.');
        return;
      }
      showResult(res);
    }).catch(function (err) {
      busy = false;
      progressWrap.style.display = 'none';
      mergeBtn.disabled = files.length === 0;
      clearAllBtn.disabled = files.length === 0;
      showToast('Ralat semasa menggabung: ' + ((err && err.message) || err));
    });
  }

  mergeBtn.addEventListener('click', doMerge);
  mergeAgainBtn.addEventListener('click', function () {
    resultPanel.style.display = 'none';
    clearAll();
    dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  clearAllBtn.addEventListener('click', clearAll);

  renderList();
})();