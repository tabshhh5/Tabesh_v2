import { __ } from '@wordpress/i18n';
import {
	FormGroup,
	TextInput,
	TextArea,
	Checkbox,
	Section,
} from '../components/FormComponents';

/**
 * Pricing Settings Tab Component.
 *
 * @param {Object} props Component props
 * @param {Object} props.settings Current settings
 * @param {Function} props.onChange Settings change handler
 */
const PricingSettingsTab = ( { settings, onChange } ) => {
	const pricingSettings = settings.pricing || {};

	const handleChange = ( e ) => {
		const { name, value, type, checked } = e.target;
		onChange( {
			...settings,
			pricing: {
				...pricingSettings,
				[ name ]: type === 'checkbox' ? checked : value,
			},
		} );
	};

	return (
		<div className="pricing-settings-tab">
			<Section
				title={ __( 'تنظیمات عمومی قیمت‌گذاری', 'tabesh-v2' ) }
				description={ __(
					'تنظیمات کلی مربوط به قیمت‌گذاری محصولات',
					'tabesh-v2'
				) }
			>
				<FormGroup
					label={ __( 'واحد پول', 'tabesh-v2' ) }
					description={ __( 'واحد پولی مورد استفاده', 'tabesh-v2' ) }
				>
					<TextInput
						name="currency"
						value={ pricingSettings.currency }
						onChange={ handleChange }
						placeholder="تومان"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'نماد پول', 'tabesh-v2' ) }
					description={ __( 'نماد نمایش پول', 'tabesh-v2' ) }
				>
					<TextInput
						name="currency_symbol"
						value={ pricingSettings.currency_symbol }
						onChange={ handleChange }
						placeholder="تومان"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'موقعیت نماد', 'tabesh-v2' ) }
					description={ __( 'موقعیت نمایش نماد پول', 'tabesh-v2' ) }
				>
					<select
						name="currency_position"
						value={ pricingSettings.currency_position || 'after' }
						onChange={ handleChange }
						className="regular-text"
					>
						<option value="before">
							{ __( 'قبل از عدد', 'tabesh-v2' ) }
						</option>
						<option value="after">
							{ __( 'بعد از عدد', 'tabesh-v2' ) }
						</option>
					</select>
				</FormGroup>

				<FormGroup
					label={ __( 'تعداد اعشار', 'tabesh-v2' ) }
					description={ __(
						'تعداد ارقام اعشار در قیمت‌ها',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="decimals"
						value={ pricingSettings.decimals }
						onChange={ handleChange }
						type="number"
						placeholder="0"
					/>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'مالیات و تخفیف', 'tabesh-v2' ) }
				description={ __( 'تنظیمات مالیات و تخفیف', 'tabesh-v2' ) }
			>
				<FormGroup label={ __( 'فعال‌سازی', 'tabesh-v2' ) }>
					<Checkbox
						name="tax_enabled"
						checked={ pricingSettings.tax_enabled }
						onChange={ handleChange }
						label={ __( 'محاسبه مالیات', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'نرخ مالیات (درصد)', 'tabesh-v2' ) }
					description={ __(
						'درصد مالیات بر ارزش افزوده',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="tax_rate"
						value={ pricingSettings.tax_rate }
						onChange={ handleChange }
						type="number"
						placeholder="9"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'حداکثر تخفیف (درصد)', 'tabesh-v2' ) }
					description={ __(
						'حداکثر درصد تخفیف قابل اعمال',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="max_discount"
						value={ pricingSettings.max_discount }
						onChange={ handleChange }
						type="number"
						placeholder="30"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="discount_enabled"
						checked={ pricingSettings.discount_enabled }
						onChange={ handleChange }
						label={ __( 'فعال‌سازی تخفیف', 'tabesh-v2' ) }
					/>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'تخفیف حجمی', 'tabesh-v2' ) }
				description={ __(
					'تنظیمات تخفیف بر اساس تعداد سفارش',
					'tabesh-v2'
				) }
			>
				<FormGroup>
					<Checkbox
						name="bulk_discount_enabled"
						checked={ pricingSettings.bulk_discount_enabled }
						onChange={ handleChange }
						label={ __( 'فعال‌سازی تخفیف حجمی', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'جدول تخفیف حجمی (JSON)', 'tabesh-v2' ) }
					description={ __(
						'تعریف محدوده‌های تخفیف به صورت JSON',
						'tabesh-v2'
					) }
				>
					<TextArea
						name="bulk_discount_table"
						value={ pricingSettings.bulk_discount_table }
						onChange={ handleChange }
						rows={ 6 }
						placeholder='[{"min": 100, "max": 500, "discount": 5}, {"min": 501, "max": 1000, "discount": 10}]'
					/>
				</FormGroup>
			</Section>

			<Section
				title={ __( 'هزینه‌های اضافی', 'tabesh-v2' ) }
				description={ __( 'تنظیمات هزینه‌های جانبی', 'tabesh-v2' ) }
			>
				<FormGroup
					label={ __( 'هزینه ارسال پایه', 'tabesh-v2' ) }
					description={ __(
						'هزینه پایه ارسال محصولات',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="base_shipping_cost"
						value={ pricingSettings.base_shipping_cost }
						onChange={ handleChange }
						type="number"
						placeholder="0"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="free_shipping_enabled"
						checked={ pricingSettings.free_shipping_enabled }
						onChange={ handleChange }
						label={ __( 'ارسال رایگان', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'حداقل مبلغ برای ارسال رایگان', 'tabesh-v2' ) }
					description={ __(
						'حداقل مبلغ سفارش برای ارسال رایگان',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="free_shipping_threshold"
						value={ pricingSettings.free_shipping_threshold }
						onChange={ handleChange }
						type="number"
						placeholder="1000000"
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

export default PricingSettingsTab;
