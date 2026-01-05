<?php
/**
 * Customer Dashboard Shortcode Class.
 *
 * @package Tabesh_v2\Shortcodes
 */

namespace Tabesh_v2\Shortcodes;

/**
 * Customer Dashboard Shortcode Class.
 *
 * Handles rendering of the customer super panel dashboard.
 */
class Customer_Dashboard_Shortcode {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_shortcode( 'tabesh_customer_dashboard', array( $this, 'render_dashboard' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_dashboard_assets' ) );
	}

	/**
	 * Render customer dashboard shortcode.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public function render_dashboard( $atts ) {
		// Parse shortcode attributes.
		$atts = shortcode_atts(
			array(
				'theme' => 'light',
				'lang'  => is_rtl() ? 'fa' : 'en',
			),
			$atts,
			'tabesh_customer_dashboard'
		);

		// Check if user is logged in.
		if ( ! is_user_logged_in() ) {
			return $this->render_login_form();
		}

		// Ensure assets are enqueued.
		$this->enqueue_dashboard_assets();

		// Return the dashboard container.
		ob_start();
		?>
		<div 
			id="tabesh-customer-super-panel" 
			class="tabesh-customer-dashboard-wrapper"
			data-theme="<?php echo esc_attr( $atts['theme'] ); ?>"
			data-lang="<?php echo esc_attr( $atts['lang'] ); ?>"
		>
			<div class="tabesh-loading-initial">
				<div class="tabesh-spinner"></div>
				<p><?php esc_html_e( 'در حال بارگذاری پنل...', 'tabesh-v2' ); ?></p>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render login/registration form for non-logged users.
	 *
	 * @return string HTML output.
	 */
	private function render_login_form() {
		// Enqueue auth-specific assets.
		$this->enqueue_auth_assets();
		
		ob_start();
		?>
		<div id="tabesh-auth-root">
			<!-- React Auth Form will be mounted here -->
			<div class="tabesh-loading-auth">
				<div class="tabesh-spinner"></div>
				<p><?php esc_html_e( 'در حال بارگذاری...', 'tabesh-v2' ); ?></p>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Enqueue dashboard assets.
	 *
	 * @return void
	 */
	public function enqueue_dashboard_assets() {
		// Always enqueue when this method is called (shortcode is being used).
		// No need to check context since the shortcode itself controls rendering.

		$asset_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/customer-dashboard.asset.php';

		// Check if build file exists.
		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;
		} else {
			$asset = array(
				'dependencies' => array( 'wp-element', 'wp-api-fetch', 'wp-i18n', 'wp-components' ),
				'version'      => TABESH_V2_VERSION,
			);
		}

		// Enqueue dashboard CSS.
		$css_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/customer-dashboard.css';
		if ( file_exists( $css_file ) ) {
			wp_enqueue_style(
				'tabesh-customer-dashboard',
				TABESH_V2_PLUGIN_URL . 'assets/js/build/customer-dashboard.css',
				array(),
				$asset['version']
			);
		}

		// Enqueue dashboard JavaScript.
		$js_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/customer-dashboard.js';
		if ( file_exists( $js_file ) ) {
			wp_enqueue_script(
				'tabesh-customer-dashboard',
				TABESH_V2_PLUGIN_URL . 'assets/js/build/customer-dashboard.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);

			// Localize script with settings.
			wp_localize_script(
				'tabesh-customer-dashboard',
				'tabeshCustomerDashboard',
				array(
					'apiUrl'         => rest_url( 'tabesh/v2/' ),
					'nonce'          => wp_create_nonce( 'wp_rest' ),
					'pluginUrl'      => TABESH_V2_PLUGIN_URL,
					'isRTL'          => is_rtl(),
					'lang'           => is_rtl() ? 'fa' : 'en',
					'user'           => $this->get_current_user_data(),
					'woocommerce'    => $this->get_woocommerce_data(),
					'dashboardSettings' => $this->get_dashboard_settings(),
				)
			);

			// Set script translations.
			wp_set_script_translations( 'tabesh-customer-dashboard', 'tabesh-v2' );
		}
	}

	/**
	 * Enqueue authentication form assets.
	 *
	 * @return void
	 */
	private function enqueue_auth_assets() {
		$asset_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/auth.asset.php';

		// Check if build file exists.
		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;
		} else {
			$asset = array(
				'dependencies' => array( 'wp-element', 'wp-api-fetch', 'wp-i18n' ),
				'version'      => TABESH_V2_VERSION,
			);
		}

		// Enqueue authentication CSS.
		$css_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/auth.css';
		if ( file_exists( $css_file ) ) {
			wp_enqueue_style(
				'tabesh-auth-form',
				TABESH_V2_PLUGIN_URL . 'assets/js/build/auth.css',
				array(),
				$asset['version']
			);
		}

		// Enqueue authentication JavaScript.
		$js_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/auth.js';
		if ( file_exists( $js_file ) ) {
			wp_enqueue_script(
				'tabesh-auth-form',
				TABESH_V2_PLUGIN_URL . 'assets/js/build/auth.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);

			// Localize script with settings.
			wp_localize_script(
				'tabesh-auth-form',
				'tabeshAuth',
				array(
					'apiUrl' => rest_url( 'tabesh/v2/' ),
					'nonce'  => wp_create_nonce( 'wp_rest' ),
					'isRTL'  => is_rtl(),
				)
			);

			// Set script translations.
			wp_set_script_translations( 'tabesh-auth-form', 'tabesh-v2' );
		}
	}

	/**
	 * Get current user data for dashboard.
	 *
	 * @return array
	 */
	private function get_current_user_data() {
		$current_user = wp_get_current_user();

		if ( ! $current_user->ID ) {
			return array(
				'isLoggedIn' => false,
			);
		}

		return array(
			'isLoggedIn'  => true,
			'id'          => $current_user->ID,
			'name'        => $current_user->display_name,
			'email'       => $current_user->user_email,
			'firstName'   => $current_user->first_name,
			'lastName'    => $current_user->last_name,
			'role'        => $current_user->roles[0] ?? 'subscriber',
			'avatarUrl'   => get_avatar_url( $current_user->ID ),
			'mobile'      => get_user_meta( $current_user->ID, 'tabesh_mobile', true ),
		);
	}

	/**
	 * Get WooCommerce data for dashboard.
	 *
	 * @return array
	 */
	private function get_woocommerce_data() {
		if ( ! class_exists( 'WooCommerce' ) || ! is_user_logged_in() ) {
			return array(
				'enabled' => false,
			);
		}

		$user_id = get_current_user_id();
		
		return array(
			'enabled'       => true,
			'myAccountUrl'  => wc_get_page_permalink( 'myaccount' ),
			'ordersUrl'     => wc_get_account_endpoint_url( 'orders' ),
			'addressesUrl'  => wc_get_account_endpoint_url( 'edit-address' ),
			'downloadsUrl'  => wc_get_account_endpoint_url( 'downloads' ),
			'totalOrders'   => function_exists( 'wc_get_customer_order_count' ) ? wc_get_customer_order_count( $user_id ) : 0,
			'totalSpent'    => function_exists( 'wc_get_customer_total_spent' ) ? wc_get_customer_total_spent( $user_id ) : 0,
		);
	}

	/**
	 * Get dashboard settings for frontend.
	 *
	 * @return array
	 */
	private function get_dashboard_settings() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$dashboard_settings = $settings['user_dashboard'] ?? array();
		$auth_settings = $settings['auth'] ?? array();
		
		return array(
			'enabled'       => ! empty( $dashboard_settings['enabled'] ),
			'pageSlug'      => $dashboard_settings['page_slug'] ?? 'panel',
			'menuItems'     => $dashboard_settings['menu_items'] ?? array(),
			'authEnabled'   => ! empty( $auth_settings['otp_enabled'] ),
			'requireName'   => ! empty( $auth_settings['require_name'] ),
			'allowCorporate' => ! empty( $auth_settings['allow_corporate'] ),
		);
	}
}
