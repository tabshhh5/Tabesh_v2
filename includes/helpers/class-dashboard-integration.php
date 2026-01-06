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
		
		// Redirect WordPress login/register pages to custom panel.
		add_action( 'init', array( $this, 'redirect_wp_login_pages' ), 1 );
		
		// Filter login URL.
		add_filter( 'login_url', array( $this, 'custom_login_url' ), 999, 3 );
		
		// Filter registration URL.
		add_filter( 'register_url', array( $this, 'custom_register_url' ), 999 );
		
		// Filter logout redirect.
		add_filter( 'logout_redirect', array( $this, 'custom_logout_redirect' ), 999, 3 );
		
		// WooCommerce specific redirects.
		add_filter( 'woocommerce_login_redirect', array( $this, 'wc_login_redirect' ), 999, 2 );
		add_filter( 'woocommerce_registration_redirect', array( $this, 'wc_registration_redirect' ), 999 );
		add_action( 'template_redirect', array( $this, 'redirect_wc_account_pages' ), 5 );
		
		// Filter WooCommerce my account page.
		add_filter( 'woocommerce_account_content', array( $this, 'replace_woocommerce_account' ), 999 );
		
		// Add body class for dashboard pages.
		add_filter( 'body_class', array( $this, 'add_dashboard_body_class' ) );
		
		// Replace WooCommerce account menu.
		add_action( 'woocommerce_before_account_navigation', array( $this, 'maybe_hide_woocommerce_menu' ), 1 );
		
		// Override template for dashboard pages to render blank page.
		add_filter( 'template_include', array( $this, 'dashboard_blank_template' ), 999 );
		
		// Add custom styles to hide header/footer on dashboard pages.
		add_action( 'wp_head', array( $this, 'add_dashboard_page_styles' ), 999 );
	}

	/**
	 * Get the custom panel URL.
	 *
	 * @return string Panel URL.
	 */
	private function get_panel_url() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$dashboard_settings = $settings['user_dashboard'] ?? array();
		$page_slug = $dashboard_settings['page_slug'] ?? 'panel';
		return home_url( '/' . $page_slug . '/' );
	}

	/**
	 * Check if custom panel redirect is enabled.
	 *
	 * @return bool Whether redirect is enabled.
	 */
	private function is_redirect_enabled() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$dashboard_settings = $settings['user_dashboard'] ?? array();
		$auth_settings = $settings['auth'] ?? array();
		
		// Both dashboard and OTP must be enabled for redirects.
		return ! empty( $dashboard_settings['enabled'] ) && ! empty( $auth_settings['otp_enabled'] );
	}

	/**
	 * Redirect WordPress login and register pages to custom panel.
	 *
	 * @return void
	 */
	public function redirect_wp_login_pages() {
		global $pagenow;
		
		if ( ! $this->is_redirect_enabled() ) {
			return;
		}
		
		// Skip for AJAX, REST API, admin users, and wp-cli.
		if ( wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
			return;
		}
		
		// Skip for admin users accessing wp-login.php (allow access to backend).
		if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
			return;
		}
		
		// Redirect wp-login.php for non-admin actions.
		if ( 'wp-login.php' === $pagenow ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$action = isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '';
			
			// Allow certain actions that need wp-login.php.
			$allowed_actions = array( 'logout', 'postpass', 'rp', 'resetpass', 'lostpassword' );
			
			if ( ! in_array( $action, $allowed_actions, true ) ) {
				wp_safe_redirect( $this->get_panel_url() );
				exit;
			}
		}
		
		// Redirect wp-register.php.
		if ( 'wp-register.php' === $pagenow ) {
			wp_safe_redirect( $this->get_panel_url() );
			exit;
		}
	}

	/**
	 * Filter login URL to point to custom panel.
	 *
	 * @param string $login_url    The login URL.
	 * @param string $redirect     The path to redirect to on login.
	 * @param bool   $force_reauth Whether to force reauthorization.
	 * @return string Modified login URL.
	 */
	public function custom_login_url( $login_url, $redirect = '', $force_reauth = false ) {
		if ( ! $this->is_redirect_enabled() ) {
			return $login_url;
		}
		
		// Don't redirect for admin users.
		if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
			return $login_url;
		}
		
		$panel_url = $this->get_panel_url();
		
		if ( ! empty( $redirect ) ) {
			$panel_url = add_query_arg( 'redirect_to', rawurlencode( $redirect ), $panel_url );
		}
		
		return $panel_url;
	}

	/**
	 * Filter registration URL to point to custom panel.
	 *
	 * @param string $register_url The registration URL.
	 * @return string Modified registration URL.
	 */
	public function custom_register_url( $register_url ) {
		if ( ! $this->is_redirect_enabled() ) {
			return $register_url;
		}
		
		return $this->get_panel_url();
	}

	/**
	 * Filter logout redirect URL.
	 *
	 * @param string $redirect_to           The redirect destination URL.
	 * @param string $requested_redirect_to The requested redirect destination URL.
	 * @param \WP_User $user                 The user logging out.
	 * @return string Modified redirect URL.
	 */
	public function custom_logout_redirect( $redirect_to, $requested_redirect_to, $user ) {
		if ( ! $this->is_redirect_enabled() ) {
			return $redirect_to;
		}
		
		// Redirect non-admin users to panel after logout.
		if ( ! user_can( $user, 'manage_options' ) ) {
			return $this->get_panel_url();
		}
		
		return $redirect_to;
	}

	/**
	 * WooCommerce login redirect.
	 *
	 * @param string   $redirect The redirect URL.
	 * @param \WP_User $user     The user.
	 * @return string Modified redirect URL.
	 */
	public function wc_login_redirect( $redirect, $user ) {
		if ( ! $this->is_redirect_enabled() ) {
			return $redirect;
		}
		
		// Redirect non-admin users to custom panel.
		if ( ! user_can( $user, 'manage_options' ) ) {
			return $this->get_panel_url();
		}
		
		return $redirect;
	}

	/**
	 * WooCommerce registration redirect.
	 *
	 * @param string $redirect The redirect URL.
	 * @return string Modified redirect URL.
	 */
	public function wc_registration_redirect( $redirect ) {
		if ( ! $this->is_redirect_enabled() ) {
			return $redirect;
		}
		
		return $this->get_panel_url();
	}

	/**
	 * Redirect WooCommerce account pages to custom panel.
	 *
	 * @return void
	 */
	public function redirect_wc_account_pages() {
		if ( ! $this->is_redirect_enabled() ) {
			return;
		}
		
		// Check if WooCommerce is active.
		if ( ! function_exists( 'is_account_page' ) ) {
			return;
		}
		
		// Redirect my-account page for non-logged-in users.
		if ( is_account_page() && ! is_user_logged_in() ) {
			wp_safe_redirect( $this->get_panel_url() );
			exit;
		}
		
		// For logged-in non-admin users, redirect main my-account to custom panel.
		if ( is_account_page() && is_user_logged_in() && ! current_user_can( 'manage_options' ) ) {
			// Only redirect main account page, not endpoints like orders, downloads, etc.
			if ( ! is_wc_endpoint_url() ) {
				$settings = get_option( 'tabesh_v2_settings', array() );
				$auth_settings = $settings['auth'] ?? array();
				
				// Only redirect if WooCommerce replacement is enabled.
				if ( ! empty( $auth_settings['replace_woocommerce'] ) ) {
					wp_safe_redirect( $this->get_panel_url() );
					exit;
				}
			}
		}
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
		$current_url = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
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

	/**
	 * Override template for dashboard pages to render blank page.
	 *
	 * @param string $template Path to the template.
	 * @return string Modified template path.
	 */
	public function dashboard_blank_template( $template ) {
		global $tabesh_is_dashboard_page;
		
		// Check if this is a dashboard page.
		if ( ! empty( $tabesh_is_dashboard_page ) ) {
			// Use our blank template.
			$blank_template = TABESH_V2_PLUGIN_DIR . 'templates/dashboard-blank.php';
			
			// If our template exists, use it.
			if ( file_exists( $blank_template ) ) {
				return $blank_template;
			}
		}
		
		return $template;
	}

	/**
	 * Add custom styles to hide header/footer on dashboard pages.
	 *
	 * @return void
	 */
	public function add_dashboard_page_styles() {
		global $tabesh_is_dashboard_page;
		
		// Only add styles on dashboard pages.
		if ( empty( $tabesh_is_dashboard_page ) ) {
			return;
		}
		
		// Add inline styles to an existing WordPress style handle.
		// We use 'wp-block-library' as it's always loaded on the frontend.
		$custom_css = '
			/* Hide all theme headers, footers, and sidebars */
			body.tabesh-dashboard-blank-page {
				margin: 0 !important;
				padding: 0 !important;
				overflow-x: hidden;
			}
			
			/* Hide common theme elements */
			body.tabesh-dashboard-blank-page header,
			body.tabesh-dashboard-blank-page .site-header,
			body.tabesh-dashboard-blank-page .header,
			body.tabesh-dashboard-blank-page #header,
			body.tabesh-dashboard-blank-page .masthead,
			body.tabesh-dashboard-blank-page footer,
			body.tabesh-dashboard-blank-page .site-footer,
			body.tabesh-dashboard-blank-page .footer,
			body.tabesh-dashboard-blank-page #footer,
			body.tabesh-dashboard-blank-page .sidebar,
			body.tabesh-dashboard-blank-page aside,
			body.tabesh-dashboard-blank-page #sidebar,
			body.tabesh-dashboard-blank-page .widget-area,
			body.tabesh-dashboard-blank-page nav.navigation,
			body.tabesh-dashboard-blank-page .breadcrumbs,
			body.tabesh-dashboard-blank-page .site-navigation,
			body.tabesh-dashboard-blank-page #site-navigation {
				display: none !important;
			}
			
			/* Ensure main content takes full width */
			body.tabesh-dashboard-blank-page .site-content,
			body.tabesh-dashboard-blank-page #content,
			body.tabesh-dashboard-blank-page main,
			body.tabesh-dashboard-blank-page .content-area {
				width: 100% !important;
				max-width: 100% !important;
				margin: 0 !important;
				padding: 0 !important;
			}
			
			/* Remove any container padding/margins */
			body.tabesh-dashboard-blank-page .container,
			body.tabesh-dashboard-blank-page .site-main {
				max-width: 100% !important;
				width: 100% !important;
				padding: 0 !important;
				margin: 0 !important;
			}
			
			/* Ensure dashboard wrapper fills screen */
			body.tabesh-dashboard-blank-page .tabesh-customer-dashboard-wrapper,
			body.tabesh-dashboard-blank-page .tabesh-auth-container {
				min-height: 100vh;
				width: 100%;
			}
			
			/* For authentication pages, center the form */
			body.tabesh-dashboard-blank-page .tabesh-auth-container {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #f8fafc;
				padding: 20px;
			}
			
			/* Full screen dashboard */
			body.tabesh-dashboard-blank-page .tabesh-super-panel {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100vw;
				height: 100vh;
				overflow: hidden;
			}
		';
		
		// Check if wp-block-library is enqueued, otherwise use any available handle.
		if ( wp_style_is( 'wp-block-library', 'enqueued' ) ) {
			wp_add_inline_style( 'wp-block-library', $custom_css );
		} else {
			// Fallback: output styles directly in head as last resort.
			add_action(
				'wp_head',
				function () use ( $custom_css ) {
					echo '<style type="text/css">' . $custom_css . '</style>';
				},
				999
			);
		}
	}
}
