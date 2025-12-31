<?php
/**
 * Employee Panel Class.
 *
 * @package Tabesh_v2\Panels
 */

namespace Tabesh_v2\Panels;

/**
 * Employee Panel Class.
 *
 * Handles employee-specific functionality and views.
 */
class Employee_Panel {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Initialize employee panel hooks.
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'register_employee_role' ) );
	}

	/**
	 * Register employee role.
	 *
	 * @return void
	 */
	public function register_employee_role() {
		// Check if role already exists.
		if ( ! get_role( 'tabesh_employee' ) ) {
			add_role(
				'tabesh_employee',
				__( 'Tabesh Employee', 'tabesh-v2' ),
				array(
					'read'                      => true,
					'tabesh_view_assigned_orders' => true,
					'tabesh_update_order_status' => true,
				)
			);
		}
	}

	/**
	 * Get employee assigned orders.
	 *
	 * @param int $employee_id Employee ID.
	 * @return array
	 */
	public function get_assigned_orders( $employee_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';

		$orders = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE assigned_to = %d ORDER BY created_at DESC", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$employee_id
			)
		);

		return $orders;
	}
}
