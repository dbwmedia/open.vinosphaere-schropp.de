<?php
/**
 * Footer Info Block – Server-Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 *
 * @package dbw-base
 */

// Design
$padding_size        = $attributes['paddingSize']           ?? 'm';
$bg_color            = $attributes['backgroundColor']       ?? 'dark-grey';
$custom_bg_color     = $attributes['customBackgroundColor'] ?? '';
$custom_text_color   = $attributes['customTextColor']       ?? '';
$custom_heading_color = $attributes['customHeadingColor']   ?? '';
$custom_social_color = $attributes['customSocialColor']     ?? '';
$content_align       = $attributes['contentAlign']          ?? 'left';
$stacked_layout      = $attributes['stackedLayout']         ?? false;

// Logo
$show_logo    = $attributes['showLogo']  ?? true;
$logo_url     = $attributes['logoUrl']   ?? '';
$logo_alt     = $attributes['logoAlt']   ?? '';
$logo_width   = $attributes['logoWidth'] ?? 160;

// Company info
$show_company    = $attributes['showCompanyInfo'] ?? true;
$company_name    = $attributes['companyName']     ?? '';
$company_address = $attributes['companyAddress']  ?? '';
$company_extra   = $attributes['companyExtra']    ?? '';

// Opening hours
$show_hours  = $attributes['showOpeningHours']  ?? false;
$hours_label = $attributes['openingHoursLabel'] ?? 'Öffnungszeiten';
$hours_text  = $attributes['openingHoursText']  ?? '';

// Secondary image
$show_image          = $attributes['showSecondaryImage']       ?? false;
$image_url           = $attributes['secondaryImageUrl']        ?? '';
$image_alt           = $attributes['secondaryImageAlt']        ?? '';
$image_link_url      = $attributes['secondaryImageLinkUrl']    ?? '';
$image_link_new_tab  = $attributes['secondaryImageLinkNewTab'] ?? false;
$image_max_width     = $attributes['secondaryImageMaxWidth']   ?? 0;

// Divider
$show_divider = $attributes['showDivider'] ?? true;

// Legal
$show_impressum     = $attributes['showImpressum']   ?? false;
$impressum_url      = $attributes['impressumUrl']    ?? '';
$impressum_new_tab  = $attributes['impressumNewTab'] ?? false;
$show_agb           = $attributes['showAgb']         ?? false;
$agb_url            = $attributes['agbUrl']          ?? '';
$agb_new_tab        = $attributes['agbNewTab']       ?? false;
$show_datenschutz   = $attributes['showDatenschutz'] ?? true;
$datenschutz_url    = $attributes['datenschutzUrl']  ?? '';
$datenschutz_new_tab = $attributes['datenschutzNewTab'] ?? false;

// Scroll-to-top
$show_scroll_top = $attributes['showScrollTop']   ?? true;
$scroll_anchor   = $attributes['scrollTopAnchor'] ?? '#top';

// Social links
$show_social_links = $attributes['showSocialLinks']  ?? false;
$social_icon_style = $attributes['socialIconStyle']  ?? 'circle';
$social_links      = $attributes['socialLinks']      ?? [];

// Social icon SVG paths (stroke-based, viewBox 0 0 24 24)
$social_icons = [
	'facebook'  => '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3"/>',
	'instagram' => '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="3"/>',
	'x'         => '<path d="M4 4 20 20M20 4 4 20"/>',
	'linkedin'  => '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 6-3z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
	'youtube'   => '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="currentColor" stroke="none"/>',
	'tiktok'    => '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
	'pinterest' => '<path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-2 .2-2.8.3-1.1 1.8-7.7 1.8-7.7s-.4-1-.4-2.3c0-2.1 1.2-3.7 2.8-3.7 1.3 0 2 1 2 2.2 0 1.4-.9 3.5-1.3 5.4-.4 1.6.8 2.9 2.2 2.9 2.7 0 4.6-2.8 4.6-6.9 0-3.6-2.6-6.1-6.3-6.1-4.3 0-6.8 3.2-6.8 6.5 0 1.3.5 2.7 1.1 3.4.1.1.1.3 0 .4l-.4 1.8c-.1.3-.2.3-.5.2C5.2 15.9 4 13.4 4 11c0-4.4 3.2-8.5 9.3-8.5 4.9 0 8.7 3.5 8.7 8.1 0 4.8-3 8.6-7.2 8.6-1.4 0-2.7-.7-3.2-1.6l-.9 3.3c-.3 1.2-1.1 2.7-1.7 3.6A10 10 0 0 0 12 22a10 10 0 0 0 0-20z"/>',
	'xing'      => '<path d="M5.5 5l4 7L4 19h3l5.5-7-4-7zm9-1 6 10h-3L11 4z"/>',
	'whatsapp'  => '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
];

// Derived
$is_dark      = in_array( $bg_color, [ 'dark-grey', 'secondary' ], true );
$has_legal    = $show_impressum || $show_agb || $show_datenschutz;
$has_bottom   = $has_legal; // Scroll-Top wird als fixed Element außerhalb von __bottom gerendert
// In stacked mode, never use two-column layout
$has_right_col = ! $stacked_layout && ( $show_hours || $show_image );
$has_main     = $show_company || $show_hours || $show_image;

// Build wrapper classes
$classes = [ 'wp-block-dbw-base-footer-info', "is-padding-{$padding_size}" ];

if ( $bg_color && $bg_color !== 'custom' ) {
	$classes[] = "has-bg-{$bg_color}";
}
if ( $is_dark ) {
	$classes[] = 'is-style-dark';
}
if ( $content_align === 'center' ) {
	$classes[] = 'is-content-centered';
}

$_anchor     = ! empty( $attributes['anchor'] ) ? [ 'id' => $attributes['anchor'] ] : [];
$extra_attrs = [ 'class' => implode( ' ', $classes ) ] + $_anchor;

// Build inline styles: custom background + CSS color variables
$style_parts = [];

if ( $bg_color === 'custom' && $custom_bg_color ) {
	$safe = sanitize_hex_color( $custom_bg_color );
	if ( $safe ) $style_parts[] = "background-color: {$safe}";
}
if ( $custom_text_color ) {
	$safe = sanitize_hex_color( $custom_text_color );
	if ( $safe ) $style_parts[] = "--fi-text: {$safe}";
}
if ( $custom_heading_color ) {
	$safe = sanitize_hex_color( $custom_heading_color );
	if ( $safe ) $style_parts[] = "--fi-heading: {$safe}";
}
if ( $custom_social_color ) {
	$safe = sanitize_hex_color( $custom_social_color );
	if ( $safe ) $style_parts[] = "--fi-social: {$safe}";
}

if ( ! empty( $style_parts ) ) {
	$extra_attrs['style'] = implode( '; ', $style_parts ) . ';';
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attrs );

// Helper: build __main class
$main_classes = 'wp-block-dbw-base-footer-info__main';
if ( $has_right_col ) {
	$main_classes .= ' has-columns';
}
if ( $stacked_layout ) {
	$main_classes .= ' is-stacked';
}
?>

<footer <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-dbw-base-footer-info__inner">

		<?php if ( $show_logo && $logo_url ) : ?>
			<div class="wp-block-dbw-base-footer-info__logo-wrap">
				<img
					class="wp-block-dbw-base-footer-info__logo"
					src="<?php echo esc_url( $logo_url ); ?>"
					alt="<?php echo esc_attr( $logo_alt ); ?>"
					width="<?php echo esc_attr( $logo_width ); ?>"
					loading="lazy"
					decoding="async"
				/>
			</div>
		<?php endif; ?>

		<?php if ( $has_main ) : ?>
			<div class="<?php echo esc_attr( $main_classes ); ?>">

				<?php if ( $show_company ) : ?>
					<div class="wp-block-dbw-base-footer-info__company">
						<?php if ( $company_name ) : ?>
							<p class="wp-block-dbw-base-footer-info__company-name">
								<?php echo wp_kses_post( $company_name ); ?>
							</p>
						<?php endif; ?>
						<?php if ( $company_address ) : ?>
							<address class="wp-block-dbw-base-footer-info__address">
								<?php echo wp_kses_post( $company_address ); ?>
							</address>
						<?php endif; ?>
						<?php if ( $company_extra ) : ?>
							<p class="wp-block-dbw-base-footer-info__extra">
								<?php echo wp_kses_post( $company_extra ); ?>
							</p>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( $has_right_col ) : ?>
					<?php /* Non-stacked: hours + image in aside column */ ?>
					<div class="wp-block-dbw-base-footer-info__aside">

						<?php if ( $show_hours ) : ?>
							<div class="wp-block-dbw-base-footer-info__hours">
								<strong class="wp-block-dbw-base-footer-info__hours-label">
									<?php echo esc_html( $hours_label ); ?>
								</strong>
								<?php if ( $hours_text ) : ?>
									<div class="wp-block-dbw-base-footer-info__hours-text">
										<?php echo wp_kses_post( $hours_text ); ?>
									</div>
								<?php endif; ?>
							</div>
						<?php endif; ?>

						<?php if ( $show_image && $image_url ) : ?>
							<div class="wp-block-dbw-base-footer-info__image-wrap"<?php if ( $image_max_width > 0 ) : ?> style="max-width: <?php echo intval( $image_max_width ); ?>px"<?php endif; ?>>
								<?php if ( $image_link_url ) : ?><a href="<?php echo esc_url( $image_link_url ); ?>"<?php if ( $image_link_new_tab ) : ?> target="_blank" rel="noopener noreferrer"<?php endif; ?>><?php endif; ?>
								<img
									class="wp-block-dbw-base-footer-info__image"
									src="<?php echo esc_url( $image_url ); ?>"
									alt="<?php echo esc_attr( $image_alt ); ?>"
									loading="lazy"
									decoding="async"
								/>
								<?php if ( $image_link_url ) : ?></a><?php endif; ?>
							</div>
						<?php endif; ?>

					</div>
				<?php else : ?>
					<?php /* Stacked: hours + image directly in main, no aside */ ?>
					<?php if ( $show_hours ) : ?>
						<div class="wp-block-dbw-base-footer-info__hours">
							<strong class="wp-block-dbw-base-footer-info__hours-label">
								<?php echo esc_html( $hours_label ); ?>
							</strong>
							<?php if ( $hours_text ) : ?>
								<div class="wp-block-dbw-base-footer-info__hours-text">
									<?php echo wp_kses_post( $hours_text ); ?>
								</div>
							<?php endif; ?>
						</div>
					<?php endif; ?>

					<?php if ( $show_image && $image_url ) : ?>
						<div class="wp-block-dbw-base-footer-info__image-wrap"<?php if ( $image_max_width > 0 ) : ?> style="max-width: <?php echo intval( $image_max_width ); ?>px"<?php endif; ?>>
							<?php if ( $image_link_url ) : ?><a href="<?php echo esc_url( $image_link_url ); ?>"<?php if ( $image_link_new_tab ) : ?> target="_blank" rel="noopener noreferrer"<?php endif; ?>><?php endif; ?>
							<img
								class="wp-block-dbw-base-footer-info__image"
								src="<?php echo esc_url( $image_url ); ?>"
								alt="<?php echo esc_attr( $image_alt ); ?>"
								loading="lazy"
								decoding="async"
							/>
							<?php if ( $image_link_url ) : ?></a><?php endif; ?>
						</div>
					<?php endif; ?>
				<?php endif; ?>

			</div>
		<?php endif; ?>

		<?php if ( $show_social_links && ! empty( $social_links ) ) :
			$visible_social = array_filter( $social_links, fn( $l ) => ! empty( $l['url'] ) && ! empty( $l['platform'] ) );
		?>
			<?php if ( ! empty( $visible_social ) ) : ?>
				<div class="wp-block-dbw-base-footer-info__social is-social-style-<?php echo esc_attr( $social_icon_style ); ?>">
					<?php foreach ( $visible_social as $link ) :
						$platform = $link['platform'];
						$icon_path = $social_icons[ $platform ] ?? '';
						if ( ! $icon_path ) continue;
						$platform_label = ucfirst( $platform === 'x' ? 'X (Twitter)' : $platform );
					?>
						<a
							class="wp-block-dbw-base-footer-info__social-link"
							href="<?php echo esc_url( $link['url'] ); ?>"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="<?php echo esc_attr( $platform_label ); ?>"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<?php echo $icon_path; // SVG paths are hardcoded, not user input ?>
							</svg>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		<?php endif; ?>

		<?php if ( $show_divider ) : ?>
			<hr class="wp-block-dbw-base-footer-info__divider" aria-hidden="true" />
		<?php endif; ?>

		<?php if ( $has_bottom ) : ?>
			<div class="wp-block-dbw-base-footer-info__bottom">

				<?php if ( $has_legal ) : ?>
					<nav class="wp-block-dbw-base-footer-info__legal" aria-label="<?php esc_attr_e( 'Rechtliche Links', 'dbw-base' ); ?>">
						<?php if ( $show_impressum && $impressum_url ) : ?>
							<a
								class="wp-block-dbw-base-footer-info__legal-link"
								href="<?php echo esc_url( $impressum_url ); ?>"
								<?php if ( $impressum_new_tab ) : ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
							>
								<?php esc_html_e( 'Impressum', 'dbw-base' ); ?>
							</a>
						<?php endif; ?>
						<?php if ( $show_agb && $agb_url ) : ?>
							<a
								class="wp-block-dbw-base-footer-info__legal-link"
								href="<?php echo esc_url( $agb_url ); ?>"
								<?php if ( $agb_new_tab ) : ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
							>
								<?php esc_html_e( 'AGB', 'dbw-base' ); ?>
							</a>
						<?php endif; ?>
						<?php if ( $show_datenschutz && $datenschutz_url ) : ?>
							<a
								class="wp-block-dbw-base-footer-info__legal-link"
								href="<?php echo esc_url( $datenschutz_url ); ?>"
								<?php if ( $datenschutz_new_tab ) : ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
							>
								<?php esc_html_e( 'Datenschutz', 'dbw-base' ); ?>
							</a>
						<?php endif; ?>
					</nav>
				<?php endif; ?>

			</div>
		<?php endif; ?>

	</div>

	<?php if ( $show_scroll_top ) : ?>
		<a
			class="wp-block-dbw-base-footer-info__scroll-top"
			href="<?php echo esc_url( $scroll_anchor ); ?>"
			aria-label="<?php esc_attr_e( 'Nach oben scrollen', 'dbw-base' ); ?>"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<polyline points="18 15 12 9 6 15"/>
			</svg>
		</a>
	<?php endif; ?>

</footer>
