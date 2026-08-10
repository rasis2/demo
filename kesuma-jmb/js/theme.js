const THEMES = ['obsidian','light','breeze','candy']
const THEME_LABELS = { obsidian:'🌑 Obsidian', light:'☀️ Light', breeze:'🌊 Breeze', candy:'🍬 Candy' }
const THEME_ICONS  = { obsidian:'🌑', light:'☀️', breeze:'🌊', candy:'🍬' }

function getTheme() { return localStorage.getItem('kp_theme') || 'obsidian' }

function setTheme(theme) {
  localStorage.setItem('kp_theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
  // update dropdown label if present
  const lbl = document.getElementById('_themeLabel')
  if (lbl) lbl.textContent = THEME_ICONS[theme] || theme
  // close dropdown
  document.querySelectorAll('._dd-panel').forEach(p => p.style.display = 'none')
}

function applyTheme() { setTheme(getTheme()) }

function renderThemeSwitcher(containerId) {
  const el = document.getElementById(containerId)
  if (!el) return
  const cur = getTheme()
  el.innerHTML = `
    <div class="_dd" style="position:relative">
      <button id="_themeLabel" class="_dd-btn" onclick="_toggleDD(this)" title="Theme">
        ${THEME_ICONS[cur] || '🎨'}
      </button>
      <div class="_dd-panel" style="display:none;position:absolute;right:0;top:calc(100% + 6px);background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:4px;min-width:130px;z-index:200;box-shadow:0 4px 20px rgba(0,0,0,0.2)">
        ${THEMES.map(t => `
          <div onclick="setTheme('${t}')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;background:${t===cur?'var(--surface2)':'transparent'};color:${t===cur?'var(--accent)':'var(--text-muted)'};transition:background 0.15s"
            onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='${t===cur?'var(--surface2)':'transparent'}'">
            ${THEME_LABELS[t]}${t===cur?' ✓':''}
          </div>`).join('')}
      </div>
    </div>`
}

function renderLangSwitcher(containerId) {
  const langs = [
    { code:'ms', label:'🇲🇾 BM' },
    { code:'en', label:'🇬🇧 EN' },
    { code:'zh', label:'🇨🇳 中文' },
    { code:'ta', label:'🇮🇳 தமிழ்' },
  ]
  const cur = getLang()
  const curLang = langs.find(l => l.code === cur) || langs[0]
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = `
    <div class="_dd" style="position:relative">
      <button id="_langLabel" class="_dd-btn" onclick="_toggleDD(this)" title="Language">
        ${curLang.label}
      </button>
      <div class="_dd-panel" style="display:none;position:absolute;right:0;top:calc(100% + 6px);background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:4px;min-width:120px;z-index:200;box-shadow:0 4px 20px rgba(0,0,0,0.2)">
        ${langs.map(l => `
          <div onclick="setLang('${l.code}')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;background:${l.code===cur?'var(--surface2)':'transparent'};color:${l.code===cur?'var(--accent)':'var(--text-muted)'};transition:background 0.15s"
            onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='${l.code===cur?'var(--surface2)':'transparent'}'">
            ${l.label}${l.code===cur?' ✓':''}
          </div>`).join('')}
      </div>
    </div>`
}

// Shared dropdown toggle & outside-click close
function _toggleDD(btn) {
  const panel = btn.nextElementSibling
  const isOpen = panel.style.display === 'block'
  document.querySelectorAll('._dd-panel').forEach(p => p.style.display = 'none')
  if (!isOpen) panel.style.display = 'block'
}

document.addEventListener('click', e => {
  if (!e.target.closest('._dd')) {
    document.querySelectorAll('._dd-panel').forEach(p => p.style.display = 'none')
  }
})

document.addEventListener('DOMContentLoaded', applyTheme)
