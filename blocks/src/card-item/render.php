<?php
/**
 * Card Item Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$media_url = $attributes['mediaUrl'] ?? '';
$media_alt = $attributes['mediaAlt'] ?? '';
$heading   = $attributes['heading'] ?? '';
$text      = $attributes['text'] ?? '';
$link_text = $attributes['linkText'] ?? '';
$link_url  = $attributes['linkUrl'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'wp-block-dbw-base-card-item',
] );

$has_link = $link_text && $link_url;
?>

<article <?php echo $wrapper_attributes; ?>>
	<?php if ( $media_url ) : ?>
		<div class="wp-block-dbw-base-card-item__image">
			<img
				src="<?php echo esc_url( $media_url ); ?>"
				alt="<?php echo esc_attr( $media_alt ); ?>"
				loading="lazy"
				decoding="async"
			/>
		</div>
	<?php endif; ?>

	<div class="wp-block-dbw-base-card-item__body">
		<?php if ( $heading ) : ?>
			<h3 class="wp-block-dbw-base-card-item__heading"><?php echo wp_kses_post( $heading ); ?></h3>
		<?php endif; ?>

		<?php if ( $text ) : ?>
			<p class="wp-block-dbw-base-card-item__text"><?php echo wp_kses_post( $text ); ?></p>
		<?php endif; ?>

		<?php if ( $has_link ) : ?>
			<a class="wp-block-dbw-base-card-item__link" href="<?php echo esc_url( $link_url ); ?>">
				<?php echo esc_html( $link_text ); ?> &rarr;
			</a>
		<?php endif; ?>
	</div>
</article>
