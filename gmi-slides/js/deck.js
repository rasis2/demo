/* Shared deck navigation for GMI Slides (IT Essentials 8.0) */
(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let current = 0;

  function go(n){
    current = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s,i) => s.classList.toggle('active', i === current));
    if(counter) counter.textContent = (current + 1) + ' / ' + slides.length;
    if(progress) progress.style.width = ((current + 1) / slides.length * 100) + '%';
    if(prevBtn) prevBtn.disabled = current === 0;
    if(nextBtn) nextBtn.disabled = current === slides.length - 1;
    window.scrollTo(0,0);
  }

  if(prevBtn) prevBtn.addEventListener('click', () => go(current - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => go(current + 1));
  document.addEventListener('keydown', e => {
    if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)) { e.preventDefault(); go(current + 1); }
    if(['ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); go(current - 1); }
    if(e.key === 'Home') go(0);
    if(e.key === 'End') go(slides.length - 1);
  });

  let touchX = null;
  document.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive:true });
  document.addEventListener('touchend', e => {
    if(touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive:true });

  go(0);
})();