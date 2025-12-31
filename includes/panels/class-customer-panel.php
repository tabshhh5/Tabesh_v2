<?php
/**
 * Customer Panel Class.
 *
 * @package Tabesh_v2\Panels
 */

namespace Tabesh_v2\Panels;

/**
 * Customer Panel Class.
 *
 * Handles customer-specific functionality and views.
 */
class Customer_Panel {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Initialize customer panel hooks.
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'register_customer_role' ) );
	}

	/**
	 * Register customer role.
	 *
	 * @return void
	 */
	public function register_customer_role() {
		// Check if role already exists.
		if ( ! get_role( 'tabesh_customer' ) ) {
			add_role(
				'tabesh_customer',
				__( 'Tabesh Customer', 'tabesh-v2' ),
				array(
					'read'                   => true,
					'tabesh_view_own_orders' => true,
					'tabesh_create_order'    => true,
				)
			);
		}
	}

	/**
	 * Get customer orders.
	 *
	 * @param int $customer_id Customer ID.
	 * @return array
	 */
	public function get_customer_orders( $customer_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';

		$orders = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE customer_id = %d ORDER BY created_at DESC", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$customer_id
			)
		);

		return $orders;
	}
}
