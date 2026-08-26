/*
 * Ujian enjin AI catur tanpa Kaplay.
 * Jalankan: node test\ai_test.js
 *
 * Mengesahkan:
 *  1. Skakmat satu langkah dijumpai (kesukaran sukar).
 *  2. Langkah en passant sah dijumpai bila menguntungkan.
 *  3. Promosi ke queen dijumpai.
 *  4. Simulasi 20 setengah-langkah untuk setiap kesukaran:
 *     semua langkah sah, tiada pengecualian, masa per langkah < 2 saat.
 */
'use strict';

var path = require('path');
var chessModule = require(path.join(__dirname, '..', 'libs', 'chess.min.js'));
var Chess = chessModule.Chess || chessModule;
var ChessAI = require(path.join(__dirname, '..', 'js', 'ai.js'));

var failures = 0;
function check(cond, msg) {
  if (cond) {
    console.log('  LULUS: ' + msg);
  } else {
    failures++;
    console.error('  GAGAL: ' + msg);
  }
}

// ---------------------------------------------------------------
console.log('[1] Skakmat satu langkah: Re8#');
(function () {
  var fen = '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1';
  var game = new Chess(fen);
  var res = ChessAI.findBestMove(game, 'sukar');
  check(res !== null, 'AI pulangkan langkah');
  var probe = new Chess(fen);
  var applied = probe.move(res.move);
  check(!!applied, 'langkah ' + res.move.from + res.move.to + ' sah pada chess.js');
  check(probe.in_checkmate(), 'hasil langkah ialah skakmat');
  check(res.move.to === 'e8', 'sasaran langkah ialah e8 (dapat: ' + res.move.to + ')');
})();

// ---------------------------------------------------------------
console.log('[2] En passant: exd6 menguntungkan');
(function () {
  var fen = '7k/8/8/3pP3/8/8/8/7K w - d6 0 1';
  var game = new Chess(fen);
  var legal = game.moves({ verbose: true }).some(function (m) {
    return m.from === 'e5' && m.to === 'd6' && m.flags.indexOf('e') >= 0;
  });
  check(legal, 'chess.js jana langkah en passant e5xd6');
  var res = ChessAI.findBestMove(game, 'sukar');
  var probe = new Chess(fen);
  check(!!probe.move(res.move), 'langkah AI sah');
  check(res.move.to === 'd6',
    'AI pilih en passant d6 (dapat: ' + res.move.from + '-' + res.move.to + ')');
})();

// ---------------------------------------------------------------
console.log('[3] Promosi bidak: a8=Menteri');
(function () {
  var fen = '8/P6k/8/8/8/8/8/K7 w - - 0 1';
  var game = new Chess(fen);
  var res = ChessAI.findBestMove(game, 'sukar');
  var probe = new Chess(fen);
  check(!!probe.move(res.move), 'langkah AI sah');
  check(res.move.to === 'a8', 'AI main a7-a8 (dapat: ' + res.move.from + res.move.to + ')');
  check(res.move.promotion === 'q', 'promosi ke Menteri (dapat: ' + res.move.promotion + ')');
})();

// ---------------------------------------------------------------
console.log('[4] Simulasi 20 setengah-langkah bagi setiap kesukaran');
(function () {
  var difficulties = ['mudah', 'sederhana', 'sukar'];
  difficulties.forEach(function (diff) {
    var game = new Chess();
    var times = [];
    var plies = 0;
    var ok = true;

    while (plies < 20 && !game.game_over()) {
      var t0 = Date.now();
      var res = ChessAI.findBestMove(game, diff);
      times.push(Date.now() - t0);
      if (!res) { ok = false; break; }
      var applied = game.move(res.move);
      if (!applied) {
        ok = false;
        console.error('  langkah TIDAK SAH: ' + JSON.stringify(res.move));
        break;
      }
      plies++;
    }

    var maxMs = Math.max.apply(null, times.concat([0]));
    var avgMs = times.length
      ? Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length)
      : 0;

    check(ok && plies === 20,
      '[' + diff + '] 20 langkah lengkap, semua sah (' + plies + ' ply)');
    check(maxMs < 2000,
      '[' + diff + '] masa maksimum ' + maxMs + ' ms < 2000 ms' +
      ' (purata ' + avgMs + ' ms)');
    console.log('  akhiran FEN: ' + game.fen().split(' ').slice(0, 4).join(' '));
  });
})();

// ---------------------------------------------------------------
console.log('');
if (failures === 0) {
  console.log('SEMUA UJIAN LULUS.');
} else {
  console.error(failures + ' ujian GAGAL.');
}
process.exit(failures === 0 ? 0 : 1);
