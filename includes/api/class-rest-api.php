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
		
		// Sanitize settings before saving.
		$sanitized_settings = $this->sanitize_settings( $settings );
		
		update_option( 'tabesh_v2_settings', $sanitized_settings );

		return new \WP_REST_Response(
			array( 'message' => __( 'Settings updated successfully', 'tabesh-v2' ) ),
			200
		);
	}

	/**
	 * Sanitize settings array.
	 *
	 * @param array $settings Settings array.
	 * @return array Sanitized settings.
	 */
	private function sanitize_settings( $settings ) {
		$sanitized = array();

		// Sanitize AI settings.
		if ( isset( $settings['ai'] ) && is_array( $settings['ai'] ) ) {
			$sanitized['ai'] = array(
				'enabled'          => ! empty( $settings['ai']['enabled'] ),
				'api_key'          => sanitize_text_field( $settings['ai']['api_key'] ?? '' ),
				'model'            => sanitize_text_field( $settings['ai']['model'] ?? 'gpt-4' ),
				'organization_id'  => sanitize_text_field( $settings['ai']['organization_id'] ?? '' ),
				'temperature'      => floatval( $settings['ai']['temperature'] ?? 0.7 ),
				'max_tokens'       => absint( $settings['ai']['max_tokens'] ?? 2000 ),
				'system_prompt'    => sanitize_textarea_field( $settings['ai']['system_prompt'] ?? '' ),
				'cache_responses'  => ! empty( $settings['ai']['cache_responses'] ),
				'log_requests'     => ! empty( $settings['ai']['log_requests'] ),
			);
		}

		// Sanitize product settings.
		if ( isset( $settings['products'] ) && is_array( $settings['products'] ) ) {
			$sanitized['products'] = array();
			foreach ( $settings['products'] as $product_key => $product_data ) {
				if ( is_array( $product_data ) ) {
					$sanitized['products'][ sanitize_key( $product_key ) ] = array(
						'enabled'        => ! empty( $product_data['enabled'] ),
						'min_quantity'   => absint( $product_data['min_quantity'] ?? 1 ),
						'max_quantity'   => absint( $product_data['max_quantity'] ?? 10000 ),
						'delivery_days'  => absint( $product_data['delivery_days'] ?? 7 ),
						'base_price'     => floatval( $product_data['base_price'] ?? 0 ),
						'description'    => sanitize_textarea_field( $product_data['description'] ?? '' ),
						'custom_params'  => sanitize_textarea_field( $product_data['custom_params'] ?? '' ),
					);
				}
			}
		}

		// Sanitize pricing settings.
		if ( isset( $settings['pricing'] ) && is_array( $settings['pricing'] ) ) {
			$sanitized['pricing'] = array(
				'currency'                => sanitize_text_field( $settings['pricing']['currency'] ?? 'تومان' ),
				'currency_symbol'         => sanitize_text_field( $settings['pricing']['currency_symbol'] ?? 'تومان' ),
				'currency_position'       => sanitize_text_field( $settings['pricing']['currency_position'] ?? 'after' ),
				'decimals'                => absint( $settings['pricing']['decimals'] ?? 0 ),
				'tax_enabled'             => ! empty( $settings['pricing']['tax_enabled'] ),
				'tax_rate'                => floatval( $settings['pricing']['tax_rate'] ?? 9 ),
				'max_discount'            => floatval( $settings['pricing']['max_discount'] ?? 30 ),
				'discount_enabled'        => ! empty( $settings['pricing']['discount_enabled'] ),
				'bulk_discount_enabled'   => ! empty( $settings['pricing']['bulk_discount_enabled'] ),
				'bulk_discount_table'     => sanitize_textarea_field( $settings['pricing']['bulk_discount_table'] ?? '' ),
				'base_shipping_cost'      => floatval( $settings['pricing']['base_shipping_cost'] ?? 0 ),
				'free_shipping_enabled'   => ! empty( $settings['pricing']['free_shipping_enabled'] ),
				'free_shipping_threshold' => floatval( $settings['pricing']['free_shipping_threshold'] ?? 0 ),
			);
		}

		// Sanitize SMS settings.
		if ( isset( $settings['sms'] ) && is_array( $settings['sms'] ) ) {
			$sanitized['sms'] = array(
				'enabled'                => ! empty( $settings['sms']['enabled'] ),
				'provider'               => sanitize_text_field( $settings['sms']['provider'] ?? 'kavenegar' ),
				'api_key'                => sanitize_text_field( $settings['sms']['api_key'] ?? '' ),
				'sender_number'          => sanitize_text_field( $settings['sms']['sender_number'] ?? '' ),
				'api_url'                => esc_url_raw( $settings['sms']['api_url'] ?? '' ),
				'send_on_order_create'   => ! empty( $settings['sms']['send_on_order_create'] ),
				'order_create_template'  => sanitize_textarea_field( $settings['sms']['order_create_template'] ?? '' ),
				'send_on_status_change'  => ! empty( $settings['sms']['send_on_status_change'] ),
				'status_change_template' => sanitize_textarea_field( $settings['sms']['status_change_template'] ?? '' ),
				'send_on_delivery'       => ! empty( $settings['sms']['send_on_delivery'] ),
				'delivery_template'      => sanitize_textarea_field( $settings['sms']['delivery_template'] ?? '' ),
				'log_messages'           => ! empty( $settings['sms']['log_messages'] ),
				'max_retries'            => absint( $settings['sms']['max_retries'] ?? 3 ),
			);
		}

		// Sanitize firewall settings.
		if ( isset( $settings['firewall'] ) && is_array( $settings['firewall'] ) ) {
			$sanitized['firewall'] = array(
				'enabled'                  => ! empty( $settings['firewall']['enabled'] ),
				'rate_limiting'            => ! empty( $settings['firewall']['rate_limiting'] ),
				'max_requests_per_minute'  => absint( $settings['firewall']['max_requests_per_minute'] ?? 60 ),
				'ip_blocking'              => ! empty( $settings['firewall']['ip_blocking'] ),
				'blocked_ips'              => sanitize_textarea_field( $settings['firewall']['blocked_ips'] ?? '' ),
				'brute_force_protection'   => ! empty( $settings['firewall']['brute_force_protection'] ),
			);
		}

		// Sanitize file settings.
		if ( isset( $settings['file'] ) && is_array( $settings['file'] ) ) {
			$sanitized['file'] = array(
				'max_file_size'         => absint( $settings['file']['max_file_size'] ?? 10 ),
				'allowed_formats'       => sanitize_text_field( $settings['file']['allowed_formats'] ?? 'pdf,jpg,png,doc,docx' ),
				'scan_uploads'          => ! empty( $settings['file']['scan_uploads'] ),
				'upload_path'           => sanitize_text_field( $settings['file']['upload_path'] ?? 'wp-content/uploads/tabesh' ),
				'auto_delete_old_files' => ! empty( $settings['file']['auto_delete_old_files'] ),
				'file_retention_days'   => absint( $settings['file']['file_retention_days'] ?? 90 ),
			);
		}

		// Sanitize access level settings.
		if ( isset( $settings['access_level'] ) && is_array( $settings['access_level'] ) ) {
			$sanitized['access_level'] = array(
				'customer_can_view_orders'   => ! empty( $settings['access_level']['customer_can_view_orders'] ),
				'customer_can_cancel_orders' => ! empty( $settings['access_level']['customer_can_cancel_orders'] ),
				'manager_can_delete_orders'  => ! empty( $settings['access_level']['manager_can_delete_orders'] ),
				'employee_can_edit_orders'   => ! empty( $settings['access_level']['employee_can_edit_orders'] ),
				'require_approval'           => ! empty( $settings['access_level']['require_approval'] ),
				'approval_roles'             => sanitize_text_field( $settings['access_level']['approval_roles'] ?? '' ),
			);
		}

		// Sanitize import/export settings.
		if ( isset( $settings['import_export'] ) && is_array( $settings['import_export'] ) ) {
			$sanitized['import_export'] = array(
				'allow_export'         => ! empty( $settings['import_export']['allow_export'] ),
				'allow_import'         => ! empty( $settings['import_export']['allow_import'] ),
				'export_format'        => sanitize_text_field( $settings['import_export']['export_format'] ?? 'csv' ),
				'include_customer_data' => ! empty( $settings['import_export']['include_customer_data'] ),
				'include_order_data'   => ! empty( $settings['import_export']['include_order_data'] ),
				'auto_backup'          => ! empty( $settings['import_export']['auto_backup'] ),
				'backup_interval'      => absint( $settings['import_export']['backup_interval'] ?? 7 ),
				'max_backups'          => absint( $settings['import_export']['max_backups'] ?? 10 ),
			);
		}

		return $sanitized;
	}
}
