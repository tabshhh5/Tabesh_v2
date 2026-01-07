<?php
/**
 * OTP Handler Class.
 *
 * @package Tabesh_v2\Auth
 */

namespace Tabesh_v2\Auth;

/**
 * OTP Handler Class.
 *
 * Handles OTP generation, sending via Melipayamak API, and verification.
 */
class OTP_Handler {

	/**
	 * WordPress database object.
	 *
	 * @var \wpdb
	 */
	private $wpdb;

	/**
	 * OTP codes table name.
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Melipayamak API username.
	 *
	 * @var string
	 */
	private $api_username;

	/**
	 * Melipayamak API password.
	 *
	 * @var string
	 */
	private $api_password;

	/**
	 * Melipayamak sender number.
	 *
	 * @var string
	 */
	private $sender_number;

	/**
	 * Melipayamak body ID for SendByBaseNumber2.
	 *
	 * @var string
	 */
	private $body_id;

	/**
	 * OTP code length.
	 *
	 * @var int
	 */
	private $otp_length = 6;

	/**
	 * OTP validity duration in minutes.
	 *
	 * @var int
	 */
	private $otp_validity = 5;

	/**
	 * Maximum verification attempts.
	 *
	 * @var int
	 */
	private $max_attempts = 5;

	/**
	 * Constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
		$database = new \Tabesh_v2\Core\Database();
		$this->table_name = $database->get_otp_codes_table();

		// Load settings from WordPress options.
		$settings = get_option( 'tabesh_v2_settings', array() );
		$this->api_username = $settings['melipayamak_username'] ?? '';
		$this->api_password = $settings['melipayamak_password'] ?? '';
		$this->sender_number = $settings['melipayamak_sender'] ?? '';
		$this->body_id = $settings['melipayamak_body_id'] ?? '';
		$this->otp_length = $settings['otp_length'] ?? 6;
		$this->otp_validity = $settings['otp_validity'] ?? 5;
		$this->max_attempts = $settings['otp_max_attempts'] ?? 5;
	}

	/**
	 * Generate a cryptographically secure OTP code.
	 *
	 * @return string OTP code.
	 */
	private function generate_otp() {
		try {
			// Use random_bytes for cryptographic security.
			$bytes = random_bytes( ceil( $this->otp_length / 2 ) );
			$otp = substr( bin2hex( $bytes ), 0, $this->otp_length );
			
			// Ensure all numeric.
			$otp = preg_replace( '/[^0-9]/', '', $otp );
			
			// If not enough digits, pad with random numbers.
			while ( strlen( $otp ) < $this->otp_length ) {
				$otp .= wp_rand( 0, 9 );
			}
			
			return substr( $otp, 0, $this->otp_length );
		} catch ( \Exception $e ) {
			// Fallback to openssl_random_pseudo_bytes.
			$bytes = openssl_random_pseudo_bytes( ceil( $this->otp_length / 2 ), $strong );
			if ( $strong ) {
				$otp = substr( bin2hex( $bytes ), 0, $this->otp_length );
				return preg_replace( '/[^0-9]/', wp_rand( 0, 9 ), $otp );
			}
			
			// Last resort fallback.
			return str_pad( (string) wp_rand( 0, pow( 10, $this->otp_length ) - 1 ), $this->otp_length, '0', STR_PAD_LEFT );
		}
	}

	/**
	 * Send OTP via Melipayamak API.
	 *
	 * @param string $phone_number Phone number to send OTP to.
	 * @return array Result array with 'success' and 'message' keys.
	 */
	public function send_otp( $phone_number ) {
		// Validate phone number format (Iranian mobile numbers).
		$phone_number = $this->normalize_phone_number( $phone_number );
		if ( ! $this->is_valid_phone_number( $phone_number ) ) {
			return array(
				'success' => false,
				'message' => __( 'Invalid phone number format.', 'tabesh-v2' ),
			);
		}

		// Generate OTP code.
		$otp_code = $this->generate_otp();

		// Calculate expiration time.
		$expires_at = gmdate( 'Y-m-d H:i:s', time() + ( $this->otp_validity * 60 ) );

		// Invalidate any existing OTP codes for this number.
		$this->invalidate_existing_otps( $phone_number );

		// Store OTP in database.
		$inserted = $this->wpdb->insert(
			$this->table_name,
			array(
				'phone_number' => $phone_number,
				'otp_code'     => $otp_code,
				'created_at'   => current_time( 'mysql' ),
				'expires_at'   => $expires_at,
				'verified'     => 0,
				'attempts'     => 0,
			),
			array( '%s', '%s', '%s', '%s', '%d', '%d' )
		);

		if ( ! $inserted ) {
			return array(
				'success' => false,
				'message' => __( 'Failed to generate OTP. Please try again.', 'tabesh-v2' ),
			);
		}

		// Send OTP via Melipayamak API.
		$send_result = $this->send_via_melipayamak( $phone_number, $otp_code );

		if ( ! $send_result['success'] ) {
			// Delete the OTP if sending failed.
			$this->wpdb->delete(
				$this->table_name,
				array( 'phone_number' => $phone_number ),
				array( '%s' )
			);
		}

		return $send_result;
	}

	/**
	 * Send OTP via Melipayamak SendByBaseNumber2 method.
	 *
	 * @param string $phone_number Phone number.
	 * @param string $otp_code OTP code.
	 * @return array Result array.
	 */
	private function send_via_melipayamak( $phone_number, $otp_code ) {
		if ( empty( $this->api_username ) || empty( $this->api_password ) || empty( $this->sender_number ) || empty( $this->body_id ) ) {
			return array(
				'success' => false,
				'message' => __( 'SMS service is not configured. Please contact administrator.', 'tabesh-v2' ),
			);
		}

		try {
			// Melipayamak API endpoint for SendByBaseNumber2.
			$api_url = 'https://rest.payamak-panel.com/api/SendSMS/SendByBaseNumber2';

			// Prepare request body.
			$body = array(
				'username' => $this->api_username,
				'password' => $this->api_password,
				'text'     => $otp_code,
				'to'       => $phone_number,
				'bodyId'   => $this->body_id,
			);

			// Send request.
			$response = wp_remote_post(
				$api_url,
				array(
					'body'    => wp_json_encode( $body ),
					'headers' => array(
						'Content-Type' => 'application/json',
					),
					'timeout' => 15,
				)
			);

			// Check for errors.
			if ( is_wp_error( $response ) ) {
				return array(
					'success' => false,
					'message' => __( 'Failed to connect to SMS service.', 'tabesh-v2' ),
					'error'   => $response->get_error_message(),
				);
			}

			$response_code = wp_remote_retrieve_response_code( $response );
			$response_body = wp_remote_retrieve_body( $response );
			$result = json_decode( $response_body, true );

			// Check response.
			if ( $response_code === 200 && isset( $result['Value'] ) ) {
				return array(
					'success' => true,
					'message' => __( 'OTP sent successfully.', 'tabesh-v2' ),
				);
			} else {
				return array(
					'success' => false,
					'message' => __( 'Failed to send OTP. Please try again.', 'tabesh-v2' ),
					'error'   => $result['RetStatus'] ?? 'Unknown error',
				);
			}
		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => __( 'An error occurred while sending OTP.', 'tabesh-v2' ),
				'error'   => $e->getMessage(),
			);
		}
	}

	/**
	 * Verify OTP code.
	 *
	 * @param string $phone_number Phone number.
	 * @param string $otp_code OTP code to verify.
	 * @return array Result array.
	 */
	public function verify_otp( $phone_number, $otp_code ) {
		$phone_number = $this->normalize_phone_number( $phone_number );

		// Get the latest unverified OTP for this phone number.
		$otp_record = $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} WHERE phone_number = %s AND verified = 0 ORDER BY created_at DESC LIMIT 1", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$phone_number
			)
		);

		if ( ! $otp_record ) {
			return array(
				'success' => false,
				'message' => __( 'No OTP found for this phone number.', 'tabesh-v2' ),
			);
		}

		// Check if OTP has expired.
		if ( strtotime( $otp_record->expires_at ) < time() ) {
			return array(
				'success' => false,
				'message' => __( 'OTP has expired. Please request a new one.', 'tabesh-v2' ),
			);
		}

		// Check if maximum attempts exceeded.
		if ( $otp_record->attempts >= $this->max_attempts ) {
			return array(
				'success' => false,
				'message' => __( 'Maximum verification attempts exceeded. Please request a new OTP.', 'tabesh-v2' ),
			);
		}

		// Increment attempts.
		$this->wpdb->update(
			$this->table_name,
			array( 'attempts' => $otp_record->attempts + 1 ),
			array( 'id' => $otp_record->id ),
			array( '%d' ),
			array( '%d' )
		);

		// Verify OTP code.
		if ( $otp_record->otp_code !== $otp_code ) {
			return array(
				'success' => false,
				'message' => __( 'Invalid OTP code.', 'tabesh-v2' ),
			);
		}

		// Mark OTP as verified.
		$this->wpdb->update(
			$this->table_name,
			array( 'verified' => 1 ),
			array( 'id' => $otp_record->id ),
			array( '%d' ),
			array( '%d' )
		);

		return array(
			'success' => true,
			'message' => __( 'OTP verified successfully.', 'tabesh-v2' ),
		);
	}

	/**
	 * Normalize phone number to Iranian format.
	 *
	 * @param string $phone_number Phone number.
	 * @return string Normalized phone number.
	 */
	private function normalize_phone_number( $phone_number ) {
		// Remove all non-numeric characters.
		$phone_number = preg_replace( '/[^0-9]/', '', $phone_number );

		// Convert +98 to 0.
		if ( substr( $phone_number, 0, 2 ) === '98' ) {
			$phone_number = '0' . substr( $phone_number, 2 );
		}

		return $phone_number;
	}

	/**
	 * Validate Iranian mobile phone number.
	 *
	 * @param string $phone_number Phone number.
	 * @return bool True if valid, false otherwise.
	 */
	private function is_valid_phone_number( $phone_number ) {
		// Iranian mobile numbers: 09XXXXXXXXX (11 digits starting with 09).
		return preg_match( '/^09\d{9}$/', $phone_number ) === 1;
	}

	/**
	 * Invalidate existing OTP codes for a phone number.
	 *
	 * @param string $phone_number Phone number.
	 * @return void
	 */
	private function invalidate_existing_otps( $phone_number ) {
		$this->wpdb->delete(
			$this->table_name,
			array(
				'phone_number' => $phone_number,
				'verified'     => 0,
			),
			array( '%s', '%d' )
		);
	}

	/**
	 * Clean up expired OTP codes.
	 *
	 * @return void
	 */
	public function cleanup_expired_otps() {
		$this->wpdb->query(
			$this->wpdb->prepare(
				"DELETE FROM {$this->table_name} WHERE expires_at < %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				current_time( 'mysql' )
			)
		);
	}
}
