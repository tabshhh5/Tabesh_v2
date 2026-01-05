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

		// Book printing parameters endpoints.
		$this->register_book_parameter_routes( 'book-sizes', 'tabesh_book_sizes' );
		$this->register_book_parameter_routes( 'paper-types', 'tabesh_paper_types' );
		$this->register_book_parameter_routes( 'paper-weights', 'tabesh_paper_weights' );
		$this->register_book_parameter_routes( 'print-types', 'tabesh_print_types' );
		$this->register_book_parameter_routes( 'license-types', 'tabesh_license_types' );
		$this->register_book_parameter_routes( 'cover-weights', 'tabesh_cover_weights' );
		$this->register_book_parameter_routes( 'lamination-types', 'tabesh_lamination_types' );
		$this->register_book_parameter_routes( 'additional-services', 'tabesh_additional_services' );
		$this->register_book_parameter_routes( 'binding-types', 'tabesh_binding_types' );

		// Book pricing endpoints.
		$this->register_book_pricing_routes();

		// Authentication endpoints.
		$this->register_auth_routes();

		// Dashboard management endpoints.
		$this->register_dashboard_routes();

		// WooCommerce integration endpoints.
		$this->register_woocommerce_routes();
	}

	/**
	 * Register book parameter routes.
	 *
	 * @param string $endpoint Endpoint name.
	 * @param string $table_suffix Table suffix without prefix.
	 * @return void
	 */
	private function register_book_parameter_routes( $endpoint, $table_suffix ) {
		// List and create.
		register_rest_route(
			$this->namespace,
			'/book-params/' . $endpoint,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => function( $request ) use ( $table_suffix ) {
						return $this->get_book_parameters( $request, $table_suffix );
					},
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => function( $request ) use ( $table_suffix ) {
						return $this->create_book_parameter( $request, $table_suffix );
					},
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Delete.
		register_rest_route(
			$this->namespace,
			'/book-params/' . $endpoint . '/(?P<id>\d+)',
			array(
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => function( $request ) use ( $table_suffix ) {
						return $this->delete_book_parameter( $request, $table_suffix );
					},
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);
	}

	/**
	 * Register book pricing routes.
	 *
	 * @return void
	 */
	private function register_book_pricing_routes() {
		// Get all pricing data for a book size.
		register_rest_route(
			$this->namespace,
			'/book-pricing/(?P<book_size_id>\d+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_book_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Page cost pricing.
		register_rest_route(
			$this->namespace,
			'/book-pricing/page-cost',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_page_cost_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_page_cost_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Binding pricing.
		register_rest_route(
			$this->namespace,
			'/book-pricing/binding',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_binding_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_binding_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Additional services pricing.
		register_rest_route(
			$this->namespace,
			'/book-pricing/additional-services',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_additional_services_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_additional_services_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Service binding restrictions.
		register_rest_route(
			$this->namespace,
			'/book-pricing/service-restrictions',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_service_restrictions' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_service_restrictions' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// Size limits.
		register_rest_route(
			$this->namespace,
			'/book-pricing/size-limits',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_size_limits' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_size_limits' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
			)
		);

		// License pricing.
		register_rest_route(
			$this->namespace,
			'/book-pricing/license-pricing',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_license_pricing' ),
					'permission_callback' => array( $this, 'check_permissions' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_license_pricing' ),
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
		$defaults = \Tabesh_v2\Panels\Settings_Panel::get_default_settings();
		
		// Merge with defaults to ensure all settings exist.
		if ( empty( $settings ) ) {
			$settings = $defaults;
		} else {
			$settings = array_replace_recursive( $defaults, $settings );
		}
		
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

		// Sanitize auth settings (OTP and Melipayamak).
		if ( isset( $settings['auth'] ) && is_array( $settings['auth'] ) ) {
			$sanitized['auth'] = array(
				'otp_enabled'        => ! empty( $settings['auth']['otp_enabled'] ),
				'otp_length'         => absint( $settings['auth']['otp_length'] ?? 5 ),
				'otp_expiry'         => absint( $settings['auth']['otp_expiry'] ?? 120 ),
				'replace_woocommerce' => ! empty( $settings['auth']['replace_woocommerce'] ),
				'require_name'       => ! empty( $settings['auth']['require_name'] ),
				'allow_corporate'    => ! empty( $settings['auth']['allow_corporate'] ),
				'auto_create_user'   => ! empty( $settings['auth']['auto_create_user'] ),
			);

			// Sanitize melipayamak sub-settings.
			if ( isset( $settings['auth']['melipayamak'] ) && is_array( $settings['auth']['melipayamak'] ) ) {
				$sanitized['auth']['melipayamak'] = array(
					'username'   => sanitize_text_field( $settings['auth']['melipayamak']['username'] ?? '' ),
					'password'   => sanitize_text_field( $settings['auth']['melipayamak']['password'] ?? '' ),
					'pattern_id' => sanitize_text_field( $settings['auth']['melipayamak']['pattern_id'] ?? '' ),
				);
			}
		}

		// Sanitize user dashboard settings.
		if ( isset( $settings['user_dashboard'] ) && is_array( $settings['user_dashboard'] ) ) {
			$sanitized['user_dashboard'] = array(
				'enabled'           => ! empty( $settings['user_dashboard']['enabled'] ),
				'page_slug'         => sanitize_title( $settings['user_dashboard']['page_slug'] ?? 'panel' ),
				'dashboard_page_id' => absint( $settings['user_dashboard']['dashboard_page_id'] ?? 0 ),
			);

			// Sanitize menu items.
			if ( isset( $settings['user_dashboard']['menu_items'] ) && is_array( $settings['user_dashboard']['menu_items'] ) ) {
				$sanitized['user_dashboard']['menu_items'] = array();
				foreach ( $settings['user_dashboard']['menu_items'] as $item ) {
					if ( is_array( $item ) ) {
						$sanitized['user_dashboard']['menu_items'][] = array(
							'id'      => sanitize_key( $item['id'] ?? '' ),
							'label'   => sanitize_text_field( $item['label'] ?? '' ),
							'icon'    => sanitize_text_field( $item['icon'] ?? '' ),
							'enabled' => ! empty( $item['enabled'] ),
						);
					}
				}
			}
		}

		return $sanitized;
	}

	/**
	 * Get book parameters.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @param string           $table_suffix Table suffix without prefix.
	 * @return \WP_REST_Response
	 */
	private function get_book_parameters( $request, $table_suffix ) {
		global $wpdb;

		// Validate table suffix to prevent SQL injection.
		$allowed_tables = array(
			'tabesh_book_sizes',
			'tabesh_paper_types',
			'tabesh_paper_weights',
			'tabesh_print_types',
			'tabesh_license_types',
			'tabesh_cover_weights',
			'tabesh_lamination_types',
			'tabesh_additional_services',
			'tabesh_binding_types',
		);

		if ( ! in_array( $table_suffix, $allowed_tables, true ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Invalid table name', 'tabesh-v2' ),
				),
				400
			);
		}

		$table = $wpdb->prefix . $table_suffix;

		// Special handling for paper_weights to include paper_type relationship.
		if ( 'tabesh_paper_weights' === $table_suffix ) {
			$results = $wpdb->get_results(
				"SELECT pw.*, pt.name as paper_type_name 
				FROM {$table} pw 
				LEFT JOIN {$wpdb->prefix}tabesh_paper_types pt ON pw.paper_type_id = pt.id 
				ORDER BY pw.id DESC",
				ARRAY_A
			); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		} else {
			$results = $wpdb->get_results(
				"SELECT * FROM {$table} ORDER BY id DESC",
				ARRAY_A
			); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $results,
			),
			200
		);
	}

	/**
	 * Create book parameter.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @param string           $table_suffix Table suffix without prefix.
	 * @return \WP_REST_Response
	 */
	private function create_book_parameter( $request, $table_suffix ) {
		global $wpdb;

		// Validate table suffix to prevent SQL injection.
		$allowed_tables = array(
			'tabesh_book_sizes',
			'tabesh_paper_types',
			'tabesh_paper_weights',
			'tabesh_print_types',
			'tabesh_license_types',
			'tabesh_cover_weights',
			'tabesh_lamination_types',
			'tabesh_additional_services',
			'tabesh_binding_types',
		);

		if ( ! in_array( $table_suffix, $allowed_tables, true ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Invalid table name', 'tabesh-v2' ),
				),
				400
			);
		}

		$table = $wpdb->prefix . $table_suffix;

		$data = array();

		// Handle different table structures with validation.
		if ( 'tabesh_paper_weights' === $table_suffix ) {
			$paper_type_id = absint( $request->get_param( 'paper_type_id' ) );
			$weight = absint( $request->get_param( 'weight' ) );
			
			if ( ! $paper_type_id || ! $weight ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => __( 'نوع کاغذ و گرماژ الزامی است', 'tabesh-v2' ),
					),
					400
				);
			}
			
			$data['paper_type_id'] = $paper_type_id;
			$data['weight']        = $weight;
		} elseif ( 'tabesh_cover_weights' === $table_suffix ) {
			$weight = absint( $request->get_param( 'weight' ) );
			
			if ( ! $weight ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => __( 'گرماژ الزامی است', 'tabesh-v2' ),
					),
					400
				);
			}
			
			$data['weight'] = $weight;
		} else {
			$name = sanitize_text_field( $request->get_param( 'name' ) );
			
			if ( empty( $name ) ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => __( 'نام پارامتر الزامی است', 'tabesh-v2' ),
					),
					400
				);
			}
			
			$data['name'] = $name;
		}

		// Add prompt_master if provided.
		if ( $request->get_param( 'prompt_master' ) ) {
			$data['prompt_master'] = sanitize_textarea_field( $request->get_param( 'prompt_master' ) );
		}

		$result = $wpdb->insert( $table, $data );

		if ( ! $result ) {
			// Check for duplicate entry error using error code
			if ( 1062 === $wpdb->last_errno ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => __( 'این مقدار قبلاً ثبت شده است', 'tabesh-v2' ),
					),
					400
				);
			}
			
			// Log the full error for debugging
			error_log( 'Tabesh DB Error: ' . $wpdb->last_error );
			
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'خطا در ثبت پارامتر. لطفاً دوباره تلاش کنید.', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'پارامتر با موفقیت ثبت شد', 'tabesh-v2' ),
				'id'      => $wpdb->insert_id,
			),
			201
		);
	}

	/**
	 * Delete book parameter.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @param string           $table_suffix Table suffix without prefix.
	 * @return \WP_REST_Response
	 */
	private function delete_book_parameter( $request, $table_suffix ) {
		global $wpdb;

		// Validate table suffix to prevent SQL injection.
		$allowed_tables = array(
			'tabesh_book_sizes',
			'tabesh_paper_types',
			'tabesh_paper_weights',
			'tabesh_print_types',
			'tabesh_license_types',
			'tabesh_cover_weights',
			'tabesh_lamination_types',
			'tabesh_additional_services',
			'tabesh_binding_types',
		);

		if ( ! in_array( $table_suffix, $allowed_tables, true ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Invalid table name', 'tabesh-v2' ),
				),
				400
			);
		}

		$table = $wpdb->prefix . $table_suffix;
		$id    = absint( $request->get_param( 'id' ) );

		$result = $wpdb->delete( $table, array( 'id' => $id ) );

		if ( ! $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to delete parameter', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Parameter deleted successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get all pricing data for a book size.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_book_pricing( $request ) {
		$book_size_id = absint( $request->get_param( 'book_size_id' ) );

		return new \WP_REST_Response(
			array(
				'success'        => true,
				'page_costs'     => $this->get_page_costs_for_size( $book_size_id ),
				'bindings'       => $this->get_bindings_for_size( $book_size_id ),
				'services'       => $this->get_services_for_size( $book_size_id ),
				'restrictions'   => $this->get_restrictions_for_size( $book_size_id ),
				'limits'         => $this->get_limits_for_size( $book_size_id ),
			),
			200
		);
	}

	/**
	 * Get page cost pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_page_cost_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_page_cost';
		$book_size_id = $request->get_param( 'book_size_id' );

		$where = '';
		if ( $book_size_id ) {
			$where = $wpdb->prepare( 'WHERE book_size_id = %d', absint( $book_size_id ) );
		}

		$results = $wpdb->get_results(
			"SELECT pc.*, 
				pt.name as paper_type_name,
				pw.weight as paper_weight,
				pr.name as print_type_name
			FROM {$table} pc
			LEFT JOIN {$wpdb->prefix}tabesh_paper_types pt ON pc.paper_type_id = pt.id
			LEFT JOIN {$wpdb->prefix}tabesh_paper_weights pw ON pc.paper_weight_id = pw.id
			LEFT JOIN {$wpdb->prefix}tabesh_print_types pr ON pc.print_type_id = pr.id
			{$where}
			ORDER BY pc.id DESC",
			ARRAY_A
		); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $results,
			),
			200
		);
	}

	/**
	 * Save page cost pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_page_cost_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_page_cost';

		$data = array(
			'book_size_id'    => absint( $request->get_param( 'book_size_id' ) ),
			'paper_type_id'   => absint( $request->get_param( 'paper_type_id' ) ),
			'paper_weight_id' => absint( $request->get_param( 'paper_weight_id' ) ),
			'print_type_id'   => absint( $request->get_param( 'print_type_id' ) ),
			'price'           => floatval( $request->get_param( 'price' ) ),
			'is_enabled'      => ! empty( $request->get_param( 'is_enabled' ) ) ? 1 : 0,
		);

		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$table} WHERE book_size_id = %d AND paper_type_id = %d AND paper_weight_id = %d AND print_type_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$data['book_size_id'],
				$data['paper_type_id'],
				$data['paper_weight_id'],
				$data['print_type_id']
			)
		);

		if ( $existing ) {
			$result = $wpdb->update( $table, $data, array( 'id' => $existing ) );
		} else {
			$result = $wpdb->insert( $table, $data );
		}

		if ( false === $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to save pricing', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Pricing saved successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get binding pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_binding_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_binding';
		$book_size_id = $request->get_param( 'book_size_id' );

		$where = '';
		if ( $book_size_id ) {
			$where = $wpdb->prepare( 'WHERE book_size_id = %d', absint( $book_size_id ) );
		}

		$results = $wpdb->get_results(
			"SELECT bp.*, 
				bt.name as binding_type_name,
				cw.weight as cover_weight
			FROM {$table} bp
			LEFT JOIN {$wpdb->prefix}tabesh_binding_types bt ON bp.binding_type_id = bt.id
			LEFT JOIN {$wpdb->prefix}tabesh_cover_weights cw ON bp.cover_weight_id = cw.id
			{$where}
			ORDER BY bp.id DESC",
			ARRAY_A
		); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $results,
			),
			200
		);
	}

	/**
	 * Save binding pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_binding_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_binding';

		$data = array(
			'book_size_id'    => absint( $request->get_param( 'book_size_id' ) ),
			'binding_type_id' => absint( $request->get_param( 'binding_type_id' ) ),
			'cover_weight_id' => absint( $request->get_param( 'cover_weight_id' ) ),
			'price'           => floatval( $request->get_param( 'price' ) ),
			'is_enabled'      => ! empty( $request->get_param( 'is_enabled' ) ) ? 1 : 0,
		);

		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$table} WHERE book_size_id = %d AND binding_type_id = %d AND cover_weight_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$data['book_size_id'],
				$data['binding_type_id'],
				$data['cover_weight_id']
			)
		);

		if ( $existing ) {
			$result = $wpdb->update( $table, $data, array( 'id' => $existing ) );
		} else {
			$result = $wpdb->insert( $table, $data );
		}

		if ( false === $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to save binding pricing', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Binding pricing saved successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get additional services pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_additional_services_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_additional_services';
		$book_size_id = $request->get_param( 'book_size_id' );

		$where = '';
		if ( $book_size_id ) {
			$where = $wpdb->prepare( 'WHERE book_size_id = %d', absint( $book_size_id ) );
		}

		$results = $wpdb->get_results(
			"SELECT ps.*, 
				s.name as service_name
			FROM {$table} ps
			LEFT JOIN {$wpdb->prefix}tabesh_additional_services s ON ps.service_id = s.id
			{$where}
			ORDER BY ps.id DESC",
			ARRAY_A
		); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $results,
			),
			200
		);
	}

	/**
	 * Save additional services pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_additional_services_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_additional_services';

		$data = array(
			'book_size_id'     => absint( $request->get_param( 'book_size_id' ) ),
			'service_id'       => absint( $request->get_param( 'service_id' ) ),
			'price'            => floatval( $request->get_param( 'price' ) ),
			'calculation_type' => sanitize_text_field( $request->get_param( 'calculation_type' ) ),
			'pages_per_unit'   => $request->get_param( 'pages_per_unit' ) ? absint( $request->get_param( 'pages_per_unit' ) ) : null,
			'is_enabled'       => ! empty( $request->get_param( 'is_enabled' ) ) ? 1 : 0,
		);

		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$table} WHERE book_size_id = %d AND service_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$data['book_size_id'],
				$data['service_id']
			)
		);

		if ( $existing ) {
			$result = $wpdb->update( $table, $data, array( 'id' => $existing ) );
		} else {
			$result = $wpdb->insert( $table, $data );
		}

		if ( false === $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to save service pricing', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Service pricing saved successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get service binding restrictions.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_service_restrictions( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_service_binding_restrictions';
		$book_size_id = $request->get_param( 'book_size_id' );

		$where = '';
		if ( $book_size_id ) {
			$where = $wpdb->prepare( 'WHERE book_size_id = %d', absint( $book_size_id ) );
		}

		$results = $wpdb->get_results(
			"SELECT sr.*, 
				s.name as service_name,
				bt.name as binding_type_name
			FROM {$table} sr
			LEFT JOIN {$wpdb->prefix}tabesh_additional_services s ON sr.service_id = s.id
			LEFT JOIN {$wpdb->prefix}tabesh_binding_types bt ON sr.binding_type_id = bt.id
			{$where}
			ORDER BY sr.id DESC",
			ARRAY_A
		); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $results,
			),
			200
		);
	}

	/**
	 * Save service binding restrictions.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_service_restrictions( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_service_binding_restrictions';

		$data = array(
			'book_size_id'    => absint( $request->get_param( 'book_size_id' ) ),
			'service_id'      => absint( $request->get_param( 'service_id' ) ),
			'binding_type_id' => absint( $request->get_param( 'binding_type_id' ) ),
			'is_enabled'      => ! empty( $request->get_param( 'is_enabled' ) ) ? 1 : 0,
		);

		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$table} WHERE book_size_id = %d AND service_id = %d AND binding_type_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$data['book_size_id'],
				$data['service_id'],
				$data['binding_type_id']
			)
		);

		if ( $existing ) {
			$result = $wpdb->update( $table, $data, array( 'id' => $existing ) );
		} else {
			$result = $wpdb->insert( $table, $data );
		}

		if ( false === $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to save restrictions', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Restrictions saved successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get size limits.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_size_limits( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_size_limits';
		$book_size_id = $request->get_param( 'book_size_id' );

		if ( $book_size_id ) {
			$result = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
					absint( $book_size_id )
				),
				ARRAY_A
			);
		} else {
			$result = $wpdb->get_results(
				"SELECT * FROM {$table} ORDER BY id DESC", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				ARRAY_A
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $result,
			),
			200
		);
	}

	/**
	 * Save size limits.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_size_limits( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_size_limits';

		$data = array(
			'book_size_id'      => absint( $request->get_param( 'book_size_id' ) ),
			'min_circulation'   => absint( $request->get_param( 'min_circulation' ) ),
			'max_circulation'   => absint( $request->get_param( 'max_circulation' ) ),
			'circulation_step'  => absint( $request->get_param( 'circulation_step' ) ),
			'min_pages'         => absint( $request->get_param( 'min_pages' ) ),
			'max_pages'         => absint( $request->get_param( 'max_pages' ) ),
			'pages_step'        => absint( $request->get_param( 'pages_step' ) ),
		);

		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$data['book_size_id']
			)
		);

		if ( $existing ) {
			$result = $wpdb->update( $table, $data, array( 'id' => $existing ) );
		} else {
			$result = $wpdb->insert( $table, $data );
		}

		if ( false === $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to save limits', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Limits saved successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get license pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_license_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_license';

		$results = $wpdb->get_results(
			"SELECT * FROM {$table}", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			ARRAY_A
		);

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $results,
			),
			200
		);
	}

	/**
	 * Save license pricing.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_license_pricing( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_license';

		$license_type_id = $request->get_param( 'license_type_id' );
		$price           = $request->get_param( 'price' );
		$is_enabled      = $request->get_param( 'is_enabled' );

		if ( null === $license_type_id || null === $price ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Missing required parameters', 'tabesh-v2' ),
				),
				400
			);
		}

		$data = array(
			'license_type_id' => intval( $license_type_id ),
			'price'           => floatval( $price ),
			'is_enabled'      => intval( $is_enabled ),
		);

		// Check if record exists.
		$existing = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT id FROM {$table} WHERE license_type_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$license_type_id
			)
		);

		if ( $existing ) {
			$result = $wpdb->update(
				$table,
				$data,
				array( 'license_type_id' => $license_type_id )
			);
		} else {
			$result = $wpdb->insert( $table, $data );
		}

		if ( false === $result ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Failed to save license pricing', 'tabesh-v2' ),
				),
				500
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'License pricing saved successfully', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Helper methods for getting pricing data.
	 */
	private function get_page_costs_for_size( $book_size_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_page_cost';
		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$book_size_id
			),
			ARRAY_A
		);
	}

	private function get_bindings_for_size( $book_size_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_binding';
		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$book_size_id
			),
			ARRAY_A
		);
	}

	private function get_services_for_size( $book_size_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_additional_services';
		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$book_size_id
			),
			ARRAY_A
		);
	}

	private function get_restrictions_for_size( $book_size_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_service_binding_restrictions';
		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$book_size_id
			),
			ARRAY_A
		);
	}

	private function get_limits_for_size( $book_size_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'tabesh_book_pricing_size_limits';
		return $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE book_size_id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$book_size_id
			),
			ARRAY_A
		);
	}

	/**
	 * Register authentication routes.
	 *
	 * @return void
	 */
	private function register_auth_routes() {
		// Send OTP.
		register_rest_route(
			$this->namespace,
			'/auth/send-otp',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'send_otp' ),
				'permission_callback' => '__return_true', // Public endpoint.
				'args'                => array(
					'mobile' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Verify OTP and login/register.
		register_rest_route(
			$this->namespace,
			'/auth/verify-otp',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'verify_otp' ),
				'permission_callback' => '__return_true', // Public endpoint.
				'args'                => array(
					'mobile'       => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'code'         => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'first_name'   => array(
						'required'          => false,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'last_name'    => array(
						'required'          => false,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'is_corporate' => array(
						'required'          => false,
						'type'              => 'boolean',
					),
					'company_name' => array(
						'required'          => false,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Test SMS connection.
		register_rest_route(
			$this->namespace,
			'/auth/test-sms',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'test_sms' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'mobile' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);
	}

	/**
	 * Register dashboard management routes.
	 *
	 * @return void
	 */
	private function register_dashboard_routes() {
		// Create or regenerate dashboard page.
		register_rest_route(
			$this->namespace,
			'/dashboard/create-page',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_dashboard_page' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
					'slug' => array(
						'required'          => false,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_title',
					),
				),
			)
		);
	}

	/**
	 * Send OTP to mobile number.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function send_otp( $request ) {
		$mobile = $request->get_param( 'mobile' );

		$auth_handler = new \Tabesh_v2\Helpers\Auth_Handler();
		$result = $auth_handler->send_otp( $mobile );

		if ( ! $result['success'] ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => $result['message'],
				),
				400
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => $result['message'],
			),
			200
		);
	}

	/**
	 * Verify OTP and login/register user.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function verify_otp( $request ) {
		$mobile = $request->get_param( 'mobile' );
		$code = $request->get_param( 'code' );

		$auth_handler = new \Tabesh_v2\Helpers\Auth_Handler();
		
		// First verify the OTP code.
		$verify_result = $auth_handler->verify_otp( $mobile, $code );
		
		if ( ! $verify_result['success'] ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => $verify_result['message'],
				),
				400
			);
		}

		// OTP is valid, now login or register.
		$user_data = array(
			'first_name'   => $request->get_param( 'first_name' ),
			'last_name'    => $request->get_param( 'last_name' ),
			'is_corporate' => $request->get_param( 'is_corporate' ),
			'company_name' => $request->get_param( 'company_name' ),
		);

		$login_result = $auth_handler->login_or_register( $mobile, $user_data );

		if ( ! $login_result['success'] ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => $login_result['message'],
				),
				400
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => $login_result['message'],
				'is_new'  => $login_result['is_new'],
				'user_id' => $login_result['user_id'],
			),
			200
		);
	}

	/**
	 * Test SMS connection.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function test_sms( $request ) {
		$mobile = $request->get_param( 'mobile' );

		$sms = new \Tabesh_v2\Helpers\Melipayamak();
		$result = $sms->test_connection( $mobile );

		if ( ! $result['success'] ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => $result['message'],
				),
				400
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => $result['message'],
			),
			200
		);
	}

	/**
	 * Create or regenerate dashboard page.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function create_dashboard_page( $request ) {
		$slug = $request->get_param( 'slug' );
		
		if ( empty( $slug ) ) {
			$settings = get_option( 'tabesh_v2_settings', array() );
			$slug = $settings['user_dashboard']['page_slug'] ?? 'panel';
		}

		// Check if page already exists.
		$existing_page = get_page_by_path( $slug );
		$page_id = 0;

		if ( $existing_page ) {
			// Update existing page.
			$page_id = wp_update_post(
				array(
					'ID'           => $existing_page->ID,
					'post_title'   => __( 'داشبورد کاربران', 'tabesh-v2' ),
					'post_content' => '[tabesh_customer_dashboard]',
					'post_status'  => 'publish',
					'post_type'    => 'page',
				)
			);
		} else {
			// Create new page.
			$page_id = wp_insert_post(
				array(
					'post_title'   => __( 'داشبورد کاربران', 'tabesh-v2' ),
					'post_name'    => $slug,
					'post_content' => '[tabesh_customer_dashboard]',
					'post_status'  => 'publish',
					'post_type'    => 'page',
				)
			);
		}

		if ( is_wp_error( $page_id ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => $page_id->get_error_message(),
				),
				400
			);
		}

		// Update settings with page ID.
		$settings = get_option( 'tabesh_v2_settings', array() );
		if ( ! isset( $settings['user_dashboard'] ) ) {
			$settings['user_dashboard'] = array();
		}
		$settings['user_dashboard']['dashboard_page_id'] = $page_id;
		$settings['user_dashboard']['page_slug'] = $slug;
		update_option( 'tabesh_v2_settings', $settings );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'صفحه داشبورد با موفقیت ایجاد شد.', 'tabesh-v2' ),
				'page_id' => $page_id,
				'url'     => get_permalink( $page_id ),
			),
			200
		);
	}

	/**
	 * Register WooCommerce integration routes.
	 *
	 * @return void
	 */
	private function register_woocommerce_routes() {
		// Get customer orders.
		register_rest_route(
			$this->namespace,
			'/woocommerce/orders',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_woocommerce_orders' ),
				'permission_callback' => function() {
					return is_user_logged_in();
				},
			)
		);

		// Get customer addresses.
		register_rest_route(
			$this->namespace,
			'/woocommerce/addresses',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_woocommerce_addresses' ),
				'permission_callback' => function() {
					return is_user_logged_in();
				},
			)
		);

		// Update customer address.
		register_rest_route(
			$this->namespace,
			'/woocommerce/addresses',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_woocommerce_address' ),
				'permission_callback' => function() {
					return is_user_logged_in();
				},
			)
		);

		// Get customer data.
		register_rest_route(
			$this->namespace,
			'/woocommerce/customer',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_woocommerce_customer' ),
				'permission_callback' => function() {
					return is_user_logged_in();
				},
			)
		);
	}

	/**
	 * Get WooCommerce orders for current user.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_woocommerce_orders( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'WooCommerce is not active.', 'tabesh-v2' ),
				),
				400
			);
		}

		$user_id = get_current_user_id();
		$limit = $request->get_param( 'limit' ) ?? 10;
		
		$orders_data = \Tabesh_v2\Helpers\Dashboard_Integration::get_customer_orders( $user_id, $limit );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'orders'  => $orders_data,
			),
			200
		);
	}

	/**
	 * Get WooCommerce addresses for current user.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_woocommerce_addresses( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'WooCommerce is not active.', 'tabesh-v2' ),
				),
				400
			);
		}

		$user_id = get_current_user_id();
		$customer_data = \Tabesh_v2\Helpers\Dashboard_Integration::get_woocommerce_customer_data( $user_id );

		return new \WP_REST_Response(
			array(
				'success'   => true,
				'addresses' => $customer_data['addresses'] ?? array(),
			),
			200
		);
	}

	/**
	 * Update WooCommerce address for current user.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function update_woocommerce_address( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'WooCommerce is not active.', 'tabesh-v2' ),
				),
				400
			);
		}

		$user_id = get_current_user_id();
		$address_type = $request->get_param( 'type' ) ?? 'billing';
		$address_data = $request->get_param( 'address' ) ?? array();

		if ( ! in_array( $address_type, array( 'billing', 'shipping' ), true ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Invalid address type.', 'tabesh-v2' ),
				),
				400
			);
		}

		$customer = new \WC_Customer( $user_id );

		// Update address fields.
		foreach ( $address_data as $key => $value ) {
			$method = "set_{$address_type}_{$key}";
			if ( method_exists( $customer, $method ) ) {
				$customer->$method( sanitize_text_field( $value ) );
			}
		}

		$customer->save();

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'آدرس با موفقیت به‌روزرسانی شد.', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Get WooCommerce customer data.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_woocommerce_customer( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'WooCommerce is not active.', 'tabesh-v2' ),
				),
				400
			);
		}

		$user_id = get_current_user_id();
		$customer_data = \Tabesh_v2\Helpers\Dashboard_Integration::get_woocommerce_customer_data( $user_id );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $customer_data,
			),
			200
		);
	}
}

