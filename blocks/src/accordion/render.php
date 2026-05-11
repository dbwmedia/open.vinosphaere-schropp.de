<?php
/**
 * Accordion Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$padding_size = $attributes['paddingSize'] ?? 'm';

$_anchor            = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => "wp-block-dbw-base-accordion is-padding-{$padding_size}" ] + $_anchor );
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-dbw-base-accordion__list">
		<?php echo $content; ?>
	</div>
</section>
