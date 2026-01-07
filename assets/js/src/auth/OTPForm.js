import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const OTPForm = ({ phoneNumber, onVerified, onBack }) => {
	const [otpCode, setOTPCode] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(120); // 2 minutes
	const [canResend, setCanResend] = useState(false);

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => {
				setResendTimer(resendTimer - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [resendTimer]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch(`${tabeshAuthData.apiUrl}/verify-otp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': tabeshAuthData.nonce,
				},
				body: JSON.stringify({
					phone_number: phoneNumber,
					otp_code: otpCode,
				}),
			});

			const data = await response.json();

			if (data.success) {
				if (data.needs_registration) {
					onVerified(true);
				} else {
					onVerified(false);
				}
			} else {
				setError(data.message || __('Invalid OTP code', 'tabesh-v2'));
			}
		} catch (err) {
			setError(__('Network error. Please try again.', 'tabesh-v2'));
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!canResend) return;

		setError('');
		setLoading(true);
		setCanResend(false);
		setResendTimer(120);

		try {
			const response = await fetch(`${tabeshAuthData.apiUrl}/request-otp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': tabeshAuthData.nonce,
				},
				body: JSON.stringify({ phone_number: phoneNumber }),
			});

			const data = await response.json();

			if (!data.success) {
				setError(data.message || __('Failed to resend OTP', 'tabesh-v2'));
				setCanResend(true);
				setResendTimer(0);
			}
		} catch (err) {
			setError(__('Network error. Please try again.', 'tabesh-v2'));
			setCanResend(true);
			setResendTimer(0);
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<form onSubmit={handleSubmit} className="tabesh-auth-form">
			<div className="tabesh-otp-info">
				<p>
					{__('Enter the verification code sent to', 'tabesh-v2')}
					<br />
					<strong dir="ltr">{phoneNumber}</strong>
				</p>
			</div>

			{error && (
				<div className="tabesh-auth-error">
					{error}
				</div>
			)}

			<div className="tabesh-form-group">
				<label htmlFor="otp-code">
					{__('Verification Code', 'tabesh-v2')}
				</label>
				<input
					type="text"
					id="otp-code"
					value={otpCode}
					onChange={(e) => setOTPCode(e.target.value.replace(/\D/g, ''))}
					placeholder="123456"
					required
					maxLength="6"
					pattern="\d{6}"
					disabled={loading}
					dir="ltr"
					autoComplete="off"
					autoFocus
				/>
			</div>

			<button
				type="submit"
				className="tabesh-btn tabesh-btn-primary"
				disabled={loading || otpCode.length !== 6}
			>
				{loading ? __('Verifying...', 'tabesh-v2') : __('Verify', 'tabesh-v2')}
			</button>

			<div className="tabesh-auth-actions">
				<button
					type="button"
					onClick={onBack}
					className="tabesh-btn-link"
					disabled={loading}
				>
					{__('Change phone number', 'tabesh-v2')}
				</button>

				{canResend ? (
					<button
						type="button"
						onClick={handleResend}
						className="tabesh-btn-link"
						disabled={loading}
					>
						{__('Resend code', 'tabesh-v2')}
					</button>
				) : (
					<span className="tabesh-timer">
						{__('Resend in', 'tabesh-v2')} {formatTime(resendTimer)}
					</span>
				)}
			</div>
		</form>
	);
};

export default OTPForm;
