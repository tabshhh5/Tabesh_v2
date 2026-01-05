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

			// Note: Sender number is NOT required for pattern-based SMS (SendByBaseNumber2).
			// The pattern already has the sender number configured in Meli Payamak panel.
			// This method uses the official Meli Payamak REST API for pattern-based SMS.

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
			// Using SendByBaseNumber2 method according to Meli Payamak official documentation.
			$url = 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber';
			
			// Parameters according to official Meli Payamak API documentation.
			// The 'text' field contains variables separated by semicolon.
			$params = array(
				'username' => $this->username,
				'password' => $this->password,
				'text'     => $code, // OTP code as the variable value.
				'to'       => $mobile,
				'bodyId'   => intval( $pattern_id ),
			);

			$response = wp_remote_post(
				$url,
				array(
					'body'    => $params,
					'headers' => array(
						'Content-Type' => 'application/x-www-form-urlencoded',
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

			// Check response based on Meli Payamak official documentation.
			// Successful response: recId (a unique number > 15 digits).
			// Error response: negative number or error code.
			if ( isset( $data['Value'] ) ) {
				$result_value = $data['Value'];
				
				// Check if it's a successful recId (positive number, typically > 1000000000000000).
				if ( is_numeric( $result_value ) && $result_value > 1000000000000 ) {
					return array(
						'success' => true,
						'message' => __( 'پیامک با موفقیت ارسال شد.', 'tabesh-v2' ),
						'data'    => $data,
						'recId'   => $result_value,
					);
				}
				
				// It's an error code.
				$error_message = $this->get_error_message( intval( $result_value ) );
				
				return array(
					'success' => false,
					'message' => $error_message,
					'code'    => 'api_error',
					'data'    => $data,
				);
			}

			// If no Value field, it's an error.
			return array(
				'success' => false,
				'message' => __( 'پاسخ نامعتبر از سرویس پیامک دریافت شد.', 'tabesh-v2' ),
				'code'    => 'invalid_response',
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
	 * Based on Meli Payamak official documentation for SendByBaseNumber2.
	 *
	 * @param int $status Status code.
	 * @return string Error message.
	 */
	private function get_error_message( $status ) {
		$errors = array(
			-111 => __( 'IP درخواست کننده نامعتبر است.', 'tabesh-v2' ),
			-110 => __( 'الزام استفاده از ApiKey به جای رمز عبور.', 'tabesh-v2' ),
			-109 => __( 'الزام تنظیم IP مجاز برای استفاده از API.', 'tabesh-v2' ),
			-108 => __( 'مسدود شدن IP به دلیل تلاش ناموفق استفاده از API.', 'tabesh-v2' ),
			-10  => __( 'در متغیر های ارسالی، لینک وجود دارد.', 'tabesh-v2' ),
			-7   => __( 'خطایی در شماره فرستنده رخ داده است.', 'tabesh-v2' ),
			-6   => __( 'خطای داخلی رخ داده است.', 'tabesh-v2' ),
			-5   => __( 'متن ارسالی با توجه به متغیرهای مشخص شده در متن پیشفرض همخوانی ندارد.', 'tabesh-v2' ),
			-4   => __( 'کد متن ارسالی صحیح نیست و یا توسط مدیر سامانه تأیید نشده است.', 'tabesh-v2' ),
			-3   => __( 'خط ارسالی در سیستم تعریف نشده است.', 'tabesh-v2' ),
			-2   => __( 'محدودیت تعداد شماره، محدودیت هر بار ارسال یک شماره موبایل است.', 'tabesh-v2' ),
			-1   => __( 'دسترسی برای استفاده از این وبسرویس غیرفعال است.', 'tabesh-v2' ),
			0    => __( 'نام کاربری یا رمز عبور صحیح نیست.', 'tabesh-v2' ),
			2    => __( 'اعتبار کافی نیست.', 'tabesh-v2' ),
			6    => __( 'سامانه در حال بروزرسانی است.', 'tabesh-v2' ),
			7    => __( 'متن حاوی کلمه فیلتر شده است.', 'tabesh-v2' ),
			10   => __( 'کاربر مورد نظر فعال نیست.', 'tabesh-v2' ),
			11   => __( 'ارسال نشده.', 'tabesh-v2' ),
			12   => __( 'مدارک کاربر کامل نیست.', 'tabesh-v2' ),
			16   => __( 'شماره گیرنده ای یافت نشد.', 'tabesh-v2' ),
			17   => __( 'متن پیامک خالی است.', 'tabesh-v2' ),
			18   => __( 'شماره گیرنده نامعتبر است.', 'tabesh-v2' ),
			19   => __( 'از محدودیت ساعتی فراتر رفته اید.', 'tabesh-v2' ),
			35   => __( 'شماره موبایل گیرنده در لیست سیاه مخابرات است.', 'tabesh-v2' ),
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
					'body'    => $params,
					'headers' => array(
						'Content-Type' => 'application/x-www-form-urlencoded',
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
