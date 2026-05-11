/**
 * Section Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
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
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

const BG_COLOR_OPTIONS = [
	{ label: __('Keine', 'dbw-base'), value: '' },
	{ label: __('Hintergrund (Hell)', 'dbw-base'), value: 'base-bg' },
	{ label: __('Primär (Brand)', 'dbw-base'), value: 'primary' },
	{ label: __('Sekundär', 'dbw-base'), value: 'secondary' },
	{ label: __('Dunkelgrau', 'dbw-base'), value: 'dark-grey' },
	{ label: __('Eigene Farbe', 'dbw-base'), value: 'custom' },
];

export default function Edit({ attributes, setAttributes }) {
	const {
		paddingSize,
		backgroundColor,
		customBackgroundColor,
		contentAlign,
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageAlt,
		overlayOpacity,
	} = attributes;

	const isDark     = backgroundColor === 'dark-grey' || backgroundColor === 'secondary' || backgroundImageUrl;
	const isCentered = contentAlign === 'center';

	const customBgStyle =
		backgroundColor === 'custom' && customBackgroundColor
			? { backgroundColor: customBackgroundColor }
			: {};

	const blockProps = useBlockProps({
		className: [
			`is-padding-${paddingSize}`,
			backgroundColor && backgroundColor !== 'custom' ? `has-bg-${backgroundColor}` : '',
			backgroundImageUrl ? 'has-bg-image' : '',
			isDark ? 'is-style-dark' : '',
			isCentered ? 'is-content-centered' : '',
		]
			.filter(Boolean)
			.join(' '),
		style: customBgStyle,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-dbw-base-section__inner' },
		{
			templateLock: false,
			renderAppender: () => <useInnerBlocksProps.DefaultBlockAppender />,
		}
	);

	const onSelectMedia = (media) => {
		const url = media.sizes?.large?.url || media.sizes?.full?.url || media.url;
		setAttributes({
			backgroundImageId: media.id,
			backgroundImageUrl: url,
			backgroundImageAlt: media.alt || '',
		});
	};

	const onRemoveMedia = () => {
		setAttributes({
			backgroundImageId: undefined,
			backgroundImageUrl: undefined,
			backgroundImageAlt: '',
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'dbw-base')} initialOpen={true}>
					<SelectControl
						label={__('Innenabstand', 'dbw-base')}
						value={paddingSize}
						options={PADDING_OPTIONS}
						onChange={(value) => setAttributes({ paddingSize: value })}
					/>
					<ToggleControl
						label={__('Content zentrieren', 'dbw-base')}
						checked={isCentered}
						onChange={(value) => setAttributes({ contentAlign: value ? 'center' : 'left' })}
					/>
					<SelectControl
						label={__('Hintergrundfarbe', 'dbw-base')}
						value={backgroundColor}
						options={BG_COLOR_OPTIONS}
						onChange={(value) => setAttributes({ backgroundColor: value })}
					/>
					{backgroundColor === 'custom' && (
						<div style={{ marginTop: '8px' }}>
							<p style={{ margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 500 }}>
								{__('Eigene Farbe wählen', 'dbw-base')}
							</p>
							<ColorPicker
								color={customBackgroundColor || '#ffffff'}
								onChange={(color) => setAttributes({ customBackgroundColor: color })}
								enableAlpha={false}
							/>
						</div>
					)}
				</PanelBody>

				<PanelBody title={__('Hintergrundbild', 'dbw-base')} initialOpen={false}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectMedia}
							allowedTypes={['image']}
							value={backgroundImageId}
							render={({ open }) => (
								<div>
									{backgroundImageUrl && (
										<img
											src={backgroundImageUrl}
											alt={backgroundImageAlt}
											style={{
												width: '100%',
												marginBottom: '8px',
												borderRadius: '4px',
											}}
										/>
									)}
									<Button
										onClick={open}
										variant="secondary"
										style={{ marginRight: '8px' }}
									>
										{backgroundImageUrl
											? __('Bild ändern', 'dbw-base')
											: __('Bild auswählen', 'dbw-base')}
									</Button>
									{backgroundImageUrl && (
										<Button onClick={onRemoveMedia} variant="tertiary" isDestructive>
											{__('Entfernen', 'dbw-base')}
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
					{backgroundImageUrl && (
						<>
							<TextControl
								label={__('Alt-Text', 'dbw-base')}
								value={backgroundImageAlt}
								onChange={(value) => setAttributes({ backgroundImageAlt: value })}
								style={{ marginTop: '12px' }}
							/>
							<RangeControl
								label={__('Overlay-Abdunklung', 'dbw-base')}
								value={overlayOpacity}
								onChange={(value) => setAttributes({ overlayOpacity: value })}
								min={0}
								max={90}
								step={5}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				{backgroundImageUrl && (
					<img
						className="wp-block-dbw-base-section__media"
						src={backgroundImageUrl}
						alt={backgroundImageAlt}
						aria-hidden="true"
					/>
				)}
				{backgroundImageUrl && (
					<div
						className="wp-block-dbw-base-section__overlay"
						style={{ opacity: overlayOpacity / 100 }}
						aria-hidden="true"
					/>
				)}
				<div {...innerBlocksProps} />
			</section>
		</>
	);
}
