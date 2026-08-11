/* ═══════════════════════════════════════════
   OPENCODE USAGE — app.js
   Renders donut charts from real usage data
   read from opencode.log.
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

const PALETTE = [
    '#7c3aed', '#4f46e5', '#3b82f6', '#0ea5a4',
    '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#8b5cf6',
];

const RADIUS = 82;
const CIRC = 2 * Math.PI * RADIUS;

const $ = (sel) => document.querySelector(sel);

function total(arr) { return arr.reduce((s, d) => s + d.value, 0); }

function donut(container, items) {
    const sum = total(items);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 210 210');
    svg.setAttribute('width', '210');
    svg.setAttribute('height', '210');

    const track = document.createElementNS(svgNS, 'circle');
    track.setAttribute('cx', '105'); track.setAttribute('cy', '105'); track.setAttribute('r', RADIUS);
    track.setAttribute('stroke', 'var(--border)');
    container.appendChild(svg);

    let offset = 0;
    items.forEach((d) => {
        const frac = d.value / sum;
        const seg = document.createElementNS(svgNS, 'circle');
        seg.setAttribute('cx', '105'); seg.setAttribute('cy', '105'); seg.setAttribute('r', RADIUS);
        seg.setAttribute('stroke', d.color);
        seg.setAttribute('stroke-dasharray', `${CIRC * frac} ${CIRC}`);
        seg.setAttribute('stroke-dashoffset', CIRC - offset * sum);
        seg.dataset.targetOffset = CIRC - offset * sum;
        seg.style.strokeDashoffset = CIRC;
        seg.addEventListener('click', () => toggle(container, seg, d.name));
        svg.appendChild(seg);
        offset += frac;
    });

    const center = document.createElement('div');
    center.className = 'donut-center';
    center.innerHTML = `<div class="num">${sum}</div><div class="cap">Jumlah</div>`;
    container.appendChild(center);

    const legend = document.createElement('div');
    legend.className = 'legend';
    items.forEach((d) => {
        const row = document.createElement('div');
        row.className = 'legend-item';
        row.dataset.name = d.name;
        row.innerHTML = `
            <span class="legend-dot" style="background:${d.color}"></span>
            <span class="legend-name" title="${d.name}">${d.name}</span>
            <span class="legend-val">${d.value}</span>
            <span class="legend-pct">${((d.value / sum) * 100).toFixed(1)}%</span>`;
        row.addEventListener('click', () => {
            const seg = [...svg.children].find((c) => c.dataset.targetOffset === String(CIRC - (offsetIndex(d.name, items) * sum)));
            toggle(container, seg || svg.children[0], d.name);
        });
        legend.appendChild(row);
    });
    container.appendChild(legend);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            svg.querySelectorAll('circle').forEach((c) => {
                c.style.strokeDashoffset = c.dataset.targetOffset;
            });
        });
    });
}

function offsetIndex(name, items) {
    let offset = 0;
    for (const d of items) {
        if (d.name === name) return offset;
        offset += d.value;
    }
    return 0;
}

function toggle(container, seg, name) {
    const legend = container.querySelector('.legend');
    legend.querySelectorAll('.legend-item').forEach((r) => {
        r.classList.toggle('muted', r.dataset.name !== name);
    });
    seg.style.strokeWidth = seg.style.strokeWidth === '34' ? '26' : '34';
}

/* ════════════════ BOOT ════════════════ */
const models = $('.chart-wrap#chartModels');
const tools = $('.chart-wrap#chartTools');

if (models) {
    const div = document.createElement('div');
    div.className = 'donut';
    models.appendChild(div);
    donut(div, MODEL_DATA);
}
if (tools) {
    const div = document.createElement('div');
    div.className = 'donut';
    tools.appendChild(div);
    donut(div, TOOL_DATA);
}

$('#statStreams').textContent = total(MODEL_DATA).toLocaleString();
$('#statTools').textContent = total(TOOL_DATA).toLocaleString();
$('#statModels').textContent = MODEL_DATA.length;
$('#statToolKinds').textContent = TOOL_DATA.length;

$('#nightBtn').addEventListener('click', () => {
    const on = document.body.classList.toggle('night');
    localStorage.setItem('oc-usage-night', on ? '1' : '0');
});

if (localStorage.getItem('oc-usage-night') === '1') document.body.classList.add('night');
