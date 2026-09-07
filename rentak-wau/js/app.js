/* ============================================================
   Rentak Wau v2 — app.js
   Pengawal UI: skrin, rendering, animasi, aliran fasa permainan.
   Zero dependency (vanilla JS).
   ============================================================ */
(function () {
  'use strict';

  var Cards = window.RentakCards;
  var Pixel = window.RentakPixel;
  var Engine = window.RentakEngine;
  var AI = window.RentakAI;

  var LEVEL = Cards.LEVEL;

  /* ---------------- Utiliti kecil ---------------- */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function shuffleArr(a) { return Cards.shuffle(a); }

  /* ---------------- State UI ---------------- */
  var app = {
    engine: null,
    config: null,          // { players: [{name, isAI}] }
    mode: 'vsai',          // 'vsai' | 'hotseat'
    humanIds: [],
    selected: [],          // kad terpilih semasa fasa choose
    flow: null,            // aliran fasa
    gameOver: false,
    collapsed: {}          // { pid: true } → panel pemain dikecilkan (kad disembunyikan)
  };

  /* ---------------- Skrin ---------------- */
  function showScreen(id) {
    $$('.screen').forEach(function (s) { s.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
  }

  /* ---------------- SETUP ---------------- */
  var setupPlayers = [
    { name: 'Anda', isAI: false },
    { name: 'Ribut', isAI: true }
  ];

  function renderSetup() {
    var wrap = $('#setup-players');
    wrap.innerHTML = '';
    setupPlayers.forEach(function (p, i) {
      var row = el(
        '<div class="setup-player" data-i="' + i + '">' +
          '<span class="sp-num">' + (i + 1) + '</span>' +
          '<input class="sp-name" maxlength="14" value="' + esc(p.name) + '">' +
          '<button class="sp-toggle ' + (p.isAI ? 'ai' : 'hum') + '" data-i="' + i + '">' +
            (p.isAI ? '🤖 AI' : '🧑 Manusia') +
          '</button>' +
          '<button class="sp-remove" data-i="' + i + '" title="Buang pemain">✕</button>' +
        '</div>');
      wrap.appendChild(row);
    });
    // butang kawalan
    $('#setup-count').textContent = setupPlayers.length;
    $('#btn-add-player').style.display = setupPlayers.length >= 4 ? 'none' : '';
    $('#btn-remove-player').style.display = setupPlayers.length <= 2 ? 'none' : '';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function bindSetup() {
    $('#btn-start').addEventListener('click', startGame);

    $('#setup-players').addEventListener('click', function (e) {
      var btn = e.target.closest('.sp-toggle');
      if (btn) {
        var i = parseInt(btn.getAttribute('data-i'), 10);
        setupPlayers[i].isAI = !setupPlayers[i].isAI;
        renderSetup();
        return;
      }
      var rm = e.target.closest('.sp-remove');
      if (rm) {
        var j = parseInt(rm.getAttribute('data-i'), 10);
        if (setupPlayers.length > 2) { setupPlayers.splice(j, 1); renderSetup(); }
        return;
      }
    });
    $('#setup-players').addEventListener('input', function (e) {
      if (e.target.classList.contains('sp-name')) {
        var row = e.target.closest('.setup-player');
        var i = parseInt(row.getAttribute('data-i'), 10);
        if (i >= 0) setupPlayers[i].name = e.target.value || ('Pemain ' + (i + 1));
      }
    });

    $('#btn-add-player').addEventListener('click', function () {
      if (setupPlayers.length < 4) {
        var aiNames = ['Bayu', 'Petir', 'Lidah'];
        setupPlayers.push({ name: aiNames[setupPlayers.length - 1] || 'AI ' + setupPlayers.length, isAI: true });
        renderSetup();
      }
    });
    $('#btn-remove-player').addEventListener('click', function () {
      if (setupPlayers.length > 2) { setupPlayers.pop(); renderSetup(); }
    });
    $('#btn-rules').addEventListener('click', function () { showRules(); });
  }

  function startGame() {
    // sahkan nama
    setupPlayers.forEach(function (p, i) {
      if (!p.name || !p.name.trim()) p.name = 'Pemain ' + (i + 1);
    });
    app.config = { players: setupPlayers.map(function (p) { return { name: p.name.trim(), isAI: p.isAI }; }) };
    app.engine = new Engine.GameEngine();
    app.engine.newGame(app.config.players);

    app.humanIds = app.engine.players.filter(function (p) { return !p.isAI; }).map(function (p) { return p.id; });
    app.mode = app.humanIds.length > 1 ? 'hotseat' : 'vsai';
    app.selected = [];
    app.gameOver = false;

    showScreen('screen-game');
    renderAll();
    addLog('🪁 Rentak Wau v2 — permainan bermula!');
    addLog('Pemain: ' + app.engine.players.map(function (p) { return p.name; }).join(', '));
    runRoundFlow();
  }

  /* ---------------- RENDERING ---------------- */
  function wauCardEl(card, opts) {
    opts = opts || {};
    var cv = Pixel.wauCanvas(card, 2);
    cv.className = 'waucv';
    var inner;
    if (opts.faceDown) {
      inner = '<div class="card-back">🪁</div>';
    } else {
      inner = '<div class="card-front">' +
        '<div class="card-art"></div>' +
        '<div class="card-name">' + esc(card.name) + '</div>' +
        '<div class="card-size">Saiz ' + card.size + '</div>' +
      '</div>';
    }
    var d = document.createElement('div');
    d.className = 'wau-card lv-' + card.level + (opts.faceDown ? ' face-down' : '') +
      (opts.selectable ? ' selectable' : '') + (opts.selected ? ' selected' : '') +
      (opts.played ? ' played' : '') + (opts.living ? ' living' : '') +
      (opts.winner ? ' winner' : '') + (opts.dim ? ' dim' : '');
    d.innerHTML = inner;
    if (!opts.faceDown) d.querySelector('.card-art').appendChild(cv);
    return d;
  }

  function windCardEl(level, opts) {
    opts = opts || {};
    var cv = Pixel.windCanvas(level, 2);
    cv.className = 'windcv';
    var d = document.createElement('div');
    d.className = 'wind-card wl-' + level + (opts.faceDown ? ' face-down' : '');
    d.innerHTML = '<div class="wind-art"></div><div class="wind-label">' + LEVEL[level].icon + ' ' + LEVEL[level].label + '</div>';
    if (!opts.faceDown) d.querySelector('.wind-art').appendChild(cv);
    return d;
  }

  function dieEl(value, cls) {
    var cv = Pixel.dieCanvas(value, 2);
    cv.className = 'diecv';
    var d = document.createElement('div');
    d.className = 'die ' + (cls || '');
    d.appendChild(cv);
    return d;
  }

  function renderAll() {
    renderHeader();
    renderWindZone();
    renderField();
    renderPlayers();
  }

  function renderHeader() {
    var g = app.engine;
    $('#round-label').textContent = 'Pusingan ' + g.round + ' / ' + Engine.MAX_ROUNDS;
    $('#wind-deck-count').textContent = g.windDeck.length;
    $('#discard-count').textContent = g.discardPile.length;
  }

  function renderWindZone() {
    var g = app.engine;
    var zone = $('#wind-zone');
    zone.innerHTML = '';

    // Dek angin
    var deck = el('<div class="pile-zone">' +
      '<div class="pile-label">Dek Angin</div>' +
      '<div class="pile-deck">?</div>' +
      '<div class="pile-count">' + g.windDeck.length + '</div>' +
    '</div>');
    zone.appendChild(deck);

    // Kad angin semasa
    var cur = el('<div class="pile-zone current"><div class="pile-label">Angin Semasa</div></div>');
    var slot = document.createElement('div');
    slot.className = 'current-slot';
    if (g.currentWind) {
      slot.appendChild(windCardEl(g.currentWind.level));
    } else {
      slot.innerHTML = '<div class="slot-empty">?</div>';
    }
    cur.appendChild(slot);
    zone.appendChild(cur);

    // Longgokan angin terpakai / tidak dituntut
    var used = el('<div class="pile-zone"><div class="pile-label">Angin Terpakai</div>' +
      '<div class="pile-deck used">' + (g.windDiscard.length + g.players.reduce(function (s, p) { return s + p.windCards.length; }, 0)) + '</div>' +
      '<div class="pile-count">' + (g.windDiscard.length) + ' tdk dituntut</div>' +
    '</div>');
    zone.appendChild(used);
  }

  function renderField() {
    var g = app.engine;
    var field = $('#field');
    field.innerHTML = '';

    // Wau hidup dengan dadu di tengah
    var living = [];
    g.players.forEach(function (p) {
      p.living.forEach(function (c) { living.push({ p: p, c: c }); });
    });

    if (living.length === 0) {
      field.innerHTML = '<div class="field-empty">Padang kosong — wau belum diterbangkan.</div>';
      return;
    }

    living.forEach(function (item) {
      var isWinner = (item.p.id === g.roundWinnerId) && (g.autoWin || item.c.id === g.roundWinnerWauId);
      var card = wauCardEl(item.c, { living: true, winner: isWinner });
      // semasa fasa dice: papar pending dulu (akan dianimasikan)
      if (g.phase === 'dice') {
        card.appendChild(dieEl(0, 'pending'));
      } else if (item.c.die !== undefined) {
        card.appendChild(dieEl(item.c.die, 'settled'));
      } else {
        card.appendChild(dieEl(0, 'pending'));
      }
      card.dataset.wauId = item.c.id;
      card.dataset.playerId = item.p.id;
      field.appendChild(card);
    });
  }

  function renderPlayers() {
    var g = app.engine;
    var wrap = $('#players');
    wrap.innerHTML = '';
    g.players.forEach(function (p) {
      var panel = document.createElement('div');
      panel.className = 'player-panel';
      panel.dataset.pid = p.id;

      // header
      var score = g.computeScore(p.windCards);
      var collapsed = !!app.collapsed[p.id];
      var head = document.createElement('div');
      head.className = 'pp-head';
      head.innerHTML =
        '<div class="pp-avatar ' + (p.isAI ? 'ai' : 'hum') + '">' + (p.isAI ? '🤖' : '🧑') + '</div>' +
        '<div class="pp-info">' +
          '<div class="pp-name">' + esc(p.name) + (p.isAI ? ' <span class="pp-tag">AI</span>' : '') + '</div>' +
          '<div class="pp-score">Mata: <b>' + score + '</b></div>' +
        '</div>' +
        '<button class="pp-collapse" type="button" title="' + (collapsed ? 'Kembangkan kad' : 'Kecilkan kad') + '" aria-label="' + (collapsed ? 'Kembangkan kad' : 'Kecilkan kad') + '">' + (collapsed ? '＋' : '－') + '</button>';
      panel.appendChild(head);

      // butang kecilkan/embangkan kad pemain (jadikan bar nipis supaya padang lebih luas)
      var collapseBtn = head.querySelector('.pp-collapse');
      collapseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var nowCollapsed = !panel.classList.contains('collapsed');
        panel.classList.toggle('collapsed', nowCollapsed);
        app.collapsed[p.id] = nowCollapsed;
        collapseBtn.textContent = nowCollapsed ? '＋' : '－';
        collapseBtn.title = nowCollapsed ? 'Kembangkan kad' : 'Kecilkan kad';
        collapseBtn.setAttribute('aria-label', collapseBtn.title);
      });

      if (collapsed) {
        panel.classList.add('collapsed');
      }

      // kad angin dimenangi
      var won = document.createElement('div');
      won.className = 'pp-won';
      if (p.windCards.length) {
        p.windCards.forEach(function (w) {
          var mini = document.createElement('span');
          mini.className = 'won-mini wl-' + w.level;
          mini.textContent = LEVEL[w.level].icon;
          won.appendChild(mini);
        });
      } else {
        won.textContent = 'Belum ada kad angin';
      }
      panel.appendChild(won);

      // tangan
      var handRow = document.createElement('div');
      handRow.className = 'pp-hand';
      var showHand = (!p.isAI && app.mode === 'vsai' && !app.gameOver);
      p.hand.forEach(function (c) {
        var faceDown = !showHand;
        handRow.appendChild(wauCardEl(c, { faceDown: faceDown }));
      });
      panel.appendChild(handRow);

      // wau dimainkan (dedah selepas fasa reveal)
      var playedRow = document.createElement('div');
      playedRow.className = 'pp-played';
      if (p.played.length && g.phase !== 'choose') {
        p.played.forEach(function (c) { playedRow.appendChild(wauCardEl(c, { played: true })); });
      }
      panel.appendChild(playedRow);

      // wau hidup (tag)
      if (p.living.length) {
        var tag = document.createElement('div');
        tag.className = 'pp-living-tag';
        tag.textContent = 'Wau hidup: ' + p.living.map(function (c) { return c.name; }).join(', ');
        panel.appendChild(tag);
      }

      // pemain aktif menang round
      if (g.roundWinnerId === p.id && !app.gameOver && g.phase === 'claim') {
        panel.classList.add('round-win');
      }
      if (p.id === 0 && app.mode === 'vsai' && !app.gameOver) {
        // tandakan panel anda
        panel.classList.add('mine');
      }

      wrap.appendChild(panel);
    });
  }

  function addLog(msg) {
    var log = $('#log');
    var line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = msg;
    log.appendChild(line);
    while (log.children.length > 80) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  }

  /* ---------------- Kontrol butang ---------------- */
  function setControls(html, bind) {
    var c = $('#controls');
    c.innerHTML = html;
    if (bind) bind(c);
  }

  /* ---------------- ALIRAN PERMAINAN ---------------- */
  function runRoundFlow() {
    // pilih urutan pemain (rawak mula mengikut rulebook setup, tapi
    // untuk fasa choose semuanya serentak — cuma urutan UI)
    app.flow = { choosingIdx: 0, picks: {} };
    choosePhase();
  }

  function choosePhase() {
    var g = app.engine;
    var players = g.players;

    function nextPicker(i) {
      if (i >= players.length) {
        // semua dah pilih → dedah
        revealPhase();
        return;
      }
      var p = players[i];
      if (p.isAI) {
        addLog('🤖 ' + p.name + ' sedang berfikir…');
        setTimeout(function () {
          var ids = AI.choose(g, p);
          g.chooseWau(p.id, ids);
          addLog('🤖 ' + p.name + ' memilih 2 wau (rahsia).');
          renderPlayers();
          nextPicker(i + 1);
        }, 650);
      } else if (app.mode === 'hotseat') {
        // overlay pemilihan untuk hotseat
        hotseatPick(i, nextPicker);
      } else {
        // vsai: pemain manusia pilih terus dalam panel
        startHumanPick(i, nextPicker);
      }
    }

    nextPicker(0);
  }

  /* --- Pemilihan manusia dalam mod vsai (klik tangan sendiri) --- */
  function startHumanPick(playerIdx, done) {
    var g = app.engine;
    var p = g.players[playerIdx];
    app.selected = [];
    addLog('🧑 ' + p.name + ': pilih 2 wau untuk diterbangkan.');
    renderPlayers();
    setControls(
      '<div class="ctrl-hint mb-1 text-sm font-bold text-white [text-shadow:2px_2px_0_#2c1e12]">Klik 2 wau dalam tangan anda.</div>' +
      '<button class="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border-[3px] border-ink bg-btn px-6 text-sm font-bold uppercase tracking-wide text-white shadow-chunkysm transition hover:bg-btnhi active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40" id="btn-confirm" disabled>Lepas Wau!</button>',
      function (c) {
        var btn = c.querySelector('#btn-confirm');
        btn.addEventListener('click', function () {
          g.chooseWau(p.id, app.selected.slice());
          app.selected = [];
          setControls('');
          addLog('🧑 ' + p.name + ' melepaskan 2 wau.');
          renderPlayers();
          done(playerIdx + 1);
        });
      }
    );

    // tambah event klik pada kad tangan pemain ini
    $$('#players .pp-hand').forEach(function (row, i) {
      if (i !== playerIdx) return;
      Array.prototype.forEach.call(row.children, function (cardEl, k) {
        cardEl.classList.add('selectable');
        cardEl.addEventListener('click', function () {
          var cardId = g.players[playerIdx].hand[k].id;
          toggleSelect(cardId, cardEl);
        });
      });
    });
  }

  function toggleSelect(cardId, cardEl) {
    var idx = app.selected.indexOf(cardId);
    if (idx >= 0) {
      app.selected.splice(idx, 1);
      cardEl.classList.remove('selected');
    } else if (app.selected.length < 2) {
      app.selected.push(cardId);
      cardEl.classList.add('selected');
    }
    var btn = $('#btn-confirm');
    if (btn) btn.disabled = app.selected.length !== 2;
  }

  /* --- Pemilihan hotseat (overlay + serahkan skrin) --- */
  function hotseatPick(playerIdx, done) {
    var g = app.engine;
    var p = g.players[playerIdx];
    app.selected = [];
    var ov = $('#overlay');
    ov.classList.add('show');
    ov.innerHTML =
      '<div class="ov-box w-full max-w-xl rounded-2xl border-4 border-ink bg-panel p-4 text-center shadow-chunkylg">' +
        '<div class="ov-title text-xl font-extrabold uppercase tracking-wide">🧑 ' + esc(p.name) + ' — pilih 2 wau</div>' +
        '<div class="ov-sub mt-1 mb-3 text-sm text-[#6a4f2e]">Pilih 2 wau secara rahsia. Pemain lain jangan lihat!</div>' +
        '<div class="ov-hand flex flex-wrap justify-center gap-2.5" id="ov-hand"></div>' +
        '<button class="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border-[3px] border-ink bg-btn px-6 text-sm font-bold uppercase tracking-wide text-white shadow-chunkysm transition hover:bg-btnhi active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40" id="btn-ov-confirm" disabled>Lepas Wau!</button>' +
      '</div>';

    var handWrap = ov.querySelector('#ov-hand');
    p.hand.forEach(function (c, k) {
      var card = wauCardEl(c, { selectable: true });
      card.addEventListener('click', function () {
        var idx = app.selected.indexOf(c.id);
        if (idx >= 0) { app.selected.splice(idx, 1); card.classList.remove('selected'); }
        else if (app.selected.length < 2) { app.selected.push(c.id); card.classList.add('selected'); }
        ov.querySelector('#btn-ov-confirm').disabled = app.selected.length !== 2;
      });
      handWrap.appendChild(card);
    });

    ov.querySelector('#btn-ov-confirm').addEventListener('click', function () {
      g.chooseWau(p.id, app.selected.slice());
      app.selected = [];
      // serahkan skrin kepada pemain seterusnya (jika ada manusia)
      var nextHuman = null;
      for (var i = playerIdx + 1; i < g.players.length; i++) {
        if (!g.players[i].isAI) { nextHuman = i; break; }
      }
      if (nextHuman !== null) {
        ov.innerHTML =
          '<div class="ov-box w-full max-w-xl rounded-2xl border-4 border-ink bg-panel p-4 text-center shadow-chunkylg">' +
            '<div class="ov-title text-xl font-extrabold uppercase tracking-wide">🔒 Serahkan Skrin</div>' +
            '<div class="ov-sub mt-1 mb-3 text-sm text-[#6a4f2e]">Sembunyikan pilihan anda. Serahkan skrin kepada <b>' + esc(g.players[nextHuman].name) + '</b>.</div>' +
            '<button class="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border-[3px] border-ink bg-btn px-5 text-sm font-bold uppercase tracking-wide text-white shadow-chunkysm transition hover:bg-btnhi active:translate-x-[3px] active:translate-y-[3px] active:shadow-none" id="btn-ov-pass">Saya ' + esc(g.players[nextHuman].name) + ' — Teruskan ▶</button>' +
          '</div>';
        ov.querySelector('#btn-ov-pass').addEventListener('click', function () {
          ov.classList.remove('show');
          ov.innerHTML = '';
          done(playerIdx + 1);
        });
      } else {
        ov.classList.remove('show');
        ov.innerHTML = '';
        done(playerIdx + 1);
      }
    });
  }

  /* ============================================================
     MESIN LANGKAH (Pacing Step-by-Step)
     Setiap fasa round dipacu SATU LANGKAH pada satu masa.
     Selepas setiap langkah: animasi + log + butang "Next ▶".
     Butang "⏩ Auto" menjalankan baki langkah dengan cepat.
     ============================================================ */
  var TEST = /[?&](uitest|audit)=/.test(location.search || '');
  function dur(ms) { return TEST ? 20 : ms; }   // dalam mod test: animasi pantas

  var BTN_COMMON =
    'inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border-[3px] border-ink bg-btn px-6 text-sm font-bold uppercase tracking-wide text-white shadow-chunkysm transition hover:bg-btnhi active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40';

  app.steps = [];
  app.stepIdx = 0;
  app.autoRun = false;
  app.diceResult = null;

  /* Butang kawalan langkah: Next + Auto */
  function nextControls(label, onNext, hint) {
    var h = hint
      ? '<div class="ctrl-hint mb-1 text-sm font-bold text-white [text-shadow:2px_2px_0_#2c1e12]">' + hint + '</div>'
      : '';
    setControls(h +
      '<div class="flex flex-wrap items-center justify-center gap-2">' +
        '<button class="' + BTN_COMMON + '" id="btn-next">' + (label || 'Next ▶') + '</button>' +
        '<button class="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border-[3px] border-ink bg-panel px-4 text-xs font-bold uppercase tracking-wide text-ink shadow-chunkysm transition hover:bg-goldsoft active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" id="btn-auto" title="Jalankan baki round dengan cepat">⏩ Auto</button>' +
      '</div>',
      function (c) {
        c.querySelector('#btn-next').addEventListener('click', function () {
          setControls('');
          onNext();
        });
        c.querySelector('#btn-auto').addEventListener('click', function () {
          app.autoRun = true;
          setControls('');
          onNext();
        });
      });
  }

  /* Jalankan senarai langkah satu persatu. */
  function runStepMachine(steps) {
    app.steps = steps;
    app.stepIdx = 0;
    app.autoRun = false;
    app.diceResult = null;
    advanceStep();
  }

  function advanceStep() {
    while (app.stepIdx < app.steps.length) {
      var s = app.steps[app.stepIdx];
      app.stepIdx++;
      if (s.should && !s.should()) continue; // langkah tak diperlukan → skip
      var auto = app.autoRun;
      s.run(function () {
        if (auto) {
          setTimeout(advanceStep, dur(150)); // auto: teruskan pantas
        } else {
          nextControls(s.nextLabel || 'Teruskan ▶', advanceStep, s.hint);
        }
      });
      return;
    }
    // semua langkah selesai → tutup round
    app.autoRun = false;
    endRound();
  }

  /* Animasi: kad dibuang keluar dari padang (fade + geser ke bawah). */
  function animateDiscard(card) {
    var field = $('#field');
    if (!field) return;
    var ghost = wauCardEl(card, { living: true, dim: true });
    ghost.classList.add('discard-ghost');
    field.appendChild(ghost);
    setTimeout(function () {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    }, dur(900));
  }

  /* Serlahkan panel pemain sebagai pemenang. */
  function highlightWinner(pid) {
    var panel = document.querySelector('.player-panel[data-pid="' + pid + '"]');
    if (panel) panel.classList.add('round-win');
  }

  /* Animasi: kad angin dituntut → panel pemain berkelip. */
  function claimAnimation(pid) {
    var panel = document.querySelector('.player-panel[data-pid="' + pid + '"]');
    if (!panel) return;
    panel.classList.add('claim-glow');
    var minis = panel.querySelectorAll('.won-mini');
    if (minis.length) minis[minis.length - 1].classList.add('claim-pop');
  }

  /* ---------------- FASA REVEAL + ROUND ---------------- */
  function revealPhase() {
    var g = app.engine;
    setControls('<button class="' + BTN_COMMON + '" id="btn-reveal">🌬️ Tiup Angin!</button>', function (c) {
      c.querySelector('#btn-reveal').addEventListener('click', function () {
        g.revealWind();
        addLog('🌬️ Angin semasa: ' + LEVEL[g.currentWind.level].label + ' ' + LEVEL[g.currentWind.level].icon);
        renderAll();
        setControls('');
        runStepMachine(buildRoundSteps());
      });
    });
  }

  /* Susun langkah round berdasarkan situasi. */
  function buildRoundSteps() {
    var steps = [];
    steps.push({ nextLabel: 'Buang Tak Padan ▶', run: function (d) { doDiscardMismatch(d); } });
    steps.push({ nextLabel: 'Sediakan Dadu ▶', run: function (d) { doPrepareDice(d); } });
    steps.push({
      should: function () { return app.diceResult === 'roll'; },
      nextLabel: 'Gulung Dadu ▶',
      run: function (d) { doRollDice(d); }
    });
    steps.push({
      should: function () { return app.diceResult === 'roll'; },
      nextLabel: 'Tentukan Pemenang ▶',
      run: function (d) { doDetermineWinner(d); }
    });
    steps.push({
      should: function () { return app.diceResult === 'auto' || app.diceResult === 'none'; },
      nextLabel: 'Hasil Round ▶',
      run: function (d) { doAnnounceResult(d); }
    });
    steps.push({ nextLabel: 'Tuntut Kad Angin ▶', run: function (d) { doClaimWind(d); } });
    steps.push({ nextLabel: 'Bersih & Isi Semula ▶', run: function (d) { doCleanup(d); } });
    return steps;
  }

  /* Langkah: buang wau tak padan (animasi keluar + log). */
  function doDiscardMismatch(done) {
    var g = app.engine;
    var toDiscard = [];
    g.players.forEach(function (p) {
      p.played.forEach(function (c) {
        if (c.level !== g.currentWind.level) toDiscard.push({ p: p, c: c });
      });
    });
    g.checkCompatibility();
    renderAll();
    toDiscard.forEach(function (it, i) {
      addLog('❌ ' + it.p.name + ': ' + it.c.name + ' (Saiz ' + it.c.size + ') tidak padan — dibuang.');
      setTimeout(function () { animateDiscard(it.c); }, i * dur(150));
    });
    if (toDiscard.length === 0) {
      addLog('✅ Semua wau padan dengan angin — tiada yang dibuang.');
    }
    setTimeout(done, toDiscard.length ? dur(700) + toDiscard.length * dur(150) : dur(300));
  }

  /* Langkah: sediakan dadu — tentukan auto / none / roll. */
  function doPrepareDice(done) {
    var g = app.engine;
    app.diceResult = g.prepareDice();
    renderAll();
    if (app.diceResult === 'auto') {
      addLog('⭐ Auto-menang: hanya ' + g.players[g.roundWinnerId].name + ' ada wau padan.');
    } else if (app.diceResult === 'none') {
      addLog('🌫️ Tiada wau padan dengan angin — tiada pemenang round.');
    } else {
      addLog('🎲 ' + g.getRollOrder().length + ' wau hidup — sediakan 1 dadu untuk setiap wau.');
    }
    setTimeout(done, dur(500));
  }

  /* Langkah: gulung dadu dengan animasi nampak (0.8–1.5s setiap). */
  function doRollDice(done) {
    var g = app.engine;
    g.rollDice();
    var order = g.getRollOrder();
    renderField();
    var field = $('#field');
    var idx = 0;
    function rollNext() {
      if (idx >= order.length) { setTimeout(done, dur(300)); return; }
      var item = order[idx];
      var cardEl = field.querySelector('[data-wau-id="' + item.card.id + '"]');
      var dieBox = cardEl ? cardEl.querySelector('.die') : null;
      if (!cardEl || !dieBox) { idx++; rollNext(); return; }
      dieBox.classList.add('rolling');
      var start = Date.now();
      var total = dur(1000);
      var iv = setInterval(function () {
        dieBox.innerHTML = '';
        dieBox.appendChild(Pixel.dieCanvas(1 + Math.floor(Math.random() * 6), 2));
        if (Date.now() - start > total) {
          clearInterval(iv);
          dieBox.innerHTML = '';
          dieBox.appendChild(Pixel.dieCanvas(item.card.die, 2));
          dieBox.classList.remove('rolling');
          dieBox.classList.add('settled');
          idx++;
          rollNext();
        }
      }, dur(90));
    }
    rollNext();
  }

  /* Langkah: tentukan pemenang & serlahkan. */
  function doDetermineWinner(done) {
    var g = app.engine;
    var winner = g.determineWinner();
    renderAll();
    if (winner) {
      addLog('🏆 Pemenang: ' + g.players[winner.playerId].name + ' — ' + winner.card.name + ' (dadu ' + winner.card.die + ').');
      highlightWinner(winner.playerId);
    }
    setTimeout(done, dur(800));
  }

  /* Langkah: umumkan hasil auto / none. */
  function doAnnounceResult(done) {
    var g = app.engine;
    if (app.diceResult === 'auto') {
      addLog('🏆 Auto-menang: ' + g.players[g.roundWinnerId].name + ' menang tanpa baling dadu.');
      highlightWinner(g.roundWinnerId);
    } else {
      addLog('🌫️ Tiada pemenang — kad angin akan dibuang.');
    }
    renderAll();
    setTimeout(done, dur(700));
  }

  /* Langkah: tuntut kad angin (animasi ke skor pemain). */
  function doClaimWind(done) {
    var g = app.engine;
    var hadWinner = g.roundWinnerId !== null;
    var winnerId = g.roundWinnerId;
    g.claimWind();
    renderAll();
    if (hadWinner) {
      addLog('💨 ' + g.players[winnerId].name + ' menuntut kad angin (+1 mata).');
      claimAnimation(winnerId);
    } else {
      addLog('🗂️ Kad angin tidak dituntut — ke longgokan.');
    }
    setTimeout(done, dur(800));
  }

  /* Langkah: buang wau kalah + isi semula tangan (animasi keluar). */
  function doCleanup(done) {
    var g = app.engine;
    var losers = [];
    g.players.forEach(function (p) {
      p.living.forEach(function (c) {
        var isWin;
        if (g.autoWin) isWin = (p.id === g.roundWinnerId);
        else isWin = (p.id === g.roundWinnerId && c.id === g.roundWinnerWauId);
        if (!isWin) losers.push({ p: p, c: c });
      });
    });
    losers.forEach(function (it, i) {
      addLog('🗑️ ' + it.p.name + ': ' + it.c.name + ' kalah — dibuang.');
      setTimeout(function () { animateDiscard(it.c); }, i * dur(150));
    });
    g.discardLosers();
    g.refillHands();
    g.updateScores();
    renderAll();
    addLog('🔄 Tangan diisi semula ke 2 wau.');
    setTimeout(done, losers.length ? dur(700) + losers.length * dur(150) : dur(300));
  }

  /* ---------------- TAMAT ROUND ---------------- */
  function endRound() {
    var g = app.engine;
    g.updateScores();
    renderAll();
    if (g.isGameOver()) {
      if (app.autoRun) { setTimeout(showGameOver, dur(200)); return; }
      setControls('<button class="' + BTN_COMMON + '" id="btn-next">Lihat Keputusan 🏁</button>', function (c) {
        c.querySelector('#btn-next').addEventListener('click', function () {
          setControls('');
          showGameOver();
        });
      });
      return;
    }
    if (app.autoRun) {
      setTimeout(function () {
        g.nextRound();
        renderAll();
        addLog('Pusingan ' + g.round + ' bermula.');
        runRoundFlow();
      }, dur(200));
      return;
    }
    setControls('<button class="' + BTN_COMMON + '" id="btn-next">Pusingan Seterusnya ▶</button>', function (c) {
      c.querySelector('#btn-next').addEventListener('click', function () {
        setControls('');
        g.nextRound();
        renderAll();
        addLog('Pusingan ' + g.round + ' bermula.');
        runRoundFlow();
      });
    });
  }

  /* ---------------- TAMAT GAME ---------------- */
  function showGameOver() {
    app.gameOver = true;
    var g = app.engine;
    var rank = g.finalRanking();
    var sc = $('#screen-end');
    $('#end-rounds').textContent = '6 pusingan selesai';

    var list = $('#final-list');
    list.innerHTML = '';
    rank.sorted.forEach(function (p, i) {
      var isWinner = rank.winners.indexOf(p) >= 0;
      var row = el(
        '<div class="final-row ' + (isWinner ? 'champ' : '') + '">' +
          '<div class="fr-pos">' + (i + 1) + '</div>' +
          '<div class="fr-name">' + esc(p.name) + (isWinner ? ' 🏆' : '') + '</div>' +
          '<div class="fr-detail">' + p.windCards.length + ' kad angin · skor <b>' + p.score + '</b></div>' +
        '</div>');
      list.appendChild(row);
    });

    var msg = $('#end-msg');
    if (rank.winners.length === 1) {
      msg.textContent = 'Menang: ' + rank.winners[0].name + '!';
      msg.classList.remove('tie');
    } else {
      msg.textContent = 'Seri! ' + rank.winners.map(function (w) { return w.name; }).join(' & ') + ' menang bersama.';
      msg.classList.add('tie');
    }

    // log akhir
    var log = $('#end-log');
    log.innerHTML = '';
    g.log.forEach(function (m) {
      var line = document.createElement('div');
      line.textContent = m;
      log.appendChild(line);
    });

    showScreen('screen-end');
  }

  /* ---------------- RULES ---------------- */
  function showRules() {
    var ov = $('#overlay');
    ov.classList.add('show');
    ov.innerHTML =
      '<div class="ov-box rules w-full max-w-xl rounded-2xl border-4 border-ink bg-panel p-4 text-center shadow-chunkylg">' +
        '<div class="ov-title text-xl font-extrabold uppercase tracking-wide">📖 Cara Main — Rentak Wau v2</div>' +
        '<div class="rules-scroll mt-2 mb-3 text-left text-[13px] leading-relaxed text-[#3a2a18]">' +
          '<p><b>Komponen:</b> 12 kad wau (4 paras tinggi, 4 sederhana, 4 rendah — setiap satu saiz berbeza), 6 kad angin (2 tinggi, 2 sederhana, 2 rendah), 4 dadu D6.</p>' +
          '<p><b>Setup:</b> Kocok kad wau. Setiap pemain draft 3 wau (1 setiap paras angin). Kocok kad angin sebagai dek. Sediakan longgokan.</p>' +
          '<p><b>Setiap pusingan:</b></p>' +
          '<ol>' +
            '<li>Setiap pemain pilih 2 wau secara rahsia.</li>' +
            '<li>Buka kad angin teratas — tentukan paras angin.</li>' +
            '<li>Wau yang parasnya tidak padan dengan angin dibuang.</li>' +
            '<li>Jika lebih 1 pemain ada wau padan, beri 1 dadu setiap wau hidup. Jika hanya 1 pemain yang padan — dia menang round.</li>' +
            '<li>Gulung dadu (wau terbesar gulung dulu, kemudian menurun).</li>' +
            '<li>Wau dengan dadu tertinggi menang round.</li>' +
            '<li>Pemenang tuntut kad angin (1 mata).</li>' +
            '<li>Wau kalah dibuang; wau menang pulang ke tangan.</li>' +
            '<li>Pemain dengan kurang 2 wau menarik dari longgokan sehingga ada 2.</li>' +
            '<li>Ulang sehingga semua 6 kad angin digunakan.</li>' +
          '</ol>' +
          '<p><b>Tiebreak:</b> Dadu tertinggi sama → wau yang <b>lebih kecil</b> menang.</p>' +
          '<p><b>Skor:</b> Setiap kad angin = 1 mata. Setiap <b>pasangan</b> kad angin paras sama = +1 bonus (cth: 2 Tinggi = 3 mata).</p>' +
          '<p><b>Menang:</b> Skor tertinggi. Jika seri, pemain dengan saiz wau terkecil dalam tangan menang.</p>' +
        '</div>' +
        '<button class="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border-[3px] border-ink bg-btn px-6 text-sm font-bold uppercase tracking-wide text-white shadow-chunkysm transition hover:bg-btnhi active:translate-x-[3px] active:translate-y-[3px] active:shadow-none" id="btn-ov-close">Tutup</button>' +
      '</div>';
    ov.querySelector('#btn-ov-close').addEventListener('click', function () {
      ov.classList.remove('show');
      ov.innerHTML = '';
    });
  }

  /* ---------------- Butang global ---------------- */
  function bindGlobal() {
    $('#btn-restart').addEventListener('click', function () {
      showScreen('screen-setup');
      renderSetup();
    });
    $('#btn-replay').addEventListener('click', function () {
      // main semula dengan konfigurasi sama
      startGame();
    });
    var r2 = document.getElementById('btn-restart2');
    if (r2) r2.addEventListener('click', function () {
      showScreen('screen-setup');
      renderSetup();
    });
  }

  /* ---------------- Logo kites di skrin setup ---------------- */
  function renderLogos() {
    var zone = $('#logo-kites');
    if (!zone) return;
    zone.innerHTML = '';
    // wau contoh (3 paras) + kad angin
    var sampleWau = [
      { id: 'x1', name: '', level: 'high', size: 12, shade: 0 },
      { id: 'x2', name: '', level: 'mid', size: 7, shade: 1 },
      { id: 'x3', name: '', level: 'low', size: 2, shade: 2 }
    ];
    sampleWau.forEach(function (c) {
      zone.appendChild(Pixel.wauCanvas(c, 3));
    });
    zone.appendChild(Pixel.windCanvas('mid', 3));
  }

  /* ---------------- INIT ---------------- */
  function init() {
    renderLogos();
    renderSetup();
    bindSetup();
    bindGlobal();
    showScreen('screen-setup');
    // mod ujian automatik: index.html?uitest=1
    if (location.search.indexOf('uitest') >= 0) {
      runSelfTest();
    }
    // mod audit responsif: index.html?audit=1
    if (location.search.indexOf('audit') >= 0) {
      runAudit();
    }
  }

  /* -------- Audit responsif (index.html?audit=1) -------- */
  function runAudit() {
    var results = [];
    var failures = 0;
    function check(cond, msg) {
      results.push((cond ? 'PASS' : 'FAIL') + ': ' + msg);
      if (!cond) failures++;
    }
    function auditDOM() {
      var vw = window.innerWidth;
      var hasHScroll = document.documentElement.scrollWidth > vw + 2;
      check(!hasHScroll, 'tiada horizontal scroll (' + document.documentElement.scrollWidth + ' <= ' + vw + ')');
      check(!!document.getElementById('screen-setup'), '#screen-setup wujud');
      check(!!document.getElementById('screen-game'), '#screen-game wujud');
      check(!!document.getElementById('screen-end'), '#screen-end wujud');
      check(!!document.getElementById('overlay'), '#overlay wujud');
      check(!!document.getElementById('players'), '#players wujud');
      check(!!document.getElementById('field'), '#field wujud');
      check(!!document.getElementById('wind-zone'), '#wind-zone wujud');
      check(!!document.getElementById('log'), '#log wujud');
      check(!!document.getElementById('controls'), '#controls wujud');
      check(!!document.getElementById('btn-start'), '#btn-start wujud');
      check(!!document.getElementById('btn-rules'), '#btn-rules wujud');
      var canvases = document.querySelectorAll('#logo-kites canvas');
      check(canvases.length === 4, '4 canvas logo kites dirender');
    }

    // audit skrin setup
    auditDOM();

    // mula permainan, audit skrin game
    try {
      setupPlayers = [{ name: 'Anda', isAI: false }, { name: 'Ribut', isAI: true }];
      startGame();
      var vw = window.innerWidth;
      var hasHScroll = document.documentElement.scrollWidth > vw + 2;
      check(!hasHScroll, 'skrin game: tiada horizontal scroll (' + document.documentElement.scrollWidth + ' <= ' + vw + ')');
      check(document.getElementById('screen-game').classList.contains('active'), 'skrin game aktif');
      check(document.getElementById('round-label').textContent.indexOf('Pusingan') === 0, 'label pusingan dipaparkan');
      check(document.querySelectorAll('#players .pp-hand .wau-card').length >= 2, 'kad tangan dirender');
      // butang kecilkan/expand kad (mobile: kad jadi bar nipis supaya padang luas)
      var collapseBtns = document.querySelectorAll('#players .pp-collapse');
      check(collapseBtns.length >= 2, 'butang kecilkan kad dirender untuk setiap panel');
      if (collapseBtns.length) {
        var firstBtn = collapseBtns[0];
        var firstPanel = firstBtn.closest('.player-panel');
        firstBtn.click();
        check(firstPanel.classList.contains('collapsed'), 'butang kecilkan: panel menjadi bar nipis (collapsed)');
        var vw2 = window.innerWidth;
        check(document.documentElement.scrollWidth <= vw2 + 2, 'skrin game collapsed: tiada horizontal scroll (' + document.documentElement.scrollWidth + ' <= ' + vw2 + ')');
        firstBtn.click();
        check(!firstPanel.classList.contains('collapsed'), 'butang kecilkan: panel boleh expand semula');
      }
      check(window.__RENTAK_ERR.length === 0, 'tiada runtime error (' + window.__RENTAK_ERR.length + ')');
      if (window.__RENTAK_ERR.length) {
        window.__RENTAK_ERR.slice(0, 3).forEach(function (er) { results.push('  ERROR: ' + er); failures++; });
      }
    } catch (e) {
      results.push('FAIL: exception ' + e.message);
      failures++;
    }

    var box = document.createElement('div');
    box.id = 'audit-result';
    box.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#111;color:#7f7;font:12px monospace;padding:8px;z-index:999;';
    results.forEach(function (r) {
      var d = document.createElement('div');
      d.textContent = r;
      box.appendChild(d);
    });
    var final = document.createElement('div');
    final.id = 'audit-final';
    final.textContent = failures === 0 ? 'AUDIT: PASS' : 'AUDIT: FAIL';
    box.appendChild(final);
    document.body.appendChild(box);
    document.title = failures === 0 ? 'AUDIT_PASS' : 'AUDIT_FAIL';
  }

  document.addEventListener('DOMContentLoaded', init);

  // dedahkan untuk ujian
  window.RentakApp = {
    startGame: startGame,
    startWith: function (playersCfg) {
      // pemacu ujian: mula terus dengan konfigurasi pemain
      setupPlayers = playersCfg.map(function (p, i) {
        return { name: p.name || ('Pemain ' + (i + 1)), isAI: !!p.isAI };
      });
      startGame();
      return app.engine;
    },
    getEngine: function () { return app.engine; },
    /* -------- Ujian automatik penuh (index.html?uitest=1) -------- */
    runSelfTest: runSelfTest
  };

  /* Pemacu permainan automatik: klik butang fasa sehingga tamat. */
  function runSelfTest() {
    var results = [];
    var failures = 0;
    function check(cond, msg) {
      results.push((cond ? 'PASS' : 'FAIL') + ': ' + msg);
      if (!cond) failures++;
    }

    function clickBtn(sel) {
      var b = document.querySelector(sel);
      if (b) { b.click(); return true; }
      return false;
    }

    // mula permainan AI penuh (tiada input manusia)
    try {
      setupPlayers = [
        { name: 'AI-A', isAI: true },
        { name: 'AI-B', isAI: true },
        { name: 'AI-C', isAI: true }
      ];
      startGame();
      results.push('PASS: permainan 3 AI dimulakan');
    } catch (e) {
      results.push('FAIL: gagal mula ' + e.message);
      failures++;
      finishSelfTest(results, failures);
      return;
    }

    var driver = setInterval(function () {
      var endActive = document.getElementById('screen-end').classList.contains('active');
      var buttons = ['#btn-reveal', '#btn-roll', '#btn-next', '#btn-confirm'];
      var clicked = false;
      buttons.forEach(function (sel) { if (clickBtn(sel)) clicked = true; });
      if (!clicked && endActive) {
        clearInterval(driver);
        finishSelfTest(results, failures);
      }
    }, 150);

    // had masa 45 saat
    setTimeout(function () {
      if (!document.getElementById('screen-end').classList.contains('active')) {
        results.push('FAIL: permainan tidak tamat dalam masa');
        failures++;
        clearInterval(driver);
        finishSelfTest(results, failures);
      }
    }, 45000);
  }

  function finishSelfTest(results, failures) {
    var g = app.engine;
    if (g) {
      results.push(g.isGameOver() ? 'PASS: enjin isGameOver() benar' : 'FAIL: enjin belum tamat');
      if (!g.isGameOver()) failures++;
      results.push(g.finalRanking().winners.length >= 1 ? 'PASS: pemenang dikenal pasti' : 'FAIL: tiada pemenang');
      if (g.finalRanking().winners.length < 1) failures++;
      var totalCards = g.players.reduce(function (s, p) { return s + p.windCards.length; }, 0) + g.windDiscard.length;
      results.push(totalCards === 6 ? 'PASS: 6 kad angin digunakan' : 'FAIL: kad angin ' + totalCards);
      if (totalCards !== 6) failures++;
    }
    results.push(window.__RENTAK_ERR && window.__RENTAK_ERR.length === 0 ? 'PASS: tiada runtime error' : 'FAIL: runtime error dikesan (' + (window.__RENTAK_ERR || []).length + ')');
    if (window.__RENTAK_ERR && window.__RENTAK_ERR.length) {
      window.__RENTAK_ERR.forEach(function (er) { results.push('  ERROR: ' + er); failures++; });
    }

    var box = document.createElement('div');
    box.id = 'selftest-result';
    box.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#111;color:#7f7;font:12px monospace;padding:8px;z-index:999;max-height:40vh;overflow:auto;';
    results.forEach(function (r) {
      var d = document.createElement('div');
      d.textContent = r;
      box.appendChild(d);
    });
    var final = document.createElement('div');
    final.id = 'selftest-final';
    final.textContent = failures === 0 ? 'SELFTEST: PASS' : 'SELFTEST: FAIL';
    box.appendChild(final);
    document.body.appendChild(box);
    document.title = failures === 0 ? 'SELFTEST_PASS' : 'SELFTEST_FAIL';
  }
})();