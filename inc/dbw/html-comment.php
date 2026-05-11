<?php
/**
 * DBW Media HTML Comment
 * Fügt einen benutzerdefinierten HTML-Kommentar mit Copyright-Informationen hinzu
 *
 * @package dbw-base
 * @author  dbw media
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * wp_head Version (AKTIV) - Performance-optimiert
 *
 * Fügt den Kommentar am Anfang des <head> ein (Priorität 0)
 * Deutlich performanter als Output Buffering, da kein kompletter HTML-Output
 * im Speicher gehalten und mit Regex durchsucht werden muss.
 */
function dbw_insert_html_comment() {
    $start_year = 2024;
    $current_year = date('Y');

    $year_display = ($current_year == $start_year)
        ? $start_year
        : "{$start_year} - {$current_year}";

    $custom_html_comment = <<<EOD

<!--
#####################################################
#                                                   #
#     made with ♥ in {$year_display} by dbw media       #
#     say hello: hallo@dbw-media.de                 #
#     or visit: https://dbw-media.de                #
#                                                   #
#####################################################
-->

EOD;

    echo $custom_html_comment;
}
add_action('wp_head', 'dbw_insert_html_comment', 0);


/**
 * ALTERNATIVE: Output Buffering Version
 *
 * Falls du den Kommentar wirklich zwischen <html> und <head> haben willst.
 * Nachteil: Höherer Ressourcenverbrauch.
 */

/*
function dbw_buffer_start() {
    ob_start('dbw_insert_custom_comment_buffer');
}

function dbw_buffer_end() {
    if (ob_get_level() > 0) {
        ob_end_flush();
    }
}

function dbw_insert_custom_comment_buffer($buffer) {
    $start_year = 2024;
    $current_year = date('Y');

    $year_display = ($current_year == $start_year)
        ? $start_year
        : "{$start_year} - {$current_year}";

    $custom_html_comment = <<<EOD
<!--
#####################################################
#                                                   #
#     made with ♥ in {$year_display} by dbw media       #
#     say hello: hallo@dbw-media.de                 #
#     or visit: https://dbw-media.de                #
#                                                   #
#####################################################
-->
EOD;

    $buffer = preg_replace("/(<head.*>)/", $custom_html_comment . '$1', $buffer, 1);
    return $buffer;
}

add_action('after_setup_theme', 'dbw_buffer_start');
add_action('shutdown', 'dbw_buffer_end');
*/
