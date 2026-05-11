/**
 * Navigation Component
 * Handles mobile menu and navigation interactions
 */

export function initNavigation() {
  const toggleButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-navigation');

  if (!toggleButton || !navigation) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', !isExpanded);
    navigation.classList.toggle('toggled');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('toggled')) {
      toggleButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('toggled');
      toggleButton.focus();
    }
  });
}
