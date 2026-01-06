import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import OTPInput from './OTPInput';
import './auth-form.scss';

/**
 * Modern Authentication Form Component.
 * 
 * Handles both login and registration with OTP verification.
 * Supports customization via admin settings.
 */
const AuthForm = () => {
	const [step, setStep] = useState('mobile'); // 'mobile', 'otp', 'register'
	const [mobile, setMobile] = useState('');
	const [otp, setOtp] = useState('');
	const [isNewUser, setIsNewUser] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });
	
	// Registration fields
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [isCorporate, setIsCorporate] = useState(false);
	const [companyName, setCompanyName] = useState('');

	// Get settings from localized script
	const authSettings = window.tabeshAuth?.settings || {};
	const brandTitle = authSettings.brandTitle || __('ورود به داشبورد', 'tabesh-v2');
	const brandSubtitle = authSettings.brandSubtitle || __('سیستم مدیریت چاپ تابش', 'tabesh-v2');
	const logoUrl = authSettings.logoUrl || '';
	const otpLength = authSettings.otpLength || 5;
	const requireName = authSettings.requireName !== false;
	const allowCorporate = authSettings.allowCorporate !== false;
	
	// Template and design settings
	const template = authSettings.template || 'minimal';
	const desktopBannerUrl = authSettings.desktopBannerUrl || '';
	const backgroundImageUrl = authSettings.backgroundImageUrl || '';
	const animationEnabled = authSettings.animationEnabled !== false;
	const formAnimation = authSettings.formAnimation || 'slideUp';

	/**
	 * Handle mobile number submission.
	 */
	const handleMobileSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateMobile(mobile)) {
			setMessage({
				text: __('شماره موبایل نامعتبر است.', 'tabesh-v2'),
				type: 'error'
			});
			return;
		}

		setLoading(true);
		setMessage({ text: '', type: '' });

		try {
			// Check if user exists
			const checkResponse = await apiFetch({
				path: '/tabesh/v2/auth/check-user',
				method: 'POST',
				data: { mobile }
			});

			setIsNewUser(!checkResponse.exists);

			// Send OTP
			const otpResponse = await apiFetch({
				path: '/tabesh/v2/auth/send-otp',
				method: 'POST',
				data: { mobile }
			});

			if (otpResponse.success) {
				setMessage({
					text: otpResponse.message || __('کد تأیید ارسال شد.', 'tabesh-v2'),
					type: 'success'
				});
				setStep('otp');
			} else {
				setMessage({
					text: otpResponse.message,
					type: 'error'
				});
			}
		} catch (error) {
			setMessage({
				text: __('خطا در ارسال کد. لطفاً دوباره تلاش کنید.', 'tabesh-v2'),
				type: 'error'
			});
			console.error('Error sending OTP:', error);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handle OTP verification.
	 */
	const handleOtpVerification = async (otpValue) => {
		setLoading(true);
		setMessage({ text: '', type: '' });

		const data = {
			mobile,
			code: otpValue
		};

		// If new user and registration fields are filled
		if (isNewUser && firstName && lastName) {
			data.first_name = firstName;
			data.last_name = lastName;
			data.is_corporate = isCorporate;
			if (isCorporate) {
				data.company_name = companyName;
			}
		}

		try {
			const response = await apiFetch({
				path: '/tabesh/v2/auth/verify-otp',
				method: 'POST',
				data
			});

			if (response.success) {
				// If new user and no registration info yet, show registration form
				if (isNewUser && !firstName && !lastName) {
					setMessage({
						text: __('کد تأیید شد. لطفاً اطلاعات خود را تکمیل کنید.', 'tabesh-v2'),
						type: 'success'
					});
					setStep('register');
					return;
				}

				// Success - redirect to dashboard
				setMessage({
					text: response.message,
					type: 'success'
				});
				
				// Use proper redirect instead of reload
				setTimeout(() => {
					const dashboardUrl = window.tabeshAuth?.dashboardUrl || '/panel';
					window.location.href = dashboardUrl;
				}, 1000);
			} else {
				setMessage({
					text: response.message,
					type: 'error'
				});
				setOtp('');
			}
		} catch (error) {
			setMessage({
				text: __('خطا در تأیید کد. لطفاً دوباره تلاش کنید.', 'tabesh-v2'),
				type: 'error'
			});
			console.error('Error verifying OTP:', error);
			setOtp('');
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handle registration form submission.
	 */
	const handleRegisterSubmit = async (e) => {
		e.preventDefault();

		if (!firstName || !lastName) {
			setMessage({
				text: __('لطفاً نام و نام خانوادگی را وارد کنید.', 'tabesh-v2'),
				type: 'error'
			});
			return;
		}

		setLoading(true);
		setMessage({ text: '', type: '' });

		// Send registration data with stored OTP (token preserved from initial verification)
		try {
			const response = await apiFetch({
				path: '/tabesh/v2/auth/verify-otp',
				method: 'POST',
				data: {
					mobile,
					code: otp,
					first_name: firstName,
					last_name: lastName,
					is_corporate: isCorporate,
					company_name: isCorporate ? companyName : ''
				}
			});

			if (response.success) {
				setMessage({
					text: response.message,
					type: 'success'
				});
				
				// Redirect to dashboard
				setTimeout(() => {
					const dashboardUrl = window.tabeshAuth?.dashboardUrl || '/panel';
					window.location.href = dashboardUrl;
				}, 1000);
			} else {
				setMessage({
					text: response.message,
					type: 'error'
				});
			}
		} catch (error) {
			setMessage({
				text: __('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.', 'tabesh-v2'),
				type: 'error'
			});
			console.error('Error during registration:', error);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Validate mobile number.
	 */
	const validateMobile = (value) => {
		const pattern = /^09[0-9]{9}$/;
		return pattern.test(value);
	};

	/**
	 * Handle back button.
	 */
	const handleBack = () => {
		if (step === 'register') {
			setStep('otp');
		} else if (step === 'otp') {
			setStep('mobile');
			setOtp('');
		}
		setMessage({ text: '', type: '' });
	};

	/**
	 * Render the authentication card content.
	 */
	const renderAuthCard = () => (
		<div className={`tabesh-auth-card ${animationEnabled ? 'animated' : ''} animation-${formAnimation}`}>
			{/* Logo/Brand */}
			<div className="tabesh-auth-brand">
				{logoUrl ? (
					<div className="tabesh-auth-logo custom-logo">
						<img src={logoUrl} alt={brandTitle} />
					</div>
				) : (
					<div className="tabesh-auth-logo">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
						</svg>
					</div>
				)}
				<h1>{brandTitle}</h1>
				<p>{brandSubtitle}</p>
			</div>

			{/* Step 1: Mobile Input */}
			{step === 'mobile' && (
				<form onSubmit={handleMobileSubmit} className="tabesh-auth-form fade-in">
					<div className="tabesh-form-group">
						<label htmlFor="mobile">
							{__('شماره موبایل', 'tabesh-v2')}
						</label>
						<input
							type="text"
									id="mobile"
									value={mobile}
									onChange={(e) => setMobile(e.target.value)}
									placeholder="09xxxxxxxxx"
									pattern="09[0-9]{9}"
									maxLength="11"
									inputMode="numeric"
									dir="ltr"
									required
									disabled={loading}
									className="tabesh-input"
								/>
							</div>

							<button
								type="submit"
								className="tabesh-btn tabesh-btn-primary"
								disabled={loading}
							>
								{loading ? (
									<>
										<span className="tabesh-spinner-small"></span>
										{__('در حال ارسال...', 'tabesh-v2')}
									</>
								) : (
									<>
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										{__('دریافت کد تأیید', 'tabesh-v2')}
									</>
								)}
							</button>
						</form>
					)}

					{/* Step 2: OTP Verification */}
					{step === 'otp' && (
						<div className="tabesh-auth-form fade-in">
							<div className="tabesh-info-message">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<p>{__('کد تأیید به شماره ', 'tabesh-v2')}<strong dir="ltr">{mobile}</strong>{__(' ارسال شد.', 'tabesh-v2')}</p>
							</div>

							<div className="tabesh-form-group">
								<label>{__('کد تأیید', 'tabesh-v2')} {otpLength} {__('رقمی', 'tabesh-v2')}</label>
								<OTPInput
									length={otpLength}
									value={otp}
									onChange={setOtp}
									onComplete={handleOtpVerification}
									disabled={loading}
								/>
								<p className="tabesh-input-hint">
									{__('کد به صورت خودکار تأیید می‌شود', 'tabesh-v2')}
								</p>
							</div>

							<button
								type="button"
								onClick={handleBack}
								className="tabesh-btn tabesh-btn-secondary"
								disabled={loading}
							>
								{__('تغییر شماره', 'tabesh-v2')}
							</button>
						</div>
					)}

					{/* Step 3: Registration Info */}
					{step === 'register' && (
						<form onSubmit={handleRegisterSubmit} className="tabesh-auth-form fade-in">
							<div className="tabesh-form-group">
								<label htmlFor="first-name">
									{__('نام', 'tabesh-v2')} <span className="required">*</span>
								</label>
								<input
									type="text"
									id="first-name"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
									disabled={loading}
									className="tabesh-input"
								/>
							</div>

							<div className="tabesh-form-group">
								<label htmlFor="last-name">
									{__('نام خانوادگی', 'tabesh-v2')} <span className="required">*</span>
								</label>
								<input
									type="text"
									id="last-name"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
									disabled={loading}
									className="tabesh-input"
								/>
							</div>

							{allowCorporate && (
								<div className="tabesh-form-group">
									<label className="tabesh-checkbox-label">
										<input
											type="checkbox"
											checked={isCorporate}
											onChange={(e) => setIsCorporate(e.target.checked)}
											disabled={loading}
										/>
										<span>{__('شخص حقوقی', 'tabesh-v2')}</span>
									</label>
								</div>
							)}

							{isCorporate && allowCorporate && (
								<div className="tabesh-form-group fade-in">
									<label htmlFor="company-name">
										{__('نام سازمان', 'tabesh-v2')}
									</label>
									<input
										type="text"
										id="company-name"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										disabled={loading}
										className="tabesh-input"
									/>
								</div>
							)}

							<div className="tabesh-btn-group">
								<button
									type="submit"
									className="tabesh-btn tabesh-btn-primary"
									disabled={loading}
								>
									{loading ? (
										<>
											<span className="tabesh-spinner-small"></span>
											{__('در حال ثبت...', 'tabesh-v2')}
										</>
									) : (
										<>
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
												<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
											{__('تکمیل ثبت‌نام', 'tabesh-v2')}
										</>
									)}
								</button>
								<button
									type="button"
									onClick={handleBack}
									className="tabesh-btn tabesh-btn-secondary"
									disabled={loading}
								>
									{__('بازگشت', 'tabesh-v2')}
								</button>
							</div>
						</form>
					)}

					{/* Message Display */}
					{message.text && (
						<div className={`tabesh-auth-message ${message.type}`}>
							{message.type === 'success' && (
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							)}
							{message.type === 'error' && (
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							)}
							<p>{message.text}</p>
						</div>
					)}
				</div>
	);

	/**
	 * Render banner/image side panel for templates with banners.
	 */
	const renderBannerPanel = () => {
		if (!desktopBannerUrl) {
			return (
				<div className="tabesh-auth-banner-placeholder">
					<div className="placeholder-content">
						<svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
						</svg>
						<p>{__('تصویر یا اسلایدر بنر', 'tabesh-v2')}</p>
					</div>
				</div>
			);
		}
		return (
			<div className="tabesh-auth-banner">
				<img src={desktopBannerUrl} alt={__('بنر ورود', 'tabesh-v2')} />
			</div>
		);
	};

	/**
	 * Get wrapper class based on template.
	 */
	const getWrapperClass = () => {
		let classes = ['tabesh-auth-wrapper'];
		classes.push(`template-${template}`);
		if (backgroundImageUrl && template === 'background-image') {
			classes.push('has-background-image');
		}
		return classes.join(' ');
	};

	/**
	 * Get wrapper style based on template.
	 */
	const getWrapperStyle = () => {
		if (template === 'background-image' && backgroundImageUrl) {
			return {
				backgroundImage: `url(${backgroundImageUrl})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			};
		}
		return {};
	};

	// Render based on template
	if (template === 'banner-left') {
		return (
			<div className={getWrapperClass()} style={getWrapperStyle()}>
				<div className="tabesh-auth-split-layout">
					<div className="tabesh-auth-banner-side left">
						{renderBannerPanel()}
					</div>
					<div className="tabesh-auth-form-side">
						<div className="tabesh-auth-container">
							{renderAuthCard()}
							<div className="tabesh-auth-footer">
								<p>{__('© 2024 تابش. تمامی حقوق محفوظ است.', 'tabesh-v2')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (template === 'banner-right') {
		return (
			<div className={getWrapperClass()} style={getWrapperStyle()}>
				<div className="tabesh-auth-split-layout">
					<div className="tabesh-auth-form-side">
						<div className="tabesh-auth-container">
							{renderAuthCard()}
							<div className="tabesh-auth-footer">
								<p>{__('© 2024 تابش. تمامی حقوق محفوظ است.', 'tabesh-v2')}</p>
							</div>
						</div>
					</div>
					<div className="tabesh-auth-banner-side right">
						{renderBannerPanel()}
					</div>
				</div>
			</div>
		);
	}

	// Default minimal template
	return (
		<div className={getWrapperClass()} style={getWrapperStyle()}>
			<div className="tabesh-auth-container">
				{renderAuthCard()}

				{/* Footer */}
				<div className="tabesh-auth-footer">
					<p>{__('© 2024 تابش. تمامی حقوق محفوظ است.', 'tabesh-v2')}</p>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
