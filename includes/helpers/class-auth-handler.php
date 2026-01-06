<?php
/**
 * Authentication Handler Class.
 *
 * @package Tabesh_v2\Helpers
 */

namespace Tabesh_v2\Helpers;

/**
 * Authentication Handler Class.
 *
 * Manages OTP-based authentication for user login and registration.
 */
class Auth_Handler {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Initialize hooks if needed.
		add_action( 'init', array( $this, 'maybe_process_otp_login' ) );
	}

	/**
	 * Generate OTP code.
	 *
	 * @param int $length Code length (default 5).
	 * @return string OTP code.
	 */
	public function generate_otp( $length = 5 ) {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$auth_settings = $settings['auth'] ?? array();
		$length = $auth_settings['otp_length'] ?? 5;

		$min = pow( 10, $length - 1 );
		$max = pow( 10, $length ) - 1;
		
		return (string) wp_rand( $min, $max );
	}

	/**
	 * Store OTP in database.
	 *
	 * @param string $mobile Mobile number.
	 * @param string $code OTP code.
	 * @return bool Success status.
	 */
	public function store_otp( $mobile, $code ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'tabesh_otp_tokens';

		// Clean old expired tokens for this mobile.
		$wpdb->delete(
			$table_name,
			array( 'mobile' => $mobile )
		);

		$settings = get_option( 'tabesh_v2_settings', array() );
		$auth_settings = $settings['auth'] ?? array();
		$expiry = $auth_settings['otp_expiry'] ?? 120; // 2 minutes default.

		$expiry_time = gmdate( 'Y-m-d H:i:s', time() + $expiry );

		// Insert new token.
		$result = $wpdb->insert(
			$table_name,
			array(
				'mobile'     => $mobile,
				'code'       => $code,
				'expires_at' => $expiry_time,
				'created_at' => current_time( 'mysql' ),
			),
			array( '%s', '%s', '%s', '%s' )
		);

		return false !== $result;
	}

	/**
	 * Verify OTP code.
	 *
	 * @param string $mobile Mobile number.
	 * @param string $code OTP code to verify.
	 * @return array Result with success status and message.
	 */
	public function verify_otp( $mobile, $code ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'tabesh_otp_tokens';

		// Get the token.
		$token = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table_name} WHERE mobile = %s AND code = %s ORDER BY id DESC LIMIT 1",
				$mobile,
				$code
			)
		);

		if ( ! $token ) {
			return array(
				'success' => false,
				'message' => __( 'کد وارد شده صحیح نیست.', 'tabesh-v2' ),
			);
		}

		// Check expiry.
		if ( strtotime( $token->expires_at ) < time() ) {
			// Delete expired token.
			$wpdb->delete(
				$table_name,
				array( 'id' => $token->id )
			);

			return array(
				'success' => false,
				'message' => __( 'کد منقضی شده است. لطفاً دوباره درخواست دهید.', 'tabesh-v2' ),
			);
		}

		// Delete used token.
		$wpdb->delete(
			$table_name,
			array( 'id' => $token->id )
		);

		return array(
			'success' => true,
			'message' => __( 'کد با موفقیت تأیید شد.', 'tabesh-v2' ),
		);
	}

	/**
	 * Send OTP to mobile.
	 *
	 * @param string $mobile Mobile number.
	 * @return array Result with success status and message.
	 */
	public function send_otp( $mobile ) {
		// Generate OTP.
		$code = $this->generate_otp();

		// Store in database.
		$stored = $this->store_otp( $mobile, $code );
		if ( ! $stored ) {
			return array(
				'success' => false,
				'message' => __( 'خطا در ذخیره کد. لطفاً دوباره تلاش کنید.', 'tabesh-v2' ),
			);
		}

		// Send via SMS.
		$sms = new Melipayamak();
		$result = $sms->send_otp( $mobile, $code );

		return $result;
	}

	/**
	 * Login or register user with mobile.
	 *
	 * @param string $mobile Mobile number.
	 * @param array  $user_data Additional user data (name, family_name, is_corporate, company_name).
	 * @return array Result with success status and user data.
	 */
	public function login_or_register( $mobile, $user_data = array() ) {
		// Check if user exists.
		$user = get_user_by( 'login', $mobile );

		if ( $user ) {
			// User exists, log them in.
			wp_clear_auth_cookie();
			wp_set_current_user( $user->ID );
			wp_set_auth_cookie( $user->ID );

			return array(
				'success' => true,
				'message' => __( 'ورود موفقیت‌آمیز.', 'tabesh-v2' ),
				'user_id' => $user->ID,
				'is_new'  => false,
			);
		}

		// User doesn't exist, register new user.
		$settings = get_option( 'tabesh_v2_settings', array() );
		$auth_settings = $settings['auth'] ?? array();

		if ( ! ( $auth_settings['auto_create_user'] ?? true ) ) {
			return array(
				'success' => false,
				'message' => __( 'شماره موبایل شما ثبت نشده است.', 'tabesh-v2' ),
			);
		}

		// Generate secure random password.
		$password = wp_generate_password( 20, true, true );

		// Prepare user data.
		$first_name = $user_data['first_name'] ?? '';
		$last_name = $user_data['last_name'] ?? '';
		$is_corporate = $user_data['is_corporate'] ?? false;
		$company_name = $user_data['company_name'] ?? '';

		// Set display name based on user type.
		if ( $is_corporate && ! empty( $company_name ) ) {
			// For corporate users: Company Name + Last Name.
			$display_name = trim( $company_name . ' ' . $last_name );
		} else {
			// For personal users: First Name + Last Name.
			$display_name = trim( $first_name . ' ' . $last_name );
		}
		
		if ( empty( $display_name ) ) {
			$display_name = $mobile;
		}

		// Create user.
		$user_id = wp_create_user( $mobile, $password, '' ); // No email by default.

		if ( is_wp_error( $user_id ) ) {
			return array(
				'success' => false,
				'message' => sprintf(
					/* translators: %s: error message */
					__( 'خطا در ثبت‌نام: %s', 'tabesh-v2' ),
					$user_id->get_error_message()
				),
			);
		}

		// Update user meta.
		wp_update_user(
			array(
				'ID'           => $user_id,
				'first_name'   => $first_name,
				'last_name'    => $last_name,
				'display_name' => $display_name,
			)
		);

		// Store mobile number in user meta.
		update_user_meta( $user_id, 'billing_phone', $mobile );
		update_user_meta( $user_id, 'tabesh_mobile', $mobile );

		// Store corporate info if applicable.
		if ( $is_corporate ) {
			update_user_meta( $user_id, 'tabesh_is_corporate', true );
			if ( ! empty( $company_name ) ) {
				update_user_meta( $user_id, 'billing_company', $company_name );
				update_user_meta( $user_id, 'tabesh_company_name', $company_name );
			}
		}

		// Set user role.
		$user = new \WP_User( $user_id );
		$user->set_role( 'customer' );

		// Log user in.
		wp_clear_auth_cookie();
		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id );

		return array(
			'success' => true,
			'message' => __( 'ثبت‌نام و ورود موفقیت‌آمیز.', 'tabesh-v2' ),
			'user_id' => $user_id,
			'is_new'  => true,
		);
	}

	/**
	 * Clean expired OTP tokens.
	 *
	 * @return int Number of deleted tokens.
	 */
	public function clean_expired_tokens() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'tabesh_otp_tokens';

		$deleted = $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$table_name} WHERE expires_at < %s",
				current_time( 'mysql' )
			)
		);

		return $deleted;
	}

	/**
	 * Maybe process OTP login from URL parameters.
	 *
	 * @return void
	 */
	public function maybe_process_otp_login() {
		// This is a placeholder for processing login via URL parameters if needed.
		// Can be extended based on specific requirements.
	}
}
