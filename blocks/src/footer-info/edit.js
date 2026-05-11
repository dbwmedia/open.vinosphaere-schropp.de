/**
 * Footer Info Block – Editor Component
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Button,
	TextControl,
	ColorPicker,
} from '@wordpress/components';

const PADDING_OPTIONS = [
	{ label: __( 'Klein (S)', 'dbw-base' ), value: 's' },
	{ label: __( 'Mittel (M)', 'dbw-base' ), value: 'm' },
	{ label: __( 'Groß (L)', 'dbw-base' ), value: 'l' },
];

const BG_COLOR_OPTIONS = [
	{ label: __( 'Keine', 'dbw-base' ),              value: '' },
	{ label: __( 'Hintergrund (Hell)', 'dbw-base' ), value: 'base-bg' },
	{ label: __( 'Primär (Brand)', 'dbw-base' ),     value: 'primary' },
	{ label: __( 'Sekundär', 'dbw-base' ),           value: 'secondary' },
	{ label: __( 'Dunkelgrau', 'dbw-base' ),         value: 'dark-grey' },
	{ label: __( 'Eigene Farbe', 'dbw-base' ),       value: 'custom' },
];

const SOCIAL_STYLE_OPTIONS = [
	{ label: __( 'Kreis (Rahmen)', 'dbw-base' ),   value: 'circle' },
	{ label: __( 'Kreis (gefüllt)', 'dbw-base' ),   value: 'circle-filled' },
	{ label: __( 'Pill (Rahmen)', 'dbw-base' ),     value: 'pill' },
	{ label: __( 'Pill (gefüllt)', 'dbw-base' ),    value: 'pill-filled' },
	{ label: __( 'Nur Icon (kein Rahmen)', 'dbw-base' ), value: 'plain' },
];

const SOCIAL_PLATFORMS = [
	{ label: 'Facebook',    value: 'facebook' },
	{ label: 'Instagram',   value: 'instagram' },
	{ label: 'X (Twitter)', value: 'x' },
	{ label: 'LinkedIn',    value: 'linkedin' },
	{ label: 'YouTube',     value: 'youtube' },
	{ label: 'TikTok',      value: 'tiktok' },
	{ label: 'Pinterest',   value: 'pinterest' },
	{ label: 'Xing',        value: 'xing' },
	{ label: 'WhatsApp',    value: 'whatsapp' },
];

const SOCIAL_ICON_PATHS = {
	facebook:  '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3"/>',
	instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="3"/>',
	x:         '<path d="M4 4 20 20M20 4 4 20"/>',
	linkedin:  '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 6-3z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
	youtube:   '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="currentColor" stroke="none"/>',
	tiktok:    '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
	pinterest: '<path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-2 .2-2.8.3-1.1 1.8-7.7 1.8-7.7s-.4-1-.4-2.3c0-2.1 1.2-3.7 2.8-3.7 1.3 0 2 1 2 2.2 0 1.4-.9 3.5-1.3 5.4-.4 1.6.8 2.9 2.2 2.9 2.7 0 4.6-2.8 4.6-6.9 0-3.6-2.6-6.1-6.3-6.1-4.3 0-6.8 3.2-6.8 6.5 0 1.3.5 2.7 1.1 3.4.1.1.1.3 0 .4l-.4 1.8c-.1.3-.2.3-.5.2C5.2 15.9 4 13.4 4 11c0-4.4 3.2-8.5 9.3-8.5 4.9 0 8.7 3.5 8.7 8.1 0 4.8-3 8.6-7.2 8.6-1.4 0-2.7-.7-3.2-1.6l-.9 3.3c-.3 1.2-1.1 2.7-1.7 3.6A10 10 0 0 0 12 22a10 10 0 0 0 0-20z"/>',
	xing:      '<path d="M5.5 5l4 7L4 19h3l5.5-7-4-7zm9-1 6 10h-3L11 4z"/>',
	whatsapp:  '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
};

function getSocialSvg( platform ) {
	const inner = SOCIAL_ICON_PATHS[ platform ] || '';
	return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ inner }</svg>`;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		paddingSize,
		backgroundColor,
		customBackgroundColor,
		customTextColor,
		customHeadingColor,
		customSocialColor,
		contentAlign,
		stackedLayout,
		showLogo, logoId, logoUrl, logoAlt, logoWidth,
		showCompanyInfo, companyName, companyAddress, companyExtra,
		showOpeningHours, openingHoursLabel, openingHoursText,
		showSecondaryImage, secondaryImageId, secondaryImageUrl, secondaryImageAlt,
		secondaryImageLinkUrl, secondaryImageLinkNewTab, secondaryImageMaxWidth,
		showDivider,
		showImpressum, impressumUrl, impressumNewTab,
		showAgb, agbUrl, agbNewTab,
		showDatenschutz, datenschutzUrl, datenschutzNewTab,
		showScrollTop, scrollTopAnchor,
		showSocialLinks, socialIconStyle, socialLinks,
	} = attributes;

	const isDark      = backgroundColor === 'dark-grey' || backgroundColor === 'secondary';
	const isCentered  = contentAlign === 'center';
	const hasLegal    = showImpressum || showAgb || showDatenschutz;
	const hasBottom   = hasLegal; // Scroll-Top wird als fixed Element außerhalb von __bottom gerendert
	// With stackedLayout, never force two columns
	const hasRightCol = ! stackedLayout && ( showOpeningHours || showSecondaryImage );
	const hasMain     = showCompanyInfo || showOpeningHours || showSecondaryImage;

	// Build wrapper inline styles (bg color + CSS variables for text colors)
	const wrapperStyle = {};
	if ( backgroundColor === 'custom' && customBackgroundColor ) {
		wrapperStyle.backgroundColor = customBackgroundColor;
	}
	if ( customTextColor ) {
		wrapperStyle[ '--fi-text' ] = customTextColor;
		wrapperStyle.color          = customTextColor; // direkt cascaden für color:inherit-Kinder
	}
	if ( customHeadingColor ) wrapperStyle[ '--fi-heading' ] = customHeadingColor;
	if ( customSocialColor )  wrapperStyle[ '--fi-social' ]  = customSocialColor;

	const blockProps = useBlockProps( {
		className: [
			`is-padding-${ paddingSize }`,
			backgroundColor && backgroundColor !== 'custom' ? `has-bg-${ backgroundColor }` : '',
			isDark ? 'is-style-dark' : '',
			isCentered ? 'is-content-centered' : '',
		].filter( Boolean ).join( ' ' ),
		style: wrapperStyle,
	} );

	// --- Logo helpers ---
	const onSelectLogo = ( media ) => {
		const url = media.sizes?.medium?.url || media.sizes?.full?.url || media.url;
		setAttributes( { logoId: media.id, logoUrl: url, logoAlt: media.alt || '' } );
	};
	const onRemoveLogo = () =>
		setAttributes( { logoId: undefined, logoUrl: undefined, logoAlt: '' } );

	// --- Secondary image helpers ---
	const onSelectSecondaryImage = ( media ) => {
		const url = media.sizes?.medium_large?.url || media.sizes?.large?.url || media.url;
		setAttributes( { secondaryImageId: media.id, secondaryImageUrl: url, secondaryImageAlt: media.alt || '' } );
	};
	const onRemoveSecondaryImage = () =>
		setAttributes( { secondaryImageId: undefined, secondaryImageUrl: undefined, secondaryImageAlt: '' } );

	// --- Social links helpers ---
	const updateSocialLink = ( index, field, value ) => {
		const updated = [ ...socialLinks ];
		updated[ index ] = { ...updated[ index ], [ field ]: value };
		setAttributes( { socialLinks: updated } );
	};
	const removeSocialLink = ( index ) =>
		setAttributes( { socialLinks: socialLinks.filter( ( _, i ) => i !== index ) } );
	const addSocialLink = () =>
		setAttributes( { socialLinks: [ ...socialLinks, { platform: 'instagram', url: '' } ] } );

	return (
		<>
			{ /* ── SIDEBAR ─────────────────────────────────────────── */ }
			<InspectorControls>

				<PanelBody title={ __( 'Design', 'dbw-base' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Innenabstand', 'dbw-base' ) }
						value={ paddingSize }
						options={ PADDING_OPTIONS }
						onChange={ ( value ) => setAttributes( { paddingSize: value } ) }
					/>
					<ToggleControl
						label={ __( 'Content zentrieren', 'dbw-base' ) }
						checked={ isCentered }
						onChange={ ( value ) => setAttributes( { contentAlign: value ? 'center' : 'left' } ) }
					/>
					<ToggleControl
						label={ __( 'Infos untereinander stapeln', 'dbw-base' ) }
						help={ __( 'Deaktiviert das Spalten-Layout – alle Infoblöcke erscheinen untereinander.', 'dbw-base' ) }
						checked={ stackedLayout }
						onChange={ ( value ) => setAttributes( { stackedLayout: value } ) }
					/>
					<SelectControl
						label={ __( 'Hintergrundfarbe', 'dbw-base' ) }
						value={ backgroundColor }
						options={ BG_COLOR_OPTIONS }
						onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
					/>
					{ backgroundColor === 'custom' && (
						<div style={ { marginTop: '8px' } }>
							<p style={ { margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 500 } }>
								{ __( 'Eigene Farbe wählen', 'dbw-base' ) }
							</p>
							<ColorPicker
								color={ customBackgroundColor || '#ffffff' }
								onChange={ ( color ) => setAttributes( { customBackgroundColor: color } ) }
								enableAlpha={ false }
							/>
						</div>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Farben', 'dbw-base' ) } initialOpen={ false }>

					{ /* Text color */ }
					<p style={ { margin: '0 0 6px', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase' } }>
						{ __( 'Textfarbe', 'dbw-base' ) }
					</p>
					{ customTextColor ? (
						<>
							<ColorPicker
								color={ customTextColor }
								onChange={ ( color ) => setAttributes( { customTextColor: color } ) }
								enableAlpha={ false }
							/>
							<Button
								variant="tertiary"
								isDestructive
								onClick={ () => setAttributes( { customTextColor: '' } ) }
								style={ { marginBottom: '16px' } }
							>
								{ __( 'Zurücksetzen', 'dbw-base' ) }
							</Button>
						</>
					) : (
						<Button
							variant="secondary"
							onClick={ () => setAttributes( { customTextColor: '#333333' } ) }
							style={ { marginBottom: '16px', width: '100%', justifyContent: 'center' } }
						>
							{ __( '+ Textfarbe festlegen', 'dbw-base' ) }
						</Button>
					) }

					{ /* Heading / label color */ }
					<p style={ { margin: '0 0 6px', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase' } }>
						{ __( 'Überschriften & Labels', 'dbw-base' ) }
					</p>
					{ customHeadingColor ? (
						<>
							<ColorPicker
								color={ customHeadingColor }
								onChange={ ( color ) => setAttributes( { customHeadingColor: color } ) }
								enableAlpha={ false }
							/>
							<Button
								variant="tertiary"
								isDestructive
								onClick={ () => setAttributes( { customHeadingColor: '' } ) }
								style={ { marginBottom: '16px' } }
							>
								{ __( 'Zurücksetzen', 'dbw-base' ) }
							</Button>
						</>
					) : (
						<Button
							variant="secondary"
							onClick={ () => setAttributes( { customHeadingColor: '#000000' } ) }
							style={ { marginBottom: '16px', width: '100%', justifyContent: 'center' } }
						>
							{ __( '+ Überschriften-Farbe festlegen', 'dbw-base' ) }
						</Button>
					) }

					{ /* Social icon color */ }
					<p style={ { margin: '0 0 6px', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase' } }>
						{ __( 'Social Icons', 'dbw-base' ) }
					</p>
					{ customSocialColor ? (
						<>
							<ColorPicker
								color={ customSocialColor }
								onChange={ ( color ) => setAttributes( { customSocialColor: color } ) }
								enableAlpha={ false }
							/>
							<Button
								variant="tertiary"
								isDestructive
								onClick={ () => setAttributes( { customSocialColor: '' } ) }
							>
								{ __( 'Zurücksetzen', 'dbw-base' ) }
							</Button>
						</>
					) : (
						<Button
							variant="secondary"
							onClick={ () => setAttributes( { customSocialColor: '#000000' } ) }
							style={ { width: '100%', justifyContent: 'center' } }
						>
							{ __( '+ Social-Farbe festlegen', 'dbw-base' ) }
						</Button>
					) }

				</PanelBody>

				<PanelBody title={ __( 'Logo', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Logo anzeigen', 'dbw-base' ) }
						checked={ showLogo }
						onChange={ ( value ) => setAttributes( { showLogo: value } ) }
					/>
					{ showLogo && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectLogo }
									allowedTypes={ [ 'image' ] }
									value={ logoId }
									render={ ( { open } ) => (
										<div>
											{ logoUrl && (
												<img
													src={ logoUrl }
													alt={ logoAlt }
													style={ { width: '100%', marginBottom: '8px', borderRadius: '4px' } }
												/>
											) }
											<Button onClick={ open } variant="secondary" style={ { marginRight: '8px' } }>
												{ logoUrl ? __( 'Logo ändern', 'dbw-base' ) : __( 'Logo auswählen', 'dbw-base' ) }
											</Button>
											{ logoUrl && (
												<Button onClick={ onRemoveLogo } variant="tertiary" isDestructive>
													{ __( 'Entfernen', 'dbw-base' ) }
												</Button>
											) }
										</div>
									) }
								/>
							</MediaUploadCheck>
							<RangeControl
								label={ __( 'Breite (px)', 'dbw-base' ) }
								value={ logoWidth }
								onChange={ ( value ) => setAttributes( { logoWidth: value } ) }
								min={ 60 }
								max={ 400 }
								step={ 10 }
								style={ { marginTop: '12px' } }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Firmeninformationen', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Firmeninfo anzeigen', 'dbw-base' ) }
						checked={ showCompanyInfo }
						onChange={ ( value ) => setAttributes( { showCompanyInfo: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Öffnungszeiten', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Öffnungszeiten anzeigen', 'dbw-base' ) }
						checked={ showOpeningHours }
						onChange={ ( value ) => setAttributes( { showOpeningHours: value } ) }
					/>
					{ showOpeningHours && (
						<TextControl
							label={ __( 'Überschrift', 'dbw-base' ) }
							value={ openingHoursLabel }
							onChange={ ( value ) => setAttributes( { openingHoursLabel: value } ) }
						/>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Zusatzbild', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Zusatzbild anzeigen', 'dbw-base' ) }
						checked={ showSecondaryImage }
						onChange={ ( value ) => setAttributes( { showSecondaryImage: value } ) }
					/>
					{ showSecondaryImage && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectSecondaryImage }
									allowedTypes={ [ 'image' ] }
									value={ secondaryImageId }
									render={ ( { open } ) => (
										<div>
											{ secondaryImageUrl && (
												<img
													src={ secondaryImageUrl }
													alt={ secondaryImageAlt }
													style={ { width: '100%', marginBottom: '8px', borderRadius: '4px' } }
												/>
											) }
											<Button onClick={ open } variant="secondary" style={ { marginRight: '8px' } }>
												{ secondaryImageUrl ? __( 'Bild ändern', 'dbw-base' ) : __( 'Bild auswählen', 'dbw-base' ) }
											</Button>
											{ secondaryImageUrl && (
												<Button onClick={ onRemoveSecondaryImage } variant="tertiary" isDestructive>
													{ __( 'Entfernen', 'dbw-base' ) }
												</Button>
											) }
										</div>
									) }
								/>
							</MediaUploadCheck>
							<RangeControl
								label={ __( 'Max. Breite (px, 0 = voll)', 'dbw-base' ) }
								value={ secondaryImageMaxWidth }
								onChange={ ( value ) => setAttributes( { secondaryImageMaxWidth: value } ) }
								min={ 0 }
								max={ 800 }
								step={ 10 }
								style={ { marginTop: '12px' } }
							/>
							<URLInput
								label={ __( 'Link (optional)', 'dbw-base' ) }
								value={ secondaryImageLinkUrl }
								onChange={ ( value ) => setAttributes( { secondaryImageLinkUrl: value } ) }
							/>
							{ secondaryImageLinkUrl && (
								<ToggleControl
									label={ __( 'Im neuen Tab öffnen', 'dbw-base' ) }
									checked={ secondaryImageLinkNewTab }
									onChange={ ( value ) => setAttributes( { secondaryImageLinkNewTab: value } ) }
								/>
							) }
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Social Media', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Social Links anzeigen', 'dbw-base' ) }
						checked={ showSocialLinks }
						onChange={ ( value ) => setAttributes( { showSocialLinks: value } ) }
					/>
					{ showSocialLinks && (
						<>
							<SelectControl
								label={ __( 'Icon-Stil', 'dbw-base' ) }
								value={ socialIconStyle }
								options={ SOCIAL_STYLE_OPTIONS }
								onChange={ ( value ) => setAttributes( { socialIconStyle: value } ) }
							/>
							{ socialLinks.map( ( link, index ) => (
								<div
									key={ index }
									style={ {
										marginBottom: '12px',
										padding: '10px',
										background: 'rgba(0,0,0,0.04)',
										borderRadius: '4px',
									} }
								>
									<SelectControl
										label={ __( 'Netzwerk', 'dbw-base' ) }
										value={ link.platform }
										options={ SOCIAL_PLATFORMS }
										onChange={ ( value ) => updateSocialLink( index, 'platform', value ) }
									/>
									<TextControl
										label={ __( 'URL', 'dbw-base' ) }
										value={ link.url }
										onChange={ ( value ) => updateSocialLink( index, 'url', value ) }
										placeholder="https://…"
									/>
									<Button
										variant="tertiary"
										isDestructive
										onClick={ () => removeSocialLink( index ) }
										style={ { marginTop: '4px' } }
									>
										{ __( 'Entfernen', 'dbw-base' ) }
									</Button>
								</div>
							) ) }
							<Button
								variant="secondary"
								onClick={ addSocialLink }
								style={ { width: '100%', justifyContent: 'center' } }
							>
								{ __( '+ Netzwerk hinzufügen', 'dbw-base' ) }
							</Button>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Rechtliches & Trennlinie', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Trennlinie anzeigen', 'dbw-base' ) }
						checked={ showDivider }
						onChange={ ( value ) => setAttributes( { showDivider: value } ) }
					/>

					<ToggleControl
						label={ __( 'Impressum anzeigen', 'dbw-base' ) }
						checked={ showImpressum }
						onChange={ ( value ) => setAttributes( { showImpressum: value } ) }
					/>
					{ showImpressum && (
						<>
							<URLInput
								label={ __( 'Impressum-Link', 'dbw-base' ) }
								value={ impressumUrl }
								onChange={ ( value ) => setAttributes( { impressumUrl: value } ) }
							/>
							<ToggleControl
								label={ __( 'Im neuen Tab öffnen', 'dbw-base' ) }
								checked={ impressumNewTab }
								onChange={ ( value ) => setAttributes( { impressumNewTab: value } ) }
							/>
						</>
					) }

					<ToggleControl
						label={ __( 'AGB anzeigen', 'dbw-base' ) }
						checked={ showAgb }
						onChange={ ( value ) => setAttributes( { showAgb: value } ) }
					/>
					{ showAgb && (
						<>
							<URLInput
								label={ __( 'AGB-Link', 'dbw-base' ) }
								value={ agbUrl }
								onChange={ ( value ) => setAttributes( { agbUrl: value } ) }
							/>
							<ToggleControl
								label={ __( 'Im neuen Tab öffnen', 'dbw-base' ) }
								checked={ agbNewTab }
								onChange={ ( value ) => setAttributes( { agbNewTab: value } ) }
							/>
						</>
					) }

					<ToggleControl
						label={ __( 'Datenschutz anzeigen', 'dbw-base' ) }
						checked={ showDatenschutz }
						onChange={ ( value ) => setAttributes( { showDatenschutz: value } ) }
					/>
					{ showDatenschutz && (
						<>
							<URLInput
								label={ __( 'Datenschutz-Link', 'dbw-base' ) }
								value={ datenschutzUrl }
								onChange={ ( value ) => setAttributes( { datenschutzUrl: value } ) }
							/>
							<ToggleControl
								label={ __( 'Im neuen Tab öffnen', 'dbw-base' ) }
								checked={ datenschutzNewTab }
								onChange={ ( value ) => setAttributes( { datenschutzNewTab: value } ) }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Scroll-to-Top', 'dbw-base' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Scroll-to-Top anzeigen', 'dbw-base' ) }
						checked={ showScrollTop }
						onChange={ ( value ) => setAttributes( { showScrollTop: value } ) }
					/>
					{ showScrollTop && (
						<TextControl
							label={ __( 'Anchor-Link', 'dbw-base' ) }
							value={ scrollTopAnchor }
							onChange={ ( value ) => setAttributes( { scrollTopAnchor: value } ) }
							help={ __( 'z. B. #top oder #header', 'dbw-base' ) }
						/>
					) }
				</PanelBody>

			</InspectorControls>

			{ /* ── CANVAS ──────────────────────────────────────────── */ }
			<footer { ...blockProps }>
				<div className="wp-block-dbw-base-footer-info__inner">

					{ /* Logo */ }
					{ showLogo && (
						<div className="wp-block-dbw-base-footer-info__logo-wrap">
							{ logoUrl ? (
								<img
									className="wp-block-dbw-base-footer-info__logo"
									src={ logoUrl }
									alt={ logoAlt }
									style={ { width: `${ logoWidth }px` } }
								/>
							) : (
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ onSelectLogo }
										allowedTypes={ [ 'image' ] }
										value={ logoId }
										render={ ( { open } ) => (
											<div
												className="wp-block-dbw-base-footer-info__logo-placeholder"
												onClick={ open }
												onKeyDown={ ( e ) => e.key === 'Enter' && open() }
												role="button"
												tabIndex={ 0 }
											>
												<span>{ __( 'Logo auswählen', 'dbw-base' ) }</span>
											</div>
										) }
									/>
								</MediaUploadCheck>
							) }
						</div>
					) }

					{ /* Main content */ }
					{ hasMain && (
						<div className={ `wp-block-dbw-base-footer-info__main${ hasRightCol ? ' has-columns' : '' }${ stackedLayout ? ' is-stacked' : '' }` }>

							{ /* Company info */ }
							{ showCompanyInfo && (
								<div className="wp-block-dbw-base-footer-info__company">
									<RichText
										tagName="p"
										className="wp-block-dbw-base-footer-info__company-name"
										value={ companyName }
										onChange={ ( value ) => setAttributes( { companyName: value } ) }
										placeholder={ __( 'Firmenname…', 'dbw-base' ) }
										allowedFormats={ [ 'core/bold' ] }
									/>
									<RichText
										tagName="p"
										className="wp-block-dbw-base-footer-info__address"
										value={ companyAddress }
										onChange={ ( value ) => setAttributes( { companyAddress: value } ) }
										placeholder={ __( 'Straße · PLZ Ort…', 'dbw-base' ) }
										allowedFormats={ [ 'core/bold', 'core/link' ] }
									/>
									<RichText
										tagName="p"
										className="wp-block-dbw-base-footer-info__extra"
										value={ companyExtra }
										onChange={ ( value ) => setAttributes( { companyExtra: value } ) }
										placeholder={ __( 'Zusätzliche Information…', 'dbw-base' ) }
										allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
									/>
								</div>
							) }

							{ /* Opening hours (in stacked mode rendered directly in main, not in aside) */ }
							{ showOpeningHours && (
								<div className="wp-block-dbw-base-footer-info__hours">
									<strong className="wp-block-dbw-base-footer-info__hours-label">
										{ openingHoursLabel || __( 'Öffnungszeiten', 'dbw-base' ) }
									</strong>
									<RichText
										tagName="div"
										className="wp-block-dbw-base-footer-info__hours-text"
										value={ openingHoursText }
										onChange={ ( value ) => setAttributes( { openingHoursText: value } ) }
										placeholder={ __( 'Mo–Fr: 09:00–18:00…', 'dbw-base' ) }
										allowedFormats={ [ 'core/bold' ] }
									/>
								</div>
							) }

							{ /* Secondary image (in stacked mode rendered directly in main) */ }
							{ showSecondaryImage && (
								<div
									className="wp-block-dbw-base-footer-info__image-wrap"
									style={ secondaryImageMaxWidth > 0 ? { maxWidth: `${ secondaryImageMaxWidth }px` } : undefined }
								>
									{ secondaryImageUrl ? (
										<img
											className="wp-block-dbw-base-footer-info__image"
											src={ secondaryImageUrl }
											alt={ secondaryImageAlt }
										/>
									) : (
										<MediaUploadCheck>
											<MediaUpload
												onSelect={ onSelectSecondaryImage }
												allowedTypes={ [ 'image' ] }
												value={ secondaryImageId }
												render={ ( { open } ) => (
													<div
														className="wp-block-dbw-base-footer-info__image-placeholder"
														onClick={ open }
														onKeyDown={ ( e ) => e.key === 'Enter' && open() }
														role="button"
														tabIndex={ 0 }
													>
														<span>{ __( 'Zusatzbild auswählen', 'dbw-base' ) }</span>
													</div>
												) }
											/>
										</MediaUploadCheck>
									) }
								</div>
							) }

						</div>
					) }

					{ /* Social Links */ }
					{ showSocialLinks && socialLinks.length > 0 && (
						<div className={ `wp-block-dbw-base-footer-info__social is-social-style-${ socialIconStyle }` }>
							{ socialLinks.map( ( link, index ) => (
								<span
									key={ index }
									className="wp-block-dbw-base-footer-info__social-link"
									title={ link.platform }
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={ { __html: getSocialSvg( link.platform ) } }
								/>
							) ) }
						</div>
					) }

					{ /* Divider */ }
					{ showDivider && (
						<hr className="wp-block-dbw-base-footer-info__divider" aria-hidden="true" />
					) }

					{ /* Bottom bar */ }
					{ hasBottom && (
						<div className="wp-block-dbw-base-footer-info__bottom">
							{ hasLegal && (
								<nav
									className="wp-block-dbw-base-footer-info__legal"
									aria-label={ __( 'Rechtliche Links', 'dbw-base' ) }
								>
									{ showImpressum && (
										<span className="wp-block-dbw-base-footer-info__legal-link">
											{ __( 'Impressum', 'dbw-base' ) }
										</span>
									) }
									{ showAgb && (
										<span className="wp-block-dbw-base-footer-info__legal-link">
											{ __( 'AGB', 'dbw-base' ) }
										</span>
									) }
									{ showDatenschutz && (
										<span className="wp-block-dbw-base-footer-info__legal-link">
											{ __( 'Datenschutz', 'dbw-base' ) }
										</span>
									) }
								</nav>
							) }
						</div>
					) }

				</div>

				{ /* Scroll-to-Top – fixed bottom right (position:fixed via CSS) */ }
				{ showScrollTop && (
					<span
						className="wp-block-dbw-base-footer-info__scroll-top"
						aria-label={ __( 'Nach oben scrollen', 'dbw-base' ) }
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<polyline points="18 15 12 9 6 15" />
						</svg>
					</span>
				) }

			</footer>
		</>
	);
}
