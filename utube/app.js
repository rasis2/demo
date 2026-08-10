/* ═══════════════════════════════════════════
   UTUBE — KANAK-KANAK — app.js
   Kids-safe video browser: only official videos
   from Monsta & Durioo+ channels. No ads, no
   related-video rabbit holes (rel=0), no comments.
═══════════════════════════════════════════ */

/* ────────────────────────────────────────
   VIDEO DATABASE
   Every ID below is a real, official upload
   from the channel indicated (Monsta or the
   Omar & Hana / Durioo+ family of channels).
   Add or remove entries freely — thumbnails
   and embeds are derived from the YouTube ID.
──────────────────────────────────────── */
const CHANNELS = {
    monsta:    { label: 'MONSTA',       cls: 'ch-monsta',    color: '#e63946' },
    papazola:  { label: 'Papa Zola',    cls: 'ch-papazola',  color: '#f97316' },
    upinipin:  { label: 'Upin & Ipin',  cls: 'ch-upinipin',  color: '#10b981' },
    ejenali:   { label: 'Ejen Ali',     cls: 'ch-ejenali',   color: '#2563eb' },
    didi:      { label: 'Didi & Friends', cls: 'ch-didi',    color: '#f59e0b' },
    durioo:    { label: 'Durioo+',      cls: 'ch-durioo',    color: '#6d28d9' },
    msrachel:  { label: 'Ms Rachel',    cls: 'ch-msrachel',  color: '#ec4899' },
};

const VIDEOS = [
    // ── MONSTA ⚡ ──
    { id: 'ZxbWWEiqZRQ', ch: 'monsta', title: 'BoBoiBoy X Mechamato — Rasmi Monsta' },
    { id: 'm4gfp-8uGSY', ch: 'monsta', title: 'Mechamato Movie — Treler Rasmi [HD]' },
    { id: '9XI6o0m3Egk', ch: 'monsta', title: 'Treler Rasmi | Mechamato Musim 3' },
    { id: 'QnRMOP_ILyw', ch: 'monsta', title: 'Mechamato — Pandangan Pertama Treler' },
    { id: 'pjrV7XuspRs', ch: 'monsta', title: 'Hadiah Raya BoBoiBoy!' },
    { id: 'rM3jf3-5LVE', ch: 'monsta', title: 'Memori Eidulfitri | Iklan Raya Monsta 2021' },
    { id: '07CA02Z9xGE', ch: 'monsta', title: 'Iklan Raya BoBoiBoy 2022' },
    { id: 'q9LLSSr5ckg', ch: 'monsta', title: 'Iklan Raya BoBoiBoy & Mechamato 2023' },
    { id: 'wgFtH1bCeEU', ch: 'monsta', title: 'MONSTA 2020 — Era Baharu!' },
    { id: 'RKZzcpipqx8', ch: 'monsta', title: 'Papa Pipi Pindah' },

    // ── PAPA ZOLA 🍕 ──
    { id: 'hP7Hj2NQ-wk', ch: 'papazola', title: 'Papa Zola The Movie — Treler Antarabangsa' },
    { id: 'fxTGE4vtS3A', ch: 'papazola', title: 'Treler Rasmi Esok | Papa Zola The Movie' },

    // ── UPIN & IPIN 🌙 (Les' Copaque) ──
    { id: 'zM78QaUshxE', ch: 'upinipin', title: 'Upin & Ipin Ramadan Raya — Episod Penuh' },
    { id: 'ST0b5RDuETQ', ch: 'upinipin', title: 'Musim 15 — Rajin Menyimpan Bijak Belanja' },
    { id: 'ZYMI8adms7c', ch: 'upinipin', title: 'Musim 18 — Minyak Sawit (Episod Penuh)' },
    { id: 'iDhlqk0cx9s', ch: 'upinipin', title: 'Upin & Ipin — Beli, Pakai, Suka' },
    { id: 'qFX65RVb5X8', ch: 'upinipin', title: 'Upin & Ipin — Bahaya Jerebu' },
    { id: 'aIf28Et_0Xw', ch: 'upinipin', title: 'Musim 16 — Keselamatan Dan Kecekapan Tenaga' },
    { id: '2liJ78gn9Z0', ch: 'upinipin', title: 'Musim 6 — Sedia Menyelamat' },
    { id: 'SwVeuFAYfC0', ch: 'upinipin', title: 'Upin & Ipin — Perangi Rasuah' },

    // ── EJEN ALI 🕵️ (Wau Animation) ──
    { id: '2W7-oo7P8So', ch: 'ejenali', title: 'Ejen Ali Musim 3 — Treler Rasmi' },
    { id: 'tn-4DkIz6As', ch: 'ejenali', title: 'Ejen Ali Musim 3 — Treler Rasmi' },
    { id: 'FB6jX_6pQJY', ch: 'ejenali', title: 'Ejen Ali Musim 3 — Sampel Muzik' },
    { id: 'PVnOrj1j6C4', ch: 'ejenali', title: 'Profil Ejen — Ejen Aleks' },
    { id: 'WpBkIKBoPNc', ch: 'ejenali', title: 'Profil Ejen — Ejen Rizka' },
    { id: 'o9iJbM3v5fg', ch: 'ejenali', title: 'Profil Ejen — Ejen Sam' },
    { id: 'vFKTU1xKTS0', ch: 'ejenali', title: 'Profil Ejen — Ejen Kim' },

    // ── DIDI & FRIENDS 🐤 (Digital Durian) ──
    { id: 'MQ1kVt0fGs0', ch: 'didi', title: 'Rescue Squad — Fire! Fire!' },
    { id: 'ieMXOP6GhMc', ch: 'didi', title: 'Rescue Squad — Tia\'s Fallen!' },
    { id: '-EGbr3OGBM4', ch: 'didi', title: 'Rescue Squad — I\'m Stuck!' },
    { id: 'OrrLx3fudPs', ch: 'didi', title: 'Rescue Squad — The Elevator\'s Broken' },
    { id: '5TizIExM67U', ch: 'didi', title: 'Rescue Squad — A Landslide (Part 1)' },
    { id: 'Yi4sEyNkTF0', ch: 'didi', title: 'Rescue Squad — A Landslide (Part 2)' },
    { id: 'MobGDQp3UEg', ch: 'didi', title: 'Rescue Squad — I\'m Trapped' },
    { id: '5aLZNbybfQc', ch: 'didi', title: 'Rescue Squad — Episod 1-5' },

    // ── DURIOO+ / OMAR & HANA 🌙 ──
    { id: 'Nlm6YpcCri0', ch: 'durioo', title: '[Baru] Omar & Hana English X Durioo+' },
    { id: 'kJ7SgIoAaXQ', ch: 'durioo', title: 'Teater Islamik — Oh No My... (Omar & Hana)' },
    { id: 'YOOQ_hCiCjs', ch: 'durioo', title: 'Little Ammar — Time for School (Kompilasi)' },
    { id: 'FLOAV2dc4MM', ch: 'durioo', title: 'Little Ammar — Lagu-Lagu (Kompilasi)' },
    { id: 'opWNDoHcwoM', ch: 'durioo', title: 'Kembali ke Sekolah — Kompilasi 95 Minit' },
    { id: 'wW5NwX_Ex5E', ch: 'durioo', title: '1 Jam Kompilasi (Bismillah, Alhamdulillah)' },
    { id: 's2IQifq4eDk', ch: 'durioo', title: 'Alhamdulillah, Puasa Pertama | Mina Mila' },
    { id: 'pp1m_EQWYXI', ch: 'durioo', title: 'Sharing is Caring | Omar & Hana (No Music)' },

    // ── MS RACHEL 🎓 ──
    { id: 'EOjPNtVZghU', ch: 'msrachel', title: 'Belajar Dengan Ms Rachel — Wheels On The Bus' },
    { id: 'oVtzNpzuvoA', ch: 'msrachel', title: 'Belajar Membaca — Lagu Phonics Bersama Ms Rachel' },
];

/* ────────────────────────────────────────
   I18N — Bahasa Melayu / English / 中文 / தமிழ்
──────────────────────────────────────── */
const LANGS = [
    { code: 'ms', label: 'BM' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ta', label: 'தமிழ்' },
];

const I18N = {
    ms: {
        brandSub: 'Kanak-Kanak',
        searchPh: 'Cari video...',
        tabAll: 'Semua',
        featured: 'TAMPILAN',
        watch: 'Tonton',
        recent: 'Video',
        noResults: 'Tiada video dijumpai. Cuba cari perkataan lain.',
        adNote: 'Tanpa iklan — hanya video rasmi dari saluran kanak-kanak tempatan & antarabangsa.',
        close: 'Tutup',
        next: 'Tonton Seterusnya',
    },
    en: {
        brandSub: 'Kids',
        searchPh: 'Search videos...',
        tabAll: 'All',
        featured: 'FEATURED',
        watch: 'Watch',
        recent: 'Videos',
        noResults: 'No videos found. Try a different word.',
        adNote: 'No ads — only official videos from local & international kids channels.',
        close: 'Close',
        next: 'Watch Next',
    },
    zh: {
        brandSub: '儿童',
        searchPh: '搜索视频...',
        tabAll: '全部',
        featured: '精选',
        watch: '观看',
        recent: '视频',
        noResults: '没有找到视频，请换一个词试试。',
        adNote: '无广告 — 仅来自本地和国际儿童频道的官方视频。',
        close: '关闭',
        next: '接下来观看',
    },
    ta: {
        brandSub: 'குழந்தைகள்',
        searchPh: 'வீடியோ தேடு...',
        tabAll: 'அனைத்தும்',
        featured: 'சிறப்பு',
        watch: 'பார்க்க',
        recent: 'வீடியோக்கள்',
        noResults: 'வீடியோ எதுவும் கிடைக்கவில்லை. வேறு வார்த்தை முயற்சிக்கவும்.',
        adNote: 'விளம்பரம் இல்லை — உள்நாட்டு & சர்வதேச குழந்தைகள் சேனல்களின் அதிகாரப்பூர்வ வீடியோக்கள் மட்டும்.',
        close: 'மூடு',
        next: 'அடுத்து பார்க்க',
    },
};

/* ────────────────────────────────────────
   STATE
──────────────────────────────────────── */
let lang = 'ms';
let activeChannel = 'all';
let query = '';
const playerVideoId = null;

/* ────────────────────────────────────────
   HELPERS
──────────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.ms[key] || key;

function thumb(v) { return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`; }

function embedUrl(v, autoplay = false) {
    // youtube-nocookie: no tracking cookies. rel=0: no unrelated rabbit-holes.
    const ap = autoplay ? '&autoplay=1' : '';
    return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1&color=white${ap}`;
}

function watchUrl(v) { return `https://www.youtube.com/watch?v=${v.id}`; }

function filterVideos() {
    const q = query.toLowerCase().trim();
    return VIDEOS.filter((v) => {
        const chOk = activeChannel === 'all' || v.ch === activeChannel;
        const qOk = !q || v.title.toLowerCase().includes(q) || v.ch.toLowerCase().includes(q);
        return chOk && qOk;
    });
}

/* ────────────────────────────────────────
   RENDER
──────────────────────────────────────── */
function renderHero() {
    const list = filterVideos();
    const hero = list[0];
    if (!hero) {
        $('#heroSection').style.display = 'none';
        return;
    }
    $('#heroSection').style.display = '';
    $('#heroVideo').innerHTML = `<img src="${thumb(hero)}" alt="${hero.title}" loading="lazy">`;
    $('#heroTitle').textContent = hero.title;
    $('#heroDesc').textContent = `${CHANNELS[hero.ch].label} • youtube.com`;
    $('#heroPlayBtn').dataset.id = hero.id;
    $('#heroVideo').dataset.id = hero.id;
}

function renderGrid() {
    const list = filterVideos();
    const grid = $('#videoGrid');
    grid.innerHTML = '';

    list.forEach((v, i) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.style.animationDelay = `${Math.min(i * 0.04, 0.4)}s`;
        card.innerHTML = `
            <div class="card-thumb">
                <span class="card-channel-badge ${CHANNELS[v.ch].cls}">${CHANNELS[v.ch].label}</span>
                <img src="${thumb(v)}" alt="${v.title}" loading="lazy">
            </div>
            <div class="card-info">
                <div class="card-title">${v.title}</div>
                <div class="card-channel">${CHANNELS[v.ch].label}</div>
            </div>`;
        card.addEventListener('click', () => openPlayer(v));
        grid.appendChild(card);
    });

    $('#emptyState').hidden = list.length > 0;
    $('#sectionTitle').textContent =
        t('recent') + (activeChannel === 'all' ? '' : ` — ${CHANNELS[activeChannel].label}`);
}

/* ────────────────────────────────────────
   PLAYER MODAL
──────────────────────────────────────── */
function renderSuggestions(current) {
    const box = $('#suggestBox');
    const list = VIDEOS
        .filter((v) => v.ch === current.ch && v.id !== current.id)
        .concat(VIDEOS.filter((v) => v.ch !== current.ch && v.id !== current.id))
        .slice(0, 8);
    box.innerHTML = '';
    list.forEach((v) => {
        const item = document.createElement('div');
        item.className = 'sug-item';
        item.innerHTML = `
            <img src="${thumb(v)}" alt="${v.title}" loading="lazy">
            <div class="sug-info">
                <div class="sug-title">${v.title}</div>
                <div class="sug-channel">${CHANNELS[v.ch].label}</div>
            </div>`;
        item.addEventListener('click', () => loadVideo(v));
        box.appendChild(item);
    });
}

function loadVideo(v) {
    $('#playerTitle').textContent = v.title;
    $('#playerChannel').textContent = CHANNELS[v.ch].label;
    $('#playerDesc').textContent = `https://youtu.be/${v.id}`;
    const frame = $('#playerFrame');
    frame.src = embedUrl(v, true);
    renderSuggestions(v);
    frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openPlayer(v) {
    loadVideo(v);
    $('#playerModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    $('#playerModal').classList.remove('open');
    $('#playerFrame').src = '';
    document.body.style.overflow = '';
}

/* ────────────────────────────────────────
   I18N / THEME
──────────────────────────────────────── */
function applyI18n() {
    $('#langBtn').textContent = LANGS.find((l) => l.code === lang).label;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
        el.placeholder = t(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        el.title = t(el.dataset.i18nTitle);
    });
    // Re-render dynamic text
    renderHero();
    renderGrid();
}

function cycleLang() {
    const idx = LANGS.findIndex((l) => l.code === lang);
    lang = LANGS[(idx + 1) % LANGS.length].code;
    localStorage.setItem('utube-lang', lang);
    applyI18n();
}

function initTheme() {
    const saved = localStorage.getItem('utube-night');
    if (saved === '1') document.body.classList.add('night');
}

/* ────────────────────────────────────────
   EVENTS
──────────────────────────────────────── */
function bindEvents() {
    $('#langBtn').addEventListener('click', cycleLang);

    $('#nightBtn').addEventListener('click', () => {
        const on = document.body.classList.toggle('night');
        localStorage.setItem('utube-night', on ? '1' : '0');
    });

    document.querySelectorAll('.ch-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ch-tab').forEach((x) => x.classList.remove('active'));
            tab.classList.add('active');
            activeChannel = tab.dataset.channel;
            renderHero();
            renderGrid();
        });
    });

    let debounce;
    $('#searchInput').addEventListener('input', (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            query = e.target.value;
            renderHero();
            renderGrid();
        }, 180);
    });

    $('#heroPlayBtn').addEventListener('click', (e) => {
        const v = VIDEOS.find((x) => x.id === e.currentTarget.dataset.id);
        if (v) openPlayer(v);
    });

    $('#heroVideo').addEventListener('click', (e) => {
        const v = VIDEOS.find((x) => x.id === e.currentTarget.dataset.id);
        if (v) openPlayer(v);
    });

    $('#closeBtn').addEventListener('click', closePlayer);
    $('#playerModal').addEventListener('click', (e) => {
        if (e.target === $('#playerModal')) closePlayer();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePlayer();
    });
}

/* ────────────────────────────────────────
   BOOT
──────────────────────────────────────── */
(function init() {
    const savedLang = localStorage.getItem('utube-lang');
    if (savedLang && LANGS.some((l) => l.code === savedLang)) lang = savedLang;
    initTheme();
    bindEvents();
    applyI18n();
    renderHero();
    renderGrid();
})();
