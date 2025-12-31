<?php
/**
 * Super Dashboard Shortcode Class.
 *
 * @package Tabesh_v2\Shortcodes
 */

namespace Tabesh_v2\Shortcodes;

/**
 * Super Dashboard Shortcode Class.
 *
 * Handles the customer super dashboard shortcode and rendering.
 */
class Super_Dashboard_Shortcode {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		add_shortcode( 'tabesh_super_dashboard', array( $this, 'render_super_dashboard' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Render super dashboard shortcode.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public function render_super_dashboard( $atts = array() ) {
		// Parse shortcode attributes.
		$atts = shortcode_atts(
			array(
				'user_id' => get_current_user_id(),
			),
			$atts,
			'tabesh_super_dashboard'
		);

		// Check if user is logged in and has appropriate permissions.
		if ( ! is_user_logged_in() ) {
			return '<div class="tabesh-super-dashboard-notice">' . __( 'شما باید وارد حساب کاربری خود شوید تا به پنل دسترسی داشته باشید.', 'tabesh-v2' ) . '</div>';
		}

		// Check if user has customer role or admin capabilities.
		$current_user = wp_get_current_user();
		if ( ! in_array( 'tabesh_customer', $current_user->roles, true ) && ! current_user_can( 'manage_options' ) ) {
			return '<div class="tabesh-super-dashboard-notice">' . __( 'شما دسترسی لازم برای مشاهده این پنل را ندارید.', 'tabesh-v2' ) . '</div>';
		}

		// Enqueue assets for this specific instance.
		$this->enqueue_assets();

		// Return the container div where React will mount.
		ob_start();
		?>
		<div id="tabesh-super-dashboard" class="tabesh-super-dashboard-wrapper" data-user-id="<?php echo esc_attr( $atts['user_id'] ); ?>"></div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Enqueue dashboard assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Check if we're rendering the shortcode.
		// This handles post content, widgets, and template usage.
		global $post;
		
		// Check in post content.
		$has_shortcode = false;
		if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'tabesh_super_dashboard' ) ) {
			$has_shortcode = true;
		}
		
		// Check if we're in a shortcode execution context.
		if ( ! $has_shortcode && ! did_action( 'wp_footer' ) && doing_action( 'the_content' ) ) {
			// We might be in a widget or other dynamic content area.
			$has_shortcode = true;
		}
		
		if ( ! $has_shortcode ) {
			return;
		}

		$asset_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/index.asset.php';

		// Check if build file exists.
		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;
		} else {
			$asset = array(
				'dependencies' => array( 'wp-element', 'wp-api-fetch', 'wp-i18n' ),
				'version'      => TABESH_V2_VERSION,
			);
		}

		// Enqueue React app CSS.
		$css_file = TABESH_V2_PLUGIN_DIR . 'assets/js/build/index.css';
		if ( file_exists( $css_file ) ) {
			wp_enqueue_style(
				'tabesh-v2-super-dashboard',
				TABESH_V2_PLUGIN_URL . 'assets/js/build/index.css',
				array(),
				$asset['version']
			);
		}

		// Enqueue React app JavaScript.
		wp_enqueue_script(
			'tabesh-v2-super-dashboard',
			TABESH_V2_PLUGIN_URL . 'assets/js/build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Localize script with settings and translations.
		wp_localize_script(
			'tabesh-v2-super-dashboard',
			'tabeshV2SuperDashboard',
			array(
				'apiUrl'    => rest_url( 'tabesh/v2/' ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'pluginUrl' => TABESH_V2_PLUGIN_URL,
				'userId'    => get_current_user_id(),
				'userName'  => wp_get_current_user()->display_name,
				'userEmail' => wp_get_current_user()->user_email,
				'settings'  => $this->get_dashboard_settings(),
				'i18n'      => $this->get_translations(),
			)
		);

		// Set script translations.
		wp_set_script_translations( 'tabesh-v2-super-dashboard', 'tabesh-v2' );
	}

	/**
	 * Get dashboard settings.
	 *
	 * @return array
	 */
	private function get_dashboard_settings() {
		$settings = get_option( 'tabesh_v2_settings', array() );

		return array(
			'currency'       => $settings['currency'] ?? 'IRR',
			'dateFormat'     => $settings['date_format'] ?? 'Y-m-d',
			'timeFormat'     => $settings['time_format'] ?? 'H:i:s',
			'ordersPerPage'  => $settings['orders_per_page'] ?? 20,
			'enableCharts'   => true,
			'enableChatbot'  => true,
			'enableTickets'  => true,
			'animationSpeed' => 'normal', // fast, normal, slow
		);
	}

	/**
	 * Get translations for JavaScript.
	 *
	 * @return array
	 */
	private function get_translations() {
		return array(
			'dashboard'         => __( 'داشبورد', 'tabesh-v2' ),
			'priceHistory'      => __( 'تاریخچه قیمت', 'tabesh-v2' ),
			'newArticles'       => __( 'مقالات جدید', 'tabesh-v2' ),
			'newOrder'          => __( 'ثبت سفارش جدید', 'tabesh-v2' ),
			'orderHistory'      => __( 'تاریخچه سفارشات', 'tabesh-v2' ),
			'activeOrders'      => __( 'سفارشات در حال انجام', 'tabesh-v2' ),
			'financialReport'   => __( 'گزارش مالی', 'tabesh-v2' ),
			'fileManagement'    => __( 'مدیریت فایلها', 'tabesh-v2' ),
			'aiChatbot'         => __( 'چتبات هوش مصنوعی', 'tabesh-v2' ),
			'supportTicket'     => __( 'تیکت پشتیبانی', 'tabesh-v2' ),
			'accountManager'    => __( 'پیام به مدیر حساب', 'tabesh-v2' ),
			'guildArea'         => __( 'ناحیه کانون صنفی', 'tabesh-v2' ),
			'publishedProducts' => __( 'محصولات منتشر شده', 'tabesh-v2' ),
			'salesMetrics'      => __( 'میزان فروش', 'tabesh-v2' ),
			'advertising'       => __( 'بخش تبلیغات', 'tabesh-v2' ),
			'paper'             => __( 'کاغذ', 'tabesh-v2' ),
			'gold'              => __( 'طلا', 'tabesh-v2' ),
			'dollar'            => __( 'دلار', 'tabesh-v2' ),
			'euro'              => __( 'یورو', 'tabesh-v2' ),
			'dirham'            => __( 'درهم', 'tabesh-v2' ),
			'loading'           => __( 'در حال بارگذاری...', 'tabesh-v2' ),
			'welcome'           => __( 'خوش آمدید', 'tabesh-v2' ),
			'selectProduct'     => __( 'انتخاب محصول', 'tabesh-v2' ),
			'search'            => __( 'جستجو', 'tabesh-v2' ),
			'filter'            => __( 'فیلتر', 'tabesh-v2' ),
			'close'             => __( 'بستن', 'tabesh-v2' ),
			'minimize'          => __( 'کوچک کردن', 'tabesh-v2' ),
			'maximize'          => __( 'بزرگ کردن', 'tabesh-v2' ),
		);
	}
}
