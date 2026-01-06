import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UserDashboardSettings from '../components/UserDashboardSettings';
import AuthSettingsTab from '../components/auth/AuthSettingsTab';
import LoadingSpinner from '../components/LoadingSpinner';
import TabPanel from '../components/TabPanel';

/**
 * User Dashboard Admin Panel Component.
 *
 * Main component for the "داشبورد کاربران" admin menu page.
 * Includes dashboard settings, auth settings, and login/registration customization.
 */
const UserDashboardPanel = () => {
	const [ settings, setSettings ] = useState( null );
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

	const handleSave = async () => {
		setSaving( true );
		setMessage( '' );
		try {
			await apiFetch( {
				path: '/tabesh/v2/settings',
				method: 'POST',
				data: settings,
			} );
			setMessage( __( 'تنظیمات با موفقیت ذخیره شد.', 'tabesh-v2' ) );
			setMessageType( 'success' );
		} catch ( error ) {
			setMessage(
				__( 'خطا در ذخیره تنظیمات: ', 'tabesh-v2' ) +
					error.message
			);
			setMessageType( 'error' );
		} finally {
			setSaving( false );
		}
	};

	if ( loading ) {
		return <LoadingSpinner />;
	}

	const tabs = [
		{
			id: 'dashboard',
			title: __( 'تنظیمات داشبورد', 'tabesh-v2' ),
			content: (
				<UserDashboardSettings
					settings={ settings }
					onChange={ setSettings }
				/>
			),
		},
		{
			id: 'auth-appearance',
			title: __( 'ظاهر صفحه ورود', 'tabesh-v2' ),
			content: <AuthSettingsTab />,
		},
	];

	return (
		<div className="wrap tabesh-user-dashboard-panel">
			<h1>{ __( 'داشبورد کاربران', 'tabesh-v2' ) }</h1>
			<p className="description">
				{ __(
					'تنظیمات و پیکربندی داشبورد کاربران، ورود و ثبت‌نام با OTP و سفارشی‌سازی ظاهر صفحه ورود',
					'tabesh-v2'
				) }
			</p>

			{ message && (
				<div
					className={ `notice notice-${ messageType } is-dismissible` }
					style={{ marginTop: '15px' }}
				>
					<p>{ message }</p>
				</div>
			) }

			<div className="tabesh-settings-container" style={{ marginTop: '20px' }}>
				<TabPanel tabs={ tabs } />

				<div className="tabesh-settings-actions" style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
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
						style={{ marginRight: '10px' }}
					>
						{ __( 'بازنشانی', 'tabesh-v2' ) }
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserDashboardPanel;
