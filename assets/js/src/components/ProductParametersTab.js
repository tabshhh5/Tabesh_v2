import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FormGroup, TextInput, Select, Section } from '../components/FormComponents';

/**
 * Product Parameters Tab Component.
 * 
 * @param {Object} props Component props
 * @param {Object} props.settings Current settings
 * @param {Function} props.onChange Settings change handler
 */
const ProductParametersTab = ({ settings, onChange }) => {
	const productSettings = settings.products || {};
	
	// List of all product types
	const productTypes = [
		{ value: 'book_print', label: __('چاپ کتاب', 'tabesh-v2') },
		{ value: 'receipt_ready', label: __('چاپ قبض با طرح آماده', 'tabesh-v2') },
		{ value: 'receipt_custom', label: __('چاپ قبض با طرح دلخواه', 'tabesh-v2') },
		{ value: 'box_ready', label: __('چاپ جعبه با طرح آماده', 'tabesh-v2') },
		{ value: 'box_custom', label: __('چاپ جعبه با طرح دلخواه', 'tabesh-v2') },
		{ value: 'invoice_ready', label: __('چاپ فاکتور با طرح آماده', 'tabesh-v2') },
		{ value: 'invoice_custom', label: __('چاپ فاکتور با طرح دلخواه', 'tabesh-v2') },
		{ value: 'business_card_ready', label: __('چاپ کارت ویزیت با طرح آماده', 'tabesh-v2') },
		{ value: 'business_card_custom', label: __('چاپ کارت ویزیت با طرح دلخواه', 'tabesh-v2') },
		{ value: 'poster_ready', label: __('چاپ پوستر با طرح آماده', 'tabesh-v2') },
		{ value: 'poster_custom', label: __('چاپ پوستر با طرح دلخواه', 'tabesh-v2') },
		{ value: 'flyer_ready', label: __('چاپ تراکت با طرح آماده', 'tabesh-v2') },
		{ value: 'flyer_custom', label: __('چاپ تراکت با طرح دلخواه', 'tabesh-v2') },
		{ value: 'foil_print', label: __('چاپ طلاکوب / نقره کوب / مس کوب', 'tabesh-v2') },
		{ value: 'thesis_binding', label: __('چاپ مقالات با صحافی', 'tabesh-v2') },
		{ value: 'research_with_work', label: __('چاپ تحقیق / جزوه / مقاله با انجام تحقیق', 'tabesh-v2') },
		{ value: 'research_with_file', label: __('چاپ تحقیق / جزوه / مقاله با ارسال فایل', 'tabesh-v2') },
		{ value: 'endowment_print', label: __('چاپ وقف نامه و یاد بود', 'tabesh-v2') },
		{ value: 'advertising_print', label: __('چاپ تبلیغات', 'tabesh-v2') },
	];

	const [selectedProduct, setSelectedProduct] = useState(productTypes[0].value);

	const handleProductChange = (productType, field, value) => {
		onChange({
			...settings,
			products: {
				...productSettings,
				[productType]: {
					...(productSettings[productType] || {}),
					[field]: value,
				},
			},
		});
	};

	const currentProduct = productSettings[selectedProduct] || {};

	return (
		<div className="product-parameters-tab">
			<Section
				title={__('انتخاب محصول', 'tabesh-v2')}
				description={__('محصول مورد نظر را انتخاب کنید تا پارامترهای آن را تنظیم نمایید', 'tabesh-v2')}
			>
				<FormGroup label={__('نوع محصول', 'tabesh-v2')}>
					<Select
						name="product_type"
						value={selectedProduct}
						onChange={(e) => setSelectedProduct(e.target.value)}
						options={productTypes}
					/>
				</FormGroup>
			</Section>

			<Section
				title={__('پارامترهای محصول', 'tabesh-v2')}
				description={__(`تنظیم پارامترهای ${productTypes.find(p => p.value === selectedProduct)?.label}`, 'tabesh-v2')}
			>
				<FormGroup
					label={__('فعال بودن محصول', 'tabesh-v2')}
					description={__('آیا این محصول در فروشگاه نمایش داده شود؟', 'tabesh-v2')}
				>
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={currentProduct.enabled || false}
							onChange={(e) => handleProductChange(selectedProduct, 'enabled', e.target.checked)}
						/>
						<span>{__('فعال', 'tabesh-v2')}</span>
					</label>
				</FormGroup>

				<FormGroup
					label={__('حداقل تعداد سفارش', 'tabesh-v2')}
					description={__('حداقل تعداد برای سفارش این محصول', 'tabesh-v2')}
				>
					<TextInput
						name="min_quantity"
						value={currentProduct.min_quantity}
						onChange={(e) => handleProductChange(selectedProduct, 'min_quantity', e.target.value)}
						type="number"
						placeholder="1"
					/>
				</FormGroup>

				<FormGroup
					label={__('حداکثر تعداد سفارش', 'tabesh-v2')}
					description={__('حداکثر تعداد برای سفارش این محصول', 'tabesh-v2')}
				>
					<TextInput
						name="max_quantity"
						value={currentProduct.max_quantity}
						onChange={(e) => handleProductChange(selectedProduct, 'max_quantity', e.target.value)}
						type="number"
						placeholder="10000"
					/>
				</FormGroup>

				<FormGroup
					label={__('زمان تحویل (روز)', 'tabesh-v2')}
					description={__('تعداد روزهای کاری برای تحویل محصول', 'tabesh-v2')}
				>
					<TextInput
						name="delivery_days"
						value={currentProduct.delivery_days}
						onChange={(e) => handleProductChange(selectedProduct, 'delivery_days', e.target.value)}
						type="number"
						placeholder="7"
					/>
				</FormGroup>

				<FormGroup
					label={__('قیمت پایه', 'tabesh-v2')}
					description={__('قیمت پایه محصول (تومان)', 'tabesh-v2')}
				>
					<TextInput
						name="base_price"
						value={currentProduct.base_price}
						onChange={(e) => handleProductChange(selectedProduct, 'base_price', e.target.value)}
						type="number"
						placeholder="0"
					/>
				</FormGroup>

				<FormGroup
					label={__('توضیحات اضافی', 'tabesh-v2')}
					description={__('توضیحات و راهنمایی‌های لازم برای سفارش این محصول', 'tabesh-v2')}
				>
					<textarea
						name="description"
						value={currentProduct.description || ''}
						onChange={(e) => handleProductChange(selectedProduct, 'description', e.target.value)}
						rows={4}
						className="large-text"
						placeholder={__('توضیحات محصول...', 'tabesh-v2')}
					/>
				</FormGroup>

				<FormGroup
					label={__('پارامترهای سفارشی (JSON)', 'tabesh-v2')}
					description={__('پارامترهای اضافی به صورت JSON', 'tabesh-v2')}
				>
					<textarea
						name="custom_params"
						value={currentProduct.custom_params || ''}
						onChange={(e) => handleProductChange(selectedProduct, 'custom_params', e.target.value)}
						rows={6}
						className="large-text code"
						placeholder='{"sizes": ["A4", "A5"], "colors": ["رنگی", "سیاه و سفید"]}'
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

export default ProductParametersTab;
