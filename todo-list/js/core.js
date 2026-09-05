/**
 * core.js — Teras logik Todo List (UMD: berfungsi dalam browser & Node).
 *
 * Zero-dependency JavaScript tulen. Semua logik teras (CRUD, filter, carian,
 * import/export, statistik, localStorage) diletakkan di sini supaya boleh
 * diuji dalam Node dan digunakan dalam browser.
 *
 * Format import (satu baris = satu task):
 *   [ ] [Tinggi] Tajuk task #kategori @2026-09-10 | nota tambahan
 *   [x] [Sedang] Beli susu #Rumah @2026-09-10T14:30
 *
 * Token pilihan:
 *   [x] / [ ]          → status siap / belum (default: belum)
 *   [Tinggi][Sedang][Rendah] (atau T/S/R, perkataan penuh tak apa) → keutamaan
 *   #kategori          → kategori (token pertama dijadikan kategori)
 *   @YYYY-MM-DD        → tarikh akhir sahaja
 *   @YYYY-MM-DDTHH:mm  → tarikh + masa akhir
 *   | nota             → nota/catatan task (selepas simbol |)
 * Baris kosong / bermula dengan // atau -- dianggap komen dan diabaikan.
 */
(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node / CommonJS
    module.exports = factory();
  } else {
    // Browser (script tag biasa)
    global.TodoCore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'todoListData:v1';

  var PRIORITIES = ['rendah', 'sederhana', 'tinggi'];
  var PRIORITY_NAMES = { rendah: 'Rendah', sederhana: 'Sederhana', tinggi: 'Tinggi' };
  var PRIORITY_ORDER = { rendah: 0, sederhana: 1, tinggi: 2 };

  var MONTHS_SHORT = [
    'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'
  ];

  // ---------------------------------------------------------------- utiliti

  function uid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function normalizePriority(p) {
    p = String(p == null ? '' : p).toLowerCase().trim();
    if (p === 't' || p === 'tinggi' || p === 'high') return 'tinggi';
    if (p === 's' || p === 'sederhana' || p === 'medium' || p === 'med') return 'sederhana';
    return 'rendah';
  }

  function startOfDay(ms) {
    var d = new Date(ms);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  function buildInitialState() {
    return {
      tasks: [],
      categories: [],
      filter: 'semua',
      search: '',
      categoryFilter: '',
      sortMode: 'manual'
    };
  }

  // ---------------------------------------------------------------- task

  function createTask(partial, now) {
    now = now || Date.now();
    var p = partial || {};
    return {
      id: p.id ? String(p.id) : uid(),
      title: String(p.title == null ? '' : p.title).trim(),
      note: p.note == null ? '' : String(p.note),
      done: !!p.done,
      priority: normalizePriority(p.priority),
      category: p.category ? String(p.category).trim() : '',
      deadline: p.deadline ? String(p.deadline).trim() : '',
      createdAt: typeof p.createdAt === 'number' ? p.createdAt : now
    };
  }

  function syncCategories(state) {
    var set = {};
    state.tasks.forEach(function (t) {
      if (t.category) set[t.category] = 1;
    });
    state.categories.forEach(function (c) {
      var s = String(c).trim();
      if (s) set[s] = 1;
    });
    var arr = [];
    for (var k in set) {
      if (Object.prototype.hasOwnProperty.call(set, k)) arr.push(k);
    }
    arr.sort(function (a, b) {
      return String(a).localeCompare(String(b), 'ms');
    });
    state.categories = arr;
    return arr;
  }

  function addTask(state, partial, now) {
    var t = createTask(partial, now);
    if (!t.title) throw new Error('Tajuk task wajib diisi');
    state.tasks.push(t);
    syncCategories(state);
    return t;
  }

  function findTaskIdx(state, id) {
    return state.tasks.findIndex(function (t) { return t.id === id; });
  }

  function getTask(state, id) {
    return state.tasks.find(function (t) { return t.id === id; }) || null;
  }

  function updateTask(state, id, patch) {
    var idx = findTaskIdx(state, id);
    if (idx === -1) throw new Error('Task tidak dijumpai: ' + id);
    var t = state.tasks[idx];
    var p = patch || {};
    if (p.title !== undefined) t.title = String(p.title).trim();
    if (p.note !== undefined) t.note = String(p.note);
    if (p.done !== undefined) t.done = !!p.done;
    if (p.priority !== undefined) t.priority = normalizePriority(p.priority);
    if (p.category !== undefined) t.category = p.category ? String(p.category).trim() : '';
    if (p.deadline !== undefined) t.deadline = String(p.deadline).trim();
    if (!t.title) throw new Error('Tajuk task wajib diisi');
    syncCategories(state);
    return t;
  }

  function deleteTask(state, id) {
    var idx = findTaskIdx(state, id);
    if (idx === -1) return false;
    state.tasks.splice(idx, 1);
    syncCategories(state);
    return true;
  }

  function toggleTask(state, id) {
    var t = getTask(state, id);
    if (!t) return null;
    t.done = !t.done;
    return t;
  }

  function moveTask(state, id, toIndex) {
    var from = findTaskIdx(state, id);
    if (from === -1) return false;
    toIndex = clamp(Math.floor(toIndex) || 0, 0, state.tasks.length - 1);
    if (toIndex === from) return false;
    var t = state.tasks.splice(from, 1)[0];
    state.tasks.splice(toIndex, 0, t);
    return true;
  }

  /**
   * Susun semula hanya item yang kelihatan (visibleIds = urutan paparan semasa).
   * Item tak kelihatan (disebabkan filter/carian) kekal di kedudukan asal.
   */
  function applyVisibleReorder(state, visibleIds, fromIdx, toIdx) {
    if (!Array.isArray(visibleIds) || !visibleIds.length) return false;
    if (fromIdx < 0 || fromIdx >= visibleIds.length) return false;
    var moved = visibleIds[fromIdx];
    toIdx = clamp(toIdx, 0, visibleIds.length - 1);
    var ids = visibleIds.slice();
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, moved);

    var visSet = {};
    ids.forEach(function (id) { visSet[id] = true; });
    var byId = {};
    state.tasks.forEach(function (t) { byId[t.id] = t; });
    var out = [];
    var vi = 0;
    state.tasks.forEach(function (t) {
      if (visSet[t.id]) {
        out.push(byId[ids[vi]]);
        vi++;
      } else {
        out.push(t);
      }
    });
    state.tasks = out;
    return true;
  }

  // ---------------------------------------------------------------- deadline / lewat

  function parseDeadline(str) {
    if (!str) return null;
    var m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
    if (!m) return null;
    var hasTime = m[4] !== undefined && m[5] !== undefined;
    var d = new Date(
      Number(m[1]), Number(m[2]) - 1, Number(m[3]),
      hasTime ? Number(m[4]) : 0,
      hasTime ? Number(m[5]) : 0, 0, 0
    );
    var ms = d.getTime();
    if (isNaN(ms)) return null;
    return { ms: ms, hasTime: hasTime };
  }

  function deadlineMs(str) {
    var p = parseDeadline(str);
    return p ? p.ms : null;
  }

  function isOverdue(task, now) {
    if (!task || task.done || !task.deadline) return false;
    var p = parseDeadline(task.deadline);
    if (!p) return false;
    var nowMs = now == null ? Date.now() : now;
    // Tarikh sahaja = tarikh itu masih sah sehingga hujung hari.
    var limit = p.hasTime ? p.ms : p.ms + 86400000 - 1;
    return limit < nowMs;
  }

  function pad2(n) {
    return String(n).length < 2 ? '0' + n : String(n);
  }

  function friendlyDeadline(str, now) {
    var p = parseDeadline(str);
    if (!p) return '';
    var d = new Date(p.ms);
    var ref = now == null ? Date.now() : now;
    var today = startOfDay(ref);
    var thatDay = startOfDay(p.ms);
    var time = p.hasTime ? ', ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) : '';
    if (thatDay === today) return 'Hari ini' + time;
    if (thatDay === today + 86400000) return 'Esok' + time;
    if (thatDay === today - 86400000) return 'Semalam' + time;
    return d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()] + ' ' + d.getFullYear() + time;
  }

  // ---------------------------------------------------------------- filter / carian

  function searchMatch(t, query) {
    var words = query.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    var hay = (t.title + ' ' + t.note + ' ' + t.category).toLowerCase();
    return words.every(function (w) {
      return hay.indexOf(w.toLowerCase()) !== -1;
    });
  }

  function getFilteredTasks(state, opts, now) {
    opts = opts || {};
    var filter = opts.filter !== undefined ? opts.filter : (state.filter || 'semua');
    var search = opts.search !== undefined ? opts.search : (state.search || '');
    var cat = opts.category !== undefined ? opts.category : (state.categoryFilter || '');
    var sort = opts.sort !== undefined ? opts.sort : (state.sortMode || 'manual');

    var out = state.tasks.filter(function (t) {
      if (filter === 'aktif' && t.done) return false;
      if (filter === 'selesai' && !t.done) return false;
      if (cat && t.category !== cat) return false;
      if (search && !searchMatch(t, search)) return false;
      return true;
    });

    if (sort === 'priority') {
      var nowMs = now == null ? Date.now() : now;
      out = out.slice().sort(function (a, b) {
        var ap = PRIORITY_ORDER[a.priority] || 0;
        var bp = PRIORITY_ORDER[b.priority] || 0;
        if (ap !== bp) return bp - ap; // tinggi dahulu
        var ao = isOverdue(a, nowMs) ? 1 : 0;
        var bo = isOverdue(b, nowMs) ? 1 : 0;
        if (ao !== bo) return bo - ao; // terlewat dahulu
        var ad = deadlineMs(a.deadline);
        var bd = deadlineMs(b.deadline);
        var an = ad == null ? Infinity : ad;
        var bn = bd == null ? Infinity : bd;
        if (an !== bn) return an - bn; // tarikh akhir terdekat dahulu
        return (a.createdAt || 0) - (b.createdAt || 0);
      });
    }
    return out;
  }

  // ---------------------------------------------------------------- import / export

  var RE_DONE = /^\[(x| )\]/i;
  var RE_PRIO_TOKEN = /\[(tinggi|t|sederhana|s|rendah|r|high|medium|low)\]/gi;
  var RE_CAT = /#([^\s#@|[\]]+)/g;
  var RE_DATE = /@(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?)/g;

  /**
   * Parse satu baris import → data task (atau null jika baris kosong/komen/invalid).
   *
   * Contoh: "[x] [Tinggi] Beli susu #Rumah @2026-09-10 | nota"
   */
  function parseTaskLine(line) {
    if (typeof line !== 'string') return null;
    var s = line.trim();
    if (!s) return null;
    if (s.indexOf('//') === 0 || s.indexOf('--') === 0) return null; // baris komen

    var done = false;
    var mDone = s.match(RE_DONE);
    if (mDone) {
      done = mDone[1].toLowerCase() === 'x';
      s = s.slice(mDone[0].length).trim();
    }

    var priority = 'rendah';
    var prioMatches = s.match(RE_PRIO_TOKEN);
    if (prioMatches && prioMatches.length) {
      priority = normalizePriority(prioMatches[0].slice(1, -1));
    }

    var category = '';
    var mCat = s.match(RE_CAT);
    if (mCat && mCat.length) {
      category = mCat[0].slice(1); // buang '#'
    }

    var deadline = '';
    var mDate = s.match(RE_DATE);
    if (mDate && mDate.length) {
      deadline = mDate[0].slice(1); // buang '@'
    }

    var title = s
      .replace(RE_PRIO_TOKEN, '')
      .replace(RE_CAT, '')
      .replace(RE_DATE, '')
      .replace(/\s+/g, ' ')
      .trim();

    var note = '';
    var pipe = title.indexOf('|');
    if (pipe !== -1) {
      note = title.slice(pipe + 1).trim();
      title = title.slice(0, pipe).trim();
    }

    if (!title) return null;
    return {
      title: title,
      note: note,
      done: done,
      priority: priority,
      category: category,
      deadline: deadline
    };
  }

  /**
   * Import teks. mode: 'add' (tambah kepada senarai sedia ada) | 'replace' (ganti semua).
   * Pulangan: { total, added, skipped } — skipped = baris tak kosong yang tak dapat diparse.
   */
  function importTasks(state, text, mode, now) {
    mode = mode === 'replace' ? 'replace' : 'add';
    var lines = String(text == null ? '' : text).split(/\r?\n/);
    var parsed = [];
    var skipped = 0;
    lines.forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) return; // baris kosong = diam
      if (trimmed.indexOf('//') === 0 || trimmed.indexOf('--') === 0) return; // komen = diabaikan senyap
      var t = parseTaskLine(line);
      if (!t) {
        skipped++;
        return;
      }
      parsed.push(t);
    });
    if (mode === 'replace') {
      state.tasks = [];
      state.categories = [];
    }
    var added = 0;
    parsed.forEach(function (t) {
      addTask(state, t, now);
      added++;
    });
    return { total: parsed.length, added: added, skipped: skipped, mode: mode };
  }

  /**
   * Eksport TXT — satu baris satu task (boleh diimport semula).
   * Format: [x] [Tinggi] Tajuk #kategori @2026-09-10 | nota
   */
  function exportTxt(state) {
    var lines = state.tasks.map(function (t) {
      var s = (t.done ? '[x]' : '[ ]') + ' [' + PRIORITY_NAMES[t.priority] + '] ' + t.title;
      if (t.category) s += ' #' + t.category;
      if (t.deadline) s += ' @' + t.deadline;
      if (t.note) s += ' | ' + t.note;
      return s;
    });
    return lines.length ? lines.join('\n') + '\n' : '';
  }

  function exportJson(state) {
    return JSON.stringify(state, null, 2);
  }

  // ---------------------------------------------------------------- simpanan

  function sanitizeTask(t) {
    if (!t || typeof t !== 'object') return null;
    var title = t.title == null ? '' : String(t.title).trim();
    if (!title) return null;
    return {
      id: t.id ? String(t.id) : uid(),
      title: title,
      note: t.note == null ? '' : String(t.note),
      done: !!t.done,
      priority: normalizePriority(t.priority),
      category: t.category ? String(t.category).trim() : '',
      deadline: t.deadline ? String(t.deadline).trim() : '',
      createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now()
    };
  }

  function serialize(state) {
    return JSON.stringify({
      app: 'todo-list',
      version: 1,
      state: {
        tasks: state.tasks,
        categories: state.categories,
        filter: state.filter,
        search: state.search,
        categoryFilter: state.categoryFilter,
        sortMode: state.sortMode
      }
    }, null, 2);
  }

  function deserialize(jsonStr) {
    try {
      var data = JSON.parse(jsonStr);
      var src = data && data.state ? data.state : data;
      if (!src || !Array.isArray(src.tasks)) {
        return { ok: false, error: 'Struktur data tidak sah' };
      }
      var tasks = src.tasks.map(sanitizeTask).filter(Boolean);
      var cats = Array.isArray(src.categories)
        ? src.categories.map(function (c) { return String(c).trim(); }).filter(Boolean)
        : [];
      var state = {
        tasks: tasks,
        categories: cats,
        filter: src.filter === 'aktif' || src.filter === 'selesai' ? src.filter : 'semua',
        search: typeof src.search === 'string' ? src.search : '',
        categoryFilter: typeof src.categoryFilter === 'string' ? src.categoryFilter : '',
        sortMode: src.sortMode === 'priority' ? 'priority' : 'manual'
      };
      syncCategories(state);
      return { ok: true, state: state };
    } catch (e) {
      return { ok: false, error: String((e && e.message) || e) };
    }
  }

  function saveState(state, storage, key) {
    var st = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!st) return false;
    try {
      st.setItem(key || STORAGE_KEY, serialize(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadState(storage, key) {
    var st = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!st) return { ok: true, state: buildInitialState(), fromStorage: false };
    try {
      var raw = st.getItem(key || STORAGE_KEY);
      if (!raw) return { ok: true, state: buildInitialState(), fromStorage: false };
      var res = deserialize(raw);
      if (!res.ok) {
        return { ok: false, error: res.error, state: buildInitialState(), fromStorage: false };
      }
      return { ok: true, state: res.state, fromStorage: true };
    } catch (e) {
      return {
        ok: false,
        error: String((e && e.message) || e),
        state: buildInitialState(),
        fromStorage: false
      };
    }
  }

  // ---------------------------------------------------------------- statistik

  function computeStats(state, now) {
    var nowMs = now == null ? Date.now() : now;
    var total = state.tasks.length;
    var done = 0;
    var overdue = 0;
    var byCategory = {};
    state.tasks.forEach(function (t) {
      if (t.done) done++;
      var k = t.category || '(Tanpa Kategori)';
      if (!byCategory[k]) byCategory[k] = { total: 0, done: 0, overdue: 0 };
      byCategory[k].total++;
      if (t.done) byCategory[k].done++;
      if (isOverdue(t, nowMs)) {
        overdue++;
        byCategory[k].overdue++;
      }
    });
    var pct = total ? Math.round(done / total * 100) : 0;
    return {
      total: total,
      done: done,
      active: total - done,
      overdue: overdue,
      pct: pct,
      byCategory: byCategory
    };
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    PRIORITIES: PRIORITIES,
    PRIORITY_NAMES: PRIORITY_NAMES,
    PRIORITY_ORDER: PRIORITY_ORDER,
    uid: uid,
    normalizePriority: normalizePriority,
    buildInitialState: buildInitialState,
    createTask: createTask,
    addTask: addTask,
    getTask: getTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    toggleTask: toggleTask,
    moveTask: moveTask,
    applyVisibleReorder: applyVisibleReorder,
    syncCategories: syncCategories,
    parseDeadline: parseDeadline,
    isOverdue: isOverdue,
    friendlyDeadline: friendlyDeadline,
    searchMatch: searchMatch,
    getFilteredTasks: getFilteredTasks,
    parseTaskLine: parseTaskLine,
    importTasks: importTasks,
    exportTxt: exportTxt,
    exportJson: exportJson,
    serialize: serialize,
    deserialize: deserialize,
    saveState: saveState,
    loadState: loadState,
    computeStats: computeStats
  };
});