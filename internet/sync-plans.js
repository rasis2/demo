#!/usr/bin/env node
// Sync script untuk Compare Plans "live".
//
//   node sync-plans.js to-json   index.html  →  plans.json   (default)
//   node sync-plans.js to-html   plans.json  →  index.html
//
// plans.json ialah sumber data jauh yang dimuat oleh aplikasi (lihat LIVE_PLAN_URLS
// dalam index.html). Jalankan to-json setiap kali kamu ubah senarai PLANS dalam
// index.html, kemudian push plans.json ke GitHub.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML = path.join(__dirname, 'index.html');
const JSONP = path.join(__dirname, 'plans.json');

function extractPlans(html) {
  const start = html.indexOf('let PLANS = [');
  if (start === -1) throw new Error('PLANS array not found in index.html');
  const from = html.indexOf('[', start);
  const end = html.indexOf('\n];', from);
  if (from === -1 || end === -1) throw new Error('Could not delimit PLANS array');
  const body = html.slice(from, end + 3);
  // eslint-disable-next-line no-new-func
  const plans = new Function('return ' + body)();
  if (!Array.isArray(plans)) throw new Error('PLANS is not an array');
  return plans;
}

function toJSON() {
  const html = fs.readFileSync(HTML, 'utf8');
  const plans = extractPlans(html);
  fs.writeFileSync(JSONP, JSON.stringify(plans, null, 2) + '\n');
  console.log('plans.json written: ' + plans.length + ' plans');
}

function escapeJs(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function plansToHTMLBlock(plans) {
  let out = 'let PLANS = [\n';
  for (const p of plans) {
    const feats = (p.features || []).map(f => "'" + escapeJs(f) + "'").join(',');
    const flags = [];
    if (p.value) flags.push(' value:true');
    if (p.bestValue) flags.push(' bestValue:true');
    if (p.desc) flags.push(" desc:'" + escapeJs(p.desc) + "'");
    if (p.base) flags.push(' base:' + p.base);
    if (p.upload) flags.push(' upload:' + p.upload);
    if (p.install) flags.push(' install:' + p.install);
    if (p.contract) flags.push(' contract:' + p.contract);
    if (p.rebate) flags.push(' rebate:' + p.rebate);
    if (p.includes && p.includes.length) flags.push(" includes:['" + p.includes.map(escapeJs).join("','") + "']");
    if (p.special && p.special.length) flags.push(" special:['" + p.special.map(escapeJs).join("','") + "']");
    if (p.addons && p.addons.length) flags.push(" addons:[" + p.addons.map(a => "{label:'" + escapeJs(a.label) + "',price:" + a.price + "}").join(',') + "]");
    const flagStr = flags.length ? ',' + flags.join(',') : '';
    out += "  { isp:'" + escapeJs(p.isp) + "', name:'" + escapeJs(p.name) + "', speed:" + p.speed + ", price:" + p.price +
      ", features:[" + feats + "]" + flagStr + ' },\n';
  }
  out += '];';
  return out;
}

function toHTML() {
  const plans = JSON.parse(fs.readFileSync(JSONP, 'utf8'));
  const html = fs.readFileSync(HTML, 'utf8');
  const block = plansToHTMLBlock(plans);
  const start = html.indexOf('let PLANS = [');
  const end = html.indexOf('\n];', start);
  if (start === -1 || end === -1) throw new Error('PLANS block not found in index.html');
  const updated = html.slice(0, start) + block + html.slice(end + 3);
  fs.writeFileSync(HTML, updated, 'utf8');
  console.log('index.html PLANS updated: ' + plans.length + ' plans');
}

const mode = process.argv[2] || 'to-json';
if (mode === 'to-json') toJSON();
else if (mode === 'to-html') toHTML();
else { console.error('Unknown mode: ' + mode + ' (use to-json or to-html)'); process.exit(1); }
