<?php
/**
 * User Registration Class.
 *
 * @package Tabesh_v2\Auth
 */

namespace Tabesh_v2\Auth;

/**
 * User Registration Class.
 *
 * Handles user registration and login via OTP.
 */
class User_Registration {

	/**
	 * Create or get user by phone number.
	 *
	 * @param string $phone_number Phone number (will be used as username).
	 * @param array  $user_data Additional user data (first_name, last_name, company_name).
	 * @return int|\WP_Error User ID on success, WP_Error on failure.
	 */
	public function create_or_get_user( $phone_number, $user_data = array() ) {
		// Check if user already exists.
		$user = $this->get_user_by_phone( $phone_number );

		if ( $user ) {
			return $user->ID;
		}

		// Create new user.
		return $this->create_user( $phone_number, $user_data );
	}

	/**
	 * Get user by phone number.
	 *
	 * @param string $phone_number Phone number.
	 * @return \WP_User|false User object or false if not found.
	 */
	public function get_user_by_phone( $phone_number ) {
		// Phone number is used as username.
		$user = get_user_by( 'login', $phone_number );

		if ( $user ) {
			return $user;
		}

		// Also check by user meta (backup method).
		$users = get_users(
			array(
				'meta_key'   => 'phone_number',
				'meta_value' => $phone_number,
				'number'     => 1,
			)
		);

		return ! empty( $users ) ? $users[0] : false;
	}

	/**
	 * Create new user.
	 *
	 * @param string $phone_number Phone number.
	 * @param array  $user_data Additional user data.
	 * @return int|\WP_Error User ID on success, WP_Error on failure.
	 */
	private function create_user( $phone_number, $user_data = array() ) {
		// Generate a strong random password.
		$password = $this->generate_strong_password();

		// Prepare user data.
		$username = $phone_number;
		$first_name = $user_data['first_name'] ?? '';
		$last_name = $user_data['last_name'] ?? '';
		$company_name = $user_data['company_name'] ?? '';

		// Build display name.
		$display_name = $this->build_display_name( $first_name, $last_name, $company_name );

		// Create user.
		$user_id = wp_create_user( $username, $password );

		if ( is_wp_error( $user_id ) ) {
			return $user_id;
		}

		// Update user data.
		wp_update_user(
			array(
				'ID'           => $user_id,
				'first_name'   => $first_name,
				'last_name'    => $last_name,
				'display_name' => $display_name,
				'role'         => 'customer', // Default role.
			)
		);

		// Store additional meta.
		update_user_meta( $user_id, 'phone_number', $phone_number );
		if ( ! empty( $company_name ) ) {
			update_user_meta( $user_id, 'company_name', $company_name );
		}

		// Create customer record in custom table.
		$this->create_customer_record( $user_id, $phone_number, $first_name, $last_name, $company_name );

		/**
		 * Action hook after user registration.
		 *
		 * @param int   $user_id User ID.
		 * @param string $phone_number Phone number.
		 * @param array $user_data User data.
		 */
		do_action( 'tabesh_v2_user_registered', $user_id, $phone_number, $user_data );

		return $user_id;
	}

	/**
	 * Generate a strong random password.
	 *
	 * @return string Strong password.
	 */
	private function generate_strong_password() {
		// Generate a 32-character strong password using WordPress function.
		return wp_generate_password( 32, true, true );
	}

	/**
	 * Build display name from user data.
	 *
	 * @param string $first_name First name.
	 * @param string $last_name Last name.
	 * @param string $company_name Company name.
	 * @return string Display name.
	 */
	private function build_display_name( $first_name, $last_name, $company_name ) {
		$parts = array_filter( array( $first_name, $last_name, $company_name ) );

		if ( empty( $parts ) ) {
			return __( 'User', 'tabesh-v2' );
		}

		return implode( ' ', $parts );
	}

	/**
	 * Create customer record in custom table.
	 *
	 * @param int    $user_id User ID.
	 * @param string $phone_number Phone number.
	 * @param string $first_name First name.
	 * @param string $last_name Last name.
	 * @param string $company_name Company name.
	 * @return void
	 */
	private function create_customer_record( $user_id, $phone_number, $first_name, $last_name, $company_name ) {
		global $wpdb;

		$database = new \Tabesh_v2\Core\Database();
		$table_name = $database->get_customers_table();

		$contact_name = trim( $first_name . ' ' . $last_name );

		$wpdb->insert(
			$table_name,
			array(
				'user_id'      => $user_id,
				'company_name' => $company_name,
				'contact_name' => ! empty( $contact_name ) ? $contact_name : $phone_number,
				'email'        => '', // Email will be set later if needed.
				'phone'        => $phone_number,
			),
			array( '%d', '%s', '%s', '%s', '%s' )
		);
	}

	/**
	 * Login user by phone number.
	 *
	 * @param string $phone_number Phone number.
	 * @return bool|\WP_Error True on success, WP_Error on failure.
	 */
	public function login_user( $phone_number ) {
		$user = $this->get_user_by_phone( $phone_number );

		if ( ! $user ) {
			return new \WP_Error(
				'user_not_found',
				__( 'User not found.', 'tabesh-v2' )
			);
		}

		// Log the user in.
		wp_clear_auth_cookie();
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true );

		/**
		 * Action hook after user login.
		 *
		 * @param int $user_id User ID.
		 */
		do_action( 'wp_login', $user->user_login, $user );
		do_action( 'tabesh_v2_user_logged_in', $user->ID );

		return true;
	}

	/**
	 * Check if user needs to complete registration.
	 *
	 * @param string $phone_number Phone number.
	 * @return bool True if needs registration, false otherwise.
	 */
	public function needs_registration( $phone_number ) {
		$user = $this->get_user_by_phone( $phone_number );

		if ( ! $user ) {
			return true;
		}

		// Check if user has first name or last name set.
		$first_name = get_user_meta( $user->ID, 'first_name', true );
		$last_name = get_user_meta( $user->ID, 'last_name', true );

		return empty( $first_name ) && empty( $last_name );
	}

	/**
	 * Update user information.
	 *
	 * @param string $phone_number Phone number.
	 * @param array  $user_data User data to update.
	 * @return bool|\WP_Error True on success, WP_Error on failure.
	 */
	public function update_user( $phone_number, $user_data ) {
		$user = $this->get_user_by_phone( $phone_number );

		if ( ! $user ) {
			return new \WP_Error(
				'user_not_found',
				__( 'User not found.', 'tabesh-v2' )
			);
		}

		$first_name = $user_data['first_name'] ?? '';
		$last_name = $user_data['last_name'] ?? '';
		$company_name = $user_data['company_name'] ?? '';

		$display_name = $this->build_display_name( $first_name, $last_name, $company_name );

		// Update user.
		$result = wp_update_user(
			array(
				'ID'           => $user->ID,
				'first_name'   => $first_name,
				'last_name'    => $last_name,
				'display_name' => $display_name,
			)
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		// Update company name if provided.
		if ( ! empty( $company_name ) ) {
			update_user_meta( $user->ID, 'company_name', $company_name );
		}

		/**
		 * Action hook after user update.
		 *
		 * @param int   $user_id User ID.
		 * @param array $user_data Updated user data.
		 */
		do_action( 'tabesh_v2_user_updated', $user->ID, $user_data );

		return true;
	}
}
