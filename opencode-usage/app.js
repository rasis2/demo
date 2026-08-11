/* ═══════════════════════════════════════════
   OPENCODE USAGE — app.js
   Renders real usage from data.json (BM/EN).
   No charts library — just div bars + meter.
═══════════════════════════════════════════ */

const fmt = (n) => n.toLocaleString('en-US');
const fmtTokens = (n) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
};

const $ = (sel) => document.querySelector(sel);

/* ── i18n ── */
const I18N = {
  ms: {
    title_models: 'Pengagihan Model LLM',
    title_tools: 'Gunaan Alat',
    meter_title: 'Kuota OpenCode Go',
    meter_sub: '{used} / {limit} ({month}) · {pct}% digunakan',
    meter_good: '✓ Baik',
    meter_mid: '⚠ Sederhana',
    meter_bad: '✕ Bahaya',
    meter_status_good: 'Baik',
    meter_status_mid: 'Sederhana',
    meter_status_bad: 'Bahaya',
    stat_streams: 'Permintaan LLM',
    stat_tools: 'Gunaan Alat',
    stat_models: 'Model Aktif',
    stat_kinds: 'Jenis Alat',
    stat_sessions: 'Sesi',
    note: 'Dikira daripada {log} · dijana {date}',
    error: 'Gagal memuat data: {msg}',
    requests: '{n} permintaan',
  },
  en: {
    title_models: 'LLM Model Distribution',
    title_tools: 'Tool Usage',
    meter_title: 'OpenCode Go Quota',
    meter_sub: '{used} / {limit} ({month}) · {pct}% used',
    meter_good: '✓ Good',
    meter_mid: '⚠ Moderate',
    meter_bad: '✕ Danger',
    meter_status_good: 'Good',
    meter_status_mid: 'Moderate',
    meter_status_bad: 'Danger',
    stat_streams: 'LLM Requests',
    stat_tools: 'Tool Calls',
    stat_models: 'Active Models',
    stat_kinds: 'Tool Kinds',
    stat_sessions: 'Sessions',
    note: 'Computed from {log} · generated {date}',
    error: 'Failed to load data: {msg}',
    requests: '{n} requests',
  },
};

let lang = localStorage.getItem('oc-lang') || 'ms';
const t = (key, vars = {}) => {
  let s = I18N[lang][key] || I18N.ms[key] || key;
  for (const [k, v] of Object.entries(vars)) s = s.replace('{' + k + '}', v);
  return s;
};

function setLang(l) {
  lang = l;
  localStorage.setItem('oc-lang', l);
  document.querySelectorAll('.lb').forEach((b) => b.classList.toggle('active', b.dataset.lang === l));
  applyI18n();
}

function applyI18n() {
  document.querySelectorAll('[data-i]').forEach((el) => {
    const k = el.getAttribute('data-i');
    if (I18N[lang][k] !== undefined) el.textContent = I18N[lang][k];
  });
}

/* ── data ── */
let DATA = null;

async function load() {
  const res = await fetch('data.json');
  if (!res.ok) throw new Error('data.json');
  return res.json();
}

function renderStats(stats) {
  const items = [
    { label: t('stat_streams'), value: stats.streams },
    { label: t('stat_tools'), value: stats.tools },
    { label: t('stat_models'), value: stats.models },
    { label: t('stat_kinds'), value: stats.toolKinds },
    { label: t('stat_sessions'), value: stats.sessions },
  ];
  $('#stats').innerHTML = items.map((s) => `
      <div class="stat">
          <span class="stat-num">${fmt(s.value)}</span>
          <span class="stat-label">${s.label}</span>
      </div>`).join('');
}

function renderMeter(go) {
  const pct = Math.min(100, go.percent);
  const fill = $('#meterFill');
  const badge = $('#meterBadge');

  let cls = 'good', status = t('meter_status_good');
  if (go.percent >= 80) { cls = 'bad'; status = t('meter_status_bad'); }
  else if (go.percent >= 50) { cls = 'mid'; status = t('meter_status_mid'); }

  fill.style.width = pct + '%';
  fill.style.background = cls === 'good' ? 'var(--good)' : cls === 'mid' ? 'var(--mid)' : 'var(--bad)';

  badge.textContent = status;
  badge.className = 'meter-badge ' + cls;

  $('#meterSub').textContent = t('meter_sub', {
    used: '$' + fmt(go.used),
    limit: '$' + fmt(go.limit),
    month: go.month,
    pct: go.percent.toFixed(1),
  });
}

function renderBars(elId, items) {
  const max = Math.max(...items.map((d) => d.value), 1);
  const total = items.reduce((s, d) => s + d.value, 0);
  const el = $(elId);

  el.innerHTML = items.map((d) => {
    const pct = ((d.value / total) * 100).toFixed(1);
    const w = Math.max(2, (d.value / max) * 100);
    return `
        <div class="bar-row">
            <span class="bar-name" title="${d.name}">${d.name}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${w}%;background:${d.color}"></div>
            </div>
            <span class="bar-val">${fmt(d.value)}</span>
            <span class="bar-pct">${pct}%</span>
        </div>`;
  }).join('');
}

/* ── boot ── */
setLang(lang);
load()
  .then((d) => {
    DATA = d;
    renderStats(d.stats);
    renderMeter(d.go);
    renderBars('#bars-models', d.models);
    renderBars('#bars-tools', d.tools);
    $('#note').textContent = t('note', {
      log: d.log,
      date: new Date(d.generated).toLocaleString(),
    });
    $('#stamp').textContent = new Date(d.generated)
      .toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });
  })
  .catch((e) => {
    document.querySelector('main').innerHTML =
      `<p class="error">${t('error', { msg: e.message })}</p>`;
  });
