<?php
/**
 * REST API Management Class.
 *
 * @package Tabesh_v2\Api
 */

namespace Tabesh_v2\Api;

/**
 * REST API Class.
 *
 * Handles REST API endpoints for React integration.
 */
class Rest_Api {

	/**
	 * API namespace.
	 *
	 * @var string
	 */
	private $namespace = 'tabesh/v2';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		// Orders endpoints.
		register_rest_route(
			$this->namespace,
			'/orders',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_orders' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_order' ),
					'permission_callback' => array( $this, 'check_permissions' ),
					'args'                => $this->get_order_args(),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/orders/(?P<id>\d+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_order' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_order' ),
					'permission_callback' => array( $this, 'check_permissions' ),
					'args'                => $this->get_order_args(),
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_order' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Customers endpoints.
		register_rest_route(
			$this->namespace,
			'/customers',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_customers' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_customer' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Settings endpoints.
		register_rest_route(
			$this->namespace,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);
	}

	/**
	 * Check user permissions.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get order arguments for validation.
	 *
	 * @return array
	 */
	private function get_order_args() {
		return array(
			'order_number' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
			),
			'customer_id'  => array(
				'required'          => true,
				'sanitize_callback' => 'absint',
			),
			'status'       => array(
				'sanitize_callback' => 'sanitize_text_field',
			),
			'total_amount' => array(
				'sanitize_callback' => 'floatval',
			),
			'notes'        => array(
				'sanitize_callback' => 'sanitize_textarea_field',
			),
		);
	}

	/**
	 * Get orders.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_orders( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';

		$page     = $request->get_param( 'page' ) ?? 1;
		$per_page = $request->get_param( 'per_page' ) ?? 20;
		$offset   = ( $page - 1 ) * $per_page;

		$orders = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d OFFSET %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$per_page,
				$offset
			)
		);

		$total = $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return new \WP_REST_Response(
			array(
				'orders'     => $orders,
				'total'      => (int) $total,
				'page'       => (int) $page,
				'per_page'   => (int) $per_page,
				'total_pages' => ceil( $total / $per_page ),
			),
			200
		);
	}

	/**
	 * Get single order.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_order( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';
		$id    = $request->get_param( 'id' );

		$order = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$id
			)
		);

		if ( ! $order ) {
			return new \WP_REST_Response(
				array( 'message' => __( 'Order not found', 'tabesh-v2' ) ),
				404
			);
		}

		return new \WP_REST_Response( $order, 200 );
	}

	/**
	 * Create order.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function create_order( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';

		$data = array(
			'order_number' => $request->get_param( 'order_number' ),
			'customer_id'  => $request->get_param( 'customer_id' ),
			'status'       => $request->get_param( 'status' ) ?? 'pending',
			'total_amount' => $request->get_param( 'total_amount' ) ?? 0,
			'notes'        => $request->get_param( 'notes' ) ?? '',
		);

		$result = $wpdb->insert( $table, $data );

		if ( ! $result ) {
			return new \WP_REST_Response(
				array( 'message' => __( 'Failed to create order', 'tabesh-v2' ) ),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'message' => __( 'Order created successfully', 'tabesh-v2' ),
				'id'      => $wpdb->insert_id,
			),
			201
		);
	}

	/**
	 * Update order.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_order( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';
		$id    = $request->get_param( 'id' );

		$data = array();
		if ( $request->get_param( 'status' ) ) {
			$data['status'] = $request->get_param( 'status' );
		}
		if ( $request->get_param( 'total_amount' ) ) {
			$data['total_amount'] = $request->get_param( 'total_amount' );
		}
		if ( $request->get_param( 'notes' ) ) {
			$data['notes'] = $request->get_param( 'notes' );
		}

		$result = $wpdb->update( $table, $data, array( 'id' => $id ) );

		if ( false === $result ) {
			return new \WP_REST_Response(
				array( 'message' => __( 'Failed to update order', 'tabesh-v2' ) ),
				500
			);
		}

		return new \WP_REST_Response(
			array( 'message' => __( 'Order updated successfully', 'tabesh-v2' ) ),
			200
		);
	}

	/**
	 * Delete order.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function delete_order( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_orders';
		$id    = $request->get_param( 'id' );

		$result = $wpdb->delete( $table, array( 'id' => $id ) );

		if ( ! $result ) {
			return new \WP_REST_Response(
				array( 'message' => __( 'Failed to delete order', 'tabesh-v2' ) ),
				500
			);
		}

		return new \WP_REST_Response(
			array( 'message' => __( 'Order deleted successfully', 'tabesh-v2' ) ),
			200
		);
	}

	/**
	 * Get customers.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_customers( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_customers';

		$customers = $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return new \WP_REST_Response( $customers, 200 );
	}

	/**
	 * Create customer.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function create_customer( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_customers';

		$data = array(
			'contact_name' => $request->get_param( 'contact_name' ),
			'email'        => $request->get_param( 'email' ),
			'phone'        => $request->get_param( 'phone' ) ?? '',
			'company_name' => $request->get_param( 'company_name' ) ?? '',
		);

		$result = $wpdb->insert( $table, $data );

		if ( ! $result ) {
			return new \WP_REST_Response(
				array( 'message' => __( 'Failed to create customer', 'tabesh-v2' ) ),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'message' => __( 'Customer created successfully', 'tabesh-v2' ),
				'id'      => $wpdb->insert_id,
			),
			201
		);
	}

	/**
	 * Get settings.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_settings() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		return new \WP_REST_Response( $settings, 200 );
	}

	/**
	 * Update settings.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_settings( $request ) {
		$settings = $request->get_json_params();
		update_option( 'tabesh_v2_settings', $settings );

		return new \WP_REST_Response(
			array( 'message' => __( 'Settings updated successfully', 'tabesh-v2' ) ),
			200
		);
	}
}
