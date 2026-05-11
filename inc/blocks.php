<?php
/**
 * Gutenberg Block Registration
 *
 * Auto-discovers and registers all blocks from blocks/build/.
 * Each block must have a block.json in its build directory.
 *
 * @package dbw-base
 * @author  dbw media
 * @link    https://dbw-media.de
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register all custom blocks from the blocks/build directory
 */
function dbw_register_blocks() {
    $blocks_dir = DBW_THEME_DIR . '/blocks/build';

    if (!is_dir($blocks_dir)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('dbw-base: Blocks build directory not found. Run npm run build in blocks/.');
        }
        return;
    }

    $block_folders = glob($blocks_dir . '/*/block.json');

    if (empty($block_folders)) {
        return;
    }

    foreach ($block_folders as $block_json) {
        $block_path = dirname($block_json);
        register_block_type_from_metadata($block_path);
    }
}
add_action('init', 'dbw_register_blocks');

/**
 * Register custom block category
 *
 * @param array $categories Existing block categories
 * @return array Modified block categories
 */
function dbw_register_block_category($categories) {
    return array_merge(
        [
            [
                'slug'  => 'dbw-base',
                'title' => 'dbw base Blocks',
                'icon'  => null,
            ],
        ],
        $categories
    );
}
add_filter('block_categories_all', 'dbw_register_block_category');

