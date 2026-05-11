<?php
/**
 * Branding: Copyright-Filter
 *
 * Ersetzt den GeneratePress-Standard-Copyright-Text durch die dbw-Variante.
 *
 * @package dbw-base
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_filter( 'generate_copyright', function ( $copyright ) {
    return sprintf(
        '%1$s %2$s &bull; Gemacht mit &hearts; von <a href="https://dbw-media.de" target="_blank">dbw media</a>',
        date( 'Y' ),
        get_bloginfo( 'name' )
    );
} );
