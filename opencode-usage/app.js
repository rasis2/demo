/* ═══════════════════════════════════════════
   OPENCODE USAGE — app.js
   Renders real usage from data.json (BM/EN).
   New format: weekly + monthly quota, cost ranking.
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
    meter_weekly_title: 'Kuota Mingguan',
    meter_monthly_title: 'Kuota Bulanan',
    meter_good: '✓ Baik',
    meter_mid: '⚠ Sederhana',
    meter_bad: '✕ Bahaya',
    meter_hit: '✕ HABIS',
    meter_status_good: 'Baik',
    meter_status_mid: 'Sederhana',
    meter_status_bad: 'Bahaya',
    meter_status_hit: 'HABIS',
    meter_sub: '{used} / {limit} ({unit}) · {pct}% digunakan',
    meter_reset: 'Reset: {reset}',
    meter_note: '⚠ {note}',
    title_consumers: 'Ranking Kos Mengikut Ejen',
    title_models: 'Pengagihan Model LLM',
    title_tools: 'Gunaan Alat',
    consumers_sub: 'Tempoh {period} · anggaran kos (USD)',
    consumers_total: '≈${total} · {pct}% dari ${limit}/bln',
    stat_streams: 'Permintaan LLM',
    stat_tools: 'Gunaan Alat',
    stat_models: 'Model Aktif',
    stat_kinds: 'Jenis Alat',
    stat_sessions: 'Sesi',
    note: 'Dikira daripada {log} · dijana {date}',
    error: 'Gagal memuat data: {msg}',
    calls: '{n} calls',
    reqs: '{n} req',
  },
  en: {
    meter_weekly_title: 'Weekly Quota',
    meter_monthly_title: 'Monthly Quota',
    meter_good: '✓ Good',
    meter_mid: '⚠ Moderate',
    meter_bad: '✕ Danger',
    meter_hit: '✕ EXHAUSTED',
    meter_status_good: 'Good',
    meter_status_mid: 'Moderate',
    meter_status_bad: 'Danger',
    meter_status_hit: 'Exhausted',
    meter_sub: '{used} / {limit} ({unit}) · {pct}% used',
    meter_reset: 'Reset: {reset}',
    meter_note: '⚠ {note}',
    title_consumers: 'Cost Ranking by Agent',
    title_models: 'LLM Model Distribution',
    title_tools: 'Tool Usage',
    consumers_sub: 'Period {period} · estimated cost (USD)',
    consumers_total: '≈${total} · {pct}% of ${limit}/mo',
    stat_streams: 'LLM Requests',
    stat_tools: 'Tool Calls',
    stat_models: 'Active Models',
    stat_kinds: 'Tool Kinds',
    stat_sessions: 'Sessions',
    note: 'Computed from {log} · generated {date}',
    error: 'Failed to load data: {msg}',
    calls: '{n} calls',
    reqs: '{n} req',
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

/* ── Quota meter (weekly / monthly) ── */
function renderMeter(prefix, quota) {
  const pct = Math.min(100, quota.percent);
  const fill = $(`#${prefix}Fill`);
  const badge = $(`#${prefix}Badge`);
  const sub = $(`#${prefix}Sub`);
  const resetEl = $(`#${prefix}Reset`);

  let cls = 'good', status = t('meter_status_good');
  if (quota.percent >= 100) { cls = 'hit'; status = t('meter_status_hit'); }
  else if (quota.percent >= 80) { cls = 'bad'; status = t('meter_status_bad'); }
  else if (quota.percent >= 50) { cls = 'mid'; status = t('meter_status_mid'); }

  fill.style.width = pct + '%';
  fill.style.background = cls === 'good' ? 'var(--good)' : cls === 'mid' ? 'var(--mid)' : 'var(--bad)';
  if (cls === 'hit') fill.style.background = 'var(--bad)';

  badge.textContent = quota.percent >= 100 ? t('meter_hit') : status;
  badge.className = 'meter-badge ' + cls;

  sub.textContent = t('meter_sub', {
    used: '$' + fmt(quota.used),
    limit: '$' + fmt(quota.limit),
    unit: quota.unit,
    pct: quota.percent.toFixed(1),
  });

  let resetText = '';
  if (quota.reset) {
    const d = new Date(quota.reset);
    resetText = t('meter_reset', { reset: d.toLocaleString(lang === 'en' ? 'en-US' : 'ms-MY') });
  }
  if (quota.note) {
    resetText = (resetText ? resetText + ' · ' : '') + t('meter_note', { note: quota.note });
  }
  resetEl.textContent = resetText;
  resetEl.classList.toggle('warn', !!quota.note);
}

/* ── Consumer cost ranking (with cost $) ── */
function renderConsumers(consumers, quota) {
  const max = Math.max(...consumers.map((d) => d.cost), 0.01);
  const total = consumers.reduce((s, d) => s + d.cost, 0);
  const el = $('#bars-consumers');

  el.innerHTML = consumers.map((d) => {
    const w = Math.max(2, (d.cost / max) * 100);
    const subLine = [
      d.model ? d.model : '',
      d.calls ? t('calls', { n: fmt(d.calls) }) : '',
      d.reqs ? t('reqs', { n: fmt(d.reqs) }) : '',
      d.cacheRead ? 'cache ' + d.cacheRead : '',
    ].filter(Boolean).join(' · ');

    return `
        <div class="bar-row consumer">
            <span class="bar-name" title="${d.name}">${d.name}</span>
            <span class="bar-meta">${subLine}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${w}%;background:${d.color}"></div>
            </div>
            <span class="bar-val cost">$${d.cost.toFixed(2)}</span>
            <span class="bar-pct">${d.percent.toFixed(1)}%</span>
        </div>`;
  }).join('');

  $('#totalChip').textContent = t('consumers_total', {
    total: total.toFixed(2),
    pct: ((total / quota.monthly.limit) * 100).toFixed(1),
    limit: fmt(quota.monthly.limit),
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
    renderMeter('meterWeekly', d.quota.weekly);
    renderMeter('meterMonthly', d.quota.monthly);
    renderConsumers(d.consumers, d.quota);
    renderBars('#bars-models', d.models);
    renderBars('#bars-tools', d.tools);
    $('#consumersSub').textContent = t('consumers_sub', { period: d.period });
    $('#note').textContent = t('note', {
      log: d.log || 'opencode.log',
      date: new Date(d.generated).toLocaleString(),
    });
    $('#stamp').textContent = new Date(d.generated)
      .toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });
  })
  .catch((e) => {
    document.querySelector('main').innerHTML =
      `<p class="error">${t('error', { msg: e.message })}</p>`;
  });
