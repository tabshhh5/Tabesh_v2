import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Settings Panel Component.
 */
const SettingsPanel = () => {
	const [settings, setSettings] = useState({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const response = await apiFetch({
				path: '/tabesh/v2/settings',
			});
			setSettings(response);
			setLoading(false);
		} catch (error) {
			console.error('Error loading settings:', error);
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSettings({
			...settings,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage('');

		try {
			await apiFetch({
				path: '/tabesh/v2/settings',
				method: 'POST',
				data: settings,
			});
			setMessage(__('Settings saved successfully!', 'tabesh-v2'));
			setSaving(false);
		} catch (error) {
			console.error('Error saving settings:', error);
			setMessage(__('Error saving settings.', 'tabesh-v2'));
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="tabesh-v2-app">
				<div className="loading">{__('Loading...', 'tabesh-v2')}</div>
			</div>
		);
	}

	return (
		<div className="tabesh-v2-app">
			<h1>{__('Settings', 'tabesh-v2')}</h1>
			<div className="card">
				<h2>{__('Plugin Settings', 'tabesh-v2')}</h2>
				{message && <div className="success">{message}</div>}
				<form onSubmit={handleSave}>
					<div className="form-group">
						<label htmlFor="currency">
							{__('Currency', 'tabesh-v2')}
						</label>
						<input
							type="text"
							id="currency"
							name="currency"
							value={settings.currency || ''}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="orders_per_page">
							{__('Orders Per Page', 'tabesh-v2')}
						</label>
						<input
							type="number"
							id="orders_per_page"
							name="orders_per_page"
							value={settings.orders_per_page || 20}
							onChange={handleChange}
						/>
					</div>
					<button
						type="submit"
						className="button-primary"
						disabled={saving}
					>
						{saving
							? __('Saving...', 'tabesh-v2')
							: __('Save Settings', 'tabesh-v2')}
					</button>
				</form>
			</div>
		</div>
	);
};

export default SettingsPanel;
