/**
 * Hero Block
 *
 * @package dbw-base
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
