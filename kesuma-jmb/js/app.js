/* ═══════════════════════════════════════════════════════
   app.js — Kesuma JMB SPA core
   Router, navigation, session, helpers, dashboard, setup.
   View modules register themselves in the VIEWS registry.
   ═══════════════════════════════════════════════════════ */
const VIEWS = {}   // id -> { key, icon, render }
const state = {
  view: 'dashboard',
  session: null,   // { type:'owner', unit, name } | { type:'staff', role }
  settings: null,
  cache: {},
}

const $ = id => document.getElementById(id)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')

// ── Toasts ──
function toast(msg, type) {
  const stack = $('toastStack')
  const el = document.createElement('div')
  el.className = 'toast ' + (type || '')
  el.innerHTML = (type === 'success' ? '✓ ' : type === 'error' ? '✕ ' : '') + esc(msg)
  stack.appendChild(el)
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300) }, 2800)
}

// ── Format helpers ──
function fmtMoney(n) { return 'RM ' + Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString(getLang() === 'en' ? 'en-MY' : 'ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
function timeAgo(ts) {
  if (!ts) return '—'
  const d = (Date.now() - new Date(ts).getTime()) / 1000
  if (d < 60) return '1m'
  if (d < 3600) return Math.floor(d / 60) + 'm'
  if (d < 86400) return Math.floor(d / 3600) + 'h'
  return Math.floor(d / 86400) + 'd'
}

function emptyState(icon, msg) {
  return '<div class="empty"><div class="ei">' + icon + '</div><p>' + esc(msg) + '</p></div>'
}

// ── Badges ──
const STATUS_MAP = {
  Pending: ['gold', 'vis_pending'], 'In Progress': ['orange', 'mnt_progress'], Open: ['red', 'mnt_open'],
  Resolved: ['green', 'mnt_resolved'], Done: ['green', 'st_done'], Approved: ['green', 'vis_approved'],
  Rejected: ['red', 'vis_rejected'], 'Checked In': ['blue', 'vis_checkedin'], 'Checked Out': ['gray', 'vis_checkedout'],
}
function badge(status) {
  const m = STATUS_MAP[status] || ['gray', 'none']
  return '<span class="badge ' + m[0] + '">' + esc(t(m[1])) + '</span>'
}

// ── Session ──
function saveSession() {
  try { sessionStorage.setItem('kj_session', JSON.stringify(state.session)) } catch (e) {}
}
function loadSession() {
  try { state.session = JSON.parse(sessionStorage.getItem('kj_session')) } catch (e) { state.session = null }
}
function isOwner() { return state.session && state.session.type === 'owner' }
function isStaff() { return state.session && state.session.type === 'staff' }
function isAdmin() { return isStaff() && state.session.role === 'admin' }

function logout() {
  state.session = null; saveSession(); updateShell(); renderView(); toast(t('logout_ok'))
}

// ── Modal helper ──
function openModal(html, onMount) {
  const ov = document.createElement('div')
  ov.className = 'modal-overlay show'
  ov.innerHTML = '<div class="modal">' + html + '</div>'
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov) })
  document.body.appendChild(ov)
  applyI18n(ov)
  if (onMount) onMount(ov)
  return ov
}
function closeModal(ov) {
  if (ov) { ov.classList.remove('show'); setTimeout(() => ov.remove(), 220) }
}

// ── Nav / shell ──
const NAV = [
  { id: 'dashboard', icon: '📊', key: 'nav_dashboard', roles: null },
  { id: 'parcels', icon: '📦', key: 'nav_parcels', roles: null },
  { id: 'visitors', icon: '🪪', key: 'nav_visitors', roles: null },
  { id: 'maintenance', icon: '🔧', key: 'nav_maintenance', roles: null },
  { id: 'payments', icon: '💰', key: 'nav_payments', roles: null },
  { id: 'announcements', icon: '📢', key: 'nav_announcements', roles: null },
  { id: 'bookings', icon: '📅', key: 'nav_bookings', roles: null },
  { id: 'vehicles', icon: '🚗', key: 'nav_vehicles', roles: null },
  { id: 'documents', icon: '📄', key: 'nav_documents', roles: null },
  { id: 'residents', icon: '👥', key: 'nav_residents', roles: ['admin'] },
  { id: 'tenants', icon: '🏠', key: 'nav_tenants', roles: ['admin'] },
  { id: 'settings', icon: '⚙️', key: 'nav_settings', roles: ['auth'] },
]

function navVisible(item) {
  if (!item.roles) return true
  if (item.roles.includes('auth') && (isStaff() || isOwner())) return true
  if (item.roles.includes('admin') && isAdmin()) return true
  return false
}

function updateShell() {
  // Sidebar nav
  const nav = $('sidebarNav')
  const groups = [{ label: null, items: NAV.slice(0, 8) }, { label: t('nav_settings'), items: NAV.slice(8) }]
  nav.innerHTML = groups.map(g =>
    (g.label ? '<div class="nav-label">' + g.label + '</div>' : '') +
    g.items.filter(navVisible).map(n =>
      '<button class="nav-item' + (state.view === n.id ? ' active' : '') + '" data-nav="' + n.id + '">' +
        '<span class="ni">' + n.icon + '</span>' + esc(t(n.key)) + '</button>'
    ).join('')
  ).join('')
  nav.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => goto(b.dataset.nav)))

  // Sidebar footer (user / login)
  const foot = $('sidebarFooter')
  if (state.session) {
    const label = isOwner()
      ? t('role_owner') + ' · ' + esc(state.session.unit)
      : t('role_' + state.session.role)
    foot.innerHTML =
      '<div class="sidebar-user">' +
        '<div class="avatar">' + (isOwner() ? '🏠' : isAdmin() ? '⚙️' : '🛡️') + '</div>' +
        '<div class="user-block"><div class="user-name">' + esc(state.session.name || label) + '</div>' +
        '<div class="user-sub">' + label + '</div></div>' +
        '<button class="icon-btn-sm" id="logoutBtn" title="' + t('logout') + '">⎋</button>' +
      '</div>'
    const lb = $('logoutBtn'); if (lb) lb.addEventListener('click', logout)
  } else {
    foot.innerHTML =
      '<button class="btn btn-primary btn-block" id="loginBtn">🔐 ' + t('login') + '</button>'
    $('loginBtn').addEventListener('click', showLogin)
  }

  // Topbar title
  const v = VIEWS[state.view]
  $('topbarTitle').textContent = v ? t(v.key) : ''
}

// ── Router ──
function goto(view) {
  location.hash = view
}
function onHash() {
  const h = (location.hash || '#dashboard').replace('#', '')
  state.view = VIEWS[h] ? h : 'dashboard'
  updateShell()
  renderView()
}

// ── Login modal (username + password only) ──
function showLogin() {
  openModal(
    '<div class="modal-head"><h3>🔐 ' + t('login_title') + '</h3><button class="icon-btn-sm" id="mlclose">✕</button></div>' +
    '<div class="modal-body">' +
      '<div class="field"><label data-i18n="username_lbl"></label><input class="input" id="lg_user" placeholder="' + t('username_ph') + '" autocomplete="off" autofocus></div>' +
      '<div class="field"><label data-i18n="password_lbl"></label><input class="input" type="password" id="lg_pass" placeholder="' + t('password_ph') + '"></div>' +
      '<div class="error-text" id="lg_err" style="margin-bottom:8px"></div>' +
      '<button class="btn btn-primary btn-block btn-lg" id="lg_go">' + t('login') + '</button>' +
      '<p class="muted small mt-8" style="text-align:center">' + t('demo_note_creds') + '</p>' +
    '</div>',
    ov => {
      ov.querySelector('#mlclose').onclick = () => closeModal(ov)
      const go = async () => {
        const username = ov.querySelector('#lg_user').value.trim()
        const password = ov.querySelector('#lg_pass').value
        const errEl = ov.querySelector('#lg_err')
        if (!username || !password) { errEl.textContent = t('required'); return }
        const btn = ov.querySelector('#lg_go'); btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
        try {
          const r = await kjLogin(username, password)
          if (r.error) { errEl.textContent = r.error; btn.disabled = false; btn.textContent = t('login'); return }
          const u = r.user
          if (u.role === 'owner' || u.role === 'tenant') {
            state.session = { type: 'owner', role: u.role, unit: u.unit, name: u.name || u.username }
          } else {
            state.session = { type: 'staff', role: u.role, name: u.name || u.username }
          }
          saveSession(); closeModal(ov); updateShell(); renderView(); toast(t('login_success'), 'success')
        } catch (e) { errEl.textContent = t('err_server') }
        btn.disabled = false; btn.textContent = t('login')
      }
      ov.querySelector('#lg_go').onclick = go
      const enter = e => { if (e.key === 'Enter') go() }
      ov.querySelector('#lg_user').addEventListener('keydown', enter)
      ov.querySelector('#lg_pass').addEventListener('keydown', enter)
    }
  )
}
function showOwnerLogin() { showLogin() }
function showStaffLogin() { showLogin() }

// ── View render dispatch ──
async function renderView() {
  const wrap = $('appContent')
  const v = VIEWS[state.view]
  if (!v) return
  try {
    await v.render(wrap)
  } catch (e) {
    if (e && e.message === 'NOT_CONFIGURED') { showSetup(); return }
    const noSchema = e && /PGRST205|could not find the table/i.test(e.message)
    if (noSchema) { showSetup(); return }
    console.error(e)
    wrap.innerHTML = '<div class="card card-pad"><div class="empty"><div class="ei">⚠️</div><p>' + t('err_server') + '</p><button class="btn btn-ghost mt-16" onclick="renderView()">' + t('retry') + '</button></div></div>'
  }
}

// ═══════════ SETUP (Supabase not configured) ═══════════
function showSetup() {
  const ov = $('setupOverlay')
  ov.classList.add('show')
  const cfg = kjGetConfig()
  $('setupUrl').value = cfg.supabaseUrl || ''
  $('setupKey').value = cfg.supabaseAnon || ''
  $('setupBtn').onclick = async () => {
    const url = $('setupUrl').value.trim(), key = $('setupKey').value.trim()
    const err = $('setupError'); err.textContent = ''
    if (!url || !key) { err.textContent = t('required'); return }
    kjSaveConfig(url, key)
    kjResetClient()
    $('setupBtn').textContent = t('loading'); $('setupBtn').disabled = true
    const r = await kjTestConnection()
    $('setupBtn').textContent = t('setup_save'); $('setupBtn').disabled = false
    if (r.ok) { ov.classList.remove('show'); toast(t('setup_ok'), 'success'); renderView() }
    else if (r.needsSchema) {
      err.innerHTML = '⚠️ ' + t('setup_need_schema')
    } else {
      err.textContent = t('setup_fail') + (r.error && r.error !== 'NOT_CONFIGURED' ? ' (' + r.error + ')' : '')
    }
  }
}

// ═══════════ DASHBOARD VIEW ═══════════
VIEWS.dashboard = {
  key: 'nav_dashboard', icon: '📊',
  render: async (wrap) => {
    const anns = await kjAnnouncements()
    const sessions = state.session
    const lang = getLang()

    const stat = (icon, val, lbl, tone) =>
      '<div class="stat-card ' + (tone || '') + '"><div class="sc-ico">' + icon + '</div><div class="sc-val">' + val + '</div><div class="sc-lbl">' + esc(lbl) + '</div></div>'

    const hello = new Date().toLocaleDateString(lang === 'en' ? 'en-MY' : 'ms-MY', { weekday: 'long', day: 'numeric', month: 'long' })

    // Full stats are admin-only. Staff/owners get their own; guests get none.
    let statsHtml = ''
    if (isAdmin()) {
      const s = await kjStats()
      statsHtml =
        '<div class="stat-grid">' +
          stat('🏢', s.units, t('dash_units')) +
          stat('📦', s.parcelsPending, t('dash_pending_parcels'), 'tone-orange') +
          stat('🪪', s.visitorsToday, t('dash_today_visitors'), 'tone-blue') +
          stat('🔧', s.maintOpen, t('dash_open_maintenance'), 'tone-red') +
          stat('💰', fmtMoney(s.paymentsTotal), t('dash_collected'), 'tone-green') +
          stat('📅', s.bookingsPending, t('dash_bookings_pending'), 'tone-purple') +
        '</div>'
    } else if (isStaff()) {
      const [vis, par] = await Promise.all([kjVisitors(), kjParcels()])
      const today = new Date().toDateString()
      statsHtml =
        '<div class="stat-grid">' +
          stat('🪪', vis.filter(v => v.status === 'Pending').length, t('dash_pending_visitors'), 'tone-blue') +
          stat('🚶', vis.filter(v => v.created_at && new Date(v.created_at).toDateString() === today).length, t('dash_today_visitors')) +
          stat('✅', vis.filter(v => v.status === 'Approved').length, t('st_approved'), 'tone-green') +
          stat('📦', par.filter(p => p.status === 'Pending').length, t('dash_pending_parcels'), 'tone-orange') +
        '</div>'
    } else if (isOwner()) {
      const unit = state.session.unit
      const [myParcels, allVis, myPay, myMaint, myBook] = await Promise.all([
        kjParcelsByUnit(unit), kjVisitors(), kjPaymentsByUnit(unit), kjMaintenance(), kjBookings(),
      ])
      const fees = await kjGetSettings()
      const paid = myPay.reduce((a, p) => a + Number(p.amount || 0), 0)
      statsHtml =
        '<div class="stat-grid">' +
          stat('📦', myParcels.filter(p => p.status === 'Pending').length, t('dash_pending_parcels'), 'tone-orange') +
          stat('🪪', allVis.filter(v => v.unit === unit && v.status === 'Pending').length, t('dash_pending_visitors'), 'tone-blue') +
          stat('🔧', myMaint.filter(m => m.unit === unit && m.status !== 'Resolved').length, t('dash_open_maintenance'), 'tone-red') +
          stat('💰', fmtMoney(Math.max(0, Number(fees.monthly) - paid)), t('pay_outstanding'), 'tone-green') +
          stat('📅', myBook.filter(b => b.unit === unit && b.status === 'Pending').length, t('dash_bookings_pending'), 'tone-purple') +
        '</div>'
    } else {
      // Guest: no data stats — just a friendly welcome + login prompt
      statsHtml =
        '<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px"><div class="card-body" style="text-align:center;padding:34px 22px">' +
          '<div class="ei" style="font-size:44px">🏢</div>' +
          '<h2 style="font-family:var(--font-display);font-weight:800;font-size:20px;margin:10px 0 6px">RK1</h2>' +
          '<p class="muted small" style="max-width:420px;margin:0 auto">' + t('dash_guest') + '</p>' +
          '<button class="btn btn-primary btn-lg mt-16" id="dashLogin">🔐 ' + t('login') + '</button>' +
        '</div></div>'
    }

    wrap.innerHTML =
      '<div class="page-head page-head-row">' +
        '<div><h1>' + (sessions ? t('dash_welcome') + ', ' + esc(sessions.name || '') : t('dash_welcome')) + ' 👋</h1>' +
        '<p>' + esc(hello) + ' · ' + esc(t('dash_overview')) + '</p></div>' +
      '</div>' +
      statsHtml +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>📢 ' + t('dash_recent_ann') + '</h3></div><div class="card-body" id="dashAnns" style="padding:8px 20px"></div></div>' +
        '<div><div class="card"><div class="card-head"><h3>⚡ ' + t('dash_quick_actions') + '</h3></div><div class="card-body">' +
          '<div class="quick-grid">' +
            qlink('📦', t('nav_parcels'), 'parcels') + qlink('🪪', t('nav_visitors'), 'visitors') +
            qlink('🔧', t('nav_maintenance'), 'maintenance') + qlink('💰', t('nav_payments'), 'payments') +
            qlink('📢', t('nav_announcements'), 'announcements') + qlink('📅', t('nav_bookings'), 'bookings') +
            qlink('🚗', t('nav_vehicles'), 'vehicles') + qlink('📄', t('nav_documents'), 'documents') +
          '</div></div></div>' +
        '</div>' +
      '</div>'

    const loginBtn = $('dashLogin'); if (loginBtn) loginBtn.onclick = showLogin

    const annEl = $('dashAnns')
    if (!anns.length) annEl.innerHTML = '<div class="empty" style="padding:22px 0"><div class="ei">📢</div><p>' + t('dash_no_ann') + '</p></div>'
    else annEl.innerHTML = anns.slice(0, 3).map(a =>
      '<div class="list-item" style="padding-left:4px;padding-right:4px">' +
        '<div class="grow"><div class="li-title">' + (a.pinned ? '📌 ' : '') + esc(a.title) + '</div>' +
        '<div class="li-sub">' + esc(a.author) + ' · ' + fmtDate(a.created_at) + ' · ' + timeAgo(a.created_at) + '</div></div>' +
        (a.pinned ? '<span class="badge red">📌</span>' : '<span class="badge gold">' + esc(a.category) + '</span>') +
      '</div>'
    ).join('')
  },
}
const qlink = (icon, label, view) => '<a class="quick-link" data-goto="' + view + '"><span class="qi">' + icon + '</span><span>' + esc(label) + '</span></a>'

// ── Boot ──
function boot() {
  loadSession()
  const theme = localStorage.getItem('kj_theme') || 'obsidian'
  document.documentElement.setAttribute('data-theme', theme)
  $('themeBtn').textContent = theme === 'obsidian' ? '🌙' : '☀️'
  $('themeBtn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme')
    const next = cur === 'light' ? 'obsidian' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('kj_theme', next)
    $('themeBtn').textContent = next === 'obsidian' ? '🌙' : '☀️'
  }
  const langLabel = { ms: '🇲🇾', en: '🇬🇧', zh: '🇨🇳', ta: '🇮🇳' }
  $('langBtn').textContent = langLabel[getLang()] || '🇲🇾'
  $('langBtn').onclick = () => {
    const order = ['ms', 'en', 'zh', 'ta']
    const cur = getLang()
    setLang(order[(order.indexOf(cur) + 1) % order.length])
    $('langBtn').textContent = langLabel[getLang()] || '🇲🇾'
    updateShell()
    renderView()
  }
  $('hamburger').onclick = () => { $('sidebar').classList.add('open'); $('backdrop').classList.add('show') }
  $('backdrop').onclick = () => { $('sidebar').classList.remove('open'); $('backdrop').classList.remove('show') }
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]')
    if (g) goto(g.dataset.goto)
  })

  // register nav order for side groups
  window.addEventListener('hashchange', onHash)
  applyI18n()

  // async boot: try connecting; if not configured show setup
  const cfg = kjGetConfig()
  if (!cfg.supabaseUrl || !cfg.supabaseAnon) {
    updateShell(); onHash(); showSetup()
    return
  }
  kjTestConnection().then(r => {
    if (!r.ok) { showSetup() }
    updateShell(); onHash()
  }).catch(() => { updateShell(); onHash(); showSetup() })
}
document.addEventListener('DOMContentLoaded', boot)
