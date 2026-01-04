import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	FormGroup,
	TextInput,
	Select,
	Section,
} from '../components/FormComponents';

/**
 * Product Parameters Tab Component.
 *
 * @param {Object} props Component props
 * @param {Object} props.settings Current settings
 * @param {Function} props.onChange Settings change handler
 */
const ProductParametersTab = ( { settings, onChange } ) => {
	const productSettings = settings.products || {};

	// List of all product types
	const productTypes = [
		{ value: 'book_print', label: __( 'چاپ کتاب', 'tabesh-v2' ) },
		{
			value: 'receipt_ready',
			label: __( 'چاپ قبض با طرح آماده', 'tabesh-v2' ),
		},
		{
			value: 'receipt_custom',
			label: __( 'چاپ قبض با طرح دلخواه', 'tabesh-v2' ),
		},
		{
			value: 'box_ready',
			label: __( 'چاپ جعبه با طرح آماده', 'tabesh-v2' ),
		},
		{
			value: 'box_custom',
			label: __( 'چاپ جعبه با طرح دلخواه', 'tabesh-v2' ),
		},
		{
			value: 'invoice_ready',
			label: __( 'چاپ فاکتور با طرح آماده', 'tabesh-v2' ),
		},
		{
			value: 'invoice_custom',
			label: __( 'چاپ فاکتور با طرح دلخواه', 'tabesh-v2' ),
		},
		{
			value: 'business_card_ready',
			label: __( 'چاپ کارت ویزیت با طرح آماده', 'tabesh-v2' ),
		},
		{
			value: 'business_card_custom',
			label: __( 'چاپ کارت ویزیت با طرح دلخواه', 'tabesh-v2' ),
		},
		{
			value: 'poster_ready',
			label: __( 'چاپ پوستر با طرح آماده', 'tabesh-v2' ),
		},
		{
			value: 'poster_custom',
			label: __( 'چاپ پوستر با طرح دلخواه', 'tabesh-v2' ),
		},
		{
			value: 'flyer_ready',
			label: __( 'چاپ تراکت با طرح آماده', 'tabesh-v2' ),
		},
		{
			value: 'flyer_custom',
			label: __( 'چاپ تراکت با طرح دلخواه', 'tabesh-v2' ),
		},
		{
			value: 'foil_print',
			label: __( 'چاپ طلاکوب / نقره کوب / مس کوب', 'tabesh-v2' ),
		},
		{
			value: 'thesis_binding',
			label: __( 'چاپ مقالات با صحافی', 'tabesh-v2' ),
		},
		{
			value: 'research_with_work',
			label: __( 'چاپ تحقیق / جزوه / مقاله با انجام تحقیق', 'tabesh-v2' ),
		},
		{
			value: 'research_with_file',
			label: __( 'چاپ تحقیق / جزوه / مقاله با ارسال فایل', 'tabesh-v2' ),
		},
		{
			value: 'endowment_print',
			label: __( 'چاپ وقف نامه و یاد بود', 'tabesh-v2' ),
		},
		{ value: 'advertising_print', label: __( 'چاپ تبلیغات', 'tabesh-v2' ) },
	];

	const [ selectedProduct, setSelectedProduct ] = useState(
		productTypes[ 0 ].value
	);

	// Book printing parameters state (only loaded when book_print is selected)
	const [bookSizes, setBookSizes] = useState([]);
	const [paperTypes, setPaperTypes] = useState([]);
	const [paperWeights, setPaperWeights] = useState([]);
	const [printTypes, setPrintTypes] = useState([]);
	const [licenseTypes, setLicenseTypes] = useState([]);
	const [coverWeights, setCoverWeights] = useState([]);
	const [laminationTypes, setLaminationTypes] = useState([]);
	const [additionalServices, setAdditionalServices] = useState([]);
	const [bindingTypes, setBindingTypes] = useState([]);
	const [bookParamsLoading, setBookParamsLoading] = useState(false);

	// Form states for adding new book parameters
	const [newBookSize, setNewBookSize] = useState({ name: '', prompt_master: '' });
	const [newPaperType, setNewPaperType] = useState({ name: '', prompt_master: '' });
	const [newPaperWeight, setNewPaperWeight] = useState({ paper_type_id: '', weight: '', prompt_master: '' });
	const [newPrintType, setNewPrintType] = useState({ name: '', prompt_master: '' });
	const [newLicenseType, setNewLicenseType] = useState({ name: '', prompt_master: '' });
	const [newCoverWeight, setNewCoverWeight] = useState({ weight: '', prompt_master: '' });
	const [newLaminationType, setNewLaminationType] = useState({ name: '', prompt_master: '' });
	const [newAdditionalService, setNewAdditionalService] = useState({ name: '', prompt_master: '' });
	const [newBindingType, setNewBindingType] = useState({ name: '', prompt_master: '' });

	// Load book parameters when book_print is selected
	useEffect(() => {
		if (selectedProduct === 'book_print') {
			loadBookParameters();
		}
	}, [selectedProduct]);

	/**
	 * Load all book printing parameters
	 */
	const loadBookParameters = async () => {
		setBookParamsLoading(true);
		try {
			const [
				sizesData,
				typesData,
				weightsData,
				printsData,
				licensesData,
				coversData,
				laminationsData,
				servicesData,
				bindingsData,
			] = await Promise.all([
				apiFetch({ path: '/tabesh/v2/book-params/book-sizes' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/print-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/license-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/cover-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/lamination-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/additional-services' }),
				apiFetch({ path: '/tabesh/v2/book-params/binding-types' }),
			]);

			setBookSizes(sizesData.data || []);
			setPaperTypes(typesData.data || []);
			setPaperWeights(weightsData.data || []);
			setPrintTypes(printsData.data || []);
			setLicenseTypes(licensesData.data || []);
			setCoverWeights(coversData.data || []);
			setLaminationTypes(laminationsData.data || []);
			setAdditionalServices(servicesData.data || []);
			setBindingTypes(bindingsData.data || []);
		} catch (error) {
			console.error('Error loading book parameters:', error);
		}
		setBookParamsLoading(false);
	};

	/**
	 * Add a new book parameter
	 */
	const addBookParameter = async (endpoint, data, resetForm) => {
		try {
			await apiFetch({
				path: `/tabesh/v2/book-params/${endpoint}`,
				method: 'POST',
				data: data,
			});
			resetForm();
			loadBookParameters();
		} catch (error) {
			console.error('Error adding parameter:', error);
			alert(__('خطا در افزودن پارامتر', 'tabesh-v2'));
		}
	};

	/**
	 * Delete a book parameter
	 */
	const deleteBookParameter = async (endpoint, id) => {
		if (!confirm(__('آیا از حذف این مورد اطمینان دارید؟', 'tabesh-v2'))) {
			return;
		}

		try {
			await apiFetch({
				path: `/tabesh/v2/book-params/${endpoint}/${id}`,
				method: 'DELETE',
			});
			loadBookParameters();
		} catch (error) {
			console.error('Error deleting parameter:', error);
			alert(__('خطا در حذف پارامتر', 'tabesh-v2'));
		}
	};

	const handleProductChange = ( productType, field, value ) => {
		onChange( {
			...settings,
			products: {
				...productSettings,
				[ productType ]: {
					...( productSettings[ productType ] || {} ),
					[ field ]: value,
				},
			},
		} );
	};

	const currentProduct = productSettings[ selectedProduct ] || {};

	return (
		<div className="product-parameters-tab">
			<Section
				title={ __( 'انتخاب محصول', 'tabesh-v2' ) }
				description={ __(
					'محصول مورد نظر را انتخاب کنید تا پارامترهای آن را تنظیم نمایید',
					'tabesh-v2'
				) }
			>
				<FormGroup label={ __( 'نوع محصول', 'tabesh-v2' ) }>
					<Select
						name="product_type"
						value={ selectedProduct }
						onChange={ ( e ) =>
							setSelectedProduct( e.target.value )
						}
						options={ productTypes }
					/>
				</FormGroup>
			</Section>

			{/* Show book printing parameters for book_print product type */}
			{selectedProduct === 'book_print' ? (
				<div className="book-printing-parameters-tab">
					{bookParamsLoading ? (
						<div className="tabesh-loading">
							{__('در حال بارگذاری...', 'tabesh-v2')}
						</div>
					) : (
						<>
							{/* Book Sizes Section */}
							<Section
								title={__('قطع کتاب', 'tabesh-v2')}
								description={__('مدیریت انواع قطع کتاب (رقعی، وزیری، رحلی و ...)', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{bookSizes.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('book-sizes', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام قطع کتاب', 'tabesh-v2')}>
										<TextInput
											name="book_size_name"
											value={newBookSize.name}
											onChange={(e) => setNewBookSize({ ...newBookSize, name: e.target.value })}
											placeholder={__('مثال: رقعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="book_size_prompt"
											value={newBookSize.prompt_master}
											onChange={(e) => setNewBookSize({ ...newBookSize, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('book-sizes', newBookSize, () => setNewBookSize({ name: '', prompt_master: '' }))}
										disabled={!newBookSize.name}
									>
										{__('افزودن قطع کتاب', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Paper Types Section */}
							<Section
								title={__('نوع کاغذ متن', 'tabesh-v2')}
								description={__('مدیریت انواع کاغذ متن (بالک، تحریر و ...)', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{paperTypes.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('paper-types', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام نوع کاغذ', 'tabesh-v2')}>
										<TextInput
											name="paper_type_name"
											value={newPaperType.name}
											onChange={(e) => setNewPaperType({ ...newPaperType, name: e.target.value })}
											placeholder={__('مثال: بالک', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="paper_type_prompt"
											value={newPaperType.prompt_master}
											onChange={(e) => setNewPaperType({ ...newPaperType, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('paper-types', newPaperType, () => setNewPaperType({ name: '', prompt_master: '' }))}
										disabled={!newPaperType.name}
									>
										{__('افزودن نوع کاغذ', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Paper Weights Section */}
							<Section
								title={__('گرماژ کاغذ متن', 'tabesh-v2')}
								description={__('مدیریت گرماژهای مختلف کاغذ متن', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{paperWeights.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">
												{item.paper_type_name || 'نامشخص'} - {item.weight} گرم
											</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('paper-weights', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نوع کاغذ', 'tabesh-v2')}>
										<select
											name="paper_weight_type"
											value={newPaperWeight.paper_type_id}
											onChange={(e) => setNewPaperWeight({ ...newPaperWeight, paper_type_id: e.target.value })}
											className="regular-text"
										>
											<option value="">{__('انتخاب کنید', 'tabesh-v2')}</option>
											{paperTypes.map((type) => (
												<option key={type.id} value={type.id}>
													{type.name}
												</option>
											))}
										</select>
									</FormGroup>
									<FormGroup label={__('گرماژ (گرم)', 'tabesh-v2')}>
										<TextInput
											name="paper_weight_value"
											type="number"
											value={newPaperWeight.weight}
											onChange={(e) => setNewPaperWeight({ ...newPaperWeight, weight: e.target.value })}
											placeholder={__('مثال: 80', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="paper_weight_prompt"
											value={newPaperWeight.prompt_master}
											onChange={(e) => setNewPaperWeight({ ...newPaperWeight, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('paper-weights', newPaperWeight, () => setNewPaperWeight({ paper_type_id: '', weight: '', prompt_master: '' }))}
										disabled={!newPaperWeight.paper_type_id || !newPaperWeight.weight}
									>
										{__('افزودن گرماژ کاغذ', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Print Types Section */}
							<Section
								title={__('انواع چاپ', 'tabesh-v2')}
								description={__('مدیریت انواع چاپ (سیاه‌وسفید، رنگی و ...)', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{printTypes.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('print-types', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام نوع چاپ', 'tabesh-v2')}>
										<TextInput
											name="print_type_name"
											value={newPrintType.name}
											onChange={(e) => setNewPrintType({ ...newPrintType, name: e.target.value })}
											placeholder={__('مثال: چاپ رنگی', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="print_type_prompt"
											value={newPrintType.prompt_master}
											onChange={(e) => setNewPrintType({ ...newPrintType, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('print-types', newPrintType, () => setNewPrintType({ name: '', prompt_master: '' }))}
										disabled={!newPrintType.name}
									>
										{__('افزودن نوع چاپ', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* License Types Section */}
							<Section
								title={__('انواع مجوز', 'tabesh-v2')}
								description={__('مدیریت انواع مجوز چاپ', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{licenseTypes.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('license-types', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام نوع مجوز', 'tabesh-v2')}>
										<TextInput
											name="license_type_name"
											value={newLicenseType.name}
											onChange={(e) => setNewLicenseType({ ...newLicenseType, name: e.target.value })}
											placeholder={__('مثال: دارای مجوز', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="license_type_prompt"
											value={newLicenseType.prompt_master}
											onChange={(e) => setNewLicenseType({ ...newLicenseType, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('license-types', newLicenseType, () => setNewLicenseType({ name: '', prompt_master: '' }))}
										disabled={!newLicenseType.name}
									>
										{__('افزودن نوع مجوز', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Cover Weights Section */}
							<Section
								title={__('گرماژ کاغذ جلد', 'tabesh-v2')}
								description={__('مدیریت گرماژهای مختلف کاغذ جلد', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{coverWeights.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.weight} گرم</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('cover-weights', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('گرماژ جلد (گرم)', 'tabesh-v2')}>
										<TextInput
											name="cover_weight_value"
											type="number"
											value={newCoverWeight.weight}
											onChange={(e) => setNewCoverWeight({ ...newCoverWeight, weight: e.target.value })}
											placeholder={__('مثال: 200', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="cover_weight_prompt"
											value={newCoverWeight.prompt_master}
											onChange={(e) => setNewCoverWeight({ ...newCoverWeight, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('cover-weights', newCoverWeight, () => setNewCoverWeight({ weight: '', prompt_master: '' }))}
										disabled={!newCoverWeight.weight}
									>
										{__('افزودن گرماژ جلد', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Lamination Types Section */}
							<Section
								title={__('انواع سلفون جلد', 'tabesh-v2')}
								description={__('مدیریت انواع سلفون جلد', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{laminationTypes.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('lamination-types', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام نوع سلفون', 'tabesh-v2')}>
										<TextInput
											name="lamination_type_name"
											value={newLaminationType.name}
											onChange={(e) => setNewLaminationType({ ...newLaminationType, name: e.target.value })}
											placeholder={__('مثال: سلفون مات', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="lamination_type_prompt"
											value={newLaminationType.prompt_master}
											onChange={(e) => setNewLaminationType({ ...newLaminationType, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('lamination-types', newLaminationType, () => setNewLaminationType({ name: '', prompt_master: '' }))}
										disabled={!newLaminationType.name}
									>
										{__('افزودن نوع سلفون', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Binding Types Section */}
							<Section
								title={__('انواع صحافی', 'tabesh-v2')}
								description={__('مدیریت انواع صحافی کتاب (شومیز، جلد سخت، منگنه و ...)', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{bindingTypes.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('binding-types', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام نوع صحافی', 'tabesh-v2')}>
										<TextInput
											name="binding_type_name"
											value={newBindingType.name}
											onChange={(e) => setNewBindingType({ ...newBindingType, name: e.target.value })}
											placeholder={__('مثال: شومیز', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="binding_type_prompt"
											value={newBindingType.prompt_master}
											onChange={(e) => setNewBindingType({ ...newBindingType, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('binding-types', newBindingType, () => setNewBindingType({ name: '', prompt_master: '' }))}
										disabled={!newBindingType.name}
									>
										{__('افزودن نوع صحافی', 'tabesh-v2')}
									</button>
								</div>
							</Section>

							{/* Additional Services Section */}
							<Section
								title={__('خدمات اضافی', 'tabesh-v2')}
								description={__('مدیریت خدمات اضافی (شیرینک، طلاکوب و ...)', 'tabesh-v2')}
							>
								<div className="parameter-list">
									{additionalServices.map((item) => (
										<div key={item.id} className="parameter-item">
											<span className="parameter-name">{item.name}</span>
											{item.prompt_master && (
												<span className="parameter-prompt" title={item.prompt_master}>
													📝
												</span>
											)}
											<button
												type="button"
												className="button button-small button-link-delete"
												onClick={() => deleteBookParameter('additional-services', item.id)}
											>
												{__('حذف', 'tabesh-v2')}
											</button>
										</div>
									))}
								</div>

								<div className="parameter-add-form">
									<FormGroup label={__('نام خدمت', 'tabesh-v2')}>
										<TextInput
											name="additional_service_name"
											value={newAdditionalService.name}
											onChange={(e) => setNewAdditionalService({ ...newAdditionalService, name: e.target.value })}
											placeholder={__('مثال: شیرینک', 'tabesh-v2')}
										/>
									</FormGroup>
									<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
										<textarea
											name="additional_service_prompt"
											value={newAdditionalService.prompt_master}
											onChange={(e) => setNewAdditionalService({ ...newAdditionalService, prompt_master: e.target.value })}
											rows={2}
											className="large-text"
											placeholder={__('توضیحات برای هوش مصنوعی', 'tabesh-v2')}
										/>
									</FormGroup>
									<button
										type="button"
										className="button button-primary"
										onClick={() => addBookParameter('additional-services', newAdditionalService, () => setNewAdditionalService({ name: '', prompt_master: '' }))}
										disabled={!newAdditionalService.name}
									>
										{__('افزودن خدمت اضافی', 'tabesh-v2')}
									</button>
								</div>
							</Section>
						</>
					)}
				</div>
			) : (
				/* Show generic product parameters for other product types */
				<Section
					title={ __( 'پارامترهای محصول', 'tabesh-v2' ) }
					description={ __(
						`تنظیم پارامترهای ${
							productTypes.find(
								( p ) => p.value === selectedProduct
							)?.label
						}`,
						'tabesh-v2'
					) }
				>
					<FormGroup
						label={ __( 'فعال بودن محصول', 'tabesh-v2' ) }
						description={ __(
							'آیا این محصول در فروشگاه نمایش داده شود؟',
							'tabesh-v2'
						) }
					>
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={ currentProduct.enabled || false }
								onChange={ ( e ) =>
									handleProductChange(
										selectedProduct,
										'enabled',
										e.target.checked
									)
								}
							/>
							<span>{ __( 'فعال', 'tabesh-v2' ) }</span>
						</label>
					</FormGroup>

					<FormGroup
						label={ __( 'حداقل تعداد سفارش', 'tabesh-v2' ) }
						description={ __(
							'حداقل تعداد برای سفارش این محصول',
							'tabesh-v2'
						) }
					>
						<TextInput
							name="min_quantity"
							value={ currentProduct.min_quantity }
							onChange={ ( e ) =>
								handleProductChange(
									selectedProduct,
									'min_quantity',
									e.target.value
								)
							}
							type="number"
							placeholder="1"
						/>
					</FormGroup>

					<FormGroup
						label={ __( 'حداکثر تعداد سفارش', 'tabesh-v2' ) }
						description={ __(
							'حداکثر تعداد برای سفارش این محصول',
							'tabesh-v2'
						) }
					>
						<TextInput
							name="max_quantity"
							value={ currentProduct.max_quantity }
							onChange={ ( e ) =>
								handleProductChange(
									selectedProduct,
									'max_quantity',
									e.target.value
								)
							}
							type="number"
							placeholder="10000"
						/>
					</FormGroup>

					<FormGroup
						label={ __( 'زمان تحویل (روز)', 'tabesh-v2' ) }
						description={ __(
							'تعداد روزهای کاری برای تحویل محصول',
							'tabesh-v2'
						) }
					>
						<TextInput
							name="delivery_days"
							value={ currentProduct.delivery_days }
							onChange={ ( e ) =>
								handleProductChange(
									selectedProduct,
									'delivery_days',
									e.target.value
								)
							}
							type="number"
							placeholder="7"
						/>
					</FormGroup>

					<FormGroup
						label={ __( 'قیمت پایه', 'tabesh-v2' ) }
						description={ __( 'قیمت پایه محصول (تومان)', 'tabesh-v2' ) }
					>
						<TextInput
							name="base_price"
							value={ currentProduct.base_price }
							onChange={ ( e ) =>
								handleProductChange(
									selectedProduct,
									'base_price',
									e.target.value
								)
							}
							type="number"
							placeholder="0"
						/>
					</FormGroup>

					<FormGroup
						label={ __( 'توضیحات اضافی', 'tabesh-v2' ) }
						description={ __(
							'توضیحات و راهنمایی‌های لازم برای سفارش این محصول',
							'tabesh-v2'
						) }
					>
						<textarea
							name="description"
							value={ currentProduct.description || '' }
							onChange={ ( e ) =>
								handleProductChange(
									selectedProduct,
									'description',
									e.target.value
								)
							}
							rows={ 4 }
							className="large-text"
							placeholder={ __( 'توضیحات محصول...', 'tabesh-v2' ) }
						/>
					</FormGroup>

					<FormGroup
						label={ __( 'پارامترهای سفارشی (JSON)', 'tabesh-v2' ) }
						description={ __(
							'پارامترهای اضافی به صورت JSON',
							'tabesh-v2'
						) }
					>
						<textarea
							name="custom_params"
							value={ currentProduct.custom_params || '' }
							onChange={ ( e ) =>
								handleProductChange(
									selectedProduct,
									'custom_params',
									e.target.value
								)
							}
							rows={ 6 }
							className="large-text code"
							placeholder='{"sizes": ["A4", "A5"], "colors": ["رنگی", "سیاه و سفید"]}'
						/>
					</FormGroup>
				</Section>
			)}
		</div>
	);
};

export default ProductParametersTab;
