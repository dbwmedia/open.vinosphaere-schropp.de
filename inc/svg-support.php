<?php
/**
 * SVG Upload Support
 *
 * @package dbw-base
 * @author  dbw media
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * SVG-Upload erlauben
 */
function dbw_allow_svg_upload($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'dbw_allow_svg_upload');

/**
 * SVG-Vorschau im Media-Manager
 */
function dbw_fix_svg_display() {
    echo '<style>
        .attachment-266x266, .thumbnail img {
            width: 100% !important;
            height: auto !important;
        }
    </style>';
}
add_action('admin_head', 'dbw_fix_svg_display');
