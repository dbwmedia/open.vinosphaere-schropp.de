<?php
/**
 * WordPress Login Screen Customization
 *
 * @package dbw-base
 * @author  dbw media
 * @link    https://dbw-media.de
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Customize WordPress Login Screen Logo
 */
function dbw_custom_login_logo() {
    ?>
    <style type="text/css">
        #login h1 a, .login h1 a {
            background-image: url('<?php echo DBW_THEME_URI; ?>/img/dbw_media.svg');
            background-size: contain;
            background-position: center;
            width: 100%;
            max-width: 400px;
            height: 120px;
            margin-bottom: 0;
        }
        .login #login form {    
            border: 0;
            box-shadow: none;
            border-radius: 1rem;
            margin-top: 0;
        }
    </style>
    <?php
}
add_action('login_enqueue_scripts', 'dbw_custom_login_logo');

/**
 * Change Login Logo URL
 */
function dbw_custom_login_logo_url() {
    return 'https://dbw-media.de';
}
add_filter('login_headerurl', 'dbw_custom_login_logo_url');

/**
 * Change Login Logo Title
 */
function dbw_custom_login_logo_title() {
    return 'dbw media - Webentwicklung & Design';
}
add_filter('login_headertext', 'dbw_custom_login_logo_title');
