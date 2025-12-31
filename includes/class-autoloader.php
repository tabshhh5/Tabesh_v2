<?php
/**
 * Autoloader for Tabesh v2 plugin classes.
 *
 * @package Tabesh_v2
 */

namespace Tabesh_v2;

/**
 * Autoloader class.
 *
 * Handles automatic loading of plugin classes using PSR-4 standard.
 */
class Autoloader {

	/**
	 * Namespace prefix for autoloader.
	 *
	 * @var string
	 */
	private static $prefix = 'Tabesh_v2\\';

	/**
	 * Base directory for namespace prefix.
	 *
	 * @var string
	 */
	private static $base_dir;

	/**
	 * Initialize the autoloader.
	 *
	 * @return void
	 */
	public static function init() {
		self::$base_dir = TABESH_V2_PLUGIN_DIR . 'includes/';
		spl_autoload_register( array( __CLASS__, 'autoload' ) );
	}

	/**
	 * Autoload classes.
	 *
	 * @param string $class The fully-qualified class name.
	 * @return void
	 */
	public static function autoload( $class ) {
		// Check if the class uses the namespace prefix.
		$len = strlen( self::$prefix );
		if ( strncmp( self::$prefix, $class, $len ) !== 0 ) {
			return;
		}

		// Get the relative class name.
		$relative_class = substr( $class, $len );

		// Convert namespace separators to directory separators.
		$relative_class = str_replace( '\\', '/', $relative_class );

		// Convert class name to file name format.
		// Example: Core\Plugin -> core/class-plugin.php
		$parts = explode( '/', $relative_class );
		$class_name = array_pop( $parts );
		$class_file = 'class-' . strtolower( str_replace( '_', '-', $class_name ) ) . '.php';

		// Build directory path.
		$directory = strtolower( implode( '/', $parts ) );
		if ( ! empty( $directory ) ) {
			$directory .= '/';
		}

		// Build the full file path.
		$file = self::$base_dir . $directory . $class_file;

		// If the file exists, require it.
		if ( file_exists( $file ) ) {
			require $file;
		}
	}
}
