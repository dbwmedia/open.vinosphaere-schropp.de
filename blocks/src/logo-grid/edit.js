/**
 * Logo-Grid Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, Button, RangeControl, SelectControl } from '@wordpress/components';

const PADDING_OPTIONS = [
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

export default function Edit({ attributes, setAttributes }) {
	const { logos, columns, paddingSize } = attributes;

	const blockProps = useBlockProps({
		className: `has-${columns}-columns is-padding-${paddingSize}`,
	});

	const onSelectLogos = (media) => {
		const newLogos = media.map((item) => ({
			id: item.id,
			url: item.sizes?.medium?.url || item.url,
			alt: item.alt || '',
		}));
		setAttributes({ logos: newLogos });
	};

	const onRemoveLogo = (index) => {
		const newLogos = [...logos];
		newLogos.splice(index, 1);
		setAttributes({ logos: newLogos });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'dbw-base')} initialOpen={true}>
					<RangeControl
						label={__('Spalten', 'dbw-base')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={3}
						max={6}
						step={1}
					/>
					<SelectControl
						label={__('Vertikaler Abstand', 'dbw-base')}
						value={paddingSize}
						options={PADDING_OPTIONS}
						onChange={(value) => setAttributes({ paddingSize: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Logos', 'dbw-base')} initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectLogos}
							allowedTypes={['image']}
							multiple
							gallery
							value={logos.map((l) => l.id)}
							render={({ open }) => (
								<Button onClick={open} variant="secondary">
									{logos.length
										? __('Logos verwalten', 'dbw-base')
										: __('Logos auswählen', 'dbw-base')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				{logos.length > 0 ? (
					<div className="wp-block-dbw-base-logo-grid__grid">
						{logos.map((logo, index) => (
							<div className="wp-block-dbw-base-logo-grid__item" key={logo.id || index}>
								<img src={logo.url} alt={logo.alt} />
								<Button
									className="wp-block-dbw-base-logo-grid__remove"
									icon="no-alt"
									label={__('Entfernen', 'dbw-base')}
									onClick={() => onRemoveLogo(index)}
									isDestructive
									isSmall
								/>
							</div>
						))}
					</div>
				) : (
					<div className="wp-block-dbw-base-logo-grid__placeholder">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectLogos}
								allowedTypes={['image']}
								multiple
								gallery
								render={({ open }) => (
									<Button onClick={open} variant="secondary" icon="plus-alt2">
										{__('Logos hinzufügen', 'dbw-base')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				)}
			</section>
		</>
	);
}
