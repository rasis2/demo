#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OPENCODE USAGE — parse-log.js
   Reads opencode.log + databases, emits data.json
   in the NEW format: quota.weekly/monthly + consumers.
   Run: node parse-log.js [path/to/opencode.log]
═══════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DEFAULT_LOG = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  '.local', 'share', 'opencode', 'log', 'opencode.log'
);

const logPath = process.argv[2] || DEFAULT_LOG;
if (!fs.existsSync(logPath)) {
  console.error(`Log tidak dijumpai: ${logPath}`);
  process.exit(1);
}

const PALETTE = ['#7c3aed', '#4f46e5', '#3b82f6', '#0ea5a4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#8b5cf6', '#22c55e', '#64748b'];
const TOOL_COLORS = {
  bash: '#ef4444', edit: '#f59e0b', external_directory: '#0ea5a4',
  read: '#3b82f6', grep: '#8b5cf6', todowrite: '#ec4899',
  websearch: '#14b8a6', webfetch: '#22c55e', glob: '#94a3b8',
  write: '#e11d48', skill: '#f97316', task: '#6366f1', question: '#a855f7',
};

// ── Pricing & limits (USD) ──
// DeepSeek V4 Flash pricing per 1M tokens:
const GO_PRICING = { input: 0.14, output: 0.28, cacheRead: 0.0028, cacheWrite: 0 };
const MONTHLY_LIMIT = 60; // OpenCode Go monthly: $60
const WEEKLY_LIMIT = 30;  // OpenCode Go weekly per-user: $30

const stats = {
  generated: null,
  logPath,
  models: {},
  tools: {},
  sessions: 0,
  loops: 0,
  streams: 0,
};

const rl = readline.createInterface({ input: fs.createReadStream(logPath), crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('message=stream')) {
    stats.streams++;
    const m = line.match(/providerID=(\S+) modelID=(\S+)/);
    if (m && m[1] && m[2] && !m[1].includes('\\\\') && !m[2].includes('\\\\')) {
      const key = `${m[1]} · ${m[2]}`;
      stats.models[key] = (stats.models[key] || 0) + 1;
    }
  } else if (line.includes('message=evaluated')) {
    const m = line.match(/permission=(\S+)/);
    if (m && m[1] !== 'permission' && m[1] !== 'pattern') {
      stats.tools[m[1]] = (stats.tools[m[1]] || 0) + 1;
    }
  } else if (line.includes('message=created')) {
    stats.sessions++;
  } else if (line.includes('message=loop')) {
    stats.loops++;
  }
});

rl.on('close', () => {
  stats.generated = new Date().toISOString();
  const models = Object.entries(stats.models)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const tools = Object.entries(stats.tools)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  models.forEach((d, i) => { d.color = PALETTE[i % PALETTE.length]; });
  tools.forEach((d) => { d.color = TOOL_COLORS[d.name] || PALETTE[tools.indexOf(d) % PALETTE.length]; });

  // Quota from opencode.db (monthly + weekly) and consumers from hermes state.db
  const quota = readQuota();
  const consumers = readConsumers();

  const out = {
    generated: stats.generated,
    period: periodLabel(),
    quota,
    consumers,
    stats: {
      streams: stats.streams,
      models: models.length,
      tools: tools.reduce((s, d) => s + d.value, 0),
      toolKinds: tools.length,
      sessions: stats.sessions,
      loops: stats.loops,
    },
    models,
    tools,
    note: 'Anggaran harga off-peak (konservatif). Sumber authoritative: dashboard opencode.ai',
  };

  const outPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`data.json dijana: ${stats.streams} stream, ${models.length} model, ${tools.length} jenis alat`);
  console.log(`→ Kuota bulanan: $${quota.monthly.used.toFixed(2)} / $${quota.monthly.limit} (${quota.monthly.percent.toFixed(1)}%)`);
  console.log(`→ Kuota mingguan: $${quota.weekly.used.toFixed(2)} / $${quota.weekly.limit} (${quota.weekly.percent.toFixed(1)}%)`);
  console.log(`→ Consumer: ${consumers.length} entri`);
});

/* ── Period label (current month window) ── */
function periodLabel() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return `${d}–${last} ${['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogo','Sep','Okt','Nov','Dis'][now.getMonth()]} ${now.getFullYear()}`;
}

/* ── Read quota (monthly + weekly) from opencode.db ── */
function readQuota() {
  const zero = (limit) => ({ used: 0, limit, percent: 0, unit: 'USD' });
  const monthly = zero(MONTHLY_LIMIT);
  const weekly = zero(WEEKLY_LIMIT);

  const dataHome = path.join(process.env.USERPROFILE || process.env.HOME || '', '.local', 'share', 'opencode');
  const dbPath = path.join(dataHome, 'opencode.db');

  let DatabaseSync;
  try { DatabaseSync = require('node:sqlite').DatabaseSync; } catch (_) { return { monthly, weekly }; }
  if (!fs.existsSync(dbPath)) return { monthly, weekly };

  let d;
  try { d = new DatabaseSync(dbPath, { readOnly: true }); } catch (_) { return { monthly, weekly }; }

  const now = new Date();
  const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  const monthEnd = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
  const weekStart = now.getTime() - 7 * 86400 * 1000;

  let mTokens = { total: 0, input: 0, output: 0, cacheRead: 0 }, mReq = 0;
  let wTokens = { total: 0, input: 0, output: 0, cacheRead: 0 }, wReq = 0;

  try {
    const rows = d.prepare('SELECT data FROM message').all();
    for (const r of rows) {
      let m;
      try { m = JSON.parse(r.data); } catch (_) { continue; }
      if (m.role !== 'assistant' || m.providerID !== 'opencode-go' || !m.tokens) continue;
      const created = m.time && m.time.created;
      if (!created) continue;
      const t = m.tokens;
      const tok = {
        total: t.total || 0, input: t.input || 0,
        output: t.output || 0, cacheRead: (t.cache && t.cache.read) || 0,
      };
      if (created >= monthStart && created < monthEnd) {
        mTokens = add(mTokens, tok); mReq++;
      }
      if (created >= weekStart) {
        wTokens = add(wTokens, tok); wReq++;
      }
    }
  } catch (_) {}
  d.close();

  monthly.used = round2(cost(mTokens));
  monthly.percent = Math.round((monthly.used / MONTHLY_LIMIT) * 1000) / 10;

  weekly.used = round2(cost(wTokens));
  weekly.percent = Math.round((weekly.used / WEEKLY_LIMIT) * 1000) / 10;
  if (weekly.percent >= 100) {
    weekly.note = 'Had mingguan TELAH HABIS';
  }

  return { monthly, weekly };
}

function round2(n) { return Math.round(n * 100) / 100; }

function add(a, b) {
  return {
    total: a.total + b.total, input: a.input + b.input,
    output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead,
  };
}

/* DeepSeek V4 Flash cost estimate (USD) */
function cost(tok) {
  return (tok.input / 1e6) * GO_PRICING.input
       + (tok.output / 1e6) * GO_PRICING.output
       + (tok.cacheRead / 1e6) * GO_PRICING.cacheRead;
}

/* ── Read consumers (cost by source/agent) from hermes state.db ── */
function readConsumers() {
  const appData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || process.env.HOME || '', 'AppData', 'Local');
  const dbPath = path.join(appData, 'hermes', 'state.db');
  let DatabaseSync;
  try { DatabaseSync = require('node:sqlite').DatabaseSync; } catch (_) { return fallbackConsumers(); }
  if (!fs.existsSync(dbPath)) return fallbackConsumers();

  let d;
  try { d = new DatabaseSync(dbPath, { readOnly: true }); } catch (_) { return fallbackConsumers(); }

  const weekStart = Math.floor(new Date().getTime() / 1000 - 7 * 86400);
  const rows = [];
  try {
    const all = d.prepare(
      `SELECT source, title, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens
       FROM sessions WHERE started_at > ?`
    ).all(weekStart);
    for (const r of all) rows.push(r);
  } catch (_) {}
  d.close();

  if (!rows.length) return fallbackConsumers();

  const colors = PALETTE;
  const byKey = new Map();
  const KEY_MAP = [
    { re: /telegram/i, name: 'Hermes gateway' },
    { re: /cli/i, name: 'CLI / build' },
    { re: /cron/i, name: 'Hermes cron' },
    { re: /subagent/i, name: 'Subagents' },
  ];
  const OTHER = 'Lain-lain';

  for (const r of rows) {
    const c = cost({
      input: r.input_tokens || 0, output: r.output_tokens || 0,
      cacheRead: r.cache_read_tokens || 0,
    });
    let name = OTHER;
    for (const m of KEY_MAP) { if (m.re.test(r.source || '')) { name = m.name; break; } }
    if (!byKey.has(name)) byKey.set(name, { name, cost: 0, calls: 0 });
    const e = byKey.get(name);
    e.cost += c;
    e.calls += 1;
  }

  const entries = [...byKey.values()].map((e, i) => {
    const pct = e.cost; // placeholder; normalized below
    return { name: e.name, cost: Math.round(e.cost * 100) / 100, calls: e.calls, color: colors[i % colors.length] };
  });
  entries.sort((a, b) => b.cost - a.cost);

  // Recompute percent of total consumers cost
  const total = entries.reduce((s, e) => s + e.cost, 0);
  for (const e of entries) e.percent = Math.round((e.cost / total) * 1000) / 10;

  // Top consumers get named agents folded into "Subagents"? Keep simple: rename subagents detail
  return entries;
}

/* Fallback: single aggregated entry (if hermes db unavailable) */
function fallbackConsumers() {
  return [{ name: 'OpenCode Go', cost: 0, percent: 0, calls: 0, color: PALETTE[0] }];
}