/* ═══════════════════════════════════════════
   OPENCODE USAGE — app.js
   Renders donut charts from real usage data.
   Fixed: correct stroke-dashoffset math, clean
   SVG + legend rendering.
═══════════════════════════════════════════ */

const MODEL_DATA = [
    { name: 'opencode · deepseek-v4-flash-free', value: 2713, color: '#7c3aed' },
    { name: 'opencode-go · deepseek-v4-flash',   value: 1278, color: '#4f46e5' },
    { name: 'opencode · big-pickle',             value: 919,  color: '#3b82f6' },
    { name: 'groq · llama-3.3-70b-versatile',    value: 4,    color: '#10b981' },
];

const TOOL_DATA = [
    { name: 'bash',               value: 5848, color: '#ef4444' },
    { name: 'edit',               value: 1797, color: '#f59e0b' },
    { name: 'external_directory', value: 951,  color: '#0ea5a4' },
    { name: 'read',               value: 832,  color: '#3b82f6' },
    { name: 'grep',               value: 258,  color: '#8b5cf6' },
    { name: 'todowrite',          value: 79,   color: '#ec4899' },
    { name: 'websearch',          value: 43,   color: '#14b8a6' },
    { name: 'webfetch',           value: 42,   color: '#22c55e' },
    { name: 'glob',               value: 9,    color: '#94a3b8' },
];

const RADIUS = 78;
const CIRC = 2 * Math.PI * RADIUS;
const GAP = 2.5; // px gap between segments

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => n.toLocaleString('ms-MY');

function total(arr) { return arr.reduce((s, d) => s + d.value, 0); }

/* Build one donut chart. Returns cleanup for hover state. */
function donut(container, items) {
    const sum = total(items);
    const svgNS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    svg.setAttribute('role', 'img');

    // background track
    const track = document.createElementNS(svgNS, 'circle');
    track.setAttribute('class', 'track');
    track.setAttribute('cx', '100'); track.setAttribute('cy', '100'); track.setAttribute('r', RADIUS);
    svg.appendChild(track);

    let start = 0; // cumulative fraction (0..1)
    const segs = [];

    items.forEach((d) => {
        const frac = d.value / sum;
        const len  = Math.max(0, CIRC * frac - GAP);
        const seg = document.createElementNS(svgNS, 'circle');
        seg.setAttribute('class', 'seg');
        seg.setAttribute('cx', '100'); seg.setAttribute('cy', '100'); seg.setAttribute('r', RADIUS);
        seg.setAttribute('stroke', d.color);
        seg.setAttribute('stroke-dasharray', `${len} ${CIRC}`);
        seg.setAttribute('stroke-dashoffset', -start * CIRC); // shift start by cumulative fraction
        seg.style.opacity = 0;
        svg.appendChild(seg);
        segs.push(seg);
        start += frac;
    });

    const center = document.createElement('div');
    center.className = 'donut-center';
    center.innerHTML = `<span class="donut-num">${fmt(sum)}</span><span class="donut-cap">Jumlah</span>`;

    const legend = document.createElement('div');
    legend.className = 'legend';
    items.forEach((d, i) => {
        const row = document.createElement('button');
        row.className = 'legend-item';
        row.type = 'button';
        row.innerHTML = `
            <span class="legend-dot" style="background:${d.color}"></span>
            <span class="legend-name">${esc(d.name)}</span>
            <span class="legend-val">${fmt(d.value)}</span>
            <span class="legend-pct">${((d.value / sum) * 100).toFixed(1)}%</span>`;

        row.addEventListener('mouseenter', () => highlight(i, true));
        row.addEventListener('mouseleave', () => highlight(i, false));
        row.addEventListener('focus', () => highlight(i, true));
        row.addEventListener('blur', () => highlight(i, false));
        legend.appendChild(row);
    });

    const wrap = document.createElement('div');
    wrap.className = 'donut';
    wrap.append(svg, center);
    container.append(wrap, legend);

    function highlight(i, on) {
        const isSmall = items[i].value / sum < 0.05;
        legend.querySelectorAll('.legend-item').forEach((r, j) => {
            r.classList.toggle('dim', on && j !== i);
        });
        svg.querySelectorAll('.seg').forEach((s, j) => {
            if (on && j !== i) s.classList.add('dim');
            else s.classList.remove('dim');
        });
        center.querySelector('.donut-num').textContent = on ? fmt(items[i].value) : fmt(sum);
        center.querySelector('.donut-cap').textContent = on ? items[i].name.split(' · ').pop() : 'Jumlah';
    }

    // animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            segs.forEach((s) => { s.style.opacity = 1; });
        });
    });
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ════════════════ BOOT ════════════════ */
const models = $('#chartModels');
const tools  = $('#chartTools');

if (models) donut(models, MODEL_DATA);
if (tools)  donut(tools, TOOL_DATA);

$('#statStreams').textContent = fmt(total(MODEL_DATA));
$('#statTools').textContent   = fmt(total(TOOL_DATA));
$('#statModels').textContent  = MODEL_DATA.length;
$('#statToolKinds').textContent = TOOL_DATA.length;
$('#modelTotal').textContent  = fmt(total(MODEL_DATA));
$('#toolTotal').textContent   = fmt(total(TOOL_DATA));

/* Theme */
const body = document.body;
const nightBtn = $('#nightBtn');
nightBtn.addEventListener('click', () => {
    const on = body.classList.toggle('night');
    localStorage.setItem('oc-usage-night', on ? '1' : '0');
    nightBtn.textContent = on ? '☀️' : '🌙';
});
if (localStorage.getItem('oc-usage-night') === '1') {
    body.classList.add('night');
    nightBtn.textContent = '☀️';
}
