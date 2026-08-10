// ═══════════════════════════════════════════════════════
//  ui.js — shared UI helpers for all pages
// ═══════════════════════════════════════════════════════

function showToast(msg, type) {
  let el = document.getElementById('toast')
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.id = 'toast'; document.body.appendChild(el) }
  el.textContent = msg
  el.className = 'toast ' + (type || '') + ' show'
  clearTimeout(el._t)
  el._t = setTimeout(() => { el.className = 'toast' }, 2800)
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function fmtDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString(getLang() === 'en' ? 'en-MY' : 'ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
function fmtDateShort(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString(getLang() === 'en' ? 'en-MY' : 'ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtMoney(n) { return 'RM ' + Number(n || 0).toFixed(2) }

// Status → badge class + translated label
const BADGE_MAP = {
  'Pending': ['badge-pending', 'pending'],
  'Approved': ['badge-done', 'approved'],
  'Rejected': ['badge-urgent', 'rejected'],
  'Checked In': ['badge-done', 'checkedin'],
  'Checked Out': ['badge-pending', 'checkedout'],
  'Done': ['badge-done', 'done'],
  'Open': ['badge-urgent', 'open'],
  'In Progress': ['badge-pending', 'in_progress'],
  'Resolved': ['badge-done', 'resolved'],
  'Paid': ['badge-done', 'paid'],
  'Outstanding': ['badge-urgent', 'outstanding'],
}
const BADGE_LABEL_KEYS = {
  pending: 'st_pending', approved: 'st_approved', rejected: 'st_rejected', checkedin: 'st_checkedin',
  checkedout: 'st_checkedout', done: 'st_done', open: 'st_open', in_progress: 'st_progress',
  resolved: 'st_resolved', paid: 'st_paid', outstanding: 'st_outstanding',
}
function badgeHtml(status) {
  const m = BADGE_MAP[status] || ['badge-pending', 'pending']
  return '<span class="badge-status ' + m[0] + '">' + (t(BADGE_LABEL_KEYS[m[1]]) || status) + '</span>'
}

function emptyState(icon, msg) {
  return '<div class="empty"><div class="empty-icon">' + icon + '</div><p>' + msg + '</p></div>'
}

function statBox(icon, label, value, cls) {
  return '<div style="flex:1;padding:14px;text-align:center;border-right:1px solid var(--border)">' +
    '<div style="font-size:18px">' + icon + '</div>' +
    '<div class="num" style="font-size:22px;color:' + (cls || 'var(--text)') + '">' + value + '</div>' +
    '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">' + label + '</div></div>'
}

// Tiny "tabs" helper — attaches handlers to .tab elements switching .active + panels
function bindTabs(activeCls) {
  document.querySelectorAll('.tab-bar').forEach(bar => {
    bar.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        bar.querySelectorAll('.tab').forEach(x => x.classList.remove('active'))
        tab.classList.add('active')
        const target = tab.getAttribute('data-panel')
        if (target) document.querySelectorAll('.tab-panel').forEach(p => { p.style.display = p.id === target ? 'block' : 'none' })
      })
    })
  })
}

// PIN gate helpers
function pinGate(verify) {
  const gate = document.getElementById('pinGate')
  const dash = document.getElementById('dashboard')
  if (gate) gate.style.display = 'none'
  if (dash) dash.style.display = 'block'
  if (typeof verify === 'function') verify()
}
