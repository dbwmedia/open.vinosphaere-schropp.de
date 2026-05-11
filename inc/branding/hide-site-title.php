<?php
/**
 * Branding: Site-Title + Tagline ausblenden
 *
 * CSS-Sicherheitsnetz, falls Customizer-Entwürfe blockiert sind und
 * .main-title / .site-description sonst doch im Header auftauchen würden.
 *
 * @package dbw-base
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'wp_head', function () {
    echo '<style>.main-title, .site-description { display: none !important; }</style>';
}, 100 );
