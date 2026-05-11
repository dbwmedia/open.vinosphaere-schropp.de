/**
 * Smooth Scroll via Lenis
 *
 * Lenis übernimmt das globale Seiten-Scrolling mit einem weichen,
 * nativen Scroll-Feeling. Anchor-Klicks werden abgefangen und per
 * lenis.scrollTo() ausgeführt, damit dieselbe Easing-Kurve greift.
 *
 * Zwei Anchor-Fälle werden behandelt:
 *   1. href="#target"  → same-page Anchor, wird immer intercepted
 *   2. href="/#target" → nur auf der Startseite; auf anderen Seiten
 *                        navigiert der Browser normal zu / (Lenis
 *                        initialisiert sich dort neu).
 *
 * href="#" (Sprung nach oben) wird bewusst ausgeschlossen.
 *
 * Der Lenis-Instance wird exportiert, damit andere Module
 * (z. B. GSAP ScrollTrigger) sich später einklinken können.
 */

import Lenis from 'lenis';

let lenis;

export function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false, // Nativer Momentum-Scroll auf Touch-Geräten
  });

  // RAF-Loop – Lenis braucht requestAnimationFrame um zu laufen
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Fall 1 – href="#target" auf jeder Seite
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -getHeaderOffset() });
      }
    });
  });

  // Fall 2 – href="/#target", nur auf der Startseite
  if (window.location.pathname === '/') {
    document.querySelectorAll('a[href^="/#"]').forEach(link => {
      const hash = link.getAttribute('href').slice(1); // "/#events" → "#events"
      const target = document.querySelector(hash);
      if (target) {
        link.setAttribute('href', hash); // DOM konsistent halten
        link.addEventListener('click', e => {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -getHeaderOffset() });
        });
      }
    });
  }
}

/** Gibt die Höhe des fixed/sticky Site-Headers zurück (0 wenn nicht fixed). */
function getHeaderOffset() {
  const header = document.querySelector('.site-header');
  if (!header) return 0;
  const pos = window.getComputedStyle(header).position;
  return pos === 'fixed' || pos === 'sticky' ? header.offsetHeight : 0;
}

/** Exportiert die Lenis-Instanz – z. B. für GSAP ScrollTrigger-Integration. */
export function getLenis() {
  return lenis;
}
