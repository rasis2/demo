/**
 * test/test-core.js — Ujian Node untuk logik teras Todo List (core.js).
 *
 * Jalan:  node test/test-core.js
 *
 * Tiada dependency luar — guna assert terbina dalam Node.
 * Liputan: tambah/edit/padam/toggle, filter, carian, keutamaan, kategori,
 * deadline & overdue, import parse (semua token), import tambah/ganti,
 * eksport TXT (round-trip), eksport JSON, serialize/deserialize +
 * localStorage palsu, susun semula, statistik.
 */
'use strict';

const assert = require('assert');
const core = require('../js/core.js');

// ---------------------------------------------------------------- helper

const results = { pass: 0, fail: 0, failures: [] };

function test(name, fn) {
  try {
    fn();
    results.pass++;
    console.log('  \u2713 ' + name);
  } catch (err) {
    results.fail++;
    results.failures.push({ name, err });
    console.log('  \u2717 ' + name + ' \u2192 ' + err.message);
  }
}

function freshState() {
  return core.buildInitialState();
}

// storage palsu (mensimulasikan localStorage)
function fakeStorage(initial) {
  const store = Object.assign({}, initial || {});
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    _store: store
  };
}

// ---------------------------------------------------------------- ujian

console.log('\nTodo List — ujian teras core.js\n');

test('buildInitialState menghasilkan struktur kosong yang sah', () => {
  const s = freshState();
  assert.deepStrictEqual(s.tasks, []);
  assert.deepStrictEqual(s.categories, []);
  assert.strictEqual(s.filter, 'semua');
  assert.strictEqual(s.sortMode, 'manual');
});

test('addTask menambah task & mengisi kategori', () => {
  const s = freshState();
  const t = core.addTask(s, { title: '  Beli susu  ', priority: 'tinggi', category: 'Rumah' });
  assert.strictEqual(s.tasks.length, 1);
  assert.strictEqual(t.title, 'Beli susu');
  assert.strictEqual(t.priority, 'tinggi');
  assert.strictEqual(t.done, false);
  assert.deepStrictEqual(s.categories, ['Rumah']);
  assert.ok(t.id);
});

test('addTask membuang tajuk kosong', () => {
  const s = freshState();
  assert.throws(() => core.addTask(s, { title: '   ' }));
  assert.strictEqual(s.tasks.length, 0);
});

test('updateTask mengedit tajuk, nota, keutamaan, kategori, deadline', () => {
  const s = freshState();
  const t = core.addTask(s, { title: 'Tajuk lama', priority: 'rendah', category: 'A' });
  core.updateTask(s, t.id, {
    title: 'Tajuk baru',
    note: 'nota test',
    priority: 'T', // alias tinggi
    category: 'B',
    deadline: '2026-09-10'
  });
  const got = core.getTask(s, t.id);
  assert.strictEqual(got.title, 'Tajuk baru');
  assert.strictEqual(got.note, 'nota test');
  assert.strictEqual(got.priority, 'tinggi');
  assert.strictEqual(got.category, 'B');
  assert.strictEqual(got.deadline, '2026-09-10');
  assert.deepStrictEqual(s.categories, ['A', 'B']); // kategori lama dikekalkan juga
});

test('updateTask gagal untuk ID tak wujud & tajuk kosong', () => {
  const s = freshState();
  const t = core.addTask(s, { title: 'x' });
  assert.throws(() => core.updateTask(s, 'none', { title: 'y' }));
  assert.throws(() => core.updateTask(s, t.id, { title: '  ' }));
});

test('deleteTask memadam task; kategori dikekalkan sebagai nilai pilihan', () => {
  const s = freshState();
  const a = core.addTask(s, { title: 'A', category: 'Rumah' });
  core.addTask(s, { title: 'B', category: 'Kerja' });
  assert.ok(core.deleteTask(s, a.id));
  assert.strictEqual(s.tasks.length, 1);
  // Kategori dikekalkan dalam senarai (nilai pilihan pengguna, bukan padam bersama task)
  assert.deepStrictEqual(s.categories.sort(), ['Kerja', 'Rumah']);
  assert.ok(!core.deleteTask(s, 'none'));
});

test('toggleTask menukar status siap', () => {
  const s = freshState();
  const t = core.addTask(s, { title: 'A' });
  assert.strictEqual(t.done, false);
  core.toggleTask(s, t.id);
  assert.strictEqual(core.getTask(s, t.id).done, true);
  core.toggleTask(s, t.id);
  assert.strictEqual(core.getTask(s, t.id).done, false);
  assert.strictEqual(core.toggleTask(s, 'none'), null);
});

test('normalizePriority menerima pelbagai alias', () => {
  assert.strictEqual(core.normalizePriority('tinggi'), 'tinggi');
  assert.strictEqual(core.normalizePriority('T'), 'tinggi');
  assert.strictEqual(core.normalizePriority('high'), 'tinggi');
  assert.strictEqual(core.normalizePriority('sederhana'), 'sederhana');
  assert.strictEqual(core.normalizePriority('s'), 'sederhana');
  assert.strictEqual(core.normalizePriority('medium'), 'sederhana');
  assert.strictEqual(core.normalizePriority('rendah'), 'rendah');
  assert.strictEqual(core.normalizePriority('low'), 'rendah');
  assert.strictEqual(core.normalizePriority('rawak'), 'rendah');
  assert.strictEqual(core.normalizePriority(undefined), 'rendah');
});

test('filter Semua / Aktif / Selesai', () => {
  const s = freshState();
  const a = core.addTask(s, { title: 'A' });
  const b = core.addTask(s, { title: 'B' });
  const c = core.addTask(s, { title: 'C' });
  core.toggleTask(s, b.id);
  core.toggleTask(s, c.id);
  assert.strictEqual(core.getFilteredTasks(s, { filter: 'semua' }).length, 3);
  assert.deepStrictEqual(core.getFilteredTasks(s, { filter: 'aktif' }).map(t => t.title), ['A']);
  assert.deepStrictEqual(core.getFilteredTasks(s, { filter: 'selesai' }).map(t => t.title), ['B', 'C']);
  // guna state.filter bila opts tak diberikan
  s.filter = 'aktif';
  assert.strictEqual(core.getFilteredTasks(s).length, 1);
});

test('carian teks menandingi tajuk DAN nota (multi-perkataan = AND)', () => {
  const s = freshState();
  core.addTask(s, { title: 'Beli susu', note: 'rendah lemak' });
  core.addTask(s, { title: 'Beli roti' });
  core.addTask(s, { title: 'Kerja', note: 'susu pekat' });
  assert.strictEqual(core.getFilteredTasks(s, { search: 'susu' }).length, 2);
  assert.strictEqual(core.getFilteredTasks(s, { search: 'susu lemak' }).length, 1);
  assert.strictEqual(core.getFilteredTasks(s, { search: 'roti' }).length, 1);
  assert.strictEqual(core.getFilteredTasks(s, { search: 'karipap' }).length, 0);
  // gabungan filter + carian
  assert.strictEqual(core.getFilteredTasks(s, { filter: 'aktif', search: 'susu' }).length, 2);
});

test('filter kategori', () => {
  const s = freshState();
  core.addTask(s, { title: 'A', category: 'Kerja' });
  core.addTask(s, { title: 'B', category: 'Rumah' });
  core.addTask(s, { title: 'C', category: 'Kerja' });
  assert.strictEqual(core.getFilteredTasks(s, { category: 'Kerja' }).length, 2);
  assert.strictEqual(core.getFilteredTasks(s, { category: 'Rumah' }).length, 1);
  assert.strictEqual(core.getFilteredTasks(s, { category: 'Tidak Ada' }).length, 0);
});

test('susun ikut keutamaan: tinggi dahulu, kemudian sederhana, kemudian rendah', () => {
  const s = freshState();
  core.addTask(s, { title: 'R', priority: 'rendah' });
  core.addTask(s, { title: 'T', priority: 'tinggi' });
  core.addTask(s, { title: 'S', priority: 'sederhana' });
  core.addTask(s, { title: 'T2', priority: 'tinggi' });
  const out = core.getFilteredTasks(s, { sort: 'priority' });
  assert.deepStrictEqual(out.map(t => t.title), ['T', 'T2', 'S', 'R']);
});

test('susun ikut keutamaan: terlewat dahulu & deadline terdekat dahulu', () => {
  const s = freshState();
  // sama keutamaan 'tinggi': satu terlewat, satu esok
  const now = new Date(2026, 8, 5, 8, 0, 0).getTime(); // 5 Sep 2026 08:00
  const lewat = core.addTask(s, { title: 'Lebih awal deadline', priority: 'tinggi', deadline: '2026-09-01' });
  const esok = core.addTask(s, { title: 'Deadline esok', priority: 'tinggi', deadline: '2026-09-06' });
  const out = core.getFilteredTasks(s, { sort: 'priority' }, now);
  assert.strictEqual(out[0].id, lewat.id);
  assert.strictEqual(out[1].id, esok.id);
});

test('isOverdue: tarikh sahaja = terlewat selepas hujung hari', () => {
  const nowMorning = new Date(2026, 8, 5, 8, 0, 0).getTime(); // 5 Sep 08:00
  const nowNight = new Date(2026, 8, 5, 23, 59, 0).getTime(); // 5 Sep 23:59
  const t1 = { done: false, deadline: '2026-09-04' }; // semalam → terlewat
  const t2 = { done: false, deadline: '2026-09-05' }; // hari ini, tanpa masa → belum
  const t3 = { done: false, deadline: '2026-09-05T07:00' }; // sudah lewat pagi ini (sekarang 08:00)
  const t4 = { done: false, deadline: '2026-09-05T20:00' }; // petang ini → belum
  const t5 = { done: true, deadline: '2026-09-01' }; // siap → tidak terlewat
  const t6 = { done: false, deadline: '' };
  assert.strictEqual(core.isOverdue(t1, nowMorning), true);
  assert.strictEqual(core.isOverdue(t2, nowNight), false);
  assert.strictEqual(core.isOverdue(t3, nowMorning), true);
  assert.strictEqual(core.isOverdue(t4, nowMorning), false);
  assert.strictEqual(core.isOverdue(t5, nowMorning), false);
  assert.strictEqual(core.isOverdue(t6, nowMorning), false);
});

test('parseDeadline & friendlyDeadline (Melayu)', () => {
  const p = core.parseDeadline('2026-09-10T14:30');
  assert.ok(p && p.hasTime);
  assert.strictEqual(new Date(p.ms).getHours(), 14);
  const d = core.parseDeadline('2026-09-10');
  assert.ok(d && !d.hasTime);
  const now = new Date(2026, 8, 5, 8, 0, 0).getTime();
  assert.strictEqual(core.friendlyDeadline('2026-09-05', now), 'Hari ini');
  assert.strictEqual(core.friendlyDeadline('2026-09-06', now), 'Esok');
  assert.strictEqual(core.friendlyDeadline('2026-09-04', now), 'Semalam');
  assert.strictEqual(core.friendlyDeadline('2026-09-05T14:30', now), 'Hari ini, 14:30');
  assert.strictEqual(core.friendlyDeadline('2026-12-25', now), '25 Dis 2026');
  assert.strictEqual(core.friendlyDeadline('garbage', now), '');
  assert.strictEqual(core.friendlyDeadline('', now), '');
});

// ---------------------------------------------------------------- import

test('import parse: satu baris penuh dengan semua token', () => {
  const t = core.parseTaskLine('[x] [Tinggi] Beli susu #Rumah @2026-09-10 | nota rendah lemak');
  assert.deepStrictEqual(t, {
    title: 'Beli susu',
    note: 'nota rendah lemak',
    done: true,
    priority: 'tinggi',
    category: 'Rumah',
    deadline: '2026-09-10'
  });
});

test('import parse: tanpa token tambahan', () => {
  const t = core.parseTaskLine('Beli roti');
  assert.strictEqual(t.title, 'Beli roti');
  assert.strictEqual(t.done, false);
  assert.strictEqual(t.priority, 'rendah'); // default
  assert.strictEqual(t.category, '');
  assert.strictEqual(t.deadline, '');
});

test('import parse: pelbagai alias & kes campur huruf', () => {
  assert.strictEqual(core.parseTaskLine('[S] Tajuk').priority, 'sederhana');
  assert.strictEqual(core.parseTaskLine('[T] Tajuk').priority, 'tinggi');
  assert.strictEqual(core.parseTaskLine('[r] Tajuk').priority, 'rendah');
  assert.strictEqual(core.parseTaskLine('[X] Tajuk').done, true);
  assert.strictEqual(core.parseTaskLine('[ ] Tajuk').done, false);
  assert.strictEqual(core.parseTaskLine('[high] Tajuk').priority, 'tinggi');
  const t = core.parseTaskLine('tajuk @2026-09-10T14:30 #Kerja [S]');
  assert.strictEqual(t.title, 'tajuk');
  assert.strictEqual(t.priority, 'sederhana');
  assert.strictEqual(t.category, 'Kerja');
  assert.strictEqual(t.deadline, '2026-09-10T14:30');
});

test('import parse: baris kosong / komen / tak sah → null', () => {
  assert.strictEqual(core.parseTaskLine(''), null);
  assert.strictEqual(core.parseTaskLine('   '), null);
  assert.strictEqual(core.parseTaskLine('// ulasan'), null);
  assert.strictEqual(core.parseTaskLine('-- ulasan juga'), null);
  assert.strictEqual(core.parseTaskLine('[Tinggi]'), null); // tiada tajuk
  assert.strictEqual(core.parseTaskLine('#tag'), null); // tiada tajuk
  assert.strictEqual(core.parseTaskLine('@2026-09-10'), null); // tiada tajuk
});

test('importTasks: mode tambah (default) mengekalkan senarai sedia ada', () => {
  const s = freshState();
  core.addTask(s, { title: 'Sedia ada' });
  const text = '[Tinggi] Laporan #Kerja @2026-09-10\n' +
               'Beli susu | nota\n' +
               '[x] [Rendah] Siap dah\n' +
               '\n' +
               '// komen\n' +
               '[tinggi]\n';
  const res = core.importTasks(s, text, 'add');
  assert.strictEqual(res.added, 3);
  assert.strictEqual(res.skipped, 1); // "[tinggi]" tanpa tajuk — tidak sah
  assert.strictEqual(s.tasks.length, 4);
  const laporan = s.tasks.find(t => t.title === 'Laporan');
  assert.strictEqual(laporan.priority, 'tinggi');
  assert.strictEqual(laporan.category, 'Kerja');
  assert.strictEqual(laporan.deadline, '2026-09-10');
  const siap = s.tasks.find(t => t.title === 'Siap dah');
  assert.strictEqual(siap.done, true);
  const nota = s.tasks.find(t => t.title === 'Beli susu');
  assert.strictEqual(nota.note, 'nota');
});

test('importTasks: mode ganti menggantikan semua task', () => {
  const s = freshState();
  core.addTask(s, { title: 'Lama' });
  core.addTask(s, { title: 'Lama 2' });
  const text = 'Task baru 1\nTask baru 2\nTask baru 3\n';
  const res = core.importTasks(s, text, 'replace');
  assert.strictEqual(res.added, 3);
  assert.strictEqual(s.tasks.length, 3);
  assert.deepStrictEqual(s.tasks.map(t => t.title), ['Task baru 1', 'Task baru 2', 'Task baru 3']);
});

test("importTasks: mod 'add' tanpa parameter mode = tambah", () => {
  const s = freshState();
  core.addTask(s, { title: 'X' });
  const res = core.importTasks(s, 'Y\nZ\n');
  assert.strictEqual(res.mode, 'add');
  assert.strictEqual(s.tasks.length, 3);
});

// ---------------------------------------------------------------- eksport

test('eksport TXT: satu baris satu task dengan format import semula', () => {
  const s = freshState();
  core.addTask(s, { title: 'Beli susu', done: true, priority: 'tinggi', category: 'Rumah', deadline: '2026-09-10', note: 'kurang lemak' });
  const txt = core.exportTxt(s);
  const first = txt.trim().split('\n')[0];
  assert.strictEqual(first, '[x] [Tinggi] Beli susu #Rumah @2026-09-10 | kurang lemak');
});

test('eksport TXT → import semula = round-trip tepat', () => {
  const s = freshState();
  core.addTask(s, { title: 'A', priority: 'sederhana', category: 'Kerja', deadline: '2026-09-15T09:30', note: 'n1' });
  core.addTask(s, { title: 'B', done: true, priority: 'tinggi' });
  core.addTask(s, { title: 'C', category: 'Personal' });
  const txt = core.exportTxt(s);

  const s2 = freshState();
  const res = core.importTasks(s2, txt, 'add');
  assert.strictEqual(res.added, 3);

  const strip = (t) => ({
    title: t.title, note: t.note, done: t.done,
    priority: t.priority, category: t.category, deadline: t.deadline
  });
  const orig = s.tasks.map(strip).sort((a, b) => a.title.localeCompare(b.title));
  const back = s2.tasks.map(strip).sort((a, b) => a.title.localeCompare(b.title));
  assert.deepStrictEqual(back, orig);
});

test('eksport TXT: senarai kosong → rentetan kosong', () => {
  assert.strictEqual(core.exportTxt(freshState()), '');
});

test('eksport JSON: struktur penuh & boleh deserialize semula', () => {
  const s = freshState();
  core.addTask(s, { title: 'A', priority: 'tinggi', category: 'Kerja', deadline: '2026-09-10' });
  const json = core.exportJson(s);
  const parsed = JSON.parse(json);
  assert.ok(Array.isArray(parsed.tasks));
  assert.strictEqual(parsed.tasks[0].title, 'A');
  const back = core.deserialize(json);
  assert.ok(back.ok);
  assert.strictEqual(back.state.tasks.length, 1);
  assert.strictEqual(back.state.tasks[0].priority, 'tinggi');
});

// ---------------------------------------------------------------- simpanan

test('serialize + deserialize = bulat (round-trip)', () => {
  const s = freshState();
  s.filter = 'aktif';
  s.categoryFilter = 'Kerja';
  core.addTask(s, { title: 'A', priority: 'sederhana', category: 'Kerja', note: 'nota' });
  const stored = core.serialize(s);
  const res = core.deserialize(stored);
  assert.ok(res.ok);
  assert.strictEqual(res.state.tasks.length, 1);
  assert.strictEqual(res.state.tasks[0].note, 'nota');
  assert.strictEqual(res.state.filter, 'aktif');
  assert.strictEqual(res.state.categoryFilter, 'Kerja');
  assert.deepStrictEqual(res.state.categories, ['Kerja']);
});

test('loadState: tiada data → state kosong; saveState → loadState pulihkan', () => {
  const st = fakeStorage();
  const empty = core.loadState(st);
  assert.ok(empty.ok);
  assert.strictEqual(empty.state.tasks.length, 0);
  assert.strictEqual(empty.fromStorage, false);

  const s = freshState();
  core.addTask(s, { title: 'Simpan saya', priority: 'tinggi', category: 'Rumah' });
  assert.ok(core.saveState(s, st));
  const loaded = core.loadState(st);
  assert.ok(loaded.ok);
  assert.strictEqual(loaded.fromStorage, true);
  assert.strictEqual(loaded.state.tasks.length, 1);
  assert.strictEqual(loaded.state.tasks[0].title, 'Simpan saya');
});

test('loadState: data rosak → tak crash, kembali state kosong & dilaporkan', () => {
  const st = fakeStorage({ 'todoListData:v1': '{broken json' });
  const res = core.loadState(st);
  assert.ok(!res.ok);
  assert.ok(res.error);
  assert.deepStrictEqual(res.state.tasks, []);
});

test('deserialize: data yang bukan struktur tasks → ditolak', () => {
  const r1 = core.deserialize('{"foo":1}');
  assert.ok(!r1.ok);
  const r2 = core.deserialize('not json at all');
  assert.ok(!r2.ok);
});

test('deserialize: task tak sah disaring (tiada tajuk dibuang)', () => {
  const json = JSON.stringify({
    tasks: [
      { id: '1', title: 'Sah', priority: 'tinggi' },
      { id: '2', title: '   ' },
      { id: '3', title: 'Juga sah', priority: 'rawak', done: true }
    ]
  });
  const res = core.deserialize(json);
  assert.ok(res.ok);
  assert.strictEqual(res.state.tasks.length, 2);
  assert.strictEqual(res.state.tasks[1].priority, 'rendah'); // 'rawak' → default
});

// ---------------------------------------------------------------- susun semula

test('moveTask memindah task dalam senarai penuh', () => {
  const s = freshState();
  const a = core.addTask(s, { title: 'A' });
  core.addTask(s, { title: 'B' });
  const c = core.addTask(s, { title: 'C' });
  assert.ok(core.moveTask(s, c.id, 0));
  assert.deepStrictEqual(s.tasks.map(t => t.title), ['C', 'A', 'B']);
  assert.ok(core.moveTask(s, a.id, 99)); // clamp ke hujung
  assert.deepStrictEqual(s.tasks.map(t => t.title), ['C', 'B', 'A']);
});

test('applyVisibleReorder: urutan semula kekal selepas filter kategori', () => {
  const s = freshState();
  const a = core.addTask(s, { title: 'A', category: 'Kerja' });
  const b = core.addTask(s, { title: 'B', category: 'Rumah' });
  const c = core.addTask(s, { title: 'C', category: 'Kerja' });
  core.addTask(s, { title: 'D', category: 'Rumah' });
  // Kelihatan (Kerja): A, C — tukar jadi C, A
  const visible = core.getFilteredTasks(s, { category: 'Kerja' }).map(t => t.id);
  assert.deepStrictEqual(visible, [a.id, c.id]);
  core.applyVisibleReorder(s, visible, 0, 1);
  const findIdx = (id) => s.tasks.findIndex(t => t.id === id);
  assert.ok(findIdx(c.id) < findIdx(a.id));
  assert.strictEqual(s.tasks.length, 4);
});

// ---------------------------------------------------------------- statistik

test('computeStats: jumlah, siap, aktif, peratus & per kategori', () => {
  const s = freshState();
  const a = core.addTask(s, { title: 'A', category: 'Kerja' });
  const b = core.addTask(s, { title: 'B', category: 'Kerja' });
  const c = core.addTask(s, { title: 'C', category: 'Rumah' });
  const d = core.addTask(s, { title: 'D' });
  core.toggleTask(s, a.id);
  core.toggleTask(s, c.id);
  const st = core.computeStats(s);
  assert.strictEqual(st.total, 4);
  assert.strictEqual(st.done, 2);
  assert.strictEqual(st.active, 2);
  assert.strictEqual(st.pct, 50);
  assert.strictEqual(st.byCategory.Kerja.total, 2);
  assert.strictEqual(st.byCategory.Kerja.done, 1);
  assert.strictEqual(st.byCategory['(Tanpa Kategori)'].total, 1);
  assert.strictEqual(st.byCategory['(Tanpa Kategori)'].done, 0);
  void d;
});

test('computeStats: sifar task → peratus 0 tanpa ralat', () => {
  const st = core.computeStats(freshState());
  assert.strictEqual(st.total, 0);
  assert.strictEqual(st.pct, 0);
  assert.deepStrictEqual(st.byCategory, {});
});

test('computeStats: mengira overdue per kategori', () => {
  const s = freshState();
  const now = new Date(2026, 8, 5, 8, 0, 0).getTime();
  core.addTask(s, { title: 'A', category: 'Kerja', deadline: '2026-09-01' }); // terlewat
  core.addTask(s, { title: 'B', category: 'Kerja', deadline: '2026-09-10' }); // selamat
  const st = core.computeStats(s, now);
  assert.strictEqual(st.overdue, 1);
  assert.strictEqual(st.byCategory.Kerja.overdue, 1);
});

// ---------------------------------------------------------------- ringkasan

console.log('\n\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014');
console.log('Keputusan: ' + results.pass + ' lulus, ' + results.fail + ' gagal dari ' + (results.pass + results.fail) + ' ujian');

if (results.fail) {
  console.log('\nGagal:');
  results.failures.forEach(function (f) {
    console.log('  \u2717 ' + f.name);
    console.log('    ' + (f.err && f.err.stack ? f.err.stack.split('\n').slice(0, 3).join('\n    ') : f.err));
  });
  process.exit(1);
}
process.exit(0);