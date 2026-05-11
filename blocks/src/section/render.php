<?php
/**
 * Section Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$padding_size    = $attributes['paddingSize']           ?? 'm';
$bg_color        = $attributes['backgroundColor']       ?? '';
$custom_bg_color = $attributes['customBackgroundColor'] ?? '';
$content_align   = $attributes['contentAlign']          ?? 'left';
$bg_image_url    = $attributes['backgroundImageUrl']    ?? '';
$bg_image_alt    = $attributes['backgroundImageAlt']    ?? '';
$overlay_opacity = $attributes['overlayOpacity']        ?? 50;

$classes = [ 'wp-block-dbw-base-section', "is-padding-{$padding_size}" ];

if ( $bg_color && $bg_color !== 'custom' ) {
	$classes[] = "has-bg-{$bg_color}";
}

if ( $bg_image_url ) {
	$classes[] = 'has-bg-image';
}

$is_dark = in_array( $bg_color, [ 'dark-grey', 'secondary' ], true ) || $bg_image_url;

if ( $is_dark ) {
	$classes[] = 'is-style-dark';
}

if ( $content_align === 'center' ) {
	$classes[] = 'is-content-centered';
}

$_anchor     = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$extra_attrs = [ 'class' => implode( ' ', $classes ) ] + $_anchor;

if ( $bg_color === 'custom' && $custom_bg_color ) {
	$safe_color           = sanitize_hex_color( $custom_bg_color );
	$extra_attrs['style'] = $safe_color ? "background-color: {$safe_color};" : '';
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attrs );
?>

<section <?php echo $wrapper_attributes; ?>>
	<?php if ( $bg_image_url ) : ?>
		<img
			class="wp-block-dbw-base-section__media"
			src="<?php echo esc_url( $bg_image_url ); ?>"
			alt="<?php echo esc_attr( $bg_image_alt ); ?>"
			loading="lazy"
			decoding="async"
			aria-hidden="true"
		/>
		<div
			class="wp-block-dbw-base-section__overlay"
			style="opacity: <?php echo esc_attr( $overlay_opacity / 100 ); ?>"
			aria-hidden="true"
		></div>
	<?php endif; ?>

	<div class="wp-block-dbw-base-section__inner">
		<?php echo $content; ?>
	</div>
</section>
