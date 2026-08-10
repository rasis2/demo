function renderNav(titleKey) {
  const nav = document.getElementById('mainNav')
  if (!nav) return
  nav.innerHTML = `
    <a href="index.html" class="nav-back" id="txt-back"></a>
    <span class="nav-title" id="txt-nav-title"></span>
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
      <div id="themeSwitcher"></div>
      <div id="langSwitcher"></div>
    </div>`
  document.getElementById('txt-back').textContent = t('back')
  document.getElementById('txt-nav-title').textContent = t(titleKey)
  renderThemeSwitcher('themeSwitcher')
  renderLangSwitcher('langSwitcher')
}
