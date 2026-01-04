<?php
/**
 * Meli Payamak SMS Helper Class.
 *
 * @package Tabesh_v2\Helpers
 */

namespace Tabesh_v2\Helpers;

/**
 * Meli Payamak SMS Class.
 *
 * Handles SMS sending via Meli Payamak SOAP API.
 */
class Melipayamak {

	/**
	 * Username for Meli Payamak panel.
	 *
	 * @var string
	 */
	private $username;

	/**
	 * Password for Meli Payamak panel.
	 *
	 * @var string
	 */
	private $password;

	/**
	 * Sender number (base number).
	 *
	 * @var string
	 */
	private $sender_number;

	/**
	 * WSDL URL for SOAP connection.
	 *
	 * @var string
	 */
	private $wsdl_url;

	/**
	 * Constructor.
	 *
	 * @param array $config Configuration array.
	 */
	public function __construct( $config = array() ) {
		$settings = get_option( 'tabesh_v2_settings', array() );
		$auth_settings = $settings['auth'] ?? array();
		$melipayamak = $auth_settings['melipayamak'] ?? array();

		$this->username = $config['username'] ?? $melipayamak['username'] ?? '';
		$this->password = $config['password'] ?? $melipayamak['password'] ?? '';
		$this->sender_number = $config['sender_number'] ?? $melipayamak['sender_number'] ?? '';
		$this->wsdl_url = $config['wsdl_url'] ?? $melipayamak['wsdl_url'] ?? 'https://rest.payamak-panel.com/api/SendSMS/SendByBaseNumber2';
	}

	/**
	 * Send OTP code via pattern.
	 *
	 * @param string $mobile Mobile number.
	 * @param string $code OTP code.
	 * @param string $pattern_id Pattern ID (BodyId).
	 * @return array Response with success status and message.
	 */
	public function send_otp( $mobile, $code, $pattern_id = '' ) {
		try {
			// Validate inputs.
			if ( empty( $this->username ) || empty( $this->password ) ) {
				return array(
					'success' => false,
					'message' => __( 'نام کاربری یا رمز عبور ملی پیامک تنظیم نشده است.', 'tabesh-v2' ),
					'code'    => 'missing_credentials',
				);
			}

			if ( empty( $this->sender_number ) ) {
				return array(
					'success' => false,
					'message' => __( 'شماره فرستنده تنظیم نشده است.', 'tabesh-v2' ),
					'code'    => 'missing_sender',
				);
			}

			if ( empty( $pattern_id ) ) {
				$settings = get_option( 'tabesh_v2_settings', array() );
				$pattern_id = $settings['auth']['melipayamak']['pattern_id'] ?? '';
				
				if ( empty( $pattern_id ) ) {
					return array(
						'success' => false,
						'message' => __( 'کد پترن (Pattern ID) تنظیم نشده است.', 'tabesh-v2' ),
						'code'    => 'missing_pattern',
					);
				}
			}

			// Clean mobile number.
			$mobile = $this->clean_mobile( $mobile );
			if ( ! $this->validate_mobile( $mobile ) ) {
				return array(
					'success' => false,
					'message' => __( 'شماره موبایل نامعتبر است.', 'tabesh-v2' ),
					'code'    => 'invalid_mobile',
				);
			}

			// Use REST API instead of SOAP for better compatibility.
			$url = 'https://rest.payamak-panel.com/api/SendSMS/SendByBaseNumber2';
			
			$params = array(
				'username' => $this->username,
				'password' => $this->password,
				'text'     => $code,
				'to'       => $mobile,
				'bodyId'   => $pattern_id,
			);

			$response = wp_remote_post(
				$url,
				array(
					'body'    => wp_json_encode( $params ),
					'headers' => array(
						'Content-Type' => 'application/json',
					),
					'timeout' => 15,
				)
			);

			if ( is_wp_error( $response ) ) {
				return array(
					'success' => false,
					'message' => sprintf(
						/* translators: %s: error message */
						__( 'خطا در ارتباط با سرویس پیامک: %s', 'tabesh-v2' ),
						$response->get_error_message()
					),
					'code'    => 'connection_error',
				);
			}

			$body = wp_remote_retrieve_body( $response );
			$data = json_decode( $body, true );

			// Check response status.
			if ( isset( $data['RetStatus'] ) && 1 === $data['RetStatus'] ) {
				return array(
					'success' => true,
					'message' => __( 'پیامک با موفقیت ارسال شد.', 'tabesh-v2' ),
					'data'    => $data,
				);
			}

			// Handle error responses.
			$error_message = $this->get_error_message( $data['RetStatus'] ?? 0 );
			
			return array(
				'success' => false,
				'message' => $error_message,
				'code'    => 'api_error',
				'data'    => $data,
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => sprintf(
					/* translators: %s: exception message */
					__( 'خطای سیستمی: %s', 'tabesh-v2' ),
					$e->getMessage()
				),
				'code'    => 'exception',
			);
		}
	}

	/**
	 * Test SMS connection.
	 *
	 * @param string $test_mobile Mobile number for test.
	 * @return array Response with success status and message.
	 */
	public function test_connection( $test_mobile ) {
		$test_code = rand( 10000, 99999 );
		return $this->send_otp( $test_mobile, (string) $test_code );
	}

	/**
	 * Clean mobile number.
	 *
	 * @param string $mobile Mobile number.
	 * @return string Cleaned mobile number.
	 */
	private function clean_mobile( $mobile ) {
		// Remove all non-digit characters.
		$mobile = preg_replace( '/[^0-9]/', '', $mobile );
		
		// Convert +98 to 0.
		if ( substr( $mobile, 0, 2 ) === '98' && strlen( $mobile ) === 12 ) {
			$mobile = '0' . substr( $mobile, 2 );
		}
		
		return $mobile;
	}

	/**
	 * Validate mobile number.
	 *
	 * @param string $mobile Mobile number.
	 * @return bool True if valid.
	 */
	private function validate_mobile( $mobile ) {
		// Iranian mobile numbers start with 09 and have 11 digits.
		return preg_match( '/^09[0-9]{9}$/', $mobile );
	}

	/**
	 * Get error message from status code.
	 *
	 * @param int $status Status code.
	 * @return string Error message.
	 */
	private function get_error_message( $status ) {
		$errors = array(
			0  => __( 'خطای ناشناخته در ارسال پیامک.', 'tabesh-v2' ),
			1  => __( 'پیامک با موفقیت ارسال شد.', 'tabesh-v2' ),
			2  => __( 'نام کاربری یا رمز عبور اشتباه است.', 'tabesh-v2' ),
			5  => __( 'اعتبار کافی نیست.', 'tabesh-v2' ),
			6  => __( 'شماره فرستنده معتبر نیست.', 'tabesh-v2' ),
			7  => __( 'شماره گیرنده معتبر نیست.', 'tabesh-v2' ),
			10 => __( 'کد پترن یافت نشد.', 'tabesh-v2' ),
			11 => __( 'پارامترهای پترن ناقص است.', 'tabesh-v2' ),
			13 => __( 'آی‌پی شما مسدود شده است.', 'tabesh-v2' ),
			14 => __( 'دسترسی به وب‌سرویس غیرفعال است.', 'tabesh-v2' ),
		);

		return $errors[ $status ] ?? sprintf(
			/* translators: %d: status code */
			__( 'خطای سیستمی با کد %d.', 'tabesh-v2' ),
			$status
		);
	}

	/**
	 * Get account credit.
	 *
	 * @return array Response with credit information.
	 */
	public function get_credit() {
		try {
			$url = 'https://rest.payamak-panel.com/api/SendSMS/GetCredit';
			
			$params = array(
				'username' => $this->username,
				'password' => $this->password,
			);

			$response = wp_remote_post(
				$url,
				array(
					'body'    => wp_json_encode( $params ),
					'headers' => array(
						'Content-Type' => 'application/json',
					),
					'timeout' => 15,
				)
			);

			if ( is_wp_error( $response ) ) {
				return array(
					'success' => false,
					'message' => $response->get_error_message(),
				);
			}

			$body = wp_remote_retrieve_body( $response );
			$data = json_decode( $body, true );

			return array(
				'success' => true,
				'credit'  => $data['Value'] ?? 0,
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => $e->getMessage(),
			);
		}
	}
}
