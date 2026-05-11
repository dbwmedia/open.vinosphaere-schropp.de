/**
 * Vinosphäre Events Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

const PADDING_OPTIONS = [
	{ label: __('Klein (S)', 'dbw-base'), value: 's' },
	{ label: __('Mittel (M)', 'dbw-base'), value: 'm' },
	{ label: __('Groß (L)', 'dbw-base'), value: 'l' },
];

export default function Edit({ attributes, setAttributes }) {
	const { paddingSize, daysAhead, columns, showImage, showInfo, showTime, heading, introText } = attributes;

	const blockProps = useBlockProps({
		className: `is-padding-${paddingSize}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Zeitraum', 'dbw-base')} initialOpen={true}>
					<RangeControl
						label={__('Tage in der Zukunft', 'dbw-base')}
						help={__('Wie viele Tage voraus sollen Events angezeigt werden?', 'dbw-base')}
						value={daysAhead}
						onChange={(value) => setAttributes({ daysAhead: value })}
						min={7}
						max={365}
						step={7}
					/>
				</PanelBody>

				<PanelBody title={__('Layout', 'dbw-base')} initialOpen={true}>
					<SelectControl
						label={__('Innenabstand', 'dbw-base')}
						value={paddingSize}
						options={PADDING_OPTIONS}
						onChange={(value) => setAttributes({ paddingSize: value })}
					/>
					<RangeControl
						label={__('Spalten', 'dbw-base')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={3}
					/>
				</PanelBody>

				<PanelBody title={__('Anzeige', 'dbw-base')} initialOpen={false}>
					<ToggleControl
						label={__('Beitragsbild anzeigen', 'dbw-base')}
						checked={showImage}
						onChange={(value) => setAttributes({ showImage: value })}
					/>
					<ToggleControl
						label={__('Info-Text anzeigen', 'dbw-base')}
						checked={showInfo}
						onChange={(value) => setAttributes({ showInfo: value })}
					/>
					<ToggleControl
						label={__('Uhrzeit anzeigen', 'dbw-base')}
						checked={showTime}
						onChange={(value) => setAttributes({ showTime: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dbw-events__header">
					<RichText
						tagName="h2"
						className="dbw-events__heading"
						placeholder={__('Überschrift eingeben…', 'dbw-base')}
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
						allowedFormats={[]}
					/>
					<RichText
						tagName="p"
						className="dbw-events__intro"
						placeholder={__('Einleitungstext eingeben…', 'dbw-base')}
						value={introText}
						onChange={(value) => setAttributes({ introText: value })}
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</div>
				<ServerSideRender
					block="dbw-base/events"
					attributes={attributes}
					LoadingResponsePlaceholder={() => (
						<Placeholder label={__('Vinosphäre Events', 'dbw-base')}>
							<Spinner />
						</Placeholder>
					)}
					EmptyResponsePlaceholder={() => (
						<Placeholder
							icon="calendar-alt"
							label={__('Vinosphäre Events', 'dbw-base')}
							instructions={__(
								'Keine Events im gewählten Zeitraum gefunden.',
								'dbw-base'
							)}
						/>
					)}
				/>
			</div>
		</>
	);
}
