import { __ } from '@wordpress/i18n';
import {
	FormGroup,
	TextInput,
	TextArea,
	Checkbox,
	Section,
} from '../components/FormComponents';

/**
 * SMS Settings Tab Component.
 *
 * @param {Object} props Component props
 * @param {Object} props.settings Current settings
 * @param {Function} props.onChange Settings change handler
 */
const SMSSettingsTab = ( { settings, onChange } ) => {
	const smsSettings = settings.sms || {};

	const handleChange = ( e ) => {
		const { name, value, type, checked } = e.target;
		onChange( {
			...settings,
			sms: {
				...smsSettings,
				[ name ]: type === 'checkbox' ? checked : value,
			},
		} );
	};

	return (
		<div className="sms-settings-tab">
			<Section
				title={ __( 'تنظیمات سرویس پیامک', 'tabesh-v2' ) }
				description={ __( 'پیکربندی سرویس ارسال پیامک', 'tabesh-v2' ) }
			>
				<FormGroup label={ __( 'فعال‌سازی', 'tabesh-v2' ) }>
					<Checkbox
						name="enabled"
						checked={ smsSettings.enabled }
						onChange={ handleChange }
						label={ __( 'سرویس پیامک فعال است', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'ارائه‌دهنده سرویس', 'tabesh-v2' ) }
					description={ __(
						'نام ارائه‌دهنده سرویس پیامک',
						'tabesh-v2'
					) }
				>
					<select
						name="provider"
						value={ smsSettings.provider || 'kavenegar' }
						onChange={ handleChange }
						className="regular-text"
					>
						<option value="kavenegar">
							{ __( 'کاوه‌نگار', 'tabesh-v2' ) }
						</option>
						<option value="farazsms">
							{ __( 'فراز اس‌ام‌اس', 'tabesh-v2' ) }
						</option>
						<option value="smsir">
							{ __( 'اس‌ام‌اس.آی‌آر', 'tabesh-v2' ) }
						</option>
						<option value="melipayamak">
							{ __( 'ملی پیامک', 'tabesh-v2' ) }
						</option>
						<option value="custom">
							{ __( 'سفارشی', 'tabesh-v2' ) }
						</option>
					</select>
				</FormGroup>

				<FormGroup
					label={ __( 'API Key', 'tabesh-v2' ) }
					description={ __(
						'کلید API دریافتی از سرویس پیامک',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="api_key"
						value={ smsSettings.api_key }
						onChange={ handleChange }
						type="password"
						placeholder=""
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'شماره ارسال‌کننده', 'tabesh-v2' ) }
					description={ __( 'شماره خط ارسال پیامک', 'tabesh-v2' ) }
				>
					<TextInput
						name="sender_number"
						value={ smsSettings.sender_number }
						onChange={ handleChange }
						placeholder="10000xxxxx"
					/>
				</FormGroup>

				<FormGroup
					label={ __(
						'URL وب‌سرویس (برای سرویس سفارشی)',
						'tabesh-v2'
					) }
					description={ __(
						'آدرس API در صورت استفاده از سرویس سفارشی',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="api_url"
						value={ smsSettings.api_url }
						onChange={ handleChange }
						placeholder="https://"
					/>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'قالب پیام‌های خودکار', 'tabesh-v2' ) }
				description={ __(
					'قالب پیامک‌های ارسالی به مشتریان',
					'tabesh-v2'
				) }
			>
				<FormGroup>
					<Checkbox
						name="send_on_order_create"
						checked={ smsSettings.send_on_order_create }
						onChange={ handleChange }
						label={ __(
							'ارسال پیامک هنگام ثبت سفارش',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'قالب پیامک ثبت سفارش', 'tabesh-v2' ) }
					description={ __(
						'متغیرهای قابل استفاده: {customer_name}, {order_number}, {total_amount}',
						'tabesh-v2'
					) }
				>
					<TextArea
						name="order_create_template"
						value={ smsSettings.order_create_template }
						onChange={ handleChange }
						rows={ 4 }
						placeholder={ __(
							'سلام {customer_name}، سفارش شما با شماره {order_number} ثبت شد.',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="send_on_status_change"
						checked={ smsSettings.send_on_status_change }
						onChange={ handleChange }
						label={ __(
							'ارسال پیامک هنگام تغییر وضعیت',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'قالب پیامک تغییر وضعیت', 'tabesh-v2' ) }
					description={ __(
						'متغیرهای قابل استفاده: {customer_name}, {order_number}, {status}',
						'tabesh-v2'
					) }
				>
					<TextArea
						name="status_change_template"
						value={ smsSettings.status_change_template }
						onChange={ handleChange }
						rows={ 4 }
						placeholder={ __(
							'سفارش {order_number} به وضعیت {status} تغییر یافت.',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="send_on_delivery"
						checked={ smsSettings.send_on_delivery }
						onChange={ handleChange }
						label={ __(
							'ارسال پیامک هنگام آماده شدن برای ارسال',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'قالب پیامک آماده ارسال', 'tabesh-v2' ) }
					description={ __(
						'پیامک اطلاع‌رسانی آماده بودن سفارش برای ارسال',
						'tabesh-v2'
					) }
				>
					<TextArea
						name="delivery_template"
						value={ smsSettings.delivery_template }
						onChange={ handleChange }
						rows={ 4 }
						placeholder={ __(
							'سفارش شما آماده ارسال است.',
							'tabesh-v2'
						) }
					/>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'تنظیمات پیشرفته', 'tabesh-v2' ) }
				description={ __( 'سایر تنظیمات پیامک', 'tabesh-v2' ) }
			>
				<FormGroup>
					<Checkbox
						name="log_messages"
						checked={ smsSettings.log_messages }
						onChange={ handleChange }
						label={ __( 'ثبت لاگ پیامک‌های ارسالی', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'حداکثر تلاش مجدد', 'tabesh-v2' ) }
					description={ __(
						'تعداد دفعات تلاش مجدد در صورت خطا',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="max_retries"
						value={ smsSettings.max_retries }
						onChange={ handleChange }
						type="number"
						placeholder="3"
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

export default SMSSettingsTab;
