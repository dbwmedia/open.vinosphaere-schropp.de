/**
 * Accordion Block – Frontend Interaction
 *
 * Handles open/close toggle with smooth animation.
 *
 * @package dbw-base
 */

(function () {
	'use strict';

	const accordions = document.querySelectorAll('.wp-block-dbw-base-accordion');

	if (!accordions.length) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	accordions.forEach((accordion) => {
		const items = accordion.querySelectorAll('.wp-block-dbw-base-accordion-item');

		items.forEach((item) => {
			const trigger = item.querySelector('.wp-block-dbw-base-accordion-item__trigger');
			const content = item.querySelector('.wp-block-dbw-base-accordion-item__content');

			if (!trigger || !content) return;

			trigger.addEventListener('click', () => {
				const isOpen = trigger.getAttribute('aria-expanded') === 'true';

				// Close all other items in the same accordion
				items.forEach((otherItem) => {
					if (otherItem === item) return;
					const otherTrigger = otherItem.querySelector('.wp-block-dbw-base-accordion-item__trigger');
					const otherContent = otherItem.querySelector('.wp-block-dbw-base-accordion-item__content');
					if (otherTrigger && otherContent) {
						otherTrigger.setAttribute('aria-expanded', 'false');
						otherContent.style.maxHeight = null;
						otherItem.classList.remove('is-open');
					}
				});

				// Toggle current item
				if (isOpen) {
					trigger.setAttribute('aria-expanded', 'false');
					content.style.maxHeight = null;
					item.classList.remove('is-open');
				} else {
					trigger.setAttribute('aria-expanded', 'true');
					content.style.maxHeight = content.scrollHeight + 'px';
					item.classList.add('is-open');
				}
			});
		});
	});
})();
