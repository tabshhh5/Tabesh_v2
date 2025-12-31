<?php
/**
 * Plugin Name: Tabesh v2 - Print Shop Order Management
 * Plugin URI: https://github.com/tabshhh4-sketch/Tabesh_v2
 * Description: پلتفرم جامع ثبت سفارشات چاپخانه با رابط کاربری React و معماری مدولار
 * Version: 1.0.0
 * Author: Tabesh Team
 * Author URI: https://github.com/tabshhh4-sketch
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: tabesh-v2
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 *
 * @package Tabesh_v2
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Plugin version.
 */
define( 'TABESH_V2_VERSION', '1.0.0' );

/**
 * Plugin root file.
 */
define( 'TABESH_V2_PLUGIN_FILE', __FILE__ );

/**
 * Plugin root directory.
 */
define( 'TABESH_V2_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin root URL.
 */
define( 'TABESH_V2_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 */
define( 'TABESH_V2_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Minimum WordPress version required.
 */
define( 'TABESH_V2_MIN_WP_VERSION', '6.0' );

/**
 * Minimum PHP version required.
 */
define( 'TABESH_V2_MIN_PHP_VERSION', '8.0' );

/**
 * Autoloader for plugin classes.
 */
require_once TABESH_V2_PLUGIN_DIR . 'includes/class-autoloader.php';

/**
 * Initialize the autoloader.
 */
Tabesh_v2\Autoloader::init();

/**
 * Main plugin activation hook.
 */
function tabesh_v2_activate() {
	// Check WordPress version.
	if ( version_compare( get_bloginfo( 'version' ), TABESH_V2_MIN_WP_VERSION, '<' ) ) {
		deactivate_plugins( TABESH_V2_PLUGIN_BASENAME );
		wp_die(
			sprintf(
				/* translators: %s: minimum WordPress version */
				esc_html__( 'Tabesh v2 requires WordPress version %s or higher.', 'tabesh-v2' ),
				TABESH_V2_MIN_WP_VERSION
			)
		);
	}

	// Check PHP version.
	if ( version_compare( PHP_VERSION, TABESH_V2_MIN_PHP_VERSION, '<' ) ) {
		deactivate_plugins( TABESH_V2_PLUGIN_BASENAME );
		wp_die(
			sprintf(
				/* translators: %s: minimum PHP version */
				esc_html__( 'Tabesh v2 requires PHP version %s or higher.', 'tabesh-v2' ),
				TABESH_V2_MIN_PHP_VERSION
			)
		);
	}

	\Tabesh_v2\Core\Plugin::activate();
}
register_activation_hook( __FILE__, 'tabesh_v2_activate' );

/**
 * Main plugin deactivation hook.
 */
function tabesh_v2_deactivate() {
	\Tabesh_v2\Core\Plugin::deactivate();
}
register_deactivation_hook( __FILE__, 'tabesh_v2_deactivate' );

/**
 * Main plugin uninstall hook.
 */
function tabesh_v2_uninstall() {
	\Tabesh_v2\Core\Plugin::uninstall();
}
register_uninstall_hook( __FILE__, 'tabesh_v2_uninstall' );

/**
 * Initialize the plugin.
 */
function tabesh_v2_init() {
	\Tabesh_v2\Core\Plugin::get_instance();
}
add_action( 'plugins_loaded', 'tabesh_v2_init' );
