/*
 * Catur Kaplay - lapisan render (Kaplay) dan interaksi.
 * Semua peraturan catur diuruskan oleh chess.js; AI dalam js/ai.js.
 */
(function () {
  'use strict';

  // ---- Tetapan papan ----
  var SQ = 78;            // saiz satu petak (px)
  var M = 26;             // jidar untuk label koordinat
  var SIZE = SQ * 8 + M * 2;
  var ANIM_MS = 140;      // tempoh animasi langkah

  // Warna kayu klasik untuk petak, tema gelap untuk sekeliling.
  var COL_LIGHT = '#eedcb6';
  var COL_DARK = '#a97a4e';
  var COL_TRAIL = { r: 246, g: 214, b: 110 };
  var COL_CHECK = { r: 224, g: 90, b: 70 };

  // Glif bidak (set bentuk pejal, warna ditentukan semasa rasterisasi).
  var GLYPH = {
    k: '\u265A', q: '\u265B', r: '\u265C',
    b: '\u265D', n: '\u265E', p: '\u265F'
  };
  var GLYPH_FONT =
    '"Segoe UI Symbol","Noto Sans Symbols 2","Apple Symbols","DejaVu Sans",serif';
  var CAP_CLASS = { w: 'cap-w', b: 'cap-b' };
  var CAP_VALUE = { q: 9, r: 5, b: 3, n: 3, p: 1 };

  // ---- Keadaan permainan ----
  var state = {
    game: new Chess(),
    playerColor: 'w',
    difficulty: 'sederhana',
    phase: 'idle',        // idle | thinking | animating | promo | over
    selected: null,
    targets: [],
    lastMove: null,
    thinkTimer: null,
    started: false,
    pendingPromo: null
  };

  var k = null;

  // ==================================================
  // Utiliti koordinat
  // ==================================================

  // Petak algebra ("e4") -> kedudukan piksel mengikut orientasi papan.
  function sqToXY(sq) {
    var file = sq.charCodeAt(0) - 97;
    var rank = parseInt(sq.charAt(1), 10);
    var col, row;
    if (state.playerColor === 'w') { col = file; row = 8 - rank; }
    else { col = 7 - file; row = rank - 1; }
    return {
      x: M + col * SQ,
      y: M + row * SQ,
      cx: M + col * SQ + SQ / 2,
      cy: M + row * SQ + SQ / 2
    };
  }

  // Kedudukan tetikus -> petak algebra, atau null jika di luar papan.
  function xyToSq(x, y) {
    var col = Math.floor((x - M) / SQ);
    var row = Math.floor((y - M) / SQ);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    var file, rank;
    if (state.playerColor === 'w') { file = col; rank = 8 - row; }
    else { file = 7 - col; rank = row + 1; }
    return String.fromCharCode(97 + file) + rank;
  }

  function aiColor() {
    return state.playerColor === 'w' ? 'b' : 'w';
  }

  function kingSquare(color) {
    var board = state.game.board();
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var pc = board[r][c];
        if (pc && pc.type === 'k' && pc.color === color) {
          return String.fromCharCode(97 + c) + (8 - r);
        }
      }
    }
    return null;
  }

  // ==================================================
  // Kaplay: persediaan
  // ==================================================

  function initKaplay() {
    k = kaplay({
      canvas: document.getElementById('game'),
      width: SIZE,
      height: SIZE,
      global: false,
      background: [20, 22, 28],
      pixelDensity: 1
    });

    buildBoard();

    // Rasterisasi glif bidak ke sprite supaya boleh diguna luar talian.
    ['w', 'b'].forEach(function (colKey) {
      Object.keys(GLYPH).forEach(function (type) {
        k.loadSprite('pc-' + colKey + type, makePieceDataURL(colKey, type));
      });
    });

    k.onMousePress('left', onMousePress);
  }

  // Lukis glif Unicode pada kanvas tersembunyi, pulangkan data URL PNG.
  function makePieceDataURL(colorKey, type) {
    var cv = document.createElement('canvas');
    cv.width = 128;
    cv.height = 128;
    var ctx = cv.getContext('2d');
    ctx.font = '104px ' + GLYPH_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 7;
    ctx.lineJoin = 'round';
    if (colorKey === 'w') {
      ctx.strokeStyle = '#2b251d';
      ctx.fillStyle = '#f6f1e6';
    } else {
      ctx.strokeStyle = '#efe6d2';
      ctx.fillStyle = '#211d17';
    }
    ctx.strokeText(GLYPH[type], 64, 70);
    ctx.fillText(GLYPH[type], 64, 70);
    return cv.toDataURL('image/png');
  }

  // Bina semua elemen statik papan (bingkai, label, petak).
  function buildBoard() {
    // Bingkai luar papan.
    k.add([
      k.rect(SIZE - 8, SIZE - 8),
      k.pos(4, 4),
      k.color(k.rgb('#3a3f52')),
      k.z(0),
      'static'
    ]);

    // Label koordinat pada jidar.
    var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var i = 0; i < 8; i++) {
      var labelFile, labelRank;
      if (state.playerColor === 'w') {
        labelFile = files[i];
        labelRank = String(8 - i);
      } else {
        labelFile = files[7 - i];
        labelRank = String(i + 1);
      }
      k.add([
        k.text(labelFile, { size: 13 }),
        k.pos(M + i * SQ + SQ / 2, SIZE - M / 2),
        k.anchor('center'),
        k.color(k.rgb('#8a8fa0')),
        k.z(1),
        'static'
      ]);
      k.add([
        k.text(labelRank, { size: 13 }),
        k.pos(M / 2, M + i * SQ + SQ / 2),
        k.anchor('center'),
        k.color(k.rgb('#8a8fa0')),
        k.z(1),
        'static'
      ]);
    }

    // 64 petak.
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        var isLight = (row + col) % 2 === 0;
        k.add([
          k.rect(SQ, SQ),
          k.pos(M + col * SQ, M + row * SQ),
          k.color(isLight ? k.rgb(COL_LIGHT) : k.rgb(COL_DARK)),
          k.z(1),
          'tile'
        ]);
      }
    }
  }

  // Bina semula semua sprite bidak daripada keadaan chess.js.
  function rebuildPieces() {
    k.destroyAll('piece');
    var board = state.game.board();
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var pc = board[r][c];
        if (!pc) continue;
        var sq = String.fromCharCode(97 + c) + (8 - r);
        var xy = sqToXY(sq);
        k.add([
          k.sprite('pc-' + pc.color + pc.type),
          k.pos(xy.cx, xy.cy),
          k.anchor('center'),
          k.scale(SQ * 0.86 / 128),
          k.z(5),
          'piece',
          { square: sq }
        ]);
      }
    }
  }

  // ==================================================
  // Overlaid: pilihan, langkah terakhir, skak
  // ==================================================

  function addSquareTint(sq, rgb, opacity, tag, z) {
    var xy = sqToXY(sq);
    k.add([
      k.rect(SQ, SQ),
      k.pos(xy.x, xy.y),
      k.color(k.rgb(rgb.r, rgb.g, rgb.b)),
      k.opacity(opacity),
      k.z(z),
      tag
    ]);
  }

  function refreshTrail() {
    k.destroyAll('trail');
    if (!state.lastMove) return;
    addSquareTint(state.lastMove.from, COL_TRAIL, 0.30, 'trail', 2);
    addSquareTint(state.lastMove.to, COL_TRAIL, 0.30, 'trail', 2);
  }

  function refreshCheckMark() {
    k.destroyAll('chk');
    var g = state.game;
    if (g.game_over()) return;
    if (g.in_check()) {
      var ks = kingSquare(g.turn());
      if (ks) addSquareTint(ks, COL_CHECK, 0.42, 'chk', 3);
    }
  }

  function refreshOverlays() {
    refreshTrail();
    refreshCheckMark();
  }

  function clearHints() {
    if (k) k.destroyAll('hint');
  }

  function showSelection() {
    clearHints();
    if (state.selected) {
      addSquareTint(state.selected, { r: 110, g: 170, b: 240 }, 0.35, 'hint', 2);
    }
    state.targets.forEach(function (mv) {
      var xy = sqToXY(mv.to);
      var isCapture = !!mv.captured ||
        (mv.flags && mv.flags.indexOf('e') >= 0); // en passant
      if (isCapture) {
        // Halo merah besar di belakang bidak sasaran.
        k.add([
          k.circle(SQ * 0.44),
          k.pos(xy.cx, xy.cy),
          k.color(k.rgb(214, 69, 69)),
          k.opacity(0.34),
          k.z(4),
          'hint'
        ]);
      } else {
        k.add([
          k.circle(SQ * 0.15),
          k.pos(xy.cx, xy.cy),
          k.color(k.rgb(66, 168, 88)),
          k.opacity(0.8),
          k.z(4),
          'hint'
        ]);
      }
    });
  }

  function clearSelection() {
    state.selected = null;
    state.targets = [];
    clearHints();
  }

  // ==================================================
  // Interaksi tetikus
  // ==================================================

  function onMousePress() {
    if (state.phase !== 'idle') return;
    var mp = k.mousePos();
    var sq = xyToSq(mp.x, mp.y);
    if (!sq) { clearSelection(); showSelection(); return; }

    // Klik pada sasaran langkah sah -> jalan.
    if (state.selected) {
      var matches = state.targets.filter(function (t) { return t.to === sq; });
      if (matches.length > 0) {
        if (matches.length > 1) openPromoDialog(matches);
        else applyPlayerMove(matches[0]);
        return;
      }
    }

    // Klik pada bidak sendiri -> pilih.
    var pc = state.game.get(sq);
    if (pc && pc.color === state.playerColor &&
        state.game.turn() === state.playerColor) {
      state.selected = sq;
      state.targets = state.game.moves({ square: sq, verbose: true });
      showSelection();
    } else {
      clearSelection();
      showSelection();
    }
  }

  function applyPlayerMove(vm) {
    var mv = state.game.move(vm);
    clearSelection();
    if (!mv) { setStatus('Langkah tidak sah.'); return; }
    afterMoveApplied(mv);
  }

  // ==================================================
  // Promosi bidak
  // ==================================================

  function openPromoDialog(variants) {
    state.pendingPromo = variants;
    state.phase = 'promo';
    document.getElementById('promo-modal').hidden = false;
  }

  function closePromoDialog() {
    document.getElementById('promo-modal').hidden = true;
    state.pendingPromo = null;
  }

  function onPromoChoice(pieceCode) {
    if (!state.pendingPromo) return;
    var match = null;
    state.pendingPromo.forEach(function (m) {
      if (m.promotion === pieceCode) match = m;
    });
    closePromoDialog();
    state.phase = 'idle';
    if (match) applyPlayerMove(match);
  }

  // ==================================================
  // Aliran langkah dan giliran
  // ==================================================

  function afterMoveApplied(mv) {
    state.phase = 'animating';
    state.lastMove = { from: mv.from, to: mv.to };
    refreshPanels();

    animateMove(mv, function () {
      rebuildPieces();
      refreshOverlays();
      refreshPanels();
      if (state.game.game_over()) {
        finishGame();
        return;
      }
      if (state.game.turn() === aiColor()) {
        scheduleAI();
      } else {
        state.phase = 'idle';
        setStatusByTurn();
        setButtons();
      }
    });
  }

  function animateMove(mv, done) {
    var obj = null;
    k.get('piece').forEach(function (p) {
      if (p.square === mv.from) obj = p;
    });
    var target = sqToXY(mv.to);

    if (!obj || typeof obj.tween !== 'function') { done(); return; }

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      done();
    }

    // Jaring keselamatan: pastikan animasi sentiasa tamat.
    var guard = setTimeout(finish, ANIM_MS + 300);

    try {
      var handle = obj.tween(
        obj.pos.clone(),
        k.vec2(target.cx, target.cy),
        ANIM_MS / 1000,
        function (v) { if (!finished && v) obj.pos = v; }
      );
      if (handle && typeof handle.then === 'function') {
        handle.then(function () { clearTimeout(guard); finish(); });
      }
    } catch (err) {
      clearTimeout(guard);
      finish();
    }
  }

  function scheduleAI() {
    if (state.game.game_over()) { finishGame(); return; }
    state.phase = 'thinking';
    setStatus('AI berfikir\u2026');
    setButtons();
    // Delay pendek supaya mesej "AI berfikir" sempat dipapar.
    state.thinkTimer = setTimeout(function () {
      var res = ChessAI.findBestMove(state.game, state.difficulty);
      if (!res) { finishGame(); return; }
      var mv = state.game.move(res.move);
      if (!mv) { finishGame(); return; }
      afterMoveApplied(mv);
    }, 300);
  }

  function finishGame() {
    state.phase = 'over';
    clearSelection();
    refreshOverlays();
    refreshPanels();
    setButtons();

    var g = state.game;
    var msg;
    if (g.in_checkmate()) {
      msg = g.turn() === state.playerColor
        ? 'Skakmat \u2014 Komputer menang!'
        : 'Skakmat \u2014 Anda menang!';
    } else if (g.in_stalemate()) {
      msg = 'Pat \u2014 Seri.';
    } else if (g.insufficient_material()) {
      msg = 'Seri \u2014 bahan tidak cukup.';
    } else if (g.in_threefold_repetition()) {
      msg = 'Seri \u2014 ulangan tiga kali.';
    } else if (g.in_draw()) {
      msg = 'Seri \u2014 undang-undang 50 langkah.';
    } else {
      msg = 'Permainan tamat.';
    }
    setStatus(msg);
  }

  function setStatusByTurn() {
    var g = state.game;
    var base = 'Giliran anda';
    if (g.in_check()) base = 'Skak! Giliran anda';
    setStatus(base);
  }

  // ==================================================
  // Kawalan permainan
  // ==================================================

  function startNewGame() {
    clearTimeout(state.thinkTimer);
    closePromoDialog();
    state.game = new Chess();
    state.selected = null;
    state.targets = [];
    state.lastMove = null;
    state.phase = 'idle';
    clearSelection();
    rebuildPieces();
    refreshOverlays();
    refreshPanels();
    setButtons();
    if (state.playerColor === aiColor()) scheduleAI(); // pemain hitam: AI dulu
    else setStatusByTurn();
  }

  function undoPair() {
    if (state.phase === 'animating' || state.phase === 'promo') return;
    if (state.game.history().length === 0) return;
    clearTimeout(state.thinkTimer);

    // Undur sehingga giliran semula kepada pemain.
    do { state.game.undo(); }
    while (state.game.history().length > 0 &&
           state.game.turn() !== state.playerColor);

    state.pendingPromo = null;
    closePromoDialog();

    var hist = state.game.history({ verbose: true });
    state.lastMove = hist.length > 0
      ? { from: hist[hist.length - 1].from, to: hist[hist.length - 1].to }
      : null;

    state.phase = 'idle';
    clearSelection();
    rebuildPieces();
    refreshOverlays();
    refreshPanels();
    setButtons();

    if (state.game.game_over()) { finishGame(); return; }
    if (state.game.turn() !== state.playerColor) scheduleAI();
    else setStatusByTurn();
  }

  function setDifficulty(key, btnId) {
    state.difficulty = key;
    document.querySelectorAll('.diff-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    document.getElementById(btnId).classList.add('active');
  }

  function toggleSide() {
    state.playerColor = aiColor();
    document.getElementById('btn-side').textContent = state.playerColor === 'w'
      ? 'Main sebagai Hitam'
      : 'Main sebagai Putih';
    // Orientasi papan berubah: bina semula elemen statik dan bidak.
    k.destroyAll('tile');
    k.destroyAll('static');
    buildBoard();
    startNewGame();
  }

  // ==================================================
  // Panel DOM: status, butang, senarai langkah, bidak ditangkap
  // ==================================================

  function setStatus(text) {
    document.getElementById('status').textContent = text;
  }

  function setButtons() {
    var busy = state.phase === 'thinking' || state.phase === 'animating' ||
               state.phase === 'promo';
    document.getElementById('btn-undo').disabled =
      busy || state.game.history().length === 0;
  }

  function refreshPanels() {
    renderMoveList();
    renderCaptured();
    setButtons();
  }

  function renderMoveList() {
    var ol = document.getElementById('movelist');
    var san = state.game.history();
    var htmlParts = [];
    for (var i = 0; i < san.length; i += 2) {
      htmlParts.push(
        '<li><span class="num">' + (i / 2 + 1) + '.</span>' +
        '<span>' + esc(san[i]) + '</span>' +
        '<span>' + (san[i + 1] ? esc(san[i + 1]) : '') + '</span></li>'
      );
    }
    ol.innerHTML = htmlParts.join('');
    ol.scrollTop = ol.scrollHeight;
  }

  function renderCaptured() {
    var byPlayerEl = document.getElementById('cap-by-player');
    var byAiEl = document.getElementById('cap-by-ai');
    var mine = [];
    var theirs = [];
    state.game.history({ verbose: true }).forEach(function (m) {
      if (!m.captured) return;
      if (m.color === state.playerColor) mine.push(m.captured);
      else theirs.push(m.captured);
    });
    mine.sort(function (a, b) { return CAP_VALUE[b] - CAP_VALUE[a]; });
    theirs.sort(function (a, b) { return CAP_VALUE[b] - CAP_VALUE[a]; });

    var enemyColor = aiColor();
    byPlayerEl.innerHTML = mine.map(function (t) {
      return '<span class="' + CAP_CLASS[enemyColor] + '">' + GLYPH[t] +
             '</span>';
    }).join('');
    byAiEl.innerHTML = theirs.map(function (t) {
      return '<span class="' + CAP_CLASS[state.playerColor] + '">' + GLYPH[t] +
             '</span>';
    }).join('');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  // ==================================================
  // Pendaftaran UI dan permulaan
  // ==================================================

  function registerUI() {
    document.getElementById('btn-new').addEventListener('click', startNewGame);
    document.getElementById('btn-undo').addEventListener('click', undoPair);
    document.getElementById('btn-side').addEventListener('click', toggleSide);
    document.getElementById('btn-easy').addEventListener('click', function () {
      setDifficulty('mudah', 'btn-easy');
    });
    document.getElementById('btn-medium').addEventListener('click', function () {
      setDifficulty('sederhana', 'btn-medium');
    });
    document.getElementById('btn-hard').addEventListener('click', function () {
      setDifficulty('sukar', 'btn-hard');
    });
    document.querySelectorAll('.promo-choices .btn').forEach(function (b) {
      b.addEventListener('click', function () {
        onPromoChoice(b.getAttribute('data-p'));
      });
    });
  }

  function boot() {
    if (state.started) return;
    state.started = true;
    rebuildPieces();
    refreshOverlays();
    setStatusByTurn();
    setButtons();
  }

  function main() {
    if (typeof kaplay === 'undefined' || typeof Chess === 'undefined') {
      setStatus('Ralat: library gagal dimuatkan.');
      return;
    }
    initKaplay();
    registerUI();
    k.onLoad(boot);
    // Sandaran sekiranya onLoad tidak terpicu.
    setTimeout(boot, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
