// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
function closeMenu() {
  navLinks?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open menu');
}
toggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
    closeMenu();
    toggle.focus();
  }
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => reducedMotion.matches ? 'auto' : 'smooth';

// Keep one copy of each video, moving cards between featured and language views.
const library = document.querySelector('#portfolio-library');
const featuredGrid = document.querySelector('#featured-work');
const cards = Array.from(document.querySelectorAll('.video-card'));
const workToggle = document.querySelector('#work-toggle');
const languageNav = document.querySelector('.language-nav');
const workStatus = document.querySelector('#work-status');
const groups = [
  ['swedish', 'Swedish'],
  ['finnish', 'Finnish'],
  ['english', 'English'],
  ['music', 'Music only']
];
let expanded = false;
let activeVideo = null;

function stopVideo() {
  if (!activeVideo) return;
  activeVideo.frame.remove();
  activeVideo.link.hidden = false;
  activeVideo = null;
}

// Click-to-load players work with either a YouTube or Vimeo embed URL.
// Preserve Vimeo's full embed URL, including its privacy hash, when replacing it.
document.querySelectorAll('.video-play').forEach(link => {
  const poster = link.querySelector('img');
  const useFallback = () => {
    if (poster.src.includes('/maxresdefault.jpg')) {
      poster.src = poster.src.replace('/maxresdefault.jpg', '/hqdefault.jpg');
    }
  };
  poster.addEventListener('error', useFallback);
  poster.addEventListener('load', () => { if (poster.naturalWidth < 200) useFallback(); });
  if (poster.complete && poster.naturalWidth < 200) useFallback();
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    stopVideo();
    const url = new URL(link.dataset.videoSrc);
    url.searchParams.set('autoplay', '1');
    const frame = document.createElement('iframe');
    frame.src = url.href;
    frame.title = link.getAttribute('aria-label');
    frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    frame.allowFullscreen = true;
    link.hidden = true;
    link.parentElement.append(frame);
    activeVideo = { link, frame };
    frame.focus();
  });
});

function renderPortfolio() {
  stopVideo();
  // Detach cards before removing their previous group containers.
  cards.forEach(card => featuredGrid.append(card));
  library.querySelectorAll('.language-group').forEach(group => group.remove());
  featuredGrid.hidden = expanded;
  languageNav.hidden = !expanded;
  if (expanded) {
    groups.forEach(([key, label]) => {
      const members = cards.filter(card => card.dataset.language === key);
      if (!members.length) return;
      const section = document.createElement('section');
      section.className = 'language-group';
      section.id = 'work-' + key;
      section.setAttribute('aria-labelledby', section.id + '-title');
      const heading = document.createElement('h3');
      heading.id = section.id + '-title';
      heading.textContent = label;
      const grid = document.createElement('div');
      grid.className = 'work-grid';
      members.forEach(card => {
        card.hidden = false;
        grid.append(card);
      });
      section.append(heading, grid);
      library.append(section);
    });
  } else {
    cards.forEach(card => { card.hidden = card.dataset.featured !== 'true'; });
  }
  workToggle.setAttribute('aria-expanded', String(expanded));
  workToggle.textContent = expanded ? 'Show featured work ↑' : 'View more work ↓';
  workStatus.textContent = expanded ? cards.length + ' videos, organised by language' : '6 featured videos';
}
if (workToggle && library) {
  workToggle.hidden = false;
  workToggle.addEventListener('click', () => {
    expanded = !expanded;
    renderPortfolio();
    library.focus({ preventScroll: true });
    document.querySelector('#work').scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  });
  // Deep links to a language open the complete library.
  function openLanguageLink() {
    if (groups.some(([key]) => location.hash === '#work-' + key)) {
      if (!expanded) {
        expanded = true;
        renderPortfolio();
      }
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: scrollBehavior() });
    }
  }
  openLanguageLink();
  window.addEventListener('hashchange', openLanguageLink);
}

// Magnum's five-item gallery becomes a swipeable strip on phones.
const gallery = document.querySelector('#magnum-gallery');
const galleryButtons = document.querySelectorAll('[data-gallery-direction]');
function moveGallery(direction) {
  const card = gallery?.querySelector('.snap-card');
  if (!card) return;
  const gap = parseFloat(getComputedStyle(gallery).gap) || 0;
  gallery.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: scrollBehavior() });
}
function updateGalleryButtons() {
  galleryButtons.forEach(button => {
    button.disabled = Number(button.dataset.galleryDirection) < 0
      ? gallery.scrollLeft <= 1
      : gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 1;
  });
}
galleryButtons.forEach(button => button.addEventListener('click', () => moveGallery(Number(button.dataset.galleryDirection))));
gallery?.addEventListener('keydown', event => {
  if (event.target === gallery && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    moveGallery(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
gallery?.addEventListener('scroll', updateGalleryButtons, { passive: true });
if (gallery) {
  new ResizeObserver(updateGalleryButtons).observe(gallery);
  updateGalleryButtons();
}

// Existing brand band, with motion preference and pointer/focus pauses.
const marquee = document.querySelector('.marquee-wrapper');
const track = document.querySelector('.marquee-track');
let pausedUntil = 0;
let hovering = false;
let focused = false;
let lastFrame = 0;
function marqueeLoop(time) {
  const elapsed = lastFrame ? Math.min(time - lastFrame, 50) : 0;
  lastFrame = time;
  if (marquee && track && !reducedMotion.matches && !hovering && !focused && time > pausedUntil) {
    marquee.scrollLeft += elapsed * 0.04;
    if (marquee.scrollLeft >= track.scrollWidth / 2) marquee.scrollLeft -= track.scrollWidth / 2;
  }
  requestAnimationFrame(marqueeLoop);
}
if (marquee) {
  requestAnimationFrame(marqueeLoop);
  marquee.addEventListener('pointerenter', () => { hovering = true; });
  marquee.addEventListener('pointerleave', () => { hovering = false; });
  marquee.addEventListener('focusin', () => { focused = true; });
  marquee.addEventListener('focusout', () => { focused = false; });
}
function moveMarquee(direction) {
  pausedUntil = performance.now() + 3000;
  marquee?.scrollBy({ left: direction * 300, behavior: scrollBehavior() });
}
document.querySelector('.marquee-arrow-left')?.addEventListener('click', () => moveMarquee(-1));
document.querySelector('.marquee-arrow-right')?.addEventListener('click', () => moveMarquee(1));

// Confirm successful delivery before showing the thank-you page.
// The native POST form remains available when JavaScript is disabled.
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  button.disabled = true;
  button.textContent = 'Sending your message…';
  status.hidden = true;
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Message not accepted');
    window.location.assign('success.html');
  } catch {
    status.textContent = "Your message could not be sent. Please try again, or email me using the link below. Your message is still here.";
    status.hidden = false;
    button.disabled = false;
    button.textContent = "Let's start the conversation";
  }
});

document.querySelectorAll('.snap-card video').forEach(video => {
  if (reducedMotion.matches) {
    video.pause();
    video.controls = true;
  }
});
