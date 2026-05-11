/**
 * Split-Content Block – Editor Component
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
	BlockControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

const PADDING_OPTIONS = [
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

const BUTTON_STYLE_OPTIONS = [
	{ label: __('Primär (ausgefüllt)', 'dbw-base'), value: 'primary' },
	{ label: __('Sekundär (transparent)', 'dbw-base'), value: 'secondary' },
	{ label: __('Outline (Rahmen)', 'dbw-base'), value: 'outline' },
	{ label: __('Outline Invertiert (für dunkle Flächen)', 'dbw-base'), value: 'outline-inverted' },
];

export default function Edit({ attributes, setAttributes }) {
	const {
		mediaId,
		mediaUrl,
		mediaAlt,
		heading,
		text,
		buttons,
		imageRight,
		paddingSize,
	} = attributes;

	const safeButtons = buttons || [];

	const blockProps = useBlockProps({
		className: [
			imageRight ? 'is-image-right' : '',
			`is-padding-${paddingSize}`,
		].filter(Boolean).join(' '),
	});

	const onSelectMedia = (media) => {
		const url = media.sizes?.large?.url || media.sizes?.full?.url || media.url;
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

	const addButton = () => {
		setAttributes({
			buttons: [...safeButtons, { text: '', url: '', style: 'primary', newTab: false }],
		});
	};

	const removeButton = (index) => {
		setAttributes({
			buttons: safeButtons.filter((_, i) => i !== index),
		});
	};

	const updateButton = (index, key, value) => {
		setAttributes({
			buttons: safeButtons.map((btn, i) =>
				i === index ? { ...btn, [key]: value } : btn
			),
		});
	};

	const moveButton = (fromIndex, toIndex) => {
		const newButtons = [...safeButtons];
		const [moved] = newButtons.splice(fromIndex, 1);
		newButtons.splice(toIndex, 0, moved);
		setAttributes({ buttons: newButtons });
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="image-flip-horizontal"
						label={__('Bild spiegeln', 'dbw-base')}
						isActive={imageRight}
						onClick={() => setAttributes({ imageRight: !imageRight })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Layout', 'dbw-base')} initialOpen={true}>
					<ToggleControl
						label={__('Bild rechts anzeigen', 'dbw-base')}
						help={
							imageRight
								? __('Bild rechts, Text links.', 'dbw-base')
								: __('Bild links, Text rechts.', 'dbw-base')
						}
						checked={imageRight}
						onChange={(value) => setAttributes({ imageRight: value })}
					/>
					<SelectControl
						label={__('Vertikaler Abstand', 'dbw-base')}
						value={paddingSize}
						options={PADDING_OPTIONS}
						onChange={(value) => setAttributes({ paddingSize: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Bild', 'dbw-base')} initialOpen={false}>
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
											? __('Bild ändern', 'dbw-base')
											: __('Bild auswählen', 'dbw-base')}
									</Button>
									{mediaUrl && (
										<Button onClick={onRemoveMedia} variant="tertiary" isDestructive>
											{__('Entfernen', 'dbw-base')}
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
					{mediaUrl && (
						<TextControl
							label={__('Alt-Text', 'dbw-base')}
							value={mediaAlt}
							onChange={(value) => setAttributes({ mediaAlt: value })}
							style={{ marginTop: '12px' }}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={
						safeButtons.length > 0
							? `${__('Buttons', 'dbw-base')} (${safeButtons.length})`
							: __('Buttons', 'dbw-base')
					}
					initialOpen={false}
				>
					{safeButtons.map((btn, index) => (
						<div
							key={index}
							style={{
								borderTop: index > 0 ? '1px solid #e0e0e0' : 'none',
								paddingTop: index > 0 ? '16px' : '0',
								marginBottom: '16px',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '10px',
								}}
							>
								<strong style={{ fontSize: '12px', color: '#1e1e1e' }}>
									{`Button ${index + 1}`}
								</strong>
								<div style={{ display: 'flex', gap: '2px' }}>
									{index > 0 && (
										<Button
											icon="arrow-up-alt2"
											label={__('Nach oben', 'dbw-base')}
											onClick={() => moveButton(index, index - 1)}
											size="small"
										/>
									)}
									{index < safeButtons.length - 1 && (
										<Button
											icon="arrow-down-alt2"
											label={__('Nach unten', 'dbw-base')}
											onClick={() => moveButton(index, index + 1)}
											size="small"
										/>
									)}
									<Button
										icon="no-alt"
										label={__('Entfernen', 'dbw-base')}
										onClick={() => removeButton(index)}
										size="small"
										isDestructive
									/>
								</div>
							</div>

							<TextControl
								label={__('Button-Text', 'dbw-base')}
								value={btn.text}
								onChange={(value) => updateButton(index, 'text', value)}
								placeholder={__('Mehr erfahren', 'dbw-base')}
							/>

							{btn.text && (
								<URLInput
									label={__('Button-Link', 'dbw-base')}
									value={btn.url}
									onChange={(value) => updateButton(index, 'url', value)}
								/>
							)}

							<SelectControl
								label={__('Button-Stil', 'dbw-base')}
								value={btn.style}
								options={BUTTON_STYLE_OPTIONS}
								onChange={(value) => updateButton(index, 'style', value)}
							/>

							<ToggleControl
								label={__('In neuem Tab öffnen', 'dbw-base')}
								checked={btn.newTab}
								onChange={(value) => updateButton(index, 'newTab', value)}
								__nextHasNoMarginBottom
							/>
						</div>
					))}

					<Button
						variant="secondary"
						onClick={addButton}
						style={{
							width: '100%',
							justifyContent: 'center',
							marginTop: safeButtons.length > 0 ? '8px' : '0',
						}}
					>
						{__('+ Button hinzufügen', 'dbw-base')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				<div className="wp-block-dbw-base-split-content__media">
					{mediaUrl ? (
						<img src={mediaUrl} alt={mediaAlt} />
					) : (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectMedia}
								allowedTypes={['image']}
								value={mediaId}
								render={({ open }) => (
									<div
										className="wp-block-dbw-base-split-content__placeholder"
										onClick={open}
										onKeyDown={(e) => e.key === 'Enter' && open()}
										role="button"
										tabIndex={0}
									>
										<span>{__('Bild auswählen', 'dbw-base')}</span>
									</div>
								)}
							/>
						</MediaUploadCheck>
					)}
				</div>
				<div className="wp-block-dbw-base-split-content__body">
					<RichText
						tagName="h2"
						className="wp-block-dbw-base-split-content__heading"
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
						placeholder={__('Überschrift…', 'dbw-base')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
					<RichText
						tagName="p"
						className="wp-block-dbw-base-split-content__text"
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						placeholder={__('Beschreibungstext…', 'dbw-base')}
						allowedFormats={['core/bold', 'core/italic', 'core/link']}
					/>
					{safeButtons.some((btn) => btn.text) && (
						<div className="wp-block-dbw-base-split-content__buttons">
							{safeButtons
								.filter((btn) => btn.text)
								.map((btn, index) => (
									<span
										key={index}
										className={`wp-block-dbw-base-split-content__button is-style-${btn.style}`}
									>
										{btn.text}
									</span>
								))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
