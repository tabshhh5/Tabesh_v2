<?php
/**
 * Manager Panel Class.
 *
 * @package Tabesh_v2\Panels
 */

namespace Tabesh_v2\Panels;

/**
 * Manager Panel Class.
 *
 * Handles manager-specific functionality and views.
 */
class Manager_Panel {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Initialize manager panel hooks.
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'register_manager_role' ) );
	}

	/**
	 * Register manager role.
	 *
	 * @return void
	 */
	public function register_manager_role() {
		// Check if role already exists.
		if ( ! get_role( 'tabesh_manager' ) ) {
			add_role(
				'tabesh_manager',
				__( 'Tabesh Manager', 'tabesh-v2' ),
				array(
					'read'                    => true,
					'tabesh_view_all_orders'  => true,
					'tabesh_edit_orders'      => true,
					'tabesh_delete_orders'    => true,
					'tabesh_assign_orders'    => true,
					'tabesh_manage_customers' => true,
					'tabesh_view_reports'     => true,
				)
			);
		}
	}

	/**
	 * Get all orders with statistics.
	 *
	 * @return array
	 */
	public function get_orders_statistics() {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';

		$stats = array(
			'total'     => $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" ), // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			'pending'   => $wpdb->get_var( "SELECT COUNT(*) FROM {$table} WHERE status = 'pending'" ), // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			'completed' => $wpdb->get_var( "SELECT COUNT(*) FROM {$table} WHERE status = 'completed'" ), // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			'cancelled' => $wpdb->get_var( "SELECT COUNT(*) FROM {$table} WHERE status = 'cancelled'" ), // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		);

		return $stats;
	}
}
