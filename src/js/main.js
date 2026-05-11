/**
 * Main JavaScript Entry Point
 * dbw base - GeneratePress Child Theme
 * https://dbw-media.de
 */

import { initNavigation } from './components/navigation.js';
import { initAccessibility } from './components/accessibility.js';
import { initScrollHeader } from './components/scrollHeader.js';
import { initSmoothScroll } from './components/smoothScroll.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccessibility();
  initScrollHeader();
  initSmoothScroll();
});
