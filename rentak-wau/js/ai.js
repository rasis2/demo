/* ============================================================
   Rentak Wau v2 — ai.js
   AI ringkas tetapi munasabah:
   - Mengira kebarangkalian paras angin seterusnya daripada
     kad angin yang masih tinggal (baca wind yang telah muncul).
   - Pilih 2 wau yang paling mungkin padan dengan angin.
   - Keutamaan kecil: wau lebih kecil menang tiebreak, dan simpan
     wau berguna untuk pusingan akan datang.
   ============================================================ */
(function (root) {
  'use strict';

  var Cards = (typeof module !== 'undefined' && module.exports) ? require('./cards.js') : root.RentakCards;

  var LEVELS = ['high', 'mid', 'low'];

  /* Kira baki kad angin per paras. */
  function remainingWinds(engine) {
    var rem = { high: 2, mid: 2, low: 2 };
    // tolak semua kad angin yang telah dibuka (deck + discard + tangan pemain)
    engine.windDeck.forEach(function (w) { /* masih dalam dek, kira tetap */ });
    // kad angin yang sudah dibuka = windDiscard + semua windCards pemain
    engine.windDiscard.forEach(function (w) { rem[w.level]--; });
    engine.players.forEach(function (p) {
      p.windCards.forEach(function (w) { rem[w.level]--; });
    });
    LEVELS.forEach(function (lv) { if (rem[lv] < 0) rem[lv] = 0; });
    return rem;
  }

  /* Kebarangkalian paras angin seterusnya. */
  function windProbabilities(engine) {
    var rem = remainingWinds(engine);
    var total = rem.high + rem.mid + rem.low;
    var prob = { high: 0, mid: 0, low: 0 };
    if (total === 0) return prob;
    LEVELS.forEach(function (lv) { prob[lv] = rem[lv] / total; });
    return prob;
  }

  /* Nilai pertarungan jika wau paras L dimainkan.
     wauList = senarai wau (mungkin 1 atau 2 padan). */
  function contestValue(wauList, L, playerCount) {
    var matching = wauList.filter(function (w) { return w.level === L; });
    if (matching.length === 0) return 0;
    // asas: kebarangkalian kasar menang jika berdepan pemain lain
    // (lebih ramai pemain = lebih sukar)
    var base = 1 / Math.max(2, playerCount);
    // dadu tambahan = peluang lebih tinggi sedikit
    var extra = (matching.length - 1) * 0.25;
    // tiebreak: wau lebih kecil menang tie → bonus kecil
    var minSize = Math.min.apply(null, matching.map(function (w) { return w.size; }));
    var tieBonus = (13 - minSize) * 0.02;
    return base + extra + tieBonus;
  }

  /* Pilih 2 wau terbaik dari tangan. */
  function choose(engine, player) {
    var hand = player.hand;
    if (hand.length === 2) return hand.map(function (w) { return w.id; });
    if (hand.length < 2) return hand.map(function (w) { return w.id; }); // tepi kes

    var prob = windProbabilities(engine);
    var nPlayers = engine.players.length;
    var combos = [
      [hand[0], hand[1], hand[2]],
      [hand[0], hand[2], hand[1]],
      [hand[1], hand[2], hand[0]]
    ];
    var best = null;
    var bestScore = -Infinity;

    combos.forEach(function (combo) {
      var played = [combo[0], combo[1]];
      var kept = combo[2];
      var score = 0;
      LEVELS.forEach(function (L) {
        var p = prob[L];
        if (p <= 0) return;
        // nilai main 2 wau ini untuk paras L
        score += p * contestValue(played, L, nPlayers);
        // nilai wau yang disimpan (akan kekal untuk pusingan akan datang)
        score += p * 0.5 * (kept.level === L ? 1 / Math.max(2, nPlayers) : 0);
      });
      // bonus kecil: simpan wau bersaiz kecil (bagus untuk tie-break akhir)
      score += (13 - kept.size) * 0.005;
      // sedikit rawak supaya AI tak 100% dijangka
      score += (Math.random() - 0.5) * 0.05;
      if (score > bestScore) { bestScore = score; best = played; }
    });

    return best.map(function (w) { return w.id; });
  }

  var api = { choose: choose, remainingWinds: remainingWinds, windProbabilities: windProbabilities };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  else { root.RentakAI = api; }
})(typeof window !== 'undefined' ? window : globalThis);