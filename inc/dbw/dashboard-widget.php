<?php
/**
 * dbw media Premium Support & Clean Dashboard
 * * Fokus auf persönlichen Service, Status-Monitoring und Clean UI.
 * * Kontaktdaten sind zentral als Variablen definiert.
 * * @package dbw-base
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * 1. DASHBOARD AUFRÄUMEN & WIDGET REGISTRIEREN
 */
add_action('wp_dashboard_setup', function() {
    if ( ! current_user_can('manage_options') ) return;

    global $wp_meta_boxes;
    $wp_meta_boxes['dashboard']['normal']['core'] = array();
    $wp_meta_boxes['dashboard']['side']['core'] = array();
    
    wp_add_dashboard_widget(
        'dbw_premium_support', 
        '🚀 dbw Premium Support & System-Status', 
        'dbw_dashboard_widget_content'
    );

    $dashboard = $wp_meta_boxes['dashboard']['normal']['core'];
    $my_widget = array('dbw_premium_support' => $dashboard['dbw_premium_support']);
    unset($dashboard['dbw_premium_support']);
    $wp_meta_boxes['dashboard']['normal']['core'] = array_merge($my_widget, $dashboard);
});

/**
 * 2. WIDGET CONTENT
 */
function dbw_dashboard_widget_content() {
    
    // --- KONTAKTDATEN & LINKS (HIER ÄNDERN) ---
    $contact = [
        'name'          => 'Dennis Buchwald',
        'role'          => 'Dein persönlicher Experte',
        'support_url'   => 'https://dbw-media.de/support',
        'email'         => 'dennis@dbw-media.com',
        'phone'         => '+4971323696900',
        'phone_display' => 'Anruf', // Text auf dem Button
        'whatsapp_url'  => 'https://wa.me/message/PGOWVF66QI6VC1',
        'website_url'   => 'https://dbw-media.de',
        'agency_name'   => 'dbw media'
    ];
    // ------------------------------------------

    // Update-Daten abrufen
    $update_data = wp_get_update_data();
    $plugin_updates = $update_data['counts']['plugins'] ?? 0;
    $core_updates   = $update_data['counts']['core']    ?? 0;
    $total_updates  = $update_data['counts']['total']   ?? 0;

    $needs_action = $total_updates > 0;
    $status_color = $needs_action ? '#f1c40f' : '#2ecc71';
    $status_text  = $needs_action ? 'Wartung empfohlen' : 'SYSTEM AKTIV';

    $logo_url = get_stylesheet_directory_uri() . '/img/dbw_media.svg';
    $theme_version = wp_get_theme()->get('Version');
    ?>
    <div class="dbw-widget-container">
        <div class="dbw-widget-header">
            <img src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($contact['agency_name']); ?>">
            <div class="dbw-status-indicator" style="color: <?php echo $status_color; ?>;">
                <span class="dbw-dot" style="background: <?php echo $status_color; ?>; box-shadow: 0 0 8px <?php echo $status_color; ?>80;"></span> 
                <?php echo esc_html($status_text); ?>
            </div>
        </div>
        
        <div class="dbw-widget-body">
            <div class="dbw-contact-person">
                <div class="dbw-contact-info">
                    <h3><?php echo esc_html($contact['name']); ?></h3>
                    <span class="dbw-role"><?php echo esc_html($contact['role']); ?></span>
                </div>
            </div>

            <p class="dbw-intro-text">
                Hast du <strong>Fragen</strong>, benötigst du <strong>Änderungswünsche</strong> oder planst du eine <strong>neue Funktion</strong>? Wir unterstützen dich proaktiv bei der Weiterentwicklung deiner Website.
            </p>

            <div class="dbw-status-bar">
                <div class="dbw-status-item">
                    <span class="label">WP Core</span>
                    <span class="value <?php echo $core_updates > 0 ? 'has-update' : ''; ?>">
                        <?php echo $core_updates > 0 ? 'Update!' : get_bloginfo('version'); ?>
                    </span>
                </div>
                <div class="dbw-status-item">
                    <span class="label">Updates</span>
                    <span class="value <?php echo $needs_action ? 'has-update' : ''; ?>">
                        <?php echo $needs_action ? $total_updates . ' offen' : 'Aktuell'; ?>
                    </span>
                </div>
                <div class="dbw-status-item">
                    <span class="label">PHP / Theme</span>
                    <span class="value"><?php echo phpversion(); ?> / v<?php echo esc_html($theme_version); ?></span>
                </div>
            </div>

            <a href="<?php echo esc_url($contact['support_url']); ?>" class="dbw-main-btn" target="_blank">
                <?php echo $needs_action ? '📅 Wartung & Änderungen anfragen' : '🚀 Hilfe & Wünsche senden'; ?>
            </a>
        </div>

        <div class="dbw-widget-footer">
            <div class="dbw-grid-buttons">
                <a href="mailto:<?php echo esc_attr($contact['email']); ?>" title="E-Mail senden">E-Mail</a>
                <a href="tel:<?php echo esc_attr($contact['phone']); ?>" title="Anrufen"><?php echo esc_html($contact['phone_display']); ?></a>
                <a href="<?php echo esc_url($contact['whatsapp_url']); ?>" target="_blank" title="WhatsApp Chat">WhatsApp</a>
            </div>
        </div>
    </div>

    <style>
        #dbw_premium_support { border-left: 4px solid #526983; border-radius: 4px; }
        #dbw_premium_support .inside { margin-top: 0; padding-top: 0; }
        .dbw-widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-top: 10px; }
        .dbw-widget-header img { max-width: 90px; height: auto; }
        .dbw-status-indicator { font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
        .dbw-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; animation: dbwPulse 2s infinite; }
        @keyframes dbwPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .dbw-contact-info h3 { font-size: 18px; margin: 0 !important; font-weight: 700; color: #23282d; }
        .dbw-role { font-size: 12px; color: #526983; font-weight: 600; }
        .dbw-intro-text { font-size: 13px; line-height: 1.6; color: #555; margin: 15px 0 20px 0; }
        .dbw-status-bar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; background: #f9f8f6; padding: 15px 10px; border-radius: 8px; margin-bottom: 25px; text-align: center; }
        .dbw-status-item:not(:last-child) { border-right: 1px solid #e0deda; }
        .dbw-status-item .label { display: block; font-size: 9px; text-transform: uppercase; color: #999; font-weight: 700; margin-bottom: 4px; }
        .dbw-status-item .value { font-size: 11px; font-weight: 700; color: #526983; }
        .dbw-status-item .value.has-update { color: #d35400; }
        .dbw-main-btn { display: block; text-align: center; background: #526983; color: #fff !important; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 700; transition: all 0.2s ease; box-shadow: 0 4px 0 #3d4f63; }
        .dbw-main-btn:hover { background: #3d4f63; transform: translateY(1px); box-shadow: 0 2px 0 #3d4f63; }
        .dbw-grid-buttons { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 20px; }
        .dbw-grid-buttons a { text-align: center; background: #fff; border: 1px solid #ddd; padding: 8px; border-radius: 6px; font-size: 11px; text-decoration: none; color: #666; font-weight: 600; }
        .dbw-grid-buttons a:hover { border-color: #526983; color: #526983; background: #f9fbfd; }
    </style>
    <?php
}