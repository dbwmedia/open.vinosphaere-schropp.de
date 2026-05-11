<?php
/**
 * Vinosphäre Events Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$padding_size = $attributes['paddingSize'] ?? 'm';
$days_ahead   = $attributes['daysAhead'] ?? 28;
$columns      = $attributes['columns'] ?? 1;
$show_image   = $attributes['showImage'] ?? true;
$show_info    = $attributes['showInfo'] ?? true;
$show_time    = $attributes['showTime'] ?? true;
$heading      = $attributes['heading'] ?? '';
$intro_text   = $attributes['introText'] ?? '';

$today      = date( 'Ymd' );
$end_date   = date( 'Ymd', strtotime( "+{$days_ahead} days" ) );

$args = [
	'post_type'      => 'event',
	'posts_per_page' => -1,
	'meta_key'       => 'event_datum',
	'orderby'        => 'meta_value_num',
	'order'          => 'ASC',
	'meta_query'     => [
		[
			'key'     => 'event_datum',
			'value'   => [ $today, $end_date ],
			'compare' => 'BETWEEN',
			'type'    => 'NUMERIC',
		],
	],
];

$events = new WP_Query( $args );

if ( ! $events->have_posts() ) {
	wp_reset_postdata();
	return '';
}

$classes = [
	'wp-block-dbw-base-events',
	"is-padding-{$padding_size}",
	"has-{$columns}-columns",
];

$_anchor            = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => implode( ' ', $classes ) ] + $_anchor );

$months_de = [
	'01' => 'Januar',
	'02' => 'Februar',
	'03' => 'März',
	'04' => 'April',
	'05' => 'Mai',
	'06' => 'Juni',
	'07' => 'Juli',
	'08' => 'August',
	'09' => 'September',
	'10' => 'Oktober',
	'11' => 'November',
	'12' => 'Dezember',
];
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ( ( $heading || $intro_text ) && ! defined( 'REST_REQUEST' ) ) : ?>
		<div class="dbw-events__header">
			<?php if ( $heading ) : ?>
				<h2 class="dbw-events__heading"><?php echo wp_kses_post( $heading ); ?></h2>
			<?php endif; ?>
			<?php if ( $intro_text ) : ?>
				<p class="dbw-events__intro"><?php echo wp_kses_post( $intro_text ); ?></p>
			<?php endif; ?>
		</div>
	<?php endif; ?>
	<div class="dbw-events__grid">
		<?php while ( $events->have_posts() ) : $events->the_post(); ?>
			<?php
			$raw_datum  = get_field( 'event_datum' );
			$event_zeit = get_field( 'event_zeit' );   // ACF time picker → "HH:MM"
			$info       = get_field( 'event_info' );
			$image_url  = get_the_post_thumbnail_url( get_the_ID(), 'medium' );

			// Parse time into hours / minutes
			$time_h = '';
			$time_m = '';
			if ( $event_zeit ) {
				$parts  = explode( ':', $event_zeit );
				$time_h = $parts[0] ?? '';
				$time_m = isset( $parts[1] ) ? substr( $parts[1], 0, 2 ) : '00';
			}

			// Parse date
			$date_obj  = DateTime::createFromFormat( 'Ymd', $raw_datum );
			$day       = $date_obj ? $date_obj->format( 'd' ) : '';
			$month_key = $date_obj ? $date_obj->format( 'm' ) : '';
			$month     = $months_de[ $month_key ] ?? '';
			?>

			<article class="dbw-events__card">
				<?php if ( $show_image && $image_url ) : ?>
					<div class="dbw-events__image">
						<img
							src="<?php echo esc_url( $image_url ); ?>"
							alt="<?php echo esc_attr( get_the_title() ); ?>"
							loading="lazy"
							decoding="async"
						/>
					</div>
				<?php endif; ?>

				<div class="dbw-events__date">
					<span class="dbw-events__day"><?php echo esc_html( $day ); ?></span>
					<span class="dbw-events__month"><?php echo esc_html( $month ); ?></span>
				</div>

				<div class="dbw-events__body">
					<h3 class="dbw-events__title"><?php echo esc_html( get_the_title() ); ?></h3>
					<?php if ( $show_info && $info ) : ?>
						<p class="dbw-events__info"><?php echo esc_html( $info ); ?></p>
					<?php endif; ?>
				</div>

				<?php if ( $show_time && $event_zeit ) : ?>
					<div class="dbw-events__time">
						<time class="dbw-events__time-value" datetime="<?php echo esc_attr( $time_h . ':' . $time_m ); ?>">
							<span class="dbw-events__time-h"><?php echo esc_html( $time_h ); ?></span><span class="dbw-events__time-sep">:</span><span class="dbw-events__time-m"><?php echo esc_html( $time_m ); ?></span>
						</time>
						<span class="dbw-events__time-label">Uhr</span>
					</div>
				<?php endif; ?>
			</article>

		<?php endwhile; ?>
		<?php wp_reset_postdata(); ?>
	</div>
</div>
