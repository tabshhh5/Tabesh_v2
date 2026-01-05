/**
 * Tabesh User Dashboard Frontend JavaScript.
 *
 * Handles OTP authentication and dashboard functionality.
 */
(function ($) {
	'use strict';

	// Constants
	const AUTO_SUBMIT_DELAY = 200; // milliseconds - allows visual feedback before validation
	const OTP_LENGTH = 5;
	const DIGIT_PATTERN = /^[0-9]*$/; // Validates numeric input only

	let currentMobile = '';
	let isNewUser = false;

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

		// Initialize OTP input boxes
		initOtpInputs();
	}

	/**
	 * Initialize segmented OTP input boxes with auto-focus and validation.
	 */
	function initOtpInputs() {
		const $otpContainer = $('#otp-inputs-container');
		if ($otpContainer.length === 0) return;

		const $inputs = $otpContainer.find('.otp-input');

		$inputs.each(function (index) {
			$(this).on('input', function (e) {
				const $this = $(this);
				const value = $this.val();

				// Only allow digits
				if (!DIGIT_PATTERN.test(value)) {
					$this.val('');
					return;
				}

				// Limit to single digit
				if (value.length > 1) {
					$this.val(value.charAt(0));
					return;
				}

				// Move to next input if digit entered
				if (value.length === 1 && index < $inputs.length - 1) {
					$inputs.eq(index + 1).focus();
				}

				// Check if all inputs filled and auto-submit
				checkOtpComplete();
			});

			// Handle backspace
			$(this).on('keydown', function (e) {
				if (e.key === 'Backspace' && $(this).val() === '' && index > 0) {
					$inputs.eq(index - 1).focus();
				}
			});

			// Handle paste
			$(this).on('paste', function (e) {
				e.preventDefault();
				const pastedData = e.originalEvent.clipboardData.getData('text');
				const digits = pastedData.replace(/\D/g, '').split('');
				
				$inputs.each(function (i) {
					if (digits[i]) {
						$(this).val(digits[i]);
					}
				});

				// Focus last filled input or first if none
				if (digits.length > 0) {
					const lastFilledIndex = Math.min(digits.length - 1, $inputs.length - 1);
					$inputs.eq(lastFilledIndex).focus();
				} else {
					$inputs.eq(0).focus();
				}
				
				checkOtpComplete();
			});
		});
	}

	/**
	 * Check if OTP is complete and auto-validate.
	 */
	function checkOtpComplete() {
		const $inputs = $('#otp-inputs-container .otp-input');
		let code = '';
		let allFilled = true;

		$inputs.each(function () {
			const val = $(this).val();
			if (val === '') {
				allFilled = false;
			}
			code += val;
		});

		if (allFilled && code.length === OTP_LENGTH) {
			// Auto-submit OTP verification with slight delay to allow user to see complete input
			setTimeout(function () {
				handleOtpVerification(code);
			}, AUTO_SUBMIT_DELAY);
		}
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

		// First check if user exists
		wp.apiFetch({
			path: '/tabesh/v2/auth/check-user',
			method: 'POST',
			data: {
				mobile: mobile,
			},
		})
			.then(function (response) {
				if (response.success) {
					isNewUser = !response.exists;
					
					// Now send OTP
					return wp.apiFetch({
						path: '/tabesh/v2/auth/send-otp',
						method: 'POST',
						data: {
							mobile: mobile,
						},
					});
				}
			})
			.then(function (response) {
				showLoading(false);
				if (response.success) {
					showMessage(response.message, 'success');
					showStep2(isNewUser);
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
	 * Handle OTP verification.
	 *
	 * @param {string} code OTP code (optional, will get from inputs if not provided)
	 */
	function handleOtpVerification(code) {
		if (!code) {
			// Get code from segmented inputs
			const $inputs = $('#otp-inputs-container .otp-input');
			code = '';
			$inputs.each(function () {
				code += $(this).val();
			});
		}

		if (!code || code.length !== OTP_LENGTH) {
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

		// Add visual feedback for verification in progress
		$('#otp-inputs-container').addClass('verifying');

		// Verify OTP and login/register
		wp.apiFetch({
			path: '/tabesh/v2/auth/verify-otp',
			method: 'POST',
			data: data,
		})
			.then(function (response) {
				showLoading(false);
				$('#otp-inputs-container').removeClass('verifying');
				
				if (response.success) {
					// Show success visual feedback
					$('#otp-inputs-container').addClass('success');
					showMessage(response.message, 'success');
					
					// If new user and user info not yet collected, show fields
					if (isNewUser && !$('#tabesh-user-info-fields').is(':visible')) {
						$('#tabesh-user-info-fields').slideDown(300);
						$('#tabesh-otp-submit-btn').show();
						showMessage('کد تأیید شد. لطفاً اطلاعات خود را تکمیل کنید.', 'success');
						return;
					}

					// Redirect to dashboard or reload page
					setTimeout(function () {
						window.location.reload();
					}, 1000);
				} else {
					// Show error visual feedback
					$('#otp-inputs-container').addClass('error');
					showMessage(response.message, 'error');
					
					// Clear OTP inputs and remove error class after animation
					setTimeout(function () {
						$('#otp-inputs-container .otp-input').val('');
						$('#otp-inputs-container .otp-input').first().focus();
						$('#otp-inputs-container').removeClass('error');
					}, 1000);
				}
			})
			.catch(function (error) {
				showLoading(false);
				$('#otp-inputs-container').removeClass('verifying').addClass('error');
				showMessage('خطا در تأیید کد. لطفاً دوباره تلاش کنید.', 'error');
				console.error('Error verifying OTP:', error);
				
				setTimeout(function () {
					$('#otp-inputs-container').removeClass('error');
				}, 1000);
			});
	}

	/**
	 * Handle OTP form submission (for new users with user info).
	 */
	function handleOtpSubmit() {
		handleOtpVerification();
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
		$('#otp-inputs-container .otp-input').val('');
		$('#otp-inputs-container').removeClass('verifying success error');
		showMessage('', 'info');
		isNewUser = false;
	}

	/**
	 * Show step 2 (OTP input).
	 *
	 * @param {boolean} isNew Whether this is a new user registration
	 */
	function showStep2(isNew) {
		$('#tabesh-auth-step-1').hide();
		$('#tabesh-auth-step-2').show();
		
		// Don't show user info fields yet - wait for OTP verification
		$('#tabesh-user-info-fields').hide();
		$('#tabesh-otp-submit-btn').hide();
		
		// Focus first OTP input
		setTimeout(function () {
			$('#otp-inputs-container .otp-input').first().focus();
		}, 100);
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
			$('#tabesh-auth-step-1, #tabesh-auth-step-2').css('opacity', '0.6');
			$('button').prop('disabled', true);
		} else {
			$('#tabesh-auth-loading').hide();
			$('#tabesh-auth-step-1, #tabesh-auth-step-2').css('opacity', '1');
			$('button').prop('disabled', false);
		}
	}
})(jQuery);
