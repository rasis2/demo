/* ============================================================
   Rentak Wau v2 — engine.js
   Enjin permainan tulen (tiada DOM). Boleh diuji dalam Node
   dan dipacu oleh UI. Melaksanakan rulebook v1.3.6 sepenuhnya.
   ============================================================ */
(function (root) {
  'use strict';

  var Cards = (typeof module !== 'undefined' && module.exports) ? require('./cards.js') : root.RentakCards;

  var MAX_ROUNDS = 6; // 6 Wind Cards sahaja

  function cloneWau(c) { return { id: c.id, name: c.name, level: c.level, size: c.size }; }
  function cloneWind(w) { return { id: w.id, level: w.level }; }

  function GameEngine(rng) {
    this.rng = (typeof rng === 'function') ? rng : Math.random;
    this.players = [];
    this.wauDeck = [];      // wau tidak teragih (longgokan awal)
    this.windDeck = [];
    this.windDiscard = [];  // kad angin yang tidak dituntut
    this.discardPile = [];  // longgokan wau
    this.currentWind = null;
    this.round = 1;
    this.phase = 'choose';  // choose | reveal | compat | dice | claim | refill | end
    this.roundWinnerId = null;
    this.roundWinnerWauId = null;
    this.rollOrder = [];    // urutan gulung dadu (saiz menurun)
    this.autoWin = false;
    this.noMatch = false;
    this.log = [];
  }

  GameEngine.prototype._rand = function (n) { return Math.floor(this.rng() * n); };
  GameEngine.prototype._log = function (msg) { this.log.push(msg); if (this.log.length > 200) this.log.shift(); };

  /* ---------------- SETUP ---------------- */
  GameEngine.prototype.newGame = function (playerConfigs) {
    var self = this;
    this.players = playerConfigs.map(function (c, i) {
      return {
        id: i,
        name: c.name || ('Pemain ' + (i + 1)),
        isAI: !!c.isAI,
        hand: [],
        played: [],
        living: [],
        windCards: [],
        score: 0
      };
    });
    if (this.players.length < 2 || this.players.length > 4) {
      throw new Error('Perlukan 2–4 pemain');
    }

    // SETUP 1: kocok semua wau; SETUP 2: draft (cadangan 1 setiap paras)
    var byLevel = { high: [], mid: [], low: [] };
    Cards.WAU_CARDS.forEach(function (c) { byLevel[c.level].push(cloneWau(c)); });
    var levels = ['high', 'mid', 'low'];
    var leftovers = [];
    var self2 = this;
    levels.forEach(function (lv) {
      var pool = Cards.shuffle(byLevel[lv]);
      // beri satu setiap pemain (ikut urutan pemain)
      self2.players.forEach(function (p, idx) {
        p.hand.push(pool[idx]);
      });
      // lebihan ke longgokan
      for (var k = self2.players.length; k < pool.length; k++) leftovers.push(pool[k]);
    });
    this.discardPile = Cards.shuffle(leftovers);

    // SETUP 3: kocok kad angin
    this.windDeck = Cards.shuffle(Cards.WIND_CARDS.map(cloneWind));

    this.round = 1;
    this.phase = 'choose';
    this.roundWinnerId = null;
    this.roundWinnerWauId = null;
    this.autoWin = false;
    this.noMatch = false;
    this.currentWind = null;
    this.log = [];
    this._log('Setup: ' + this.players.length + ' pemain, 3 wau setiap seorang (1 setiap paras angin).');
    return this;
  };

  /* ---------------- LANGKAH 1: PILIH WAU ---------------- */
  GameEngine.prototype.chooseWau = function (playerId, cardIds) {
    var p = this.players[playerId];
    if (!p) throw new Error('Pemain tidak wujud');
    if (cardIds.length !== 2) throw new Error('Pilih tepat 2 wau');
    var played = [];
    cardIds.forEach(function (id) {
      var idx = p.hand.findIndex(function (c) { return c.id === id; });
      if (idx < 0) throw new Error('Wau tidak dalam tangan');
      played.push(p.hand.splice(idx, 1)[0]);
    });
    p.played = played;
    return played;
  };

  GameEngine.prototype.allChosen = function () {
    return this.players.every(function (p) { return p.played.length === 2; });
  };

  /* ---------------- LANGKAH 2: BUKA ANGIN ---------------- */
  GameEngine.prototype.revealWind = function () {
    if (this.windDeck.length === 0) throw new Error('Dek angin kosong');
    this.currentWind = this.windDeck.pop();
    this.phase = 'reveal';
    this._log('Kad angin: ' + Cards.LEVEL[this.currentWind.level].label);
    return this.currentWind;
  };

  /* ---------------- LANGKAH 3: SEMAK KESESUAIAN ---------------- */
  /* Wau yang parasnya tidak padan dengan angin semasa dibuang. */
  GameEngine.prototype.checkCompatibility = function () {
    var self = this;
    var discarded = [];
    this.players.forEach(function (p) {
      p.living = [];
      var keep = [];
      p.played.forEach(function (c) {
        if (c.level === self.currentWind.level) {
          keep.push(c);
          p.living.push(c);
        } else {
          discarded.push(c);
          self.discardPile.push(c);
        }
      });
      p.played = keep;
    });
    this.phase = 'compat';
    if (discarded.length) {
      this._log(discarded.length + ' wau tidak padan dan dibuang.');
    }
    return discarded;
  };

  /* ---------------- LANGKAH 4: SEDIAKAN DADU ---------------- */
  /* Pulangkan 'auto' (auto-menang), 'none' (tiada padan), atau 'roll'. */
  GameEngine.prototype.prepareDice = function () {
    var livingPlayers = this.players.filter(function (p) { return p.living.length > 0; });
    if (livingPlayers.length === 0) {
      this.noMatch = true;
      this.roundWinnerId = null;
      this.phase = 'claim';
      this._log('Tiada wau padan dengan angin — tiada pemenang round ini.');
      return 'none';
    }
    if (livingPlayers.length === 1) {
      this.autoWin = true;
      this.roundWinnerId = livingPlayers[0].id;
      this.phase = 'claim';
      this._log('Hanya ' + livingPlayers[0].name + ' ada wau padan — menang automatik.');
      return 'auto';
    }
    this.phase = 'dice';
    return 'roll';
  };

  /* Senarai wau hidup ikut urutan gulung (saiz paling besar dulu). */
  GameEngine.prototype.getRollOrder = function () {
    var all = [];
    this.players.forEach(function (p) {
      p.living.forEach(function (c) {
        all.push({ playerId: p.id, card: c });
      });
    });
    all.sort(function (a, b) { return b.card.size - a.card.size; });
    this.rollOrder = all;
    return all;
  };

  /* ---------------- LANGKAH 5: GULUNG DADU ---------------- */
  GameEngine.prototype.rollDice = function () {
    var self = this;
    this.players.forEach(function (p) {
      p.living.forEach(function (c) {
        c.die = 1 + self._rand(6);
      });
    });
    this.phase = 'dice';
  };

  /* ---------------- LANGKAH 6: TENTUKAN PEMENANG ROUND ---------------- */
  /* Dadu tertinggi menang; seri → wau LEBIH KECIL menang tie. */
  GameEngine.prototype.determineWinner = function () {
    var all = [];
    this.players.forEach(function (p) {
      p.living.forEach(function (c) {
        all.push({ playerId: p.id, card: c });
      });
    });
    if (all.length === 0) { this.roundWinnerId = null; return; }
    var maxDie = Math.max.apply(null, all.map(function (x) { return x.card.die; }));
    var top = all.filter(function (x) { return x.card.die === maxDie; });
    // tiebreak: saiz paling kecil menang
    top.sort(function (a, b) { return a.card.size - b.card.size; });
    var winner = top[0];
    this.roundWinnerId = winner.playerId;
    this.roundWinnerWauId = winner.card.id;
    this.phase = 'claim';
    this._log('Pemenang round: ' + this.players[winner.playerId].name + ' (' + winner.card.name +
      ', dadu ' + winner.card.die + (top.length > 1 ? ', tie-break saiz kecil' : '') + ').');
    return winner;
  };

  /* ---------------- LANGKAH 7: TUNTUT KAD ANGIN ---------------- */
  GameEngine.prototype.claimWind = function () {
    var wind = this.currentWind;
    if (!wind) return;
    if (this.roundWinnerId !== null && this.players[this.roundWinnerId]) {
      this.players[this.roundWinnerId].windCards.push(wind);
      this._log(this.players[this.roundWinnerId].name + ' menuntut kad angin.');
    } else {
      this.windDiscard.push(wind);
      this._log('Kad angin tidak dituntut (dibuang).');
    }
    this.currentWind = null;
  };

  /* ---------------- LANGKAH 8: BUANG WAU KALAH ---------------- */
  /* Wau menang pulang ke tangan; semua wau lain dibuang. */
  GameEngine.prototype.discardLosers = function () {
    var self = this;
    this.players.forEach(function (p) {
      var keep = [];
      p.living.forEach(function (c) {
        var isWinner;
        if (self.autoWin) {
          // auto-menang: semua wau hidup pemain itu menang
          isWinner = (p.id === self.roundWinnerId);
        } else {
          isWinner = (p.id === self.roundWinnerId && c.id === self.roundWinnerWauId);
        }
        if (isWinner) {
          keep.push(c); // pulang ke tangan
        } else {
          self.discardPile.push(c);
        }
      });
      // pulang wau menang ke tangan
      keep.forEach(function (c) {
        if (c.die) delete c.die;
        p.hand.push(c);
      });
      p.living = [];
      p.played = [];
    });
    this.phase = 'refill';
  };

  /* ---------------- LANGKAH 9: ISI SEMULA TANGAN ---------------- */
  /* Kocok longgokan; pemain dengan <2 wau tarik sehingga ada 2. */
  GameEngine.prototype.refillHands = function () {
    this.discardPile = Cards.shuffle(this.discardPile);
    var self = this;
    this.players.forEach(function (p) {
      while (p.hand.length < 2 && self.discardPile.length > 0) {
        p.hand.push(self.discardPile.pop());
      }
    });
    this.phase = 'refill';
  };

  /* ---------------- LANGKAH 10: ROUND SETERUSNYA ---------------- */
  GameEngine.prototype.nextRound = function () {
    this.round++;
    this.currentWind = null;
    this.roundWinnerId = null;
    this.roundWinnerWauId = null;
    this.autoWin = false;
    this.noMatch = false;
    this.phase = 'choose';
    this._log('Pusingan ' + this.round + ' bermula.');
  };

  GameEngine.prototype.isGameOver = function () {
    // TAMAT GAME: sebaik sahaja semua 6 kad angin didedah & digunakan.
    return this.windDeck.length === 0;
  };

  /* ---------------- SKORING ---------------- */
  /* Setiap kad angin = 1 mata. Setiap pasangan paras sama = +1 bonus. */
  GameEngine.prototype.computeScore = function (windCards) {
    var counts = { high: 0, mid: 0, low: 0 };
    windCards.forEach(function (w) { counts[w.level]++; });
    var score = windCards.length;
    Object.keys(counts).forEach(function (lv) {
      score += Math.floor(counts[lv] / 2); // bonus pasangan
    });
    return score;
  };

  GameEngine.prototype.updateScores = function () {
    var self = this;
    this.players.forEach(function (p) { p.score = self.computeScore(p.windCards); });
  };

  /* ---------------- TAMAT GAME ---------------- */
  /* Menang: skor tertinggi. Seri → pemain dengan saiz wau terkecil
     di tangan (yang masih hidup) menang. */
  GameEngine.prototype.finalRanking = function () {
    var self = this;
    this.updateScores();
    var sorted = this.players.slice().sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      // tie-break: banding saiz wau dalam tangan (naik)
      var ha = a.hand.map(function (c) { return c.size; }).sort(function (x, y) { return x - y; });
      var hb = b.hand.map(function (c) { return c.size; }).sort(function (x, y) { return x - y; });
      var len = Math.max(ha.length, hb.length);
      for (var i = 0; i < len; i++) {
        var sa = ha[i] === undefined ? Infinity : ha[i];
        var sb = hb[i] === undefined ? Infinity : hb[i];
        if (sa !== sb) return sa - sb; // lebih kecil = menang
      }
      return 0; // seri penuh
    });
    var top = sorted[0];
    var winners = sorted.filter(function (p) {
      if (p.score !== top.score) return false;
      var ha = p.hand.map(function (c) { return c.size; }).sort(function (x, y) { return x - y; });
      var hb = top.hand.map(function (c) { return c.size; }).sort(function (x, y) { return x - y; });
      var len = Math.max(ha.length, hb.length);
      for (var i = 0; i < len; i++) {
        var sa = ha[i] === undefined ? Infinity : ha[i];
        var sb = hb[i] === undefined ? Infinity : hb[i];
        if (sa !== sb) return sa === sb; // perlu sama untuk seri
      }
      return true;
    });
    return { sorted: sorted, winners: winners };
  };

  /* Debug/ujian: kiraan skor ringkas */
  GameEngine.prototype.simScore = function (levels) {
    var cards = levels.map(function (lv) { return { level: lv }; });
    return this.computeScore(cards);
  };

  var api = {
    GameEngine: GameEngine,
    MAX_ROUNDS: MAX_ROUNDS,
    cloneWau: cloneWau,
    cloneWind: cloneWind
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  else { root.RentakEngine = api; }
})(typeof window !== 'undefined' ? window : globalThis);