<?php
/**
 * Authentication Controller Class.
 *
 * @package Tabesh_v2\Auth
 */

namespace Tabesh_v2\Auth;

/**
 * Authentication Controller Class.
 *
 * Main controller for authentication flow.
 */
class Auth_Controller {

	/**
	 * OTP Handler instance.
	 *
	 * @var OTP_Handler
	 */
	private $otp_handler;

	/**
	 * User Registration instance.
	 *
	 * @var User_Registration
	 */
	private $user_registration;

	/**
	 * Rate Limiter instance.
	 *
	 * @var Rate_Limiter
	 */
	private $rate_limiter;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->otp_handler = new OTP_Handler();
		$this->user_registration = new User_Registration();
		$this->rate_limiter = new Rate_Limiter();

		// Add hooks.
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Initialize authentication controller.
	 *
	 * @return void
	 */
	public function init() {
		// Register query vars.
		add_filter( 'query_vars', array( $this, 'add_query_vars' ) );

		// Add rewrite rules.
		add_action( 'init', array( $this, 'add_rewrite_rules' ) );

		// Handle template redirect.
		add_action( 'template_redirect', array( $this, 'handle_template_redirect' ) );

		// WooCommerce redirects.
		$this->setup_woocommerce_redirects();

		// Schedule cleanup cron job.
		if ( ! wp_next_scheduled( 'tabesh_v2_cleanup_expired_otps' ) ) {
			wp_schedule_event( time(), 'hourly', 'tabesh_v2_cleanup_expired_otps' );
		}

		add_action( 'tabesh_v2_cleanup_expired_otps', array( $this->otp_handler, 'cleanup_expired_otps' ) );
	}

	/**
	 * Add query vars.
	 *
	 * @param array $vars Query vars.
	 * @return array Modified query vars.
	 */
	public function add_query_vars( $vars ) {
		$vars[] = 'tabesh_panel';
		return $vars;
	}

	/**
	 * Add rewrite rules.
	 *
	 * @return void
	 */
	public function add_rewrite_rules() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$panel_url = $settings['panel']['url'] ?? 'panel';

		// Remove leading/trailing slashes.
		$panel_url = trim( $panel_url, '/' );

		add_rewrite_rule(
			'^' . $panel_url . '/?$',
			'index.php?tabesh_panel=main',
			'top'
		);

		add_rewrite_rule(
			'^' . $panel_url . '/(.+)/?$',
			'index.php?tabesh_panel=$matches[1]',
			'top'
		);
	}

	/**
	 * Handle template redirect for panel pages.
	 *
	 * @return void
	 */
	public function handle_template_redirect() {
		$panel = get_query_var( 'tabesh_panel' );

		if ( ! $panel ) {
			return;
		}

		// Check if user is logged in.
		if ( ! is_user_logged_in() || $panel === 'login' ) {
			// Show login page.
			$this->render_login_page();
			exit;
		}

		// Show dashboard.
		$this->render_dashboard_page();
		exit;
	}

	/**
	 * Render login page.
	 *
	 * @return void
	 */
	private function render_login_page() {
		// Remove all WordPress theme hooks.
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_footer' );

		// Add essential WordPress scripts and styles.
		add_action( 'wp_head', 'wp_enqueue_scripts' );
		add_action( 'wp_head', 'wp_print_styles' );
		add_action( 'wp_head', 'wp_print_head_scripts' );
		add_action( 'wp_footer', 'wp_print_footer_scripts' );

		// Enqueue auth assets.
		wp_enqueue_style( 'tabesh-auth', TABESH_V2_PLUGIN_URL . 'assets/css/auth.css', array(), TABESH_V2_VERSION );
		wp_enqueue_script( 'tabesh-auth', TABESH_V2_PLUGIN_URL . 'assets/js/build/auth.js', array( 'wp-element', 'wp-i18n' ), TABESH_V2_VERSION, true );

		// Localize script with settings.
		wp_localize_script(
			'tabesh-auth',
			'tabeshAuthData',
			array(
				'apiUrl'      => rest_url( 'tabesh/v2/auth' ),
				'nonce'       => wp_create_nonce( 'wp_rest' ),
				'redirectUrl' => $this->get_panel_url(),
			)
		);

		// Render blank HTML page.
		?>
		<!DOCTYPE html>
		<html <?php language_attributes(); ?>>
		<head>
			<meta charset="<?php bloginfo( 'charset' ); ?>">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<?php wp_head(); ?>
		</head>
		<body class="tabesh-auth-page">
			<div id="tabesh-auth-root"></div>
			<?php wp_footer(); ?>
		</body>
		</html>
		<?php
	}

	/**
	 * Render dashboard page.
	 *
	 * @return void
	 */
	private function render_dashboard_page() {
		// Remove all WordPress theme hooks.
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_footer' );

		// Add essential WordPress scripts and styles.
		add_action( 'wp_head', 'wp_enqueue_scripts' );
		add_action( 'wp_head', 'wp_print_styles' );
		add_action( 'wp_head', 'wp_print_head_scripts' );
		add_action( 'wp_footer', 'wp_print_footer_scripts' );

		// Enqueue dashboard assets.
		wp_enqueue_style( 'tabesh-dashboard', TABESH_V2_PLUGIN_URL . 'assets/css/dashboard.css', array(), TABESH_V2_VERSION );
		wp_enqueue_script( 'tabesh-dashboard', TABESH_V2_PLUGIN_URL . 'assets/js/build/dashboard.js', array( 'wp-element', 'wp-i18n' ), TABESH_V2_VERSION, true );

		// Get current user.
		$current_user = wp_get_current_user();

		// Localize script with user data and settings.
		wp_localize_script(
			'tabesh-dashboard',
			'tabeshDashboardData',
			array(
				'apiUrl'    => rest_url( 'tabesh/v2' ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'user'      => array(
					'id'          => $current_user->ID,
					'username'    => $current_user->user_login,
					'displayName' => $current_user->display_name,
					'firstName'   => $current_user->first_name,
					'lastName'    => $current_user->last_name,
					'email'       => $current_user->user_email,
					'roles'       => $current_user->roles,
				),
				'siteUrl'   => home_url(),
				'logoutUrl' => wp_logout_url( $this->get_panel_url( 'login' ) ),
			)
		);

		// Render blank HTML page.
		?>
		<!DOCTYPE html>
		<html <?php language_attributes(); ?>>
		<head>
			<meta charset="<?php bloginfo( 'charset' ); ?>">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<?php wp_head(); ?>
		</head>
		<body class="tabesh-dashboard-page">
			<div id="tabesh-dashboard-root"></div>
			<?php wp_footer(); ?>
		</body>
		</html>
		<?php
	}

	/**
	 * Get panel URL.
	 *
	 * @param string $path Optional path to append.
	 * @return string Panel URL.
	 */
	private function get_panel_url( $path = '' ) {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$panel_url = $settings['panel']['url'] ?? 'panel';

		$url = home_url( '/' . trim( $panel_url, '/' ) );

		if ( ! empty( $path ) ) {
			$url .= '/' . trim( $path, '/' );
		}

		return $url;
	}

	/**
	 * Request OTP for phone number.
	 *
	 * @param string $phone_number Phone number.
	 * @return array Result array.
	 */
	public function request_otp( $phone_number ) {
		// Get settings.
		$settings = get_option( 'tabesh_v2_settings', array() );
		$max_requests = $settings['otp']['rate_limit_max'] ?? 3;
		$time_window = $settings['otp']['rate_limit_window'] ?? 60;
		$min_interval = $settings['otp']['min_interval'] ?? 120;

		// Check rate limit by IP.
		$ip = $_SERVER['REMOTE_ADDR'] ?? '';
		if ( $this->rate_limiter->is_rate_limited( $ip, 'otp_request', $max_requests, $time_window ) ) {
			$time_until_reset = $this->rate_limiter->get_time_until_reset( $ip, 'otp_request', $time_window );
			return array(
				'success' => false,
				'message' => sprintf(
					/* translators: %d: seconds until rate limit resets */
					__( 'Too many requests. Please try again in %d seconds.', 'tabesh-v2' ),
					$time_until_reset
				),
			);
		}

		// Check rate limit by phone number (minimum interval between requests).
		if ( $this->rate_limiter->is_rate_limited( $phone_number, 'otp_request', 1, $min_interval ) ) {
			$time_until_reset = $this->rate_limiter->get_time_until_reset( $phone_number, 'otp_request', $min_interval );
			return array(
				'success' => false,
				'message' => sprintf(
					/* translators: %d: seconds until can request again */
					__( 'Please wait %d seconds before requesting a new OTP.', 'tabesh-v2' ),
					$time_until_reset
				),
			);
		}

		// Record request.
		$this->rate_limiter->record_request( $ip, 'otp_request' );
		$this->rate_limiter->record_request( $phone_number, 'otp_request' );

		// Send OTP.
		return $this->otp_handler->send_otp( $phone_number );
	}

	/**
	 * Verify OTP and login/register user.
	 *
	 * @param string $phone_number Phone number.
	 * @param string $otp_code OTP code.
	 * @param array  $user_data Additional user data (for registration).
	 * @return array Result array.
	 */
	public function verify_and_login( $phone_number, $otp_code, $user_data = array() ) {
		// Verify OTP.
		$verify_result = $this->otp_handler->verify_otp( $phone_number, $otp_code );

		if ( ! $verify_result['success'] ) {
			return $verify_result;
		}

		// Check if user needs registration.
		if ( $this->user_registration->needs_registration( $phone_number ) ) {
			if ( empty( $user_data['first_name'] ) && empty( $user_data['last_name'] ) ) {
				return array(
					'success'            => true,
					'needs_registration' => true,
					'message'            => __( 'Please complete your registration.', 'tabesh-v2' ),
				);
			}

			// Create user.
			$user_id = $this->user_registration->create_or_get_user( $phone_number, $user_data );

			if ( is_wp_error( $user_id ) ) {
				return array(
					'success' => false,
					'message' => $user_id->get_error_message(),
				);
			}
		}

		// Login user.
		$login_result = $this->user_registration->login_user( $phone_number );

		if ( is_wp_error( $login_result ) ) {
			return array(
				'success' => false,
				'message' => $login_result->get_error_message(),
			);
		}

		return array(
			'success' => true,
			'message' => __( 'Login successful.', 'tabesh-v2' ),
		);
	}

	/**
	 * Setup WooCommerce redirects to custom panel.
	 *
	 * @return void
	 */
	private function setup_woocommerce_redirects() {
		$settings = get_option( 'tabesh_v2_settings', array() );
		
		// Check if WooCommerce redirects are enabled.
		if ( ! isset( $settings['panel']['redirect_woocommerce'] ) || ! $settings['panel']['redirect_woocommerce'] ) {
			return;
		}

		// Redirect WooCommerce login to our panel.
		add_filter( 'woocommerce_login_redirect', array( $this, 'redirect_after_login' ), 10, 2 );
		
		// Redirect WooCommerce registration to our panel.
		add_filter( 'woocommerce_registration_redirect', array( $this, 'redirect_after_login' ), 10, 2 );
		
		// Redirect WordPress login to our panel.
		add_filter( 'login_redirect', array( $this, 'redirect_after_login' ), 10, 3 );
		
		// Redirect WooCommerce my-account pages to our panel.
		add_action( 'template_redirect', array( $this, 'redirect_my_account_to_panel' ), 5 );
	}

	/**
	 * Redirect after login to custom panel.
	 *
	 * @param string $redirect_to Redirect URL.
	 * @param mixed  $user User object or requested redirect.
	 * @param mixed  $user_obj User object (for login_redirect hook).
	 * @return string Modified redirect URL.
	 */
	public function redirect_after_login( $redirect_to, $user = null, $user_obj = null ) {
		// Use $user_obj if available (from login_redirect hook), otherwise use $user.
		$current_user = $user_obj instanceof \WP_User ? $user_obj : $user;
		
		// If not a valid user object, return original redirect.
		if ( ! $current_user instanceof \WP_User ) {
			return $redirect_to;
		}

		// Don't redirect admins accessing admin area.
		if ( user_can( $current_user, 'manage_options' ) && is_admin() ) {
			return $redirect_to;
		}

		// Redirect to custom panel.
		return $this->get_panel_url();
	}

	/**
	 * Redirect WooCommerce my-account pages to custom panel.
	 *
	 * @return void
	 */
	public function redirect_my_account_to_panel() {
		// Check if WooCommerce is active.
		if ( ! function_exists( 'is_account_page' ) ) {
			return;
		}

		// Check if we're on a WooCommerce my-account page.
		if ( ! is_account_page() || is_user_logged_in() === false ) {
			return;
		}

		// Redirect to custom panel.
		wp_safe_redirect( $this->get_panel_url() );
		exit;
	}
}
