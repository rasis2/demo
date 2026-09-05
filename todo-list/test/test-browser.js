/**
 * test/test-browser.js — Ujian browser penuh (headless Edge via CDP).
 *
 * Jalan:  node test/test-browser.js
 *
 * Uji aplikasi sebenar (index.html) dalam pelayar sebenar:
 * smoke boot, tambah/edit/padam/toggle via UI, filter, carian, keutamaan,
 * kategori, deadline/overdue, import (modal tambah & ganti), eksport,
 * localStorage (persist selepas reload), tema, drag & drop, responsif,
 * serta harness test/test-harness.html.
 *
 * Guna CDP (Chrome DevTools Protocol) melalui WebSocket terbina Node 22 —
 * TIADA dependency luar.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

const APP_URL = 'file:///C:/Users/Rasis/Documents/GitHub/demo/todo-list/index.html';
const HARNESS_URL = 'file:///C:/Users/Rasis/Documents/GitHub/demo/todo-list/test/test-harness.html';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findEdge() {
  for (const p of EDGE_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Microsoft Edge tidak dijumpai');
}

// ------------------------------------------------------------ CDP client

let ws = null;
let msgId = 0;
const pending = new Map();
const browserConsoleErrors = [];

function send(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result)));
    ws.send(JSON.stringify({ id, method, params: params || {} }));
  });
}

function onWsMessage(raw) {
  const m = JSON.parse(raw.data);
  if (m.id && pending.has(m.id)) {
    const cb = pending.get(m.id);
    pending.delete(m.id);
    cb(m);
    return;
  }
  if (m.method === 'Runtime.consoleAPICalled') {
    const t = m.params.type;
    if (t === 'error' || t === 'warning') {
      browserConsoleErrors.push(
        'console.' + t + ': ' + m.params.args.map((a) => a.value || a.description || '').join(' ')
      );
    }
  }
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails || {};
    browserConsoleErrors.push('exception: ' + (d.text || '') + ' ' + JSON.stringify(d.exception || {}));
  }
}

async function evaluate(expression, awaitPromise) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: !!awaitPromise });
  if (r.exceptionDetails) {
    const ex = r.exceptionDetails.exception;
    throw new Error('evaluate gagal: ' + (ex ? ex.description : r.exceptionDetails.text));
  }
  return r.result ? r.result.value : undefined;
}

async function waitFor(expression, timeout, interval) {
  const start = Date.now();
  const limit = timeout || 8000;
  for (;;) {
    try {
      const v = await evaluate(expression);
      if (v) return v;
    } catch (e) { /* cuba lagi */ }
    if (Date.now() - start > limit) throw new Error('timeout menunggu: ' + expression);
    await sleep(interval || 100);
  }
}

async function reloadAndWaitBoot() {
  await send('Page.reload', { ignoreCache: true });
  await waitFor("document.readyState === 'complete'");
  await waitFor("window.__todoSmoke && window.__todoSmoke.booted === true");
}

// ------------------------------------------------------------ hasil ujian

const results = { pass: 0, fail: 0, failures: [] };

async function test(name, fn) {
  try {
    await fn();
    results.pass++;
    console.log('  \u2713 ' + name);
  } catch (e) {
    results.fail++;
    results.failures.push({ name: name, err: e });
    console.log('  \u2717 ' + name + ' \u2192 ' + e.message);
  }
}

function countItems() {
  return evaluate("document.querySelectorAll('.task-item').length");
}

function itemTitles() {
  return evaluate("[...document.querySelectorAll('.task-title')].map(e=>e.textContent)");
}

function click(selector) {
  return evaluate(
    '(function(){var el=document.querySelector(' + JSON.stringify(selector) + ');if(!el)return false;el.click();return true;})()'
  ).then((ok) => assert.ok(ok, 'elemen tidak wujud: ' + selector));
}

async function setInput(selector, value, eventName) {
  const ok = await evaluate(
    '(function(){var el=document.querySelector(' + JSON.stringify(selector) + ');if(!el)return false;' +
      'el.value=' + JSON.stringify(value) + ';' +
      'el.dispatchEvent(new Event(' + JSON.stringify(eventName || 'input') + ',{bubbles:true}));' +
      'return true;})()'
  );
  assert.ok(ok, 'input tidak wujud: ' + selector);
}

async function modalVisible(id) {
  return evaluate("!document.getElementById('" + id + "').classList.contains('hidden')");
}

async function addTaskViaUi(opt) {
  await click('#btnAdd');
  await waitFor("!document.getElementById('modalTask').classList.contains('hidden')");
  await setInput('#fTitle', opt.title);
  await setInput('#fNote', opt.note || '');
  await setInput('#fPriority', opt.priority || 'rendah', 'change');
  await setInput('#fCategory', opt.category || '');
  if (opt.date) await setInput('#fDate', opt.date);
  if (opt.time) await setInput('#fTime', opt.time);
  await click('#btnTaskSave');
  await waitFor("document.getElementById('modalTask').classList.contains('hidden')");
}

// ------------------------------------------------------------ skrip utama

console.log('\nTodo List — ujian browser penuh (headless Edge via CDP)\n');

async function main() {
  const edge = findEdge();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-cdp-'));
  const devtoolsPortFile = path.join(userDataDir, 'DevToolsActivePort');

  const proc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    '--user-data-dir=' + userDataDir,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  proc.stderr.on('data', () => { /* bunyi headless biasa — tidak digendala */ });

  try {
    // Baca port debugging daripada fail DevToolsActivePort
    let port = 0;
    for (let i = 0; i < 80 && !port; i++) {
      try {
        const content = fs.readFileSync(devtoolsPortFile, 'utf8');
        port = parseInt(content.split('\n')[0], 10);
      } catch (e) { /* belum wujud */ }
      if (!port) await sleep(250);
    }
    if (!port) throw new Error('Port DevTools tidak dapat dibaca');

    // Cipta tab baru
    let target;
    try {
      const res = await fetch('http://127.0.0.1:' + port + '/json/new?about:blank', { method: 'PUT' });
      target = await res.json();
    } catch (e) {
      const res = await fetch('http://127.0.0.1:' + port + '/json/new?about:blank');
      target = await res.json();
    }
    if (!target.webSocketDebuggerUrl) throw new Error('Tiada webSocketDebuggerUrl');

    // Sambung WebSocket
    ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onmessage = onWsMessage;
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = () => reject(new Error('Gagal sambung WS CDP'));
    });
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    // ---------------------------------------------------------- UJIAN

    await test('Buka aplikasi & navigasi ke URL', async () => {
      await send('Page.navigate', { url: APP_URL });
      await waitFor("document.readyState === 'complete'");
    });

    await test('Smoke: aplikasi boot tanpa error JS', async () => {
      // Mulakan dengan data bersih
      await evaluate('localStorage.clear(); true');
      await reloadAndWaitBoot();
      const smoke = await evaluate('window.__todoSmoke');
      assert.ok(smoke, '__todoSmoke tidak wujud');
      assert.strictEqual(smoke.booted, true, 'belum boot');
      assert.ok(!smoke.errors.length, 'terdapat error: ' + JSON.stringify(smoke.errors));
      const smokeText = await evaluate("document.getElementById('smoke').textContent");
      assert.ok(/SMOKE.*"booted":true/.test(smokeText), 'penanda smoke tidak dirender: ' + smokeText);
    });

    await test('Tambah task #1 via UI (dengan semua medan)', async () => {
      await addTaskViaUi({
        title: 'Belajar JavaScript',
        note: 'bab 5 closures',
        priority: 'tinggi',
        category: 'Kerja',
        date: '2026-09-10',
        time: '14:30'
      });
      assert.strictEqual(await countItems(), 1);
      const titles = await itemTitles();
      assert.deepStrictEqual(titles, ['Belajar JavaScript']);
      const li = await evaluate(
        "(function(){var el=document.querySelector('.task-item');return {cls:el.className, prio:el.querySelector('.prio').textContent, cat:el.querySelector('.cat-badge').textContent, dl:el.querySelector('.dl-badge')?el.querySelector('.dl-badge').textContent:null};})()"
      );
      assert.ok(li.cls.includes('prio-tinggi'), 'kelas keutamaan');
      assert.strictEqual(li.prio, 'Tinggi');
      assert.strictEqual(li.cat, '#Kerja');
      assert.strictEqual(li.dl, '10 Sep 2026, 14:30');
    });

    await test('Tambah task #2 via UI (minimum) & statistik', async () => {
      await addTaskViaUi({ title: 'Beli susu', priority: 'rendah', category: 'Rumah' });
      assert.strictEqual(await countItems(), 2);
      const pct = await evaluate("document.getElementById('pctText').textContent");
      assert.strictEqual(pct, '0/2 selesai (0%)');
      const tabs = await evaluate("document.getElementById('tab-aktif').textContent");
      assert.ok(tabs.includes('(2)'), 'tab aktif: ' + tabs);
    });

    await test('Togol siap → statistik & kelas done', async () => {
      await evaluate("document.querySelector('.task-item .task-check').click(); true");
      assert.strictEqual(await countItems(), 2);
      const pct = await evaluate("document.getElementById('pctText').textContent");
      assert.strictEqual(pct, '1/2 selesai (50%)');
      const firstDone = await evaluate("document.querySelector('.task-item').classList.contains('done')");
      assert.ok(firstDone, 'task pertama tiada kelas done');
      const tabAktif = await evaluate("document.getElementById('tab-aktif').textContent");
      const tabSelesai = await evaluate("document.getElementById('tab-selesai').textContent");
      assert.ok(tabAktif.includes('(1)'), 'aktif: ' + tabAktif);
      assert.ok(tabSelesai.includes('(1)'), 'selesai: ' + tabSelesai);
    });

    await test('Filter: Aktif & Selesai', async () => {
      await click('#tab-aktif');
      assert.deepStrictEqual(await itemTitles(), ['Beli susu']);
      await click('#tab-selesai');
      assert.deepStrictEqual(await itemTitles(), ['Belajar JavaScript']);
      await click('#tab-semua');
      assert.strictEqual(await countItems(), 2);
    });

    await test('Carian tajuk & nota', async () => {
      await setInput('#searchInput', 'closures');
      assert.deepStrictEqual(await itemTitles(), ['Belajar JavaScript']);
      await setInput('#searchInput', 'susu');
      assert.deepStrictEqual(await itemTitles(), ['Beli susu']);
      await setInput('#searchInput', '');
      assert.strictEqual(await countItems(), 2);
    });

    await test('Edit task via UI (tukar tajuk & keutamaan)', async () => {
      await evaluate("document.querySelector('.task-item .btn-edit').click(); true");
      await waitFor("!document.getElementById('modalTask').classList.contains('hidden')");
      const title = await evaluate("document.getElementById('taskModalTitle').textContent");
      assert.strictEqual(title, 'Edit Task');
      await setInput('#fTitle', 'Belajar JavaScript (disemak)');
      await setInput('#fPriority', 'sederhana', 'change');
      await click('#btnTaskSave');
      await waitFor("document.getElementById('modalTask').classList.contains('hidden')");
      const titles = await itemTitles();
      assert.ok(titles.includes('Belajar JavaScript (disemak)'), 'tajuk tak dikemas kini');
      const li = await evaluate(
        "(function(){var items=[...document.querySelectorAll('.task-item')];var el=items.find(i=>i.querySelector('.task-title').textContent==='Belajar JavaScript (disemak)');return el?el.classList.contains('prio-sederhana'):false;})()"
      );
      assert.ok(li, 'keutamaan tidak dikemas kini');
    });

    await test('Overdue: task dengan deadline semalam ditanda "Terlewat"', async () => {
      const iso = await evaluate(
        '(function(){var d=new Date(Date.now()-86400000*2);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})()'
      );
      await evaluate(
        'TodoApp.addTask({title:"Laporan lewat", priority:"tinggi", category:"Kerja", deadline:' + JSON.stringify(iso) + '}); true'
      );
      assert.strictEqual(await countItems(), 3);
      const overdueInfo = await evaluate(
        "(function(){var el=[...document.querySelectorAll('.task-item')].find(i=>i.querySelector('.task-title').textContent==='Laporan lewat');return el?{overdue:el.classList.contains('overdue'),badge:el.querySelector('.overdue-badge')?el.querySelector('.overdue-badge').textContent:null}:null;})()"
      );
      assert.ok(overdueInfo, 'task lewat tidak dijumpai');
      assert.ok(overdueInfo.overdue, 'tiada kelas overdue');
      assert.strictEqual(overdueInfo.badge, 'Terlewat');
      const overdueText = await evaluate("document.getElementById('overdueText').textContent");
      assert.ok(overdueText.includes('1 task terlewat'), 'teks ringkasan: ' + overdueText);
    });

    await test('Susun ikut prioriti: tinggi dahulu', async () => {
      await setInput('#sortSel', 'priority', 'change');
      const titles = await itemTitles();
      assert.strictEqual(titles[0], 'Laporan lewat'); // tinggi
      assert.strictEqual(titles[1], 'Belajar JavaScript (disemak)'); // sederhana
      assert.strictEqual(titles[2], 'Beli susu'); // rendah
      await setInput('#sortSel', 'manual', 'change');
    });

    await test('Tema: toggle gelap ↔ terang', async () => {
      assert.strictEqual(await evaluate("document.documentElement.getAttribute('data-theme')"), 'dark');
      await click('#btnTheme');
      assert.strictEqual(await evaluate("document.documentElement.getAttribute('data-theme')"), 'light');
      await click('#btnTheme');
      assert.strictEqual(await evaluate("document.documentElement.getAttribute('data-theme')"), 'dark');
    });

    await test('Import via modal (mod tambah) — token penuh & komen', async () => {
      await click('#btnImport');
      await waitFor("!document.getElementById('modalImport').classList.contains('hidden')");
      const importText = [
        '[Tinggi] Siapkan laporan #Kerja @2026-09-10',
        '[x] [Rendah] Beli vitamin #Personal',
        'Beli hadiah | jangan lupa bungkus',
        '',
        '// baris komen ini diabaikan',
        '[S] '
      ].join('\n');
      await setInput('#impText', importText);
      await click('#btnImportGo');
      await waitFor("document.getElementById('impResult').textContent.length > 0");
      const res = await evaluate("document.getElementById('impResult').textContent");
      assert.ok(res.includes('3 task ditambah'), 'hasil import: ' + res);
      const state = await evaluate('TodoApp.getState()');
      assert.strictEqual(state.tasks.length, 6); // 3 sedia ada + 3 import
      assert.ok(state.categories.includes('Personal'), 'kategori baru tidak ditambah');
      // tutup modal
      await evaluate("document.getElementById('btnImportCancel').click(); true");
    });

    await test('Import (mod ganti) meminta pengesahan & mengganti semua', async () => {
      await click('#btnImport');
      await waitFor("!document.getElementById('modalImport').classList.contains('hidden')");
      await setInput('#impText', 'Task ganti 1\nTask ganti 2\n');
      await evaluate("document.getElementById('impModeReplace').click(); true");
      await click('#btnImportGo');
      await waitFor("!document.getElementById('modalConfirm').classList.contains('hidden')");
      const cfTitle = await evaluate("document.getElementById('cfTitle').textContent");
      assert.ok(cfTitle.includes('Ganti'), 'tajuk confirm: ' + cfTitle);
      await click('#btnConfirmYes');
      await sleep(150);
      const state = await evaluate('TodoApp.getState()');
      assert.deepStrictEqual(state.tasks.map(t => t.title), ['Task ganti 1', 'Task ganti 2']);
    });

    await test('Eksport TXT & JSON (API + pratonton format)', async () => {
      const txt = await evaluate('TodoApp.exportTxt()');
      const lines = txt.trim().split('\n');
      assert.strictEqual(lines.length, 2);
      assert.strictEqual(lines[0], '[ ] [Rendah] Task ganti 1');
      const json = await evaluate('TodoApp.exportJson()');
      const parsed = JSON.parse(json);
      assert.strictEqual(parsed.tasks.length, 2);
      // Butang eksport sebenar tidak boleh pukul throw
      await click('#btnExportTxt');
      await click('#btnExportJson');
      await sleep(100);
    });

    await test('localStorage: data kekal selepas reload', async () => {
      const before = await evaluate('TodoApp.getState().tasks.length');
      assert.ok(before >= 2, 'tidak ada data sebelum reload');
      await reloadAndWaitBoot();
      const after = await evaluate('TodoApp.getState().tasks.length');
      assert.strictEqual(after, before, 'data hilang selepas reload');
      const titles = await itemTitles();
      assert.deepStrictEqual(titles, ['Task ganti 1', 'Task ganti 2']);
    });

    await test('Padam task dengan pengesahan', async () => {
      await evaluate("document.querySelector('.task-item .btn-del').click(); true");
      await waitFor("!document.getElementById('modalConfirm').classList.contains('hidden')");
      const msg = await evaluate("document.getElementById('cfMsg').textContent");
      assert.ok(msg.includes('Task ganti 1'), 'mesej confirm: ' + msg);
      await click('#btnConfirmYes');
      await sleep(150);
      assert.deepStrictEqual(await itemTitles(), ['Task ganti 2']);
    });

    await test('Drag & drop: seret task pertama ke bawah', async () => {
      // Pastikan mod susunan = manual (drag hanya aktif dalam mod manual)
      await setInput('#sortSel', 'manual', 'change');
      // Selepas padam, tinggal 1 task ('Task ganti 2'); tambah satu lagi = 2 item
      await evaluate('TodoApp.addTask({title:"Item 3", priority:"rendah"}) ; true');
      assert.strictEqual(await countItems(), 2);
      const before = await itemTitles();
      assert.deepStrictEqual(before, ['Task ganti 2', 'Item 3']);
      const title0 = before[0];
      // Seret item pertama ke kedudukan terakhir
      await evaluate(
        '(function(){' +
        'var list=document.getElementById("taskList");' +
        'var handle=document.querySelector(".drag-handle");' +
        'var items=[...list.querySelectorAll(".task-item")];' +
        'var hrect=handle.getBoundingClientRect();' +
        'var firstRect=items[0].getBoundingClientRect();' +
        'var sx=hrect.left+hrect.width/2, sy=hrect.top+hrect.height/2;' +
        'var ey=sy + firstRect.height * 2.0;' + // jauh ke bawah item terakhir
        'handle.dispatchEvent(new PointerEvent("pointerdown",{clientX:sx,clientY:sy,pointerId:7,bubbles:true,cancelable:true}));' +
        'for(var y=sy+28;y<=ey;y+=28){list.dispatchEvent(new PointerEvent("pointermove",{clientX:sx,clientY:y,pointerId:7,bubbles:true,cancelable:true}));}' +
        'list.dispatchEvent(new PointerEvent("pointerup",{clientX:sx,clientY:ey,pointerId:7,bubbles:true,cancelable:true}));' +
        'return true;})()'
      );
      const after = await itemTitles();
      assert.deepStrictEqual(after, ['Item 3', 'Task ganti 2'], 'susunan selepas seret: ' + after.join(' | '));
      // Pastikan urutan tersimpan dalam state
      const state = await evaluate("TodoApp.getState().tasks.map(t=>t.title)");
      assert.deepStrictEqual(state, after, 'state tidak sepadan dengan paparan');
    });

    async function setViewport(w, h) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: w, height: h, deviceScaleFactor: 1, mobile: true
      });
      await sleep(150);
    }

    await test('Responsif 375px: tiada overflow & komponen kemas', async () => {
      await setViewport(375, 667);
      const overflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
      assert.ok(overflow <= 1, 'limpahan mendatar ' + overflow + 'px');
      const audit = await evaluate(
        '(function(){' +
        'var iw = window.innerWidth;' +
        'var r = {};' +
        'r.taskItemsOverflow = [...document.querySelectorAll(".task-item")].filter(function(el){var b=el.getBoundingClientRect();return b.right>iw+1 || b.left < -1;}).length;' +
        'var tb = document.querySelector(".toolbar").getBoundingClientRect();' +
        'var sr = document.querySelector(".select-row").getBoundingClientRect();' +
        'var tabs = document.querySelector(".tabs").getBoundingClientRect();' +
        'r.toolbarInside = sr.right <= tb.right + 1 && sr.left >= tb.left - 1;' +
        'r.tabsInside = tabs.right <= tb.right + 1 && tabs.left >= tb.left - 1;' +
        'var stats = document.querySelector(".stats");' +
        'r.statsOverflow = stats.scrollWidth - stats.clientWidth;' +
        'r.tabsOverflow = document.querySelector(".tabs").scrollWidth - document.querySelector(".tabs").clientWidth;' +
        'r.addHeight = document.getElementById("btnAdd").getBoundingClientRect().height;' +
        'r.searchHeight = document.getElementById("searchInput").getBoundingClientRect().height;' +
        'var ta = document.querySelector(".top-actions").getBoundingClientRect();' +
        'var topbar = document.querySelector(".topbar").getBoundingClientRect();' +
        'r.topActionsInside = ta.right <= topbar.right + 1 && ta.left >= topbar.left - 1;' +
        'return r;})()'
      );
      assert.strictEqual(audit.taskItemsOverflow, 0, 'task item terkeluar: ' + audit.taskItemsOverflow);
      assert.ok(audit.toolbarInside, 'select-row keluar dari toolbar');
      assert.ok(audit.tabsInside, 'tabs keluar dari toolbar');
      assert.ok(audit.statsOverflow <= 1, 'stats overflow ' + audit.statsOverflow + 'px');
      assert.ok(audit.tabsOverflow <= 1, 'tabs overflow dalam ' + audit.tabsOverflow + 'px');
      assert.ok(audit.addHeight >= 44, 'butang Tambah di bawah 44px: ' + Math.round(audit.addHeight) + 'px');
      assert.ok(audit.searchHeight >= 44, 'input carian di bawah 44px: ' + Math.round(audit.searchHeight) + 'px');
      assert.ok(audit.topActionsInside, 'top-actions keluar dari topbar');
      const searchW = await evaluate("document.getElementById('searchInput').offsetWidth");
      assert.ok(searchW > 250, 'kotak carian terlalu sempit: ' + searchW);
      // Modal task mesti muat dalam viewport 375px
      await click('#btnAdd');
      await waitFor("!document.getElementById('modalTask').classList.contains('hidden')");
      const modalLog = await evaluate(
        '(function(){var mb=document.querySelector("#modalTask .modal-box").getBoundingClientRect();' +
        'return {left:mb.left, right:mb.right, iw:window.innerWidth, ok: mb.left >= -1 && mb.right <= window.innerWidth + 1};})()'
      );
      assert.ok(modalLog.ok, 'modal-box overflow pada 375px: ' + JSON.stringify(modalLog));
      await click('#btnTaskCancel');
      await waitFor("document.getElementById('modalTask').classList.contains('hidden')");
      await send('Emulation.clearDeviceMetricsOverride');
    });

    await test('Responsif 768px: tiada overflow & filter bersusun mendatar', async () => {
      await setViewport(768, 1024);
      const overflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
      assert.ok(overflow <= 1, 'limpahan mendatar ' + overflow + 'px');
      const audit = await evaluate(
        '(function(){' +
        'var iw = window.innerWidth;' +
        'var r = {};' +
        'r.taskItemsOverflow = [...document.querySelectorAll(".task-item")].filter(function(el){var b=el.getBoundingClientRect();return b.right>iw+1 || b.left < -1;}).length;' +
        'var tb = document.querySelector(".toolbar").getBoundingClientRect();' +
        'var tabs = document.querySelector(".tabs").getBoundingClientRect();' +
        'var sr = document.querySelector(".select-row").getBoundingClientRect();' +
        'r.tabsInside = tabs.right <= tb.right + 1 && tabs.left >= tb.left - 1;' +
        'r.selectsInside = sr.right <= tb.right + 1 && sr.left >= tb.left - 1;' +
        'r.filtersSideBySide = Math.abs(tabs.top - sr.top) < 8;' +      // selari mendatar
        'r.tabsOverflow = document.querySelector(".tabs").scrollWidth - document.querySelector(".tabs").clientWidth;' +
        'return r;})()'
      );
      assert.ok(audit.filtersSideBySide, 'filter tidak selari mendatar pada 768px');
      assert.strictEqual(audit.taskItemsOverflow, 0, 'task item terkeluar: ' + audit.taskItemsOverflow);
      assert.ok(audit.tabsInside && audit.selectsInside, 'filter keluar dari toolbar');
      assert.ok(audit.tabsOverflow <= 1, 'tabs overflow dalam ' + audit.tabsOverflow + 'px');
      await send('Emulation.clearDeviceMetricsOverride');
    });

    await test('Harness ujian browser (test-harness.html) LULUS', async () => {
      await send('Page.navigate', { url: HARNESS_URL });
      await waitFor("document.readyState === 'complete'");
      const text = await waitFor(
        "(function(){var el=document.getElementById('test-result');return el && el.textContent.indexOf('TEST_RESULT')===0 ? el.textContent : '';})()"
      );
      const info = JSON.parse(text.replace('TEST_RESULT ', ''));
      assert.ok(info.PASS, 'harness gagal: ' + JSON.stringify(info.failures));
      console.log('    harness: ' + info.pass + ' lulus, ' + info.fail + ' gagal');
    });

    await test('Tiada error console / exception sepanjang ujian', async () => {
      // Kembali ke aplikasi & semak error yang direkod
      await send('Page.navigate', { url: APP_URL });
      await waitFor("document.readyState === 'complete'");
      const smoke = await evaluate('window.__todoSmoke');
      const allErrors = (smoke && smoke.errors ? smoke.errors : []).concat(browserConsoleErrors);
      if (allErrors.length) {
        throw new Error('error terdeteksi: ' + JSON.stringify(allErrors.slice(0, 5)));
      }
    });
  } finally {
    try { if (ws) ws.close(); } catch (e) { /* tak apa */ }
    try { proc.kill(); } catch (e) { /* tak apa */ }
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) { /* tak apa */ }
  }
}

main()
  .catch((e) => {
    results.fail++;
    results.failures.push({ name: 'Keseluruhan', err: e });
    console.log('  \u2717 Keseluruhan → ' + e.message);
  })
  .finally(() => {
    console.log('\n\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014');
    console.log('Keputusan browser: ' + results.pass + ' lulus, ' + results.fail + ' gagal dari ' + (results.pass + results.fail));
    if (results.fail) {
      console.log('\nGagal:');
      results.failures.forEach((f) => {
        console.log('  \u2717 ' + f.name);
        console.log('    ' + (f.err && f.err.stack ? f.err.stack.split('\n').slice(0, 4).join('\n    ') : f.err));
      });
      process.exit(1);
    }
    process.exit(0);
  });