import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, TextControl, Card, CardHeader, CardBody, Notice } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const OTPSettingsTab = () => {
	const [settings, setSettings] = useState({
		melipayamak: {
			username: '',
			password: '',
			sender: '',
			body_id: '',
		},
		otp: {
			length: 6,
			validity: 5,
			max_attempts: 5,
			rate_limit_max: 3,
			rate_limit_window: 60,
			min_interval: 120,
		},
		panel: {
			url: 'panel',
			redirect_woocommerce: true,
			redirect_wordpress: false,
		},
	});

	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const data = await apiFetch({ path: '/tabesh/v2/settings' });
			if (data) {
				setSettings({
					melipayamak: data.melipayamak || settings.melipayamak,
					otp: data.otp || settings.otp,
					panel: data.panel || settings.panel,
				});
			}
		} catch (err) {
			console.error('Failed to load settings:', err);
			setError(__('Failed to load settings. Please refresh the page and try again.', 'tabesh-v2'));
		}
	};

	const handleSave = async () => {
		setSaving(true);
		setSaved(false);
		setError(null);

		try {
			const currentSettings = await apiFetch({ path: '/tabesh/v2/settings' });
			const updatedSettings = {
				...currentSettings,
				melipayamak: settings.melipayamak,
				otp: settings.otp,
				panel: settings.panel,
			};

			await apiFetch({
				path: '/tabesh/v2/settings',
				method: 'POST',
				data: updatedSettings,
			});

			setSaved(true);
			setTimeout(() => setSaved(false), 3000);
		} catch (err) {
			setError(err.message || __('Failed to save settings', 'tabesh-v2'));
		} finally {
			setSaving(false);
		}
	};

	const updateMelipayamak = (key, value) => {
		setSettings({
			...settings,
			melipayamak: {
				...settings.melipayamak,
				[key]: value,
			},
		});
	};

	const updateOTP = (key, value) => {
		setSettings({
			...settings,
			otp: {
				...settings.otp,
				[key]: value,
			},
		});
	};

	const updatePanel = (key, value) => {
		setSettings({
			...settings,
			panel: {
				...settings.panel,
				[key]: value,
			},
		});
	};

	return (
		<div className="tabesh-otp-settings">
			{saved && (
				<Notice status="success" isDismissible={false}>
					{__('Settings saved successfully!', 'tabesh-v2')}
				</Notice>
			)}

			{error && (
				<Notice status="error" isDismissible={false}>
					{error}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<h2>{__('Melipayamak API Settings', 'tabesh-v2')}</h2>
				</CardHeader>
				<CardBody>
					<p className="description">
						{__('Configure Melipayamak API for sending OTP codes via SMS. Get your credentials from https://www.melipayamak.com/', 'tabesh-v2')}
					</p>

					<TextControl
						label={__('API Username', 'tabesh-v2')}
						value={settings.melipayamak.username}
						onChange={(value) => updateMelipayamak('username', value)}
						placeholder="09123456789"
					/>

					<TextControl
						label={__('API Password', 'tabesh-v2')}
						type="password"
						value={settings.melipayamak.password}
						onChange={(value) => updateMelipayamak('password', value)}
					/>

					<TextControl
						label={__('Sender Number', 'tabesh-v2')}
						value={settings.melipayamak.sender}
						onChange={(value) => updateMelipayamak('sender', value)}
						help={__('The number that will appear as the sender', 'tabesh-v2')}
					/>

					<TextControl
						label={__('Body ID (Pattern ID)', 'tabesh-v2')}
						value={settings.melipayamak.body_id}
						onChange={(value) => updateMelipayamak('body_id', value)}
						help={__('Your pattern ID from Melipayamak panel for OTP messages', 'tabesh-v2')}
					/>
				</CardBody>
			</Card>

			<Card style={{ marginTop: '20px' }}>
				<CardHeader>
					<h2>{__('OTP Configuration', 'tabesh-v2')}</h2>
				</CardHeader>
				<CardBody>
					<TextControl
						label={__('OTP Length', 'tabesh-v2')}
						type="number"
						value={settings.otp.length}
						onChange={(value) => updateOTP('length', parseInt(value) || 6)}
						min={4}
						max={8}
						help={__('Number of digits in OTP code (4-8)', 'tabesh-v2')}
					/>

					<TextControl
						label={__('OTP Validity (minutes)', 'tabesh-v2')}
						type="number"
						value={settings.otp.validity}
						onChange={(value) => updateOTP('validity', parseInt(value) || 5)}
						min={1}
						max={15}
						help={__('How long the OTP code remains valid', 'tabesh-v2')}
					/>

					<TextControl
						label={__('Max Verification Attempts', 'tabesh-v2')}
						type="number"
						value={settings.otp.max_attempts}
						onChange={(value) => updateOTP('max_attempts', parseInt(value) || 5)}
						min={3}
						max={10}
						help={__('Maximum wrong attempts before requesting new OTP', 'tabesh-v2')}
					/>

					<TextControl
						label={__('Rate Limit - Max Requests', 'tabesh-v2')}
						type="number"
						value={settings.otp.rate_limit_max}
						onChange={(value) => updateOTP('rate_limit_max', parseInt(value) || 3)}
						min={1}
						max={10}
						help={__('Maximum OTP requests per time window', 'tabesh-v2')}
					/>

					<TextControl
						label={__('Rate Limit - Time Window (seconds)', 'tabesh-v2')}
						type="number"
						value={settings.otp.rate_limit_window}
						onChange={(value) => updateOTP('rate_limit_window', parseInt(value) || 60)}
						min={30}
						max={300}
						help={__('Time window for rate limiting', 'tabesh-v2')}
					/>

					<TextControl
						label={__('Minimum Interval Between Requests (seconds)', 'tabesh-v2')}
						type="number"
						value={settings.otp.min_interval}
						onChange={(value) => updateOTP('min_interval', parseInt(value) || 120)}
						min={60}
						max={300}
						help={__('Minimum time between OTP requests for same number', 'tabesh-v2')}
					/>
				</CardBody>
			</Card>

			<Card style={{ marginTop: '20px' }}>
				<CardHeader>
					<h2>{__('Panel Configuration', 'tabesh-v2')}</h2>
				</CardHeader>
				<CardBody>
					<TextControl
						label={__('Panel URL', 'tabesh-v2')}
						value={settings.panel.url}
						onChange={(value) => updatePanel('url', value)}
						help={__('The URL slug for the user panel (e.g., "panel" for /panel)', 'tabesh-v2')}
					/>

					<p className="description" style={{ marginTop: '10px' }}>
						{__('After saving, flush rewrite rules by going to Settings > Permalinks and clicking Save.', 'tabesh-v2')}
					</p>
				</CardBody>
			</Card>

			<div style={{ marginTop: '20px' }}>
				<Button
					isPrimary
					onClick={handleSave}
					isBusy={saving}
					disabled={saving}
				>
					{saving ? __('Saving...', 'tabesh-v2') : __('Save Settings', 'tabesh-v2')}
				</Button>
			</div>
		</div>
	);
};

export default OTPSettingsTab;
