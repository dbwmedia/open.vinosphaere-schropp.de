/**
 * Accordion Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

const PADDING_OPTIONS = [
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

const TEMPLATE = [
	['dbw-base/accordion-item'],
	['dbw-base/accordion-item'],
	['dbw-base/accordion-item'],
];

export default function Edit({ attributes, setAttributes }) {
	const { paddingSize } = attributes;

	const blockProps = useBlockProps({
		className: `is-padding-${paddingSize}`,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-dbw-base-accordion__list' },
		{
			allowedBlocks: ['dbw-base/accordion-item'],
			template: TEMPLATE,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'dbw-base')} initialOpen={true}>
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
