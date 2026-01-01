<?php
/**
 * Database Management Class.
 *
 * @package Tabesh_v2\Core
 */

namespace Tabesh_v2\Core;

/**
 * Database Class.
 *
 * Handles database table creation and management for the plugin.
 */
class Database {

	/**
	 * WordPress database object.
	 *
	 * @var \wpdb
	 */
	private $wpdb;

	/**
	 * Database version.
	 *
	 * @var string
	 */
	private $db_version = '1.2.0';

	/**
	 * Constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	/**
	 * Create plugin database tables.
	 *
	 * @return void
	 */
	public function create_tables() {
		$charset_collate = $this->wpdb->get_charset_collate();

		// Orders table.
		$orders_table = $this->wpdb->prefix . 'tabesh_orders';

		// Order meta table.
		$order_meta_table = $this->wpdb->prefix . 'tabesh_order_meta';

		// Order items table.
		$order_items_table = $this->wpdb->prefix . 'tabesh_order_items';

		// Customers table.
		$customers_table = $this->wpdb->prefix . 'tabesh_customers';

		// Book printing parameter tables.
		$book_sizes_table = $this->wpdb->prefix . 'tabesh_book_sizes';
		$paper_types_table = $this->wpdb->prefix . 'tabesh_paper_types';
		$paper_weights_table = $this->wpdb->prefix . 'tabesh_paper_weights';
		$print_types_table = $this->wpdb->prefix . 'tabesh_print_types';
		$license_types_table = $this->wpdb->prefix . 'tabesh_license_types';
		$cover_weights_table = $this->wpdb->prefix . 'tabesh_cover_weights';
		$lamination_types_table = $this->wpdb->prefix . 'tabesh_lamination_types';
		$additional_services_table = $this->wpdb->prefix . 'tabesh_additional_services';
		$binding_types_table = $this->wpdb->prefix . 'tabesh_binding_types';

		// Book pricing tables.
		$pricing_page_cost_table = $this->wpdb->prefix . 'tabesh_book_pricing_page_cost';
		$pricing_binding_table = $this->wpdb->prefix . 'tabesh_book_pricing_binding';
		$pricing_additional_services_table = $this->wpdb->prefix . 'tabesh_book_pricing_additional_services';
		$pricing_service_binding_restrictions_table = $this->wpdb->prefix . 'tabesh_book_pricing_service_binding_restrictions';
		$pricing_size_limits_table = $this->wpdb->prefix . 'tabesh_book_pricing_size_limits';

		$sql = array();

		// Create orders table.
		$sql[] = "CREATE TABLE IF NOT EXISTS {$orders_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			order_number varchar(50) NOT NULL,
			customer_id bigint(20) UNSIGNED NOT NULL,
			status varchar(50) NOT NULL DEFAULT 'pending',
			total_amount decimal(10,2) NOT NULL DEFAULT 0.00,
			currency varchar(10) NOT NULL DEFAULT 'IRR',
			priority varchar(20) NOT NULL DEFAULT 'normal',
			deadline datetime DEFAULT NULL,
			assigned_to bigint(20) UNSIGNED DEFAULT NULL,
			notes text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			completed_at datetime DEFAULT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY order_number (order_number),
			KEY customer_id (customer_id),
			KEY status (status),
			KEY assigned_to (assigned_to),
			KEY created_at (created_at)
		) {$charset_collate};";

		// Create order meta table.
		$sql[] = "CREATE TABLE IF NOT EXISTS {$order_meta_table} (
			meta_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			order_id bigint(20) UNSIGNED NOT NULL,
			meta_key varchar(255) NOT NULL,
			meta_value longtext DEFAULT NULL,
			PRIMARY KEY (meta_id),
			KEY order_id (order_id),
			KEY meta_key (meta_key(191))
		) {$charset_collate};";

		// Create order items table.
		$sql[] = "CREATE TABLE IF NOT EXISTS {$order_items_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			order_id bigint(20) UNSIGNED NOT NULL,
			item_name varchar(255) NOT NULL,
			item_type varchar(100) NOT NULL,
			quantity int(11) NOT NULL DEFAULT 1,
			unit_price decimal(10,2) NOT NULL DEFAULT 0.00,
			total_price decimal(10,2) NOT NULL DEFAULT 0.00,
			specifications text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY order_id (order_id)
		) {$charset_collate};";

		// Create customers table.
		$sql[] = "CREATE TABLE IF NOT EXISTS {$customers_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id bigint(20) UNSIGNED DEFAULT NULL,
			company_name varchar(255) DEFAULT NULL,
			contact_name varchar(255) NOT NULL,
			email varchar(100) NOT NULL,
			phone varchar(20) DEFAULT NULL,
			address text DEFAULT NULL,
			city varchar(100) DEFAULT NULL,
			postal_code varchar(20) DEFAULT NULL,
			notes text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY user_id (user_id),
			KEY email (email)
		) {$charset_collate};";

		// Create book sizes table (قطع کتاب).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$book_sizes_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create paper types table (نوع کاغذ متن).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$paper_types_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create paper weights table (گرماژ کاغذ متن).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$paper_weights_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			paper_type_id bigint(20) UNSIGNED NOT NULL,
			weight int(11) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY paper_type_id (paper_type_id)
		) {$charset_collate};";

		// Create print types table (انواع چاپ).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$print_types_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create license types table (انواع مجوز).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$license_types_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create cover weights table (گرماژ کاغذ جلد).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$cover_weights_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			weight int(11) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY weight (weight)
		) {$charset_collate};";

		// Create lamination types table (انواع سلفون جلد).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$lamination_types_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create additional services table (خدمات اضافی).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$additional_services_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create binding types table (انواع صحافی).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$binding_types_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			prompt_master text DEFAULT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) {$charset_collate};";

		// Create book pricing page cost table (هزینه هر صفحه).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$pricing_page_cost_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			book_size_id bigint(20) UNSIGNED NOT NULL,
			paper_type_id bigint(20) UNSIGNED NOT NULL,
			paper_weight_id bigint(20) UNSIGNED NOT NULL,
			print_type_id bigint(20) UNSIGNED NOT NULL,
			price decimal(10,2) NOT NULL DEFAULT 0.00,
			is_enabled tinyint(1) NOT NULL DEFAULT 1,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY book_size_id (book_size_id),
			KEY paper_type_id (paper_type_id),
			KEY paper_weight_id (paper_weight_id),
			KEY print_type_id (print_type_id),
			UNIQUE KEY pricing_combination (book_size_id, paper_type_id, paper_weight_id, print_type_id)
		) {$charset_collate};";

		// Create book pricing binding table (هزینه صحافی و جلد).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$pricing_binding_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			book_size_id bigint(20) UNSIGNED NOT NULL,
			binding_type_id bigint(20) UNSIGNED NOT NULL,
			cover_weight_id bigint(20) UNSIGNED NOT NULL,
			price decimal(10,2) NOT NULL DEFAULT 0.00,
			is_enabled tinyint(1) NOT NULL DEFAULT 1,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY book_size_id (book_size_id),
			KEY binding_type_id (binding_type_id),
			KEY cover_weight_id (cover_weight_id),
			UNIQUE KEY binding_combination (book_size_id, binding_type_id, cover_weight_id)
		) {$charset_collate};";

		// Create book pricing additional services table (خدمات اضافی).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$pricing_additional_services_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			book_size_id bigint(20) UNSIGNED NOT NULL,
			service_id bigint(20) UNSIGNED NOT NULL,
			price decimal(10,2) NOT NULL DEFAULT 0.00,
			calculation_type varchar(50) NOT NULL DEFAULT 'fixed',
			pages_per_unit int(11) DEFAULT NULL,
			is_enabled tinyint(1) NOT NULL DEFAULT 1,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY book_size_id (book_size_id),
			KEY service_id (service_id),
			UNIQUE KEY service_combination (book_size_id, service_id)
		) {$charset_collate};";

		// Create service binding restrictions table (محدودیت های خدمات اضافی بر اساس نوع صحافی).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$pricing_service_binding_restrictions_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			book_size_id bigint(20) UNSIGNED NOT NULL,
			service_id bigint(20) UNSIGNED NOT NULL,
			binding_type_id bigint(20) UNSIGNED NOT NULL,
			is_enabled tinyint(1) NOT NULL DEFAULT 1,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY book_size_id (book_size_id),
			KEY service_id (service_id),
			KEY binding_type_id (binding_type_id),
			UNIQUE KEY restriction_combination (book_size_id, service_id, binding_type_id)
		) {$charset_collate};";

		// Create book pricing size limits table (محدودیت های تیراژ و تعداد صفحه).
		$sql[] = "CREATE TABLE IF NOT EXISTS {$pricing_size_limits_table} (
			id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			book_size_id bigint(20) UNSIGNED NOT NULL,
			min_circulation int(11) NOT NULL DEFAULT 1,
			max_circulation int(11) NOT NULL DEFAULT 10000,
			circulation_step int(11) NOT NULL DEFAULT 1,
			min_pages int(11) NOT NULL DEFAULT 1,
			max_pages int(11) NOT NULL DEFAULT 1000,
			pages_step int(11) NOT NULL DEFAULT 1,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY book_size_id (book_size_id)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		foreach ( $sql as $query ) {
			dbDelta( $query );
		}

		// Update database version.
		update_option( 'tabesh_v2_db_version', $this->db_version );
	}

	/**
	 * Drop plugin database tables.
	 *
	 * @return void
	 */
	public function drop_tables() {
		$tables = array(
			$this->wpdb->prefix . 'tabesh_orders',
			$this->wpdb->prefix . 'tabesh_order_meta',
			$this->wpdb->prefix . 'tabesh_order_items',
			$this->wpdb->prefix . 'tabesh_customers',
			$this->wpdb->prefix . 'tabesh_book_sizes',
			$this->wpdb->prefix . 'tabesh_paper_types',
			$this->wpdb->prefix . 'tabesh_paper_weights',
			$this->wpdb->prefix . 'tabesh_print_types',
			$this->wpdb->prefix . 'tabesh_license_types',
			$this->wpdb->prefix . 'tabesh_cover_weights',
			$this->wpdb->prefix . 'tabesh_lamination_types',
			$this->wpdb->prefix . 'tabesh_additional_services',
			$this->wpdb->prefix . 'tabesh_binding_types',
			$this->wpdb->prefix . 'tabesh_book_pricing_page_cost',
			$this->wpdb->prefix . 'tabesh_book_pricing_binding',
			$this->wpdb->prefix . 'tabesh_book_pricing_additional_services',
			$this->wpdb->prefix . 'tabesh_book_pricing_service_binding_restrictions',
			$this->wpdb->prefix . 'tabesh_book_pricing_size_limits',
		);

		foreach ( $tables as $table ) {
			$this->wpdb->query( "DROP TABLE IF EXISTS {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		}

		delete_option( 'tabesh_v2_db_version' );
	}

	/**
	 * Get orders table name.
	 *
	 * @return string
	 */
	public function get_orders_table() {
		return $this->wpdb->prefix . 'tabesh_orders';
	}

	/**
	 * Get order meta table name.
	 *
	 * @return string
	 */
	public function get_order_meta_table() {
		return $this->wpdb->prefix . 'tabesh_order_meta';
	}

	/**
	 * Get order items table name.
	 *
	 * @return string
	 */
	public function get_order_items_table() {
		return $this->wpdb->prefix . 'tabesh_order_items';
	}

	/**
	 * Get customers table name.
	 *
	 * @return string
	 */
	public function get_customers_table() {
		return $this->wpdb->prefix . 'tabesh_customers';
	}

	/**
	 * Get book sizes table name.
	 *
	 * @return string
	 */
	public function get_book_sizes_table() {
		return $this->wpdb->prefix . 'tabesh_book_sizes';
	}

	/**
	 * Get paper types table name.
	 *
	 * @return string
	 */
	public function get_paper_types_table() {
		return $this->wpdb->prefix . 'tabesh_paper_types';
	}

	/**
	 * Get paper weights table name.
	 *
	 * @return string
	 */
	public function get_paper_weights_table() {
		return $this->wpdb->prefix . 'tabesh_paper_weights';
	}

	/**
	 * Get print types table name.
	 *
	 * @return string
	 */
	public function get_print_types_table() {
		return $this->wpdb->prefix . 'tabesh_print_types';
	}

	/**
	 * Get license types table name.
	 *
	 * @return string
	 */
	public function get_license_types_table() {
		return $this->wpdb->prefix . 'tabesh_license_types';
	}

	/**
	 * Get cover weights table name.
	 *
	 * @return string
	 */
	public function get_cover_weights_table() {
		return $this->wpdb->prefix . 'tabesh_cover_weights';
	}

	/**
	 * Get lamination types table name.
	 *
	 * @return string
	 */
	public function get_lamination_types_table() {
		return $this->wpdb->prefix . 'tabesh_lamination_types';
	}

	/**
	 * Get additional services table name.
	 *
	 * @return string
	 */
	public function get_additional_services_table() {
		return $this->wpdb->prefix . 'tabesh_additional_services';
	}

	/**
	 * Get binding types table name.
	 *
	 * @return string
	 */
	public function get_binding_types_table() {
		return $this->wpdb->prefix . 'tabesh_binding_types';
	}

	/**
	 * Get book pricing page cost table name.
	 *
	 * @return string
	 */
	public function get_pricing_page_cost_table() {
		return $this->wpdb->prefix . 'tabesh_book_pricing_page_cost';
	}

	/**
	 * Get book pricing binding table name.
	 *
	 * @return string
	 */
	public function get_pricing_binding_table() {
		return $this->wpdb->prefix . 'tabesh_book_pricing_binding';
	}

	/**
	 * Get book pricing additional services table name.
	 *
	 * @return string
	 */
	public function get_pricing_additional_services_table() {
		return $this->wpdb->prefix . 'tabesh_book_pricing_additional_services';
	}

	/**
	 * Get service binding restrictions table name.
	 *
	 * @return string
	 */
	public function get_pricing_service_binding_restrictions_table() {
		return $this->wpdb->prefix . 'tabesh_book_pricing_service_binding_restrictions';
	}

	/**
	 * Get book pricing size limits table name.
	 *
	 * @return string
	 */
	public function get_pricing_size_limits_table() {
		return $this->wpdb->prefix . 'tabesh_book_pricing_size_limits';
	}
}
