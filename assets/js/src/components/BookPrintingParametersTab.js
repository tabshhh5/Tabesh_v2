import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	FormGroup,
	TextInput,
	Section,
} from '../components/FormComponents';

/**
 * Book Printing Parameters Tab Component.
 *
 * @param {Object} props Component props
 */
const BookPrintingParametersTab = () => {
	// State for all parameter types
	const [bookSizes, setBookSizes] = useState([]);
	const [paperTypes, setPaperTypes] = useState([]);
	const [paperWeights, setPaperWeights] = useState([]);
	const [printTypes, setPrintTypes] = useState([]);
	const [licenseTypes, setLicenseTypes] = useState([]);
	const [coverWeights, setCoverWeights] = useState([]);
	const [laminationTypes, setLaminationTypes] = useState([]);
	const [additionalServices, setAdditionalServices] = useState([]);

	// Loading states
	const [loading, setLoading] = useState(true);

	// Form states for adding new items
	const [newBookSize, setNewBookSize] = useState({ name: '', prompt_master: '' });
	const [newPaperType, setNewPaperType] = useState({ name: '', prompt_master: '' });
	const [newPaperWeight, setNewPaperWeight] = useState({ paper_type_id: '', weight: '', prompt_master: '' });
	const [newPrintType, setNewPrintType] = useState({ name: '', prompt_master: '' });
	const [newLicenseType, setNewLicenseType] = useState({ name: '', prompt_master: '' });
	const [newCoverWeight, setNewCoverWeight] = useState({ weight: '', prompt_master: '' });
	const [newLaminationType, setNewLaminationType] = useState({ name: '', prompt_master: '' });
	const [newAdditionalService, setNewAdditionalService] = useState({ name: '', prompt_master: '' });

	// Load all data on mount
	useEffect(() => {
		loadAllParameters();
	}, []);

	/**
	 * Load all book printing parameters
	 */
	const loadAllParameters = async () => {
		setLoading(true);
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
			] = await Promise.all([
				apiFetch({ path: '/tabesh/v2/book-params/book-sizes' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/print-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/license-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/cover-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/lamination-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/additional-services' }),
			]);

			setBookSizes(sizesData.data || []);
			setPaperTypes(typesData.data || []);
			setPaperWeights(weightsData.data || []);
			setPrintTypes(printsData.data || []);
			setLicenseTypes(licensesData.data || []);
			setCoverWeights(coversData.data || []);
			setLaminationTypes(laminationsData.data || []);
			setAdditionalServices(servicesData.data || []);
		} catch (error) {
			console.error('Error loading parameters:', error);
		}
		setLoading(false);
	};

	/**
	 * Add a new parameter
	 */
	const addParameter = async (endpoint, data, setData, resetForm) => {
		try {
			await apiFetch({
				path: `/tabesh/v2/book-params/${endpoint}`,
				method: 'POST',
				data: data,
			});
			resetForm();
			loadAllParameters();
		} catch (error) {
			console.error('Error adding parameter:', error);
			alert(__('خطا در افزودن پارامتر', 'tabesh-v2'));
		}
	};

	/**
	 * Delete a parameter
	 */
	const deleteParameter = async (endpoint, id) => {
		if (!confirm(__('آیا از حذف این مورد اطمینان دارید؟', 'tabesh-v2'))) {
			return;
		}

		try {
			await apiFetch({
				path: `/tabesh/v2/book-params/${endpoint}/${id}`,
				method: 'DELETE',
			});
			loadAllParameters();
		} catch (error) {
			console.error('Error deleting parameter:', error);
			alert(__('خطا در حذف پارامتر', 'tabesh-v2'));
		}
	};

	if (loading) {
		return (
			<div className="tabesh-loading">
				{__('در حال بارگذاری...', 'tabesh-v2')}
			</div>
		);
	}

	return (
		<div className="book-printing-parameters-tab">
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
								onClick={() => deleteParameter('book-sizes', item.id)}
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
						onClick={() => addParameter('book-sizes', newBookSize, setBookSizes, () => setNewBookSize({ name: '', prompt_master: '' }))}
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
								onClick={() => deleteParameter('paper-types', item.id)}
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
						onClick={() => addParameter('paper-types', newPaperType, setPaperTypes, () => setNewPaperType({ name: '', prompt_master: '' }))}
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
								onClick={() => deleteParameter('paper-weights', item.id)}
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
						onClick={() => addParameter('paper-weights', newPaperWeight, setPaperWeights, () => setNewPaperWeight({ paper_type_id: '', weight: '', prompt_master: '' }))}
						disabled={!newPaperWeight.paper_type_id || !newPaperWeight.weight}
					>
						{__('افزودن گرماژ', 'tabesh-v2')}
					</button>
				</div>
			</Section>

			{/* Print Types Section */}
			<Section
				title={__('انواع چاپ', 'tabesh-v2')}
				description={__('مدیریت روشهای چاپ (سیاه‌وسفید، رنگی، ترکیبی)', 'tabesh-v2')}
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
								onClick={() => deleteParameter('print-types', item.id)}
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
						onClick={() => addParameter('print-types', newPrintType, setPrintTypes, () => setNewPrintType({ name: '', prompt_master: '' }))}
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
								onClick={() => deleteParameter('license-types', item.id)}
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
							placeholder={__('مثال: مجوز شخصی', 'tabesh-v2')}
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
						onClick={() => addParameter('license-types', newLicenseType, setLicenseTypes, () => setNewLicenseType({ name: '', prompt_master: '' }))}
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
								onClick={() => deleteParameter('cover-weights', item.id)}
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
							placeholder={__('مثال: 250', 'tabesh-v2')}
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
						onClick={() => addParameter('cover-weights', newCoverWeight, setCoverWeights, () => setNewCoverWeight({ weight: '', prompt_master: '' }))}
						disabled={!newCoverWeight.weight}
					>
						{__('افزودن گرماژ جلد', 'tabesh-v2')}
					</button>
				</div>
			</Section>

			{/* Lamination Types Section */}
			<Section
				title={__('انواع سلفون جلد', 'tabesh-v2')}
				description={__('مدیریت انواع پوشش سلفون', 'tabesh-v2')}
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
								onClick={() => deleteParameter('lamination-types', item.id)}
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
						onClick={() => addParameter('lamination-types', newLaminationType, setLaminationTypes, () => setNewLaminationType({ name: '', prompt_master: '' }))}
						disabled={!newLaminationType.name}
					>
						{__('افزودن نوع سلفون', 'tabesh-v2')}
					</button>
				</div>
			</Section>

			{/* Additional Services Section */}
			<Section
				title={__('خدمات اضافی', 'tabesh-v2')}
				description={__('مدیریت خدمات تکمیلی چاپ', 'tabesh-v2')}
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
								onClick={() => deleteParameter('additional-services', item.id)}
							>
								{__('حذف', 'tabesh-v2')}
							</button>
						</div>
					))}
				</div>

				<div className="parameter-add-form">
					<FormGroup label={__('نام خدمت', 'tabesh-v2')}>
						<TextInput
							name="service_name"
							value={newAdditionalService.name}
							onChange={(e) => setNewAdditionalService({ ...newAdditionalService, name: e.target.value })}
							placeholder={__('مثال: شیرینک', 'tabesh-v2')}
						/>
					</FormGroup>
					<FormGroup label={__('پرامپت مستر', 'tabesh-v2')}>
						<textarea
							name="service_prompt"
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
						onClick={() => addParameter('additional-services', newAdditionalService, setAdditionalServices, () => setNewAdditionalService({ name: '', prompt_master: '' }))}
						disabled={!newAdditionalService.name}
					>
						{__('افزودن خدمت', 'tabesh-v2')}
					</button>
				</div>
			</Section>
		</div>
	);
};

export default BookPrintingParametersTab;
