/**
 * Hero Block – Save Component
 *
 * @package dbw-base
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		heading,
		text,
		primaryButtonText,
		primaryButtonUrl,
		secondaryButtonText,
		secondaryButtonUrl,
		mediaUrl,
		mediaAlt,
		overlayOpacity,
		minHeight,
		layout,
		showScrollIndicator,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `is-layout-${layout}`,
		style: {
			minHeight,
		},
	});

	const hasButtons = primaryButtonText || secondaryButtonText;

	return (
		<section {...blockProps}>
			{mediaUrl && (
				<img
					className="wp-block-dbw-base-hero__media"
					src={mediaUrl}
					alt={mediaAlt}
					loading="eager"
					decoding="async"
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
				{heading && (
					<RichText.Content
						tagName="h1"
						className="wp-block-dbw-base-hero__heading"
						value={heading}
					/>
				)}
				{text && (
					<RichText.Content
						tagName="p"
						className="wp-block-dbw-base-hero__text"
						value={text}
					/>
				)}
				{hasButtons && (
					<div className="wp-block-dbw-base-hero__buttons">
						{primaryButtonText && (
							<a
								className="wp-block-dbw-base-hero__button is-primary"
								href={primaryButtonUrl || '#'}
							>
								{primaryButtonText}
							</a>
						)}
						{secondaryButtonText && (
							<a
								className="wp-block-dbw-base-hero__button is-secondary"
								href={secondaryButtonUrl || '#'}
							>
								{secondaryButtonText}
							</a>
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
		</section>
	);
}
