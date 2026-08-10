/* ═══════════════════════════════════════════════════════
   views-2.js — Maintenance, Payments, Announcements
   ═══════════════════════════════════════════════════════ */

/* ─────────────────────────────── MAINTENANCE ─────────────────────────────── */
VIEWS.maintenance = {
  key: 'nav_maintenance', icon: '🔧',
  render: async (wrap) => {
    const ownerU = isOwner(), staffU = isStaff()
    const canReport = ownerU || staffU
    wrap.innerHTML =
      '<div class="page-head"><h1>🔧 ' + t('mnt_title') + '</h1><p>' + t('mnt_report') + '</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>➕ ' + t('mnt_report') + '</h3></div><div class="card-body">' +
          (canReport
            ? (staffU ? '<div class="field"><label data-i18n="unit_lbl"></label><input class="input mono" id="mm_unit" placeholder="' + t('unit_ph') + '"></div>' : '') +
              '<div class="field"><label data-i18n="mnt_category"></label>' +
                '<select class="select" id="mm_cat">' + ['Elektrik','Paip','Lif','Kebocoran','Kebersihan','Keselamatan','Lain-lain'].map(c => '<option>' + esc(c) + '</option>').join('') + '</select></div>' +
              '<div class="field"><label data-i18n="mnt_title_lbl"></label><input class="input" id="mm_title" maxlength="80"></div>' +
              '<div class="field"><label data-i18n="mnt_desc_lbl"></label><textarea class="textarea" id="mm_desc"></textarea></div>' +
              '<div class="field"><label data-i18n="mnt_priority"></label>' +
                '<select class="select" id="mm_prio">' + ['Low','Medium','High'].map(p => '<option>' + esc(p) + '</option>').join('') + '</select></div>' +
              '<button class="btn btn-primary btn-block btn-lg" id="mm_go">' + t('mnt_submit') + '</button>'
            : '<div class="empty"><div class="ei">🔐</div><p>' + t('dash_login_hint') + '</p><button class="btn btn-primary mt-16" id="mm_login">' + t('login') + '</button></div>')
        + '</div></div>' +
        '<div class="card"><div class="card-head"><h3>' + t('mnt_list') + '</h3></div><div class="card-body" id="mmList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>' +
      '</div>'

    const login = $('mm_login'); if (login) login.onclick = showLogin
    const goBtn = $('mm_go')
    if (goBtn) goBtn.onclick = async () => {
      const title = $('mm_title').value.trim()
      if (!title) { toast(t('required'), 'error'); return }
      let unit = state.session ? state.session.unit : ''
      if (staffU) {
        unit = $('mm_unit').value.trim()
        if (!unit) { toast(t('unit_lbl'), 'error'); return }
        const o = await kjOwner(unit)
        if (!o) { toast(t('unit_not_found'), 'error'); return }
      }
      await kjAddMaintenance({ unit, category: $('mm_cat').value, title, description: $('mm_desc').value.trim(), priority: $('mm_prio').value })
      toast(t('mnt_success'), 'success'); $('mm_title').value = ''; $('mm_desc').value = ''
      if (staffU) $('mm_unit').value = ''
      await loadMaint()
    }
    await loadMaint()
  },
}

async function loadMaint() {
  const el = $('mmList')
  const all = await kjMaintenance()
  const ownerU = isOwner(), staffU = isStaff()
  const list = ownerU ? all.filter(m => m.unit === state.session.unit) : all
  if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">🔧</div><p>' + t('mnt_empty') + '</p></div>'; return }
  el.innerHTML = list.slice(0, 40).map(m =>
    '<div class="list-item" style="align-items:flex-start">' +
      '<div class="grow"><div class="li-title">' + esc(m.title) + '</div>' +
      '<div class="li-sub mono">' + esc(m.unit) + ' · ' + esc(m.category) + ' · ' + t('mnt_priority') + ': ' + esc(m.priority) + '</div>' +
      (m.description ? '<div class="small muted mt-8">' + esc(m.description) + '</div>' : '') +
      (m.notes ? '<div class="small mt-8" style="color:var(--text-soft)">📝 ' + esc(m.notes) + '</div>' : '') +
      (staffU && m.status !== 'Resolved' ? '<div class="flex mt-8" style="flex-wrap:wrap">' +
        '<select class="select" style="width:auto;padding:6px 10px;font-size:12px" onchange="ms(\'' + m.id + '\', this.value)">' +
          ['Open','In Progress','Resolved'].map(s => '<option value="' + s + '"' + (m.status === s ? ' selected' : '') + '>' + t(s === 'Open' ? 'mnt_open' : s === 'In Progress' ? 'mnt_progress' : 'mnt_resolved') + '</option>').join('') +
        '</select>' +
        '<input class="input" style="flex:1;min-width:120px;padding:6px 10px;font-size:12px" id="mnote-' + m.id + '" value="' + esc(m.notes || '') + '" placeholder="' + t('mnt_notes') + '">' +
        '<button class="btn btn-ghost btn-sm" onclick="mn(\'' + m.id + '\')">💾</button></div>' : '') +
      '</div>' + badge(m.status) +
    '</div>'
  ).join('')
  window.ms = async (id, s) => { await kjUpdateMaintenance(id, { status: s }); toast(t('mnt_update'), 'success'); loadMaint() }
  window.mn = async (id) => { const v = $('mnote-' + id).value; await kjUpdateMaintenance(id, { notes: v }); toast(t('mnt_save_notes'), 'success') }
}

/* ─────────────────────────────── PAYMENTS ─────────────────────────────── */
VIEWS.payments = {
  key: 'nav_payments', icon: '💰',
  render: async (wrap) => {
    const ownerU = isOwner(), staffU = isStaff()
    const s = await kjGetSettings()
    const fee = s.monthlyFee
    let payments = [], ownerPaid = 0, totalCollected = 0
    if (ownerU) { payments = await kjPaymentsByUnit(state.session.unit); ownerPaid = payments.reduce((a, p) => a + Number(p.amount || 0), 0) }
    else { payments = await kjPayments(); totalCollected = payments.reduce((a, p) => a + Number(p.amount || 0), 0) }

    wrap.innerHTML =
      '<div class="page-head"><h1>💰 ' + t('pay_title') + '</h1><p>' + t('pay_history') + '</p></div>' +
      (isAdmin() ? '<div class="card"><div class="card-head"><h3>⚙️ ' + t('pay_fee_config') + '</h3></div><div class="card-body flex">' +
        '<div class="field grow mb-8"><label data-i18n="pay_monthly_fee"></label><input class="input mono" id="pf_fee" type="number" value="' + fee + '"></div>' +
        '<button class="btn btn-soft mt-16" id="pf_go">' + t('pay_set_fee') + '</button></div></div>' : '') +
      '<div class="stat-grid">' +
        '<div class="stat-card"><div class="sc-ico">💳</div><div class="sc-val">' + fmtMoney(fee) + '</div><div class="sc-lbl">' + t('pay_monthly_fee') + '</div></div>' +
        '<div class="stat-card tone-green"><div class="sc-ico">✅</div><div class="sc-val">' + fmtMoney(ownerU ? ownerPaid : totalCollected) + '</div><div class="sc-lbl">' + t('pay_paid') + '</div></div>' +
        (ownerU
          ? '<div class="stat-card tone-red"><div class="sc-ico">⚠️</div><div class="sc-val">' + fmtMoney(Math.max(0, fee - ownerPaid)) + '</div><div class="sc-lbl">' + t('pay_outstanding') + '</div></div>'
          : '<div class="stat-card tone-blue"><div class="sc-ico">🧾</div><div class="sc-val">' + payments.length + '</div><div class="sc-lbl">' + t('dash_payments_count') + '</div></div>') +
      '</div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-head"><h3>' + (ownerU ? '💳 ' + t('pay_make') : t('pay_record')) + '</h3></div><div class="card-body">' +
          (ownerU
            ? '<div class="field"><label data-i18n="pay_period"></label><input class="input" id="pm_period" placeholder="' + t('pay_period_ph') + '"></div>' +
              '<div class="form-row">' +
                '<div class="field"><label data-i18n="pay_method"></label><select class="select" id="pm_method">' + ['FPX','DuitNow','Cash','Bank Transfer','JomPAY'].map(m => '<option>' + esc(m) + '</option>').join('') + '</select></div>' +
                '<div class="field"><label data-i18n="pay_amount"></label><input class="input mono" id="pm_amount" value="' + fee + '" readonly></div>' +
              '</div>' +
              '<button class="btn btn-primary btn-block btn-lg" id="pm_go">' + t('pay_submit') + '</button>'
            : (staffU
              ? '<div class="form-row">' +
                  '<div class="field"><label data-i18n="unit_lbl"></label><input class="input" id="pa_unit" placeholder="4-1"></div>' +
                  '<div class="field"><label data-i18n="pay_period"></label><input class="input" id="pa_period" placeholder="' + t('pay_period_ph') + '"></div>' +
                '</div>' +
                '<div class="form-row">' +
                  '<div class="field"><label data-i18n="pay_method"></label><select class="select" id="pa_method">' + ['FPX','DuitNow','Cash','Bank Transfer','JomPAY'].map(m => '<option>' + esc(m) + '</option>').join('') + '</select></div>' +
                  '<div class="field"><label data-i18n="pay_amount"></label><input class="input mono" type="number" id="pa_amount"></div>' +
                '</div>' +
                '<button class="btn btn-primary btn-block btn-lg" id="pa_go">' + t('pay_record') + '</button>'
              : '<div class="empty"><div class="ei">🔐</div><p>' + t('dash_login_hint') + '</p><button class="btn btn-primary mt-16" id="payLogin">' + t('login') + '</button></div>'))
        + '</div></div>' +
        '<div class="card"><div class="card-head"><h3>' + t('pay_history') + '</h3></div><div class="card-body" id="payList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>' +
      '</div>'

    const payLogin = $('payLogin'); if (payLogin) payLogin.onclick = showLogin
    const pmGo = $('pm_go')
    if (pmGo) pmGo.onclick = () => {
      const period = $('pm_period').value.trim()
      if (!period) { toast(t('required'), 'error'); return }
      const method = $('pm_method').value
      openModal(
        '<div class="modal-head"><h3>💳 ' + t('pay_make') + '</h3><button class="icon-btn-sm" id="mlclose">✕</button></div>' +
        '<div class="modal-body">' +
          '<div style="text-align:center;padding:6px 0 14px">' +
            '<div class="muted small">' + esc(period) + ' · ' + esc(method) + '</div>' +
            '<div style="font-size:30px;font-weight:800;font-family:var(--font-mono);margin-top:4px">' + fmtMoney(fee) + '</div>' +
          '</div>' +
          '<div class="field"><label data-i18n="pay_method"></label>' +
            '<select class="select" id="gp_bank">' + ['Maybank2u','CIMB Clicks','Public Bank','Hong Leong Connect','RHB Now','Bank Islam','Touch \'n Go eWallet','GrabPay','DuitNow'].map(b => '<option>' + esc(b) + '</option>').join('') + '</select></div>' +
          '<div class="state-pill" style="width:100%;justify-content:center">🔒 <span id="gp_status">' + t('pay_secure') + '</span></div>' +
          '<div class="error-text" id="gp_err" style="margin-bottom:8px"></div>' +
        '</div>' +
        '<div class="modal-foot"><button class="btn btn-ghost" id="gp_cancel">' + t('cancel') + '</button>' +
        '<button class="btn btn-green" id="gp_confirm">✓ ' + t('pay_confirm') + '</button></div>',
        ov => {
          ov.querySelector('#mlclose').onclick = () => closeModal(ov)
          ov.querySelector('#gp_cancel').onclick = () => closeModal(ov)
          ov.querySelector('#gp_confirm').onclick = async () => {
            const btn = ov.querySelector('#gp_confirm'); btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
            ov.querySelector('#gp_status').textContent = t('pay_processing')
            await new Promise(r => setTimeout(r, 1200))
            try {
              await kjAddPayment({ unit: state.session.unit, period, amount: fee, method })
              ov.classList.remove('show'); setTimeout(() => ov.remove(), 200)
              toast(t('pay_success') + ' · ' + esc(period), 'success')
              $('pm_period').value = ''
              renderView() // full refresh → shows latest payment + updated balance
            } catch (e) { ov.querySelector('#gp_err').textContent = t('err_server'); btn.disabled = false; btn.textContent = '✓ ' + t('pay_confirm'); ov.querySelector('#gp_status').textContent = t('pay_secure') }
          }
        }
      )
    }
    const paGo = $('pa_go')
    if (paGo) paGo.onclick = async () => {
      const unit = $('pa_unit').value.trim(), period = $('pa_period').value.trim(), amt = parseFloat($('pa_amount').value)
      if (!unit || !period || !amt) { toast(t('required'), 'error'); return }
      await kjAddPayment({ unit, period, amount: amt, method: $('pa_method').value })
      toast(t('pay_success'), 'success')
      await loadPayments()
    }
    const pfGo = $('pf_go')
    if (pfGo) pfGo.onclick = async () => {
      const v = parseFloat($('pf_fee').value)
      if (!v) { toast(t('required'), 'error'); return }
      await kjSetSetting('monthly_fee', String(v))
      toast(t('pay_saved'), 'success')
    }

    async function loadPayments() {
      const el = $('payList')
      const list = ownerU ? payments : await kjPayments()
      if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">🧾</div><p>' + t('pay_empty') + '</p></div>'; return }
      el.innerHTML = list.slice(0, 30).map(p =>
        '<div class="list-item">' +
          '<div class="avatar" style="background:var(--green-dim);color:var(--green)">✓</div>' +
          '<div class="grow"><div class="li-title">' + (ownerU ? esc(p.period) : esc(p.unit) + ' · ' + esc(p.period)) + '</div>' +
          '<div class="li-sub mono">' + esc(p.receipt || '') + ' · ' + esc(p.method) + ' · ' + fmtDate(p.created_at) + '</div></div>' +
          '<div class="mono" style="font-weight:700;color:var(--green)">' + fmtMoney(p.amount) + '</div>' +
        '</div>'
      ).join('')
    }
    await loadPayments()
  },
}

/* ─────────────────────────────── ANNOUNCEMENTS ─────────────────────────────── */
VIEWS.announcements = {
  key: 'nav_announcements', icon: '📢',
  render: async (wrap) => {
    const admin = isAdmin()
    wrap.innerHTML =
      '<div class="page-head"><h1>📢 ' + t('ann_title') + '</h1><p>' + t('ann_success') + '</p></div>' +
      (admin ? '<div class="card"><div class="card-head"><h3>➕ ' + t('ann_new') + '</h3></div><div class="card-body">' +
        '<div class="form-row">' +
          '<div class="field grow"><label data-i18n="ann_title_lbl"></label><input class="input" id="an_title" maxlength="100"></div>' +
          '<div class="field"><label data-i18n="ann_category"></label><select class="select" id="an_cat">' + ['Penting','AGM','Penyelenggaraan','Kemudahan','Acara','Keselamatan'].map(c => '<option>' + esc(c) + '</option>').join('') + '</select></div>' +
        '</div>' +
        '<div class="field"><label data-i18n="ann_body_lbl"></label><textarea class="textarea" id="an_body"></textarea></div>' +
        '<div class="field"><label data-i18n="ann_attach"></label><input type="file" class="input" id="an_file" accept="image/*,.pdf" style="padding:8px"><p class="small muted mt-8">' + t('ann_attach_hint') + '</p></div>' +
        '<div class="flex-between"><label class="check"><input type="checkbox" id="an_pin"> ' + t('ann_pinned') + '</label>' +
        '<button class="btn btn-primary" id="an_go">' + t('ann_publish') + '</button></div>' +
      '</div></div>' : '') +
      '<div class="card"><div class="card-head"><h3>' + t('dash_recent_ann') + '</h3></div><div class="card-body" id="anList" style="padding:8px 20px"><div class="skeleton" style="height:60px"></div></div></div>'

    const anGo = $('an_go')
    if (anGo) anGo.onclick = async () => {
      const title = $('an_title').value.trim()
      if (!title) { toast(t('required'), 'error'); return }
      const btn = anGo; btn.disabled = true; btn.textContent = '⏳ ' + t('loading')
      try {
        await kjAddAnnouncement({ title, category: $('an_cat').value, body: $('an_body').value.trim(), pinned: $('an_pin').checked, file: $('an_file').files[0] })
        toast(t('ann_success'), 'success'); $('an_title').value = ''; $('an_body').value = ''; $('an_file').value = ''
      } catch (e) { toast(t('err_server'), 'error') }
      btn.disabled = false; btn.textContent = t('ann_publish')
      await loadAnns()
    }
    async function loadAnns() {
      const list = await kjAnnouncements()
      const el = $('anList')
      if (!list.length) { el.innerHTML = '<div class="empty"><div class="ei">📢</div><p>' + t('ann_empty') + '</p></div>'; return }
      el.innerHTML = list.map(a => {
        let attach = ''
        if (a.attachment) {
          const isImg = /\.(png|jpe?g|gif|webp|svg)$/i.test(a.attachment)
          attach = isImg
            ? '<img class="mt-8" src="' + esc(a.attachment) + '" style="max-width:180px;border-radius:10px;border:1px solid var(--border);cursor:zoom-in" onclick="showImage(\'' + esc(a.attachment) + '\')">'
            : '<a class="btn btn-soft btn-sm mt-8" href="' + esc(a.attachment) + '" target="_blank" rel="noopener">📎 ' + t('doc_view') + ' ↗</a>'
        }
        return '<div class="list-item" style="align-items:flex-start">' +
          '<div class="grow"><div class="li-title">' + (a.pinned ? '📌 ' : '') + esc(a.title) + '</div>' +
          '<div class="li-sub">' + esc(a.author) + ' · ' + fmtDate(a.created_at) + ' · ' + timeAgo(a.created_at) + '</div>' +
          (a.body ? '<div class="ann-body small muted mt-8" id="annb-' + a.id + '" style="display:none;white-space:pre-wrap">' + esc(a.body) + '</div>' : '') +
          attach +
          (a.body ? '<button class="btn btn-ghost btn-sm mt-8" id="annt-' + a.id + '" onclick="annToggle(\'' + a.id + '\')">' + t('ann_expand') + '</button>' : '') +
          '</div>' +
          '<span class="badge gold">' + esc(a.category) + '</span>' +
          (admin ? '<button class="icon-btn-sm danger" onclick="adel(\'' + a.id + '\')">🗑</button>' : '') +
        '</div>'
      }).join('')
      window.annToggle = (id) => {
        const body = document.getElementById('annb-' + id)
        const btn = document.getElementById('annt-' + id)
        const open = body.style.display !== 'none'
        body.style.display = open ? 'none' : 'block'
        btn.textContent = open ? t('ann_expand') : t('ann_collapse')
      }
      window.adel = async (id) => { await kjDeleteAnnouncement(id); toast(t('ann_deleted'), 'success'); loadAnns() }
    }
    await loadAnns()
  },
}
