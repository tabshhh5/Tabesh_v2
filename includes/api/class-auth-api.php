<?php
/**
 * Authentication API Class.
 *
 * @package Tabesh_v2\Api
 */

namespace Tabesh_v2\Api;

/**
 * Authentication API Class.
 *
 * REST API endpoints for authentication.
 */
class Auth_Api {

	/**
	 * API namespace.
	 *
	 * @var string
	 */
	private $namespace = 'tabesh/v2';

	/**
	 * Auth Controller instance.
	 *
	 * @var \Tabesh_v2\Auth\Auth_Controller
	 */
	private $auth_controller;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->auth_controller = new \Tabesh_v2\Auth\Auth_Controller();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		// Request OTP.
		register_rest_route(
			$this->namespace,
			'/auth/request-otp',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'request_otp' ),
				'permission_callback' => '__return_true', // Public endpoint.
				'args'                => array(
					'phone_number' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'validate_callback' => array( $this, 'validate_phone_number' ),
					),
				),
			)
		);

		// Verify OTP.
		register_rest_route(
			$this->namespace,
			'/auth/verify-otp',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'verify_otp' ),
				'permission_callback' => '__return_true', // Public endpoint.
				'args'                => array(
					'phone_number' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'otp_code'     => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Complete registration.
		register_rest_route(
			$this->namespace,
			'/auth/complete-registration',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'complete_registration' ),
				'permission_callback' => '__return_true', // Public endpoint.
				'args'                => array(
					'phone_number' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'otp_code'     => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'first_name'   => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'last_name'    => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'company_name' => array(
						'required'          => false,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Check auth status.
		register_rest_route(
			$this->namespace,
			'/auth/status',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_auth_status' ),
				'permission_callback' => '__return_true',
			)
		);

		// Logout.
		register_rest_route(
			$this->namespace,
			'/auth/logout',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'logout' ),
				'permission_callback' => 'is_user_logged_in',
			)
		);
	}

	/**
	 * Request OTP endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response object.
	 */
	public function request_otp( $request ) {
		$phone_number = $request->get_param( 'phone_number' );

		$result = $this->auth_controller->request_otp( $phone_number );

		return new \WP_REST_Response( $result, $result['success'] ? 200 : 400 );
	}

	/**
	 * Verify OTP endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response object.
	 */
	public function verify_otp( $request ) {
		$phone_number = $request->get_param( 'phone_number' );
		$otp_code = $request->get_param( 'otp_code' );

		$result = $this->auth_controller->verify_and_login( $phone_number, $otp_code );

		return new \WP_REST_Response( $result, $result['success'] ? 200 : 400 );
	}

	/**
	 * Complete registration endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response object.
	 */
	public function complete_registration( $request ) {
		$phone_number = $request->get_param( 'phone_number' );
		$otp_code = $request->get_param( 'otp_code' );
		$first_name = $request->get_param( 'first_name' );
		$last_name = $request->get_param( 'last_name' );
		$company_name = $request->get_param( 'company_name' );

		$user_data = array(
			'first_name'   => $first_name,
			'last_name'    => $last_name,
			'company_name' => $company_name,
		);

		$result = $this->auth_controller->verify_and_login( $phone_number, $otp_code, $user_data );

		return new \WP_REST_Response( $result, $result['success'] ? 200 : 400 );
	}

	/**
	 * Get authentication status.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response object.
	 */
	public function get_auth_status( $request ) {
		$is_logged_in = is_user_logged_in();

		$response = array(
			'isLoggedIn' => $is_logged_in,
		);

		if ( $is_logged_in ) {
			$current_user = wp_get_current_user();
			$response['user'] = array(
				'id'          => $current_user->ID,
				'username'    => $current_user->user_login,
				'displayName' => $current_user->display_name,
				'firstName'   => $current_user->first_name,
				'lastName'    => $current_user->last_name,
				'roles'       => $current_user->roles,
			);
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Logout endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response object.
	 */
	public function logout( $request ) {
		wp_logout();

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Logged out successfully.', 'tabesh-v2' ),
			),
			200
		);
	}

	/**
	 * Validate phone number.
	 *
	 * @param string $value Phone number.
	 * @return bool True if valid, false otherwise.
	 */
	public function validate_phone_number( $value ) {
		// Remove all non-numeric characters.
		$clean_value = preg_replace( '/[^0-9]/', '', $value );

		// Check if it's a valid Iranian mobile number.
		// Should be 11 digits starting with 09.
		return preg_match( '/^09\d{9}$/', $clean_value ) === 1;
	}
}
