<?php
/**
 * Custom Login Security
 * Versteckt Standard WordPress Login und erstellt /zentrale URL
 *
 * @package dbw-base
 * @author  dbw media
 * @link    https://dbw-media.de
 *
 * WICHTIG: Dies ist "Security durch Obscurity" - sollte mit zusätzlichen
 * Maßnahmen kombiniert werden: 2FA, Login Attempts Limiting, Captcha
 */

if (!defined('ABSPATH')) {
    exit;
}

class DBW_Custom_Login_Security {

    private static $instance = null;

    /**
     * Singleton Pattern
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        add_action('init', array($this, 'setup_custom_login'), 1);
        add_action('wp_loaded', array($this, 'flush_login_rules'));
        add_filter('login_url', array($this, 'custom_login_url'), 10, 3);
        add_filter('lostpassword_url', array($this, 'custom_lostpassword_url'), 10, 2);
        add_filter('register_url', array($this, 'custom_register_url'));
        add_action('wp_logout', array($this, 'custom_logout_redirect'));
        add_action('init', array($this, 'setup_email_filters'));
        add_filter('site_url', array($this, 'fix_password_reset_url'), 10, 4);
        add_filter('wp_redirect', array($this, 'fix_wp_login_redirects'), 10, 1);
    }

    /**
     * Setup custom login functionality
     */
    public function setup_custom_login() {
        // Verhindere direkte Zugriffe auf wp-login.php
        global $pagenow;

        if ($pagenow === 'wp-login.php' && !is_user_logged_in()) {
            // Erlaubte Aktionen für wp-login.php
            $allowed_actions = array('logout', 'lostpassword', 'rp', 'resetpass', 'register', 'postpass', 'confirmaction', 'checkemail');
            $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'login';

            // Spezielle Behandlung für checkemail Parameter (nach Password Reset Request)
            if (isset($_GET['checkemail'])) {
                $action = 'checkemail';
            }

            // Spezielle Behandlung für Reset-Password-Key
            $has_reset_key = isset($_GET['key']) || isset($_GET['rp_key']);

            // Prüfe ob zentrale_access gesetzt ist
            $has_zentrale_access = isset($_GET['zentrale_access']) || isset($_POST['zentrale_access']);

            // Erlaube POST-Requests für bestimmte Aktionen
            $is_allowed_post = !empty($_POST) && in_array($action, array('lostpassword', 'resetpass', 'register'));

            // Blockiere unerlaubte Zugriffe
            if (!$has_zentrale_access && !in_array($action, $allowed_actions) && !$has_reset_key && !$is_allowed_post) {
                if ($action === 'login' && empty($_POST)) {
                    wp_safe_redirect(home_url('/404'));
                    exit;
                }
            }
        }

        // Erstelle /zentrale Rewrite Rule
        add_rewrite_rule('^zentrale/?$', 'wp-login.php?zentrale_access=1', 'top');

        // Blockiere wp-admin für nicht-eingeloggte User
        if (is_admin() && !is_user_logged_in() && !wp_doing_ajax() && !isset($_GET['action'])) {
            $allowed_admin_paths = array('admin-ajax.php', 'admin-post.php');
            $current_script = basename($_SERVER['SCRIPT_NAME']);

            if (!in_array($current_script, $allowed_admin_paths)) {
                wp_safe_redirect(home_url('/404'));
                exit;
            }
        }
    }

    /**
     * Flush rewrite rules einmalig nach Theme-Aktivierung
     */
    public function flush_login_rules() {
        if (get_option('dbw_custom_login_rules_flushed') !== '1') {
            flush_rewrite_rules();
            update_option('dbw_custom_login_rules_flushed', '1');
        }
    }

    /**
     * Ändere Login-URL zu /zentrale
     */
    public function custom_login_url($login_url, $redirect, $force_reauth) {
        $custom_url = home_url('/zentrale/');

        if (!empty($redirect)) {
            $custom_url = add_query_arg('redirect_to', urlencode($redirect), $custom_url);
        }

        if ($force_reauth) {
            $custom_url = add_query_arg('reauth', '1', $custom_url);
        }

        return $custom_url;
    }

    /**
     * Ändere Passwort-Vergessen-URL
     */
    public function custom_lostpassword_url($lostpassword_url, $redirect) {
        $custom_url = add_query_arg(array(
            'action' => 'lostpassword',
            'zentrale_access' => '1'
        ), site_url('wp-login.php'));

        if (!empty($redirect)) {
            $custom_url = add_query_arg('redirect_to', urlencode($redirect), $custom_url);
        }

        return $custom_url;
    }

    /**
     * Ändere Registrierungs-URL
     */
    public function custom_register_url($register_url) {
        return add_query_arg(array(
            'action' => 'register',
            'zentrale_access' => '1'
        ), site_url('wp-login.php'));
    }

    /**
     * Logout Redirect zu /zentrale
     */
    public function custom_logout_redirect() {
        wp_safe_redirect(home_url('/zentrale/?loggedout=true'));
        exit;
    }

    /**
     * Filter für die Password-Reset-E-Mail
     */
    public function setup_email_filters() {
        add_filter('retrieve_password_title', array($this, 'custom_password_reset_title'), 10, 3);
    }

    /**
     * Custom Password Reset E-Mail Titel
     */
    public function custom_password_reset_title($title, $user_login, $user_data) {
        $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
        return sprintf('[%s] Passwort zurücksetzen', $blogname);
    }

    /**
     * Fix Password Reset URLs in allen Kontexten
     */
    public function fix_password_reset_url($url, $path, $scheme, $blog_id) {
        if (strpos($url, 'wp-login.php?action=rp') !== false && strpos($url, 'zentrale_access') === false) {
            $url = add_query_arg('zentrale_access', '1', $url);
        }
        return $url;
    }

    /**
     * Fix alle wp-login.php Redirects
     * Fügt automatisch zentrale_access Parameter hinzu
     */
    public function fix_wp_login_redirects($location) {
        // Prüfe ob es ein Redirect zu wp-login.php ist
        if (strpos($location, 'wp-login.php') !== false) {
            // Prüfe ob zentrale_access noch nicht gesetzt ist
            if (strpos($location, 'zentrale_access') === false) {
                // Füge zentrale_access Parameter hinzu
                $location = add_query_arg('zentrale_access', '1', $location);
            }
        }
        return $location;
    }

    /**
     * Reset Rules bei Theme-Switch
     */
    public static function reset_login_rules() {
        delete_option('dbw_custom_login_rules_flushed');
        flush_rewrite_rules();
    }
}

// Initialisiere die Klasse mit Singleton Pattern
DBW_Custom_Login_Security::get_instance();

// Hook für Theme-Aktivierung und Deaktivierung
add_action('after_switch_theme', array('DBW_Custom_Login_Security', 'reset_login_rules'));
add_action('switch_theme', array('DBW_Custom_Login_Security', 'reset_login_rules'));
