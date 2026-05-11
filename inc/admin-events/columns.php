<?php
/**
 * Admin-Spalten für den `event`-Posttype
 *
 * Zeigt in der Event-Liste (wp-admin/edit.php?post_type=event) zusätzlich
 * Start-Datum, Enddatum und Status. Sortiert standardmäßig nach Start-Datum
 * aufsteigend.
 *
 * Liest ACF-Felder: event_datum, event_datum_ende (beide JJJJMMTT/Ymd).
 *
 * @package dbw-base
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ── Spalten registrieren ─────────────────────────────────────────────────────

add_filter( 'manage_event_posts_columns', static function ( array $cols ): array {
	$new = [];
	foreach ( $cols as $key => $label ) {
		$new[ $key ] = $label;
		// Direkt nach dem Titel einfügen
		if ( 'title' === $key ) {
			$new['event_datum']      = __( 'Datum (Start)', 'dbw-base' );
			$new['event_datum_ende'] = __( 'Enddatum',      'dbw-base' );
			$new['event_status']     = __( 'Status',         'dbw-base' );
		}
	}
	return $new;
} );

// ── Werte pro Zeile ──────────────────────────────────────────────────────────

add_action( 'manage_event_posts_custom_column', static function ( string $column, int $post_id ): void {
	if ( ! function_exists( 'get_field' ) ) {
		return;
	}

	$start = (int) get_field( 'event_datum',      $post_id );
	$end   = (int) get_field( 'event_datum_ende', $post_id );

	switch ( $column ) {
		case 'event_datum':
			echo $start ? esc_html( dbw_admin_format_ymd( $start ) ) : '<span style="color:#aaa">—</span>';
			break;

		case 'event_datum_ende':
			echo $end ? esc_html( dbw_admin_format_ymd( $end ) ) : '<span style="color:#aaa">—</span>';
			break;

		case 'event_status':
			echo dbw_admin_event_status_badge( $start, $end );
			break;
	}
}, 10, 2 );

// ── Sortierbar machen ────────────────────────────────────────────────────────

add_filter( 'manage_edit-event_sortable_columns', static function ( array $cols ): array {
	$cols['event_datum']      = 'event_datum';
	$cols['event_datum_ende'] = 'event_datum_ende';
	return $cols;
} );

// ── Sortier-Query setzen (Default: Start-Datum aufsteigend) ──────────────────

add_action( 'pre_get_posts', static function ( WP_Query $query ): void {
	if ( ! is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( 'event' !== $query->get( 'post_type' ) ) {
		return;
	}

	$orderby = $query->get( 'orderby' );

	// Default oder explizit auf event_datum
	if ( ! $orderby || 'date' === $orderby || 'event_datum' === $orderby ) {
		$query->set( 'meta_key', 'event_datum' );
		$query->set( 'orderby',  'meta_value_num' );
		if ( ! $orderby || 'date' === $orderby ) {
			$query->set( 'order', 'ASC' );
		}
		return;
	}

	if ( 'event_datum_ende' === $orderby ) {
		$query->set( 'meta_key', 'event_datum_ende' );
		$query->set( 'orderby',  'meta_value_num' );
	}
} );

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formatiert ein Ymd-Integer (z. B. 20260514) zu "14.05.2026".
 */
function dbw_admin_format_ymd( int $ymd ): string {
	if ( $ymd < 19700101 ) {
		return '—';
	}
	$obj = DateTime::createFromFormat( 'Ymd', (string) $ymd );
	return $obj ? $obj->format( 'd.m.Y' ) : '—';
}

/**
 * Gibt eine farbige Status-Pille zurück: Bevorstehend / Läuft / Vorbei.
 */
function dbw_admin_event_status_badge( int $start, int $end ): string {
	if ( ! $start ) {
		return '<span style="color:#aaa">—</span>';
	}

	$today         = (int) date( 'Ymd' );
	$effective_end = $end > 0 ? $end : $start;

	$base_style = 'display:inline-block;padding:2px 9px;border-radius:11px;font-size:11px;font-weight:600;line-height:1.6';

	if ( $effective_end < $today ) {
		return '<span style="' . $base_style . ';background:#fde2e2;color:#a02525">' . esc_html__( 'Vorbei', 'dbw-base' ) . '</span>';
	}
	if ( $start <= $today && $effective_end >= $today ) {
		return '<span style="' . $base_style . ';background:#dcf3e2;color:#1e7a3a">' . esc_html__( 'Läuft', 'dbw-base' ) . '</span>';
	}
	return '<span style="' . $base_style . ';background:#e5e9f5;color:#2c4a8a">' . esc_html__( 'Bevorstehend', 'dbw-base' ) . '</span>';
}
