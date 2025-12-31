<?php
/**
 * Security Helper Class.
 *
 * @package Tabesh_v2\Helpers
 */

namespace Tabesh_v2\Helpers;

/**
 * Security Class.
 *
 * Provides security utilities for the plugin.
 */
class Security {

	/**
	 * Verify nonce.
	 *
	 * @param string $nonce Nonce value.
	 * @param string $action Nonce action.
	 * @return bool
	 */
	public static function verify_nonce( $nonce, $action = 'tabesh_v2_action' ) {
		return wp_verify_nonce( $nonce, $action );
	}

	/**
	 * Create nonce.
	 *
	 * @param string $action Nonce action.
	 * @return string
	 */
	public static function create_nonce( $action = 'tabesh_v2_action' ) {
		return wp_create_nonce( $action );
	}

	/**
	 * Check user capability.
	 *
	 * @param string $capability Required capability.
	 * @return bool
	 */
	public static function check_capability( $capability = 'manage_options' ) {
		return current_user_can( $capability );
	}

	/**
	 * Sanitize text input.
	 *
	 * @param string $text Input text.
	 * @return string
	 */
	public static function sanitize_text( $text ) {
		return sanitize_text_field( $text );
	}

	/**
	 * Sanitize textarea input.
	 *
	 * @param string $text Textarea input.
	 * @return string
	 */
	public static function sanitize_textarea( $text ) {
		return sanitize_textarea_field( $text );
	}

	/**
	 * Sanitize email.
	 *
	 * @param string $email Email address.
	 * @return string
	 */
	public static function sanitize_email( $email ) {
		return sanitize_email( $email );
	}

	/**
	 * Escape HTML output.
	 *
	 * @param string $text Text to escape.
	 * @return string
	 */
	public static function esc_html( $text ) {
		return esc_html( $text );
	}

	/**
	 * Escape attribute output.
	 *
	 * @param string $text Text to escape.
	 * @return string
	 */
	public static function esc_attr( $text ) {
		return esc_attr( $text );
	}

	/**
	 * Escape URL output.
	 *
	 * @param string $url URL to escape.
	 * @return string
	 */
	public static function esc_url( $url ) {
		return esc_url( $url );
	}

	/**
	 * Validate email address.
	 *
	 * @param string $email Email address.
	 * @return bool
	 */
	public static function validate_email( $email ) {
		return is_email( $email );
	}

	/**
	 * Validate integer.
	 *
	 * @param mixed $value Value to validate.
	 * @return bool
	 */
	public static function validate_integer( $value ) {
		return is_numeric( $value ) && (int) $value == $value; // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual
	}

	/**
	 * Validate float.
	 *
	 * @param mixed $value Value to validate.
	 * @return bool
	 */
	public static function validate_float( $value ) {
		return is_numeric( $value );
	}
}
