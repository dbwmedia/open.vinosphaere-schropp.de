/**
 * CTA-Banner Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';

const STYLE_OPTIONS = [
	{ label: __('Primär (Brand)', 'dbw-base'), value: 'primary' },
	{ label: __('Dunkel', 'dbw-base'), value: 'dark' },
];

const PADDING_OPTIONS = [
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		text,
		buttonText,
		buttonUrl,
		style,
		paddingSize,
	} = attributes;

	const blockProps = useBlockProps({
		className: `is-style-${style} is-padding-${paddingSize}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Design', 'dbw-base')} initialOpen={true}>
					<SelectControl
						label={__('Stil', 'dbw-base')}
						value={style}
						options={STYLE_OPTIONS}
						onChange={(value) => setAttributes({ style: value })}
					/>
					<SelectControl
						label={__('Vertikaler Abstand', 'dbw-base')}
						value={paddingSize}
						options={PADDING_OPTIONS}
						onChange={(value) => setAttributes({ paddingSize: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Button', 'dbw-base')} initialOpen={true}>
					<TextControl
						label={__('Button-Text', 'dbw-base')}
						value={buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
						placeholder={__('Jetzt starten', 'dbw-base')}
					/>
					{buttonText && (
						<URLInput
							label={__('Button-Link', 'dbw-base')}
							value={buttonUrl}
							onChange={(value) => setAttributes({ buttonUrl: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				<div className="wp-block-dbw-base-cta-banner__content">
					<RichText
						tagName="h2"
						className="wp-block-dbw-base-cta-banner__heading"
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
						placeholder={__('Überzeugende Headline…', 'dbw-base')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
					<RichText
						tagName="p"
						className="wp-block-dbw-base-cta-banner__text"
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						placeholder={__('Kurzer überzeugender Text…', 'dbw-base')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
					{buttonText && (
						<span className="wp-block-dbw-base-cta-banner__button">
							{buttonText}
						</span>
					)}
				</div>
			</section>
		</>
	);
}
