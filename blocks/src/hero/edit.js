/**
 * Hero Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		text,
		primaryButtonText,
		primaryButtonUrl,
		secondaryButtonText,
		secondaryButtonUrl,
		mediaId,
		mediaUrl,
		mediaAlt,
		overlayOpacity,
		minHeight,
		layout,
		showScrollIndicator,
	} = attributes;

	const blockProps = useBlockProps({
		className: `is-layout-${layout}`,
		style: {
			minHeight,
		},
	});

	const onSelectMedia = (media) => {
		const url =
			media.sizes?.large?.url ||
			media.sizes?.full?.url ||
			media.url;
		setAttributes({
			mediaId: media.id,
			mediaUrl: url,
			mediaAlt: media.alt || '',
		});
	};

	const onRemoveMedia = () => {
		setAttributes({
			mediaId: undefined,
			mediaUrl: undefined,
			mediaAlt: '',
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Layout', 'dbw-base')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Text-Ausrichtung', 'dbw-base')}
						value={layout}
						options={[
							{
								label: __('Links', 'dbw-base'),
								value: 'text-left',
							},
							{
								label: __('Zentriert', 'dbw-base'),
								value: 'text-center',
							},
							{
								label: __('Rechts', 'dbw-base'),
								value: 'text-right',
							},
						]}
						onChange={(value) =>
							setAttributes({ layout: value })
						}
					/>
					<UnitControl
						label={__('Mindesthöhe', 'dbw-base')}
						value={minHeight}
						onChange={(value) =>
							setAttributes({ minHeight: value })
						}
						units={[
							{ value: 'vh', label: 'vh' },
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
						]}
					/>
					<ToggleControl
						label={__('Scroll-Indikator', 'dbw-base')}
						help={
							showScrollIndicator
								? __(
										'Animierter Pfeil am unteren Rand sichtbar.',
										'dbw-base'
									)
								: __(
										'Kein Scroll-Hinweis.',
										'dbw-base'
									)
						}
						checked={showScrollIndicator}
						onChange={(value) =>
							setAttributes({
								showScrollIndicator: value,
							})
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Hintergrundbild', 'dbw-base')}
					initialOpen={false}
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectMedia}
							allowedTypes={['image']}
							value={mediaId}
							render={({ open }) => (
								<div>
									{mediaUrl && (
										<img
											src={mediaUrl}
											alt={mediaAlt}
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
										{mediaUrl
											? __(
													'Bild ändern',
													'dbw-base'
												)
											: __(
													'Bild auswählen',
													'dbw-base'
												)}
									</Button>
									{mediaUrl && (
										<Button
											onClick={onRemoveMedia}
											variant="tertiary"
											isDestructive
										>
											{__('Entfernen', 'dbw-base')}
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
					{mediaUrl && (
						<>
							<TextControl
								label={__('Alt-Text', 'dbw-base')}
								value={mediaAlt}
								onChange={(value) =>
									setAttributes({ mediaAlt: value })
								}
								style={{ marginTop: '12px' }}
							/>
							<RangeControl
								label={__(
									'Overlay-Abdunklung',
									'dbw-base'
								)}
								value={overlayOpacity}
								onChange={(value) =>
									setAttributes({
										overlayOpacity: value,
									})
								}
								min={0}
								max={90}
								step={5}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Primärer Button', 'dbw-base')}
					initialOpen={false}
				>
					<TextControl
						label={__('Button-Text', 'dbw-base')}
						value={primaryButtonText}
						onChange={(value) =>
							setAttributes({ primaryButtonText: value })
						}
						placeholder={__('Jetzt entdecken', 'dbw-base')}
					/>
					{primaryButtonText && (
						<URLInput
							label={__('Button-Link', 'dbw-base')}
							value={primaryButtonUrl}
							onChange={(value) =>
								setAttributes({
									primaryButtonUrl: value,
								})
							}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Sekundärer Button', 'dbw-base')}
					initialOpen={false}
				>
					<TextControl
						label={__('Button-Text', 'dbw-base')}
						value={secondaryButtonText}
						onChange={(value) =>
							setAttributes({
								secondaryButtonText: value,
							})
						}
						placeholder={__('Mehr erfahren', 'dbw-base')}
					/>
					{secondaryButtonText && (
						<URLInput
							label={__('Button-Link', 'dbw-base')}
							value={secondaryButtonUrl}
							onChange={(value) =>
								setAttributes({
									secondaryButtonUrl: value,
								})
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{mediaUrl && (
					<img
						className="wp-block-dbw-base-hero__media"
						src={mediaUrl}
						alt={mediaAlt}
						aria-hidden="true"
					/>
				)}
				{mediaUrl && (
					<div
						className="wp-block-dbw-base-hero__overlay"
						style={{
							opacity: overlayOpacity / 100,
						}}
						aria-hidden="true"
					/>
				)}
				<div className="wp-block-dbw-base-hero__content">
					<RichText
						tagName="h1"
						className="wp-block-dbw-base-hero__heading"
						value={heading}
						onChange={(value) =>
							setAttributes({ heading: value })
						}
						placeholder={__(
							'Deine Überschrift hier…',
							'dbw-base'
						)}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/text-color',
						]}
					/>
					<RichText
						tagName="p"
						className="wp-block-dbw-base-hero__text"
						value={text}
						onChange={(value) =>
							setAttributes({ text: value })
						}
						placeholder={__(
							'Beschreibungstext, der deine Besucher überzeugt…',
							'dbw-base'
						)}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/link',
						]}
					/>
					{(primaryButtonText || secondaryButtonText) && (
						<div className="wp-block-dbw-base-hero__buttons">
							{primaryButtonText && (
								<span className="wp-block-dbw-base-hero__button is-primary">
									{primaryButtonText}
								</span>
							)}
							{secondaryButtonText && (
								<span className="wp-block-dbw-base-hero__button is-secondary">
									{secondaryButtonText}
								</span>
							)}
						</div>
					)}
				</div>
				{showScrollIndicator && (
					<div
						className="wp-block-dbw-base-hero__scroll"
						aria-hidden="true"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</div>
				)}
			</div>
		</>
	);
}
