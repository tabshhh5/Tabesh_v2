<?php
/**
 * Main Plugin Class.
 *
 * @package Tabesh_v2\Core
 */

namespace Tabesh_v2\Core;

/**
 * Main Plugin Class.
 *
 * Singleton pattern implementation for the main plugin functionality.
 */
class Plugin {

	/**
	 * Plugin instance.
	 *
	 * @var Plugin
	 */
	private static $instance = null;

	/**
	 * Admin instance.
	 *
	 * @var \Tabesh_v2\Admin\Admin
	 */
	private $admin;

	/**
	 * Assets instance.
	 *
	 * @var \Tabesh_v2\Core\Assets
	 */
	private $assets;

	/**
	 * Database instance.
	 *
	 * @var \Tabesh_v2\Core\Database
	 */
	private $database;

	/**
	 * REST API instance.
	 *
	 * @var \Tabesh_v2\Api\Rest_Api
	 */
	private $rest_api;

	/**
	 * Get plugin instance.
	 *
	 * @return Plugin
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init_hooks();
		$this->init_components();
	}

	/**
	 * Load plugin dependencies.
	 *
	 * @return void
	 */
	private function load_dependencies() {
		// Load text domain for translations.
		add_action( 'init', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Initialize WordPress hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		// Add custom post types and taxonomies.
		add_action( 'init', array( $this, 'register_post_types' ) );

		// Add rewrite rules flush on activation.
		add_action( 'init', array( $this, 'maybe_flush_rewrite_rules' ) );
	}

	/**
	 * Initialize plugin components.
	 *
	 * @return void
	 */
	private function init_components() {
		// Initialize Database.
		$this->database = new Database();

		// Initialize Assets.
		$this->assets = new Assets();

		// Initialize REST API.
		$this->rest_api = new \Tabesh_v2\Api\Rest_Api();

		// Initialize Customer Dashboard Shortcode.
		new \Tabesh_v2\Shortcodes\Customer_Dashboard_Shortcode();

		// Initialize Admin (only in admin area).
		if ( is_admin() ) {
			$this->admin = new \Tabesh_v2\Admin\Admin();
		}
	}

	/**
	 * Load plugin text domain for translations.
	 *
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'tabesh-v2',
			false,
			dirname( TABESH_V2_PLUGIN_BASENAME ) . '/languages'
		);
	}

	/**
	 * Register custom post types.
	 *
	 * @return void
	 */
	public function register_post_types() {
		// Register Print Order post type.
		register_post_type(
			'tabesh_order',
			array(
				'labels'              => array(
					'name'               => __( 'Print Orders', 'tabesh-v2' ),
					'singular_name'      => __( 'Print Order', 'tabesh-v2' ),
					'add_new'            => __( 'Add New', 'tabesh-v2' ),
					'add_new_item'       => __( 'Add New Order', 'tabesh-v2' ),
					'edit_item'          => __( 'Edit Order', 'tabesh-v2' ),
					'new_item'           => __( 'New Order', 'tabesh-v2' ),
					'view_item'          => __( 'View Order', 'tabesh-v2' ),
					'search_items'       => __( 'Search Orders', 'tabesh-v2' ),
					'not_found'          => __( 'No orders found', 'tabesh-v2' ),
					'not_found_in_trash' => __( 'No orders found in trash', 'tabesh-v2' ),
					'all_items'          => __( 'All Orders', 'tabesh-v2' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => false,
				'query_var'           => true,
				'rewrite'             => false,
				'capability_type'     => 'post',
				'has_archive'         => false,
				'hierarchical'        => false,
				'menu_position'       => null,
				'supports'            => array( 'title', 'author' ),
				'show_in_rest'        => true,
			)
		);
	}

	/**
	 * Maybe flush rewrite rules.
	 *
	 * @return void
	 */
	public function maybe_flush_rewrite_rules() {
		if ( get_option( 'tabesh_v2_flush_rewrite_rules' ) ) {
			flush_rewrite_rules();
			delete_option( 'tabesh_v2_flush_rewrite_rules' );
		}
	}

	/**
	 * Plugin activation handler.
	 *
	 * @return void
	 */
	public static function activate() {
		// Set flag to flush rewrite rules.
		add_option( 'tabesh_v2_flush_rewrite_rules', true );

		// Create database tables.
		$database = new Database();
		$database->create_tables();

		// Set default options.
		self::set_default_options();
	}

	/**
	 * Plugin deactivation handler.
	 *
	 * @return void
	 */
	public static function deactivate() {
		// Clean up temporary data if needed.
		flush_rewrite_rules();
	}

	/**
	 * Plugin uninstall handler.
	 *
	 * @return void
	 */
	public static function uninstall() {
		// Remove plugin options.
		delete_option( 'tabesh_v2_flush_rewrite_rules' );
		delete_option( 'tabesh_v2_settings' );

		// Drop database tables.
		$database = new Database();
		$database->drop_tables();
	}

	/**
	 * Set default plugin options.
	 *
	 * @return void
	 */
	private static function set_default_options() {
		// Get comprehensive default settings from Settings_Panel.
		$default_settings = \Tabesh_v2\Panels\Settings_Panel::get_default_settings();

		add_option( 'tabesh_v2_settings', $default_settings );
	}

	/**
	 * Get plugin instance.
	 *
	 * @return \Tabesh_v2\Admin\Admin|null
	 */
	public function get_admin() {
		return $this->admin;
	}

	/**
	 * Get assets instance.
	 *
	 * @return \Tabesh_v2\Core\Assets
	 */
	public function get_assets() {
		return $this->assets;
	}

	/**
	 * Get database instance.
	 *
	 * @return \Tabesh_v2\Core\Database
	 */
	public function get_database() {
		return $this->database;
	}

	/**
	 * Get REST API instance.
	 *
	 * @return \Tabesh_v2\Api\Rest_Api
	 */
	public function get_rest_api() {
		return $this->rest_api;
	}
}
