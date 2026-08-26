/*
 * Enjin AI catur - minimax dengan alpha-beta pruning.
 * Tiada import terus: contoh chess.js dipass masuk ke findBestMove().
 * Boleh digunakan dalam pelayar (global ChessAI) dan Node (module.exports).
 *
 * Evaluasi: material (P=1,N=3,B=3,R=5,Q=9 dalam skala 100x) +
 * piece-square table ringkas + jitter rawak untuk kesukaran rendah.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ChessAI = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Nilai material dalam sentipion (100 = nilai pawn penuh).
    var VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
    var MATE = 100000;
    var TIME_BUDGET_MS = 1600; // had masa carian per langkah

    /*
     * Piece-square table (gaya "Simplified Evaluation Function").
     * Susunan dari perspektif putih: indeks 0 = a8, indeks 63 = h1.
     * chess.js board() turut mengembalikan baris bermula rank 8,
     * jadi indeks terus padan untuk bidak putih; bidak hitam dicerminkan.
     */
    var PST = {
        p: [
             0,  0,  0,  0,  0,  0,  0,  0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 30, 30, 20, 10, 10,
             5,  5, 10, 25, 25, 10,  5,  5,
             0,  0,  0, 20, 20,  0,  0,  0,
             5, -5, -10,  0,  0, -10, -5,  5,
             5, 10, 10, -20, -20, 10, 10,  5,
             0,  0,  0,  0,  0,  0,  0,  0
        ],
        n: [
            -50, -40, -30, -30, -30, -30, -40, -50,
            -40, -20,   0,   0,   0,   0, -20, -40,
            -30,   0,  10,  15,  15,  10,   0, -30,
            -30,   5,  15,  20,  20,  15,   5, -30,
            -30,   0,  15,  20,  20,  15,   0, -30,
            -30,   5,  10,  15,  15,  10,   5, -30,
            -40, -20,   0,   5,   5,   0, -20, -40,
            -50, -40, -30, -30, -30, -30, -40, -50
        ],
        b: [
            -20, -10, -10, -10, -10, -10, -10, -20,
            -10,   0,   0,   0,   0,   0,   0, -10,
            -10,   0,   5,  10,  10,   5,   0, -10,
            -10,   5,   5,  10,  10,   5,   5, -10,
            -10,   0,  10,  10,  10,  10,   0, -10,
            -10,  10,  10,  10,  10,  10,  10, -10,
            -10,   5,   0,   0,   0,   0,   5, -10,
            -20, -10, -10, -10, -10, -10, -10, -20
        ],
        r: [
              0,   0,   0,   0,   0,   0,   0,   0,
              5,  10,  10,  10,  10,  10,  10,   5,
             -5,   0,   0,   0,   0,   0,   0,  -5,
             -5,   0,   0,   0,   0,   0,   0,  -5,
             -5,   0,   0,   0,   0,   0,   0,  -5,
             -5,   0,   0,   0,   0,   0,   0,  -5,
             -5,   0,   0,   0,   0,   0,   0,  -5,
              0,   0,   0,   5,   5,   0,   0,   0
        ],
        q: [
            -20, -10, -10,  -5,  -5, -10, -10, -20,
            -10,   0,   0,   0,   0,   0,   0, -10,
            -10,   0,   5,   5,   5,   5,   0, -10,
             -5,   0,   5,   5,   5,   5,   0,  -5,
              0,   0,   5,   5,   5,   5,   0,  -5,
            -10,   5,   5,   5,   5,   5,   0, -10,
            -10,   0,   5,   0,   0,   0,   0, -10,
            -20, -10, -10,  -5,  -5, -10, -10, -20
        ],
        k: [
            -30, -40, -40, -50, -50, -40, -40, -30,
            -30, -40, -40, -50, -50, -40, -40, -30,
            -30, -40, -40, -50, -50, -40, -40, -30,
            -30, -40, -40, -50, -50, -40, -40, -30,
            -20, -30, -30, -40, -40, -30, -30, -20,
            -10, -20, -20, -20, -20, -20, -20, -10,
             20,  20,   0,   0,   0,   0,  20,  20,
             20,  30,  10,   0,   0,  10,  30,  20
        ]
    };

    /*
     * Profil kesukaran:
     *  mudah     - kedalaman 1, pilih rawak antara beberapa langkah teratas.
     *  sederhana - kedalaman 2 (naik ke 3 jika langkah sedikit).
     *  sukar     - kedalaman 3 (naik ke 4 jika langkah sedikit, turun jika ramai).
     */
    var PROFILES = {
        mudah:     { depth: 1, topN: 3, jitter: 55 },
        sederhana: { depth: 2, topN: 1, jitter: 12 },
        sukar:     { depth: 3, topN: 1, jitter: 0 }
    };

    // Skor statik dari perspektif pihak yang giliran (negamax).
    function evaluate(game) {
        var board = game.board();
        var score = 0;
        for (var r = 0; r < 8; r++) {
            var row = board[r];
            for (var c = 0; c < 8; c++) {
                var pc = row[c];
                if (!pc) continue;
                var idx = pc.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;
                var v = VALUE[pc.type] + PST[pc.type][idx];
                score += pc.color === 'w' ? v : -v;
            }
        }
        return game.turn() === 'w' ? score : -score;
    }

    // Move ordering: tangkapan dulu (MVV-LVA), kemudian promosi.
    function orderScore(m) {
        var s = 0;
        if (m.captured) s += 1000 + VALUE[m.captured] * 10 - VALUE[m.piece];
        if (m.promotion) s += 800 + VALUE[m.promotion];
        return s;
    }

    function negamax(game, depth, alpha, beta, ply, ctx) {
        ctx.nodes++;
        if ((ctx.nodes & 1023) === 0 && Date.now() > ctx.deadline) {
            ctx.aborted = true;
        }
        if (ctx.aborted) return evaluate(game);

        if (depth === 0) {
            // Semak skakmat hanya bila sedang diserang (murah berkat litar pintas).
            if (game.in_check() && game.in_checkmate()) return -(MATE - ply);
            return evaluate(game);
        }

        var moves = game.moves({ verbose: true });
        if (moves.length === 0) {
            if (game.in_check()) return -(MATE - ply); // sedang diskakmat
            return 0;                                   // pat (seri)
        }

        moves.sort(function (a, b) { return orderScore(b) - orderScore(a); });

        var best = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            var sc = -negamax(game, depth - 1, -beta, -alpha, ply + 1, ctx);
            game.undo();
            if (ctx.aborted) return best === -Infinity ? sc : best;
            if (sc > best) best = sc;
            if (best > alpha) alpha = best;
            if (alpha >= beta) break; // pemotongan alpha-beta
        }
        return best;
    }

    // Sesuaikan kedalaman ikut bilangan langkah sah supaya kekal pantas.
    function pickDepth(nMoves, profile) {
        var d = profile.depth;
        if (profile.topN !== 1) return d; // mudah: sentiasa kedalaman 1
        if (d === 2 && nMoves <= 12) d = 3;
        if (d === 3) {
            if (nMoves <= 16) d = 4;
            else if (nMoves >= 46) d = 2;
        }
        return d;
    }

    /*
     * Cari langkah terbaik untuk pihak yang giliran pada contoh chess.js.
     * Pulangkan null jika tiada langkah (permainan tamat).
     * Hasil: { move, scoreCp, depth, nodes, ms, aborted, difficulty }
     *   move ialah objek verbose chess.js - boleh terus dipass ke game.move().
     */
    function findBestMove(game, difficulty) {
        var key = Object.prototype.hasOwnProperty.call(PROFILES, difficulty)
            ? difficulty : 'sederhana';
        var profile = PROFILES[key];
        var t0 = Date.now();

        var rootMoves = game.moves({ verbose: true });
        if (rootMoves.length === 0) return null;

        var ctx = { nodes: 0, aborted: false, deadline: t0 + TIME_BUDGET_MS };
        var depth = pickDepth(rootMoves.length, profile);

        rootMoves.sort(function (a, b) { return orderScore(b) - orderScore(a); });

        var scored = [];
        var alpha = -Infinity;
        for (var i = 0; i < rootMoves.length; i++) {
            var m = rootMoves[i];
            game.move(m);
            var sc = -negamax(game, depth - 1, -Infinity, -alpha, 1, ctx);
            game.undo();
            if (profile.jitter > 0) sc += (Math.random() * 2 - 1) * profile.jitter;
            scored.push({ move: m, score: sc });
            if (sc > alpha) alpha = sc;
            if (ctx.aborted || Date.now() > ctx.deadline) break;
        }

        scored.sort(function (a, b) { return b.score - a.score; });

        // Kesukaran rendah: pilih rawak antara beberapa langkah teratas.
        var pick = scored[0];
        if (profile.topN > 1 && scored.length > 1) {
            var pool = scored.slice(0, Math.min(profile.topN, scored.length));
            var total = 0, j;
            for (j = 0; j < pool.length; j++) total += 1 / (j + 1);
            var rr = Math.random() * total;
            for (j = 0; j < pool.length; j++) {
                rr -= 1 / (j + 1);
                if (rr <= 0) { pick = pool[j]; break; }
            }
        }

        return {
            move: pick.move,
            scoreCp: Math.round(pick.score),
            depth: depth,
            nodes: ctx.nodes,
            ms: Date.now() - t0,
            aborted: ctx.aborted,
            difficulty: key
        };
    }

    return {
        findBestMove: findBestMove,
        evaluate: evaluate,
        PROFILES: PROFILES,
        VERSION: '1.0.0'
    };
}));
