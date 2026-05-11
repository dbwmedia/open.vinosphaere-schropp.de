<?php
/**
 * CTA-Banner Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$heading      = $attributes['heading'] ?? '';
$text         = $attributes['text'] ?? '';
$button_text  = $attributes['buttonText'] ?? '';
$button_url   = $attributes['buttonUrl'] ?? '';
$style        = $attributes['style'] ?? 'primary';
$padding_size = $attributes['paddingSize'] ?? 'm';

$_anchor            = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => "wp-block-dbw-base-cta-banner is-style-{$style} is-padding-{$padding_size}" ] + $_anchor );
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-dbw-base-cta-banner__content">
		<?php if ( $heading ) : ?>
			<h2 class="wp-block-dbw-base-cta-banner__heading"><?php echo wp_kses_post( $heading ); ?></h2>
		<?php endif; ?>

		<?php if ( $text ) : ?>
			<p class="wp-block-dbw-base-cta-banner__text"><?php echo wp_kses_post( $text ); ?></p>
		<?php endif; ?>

		<?php if ( $button_text && $button_url ) : ?>
			<a class="wp-block-dbw-base-cta-banner__button" href="<?php echo esc_url( $button_url ); ?>">
				<?php echo esc_html( $button_text ); ?>
			</a>
		<?php endif; ?>
	</div>
</section>
