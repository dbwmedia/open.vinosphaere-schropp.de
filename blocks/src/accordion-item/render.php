<?php
/**
 * Accordion Item Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$question = $attributes['question'] ?? '';
$answer   = $attributes['answer'] ?? '';

if ( ! $question ) {
	return;
}

$item_id = wp_unique_id( 'dbw-accordion-' );

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'wp-block-dbw-base-accordion-item',
] );
?>

<div <?php echo $wrapper_attributes; ?>>
	<button
		class="wp-block-dbw-base-accordion-item__trigger"
		aria-expanded="false"
		aria-controls="<?php echo esc_attr( $item_id ); ?>"
		type="button"
	>
		<span class="wp-block-dbw-base-accordion-item__question"><?php echo wp_kses_post( $question ); ?></span>
		<span class="wp-block-dbw-base-accordion-item__icon" aria-hidden="true">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="6 9 12 15 18 9"/>
			</svg>
		</span>
	</button>
	<div
		class="wp-block-dbw-base-accordion-item__content"
		id="<?php echo esc_attr( $item_id ); ?>"
		role="region"
	>
		<?php if ( $answer ) : ?>
			<p class="wp-block-dbw-base-accordion-item__answer"><?php echo wp_kses_post( $answer ); ?></p>
		<?php endif; ?>
	</div>
</div>
