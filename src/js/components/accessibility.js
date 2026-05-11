/**
 * Accessibility Component
 * Enhances accessibility features
 */

export function initAccessibility() {
  handleFocusOutline();
  handleSkipLink();
}

function handleFocusOutline() {
  let isUsingKeyboard = false;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      isUsingKeyboard = true;
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
    document.body.classList.remove('keyboard-navigation');
  });
}

function handleSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main');

  if (!skipLink || !mainContent) {
    return;
  }

  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  });
}
