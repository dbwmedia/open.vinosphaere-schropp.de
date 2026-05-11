/**
 * Stat-Counter Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	RangeControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { number, suffix, prefix, label, duration } = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Zähler', 'dbw-base')} initialOpen={true}>
					<NumberControl
						label={__('Zielwert', 'dbw-base')}
						value={number}
						onChange={(value) =>
							setAttributes({ number: parseInt(value, 10) || 0 })
						}
						min={0}
						max={999999}
					/>
					<TextControl
						label={__('Prefix', 'dbw-base')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder={__('z.B. €', 'dbw-base')}
					/>
					<TextControl
						label={__('Suffix', 'dbw-base')}
						value={suffix}
						onChange={(value) => setAttributes({ suffix: value })}
						placeholder={__('z.B. +, %, k', 'dbw-base')}
					/>
					<RangeControl
						label={__('Animation-Dauer (ms)', 'dbw-base')}
						value={duration}
						onChange={(value) => setAttributes({ duration: value })}
						min={500}
						max={5000}
						step={250}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="wp-block-dbw-base-stat-counter__number">
					{prefix}{number}{suffix}
				</div>
				<RichText
					tagName="span"
					className="wp-block-dbw-base-stat-counter__label"
					value={label}
					onChange={(value) => setAttributes({ label: value })}
					placeholder={__('Label-Text…', 'dbw-base')}
					allowedFormats={[]}
				/>
			</div>
		</>
	);
}
