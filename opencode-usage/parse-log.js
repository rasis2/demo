#!/usr/bin/env node
/* ═══════════════════════════════════════════
   OPENCODE USAGE — parse-log.js
   Reads opencode.log and emits data.json with
   real usage counts. Run: node parse-log.js [path/to/opencode.log]
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

// ── OpenCode Go quota (from https://opencode.ai/docs/go/) ──
// DeepSeek V4 Flash pricing per 1M tokens (USD):
const GO_PRICING = { input: 0.14, output: 0.28, cacheRead: 0.0028, cacheWrite: 0 };
const GO_MONTHLY_LIMIT_USD = 60; // Go monthly limit: $60 of usage

const stats = {
  generated: null,
  logPath,
  models: {},   // providerID/modelID -> count
  tools: {},    // tool name -> count
  sessions: 0,
  loops: 0,
  streams: 0,
};

const rl = readline.createInterface({ input: fs.createReadStream(logPath), crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('message=stream')) {
    stats.streams++;
    const m = line.match(/providerID=(\S+) modelID=(\S+)/);
    if (m) {
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

  // Real token usage + cost from opencode SQLite DB (provider opencode-go)
  const go = readGoUsage();

  const out = {
    generated: stats.generated,
    log: 'opencode.log',
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
    go,
  };

  const outPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`data.json dijana: ${stats.streams} stream, ${models.length} model, ${tools.length} jenis alat`);
  console.log(`Go usage: $${go.used.toFixed(2)} / $${go.limit} (${go.percent.toFixed(1)}%)`);
});

/* Read opencode-go token usage from opencode.db and compute cost. */
function readGoUsage() {
  const zero = {
    provider: 'opencode-go', model: 'deepseek-v4-flash',
    used: 0, limit: GO_MONTHLY_LIMIT_USD, percent: 0,
    tokens: { total: 0, input: 0, output: 0, cacheRead: 0 }, requests: 0,
  };

  let dbPath;
  const dataHome = path.join(process.env.USERPROFILE || process.env.HOME || '', '.local', 'share', 'opencode');
  dbPath = path.join(dataHome, 'opencode.db');

  let DatabaseSync;
  try { DatabaseSync = require('node:sqlite').DatabaseSync; }
  catch (_) { return zero; }

  if (!fs.existsSync(dbPath)) return zero;

  let d;
  try { d = new DatabaseSync(dbPath, { readOnly: true }); }
  catch (_) { return zero; }

  let tokens = { total: 0, input: 0, output: 0, cacheRead: 0 };
  let requests = 0;

  // Only count the current calendar month (quota is monthly).
  const now = new Date();
  const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  const monthEnd = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);

  try {
    const rows = d.prepare('SELECT data FROM message').all();
    for (const r of rows) {
      let m;
      try { m = JSON.parse(r.data); } catch (_) { continue; }
      if (m.role !== 'assistant' || m.providerID !== 'opencode-go' || !m.tokens) continue;
      const created = m.time && m.time.created;
      if (!created || created < monthStart || created >= monthEnd) continue;
      const t = m.tokens;
      tokens.total += t.total || 0;
      tokens.input += t.input || 0;
      tokens.output += t.output || 0;
      tokens.cacheRead += (t.cache && t.cache.read) || 0;
      requests++;
    }
  } catch (_) {}
  d.close();

  const used = (tokens.input / 1e6) * GO_PRICING.input
             + (tokens.output / 1e6) * GO_PRICING.output
             + (tokens.cacheRead / 1e6) * GO_PRICING.cacheRead;

  return {
    provider: 'opencode-go',
    model: 'deepseek-v4-flash',
    month: now.getUTCFullYear() + '-' + String(now.getUTCMonth() + 1).padStart(2, '0'),
    used: Math.round(used * 100) / 100,
    limit: GO_MONTHLY_LIMIT_USD,
    percent: Math.round((used / GO_MONTHLY_LIMIT_USD) * 1000) / 10,
    tokens,
    requests,
  };
}
