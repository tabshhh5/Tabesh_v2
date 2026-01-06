<?php
/**
 * Settings Panel Class.
 *
 * @package Tabesh_v2\Panels
 */

namespace Tabesh_v2\Panels;

/**
 * Settings Panel Class.
 *
 * Handles plugin settings and configuration.
 */
class Settings_Panel {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Initialize settings panel hooks.
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		// Add hooks if needed.
	}

	/**
	 * Get all settings.
	 *
	 * @return array
	 */
	public function get_settings() {
		return get_option( 'tabesh_v2_settings', array() );
	}

	/**
	 * Update settings.
	 *
	 * @param array $settings Settings array.
	 * @return bool
	 */
	public function update_settings( $settings ) {
		return update_option( 'tabesh_v2_settings', $settings );
	}

	/**
	 * Get default settings.
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		return array(
			'currency'          => 'IRR',
			'date_format'       => 'Y-m-d',
			'time_format'       => 'H:i:s',
			'orders_per_page'   => 20,
			'enable_customers'  => true,
			'enable_managers'   => true,
			'enable_employees'  => true,
			'ai'                => array(
				'enabled'         => false,
				'api_key'         => '',
				'model'           => 'gpt-4',
				'organization_id' => '',
				'temperature'     => 0.7,
				'max_tokens'      => 2000,
				'system_prompt'   => '',
				'cache_responses' => true,
				'log_requests'    => false,
			),
			'products'          => array(),
			'pricing'           => array(
				'currency'                => 'تومان',
				'currency_symbol'         => 'تومان',
				'currency_position'       => 'after',
				'decimals'                => 0,
				'tax_enabled'             => false,
				'tax_rate'                => 9,
				'max_discount'            => 30,
				'discount_enabled'        => true,
				'bulk_discount_enabled'   => false,
				'bulk_discount_table'     => '',
				'base_shipping_cost'      => 0,
				'free_shipping_enabled'   => false,
				'free_shipping_threshold' => 1000000,
			),
			'sms'               => array(
				'enabled'                => false,
				'provider'               => 'kavenegar',
				'api_key'                => '',
				'sender_number'          => '',
				'api_url'                => '',
				'send_on_order_create'   => true,
				'order_create_template'  => '',
				'send_on_status_change'  => true,
				'status_change_template' => '',
				'send_on_delivery'       => true,
				'delivery_template'      => '',
				'log_messages'           => true,
				'max_retries'            => 3,
			),
			'firewall'          => array(
				'enabled'                 => true,
				'rate_limiting'           => true,
				'max_requests_per_minute' => 60,
				'ip_blocking'             => false,
				'blocked_ips'             => '',
				'brute_force_protection'  => true,
			),
			'file'              => array(
				'max_file_size'         => 10,
				'allowed_formats'       => 'pdf,jpg,png,doc,docx',
				'scan_uploads'          => true,
				'upload_path'           => 'wp-content/uploads/tabesh',
				'auto_delete_old_files' => false,
				'file_retention_days'   => 90,
			),
			'access_level'      => array(
				'customer_can_view_orders'   => true,
				'customer_can_cancel_orders' => false,
				'manager_can_delete_orders'  => true,
				'employee_can_edit_orders'   => true,
				'require_approval'           => false,
				'approval_roles'             => 'administrator,shop_manager',
			),
			'import_export'     => array(
				'allow_export'         => true,
				'allow_import'         => true,
				'export_format'        => 'csv',
				'include_customer_data' => true,
				'include_order_data'   => true,
				'auto_backup'          => false,
				'backup_interval'      => 7,
				'max_backups'          => 10,
			),
			'user_dashboard'    => array(
				'enabled'             => false,
				'page_slug'           => 'panel',
				'dashboard_page_id'   => 0,
				'menu_items'          => array(
					array( 'id' => 'orders', 'label' => 'سفارشات', 'icon' => 'shopping-cart', 'enabled' => true, 'order' => 1 ),
					array( 'id' => 'profile', 'label' => 'پروفایل', 'icon' => 'user', 'enabled' => true, 'order' => 2 ),
					array( 'id' => 'tickets', 'label' => 'تیکت‌ها', 'icon' => 'support', 'enabled' => true, 'order' => 3 ),
					array( 'id' => 'files', 'label' => 'فایل‌ها', 'icon' => 'file', 'enabled' => true, 'order' => 4 ),
					array( 'id' => 'financial', 'label' => 'مالی', 'icon' => 'money', 'enabled' => true, 'order' => 5 ),
				),
			),
			'auth'              => array(
				'otp_enabled'                 => false,
				'otp_provider'                => 'melipayamak',
				'otp_length'                  => 5,
				'otp_expiry'                  => 120,
				'autoSubmitOtp'               => true,
				'melipayamak'                 => array(
					'username'          => '',
					'password'          => '',
					'sender_number'     => '',
					'pattern_id'        => '',
					'wsdl_url'          => 'https://rest.payamak-panel.com/api/SendSMS/SendByBaseNumber2',
				),
				'require_name'                => true,
				'allow_corporate'             => true,
				'replace_woocommerce'         => false,
				'auto_create_user'            => true,
				'min_mobile_length'           => 11,
				// Appearance settings
				'primaryColor'                => '#4f46e5',
				'backgroundColor'             => '#667eea',
				'secondaryBackgroundColor'    => '#764ba2',
				'logoUrl'                     => '',
				'brandTitle'                  => 'ورود به داشبورد',
				'brandSubtitle'               => 'سیستم مدیریت چاپ تابش',
				// Layout settings
				'cardWidth'                   => 480,
				'cardPadding'                 => 48,
				'borderRadius'                => 16,
			),
		);
	}

	/**
	 * Reset settings to default.
	 *
	 * @return bool
	 */
	public function reset_settings() {
		return $this->update_settings( self::get_default_settings() );
	}
}
