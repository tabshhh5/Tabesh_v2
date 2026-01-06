import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	FormGroup,
	TextInput,
	Checkbox,
	Section,
} from './FormComponents';

/**
 * User Dashboard Settings Component.
 *
 * @param {Object} props Component props
 * @param {Object} props.settings Current settings
 * @param {Function} props.onChange Settings change handler
 */
const UserDashboardSettings = ( { settings, onChange } ) => {
	const [ dashboardSettings, setDashboardSettings ] = useState(
		settings.user_dashboard || {}
	);
	const [ authSettings, setAuthSettings ] = useState(
		settings.auth || {}
	);
	const [ testMobile, setTestMobile ] = useState( '' );
	const [ testing, setTesting ] = useState( false );
	const [ creating, setCreating ] = useState( false );

	// Update parent when local state changes.
	useEffect( () => {
		onChange( {
			...settings,
			user_dashboard: dashboardSettings,
			auth: authSettings,
		} );
	}, [ dashboardSettings, authSettings ] );

	const handleDashboardChange = ( field, value ) => {
		setDashboardSettings( {
			...dashboardSettings,
			[ field ]: value,
		} );
	};

	const handleAuthChange = ( field, value ) => {
		setAuthSettings( {
			...authSettings,
			[ field ]: value,
		} );
	};

	const handleMelipayamakChange = ( field, value ) => {
		setAuthSettings( {
			...authSettings,
			melipayamak: {
				...( authSettings.melipayamak || {} ),
				[ field ]: value,
			},
		} );
	};

	const handleMenuItemChange = ( index, field, value ) => {
		const items = [ ...( dashboardSettings.menu_items || [] ) ];
		items[ index ] = {
			...items[ index ],
			[ field ]: value,
		};
		handleDashboardChange( 'menu_items', items );
	};

	const handleTestSms = async () => {
		if ( ! testMobile ) {
			alert( __( 'لطفاً شماره موبایل را وارد کنید.', 'tabesh-v2' ) );
			return;
		}

		setTesting( true );
		try {
			const response = await apiFetch( {
				path: '/tabesh/v2/auth/test-sms',
				method: 'POST',
				data: {
					mobile: testMobile,
				},
			} );

			if ( response.success ) {
				alert( response.message );
			} else {
				alert(
					__( 'خطا در ارسال پیامک: ', 'tabesh-v2' ) +
						response.message
				);
			}
		} catch ( error ) {
			alert(
				__( 'خطا در ارتباط با سرور: ', 'tabesh-v2' ) +
					error.message
			);
		} finally {
			setTesting( false );
		}
	};

	const handleCreatePage = async () => {
		setCreating( true );
		try {
			const response = await apiFetch( {
				path: '/tabesh/v2/dashboard/create-page',
				method: 'POST',
				data: {
					slug: dashboardSettings.page_slug || 'panel',
				},
			} );

			if ( response.success ) {
				alert(
					response.message +
						'\n' +
						__( 'آدرس صفحه: ', 'tabesh-v2' ) +
						response.url
				);
				handleDashboardChange( 'dashboard_page_id', response.page_id );
			} else {
				alert(
					__( 'خطا در ایجاد صفحه: ', 'tabesh-v2' ) +
						response.message
				);
			}
		} catch ( error ) {
			alert(
				__( 'خطا در ارتباط با سرور: ', 'tabesh-v2' ) +
					error.message
			);
		} finally {
			setCreating( false );
		}
	};

	const melipayamak = authSettings.melipayamak || {};

	return (
		<div className="user-dashboard-settings">
			<Section
				title={ __( 'تنظیمات صفحه داشبورد', 'tabesh-v2' ) }
				description={ __(
					'پیکربندی صفحه داشبورد کاربران',
					'tabesh-v2'
				) }
			>
				<FormGroup>
					<Checkbox
						checked={ dashboardSettings.enabled }
						onChange={ ( e ) =>
							handleDashboardChange( 'enabled', e.target.checked )
						}
						label={ __( 'فعال‌سازی داشبورد کاربران', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'آدرس صفحه (Slug)', 'tabesh-v2' ) }
					description={ __(
						'آدرس صفحه داشبورد بدون / (مثال: panel)',
						'tabesh-v2'
					) }
				>
					<TextInput
						value={ dashboardSettings.page_slug || 'panel' }
						onChange={ ( e ) =>
							handleDashboardChange( 'page_slug', e.target.value )
						}
						placeholder="panel"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'باز سازی صفحه داشبورد', 'tabesh-v2' ) }
					description={ __(
						'در صورتی که صفحه داشبورد به درستی ایجاد نشده است، با کلیک روی این دکمه صفحه جدید ایجاد می‌شود.',
						'tabesh-v2'
					) }
				>
					<button
						type="button"
						className="button button-secondary"
						onClick={ handleCreatePage }
						disabled={ creating }
					>
						{ creating
							? __( 'در حال ایجاد...', 'tabesh-v2' )
							: __( 'ایجاد/باز سازی صفحه', 'tabesh-v2' ) }
					</button>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'مدیریت منوهای داشبورد', 'tabesh-v2' ) }
				description={ __(
					'ترتیب، فعال/غیرفعال و مدیریت منوهای داشبورد کاربران',
					'tabesh-v2'
				) }
			>
				<div className="menu-items-list">
					{ ( dashboardSettings.menu_items || [] ).map(
						( item, index ) => (
							<div key={ item.id } className="menu-item-row">
								<div className="menu-item-handle">☰</div>
								<TextInput
									value={ item.label }
									onChange={ ( e ) =>
										handleMenuItemChange(
											index,
											'label',
											e.target.value
										)
									}
									placeholder={ __( 'عنوان منو', 'tabesh-v2' ) }
								/>
								<TextInput
									value={ item.icon }
									onChange={ ( e ) =>
										handleMenuItemChange(
											index,
											'icon',
											e.target.value
										)
									}
									placeholder={ __( 'آیکون', 'tabesh-v2' ) }
								/>
								<Checkbox
									checked={ item.enabled }
									onChange={ ( e ) =>
										handleMenuItemChange(
											index,
											'enabled',
											e.target.checked
										)
									}
									label={ __( 'فعال', 'tabesh-v2' ) }
								/>
							</div>
						)
					) }
				</div>
			</Section>

			<Section
				title={ __( 'تنظیمات احراز هویت OTP', 'tabesh-v2' ) }
				description={ __(
					'پیکربندی ورود و ثبت‌نام با رمز یکبار مصرف پیامکی',
					'tabesh-v2'
				) }
			>
				<FormGroup>
					<Checkbox
						checked={ authSettings.otp_enabled }
						onChange={ ( e ) =>
							handleAuthChange( 'otp_enabled', e.target.checked )
						}
						label={ __(
							'فعال‌سازی ورود/ثبت‌نام با OTP',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'طول کد OTP', 'tabesh-v2' ) }
					description={ __(
						'تعداد ارقام کد یکبار مصرف (پیشنهاد: 5)',
						'tabesh-v2'
					) }
				>
					<TextInput
						type="number"
						value={ authSettings.otp_length || 5 }
						onChange={ ( e ) =>
							handleAuthChange(
								'otp_length',
								parseInt( e.target.value, 10 )
							)
						}
						placeholder="5"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'زمان انقضا (ثانیه)', 'tabesh-v2' ) }
					description={ __(
						'مدت زمان اعتبار کد OTP به ثانیه (پیشنهاد: 120)',
						'tabesh-v2'
					) }
				>
					<TextInput
						type="number"
						value={ authSettings.otp_expiry || 120 }
						onChange={ ( e ) =>
							handleAuthChange(
								'otp_expiry',
								parseInt( e.target.value, 10 )
							)
						}
						placeholder="120"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						checked={ authSettings.replace_woocommerce }
						onChange={ ( e ) =>
							handleAuthChange(
								'replace_woocommerce',
								e.target.checked
							)
						}
						label={ __(
							'جایگزینی ورود ووکامرس با OTP',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						checked={ authSettings.require_name }
						onChange={ ( e ) =>
							handleAuthChange( 'require_name', e.target.checked )
						}
						label={ __(
							'درخواست نام و نام خانوادگی در ثبت‌نام',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						checked={ authSettings.allow_corporate }
						onChange={ ( e ) =>
							handleAuthChange(
								'allow_corporate',
								e.target.checked
							)
						}
						label={ __(
							'امکان ثبت‌نام شخص حقوقی',
							'tabesh-v2'
						) }
					/>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'تنظیمات ملی پیامک', 'tabesh-v2' ) }
				description={ __(
					'پیکربندی اتصال به سرویس ملی پیامک برای ارسال OTP',
					'tabesh-v2'
				) }
			>
				<FormGroup
					label={ __( 'نام کاربری پنل ملی پیامک', 'tabesh-v2' ) }
					description={ __(
						'نام کاربری دریافتی از پنل ملی پیامک',
						'tabesh-v2'
					) }
				>
					<TextInput
						value={ melipayamak.username || '' }
						onChange={ ( e ) =>
							handleMelipayamakChange(
								'username',
								e.target.value
							)
						}
						placeholder=""
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'رمز عبور پنل ملی پیامک', 'tabesh-v2' ) }
					description={ __(
						'رمز عبور دریافتی از پنل ملی پیامک',
						'tabesh-v2'
					) }
				>
					<TextInput
						type="password"
						value={ melipayamak.password || '' }
						onChange={ ( e ) =>
							handleMelipayamakChange(
								'password',
								e.target.value
							)
						}
						placeholder=""
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'شماره فرستنده (Base Number)', 'tabesh-v2' ) }
					description={ __(
						'شماره خط ارسال پیامک (معمولاً 10 رقمی)',
						'tabesh-v2'
					) }
				>
					<TextInput
						value={ melipayamak.sender_number || '' }
						onChange={ ( e ) =>
							handleMelipayamakChange(
								'sender_number',
								e.target.value
							)
						}
						placeholder="10000xxxxx"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'کد پترن (Pattern ID)', 'tabesh-v2' ) }
					description={ __(
						'شناسه الگوی پیامک (BodyId) برای ارسال OTP',
						'tabesh-v2'
					) }
				>
					<TextInput
						value={ melipayamak.pattern_id || '' }
						onChange={ ( e ) =>
							handleMelipayamakChange(
								'pattern_id',
								e.target.value
							)
						}
						placeholder="12345"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'تست اتصال', 'tabesh-v2' ) }
					description={ __(
						'برای تست اتصال و ارسال پیامک، شماره موبایل خود را وارد کنید.',
						'tabesh-v2'
					) }
				>
					<div style={ { display: 'flex', gap: '10px' } }>
						<TextInput
							value={ testMobile }
							onChange={ ( e ) =>
								setTestMobile( e.target.value )
							}
							placeholder="09xxxxxxxxx"
						/>
						<button
							type="button"
							className="button button-secondary"
							onClick={ handleTestSms }
							disabled={ testing }
						>
							{ testing
								? __( 'در حال ارسال...', 'tabesh-v2' )
								: __( 'ارسال پیامک آزمایشی', 'tabesh-v2' ) }
						</button>
					</div>
				</FormGroup>
			</Section>
		</div>
	);
};

export default UserDashboardSettings;
