<?php
/**
 * Stat-Counter Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$number   = $attributes['number'] ?? 100;
$suffix   = $attributes['suffix'] ?? '+';
$prefix   = $attributes['prefix'] ?? '';
$label    = $attributes['label'] ?? '';
$duration = $attributes['duration'] ?? 2000;

$_anchor            = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$wrapper_attributes = get_block_wrapper_attributes( [
	'class'         => 'wp-block-dbw-base-stat-counter',
	'data-target'   => esc_attr( $number ),
	'data-suffix'   => esc_attr( $suffix ),
	'data-prefix'   => esc_attr( $prefix ),
	'data-duration' => esc_attr( $duration ),
] + $_anchor );
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-dbw-base-stat-counter__number" aria-live="polite">
		<?php echo esc_html( $prefix . '0' . $suffix ); ?>
	</div>

	<?php if ( $label ) : ?>
		<span class="wp-block-dbw-base-stat-counter__label"><?php echo esc_html( $label ); ?></span>
	<?php endif; ?>
</div>
