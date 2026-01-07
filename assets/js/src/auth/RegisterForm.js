import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const RegisterForm = ({ phoneNumber, onComplete, onBack }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		companyName: '',
	});
	const [otpCode, setOTPCode] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch(`${tabeshAuthData.apiUrl}/complete-registration`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': tabeshAuthData.nonce,
				},
				body: JSON.stringify({
					phone_number: phoneNumber,
					otp_code: otpCode,
					first_name: formData.firstName,
					last_name: formData.lastName,
					company_name: formData.companyName,
				}),
			});

			const data = await response.json();

			if (data.success) {
				onComplete();
			} else {
				setError(data.message || __('Registration failed', 'tabesh-v2'));
			}
		} catch (err) {
			setError(__('Network error. Please try again.', 'tabesh-v2'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="tabesh-auth-form">
			<div className="tabesh-register-info">
				<p>{__('Please complete your profile', 'tabesh-v2')}</p>
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
				/>
			</div>

			<div className="tabesh-form-group">
				<label htmlFor="first-name">
					{__('First Name', 'tabesh-v2')} *
				</label>
				<input
					type="text"
					id="first-name"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					required
					disabled={loading}
				/>
			</div>

			<div className="tabesh-form-group">
				<label htmlFor="last-name">
					{__('Last Name', 'tabesh-v2')} *
				</label>
				<input
					type="text"
					id="last-name"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					required
					disabled={loading}
				/>
			</div>

			<div className="tabesh-form-group">
				<label htmlFor="company-name">
					{__('Company Name (Optional)', 'tabesh-v2')}
				</label>
				<input
					type="text"
					id="company-name"
					name="companyName"
					value={formData.companyName}
					onChange={handleChange}
					disabled={loading}
				/>
			</div>

			<button
				type="submit"
				className="tabesh-btn tabesh-btn-primary"
				disabled={loading || !formData.firstName || !formData.lastName || otpCode.length !== 6}
			>
				{loading ? __('Completing...', 'tabesh-v2') : __('Complete Registration', 'tabesh-v2')}
			</button>

			<div className="tabesh-auth-actions">
				<button
					type="button"
					onClick={onBack}
					className="tabesh-btn-link"
					disabled={loading}
				>
					{__('Back', 'tabesh-v2')}
				</button>
			</div>
		</form>
	);
};

export default RegisterForm;
