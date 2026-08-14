/* ═══════════════════════════════════════════════════════
   views-3.js — Bookings, Vehicles, Documents, Residents, Settings
   ═══════════════════════════════════════════════════════ */

/* ─────────────────────────────── BOOKINGS ─────────────────────────────── */
VIEWS.bookings = {
  key: 'nav_bookings', icon: '📅',
  render: async (wrap) => {
    const ownerU = isOwner(), staffU = isStaff(), admin = isAdmin()
    const canBook = ownerU || staffU
    const facs = await kjFacilities()
    wrap.innerHTML =
      '<div class="page-head"><h1>📅 ' + t('bk_title') + '</h1><p>' + t('bk_success') + '</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>🏛️ ' + t('bk_facility') + '</h3></div><div class="card-body">' +
          '<div class="quick-grid" id="bkFacs" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))">' +
            facs.map(f => '<div class="quick-link" style="cursor:pointer" data-fid="' + f.id + '"><span class="qi">' + esc(f.icon) + '</span><span>' + esc(f.name) + '</span><span class="small muted" style="font-weight:500">' + t('bk_capacity') + ': ' + f.capacity + (f.cost > 0 ? ' · ' + fmtMoney(f.cost) : ' · ' + t('bk_free')) + '</span></div>').join('') +
          '</div>' +
          (canBook ? '<div class="divider"></div>' +
            (staffU ? '<div class="field"><label data-i18n="unit_lbl"></label><input class="input mono" id="bk_unit" placeholder="' + t('unit_ph') + '"></div>' : '') +
            '<div class="form-row">' +
              '<div class="field grow"><label data-i18n="bk_date"></label><input class="input" type="date" id="bk_date"></div>' +
              '<div class="field"><label data-i18n="bk_start"></label><input class="input" type="time" id="bk_start" value="10:00"></div>' +
              '<div class="field"><label data-i18n="bk_end"></label><input class="input" type="time" id="bk_end" value="12:00"></div>' +
            '</div>' +
            '<button class="btn btn-primary btn-block btn-lg" id="bk_go">' + t('bk_book') + '</button>'
          : '<div class="empty"><div class="ei">🔐</div><p>' + t('dash_login_hint') + '</p><button class="btn btn-primary mt-16" id="bkLogin">' + t('login') + '</button></div>')
        + '</div></div>' +
        '<div class="card"><div class="card-head"><h3>' + (ownerU ? t('bk_my') : admin ? t('bk_manage') : t('bk_my')) + '</h3></div><div class="card-body" id="bkList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>' +
      '</div>'

    const bkLogin = $('bkLogin'); if (bkLogin) bkLogin.onclick = showLogin
    let selFac = null
    $('bkFacs').querySelectorAll('[data-fid]').forEach(c => c.addEventListener('click', () => {
      $('bkFacs').querySelectorAll('[data-fid]').forEach(x => x.style.borderColor = '')
      c.style.borderColor = 'var(--accent)'; c.style.background = 'var(--accent-dim)'
      selFac = c.dataset.fid
    }))
    const bkGo = $('bk_go')
    if (bkGo) bkGo.onclick = async () => {
      if (!selFac) { toast(t('bk_facility'), 'error'); return }
      let unit = state.session.unit
      if (staffU) {
        unit = $('bk_unit').value.trim()
        if (!unit) { toast(t('unit_lbl'), 'error'); return }
        const o = await kjOwner(unit)
        if (!o) { toast(t('unit_not_found'), 'error'); return }
      }
      const date = $('bk_date').value, start = $('bk_start').value, end = $('bk_end').value
      if (!date || !start || !end || end <= start) { toast(t('bk_conflict'), 'error'); return }
      const busy = await slotBusy(selFac, date, start, end)
      if (busy) { toast(t('bk_conflict'), 'error'); return }
      const fac = facs.find(f => f.id === selFac)
      await kjAddBooking({ unit, facility_id: selFac, facility_name: fac.name, date, start, end })
      toast(t('bk_success'), 'success')
      if (staffU) $('bk_unit').value = ''
      await loadBookings()
    }
    async function slotBusy(fid, date, start, end) {
      const all = await kjBookings()
      return all.some(b => b.facility_id === fid && b.date === date && b.status !== 'Rejected' &&
        ((start >= b.start && start < b.end) || (end > b.start && end <= b.end) || (start <= b.start && end >= b.end)))
    }
    async function loadBookings() {
      const all = await kjBookings()
      const list = ownerU ? all.filter(b => b.unit === state.session.unit) : all
      const el = $('bkList')
      if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">📅</div><p>' + t('bk_empty') + '</p></div>'; return }
      el.innerHTML = list.slice(0, 40).map(b =>
        '<div class="list-item">' +
          '<div class="avatar">' + esc((facs.find(f => f.id === b.facility_id) || {}).icon || '🏛️') + '</div>' +
          '<div class="grow"><div class="li-title">' + esc(b.facility_name) + '</div>' +
          '<div class="li-sub mono">' + (ownerU ? '' : 'Unit ' + esc(b.unit) + ' · ') + esc(b.date) + ' · ' + esc(b.start) + '–' + esc(b.end) + '</div></div>' +
          badge(b.status) +
          (b.status === 'Pending' && admin ? '<button class="btn btn-green btn-sm" onclick="bk(\'' + b.id + '\',\'Approved\')">✓</button><button class="btn btn-danger btn-sm" onclick="bk(\'' + b.id + '\',\'Rejected\')">✕</button>' : '') +
        '</div>'
      ).join('')
      window.bk = async (id, st) => { await kjUpdateBooking(id, st); toast(t('success'), 'success'); loadBookings() }
    }
    await loadBookings()
  },
}

/* ─────────────────────────────── VEHICLES ─────────────────────────────── */
VIEWS.vehicles = {
  key: 'nav_vehicles', icon: '🚗',
  render: async (wrap) => {
    const ownerU = isOwner(), staffU = isStaff()

    // Register form: owners register their own unit; staff/guard register on behalf (with unit field)
    let form
    if (ownerU || staffU) {
      form =
        (staffU ? '<div class="field"><label data-i18n="unit_lbl"></label><input class="input mono" id="vv_unit" placeholder="' + t('unit_ph') + '"></div>' : '') +
        '<div class="form-row">' +
          '<div class="field grow"><label data-i18n="veh_plate"></label><input class="input mono" id="vv_plate" placeholder="' + t('veh_plate_ph') + '" style="text-transform:uppercase"></div>' +
          '<div class="field"><label data-i18n="veh_lot"></label><input class="input mono" id="vv_lot" placeholder="' + t('veh_lot_ph') + '"></div>' +
        '</div>' +
        '<div class="field"><label data-i18n="veh_model"></label><input class="input" id="vv_model" placeholder="' + t('veh_model_ph') + '"></div>' +
        '<div class="field"><label data-i18n="veh_photo"></label><input type="file" class="input" id="vv_photo" accept="image/*" capture="environment" style="padding:8px"><p class="small muted mt-8">' + t('veh_photo_hint') + '</p></div>' +
        '<button class="btn btn-primary btn-block btn-lg" id="vv_go">' + t('veh_submit') + '</button>'
    } else {
      form = '<div class="empty"><div class="ei">🔐</div><p>' + t('dash_login_hint') + '</p>' +
        '<button class="btn btn-primary mt-16" id="vvLoginOwner">🏠 ' + t('login_owner') + '</button>' +
        '<button class="btn btn-ghost mt-8" id="vvLoginStaff">🛡️ ' + t('login_staff') + '</button></div>'
    }

    wrap.innerHTML =
      '<div class="page-head"><h1>🚗 ' + t('veh_title') + '</h1><p>' + t('veh_success') + '</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>➕ ' + t('veh_register') + '</h3></div><div class="card-body">' + form + '</div></div>' +
        '<div class="card"><div class="card-head"><h3>' + t('veh_list') + '</h3></div><div class="card-body" style="padding:14px 20px">' +
          '<input class="input" id="vv_search" placeholder="' + t('veh_search_ph') + '" style="margin-bottom:12px">' +
          '<div id="vvList"></div></div></div>' +
      '</div>'

    const vvLoginOwner = $('vvLoginOwner'); if (vvLoginOwner) vvLoginOwner.onclick = showOwnerLogin
    const vvLoginStaff = $('vvLoginStaff'); if (vvLoginStaff) vvLoginStaff.onclick = showStaffLogin
    const searchEl = $('vv_search'); if (searchEl) searchEl.addEventListener('input', loadVeh)
    const vvGo = $('vv_go')
    if (vvGo) vvGo.onclick = async () => {
      const plate = $('vv_plate').value.trim().toUpperCase()
      if (!plate) { toast(t('required'), 'error'); return }
      let unit = state.session.unit
      if (staffU) {
        unit = $('vv_unit').value.trim()
        if (!unit) { toast(t('unit_lbl'), 'error'); return }
        const o = await kjOwner(unit)
        if (!o) { toast(t('unit_not_found'), 'error'); return }
      }
      const btn = vvGo; btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
      try {
        let photoUrl = ''
        const f = $('vv_photo').files[0]
        if (f) photoUrl = await kjUploadFile('vehicles', f, 'v')
        const patch = { vehicle_plate: plate, vehicle_model: $('vv_model').value.trim(), parking_lot: $('vv_lot').value.trim().toUpperCase() }
        if (photoUrl) patch.vehicle_photo = photoUrl
        await kjUpdateOwner(unit, patch)
        toast(t('veh_success'), 'success'); $('vv_plate').value = ''; $('vv_model').value = ''; $('vv_lot').value = ''; $('vv_photo').value = ''
        if (staffU) $('vv_unit').value = ''
        await loadVeh()
      } catch (e) { toast(t('err_server'), 'error') }
      btn.disabled = false; btn.textContent = t('veh_submit')
    }
    async function loadVeh() {
      const [owners, visitors] = await Promise.all([kjAllOwners(), kjVisitors()])
      const q = (searchEl && searchEl.value || '').trim().toLowerCase()
      let all = []
      owners.filter(o => o.vehicle_plate).forEach(o => all.push({
        kind: 'owner', plate: o.vehicle_plate, unit: o.unit, model: o.vehicle_model || '',
        lot: o.parking_lot || '', photo: o.vehicle_photo || '', person: '', purpose: '',
      }))
      visitors.filter(v => v.vehicle_plate).forEach(v => all.push({
        kind: 'visitor', plate: v.vehicle_plate, unit: v.unit || '', model: v.vehicle_model || v.vehicle_type || '',
        lot: '', photo: '', person: v.name || '', purpose: v.purpose || '',
      }))
      if (ownerU) all = all.filter(x => x.kind === 'owner' && x.unit === state.session.unit)
      if (q) all = all.filter(x => (x.plate + ' ' + x.unit + ' ' + x.model + ' ' + x.person).toLowerCase().includes(q))
      const el = $('vvList')
      if (!all.length) { el.innerHTML = '<div class="empty"><div class="ei">🚗</div><p>' + t('veh_empty') + '</p></div>'; return }
      el.innerHTML = all.map(o =>
        '<div class="list-item">' +
          (o.photo
            ? '<img src="' + esc(o.photo) + '" style="width:46px;height:46px;object-fit:cover;border-radius:10px;border:1px solid var(--border);cursor:zoom-in" onclick="window.open(\'' + esc(o.photo) + '\')">'
            : '<div class="avatar" style="background:var(--blue-dim);color:var(--blue)">🚗</div>') +
          '<div class="grow"><div class="li-title mono">' + esc(o.plate) + '</div>' +
          '<div class="li-sub">' +
            (o.kind === 'owner'
              ? (ownerU ? '' : 'Unit ' + esc(o.unit) + ' · ') + esc(o.model || '—') + (o.lot ? ' · ' + t('veh_lot') + ': ' + esc(o.lot) : '')
              : esc(o.person) + ' · Unit ' + esc(o.unit || '—') + (o.model ? ' · ' + esc(o.model) : '') + (o.purpose ? ' · ' + esc(o.purpose) : '')) +
          '</div></div>' +
          '<span class="badge ' + (o.kind === 'owner' ? 'red' : 'gold') + '">' + (o.kind === 'owner' ? t('veh_owner') : t('veh_visitor')) + '</span>' +
          (o.kind === 'owner' && (ownerU || staffU) ? '<button class="icon-btn-sm danger" onclick="vrm(\'' + esc(o.unit) + '\')">🗑</button>' : '') +
        '</div>'
      ).join('')
      window.vrm = async (unit) => { await kjUpdateOwner(unit, { vehicle_plate: '', vehicle_model: '', parking_lot: '', vehicle_photo: '' }); toast(t('veh_removed'), 'success'); loadVeh() }
    }
    await loadVeh()
  },
}

/* ─────────────────────────────── DOCUMENTS ─────────────────────────────── */
VIEWS.documents = {
  key: 'nav_documents', icon: '📄',
  render: async (wrap) => {
    const admin = isAdmin()
    wrap.innerHTML =
      '<div class="page-head"><h1>📄 ' + t('doc_title') + '</h1><p>' + t('doc_list') + '</p></div>' +
      (admin ? '<div class="card"><div class="card-head"><h3>➕ ' + t('doc_add') + '</h3></div><div class="card-body">' +
        '<div class="form-row">' +
          '<div class="field grow"><label data-i18n="doc_title_lbl"></label><input class="input" id="dd_title" maxlength="100"></div>' +
          '<div class="field"><label data-i18n="doc_category"></label><select class="select" id="dd_cat">' + ['AGM','Kewangan','Borang','Polisi','Laporan'].map(c => '<option>' + esc(c) + '</option>').join('') + '</select></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field grow"><label data-i18n="doc_desc_lbl"></label><input class="input" id="dd_desc"></div>' +
          '<div class="field grow"><label data-i18n="doc_url_lbl"></label><input class="input mono" id="dd_url" placeholder="https://…"></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="dd_go">' + t('doc_add') + '</button>' +
      '</div></div>' : '') +
      '<div class="card"><div class="card-head"><h3>' + t('doc_list') + '</h3></div><div class="card-body" id="ddList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>'

    const ddGo = $('dd_go')
    if (ddGo) ddGo.onclick = async () => {
      const title = $('dd_title').value.trim()
      if (!title) { toast(t('required'), 'error'); return }
      await kjAddDocument({ title, category: $('dd_cat').value, description: $('dd_desc').value.trim(), url: $('dd_url').value.trim() })
      toast(t('doc_success'), 'success'); $('dd_title').value = ''; $('dd_desc').value = ''; $('dd_url').value = ''
      await loadDocs()
    }
    async function loadDocs() {
      const list = await kjDocuments()
      const el = $('ddList')
      if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">📄</div><p>' + t('doc_empty') + '</p></div>'; return }
      el.innerHTML = list.map(d =>
        '<div class="list-item">' +
          '<div class="avatar" style="background:var(--orange-dim);color:var(--orange)">📄</div>' +
          '<div class="grow"><div class="li-title">' + esc(d.title) + '</div>' +
          '<div class="li-sub">' + esc(d.category) + ' · ' + fmtDate(d.created_at) + (d.description ? ' · ' + esc(d.description) : '') + '</div></div>' +
          (d.url ? '<a class="btn btn-soft btn-sm" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + t('doc_view') + ' ↗</a>' : '') +
          (admin ? '<button class="icon-btn-sm danger" onclick="drm(\'' + d.id + '\')">🗑</button>' : '') +
        '</div>'
      ).join('')
      window.drm = async (id) => { await kjDeleteDocument(id); toast(t('doc_delete'), 'success'); loadDocs() }
    }
    await loadDocs()
  },
}

/* ─────────────────────────────── RESIDENTS ─────────────────────────────── */
VIEWS.residents = {
  key: 'nav_residents', icon: '👥',
  render: async (wrap) => {
    wrap.innerHTML =
      '<div class="page-head"><h1>👥 ' + t('res_title') + '</h1><p>' + t('res_count') + '</p></div>' +
      '<div class="card"><div class="card-body">' +
        '<input class="input" id="rs_search" placeholder="' + t('res_search_ph') + '" style="margin-bottom:14px">' +
        '<div id="rsList"><div class="skeleton" style="height:60px"></div></div>' +
      '</div></div>'

    async function load(q) {
      const all = await kjAllOwners()
      const list = q ? all.filter(o =>
        o.unit.toLowerCase().includes(q) || (o.name || '').toLowerCase().includes(q) ||
        (o.email || '').toLowerCase().includes(q) || (o.phone || '').includes(q) ||
        (o.vehicle_plate || '').toLowerCase().includes(q)) : all
      const el = $('rsList')
      if (!list.length) { el.innerHTML = '<div class="empty"><p>' + t('res_empty') + '</p></div>'; return }
      el.innerHTML = list.slice(0, 200).map(o =>
        '<div class="list-item" style="align-items:flex-start">' +
          '<div class="avatar">' + esc((o.name || '?').charAt(0).toUpperCase()) + '</div>' +
          '<div class="grow"><div class="li-title"><span class="mono">' + esc(o.unit) + '</span> · ' + esc(o.name) + '</div>' +
          '<div class="li-sub">' + esc(o.email) + ' · ' + esc(o.phone) + '</div>' +
          (o.vehicle_plate ? '<div class="li-sub">🚗 ' + esc(o.vehicle_plate) + (o.parking_lot ? ' · ' + t('veh_lot') + ' ' + esc(o.parking_lot) : '') + '</div>' : '') +
          '</div></div>'
      ).join('')
    }
    $('rs_search').addEventListener('input', e => load(e.target.value.trim().toLowerCase()))
    await load('')
  },
}

/* ─────────────────────────────── SETTINGS ─────────────────────────────── */
VIEWS.settings = {
  key: 'nav_settings', icon: '⚙️',
  render: async (wrap) => {
    // Owner / tenant: edit their own profile
    if (isOwner()) {
      const o = await kjOwner(state.session.unit)
      wrap.innerHTML =
        '<div class="page-head"><h1>👤 ' + t('profile_title') + '</h1><p>' + t('role_owner') + ' · <span class="mono">' + esc(state.session.unit) + '</span></p></div>' +
        '<div class="card" style="max-width:520px"><div class="card-body">' +
          '<div class="field"><label data-i18n="res_name"></label><input class="input" id="pr_name" value="' + esc(o.name || '') + '"></div>' +
          '<div class="form-row">' +
            '<div class="field"><label data-i18n="res_email"></label><input class="input" id="pr_email" value="' + esc(o.email || '') + '"></div>' +
            '<div class="field"><label data-i18n="res_phone"></label><input class="input" id="pr_phone" value="' + esc(o.phone || '') + '"></div>' +
          '</div>' +
          '<div class="field"><label data-i18n="res_ic"></label><input class="input" id="pr_ic" value="' + esc(o.ic_no || '') + '"></div>' +
          '<button class="btn btn-primary btn-block btn-lg" id="pr_go">' + t('profile_save') + '</button>' +
        '</div></div>'
      $('pr_go').onclick = async () => {
        await kjUpdateOwner(state.session.unit, { name: $('pr_name').value.trim(), email: $('pr_email').value.trim(), phone: $('pr_phone').value.trim(), ic_no: $('pr_ic').value.trim() })
        state.session.name = $('pr_name').value.trim() || state.session.unit
        saveSession()
        toast(t('profile_saved'), 'success')
        updateShell()
      }
      return
    }

    const s = await kjGetSettings()
    const cfg = kjGetConfig()
    const admin = isAdmin()

    if (!admin) {
      // Guard / dispatcher: connection info only
      wrap.innerHTML =
        '<div class="page-head"><h1>⚙️ ' + t('set_title') + '</h1><p>' + t('set_about') + '</p></div>' +
        '<div class="card" style="max-width:640px"><div class="card-head"><h3>🔌 ' + t('set_connection') + '</h3></div><div class="card-body">' +
          '<div class="flex"><span class="state-pill">✅ ' + esc(cfg.supabaseUrl || '—') + '</span></div>' +
          '<p class="small muted mt-8">' + t('set_about') + '</p>' +
        '</div></div>'
      return
    }

    // Admin: full settings
    wrap.innerHTML =
      '<div class="page-head"><h1>⚙️ ' + t('set_title') + '</h1><p>' + t('set_about') + '</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>🏢 ' + t('set_building') + '</h3></div><div class="card-body">' +
          '<div class="field"><label data-i18n="set_name_lbl"></label><input class="input" id="st_name" value="' + esc(s.name) + '"></div>' +
          '<div class="field"><label data-i18n="set_address_lbl"></label><input class="input" id="st_addr" value="' + esc(s.address) + '"></div>' +
          '<div class="field"><label data-i18n="set_fee_lbl"></label><input class="input mono" id="st_fee" type="number" value="' + s.monthlyFee + '"></div>' +
          '<button class="btn btn-soft" id="st_save1">' + t('save') + '</button>' +
        '</div></div>' +
        '<div class="card"><div class="card-head"><h3>🔐 ' + t('set_pins') + '</h3></div><div class="card-body">' +
          '<div class="field"><label data-i18n="set_pin_admin"></label><input class="input mono" id="st_pa" value="' + esc(s.pinAdmin) + '"></div>' +
          '<div class="field"><label data-i18n="set_pin_guard"></label><input class="input mono" id="st_pg" value="' + esc(s.pinGuard) + '"></div>' +
          '<div class="field"><label data-i18n="set_pin_dispatcher"></label><input class="input mono" id="st_pd" value="' + esc(s.pinDispatcher) + '"></div>' +
          '<div class="field"><label data-i18n="set_guard_phone"></label><input class="input mono" id="st_gp" value="' + esc(s.guardPhone) + '"></div>' +
          '<button class="btn btn-soft" id="st_save2">' + t('save') + '</button>' +
        '</div></div>' +
      '</div>' +
      '<div class="card"><div class="card-head"><h3>🔌 ' + t('set_connection') + '</h3></div><div class="card-body">' +
        '<div class="form-row">' +
          '<div class="field grow"><label data-i18n="set_url"></label><input class="input mono" id="st_url" value="' + esc(cfg.supabaseUrl) + '"></div>' +
          '<div class="field grow"><label data-i18n="set_key"></label><input class="input mono" id="st_key" value="' + esc(cfg.supabaseAnon) + '"></div>' +
        '</div>' +
        '<div class="flex"><button class="btn btn-primary" id="st_test">' + t('set_test') + '</button>' +
        '<span id="st_status" class="state-pill"></span></div>' +
      '</div></div>'

    const saveAll = async () => {
      await kjSetSetting('name', $('st_name').value)
      await kjSetSetting('address', $('st_addr').value)
      await kjSetSetting('monthly_fee', $('st_fee').value)
      await kjSetSetting('pin_admin', $('st_pa').value)
      await kjSetSetting('pin_guard', $('st_pg').value)
      await kjSetSetting('pin_dispatcher', $('st_pd').value)
      await kjSetSetting('guard_phone', $('st_gp').value)
      toast(t('set_saved'), 'success')
    }
    $('st_save1').onclick = saveAll
    $('st_save2').onclick = saveAll
    $('st_test').onclick = async () => {
      kjSaveConfig($('st_url').value, $('st_key').value)
      kjResetClient()
      $('st_status').innerHTML = '<span class="dot-pulse"></span> ' + t('loading')
      const r = await kjTestConnection()
      $('st_status').textContent = r.ok ? '✅ ' + t('set_connect_ok') : '❌ ' + t('set_connect_fail')
      if (r.ok) { toast(t('set_connect_ok'), 'success'); renderView() }
    }
  },
}

/* ─────────────────────────────── TENANTS ─────────────────────────────── */
VIEWS.tenants = {
  key: 'nav_tenants', icon: '🏠',
  render: async (wrap) => {
    wrap.innerHTML =
      '<div class="page-head"><h1>🏠 ' + t('ten_title') + '</h1><p>' + t('ten_subtitle') + '</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>➕ ' + t('ten_add') + '</h3></div><div class="card-body">' +
          '<div class="field"><label data-i18n="ten_unit"></label><input class="input mono" id="tn_unit" placeholder="' + t('unit_ph') + '"></div>' +
          '<div class="field"><label data-i18n="ten_name"></label><input class="input" id="tn_name" placeholder="' + t('vis_name_ph') + '"></div>' +
          '<div class="form-row">' +
            '<div class="field"><label data-i18n="ten_phone"></label><input class="input" id="tn_phone" placeholder="' + t('vis_phone_ph') + '"></div>' +
            '<div class="field"><label data-i18n="ten_email"></label><input class="input" id="tn_email" placeholder="name@email.com"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="field"><label data-i18n="ten_start"></label><input class="input" type="date" id="tn_start"></div>' +
            '<div class="field"><label data-i18n="ten_end"></label><input class="input" type="date" id="tn_end"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="field"><label data-i18n="ten_username"></label><input class="input mono" id="tn_user" placeholder="' + t('ten_user_auto') + '"></div>' +
            '<div class="field"><label data-i18n="ten_password"></label><input class="input mono" id="tn_pass" value="kesuma123"></div>' +
          '</div>' +
          '<div class="error-text" id="tn_err" style="margin-bottom:8px"></div>' +
          '<button class="btn btn-primary btn-block btn-lg" id="tn_go">' + t('ten_add_btn') + '</button>' +
        '</div></div>' +
        '<div class="card"><div class="card-head"><h3>' + t('ten_list') + '</h3></div><div class="card-body" id="tnList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>' +
      '</div>'

    $('tn_go').onclick = async () => {
      const unit = $('tn_unit').value.trim(), name = $('tn_name').value.trim()
      const err = $('tn_err'); err.textContent = ''
      if (!unit || !name) { err.textContent = t('required'); return }
      const o = await kjOwner(unit)
      if (!o) { err.textContent = t('unit_not_found'); return }
      const username = ($('tn_user').value.trim() || ('t-' + unit))
      if (!(await kjUsernameFree(username))) { err.textContent = t('ten_username_taken'); return }
      const btn = $('tn_go'); btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
      try {
        await kjAddTenant({ unit, name, phone: $('tn_phone').value.trim(), email: $('tn_email').value.trim(), ic_no: '', start_date: $('tn_start').value, end_date: $('tn_end').value, username, password: $('tn_pass').value })
        toast(t('ten_success'), 'success')
        $('tn_unit').value=''; $('tn_name').value=''; $('tn_phone').value=''; $('tn_email').value=''; $('tn_start').value=''; $('tn_end').value=''; $('tn_user').value=''
        await loadT()
      } catch (e) { err.textContent = t('err_server') }
      btn.disabled = false; btn.textContent = t('ten_add_btn')
    }

    async function loadT() {
      const list = await kjTenants()
      const el = $('tnList')
      if (!list.length) { el.innerHTML = emptyState('🏠', t('ten_empty')); return }
      el.innerHTML = list.map(tt =>
        '<div class="list-item">' +
          '<div class="avatar" style="background:var(--orange-dim);color:var(--orange)">🏠</div>' +
          '<div class="grow"><div class="li-title"><span class="mono">' + esc(tt.unit) + '</span> · ' + esc(tt.name) + '</div>' +
          '<div class="li-sub">' + esc(tt.phone) + (tt.email ? ' · ' + esc(tt.email) : '') + '</div>' +
          '<div class="li-sub mono">' + t('ten_start') + ': ' + esc(tt.start_date || '—') + ' · ' + t('ten_end') + ': ' + esc(tt.end_date || '—') + '</div></div>' +
          (tt.status === 'Active'
            ? '<span class="badge green">' + t('ten_active') + '</span>'
            : '<span class="badge gray">' + t('ten_ended') + '</span>') +
          (tt.status === 'Active' ? '<button class="btn btn-ghost btn-sm" onclick="tnEnd(\'' + tt.id + '\')">' + t('ten_end') + '</button>' : '') +
          '<button class="icon-btn-sm danger" onclick="tnDel(\'' + tt.id + '\')">🗑</button>' +
        '</div>'
      ).join('')
      window.tnEnd = async (id) => { await kjUpdateTenant(id, { status: 'Ended' }); toast(t('ten_ended_ok'), 'success'); loadT() }
      window.tnDel = async (id) => { await kjDeleteTenant(id); toast(t('ten_delete'), 'success'); loadT() }
    }
    await loadT()
  },
}
