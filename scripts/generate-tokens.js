/**
 * Generate SCSS tokens from theme.json
 *
 * Reads the color palette and spacing presets from theme.json and writes:
 * 1. src/scss/abstracts/_tokens.scss  (Theme-Assets via Vite)
 * 2. blocks/src/_tokens.scss          (Block-Assets via wp-scripts)
 *
 * Both files contain the same values so that
 * theme.json remains the single source of truth.
 *
 * Usage: node scripts/generate-tokens.js
 *
 * @package dbw-base
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const themeJson = JSON.parse(
  readFileSync(resolve(root, 'theme.json'), 'utf8')
);

const colors = themeJson.settings?.color?.palette || [];
const spacingSizes = themeJson.settings?.spacing?.spacingSizes || [];

// --- 1. Theme tokens (src/scss/abstracts/_tokens.scss) ---

const themeLines = [
  '// Auto-generated from theme.json – DO NOT EDIT MANUALLY',
  '// Run: npm run tokens',
  '',
  '// Colors',
];

for (const { slug, color } of colors) {
  themeLines.push(`$color-${slug}: ${color};`);
}

if (spacingSizes.length) {
  themeLines.push('');
  themeLines.push('// Spacing');
  for (const { slug, size } of spacingSizes) {
    themeLines.push(`$spacing-${slug}: ${size};`);
  }
}

themeLines.push('');

const themeTarget = resolve(root, 'src/scss/abstracts/_tokens.scss');
writeFileSync(themeTarget, themeLines.join('\n'));

// --- 2. Block tokens (blocks/src/_tokens.scss) ---

const blockLines = [
  '// Auto-generated from theme.json – DO NOT EDIT MANUALLY',
  '// Run: npm run tokens (from project root)',
  '//',
  '// Use in block SCSS:',
  '//   @use "../tokens" as t;',
  '//   color: var(--wp--preset--color--primary, t.$primary);',
  '//   padding-block: var(--wp--preset--spacing--m, t.$spacing-m);',
  '',
  '// Colors',
];

for (const { slug, color } of colors) {
  blockLines.push(`$${slug}: ${color};`);
}

if (spacingSizes.length) {
  blockLines.push('');
  blockLines.push('// Spacing');
  for (const { slug, size } of spacingSizes) {
    blockLines.push(`$spacing-${slug}: ${size};`);
  }
}

blockLines.push('');

const blockDir = resolve(root, 'blocks/src');
mkdirSync(blockDir, { recursive: true });
writeFileSync(resolve(blockDir, '_tokens.scss'), blockLines.join('\n'));

console.log(`Tokens generated (${colors.length} colors, ${spacingSizes.length} spacing sizes from theme.json)`);
