# dbw base – GeneratePress Child Theme

**Version 3.1.0** – Ultraleichtes, modernes GeneratePress Child Theme mit schlanker Architektur, Vite-Build-Pipeline und nativer Gutenberg-Block-Entwicklung.

**Entwickelt von [dbw media](https://dbw-media.de)**

## Schnellstart

```bash
# Theme-Dependencies installieren
npm install

# Block-Dependencies installieren
cd blocks && npm install && cd ..

# Alles auf einmal bauen (Tokens + Theme + Blocks)
npm run build:all
```

Nach dem Build aktivierst du das Theme in WordPress. Das Theme wird als Child von GeneratePress erkannt.

## Projektstruktur

```
dbw-base/
├── theme.json                 # Design-Tokens: Farben, Spacing (Single Source of Truth)
├── blocks/                    # Gutenberg-Blöcke (eigenes npm-Projekt)
│   ├── src/                   #   Block-Quelldateien
│   │   ├── _tokens.scss       #   Auto-generiert aus theme.json (nicht editieren!)
│   │   ├── _spacing.scss      #   Zentrale Spacing-Mixins (section-padding)
│   │   ├── hero/              #   Hero-Block (statisch, save.js)
│   │   ├── section/           #   Section-Wrapper (dynamisch, render.php)
│   │   ├── cards/             #   Card Grid – Parent
│   │   ├── card-item/         #   Card Grid – Child
│   │   ├── split-content/     #   50/50 Bild/Text Layout
│   │   ├── usp-list/          #   USP Icon-List – Parent
│   │   ├── usp-item/          #   USP Icon-List – Child (mit SVG-Upload)
│   │   ├── stat-counter/      #   Animierter Zahlen-Counter
│   │   ├── accordion/         #   Accordion – Parent
│   │   ├── accordion-item/    #   Accordion – Child
│   │   ├── logo-grid/         #   Partner-Logo-Grid
│   │   └── cta-banner/        #   CTA-Conversion-Banner
│   ├── build/                 #   Kompilierte Blöcke (generiert)
│   └── package.json           #   @wordpress/scripts Dependencies
├── build/                     # Kompilierte Theme-Assets (generiert)
├── src/                       # Theme-Quelldateien
│   ├── scss/                  #   Styles (SCSS)
│   │   ├── abstracts/
│   │   │   ├── _tokens.scss   #     Auto-generiert aus theme.json (nicht manuell editieren!)
│   │   │   ├── _variables.scss#     Semantic Aliases, Spacing, Breakpoints, Transitions
│   │   │   └── _mixins.scss   #     Responsive, Focus, Reduced Motion
│   │   ├── base/              #     Reset, Typography, Layout
│   │   ├── components/        #     Component-Styles
│   │   └── main.scss          #     Haupt-Entry-Point
│   └── js/                    #   JavaScript
│       ├── components/        #     JS-Module
│       └── main.js            #     Haupt-Entry-Point
├── scripts/
│   └── generate-tokens.js     # Generiert _tokens.scss für Theme UND Blocks (Farben + Spacing)
├── inc/                       # PHP-Includes
│   ├── assets.php             #   Vite-Manifest Asset-Loading
│   ├── blocks.php             #   Block-Registrierung (auto-discovery)
│   ├── svg-support.php        #   SVG-Upload-Support
│   ├── login-customization.php#   Login-Seite Anpassungen
│   ├── gp-settings.php        #   GeneratePress-Integration
│   └── dbw/                   #   dbw media Module
├── functions.php              # Theme-Setup
├── style.css                  # Theme-Header (kein eigentliches CSS)
├── package.json               # Vite + Convenience-Scripts
└── vite.config.js             # Vite-Konfiguration
```

## Gutenberg-Blöcke

Das Theme enthält 12 eigene Gutenberg-Blöcke in der Kategorie **"dbw base Blocks"**. Alle neuen Blöcke (ab 3.1.0) nutzen `render.php` (dynamisch, serverseitig gerendert) statt `save.js` -- das macht sie **unkaputtbar**: Änderungen am Markup erfordern keine Block-Recovery im Editor.

### Block-Katalog

| Block                 | Name                      | Typ               | Beschreibung                                                                                                                     |
| --------------------- | ------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**              | `dbw-base/hero`           | Statisch          | Vollwertiger Hero-Bereich mit Headline, Subtext, Dual-Buttons, Hintergrundbild mit Overlay, Scroll-Indikator, 3 Layout-Varianten |
| **Section**           | `dbw-base/section`        | Dynamisch         | Äußerer Container/Wrapper mit Padding, Hintergrundfarbe (aus theme.json), optionalem Background-Image mit Overlay                |
| **Card Grid**         | `dbw-base/cards`          | Dynamisch, Parent | Grid-Container für Karten, Spaltenanzahl 2/3/4, responsive Breakpoints                                                           |
| **Card**              | `dbw-base/card-item`      | Dynamisch, Child  | Einzelne Karte mit Bild, H3-Heading, Text und optionalem Link                                                                    |
| **Split-Content**     | `dbw-base/split-content`  | Dynamisch         | 50/50 Bild/Text Layout, Seiten per Toolbar umschaltbar                                                                           |
| **USP Icon-List**     | `dbw-base/usp-list`       | Dynamisch, Parent | Grid-Container für USP-Punkte, Spaltenanzahl 2/3/4                                                                               |
| **USP-Punkt**         | `dbw-base/usp-item`       | Dynamisch, Child  | Einzelner USP mit Icon (eigenes SVG oder vordefiniert), Titel und Text                                                           |
| **Stat-Counter**      | `dbw-base/stat-counter`   | Dynamisch         | Animierter Zahlen-Counter mit Prefix/Suffix, IntersectionObserver, `de-DE` Formatierung                                          |
| **Accordion**         | `dbw-base/accordion`      | Dynamisch, Parent | FAQ-Accordion Container mit nur-ein-Panel-offen-Logik                                                                            |
| **Accordion-Eintrag** | `dbw-base/accordion-item` | Dynamisch, Child  | Einzelne Frage/Antwort mit animiertem Toggle, ARIA-Attribute                                                                     |
| **Logo-Grid**         | `dbw-base/logo-grid`      | Dynamisch         | Partner-Logo-Grid mit Graustufen-Filter und Hover-Farbeffekt                                                                     |
| **CTA-Banner**        | `dbw-base/cta-banner`     | Dynamisch         | High-Attention Conversion-Banner, Varianten: Primary/Dark                                                                        |

### Parent/Child-Blöcke

Einige Blöcke nutzen ein **Parent/Child-Pattern** mit `InnerBlocks`:

- **Cards**: `cards` (Parent) → `card-item` (Child)
- **USP Icon-List**: `usp-list` (Parent) → `usp-item` (Child)
- **Accordion**: `accordion` (Parent) → `accordion-item` (Child)

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

## Spacing-System

Ab Version 3.1.0 gibt es ein zentrales Spacing-System, das in `theme.json` definiert wird und allen Blöcken zur Verfügung steht.

### Spacing-Presets

| Preset     | Slug | Wert                         | Verwendung               |
| ---------- | ---- | ---------------------------- | ------------------------ |
| Klein (S)  | `s`  | `clamp(1.5rem, 4vw, 2.5rem)` | Kompakte Sektionen       |
| Mittel (M) | `m`  | `clamp(3rem, 6vw, 5rem)`     | Standard-Sektionsabstand |
| Groß (L)   | `l`  | `clamp(5rem, 10vw, 8rem)`    | Große Abstände, z.B. CTA |

### Wie es funktioniert

1. **`theme.json`** definiert die Spacing-Presets unter `settings.spacing.spacingSizes`
2. **WordPress** generiert CSS Custom Properties: `--wp--preset--spacing--s`, `--wp--preset--spacing--m`, `--wp--preset--spacing--l`
3. **`generate-tokens.js`** erzeugt SCSS-Fallback-Variablen in `_tokens.scss`
4. **`_spacing.scss`** stellt ein zentrales Mixin `section-padding` bereit
5. **Jeder Sektions-Block** importiert das Mixin und bietet im Editor ein Dropdown "Vertikaler Abstand" (S/M/L)

### Im Editor

Alle Sektions-Level-Blöcke (Section, Cards, Split-Content, USP-List, Accordion, Logo-Grid, CTA-Banner) haben in den InspectorControls ein **SelectControl** für "Vertikaler Abstand" mit den drei Optionen. Der gewählte Wert wird als CSS-Klasse `is-padding-s`, `is-padding-m` oder `is-padding-l` ausgegeben.

### Im SCSS verwenden

```scss
@use '../spacing' as sp;

.wp-block-dbw-base-mein-block {
  @include sp.section-padding;
}
```

## Custom SVG-Upload (USP-Punkte)

Der USP-Punkt-Block (`dbw-base/usp-item`) unterstützt zwei Icon-Modi:

1. **Eigenes SVG hochladen** (Priorität): Über die MediaUpload-Komponente im Inspector kann ein beliebiges SVG/Bild hochgeladen werden. Es wird ohne Hintergrund-Tint in voller Größe dargestellt.
2. **Vordefiniertes Icon** (Fallback): Wenn kein eigenes Icon gesetzt ist, kann aus 6 vordefinierten Line-Icons gewählt werden: Haken, Stern, Rakete, Herz, Schild, Blitz.

SVG-Uploads werden durch `inc/svg-support.php` ermöglicht.

## Design-Tokens: Farben und Spacing

### Wichtig: `theme.json` ist die einzige Stelle, an der Farben und Spacing definiert werden.

Farben und Spacing werden **nur in `theme.json`** gepflegt. Alles andere wird automatisch daraus generiert:

```
theme.json                              ← Hier editierst du Farben + Spacing
    │
    ├──→ WordPress                      ← generiert CSS Custom Properties
    │    (--wp--preset--color--primary, --wp--preset--spacing--m, etc.)
    │
    └──→ npm run tokens (automatisch bei jedem Build)
         │
         ├──→ src/scss/abstracts/_tokens.scss   ← für Theme-SCSS (Vite)
         │        │
         │        └──→ _variables.scss          ← importiert Tokens, definiert Aliase
         │
         └──→ blocks/src/_tokens.scss           ← für Block-SCSS (wp-scripts)
                  │
                  ├──→ hero/style.scss etc.     ← @use '../tokens' as t;
                  └──→ _spacing.scss            ← Fallback-Werte für Spacing
```

### Farbe ändern oder hinzufügen

1. **`theme.json`** anpassen (unter `settings.color.palette`):

```json
{
  "name": "Primär (Brand)",
  "slug": "primary",
  "color": "#526983"
}
```

2. **Build starten** -- Tokens werden automatisch regeneriert:

```bash
npm run build
```

Fertig. Der Build-Prozess liest `theme.json`, generiert beide `_tokens.scss` (Theme + Blocks) und kompiliert dann SCSS. Du musst nichts doppelt pflegen.

### Spacing ändern oder hinzufügen

1. **`theme.json`** anpassen (unter `settings.spacing.spacingSizes`):

```json
{
  "name": "Mittel (M)",
  "slug": "m",
  "size": "clamp(3rem, 6vw, 5rem)"
}
```

2. **Build starten** -- SCSS-Token und CSS Custom Property werden automatisch aktualisiert.

### Manuell Tokens generieren (ohne Build)

```bash
npm run tokens
```

### Wie die Token-Dateien zusammenhängen

Das Script generiert **zwei Dateien** aus `theme.json`:

**`src/scss/abstracts/_tokens.scss`** (Theme, auto-generiert):

```scss
// Auto-generated from theme.json – DO NOT EDIT MANUALLY
// Colors
$color-primary: #526983;
$color-secondary: #333333;
$color-base-bg: #f9f8f6;
$color-dark-grey: #1a1a1a;
// Spacing
$spacing-s: clamp(1.5rem, 4vw, 2.5rem);
$spacing-m: clamp(3rem, 6vw, 5rem);
$spacing-l: clamp(5rem, 10vw, 8rem);
```

**`blocks/src/_tokens.scss`** (Blocks, auto-generiert):

```scss
// Auto-generated from theme.json – DO NOT EDIT MANUALLY
// Colors
$primary: #526983;
$secondary: #333333;
$base-bg: #f9f8f6;
$dark-grey: #1a1a1a;
// Spacing
$spacing-s: clamp(1.5rem, 4vw, 2.5rem);
$spacing-m: clamp(3rem, 6vw, 5rem);
$spacing-l: clamp(5rem, 10vw, 8rem);
```

**`_variables.scss`** (manuell, hier editierst du Aliase, Breakpoints):

```scss
@forward 'tokens';
@use 'tokens' as *;

// Semantische Aliase
$color-text: $color-dark-grey;
$color-background: $color-base-bg;
$color-focus: $color-primary;

// Breakpoints, Transitions...
```

### Farben im SCSS verwenden

**In Theme-SCSS** (`src/scss/`) -- CSS Custom Property + SCSS-Token als Fallback:

```scss
@use '../abstracts/variables' as *;

.mein-element {
  color: var(--wp--preset--color--primary, $color-primary);
  background: var(--wp--preset--color--base-bg, $color-background);
}
```

**In Block-SCSS** (`blocks/src/`) -- CSS Custom Property + Token als Fallback:

```scss
@use '../tokens' as t;

.wp-block-dbw-base-mein-block {
  color: var(--wp--preset--color--dark-grey, t.$dark-grey);
  background: var(--wp--preset--color--primary, t.$primary);
  font-family: var(--gp-heading-font-family, inherit);
}
```

### Warum dieses System?

- **Eine Quelle**: Farben und Spacing leben nur in `theme.json`, kein manuelles Sync
- **WordPress-nativ**: `theme.json` steuert den Block-Editor, Farbpalette, globale Styles
- **Automatisch**: Beide `_tokens.scss` (Theme + Blocks) werden bei jedem Build neu generiert (`prebuild`-Hook)
- **Fallback-sicher**: SCSS-Werte dienen als Fallback, falls CSS Custom Properties fehlen

## Zwei Build-Systeme

Das Theme nutzt zwei unabhängige Build-Prozesse, die parallel und konfliktfrei laufen:

|                   | Theme-Assets           | Gutenberg-Blöcke             |
| ----------------- | ---------------------- | ---------------------------- |
| **Tool**          | Vite                   | @wordpress/scripts (webpack) |
| **Verzeichnis**   | Root (`/`)             | `blocks/`                    |
| **Source**        | `src/scss/`, `src/js/` | `blocks/src/*/`              |
| **Output**        | `build/`               | `blocks/build/*/`            |
| **Konfiguration** | `vite.config.js`       | Automatisch via `wp-scripts` |
| **Dev-Befehl**    | `npm run build:watch`  | `npm run blocks:start`       |
| **Build-Befehl**  | `npm run build`        | `npm run blocks:build`       |

**Warum zwei Systeme?** Gutenberg-Blöcke brauchen `@wordpress/scripts` (webpack) mit JSX-Support, WordPress-Dependencies und `block.json`-Verarbeitung. Vite kann das nicht ohne aufwändige Konfiguration. Beide Systeme haben eigene `node_modules` und stören sich nicht gegenseitig.

## NPM Scripts

### Root-Scripts (Theme)

| Script                 | Beschreibung                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `npm run tokens`       | Generiert `_tokens.scss` aus `theme.json` (Farben + Spacing) |
| `npm run dev`          | Vite Dev-Server (generiert vorher Tokens)                    |
| `npm run build`        | Production-Build (generiert vorher Tokens)                   |
| `npm run build:watch`  | Watch-Modus (generiert vorher Tokens)                        |
| `npm run preview`      | Vite Preview-Server                                          |
| `npm run blocks:build` | Production-Build der Blöcke                                  |
| `npm run blocks:start` | Watch-Modus für Blöcke                                       |
| `npm run build:all`    | Alles bauen: Tokens + Vite + Blocks                          |

Die Befehle `dev`, `build` und `build:watch` generieren automatisch die Design-Tokens aus `theme.json` bevor sie starten. Du musst `npm run tokens` nie separat aufrufen, es sei denn du willst nur die Tokens ohne Build aktualisieren.

### Block-Scripts (in `blocks/`)

| Script                    | Beschreibung                     |
| ------------------------- | -------------------------------- |
| `npm run build`           | Production-Build                 |
| `npm run start`           | Watch-Modus mit Live-Rebuild     |
| `npm run packages-update` | WordPress-Packages aktualisieren |

## Entwicklung

### Ersteinrichtung

```bash
# 1. Repository klonen
git clone <repo-url> && cd dbw-base

# 2. Theme-Dependencies
npm install

# 3. Block-Dependencies
cd blocks && npm install && cd ..

# 4. Einmal alles bauen
npm run build:all
```

### Tägliche Entwicklung

Für die aktive Entwicklung empfehlen sich zwei Terminal-Fenster:

```bash
# Terminal 1: Theme-Assets (SCSS/JS)
npm run build:watch

# Terminal 2: Gutenberg-Blöcke
npm run blocks:start
```

Beide Watch-Modi erkennen Dateiänderungen und kompilieren automatisch neu.

### Production Build

```bash
# Alles auf einmal
npm run build:all

# Oder einzeln
npm run build           # nur Theme-Assets (+ Tokens)
npm run blocks:build    # nur Blöcke
```

## Gutenberg-Blöcke entwickeln

### Neuen Block erstellen

Jeder Block lebt in einem eigenen Unterordner von `blocks/src/`. Die Ordner-Struktur bestimmt den Build-Output automatisch.

1. **Ordner anlegen:**

```bash
mkdir blocks/src/mein-block
```

2. **block.json erstellen** -- Block-Metadaten:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "dbw-base/mein-block",
  "version": "3.1.0",
  "title": "Mein Block",
  "category": "dbw-base",
  "icon": "editor-code",
  "description": "Beschreibung des Blocks.",
  "textdomain": "dbw-base",
  "supports": {
    "html": false,
    "anchor": true
  },
  "attributes": {
    "heading": {
      "type": "string",
      "default": ""
    },
    "paddingSize": {
      "type": "string",
      "default": "m",
      "enum": ["s", "m", "l"]
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "render": "file:./render.php"
}
```

3. **index.js erstellen** -- Entry Point:

```javascript
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => null, // dynamischer Block: render.php übernimmt
});
```

4. **edit.js erstellen** -- Editor-Ansicht:

```javascript
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  RichText,
  InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { heading, paddingSize } = attributes;
  const blockProps = useBlockProps({ className: `is-padding-${paddingSize}` });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Darstellung', 'dbw-base')}>
          <SelectControl
            label={__('Vertikaler Abstand', 'dbw-base')}
            value={paddingSize}
            options={[
              { label: 'S', value: 's' },
              { label: 'M', value: 'm' },
              { label: 'L', value: 'l' },
            ]}
            onChange={(value) => setAttributes({ paddingSize: value })}
          />
        </PanelBody>
      </InspectorControls>
      <section {...blockProps}>
        <RichText
          tagName="h2"
          value={heading}
          onChange={(value) => setAttributes({ heading: value })}
          placeholder={__('Überschrift…', 'dbw-base')}
        />
      </section>
    </>
  );
}
```

5. **render.php erstellen** -- Server-seitiges Rendering:

```php
<?php
$heading      = $attributes['heading'] ?? '';
$padding_size = $attributes['paddingSize'] ?? 'm';

$classes = [ 'wp-block-dbw-base-mein-block' ];
$classes[] = 'is-padding-' . $padding_size;

$wrapper_attributes = get_block_wrapper_attributes( [
  'class' => implode( ' ', $classes ),
] );
?>

<section <?php echo $wrapper_attributes; ?>>
  <?php if ( $heading ) : ?>
    <h2><?php echo wp_kses_post( $heading ); ?></h2>
  <?php endif; ?>
</section>
```

6. **style.scss** erstellen:

```scss
@use '../tokens' as t;
@use '../spacing' as sp;

.wp-block-dbw-base-mein-block {
  @include sp.section-padding;
  // weitere Styles...
}
```

7. **Bauen:**

```bash
npm run blocks:build
```

Fertig. PHP registriert den Block automatisch via `inc/blocks.php`. Der Block erscheint im Editor unter der Kategorie "dbw base Blocks".

### Konventionen

- **Namespace:** `dbw-base/block-name` (in `block.json` -> `name`)
- **Kategorie:** `dbw-base` (eigene Kategorie im Block-Inserter)
- **CSS-Klasse:** `.wp-block-dbw-base-block-name` (generiert WordPress automatisch)
- **BEM-Elemente:** `.wp-block-dbw-base-block-name__element`
- **GP-Variablen nutzen:** Immer mit Fallback, z.B. `color: var(--wp--preset--color--primary, t.$primary)`
- **Textdomain:** `dbw-base` (für Übersetzungen mit `__()`)
- **HTML:** Semantische Tags (`<section>`, `<article>`) statt generischer `<div>`
- **Rendering:** `render.php` (dynamisch) für neue Blöcke, `save.js` nur für den Hero-Block (Legacy)

### Block-Dateien im Detail

| Datei         | Zweck                                  | Pflicht?               |
| ------------- | -------------------------------------- | ---------------------- |
| `block.json`  | Metadaten, Attribute, Supports         | Ja                     |
| `index.js`    | Registrierung, importiert alles andere | Ja                     |
| `edit.js`     | Was im Editor angezeigt wird           | Ja                     |
| `render.php`  | Serverseitiges Frontend-Rendering      | Ja (dynamische Blöcke) |
| `save.js`     | Statisches Frontend-Rendering          | Nur Hero (Legacy)      |
| `view.js`     | Frontend-JavaScript (z.B. Animationen) | Optional               |
| `style.scss`  | Styles für Frontend UND Editor         | Optional               |
| `editor.scss` | Styles NUR im Editor                   | Optional               |

### Auto-Discovery

Die PHP-Registrierung in `inc/blocks.php` scannt automatisch `blocks/build/*/block.json`. Du musst nirgends manuell einen Block registrieren. Neuer Ordner in `blocks/src/` + Build = Block verfügbar.

## Theme-Assets erweitern

### Neue SCSS Partials hinzufügen

1. Erstelle eine neue Datei in `src/scss/components/_mein-component.scss`
2. Importiere sie in `src/scss/main.scss`:

```scss
@use 'components/mein-component';
```

3. Nutze Variablen und Mixins:

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.mein-component {
  color: var(--wp--preset--color--primary, $color-primary);
  @include focus-visible;
}
```

### Neue JavaScript Komponenten hinzufügen

1. Erstelle eine neue Datei in `src/js/components/mein-modul.js`
2. Exportiere eine Funktion:

```javascript
export function initMeinModul() {
  // Deine Logik
}
```

3. Importiere und initialisiere in `src/js/main.js`:

```javascript
import { initMeinModul } from './components/mein-modul.js';

document.addEventListener('DOMContentLoaded', () => {
  initMeinModul();
});
```

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
2. PHP liest das Manifest in `inc/assets.php`
3. WordPress enqueued automatisch die korrekten Dateien
4. Browser-Caching funktioniert perfekt (Hash ändert sich bei Änderungen)

Gutenberg-Blöcke werden über `block.json` registriert. WordPress enqueued deren Assets automatisch, wenn der Block auf einer Seite verwendet wird. Blöcke mit `viewScript` (Stat-Counter, Accordion) laden ihr Frontend-JS nur auf Seiten, die den Block tatsächlich verwenden.

Fehlt ein Build-Verzeichnis (z.B. nach Git-Clone ohne Build), wird ein Fehler ins Debug-Log geschrieben, aber die Site bleibt funktional.

## Changelog

### 3.1.0

Vollständige Block-Bibliothek, zentrales Spacing-System und semantisches HTML.

- **11 neue Gutenberg-Blöcke**: Section, Card Grid (Parent/Child), Split-Content, USP Icon-List (Parent/Child), Stat-Counter, Accordion (Parent/Child), Logo-Grid, CTA-Banner
- **Dynamisches Rendering**: Alle neuen Blöcke nutzen `render.php` statt `save.js` -- unkaputtbar, keine Block-Recovery nötig
- **Zentrales Spacing-System**: 3 Presets (S/M/L) in `theme.json`, CSS Custom Properties, shared `_spacing.scss` Mixin, pro Block im Editor wählbar
- **Token-Pipeline erweitert**: `generate-tokens.js` generiert jetzt auch Spacing-Tokens aus `theme.json`
- **Semantisches HTML**: `<section>`, `<article>`, `<button>` statt generischer `<div>`-Container
- **Custom SVG-Upload**: USP-Punkte unterstützen eigene SVG-Icons via MediaUpload (Priorität vor vordefinierten Icons)
- **Parent/Child-Pattern**: Cards, USP-List und Accordion nutzen InnerBlocks mit strenger Typ-Beschränkung
- **Frontend-Interaktivität**: Stat-Counter (IntersectionObserver, Ease-Out-Animation) und Accordion (Toggle, ARIA) mit `view.js`
- **Barrierefreiheit**: ARIA-Attribute, `prefers-reduced-motion`, Keyboard-Support, semantische Landmarken
- **`_spacing.scss`**: Neues zentrales Mixin für konsistentes Section-Padding aller Blöcke

### 3.0.0

Gutenberg-Block-Entwicklung nativ im Theme. Design-Token-System.

- **Design-Token-Pipeline**: `theme.json` als Single Source of Truth, automatische Generierung von `_tokens.scss` via `scripts/generate-tokens.js`
- Eigenständiger Build-Prozess mit `@wordpress/scripts` (webpack) im `blocks/`-Verzeichnis
- Zweites npm-Projekt in `blocks/` -- koexistiert konfliktfrei mit dem Root-Vite-Setup
- PHP Auto-Discovery: `inc/blocks.php` registriert alle Blöcke automatisch via `glob()`
- Eigene Block-Kategorie "dbw base Blocks" im Inserter
- Hero-Block (`dbw-base/hero`): Vollwertiger Hero-Bereich mit Headline, Subtext, Dual-Buttons, Hintergrundbild mit Overlay, Scroll-Indikator, 3 Layout-Varianten, GP CSS-Variablen, responsive clamp()-Sizing und `prefers-reduced-motion`
- Convenience-Scripts im Root: `tokens`, `blocks:build`, `blocks:start`, `build:all`
- Automatische Token-Generierung als `prebuild`/`predev`-Hook
- SFTP-Watcher erweitert auf `blocks/build/`
- Versionierung auf 3.0.0 (style.css, functions.php, package.json)

### 2.x

Vite-basierter Build-Workflow und Theme-Infrastruktur.

- Vite als Build-Tool mit SCSS/JS-Pipeline und Manifest-basiertem Asset-Loading
- Modulare PHP-Architektur (`inc/assets.php`, `inc/svg-support.php`, `inc/login-customization.php`)
- Login-Seite Customization und Branding
- SVG-Upload-Support
- Security-Hardening (`inc/dbw/login-security.php`, `inc/dbw/html-comment.php`)
- Barrierefreiheit: Skip-Link, Focus-Visible, semantische Landmarken
- VS Code SFTP-Integration mit Auto-Upload
- ESLint, Prettier, EditorConfig
- PostCSS mit Autoprefixer

### 1.x

Grundgerüst als GeneratePress Child Theme.

- Basis-Setup mit `style.css` Theme-Header und `functions.php`
- GeneratePress als Parent Theme
- Grundlegende Theme-Supports (HTML5, Feed-Links)
- Text Domain und Übersetzungsbereitschaft

## dbw media

Weitere WordPress-Projekte und Themes:

- [dbw media Website](https://dbw-media.de)
- [Kontakt](https://dbw-media.de/kontakt)

---

**Made with care by [dbw media](https://dbw-media.de)**
