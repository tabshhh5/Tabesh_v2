import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import OTPForm from './OTPForm';
import RegisterForm from './RegisterForm';

const LoginPage = () => {
	const [step, setStep] = useState('phone'); // 'phone', 'otp', 'register'
	const [phoneNumber, setPhoneNumber] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handlePhoneSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

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

			if (data.success) {
				setStep('otp');
			} else {
				setError(data.message || __('Failed to send OTP', 'tabesh-v2'));
			}
		} catch (err) {
			setError(__('Network error. Please try again.', 'tabesh-v2'));
		} finally {
			setLoading(false);
		}
	};

	const handleOTPVerified = (needsRegistration) => {
		if (needsRegistration) {
			setStep('register');
		} else {
			// Redirect to dashboard
			window.location.href = tabeshAuthData.redirectUrl;
		}
	};

	const handleRegistrationComplete = () => {
		// Redirect to dashboard
		window.location.href = tabeshAuthData.redirectUrl;
	};

	return (
		<div className="tabesh-auth-container">
			<div className="tabesh-auth-card">
				<div className="tabesh-auth-header">
					<h1>{__('Welcome to Tabesh', 'tabesh-v2')}</h1>
					<p>{__('Sign in with your phone number', 'tabesh-v2')}</p>
				</div>

				{error && (
					<div className="tabesh-auth-error">
						{error}
					</div>
				)}

				{step === 'phone' && (
					<form onSubmit={handlePhoneSubmit} className="tabesh-auth-form">
						<div className="tabesh-form-group">
							<label htmlFor="phone-number">
								{__('Phone Number', 'tabesh-v2')}
							</label>
							<input
								type="tel"
								id="phone-number"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								placeholder="09123456789"
								required
								pattern="^09\d{9}$"
								title={__('Please enter a valid Iranian mobile number', 'tabesh-v2')}
								disabled={loading}
								dir="ltr"
							/>
						</div>

						<button
							type="submit"
							className="tabesh-btn tabesh-btn-primary"
							disabled={loading}
						>
							{loading ? __('Sending...', 'tabesh-v2') : __('Send OTP', 'tabesh-v2')}
						</button>
					</form>
				)}

				{step === 'otp' && (
					<OTPForm
						phoneNumber={phoneNumber}
						onVerified={handleOTPVerified}
						onBack={() => setStep('phone')}
					/>
				)}

				{step === 'register' && (
					<RegisterForm
						phoneNumber={phoneNumber}
						onComplete={handleRegistrationComplete}
						onBack={() => setStep('otp')}
					/>
				)}
			</div>
		</div>
	);
};

export default LoginPage;
