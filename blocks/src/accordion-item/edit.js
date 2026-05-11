/**
 * Accordion Item Block – Editor Component
 *
 * @package dbw-base
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	const { question, answer } = attributes;

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<div className="wp-block-dbw-base-accordion-item__header">
				<RichText
					tagName="span"
					className="wp-block-dbw-base-accordion-item__question"
					value={question}
					onChange={(value) => setAttributes({ question: value })}
					placeholder={__('Frage eingeben…', 'dbw-base')}
					allowedFormats={['core/bold']}
				/>
				<span className="wp-block-dbw-base-accordion-item__icon" aria-hidden="true">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</span>
			</div>
			<div className="wp-block-dbw-base-accordion-item__content is-editor-preview">
				<RichText
					tagName="p"
					className="wp-block-dbw-base-accordion-item__answer"
					value={answer}
					onChange={(value) => setAttributes({ answer: value })}
					placeholder={__('Antwort eingeben…', 'dbw-base')}
					allowedFormats={['core/bold', 'core/italic', 'core/link']}
				/>
			</div>
		</div>
	);
}
