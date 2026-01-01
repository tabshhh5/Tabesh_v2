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
	 * Enqueue dashboard assets.
	 *
	 * @return void
	 */
	public function enqueue_dashboard_assets() {
		// Check if we're in the right context.
		if ( ! is_singular() && ! is_page() ) {
			return;
		}

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
					'apiUrl'    => rest_url( 'tabesh/v2/' ),
					'nonce'     => wp_create_nonce( 'wp_rest' ),
					'pluginUrl' => TABESH_V2_PLUGIN_URL,
					'isRTL'     => is_rtl(),
					'lang'      => is_rtl() ? 'fa' : 'en',
					'user'      => $this->get_current_user_data(),
				)
			);

			// Set script translations.
			wp_set_script_translations( 'tabesh-customer-dashboard', 'tabesh-v2' );
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
			'role'        => $current_user->roles[0] ?? 'subscriber',
			'avatarUrl'   => get_avatar_url( $current_user->ID ),
		);
	}
}
