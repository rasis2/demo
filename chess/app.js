/* ═══════════════════════════════════════════
   EJEN DIRECTORY — app.js
   Renders 17 ejen from data.json (BM/EN).
   Silent-dedup: same content hash → no re-render.
   ═══════════════════════════════════════════════════════════ */

const fmt = (n) => n.toLocaleString('en-US');

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ── Hash util (FNV-1a 32-bit, fast & deterministic) ── */
function hash32(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
}

/* ── i18n ── */
const I18N = {
    ms: {
        title: 'Direktori Ejen',
        stat_total: 'Jumlah Ejen',
        stat_aktif: 'Aktif',
        stat_ringan: 'Ringan',
        stat_terbeban: 'Terbeban',
        stat_tak_aktif: 'Sekat',
        search_ph: 'Cari ejen… (nama / tugas / kategori)',
        filter_kategori: 'Semua Kategori',
        filter_status: 'Semua Status',
        cat_komunikasi: 'Ejen Komunikasi',
        cat_operasional: 'Ejen Operasional',
        cat_teknikal: 'Ejen Teknikal',
        cat_gremlin: 'Ejen Projek Gremlin',
        workload_label: 'Workload',
        empty: 'Tiada ejen sepadan penapis.',
        result_count: '{n} ejen dipaparkan',
        note: 'Snapshot dari {src} · dijana {date}',
        hash_same: '⟳ cache OK · tiada perubahan',
        hash_diff: '✓ data baru dimuat',
        status_aktif: 'AKTIF',
        status_ringan: 'RINGAN',
        status_terbeban: 'TERBEBAN',
        status_tak_aktif: 'SEKAT',
        meta_kaedah: 'kaedah',
        meta_model: 'model',
        meta_khas: 'catat',
        error: 'Gagal memuat data: {msg}',
    },
    en: {
        title: 'Agent Directory',
        stat_total: 'Total Agents',
        stat_aktif: 'Active',
        stat_ringan: 'Light',
        stat_terbeban: 'Heavy',
        stat_tak_aktif: 'Blocked',
        search_ph: 'Search agents… (name / task / category)',
        filter_kategori: 'All Categories',
        filter_status: 'All Statuses',
        cat_komunikasi: 'Communications',
        cat_operasional: 'Operations',
        cat_teknikal: 'Technical',
        cat_gremlin: 'Gremlin Project',
        workload_label: 'Workload',
        empty: 'No agents match the filter.',
        result_count: '{n} agents shown',
        note: 'Snapshot from {src} · generated {date}',
        hash_same: '⟳ cache OK · no change',
        hash_diff: '✓ fresh data loaded',
        status_aktif: 'ACTIVE',
        status_ringan: 'LIGHT',
        status_terbeban: 'HEAVY',
        status_tak_aktif: 'BLOCKED',
        meta_kaedah: 'method',
        meta_model: 'model',
        meta_khas: 'note',
        error: 'Failed to load data: {msg}',
    },
};

let lang = localStorage.getItem('ej-lang') || 'ms';
const t = (key, vars = {}) => {
    let s = I18N[lang][key] || I18N.ms[key] || key;
    for (const [k, v] of Object.entries(vars)) s = s.replace('{' + k + '}', v);
    return s;
};
function setLang(l) {
    lang = l;
    localStorage.setItem('ej-lang', l);
    $$('.lb').forEach((b) => b.classList.toggle('active', b.dataset.lang === l));
    applyI18n();
    if (DATA) renderAll();
}
function applyI18n() {
    const ph = t('search_ph');
    const inp = $('#searchInput'); if (inp) inp.placeholder = ph;
    document.title = t('title') + ' · OpenCode Memory Snapshot';
}

/* ── data + silent-dedup ── */
let DATA = null;
let DATA_HASH = null;
let LAST_RENDER_HASH = null;

async function load() {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('data.json HTTP ' + res.status);
    const txt = await res.text();
    DATA_HASH = hash32(txt);
    const json = JSON.parse(txt);

    /* silent dedup: skip re-render if hash unchanged */
    if (LAST_RENDER_HASH === DATA_HASH) {
        const el = $('#hashState');
        if (el) el.innerHTML = '<span class="pulse">' + t('hash_same') + '</span> · ' + DATA_HASH;
        return;
    }
    LAST_RENDER_HASH = DATA_HASH;
    DATA = json;
    renderAll();
    const el = $('#hashState');
    if (el) el.innerHTML = '<span class="pulse">' + t('hash_diff') + '</span> · ' + DATA_HASH;
}

/* ── render: summary ── */
function renderSummary(rs) {
    const items = [
        { cls: 'total', label: t('stat_total'),  value: rs.total },
        { cls: 'good',  label: t('stat_aktif'),  value: rs.aktif },
        { cls: 'mid',   label: t('stat_ringan'), value: rs.ringan },
        { cls: 'bad',   label: t('stat_terbeban'), value: rs.terbeban },
    ];
    if (rs.tak_aktif > 0) {
        items.push({ cls: 'off', label: t('stat_tak_aktif'), value: rs.tak_aktif });
    }
    $('#stats').innerHTML = items.map((s) => `
        <div class="stat ${s.cls}">
            <span class="stat-num">${fmt(s.value)}</span>
            <span class="stat-label">${s.label}</span>
        </div>`).join('');
}

/* ── workload bar (visual) ── */
function workloadPct(w) {
    /* max workload observed: ~8 → map to 100% */
    return Math.min(100, Math.round((w / 8) * 100));
}

/* ── ejen card ── */
function renderEjenCard(ej) {
    const pct = workloadPct(ej.workload);
    const meta = ej.meta || {};
    return `
        <div class="ejen" style="--status-color:${ej.indikator.warna_status}" data-id="${ej.id}" data-kat="${ej.kategori}" data-st="${ej.status}" data-w="${ej.workload}" data-nama="${ej.nama.toLowerCase()}">
            <div class="ejen-head">
                <span class="ejen-ikon">${ej.indikator.ikon || '🤖'}</span>
                <span class="ejen-nama">${ej.nama}</span>
                <span class="ejen-badge ${ej.status}">${t('status_' + ej.status) || ej.indikator.badge}</span>
            </div>
            <p class="ejen-tugas">${ej.tugas}</p>
            <div class="ejen-workload">
                <div class="ejen-workload-head">
                    <span>${t('workload_label')}</span>
                    <span>${ej.workload}/8</span>
                </div>
                <div class="ejen-workload-bar">
                    <div class="ejen-workload-fill" style="width:${pct}%"></div>
                </div>
            </div>
            <div class="ejen-meta">
                <span class="ejen-chip">${t('meta_kaedah')}: ${meta.kaedah || '—'}</span>
                ${meta.model && meta.model !== 'default' ? `<span class="ejen-chip model">${meta.model}</span>` : ''}
                ${meta.khas ? `<span class="ejen-chip khas" title="${meta.khas}">${meta.khas}</span>` : ''}
            </div>
            <span class="ejen-id">${ej.id}</span>
        </div>`;
}

/* ── grouping (render all categories from data.kategori) ── */
function renderGrid(state) {
    const container = $('#gridContainer');
    if (!DATA) return;

    const filterKat = state.kategori;
    const filterSt  = state.status;
    const sortBy    = state.sort;

    /* count visible per kategori */
    const visible = {};
    for (const ej of DATA.ejen) {
        if (filterKat && ej.kategori !== filterKat) continue;
        if (filterSt && ej.status !== filterSt) continue;
        if (state.search) {
            const q = state.search.toLowerCase();
            const hay = (ej.nama + ' ' + ej.tugas + ' ' + ej.kategori + ' ' + ej.id).toLowerCase();
            if (!hay.includes(q)) continue;
        }
        visible[ej.kategori] = visible[ej.kategori] || [];
        visible[ej.kategori].push(ej);
    }

    /* sort within each kategori */
    const sorter = (a, b) => {
        if (sortBy === 'nama')              return a.nama.localeCompare(b.nama);
        if (sortBy === 'status')            return a.status.localeCompare(b.status);
        if (sortBy === 'workload-desc')     return b.workload - a.workload;
        if (sortBy === 'workload-asc')      return a.workload - b.workload;
        return 0; /* kategori: keep data order */
    };

    let total = 0;
    const parts = [];
    /* preserve category order from DATA.kategori */
    for (const [kat, ids] of Object.entries(DATA.kategori)) {
        const list = visible[kat];
        if (!list || list.length === 0) continue;
        list.sort(sorter);
        total += list.length;
        parts.push(`
            <div class="kategori-group">
                <div class="kategori-head">
                    <h2>${kat}</h2>
                    <span class="count">${list.length} ejen</span>
                </div>
                <div class="ejen-grid">
                    ${list.map(renderEjenCard).join('')}
                </div>
            </div>`);
    }

    if (total === 0) {
        container.innerHTML = `<div class="empty">${t('empty')}</div>`;
    } else {
        container.innerHTML = parts.join('');
    }

    $('#resultCount').textContent = t('result_count', { n: total });
}

/* ── master render ── */
function renderAll() {
    if (!DATA) return;
    const meta = DATA.meta || {};
    const rs = DATA.ringkasan || {
        total: DATA.ejen.length,
        aktif: DATA.ejen.filter(e => e.status === 'aktif').length,
        ringan: DATA.ejen.filter(e => e.status === 'ringan').length,
        terbeban: DATA.ejen.filter(e => e.status === 'terbeban').length,
        tak_aktif: DATA.ejen.filter(e => e.status === 'tak_aktif').length,
    };
    renderSummary({ total: meta.total_ejen || rs.total, ...rs });
    renderGrid(getState());
    $('#stamp').textContent = (meta.generated_at || '—');
    $('#note').textContent = t('note', {
        src: meta.source || '.opencode/memory/',
        date: new Date(meta.generated_at || Date.now()).toLocaleDateString(
            lang === 'en' ? 'en-US' : 'ms-MY',
            { day: '2-digit', month: 'short', year: 'numeric' }),
    });
}

/* ── filter state ── */
function getState() {
    return {
        search: ($('#searchInput')?.value || '').trim(),
        kategori: $('#filterKategori')?.value || '',
        status: $('#filterStatus')?.value || '',
        sort: $('#sortBy')?.value || 'kategori',
    };
}

function bindFilters() {
    const handler = () => renderGrid(getState());
    $('#searchInput')?.addEventListener('input', handler);
    $('#filterKategori')?.addEventListener('change', handler);
    $('#filterStatus')?.addEventListener('change', handler);
    $('#sortBy')?.addEventListener('change', handler);
}

/* ── boot ── */
setLang(lang);
bindFilters();
load().catch((e) => {
    document.querySelector('main').innerHTML =
        `<p class="error">${t('error', { msg: e.message })}</p>`;
});
