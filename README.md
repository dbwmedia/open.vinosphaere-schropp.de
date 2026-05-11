# dbw base – GeneratePress Child Theme

**Version 3.5.0** – Ultraleichtes, modernes GeneratePress Child Theme. Core als framework-agnostische Plattform, Theme als Brand-Heimat (Header, Buttons, Components), Sass-Forward-Pattern für eigene Tokens und Mixins, Token-Pipeline aus `theme.json` und 28 native Gutenberg-Blöcke.

**Entwickelt von [dbw media](https://dbw-media.de)**

## Inhalt

**Daily Workflow**
- [Projekt klonen & starten](#projekt-klonen--starten)
- [Tägliche Entwicklung](#tägliche-entwicklung)
- [Core-Updates einspielen](#core-updates-einspielen)
- [Theme-Assets erweitern (Override-Pattern)](#theme-assets-erweitern-override-pattern)

**Reference**
- [Voraussetzungen](#voraussetzungen)
- [Projektstruktur](#projektstruktur)
- [Gutenberg-Blöcke](#gutenberg-blöcke)
- [Gutenberg-Blöcke entwickeln](#gutenberg-blöcke-entwickeln)
- [Projektspezifische Blöcke (`theme/`)](#projektspezifische-blöcke-theme)
- [Projektspezifische PHP-Module (`inc/`)](#projektspezifische-php-module-inc)
- [Optionale Feature-Module](#optionale-feature-module)
- [Design-System (Tokens, Typografie, Spacing)](#design-system-tokens-typografie-spacing)
- [Block Editor Lockdown](#block-editor-lockdown)
- [NPM Scripts](#npm-scripts)
- [Drei Build-Systeme](#drei-build-systeme)
- [Tool-Entscheidungen](#tool-entscheidungen)
- [Asset-Handling](#asset-handling)
- [Deployment mit SFTP](#deployment-mit-sftp)
- [Barrierefreiheit](#barrierefreiheit)

**Selten gebraucht**
- [Änderungen am Framework selbst](#änderungen-am-framework-selbst)
- [Neues Projekt anlegen](#neues-projekt-anlegen)
- [Migration alter Sites](#migration-alter-sites)
- [Changelog](#changelog)

---

## Projekt klonen & starten

Wenn das Theme bereits für einen Kunden eingerichtet ist (Production-Stand) und du als Dev frisch dazustößt:

```bash
# --recursive zieht das Core-Submodule direkt mit. Ohne diese Flag ist /core leer.
git clone --recursive [REPO-URL]
cd [PROJEKT]

# Dependencies + Build. Beim ersten Run zieht der Setup-Wizard zusätzlich den
# Core auf origin/main und legt eine .vscode/sftp.json für Deployments an.
# Brand-Farben werden NICHT mehr abgefragt, sobald sie in theme.json hinterlegt
# sind — das passiert beim allerersten Setup einmalig (siehe „Neues Projekt
# anlegen" weiter unten) und bleibt dann committet.
npm install
```

Falls jemand ohne `--recursive` geklont hat:

```bash
git submodule update --init --recursive
npm install
```

---

## Tägliche Entwicklung

Für die aktive Entwicklung genügen zwei Terminal-Fenster:

```bash
# Terminal 1: Theme-Assets (SCSS/JS) — Vite watch
npm run dev

# Terminal 2: Projektspezifische Blöcke (theme/*) — wp-scripts watch
npm run dev:theme-blocks
```

Beide Watch-Modi erkennen Dateiänderungen und kompilieren automatisch neu. Wenn du an Core-Blöcken arbeitest (selten, sollte primär im Core-Repo passieren — siehe „[Änderungen am Framework selbst](#änderungen-am-framework-selbst)"), gibt es zusätzlich `npm run dev:core-blocks`.

### Production Build

```bash
# Alles auf einmal (Tokens + Vite + Core-Blöcke + Projekt-Blöcke)
npm run build:all

# Oder einzeln
npm run build                  # nur Theme-Assets (+ Tokens)
npm run build:core-blocks      # nur Core-Blöcke
npm run build:theme-blocks     # nur Projekt-Blöcke
```

Nach jedem Build wird `theme.json` automatisch mit den ermittelten Heading-/Body-Fonts gepatcht (idempotent — schreibt nur bei tatsächlicher Änderung).

---

## Core-Updates einspielen

Das Theme nutzt [`dbwmedia/dbw-base-core`](https://github.com/dbwmedia/dbw-base-core) als zentrales Framework-Submodule unter `/core`. Updates am Framework fließen via `npm run core:update` automatisch ein.

```bash
# Status: ist eine neue Version verfügbar?
npm run core:status

# Update in einem Schritt: fetch + rebase + Blocks bauen
npm run core:update
```

`npm run core:update` führt automatisch aus:
1. Sanity-Check: ist `core/` wirklich als Submodule registriert? Falls nicht (z.B. nach `cp -r`-Bootstrap), Reparatur-Anleitung statt zu pullen.
2. `git -C core fetch origin`
3. `blocks/package-lock.json`-Drift wird automatisch verworfen — npm rewriting des Lockfiles soll keinen manuellen Stash-Tanz triggern.
4. `git -C core pull --rebase origin main` (deine eigenen Commits in `core/` bleiben oben drauf)
5. `npm run build:core-blocks`
6. Erfolgsmeldung mit Commit-Sprung (alt → neu)

Danach die Änderung im Hauptprojekt committen, damit der neue Submodule-Pointer in der Theme-Historie landet:

```bash
git add core
git commit -m "chore: update core submodule to latest"
```

---

## Theme-Assets erweitern (Override-Pattern)

### Wie Core und Theme zusammenspielen

Der Core liefert die framework-agnostischen Defaults — Reset, Typography, Layout, Animations und die Token-Pipeline aus `theme.json`. Das Theme besitzt seine brandprägenden UI-Bausteine selbst (`components/_header.scss`, `components/_buttons.scss`) plus eigene Komponenten. Updates am Core fließen via `npm run core:update` automatisch ins Projekt; alles unter `src/` gehört dem Theme und überlebt jedes Core-Update.

**SCSS:**
```scss
// src/scss/main.scss (Theme)
@use '../../core/src/scss/main';     // Reset, Typography, Layout, Animations

@use 'base/helper';
@use 'components/forms';
@use 'components/card';
@use 'components/cookie';
@use 'components/buttons';            // brand-individuell, lebt im Theme
@use 'components/header';             // brand-individuell, lebt im Theme
@use 'components/kontaktformular';    // eigene Komponenten
```

**JS:**
```js
// src/js/main.js (Theme)
import '@core/src/js/main';        // Navigation, Accessibility, Scroll-* aus Core

// Eigene Module darunter:
import { initKontakt } from './components/kontaktformular.js';
document.addEventListener('DOMContentLoaded', initKontakt);
```

**PHP:** Eigene Module unter `inc/<modulname>/` — werden automatisch geladen. Ordner mit führendem `_` (z.B. `inc/_disabled-feature/`) bleiben inaktiv.

### Sass-Tokens, Breakpoints und Mixins nutzen

Theme-Components greifen über die `abstracts/`-Dateien transparent auf alle Core-Werte zu. Sass-loadPath listet `src/scss/` vor `core/src/scss/`, deshalb resolved jedes `@use 'abstracts/...'` ab dem Theme — die theme-eigenen Files reichen die Core-Defaults via `@forward` durch und reservieren einen Slot für eigene Werte.

**Convenience-Barrel — eine Zeile bringt alles in Scope:**

```scss
// _meine-component.scss
@use 'abstracts' as *;

.meine-component {
  color: var(--wp--preset--color--primary, $color-primary);
  border-radius: $button-radius;

  @include respond-to('lg')  { padding: $spacing-md; }
  @include respond-to('2xl') { padding: $spacing-lg; }
  @include respond-to(900px) { /* theme-lokale One-off-Schwelle */ }

  @include focus-visible;
}
```

**Eigene Sass-Werte zentralisieren:** wenn mehrere Components dieselben Sass-Werte teilen, gehören sie ins Theme-Abstract (nicht in die Component selbst):

```scss
// src/scss/abstracts/_variables.scss — unter dem @forward
$header-blur:     18px;
$shadow-card-hover: 0 12px 40px rgba($color-dark-grey, 0.08);

// src/scss/abstracts/_breakpoints.scss — unter dem @forward
$bp-hero-stack: 900px;

// src/scss/abstracts/_mixins.scss — unter dem @forward
@mixin glass-blur { backdrop-filter: blur($header-blur); }
```

**Brand-Tokens** (Farben, Spacing, Fonts, globale Breakpoints) gehören weiter in `theme.json` und `core/breakpoints.json`. Auto-Gen läuft via `npm run tokens` und produziert die `$color-*` / `$spacing-*` / `$font-*` / `$bp-*` Variablen.

### Header und Buttons re-skinnen

Beide Komponenten arbeiten gegen CSS-Custom-Properties — eine Re-Skin-Aktion bedeutet meist nur ein paar Vars im `:root` setzen, kein Selektor-Duplikat:

```scss
// src/scss/components/_header.scss (Theme oder Customer)
:root {
  --header-bg:                rgba(250, 250, 250, 0.88);
  --header-text:              #000;
  --header-backdrop-filter:   blur(16px);
  --header-shadow:            0 1px 0 rgba(0, 0, 0, 0.08);
  --header-cta-bg:            var(--wp--preset--color--accent, #{$color-accent});
  --header-cta-text:          #{$color-white};
}
```

Slideout-Menü, Close-Button und last-item-CTA konsumieren dieselben Vars und folgen automatisch.

### Neue JS-Komponente

```bash
touch src/js/components/mein-modul.js
```

```js
// mein-modul.js
export function initMeinModul() {
  // …
}
```

```js
// src/js/main.js – nach dem Core-Import:
import '@core/src/js/main';
import { initMeinModul } from './components/mein-modul.js';

document.addEventListener('DOMContentLoaded', () => {
  initMeinModul();
});
```

---

## Voraussetzungen

| Requirement   | Version   | Hinweis                                                       |
| ------------- | --------- | ------------------------------------------------------------- |
| WordPress     | **≥ 6.6** | `theme.json` nutzt Keys ab WP 6.1–6.6 (Details: CHANGELOG.md) |
| GeneratePress | ≥ 3.4     | Als Parent Theme aktiv                                        |
| Node.js       | ≥ 20 LTS  |                                                               |
| PHP           | ≥ 8.1     |                                                               |

---

## Projektstruktur

```
dbw-base-theme/
├── theme.json                 # Design-Tokens: Farben, Spacing (Single Source of Truth)
│
├── core/                      # ← Git-Submodule (dbw-media) – NICHT ANFASSEN
│   ├── blocks/                #   Gemeinsame Gutenberg-Blöcke (dbw-base/*)
│   ├── inc/                   #   Framework-PHP (Loader, Assets, Settings, theme-blocks-loader …)
│   ├── src/                   #   Framework-Defaults
│   │   ├── scss/              #     Reset, Typography, Layout, Animations
│   │   │   ├── abstracts/     #     Tokens (auto-gen), Mixins, Type-Scale, Breakpoints
│   │   │   ├── base/          #     reset, typography, layout
│   │   │   ├── components/    #     animations
│   │   │   └── main.scss      #     Entry – wird vom Theme-main.scss eingebunden
│   │   └── js/                #     Navigation, Accessibility, ScrollHeader, Smooth-Scroll, …
│   ├── scripts/               #   Build- und Setup-Scripts (setup, tokens, core-update, docs:blocks)
│   └── breakpoints.json       #   SSOT für Breakpoints (xs / sm / md / lg / xl / 2xl / 3xl)
│
├── blocks/                    # ← Projektspezifische Blöcke (theme/*)
│   ├── src/                   #   Block-Quelldateien
│   │   └── blog-teaser/       #   Beispiel-Block (Referenz-Implementierung)
│   ├── build/                 #   Kompilierte Blöcke (generiert)
│   ├── package.json           #   @wordpress/scripts Dependencies
│   └── ARCHITECTURE.md        #   ← Pflichtlektüre vor jedem neuen Block
│
├── build/                     # Kompilierte Theme-Assets (generiert)
├── src/                       # Projekt-Quelldateien (alles, was projektspezifisch ist)
│   ├── scss/
│   │   ├── abstracts/_variables.scss    # @forward Core + Slot für eigene Sass-Vars
│   │   ├── abstracts/_breakpoints.scss  # @forward Core + Slot für theme-lokale BPs
│   │   ├── abstracts/_mixins.scss       # @forward Core + Slot für eigene Mixins
│   │   ├── abstracts/_index.scss        # Barrel: @use 'abstracts' as *; lädt alle drei
│   │   ├── base/_helper.scss            # Utility-Klassen (Stub – frei zu befüllen)
│   │   ├── components/_buttons.scss     # Brand-Buttons (theme-eigen, nicht im Core)
│   │   ├── components/_header.scss      # Brand-Header (theme-eigen, CSS-Vars-driven)
│   │   ├── components/_card.scss        # Stub für Karten-Stile
│   │   ├── components/_cookie.scss      # Stub für Cookie-Banner
│   │   ├── components/_forms.scss       # Stub für Formular-Styles
│   │   └── main.scss                    # @use core/main + eigene Imports darunter
│   └── js/
│       ├── components/            # Eigene JS-Module (leer für neue Projekte)
│       └── main.js                # import @core/src/js/main + eigene Imports darunter
│
├── inc/                       # Theme-spezifische PHP-Module (kein Core-Code)
│   └── _custom-module-example/  # Vorlage – Ordner mit führendem _ ist deaktiviert
│
├── functions.php              # Theme-Setup
├── style.css                  # Theme-Header (kein eigentliches CSS)
├── package.json               # Vite + Convenience-Scripts
└── vite.config.js             # Vite-Konfiguration
```

## Projektspezifische PHP-Module (`inc/`)

Jeder Unterordner in `inc/` ist ein eigenständiges Modul (CPTs, Taxonomien, Hooks, …) und wird automatisch geladen.

**Konvention:**
- Aktive Module: `inc/<modulname>/` → werden vom Loader in `functions.php` automatisch eingebunden.
- Deaktivierte Vorlagen: `inc/_<modulname>/` → werden ignoriert (führender Unterstrich = Vorlage ohne Side-Effects). Nutze das, um Templates zu pflegen, ohne sie produktiv zu schalten.
- Template-Dateien (`single-*.php`) werden NICHT per glob geladen — sie werden via `template_include`-Filter in `functions.php` geroutet.

**Beispiel — Vorlage zum aktiven Modul machen:**
```bash
cp -r inc/_custom-module-example inc/jobs
# Funktionspräfix in den PHP-Files anpassen (dbw_example_ → dbw_jobs_)
# Slugs / Labels an das neue Feature anpassen
```

## Gutenberg-Blöcke

Das Theme enthält aktuell 28 eigene Gutenberg-Blöcke + 1 RichText-Format-Typ (Highlight Pill) in der Kategorie **"dbw base Blocks"**. Alle neuen Blöcke (ab 3.1.0) nutzen `render.php` (dynamisch, serverseitig gerendert) statt `save.js` -- das macht sie **unkaputtbar**: Änderungen am Markup erfordern keine Block-Recovery im Editor.

### Block-Katalog

> Die folgende Tabelle wird automatisch aus `core/blocks/build/*/block.json` generiert. Aktualisieren mit `npm run docs:blocks` (nach `npm run build:core-blocks`).

<!-- BLOCKS:START -->
_Auto-generiert via `npm run docs:blocks`. Quelle: core/blocks/build/*/block.json._

| Block | Name | Typ | Beschreibung |
| --- | --- | --- | --- |
| **Accordion** | `dbw-base/accordion` | Dynamisch, Parent (mit view.js) | FAQ-Accordion mit animierten Frage-/Antwort-Paaren. |
| **Accordion-Eintrag** | `dbw-base/accordion-item` | Dynamisch, Child | Einzelne Frage/Antwort für das Accordion. |
| **Bento Card** | `dbw-base/bento-card` | Dynamisch, Child (mit view.js) | Einzelne Karte im Bento Grid. Breite (1–4 Spalten), Höhe (1–2 Zeilen) und Hintergrundfarbe wählbar. |
| **Bento Grid** | `dbw-base/bento-grid` | Dynamisch | Asymmetrisches Karten-Grid im Material Design 3 Bento-Stil. Enthält Bento-Karten in variablen Breiten und Höhen. |
| **Card Carousel** | `dbw-base/card-carousel` | Dynamisch (mit view.js) | Horizontal scrollender Karten-Karussell im Apple-Stil. Karten beginnen an der Content-Breite und scrollen über den Viewport hinaus. |
| **Card** | `dbw-base/card-item` | Dynamisch, Child (mit view.js) | Einzelne Karte mit Bild, Überschrift, Text und optionalem Link. |
| **Card Grid** | `dbw-base/cards` | Dynamisch | Grid-Container für Karten. Steuert Spaltenanzahl (2, 3 oder 4). |
| **Bewerber-Quiz (intern)** | `dbw-base/career-quiz` | Dynamisch (mit view.js) | Internes Asset-Bundle für Alpine.js auf Job-Seiten. Das eigentliche Bewerber-Modal wird automatisch im Job-Template gerendert; konfiguriert über Jobs → Quiz-Konfiguration. |
| **Carousel Card** | `dbw-base/carousel-card` | Dynamisch, Child (mit view.js) | Einzelne Karte im Card Carousel. Drei Typen: Feature (Bild + Text), Media (Vollbild-Bild), Color (Farbiger Hintergrund). |
| **CTA-Banner** | `dbw-base/cta-banner` | Dynamisch | High-Attention Conversion-Banner mit Headline und Call-to-Action Button. |
| **Events** | `dbw-base/events` | Dynamisch | Chronologische Event-Liste als Kacheln mit Datum, Titel und Uhrzeit. |
| **Footer Info** | `dbw-base/footer-info` | Dynamisch | Flexibler Footer-/Info-Block mit Logo, Firmeninformationen, Öffnungszeiten, rechtlichen Links und Scroll-to-Top. |
| **Hero** | `dbw-base/hero` | Dynamisch | Moderner Hero-Bereich mit Überschrift, Text, Buttons und optionalem Hintergrundbild/-video. |
| **Job-Liste** | `dbw-base/jobs-loop` | Dynamisch (mit view.js) | Zeigt alle veröffentlichten Stellenangebote automatisch als Kacheln. |
| **Logo-Grid** | `dbw-base/logo-grid` | Dynamisch | Partner-Logo-Grid mit automatischem Graustufen-Filter und Hover-Effekt. |
| **Scroll Scale Section** | `dbw-base/scroll-scale-section` | Dynamisch (mit view.js) | Section mit Scroll-Animation: Expand öffnet sich von Karte zu Fullwidth, Contain zieht sich zu einer Karte zusammen. Animation läuft über native CSS scroll-driven animations mit IO-Fallback. |
| **Scrolly Card** | `dbw-base/scrolly-card` | Dynamisch, Child | Content-Card im Scrolly Framework. Definiere eine SVG-ID – wenn diese Card in den Viewport scrollt, wird das passende SVG-Element hervorgehoben. |
| **Scrolly Framework** | `dbw-base/scrolly-framework` | Dynamisch (mit view.js) | Scrollytelling-Container: Sticky SVG links, scrollende Content-Cards rechts. SVG-Elemente werden bei aktivem Card über IDs hervorgehoben. |
| **Section** | `dbw-base/section` | Dynamisch | Äußerer Container für Sektionen mit Padding, Hintergrundfarbe und optionalem Background-Image. |
| **Split-Content** | `dbw-base/split-content` | Dynamisch | 50/50 Layout mit Bild und Text. Ideal für Storytelling-Sektionen. |
| **Split Content Dynamisch (Beta)** | `dbw-base/split-content-dynamic` | Dynamisch | Split-Content mit dynamischen Datenquellen (ACF, Post-Meta, Beitragstitel …). Beta – nur für Entwicklung. |
| **Stat-Counter** | `dbw-base/stat-counter` | Dynamisch (mit view.js) | Animierter Zahlen-Counter mit Label für Trust-Sektionen. |
| **Stats Grid** | `dbw-base/stats-grid` | Dynamisch | Kennzahlen-Grid im Apple-Tech-Specs-Stil. Flach, typografisch, mit trennenden Linien. |
| **Sticky Media Scroll** | `dbw-base/sticky-media-scroll` | Dynamisch | Scrollytelling in zwei Modi: Sticky oder Overlay. Mit optionaler Sektion-Überschrift, Sticky-Bild am Container (Option B) und Sektion-CTA. |
| **Sticky Panel** | `dbw-base/sticky-panel` | Dynamisch, Child | Einzelnes Panel für Sticky Media Scroll. Drei Content-Typen: text, text-media, media-overlay. Card-Styling via Karten-Stil-Panel. |
| **Ticker / Banderole** | `dbw-base/ticker` | Dynamisch | Endlos laufende Textzeile (Marquee). Wörter oder kurze Phrasen scrollen gleichmäßig durch. |
| **USP-Punkt** | `dbw-base/usp-item` | Dynamisch, Child | Einzelner USP-Punkt mit vordefiniertem Icon, Titel und Text. |
| **USP Icon-List** | `dbw-base/usp-list` | Dynamisch | Liste von Verkaufsargumenten mit vordefinierten Icons. |
<!-- BLOCKS:END -->

> **Highlight Pill** (`dbw-base/highlight-pill`) ist kein Block, sondern ein **RichText-Format-Typ** – er erscheint in der Inline-Toolbar wenn Text markiert wird und erzeugt ein `<mark class="dbw-highlight-pill">` Pill-Element.

### Parent/Child-Blöcke

Einige Blöcke nutzen ein **Parent/Child-Pattern** mit `InnerBlocks`:

- **Cards**: `cards` (Parent) → `card-item` (Child)
- **USP Icon-List**: `usp-list` (Parent) → `usp-item` (Child)
- **Accordion**: `accordion` (Parent) → `accordion-item` (Child)
- **Bento-Grid**: `bento-grid` (Parent) → `bento-card` (Child)
- **Sticky Media Scroll**: `sticky-media-scroll` (Parent) → `sticky-panel` (Child)

Child-Blöcke können nur innerhalb ihres Parent-Blocks eingefügt werden (`"parent"` in `block.json`). Der Parent beschränkt `allowedBlocks` auf den zugehörigen Child-Typ.

### Semantisches HTML

Alle Blöcke nutzen semantische HTML5-Elemente:

- Sektions-Level-Blöcke → `<section>` (Section, Cards, Split-Content, USP-List, Accordion, Logo-Grid, CTA-Banner)
- Inhalts-Einheiten → `<article>` (Card-Item)
- Accordion-Trigger → `<button>` mit `aria-expanded`, `aria-controls`
- Accordion-Content → `<div role="region">` mit `aria-labelledby`
- Icons → `aria-hidden="true"`

### Frontend-JavaScript (view.js)

Zwei Blöcke laden zusätzliches Frontend-JavaScript:

- **Stat-Counter**: `IntersectionObserver`-basierte Count-Up-Animation mit Ease-Out-Cubic, `de-DE`-Formatierung, respektiert `prefers-reduced-motion`
- **Accordion**: Toggle-Logik (nur ein Panel offen), `max-height`-Animation, ARIA-State-Management

---

## Projektspezifische Blöcke (`theme/`)

Neben den Core-Blöcken gibt es einen zweiten Block-Layer im Verzeichnis `blocks/` für kundenspezifische Blöcke. Diese sind vollständig vom Core getrennt und werden pro Projekt entwickelt.

### Warum zwei Block-Layer?

|                           | Core-Blöcke (`core/blocks/`)           | Projekt-Blöcke (`blocks/`)            |
| ------------------------- | -------------------------------------- | ------------------------------------- |
| **Namespace**             | `dbw-base/*`                           | `theme/*`                             |
| **Kategorie im Inserter** | „dbw base Blocks"                      | `DBW_CLIENT_NAME` + „ Blocks"         |
| **Geteilt von**           | Allen dbw-Projekten                    | Nur diesem Projekt                    |
| **Typische Inhalte**      | Hero, Section, CTA, Cards, Accordion … | Blog, Jobs, Kontakt, Referenzen …     |
| **Core anfassen?**        | Nein – ist ein Git-Submodule           | —                                     |

### Kundennamen konfigurieren

In `functions.php` den Kundennamen eintragen – er erscheint dann im Gutenberg-Inserter als Kategorietitel:

```php
// functions.php
define( 'DBW_CLIENT_NAME', 'Mein Projekt' );
// → Inserter zeigt: "Mein Projekt Blocks"
```

### Neuen Block anlegen

```bash
# 1. Verzeichnis anlegen
mkdir blocks/src/mein-block

# 2. Pflichtdateien anlegen (blocks/src/blog-teaser/ als Vorlage)
touch blocks/src/mein-block/block.json
touch blocks/src/mein-block/index.js
touch blocks/src/mein-block/edit.js
touch blocks/src/mein-block/render.php
touch blocks/src/mein-block/style.scss
touch blocks/src/mein-block/editor.scss

# 3. Einmalig bauen
npm run build:theme-blocks

# → Block erscheint danach automatisch im Inserter unter "[Kundenname] Blocks"
```

Im Watch-Modus:

```bash
npm run dev:theme-blocks
```

Kein manuelles Eintragen in PHP nötig – `core/inc/theme-blocks-loader.php` erkennt alle
gebauten Blöcke unter `blocks/build/*/block.json` automatisch.

### Konventionen

- **Namespace:** `theme/block-name` (beim Start eines neuen Projekts durch den Kundennamen ersetzen)
- **Kategorie:** `theme-blocks` (Slug, Anzeigename kommt aus `DBW_CLIENT_NAME`)
- **CSS-Klasse:** `.wp-block-theme-block-name` (generiert WordPress automatisch)
- **Textdomain:** `dbw-base`
- **SCSS-Imports:** Shared Partials aus dem Core über relativen Pfad – **nie kopieren**

### Vollständige Referenz

Alle Konventionen, SCSS-Imports, `block.json`-Regeln und die Entwicklungs-Checkliste:

**[blocks/ARCHITECTURE.md](blocks/ARCHITECTURE.md)**

### Vorhandene Projekt-Blöcke

| Block           | Name               | Beschreibung                                                              |
| --------------- | ------------------ | ------------------------------------------------------------------------- |
| **Blog Teaser** | `theme/blog-teaser`| Neueste Blogbeiträge als Teaser-Karten (WP_Query, konfigurierbare Spalten/Anzahl) |

---

## Optionale Feature-Module

Der Core enthält Feature-Module, die standardmäßig **deaktiviert** sind und nur bei Bedarf eingeschaltet werden. Das Aktivieren/Deaktivieren läuft ausschließlich über PHP-Konstanten in `functions.php` — vor dem Core-Loader definieren.

### Career Module

Vollständiges Karriere-System: Custom Post Type `jobs`, Schema.org-Ausgabe für Google Jobs und ein interaktiver Bewerbungswizard als Gutenberg-Block.

#### Aktivieren / Deaktivieren

**Appearance → dbw Einstellungen → Feature-Module** → Toggle „Career Module" umlegen → Speichern.

Beim ersten Aktivieren werden die Rewrite Rules automatisch geflusht — der `/jobs/`-Slug ist sofort verfügbar.

> **Programmatisches Override** (z.B. für Staging): `define('ENABLE_CAREER_MODULE', true)` in `functions.php` vor dem Core-Loader. Überschreibt den Settings-Toggle.

#### Nach der Aktivierung (einmalig)

```bash
# 1. Alpine.js installieren (nur beim ersten Mal nach dem Clone)
cd core/blocks && npm install

# 2. Core-Blöcke neu bauen (registriert den career-quiz Block)
npm run build:core-blocks   # aus dem Theme-Root ausführen

# 3. WordPress: Permalinks flushen
# Admin → Einstellungen → Permalinks → Speichern
# (registriert den /jobs/-Slug des CPT)
```

#### Was das Modul liefert

| Komponente | Beschreibung |
|---|---|
| CPT `jobs` | Eigener Post-Type mit Archiv (`/jobs/`), indexierbar, im Menü unter „Jobs" |
| Schema.org JSON-LD | `JobPosting` automatisch im `<head>` jeder Stellen-Seite — für **Google for Jobs** Rich Results |
| Gutenberg Sidebar | Panel „Job Details (SEO)" auf jedem Job-Post: Standort, Beschäftigungsart, Remote, Gehaltsspanne, Abteilung, Bewerbungsfrist |
| Block `dbw-base/career-quiz` | Interaktives Bewerbungsmodal — direkt auf der Job-Single-Page platzieren |
| REST Endpoint | `POST /wp-json/dbw/v1/apply` — validiert, schützt vor Spam, verschickt zwei HTML-Mails |

#### Bewerber-Quiz Block im Editor

Den Block auf der Job-Seite platzieren (Inserter → „dbw base Blocks" → „Bewerber-Quiz"). In den InspectorControls lassen sich konfigurieren:

- **Trigger-Button** – Beschriftung und Stil (Primary / Secondary / Ghost)
- **Schritt 1 – Benefits** – Beliebig viele Benefit-Karten (Icon aus [Material Symbols](https://fonts.google.com/icons) + Text)
- **Schritt 2 – Verfügbarkeit** – Antwort-Optionen frei konfigurierbar
- **Schritt 3 – Kontakt** – Überschrift, Unterzeile, Datenschutz-Text
- **Erfolgsmeldung** – Titel und Text nach erfolgreichem Absenden

#### E-Mail-Empfänger

Die Bewerbungsmail geht an die **WordPress-Admin-E-Mail** (`Einstellungen → Allgemein`). Beim Kunden einfach dort die gewünschte Empfängeradresse eintragen.

#### Schema.org Pflichtfelder für Google Jobs

Damit Google die Stelle als Rich Result ausspielt, müssen auf jedem Job-Post mindestens folgende Felder ausgefüllt sein:

| Feld | Wo eintragen |
|---|---|
| Titel der Stelle | Post-Titel |
| Stellenbeschreibung | Post-Inhalt oder Auszug |
| Standort | Sidebar-Panel „Job Details (SEO)" → Standort |
| Beschäftigungsart | Sidebar-Panel → Beschäftigungsart |

Optionale aber empfehlenswerte Felder: Gehaltsspanne, Bewerbungsfrist, Remote-Option, Abteilung.

---

## Design-System (Tokens, Typografie, Spacing)

`theme.json` ist die einzige Stelle, an der **Farben** und **Section-Spacing** gepflegt werden. Alles andere — SCSS-Variablen, CSS-Custom-Properties, Editor-Picker — wird automatisch daraus generiert.

```
theme.json                                                 ← Farben + Spacing-Presets
   ├── WordPress  →  --wp--preset--color--*  / --wp--preset--spacing--*
   └── npm run tokens  →  abstracts/_tokens.scss + blocks/_tokens.scss
                          → $color-primary, $spacing-m, …
```

Token-Generator läuft idempotent vor jedem `npm run build`.

### Token-Übersicht

| Kategorie | Quelle | Zugriff |
| --- | --- | --- |
| Farben | `theme.json` `palette` | `$color-*` / `var(--wp--preset--color--*)` |
| Section-Spacing (S/M/L) | `theme.json` `spacingSizes` | `$spacing-s/m/l` / `var(--wp--preset--spacing--*)` |
| Component-Spacing (8pt) | Core `_variables.scss` | `$spacing-xs/sm/md/lg/xl/2xl/3xl/4xl` / `var(--space-*)` |
| Font-Sizes (fluid) | Core `_type-scale.scss` | `$fs-h1/.../sm` / `var(--fs-*)` |
| Line-Heights / Letter-Spacing | Core `_type-scale.scss` | `$lh-*`, `$ls-*` / `var(--lh-*)`, `var(--ls-*)` |
| Breakpoints | `core/breakpoints.json` | `$bp-xs/sm/md/lg/xl/2xl/3xl` / `respond-to('lg')` |

Die `_type-scale.scss`-Werte erscheinen zusätzlich in `theme.json` `fontSizes` (für den Editor-Picker). Beide müssen bei Skalierungs-Änderungen synchron gehalten werden — Auto-Sync ist im Backlog.

### Typografie-Skala

Fluid Skalierung zwischen 360px und 1440px Viewport (Major Third, ~1.25 ratio):

| Token | Mobile → Desktop |
| --- | --- |
| `$fs-sm` / `--fs-sm` | 12 → 14px |
| `$fs-base` / `--fs-base` | 14 → 18px (Body) |
| `$fs-h6` / `--fs-h6` | 16 → 20px |
| `$fs-h5` / `--fs-h5` | 18 → 24px |
| `$fs-h4` / `--fs-h4` | 22 → 30px |
| `$fs-h3` / `--fs-h3` | 26 → 38px |
| `$fs-h2` / `--fs-h2` | 32 → 48px |
| `$fs-h1` / `--fs-h1` | 40 → 64px |

Line-Heights: `$lh-body` 1.7 (Fließtext), `$lh-heading` 1.15 (h3-h6), `$lh-large` 1.05 (h1-h2).
Letter-Spacing: `$ls-large` -0.025em, `$ls-heading` -0.01em, `$ls-ui` 0.025em.

> Heading-Farbe wird ausschließlich über `theme.json` (`styles.elements.heading.color`) gesetzt — vermeidet Spezifitätskonflikte mit GeneratePress.

### Spacing-Ebenen

**Section-Spacing** (Block-Padding, drei Presets aus `theme.json`):

| Preset | Slug | Wert |
| --- | --- | --- |
| Klein (S) | `s` | `clamp(1.5rem, 4vw, 2.5rem)` |
| Mittel (M) | `m` | `clamp(3rem, 6vw, 5rem)` |
| Groß (L) | `l` | `clamp(5rem, 10vw, 8rem)` |

Sektions-Blöcke kriegen automatisch ein „Vertikaler Abstand"-Dropdown im Editor (rendert als `is-padding-s/m/l`). In Block-SCSS via `@use '../spacing' as sp; @include sp.section-padding;`.

**Component-Spacing** (8pt-Grid für Abstände innerhalb von Komponenten):

| SCSS | CSS Var | Wert |
| --- | --- | --- |
| `$spacing-sm` | `--space-1` | 8px |
| `$spacing-md` | `--space-2` | 16px |
| `$spacing-lg` | `--space-3` | 24px |
| `$spacing-xl` | `--space-4` | 32px |
| `$spacing-2xl` | `--space-6` | 48px |
| `$spacing-3xl` | `--space-8` | 64px |
| `$spacing-4xl` | `--space-12` | 96px |

### Im Code verwenden

```scss
@use 'abstracts' as *;   // Theme: bringt $color-*, $spacing-*, $fs-*, $bp-*, respond-to(), focus-visible

.mein-element {
  color: var(--wp--preset--color--primary, $color-primary);
  font-size: var(--fs-h2);
  padding: var(--space-3);
  gap: $spacing-md;

  @include respond-to('lg') { padding: $spacing-xl; }
  @include focus-visible;
}
```

Block-SCSS (eigener wp-scripts-Build) nutzt den lokalen Tokens-Pfad: `@use '../tokens' as t;` und greift per `t.$color-primary` zu.

### Werte ändern

1. `theme.json` editieren (Farben unter `settings.color.palette`, Spacing unter `settings.spacing.spacingSizes`)
2. `npm run build` (oder `npm run tokens`, wenn nur die Token-Files frisch sollen)

Beide `_tokens.scss` (Theme + Blocks) werden idempotent regeneriert — kein manuelles Sync.

---

## Custom SVG-Upload (USP-Punkte)

Der USP-Punkt-Block (`dbw-base/usp-item`) hat zwei Icon-Modi:
- **Eigenes SVG** über MediaUpload im Inspector (Priorität, ohne Hintergrund-Tint)
- **Vordefiniertes Line-Icon** als Fallback (Haken / Stern / Rakete / Herz / Schild / Blitz)

SVG-Uploads sind via `core/inc/svg-support.php` aktiviert.

---

## Block-Animationen deaktivieren

Jeder Block kann aus den Scroll-Animationen herausgenommen werden — ohne Code, direkt im Editor:

**Block markieren → Seitenleiste → Erweitert → „Zusätzliche CSS-Klasse" → `no-anim` eintragen.**

Funktioniert auch auf Drittanbieter- und Core-Blöcken.

---

## Block Editor Lockdown

Das Theme schränkt den Gutenberg-Editor gezielt ein, damit Kunden nicht aus dem Design-System ausbrechen können. Alle Einschränkungen sind in `theme.json` definiert.

### Was ist gesperrt und warum

| Einschränkung                  | theme.json-Key                       | Grund                                 |
| ------------------------------ | ------------------------------------ | ------------------------------------- |
| Keine freien Farben            | `color.custom: false`                | Nur die 5 Brand-Farben erlaubt        |
| Keine Custom-Gradienten        | `color.customGradient: false`        | Nicht im Design-System                |
| WP-Standardfarben entfernt     | `color.defaultPalette: false`        | Verhindert WP-Blau, -Indigo, etc.     |
| WP-Standardgradienten entfernt | `color.defaultGradients: false`      | —                                     |
| Keine freie Schriftgröße       | `typography.customFontSize: false`   | Nur die 8 Type-Scale-Größen           |
| WP-Standardgrößen entfernt     | `typography.defaultFontSizes: false` | Verhindert WP's Small/Medium/Large/XL |
| Kein custom Zeilenabstand      | `typography.lineHeight: false`       | SCSS kontrolliert das präzise         |
| Kein custom Buchstabenabstand  | `typography.letterSpacing: false`    | SCSS kontrolliert das präzise         |
| Keine Drop Caps                | `typography.dropCap: false`          | Nicht im Design-System                |
| Kein Fließtext-Modus           | `typography.writingMode: false`      | Vertikaler Text nicht vorgesehen      |
| Keine Custom-Fonts             | `typography.customFontFamily: false` | System-UI Stack ist fest              |
| Kein freier Abstand            | `spacing.customSpacingSize: false`   | Nur S / M / L                         |
| WP-Standardabstände entfernt   | `spacing.defaultSpacingSizes: false` | Entfernt WP's px-Presets              |

### Was Kunden weiterhin können

- Text **fett** oder _kursiv_ formatieren, Links setzen
- Aus **5 Brand-Farben** wählen: Primär, Sekundär, Hintergrund, Dunkelgrau, Weiß
- Aus **8 Schriftgrößen** wählen: Klein (12–14px) bis H1 (40–64px), alle fluid
- Block-Padding aus **3 Spacing-Stufen** wählen: S / M / L
- Blöcke als Normal / Wide / Full Width ausrichten
- Alle `dbw-base/*` Custom Blocks mit ihren eigenen Einstellungen nutzen

### Customizer-Einschränkung

Der GP-Customizer-Bereich „Globale Farben" ist über `gp-settings.php` entfernt (`remove_section('generate_global_colors_section')`). Farbänderungen laufen ausschließlich über `theme.json` → `npm run tokens`.

### Editor-Vorschau vs. Frontend

Das **Theme-Stylesheet** (`build/css/style.*.css`) wird bewusst **nicht** in den Editor injected. Der Editor nutzt die `styles`-Definitionen aus `theme.json` als Vorschau (hardcoded Werte, keine CSS Custom Properties). Leichte visuelle Abweichungen zwischen Editor und Frontend sind möglich, inhaltlich sind sie identisch.

Block-spezifische Styles (`core/blocks/build/<block>/style-index.css`), Material Symbols und der Highlight-Pill-CSS werden jedoch über `add_editor_style()` in den Editor-Canvas geladen, damit Blocks im Editor möglichst nah am Frontend aussehen.

---

## Drei Build-Systeme

Das Theme nutzt drei unabhängige Build-Prozesse, die parallel und konfliktfrei laufen:

|                   | Theme-Assets           | Core-Blöcke                       | Projekt-Blöcke                     |
| ----------------- | ---------------------- | --------------------------------- | ---------------------------------- |
| **Tool**          | Vite                   | @wordpress/scripts (webpack)      | @wordpress/scripts (webpack)       |
| **Verzeichnis**   | Root (`/`)             | `core/blocks/`                    | `blocks/`                          |
| **Source**        | `src/scss/`, `src/js/` | `core/blocks/src/*/`              | `blocks/src/*/`                    |
| **Output**        | `build/`               | `core/blocks/build/*/`            | `blocks/build/*/`                  |
| **Konfiguration** | `vite.config.js`       | Automatisch via `wp-scripts`      | Automatisch via `wp-scripts`       |
| **Dev-Befehl**    | `npm run dev`          | `npm run dev:core-blocks`         | `npm run dev:theme-blocks`         |
| **Build-Befehl**  | `npm run build`        | `npm run build:core-blocks`       | `npm run build:theme-blocks`       |

**Warum getrennte Systeme?** Gutenberg-Blöcke brauchen `@wordpress/scripts` (webpack) mit JSX-Support, WordPress-Dependencies und `block.json`-Verarbeitung. Core- und Projekt-Blöcke sind bewusst getrennt: der Core ist ein Git-Submodule und darf nicht verändert werden. Beide Block-Systeme haben eigene `node_modules` und stören sich nicht gegenseitig.

## NPM Scripts

Einheitliches Schema **`<scope>:<target>`**. Alle Build- und Dev-Scripts triggern den Token-Generator vorher automatisch — `npm run tokens` muss nie separat aufgerufen werden.

### Root-Scripts (Theme)

| Script                      | Wann                        | Beschreibung                                                        |
| --------------------------- | --------------------------- | ------------------------------------------------------------------- |
| `npm run install:all`       | Einmalig nach Clone         | Installiert Deps für `core/blocks` + `blocks`                       |
| `npm run build:all`         | Einmalig + nach Reset       | Alles bauen: Tokens + Vite + Core-Blöcke + Projekt-Blöcke           |
| **Build (einzeln)**         |                             |                                                                     |
| `npm run build`             | Nach Theme-SCSS/JS-Edits    | Theme-Assets via Vite (+ Tokens)                                    |
| `npm run build:core-blocks` | Nach Core-Update            | Core-Blöcke (+ Tokens)                                              |
| `npm run build:theme-blocks`| Nach Theme-Block-Edits      | Projektspezifische Blöcke (+ Tokens)                                |
| **Watch-Modi (Dev)**        |                             |                                                                     |
| `npm run dev`               | Theme-Entwicklung           | Vite im Watch-Modus für SCSS/JS                                     |
| `npm run dev:core-blocks`   | Block-Entwicklung im Core   | wp-scripts watch für `core/blocks/`                                 |
| `npm run dev:theme-blocks`  | Projekt-Block-Entwicklung   | wp-scripts watch für `blocks/`                                      |
| **Tokens & Core**           |                             |                                                                     |
| `npm run tokens`            | Manuell (selten nötig)      | Tokens aus `theme.json` + `core/breakpoints.json` neu generieren    |
| `npm run core:status`       | Vor `core:update`           | Zeigt, ob neue Core-Commits auf origin/main warten                  |
| `npm run core:update`       | Wenn `core:status` warnt    | Core-Submodule auf neuesten Stand ziehen + Blocks neu bauen         |

### Block-Scripts (in `blocks/` und `core/blocks/`)

| Script                    | Beschreibung                     |
| ------------------------- | -------------------------------- |
| `npm run build`           | Production-Build                 |
| `npm run start`           | Watch-Modus mit Live-Rebuild     |
| `npm run packages-update` | WordPress-Packages aktualisieren |

> Die Sub-Package-Scripts ruft man normalerweise nicht direkt auf – die Root-Scripts (`build:core-blocks`, `dev:core-blocks` etc.) wrappen sie und stellen die Tokens vorher sicher.

## Gutenberg-Blöcke entwickeln

> **Tiefer Einstieg:** [`core/blocks/ARCHITECTURE.md`](./core/blocks/ARCHITECTURE.md) ist Pflichtlektüre vor jedem neuen Block — beschreibt Parent/Child-Pattern, semantisches HTML, view.js-Konventionen, Auto-Discovery und alle Anti-Patterns. Hier nur der Quickstart.

### Quickstart: neuen Block anlegen

```bash
mkdir blocks/src/mein-block
cd blocks/src/mein-block
```

Pflicht-Files: `block.json` (Metadaten + Attribute), `index.js` (Registrierung), `edit.js` (Editor-View), `render.php` (Frontend, server-seitig). Optional: `style.scss`, `editor.scss`, `view.js` (Frontend-JS, z.B. Alpine-Hooks).

```javascript
// index.js
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => null,    // dynamischer Block — render.php übernimmt
});
```

```scss
// style.scss
@use '../tokens' as t;
@use '../spacing' as sp;

.wp-block-dbw-base-mein-block {
  @include sp.section-padding;
  // …
}
```

Build: `npm run build:core-blocks` (oder `npm run dev:core-blocks` zum Watchen). PHP registriert den Block automatisch via `core/inc/blocks.php` — neuer Ordner unter `blocks/src/` + Build = Block verfügbar.

### Konventionen

- **Namespace:** `dbw-base/<block-name>` in `block.json` → `name`
- **Kategorie:** `dbw-base` (eigener Block-Inserter-Bereich)
- **CSS-Klasse:** `.wp-block-dbw-base-<block-name>` (von WordPress generiert), BEM-Elemente: `__element`
- **Tokens:** immer mit Fallback, z.B. `color: var(--wp--preset--color--primary, t.$color-primary)`
- **Rendering:** `render.php` (dynamisch) — `save.js` nur für den Legacy-Hero-Block

Detail-Pattern (Parent/Child, Editor-Lockdown, view.js-Hooks, Padding-Mixin etc.) → [`core/blocks/ARCHITECTURE.md`](./core/blocks/ARCHITECTURE.md).

## Änderungen am Framework selbst

Nur relevant für Framework-Maintainer. Änderungen an Core-Defaults (Blocks, PHP-Includes, SCSS-Abstracts) müssen **im `/core`-Ordner** committet und gepusht werden — nicht im Theme-Repo:

```bash
cd core
# Änderungen vornehmen ...
git add -A
git commit -m "feat: ..."
git push origin main
cd ..

# Submodule-Pointer im Theme/Customer aktualisieren:
git add core
git commit -m "chore(core): bump submodule"
git push
```

Der Customer-Run von `npm run core:update` zieht den Bump dann automatisch.

---

## Neues Projekt anlegen

Einmal pro Customer. Voraussetzung: leeres Repo auf GitHub
(`https://github.com/dbwmedia/<customer-name>`).

```bash
# 1. Theme inkl. Core-Submodule unter dem Customer-Namen klonen.
#    --recursive registriert core/ direkt als Submodule.
git clone --recursive https://github.com/dbwmedia/dbw-base-theme.git <customer-name>
cd <customer-name>

# 2. Origin auf das leere Customer-Repo umstellen + initialer Push.
#    Das Theme-Repo bleibt nirgendwo verlinkt — alles ab hier gehört dem Customer.
git remote set-url origin https://github.com/dbwmedia/<customer-name>.git
git push -u origin main

# 3. Setup-Wizard + Build in einem Schritt.
#    npm install zieht den Core auf origin/main, fragt einmal nach Kundenname /
#    Brand-Farben / SFTP, schreibt theme.json + functions.php + .vscode/sftp.json
#    und triggert install:all + build:all. Marker in theme.json sorgt dafür,
#    dass Folge-Devs nach `git pull` nicht mehr nach Farben gefragt werden.
npm install
```

> **Anti-Pattern:** Niemals `cp -r` + `git init` zum Klonen — dadurch landet
> `core/` als regulärer Tracked-Ordner statt als Submodule, und der Core friert
> dauerhaft ein. `npm run core:update` erkennt diesen Zustand und liefert eine
> Reparatur-Anleitung, falls es doch mal passiert.

---

## Migration alter Sites

Migrations-Anleitungen für ältere Theme-Versionen (3.2 → 3.3 etc.) liegen in [`MIGRATION.md`](./MIGRATION.md). Aktuelle Customer-Sites brauchen den Inhalt nicht.

---

## Deployment mit SFTP

Das Projekt nutzt VS Code SFTP für automatisches Deployment:

1. **Passwort setzen**: Öffne `.vscode/sftp.json` und trage dein FTP-Passwort ein
2. **Verbindung testen**: Cmd/Ctrl + Shift + P -> "SFTP: List"
3. **Automatischer Upload**: Beim Build werden Theme-Assets (`build/`) und Block-Assets (`blocks/build/`) automatisch hochgeladen

### Was wird hochgeladen?

- Kompilierte Theme-Assets (`build/`)
- Kompilierte Blöcke (`blocks/build/`)
- PHP-Dateien (`functions.php`, `inc/`)
- Theme-Header (`style.css`)
- `theme.json`

### Was bleibt lokal?

- Source-Dateien (`src/`, `blocks/src/`)
- Node Modules (`node_modules/`, `blocks/node_modules/`)
- Konfigurationsdateien (`vite.config.js`, `blocks/package.json`)
- Build-Scripts (`scripts/`)
- Git-Dateien

## Tool-Entscheidungen

### Warum Vite (Theme-Assets)?

- **Extrem schnell**: Native ESM im Dev-Modus, blitzschnelle Rebuilds
- **Manifest-Generation**: Perfekt für WordPress Asset-Handling mit Cache Busting
- **Zero Config**: Funktioniert sofort mit minimaler Konfiguration
- **Modern**: Optimiert für moderne Browser, automatisches Code-Splitting

### Warum @wordpress/scripts (Blöcke)?

- **WordPress-Standard**: Offizielle Toolchain, immer kompatibel
- **JSX-Support**: React-Komponenten für den Block-Editor
- **Dependency Extraction**: WordPress-Pakete werden automatisch als externals behandelt
- **block.json-Verarbeitung**: Automatische Kopie und Verarbeitung der Metadaten
- **Auto-Discovery**: Findet alle `src/*/index.js` ohne Konfiguration

### Warum zwei getrennte Build-Systeme?

`@wordpress/scripts` nutzt webpack mit CommonJS-Konfiguration. Die Root-`package.json` hat `"type": "module"` (für Vite). Das kollidiert. Die Lösung: `blocks/` ist ein eigenes npm-Projekt ohne `"type": "module"`. Beide Systeme laufen unabhängig und fehlerfrei.

## Barrierefreiheit

Das Theme ist barrierefrei konzipiert:

- Skip-Link zum Hauptinhalt
- Sichtbare Focus-Zustände (`:focus-visible`)
- Semantische HTML5-Elemente (`<section>`, `<article>`, `<main>`, `<button>`)
- Respektiert `prefers-reduced-motion` (Stat-Counter, Accordion)
- Keyboard-Navigation Support
- ARIA-Attribute bei interaktiven Elementen (`aria-expanded`, `aria-controls`, `aria-labelledby`)
- Icons mit `aria-hidden="true"`

## Asset-Handling

Das Theme nutzt Vites Manifest für intelligentes Asset-Loading:

1. Vite erzeugt `build/.vite/manifest.json` mit Hash-Dateinamen
2. PHP liest das Manifest in `core/inc/assets.php`
3. WordPress enqueued automatisch die korrekten Dateien
4. Browser-Caching funktioniert perfekt (Hash ändert sich bei Änderungen)

Gutenberg-Blöcke werden über `block.json` registriert. WordPress enqueued deren Assets automatisch, wenn der Block auf einer Seite verwendet wird. Blöcke mit `viewScript` (Stat-Counter, Accordion) laden ihr Frontend-JS nur auf Seiten, die den Block tatsächlich verwenden.

Fehlt ein Build-Verzeichnis (z.B. nach Git-Clone ohne Build), wird ein Fehler ins Debug-Log geschrieben, aber die Site bleibt funktional.

## Changelog

Aktuelle Version: **3.5.0**. Vollständige Commit-Historie über `git log` —
größere Meilensteine in Kurzform:

- **3.5.0** – Theme als Brand-Heimat: `_header.scss` und `_buttons.scss` aus dem Core ins Theme verlagert, Header-/Buttons-Re-Skin via CSS-Custom-Properties (`--header-bg`/`--header-cta-bg`/...) statt Selektor-Duplikate. Sass-Forward-Pattern in `src/scss/abstracts/` für eigene Variablen, Breakpoints und Mixins inkl. Convenience-Barrel `@use 'abstracts' as *`. Breakpoint-Skala um `xs` / `2xl` / `3xl` erweitert; `respond-to()` akzeptiert jetzt rohe Pixel-Werte für one-off-Schwellen. Setup-Wizard idempotent (theme.json-Marker), Auto-Pull des Core-Submoduls bei `npm install` einer frischen Customer-Site, `core:update` mit Submodule-Sanity-Check und automatisches Verwerfen von npm-Lockfile-Drift.
- **3.3.x** – Theme-as-Wrapper: Framework-Defaults (Reset, Typography, Layout, Animations, Setup-Wizard, Theme-Blocks-Loader) zentral im Core; Theme bindet via `@use '../../core/src/scss/main'` ein, eigene Komponenten/Overrides darüber. `vite.config.js` als Factory `createCoreConfig()`, Token-Naming einheitlich, Breakpoints SSOT in `core/breakpoints.json`, NPM-Scripts vereinheitlicht.
- **3.2.x** – Production-readiness: Token-Naming einheitlich (`$color-*`/`$spacing-*`/`$font-*`/`$bp-*`), Breakpoints SSOT in `core/breakpoints.json`, Customer-Brand-Leaks aus dem Core entfernt, NPM-Scripts vereinheitlicht (`build:*`, `dev:*`), Path-Helpers (`dbw_core_path`/`dbw_core_uri`), Block-Tabellen-Generator (`docs:blocks`), Loader-Konvention (`inc/_*` = deaktiviert).
- **3.2.0** – Zwei-Block-Layer-Architektur: `blocks/` als projektspezifischer Layer neben Core-Blöcken, `DBW_CLIENT_NAME`-Konstante, Auto-Discovery für Theme-Blöcke.
- **3.1.x** – Design System & Editor Hardening: Fluid Type Scale, 8pt Spacing Grid, vollständiger Editor-Lockdown, WCAG 1.4.4 (`html { font-size: 100% }`).
- **3.1.0** – Vollständige Block-Bibliothek (Section, Cards, USP, Accordion, Stat-Counter, Logo-Grid, CTA-Banner) auf `render.php`-Basis (unkaputtbar), zentrales Spacing-System, Custom SVG-Uploads.
- **3.0.0** – Gutenberg-Block-Entwicklung nativ im Theme. Design-Token-Pipeline aus `theme.json`. Hero-Block.
- **2.x** – Vite-Build-Workflow, modulare PHP-Architektur, Login-Customization, SVG-Support.
- **1.x** – Grundgerüst als GeneratePress Child Theme.

## dbw media

Weitere WordPress-Projekte und Themes:

- [dbw media Website](https://dbw-media.de)
- [Kontakt](https://dbw-media.de/kontakt)

---

**Made with care by [dbw media](https://dbw-media.de)**
