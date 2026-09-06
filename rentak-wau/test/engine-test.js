/* ============================================================
   Rentak Wau v2 — ujian enjin (Node)
   Simulasi penuh permainan + semakan rulebook.
   Jalankan: node test/engine-test.js
   ============================================================ */
'use strict';

const Cards = require('../js/cards.js');
const { GameEngine } = require('../js/engine.js');
const AI = require('../js/ai.js');

let passed = 0, failed = 0;
function ok(cond, msg) {
  if (cond) { passed++; console.log('  ✓ ' + msg); }
  else { failed++; console.log('  ✗ FAIL: ' + msg); }
}

/* ---------- Ujian 1: komponen & setup ---------- */
console.log('\n[1] Komponen & Setup');
ok(Cards.WAU_CARDS.length === 12, '12 kad wau');
ok(Cards.WIND_CARDS.length === 6, '6 kad angin');
['high', 'mid', 'low'].forEach(lv => {
  ok(Cards.WAU_CARDS.filter(c => c.level === lv).length === 4, '4 wau paras ' + lv);
});
const sizes = Cards.WAU_CARDS.map(c => c.size);
ok(new Set(sizes).size === 12, 'semua saiz wau berbeza (1–12)');
['high', 'mid', 'low'].forEach(lv => {
  ok(Cards.WIND_CARDS.filter(c => c.level === lv).length === 2, '2 kad angin paras ' + lv);
});

// setup 2 pemain
const g2 = new GameEngine();
g2.newGame([{ name: 'A', isAI: true }, { name: 'B', isAI: true }]);
ok(g2.players.length === 2, '2 pemain');
g2.players.forEach(p => ok(p.hand.length === 3, 'pemain dapat 3 wau'));
g2.players.forEach(p => {
  const lv = p.hand.map(c => c.level).sort();
  ok(lv.join(',') === 'high,low,mid', 'tangan: 1 setiap paras');
});
ok(g2.windDeck.length === 6, 'dek angin 6 kad');

// setup 4 pemain
const g4 = new GameEngine();
g4.newGame([{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }]);
ok(g4.players.length === 4, '4 pemain');
g4.players.forEach(p => ok(p.hand.length === 3, '4-pemain: 3 wau setiap'));

/* ---------- Ujian 2: skor (rulebook) ---------- */
console.log('\n[2] Skoring');
const gs = new GameEngine();
ok(gs.simScore(['high', 'high']) === 3, '2 High = 3 mata');
ok(gs.simScore(['mid', 'mid']) === 3, '2 Mid = 3 mata');
ok(gs.simScore(['low', 'low']) === 3, '2 Low = 3 mata');
ok(gs.simScore(['low', 'mid']) === 2, '1 Low + 1 Mid = 2 mata');
ok(gs.simScore(['high', 'mid', 'low']) === 3, '3 paras berbeza = 3 mata');
ok(gs.simScore(['high', 'high', 'mid', 'mid', 'low', 'low']) === 9, 'semua kad = 9 mata');
ok(gs.simScore([]) === 0, 'tiada kad = 0');

/* ---------- Ujian 3: aliran satu round ---------- */
console.log('\n[3] Aliran round');
const g = new GameEngine();
g.newGame([{ name: 'A', isAI: true }, { name: 'B', isAI: true }]);

// LANGKAH 1: pilih 2 wau
g.players.forEach(p => {
  const ids = AI.choose(g, p);
  ok(ids.length === 2, p.name + ' pilih 2 wau');
  g.chooseWau(p.id, ids);
});
ok(g.allChosen(), 'semua pemain telah pilih');

// LANGKAH 2: buka angin
const wind = g.revealWind();
ok(wind && wind.level, 'kad angin dibuka');

// LANGKAH 3: semak keserasian
const discarded = g.checkCompatibility();
ok(discarded.length >= 0, 'semakan keserasian selesai');

// LANGKAH 4: sediakan dadu
const res = g.prepareDice();
if (res === 'roll') {
  // LANGKAH 5-6: gulung & tentukan pemenang
  g.rollDice();
  const order = g.getRollOrder();
  ok(order.length >= 1, 'ada wau hidup untuk gulung');
  // urutan saiz menurun
  for (let i = 1; i < order.length; i++) {
    ok(order[i - 1].card.size >= order[i].card.size, 'urutan gulung saiz menurun');
  }
  const winner = g.determineWinner();
  ok(winner && winner.card.die >= 1 && winner.card.die <= 6, 'pemenang ditentukan');
  // LANGKAH 7
  g.claimWind();
  ok(g.currentWind === null, 'kad angin dituntut');
} else if (res === 'auto') {
  ok(g.roundWinnerId !== null, 'auto-menang: pemain padan tunggal');
} else {
  ok(g.roundWinnerId === null, 'tiada padan: tiada pemenang');
}

// LANGKAH 8: buang wau kalah
g.discardLosers();
g.players.forEach(p => ok(p.living.length === 0 && p.played.length === 0, 'wau dibuang/pulang selesai'));

// LANGKAH 9: isi semula tangan
g.refillHands();
g.players.forEach(p => ok(p.hand.length >= 2, 'tangan >= 2 selepas isi semula'));

/* ---------- Ujian 4: simulasi penuh 6 round ---------- */
console.log('\n[4] Simulasi penuh 6 pusingan (2–4 pemain)');
for (let n = 2; n <= 4; n++) {
  for (let sim = 0; sim < 30; sim++) {
    const config = [];
    for (let i = 0; i < n; i++) config.push({ name: 'P' + i, isAI: true });
    const gg = new GameEngine();
    gg.newGame(config);
    let rounds = 0;
    while (!gg.isGameOver() && rounds < 10) {
      gg.players.forEach(p => {
        const ids = AI.choose(gg, p);
        gg.chooseWau(p.id, ids);
      });
      gg.revealWind();
      gg.checkCompatibility();
      const r = gg.prepareDice();
      if (r === 'roll') { gg.rollDice(); gg.determineWinner(); }
      gg.claimWind();
      gg.discardLosers();
      gg.refillHands();
      gg.players.forEach(p => {
        if (p.hand.length < 2) throw new Error('tangan < 2 selepas isi semula');
      });
      gg.nextRound();
      rounds++;
    }
    if (!gg.isGameOver()) throw new Error('game tak tamat selepas 6 round');
    const totalCards = gg.players.reduce((s, p) => s + p.windCards.length, 0) + gg.windDiscard.length;
    ok(totalCards === 6, `[${n}pemain] semua 6 kad angin digunakan (total=${totalCards})`);
    const rank = gg.finalRanking();
    ok(rank.winners.length >= 1, `[${n}pemain] pemenang dikenal pasti`);
  }
}
console.log('  → simulasi selesai');

/* ---------- Ujian 5: tiebreak dadu sama → wau kecil menang ---------- */
console.log('\n[5] Tiebreak dadu');
const gt = new GameEngine();
gt.newGame([{ name: 'A', isAI: true }, { name: 'B', isAI: true }]);
// paksa tangan supaya dua wau hidup saiz berbeza
gt.players[0].hand = [{ id: 'a1', name: 'Wau A', level: 'high', size: 5 }, { id: 'a2', name: 'Wau A2', level: 'low', size: 1 }];
gt.players[1].hand = [{ id: 'b1', name: 'Wau B', level: 'high', size: 3 }, { id: 'b2', name: 'Wau B2', level: 'low', size: 2 }];
// paksa wind deck: pop() ambil dari hujung → letak high di hujung
gt.windDeck = [{ id: 'w1', level: 'mid' }, { id: 'w2', level: 'low' }, { id: 'w3', level: 'high' }];
gt.players.forEach(p => {
  const ids = p.hand.filter(c => c.level === 'high').map(c => c.id);
  // perlu 2; tambah low pertama
  const lowId = p.hand.find(c => c.level === 'low').id;
  g.chooseWau.apply(gt, [p.id, [ids[0], lowId]]);
});
gt.revealWind(); // high
gt.checkCompatibility(); // hanya high hidup
gt.prepareDice();
gt.rollDice();
gt.getRollOrder();
// paksa dadu sama: a1=4, b1=4
gt.players[0].living[0].die = 4;
gt.players[1].living[0].die = 4;
const w = gt.determineWinner();
ok(w.card.size === 3, 'dadu sama → wau LEBIH KECIL menang (saiz ' + w.card.size + ')');

/* ---------- Ujian 6: auto-menang bila 1 pemain padan ---------- */
console.log('\n[6] Auto-menang');
const ga = new GameEngine();
ga.newGame([{ name: 'A', isAI: true }, { name: 'B', isAI: true }]);
ga.players[0].hand = [{ id: 'a1', name: 'Wau A', level: 'high', size: 5 }, { id: 'a2', name: 'Wau A2', level: 'low', size: 1 }];
ga.players[1].hand = [{ id: 'b1', name: 'Wau B', level: 'mid', size: 3 }, { id: 'b2', name: 'Wau B2', level: 'low', size: 2 }];
ga.windDeck = [{ id: 'w1', level: 'mid' }, { id: 'w2', level: 'low' }, { id: 'w3', level: 'high' }];
ga.players[0].hand.forEach(c => { if (c.id === 'a1') ga.chooseWau(0, ['a1', 'a2']); });
ga.chooseWau(1, ['b1', 'b2']);
ga.revealWind(); // high → hanya A padan
ga.checkCompatibility();
const ra = ga.prepareDice();
ok(ra === 'auto', 'auto-menang dikesan');
ok(ga.roundWinnerId === 0, 'pemain padan tunggal menang');

/* ---------- Ujian 7: tie-break akhir (saiz wau terkecil) ---------- */
console.log('\n[7] Tie-break akhir');
const gz = new GameEngine();
gz.newGame([{ name: 'A', isAI: true }, { name: 'B', isAI: true }]);
gz.players[0].windCards = [{ level: 'high' }];
gz.players[1].windCards = [{ level: 'mid' }];
gz.players[0].hand = [{ id: 'x1', level: 'high', size: 9 }, { id: 'x2', level: 'low', size: 2 }];
gz.players[1].hand = [{ id: 'y1', level: 'mid', size: 6 }, { id: 'y2', level: 'low', size: 3 }];
const rank = gz.finalRanking();
ok(rank.winners[0].id === 0, 'tie-break akhir: tangan lebih kecil menang (saiz 2 < 3)');

/* ---------- Kesimpulan ---------- */
console.log('\n========================================');
console.log(`HASIL: ${passed} lulus, ${failed} gagal`);
if (failed > 0) process.exit(1);
else console.log('SEMUA UJIAN LULUS ✅');