<?php
/**
 * User Dashboard Shortcode Class.
 *
 * @package Tabesh_v2\Shortcodes
 */

namespace Tabesh_v2\Shortcodes;

/**
 * User Dashboard Shortcode Class.
 *
 * Handles the [tabesh_user_dashboard] shortcode for displaying the user dashboard.
 */
class User_Dashboard_Shortcode {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_shortcode( 'tabesh_user_dashboard', array( $this, 'render' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Render the user dashboard.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render( $atts ) {
		// Check if user is logged in.
		if ( ! is_user_logged_in() ) {
			return $this->render_login_form();
		}

		// Render the dashboard for logged-in users.
		return $this->render_dashboard();
	}

	/**
	 * Render login/registration form.
	 *
	 * @return string HTML output.
	 */
	private function render_login_form() {
		ob_start();
		?>
		<div class="tabesh-auth-container" id="tabesh-auth-root">
			<div class="tabesh-auth-form">
				<h2><?php esc_html_e( 'ورود / ثبت‌نام', 'tabesh-v2' ); ?></h2>
				<p class="description"><?php esc_html_e( 'برای دسترسی به داشبورد، لطفاً وارد شوید.', 'tabesh-v2' ); ?></p>
				
				<div id="tabesh-auth-step-1">
					<form id="tabesh-mobile-form">
						<div class="form-group">
							<label for="mobile"><?php esc_html_e( 'شماره موبایل', 'tabesh-v2' ); ?></label>
							<input 
								type="text" 
								id="mobile" 
								name="mobile" 
								placeholder="09xxxxxxxxx" 
								required 
								pattern="09[0-9]{9}"
								maxlength="11"
								inputmode="numeric"
							/>
						</div>
						<button type="submit" class="button button-primary button-large">
							<?php esc_html_e( 'دریافت کد تأیید', 'tabesh-v2' ); ?>
						</button>
					</form>
				</div>

				<div id="tabesh-auth-step-2" style="display: none;">
					<form id="tabesh-otp-form">
						<p class="info-message"><?php esc_html_e( 'کد تأیید به شماره موبایل شما ارسال شد.', 'tabesh-v2' ); ?></p>
						
						<div class="form-group">
							<label><?php esc_html_e( 'کد تأیید', 'tabesh-v2' ); ?></label>
							<div id="otp-inputs-container" class="otp-inputs">
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
								<input type="text" class="otp-input" maxlength="1" pattern="[0-9]" inputmode="numeric" />
							</div>
							<p class="otp-hint"><?php esc_html_e( 'کد به صورت خودکار تأیید می‌شود', 'tabesh-v2' ); ?></p>
						</div>

						<div id="tabesh-user-info-fields" style="display: none;">
							<div class="form-group">
								<label for="first-name"><?php esc_html_e( 'نام', 'tabesh-v2' ); ?></label>
								<input 
									type="text" 
									id="first-name" 
									name="first_name" 
									required 
								/>
							</div>

							<div class="form-group">
								<label for="last-name"><?php esc_html_e( 'نام خانوادگی', 'tabesh-v2' ); ?></label>
								<input 
									type="text" 
									id="last-name" 
									name="last_name" 
									required 
								/>
							</div>

							<div class="form-group">
								<label class="checkbox-label">
									<input 
										type="checkbox" 
										id="is-corporate" 
										name="is_corporate" 
									/>
									<span><?php esc_html_e( 'شخص حقوقی', 'tabesh-v2' ); ?></span>
								</label>
							</div>

							<div class="form-group" id="company-name-field" style="display: none;">
								<label for="company-name"><?php esc_html_e( 'نام سازمان', 'tabesh-v2' ); ?></label>
								<input 
									type="text" 
									id="company-name" 
									name="company_name" 
								/>
							</div>
						</div>

						<button type="submit" id="tabesh-otp-submit-btn" class="button button-primary button-large" style="display: none;">
							<?php esc_html_e( 'تأیید و ورود', 'tabesh-v2' ); ?>
						</button>
						<button type="button" id="tabesh-back-btn" class="button button-secondary">
							<?php esc_html_e( 'بازگشت', 'tabesh-v2' ); ?>
						</button>
					</form>
				</div>

				<div id="tabesh-auth-message"></div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render dashboard for logged-in users.
	 *
	 * @return string HTML output.
	 */
	private function render_dashboard() {
		ob_start();
		?>
		<div class="tabesh-user-dashboard" id="tabesh-dashboard-root">
			<h2><?php esc_html_e( 'داشبورد کاربری', 'tabesh-v2' ); ?></h2>
			<p><?php esc_html_e( 'خوش آمدید!', 'tabesh-v2' ); ?></p>
			
			<!-- Dashboard content will be loaded here via React or simple HTML -->
			<div class="dashboard-menu">
				<?php
				$settings = get_option( 'tabesh_v2_settings', array() );
				$menu_items = $settings['user_dashboard']['menu_items'] ?? array();
				
				if ( ! empty( $menu_items ) ) {
					foreach ( $menu_items as $item ) {
						if ( $item['enabled'] ?? true ) {
							printf(
								'<a href="#%s" class="dashboard-menu-item">
									<span class="icon">%s</span>
									<span class="label">%s</span>
								</a>',
								esc_attr( $item['id'] ),
								esc_html( $item['icon'] ),
								esc_html( $item['label'] )
							);
						}
					}
				}
				?>
			</div>

			<div class="dashboard-content">
				<p><?php esc_html_e( 'محتوای داشبورد در اینجا نمایش داده می‌شود.', 'tabesh-v2' ); ?></p>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Enqueue assets for the user dashboard.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Only load on pages with the shortcode.
		global $post;
		if ( ! is_a( $post, 'WP_Post' ) || ! has_shortcode( $post->post_content, 'tabesh_user_dashboard' ) ) {
			return;
		}

		// Enqueue frontend dashboard CSS.
		wp_enqueue_style(
			'tabesh-v2-dashboard',
			TABESH_V2_PLUGIN_URL . 'assets/css/dashboard.css',
			array(),
			TABESH_V2_VERSION
		);

		// Enqueue frontend dashboard JavaScript.
		wp_enqueue_script(
			'tabesh-v2-dashboard',
			TABESH_V2_PLUGIN_URL . 'assets/js/dashboard.js',
			array( 'jquery', 'wp-api-fetch' ),
			TABESH_V2_VERSION,
			true
		);

		// Localize script with settings.
		wp_localize_script(
			'tabesh-v2-dashboard',
			'tabeshDashboard',
			array(
				'apiUrl' => rest_url( 'tabesh/v2/' ),
				'nonce'  => wp_create_nonce( 'wp_rest' ),
			)
		);
	}
}
