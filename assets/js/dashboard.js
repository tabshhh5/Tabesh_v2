/**
 * Tabesh User Dashboard Frontend JavaScript.
 *
 * Handles OTP authentication and dashboard functionality.
 */
(function ($) {
	'use strict';

	let currentMobile = '';

	// Initialize when DOM is ready
	$(document).ready(function () {
		initAuthForm();
	});

	/**
	 * Initialize authentication form handlers.
	 */
	function initAuthForm() {
		// Mobile form submission
		$('#tabesh-mobile-form').on('submit', function (e) {
			e.preventDefault();
			handleMobileSubmit();
		});

		// OTP form submission
		$('#tabesh-otp-form').on('submit', function (e) {
			e.preventDefault();
			handleOtpSubmit();
		});

		// Back button
		$('#tabesh-back-btn').on('click', function () {
			showStep1();
		});

		// Corporate checkbox toggle
		$('#is-corporate').on('change', function () {
			if ($(this).is(':checked')) {
				$('#company-name-field').show();
			} else {
				$('#company-name-field').hide();
			}
		});
	}

	/**
	 * Handle mobile number submission (send OTP).
	 */
	function handleMobileSubmit() {
		const mobile = $('#mobile').val().trim();

		if (!validateMobile(mobile)) {
			showMessage('شماره موبایل نامعتبر است.', 'error');
			return;
		}

		currentMobile = mobile;
		showLoading(true);
		showMessage('', 'info');

		// Send OTP request
		wp.apiFetch({
			path: '/tabesh/v2/auth/send-otp',
			method: 'POST',
			data: {
				mobile: mobile,
			},
		})
			.then(function (response) {
				showLoading(false);
				if (response.success) {
					showMessage(response.message, 'success');
					showStep2();
				} else {
					showMessage(response.message, 'error');
				}
			})
			.catch(function (error) {
				showLoading(false);
				showMessage('خطا در ارسال کد. لطفاً دوباره تلاش کنید.', 'error');
				console.error('Error sending OTP:', error);
			});
	}

	/**
	 * Handle OTP verification and login/registration.
	 */
	function handleOtpSubmit() {
		const code = $('#otp-code').val().trim();

		if (!code || code.length !== 5) {
			showMessage('کد تأیید باید 5 رقم باشد.', 'error');
			return;
		}

		const data = {
			mobile: currentMobile,
			code: code,
		};

		// Check if user info fields are visible (new user)
		if ($('#tabesh-user-info-fields').is(':visible')) {
			data.first_name = $('#first-name').val().trim();
			data.last_name = $('#last-name').val().trim();
			data.is_corporate = $('#is-corporate').is(':checked');
			
			if (data.is_corporate) {
				data.company_name = $('#company-name').val().trim();
			}

			// Validate name fields
			if (!data.first_name || !data.last_name) {
				showMessage('لطفاً نام و نام خانوادگی را وارد کنید.', 'error');
				return;
			}
		}

		showLoading(true);
		showMessage('', 'info');

		// Verify OTP and login/register
		wp.apiFetch({
			path: '/tabesh/v2/auth/verify-otp',
			method: 'POST',
			data: data,
		})
			.then(function (response) {
				showLoading(false);
				if (response.success) {
					showMessage(response.message, 'success');
					
					// If new user, show user info fields
					if (response.is_new && !$('#tabesh-user-info-fields').is(':visible')) {
						$('#tabesh-user-info-fields').show();
						showMessage('لطفاً اطلاعات خود را تکمیل کنید.', 'info');
						return;
					}

					// Redirect to dashboard or reload page
					setTimeout(function () {
						window.location.reload();
					}, 1000);
				} else {
					showMessage(response.message, 'error');
				}
			})
			.catch(function (error) {
				showLoading(false);
				showMessage('خطا در تأیید کد. لطفاً دوباره تلاش کنید.', 'error');
				console.error('Error verifying OTP:', error);
			});
	}

	/**
	 * Validate mobile number.
	 *
	 * @param {string} mobile Mobile number
	 * @return {boolean} True if valid
	 */
	function validateMobile(mobile) {
		const pattern = /^09[0-9]{9}$/;
		return pattern.test(mobile);
	}

	/**
	 * Show step 1 (mobile input).
	 */
	function showStep1() {
		$('#tabesh-auth-step-1').show();
		$('#tabesh-auth-step-2').hide();
		$('#tabesh-user-info-fields').hide();
		$('#otp-code').val('');
		showMessage('', 'info');
	}

	/**
	 * Show step 2 (OTP input).
	 */
	function showStep2() {
		$('#tabesh-auth-step-1').hide();
		$('#tabesh-auth-step-2').show();
	}

	/**
	 * Show message to user.
	 *
	 * @param {string} message Message text
	 * @param {string} type Message type (success, error, info)
	 */
	function showMessage(message, type) {
		const $messageDiv = $('#tabesh-auth-message');
		
		if (!message) {
			$messageDiv.html('').removeClass().hide();
			return;
		}

		$messageDiv
			.html('<p>' + message + '</p>')
			.removeClass()
			.addClass(type)
			.show();
	}

	/**
	 * Show/hide loading indicator.
	 *
	 * @param {boolean} show Whether to show loading
	 */
	function showLoading(show) {
		if (show) {
			$('#tabesh-auth-loading').show();
			$('#tabesh-auth-step-1, #tabesh-auth-step-2').css('opacity', '0.5');
			$('button').prop('disabled', true);
		} else {
			$('#tabesh-auth-loading').hide();
			$('#tabesh-auth-step-1, #tabesh-auth-step-2').css('opacity', '1');
			$('button').prop('disabled', false);
		}
	}
})(jQuery);
