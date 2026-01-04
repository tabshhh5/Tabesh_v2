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

		// Check database version and upgrade if needed.
		add_action( 'plugins_loaded', array( $this, 'maybe_upgrade_database' ) );
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
	 * Maybe upgrade database.
	 *
	 * @return void
	 */
	public function maybe_upgrade_database() {
		$current_db_version = get_option( 'tabesh_v2_db_version', '0.0.0' );
		$required_db_version = '1.1.0';

		if ( version_compare( $current_db_version, $required_db_version, '<' ) ) {
			$database = new Database();
			$database->create_tables();
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

		// Initialize default book printing parameters if this is first activation.
		if ( ! get_option( 'tabesh_v2_book_params_initialized' ) ) {
			self::initialize_default_book_parameters();
			add_option( 'tabesh_v2_book_params_initialized', true );
		}
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
	 * Initialize default book printing parameters.
	 *
	 * @return void
	 */
	private static function initialize_default_book_parameters() {
		global $wpdb;

		// Default book sizes (قطع کتاب).
		$book_sizes = array(
			array( 'name' => 'رقعی', 'prompt_master' => 'قطع کتاب رقعی با ابعاد استاندارد' ),
			array( 'name' => 'وزیری', 'prompt_master' => 'قطع کتاب وزیری با ابعاد استاندارد' ),
			array( 'name' => 'رحلی', 'prompt_master' => 'قطع کتاب رحلی با ابعاد استاندارد' ),
			array( 'name' => 'پالتویی', 'prompt_master' => 'قطع کتاب پالتویی با ابعاد استاندارد' ),
		);

		foreach ( $book_sizes as $size ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_book_sizes',
				$size
			);
		}

		// Default paper types (نوع کاغذ متن).
		$paper_types = array(
			array( 'name' => 'بالک', 'prompt_master' => 'کاغذ بالک با کیفیت مناسب برای چاپ متن' ),
			array( 'name' => 'تحریر', 'prompt_master' => 'کاغذ تحریر با کیفیت بالا' ),
			array( 'name' => 'گلاسه', 'prompt_master' => 'کاغذ گلاسه براق' ),
		);

		$paper_type_ids = array();
		foreach ( $paper_types as $type ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_paper_types',
				$type
			);
			// Store insert_id immediately to avoid race conditions.
			$last_id = $wpdb->insert_id;
			$paper_type_ids[ $type['name'] ] = $last_id;
		}

		// Default paper weights (گرماژ کاغذ متن).
		$paper_weights = array(
			array( 'paper_type_id' => $paper_type_ids['بالک'], 'weight' => 60, 'prompt_master' => 'گرماژ 60 گرم' ),
			array( 'paper_type_id' => $paper_type_ids['بالک'], 'weight' => 70, 'prompt_master' => 'گرماژ 70 گرم' ),
			array( 'paper_type_id' => $paper_type_ids['بالک'], 'weight' => 80, 'prompt_master' => 'گرماژ 80 گرم' ),
			array( 'paper_type_id' => $paper_type_ids['تحریر'], 'weight' => 60, 'prompt_master' => 'گرماژ 60 گرم' ),
			array( 'paper_type_id' => $paper_type_ids['تحریر'], 'weight' => 70, 'prompt_master' => 'گرماژ 70 گرم' ),
			array( 'paper_type_id' => $paper_type_ids['تحریر'], 'weight' => 80, 'prompt_master' => 'گرماژ 80 گرم' ),
			array( 'paper_type_id' => $paper_type_ids['تحریر'], 'weight' => 90, 'prompt_master' => 'گرماژ 90 گرم' ),
		);

		foreach ( $paper_weights as $weight ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_paper_weights',
				$weight
			);
		}

		// Default print types (انواع چاپ).
		// Note: Combined printing is not a separate type - it's calculated from B&W + Color pages
		$print_types = array(
			array( 'name' => 'چاپ سیاه‌وسفید', 'prompt_master' => 'چاپ تک رنگ سیاه' ),
			array( 'name' => 'چاپ رنگی', 'prompt_master' => 'چاپ تمام رنگی CMYK' ),
		);

		foreach ( $print_types as $type ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_print_types',
				$type
			);
		}

		// Default license types (انواع مجوز).
		$license_types = array(
			array( 'name' => 'دارای مجوز شخصی', 'prompt_master' => 'مجوز شخصی برای چاپ' ),
			array( 'name' => 'مجوز انتشارات چاپکو', 'prompt_master' => 'مجوز انتشارات چاپکو' ),
			array( 'name' => 'مجوز انتشارات سفیر سلامت', 'prompt_master' => 'مجوز انتشارات سفیر سلامت' ),
			array( 'name' => 'بدون مجوز', 'prompt_master' => 'بدون نیاز به مجوز چاپ' ),
		);

		foreach ( $license_types as $type ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_license_types',
				$type
			);
		}

		// Default cover weights (گرماژ کاغذ جلد).
		$cover_weights = array(
			array( 'weight' => 135, 'prompt_master' => 'گرماژ 135 گرم برای جلد' ),
			array( 'weight' => 200, 'prompt_master' => 'گرماژ 200 گرم برای جلد' ),
			array( 'weight' => 250, 'prompt_master' => 'گرماژ 250 گرم برای جلد' ),
			array( 'weight' => 300, 'prompt_master' => 'گرماژ 300 گرم برای جلد' ),
		);

		foreach ( $cover_weights as $weight ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_cover_weights',
				$weight
			);
		}

		// Default lamination types (انواع سلفون جلد).
		$lamination_types = array(
			array( 'name' => 'سلفون مات', 'prompt_master' => 'پوشش سلفون مات' ),
			array( 'name' => 'سلفون براق', 'prompt_master' => 'پوشش سلفون براق' ),
			array( 'name' => 'بدون سلفون', 'prompt_master' => 'بدون پوشش سلفون' ),
		);

		foreach ( $lamination_types as $type ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_lamination_types',
				$type
			);
		}

		// Default additional services (خدمات اضافی).
		$additional_services = array(
			array( 'name' => 'شیرینک', 'prompt_master' => 'بسته‌بندی با شیرینک' ),
			array( 'name' => 'نقره‌کوب', 'prompt_master' => 'طراحی و اجرای نقره‌کوب' ),
			array( 'name' => 'طلاکوب', 'prompt_master' => 'طراحی و اجرای طلاکوب' ),
			array( 'name' => 'UV برجسته', 'prompt_master' => 'پوشش UV برجسته' ),
			array( 'name' => 'وکیوم', 'prompt_master' => 'بسته‌بندی وکیوم' ),
		);

		foreach ( $additional_services as $service ) {
			$wpdb->insert(
				$wpdb->prefix . 'tabesh_additional_services',
				$service
			);
		}
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
