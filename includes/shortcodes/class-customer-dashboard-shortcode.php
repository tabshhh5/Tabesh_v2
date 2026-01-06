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
		<div class="tabesh-auth-container" id="tabesh-auth-root">
			<div class="tabesh-auth-form">
				<h2><?php esc_html_e( 'ورود / ثبت‌نام', 'tabesh-v2' ); ?></h2>
				<p class="description"><?php esc_html_e( 'برای دسترسی به داشبورد، لطفاً وارد شوید.', 'tabesh-v2' ); ?></p>
				
				<div id="tabesh-auth-step-1">
					<form id="tabesh-mobile-form">
						<div class="form-group">
							<label for="mobile"><?php esc_html_e( 'شماره موبایل', 'tabesh-v2' ); ?></label>
							<input 
								type="text" 
								id="mobile" 
								name="mobile" 
								placeholder="09xxxxxxxxx" 
								required 
								pattern="09[0-9]{9}"
								maxlength="11"
								inputmode="numeric"
								dir="ltr"
							/>
						</div>
						<button type="submit" class="button button-primary button-large">
							<span class="dashicons dashicons-smartphone"></span>
							<?php esc_html_e( 'دریافت کد تأیید', 'tabesh-v2' ); ?>
						</button>
					</form>
				</div>

				<div id="tabesh-auth-step-2" style="display: none;">
					<form id="tabesh-otp-form">
						<p class="info-message">
							<span class="dashicons dashicons-yes-alt"></span>
							<?php esc_html_e( 'کد تأیید به شماره موبایل شما ارسال شد.', 'tabesh-v2' ); ?>
						</p>
						
						<div class="form-group">
							<label><?php esc_html_e( 'کد تأیید', 'tabesh-v2' ); ?></label>
							<div id="otp-inputs-container" class="otp-inputs">
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" dir="ltr" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" dir="ltr" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" dir="ltr" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" dir="ltr" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off" dir="ltr" />
							</div>
							<p class="otp-hint"><?php esc_html_e( 'کد به صورت خودکار تأیید می‌شود', 'tabesh-v2' ); ?></p>
						</div>

						<div id="tabesh-user-info-fields" style="display: none;">
							<div class="form-group">
								<label for="first-name"><?php esc_html_e( 'نام', 'tabesh-v2' ); ?></label>
								<input 
									type="text" 
									id="first-name" 
									name="first_name" 
									required 
								/>
							</div>

							<div class="form-group">
								<label for="last-name"><?php esc_html_e( 'نام خانوادگی', 'tabesh-v2' ); ?></label>
								<input 
									type="text" 
									id="last-name" 
									name="last_name" 
									required 
								/>
							</div>

							<div class="form-group">
								<label class="checkbox-label">
									<input 
										type="checkbox" 
										id="is-corporate" 
										name="is_corporate" 
									/>
									<span><?php esc_html_e( 'شخص حقوقی', 'tabesh-v2' ); ?></span>
								</label>
							</div>

							<div class="form-group" id="company-name-field" style="display: none;">
								<label for="company-name"><?php esc_html_e( 'نام سازمان', 'tabesh-v2' ); ?></label>
								<input 
									type="text" 
									id="company-name" 
									name="company_name" 
								/>
							</div>
						</div>

						<div class="button-group">
							<button type="submit" id="tabesh-otp-submit-btn" class="button button-primary button-large" style="display: none;">
								<span class="dashicons dashicons-lock"></span>
								<?php esc_html_e( 'تأیید و ورود', 'tabesh-v2' ); ?>
							</button>
							<button type="button" id="tabesh-back-btn" class="button button-secondary">
								<span class="dashicons dashicons-arrow-right-alt"></span>
								<?php esc_html_e( 'بازگشت', 'tabesh-v2' ); ?>
							</button>
						</div>
					</form>
				</div>

				<div id="tabesh-auth-message"></div>
				<div id="tabesh-auth-loading" style="display: none;">
					<div class="tabesh-spinner"></div>
					<p><?php esc_html_e( 'در حال پردازش...', 'tabesh-v2' ); ?></p>
				</div>
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
		// Enqueue dashicons for icons.
		wp_enqueue_style( 'dashicons' );
		
		// Enqueue authentication CSS.
		wp_enqueue_style(
			'tabesh-auth-form',
			TABESH_V2_PLUGIN_URL . 'assets/css/dashboard.css',
			array( 'dashicons' ),
			TABESH_V2_VERSION
		);
		
		// Enqueue authentication JavaScript.
		wp_enqueue_script(
			'tabesh-auth-form',
			TABESH_V2_PLUGIN_URL . 'assets/js/dashboard.js',
			array( 'jquery', 'wp-api-fetch' ),
			TABESH_V2_VERSION,
			true
		);
		
		// Localize script with settings.
		wp_localize_script(
			'tabesh-auth-form',
			'tabeshAuth',
			array(
				'apiUrl'  => rest_url( 'tabesh/v2/' ),
				'nonce'   => wp_create_nonce( 'wp_rest' ),
				'isRTL'   => is_rtl(),
			)
		);
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
