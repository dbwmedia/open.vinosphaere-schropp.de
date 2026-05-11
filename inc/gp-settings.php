<?php
/**
 * GeneratePress Premium Master Config & dbw-base Auto-Setup
 * * Fokus: Vollautomatisierung, Titel-Hiding und Datenbank-Enforcement.
 * @package dbw-base
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * 1. LAYOUT: SIDEBARS & WIDGETS
 */
add_filter( 'generate_sidebar_layout', function( $layout ) { return 'no-sidebar'; } );
add_filter( 'generate_footer_widgets', function( $widgets ) { return '0'; } );

/**
 * 2. CONTENT CONTAINER: FULL WIDTH
 * Entfernt GPs max-width vom Content-Bereich.
 * WordPress theme.json (contentSize/wideSize) uebernimmt die Breitensteuerung.
 */
add_filter( 'body_class', function( $classes ) {
    $classes[] = 'full-width-content';
    return $classes;
} );

/**
 * 3. GP OPTION DEFAULTS
 * Wir setzen die Priorität auf 999, um GP-eigene Defaults sicher zu überstimmen.
 */
add_filter( 'generate_option_defaults', function( $defaults ) {
    $defaults['container_width'] = '1200';
    $defaults['nav_layout_setting'] = 'fluid-grid';
    $defaults['header_layout_setting'] = 'fluid-grid';
    $defaults['nav_position_setting'] = 'nav-float-right';
    $defaults['content_padding_top'] = '0';
    $defaults['content_padding_bottom'] = '0';
    $defaults['smooth_scroll'] = true;
    $defaults['dynamic_css_cache'] = false;
    
    // Default-Werte für die Checkboxen
    $defaults['hide_site_title'] = true;
    $defaults['hide_site_tagline'] = true;
    $defaults['global_colors'] = array(); 
    
    return $defaults;
}, 999 );

/**
 * 4. CONTENT: H1 TITEL (Inhalt) DEAKTIVIEREN
 */
add_filter( 'generate_show_title', function( $show ) {
    return is_page() ? false : $show;
} );

/**
 * 5. DESIGN: FARB-PALETTE
 */
add_filter( 'generate_default_color_palettes', function() {
    return ['#526983', '#f9f8f6', '#333333', '#ffffff'];
} );

/**
 * 6. MODERN CLEANUP
 */
add_action( 'init', function() {
    remove_action( 'generate_before_content', 'generate_featured_page_header_inside_single' );
    remove_action( 'generate_after_entry_header', 'generate_post_image' );
    add_theme_support( 'generate-smooth-scroll' );
} );

/**
 * 7. BRANDING: COPYRIGHT
 */
add_filter( 'generate_copyright', function( $copyright ) {
    return sprintf('%1$s %2$s • Gemacht mit ❤️ von <a href="https://dbw-media.de" target="_blank">dbw media</a>', date('Y'), get_bloginfo('name'));
} );

/**
 * 8. DATABASE ENFORCEMENT & AUTO-SETUP
 * Diese Sektion erzwingt die Einstellungen aktiv im Admin-Bereich.
 */
add_action( 'admin_init', function() {
    $settings = get_option( 'generate_settings', array() );
    
    // Falls die Checkboxen in der DB nicht auf "true" stehen, korrigieren wir das hier
    if ( ! isset( $settings['hide_site_title'] ) || ! $settings['hide_site_title'] || ! $settings['hide_site_tagline'] ) {
        $settings['hide_site_title'] = true;
        $settings['hide_site_tagline'] = true;
        update_option( 'generate_settings', $settings );
    }
} );

// Zusätzlicher Hook für Theme-Aktivierung (Inhalte & Permalinks)
add_action( 'after_switch_theme', function() {
    // Standard-Inhalte löschen
    $sample_page = get_page_by_path('sample-page');
    if ( $sample_page ) wp_delete_post( $sample_page->ID, true );

    $hello_world = get_posts( array('title' => 'Hallo Welt!', 'post_type' => 'post', 'numberposts' => 1) );
    if ( $hello_world ) wp_delete_post( $hello_world[0]->ID, true );

    // Startseite setzen
    $slug = 'startseite';
    $page = get_page_by_path( $slug );
    $page_id = $page ? $page->ID : wp_insert_post(['post_title' => 'Startseite', 'post_status' => 'publish', 'post_type' => 'page', 'post_name' => $slug]);

    update_option( 'show_on_front', 'page' );
    update_option( 'page_on_front', $page_id );
    update_option( 'permalink_structure', '/%postname%/' );
    flush_rewrite_rules();
} );

/**
 * 9. CUSTOMIZER UI CLEANUP
 */
add_action( 'customize_register', function( $wp_customize ) {
    // Entfernt die Sektion Globale Farben (da theme.json genutzt wird)
    $wp_customize->remove_section( 'generate_global_colors_section' );
}, 1000 );

/**
 * 10. CSS SAFETY NET (Das ultimative Sicherheitsnetz)
 * Falls PHP durch Customizer-Entwürfe blockiert wird, regelt CSS das Frontend.
 */
add_action( 'wp_head', function() {
    echo '<style>.main-title, .site-description { display: none !important; }</style>';
}, 100 );