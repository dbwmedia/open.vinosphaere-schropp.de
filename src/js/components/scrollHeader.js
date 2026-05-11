/**
 * Scroll Header
 * Adds .scrolled class to .site-header on scroll
 */

export function initScrollHeader() {
  const header = document.querySelector('.site-header');

  if (!header) {
    return;
  }

  let lastScrollY = window.scrollY;
  const scrollThreshold = 50; // Pixel threshold before adding class

  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  // Use requestAnimationFrame for better performance
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });

      ticking = true;
    }
  });

  // Initial check on load
  handleScroll();
}
