/* ═══════════════════════════════════════════
   OPENCODE USAGE — app.js
   Renders real usage from data.json.
   No charts library, no SVG — just div bars.
═══════════════════════════════════════════ */

const fmt = (n) => n.toLocaleString('en-US');

const $ = (sel) => document.querySelector(sel);

async function load() {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json tidak boleh dimuat');
    return res.json();
}

function renderStats(stats) {
    const items = [
        { label: 'Permintaan LLM', value: stats.streams },
        { label: 'Gunaan Alat', value: stats.tools },
        { label: 'Model Aktif', value: stats.models },
        { label: 'Jenis Alat', value: stats.toolKinds },
        { label: 'Sesi', value: stats.sessions },
    ];
    $('#stats').innerHTML = items.map((s) => `
        <div class="stat">
            <span class="stat-num">${fmt(s.value)}</span>
            <span class="stat-label">${s.label}</span>
        </div>`).join('');
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

load()
    .then((d) => {
        renderStats(d.stats);
        renderBars('#bars-models', d.models);
        renderBars('#bars-tools', d.tools);
        $('#note').textContent =
            `Dikira daripada ${d.log} · dijana ${new Date(d.generated).toLocaleString()}`;
        const date = new Date(d.generated);
        $('#stamp').textContent = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    })
    .catch((e) => {
        document.querySelector('main').innerHTML =
            `<p class="error">Gagal memuat data: ${e.message}</p>`;
    });
