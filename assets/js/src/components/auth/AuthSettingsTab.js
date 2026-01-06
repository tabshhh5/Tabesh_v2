import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Button, Panel, PanelBody, PanelRow, TextControl, ToggleControl, ColorPicker, SelectControl, RangeControl, Notice } from '@wordpress/components';
import './auth-settings.scss';

/**
 * Auth Settings Tab Component.
 * 
 * Allows admins to customize login/registration page appearance.
 * Includes template selection, banner support, and animation options.
 */
const AuthSettingsTab = () => {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });
	
	// Settings state - using snake_case to match backend API
	const [settings, setSettings] = useState({
		// Template (minimal, split, fullBg, gradient)
		template: 'minimal',
		
		// Appearance
		primaryColor: '#4f46e5',
		backgroundColor: '#667eea',
		secondaryBackgroundColor: '#764ba2',
		logoUrl: '',
		brandTitle: 'ورود به داشبورد',
		brandSubtitle: 'سیستم مدیریت چاپ تابش',
		
		// Layout
		cardWidth: 480,
		cardPadding: 48,
		borderRadius: 16,
		
		// Desktop Banner/Slider
		desktopBannerEnabled: false,
		desktopBannerUrl: '',
		desktopBannerPosition: 'left',
		desktopSliderShortcode: '',
		
		// Background
		backgroundType: 'gradient',
		backgroundImageUrl: '',
		backgroundOverlayOpacity: 0.5,
		
		// Animation
		animationEnabled: true,
		formAnimation: 'slideUp',
		transitionAnimation: 'flip',
		
		// Glassmorphism for fullBg template
		glassEffect: true,
		glassBlur: 20,
		glassOpacity: 0.95,
		
		// OTP Settings - using snake_case to match backend
		otp_length: 5,
		otp_expiry: 120,
		autoSubmitOtp: true,
		
		// Registration - using snake_case to match backend
		require_name: true,
		allow_corporate: true,
		auto_create_user: true,
	});

	/**
	 * Load settings on mount.
	 */
	useEffect(() => {
		loadSettings();
	}, []);

	/**
	 * Load settings from API.
	 */
	const loadSettings = async () => {
		setLoading(true);
		try {
			const response = await apiFetch({
				path: '/tabesh/v2/settings',
			});

			if (response.auth) {
				setSettings(prevSettings => ({
					...prevSettings,
					...response.auth
				}));
			}
		} catch (error) {
			console.error('Error loading auth settings:', error);
			setMessage({
				text: __('خطا در بارگذاری تنظیمات', 'tabesh-v2'),
				type: 'error'
			});
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Save settings to API.
	 */
	const handleSave = async () => {
		setSaving(true);
		setMessage({ text: '', type: '' });

		try {
			const response = await apiFetch({
				path: '/tabesh/v2/settings',
				method: 'POST',
				data: {
					auth: settings
				}
			});

			if (response.success) {
				setMessage({
					text: __('تنظیمات با موفقیت ذخیره شد', 'tabesh-v2'),
					type: 'success'
				});
			}
		} catch (error) {
			console.error('Error saving auth settings:', error);
			setMessage({
				text: __('خطا در ذخیره تنظیمات', 'tabesh-v2'),
				type: 'error'
			});
		} finally {
			setSaving(false);
		}
	};

	/**
	 * Update setting value.
	 */
	const updateSetting = (key, value) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}));
	};

	/**
	 * Reset to defaults.
	 */
	const handleReset = () => {
		if (confirm(__('آیا می‌خواهید تنظیمات را به حالت پیش‌فرض بازگردانید؟', 'tabesh-v2'))) {
			setSettings({
				template: 'minimal',
				primaryColor: '#4f46e5',
				backgroundColor: '#667eea',
				secondaryBackgroundColor: '#764ba2',
				logoUrl: '',
				brandTitle: 'ورود به داشبورد',
				brandSubtitle: 'سیستم مدیریت چاپ تابش',
				cardWidth: 480,
				cardPadding: 48,
				borderRadius: 16,
				desktopBannerEnabled: false,
				desktopBannerUrl: '',
				desktopBannerPosition: 'left',
				desktopSliderShortcode: '',
				backgroundType: 'gradient',
				backgroundImageUrl: '',
				backgroundOverlayOpacity: 0.5,
				animationEnabled: true,
				formAnimation: 'slideUp',
				transitionAnimation: 'flip',
				glassEffect: true,
				glassBlur: 20,
				glassOpacity: 0.95,
				otp_length: 5,
				otp_expiry: 120,
				autoSubmitOtp: true,
				require_name: true,
				allow_corporate: true,
				auto_create_user: true,
			});
			setMessage({
				text: __('تنظیمات به حالت پیش‌فرض بازگشت. برای ذخیره کلیک کنید.', 'tabesh-v2'),
				type: 'info'
			});
		}
	};

	if (loading) {
		return (
			<div className="tabesh-settings-loading">
				<div className="spinner is-active"></div>
				<p>{__('در حال بارگذاری تنظیمات...', 'tabesh-v2')}</p>
			</div>
		);
	}

	return (
		<div className="tabesh-auth-settings">
			<div className="tabesh-settings-header">
				<h2>{__('تنظیمات صفحه ورود و ثبت‌نام', 'tabesh-v2')}</h2>
				<p>{__('ظاهر و رفتار فرم ورود و ثبت‌نام را سفارشی کنید', 'tabesh-v2')}</p>
			</div>

			{message.text && (
				<Notice
					status={message.type}
					isDismissible
					onRemove={() => setMessage({ text: '', type: '' })}
				>
					{message.text}
				</Notice>
			)}

			<div className="tabesh-settings-grid">
				{/* Preview Panel */}
				<div className="tabesh-settings-preview">
					<h3>{__('پیش‌نمایش', 'tabesh-v2')}</h3>
					<div 
						className="auth-preview" 
						style={{
							background: `linear-gradient(135deg, ${settings.backgroundColor} 0%, ${settings.secondaryBackgroundColor} 100%)`
						}}
					>
						<div 
							className="auth-card-preview"
							style={{
								maxWidth: `${settings.cardWidth}px`,
								padding: `${settings.cardPadding}px`,
								borderRadius: `${settings.borderRadius}px`
							}}
						>
							<div className="brand-preview">
								{settings.logoUrl ? (
									<img src={settings.logoUrl} alt="Logo" className="logo-preview" />
								) : (
									<div 
										className="logo-icon-preview"
										style={{
											background: settings.primaryColor,
											borderRadius: `${settings.borderRadius * 0.75}px`
										}}
									>
										<svg viewBox="0 0 24 24" fill="white">
											<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
										</svg>
									</div>
								)}
								<h4>{settings.brandTitle}</h4>
								<p>{settings.brandSubtitle}</p>
							</div>
							<div className="form-preview">
								<div className="input-preview"></div>
								<button 
									className="button-preview"
									style={{
										background: settings.primaryColor,
										borderRadius: `${settings.borderRadius * 0.75}px`
									}}
								>
									{__('دریافت کد تأیید', 'tabesh-v2')}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Settings Panels */}
				<div className="tabesh-settings-panels">
					<Panel>
						<PanelBody title={__('انتخاب قالب', 'tabesh-v2')} initialOpen={true}>
							<PanelRow>
								<SelectControl
									label={__('قالب صفحه ورود', 'tabesh-v2')}
									value={settings.template}
									onChange={(value) => updateSetting('template', value)}
									options={[
										{ label: __('مینیمال (پیش‌فرض)', 'tabesh-v2'), value: 'minimal' },
										{ label: __('صفحه تقسیم شده (Split Screen)', 'tabesh-v2'), value: 'split' },
										{ label: __('پس‌زمینه تمام صفحه (Full Background)', 'tabesh-v2'), value: 'fullBg' },
										{ label: __('گرادیان متحرک (Gradient Motion)', 'tabesh-v2'), value: 'gradient' },
									]}
									help={__('نوع چیدمان صفحه ورود - هر قالب ویژگی‌های منحصر به فرد دارد', 'tabesh-v2')}
								/>
							</PanelRow>
							
							{/* Background Type Selection */}
							<PanelRow>
								<SelectControl
									label={__('نوع پس‌زمینه', 'tabesh-v2')}
									value={settings.backgroundType || 'gradient'}
									onChange={(value) => updateSetting('backgroundType', value)}
									options={[
										{ label: __('گرادیان (Gradient)', 'tabesh-v2'), value: 'gradient' },
										{ label: __('تصویر (Image)', 'tabesh-v2'), value: 'image' },
										{ label: __('رنگ ساده (Solid)', 'tabesh-v2'), value: 'solid' },
									]}
									help={__('نوع پس‌زمینه صفحه ورود', 'tabesh-v2')}
								/>
							</PanelRow>

							{/* Banner Settings for Split Template */}
							{settings.template === 'split' && (
								<>
									<PanelRow>
										<ToggleControl
											label={__('نمایش بنر در دسکتاپ', 'tabesh-v2')}
											checked={settings.desktopBannerEnabled !== false}
											onChange={(value) => updateSetting('desktopBannerEnabled', value)}
											help={__('فعال‌سازی بنر یا اسلایدر در کنار فرم', 'tabesh-v2')}
										/>
									</PanelRow>
									
									{settings.desktopBannerEnabled && (
										<>
											<PanelRow>
												<SelectControl
													label={__('موقعیت بنر', 'tabesh-v2')}
													value={settings.desktopBannerPosition || 'left'}
													onChange={(value) => updateSetting('desktopBannerPosition', value)}
													options={[
														{ label: __('سمت چپ', 'tabesh-v2'), value: 'left' },
														{ label: __('سمت راست', 'tabesh-v2'), value: 'right' },
													]}
												/>
											</PanelRow>
											
											<PanelRow>
												<TextControl
													label={__('آدرس تصویر بنر', 'tabesh-v2')}
													value={settings.desktopBannerUrl || ''}
													onChange={(value) => updateSetting('desktopBannerUrl', value)}
													help={__('آدرس تصویر برای نمایش در کنار فرم (اندازه پیشنهادی: 800x1200)', 'tabesh-v2')}
												/>
											</PanelRow>
											
											<PanelRow>
												<TextControl
													label={__('شورتکد اسلایدر', 'tabesh-v2')}
													value={settings.desktopSliderShortcode || ''}
													onChange={(value) => updateSetting('desktopSliderShortcode', value)}
													help={__('شورتکد اسلایدر (مثلاً Revolution Slider) به جای تصویر ثابت', 'tabesh-v2')}
												/>
											</PanelRow>
										</>
									)}
								</>
							)}

							{/* Background Image Settings */}
							{settings.backgroundType === 'image' && (
								<>
									<PanelRow>
										<TextControl
											label={__('آدرس تصویر پس‌زمینه', 'tabesh-v2')}
											value={settings.backgroundImageUrl || ''}
											onChange={(value) => updateSetting('backgroundImageUrl', value)}
											help={__('آدرس تصویر پس‌زمینه تمام صفحه', 'tabesh-v2')}
										/>
									</PanelRow>
									
									<PanelRow>
										<RangeControl
											label={__('شفافیت لایه روی تصویر', 'tabesh-v2')}
											value={settings.backgroundOverlayOpacity || 0.5}
											onChange={(value) => updateSetting('backgroundOverlayOpacity', value)}
											min={0}
											max={1}
											step={0.1}
											help={__('میزان تیرگی لایه روی تصویر پس‌زمینه (0 = شفاف، 1 = کاملاً تیره)', 'tabesh-v2')}
										/>
									</PanelRow>
								</>
							)}
							
							{/* Glassmorphism Settings for fullBg Template */}
							{settings.template === 'fullBg' && (
								<>
									<PanelRow>
										<ToggleControl
											label={__('افکت شیشه‌ای (Glassmorphism)', 'tabesh-v2')}
											checked={settings.glassEffect !== false}
											onChange={(value) => updateSetting('glassEffect', value)}
											help={__('افکت شیشه‌ای شفاف برای کارت ورود', 'tabesh-v2')}
										/>
									</PanelRow>
									
									{settings.glassEffect !== false && (
										<>
											<PanelRow>
												<RangeControl
													label={__('میزان تاری (Blur)', 'tabesh-v2')}
													value={settings.glassBlur || 20}
													onChange={(value) => updateSetting('glassBlur', value)}
													min={0}
													max={50}
													step={5}
													help={__('میزان تاری پس‌زمینه شیشه (0-50px)', 'tabesh-v2')}
												/>
											</PanelRow>
											
											<PanelRow>
												<RangeControl
													label={__('شفافیت شیشه', 'tabesh-v2')}
													value={settings.glassOpacity || 0.95}
													onChange={(value) => updateSetting('glassOpacity', value)}
													min={0.5}
													max={1}
													step={0.05}
													help={__('شفافیت کارت شیشه‌ای (0.5-1)', 'tabesh-v2')}
												/>
											</PanelRow>
										</>
									)}
								</>
							)}
						</PanelBody>

						<PanelBody title={__('انیمیشن‌ها', 'tabesh-v2')}>
							<PanelRow>
								<ToggleControl
									label={__('فعال‌سازی انیمیشن‌ها', 'tabesh-v2')}
									checked={settings.animationEnabled !== false}
									onChange={(value) => updateSetting('animationEnabled', value)}
									help={__('انیمیشن‌های ورود و خروج فرم', 'tabesh-v2')}
								/>
							</PanelRow>

							{settings.animationEnabled !== false && (
								<>
									<PanelRow>
										<SelectControl
											label={__('انیمیشن کارت ورود', 'tabesh-v2')}
											value={settings.formAnimation || 'slideUp'}
											onChange={(value) => updateSetting('formAnimation', value)}
											options={[
												{ label: __('اسلاید به بالا (Slide Up)', 'tabesh-v2'), value: 'slideUp' },
												{ label: __('محو شدن (Fade)', 'tabesh-v2'), value: 'fade' },
												{ label: __('چرخش کارت (Flip)', 'tabesh-v2'), value: 'flip' },
												{ label: __('زوم (Zoom)', 'tabesh-v2'), value: 'zoom' },
												{ label: __('اسلاید (Slide)', 'tabesh-v2'), value: 'slide' },
											]}
											help={__('انیمیشن هنگام نمایش اولیه کارت', 'tabesh-v2')}
										/>
									</PanelRow>
									
									<PanelRow>
										<SelectControl
											label={__('انیمیشن تغییر مراحل', 'tabesh-v2')}
											value={settings.transitionAnimation || 'flip'}
											onChange={(value) => updateSetting('transitionAnimation', value)}
											options={[
												{ label: __('چرخش (Flip)', 'tabesh-v2'), value: 'flip' },
												{ label: __('اسلاید (Slide)', 'tabesh-v2'), value: 'slide' },
												{ label: __('محو شدن (Fade)', 'tabesh-v2'), value: 'fade' },
												{ label: __('زوم (Zoom)', 'tabesh-v2'), value: 'zoom' },
											]}
											help={__('انیمیشن هنگام تغییر از موبایل به OTP یا ثبت‌نام', 'tabesh-v2')}
										/>
									</PanelRow>
								</>
							)}
						</PanelBody>

						<PanelBody title={__('ظاهر و رنگ‌بندی', 'tabesh-v2')}>
							<PanelRow>
								<div className="tabesh-color-control">
									<label>{__('رنگ اصلی', 'tabesh-v2')}</label>
									<ColorPicker
										color={settings.primaryColor}
										onChangeComplete={(color) => updateSetting('primaryColor', color.hex)}
										disableAlpha
									/>
								</div>
							</PanelRow>

							<PanelRow>
								<div className="tabesh-color-control">
									<label>{__('رنگ پس‌زمینه (شروع)', 'tabesh-v2')}</label>
									<ColorPicker
										color={settings.backgroundColor}
										onChangeComplete={(color) => updateSetting('backgroundColor', color.hex)}
										disableAlpha
									/>
								</div>
							</PanelRow>

							<PanelRow>
								<div className="tabesh-color-control">
									<label>{__('رنگ پس‌زمینه (پایان)', 'tabesh-v2')}</label>
									<ColorPicker
										color={settings.secondaryBackgroundColor}
										onChangeComplete={(color) => updateSetting('secondaryBackgroundColor', color.hex)}
										disableAlpha
									/>
								</div>
							</PanelRow>

							<PanelRow>
								<TextControl
									label={__('آدرس لوگو (URL)', 'tabesh-v2')}
									value={settings.logoUrl}
									onChange={(value) => updateSetting('logoUrl', value)}
									help={__('لوگوی سفارشی برای صفحه ورود', 'tabesh-v2')}
								/>
							</PanelRow>
						</PanelBody>

						<PanelBody title={__('برند و متن', 'tabesh-v2')}>
							<PanelRow>
								<TextControl
									label={__('عنوان', 'tabesh-v2')}
									value={settings.brandTitle}
									onChange={(value) => updateSetting('brandTitle', value)}
								/>
							</PanelRow>

							<PanelRow>
								<TextControl
									label={__('زیرعنوان', 'tabesh-v2')}
									value={settings.brandSubtitle}
									onChange={(value) => updateSetting('brandSubtitle', value)}
								/>
							</PanelRow>
						</PanelBody>

						<PanelBody title={__('طراحی و اندازه', 'tabesh-v2')}>
							<PanelRow>
								<RangeControl
									label={__('عرض کارت (پیکسل)', 'tabesh-v2')}
									value={settings.cardWidth}
									onChange={(value) => updateSetting('cardWidth', value)}
									min={320}
									max={800}
									step={10}
								/>
							</PanelRow>

							<PanelRow>
								<RangeControl
									label={__('فضای داخلی (پیکسل)', 'tabesh-v2')}
									value={settings.cardPadding}
									onChange={(value) => updateSetting('cardPadding', value)}
									min={16}
									max={80}
									step={4}
								/>
							</PanelRow>

							<PanelRow>
								<RangeControl
									label={__('شعاع گوشه (پیکسل)', 'tabesh-v2')}
									value={settings.borderRadius}
									onChange={(value) => updateSetting('borderRadius', value)}
									min={0}
									max={32}
									step={2}
								/>
							</PanelRow>
						</PanelBody>

						<PanelBody title={__('تنظیمات OTP', 'tabesh-v2')}>
							<PanelRow>
								<SelectControl
									label={__('تعداد ارقام کد', 'tabesh-v2')}
									value={settings.otp_length}
									onChange={(value) => updateSetting('otp_length', parseInt(value))}
									options={[
										{ label: '4', value: 4 },
										{ label: '5', value: 5 },
										{ label: '6', value: 6 },
									]}
								/>
							</PanelRow>

							<PanelRow>
								<RangeControl
									label={__('مدت اعتبار (ثانیه)', 'tabesh-v2')}
									value={settings.otp_expiry}
									onChange={(value) => updateSetting('otp_expiry', value)}
									min={60}
									max={600}
									step={30}
								/>
							</PanelRow>

							<PanelRow>
								<ToggleControl
									label={__('تأیید خودکار کد', 'tabesh-v2')}
									checked={settings.autoSubmitOtp}
									onChange={(value) => updateSetting('autoSubmitOtp', value)}
									help={__('پس از وارد کردن تمام ارقام، کد به صورت خودکار ارسال شود', 'tabesh-v2')}
								/>
							</PanelRow>
						</PanelBody>

						<PanelBody title={__('تنظیمات ثبت‌نام', 'tabesh-v2')}>
							<PanelRow>
								<ToggleControl
									label={__('ایجاد خودکار کاربر', 'tabesh-v2')}
									checked={settings.auto_create_user}
									onChange={(value) => updateSetting('auto_create_user', value)}
									help={__('کاربران جدید به صورت خودکار ثبت‌نام شوند', 'tabesh-v2')}
								/>
							</PanelRow>

							<PanelRow>
								<ToggleControl
									label={__('نام و نام خانوادگی اجباری', 'tabesh-v2')}
									checked={settings.require_name}
									onChange={(value) => updateSetting('require_name', value)}
								/>
							</PanelRow>

							<PanelRow>
								<ToggleControl
									label={__('فعال‌سازی ثبت‌نام حقوقی', 'tabesh-v2')}
									checked={settings.allow_corporate}
									onChange={(value) => updateSetting('allow_corporate', value)}
									help={__('امکان ثبت‌نام به عنوان شخص حقوقی', 'tabesh-v2')}
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="tabesh-settings-actions">
				<Button
					isPrimary
					isBusy={saving}
					disabled={saving || loading}
					onClick={handleSave}
				>
					{saving ? __('در حال ذخیره...', 'tabesh-v2') : __('ذخیره تغییرات', 'tabesh-v2')}
				</Button>

				<Button
					isSecondary
					disabled={saving || loading}
					onClick={loadSettings}
				>
					{__('بازنشانی', 'tabesh-v2')}
				</Button>

				<Button
					isTertiary
					isDestructive
					disabled={saving || loading}
					onClick={handleReset}
				>
					{__('بازگشت به پیش‌فرض', 'tabesh-v2')}
				</Button>
			</div>
		</div>
	);
};

export default AuthSettingsTab;
