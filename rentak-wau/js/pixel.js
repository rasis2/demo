/* ============================================================
   Rentak Wau v2 — pixel.js
   Pelukis seni pixel (canvas). Wau, kad angin, dadu, latar.
   Hanya untuk browser (guna document/canvas).
   ============================================================ */
(function (root) {
  'use strict';

  /* ---------- Sprite Wau (layang-layang) ---------- */
  /* 'X' = badan, '.' = lutsinar. Saiz grid 16 lebar. */

  var SPRITE_CRESCENT = [ // Wau Bulan — bentuk bulan sabit
    '......XXXX......',
    '.....XXXXXX.....',
    '....XXX..XXX....',
    '...XXX....XXX...',
    '..XXX......XXX..',
    '..XXX......XXX..',
    '.XXX........XXX.',
    '.XXX........XXX.',
    '.XXX........XXX.',
    '..XXX......XXX..',
    '..XXX......XXX..',
    '...XXX....XXX...',
    '....XXX..XXX....',
    '.....XXXXXX.....',
    '......XXXX......',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '......XXXX......'
  ];

  var SPRITE_DIAMOND = [ // Wau Kucing — bentuk wajik bertelinga
    '......XXXX......',
    '.....X....X.....',
    '.....X....X.....',
    '....XXXXXXXX....',
    '...XXXXXXXXXX...',
    '..XXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXX.',
    '.XXX..XXXX..XXX.',
    '.XXX..XXXX..XXX.',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '..XXXXXXXXXXXX..',
    '...XXXXXXXXXX...',
    '....XXXXXXXX....',
    '.....XXXXXX.....',
    '......XXXX......',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '......XXXX......'
  ];

  var SPRITE_ROUND = [ // Wau Daun — bentuk bulat
    '.......XX.......',
    '......XXXX......',
    '.....XXXXXX.....',
    '....XXXXXXXX....',
    '...XXXXXXXXXX...',
    '..XXXX....XXXX..',
    '.XXXX......XXXX.',
    '.XXXX......XXXX.',
    '.XXXX......XXXX.',
    '..XXXX....XXXX..',
    '...XXXXXXXXXX...',
    '....XXXXXXXX....',
    '.....XXXXXX.....',
    '......XXXX......',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '......XXXX......'
  ];

  var SPRITE_WIND = [ // awan/puputan angin
    '......XXXX......',
    '....XXXXXXXX....',
    '...XXXXXXXXXX...',
    '..XXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '..XXXXXXXXXXXX..',
    '...XXXXXXXXXX...',
    '....XXXXXXXX....',
    '......XXXX......'
  ];

  var SPRITE_CLOUD = [ // awan kecil untuk latar
    '.....XXXX.....',
    '...XXXXXXXX...',
    '..XXXXXXXXXX..',
    '.XXXXXXXXXXXX.',
    '.XXXXXXXXXXXX.',
    '..XXXXXXXXXX..',
    '.....XXXX.....'
  ];

  /* Warna per paras angin. body = warna utama, dark = outline */
  var LEVEL_COLORS = {
    high: { body: '#e2593b', dark: '#7a2412', accent: '#ffd23f' },
    mid:  { body: '#3f7fd0', dark: '#143a6b', accent: '#b3e0ff' },
    low:  { body: '#4f9e57', dark: '#1d4a24', accent: '#d8ffd0' }
  };

  var WIND_COLORS = {
    high: { body: '#fff3e0', dark: '#e2593b', accent: '#ffd23f' },
    mid:  { body: '#eaf4ff', dark: '#3f7fd0', accent: '#b3e0ff' },
    low:  { body: '#f0fdee', dark: '#4f9e57', accent: '#d8ffd0' }
  };

  /* Pilih sprite ikut nama/paras (supaya kad wau nampak pelbagai) */
  function pickWauSprite(card) {
    if (!card) return SPRITE_CRESCENT;
    var n = (card.size || 1) % 3;
    if (n === 0) return SPRITE_CRESCENT;
    if (n === 1) return SPRITE_DIAMOND;
    return SPRITE_ROUND;
  }

  /* Lukis grid sprite ke canvas. scale = gandaan piksel. */
  function drawSprite(sprite, colors, scale) {
    scale = scale || 2;
    var h = sprite.length;
    var w = sprite[0].length;
    var cv = document.createElement('canvas');
    cv.width = w * scale;
    cv.height = h * scale;
    var ctx = cv.getContext('2d');
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var ch = sprite[y][x];
        var col = null;
        if (ch === 'X') col = colors.body;
        if (ch === 'D') col = colors.dark;
        if (ch === 'A') col = colors.accent;
        if (col) {
          ctx.fillStyle = col;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    return cv;
  }

  /* Tambah outline gelap keliling piksel bukan lutsinar (kesan pixel-art tajam) */
  function withOutline(sprite, outlineColor, scale) {
    scale = scale || 2;
    var h = sprite.length, w = sprite[0].length;
    var cv = document.createElement('canvas');
    cv.width = w * scale; cv.height = h * scale;
    var ctx = cv.getContext('2d');
    function isPix(x, y) {
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      return sprite[y][x] !== '.';
    }
    // pass 1: outline
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        if (!isPix(x, y)) continue;
        if (!isPix(x - 1, y) || !isPix(x + 1, y) || !isPix(x, y - 1) || !isPix(x, y + 1)) {
          ctx.fillStyle = outlineColor;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    return cv;
  }

  /* Gabung dua canvas (outline bawah, sprite atas). */
  function composite(baseCv, topCv) {
    var cv = document.createElement('canvas');
    cv.width = baseCv.width; cv.height = baseCv.height;
    var ctx = cv.getContext('2d');
    ctx.drawImage(baseCv, 0, 0);
    ctx.drawImage(topCv, 0, 0);
    return cv;
  }

  /* API: wau card -> canvas pixel art */
  function wauCanvas(card, scale) {
    var colors = LEVEL_COLORS[card.level] || LEVEL_COLORS.mid;
    var sprite = pickWauSprite(card);
    var body = drawSprite(sprite, colors, scale || 2);
    var out = withOutline(sprite, '#1b1b2f', scale || 2);
    return composite(out, body);
  }

  /* API: wind card -> canvas pixel art (awan + warna paras) */
  function windCanvas(level, scale) {
    var colors = WIND_COLORS[level] || WIND_COLORS.mid;
    var body = drawSprite(SPRITE_WIND, colors, scale || 2);
    var out = withOutline(SPRITE_WIND, '#1b1b2f', scale || 2);
    return composite(out, body);
  }

  /* API: awan kecil untuk latar */
  function cloudCanvas(scale) {
    var body = drawSprite(SPRITE_CLOUD, { body: '#ffffff', dark: '#cfe4f2', accent: '#ffffff' }, scale || 3);
    var out = withOutline(SPRITE_CLOUD, '#9db9cc', scale || 3);
    return composite(out, body);
  }

  /* API: dadu D6 -> canvas pips */
  function dieCanvas(value, scale) {
    scale = scale || 2;
    var cell = 3, pad = 1;
    var size = (cell * 3 + pad * 2) * scale; // 11px asas
    var cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    var ctx = cv.getContext('2d');
    // badan dadu (sudut segi empat — pixel style)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#1b1b2f';
    ctx.lineWidth = Math.max(2, scale);
    ctx.strokeRect(scale, scale, size - 2 * scale, size - 2 * scale);
    // pips
    var pip = scale * 2;
    var pos = [
      [],
      [[1, 1]],
      [[0, 0], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 0], [2, 0], [0, 2], [2, 2]],
      [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
      [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]
    ];
    ctx.fillStyle = '#1b1b2f';
    (pos[value] || []).forEach(function (p) {
      var px = (pad + p[0] * cell + (cell - 1) / 2) * scale - pip / 2;
      var py = (pad + p[1] * cell + (cell - 1) / 2) * scale - pip / 2;
      ctx.fillRect(px, py, pip, pip);
    });
    return cv;
  }

  root.RentakPixel = {
    wauCanvas: wauCanvas,
    windCanvas: windCanvas,
    cloudCanvas: cloudCanvas,
    dieCanvas: dieCanvas,
    LEVEL_COLORS: LEVEL_COLORS,
    WIND_COLORS: WIND_COLORS
  };
})(typeof window !== 'undefined' ? window : globalThis);