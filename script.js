// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Close nav on link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Pause other non-autoplay videos when one plays (leave autoplay clips alone)
document.querySelectorAll('video:not([autoplay])').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video:not([autoplay])').forEach(v => {
      if (v !== video) v.pause();
    });
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.video-card, .process-step, .about-inner, .contact-inner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Marquee auto-scroll + arrow controls
const marqueeWrapper = document.querySelector('.marquee-wrapper');
const marqueeTrack = document.querySelector('.marquee-track');
let autoScroll = true;
let resumeTimeout;

function marqueeLoop() {
  if (autoScroll && marqueeWrapper) {
    marqueeWrapper.scrollLeft += 1;
    if (marqueeWrapper.scrollLeft >= marqueeTrack.scrollWidth / 2) {
      marqueeWrapper.scrollLeft = 0;
    }
  }
  requestAnimationFrame(marqueeLoop);
}
if (marqueeWrapper) marqueeLoop();

function pauseAndResume() {
  autoScroll = false;
  clearTimeout(resumeTimeout);
  resumeTimeout = setTimeout(() => { autoScroll = true; }, 3000);
}

document.querySelector('.marquee-arrow-left')?.addEventListener('click', () => {
  pauseAndResume();
  marqueeWrapper.scrollBy({ left: -300, behavior: 'smooth' });
});

document.querySelector('.marquee-arrow-right')?.addEventListener('click', () => {
  pauseAndResume();
  marqueeWrapper.scrollBy({ left: 300, behavior: 'smooth' });
});

// Inject visible class CSS
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
