<?php
/**
 * Rate Limiter Class.
 *
 * @package Tabesh_v2\Auth
 */

namespace Tabesh_v2\Auth;

/**
 * Rate Limiter Class.
 *
 * Handles rate limiting for OTP requests and other security-sensitive actions.
 */
class Rate_Limiter {

	/**
	 * WordPress database object.
	 *
	 * @var \wpdb
	 */
	private $wpdb;

	/**
	 * Rate limit table name.
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
		$database = new \Tabesh_v2\Core\Database();
		$this->table_name = $database->get_rate_limit_table();
	}

	/**
	 * Check if action is rate limited.
	 *
	 * @param string $identifier Identifier (IP, phone, user ID, etc.).
	 * @param string $action_type Action type (e.g., 'otp_request', 'login_attempt').
	 * @param int    $max_requests Maximum allowed requests.
	 * @param int    $time_window Time window in seconds.
	 * @return bool True if rate limited, false otherwise.
	 */
	public function is_rate_limited( $identifier, $action_type, $max_requests, $time_window ) {
		// Clean up old entries first.
		$this->cleanup_old_entries( $time_window );

		// Get current rate limit data.
		$rate_data = $this->get_rate_data( $identifier, $action_type );

		if ( ! $rate_data ) {
			return false;
		}

		// Check if within time window.
		$time_elapsed = time() - strtotime( $rate_data->first_request_at );

		if ( $time_elapsed > $time_window ) {
			// Time window expired, reset counter.
			$this->reset_rate_data( $identifier, $action_type );
			return false;
		}

		// Check if exceeded max requests.
		return $rate_data->request_count >= $max_requests;
	}

	/**
	 * Record a request.
	 *
	 * @param string $identifier Identifier (IP, phone, user ID, etc.).
	 * @param string $action_type Action type.
	 * @return bool True on success, false on failure.
	 */
	public function record_request( $identifier, $action_type ) {
		$rate_data = $this->get_rate_data( $identifier, $action_type );

		if ( $rate_data ) {
			// Update existing record.
			return $this->wpdb->update(
				$this->table_name,
				array(
					'request_count'   => $rate_data->request_count + 1,
					'last_request_at' => current_time( 'mysql' ),
				),
				array(
					'identifier'  => $identifier,
					'action_type' => $action_type,
				),
				array( '%d', '%s' ),
				array( '%s', '%s' )
			) !== false;
		} else {
			// Insert new record.
			return $this->wpdb->insert(
				$this->table_name,
				array(
					'identifier'       => $identifier,
					'action_type'      => $action_type,
					'request_count'    => 1,
					'first_request_at' => current_time( 'mysql' ),
					'last_request_at'  => current_time( 'mysql' ),
				),
				array( '%s', '%s', '%d', '%s', '%s' )
			) !== false;
		}
	}

	/**
	 * Get rate data for identifier and action.
	 *
	 * @param string $identifier Identifier.
	 * @param string $action_type Action type.
	 * @return object|null Rate data or null if not found.
	 */
	private function get_rate_data( $identifier, $action_type ) {
		return $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} WHERE identifier = %s AND action_type = %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$identifier,
				$action_type
			)
		);
	}

	/**
	 * Reset rate data for identifier and action.
	 *
	 * @param string $identifier Identifier.
	 * @param string $action_type Action type.
	 * @return bool True on success, false on failure.
	 */
	private function reset_rate_data( $identifier, $action_type ) {
		return $this->wpdb->delete(
			$this->table_name,
			array(
				'identifier'  => $identifier,
				'action_type' => $action_type,
			),
			array( '%s', '%s' )
		) !== false;
	}

	/**
	 * Clean up old entries.
	 *
	 * @param int $time_window Time window in seconds.
	 * @return void
	 */
	private function cleanup_old_entries( $time_window ) {
		$cutoff_time = gmdate( 'Y-m-d H:i:s', time() - $time_window );

		$this->wpdb->query(
			$this->wpdb->prepare(
				"DELETE FROM {$this->table_name} WHERE last_request_at < %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$cutoff_time
			)
		);
	}

	/**
	 * Get time until rate limit resets.
	 *
	 * @param string $identifier Identifier.
	 * @param string $action_type Action type.
	 * @param int    $time_window Time window in seconds.
	 * @return int Seconds until reset, 0 if not rate limited.
	 */
	public function get_time_until_reset( $identifier, $action_type, $time_window ) {
		$rate_data = $this->get_rate_data( $identifier, $action_type );

		if ( ! $rate_data ) {
			return 0;
		}

		$time_elapsed = time() - strtotime( $rate_data->first_request_at );
		$time_remaining = $time_window - $time_elapsed;

		return max( 0, $time_remaining );
	}
}
