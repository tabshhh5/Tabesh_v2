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
	private $db_version = '1.0.0';

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
}
