<?php
/**
 * USP Item Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$icon            = $attributes['icon'] ?? 'check';
$custom_icon_url = $attributes['customIconUrl'] ?? '';
$heading         = $attributes['heading'] ?? '';
$text            = $attributes['text'] ?? '';

$has_custom_icon = ! empty( $custom_icon_url );

// Predefined icon SVGs (fallback when no custom icon)
$icons = [
	'check'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
	'star'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
	'rocket' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
	'heart'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
	'shield' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
	'bolt'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
];

$classes = [ 'wp-block-dbw-base-usp-item' ];
if ( $has_custom_icon ) {
	$classes[] = 'has-custom-icon';
}

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => implode( ' ', $classes ),
] );
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-dbw-base-usp-item__icon" aria-hidden="true">
		<?php if ( $has_custom_icon ) : ?>
			<img
				src="<?php echo esc_url( $custom_icon_url ); ?>"
				alt=""
				loading="lazy"
				decoding="async"
			/>
		<?php else : ?>
			<?php echo $icons[ $icon ] ?? $icons['check']; ?>
		<?php endif; ?>
	</div>

	<div class="wp-block-dbw-base-usp-item__content">
		<?php if ( $heading ) : ?>
			<h3 class="wp-block-dbw-base-usp-item__heading"><?php echo wp_kses_post( $heading ); ?></h3>
		<?php endif; ?>

		<?php if ( $text ) : ?>
			<p class="wp-block-dbw-base-usp-item__text"><?php echo wp_kses_post( $text ); ?></p>
		<?php endif; ?>
	</div>
</div>
