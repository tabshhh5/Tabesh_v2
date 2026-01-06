<?php
/**
 * Dashboard Integration Helper Class.
 *
 * @package Tabesh_v2\Helpers
 */

namespace Tabesh_v2\Helpers;

/**
 * Dashboard Integration Class.
 *
 * Handles integration of Tabesh dashboard with WordPress and WooCommerce.
 */
class Dashboard_Integration {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Hook into template redirect to handle dashboard pages.
		add_action( 'template_redirect', array( $this, 'handle_dashboard_redirect' ), 10 );
		
		// Filter WooCommerce my account page.
		add_filter( 'woocommerce_account_content', array( $this, 'replace_woocommerce_account' ), 999 );
		
		// Add body class for dashboard pages.
		add_filter( 'body_class', array( $this, 'add_dashboard_body_class' ) );
		
		// Replace WooCommerce account menu.
		add_action( 'woocommerce_before_account_navigation', array( $this, 'maybe_hide_woocommerce_menu' ), 1 );
	}

	/**
	 * Handle dashboard page redirects and rendering.
	 *
	 * @return void
	 */
	public function handle_dashboard_redirect() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$dashboard_settings = $settings['user_dashboard'] ?? array();
		
		// Check if dashboard is enabled.
		if ( empty( $dashboard_settings['enabled'] ) ) {
			return;
		}

		// Get the configured page slug.
		$page_slug = $dashboard_settings['page_slug'] ?? 'panel';
		$dashboard_page_id = $dashboard_settings['dashboard_page_id'] ?? 0;

		// Check if we're on the dashboard page by slug.
		$current_url = $_SERVER['REQUEST_URI'] ?? '';
		$is_dashboard_url = false;

		// Check by URL slug.
		if ( strpos( $current_url, '/' . $page_slug . '/' ) !== false || 
		     strpos( $current_url, '/' . $page_slug ) !== false ) {
			$is_dashboard_url = true;
		}

		// Check if we're on the dashboard page by ID.
		if ( ! $is_dashboard_url && is_page( $dashboard_page_id ) ) {
			$is_dashboard_url = true;
		}

		// If we're on a dashboard URL, ensure the content is properly displayed.
		if ( $is_dashboard_url ) {
			// Set a global flag.
			global $tabesh_is_dashboard_page;
			$tabesh_is_dashboard_page = true;
		}
	}

	/**
	 * Replace WooCommerce my account content with Tabesh dashboard.
	 *
	 * @param string $content Original content.
	 * @return string Modified content.
	 */
	public function replace_woocommerce_account( $content ) {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$auth_settings = $settings['auth'] ?? array();
		
		// Check if WooCommerce replacement is enabled.
		if ( empty( $auth_settings['replace_woocommerce'] ) ) {
			return $content;
		}

		// Check if this is the main my-account page (not an endpoint).
		if ( is_account_page() && ! is_wc_endpoint_url() ) {
			// Return our dashboard shortcode.
			return do_shortcode( '[tabesh_customer_dashboard]' );
		}

		return $content;
	}

	/**
	 * Add body class for dashboard pages.
	 *
	 * @param array $classes Body classes.
	 * @return array Modified classes.
	 */
	public function add_dashboard_body_class( $classes ) {
		global $tabesh_is_dashboard_page;
		
		if ( ! empty( $tabesh_is_dashboard_page ) ) {
			$classes[] = 'tabesh-dashboard-page';
		}

		// Check for WooCommerce my-account page.
		if ( function_exists( 'is_account_page' ) && is_account_page() ) {
			$settings = get_option( 'tabesh_v2_settings', array() );
			$auth_settings = $settings['auth'] ?? array();
			
			if ( ! empty( $auth_settings['replace_woocommerce'] ) ) {
				$classes[] = 'tabesh-wc-dashboard-override';
			}
		}

		return $classes;
	}

	/**
	 * Maybe hide WooCommerce account navigation menu.
	 *
	 * @return void
	 */
	public function maybe_hide_woocommerce_menu() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$auth_settings = $settings['auth'] ?? array();
		
		// Check if WooCommerce replacement is enabled.
		if ( empty( $auth_settings['replace_woocommerce'] ) ) {
			return;
		}

		// Hide WooCommerce menu when on main account page.
		if ( is_account_page() && ! is_wc_endpoint_url() ) {
			?>
			<style>
				.woocommerce-MyAccount-navigation {
					display: none !important;
				}
				.woocommerce-MyAccount-content {
					width: 100% !important;
				}
			</style>
			<?php
		}
	}

	/**
	 * Get WooCommerce customer data for dashboard.
	 *
	 * @param int $user_id User ID.
	 * @return array Customer data.
	 */
	public static function get_woocommerce_customer_data( $user_id ) {
		if ( ! function_exists( 'wc_get_customer_last_order' ) ) {
			return array();
		}

		$customer = new \WC_Customer( $user_id );
		$last_order = wc_get_customer_last_order( $user_id );

		$data = array(
			'total_orders'  => wc_get_customer_order_count( $user_id ),
			'total_spent'   => wc_get_customer_total_spent( $user_id ),
			'last_order'    => $last_order ? array(
				'id'     => $last_order->get_id(),
				'date'   => $last_order->get_date_created()->date( 'Y-m-d H:i:s' ),
				'total'  => $last_order->get_total(),
				'status' => $last_order->get_status(),
			) : null,
			'addresses'     => array(
				'billing'  => array(
					'first_name' => $customer->get_billing_first_name(),
					'last_name'  => $customer->get_billing_last_name(),
					'company'    => $customer->get_billing_company(),
					'address_1'  => $customer->get_billing_address_1(),
					'address_2'  => $customer->get_billing_address_2(),
					'city'       => $customer->get_billing_city(),
					'state'      => $customer->get_billing_state(),
					'postcode'   => $customer->get_billing_postcode(),
					'country'    => $customer->get_billing_country(),
					'phone'      => $customer->get_billing_phone(),
					'email'      => $customer->get_billing_email(),
				),
				'shipping' => array(
					'first_name' => $customer->get_shipping_first_name(),
					'last_name'  => $customer->get_shipping_last_name(),
					'company'    => $customer->get_shipping_company(),
					'address_1'  => $customer->get_shipping_address_1(),
					'address_2'  => $customer->get_shipping_address_2(),
					'city'       => $customer->get_shipping_city(),
					'state'      => $customer->get_shipping_state(),
					'postcode'   => $customer->get_shipping_postcode(),
					'country'    => $customer->get_shipping_country(),
				),
			),
		);

		return $data;
	}

	/**
	 * Get customer orders for dashboard display.
	 *
	 * @param int $user_id User ID.
	 * @param int $limit   Limit number of orders.
	 * @return array Orders data.
	 */
	public static function get_customer_orders( $user_id, $limit = 10 ) {
		if ( ! function_exists( 'wc_get_orders' ) ) {
			return array();
		}

		$orders = wc_get_orders(
			array(
				'customer' => $user_id,
				'limit'    => $limit,
				'orderby'  => 'date',
				'order'    => 'DESC',
			)
		);

		$orders_data = array();

		foreach ( $orders as $order ) {
			$orders_data[] = array(
				'id'            => $order->get_id(),
				'order_number'  => $order->get_order_number(),
				'date'          => $order->get_date_created()->date( 'Y-m-d H:i:s' ),
				'status'        => $order->get_status(),
				'status_name'   => wc_get_order_status_name( $order->get_status() ),
				'total'         => $order->get_total(),
				'currency'      => $order->get_currency(),
				'payment_method' => $order->get_payment_method_title(),
				'items_count'   => $order->get_item_count(),
			);
		}

		return $orders_data;
	}
}
