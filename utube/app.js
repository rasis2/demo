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
    monsta: { label: 'MONSTA',  cls: 'ch-monsta', color: '#e63946' },
    durioo: { label: 'Durioo+', cls: 'ch-durioo', color: '#6d28d9' },
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

    // ── DURIOO+ / OMAR & HANA 🌙 ──
    { id: 'Nlm6YpcCri0', ch: 'durioo', title: '[Baru] Omar & Hana English X Durioo+' },
    { id: 'kJ7SgIoAaXQ', ch: 'durioo', title: 'Teater Islamik — Oh No My... (Omar & Hana)' },
    { id: 'YOOQ_hCiCjs', ch: 'durioo', title: 'Little Ammar — Time for School (Kompilasi)' },
    { id: 'FLOAV2dc4MM', ch: 'durioo', title: 'Little Ammar — Lagu-Lagu (Kompilasi)' },
    { id: 'opWNDoHcwoM', ch: 'durioo', title: 'Kembali ke Sekolah — Kompilasi 95 Minit' },
    { id: 'wW5NwX_Ex5E', ch: 'durioo', title: '1 Jam Kompilasi (Bismillah, Alhamdulillah)' },
    { id: 's2IQifq4eDk', ch: 'durioo', title: 'Alhamdulillah, Puasa Pertama | Mina Mila' },
    { id: 'pp1m_EQWYXI', ch: 'durioo', title: 'Sharing is Caring | Omar & Hana (No Music)' },
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
        adNote: 'Tanpa iklan — hanya video rasmi dari saluran Monsta & Durioo+.',
        close: 'Tutup',
    },
    en: {
        brandSub: 'Kids',
        searchPh: 'Search videos...',
        tabAll: 'All',
        featured: 'FEATURED',
        watch: 'Watch',
        recent: 'Videos',
        noResults: 'No videos found. Try a different word.',
        adNote: 'No ads — only official videos from Monsta & Durioo+ channels.',
        close: 'Close',
    },
    zh: {
        brandSub: '儿童',
        searchPh: '搜索视频...',
        tabAll: '全部',
        featured: '精选',
        watch: '观看',
        recent: '视频',
        noResults: '没有找到视频，请换一个词试试。',
        adNote: '无广告 — 仅来自 Monsta 和 Durioo+ 频道的官方视频。',
        close: '关闭',
    },
    ta: {
        brandSub: 'குழந்தைகள்',
        searchPh: 'வீடியோ தேடு...',
        tabAll: 'அனைத்தும்',
        featured: 'சிறப்பு',
        watch: 'பார்க்க',
        recent: 'வீடியோக்கள்',
        noResults: 'வீடியோ எதுவும் கிடைக்கவில்லை. வேறு வார்த்தை முயற்சிக்கவும்.',
        adNote: 'விளம்பரம் இல்லை — Monsta & Durioo+ சேனல்களின் அதிகாரப்பூர்வ வீடியோக்கள் மட்டும்.',
        close: 'மூடு',
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

function embedUrl(v) {
    // youtube-nocookie: no tracking cookies. rel=0: no unrelated rabbit-holes.
    return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1&color=white`;
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
function openPlayer(v) {
    $('#playerTitle').textContent = v.title;
    $('#playerChannel').textContent = CHANNELS[v.ch].label;
    $('#playerDesc').textContent = `https://youtu.be/${v.id}`;
    const frame = $('#playerFrame');
    frame.src = embedUrl(v);
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
