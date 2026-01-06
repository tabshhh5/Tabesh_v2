import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import TabPanel from '../components/TabPanel';
import AISettingsTab from '../components/AISettingsTab';
import ProductParametersTab from '../components/ProductParametersTab';
import PricingSettingsTab from '../components/PricingSettingsTab';
import SMSSettingsTab from '../components/SMSSettingsTab';
import LoadingSpinner from '../components/LoadingSpinner';
import {
	FirewallSettingsTab,
	FileSettingsTab,
	AccessLevelSettingsTab,
	ImportExportSettingsTab,
} from '../components/AdditionalSettingsTabs';

/**
 * Settings Panel Component - Super Configuration Panel.
 */
const SettingsPanel = () => {
	const [ settings, setSettings ] = useState( {} );
	const [ loading, setLoading ] = useState( true );
	const [ saving, setSaving ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ messageType, setMessageType ] = useState( 'success' );

	useEffect( () => {
		loadSettings();
	}, [] );

	const loadSettings = async () => {
		try {
			const response = await apiFetch( {
				path: '/tabesh/v2/settings',
			} );
			setSettings( response );
			setLoading( false );
		} catch ( error ) {
			console.error( 'Error loading settings:', error );
			setLoading( false );
		}
	};

	const handleSettingsChange = ( newSettings ) => {
		setSettings( newSettings );
	};

	const handleSave = async () => {
		setSaving( true );
		setMessage( '' );

		try {
			await apiFetch( {
				path: '/tabesh/v2/settings',
				method: 'POST',
				data: settings,
			} );
			setMessage( __( 'تنظیمات با موفقیت ذخیره شد!', 'tabesh-v2' ) );
			setMessageType( 'success' );
			setSaving( false );
		} catch ( error ) {
			console.error( 'Error saving settings:', error );
			setMessage( __( 'خطا در ذخیره تنظیمات.', 'tabesh-v2' ) );
			setMessageType( 'error' );
			setSaving( false );
		}
	};

	if ( loading ) {
		return (
			<div className="tabesh-v2-app">
				<LoadingSpinner
					message={ __( 'در حال بارگذاری تنظیمات...', 'tabesh-v2' ) }
					size="large"
				/>
			</div>
		);
	}

	const tabs = [
		{
			id: 'ai',
			title: __( 'تنظیمات هوش مصنوعی', 'tabesh-v2' ),
			content: (
				<AISettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'products',
			title: __( 'پارامترهای محصولات', 'tabesh-v2' ),
			content: (
				<ProductParametersTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'pricing',
			title: __( 'قیمت‌گذاری', 'tabesh-v2' ),
			content: (
				<PricingSettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'sms',
			title: __( 'تنظیمات پیامک', 'tabesh-v2' ),
			content: (
				<SMSSettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'firewall',
			title: __( 'تنظیمات فایروال', 'tabesh-v2' ),
			content: (
				<FirewallSettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'file',
			title: __( 'تنظیمات فایل', 'tabesh-v2' ),
			content: (
				<FileSettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'access',
			title: __( 'سطح دسترسی', 'tabesh-v2' ),
			content: (
				<AccessLevelSettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
		{
			id: 'import_export',
			title: __( 'برون‌ریزی و درون‌ریزی', 'tabesh-v2' ),
			content: (
				<ImportExportSettingsTab
					settings={ settings }
					onChange={ handleSettingsChange }
				/>
			),
		},
	];

	return (
		<div className="tabesh-v2-app tabesh-settings-panel">
			<div className="settings-header">
				<h1>{ __( 'پنل پیکربندی تابش', 'tabesh-v2' ) }</h1>
				<p className="description">
					{ __(
						'تنظیمات جامع افزونه مدیریت سفارشات چاپ',
						'tabesh-v2'
					) }
				</p>
			</div>

			{ message && (
				<div
					className={ `notice notice-${ messageType } is-dismissible` }
				>
					<p>{ message }</p>
				</div>
			) }

			<div className="settings-content">
				<TabPanel tabs={ tabs } />
			</div>

			<div className="settings-footer">
				<button
					type="button"
					className="button button-primary button-large"
					onClick={ handleSave }
					disabled={ saving }
				>
					{ saving
						? __( 'در حال ذخیره...', 'tabesh-v2' )
						: __( 'ذخیره تنظیمات', 'tabesh-v2' ) }
				</button>
				<button
					type="button"
					className="button button-secondary button-large"
					onClick={ loadSettings }
					disabled={ saving }
				>
					{ __( 'بازنشانی', 'tabesh-v2' ) }
				</button>
			</div>
		</div>
	);
};

export default SettingsPanel;
