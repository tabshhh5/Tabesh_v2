import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UserDashboardSettings from '../components/UserDashboardSettings';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * User Dashboard Admin Panel Component.
 *
 * Main component for the "داشبورد کاربران" admin menu page.
 */
const UserDashboardPanel = () => {
	const [ settings, setSettings ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ saving, setSaving ] = useState( false );

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
		try {
			await apiFetch( {
				path: '/tabesh/v2/settings',
				method: 'POST',
				data: settings,
			} );
			alert( __( 'تنظیمات با موفقیت ذخیره شد.', 'tabesh-v2' ) );
		} catch ( error ) {
			alert(
				__( 'خطا در ذخیره تنظیمات: ', 'tabesh-v2' ) +
					error.message
			);
		} finally {
			setSaving( false );
		}
	};

	if ( loading ) {
		return <LoadingSpinner />;
	}

	return (
		<div className="wrap tabesh-user-dashboard-panel">
			<h1>{ __( 'داشبورد کاربران', 'tabesh-v2' ) }</h1>
			<p className="description">
				{ __(
					'تنظیمات و پیکربندی داشبورد کاربران، ورود و ثبت‌نام با OTP',
					'tabesh-v2'
				) }
			</p>

			<div className="tabesh-settings-container">
				<UserDashboardSettings
					settings={ settings }
					onChange={ setSettings }
				/>

				<div className="tabesh-settings-actions">
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
				</div>
			</div>
		</div>
	);
};

export default UserDashboardPanel;
