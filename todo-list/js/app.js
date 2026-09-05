/**
 * app.js — Lapisan UI Todo List (browser sahaja).
 * Bergantung pada core.js (window.TodoCore). Zero-dependency, ES6.
 *
 * Ciri:
 *  - Tambah/Edit/Padam task (modal), toggle siap, confirm padam
 *  - Filter (Semua/Aktif/Selesai), carian, pilihan kategori
 *  - Susun manual (drag & drop pointer events — jalan untuk sentuh & tetikus)
 *    atau susun auto ikut keutamaan
 *  - Progress bar keseluruhan + per kategori
 *  - Import teks (tambah/ganti), eksport TXT/JSON
 *  - Tema gelap (default) dengan toggle terang/gelap
 *  - Semua data disimpan automatik di localStorage
 */
(function () {
  'use strict';

  var core = window.TodoCore;
  var STORAGE_KEY = core.STORAGE_KEY;
  var THEME_KEY = 'todoListTheme';

  // Paparan status semakan: digunakan oleh smoke test browser (dump-dom).
  window.__todoSmoke = { ok: true, errors: [], booted: false };
  window.addEventListener('error', function (e) {
    window.__todoSmoke.ok = false;
    window.__todoSmoke.errors.push(String((e && e.message) || e.error || 'unknown error'));
  });
  window.addEventListener('unhandledrejection', function (e) {
    window.__todoSmoke.ok = false;
    window.__todoSmoke.errors.push(String((e && e.reason) || 'unhandled rejection'));
  });

  // ---------------------------------------------------------------- state

  var loaded = core.loadState();
  if (!loaded.ok) {
    window.__todoSmoke.errors.push('localStorage corrupt: ' + loaded.error);
  }
  var state = loaded.state;

  function save() {
    core.saveState(state);
  }

  // ---------------------------------------------------------------- helpers

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var toastTimer = null;
  function toast(msg, type) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show ' + (type || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.className = 'toast';
    }, 3200);
  }

  // ---------------------------------------------------------------- modal

  var modalStack = [];

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    document.body.classList.add('modal-open');
    modalStack.push(el);
    var focusable = el.querySelector('input, textarea, select, button');
    if (focusable) {
      setTimeout(function () { focusable.focus(); }, 60);
    }
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hidden');
    document.body.classList.remove('modal-open');
    var i = modalStack.indexOf(el);
    if (i !== -1) modalStack.splice(i, 1);
  }

  function closeTopModal() {
    var el = modalStack[modalStack.length - 1];
    if (el) closeModal(el.id);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTopModal();
  });

  // Modal confirm generik
  function showConfirm(opts) {
    $('#cfTitle').textContent = opts.title || 'Sahkan tindakan';
    $('#cfMsg').textContent = opts.message || '';
    var yesBtn = $('#btnConfirmYes');
    yesBtn.className = 'btn danger ' + (opts.danger === false ? '' : 'solid');
    yesBtn.textContent = opts.confirmLabel || 'Padam';
    yesBtn.onclick = function () {
      closeModal('modalConfirm');
      if (opts.onConfirm) opts.onConfirm();
    };
    $('#btnConfirmNo').onclick = function () { closeModal('modalConfirm'); };
    openModal('modalConfirm');
  }

  // ---------------------------------------------------------------- render

  function render() {
    renderTabs();
    renderCategoryOptions();
    renderStats();
    renderList();
    renderChips();
    renderSmoke();
  }

  function renderSmoke() {
    var el = document.getElementById('smoke');
    if (el) el.textContent = 'SMOKE ' + JSON.stringify(window.__todoSmoke);
  }

  function filterCount(filter) {
    var f = state.tasks.filter(function (t) {
      if (filter === 'aktif') return !t.done;
      if (filter === 'selesai') return t.done;
      return true;
    });
    return f.length;
  }

  function renderTabs() {
    var tabs = [
      { key: 'semua', label: 'Semua' },
      { key: 'aktif', label: 'Aktif' },
      { key: 'selesai', label: 'Selesai' }
    ];
    tabs.forEach(function (tb) {
      var btn = $('#tab-' + tb.key);
      if (!btn) return;
      var count = filterCount(tb.key);
      btn.textContent = tb.label + ' (' + count + ')';
      btn.classList.toggle('active', state.filter === tb.key);
    });
  }

  function renderCategoryOptions() {
    var sel = $('#catFilter');
    if (!sel) return;
    var current = state.categoryFilter;
    core.syncCategories(state);
    var html = '<option value="">Semua Kategori</option>';
    var dlHtml = '';
    state.categories.forEach(function (c) {
      html += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
      dlHtml += '<option value="' + escapeHtml(c) + '"></option>';
    });
    sel.innerHTML = html;
    sel.value = current;
    var dl = $('#catList');
    if (dl) dl.innerHTML = dlHtml;
  }

  function renderStats() {
    var stats = core.computeStats(state);
    $('#pctBar').style.width = stats.pct + '%';
    $('#pctText').textContent = stats.total
      ? stats.done + '/' + stats.total + ' selesai (' + stats.pct + '%)'
      : 'Tiada task. Tekan "Tambah Task" untuk bermula.';
    var overdueEl = $('#overdueText');
    if (overdueEl) {
      overdueEl.textContent = stats.overdue ? stats.overdue + ' task terlewat' : '';
      overdueEl.classList.toggle('show', stats.overdue > 0);
    }
  }

  var SORT_LABEL = {
    manual: 'Susun: Manual (seret)',
    priority: 'Susun: Ikut Prioriti'
  };

  function renderChips() {
    var wrap = $('#catChips');
    if (!wrap) return;
    var stats = core.computeStats(state);
    var keys = Object.keys(stats.byCategory).sort(function (a, b) {
      return String(a).localeCompare(String(b), 'ms');
    });
    var html = '';
    keys.forEach(function (k) {
      if (k === '(Tanpa Kategori)') return; // chip khusus kategori bernama sahaja
      var c = stats.byCategory[k];
      var pct = c.total ? Math.round(c.done / c.total * 100) : 0;
      var active = state.categoryFilter === k;
      var overdueTag = c.overdue ? ' <span class="chip-overdue">' + c.overdue + ' lewat</span>' : '';
      html +=
        '<button type="button" class="cat-chip' + (active ? ' active' : '') + '" data-cat="' + escapeHtml(k) + '">' +
        '<span class="chip-name">' + escapeHtml(k) + '</span>' +
        '<span class="chip-count">' + c.done + '/' + c.total + '</span>' +
        '<span class="chip-bar"><span class="chip-bar-fill" style="width:' + pct + '%"></span></span>' +
        overdueTag +
        '</button>';
    });
    wrap.innerHTML = html;
    $all('.cat-chip', wrap).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.getAttribute('data-cat');
        state.categoryFilter = state.categoryFilter === cat ? '' : cat;
        save();
        render();
      });
    });
  }

  function renderTaskItem(t, now) {
    var overdue = core.isOverdue(t, now);
    var prioName = core.PRIORITY_NAMES[t.priority] || 'Rendah';
    var dl = t.deadline ? core.friendlyDeadline(t.deadline, now) : '';
    var cls = ['task-item'];
    if (t.done) cls.push('done');
    if (overdue) cls.push('overdue');
    if (t.priority === 'tinggi') cls.push('prio-tinggi');
    if (t.priority === 'sederhana') cls.push('prio-sederhana');

    var html = '';
    html += '<li class="' + cls.join(' ') + '" data-id="' + escapeHtml(t.id) + '">';
    html += '<div class="drag-handle" title="Seret untuk susun" aria-label="Seret untuk susun semula">&#x22ee;&#x22ee;</div>';
    html += '<label class="check">';
    html += '<input type="checkbox" class="task-check" ' + (t.done ? 'checked' : '') + ' aria-label="Tanda selesai">';
    html += '<span class="checkmark"></span>';
    html += '</label>';
    html += '<div class="task-body">';
    html += '<div class="task-title">' + escapeHtml(t.title) + '</div>';
    if (t.note) html += '<div class="task-note">' + escapeHtml(t.note) + '</div>';
    html += '<div class="task-meta">';
    html += '<span class="prio prio-' + escapeHtml(t.priority) + '">' + escapeHtml(prioName) + '</span>';
    if (t.category) html += '<span class="cat-badge">#' + escapeHtml(t.category) + '</span>';
    if (dl) html += '<span class="dl-badge">' + escapeHtml(dl) + '</span>';
    if (overdue) html += '<span class="overdue-badge">Terlewat</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="task-actions">';
    html += '<button type="button" class="icon-btn btn-edit" title="Edit task" aria-label="Edit task">&#x270e;</button>';
    html += '<button type="button" class="icon-btn btn-del" title="Padam task" aria-label="Padam task">&#x1f5d1;</button>';
    html += '</div>';
    html += '</li>';
    return html;
  }

  function renderList() {
    var list = $('#taskList');
    var empty = $('#emptyState');
    if (!list) return;
    var visible = core.getFilteredTasks(state, {}, Date.now());
    $('#clearCatBtn').classList.toggle('hidden', !state.categoryFilter);
    if (!visible.length) {
      list.innerHTML = '';
      var msg;
      if (!state.tasks.length) {
        msg = 'Belum ada task. Tekan butang <strong>"+ Tambah Task"</strong> di bawah untuk mula.';
      } else if (state.search) {
        msg = 'Tiada hasil untuk carian <strong>"' + escapeHtml(state.search) + '"</strong>.';
      } else if (state.categoryFilter) {
        msg = 'Tiada task dalam kategori <strong>"' + escapeHtml(state.categoryFilter) + '"</strong>.';
      } else if (state.filter !== 'semua') {
        msg = 'Tiada task dalam tab <strong>"' + (state.filter === 'aktif' ? 'Aktif' : 'Selesai') + '"</strong>.';
      } else {
        msg = 'Tiada task untuk dipaparkan.';
      }
      empty.innerHTML = msg;
      empty.classList.add('show');
      return;
    }
    empty.classList.remove('show');
    list.innerHTML = visible.map(function (t) {
      return renderTaskItem(t, Date.now());
    }).join('');
  }

  // ---------------------------------------------------------------- senarai: event + drag

  /**
   * Ikat event senarai SEKALI sahaja (list element kekal, hanya innerHTML berubah).
   * Jangan panggil dalam renderList — elak pendengar pendua.
   */
  function bindListEvents(list) {
    list.addEventListener('change', function (e) {
      var cb = e.target.closest('.task-check');
      if (!cb) return;
      var li = cb.closest('.task-item');
      var t = core.toggleTask(state, li.getAttribute('data-id'));
      if (t) {
        save();
        render();
        toast(t.done ? 'Task ditanda siap \u2713' : 'Task ditanda belum siap', 'ok');
      }
    });

    list.addEventListener('click', function (e) {
      var editBtn = e.target.closest('.btn-edit');
      var delBtn = e.target.closest('.btn-del');
      if (editBtn) {
        var liE = editBtn.closest('.task-item');
        openTaskModal('edit', liE.getAttribute('data-id'));
      } else if (delBtn) {
        var liD = delBtn.closest('.task-item');
        var id = liD.getAttribute('data-id');
        var t = core.getTask(state, id);
        showConfirm({
          title: 'Padam task?',
          message: 'Task "' + (t ? t.title : '') + '" akan dipadam serta-merta. Tindakan ini tidak boleh dibatalkan.',
          confirmLabel: 'Padam',
          onConfirm: function () {
            core.deleteTask(state, id);
            save();
            render();
            toast('Task dipadam', 'ok');
          }
        });
      }
    });
  }

  // --- Drag & drop (Pointer Events: berfungsi untuk tetikus DAN sentuh) ---

  var drag = null;

  function isDragEnabled() {
    return state.sortMode !== 'priority';
  }

  function initDrag() {
    var list = $('#taskList');
    if (!list) return;

    list.addEventListener('pointerdown', function (e) {
      var handle = e.target.closest('.drag-handle');
      if (!handle) return;
      if (!isDragEnabled()) {
        toast('Matikan "Susun: Ikut Prioriti" dahulu untuk seret.', 'warn');
        return;
      }
      var li = handle.closest('.task-item');
      if (!li) return;
      var items = $all('.task-item', list);
      drag = {
        id: li.getAttribute('data-id'),
        li: li,
        fromIdx: items.indexOf(li),
        startY: e.clientY,
        delta: 0,
        pointerId: e.pointerId
      };
      li.classList.add('dragging');
      if (handle.setPointerCapture) {
        try { handle.setPointerCapture(e.pointerId); } catch (err) { /* tak apa */ }
      }
      e.preventDefault();
    });

    list.addEventListener('pointermove', function (e) {
      if (!drag) return;
      e.preventDefault();
      drag.delta = e.clientY - drag.startY;
      drag.li.style.transform = 'translateY(' + drag.delta + 'px)';
      // Tandai item sasaran (maklum balas visual)
      var items = $all('.task-item', list);
      items.forEach(function (it) { it.classList.remove('drag-target'); });
      var center = drag.li.getBoundingClientRect().top + drag.li.offsetHeight / 2;
      var toIdx = items.length - 1;
      for (var i = 0; i < items.length; i++) {
        if (items[i] === drag.li) continue;
        var r = items[i].getBoundingClientRect();
        var mid = r.top + r.height / 2;
        if (center < mid) {
          toIdx = i;
          break;
        }
      }
      var target = items[toIdx];
      if (target && target !== drag.li) target.classList.add('drag-target');
    }, { passive: false });

    function endDrag(e) {
      if (!drag) return;
      e.preventDefault();
      var items = $all('.task-item', list);
      // Kira kedudukan terkini (transform translateY masih aktif) SEBELUM reset
      var center = drag.li.getBoundingClientRect().top + drag.li.offsetHeight / 2;
      items.forEach(function (it) {
        it.classList.remove('dragging', 'drag-target');
        it.style.transform = '';
      });
      var toIdx = items.length - 1;
      for (var i = 0; i < items.length; i++) {
        if (items[i] === drag.li) continue;
        var r = items[i].getBoundingClientRect();
        var mid = r.top + r.height / 2;
        if (center < mid) {
          toIdx = i;
          break;
        }
      }
      var fromIdx = drag.fromIdx;
      var id = drag.id;
      drag = null;
      if (toIdx !== fromIdx) {
        var visible = core.getFilteredTasks(state, {}, Date.now()).map(function (t) { return t.id; });
        core.applyVisibleReorder(state, visible, fromIdx, toIdx);
        save();
        render();
        toast('Urutan task dikemas kini', 'ok');
      }
    }

    list.addEventListener('pointerup', endDrag);
    list.addEventListener('pointercancel', endDrag);
  }

  // ---------------------------------------------------------------- modal task (tambah/edit)

  function openTaskModal(mode, id) {
    var isEdit = mode === 'edit';
    var task = isEdit && id ? core.getTask(state, id) : null;

    $('#taskModalTitle').textContent = isEdit ? 'Edit Task' : 'Tambah Task Baharu';
    $('#taskForm').setAttribute('data-mode', isEdit ? 'edit' : 'add');
    if (isEdit && task) $('#taskForm').setAttribute('data-id', task.id);
    $('#fTitle').value = task ? task.title : '';
    $('#fNote').value = task ? (task.note || '') : '';
    $('#fPriority').value = task ? task.priority : 'rendah';
    $('#fCategory').value = task ? (task.category || '') : '';

    var dl = task ? (task.deadline || '') : '';
    var datePart = dl.split('T')[0] || '';
    var timePart = dl.indexOf('T') !== -1 ? dl.split('T')[1].slice(0, 5) : '';
    $('#fDate').value = datePart;
    $('#fTime').value = timePart;
    updateTimeWrap();
    $('#dlClear').classList.toggle('hidden', !dl);

    renderCatQuick();
    openModal('modalTask');
  }

  function renderCatQuick() {
    var wrap = $('#catQuick');
    if (!wrap) return;
    core.syncCategories(state);
    if (!state.categories.length) {
      wrap.innerHTML = '<span class="hint">Tiada kategori lagi — taip nama kategori baru di atas.</span>';
      return;
    }
    var html = '<span class="hint">Klik untuk pilih:</span>';
    state.categories.forEach(function (c) {
      html += '<button type="button" class="chip-mini" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
    });
    wrap.innerHTML = html;
    $all('.chip-mini', wrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $('#fCategory').value = btn.getAttribute('data-cat');
      });
    });
  }

  function updateTimeWrap() {
    var hasDate = !!$('#fDate').value;
    $('#fTimeWrap').classList.toggle('show', hasDate);
  }

  function collectTaskForm() {
    var title = $('#fTitle').value.trim();
    if (!title) {
      $('#fTitle').focus();
      throw new Error('Tajuk task wajib diisi.');
    }
    var dateVal = $('#fDate').value;
    var timeVal = $('#fTime').value;
    var deadline = '';
    if (dateVal) deadline = dateVal + (timeVal ? 'T' + timeVal : '');
    return {
      title: title,
      note: $('#fNote').value.trim(),
      priority: $('#fPriority').value || 'rendah',
      category: $('#fCategory').value.trim(),
      deadline: deadline
    };
  }

  function submitTaskForm(e) {
    if (e) e.preventDefault();
    var form = $('#taskForm');
    var mode = form.getAttribute('data-mode');
    var data;
    try {
      data = collectTaskForm();
    } catch (err) {
      toast(err.message, 'warn');
      return;
    }
    if (mode === 'edit') {
      var id = form.getAttribute('data-id');
      core.updateTask(state, id, data);
      toast('Task dikemas kini', 'ok');
    } else {
      core.addTask(state, data);
      toast('Task ditambah', 'ok');
    }
    save();
    closeModal('modalTask');
    render();
  }

  // ---------------------------------------------------------------- import

  function openImportModal() {
    $('#impText').value = '';
    $('#impModeAdd').checked = true;
    $('#impResult').textContent = '';
    $('#impResult').className = 'imp-result';
    openModal('modalImport');
  }

  function runImport() {
    var text = $('#impText').value;
    if (!text.trim()) {
      toast('Tiada teks untuk diimport.', 'warn');
      return;
    }
    var mode = $('#impModeReplace').checked ? 'replace' : 'add';
    function doImport() {
      var res = core.importTasks(state, text, mode);
      save();
      render();
      var el = $('#impResult');
      el.className = 'imp-result ' + (res.skipped ? 'warn' : 'ok');
      el.textContent = mode === 'replace'
        ? 'Ganti selesai: ' + res.added + ' task diimport'
        : 'Import selesai: ' + res.added + ' task ditambah' +
          (res.skipped ? ' (' + res.skipped + ' baris tidak sah diabaikan)' : '');
      toast(mode === 'replace' ? res.added + ' task diimport (ganti semua)' : res.added + ' task diimport', 'ok');
    }
    if (mode === 'replace' && state.tasks.length) {
      showConfirm({
        title: 'Ganti semua task?',
        message: 'Senarai sedia ada dengan ' + state.tasks.length + ' task akan DIGANTI dengan teks import. Pastikan anda telah eksport salinan jika perlu.',
        confirmLabel: 'Ganti',
        danger: true,
        onConfirm: doImport
      });
    } else {
      doImport();
    }
  }

  // ---------------------------------------------------------------- eksport

  function download(filename, content, mime) {
    var blob = new Blob([content], { type: mime + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function fileStamp() {
    var d = new Date();
    return d.getFullYear() +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
  }

  function exportTxt() {
    if (!state.tasks.length) {
      toast('Tiada task untuk dieksport.', 'warn');
      return;
    }
    var txt = core.exportTxt(state);
    download('todo-list-' + fileStamp() + '.txt', txt, 'text/plain');
    toast('Eksport TXT selesai (' + state.tasks.length + ' task)', 'ok');
  }

  function exportJson() {
    if (!state.tasks.length) {
      toast('Tiada task untuk dieksport.', 'warn');
      return;
    }
    var json = core.exportJson(state);
    download('todo-list-' + fileStamp() + '.json', json, 'application/json');
    toast('Eksport JSON selesai', 'ok');
  }

  // ---------------------------------------------------------------- tema

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = $('#btnTheme');
    if (btn) btn.textContent = theme === 'dark' ? '\u263e' : '\u2600';
  }

  function toggleTheme() {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) { /* tak apa */ }
  }

  // ---------------------------------------------------------------- boot

  function bindUi() {
    // Filter tabs
    $all('#filterTabs .tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.filter = btn.getAttribute('data-filter');
        save();
        render();
      });
    });

    // Carian
    $('#searchInput').addEventListener('input', function () {
      state.search = this.value;
      save();
      render();
    });

    // Pilihan kategori
    $('#catFilter').addEventListener('change', function () {
      state.categoryFilter = this.value;
      save();
      render();
    });

    // Susun
    $('#sortSel').addEventListener('change', function () {
      state.sortMode = this.value;
      save();
      render();
    });

    // Butang utama
    $('#btnAdd').addEventListener('click', function () { openTaskModal('add'); });
    $('#btnImport').addEventListener('click', openImportModal);
    $('#btnExportTxt').addEventListener('click', exportTxt);
    $('#btnExportJson').addEventListener('click', exportJson);
    $('#btnTheme').addEventListener('click', toggleTheme);

    // Butang eksport di footer
    $('#btnExportTxt2').addEventListener('click', exportTxt);
    $('#btnExportJson2').addEventListener('click', exportJson);

    // Tutup modal generik: [data-close="modalId"]
    $all('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(btn.getAttribute('data-close'));
      });
    });

    // Modal task
    $('#taskForm').addEventListener('submit', submitTaskForm);
    $('#btnTaskCancel').addEventListener('click', function () { closeModal('modalTask'); });
    $('#fDate').addEventListener('input', function () {
      updateTimeWrap();
      $('#dlClear').classList.toggle('hidden', !this.value);
    });
    $('#dlClear').addEventListener('click', function () {
      $('#fDate').value = '';
      $('#fTime').value = '';
      updateTimeWrap();
      this.classList.add('hidden');
    });

    // Modal import
    $('#btnImportGo').addEventListener('click', runImport);
    $('#btnImportCancel').addEventListener('click', function () { closeModal('modalImport'); });

    // Tutup modal dengan klik pada latar
    $all('.modal').forEach(function (m) {
      m.addEventListener('click', function (e) {
        if (e.target === m) closeModal(m.id);
      });
    });

    $('#clearCatBtn').addEventListener('click', function () {
      state.categoryFilter = '';
      save();
      render();
    });

    initDrag();
  }

  function boot() {
    // Tema
    var savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    } catch (e) { /* tak apa */ }
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

    // Pilih semula nilai semasa dalam kawalan UI
    $('#sortSel').value = state.sortMode;

    bindUi();
    bindListEvents($('#taskList'));
    render();

    // Status untuk smoke test
    window.__todoSmoke.booted = true;
    var el = document.getElementById('smoke');
    if (el) el.textContent = 'SMOKE ' + JSON.stringify(window.__todoSmoke);

    // API untuk ujian browser (CDP)
    window.TodoApp = {
      core: core,
      getState: function () { return state; },
      addTask: function (p) { var t = core.addTask(state, p); save(); render(); return t; },
      updateTask: function (id, p) { var t = core.updateTask(state, id, p); save(); render(); return t; },
      deleteTask: function (id) { var ok = core.deleteTask(state, id); save(); render(); return ok; },
      toggleTask: function (id) { var t = core.toggleTask(state, id); save(); render(); return t; },
      importTasks: function (text, mode) { var r = core.importTasks(state, text, mode); save(); render(); return r; },
      exportTxt: function () { return core.exportTxt(state); },
      exportJson: function () { return core.exportJson(state); },
      clearAll: function () {
        state.tasks = [];
        state.categories = [];
        save();
        render();
      },
      getVisibleTasks: function () {
        return core.getFilteredTasks(state, {}, Date.now());
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();