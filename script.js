'use strict';

/* =========================================================
   1. ANNÉE DYNAMIQUE
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   2. HEADER SCROLL
   ========================================================= */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* =========================================================
   3. MENU MOBILE
   ========================================================= */
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
const overlay = document.getElementById('overlay');

function toggleMenu(open){
  burger.classList.toggle('open', open);
  navMobile.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}

burger.addEventListener('click', () => toggleMenu(!navMobile.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* =========================================================
   4. ANIMATIONS AU SCROLL
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   5. LECTEUR VIDÉO HTML5
   ========================================================= */
(function initVideoPlayer(){
  const video = document.getElementById('presentationVideo');
  const wrapper = document.getElementById('videoWrapper');
  const overlay = document.getElementById('videoOverlay');
  if (!video || !wrapper || !overlay) return;

  function playVideo(){
    wrapper.classList.add('playing');
    video.play().catch(err => {
      console.warn('Lecture vidéo bloquée :', err);
      wrapper.classList.remove('playing');
    });
  }

  overlay.addEventListener('click', playVideo);

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playVideo();
    }
  });

  video.addEventListener('click', () => {
    if (video.paused) playVideo();
  });

  video.addEventListener('play', () => wrapper.classList.add('playing'));
  video.addEventListener('pause', () => {
    if (!video.ended) wrapper.classList.remove('playing');
  });
  video.addEventListener('ended', () => {
    wrapper.classList.remove('playing');
    video.currentTime = 0;
  });

  video.addEventListener('error', () => {
    overlay.innerHTML = `
      <div style="text-align:center;color:#fff;padding:20px">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:3rem;color:#F9A825;margin-bottom:1rem"></i>
        <p style="font-size:1rem;margin-bottom:.5rem">Vidéo en cours de préparation</p>
        <p style="font-size:.85rem;opacity:.85">Revenez bientôt pour découvrir la présentation.</p>
      </div>`;
  });
})();

/* =========================================================
   6. COMPTE À REBOURS
   ========================================================= */
const targetDate = new Date('2026-09-27T15:00:00').getTime();

function updateCountdown(){
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<div class="cd-unit" style="flex:1"><strong>🎉</strong><span>Ouvert !</span></div>';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min   = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const sec   = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-min').textContent   = String(min).padStart(2,'0');
  document.getElementById('cd-sec').textContent   = String(sec).padStart(2,'0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   7. CALENDRIER
   ========================================================= */
const events = [
  { date:'2026-09-27', title:'🎉 Ouverture officielle', desc:'Grande célébration — toute la journée', past:false },
  { date:'2026-10-15', title:'Soirée Live Music', desc:'Concert acoustique — 20h', past:false },
  { date:'2026-12-31', title:'Réveillon de la Saint-Sylvestre', desc:'Soirée dansante — 21h', past:false }
];

let currentDate = new Date(2026, 8, 1);
const monthYearEl = document.getElementById('monthYear');
const gridEl = document.getElementById('calendarGrid');
const eventsListEl = document.getElementById('eventsList');

const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function renderCalendar(){
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  gridEl.innerHTML = '';
  ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'day-name';
    el.textContent = d;
    gridEl.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < offset; i++){
    const el = document.createElement('div');
    el.className = 'day other';
    gridEl.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++){
    const el = document.createElement('div');
    el.className = 'day';
    el.textContent = d;
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

    if (dateStr === today.toISOString().slice(0,10)) el.classList.add('today');
    if (events.some(e => e.date === dateStr)) el.classList.add('has-event');

    gridEl.appendChild(el);
  }

  const monthEvents = events.filter(e => {
    const [y,m] = e.date.split('-');
    return parseInt(y) === year && parseInt(m) === month + 1;
  });

  eventsListEl.innerHTML = '';
  if (monthEvents.length === 0){
    eventsListEl.innerHTML = '<p style="text-align:center;color:#888;font-size:.88rem;padding:14px">Aucun événement ce mois-ci.</p>';
  } else {
    monthEvents.forEach(ev => {
      const [y,m,d] = ev.date.split('-');
      const dayNum = parseInt(d);
      const item = document.createElement('div');
      item.className = 'event-item' + (ev.past ? ' past' : '');
      item.innerHTML = `
        <div class="event-date"><strong>${dayNum}</strong><span>${monthNames[parseInt(m)-1].slice(0,3)}</span></div>
        <div class="event-info">
          <h4>${ev.title}</h4>
          <p>${ev.desc}</p>
        </div>`;
      eventsListEl.appendChild(item);
    });
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

/* =========================================================
   8. MOTEUR DE CARROUSEL UNIVERSEL
   ========================================================= */
function createCarousel(options) {
  const {
    wrapperId,
    trackId,
    dotsId,
    prevId,
    nextId,
    prevArrowId,
    nextArrowId,
    itemSelector,
    getVisibleCount,
    autoPlayDelay = 5000,
    gap = 20
  } = options;

  const wrapper = document.getElementById(wrapperId);
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const prevArrow = prevArrowId ? document.getElementById(prevArrowId) : null;
  const nextArrow = nextArrowId ? document.getElementById(nextArrowId) : null;

  if (!wrapper || !track) return null;

  const items = Array.from(track.querySelectorAll(itemSelector));
  if (items.length === 0) return null;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let isPaused = false;

  function getItemWidth() {
    if (items.length === 0) return 0;
    const rect = items[0].getBoundingClientRect();
    return rect.width + gap;
  }

  function getTotalPages() {
    const visible = getVisibleCount();
    return Math.max(1, items.length - visible + 1);
  }

  function goTo(index, animate = true) {
    const total = getTotalPages();
    currentIndex = Math.max(0, Math.min(index, total - 1));

    const itemWidth = getItemWidth();
    const offset = -currentIndex * itemWidth;

    track.style.transition = animate
      ? 'transform .6s cubic-bezier(.25,.8,.25,1)'
      : 'none';
    track.style.transform = `translate3d(${offset}px, 0, 0)`;

    updateDots();
    updateArrows();
  }

  function updateDots() {
    dotsContainer.innerHTML = '';
    const total = getTotalPages();
    if (total <= 1) return;

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Aller à la position ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateArrows() {
    const total = getTotalPages();
    if (prevArrow) prevArrow.disabled = currentIndex <= 0;
    if (nextArrow) nextArrow.disabled = currentIndex >= total - 1;
  }

  function next() {
    const total = getTotalPages();
    if (currentIndex >= total - 1) {
      goTo(0);
    } else {
      goTo(currentIndex + 1);
    }
  }

  function prev() {
    const total = getTotalPages();
    if (currentIndex <= 0) {
      goTo(total - 1);
    } else {
      goTo(currentIndex - 1);
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (getTotalPages() <= 1) return;
    autoPlayTimer = setInterval(() => {
      if (!isPaused) next();
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  wrapper.addEventListener('mouseenter', () => { isPaused = true; });
  wrapper.addEventListener('mouseleave', () => {
    isPaused = false;
    resetAutoPlay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
  if (prevArrow) prevArrow.addEventListener('click', () => { prev(); resetAutoPlay(); });
  if (nextArrow) nextArrow.addEventListener('click', () => { next(); resetAutoPlay(); });

  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let isHorizontal = null;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    isHorizontal = null;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    if (isHorizontal === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontal = Math.abs(dx) > Math.abs(dy);
    }

    if (isHorizontal === true) {
      e.preventDefault();
    }
  }, { passive: false });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50 && isHorizontal !== false) {
      diff > 0 ? next() : prev();
    }
    startAutoPlay();
  }, { passive: true });

  let mouseStartX = 0;
  let mouseDragging = false;

  track.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseDragging = true;
    stopAutoPlay();
  });

  document.addEventListener('mouseup', (e) => {
    if (!mouseDragging) return;
    mouseDragging = false;
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 80) {
      diff > 0 ? next() : prev();
    }
    startAutoPlay();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newTotal = getTotalPages();
      if (currentIndex > newTotal - 1) currentIndex = newTotal - 1;
      goTo(currentIndex, false);
      requestAnimationFrame(() => {
        track.style.transition = 'transform .6s cubic-bezier(.25,.8,.25,1)';
      });
    }, 150);
  });

  function init() {
    goTo(0, false);
    requestAnimationFrame(() => {
      track.style.transition = 'transform .6s cubic-bezier(.25,.8,.25,1)';
      startAutoPlay();
    });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

  setTimeout(() => goTo(currentIndex, false), 500);

  return { goTo, next, prev, startAutoPlay, stopAutoPlay };
}

/* =========================================================
   9. INITIALISATION DES CARROUSELS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  createCarousel({
    wrapperId: 'newsWrapper',
    trackId: 'newsTrack',
    dotsId: 'newsDots',
    prevId: 'newsPrev',
    nextId: 'newsNext',
    prevArrowId: 'newsPrevArrow',
    nextArrowId: 'newsNextArrow',
    itemSelector: '.news-card',
    autoPlayDelay: 5500,
    gap: 20,
    getVisibleCount: () => {
      const w = window.innerWidth;
      if (w >= 900) return 3;
      if (w >= 640) return 2;
      return 1;
    }
  });

  createCarousel({
    wrapperId: 'galleryWrapper',
    trackId: 'galleryTrack',
    dotsId: 'galleryDots',
    prevId: 'galleryPrev',
    nextId: 'galleryNext',
    prevArrowId: 'galleryPrevArrow',
    nextArrowId: 'galleryNextArrow',
    itemSelector: '.gallery-item',
    autoPlayDelay: 4000,
    gap: 14,
    getVisibleCount: () => {
      const w = window.innerWidth;
      if (w >= 900) return 4;
      if (w >= 640) return 3;
      if (w >= 480) return 2;
      return 1;
    }
  });

});

/* =========================================================
   10. MENU — REDIRECTION
   ========================================================= */
function openMenuPage(){
  window.location.href = 'menu.html';
}

/* =========================================================
   11. FORMULAIRE CONTACT → WHATSAPP
   ========================================================= */
const WHATSAPP_NUMBER = '22669064848';

function handleContact(e){
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const nom     = (data.get('nom') || '').trim();
  const email   = (data.get('email') || '').trim();
  const tel     = (data.get('tel') || '').trim();
  const message = (data.get('message') || '').trim();

  const texte =
    `*Nouveau message — Site Festicas Ibelina*%0A%0A` +
    `👤 *Nom :* ${nom}%0A` +
    `📧 *Email :* ${email}%0A` +
    (tel ? `📞 *Téléphone :* ${tel}%0A` : '') +
    `%0A💬 *Message :*%0A${message}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texte}`;
  window.open(url, '_blank');
  form.reset();
}
