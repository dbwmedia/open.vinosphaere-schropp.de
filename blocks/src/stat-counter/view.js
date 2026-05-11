/**
 * Stat-Counter Block – Frontend Animation
 *
 * Uses Intersection Observer for scroll-triggered count-up.
 *
 * @package dbw-base
 */

(function () {
	'use strict';

	const counters = document.querySelectorAll('.wp-block-dbw-base-stat-counter');

	if (!counters.length) return;

	const animateCounter = (el) => {
		const numberEl = el.querySelector('.wp-block-dbw-base-stat-counter__number');
		if (!numberEl || el.dataset.animated) return;

		el.dataset.animated = 'true';

		const target = parseInt(el.dataset.target, 10) || 0;
		const suffix = el.dataset.suffix || '';
		const prefix = el.dataset.prefix || '';
		const duration = parseInt(el.dataset.duration, 10) || 2000;
		const startTime = performance.now();

		const step = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease-out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = Math.round(eased * target);

			numberEl.textContent = prefix + current.toLocaleString('de-DE') + suffix;

			if (progress < 1) {
				requestAnimationFrame(step);
			}
		};

		requestAnimationFrame(step);
	};

	// Respect reduced motion
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		counters.forEach((el) => {
			const numberEl = el.querySelector('.wp-block-dbw-base-stat-counter__number');
			if (numberEl) {
				const target = parseInt(el.dataset.target, 10) || 0;
				const prefix = el.dataset.prefix || '';
				const suffix = el.dataset.suffix || '';
				numberEl.textContent = prefix + target.toLocaleString('de-DE') + suffix;
			}
		});
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateCounter(entry.target);
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.3 }
	);

	counters.forEach((el) => observer.observe(el));
})();
