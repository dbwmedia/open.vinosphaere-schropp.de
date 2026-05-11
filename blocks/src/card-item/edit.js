/**
 * Card Item Block – Editor Component
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
import { PanelBody, Button, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const {
		mediaId,
		mediaUrl,
		mediaAlt,
		heading,
		text,
		linkText,
		linkUrl,
	} = attributes;

	const blockProps = useBlockProps();

	const onSelectMedia = (media) => {
		const url = media.sizes?.medium_large?.url || media.sizes?.large?.url || media.url;
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
				<PanelBody title={__('Bild', 'dbw-base')} initialOpen={true}>
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

				<PanelBody title={__('Link', 'dbw-base')} initialOpen={false}>
					<TextControl
						label={__('Link-Text', 'dbw-base')}
						value={linkText}
						onChange={(value) => setAttributes({ linkText: value })}
						placeholder={__('Mehr erfahren', 'dbw-base')}
					/>
					{linkText && (
						<URLInput
							label={__('Link-URL', 'dbw-base')}
							value={linkUrl}
							onChange={(value) => setAttributes({ linkUrl: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{mediaUrl ? (
					<div className="wp-block-dbw-base-card-item__image">
						<img src={mediaUrl} alt={mediaAlt} />
					</div>
				) : (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectMedia}
							allowedTypes={['image']}
							value={mediaId}
							render={({ open }) => (
								<div
									className="wp-block-dbw-base-card-item__image-placeholder"
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
				<div className="wp-block-dbw-base-card-item__body">
					<RichText
						tagName="h3"
						className="wp-block-dbw-base-card-item__heading"
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
						placeholder={__('Überschrift…', 'dbw-base')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
					<RichText
						tagName="p"
						className="wp-block-dbw-base-card-item__text"
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						placeholder={__('Beschreibungstext…', 'dbw-base')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
					{linkText && (
						<span className="wp-block-dbw-base-card-item__link">
							{linkText} &rarr;
						</span>
					)}
				</div>
			</div>
		</>
	);
}
