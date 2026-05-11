<?php
/**
 * dbw base Theme Functions
 *
 * Einstiegspunkt des Child-Themes. Hält den Core-Loader und das automatische
 * Laden aller projektspezifischen Module in inc/.
 *
 * ARCHITEKTUR
 * ───────────
 * core/inc/loader.php   → lädt alle Framework-Funktionen (Assets, Blöcke,
 *                          Login-Security, GP-Settings, …). NICHT DIREKT EDITIEREN.
 *
 * inc/<modul>/          → projektspezifischer PHP-Code. Neue Module werden hier
 *                          als eigener Ordner angelegt. Alle *.php darin (außer
 *                          single-*.php Template-Dateien) werden automatisch
 *                          geladen.
 *
 * @package dbw-base
 * @author  dbw media
 * @link    https://dbw-media.de
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'DBW_THEME_VERSION', '3.3.0' );
define( 'DBW_THEME_DIR', get_stylesheet_directory() );
define( 'DBW_THEME_URI', get_stylesheet_directory_uri() );

// ── Projektname (wird als Kategorie-Label im Block-Inserter verwendet) ────────
define( 'DBW_CLIENT_NAME', 'dbw-base' );

// ── 1. Core-Framework laden ───────────────────────────────────────────────────
require_once DBW_THEME_DIR . '/core/inc/loader.php';

// ── 2. Projektmodule laden ────────────────────────────────────────────────────
// Jeder Unterordner in inc/ ist ein eigenständiges Modul.
// Konventionen:
//   • Ordner mit führendem _ (z.B. inc/_custom-module-example/) gelten als
//     deaktiviert und werden nicht geladen → Vorlagen ohne Side-Effects.
//   • single-*.php sind Template-Dateien → werden via template_include
//     unten geroutet, nicht per glob geladen.
foreach ( glob( DBW_THEME_DIR . '/inc/*/*.php' ) as $file ) {
    if ( str_starts_with( basename( dirname( $file ) ), '_' ) ) continue;
    if ( str_starts_with( basename( $file ), 'single-' ) ) continue;
    require_once $file;
}

// ── 3. Template-Routing für Custom Post Types ─────────────────────────────────
// Für jedes CPT-Modul eine add_filter-Zeile einkommentieren und anpassen.
//
// add_filter( 'template_include', static function ( $template ) {
//     if ( is_singular( 'example' ) ) {
//         return DBW_THEME_DIR . '/inc/custom-module-example/single-example.php';
//     }
//     return $template;
// } );

// ── 4. Theme Setup ────────────────────────────────────────────────────────────
function dbw_theme_setup(): void {
    load_child_theme_textdomain( 'dbw-base', DBW_THEME_DIR . '/languages' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'html5', [
        'search-form', 'comment-form', 'comment-list',
        'gallery', 'caption', 'style', 'script',
    ] );
}
add_action( 'after_setup_theme', 'dbw_theme_setup' );

// ── 5. Assets ─────────────────────────────────────────────────────────────────
function dbw_enqueue_assets(): void {
    dbw_enqueue_vite_assets();
}
add_action( 'wp_enqueue_scripts', 'dbw_enqueue_assets', 20 );

// ── 6. Accessibility Landmarks ────────────────────────────────────────────────
function dbw_skip_link(): void {
    echo '<a class="skip-link screen-reader-text" href="#main">'
        . esc_html__( 'Skip to content', 'dbw-base' )
        . '</a>';
}
add_action( 'generate_before_header', 'dbw_skip_link', 5 );

function dbw_main_open(): void {
    echo '<main id="main" class="site-main" role="main">';
}
add_action( 'generate_before_main_content', 'dbw_main_open', 5 );

function dbw_main_close(): void {
    echo '</main>';
}
add_action( 'generate_after_main_content', 'dbw_main_close', 15 );
