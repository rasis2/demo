/* Parameswara: Pelayaran Bersejarah — Phaser 3 edition
   Karya asal: Araduas Rasis (Twine/SugarCube)
   Diterjemah & ditambah baik dengan Phaser 3. */

const G = {
  W: 960,
  H: 600,
  FONT_TITLE: "'Tangerine', cursive",
  FONT_SUB: "'Yeon Sung', cursive",
  FONT: "'Segoe UI', sans-serif",
  colors: {
    bg: 0x06090f,
    seaTop: 0x1b4a6b,
    seaBot: 0x0d2235,
    amber: 0xe8a13d,
    teal: 0x49c2b8,
    green: 0x7bd88f,
    red: 0xff6b5e,
    yellow: 0xffd76a,
    white: 0xeae6da,
    muted: 0x9aa4b1,
    panel: 0x141b24,
    panelEdge: 0x2a323d
  }
};

/* ---------------------------------------------------------------- */
/*  Procedural ship / island / boat textures                          */
/* ---------------------------------------------------------------- */
function drawShip(g, sailColor, flagColor) {
  g.clear();
  // hull
  g.fillStyle(0x8a5a2b, 1);
  g.fillRoundedRect(-30, -4, 60, 16, 6);
  g.fillStyle(0x6e4520, 1);
  g.fillRect(-30, 8, 60, 4);
  // bow
  g.fillStyle(0x8a5a2b, 1);
  g.fillTriangle(30, -4, 42, 2, 30, 6);
  // mast
  g.fillStyle(0x5b3a18, 1);
  g.fillRect(-6, -30, 4, 30);
  g.fillRect(14, -24, 3, 24);
  // sails
  g.fillStyle(sailColor, 1);
  g.fillTriangle(-4, -28, -4, -8, 16, -8);   // back sail
  g.fillTriangle(16, -22, 16, -4, 30, -4);   // front sail
  // flag
  g.fillStyle(flagColor, 1);
  g.fillTriangle(-2, -30, -2, -24, 6, -27);
}

function drawIsland(g) {
  g.clear();
  g.fillStyle(0xc8a24a, 1);            // sand
  g.fillEllipse(0, 2, 56, 18);
  g.fillStyle(0x3f7d3a, 1);            // vegetation
  g.fillEllipse(-8, -6, 30, 22);
  g.fillEllipse(10, -8, 22, 18);
  g.fillStyle(0x2d5c2a, 1);
  g.fillEllipse(-2, -12, 14, 12);
}

function drawWarship(g) {
  drawShip(g, 0xd8d3c8, 0xff3b30);     // red flag = Majapahit
}

/* ---------------------------------------------------------------- */
/*  Boot scene: load assets + build textures                          */
/* ---------------------------------------------------------------- */
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.image('bg', 'jong.jpg');
    this.load.audio('yeay', ['1_person_cheering-Jett_Rifkin-1851518140.mp3']);
    this.load.audio('noo', ['Shotgun_Blast-Jim_Rogers-1914772763.mp3']);
    this.load.audio('aww', ['Aww-SoundBible.com-1421700712.mp3']);
    this.load.audio('argh', ['dragon_ball_z_scream_9-RA_The_Sun_God-952538986.mp3']);
    this.load.audio('yay', ['Scream Of Joy-SoundBible.com-1639390065.mp3']);
    this.load.audio('mula', ['y2mate.com - saladin_adakah_kau_lupa_l31PDNHl0Ps.mp3']);
  }

  create() {
    this.makeTexture('ship', drawShip, [0xf3ecd8, 0xff3b30]);
    this.makeTexture('ship-friend', drawShip, [0xf3ecd8, 0x49c2b8]);
    this.makeTexture('warship', drawWarship, []);
    this.makeTexture('island', drawIsland, []);
    this.makeWaveTexture();

    // slow music volume + non-looping intro song
    const music = this.sound.add('mula', { volume: 0.35 });
    this.registry.set('music', music);

    this.scene.start('Title');
  }

  makeTexture(key, drawFn, args) {
    const g = this.add.graphics();
    drawFn.apply(null, [g].concat(args));
    g.generateTexture(key, 64, 48);
    g.destroy();
  }

  makeWaveTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.85);
    g.fillEllipse(0, 0, 36, 8);
    g.fillEllipse(48, 0, 40, 9);
    g.fillEllipse(96, 0, 34, 7);
    g.generateTexture('wave', 128, 10);
    g.destroy();
  }
}

/* ---------------------------------------------------------------- */
/*  Title scene                                                       */
/* ---------------------------------------------------------------- */
class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  async create() {
    try { await document.fonts.ready; } catch (e) { /* ignore */ }

    this.add.image(G.W / 2, G.H / 2, 'bg').setDisplaySize(G.W, G.H).setAlpha(0.28);
    this.add.rectangle(G.W / 2, G.H / 2, G.W, G.H, 0x06090f, 0.55);

    this.add.text(G.W / 2, 150, 'Parameswara', {
      fontFamily: G.FONT_TITLE, fontSize: '92px', color: '#ffd76a'
    }).setOrigin(0.5).setShadow(0, 4, 0x000000, 12, true, true);

    this.add.text(G.W / 2, 238, 'Pelayaran Bersejarah', {
      fontFamily: G.FONT_TITLE, fontSize: '46px', color: '#ffd76a'
    }).setOrigin(0.5).setShadow(0, 3, 0x000000, 10, true, true);

    this.add.text(G.W / 2, 330, 'Bawa Parameswara selamat merentasi lautan\ndari Palembang ke Temasik.', {
      fontFamily: G.FONT_SUB, fontSize: '24px', color: '#eae6da', align: 'center', lineSpacing: 8
    }).setOrigin(0.5).setShadow(0, 2, 0x000000, 8, true, true);

    this.add.text(G.W / 2, 415, 'Uruskan keadaan kapal dan bekalan makanan\nsepanjang 10 hari pelayaran.', {
      fontFamily: G.FONT, fontSize: '14px', color: '#9aa4b1', align: 'center', lineSpacing: 6
    }).setOrigin(0.5);

    const btn = this.add.rectangle(G.W / 2, 505, 300, 60, G.colors.amber, 1)
      .setStrokeStyle(2, 0xf0b04d).setInteractive({ useHandCursor: true });
    this.add.text(G.W / 2, 505, 'MULAKAN PENGEMBARAAN', {
      fontFamily: G.FONT, fontSize: '18px', fontWeight: 'bold', color: '#1a1200'
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0xf0b04d));
    btn.on('pointerout', () => btn.setFillStyle(G.colors.amber));
    btn.on('pointerup', () => {
      const music = this.registry.get('music');
      if (music && !music.isPlaying) { music.play(); }
      this.scene.start('Intro');
    });

    // hint
    this.add.text(G.W / 2, 560, 'Audio menggalakkan — hidupkan bunyi 🔊', {
      fontFamily: G.FONT, fontSize: '12px', color: '#6a7380'
    }).setOrigin(0.5);
  }
}

/* ---------------------------------------------------------------- */
/*  Intro scene: narrative text                                       */
/* ---------------------------------------------------------------- */
class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }

  create() {
    this.pages = [
      'Parameswara merupakan putera kerajaan Palembang yang berada di bawah penguasaan Majapahit. Demi membebaskan Palembang daripada cengkaman kerajaan Majapahit, Parameswara telah mengkhianati perjanjiannya dengan Maharaja Majapahit.',
      '"Hapuskan kerajaan Palembang!! Jangan biarkan ada seorang pun dari mereka yang hidup!!!" — arah Maharaja Majapahit.\n\nArahan itu segera dilaksanakan. Kerajaan Palembang yang kecil diserang hebat oleh segerombolan besar tentera Majapahit. Parameswara cuba bertahan.\n\nTetapi usahanya gagal.',
      '"Tuanku kena lari." — nasihat seorang pengikut setianya.\n\n"Lari? Ke mana?" — tanya Parameswara.\n\n"Pergilah ke Temasik tuanku, dapatkan perlindungan di sana."\n\nMendengar cadangan itu, Parameswara segera bersiap dengan orang-orang kepercayaannya untuk ke Temasik.',
      'Kamu, seorang nahkoda Melayu, telah diberi mandat untuk membawa Parameswara dan orang-orangnya merentasi lautan ke kerajaan Temasik.\n\n"Bayaran emas akan diberi setelah tuanku selamat sampai di sana."\n\n"Baiklah." — kamu membalas dengan yakin.',
      '"Anak muda, jagalah puteramu ini dengan baik. Kelak, putera inilah yang akan menjadi batu asas kerajaan Melayu gah suatu hari nanti sambil menjulang panji agama langit untuk seratus tahun lamanya."\n\n"Maksud bapak?" — kamu bertanya kehairanan.\n\n"Anak muda, kamu tahu apa yang ku maksudkan."'
    ];
    this.page = 0;

    this.add.rectangle(G.W / 2, G.H / 2, G.W, G.H, 0x0b1020, 1);

    this.text = this.add.text(G.W / 2, 190, '', {
      fontFamily: G.FONT, fontSize: '20px', color: '#eae6da',
      align: 'center', wordWrap: { width: 700 }, lineSpacing: 10
    }).setOrigin(0.5, 0);

    this.progress = this.add.text(G.W - 30, G.H - 26, '', {
      fontFamily: G.FONT, fontSize: '13px', color: '#6a7380'
    }).setOrigin(1, 0.5);

    this.continueBtn = this.add.rectangle(G.W / 2, G.H - 60, 200, 48, G.colors.amber, 1)
      .setInteractive({ useHandCursor: true });
    this.continueLabel = this.add.text(G.W / 2, G.H - 60, 'TERUSKAN', {
      fontFamily: G.FONT, fontSize: '15px', fontWeight: 'bold', color: '#1a1200'
    }).setOrigin(0.5);

    this.continueBtn.on('pointerover', () => this.continueBtn.setFillStyle(0xf0b04d));
    this.continueBtn.on('pointerout', () => this.continueBtn.setFillStyle(G.colors.amber));
    this.continueBtn.on('pointerup', () => this.nextPage());

    this.input.keyboard.on('keydown-SPACE', () => this.nextPage());
    this.input.keyboard.on('keydown-ENTER', () => this.nextPage());

    this.showPage();
  }

  showPage() {
    const last = this.page === this.pages.length - 1;
    this.text.setText(this.pages[this.page]);
    this.progress.setText('Pertukaran cerita ' + (this.page + 1) + ' / ' + this.pages.length);
    this.continueLabel.setText(last ? 'MULAKAN PELAYARAN' : 'TERUSKAN');
  }

  nextPage() {
    if (this.page < this.pages.length - 1) {
      this.page++;
      this.showPage();
    } else {
      this.scene.start('Game');
    }
  }
}

/* ---------------------------------------------------------------- */
/*  Game scene: the voyage                                            */
/* ---------------------------------------------------------------- */
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    const music = this.registry.get('music');
    if (music && music.isPlaying) { music.stop(); }

    // --- state ---
    this.health = 100;
    this.fuel = 5;
    this.jumps = 10;
    this.day = 1;              // current day number (1..10)
    this.pelarian = 1;         // pelayaran leg 1/2/3
    this.encounters = [];      // current day encounter list {type,id}
    this.resolved = new Set(); // set of resolved encounter ids
    this.typing = false;

    this.buildWorld();
    this.buildHUD();
    this.buildEncounterPanel();
    this.startDay();
  }

  /* ----------------------------- world ----------------------------- */
  buildWorld() {
    this.add.rectangle(G.W / 2, G.H / 2, G.W, G.H, G.colors.bg, 1);

    // sea gradient (two stacked rects for a cheap gradient)
    const sea = this.add.rectangle(G.W / 2, G.H - 150, G.W, 300, G.colors.seaBot, 1);
    sea.setOrigin(0.5, 0.5);
    this.add.rectangle(G.W / 2, G.H - 270, G.W, 60, G.colors.seaTop, 1);

    // waves
    this.wave1 = this.add.tileSprite(G.W / 2, G.H - 60, G.W, 10, 'wave').setAlpha(0.25);
    this.wave2 = this.add.tileSprite(G.W / 2, G.H - 130, G.W, 10, 'wave').setAlpha(0.18);
    this.wave3 = this.add.tileSprite(G.W / 2, G.H - 200, G.W, 10, 'wave').setAlpha(0.12);

    // ship (static on screen; map bar shows progress)
    this.ship = this.add.image(160, G.H - 110, 'ship').setDisplaySize(90, 68);
    this.tweens.add({ targets: this.ship, y: '-=6', duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // destination label
    this.add.text(830, 18, 'TEMASIK 🏁', { fontFamily: G.FONT, fontSize: '13px', fontWeight: 'bold', color: '#ffd76a' }).setOrigin(1, 0);
    this.add.text(120, 18, 'PALEMBANG ⛵', { fontFamily: G.FONT, fontSize: '13px', fontWeight: 'bold', color: '#9aa4b1' }).setOrigin(0, 0);

    // route progress bar
    this.progressTrack = this.add.rectangle(G.W / 2, 52, G.W - 280, 12, 0x0c1118, 1)
      .setStrokeStyle(1, G.colors.panelEdge);
    this.progressFill = this.add.rectangle(G.W / 2 - (G.W - 280) / 2, 52, 0, 12, G.colors.teal, 1).setOrigin(0, 0.5);
    this.shipIcon = this.add.image(120, 52, 'ship-friend').setDisplaySize(22, 16);

    // title ribbon
    this.add.text(G.W / 2, 88, 'Parameswara — Pelayaran ke Temasik', {
      fontFamily: G.FONT_TITLE, fontSize: '30px', color: '#ffd76a'
    }).setOrigin(0.5).setShadow(0, 2, 0x000000, 8, true, true);

    this.updateProgress();
  }

  buildHUD() {
    // panel
    const hud = this.add.rectangle(G.W / 2, 140, G.W - 40, 92, G.colors.panel, 0.92)
      .setStrokeStyle(1, G.colors.panelEdge);

    // Health bar
    this.add.text(30, 110, 'KEADAAN KAPAL', { fontFamily: G.FONT, fontSize: '12px', color: '#9aa4b1', fontWeight: 'bold' });
    this.healthTrack = this.add.rectangle(210, 120, 300, 18, 0x0c1118, 1).setStrokeStyle(1, 0x2a323d);
    this.healthFill = this.add.rectangle(210 - 150, 120, 0, 16, G.colors.green, 1).setOrigin(0, 0.5);
    this.healthText = this.add.text(375, 120, '100', { fontFamily: G.FONT, fontSize: '13px', fontWeight: 'bold', color: '#eae6da' }).setOrigin(0.5);

    // Fuel bar
    this.add.text(30, 160, 'BEKALAN MAKANAN', { fontFamily: G.FONT, fontSize: '12px', color: '#9aa4b1', fontWeight: 'bold' });
    this.fuelTrack = this.add.rectangle(210, 170, 300, 18, 0x0c1118, 1).setStrokeStyle(1, 0x2a323d);
    this.fuelFill = this.add.rectangle(210 - 150, 170, 0, 16, G.colors.amber, 1).setOrigin(0, 0.5);
    this.fuelText = this.add.text(375, 170, '5', { fontFamily: G.FONT, fontSize: '13px', fontWeight: 'bold', color: '#eae6da' }).setOrigin(0.5);

    // Day counter
    this.add.text(G.W - 30, 110, 'HARI KE TEMASIK', { fontFamily: G.FONT, fontSize: '12px', color: '#9aa4b1', fontWeight: 'bold' }).setOrigin(1, 0);
    this.dayText = this.add.text(G.W - 30, 150, '', { fontFamily: G.FONT, fontSize: '28px', fontWeight: 'bold', color: '#58b6ff' }).setOrigin(1, 0.5);
    this.daySub = this.add.text(G.W - 30, 182, '', { fontFamily: G.FONT, fontSize: '12px', color: '#9aa4b1' }).setOrigin(1, 0.5);

    this.logText = this.add.text(560, 110, '', {
      fontFamily: G.FONT, fontSize: '13px', color: '#c8d0da', wordWrap: { width: 340 }, lineSpacing: 4
    }).setOrigin(0, 0);

    this.updateHUD();
  }

  buildEncounterPanel() {
    this.encPanel = this.add.container(0, 0);
    this.panelBg = this.add.rectangle(G.W / 2, 400, G.W - 40, 170, G.colors.panel, 0.92)
      .setStrokeStyle(1, G.colors.panelEdge);
    this.encHeader = this.add.text(G.W / 2, 322, '', { fontFamily: G.FONT, fontSize: '15px', fontWeight: 'bold', color: '#ffd76a' }).setOrigin(0.5);
    this.encHint = this.add.text(G.W / 2, 352, '', { fontFamily: G.FONT, fontSize: '12px', color: '#9aa4b1' }).setOrigin(0.5);
    this.continueBtn = null;
  }

  /* ----------------------------- days ------------------------------ */
  startDay() {
    this.resolved = new Set();

    if (this.pelarian === 3) {
      // Majapahit fleet encounter (special)
      this.encounters = [{ type: 'Majapahit', id: 'mj' }];
      this.encHeader.setText('Semasa belayar, kamu bertembung dengan bala tentera Kora-kora Majapahit:');
    } else {
      // Generate System
      const n = Phaser.Math.Between(2, 5);
      this.encounters = [];
      const pool = ['Pulau', 'Kapal', 'Jong', 'Lanchara', 'Perahu'];
      for (let i = 0; i < n; i++) {
        this.encounters.push({ type: Phaser.Utils.Array.GetRandom(pool), id: 'e' + i });
      }
      this.encHeader.setText('Semasa belayar, kamu ternampak:');
    }

    this.encHint.setText('Klik setiap item untuk berurusan dengannya.');
    this.buildEncounterButtons();
    this.log('Hari ' + this.day + ' — pelayaran diteruskan.');
    this.tweens.add({ targets: [this.wave1], tilePositionX: { from: 0, to: 64 }, duration: 2600, repeat: -1, ease: 'Linear' });
    this.tweens.add({ targets: [this.wave2], tilePositionX: { from: 0, to: -96 }, duration: 3400, repeat: -1, ease: 'Linear' });
    this.tweens.add({ targets: [this.wave3], tilePositionX: { from: 0, to: 128 }, duration: 4200, repeat: -1, ease: 'Linear' });
  }

  buildEncounterButtons() {
    // clear old buttons
    if (this.encBtns) { this.encBtns.forEach(b => b.destroy()); }
    this.encBtns = [];

    if (this.continueBtn) { this.continueBtn.destroy(); this.continueBtn = null; }

    const startX = G.W / 2;
    const spacing = 140;
    const n = this.encounters.length;
    const offsetX = ((n - 1) * spacing) / 2;

    this.encounters.forEach((enc, i) => {
      const x = startX - offsetX + i * spacing;
      const y = 428;
      const disabled = this.resolved.has(enc.id);

      const btn = this.add.image(x, y, this.iconFor(enc.type))
        .setDisplaySize(56, 44)
        .setAlpha(disabled ? 0.28 : 1)
        .setInteractive({ useHandCursor: !disabled });

      const label = this.add.text(x, y + 38, this.labelFor(enc.type), {
        fontFamily: G.FONT, fontSize: '14px', fontWeight: 'bold', color: disabled ? '#6a7380' : '#eae6da'
      }).setOrigin(0.5);

      if (!disabled) {
        btn.on('pointerover', () => btn.setScale(1.12));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerup', () => this.resolveEncounter(enc));
      }

      this.encBtns.push(btn, label);
    });
  }

  iconFor(enc) {
    switch (enc) {
      case 'Pulau': return 'island';
      case 'Jong': return 'ship';
      case 'Kapal': return 'ship';
      case 'Lanchara': return 'warship';
      case 'Perahu': return 'ship';
      case 'Majapahit': return 'warship';
      default: return 'ship';
    }
  }

  labelFor(enc) {
    switch (enc) {
      case 'Pulau': return 'Pulau';
      case 'Jong': return 'Jong';
      case 'Kapal': return 'Kapal';
      case 'Lanchara': return 'Lanchara';
      case 'Perahu': return 'Perahu';
      case 'Majapahit': return 'Kora-kora';
      default: return enc;
    }
  }

  /* ------------------------- encounters ---------------------------- */
  resolveEncounter(enc) {
    if (this.resolved.has(enc.id) || this.typing) return;
    this.resolved.add(enc.id);
    this.buildEncounterButtons();

    const result = this.rollOutcome(enc.type);
    this.applyResult(result);
    this.playSound(result.sound);
    this.log(result.msg);

    this.encHint.setText(this.resolved.size < this.encounters.length
      ? 'Klik item yang tinggal.'
      : 'Semua item diselesaikan. Teruskan pelayaran.');

    this.checkStatus();

    if (this.resolved.size >= this.encounters.length && !this.gameOver) {
      this.showContinue();
    }
  }

  rollOutcome(enc) {
    const r = Phaser.Math.Between(1, 10);
    const h = (a, b) => Phaser.Math.Between(a, b);

    switch (enc) {
      case 'Pulau': {
        if (r === 1) {
          const f = h(1, 2);
          return { health: 0, fuel: f, jump: 0, sound: 'yeay', msg: 'Penduduk pulau menyambut baik. (+' + f + ' Makanan)' };
        } else if (r >= 6) {
          const hp = h(1, 30);
          return { health: hp, fuel: 0, jump: 0, sound: 'yeay', msg: 'Berehat di pulau, kerosakan kapal dibaiki. (+' + hp + ' Kapal)' };
        } else {
          const f = h(1, 2), hp = h(1, 15);
          return { health: -hp, fuel: -f, jump: 0, sound: 'noo', msg: 'Penduduk pulau menyerang! (-' + hp + ' Kapal, -' + f + ' Makanan)' };
        }
      }
      case 'Kapal': {
        if (r >= 7) {
          const hp = h(1, 15), f = h(1, 3);
          return { health: -hp, fuel: f, jump: 0, sound: 'aww', msg: 'Itu kapal lanun! Kita diserang tetapi menang. (-' + hp + ' Kapal, +' + f + ' Makanan)' };
        } else if (r <= 3) {
          const hp = h(2, 10);
          return { health: -hp, fuel: 0, jump: 0, sound: 'noo', msg: 'Itu kapal Majapahit! Diserang tetapi dapat lari. (-' + hp + ' Kapal)' };
        } else {
          const f = h(1, 6);
          return { health: 0, fuel: f, jump: 0, sound: 'yeay', msg: 'Itu kapal orang kita!! (+' + f + ' Makanan)' };
        }
      }
      case 'Jong': {
        if (r >= 7) {
          const hp = h(1, 20), f = h(1, 3);
          return { health: -hp, fuel: f, jump: 0, sound: 'aww', msg: 'Itu jong lanun! Kita diserang tetapi menang. (-' + hp + ' Kapal, +' + f + ' Makanan)' };
        } else if (r <= 3) {
          const hp = h(2, 20);
          return { health: -hp, fuel: 0, jump: 0, sound: 'noo', msg: 'Itu jong Majapahit! Diserang tetapi dapat lari. (-' + hp + ' Kapal)' };
        } else {
          const hp = h(2, 30), f = h(2, 7);
          return { health: hp, fuel: f, jump: 0, sound: 'yeay', msg: 'Itu jong orang kita!! (+' + hp + ' Kapal, +' + f + ' Makanan)' };
        }
      }
      case 'Lanchara': {
        if (r >= 7) {
          const hp = h(1, 15), f = h(1, 3);
          return { health: -hp, fuel: f, jump: 0, sound: 'aww', msg: 'Itu lanchara lanun! Kita diserang tetapi menang. (-' + hp + ' Kapal, +' + f + ' Makanan)' };
        } else if (r <= 3) {
          const hp = h(2, 15);
          return { health: -hp, fuel: 0, jump: 0, sound: 'noo', msg: 'Itu lanchara Majapahit! Diserang tetapi dapat lari. (-' + hp + ' Kapal)' };
        } else {
          const f = h(2, 5);
          return { health: 0, fuel: f, jump: 0, sound: 'yeay', msg: 'Itu lanchara orang kita!! (+' + f + ' Makanan)' };
        }
      }
      case 'Perahu': {
        if (r >= 7) {
          const hp = h(1, 9), f = h(1, 3);
          return { health: -hp, fuel: f, jump: 0, sound: 'aww', msg: 'Itu perahu lanun! Kita diserang tetapi menang. (-' + hp + ' Kapal, +' + f + ' Makanan)' };
        } else if (r <= 3) {
          const hp = h(2, 9);
          return { health: -hp, fuel: 0, jump: 0, sound: 'noo', msg: 'Itu perahu Majapahit! Diserang tetapi dapat lari. (-' + hp + ' Kapal)' };
        } else {
          const f = h(1, 4);
          return { health: 0, fuel: f, jump: 0, sound: 'yeay', msg: 'Itu perahu orang kita!! (+' + f + ' Makanan)' };
        }
      }
      case 'Majapahit': {
        // fixed logic so all three outcomes are reachable
        if (r <= 2) {
          const f = h(1, 2), hp = h(1, 15);
          return { health: -hp, fuel: -f, jump: 0, sound: 'yeay', msg: 'Tentera Majapahit cuba menghalang kamu, tetapi kamu berjaya meloloskan diri. (-' + hp + ' Kapal, -' + f + ' Makanan)' };
        } else if (r <= 6) {
          const j = h(1, 3);
          return { health: 0, fuel: 0, jump: j, sound: 'aww', msg: 'Kamu berjaya lari tetapi terkeluar dari laluan asal ke Temasik. (+' + j + ' Hari belayar)' };
        } else {
          const hp = h(1, 20), j = h(1, 3);
          return { health: -hp, fuel: 0, jump: j, sound: 'noo', msg: 'Kapal kamu diserang teruk, tetapi berjaya larikan diri. Kamu juga makin jauh dari laluan asal. (-' + hp + ' Kapal, +' + j + ' Hari belayar)' };
        }
      }
      default:
        return { health: 0, fuel: 0, jump: 0, sound: 'yeay', msg: 'Tidak bertembung.' };
    }
  }

  applyResult(res) {
    this.health = Math.max(0, Math.min(100, this.health + res.health));
    this.fuel = Math.max(0, this.fuel + res.fuel);
    this.jumps = Math.max(0, this.jumps + res.jump);
    this.updateHUD();
    this.updateProgress();
  }

  checkStatus() {
    if (this.health <= 0) { this.endGame('Hancur'); return; }
    if (this.fuel <= 0) { this.endGame('Terkandas'); return; }
    if (this.jumps <= 0) { this.endGame('Selamat'); return; }
  }

  /* --------------------------- continue ---------------------------- */
  showContinue() {
    const btn = this.add.rectangle(G.W / 2, G.H - 40, 260, 50, G.colors.teal, 1)
      .setStrokeStyle(2, 0x49c2b8).setInteractive({ useHandCursor: true });
    this.add.text(G.W / 2, G.H - 40, 'TERUSKAN PELAYARAN ⛵', {
      fontFamily: G.FONT, fontSize: '15px', fontWeight: 'bold', color: '#06110f'
    }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setFillStyle(0x5fd6cc));
    btn.on('pointerout', () => btn.setFillStyle(G.colors.teal));
    btn.on('pointerup', () => this.nextLeg());
    this.continueBtn = btn;
  }

  nextLeg() {
    // each day costs 1 fuel and 1 day
    this.fuel = Math.max(0, this.fuel - 1);
    this.jumps = Math.max(0, this.jumps - 1);
    this.day++;
    this.updateHUD();
    this.updateProgress();

    this.checkStatus();
    if (this.gameOver) return;

    this.pelarian = this.pelarian === 3 ? 1 : this.pelarian + 1;
    this.log('Sehari berlalu. Bekalan makanan -1.');
    this.startDay();
  }

  /* ----------------------------- HUD ------------------------------- */
  updateHUD() {
    // health
    const hpPct = Math.max(0, Math.min(1, this.health / 100));
    this.healthFill.width = 300 * hpPct;
    this.healthFill.fillColor = this.health >= 65 ? G.colors.green : (this.health >= 39 ? G.colors.yellow : G.colors.red);
    this.healthText.setText(String(this.health));

    // fuel
    const fPct = Math.max(0, Math.min(1, this.fuel / 10));
    this.fuelFill.width = 300 * fPct;
    this.fuelFill.fillColor = this.fuel >= 6 ? G.colors.green : (this.fuel >= 4 ? G.colors.yellow : G.colors.red);
    this.fuelText.setText(String(this.fuel));

    // day
    this.dayText.setText(String(this.jumps));
    this.daySub.setText('Hari ' + this.day + ' · Pusingan ' + this.pelarian);
  }

  updateProgress() {
    const pct = Math.max(0, Math.min(1, (10 - this.jumps) / 10));
    const trackW = G.W - 280;
    this.progressFill.width = trackW * pct;
    const iconX = 120 + (trackW - 22) * pct;
    this.shipIcon.x = iconX;
  }

  log(text) {
    this.logText.setText(text);
  }

  playSound(key) {
    try {
      this.sound.play(key, { volume: 0.6 });
    } catch (e) { /* audio may fail on file:// */ }
  }

  /* ----------------------------- end ------------------------------- */
  endGame(ending) {
    this.gameOver = true;
    this.scene.start('End', { ending });
  }
}

/* ---------------------------------------------------------------- */
/*  End scene                                                         */
/* ---------------------------------------------------------------- */
class EndScene extends Phaser.Scene {
  constructor() { super('End'); }

  create(data) {
    this.add.rectangle(G.W / 2, G.H / 2, G.W, G.H, 0x0b1020, 1);

    const endings = {
      Hancur: {
        title: 'KAPAL HANCUR',
        color: G.colors.red,
        sound: 'argh',
        lines: [
          'Kapal kamu hancur diserang.',
          '',
          '"Menyesal beta percayakan kamu!!" — jerit Parameswara sebelum lemas di lautan yang luas.',
          '',
          'Majapahit kemudian meluaskan kuasa hingga ke tanah Melayu. Kesultanan Melayu semenanjung dicarik habis oleh Siam di sebelah utara dan Majapahit di sebelah selatan.',
          '',
          'Kedatangan Islam berjaya menyelamatkan kesultanan Melayu dari pupus. Namun tidak lama kemudian, perang Siam–Majapahit berlarutan hingga kedatangan kuasa-kuasa barat.',
          '',
          'Malaysia tidak pernah wujud.'
        ]
      },
      Terkandas: {
        title: 'TERKANDAS DI LAUTAN',
        color: G.colors.yellow,
        sound: 'aww',
        lines: [
          'Tanpa bekalan makanan, kesemua anak kapal tidak mampu mengemudi kapal. Kapal kamu terbiar dihanyut ombak.',
          '',
          'Dalam beberapa waktu, kamu melihat seorang demi seorang ahli kapal mati kebuluran di atas kapal. Kamu lihat Parameswara menghembuskan nafas terakhir di hadapan kamu.',
          '',
          'Terukir penyesalan di wajahnya.',
          '',
          'Bala tentera Majapahit menjumpai kapal kamu tidak lama kemudian, tetapi yang tinggal hanyalah longgokan mayat yang sedang membusuk.'
        ]
      },
      Selamat: {
        title: 'MISI SELESAI',
        color: G.colors.green,
        sound: 'yay',
        lines: [
          'Kamu telah berjaya membawa Parameswara ke Temasik dengan selamat!',
          '',
          'Sebagai tanda terima kasih, kamu telah diberikan sejumlah emas untuk kamu hidup kaya-raya di nusantara.',
          '',
          'Misi selesai.',
          '',
          'Batu asas kerajaan Melayu gah telah diletakkan — satu kerajaan yang akan menjulang panji agama langit untuk seratus tahun lamanya.'
        ]
      }
    };

    const e = endings[data.ending] || endings.Selamat;
    setTimeout(() => this.playSound(e.sound), 300);

    this.add.text(G.W / 2, 110, e.title, {
      fontFamily: G.FONT, fontSize: '34px', fontWeight: 'bold', color: '#' + e.color.toString(16).padStart(6, '0')
    }).setOrigin(0.5).setShadow(0, 3, 0x000000, 10, true, true);

    this.add.text(G.W / 2, 360, e.lines.join('\n'), {
      fontFamily: G.FONT, fontSize: '15px', color: '#eae6da',
      align: 'center', wordWrap: { width: 620 }, lineSpacing: 8
    }).setOrigin(0.5, 0.5);

    const btn = this.add.rectangle(G.W / 2, G.H - 60, 200, 50, G.colors.amber, 1)
      .setInteractive({ useHandCursor: true });
    this.add.text(G.W / 2, G.H - 60, 'MAIN SEMULA', {
      fontFamily: G.FONT, fontSize: '15px', fontWeight: 'bold', color: '#1a1200'
    }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setFillStyle(0xf0b04d));
    btn.on('pointerout', () => btn.setFillStyle(G.colors.amber));
    btn.on('pointerup', () => {
      const music = this.registry.get('music');
      if (music && !music.isPlaying) { music.play(); }
      this.scene.start('Intro');
    });
  }

  playSound(key) {
    try { this.sound.play(key, { volume: 0.6 }); } catch (e) { /* ignore */ }
  }
}

/* ---------------------------------------------------------------- */
/*  Config + start                                                    */
/* ---------------------------------------------------------------- */
const config = {
  type: Phaser.AUTO,
  parent: 'game-wrap',
  width: G.W,
  height: G.H,
  backgroundColor: G.colors.bg,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, IntroScene, GameScene, EndScene]
};

window.addEventListener('error', function (ev) {
  const el = document.getElementById('err');
  if (el) {
    el.style.display = 'block';
    el.textContent = 'Error: ' + ev.message;
  }
});

window.game = new Phaser.Game(config);
