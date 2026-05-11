# JavaScript Komponenten

Diese Anleitung beschreibt, wie neue JavaScript-Komponenten mit Vanilla JS erstellt und integriert werden.

## Ordnerstruktur

```
src/js/
├── components/          # Alle Komponenten
│   ├── navigation.js
│   ├── accessibility.js
│   └── ...
├── main.js             # Entry Point - hier werden alle Komponenten initialisiert
└── README.md           # Diese Datei
```

## Neue Komponente erstellen

### 1. Komponenten-Datei anlegen

Erstelle eine neue Datei im `components/` Ordner mit einem aussagekräftigen Namen:

```
src/js/components/meine-komponente.js
```

### 2. Komponenten-Struktur

Jede Komponente folgt diesem Muster:

```javascript
/**
 * Komponenten-Name
 * Kurze Beschreibung was die Komponente macht
 */

export function initMeineKomponente() {
  // 1. DOM-Elemente selektieren
  const element = document.querySelector('.mein-element');
  const button = document.querySelector('.mein-button');

  // 2. Early Return wenn Elemente nicht existieren
  if (!element || !button) {
    return;
  }

  // 3. Event Listener und Logik
  button.addEventListener('click', () => {
    element.classList.toggle('active');
  });

  // 4. Optional: Weitere Event Listener
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      element.classList.remove('active');
    }
  });
}

// Optional: Helper-Funktionen als private Funktionen
function helperFunction() {
  // ...
}
```

### 3. Wichtige Regeln

#### Naming Convention
- Export-Funktion: `initKomponentenName()` (camelCase)
- Dateiname: `komponenten-name.js` (kebab-case)
- Private Funktionen: normale camelCase-Namen ohne `init` Präfix

#### Early Returns
Immer prüfen, ob benötigte DOM-Elemente existieren:

```javascript
if (!element) {
  return;
}
```

#### ES6 Module
Verwende ES6 Module mit `export`:

```javascript
export function initMeineKomponente() {
  // ...
}
```

#### Vanilla JavaScript
- Keine jQuery oder andere Libraries
- Modern ES6+ JavaScript
- Native DOM APIs verwenden

### 4. Komponente integrieren

Nach dem Erstellen der Komponente muss sie in `main.js` eingebunden werden:

```javascript
// 1. Import hinzufügen
import { initMeineKomponente } from './components/meine-komponente.js';

// 2. Im DOMContentLoaded Event aufrufen
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccessibility();
  initMeineKomponente(); // Hier hinzufügen
});
```

## Best Practices

### Event Delegation
Für dynamische Inhalte Event Delegation verwenden:

```javascript
document.addEventListener('click', (event) => {
  if (event.target.matches('.dynamisches-element')) {
    // Handle click
  }
});
```

### Accessibility
Immer auf Accessibility achten:

```javascript
// ARIA-Attribute setzen
button.setAttribute('aria-expanded', 'true');

// Keyboard Navigation
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    // Handle escape
  }
});
```

### Performance
- Event Listener in `DOMContentLoaded` registrieren
- Debounce/Throttle bei häufigen Events (scroll, resize)
- QuerySelector nur einmal, dann Variable wiederverwenden

### Code-Organisation
- Eine Komponente = Eine Datei
- Export nur die `init` Funktion
- Helper-Funktionen ohne `export` (bleiben private)
- Aussagekräftige Funktions- und Variablennamen

## Beispiel-Komponente

```javascript
/**
 * Modal Component
 * Handles modal dialogs with keyboard support
 */

export function initModal() {
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  const modals = document.querySelectorAll('.modal');

  if (modalTriggers.length === 0 || modals.length === 0) {
    return;
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);

      if (modal) {
        openModal(modal);
      }
    });
  });

  modals.forEach(modal => {
    const closeButton = modal.querySelector('.modal-close');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeModal(modal);
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.modal.is-open');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
```

## Troubleshooting

### Komponente wird nicht initialisiert
- Prüfe ob Import in `main.js` vorhanden ist
- Prüfe ob Funktion im `DOMContentLoaded` aufgerufen wird
- Prüfe Browser Console auf Fehler

### DOM-Elemente nicht gefunden
- Prüfe ob Selektoren korrekt sind
- Prüfe ob HTML-Elemente existieren
- Verwende Browser DevTools zum Debuggen

### Events funktionieren nicht
- Prüfe ob Event Listener nach `DOMContentLoaded` registriert werden
- Prüfe ob Elemente existieren bevor Event Listener registriert werden
- Prüfe Browser Console auf Fehler
