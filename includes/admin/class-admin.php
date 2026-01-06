<?php
/**
 * Admin Management Class.
 *
 * @package Tabesh_v2\Admin
 */

namespace Tabesh_v2\Admin;

/**
 * Admin Class.
 *
 * Handles admin area functionality and menu pages.
 */
class Admin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu_pages' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Add admin menu pages.
	 *
	 * @return void
	 */
	public function add_menu_pages() {
		// Main menu page.
		add_menu_page(
			__( 'Tabesh v2', 'tabesh-v2' ),
			__( 'Tabesh v2', 'tabesh-v2' ),
			'manage_options',
			'tabesh-v2',
			array( $this, 'render_main_page' ),
			'dashicons-businessman',
			30
		);

		// Settings panel.
		add_submenu_page(
			'tabesh-v2',
			__( 'Settings', 'tabesh-v2' ),
			__( 'Settings', 'tabesh-v2' ),
			'manage_options',
			'tabesh-settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Render main page.
	 *
	 * @return void
	 */
	public function render_main_page() {
		echo '<div id="tabesh-v2-app" class="wrap"></div>';
	}

	/**
	 * Render settings page.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		echo '<div id="tabesh-v2-settings" class="wrap"></div>';
	}

	/**
	 * Register plugin settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'tabesh_v2_settings',
			'tabesh_v2_settings',
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
				'default'           => array(),
			)
		);
	}

	/**
	 * Sanitize plugin settings.
	 *
	 * @param array $input Settings input.
	 * @return array
	 */
	public function sanitize_settings( $input ) {
		$sanitized = array();

		if ( isset( $input['currency'] ) ) {
			$sanitized['currency'] = sanitize_text_field( $input['currency'] );
		}

		if ( isset( $input['date_format'] ) ) {
			$sanitized['date_format'] = sanitize_text_field( $input['date_format'] );
		}

		if ( isset( $input['time_format'] ) ) {
			$sanitized['time_format'] = sanitize_text_field( $input['time_format'] );
		}

		if ( isset( $input['orders_per_page'] ) ) {
			$sanitized['orders_per_page'] = absint( $input['orders_per_page'] );
		}

		if ( isset( $input['enable_customers'] ) ) {
			$sanitized['enable_customers'] = (bool) $input['enable_customers'];
		}

		if ( isset( $input['enable_managers'] ) ) {
			$sanitized['enable_managers'] = (bool) $input['enable_managers'];
		}

		if ( isset( $input['enable_employees'] ) ) {
			$sanitized['enable_employees'] = (bool) $input['enable_employees'];
		}

		return $sanitized;
	}
}
