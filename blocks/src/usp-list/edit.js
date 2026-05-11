/**
 * USP Icon-List Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

const PADDING_OPTIONS = [
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

const TEMPLATE = [
	['dbw-base/usp-item'],
	['dbw-base/usp-item'],
	['dbw-base/usp-item'],
];

export default function Edit({ attributes, setAttributes }) {
	const { columns, paddingSize } = attributes;

	const blockProps = useBlockProps({
		className: `has-${columns}-columns is-padding-${paddingSize}`,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-dbw-base-usp-list__grid' },
		{
			allowedBlocks: ['dbw-base/usp-item'],
			template: TEMPLATE,
			orientation: 'horizontal',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'dbw-base')} initialOpen={true}>
					<RangeControl
						label={__('Spalten', 'dbw-base')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={2}
						max={4}
						step={1}
					/>
					<SelectControl
						label={__('Vertikaler Abstand', 'dbw-base')}
						value={paddingSize}
						options={PADDING_OPTIONS}
						onChange={(value) => setAttributes({ paddingSize: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				<div {...innerBlocksProps} />
			</section>
		</>
	);
}
