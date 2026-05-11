import { defineConfig, mergeConfig } from 'vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCoreConfig } from './core/scripts/vite-config.js';

const themeRoot = dirname( fileURLToPath( import.meta.url ) );

/**
 * Standard-Vite-Konfig kommt vom Core (createCoreConfig). Updates daran
 * fließen über npm run core:update zu allen Kunden-Themes.
 *
 * Projekt-spezifische Overrides werden via mergeConfig drübergelegt.
 */
export default defineConfig( ( env ) => mergeConfig(
	createCoreConfig( { themeRoot, env } ),
	{
		// Hier projekt-spezifische Vite-Overrides ergänzen, z.B.:
		// resolve: { alias: { '@my-lib': resolve(themeRoot, 'src/lib') } },
		// plugins: [ /* zusätzliche Plugins */ ],
	}
) );
