import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	FormGroup,
	TextInput,
	Section,
} from '../components/FormComponents';

/**
 * Book Pricing Matrix Tab Component.
 * 
 * Manages pricing configuration for book printing based on:
 * - Page cost (paper type, weight, print type)
 * - Binding cost (binding type, cover weight)
 * - Additional services
 * - Service restrictions per binding type
 * - Circulation and page limits
 *
 * @param {Object} props Component props
 */
const BookPricingMatrixTab = () => {
	// Selected book size for configuration
	const [selectedBookSize, setSelectedBookSize] = useState('');
	const [bookSizes, setBookSizes] = useState([]);
	
	// Parameters needed for pricing
	const [paperTypes, setPaperTypes] = useState([]);
	const [paperWeights, setPaperWeights] = useState([]);
	const [printTypes, setPrintTypes] = useState([]);
	const [bindingTypes, setBindingTypes] = useState([]);
	const [coverWeights, setCoverWeights] = useState([]);
	const [additionalServices, setAdditionalServices] = useState([]);
	
	// Pricing data for selected book size
	const [pageCosts, setPageCosts] = useState([]);
	const [bindingCosts, setBindingCosts] = useState([]);
	const [servicePricing, setServicePricing] = useState([]);
	const [serviceRestrictions, setServiceRestrictions] = useState([]);
	const [sizeLimits, setSizeLimits] = useState({
		min_circulation: 1,
		max_circulation: 10000,
		circulation_step: 1,
		min_pages: 1,
		max_pages: 1000,
		pages_step: 1,
	});
	
	// Loading states
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	
	// Active tab within pricing configuration
	const [activeTab, setActiveTab] = useState('page-cost');
	
	// Load initial data
	useEffect(() => {
		loadInitialData();
	}, []);
	
	// Load pricing data when book size changes
	useEffect(() => {
		if (selectedBookSize) {
			loadPricingData(selectedBookSize);
		}
	}, [selectedBookSize]);
	
	/**
	 * Load all initial parameters
	 */
	const loadInitialData = async () => {
		setLoading(true);
		try {
			const [
				sizesData,
				paperTypesData,
				paperWeightsData,
				printTypesData,
				bindingTypesData,
				coverWeightsData,
				servicesData,
			] = await Promise.all([
				apiFetch({ path: '/tabesh/v2/book-params/book-sizes' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/print-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/binding-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/cover-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/additional-services' }),
			]);
			
			// Validate all API responses
			const responses = [
				{ name: 'book-sizes', data: sizesData },
				{ name: 'paper-types', data: paperTypesData },
				{ name: 'paper-weights', data: paperWeightsData },
				{ name: 'print-types', data: printTypesData },
				{ name: 'binding-types', data: bindingTypesData },
				{ name: 'cover-weights', data: coverWeightsData },
				{ name: 'additional-services', data: servicesData },
			];
			
			for (const response of responses) {
				if (!response.data || response.data.success === false) {
					throw new Error(`Invalid response from ${response.name} endpoint`);
				}
			}
			
			setBookSizes(sizesData.data || []);
			setPaperTypes(paperTypesData.data || []);
			setPaperWeights(paperWeightsData.data || []);
			setPrintTypes(printTypesData.data || []);
			setBindingTypes(bindingTypesData.data || []);
			setCoverWeights(coverWeightsData.data || []);
			setAdditionalServices(servicesData.data || []);
			
			// Auto-select first book size if available
			if (sizesData.data && sizesData.data.length > 0) {
				setSelectedBookSize(sizesData.data[0].id);
			}
		} catch (error) {
			console.error('Error loading initial data:', error);
			const errorMessage = error.message || __('خطا در بارگذاری پارامترهای محصول', 'tabesh-v2');
			alert(`${__('خطا', 'tabesh-v2')}: ${errorMessage}`);
		}
		setLoading(false);
	};
	
	/**
	 * Load pricing data for a specific book size
	 */
	const loadPricingData = async (bookSizeId) => {
		try {
			const [
				pageCostData,
				bindingData,
				servicesData,
				restrictionsData,
				limitsData,
			] = await Promise.all([
				apiFetch({ path: `/tabesh/v2/book-pricing/page-cost?book_size_id=${bookSizeId}` }),
				apiFetch({ path: `/tabesh/v2/book-pricing/binding?book_size_id=${bookSizeId}` }),
				apiFetch({ path: `/tabesh/v2/book-pricing/additional-services?book_size_id=${bookSizeId}` }),
				apiFetch({ path: `/tabesh/v2/book-pricing/service-restrictions?book_size_id=${bookSizeId}` }),
				apiFetch({ path: `/tabesh/v2/book-pricing/size-limits?book_size_id=${bookSizeId}` }),
			]);
			
			setPageCosts(pageCostData.data || []);
			setBindingCosts(bindingData.data || []);
			setServicePricing(servicesData.data || []);
			setServiceRestrictions(restrictionsData.data || []);
			
			// Handle size limits - API returns object or null
			const defaultLimits = {
				min_circulation: 1,
				max_circulation: 10000,
				circulation_step: 1,
				min_pages: 1,
				max_pages: 1000,
				pages_step: 1,
			};
			
			if (limitsData.data && typeof limitsData.data === 'object' && !Array.isArray(limitsData.data)) {
				setSizeLimits({ ...defaultLimits, ...limitsData.data });
			} else {
				setSizeLimits(defaultLimits);
			}
		} catch (error) {
			console.error('Error loading pricing data:', error);
			alert(__('خطا در بارگذاری اطلاعات قیمت‌گذاری', 'tabesh-v2'));
		}
	};
	
	/**
	 * Save page cost pricing
	 */
	const savePageCost = async (paperTypeId, paperWeightId, printTypeId, price, isEnabled) => {
		if (!selectedBookSize) return;
		
		setSaving(true);
		try {
			await apiFetch({
				path: '/tabesh/v2/book-pricing/page-cost',
				method: 'POST',
				data: {
					book_size_id: selectedBookSize,
					paper_type_id: paperTypeId,
					paper_weight_id: paperWeightId,
					print_type_id: printTypeId,
					price: price,
					is_enabled: isEnabled,
				},
			});
			
			// Reload pricing data
			await loadPricingData(selectedBookSize);
		} catch (error) {
			console.error('Error saving page cost:', error);
			alert(__('خطا در ذخیره قیمت', 'tabesh-v2'));
		}
		setSaving(false);
	};
	
	/**
	 * Save binding cost pricing
	 */
	const saveBindingCost = async (bindingTypeId, coverWeightId, price, isEnabled) => {
		if (!selectedBookSize) return;
		
		setSaving(true);
		try {
			await apiFetch({
				path: '/tabesh/v2/book-pricing/binding',
				method: 'POST',
				data: {
					book_size_id: selectedBookSize,
					binding_type_id: bindingTypeId,
					cover_weight_id: coverWeightId,
					price: price,
					is_enabled: isEnabled,
				},
			});
			
			// Reload pricing data
			await loadPricingData(selectedBookSize);
		} catch (error) {
			console.error('Error saving binding cost:', error);
			alert(__('خطا در ذخیره قیمت صحافی', 'tabesh-v2'));
		}
		setSaving(false);
	};
	
	/**
	 * Save additional service pricing
	 */
	const saveServicePricing = async (serviceId, price, calculationType, pagesPerUnit, isEnabled) => {
		if (!selectedBookSize) return;
		
		setSaving(true);
		try {
			await apiFetch({
				path: '/tabesh/v2/book-pricing/additional-services',
				method: 'POST',
				data: {
					book_size_id: selectedBookSize,
					service_id: serviceId,
					price: price,
					calculation_type: calculationType,
					pages_per_unit: pagesPerUnit,
					is_enabled: isEnabled,
				},
			});
			
			// Reload pricing data
			await loadPricingData(selectedBookSize);
		} catch (error) {
			console.error('Error saving service pricing:', error);
			alert(__('خطا در ذخیره قیمت خدمات', 'tabesh-v2'));
		}
		setSaving(false);
	};
	
	/**
	 * Save service binding restriction
	 */
	const saveServiceRestriction = async (serviceId, bindingTypeId, isEnabled) => {
		if (!selectedBookSize) return;
		
		setSaving(true);
		try {
			await apiFetch({
				path: '/tabesh/v2/book-pricing/service-restrictions',
				method: 'POST',
				data: {
					book_size_id: selectedBookSize,
					service_id: serviceId,
					binding_type_id: bindingTypeId,
					is_enabled: isEnabled,
				},
			});
			
			// Reload pricing data
			await loadPricingData(selectedBookSize);
		} catch (error) {
			console.error('Error saving service restriction:', error);
			alert(__('خطا در ذخیره محدودیت', 'tabesh-v2'));
		}
		setSaving(false);
	};
	
	/**
	 * Save size limits
	 */
	const saveSizeLimits = async () => {
		if (!selectedBookSize) return;
		
		setSaving(true);
		try {
			await apiFetch({
				path: '/tabesh/v2/book-pricing/size-limits',
				method: 'POST',
				data: {
					book_size_id: selectedBookSize,
					...sizeLimits,
				},
			});
			
			alert(__('محدودیت‌ها با موفقیت ذخیره شد', 'tabesh-v2'));
		} catch (error) {
			console.error('Error saving size limits:', error);
			alert(__('خطا در ذخیره محدودیت‌ها', 'tabesh-v2'));
		}
		setSaving(false);
	};
	
	/**
	 * Get page cost for a specific combination
	 */
	const getPageCost = (paperTypeId, paperWeightId, printTypeId) => {
		return pageCosts.find(
			pc => pc.paper_type_id == paperTypeId && 
				  pc.paper_weight_id == paperWeightId && 
				  pc.print_type_id == printTypeId
		);
	};
	
	/**
	 * Get binding cost for a specific combination
	 */
	const getBindingCost = (bindingTypeId, coverWeightId) => {
		return bindingCosts.find(
			bc => bc.binding_type_id == bindingTypeId && 
				  bc.cover_weight_id == coverWeightId
		);
	};
	
	/**
	 * Get service pricing
	 */
	const getServicePricing = (serviceId) => {
		return servicePricing.find(sp => sp.service_id == serviceId);
	};
	
	/**
	 * Get service restriction
	 */
	const getServiceRestriction = (serviceId, bindingTypeId) => {
		return serviceRestrictions.find(
			sr => sr.service_id == serviceId && sr.binding_type_id == bindingTypeId
		);
	};
	
	if (loading) {
		return (
			<div className="tabesh-loading">
				{__('در حال بارگذاری...', 'tabesh-v2')}
			</div>
		);
	}
	
	if (bookSizes.length === 0) {
		return (
			<div className="tabesh-notice">
				<p>{__('ابتدا باید در بخش پارامتر محصول، قطع کتاب‌ها را تعریف کنید.', 'tabesh-v2')}</p>
			</div>
		);
	}
	
	return (
		<div className="book-pricing-matrix-tab">
			<Section
				title={__('قیمت‌گذاری ماتریسی کتاب', 'tabesh-v2')}
				description={__('تنظیم قیمت‌ها و قوانین برای هر قطع کتاب', 'tabesh-v2')}
			>
				{/* Book Size Selector */}
				<div className="book-size-selector" style={{ marginBottom: '20px' }}>
					<FormGroup label={__('انتخاب قطع کتاب', 'tabesh-v2')}>
						<select
							value={selectedBookSize}
							onChange={(e) => setSelectedBookSize(e.target.value)}
							className="regular-text"
						>
							{bookSizes.map((size) => (
								<option key={size.id} value={size.id}>
									{size.name}
								</option>
							))}
						</select>
					</FormGroup>
				</div>
				
				{selectedBookSize && (
					<>
						{/* Tab Navigation */}
						<div className="pricing-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
							<button
								type="button"
								className={`tab-button ${activeTab === 'page-cost' ? 'active' : ''}`}
								onClick={() => setActiveTab('page-cost')}
								style={{ padding: '10px 20px', marginRight: '10px' }}
							>
								{__('هزینه هر صفحه', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'binding' ? 'active' : ''}`}
								onClick={() => setActiveTab('binding')}
								style={{ padding: '10px 20px', marginRight: '10px' }}
							>
								{__('هزینه صحافی و جلد', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
								onClick={() => setActiveTab('services')}
								style={{ padding: '10px 20px', marginRight: '10px' }}
							>
								{__('خدمات اضافی', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'restrictions' ? 'active' : ''}`}
								onClick={() => setActiveTab('restrictions')}
								style={{ padding: '10px 20px', marginRight: '10px' }}
							>
								{__('محدودیت‌های خدمات', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'limits' ? 'active' : ''}`}
								onClick={() => setActiveTab('limits')}
								style={{ padding: '10px 20px' }}
							>
								{__('محدودیت‌های تیراژ و صفحه', 'tabesh-v2')}
							</button>
						</div>
						
						{/* Tab Content */}
						<div className="pricing-tab-content">
							{activeTab === 'page-cost' && (
								<PageCostMatrix
									paperTypes={paperTypes}
									paperWeights={paperWeights}
									printTypes={printTypes}
									pageCosts={pageCosts}
									getPageCost={getPageCost}
									savePageCost={savePageCost}
									saving={saving}
								/>
							)}
							
							{activeTab === 'binding' && (
								<BindingCostMatrix
									bindingTypes={bindingTypes}
									coverWeights={coverWeights}
									bindingCosts={bindingCosts}
									getBindingCost={getBindingCost}
									saveBindingCost={saveBindingCost}
									saving={saving}
								/>
							)}
							
							{activeTab === 'services' && (
								<AdditionalServicesConfig
									additionalServices={additionalServices}
									servicePricing={servicePricing}
									getServicePricing={getServicePricing}
									saveServicePricing={saveServicePricing}
									saving={saving}
								/>
							)}
							
							{activeTab === 'restrictions' && (
								<ServiceBindingRestrictions
									additionalServices={additionalServices}
									bindingTypes={bindingTypes}
									serviceRestrictions={serviceRestrictions}
									getServiceRestriction={getServiceRestriction}
									saveServiceRestriction={saveServiceRestriction}
									saving={saving}
								/>
							)}
							
							{activeTab === 'limits' && (
								<SizeLimitsForm
									sizeLimits={sizeLimits}
									setSizeLimits={setSizeLimits}
									saveSizeLimits={saveSizeLimits}
									saving={saving}
								/>
							)}
						</div>
					</>
				)}
			</Section>
		</div>
	);
};

/**
 * Page Cost Matrix Component
 */
const PageCostMatrix = ({ paperTypes, paperWeights, printTypes, getPageCost, savePageCost, saving }) => {
	const [editingCell, setEditingCell] = useState(null);
	const [tempValue, setTempValue] = useState('');
	
	const handleSave = async (paperTypeId, paperWeightId, printTypeId) => {
		const existing = getPageCost(paperTypeId, paperWeightId, printTypeId);
		await savePageCost(paperTypeId, paperWeightId, printTypeId, tempValue, existing ? existing.is_enabled : 1);
		setEditingCell(null);
	};
	
	const toggleEnabled = async (paperTypeId, paperWeightId, printTypeId) => {
		const existing = getPageCost(paperTypeId, paperWeightId, printTypeId);
		await savePageCost(paperTypeId, paperWeightId, printTypeId, existing?.price || 0, existing ? !existing.is_enabled : 0);
	};
	
	// Group paper weights by paper type
	const weightsByType = {};
	paperWeights.forEach(pw => {
		if (!weightsByType[pw.paper_type_id]) {
			weightsByType[pw.paper_type_id] = [];
		}
		weightsByType[pw.paper_type_id].push(pw);
	});
	
	// Check if we have any data to display
	const hasData = paperTypes.length > 0 && paperWeights.length > 0 && printTypes.length > 0;
	
	if (!hasData) {
		return (
			<div className="tabesh-notice">
				<p>{__('برای نمایش ماتریس قیمت، ابتدا باید در بخش پارامتر محصول، نوع کاغذ، گرماژ و نوع چاپ را تعریف کنید.', 'tabesh-v2')}</p>
			</div>
		);
	}
	
	return (
		<div className="page-cost-matrix">
			<h3>{__('هزینه هر صفحه (کاغذ + چاپ)', 'tabesh-v2')}</h3>
			<p>{__('قیمت نهایی هر صفحه شامل هزینه کاغذ و چاپ است', 'tabesh-v2')}</p>
			
			{paperTypes.map((paperType) => {
				const weights = weightsByType[paperType.id] || [];
				if (weights.length === 0) return null;
				
				return (
					<div key={paperType.id} className="paper-type-section" style={{ marginBottom: '30px' }}>
						<h4>{paperType.name}:</h4>
						<table className="wp-list-table widefat fixed striped">
							<thead>
								<tr>
									<th>{__('گرماژ', 'tabesh-v2')}</th>
									{printTypes.map(pt => (
										<th key={pt.id}>{pt.name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{weights.map((weight) => (
									<tr key={weight.id}>
										<td><strong>{weight.weight} {__('گرم', 'tabesh-v2')}</strong></td>
										{printTypes.map(printType => {
											const cellKey = `${paperType.id}-${weight.id}-${printType.id}`;
											const cost = getPageCost(paperType.id, weight.id, printType.id);
											const isEditing = editingCell === cellKey;
											
											return (
												<td key={printType.id}>
													<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
														{isEditing ? (
															<>
																<input
																	type="number"
																	value={tempValue}
																	onChange={(e) => setTempValue(e.target.value)}
																	style={{ width: '100px' }}
																	disabled={saving}
																/>
																<button
																	type="button"
																	className="button button-small"
																	onClick={() => handleSave(paperType.id, weight.id, printType.id)}
																	disabled={saving}
																>
																	{__('ذخیره', 'tabesh-v2')}
																</button>
																<button
																	type="button"
																	className="button button-small"
																	onClick={() => setEditingCell(null)}
																	disabled={saving}
																>
																	{__('لغو', 'tabesh-v2')}
																</button>
															</>
														) : (
															<>
																<span
																	onClick={() => {
																		setEditingCell(cellKey);
																		setTempValue(cost?.price || '0');
																	}}
																	style={{ cursor: 'pointer', flex: 1 }}
																>
																	{cost && cost.is_enabled ? (
																		`${cost.price} ${__('تومان', 'tabesh-v2')}`
																	) : (
																		__('غیر فعال', 'tabesh-v2')
																	)}
																</span>
																<input
																	type="checkbox"
																	checked={cost ? Boolean(cost.is_enabled) : false}
																	onChange={() => toggleEnabled(paperType.id, weight.id, printType.id)}
																	disabled={saving}
																	title={__('فعال/غیرفعال', 'tabesh-v2')}
																/>
															</>
														)}
													</div>
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			})}
		</div>
	);
};

/**
 * Binding Cost Matrix Component
 */
const BindingCostMatrix = ({ bindingTypes, coverWeights, getBindingCost, saveBindingCost, saving }) => {
	const [editingCell, setEditingCell] = useState(null);
	const [tempValue, setTempValue] = useState('');
	
	const handleSave = async (bindingTypeId, coverWeightId) => {
		const existing = getBindingCost(bindingTypeId, coverWeightId);
		await saveBindingCost(bindingTypeId, coverWeightId, tempValue, existing ? existing.is_enabled : 1);
		setEditingCell(null);
	};
	
	const toggleEnabled = async (bindingTypeId, coverWeightId) => {
		const existing = getBindingCost(bindingTypeId, coverWeightId);
		await saveBindingCost(bindingTypeId, coverWeightId, existing?.price || 0, existing ? !existing.is_enabled : 0);
	};
	
	// Check if we have any data to display
	if (bindingTypes.length === 0 || coverWeights.length === 0) {
		return (
			<div className="tabesh-notice">
				<p>{__('برای نمایش ماتریس قیمت صحافی، ابتدا باید در بخش پارامتر محصول، انواع صحافی و گرماژ جلد را تعریف کنید.', 'tabesh-v2')}</p>
			</div>
		);
	}
	
	return (
		<div className="binding-cost-matrix">
			<h3>{__('هزینه صحافی و جلد', 'tabesh-v2')}</h3>
			<p>{__('هزینه صحافی برای هر ترکیب صحافی و گرماژ جلد', 'tabesh-v2')}</p>
			
			{bindingTypes.map((bindingType) => (
				<div key={bindingType.id} className="binding-type-section" style={{ marginBottom: '30px' }}>
					<h4>{bindingType.name}:</h4>
					<table className="wp-list-table widefat fixed striped">
						<thead>
							<tr>
								<th>{__('گرماژ جلد', 'tabesh-v2')}</th>
								<th>{__('هزینه جلد و صحافی', 'tabesh-v2')}</th>
							</tr>
						</thead>
						<tbody>
							{coverWeights.map((weight) => {
								const cellKey = `${bindingType.id}-${weight.id}`;
								const cost = getBindingCost(bindingType.id, weight.id);
								const isEditing = editingCell === cellKey;
								
								return (
									<tr key={weight.id}>
										<td><strong>{weight.weight} {__('گرم', 'tabesh-v2')}</strong></td>
										<td>
											<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
												{isEditing ? (
													<>
														<input
															type="number"
															value={tempValue}
															onChange={(e) => setTempValue(e.target.value)}
															style={{ width: '150px' }}
															disabled={saving}
														/>
														<button
															type="button"
															className="button button-small"
															onClick={() => handleSave(bindingType.id, weight.id)}
															disabled={saving}
														>
															{__('ذخیره', 'tabesh-v2')}
														</button>
														<button
															type="button"
															className="button button-small"
															onClick={() => setEditingCell(null)}
															disabled={saving}
														>
															{__('لغو', 'tabesh-v2')}
														</button>
													</>
												) : (
													<>
														<span
															onClick={() => {
																setEditingCell(cellKey);
																setTempValue(cost?.price || '0');
															}}
															style={{ cursor: 'pointer', flex: 1 }}
														>
															{cost && cost.is_enabled ? (
																`${cost.price} ${__('تومان', 'tabesh-v2')}`
															) : (
																__('غیر مجاز', 'tabesh-v2')
															)}
														</span>
														<input
															type="checkbox"
															checked={cost ? Boolean(cost.is_enabled) : false}
															onChange={() => toggleEnabled(bindingType.id, weight.id)}
															disabled={saving}
															title={__('مجاز/غیرمجاز', 'tabesh-v2')}
														/>
													</>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			))}
		</div>
	);
};

/**
 * Additional Services Config Component
 */
const AdditionalServicesConfig = ({ additionalServices, getServicePricing, saveServicePricing, saving }) => {
	const [editingService, setEditingService] = useState(null);
	const [tempData, setTempData] = useState({});
	
	const handleEdit = (serviceId) => {
		const pricing = getServicePricing(serviceId);
		setEditingService(serviceId);
		setTempData({
			price: pricing?.price || '0',
			calculation_type: pricing?.calculation_type || 'fixed',
			pages_per_unit: pricing?.pages_per_unit || '',
			is_enabled: pricing ? Boolean(pricing.is_enabled) : true,
		});
	};
	
	const handleSave = async (serviceId) => {
		await saveServicePricing(
			serviceId,
			tempData.price,
			tempData.calculation_type,
			tempData.pages_per_unit || null,
			tempData.is_enabled
		);
		setEditingService(null);
	};
	
	// Check if we have any data to display
	if (additionalServices.length === 0) {
		return (
			<div className="tabesh-notice">
				<p>{__('برای نمایش خدمات اضافی، ابتدا باید در بخش پارامتر محصول، خدمات اضافی را تعریف کنید.', 'tabesh-v2')}</p>
			</div>
		);
	}
	
	return (
		<div className="additional-services-config">
			<h3>{__('خدمات اضافی', 'tabesh-v2')}</h3>
			<p>{__('تنظیم قیمت و نحوه محاسبه برای خدمات اضافی', 'tabesh-v2')}</p>
			
			<table className="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th>{__('نام خدمات', 'tabesh-v2')}</th>
						<th>{__('قیمت (تومان)', 'tabesh-v2')}</th>
						<th>{__('نوع محاسبه', 'tabesh-v2')}</th>
						<th>{__('تعداد صفحه', 'tabesh-v2')}</th>
						<th>{__('عملیات', 'tabesh-v2')}</th>
					</tr>
				</thead>
				<tbody>
					{additionalServices.map((service) => {
						const pricing = getServicePricing(service.id);
						const isEditing = editingService === service.id;
						
						return (
							<tr key={service.id}>
								<td><strong>{service.name}</strong></td>
								<td>
									{isEditing ? (
										<input
											type="number"
											value={tempData.price}
											onChange={(e) => setTempData({ ...tempData, price: e.target.value })}
											style={{ width: '120px' }}
											disabled={saving}
										/>
									) : (
										<span>{pricing?.price || '0'} {__('تومان', 'tabesh-v2')}</span>
									)}
								</td>
								<td>
									{isEditing ? (
										<select
											value={tempData.calculation_type}
											onChange={(e) => setTempData({ ...tempData, calculation_type: e.target.value })}
											style={{ width: '150px' }}
											disabled={saving}
										>
											<option value="fixed">{__('ثابت', 'tabesh-v2')}</option>
											<option value="per_copy">{__('به ازای هر جلد', 'tabesh-v2')}</option>
											<option value="per_pages">{__('بر اساس تعداد صفحه', 'tabesh-v2')}</option>
										</select>
									) : (
										<span>
											{pricing?.calculation_type === 'fixed' && __('ثابت', 'tabesh-v2')}
											{pricing?.calculation_type === 'per_copy' && __('به ازای هر جلد', 'tabesh-v2')}
											{pricing?.calculation_type === 'per_pages' && __('بر اساس تعداد صفحه', 'tabesh-v2')}
											{!pricing && __('ثابت', 'tabesh-v2')}
										</span>
									)}
								</td>
								<td>
									{isEditing && tempData.calculation_type === 'per_pages' ? (
										<input
											type="number"
											value={tempData.pages_per_unit}
											onChange={(e) => setTempData({ ...tempData, pages_per_unit: e.target.value })}
											placeholder={__('مثال: 10000', 'tabesh-v2')}
											style={{ width: '120px' }}
											disabled={saving}
										/>
									) : (
										<span>
											{pricing?.calculation_type === 'per_pages' && pricing?.pages_per_unit
												? `${pricing.pages_per_unit} ${__('صفحه', 'tabesh-v2')}`
												: __('غیر فعال', 'tabesh-v2')}
										</span>
									)}
								</td>
								<td>
									{isEditing ? (
										<>
											<button
												type="button"
												className="button button-small button-primary"
												onClick={() => handleSave(service.id)}
												disabled={saving}
											>
												{__('ذخیره', 'tabesh-v2')}
											</button>
											{' '}
											<button
												type="button"
												className="button button-small"
												onClick={() => setEditingService(null)}
												disabled={saving}
											>
												{__('لغو', 'tabesh-v2')}
											</button>
										</>
									) : (
										<button
											type="button"
											className="button button-small"
											onClick={() => handleEdit(service.id)}
										>
											{__('ویرایش', 'tabesh-v2')}
										</button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

/**
 * Service Binding Restrictions Component
 */
const ServiceBindingRestrictions = ({ additionalServices, bindingTypes, getServiceRestriction, saveServiceRestriction, saving }) => {
	const toggleRestriction = async (serviceId, bindingTypeId) => {
		const existing = getServiceRestriction(serviceId, bindingTypeId);
		await saveServiceRestriction(serviceId, bindingTypeId, existing ? !existing.is_enabled : 1);
	};
	
	// Check if we have any data to display
	if (additionalServices.length === 0 || bindingTypes.length === 0) {
		return (
			<div className="tabesh-notice">
				<p>{__('برای نمایش محدودیت‌های خدمات، ابتدا باید در بخش پارامتر محصول، خدمات اضافی و انواع صحافی را تعریف کنید.', 'tabesh-v2')}</p>
			</div>
		);
	}
	
	return (
		<div className="service-binding-restrictions">
			<h3>{__('محدودیت‌های خدمات اضافی بر اساس نوع صحافی', 'tabesh-v2')}</h3>
			<p>{__('تعیین اینکه هر خدمت برای کدام نوع صحافی مجاز است', 'tabesh-v2')}</p>
			
			{additionalServices.map((service) => (
				<div key={service.id} className="service-restriction-section" style={{ marginBottom: '30px' }}>
					<h4>{service.name}:</h4>
					<table className="wp-list-table widefat fixed striped">
						<thead>
							<tr>
								<th>{__('نوع صحافی', 'tabesh-v2')}</th>
								<th>{__('وضعیت', 'tabesh-v2')}</th>
							</tr>
						</thead>
						<tbody>
							{bindingTypes.map((bindingType) => {
								const restriction = getServiceRestriction(service.id, bindingType.id);
								const isEnabled = restriction ? Boolean(restriction.is_enabled) : true;
								
								return (
									<tr key={bindingType.id}>
										<td><strong>{bindingType.name}</strong></td>
										<td>
											<label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
												<input
													type="checkbox"
													checked={isEnabled}
													onChange={() => toggleRestriction(service.id, bindingType.id)}
													disabled={saving}
												/>
												<span>{isEnabled ? __('فعال', 'tabesh-v2') : __('غیر فعال', 'tabesh-v2')}</span>
											</label>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			))}
		</div>
	);
};

/**
 * Size Limits Form Component
 */
const SizeLimitsForm = ({ sizeLimits, setSizeLimits, saveSizeLimits, saving }) => {
	return (
		<div className="size-limits-form">
			<h3>{__('محدودیت‌های تیراژ و تعداد صفحه', 'tabesh-v2')}</h3>
			<p>{__('تعیین حداقل، حداکثر و گام حرکتی برای تیراژ و تعداد صفحات', 'tabesh-v2')}</p>
			
			<div style={{ maxWidth: '600px' }}>
				<h4>{__('تیراژ', 'tabesh-v2')}</h4>
				<FormGroup label={__('حد اقل تیراژ', 'tabesh-v2')}>
					<TextInput
						type="number"
						value={sizeLimits.min_circulation}
						onChange={(e) => setSizeLimits({ ...sizeLimits, min_circulation: e.target.value })}
					/>
				</FormGroup>
				<FormGroup label={__('حد اکثر تیراژ', 'tabesh-v2')}>
					<TextInput
						type="number"
						value={sizeLimits.max_circulation}
						onChange={(e) => setSizeLimits({ ...sizeLimits, max_circulation: e.target.value })}
					/>
				</FormGroup>
				<FormGroup label={__('گام تغییر تیراژ', 'tabesh-v2')}>
					<TextInput
						type="number"
						value={sizeLimits.circulation_step}
						onChange={(e) => setSizeLimits({ ...sizeLimits, circulation_step: e.target.value })}
					/>
				</FormGroup>
				
				<h4 style={{ marginTop: '30px' }}>{__('تعداد صفحه', 'tabesh-v2')}</h4>
				<FormGroup label={__('حد اقل صفحه', 'tabesh-v2')}>
					<TextInput
						type="number"
						value={sizeLimits.min_pages}
						onChange={(e) => setSizeLimits({ ...sizeLimits, min_pages: e.target.value })}
					/>
				</FormGroup>
				<FormGroup label={__('حد اکثر صفحه', 'tabesh-v2')}>
					<TextInput
						type="number"
						value={sizeLimits.max_pages}
						onChange={(e) => setSizeLimits({ ...sizeLimits, max_pages: e.target.value })}
					/>
				</FormGroup>
				<FormGroup label={__('گام حرکتی صفحه', 'tabesh-v2')}>
					<TextInput
						type="number"
						value={sizeLimits.pages_step}
						onChange={(e) => setSizeLimits({ ...sizeLimits, pages_step: e.target.value })}
					/>
				</FormGroup>
				
				<button
					type="button"
					className="button button-primary"
					onClick={saveSizeLimits}
					disabled={saving}
					style={{ marginTop: '20px' }}
				>
					{saving ? __('در حال ذخیره...', 'tabesh-v2') : __('ذخیره محدودیت‌ها', 'tabesh-v2')}
				</button>
			</div>
		</div>
	);
};

export default BookPricingMatrixTab;
