<?php
/**
 * Split-Content Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$media_url    = $attributes['mediaUrl'] ?? '';
$media_alt    = $attributes['mediaAlt'] ?? '';
$heading      = $attributes['heading'] ?? '';
$text         = $attributes['text'] ?? '';
$image_right  = ! empty( $attributes['imageRight'] );
$padding_size = $attributes['paddingSize'] ?? 'm';
$buttons      = $attributes['buttons'] ?? [];

// Backward compatibility: convert old single-button format.
if ( empty( $buttons ) ) {
	$button_text  = $attributes['buttonText'] ?? '';
	$button_url   = $attributes['buttonUrl'] ?? '';
	$button_style = $attributes['buttonStyle'] ?? 'primary';
	if ( $button_text && $button_url ) {
		$buttons = [
			[
				'text'   => $button_text,
				'url'    => $button_url,
				'style'  => $button_style,
				'newTab' => false,
			],
		];
	}
}

$valid_buttons = array_values(
	array_filter(
		$buttons,
		fn( $btn ) => ! empty( $btn['text'] ) && ! empty( $btn['url'] )
	)
);

$classes = [ 'wp-block-dbw-base-split-content', "is-padding-{$padding_size}" ];
if ( $image_right ) {
	$classes[] = 'is-image-right';
}

$_anchor            = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => implode( ' ', $classes ) ] + $_anchor );
?>

<section <?php echo $wrapper_attributes; ?>>
	<?php if ( $media_url ) : ?>
		<div class="wp-block-dbw-base-split-content__media">
			<img
				src="<?php echo esc_url( $media_url ); ?>"
				alt="<?php echo esc_attr( $media_alt ); ?>"
				loading="lazy"
				decoding="async"
			/>
		</div>
	<?php endif; ?>

	<div class="wp-block-dbw-base-split-content__body">
		<?php if ( $heading ) : ?>
			<h2 class="wp-block-dbw-base-split-content__heading"><?php echo wp_kses_post( $heading ); ?></h2>
		<?php endif; ?>

		<?php if ( $text ) : ?>
			<p class="wp-block-dbw-base-split-content__text"><?php echo wp_kses_post( $text ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $valid_buttons ) ) : ?>
			<div class="wp-block-dbw-base-split-content__buttons">
				<?php foreach ( $valid_buttons as $btn ) : ?>
					<?php
					$btn_text    = $btn['text'] ?? '';
					$btn_url     = $btn['url'] ?? '';
					$btn_style   = $btn['style'] ?? 'primary';
					$btn_new_tab = ! empty( $btn['newTab'] );
					?>
					<a
						class="wp-block-dbw-base-split-content__button is-style-<?php echo esc_attr( $btn_style ); ?>"
						href="<?php echo esc_url( $btn_url ); ?>"
						<?php if ( $btn_new_tab ) : ?>
							target="_blank"
							rel="noopener noreferrer"
						<?php endif; ?>
					>
						<?php echo esc_html( $btn_text ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
