/* ============================================================
   Rentak Wau v2 — The Wau Flying Card Game
   cards.js : Data kad (Wau & Angin) + utiliti
   Zero dependency. Boleh jalan dalam browser & Node.
   ============================================================ */
(function (root) {
  'use strict';

  var LEVEL = {
    high: { key: 'high', label: 'Angin Tinggi', short: 'Tinggi', icon: '💨', color: '#e2593b' },
    mid:  { key: 'mid',  label: 'Angin Sederhana', short: 'Sederhana', icon: '🍃', color: '#3f7fd0' },
    low:  { key: 'low',  label: 'Angin Rendah', short: 'Rendah', icon: '🌿', color: '#4f9e57' }
  };

  /* 12 Wau Cards — 4 setiap paras angin. Setiap wau ada saiz BERBEZA (1..12).
     shade = variasi warna pixel-art dalam paras yang sama. */
  var WAU_CARDS = [
    { id: 'w-h1', name: 'Wau Bulan',     level: 'high', size: 12, shade: 0 },
    { id: 'w-h2', name: 'Wau Kucing',    level: 'high', size: 11, shade: 1 },
    { id: 'w-h3', name: 'Wau Jala Budi', level: 'high', size: 10, shade: 2 },
    { id: 'w-h4', name: 'Wau Kapal',     level: 'high', size: 9,  shade: 3 },
    { id: 'w-m1', name: 'Wau Merak',     level: 'mid',  size: 8,  shade: 0 },
    { id: 'w-m2', name: 'Wau Burung',    level: 'mid',  size: 7,  shade: 1 },
    { id: 'w-m3', name: 'Wau Daun',      level: 'mid',  size: 6,  shade: 2 },
    { id: 'w-m4', name: 'Wau Kenyalang', level: 'mid',  size: 5,  shade: 3 },
    { id: 'w-l1', name: 'Wau Puyuh',     level: 'low',  size: 4,  shade: 0 },
    { id: 'w-l2', name: 'Wau Seri Bulan',level: 'low',  size: 3,  shade: 1 },
    { id: 'w-l3', name: 'Wau Layang',    level: 'low',  size: 2,  shade: 2 },
    { id: 'w-l4', name: 'Wau Barong',    level: 'low',  size: 1,  shade: 3 }
  ];

  /* 6 Wind Cards — 2 setiap paras. */
  var WIND_CARDS = [
    { id: 'wind-1', level: 'high' },
    { id: 'wind-2', level: 'high' },
    { id: 'wind-3', level: 'mid' },
    { id: 'wind-4', level: 'mid' },
    { id: 'wind-5', level: 'low' },
    { id: 'wind-6', level: 'low' }
  ];

  function byLevel(lv) {
    return WAU_CARDS.filter(function (c) { return c.level === lv; });
  }

  /* Fisher-Yates shuffle (salinan baru, tidak ubah input). */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var api = { LEVEL: LEVEL, WAU_CARDS: WAU_CARDS, WIND_CARDS: WIND_CARDS, byLevel: byLevel, shuffle: shuffle };

  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  else { root.RentakCards = api; }
})(typeof window !== 'undefined' ? window : globalThis);