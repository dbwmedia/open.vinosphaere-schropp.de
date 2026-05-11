<?php
/**
 * Logo-Grid Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

$logos        = $attributes['logos'] ?? [];
$columns      = $attributes['columns'] ?? 4;
$padding_size = $attributes['paddingSize'] ?? 'm';

if ( empty( $logos ) ) {
	return;
}

$_anchor            = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => "wp-block-dbw-base-logo-grid has-{$columns}-columns is-padding-{$padding_size}" ] + $_anchor );
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-dbw-base-logo-grid__grid">
		<?php foreach ( $logos as $logo ) :
			$url = $logo['url'] ?? '';
			$alt = $logo['alt'] ?? '';
			if ( ! $url ) continue;
		?>
			<div class="wp-block-dbw-base-logo-grid__item">
				<img
					src="<?php echo esc_url( $url ); ?>"
					alt="<?php echo esc_attr( $alt ); ?>"
					loading="lazy"
					decoding="async"
				/>
			</div>
		<?php endforeach; ?>
	</div>
</section>
