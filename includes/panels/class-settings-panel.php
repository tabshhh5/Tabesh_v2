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
	public function get_default_settings() {
		return array(
			'currency'          => 'IRR',
			'date_format'       => 'Y-m-d',
			'time_format'       => 'H:i:s',
			'orders_per_page'   => 20,
			'enable_customers'  => true,
			'enable_managers'   => true,
			'enable_employees'  => true,
		);
	}

	/**
	 * Reset settings to default.
	 *
	 * @return bool
	 */
	public function reset_settings() {
		return $this->update_settings( $this->get_default_settings() );
	}
}
