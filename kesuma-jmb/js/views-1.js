/* ═══════════════════════════════════════════════════════
   views-1.js — Parcels & Visitors
   ═══════════════════════════════════════════════════════ */
const KJ_FLOORS = Array.from({ length: 19 }, (_, i) => i + 4)
const KJ_UNITS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,'23A',25]

function unitSelectHtml(selId) {
  return '<select class="select" id="' + selId + '"><option value="">' + t('par_select_unit') + '</option></select>'
}

/* ─────────────────────────────── PARCELS ─────────────────────────────── */
VIEWS.parcels = {
  key: 'nav_parcels', icon: '📦',
  render: async (wrap) => {
    const isStaffU = isStaff(), isOwnerU = isOwner()

    // Register form: STAFF ONLY. Owner only collects; guest prompted to log in.
    let leftCol
    if (isStaffU) {
      leftCol =
        '<div class="card"><div class="card-head"><h3>➕ ' + t('par_add') + '</h3></div><div class="card-body">' +
          '<div class="form-row"><div class="field"><label data-i18n="par_floor"></label>' +
            '<select class="select" id="pf_floor"><option value="">—</option>' +
            KJ_FLOORS.map(f => '<option value="' + f + '">' + t('par_floor') + ' ' + f + '</option>').join('') + '</select></div>' +
            '<div class="field"><label data-i18n="par_unit"></label>' + unitSelectHtml('pf_unit') + '</div></div>' +
          '<div class="field"><label data-i18n="par_courier"></label>' +
            '<select class="select" id="pf_courier">' +
              ['J&T Express','Shopee Express (SPX)','Pos Laju','Ninja Van','DHL','Lazada Logistics','City-Link','Others'].map(c => '<option>' + esc(c) + '</option>').join('') +
            '</select></div>' +
          '<div class="field"><label data-i18n="par_photo"></label>' +
            '<input type="file" class="input" id="pf_photo" accept="image/*" capture="environment" style="padding:8px">' +
            '<p class="small muted mt-8">' + t('par_photo_hint') + '</p>' +
          '</div>' +
          '<button class="btn btn-primary btn-block btn-lg" id="pf_submit">📦 ' + t('par_submit') + '</button>' +
        '</div></div>'
    } else if (isOwnerU) {
      leftCol =
        '<div class="card"><div class="card-body" style="text-align:center;padding:26px 20px">' +
          '<div class="ei" style="font-size:38px">📦</div>' +
          '<p class="muted small mt-8">' + t('par_owner_hint') + '</p>' +
        '</div></div>'
    } else {
      leftCol =
        '<div class="card"><div class="card-body" style="text-align:center;padding:26px 20px">' +
          '<div class="ei" style="font-size:38px">🔐</div>' +
          '<p class="muted small mt-8">' + t('dash_login_hint') + '</p>' +
          '<button class="btn btn-primary btn-block mt-16" id="parStaffLogin">🛡️ ' + t('login_staff') + '</button>' +
          '<button class="btn btn-ghost btn-block mt-8" id="parOwnerLogin">🏠 ' + t('login_owner') + '</button>' +
        '</div></div>'
    }

    wrap.innerHTML =
      '<div class="page-head"><h1>📦 ' + t('par_title') + '</h1><p>' + t('par_added') + '</p></div>' +
      '<div class="grid-2">' +
        leftCol +
        '<div class="card"><div class="card-head"><h3>' + (isOwnerU ? '🏠 ' + t('par_my') : t('par_monitor')) + '</h3></div>' +
          '<div class="card-body" id="parList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>' +
      '</div>'

    const parStaffLogin = $('parStaffLogin'); if (parStaffLogin) parStaffLogin.onclick = showStaffLogin
    const parOwnerLogin = $('parOwnerLogin'); if (parOwnerLogin) parOwnerLogin.onclick = showOwnerLogin

    const floorEl = $('pf_floor'), unitEl = $('pf_unit')
    if (floorEl && unitEl) {
      floorEl.addEventListener('change', () => {
        unitEl.innerHTML = '<option value="">' + t('par_select_unit') + '</option>'
        if (!floorEl.value) return
        KJ_UNITS.forEach(u => {
          const o = document.createElement('option')
          o.value = floorEl.value + '-' + u; o.textContent = 'No. ' + u
          unitEl.appendChild(o)
        })
      })
    }

    const pfSubmit = $('pf_submit')
    if (pfSubmit) pfSubmit.onclick = async () => {
      const unit = unitEl.value, courier = $('pf_courier').value
      const photo = $('pf_photo').files[0]
      if (!unit) { toast(t('par_unit_req'), 'error'); return }
      if (!photo) { toast(t('par_photo_req'), 'error'); return }
      const btn = pfSubmit; btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
      try {
        await kjAddParcel({ unit, courier, file: photo })
        toast(t('par_success'), 'success')
        btn.textContent = '📦 ' + t('par_submit'); btn.disabled = false
        $('pf_photo').value = ''; unitEl.value = ''
        await loadParcels(wrap)
      } catch (e) { btn.textContent = '📦 ' + t('par_submit'); btn.disabled = false; toast(t('err_server'), 'error') }
    }

    await loadParcels(wrap)
  },
}

async function loadParcels(wrap) {
  const el = $('parList')
  const parcels = await kjParcels()
  const isOwnerU = isOwner(), isStaffU = isStaff()
  const list = isOwnerU ? parcels.filter(p => p.unit === state.session.unit) : parcels
  const pendingCount = list.filter(p => p.status === 'Pending').length
  const urgentCount = list.filter(p => p.status === 'Pending' && (Date.now() - new Date(p.created_at).getTime()) > 2 * 86400000).length

  if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">📭</div><p>' + t('par_empty') + '</p></div>'; return }

  el.innerHTML =
    '<div class="flex mt-8 mb-8" style="flex-wrap:wrap">' +
      '<span class="chip">⏳ ' + pendingCount + ' ' + t('par_pending') + '</span>' +
      (urgentCount ? '<span class="chip" style="color:var(--red);border-color:var(--red-dim)">🔴 ' + urgentCount + ' ' + t('par_urgent') + '</span>' : '') +
    '</div>' +
    list.slice(0, 40).map(p =>
      '<div class="list-item">' +
        (p.image_url ? '<img src="' + esc(p.image_url) + '" style="width:46px;height:46px;object-fit:cover;border-radius:10px;border:1px solid var(--border);cursor:zoom-in" onclick="window.open(\'' + esc(p.image_url) + '\')">' : '<div class="avatar">📦</div>') +
        '<div class="grow"><div class="li-title">' + esc(p.courier) + ' · <span class="mono">' + esc(p.unit) + '</span></div>' +
        '<div class="li-sub">' + fmtDate(p.created_at) + ' · ' + timeAgo(p.created_at) + '</div></div>' +
        badge(p.status) +
        (p.status === 'Pending' && isOwnerU ? '<button class="btn btn-green btn-sm" onclick="kd(\'' + p.id + '\')">' + t('par_mark_done') + '</button>' : '') +
        (isStaffU ? '<select class="select" style="width:auto;padding:6px 8px;font-size:11px" onchange="pset(\'' + p.id + '\', this.value)">' +
          ['Pending','Done'].map(s => '<option value="' + s + '"' + (p.status === s ? ' selected' : '') + '>' + t(s === 'Pending' ? 'par_pending' : 'par_done') + '</option>').join('') +
          '</select>' : '') +
      '</div>'
    ).join('')
  window.kd = async (id) => { await kjMarkParcelDone(id); toast(t('par_collected'), 'success'); await loadParcels(wrap) }
  window.pset = async (id, status) => {
    if (status === 'Done') await kjMarkParcelDone(id)
    else await kjReopenParcel(id)
    toast(t('mnt_update'), 'success'); await loadParcels(wrap)
  }
}

/* ─────────────────────────────── VISITORS ─────────────────────────────── */
VIEWS.visitors = {
  key: 'nav_visitors', icon: '🪪',
  render: async (wrap) => {
    wrap.innerHTML =
      '<div class="page-head"><h1>🪪 ' + t('nav_visitors') + '</h1><p>' + t('vis_guard_sub') + '</p></div>' +
      '<div class="tabs" id="visTabs">' +
        '<button class="active" data-vt="register">➕ ' + t('vis_register_title') + '</button>' +
        '<button data-vt="check">🔍 ' + t('vis_check_title') + '</button>' +
        (isStaff() || isOwner() ? '<button data-vt="manage">🛡️ ' + t('vis_guard_title') + '</button>' : '') +
      '</div><div id="visPane"></div>'

    const showTab = (which) => {
      $('visTabs').querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.vt === which))
      if (which === 'register') renderVisitorRegister()
      else if (which === 'check') renderVisitorCheck()
      else renderVisitorManage()
    }
    $('visTabs').querySelectorAll('button').forEach(b => b.addEventListener('click', () => showTab(b.dataset.vt)))
    showTab('register')
  },
}

function renderVisitorRegister() {
  const pane = $('visPane')
  pane.innerHTML =
    '<div class="card" style="max-width:560px"><div class="card-body">' +
      '<div class="form-row">' +
        '<div class="field"><label data-i18n="vis_name"></label><input class="input" id="vr_name" placeholder="' + t('vis_name_ph') + '"></div>' +
        '<div class="field"><label data-i18n="vis_ic"></label><input class="input" id="vr_ic" placeholder="' + t('vis_ic_ph') + '"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="field"><label data-i18n="vis_phone"></label><input class="input" id="vr_phone" placeholder="' + t('vis_phone_ph') + '"></div>' +
        '<div class="field"><label data-i18n="vis_unit"></label><input class="input" id="vr_unit" placeholder="' + t('unit_ph') + '"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="field"><label data-i18n="vis_purpose"></label>' +
          '<select class="select" id="vr_purpose">' + ['vis_purpose_visit','vis_purpose_delivery','vis_purpose_work','vis_purpose_repair','vis_purpose_other'].map(k => '<option>' + t(k) + '</option>').join('') + '</select></div>' +
        '<div class="field"><label data-i18n="vis_vehicle"></label>' +
          '<select class="select" id="vr_veh">' + ['vis_veh_none','vis_veh_car','vis_veh_moto','vis_veh_lorry'].map(k => '<option>' + t(k) + '</option>').join('') + '</select></div>' +
      '</div>' +
      '<div class="field"><label data-i18n="vis_plate"></label><input class="input" id="vr_plate" placeholder="' + t('vis_plate_ph') + '"></div>' +
      '<div class="error-text" id="vr_err" style="margin-bottom:8px"></div>' +
      '<button class="btn btn-primary btn-block btn-lg" id="vr_go">' + t('vis_submit') + '</button>' +
    '</div></div>'

  $('vr_go').onclick = async () => {
    const name = $('vr_name').value.trim(), ic = $('vr_ic').value.trim()
    const phone = $('vr_phone').value.trim(), unit = $('vr_unit').value.trim()
    const err = $('vr_err'); err.textContent = ''
    if (!name || !ic || !phone || !unit) { err.textContent = t('required'); return }
    const btn = $('vr_go'); btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
    try {
      const v = await kjAddVisitor({
        name, ic_no: ic, phone, unit,
        purpose: $('vr_purpose').value,
        vehicle_type: $('vr_veh').value,
        vehicle_plate: $('vr_plate').value.trim(),
      })
      showQrSuccess(v)
    } catch (e) { err.textContent = t('err_server') }
    btn.disabled = false; btn.textContent = t('vis_submit')
  }
}

function showQrSuccess(v) {
  const ov = openModal(
    '<div class="modal-body" style="text-align:center;padding:28px">' +
      '<div class="ei" style="font-size:40px">✅</div>' +
      '<h3 style="font-family:var(--font-display);font-weight:800;font-size:18px;margin:8px 0 4px">' + t('vis_success_title') + '</h3>' +
      '<p class="muted small" style="margin-bottom:14px">' + t('vis_success_sub') + '</p>' +
      '<div class="mono" style="font-size:13px;letter-spacing:2px;color:var(--accent);font-weight:700;margin-bottom:12px">' + t('vis_ref_code') + '</div>' +
      '<div class="mono" style="font-size:26px;font-weight:700;letter-spacing:3px">' + esc(v.ref_code) + '</div>' +
      '<div id="qrBox" style="display:grid;place-items:center;margin:16px 0"></div>' +
      '<button class="btn btn-primary btn-block" onclick="navigator.clipboard&&navigator.clipboard.writeText(\'' + v.ref_code + '\')">' + t('copy') + '</button>' +
    '</div>'
  )
  loadQR().then(() => {
    const box = ov.querySelector('#qrBox')
    if (window.QRCode) { box.innerHTML = ''; new QRCode(box, { text: v.ref_code, width: 180, height: 180 }) }
  })
}
function loadQR() {
  return new Promise(res => {
    if (window.QRCode) return res()
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
    s.onload = () => res(); s.onerror = () => res()
    document.head.appendChild(s)
  })
}

function renderVisitorCheck() {
  const pane = $('visPane')
  pane.innerHTML =
    '<div class="card" style="max-width:560px"><div class="card-body">' +
      '<div class="field"><label data-i18n="vis_ref_code"></label>' +
        '<div style="display:flex;gap:8px"><input class="input" id="vc_ref" placeholder="' + t('vis_check_ph') + '" style="font-family:var(--font-mono);text-transform:uppercase">' +
        '<button class="btn btn-primary" id="vc_go">' + t('vis_check_btn') + '</button></div></div>' +
      '<div id="vc_result"></div>' +
    '</div></div>'
  const go = async () => {
    const ref = $('vc_ref').value.trim()
    if (!ref) return
    const v = await kjVisitorByRef(ref)
    const el = $('vc_result')
    if (!v) { el.innerHTML = '<div class="empty"><p>' + t('no_data') + '</p></div>'; return }
    el.innerHTML =
      '<div class="divider"></div>' +
      '<div class="flex-between"><span class="li-title">' + esc(v.name) + '</span>' + badge(v.status) + '</div>' +
      '<div class="small muted mt-8 mono">' + esc(v.ref_code) + ' · Unit ' + esc(v.unit) + '</div>' +
      '<div class="small muted">' + esc(v.purpose) + ' · ' + esc(v.phone) + '</div>'
  }
  $('vc_go').onclick = go
  $('vc_ref').addEventListener('keydown', e => { if (e.key === 'Enter') go() })
}

async function renderVisitorManage() {
  const pane = $('visPane')
  pane.innerHTML = '<div class="card"><div class="card-head"><h3>🛡️ ' + t('vis_guard_title') + '</h3></div><div class="card-body" id="vmList"><div class="skeleton" style="height:60px"></div></div></div>'
  const visitors = await kjVisitors()
  const isOwnerU = isOwner()
  const list = isOwnerU ? visitors.filter(v => v.unit === state.session.unit) : visitors
  const el = $('vmList')
  if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">🪪</div><p>' + t('vis_empty') + '</p></div>'; return }
  el.innerHTML = list.slice(0, 60).map(v =>
    '<div class="list-item">' +
      '<div class="avatar">' + (v.status === 'Pending' ? '⏳' : v.status === 'Approved' ? '✅' : v.status === 'Rejected' ? '⛔' : '🛡️') + '</div>' +
      '<div class="grow"><div class="li-title">' + esc(v.name) + ' <span class="muted mono small">· ' + esc(v.unit) + '</span></div>' +
      '<div class="li-sub mono">' + esc(v.ref_code) + ' · ' + esc(v.purpose) + (v.vehicle_plate ? ' · 🚗 ' + esc(v.vehicle_plate) : '') + '</div></div>' +
      badge(v.status) +
      (v.status === 'Pending' ? '<button class="btn btn-green btn-sm" onclick="va(\'' + v.id + '\',\'Approved\')">✓</button><button class="btn btn-danger btn-sm" onclick="va(\'' + v.id + '\',\'Rejected\')">✕</button>' : '') +
      (v.status === 'Approved' && isStaff() ? '<button class="btn btn-soft btn-sm" onclick="va(\'' + v.id + '\',\'Checked In\')">' + t('vis_checkin') + '</button>' : '') +
      (v.status === 'Checked In' && isStaff() ? '<button class="btn btn-ghost btn-sm" onclick="va(\'' + v.id + '\',\'Checked Out\')">' + t('vis_checkout') + '</button>' : '') +
    '</div>'
  ).join('')
  window.va = async (id, st) => { await kjUpdateVisitor(id, st); toast(t('success'), 'success'); renderVisitorManage() }
}
