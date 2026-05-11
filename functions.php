<?php
/**
 * dbw base Theme Functions
 *
 * @package dbw-base
 * @author  dbw media
 * @link    https://dbw-media.de
 */

if (!defined('ABSPATH')) {
    exit;
}

define('DBW_THEME_VERSION', '3.1.0');
define('DBW_THEME_DIR', get_stylesheet_directory());
define('DBW_THEME_URI', get_stylesheet_directory_uri());

require_once DBW_THEME_DIR . '/inc/assets.php';
require_once DBW_THEME_DIR . '/inc/svg-support.php';
require_once DBW_THEME_DIR . '/inc/login-customization.php';
require_once DBW_THEME_DIR . '/inc/blocks.php';
require_once DBW_THEME_DIR . '/inc/dbw/html-comment.php';
require_once DBW_THEME_DIR . '/inc/dbw/login-security.php';
require_once DBW_THEME_DIR . '/inc/gp-settings.php';
require_once DBW_THEME_DIR . '/inc/dbw/dashboard-widget.php';

/**
 * Theme Setup
 */
function dbw_theme_setup() {
    load_child_theme_textdomain('dbw-base', DBW_THEME_DIR . '/languages');

    add_theme_support('automatic-feed-links');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);
}
add_action('after_setup_theme', 'dbw_theme_setup');

/**
 * Enqueue Assets
 */
function dbw_enqueue_assets() {
    dbw_enqueue_vite_assets();
}
add_action('wp_enqueue_scripts', 'dbw_enqueue_assets', 20);

/**
 * Add Skip Link for Accessibility
 */
function dbw_skip_link() {
    echo '<a class="skip-link screen-reader-text" href="#main">' . esc_html__('Skip to content', 'dbw-base') . '</a>';
}
add_action('generate_before_header', 'dbw_skip_link', 5);

/**
 * Add Main Landmark
 */
function dbw_main_open() {
    echo '<main id="main" class="site-main" role="main">';
}
add_action('generate_before_main_content', 'dbw_main_open', 5);

function dbw_main_close() {
    echo '</main>';
}
add_action('generate_after_main_content', 'dbw_main_close', 15);
