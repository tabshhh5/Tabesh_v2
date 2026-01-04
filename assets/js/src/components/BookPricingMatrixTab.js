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
	const [licenseTypes, setLicenseTypes] = useState([]);
	
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
	const [licensePricing, setLicensePricing] = useState([]);
	
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
				licenseTypesData,
				licensePricingData,
			] = await Promise.all([
				apiFetch({ path: '/tabesh/v2/book-params/book-sizes' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/paper-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/print-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/binding-types' }),
				apiFetch({ path: '/tabesh/v2/book-params/cover-weights' }),
				apiFetch({ path: '/tabesh/v2/book-params/additional-services' }),
				apiFetch({ path: '/tabesh/v2/book-params/license-types' }),
				apiFetch({ path: '/tabesh/v2/book-pricing/license-pricing' }),
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
				{ name: 'license-types', data: licenseTypesData },
				{ name: 'license-pricing', data: licensePricingData },
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
			setLicenseTypes(licenseTypesData.data || []);
			setLicensePricing(licensePricingData.data || []);
			
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
	 * Save license pricing
	 */
	const saveLicensePricing = async (licenseTypeId, price, isEnabled) => {
		setSaving(true);
		try {
			await apiFetch({
				path: '/tabesh/v2/book-pricing/license-pricing',
				method: 'POST',
				data: {
					license_type_id: licenseTypeId,
					price: price,
					is_enabled: isEnabled,
				},
			});
			
			// Reload license pricing data
			const licensePricingData = await apiFetch({ path: '/tabesh/v2/book-pricing/license-pricing' });
			setLicensePricing(licensePricingData.data || []);
		} catch (error) {
			console.error('Error saving license pricing:', error);
			alert(__('خطا در ذخیره قیمت مجوز', 'tabesh-v2'));
		}
		setSaving(false);
	};
	
	/**
	 * Get page cost for a specific combination - returns default 0 if not found
	 */
	const getPageCost = (paperTypeId, paperWeightId, printTypeId) => {
		const existing = pageCosts.find(
			pc => pc.paper_type_id === paperTypeId && 
				  pc.paper_weight_id === paperWeightId && 
				  pc.print_type_id === printTypeId
		);
		// Return existing or default to 0 price (disabled)
		return existing || { price: 0, is_enabled: 0 };
	};
	
	/**
	 * Get binding cost for a specific combination - returns default 0 if not found
	 */
	const getBindingCost = (bindingTypeId, coverWeightId) => {
		const existing = bindingCosts.find(
			bc => bc.binding_type_id === bindingTypeId && 
				  bc.cover_weight_id === coverWeightId
		);
		// Return existing or default to 0 price (disabled)
		return existing || { price: 0, is_enabled: 0 };
	};
	
	/**
	 * Get service pricing - returns default 0 if not found
	 */
	const getServicePricing = (serviceId) => {
		const existing = servicePricing.find(sp => sp.service_id === serviceId);
		// Return existing or default configuration
		return existing || { price: 0, calculation_type: 'fixed', pages_per_unit: null, is_enabled: 0 };
	};
	
	/**
	 * Get service restriction
	 */
	const getServiceRestriction = (serviceId, bindingTypeId) => {
		return serviceRestrictions.find(
			sr => sr.service_id === serviceId && sr.binding_type_id === bindingTypeId
		);
	};
	
	/**
	 * Get license pricing - returns default 0 if not found
	 */
	const getLicensePricing = (licenseTypeId) => {
		const existing = licensePricing.find(lp => lp.license_type_id === licenseTypeId);
		// Return existing or default to 0 price (disabled)
		return existing || { price: 0, is_enabled: 0 };
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
				{/* Important Notice */}
				<div style={{ 
					backgroundColor: '#fef3c7', 
					padding: '15px', 
					borderRadius: '4px', 
					marginBottom: '20px',
					border: '2px solid #f59e0b'
				}}>
					<h4 style={{ marginTop: '0', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
						💡 {__('قانون مهم: قیمت پیش‌فرض', 'tabesh-v2')}
					</h4>
					<p style={{ marginBottom: '10px', color: '#78350f', lineHeight: '1.6' }}>
						{__('به صورت پیش‌فرض، تمام پارامترها دارای قیمت 0 تومان هستند. ', 'tabesh-v2')}
						<strong>{__('قیمت 0 به معنای غیرفعال بودن آن گزینه است.', 'tabesh-v2')}</strong>
						{' '}
						{__('برای فعال‌سازی هر ترکیب، باید قیمت مناسب را تعیین کرده و کلید کشویی آن را روشن کنید.', 'tabesh-v2')}
					</p>
					<p style={{ marginBottom: '0', color: '#78350f', lineHeight: '1.6', fontSize: '0.95em' }}>
						📝 {__('توجه: چاپ ترکیبی به صورت جداگانه قیمت‌گذاری نمی‌شود. قیمت نهایی چاپ ترکیبی از جمع صفحات سیاه‌وسفید و رنگی محاسبه می‌گردد.', 'tabesh-v2')}
					</p>
				</div>
				
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
						<div className="pricing-tabs" style={{ 
							marginBottom: '20px', 
							borderBottom: '2px solid #e5e7eb',
							display: 'flex',
							gap: '10px'
						}}>
							<button
								type="button"
								className={`tab-button ${activeTab === 'page-cost' ? 'active' : ''}`}
								onClick={() => setActiveTab('page-cost')}
								style={{ 
									padding: '12px 24px',
									border: 'none',
									borderBottom: activeTab === 'page-cost' ? '3px solid #3b82f6' : '3px solid transparent',
									backgroundColor: activeTab === 'page-cost' ? '#eff6ff' : 'transparent',
									color: activeTab === 'page-cost' ? '#1e40af' : '#6b7280',
									fontWeight: activeTab === 'page-cost' ? 'bold' : 'normal',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontSize: '14px'
								}}
							>
								📄 {__('هزینه هر صفحه', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'binding' ? 'active' : ''}`}
								onClick={() => setActiveTab('binding')}
								style={{ 
									padding: '12px 24px',
									border: 'none',
									borderBottom: activeTab === 'binding' ? '3px solid #8b5cf6' : '3px solid transparent',
									backgroundColor: activeTab === 'binding' ? '#f5f3ff' : 'transparent',
									color: activeTab === 'binding' ? '#6b21a8' : '#6b7280',
									fontWeight: activeTab === 'binding' ? 'bold' : 'normal',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontSize: '14px'
								}}
							>
								📚 {__('هزینه صحافی و جلد', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
								onClick={() => setActiveTab('services')}
								style={{ 
									padding: '12px 24px',
									border: 'none',
									borderBottom: activeTab === 'services' ? '3px solid #10b981' : '3px solid transparent',
									backgroundColor: activeTab === 'services' ? '#ecfdf5' : 'transparent',
									color: activeTab === 'services' ? '#047857' : '#6b7280',
									fontWeight: activeTab === 'services' ? 'bold' : 'normal',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontSize: '14px'
								}}
							>
								⭐ {__('خدمات اضافی', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'restrictions' ? 'active' : ''}`}
								onClick={() => setActiveTab('restrictions')}
								style={{ 
									padding: '12px 24px',
									border: 'none',
									borderBottom: activeTab === 'restrictions' ? '3px solid #f59e0b' : '3px solid transparent',
									backgroundColor: activeTab === 'restrictions' ? '#fffbeb' : 'transparent',
									color: activeTab === 'restrictions' ? '#b45309' : '#6b7280',
									fontWeight: activeTab === 'restrictions' ? 'bold' : 'normal',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontSize: '14px'
								}}
							>
								🔒 {__('محدودیت‌های خدمات', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'limits' ? 'active' : ''}`}
								onClick={() => setActiveTab('limits')}
								style={{ 
									padding: '12px 24px',
									border: 'none',
									borderBottom: activeTab === 'limits' ? '3px solid #ef4444' : '3px solid transparent',
									backgroundColor: activeTab === 'limits' ? '#fef2f2' : 'transparent',
									color: activeTab === 'limits' ? '#b91c1c' : '#6b7280',
									fontWeight: activeTab === 'limits' ? 'bold' : 'normal',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontSize: '14px'
								}}
							>
								📊 {__('محدودیت‌های تیراژ و صفحه', 'tabesh-v2')}
							</button>
							<button
								type="button"
								className={`tab-button ${activeTab === 'license' ? 'active' : ''}`}
								onClick={() => setActiveTab('license')}
								style={{ 
									padding: '12px 24px',
									border: 'none',
									borderBottom: activeTab === 'license' ? '3px solid #6366f1' : '3px solid transparent',
									backgroundColor: activeTab === 'license' ? '#eef2ff' : 'transparent',
									color: activeTab === 'license' ? '#4338ca' : '#6b7280',
									fontWeight: activeTab === 'license' ? 'bold' : 'normal',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontSize: '14px'
								}}
							>
								📜 {__('قیمت‌گذاری مجوز', 'tabesh-v2')}
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
							
							{activeTab === 'license' && (
								<LicensePricingForm
									licenseTypes={licenseTypes}
									licensePricing={licensePricing}
									getLicensePricing={getLicensePricing}
									saveLicensePricing={saveLicensePricing}
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
 * Toggle Switch Component - Modern UI switch for enable/disable
 */
const ToggleSwitch = ({ checked, onChange, disabled, label }) => {
	return (
		<label style={{ 
			display: 'flex', 
			alignItems: 'center', 
			gap: '8px',
			cursor: disabled ? 'not-allowed' : 'pointer',
			opacity: disabled ? 0.6 : 1,
			userSelect: 'none'
		}}>
			<div
				onClick={() => !disabled && onChange()}
				style={{
					position: 'relative',
					width: '44px',
					height: '24px',
					backgroundColor: checked ? '#10b981' : '#e5e7eb',
					borderRadius: '12px',
					transition: 'background-color 0.2s',
					cursor: disabled ? 'not-allowed' : 'pointer',
					boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<div style={{
					position: 'absolute',
					top: '2px',
					left: checked ? '22px' : '2px',
					width: '20px',
					height: '20px',
					backgroundColor: '#ffffff',
					borderRadius: '50%',
					transition: 'left 0.2s',
					boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
				}} />
			</div>
			{label && (
				<span style={{ 
					fontSize: '12px', 
					fontWeight: '500',
					color: checked ? '#065f46' : '#6b7280'
				}}>
					{label}
				</span>
			)}
		</label>
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
		// Toggle the enabled state for this specific combination only
		// Convert to number: if existing and enabled (truthy), set to 0, otherwise set to 1
		const newEnabledState = (existing && existing.is_enabled) ? 0 : 1;
		await savePageCost(paperTypeId, paperWeightId, printTypeId, existing?.price || 0, newEnabledState);
	};
	
	// Group paper weights by paper type
	const weightsByType = {};
	paperWeights.forEach(pw => {
		if (!weightsByType[pw.paper_type_id]) {
			weightsByType[pw.paper_type_id] = [];
		}
		weightsByType[pw.paper_type_id].push(pw);
	});
	
	// Check if we have any data to display - show helpful message but allow viewing
	const hasData = paperTypes.length > 0 && paperWeights.length > 0 && printTypes.length > 0;
	
	if (!hasData) {
		return (
			<div className="tabesh-notice tabesh-notice-info" style={{ 
				padding: '20px', 
				backgroundColor: '#e7f3ff', 
				border: '1px solid #2271b1',
				borderRadius: '4px',
				marginBottom: '20px'
			}}>
				<h3 style={{ marginTop: '0', color: '#2271b1' }}>
					{__('راهنمای تنظیم ماتریس قیمت صفحه', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '10px' }}>
					{__('برای استفاده از ماتریس قیمت، ابتدا باید پارامترهای زیر را در بخش "پارامترهای چاپ کتاب" تعریف کنید:', 'tabesh-v2')}
				</p>
				<ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
					<li>{paperTypes.length === 0 && '❌ '}{__('نوع کاغذ متن (مثال: بالک، تحریر، گلاسه)', 'tabesh-v2')}</li>
					<li>{paperWeights.length === 0 && '❌ '}{__('گرماژ کاغذ متن (مثال: 60، 70، 80 گرم)', 'tabesh-v2')}</li>
					<li>{printTypes.length === 0 && '❌ '}{__('انواع چاپ (مثال: سیاه‌وسفید، رنگی)', 'tabesh-v2')}</li>
				</ul>
				<p style={{ marginTop: '15px', fontStyle: 'italic' }}>
					💡 {__('نکته: پس از تعریف هر پارامتر، قیمت پیش‌فرض 0 تومان برای تمام ترکیبات در نظر گرفته می‌شود. قیمت 0 به معنای غیرفعال بودن آن ترکیب است.', 'tabesh-v2')}
				</p>
			</div>
		);
	}
	
	return (
		<div className="page-cost-matrix">
			<div style={{ 
				backgroundColor: '#f0f6fc', 
				padding: '15px', 
				borderRadius: '4px', 
				marginBottom: '20px',
				border: '1px solid #d0e3f5'
			}}>
				<h3 style={{ marginTop: '0', color: '#1d4ed8' }}>
					📄 {__('هزینه هر صفحه (کاغذ + چاپ)', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '0', color: '#4b5563' }}>
					{__('قیمت نهایی هر صفحه شامل هزینه کاغذ و چاپ است. برای ویرایش، روی قیمت کلیک کنید. کلید کشویی روشن/خاموش فعال/غیرفعال بودن هر ترکیب را کنترل می‌کند.', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '10px', marginBottom: '0', color: '#6b7280', fontSize: '0.9em', fontStyle: 'italic' }}>
					💡 {__('نکته: هر کلید کشویی فقط برای همان ترکیب خاص (گرماژ + نوع چاپ) عمل می‌کند و سایر گزینه‌ها را تحت تاثیر قرار نمی‌دهد.', 'tabesh-v2')}
				</p>
			</div>
			
			{paperTypes.map((paperType) => {
				const weights = weightsByType[paperType.id] || [];
				if (weights.length === 0) return null;
				
				return (
					<div key={paperType.id} className="paper-type-section" style={{ 
						marginBottom: '30px',
						backgroundColor: '#fff',
						padding: '15px',
						borderRadius: '6px',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<h4 style={{ 
							color: '#1f2937', 
							borderBottom: '2px solid #3b82f6',
							paddingBottom: '8px',
							marginBottom: '15px'
						}}>
							📋 {paperType.name}
						</h4>
						<table className="wp-list-table widefat fixed striped" style={{ borderRadius: '4px', overflow: 'hidden' }}>
							<thead>
								<tr style={{ backgroundColor: '#f9fafb' }}>
									<th style={{ fontWeight: 'bold' }}>{__('گرماژ', 'tabesh-v2')}</th>
									{printTypes.map(pt => (
										<th key={pt.id} style={{ fontWeight: 'bold', textAlign: 'center' }}>{pt.name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{weights.map((weight) => (
									<tr key={weight.id}>
										<td style={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
											{weight.weight} {__('گرم', 'tabesh-v2')}
										</td>
										{printTypes.map(printType => {
											const cellKey = `${paperType.id}-${weight.id}-${printType.id}`;
											const cost = getPageCost(paperType.id, weight.id, printType.id);
											const isEditing = editingCell === cellKey;
											
											return (
												<td key={printType.id}>
													<div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
														{isEditing ? (
															<>
																<input
																	type="number"
																	value={tempValue}
																	onChange={(e) => setTempValue(e.target.value)}
																	style={{ 
																		width: '100px',
																		padding: '4px 8px',
																		border: '1px solid #3b82f6',
																		borderRadius: '3px'
																	}}
																	disabled={saving}
																	placeholder="0"
																/>
																<button
																	type="button"
																	className="button button-small button-primary"
																	onClick={() => handleSave(paperType.id, weight.id, printType.id)}
																	disabled={saving}
																	style={{ padding: '2px 8px' }}
																>
																	✓
																</button>
																<button
																	type="button"
																	className="button button-small"
																	onClick={() => setEditingCell(null)}
																	disabled={saving}
																	style={{ padding: '2px 8px' }}
																>
																	✗
																</button>
															</>
														) : (
															<>
																<span
																	onClick={() => {
																		setEditingCell(cellKey);
																		setTempValue(cost?.price || '0');
																	}}
																	style={{ 
																		cursor: 'pointer', 
																		flex: 1,
																		padding: '4px 8px',
																		borderRadius: '3px',
																		backgroundColor: cost && cost.is_enabled ? '#d1fae5' : '#fee2e2',
																		color: cost && cost.is_enabled ? '#065f46' : '#991b1b',
																		fontWeight: '500',
																		textAlign: 'center',
																		transition: 'all 0.2s'
																	}}
																	title={__('کلیک برای ویرایش', 'tabesh-v2')}
																>
																	{cost && cost.is_enabled ? (
																		<>
																			{cost.price > 0 ? (
																				`${cost.price} ${__('تومان', 'tabesh-v2')}`
																			) : (
																				<span style={{ color: '#991b1b', fontStyle: 'italic' }}>
																					{__('0 تومان (غیرفعال)', 'tabesh-v2')}
																				</span>
																			)}
																		</>
																	) : (
																		<span style={{ fontStyle: 'italic' }}>
																			{__('غیر فعال', 'tabesh-v2')}
																		</span>
																	)}
																</span>
																<ToggleSwitch
																	checked={cost ? Boolean(cost.is_enabled) : false}
																	onChange={() => toggleEnabled(paperType.id, weight.id, printType.id)}
																	disabled={saving}
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
		// Toggle the enabled state for this specific combination only
		// Convert to number: if existing and enabled (truthy), set to 0, otherwise set to 1
		const newEnabledState = (existing && existing.is_enabled) ? 0 : 1;
		await saveBindingCost(bindingTypeId, coverWeightId, existing?.price || 0, newEnabledState);
	};
	
	// Check if we have any data to display - show helpful message but allow viewing
	if (bindingTypes.length === 0 || coverWeights.length === 0) {
		return (
			<div className="tabesh-notice tabesh-notice-info" style={{ 
				padding: '20px', 
				backgroundColor: '#e7f3ff', 
				border: '1px solid #2271b1',
				borderRadius: '4px',
				marginBottom: '20px'
			}}>
				<h3 style={{ marginTop: '0', color: '#2271b1' }}>
					{__('راهنمای تنظیم ماتریس قیمت صحافی', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '10px' }}>
					{__('برای استفاده از ماتریس قیمت صحافی، ابتدا باید پارامترهای زیر را در بخش "پارامترهای چاپ کتاب" تعریف کنید:', 'tabesh-v2')}
				</p>
				<ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
					<li>{bindingTypes.length === 0 && '❌ '}{__('انواع صحافی (مثال: شومیز، جلد سخت، منگنه، فنری)', 'tabesh-v2')}</li>
					<li>{coverWeights.length === 0 && '❌ '}{__('گرماژ جلد (مثال: 135، 200، 250، 300 گرم)', 'tabesh-v2')}</li>
				</ul>
				<p style={{ marginTop: '15px', fontStyle: 'italic' }}>
					💡 {__('نکته: پس از تعریف هر پارامتر، قیمت پیش‌فرض 0 تومان برای تمام ترکیبات در نظر گرفته می‌شود. قیمت 0 به معنای غیرفعال بودن آن ترکیب است.', 'tabesh-v2')}
				</p>
			</div>
		);
	}
	
	return (
		<div className="binding-cost-matrix">
			<div style={{ 
				backgroundColor: '#f0f6fc', 
				padding: '15px', 
				borderRadius: '4px', 
				marginBottom: '20px',
				border: '1px solid #d0e3f5'
			}}>
				<h3 style={{ marginTop: '0', color: '#1d4ed8' }}>
					📚 {__('هزینه صحافی و جلد', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '0', color: '#4b5563' }}>
					{__('هزینه صحافی برای هر ترکیب صحافی و گرماژ جلد. برای ویرایش، روی قیمت کلیک کنید. کلید کشویی روشن/خاموش مجاز/غیرمجاز بودن هر ترکیب را کنترل می‌کند.', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '10px', marginBottom: '0', color: '#6b7280', fontSize: '0.9em', fontStyle: 'italic' }}>
					💡 {__('نکته: هر کلید کشویی فقط برای همان ترکیب خاص عمل می‌کند و سایر گزینه‌ها را تحت تاثیر قرار نمی‌دهد.', 'tabesh-v2')}
				</p>
			</div>
			
			{bindingTypes.map((bindingType) => (
				<div key={bindingType.id} className="binding-type-section" style={{ 
					marginBottom: '30px',
					backgroundColor: '#fff',
					padding: '15px',
					borderRadius: '6px',
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}>
					<h4 style={{ 
						color: '#1f2937', 
						borderBottom: '2px solid #8b5cf6',
						paddingBottom: '8px',
						marginBottom: '15px'
					}}>
						🔖 {bindingType.name}
					</h4>
					<table className="wp-list-table widefat fixed striped" style={{ borderRadius: '4px', overflow: 'hidden' }}>
						<thead>
							<tr style={{ backgroundColor: '#f9fafb' }}>
								<th style={{ fontWeight: 'bold', width: '30%' }}>{__('گرماژ جلد', 'tabesh-v2')}</th>
								<th style={{ fontWeight: 'bold' }}>{__('هزینه جلد و صحافی', 'tabesh-v2')}</th>
							</tr>
						</thead>
						<tbody>
							{coverWeights.map((weight) => {
								const cellKey = `${bindingType.id}-${weight.id}`;
								const cost = getBindingCost(bindingType.id, weight.id);
								const isEditing = editingCell === cellKey;
								
								return (
									<tr key={weight.id}>
										<td style={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
											{weight.weight} {__('گرم', 'tabesh-v2')}
										</td>
										<td>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
												{isEditing ? (
													<>
														<input
															type="number"
															value={tempValue}
															onChange={(e) => setTempValue(e.target.value)}
															style={{ 
																width: '150px',
																padding: '4px 8px',
																border: '1px solid #8b5cf6',
																borderRadius: '3px'
															}}
															disabled={saving}
															placeholder="0"
														/>
														<button
															type="button"
															className="button button-small button-primary"
															onClick={() => handleSave(bindingType.id, weight.id)}
															disabled={saving}
															style={{ padding: '2px 8px' }}
														>
															✓
														</button>
														<button
															type="button"
															className="button button-small"
															onClick={() => setEditingCell(null)}
															disabled={saving}
															style={{ padding: '2px 8px' }}
														>
															✗
														</button>
													</>
												) : (
													<>
														<span
															onClick={() => {
																setEditingCell(cellKey);
																setTempValue(cost?.price || '0');
															}}
															style={{ 
																cursor: 'pointer', 
																flex: 1,
																padding: '6px 12px',
																borderRadius: '3px',
																backgroundColor: cost && cost.is_enabled ? '#ddd6fe' : '#fee2e2',
																color: cost && cost.is_enabled ? '#5b21b6' : '#991b1b',
																fontWeight: '500',
																textAlign: 'center',
																transition: 'all 0.2s'
															}}
															title={__('کلیک برای ویرایش', 'tabesh-v2')}
														>
															{cost && cost.is_enabled ? (
																<>
																	{cost.price > 0 ? (
																		`${cost.price} ${__('تومان', 'tabesh-v2')}`
																	) : (
																		<span style={{ color: '#991b1b', fontStyle: 'italic' }}>
																			{__('0 تومان (غیرمجاز)', 'tabesh-v2')}
																		</span>
																	)}
																</>
															) : (
																<span style={{ fontStyle: 'italic' }}>
																	{__('غیر مجاز', 'tabesh-v2')}
																</span>
															)}
														</span>
														<ToggleSwitch
															checked={cost ? Boolean(cost.is_enabled) : false}
															onChange={() => toggleEnabled(bindingType.id, weight.id)}
															disabled={saving}
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
		
		// Determine is_enabled value - default to true only if pricing exists and is_enabled is undefined
		let isEnabled = true;
		if (pricing) {
			isEnabled = pricing.is_enabled !== undefined ? Boolean(pricing.is_enabled) : true;
		}
		
		setTempData({
			price: pricing?.price || '0',
			calculation_type: pricing?.calculation_type || 'fixed',
			pages_per_unit: pricing?.pages_per_unit || '',
			is_enabled: isEnabled,
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
	
	// Check if we have any data to display - show helpful message
	if (additionalServices.length === 0) {
		return (
			<div className="tabesh-notice tabesh-notice-info" style={{ 
				padding: '20px', 
				backgroundColor: '#e7f3ff', 
				border: '1px solid #2271b1',
				borderRadius: '4px',
				marginBottom: '20px'
			}}>
				<h3 style={{ marginTop: '0', color: '#2271b1' }}>
					{__('راهنمای تنظیم خدمات اضافی', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '10px' }}>
					{__('برای تنظیم قیمت خدمات اضافی، ابتدا باید خدمات را در بخش "پارامترهای چاپ کتاب" تعریف کنید.', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '10px' }}>
					{__('مثال‌های خدمات اضافی: شیرینک، نقره‌کوب، طلاکوب، UV برجسته، وکیوم', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '15px', fontStyle: 'italic' }}>
					💡 {__('نکته: پس از تعریف خدمات، قیمت پیش‌فرض 0 تومان برای هر خدمت در نظر گرفته می‌شود.', 'tabesh-v2')}
				</p>
			</div>
		);
	}
	
	return (
		<div className="additional-services-config">
			<div style={{ 
				backgroundColor: '#f0f6fc', 
				padding: '15px', 
				borderRadius: '4px', 
				marginBottom: '20px',
				border: '1px solid #d0e3f5'
			}}>
				<h3 style={{ marginTop: '0', color: '#1d4ed8' }}>
					⭐ {__('خدمات اضافی', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '0', color: '#4b5563' }}>
					{__('تنظیم قیمت و نحوه محاسبه برای خدمات اضافی. روی دکمه "ویرایش" کلیک کنید تا قیمت و نوع محاسبه را تنظیم کنید.', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '10px', marginBottom: '0', color: '#6b7280', fontSize: '0.9em' }}>
					📌 {__('انواع محاسبه:', 'tabesh-v2')}
				</p>
				<ul style={{ marginTop: '5px', marginBottom: '0', color: '#6b7280', fontSize: '0.9em', lineHeight: '1.6' }}>
					<li><strong>{__('ثابت:', 'tabesh-v2')}</strong> {__('مبلغ ثابت به کل فاکتور اضافه می‌شود', 'tabesh-v2')}</li>
					<li><strong>{__('به ازای هر جلد:', 'tabesh-v2')}</strong> {__('قیمت × تیراژ', 'tabesh-v2')}</li>
					<li><strong>{__('بر اساس تعداد صفحه:', 'tabesh-v2')}</strong> {__('بر اساس واحدهای صفحه (مثلاً هر ۱۰۰۰۰ صفحه)', 'tabesh-v2')}</li>
				</ul>
			</div>
			
			<table className="wp-list-table widefat fixed striped" style={{ borderRadius: '4px', overflow: 'hidden' }}>
				<thead>
					<tr style={{ backgroundColor: '#f9fafb' }}>
						<th style={{ fontWeight: 'bold', width: '25%' }}>{__('نام خدمات', 'tabesh-v2')}</th>
						<th style={{ fontWeight: 'bold', width: '20%' }}>{__('قیمت (تومان)', 'tabesh-v2')}</th>
						<th style={{ fontWeight: 'bold', width: '25%' }}>{__('نوع محاسبه', 'tabesh-v2')}</th>
						<th style={{ fontWeight: 'bold', width: '15%' }}>{__('تعداد صفحه', 'tabesh-v2')}</th>
						<th style={{ fontWeight: 'bold', width: '15%' }}>{__('عملیات', 'tabesh-v2')}</th>
					</tr>
				</thead>
				<tbody>
					{additionalServices.map((service) => {
						const pricing = getServicePricing(service.id);
						const isEditing = editingService === service.id;
						
						return (
							<tr key={service.id} style={{ backgroundColor: pricing ? '#f0fdf4' : '#fef2f2' }}>
								<td>
									<strong style={{ color: '#1f2937' }}>{service.name}</strong>
								</td>
								<td>
									{isEditing ? (
										<input
											type="number"
											value={tempData.price}
											onChange={(e) => setTempData({ ...tempData, price: e.target.value })}
											style={{ 
												width: '100%',
												padding: '4px 8px',
												border: '1px solid #3b82f6',
												borderRadius: '3px'
											}}
											disabled={saving}
											placeholder="0"
										/>
									) : (
										<span style={{ 
											display: 'inline-block',
											padding: '4px 12px',
											backgroundColor: pricing?.price > 0 ? '#dbeafe' : '#fee2e2',
											color: pricing?.price > 0 ? '#1e40af' : '#991b1b',
											borderRadius: '3px',
											fontWeight: '500'
										}}>
											{pricing?.price || '0'} {__('تومان', 'tabesh-v2')}
										</span>
									)}
								</td>
								<td>
									{isEditing ? (
										<select
											value={tempData.calculation_type}
											onChange={(e) => setTempData({ ...tempData, calculation_type: e.target.value })}
											style={{ 
												width: '100%',
												padding: '4px 8px',
												border: '1px solid #3b82f6',
												borderRadius: '3px'
											}}
											disabled={saving}
										>
											<option value="fixed">{__('ثابت', 'tabesh-v2')}</option>
											<option value="per_copy">{__('به ازای هر جلد', 'tabesh-v2')}</option>
											<option value="per_pages">{__('بر اساس تعداد صفحه', 'tabesh-v2')}</option>
										</select>
									) : (
										<span style={{ 
											display: 'inline-block',
											padding: '4px 12px',
											backgroundColor: '#e0e7ff',
											color: '#3730a3',
											borderRadius: '3px',
											fontSize: '0.9em'
										}}>
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
											style={{ 
												width: '100%',
												padding: '4px 8px',
												border: '1px solid #3b82f6',
												borderRadius: '3px'
											}}
											disabled={saving}
										/>
									) : (
										<span style={{ color: '#6b7280', fontSize: '0.9em' }}>
											{pricing?.calculation_type === 'per_pages' && pricing?.pages_per_unit
												? `${pricing.pages_per_unit} ${__('صفحه', 'tabesh-v2')}`
												: __('—', 'tabesh-v2')}
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
												style={{ marginLeft: '4px' }}
											>
												{__('ذخیره', 'tabesh-v2')}
											</button>
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
											style={{ 
												backgroundColor: '#3b82f6',
												color: '#fff',
												borderColor: '#3b82f6'
											}}
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
		// Default is enabled (true) if not set
		// If no record exists, create one with is_enabled: 0 (disabled)
		// If record exists, toggle between 0 and 1
		const currentState = existing ? existing.is_enabled : 1; // Default to enabled (1) if no record
		const newEnabledState = currentState ? 0 : 1;
		await saveServiceRestriction(serviceId, bindingTypeId, newEnabledState);
	};
	
	// Check if we have any data to display - show helpful message
	if (additionalServices.length === 0 || bindingTypes.length === 0) {
		return (
			<div className="tabesh-notice tabesh-notice-info" style={{ 
				padding: '20px', 
				backgroundColor: '#e7f3ff', 
				border: '1px solid #2271b1',
				borderRadius: '4px',
				marginBottom: '20px'
			}}>
				<h3 style={{ marginTop: '0', color: '#2271b1' }}>
					{__('راهنمای تنظیم محدودیت‌های خدمات', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '10px' }}>
					{__('برای تنظیم محدودیت‌های خدمات، ابتدا باید پارامترهای زیر را در بخش "پارامترهای چاپ کتاب" تعریف کنید:', 'tabesh-v2')}
				</p>
				<ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
					<li>{additionalServices.length === 0 && '❌ '}{__('خدمات اضافی (مثال: شیرینک، نقره‌کوب، طلاکوب)', 'tabesh-v2')}</li>
					<li>{bindingTypes.length === 0 && '❌ '}{__('انواع صحافی (مثال: شومیز، جلد سخت، منگنه)', 'tabesh-v2')}</li>
				</ul>
				<p style={{ marginTop: '15px', fontStyle: 'italic' }}>
					💡 {__('نکته: به صورت پیش‌فرض، تمام خدمات برای تمام انواع صحافی فعال هستند.', 'tabesh-v2')}
				</p>
			</div>
		);
	}
	
	return (
		<div className="service-binding-restrictions">
			<div style={{ 
				backgroundColor: '#f0f6fc', 
				padding: '15px', 
				borderRadius: '4px', 
				marginBottom: '20px',
				border: '1px solid #d0e3f5'
			}}>
				<h3 style={{ marginTop: '0', color: '#1d4ed8' }}>
					🔒 {__('محدودیت‌های خدمات اضافی بر اساس نوع صحافی', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '0', color: '#4b5563' }}>
					{__('تعیین اینکه هر خدمت برای کدام نوع صحافی مجاز است. به صورت پیش‌فرض، تمام خدمات برای تمام انواع صحافی فعال هستند.', 'tabesh-v2')}
				</p>
			</div>
			
			{additionalServices.map((service) => (
				<div key={service.id} className="service-restriction-section" style={{ 
					marginBottom: '30px',
					backgroundColor: '#fff',
					padding: '15px',
					borderRadius: '6px',
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}>
					<h4 style={{ 
						color: '#1f2937', 
						borderBottom: '2px solid #10b981',
						paddingBottom: '8px',
						marginBottom: '15px'
					}}>
						⚙️ {service.name}
					</h4>
					<table className="wp-list-table widefat fixed striped" style={{ borderRadius: '4px', overflow: 'hidden' }}>
						<thead>
							<tr style={{ backgroundColor: '#f9fafb' }}>
								<th style={{ fontWeight: 'bold', width: '40%' }}>{__('نوع صحافی', 'tabesh-v2')}</th>
								<th style={{ fontWeight: 'bold' }}>{__('وضعیت', 'tabesh-v2')}</th>
							</tr>
						</thead>
						<tbody>
							{bindingTypes.map((bindingType) => {
								const restriction = getServiceRestriction(service.id, bindingType.id);
								const isEnabled = restriction ? Boolean(restriction.is_enabled) : true;
								
								return (
									<tr key={bindingType.id} style={{ backgroundColor: isEnabled ? '#f0fdf4' : '#fef2f2' }}>
										<td style={{ fontWeight: 'bold' }}>{bindingType.name}</td>
										<td>
											<div style={{ 
												display: 'flex', 
												alignItems: 'center', 
												gap: '12px',
												padding: '4px 0'
											}}>
												<ToggleSwitch
													checked={isEnabled}
													onChange={() => toggleRestriction(service.id, bindingType.id)}
													disabled={saving}
													label={isEnabled ? __('فعال', 'tabesh-v2') : __('غیر فعال', 'tabesh-v2')}
												/>
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
 * Size Limits Form Component
 */
const SizeLimitsForm = ({ sizeLimits, setSizeLimits, saveSizeLimits, saving }) => {
	return (
		<div className="size-limits-form">
			<div style={{ 
				backgroundColor: '#f0f6fc', 
				padding: '15px', 
				borderRadius: '4px', 
				marginBottom: '20px',
				border: '1px solid #d0e3f5'
			}}>
				<h3 style={{ marginTop: '0', color: '#1d4ed8' }}>
					📊 {__('محدودیت‌های تیراژ و تعداد صفحه', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '0', color: '#4b5563' }}>
					{__('تعیین حداقل، حداکثر و گام حرکتی برای تیراژ و تعداد صفحات. این محدودیت‌ها در فرم ثبت سفارش اعمال می‌شوند.', 'tabesh-v2')}
				</p>
			</div>
			
			<div style={{ 
				maxWidth: '800px',
				backgroundColor: '#fff',
				padding: '20px',
				borderRadius: '6px',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
			}}>
				<h4 style={{ 
					color: '#1f2937',
					borderBottom: '2px solid #f59e0b',
					paddingBottom: '8px',
					marginBottom: '20px'
				}}>
					📚 {__('تیراژ', 'tabesh-v2')}
				</h4>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
					<FormGroup label={__('حد اقل تیراژ', 'tabesh-v2')}>
						<TextInput
							type="number"
							value={sizeLimits.min_circulation}
							onChange={(e) => setSizeLimits({ ...sizeLimits, min_circulation: e.target.value })}
							placeholder="1"
							style={{ width: '100%' }}
						/>
					</FormGroup>
					<FormGroup label={__('حد اکثر تیراژ', 'tabesh-v2')}>
						<TextInput
							type="number"
							value={sizeLimits.max_circulation}
							onChange={(e) => setSizeLimits({ ...sizeLimits, max_circulation: e.target.value })}
							placeholder="10000"
							style={{ width: '100%' }}
						/>
					</FormGroup>
					<FormGroup label={__('گام تغییر تیراژ', 'tabesh-v2')}>
						<TextInput
							type="number"
							value={sizeLimits.circulation_step}
							onChange={(e) => setSizeLimits({ ...sizeLimits, circulation_step: e.target.value })}
							placeholder="1"
							style={{ width: '100%' }}
						/>
					</FormGroup>
				</div>
				
				<h4 style={{ 
					color: '#1f2937',
					borderBottom: '2px solid #f59e0b',
					paddingBottom: '8px',
					marginBottom: '20px'
				}}>
					📄 {__('تعداد صفحه', 'tabesh-v2')}
				</h4>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
					<FormGroup label={__('حد اقل صفحه', 'tabesh-v2')}>
						<TextInput
							type="number"
							value={sizeLimits.min_pages}
							onChange={(e) => setSizeLimits({ ...sizeLimits, min_pages: e.target.value })}
							placeholder="1"
							style={{ width: '100%' }}
						/>
					</FormGroup>
					<FormGroup label={__('حد اکثر صفحه', 'tabesh-v2')}>
						<TextInput
							type="number"
							value={sizeLimits.max_pages}
							onChange={(e) => setSizeLimits({ ...sizeLimits, max_pages: e.target.value })}
							placeholder="1000"
							style={{ width: '100%' }}
						/>
					</FormGroup>
					<FormGroup label={__('گام حرکتی صفحه', 'tabesh-v2')}>
						<TextInput
							type="number"
							value={sizeLimits.pages_step}
							onChange={(e) => setSizeLimits({ ...sizeLimits, pages_step: e.target.value })}
							placeholder="1"
							style={{ width: '100%' }}
						/>
					</FormGroup>
				</div>
				
				<button
					type="button"
					className="button button-primary button-large"
					onClick={saveSizeLimits}
					disabled={saving}
					style={{ 
						marginTop: '20px',
						padding: '10px 30px',
						fontSize: '16px',
						backgroundColor: '#3b82f6',
						borderColor: '#3b82f6'
					}}
				>
					{saving ? __('در حال ذخیره...', 'tabesh-v2') : __('💾 ذخیره محدودیت‌ها', 'tabesh-v2')}
				</button>
			</div>
		</div>
	);
};

/**
 * License Pricing Form Component
 */
const LicensePricingForm = ({ licenseTypes, getLicensePricing, saveLicensePricing, saving }) => {
	const [editingLicense, setEditingLicense] = useState(null);
	const [tempPrice, setTempPrice] = useState('');
	
	const handleEdit = (licenseTypeId) => {
		const pricing = getLicensePricing(licenseTypeId);
		setEditingLicense(licenseTypeId);
		setTempPrice(pricing?.price || '0');
	};
	
	const handleSave = async (licenseTypeId) => {
		const existing = getLicensePricing(licenseTypeId);
		await saveLicensePricing(licenseTypeId, tempPrice, existing?.is_enabled !== undefined ? existing.is_enabled : 1);
		setEditingLicense(null);
	};
	
	const toggleEnabled = async (licenseTypeId) => {
		const existing = getLicensePricing(licenseTypeId);
		// Convert to number: if existing and enabled (truthy), set to 0, otherwise set to 1
		const newEnabledState = (existing && existing.is_enabled) ? 0 : 1;
		await saveLicensePricing(licenseTypeId, existing?.price || 0, newEnabledState);
	};
	
	// Check if we have any data to display
	if (licenseTypes.length === 0) {
		return (
			<div className="tabesh-notice tabesh-notice-info" style={{ 
				padding: '20px', 
				backgroundColor: '#e7f3ff', 
				border: '1px solid #2271b1',
				borderRadius: '4px',
				marginBottom: '20px'
			}}>
				<h3 style={{ marginTop: '0', color: '#2271b1' }}>
					{__('راهنمای تنظیم قیمت مجوز', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '10px' }}>
					{__('برای تنظیم قیمت مجوزها، ابتدا باید انواع مجوز را در بخش "پارامترهای چاپ کتاب" تعریف کنید.', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '10px' }}>
					{__('مثال‌های انواع مجوز: دارای مجوز، بدون مجوز، مجوز وزارت فرهنگ', 'tabesh-v2')}
				</p>
				<p style={{ marginTop: '15px', fontStyle: 'italic' }}>
					💡 {__('نکته: قیمت مجوز به صورت ثابت به فاکتور اضافه می‌شود و به قطع کتاب وابسته نیست.', 'tabesh-v2')}
				</p>
			</div>
		);
	}
	
	return (
		<div className="license-pricing-form">
			<div style={{ 
				backgroundColor: '#f0f6fc', 
				padding: '15px', 
				borderRadius: '4px', 
				marginBottom: '20px',
				border: '1px solid #d0e3f5'
			}}>
				<h3 style={{ marginTop: '0', color: '#1d4ed8' }}>
					📜 {__('قیمت‌گذاری مجوز', 'tabesh-v2')}
				</h3>
				<p style={{ marginBottom: '0', color: '#4b5563' }}>
					{__('تنظیم قیمت ثابت برای هر نوع مجوز. این قیمت به صورت یکبار به کل فاکتور اضافه می‌شود و به قطع کتاب وابسته نیست.', 'tabesh-v2')}
				</p>
			</div>
			
			<table className="wp-list-table widefat fixed striped" style={{ borderRadius: '4px', overflow: 'hidden' }}>
				<thead>
					<tr style={{ backgroundColor: '#f9fafb' }}>
						<th style={{ fontWeight: 'bold', width: '40%' }}>{__('نوع مجوز', 'tabesh-v2')}</th>
						<th style={{ fontWeight: 'bold', width: '30%' }}>{__('قیمت (تومان)', 'tabesh-v2')}</th>
						<th style={{ fontWeight: 'bold', width: '30%' }}>{__('عملیات', 'tabesh-v2')}</th>
					</tr>
				</thead>
				<tbody>
					{licenseTypes.map((license) => {
						const pricing = getLicensePricing(license.id);
						const isEditing = editingLicense === license.id;
						
						return (
							<tr key={license.id} style={{ backgroundColor: pricing?.price > 0 ? '#f0fdf4' : '#fef2f2' }}>
								<td>
									<strong style={{ color: '#1f2937' }}>{license.name}</strong>
								</td>
								<td>
									{isEditing ? (
										<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
											<input
												type="number"
												value={tempPrice}
												onChange={(e) => setTempPrice(e.target.value)}
												style={{ 
													width: '150px',
													padding: '4px 8px',
													border: '1px solid #3b82f6',
													borderRadius: '3px'
												}}
												disabled={saving}
												placeholder="0"
											/>
											<button
												type="button"
												className="button button-small button-primary"
												onClick={() => handleSave(license.id)}
												disabled={saving}
												style={{ padding: '2px 8px' }}
											>
												✓
											</button>
											<button
												type="button"
												className="button button-small"
												onClick={() => setEditingLicense(null)}
												disabled={saving}
												style={{ padding: '2px 8px' }}
											>
												✗
											</button>
										</div>
									) : (
										<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
											<span
												onClick={() => handleEdit(license.id)}
												style={{ 
													cursor: 'pointer', 
													flex: 1,
													padding: '6px 12px',
													borderRadius: '3px',
													backgroundColor: pricing && pricing.is_enabled ? '#dbeafe' : '#fee2e2',
													color: pricing && pricing.is_enabled ? '#1e40af' : '#991b1b',
													fontWeight: '500',
													textAlign: 'center',
													transition: 'all 0.2s'
												}}
												title={__('کلیک برای ویرایش', 'tabesh-v2')}
											>
												{pricing && pricing.is_enabled ? (
													<>
														{pricing.price > 0 ? (
															`${pricing.price} ${__('تومان', 'tabesh-v2')}`
														) : (
															<span style={{ color: '#991b1b', fontStyle: 'italic' }}>
																{__('0 تومان (غیرفعال)', 'tabesh-v2')}
															</span>
														)}
													</>
												) : (
													<span style={{ fontStyle: 'italic' }}>
														{__('غیر فعال', 'tabesh-v2')}
													</span>
												)}
											</span>
											<ToggleSwitch
												checked={pricing ? Boolean(pricing.is_enabled) : false}
												onChange={() => toggleEnabled(license.id)}
												disabled={saving}
											/>
										</div>
									)}
								</td>
								<td>
									{!isEditing && (
										<button
											type="button"
											className="button button-small"
											onClick={() => handleEdit(license.id)}
											style={{ 
												backgroundColor: '#3b82f6',
												color: '#fff',
												borderColor: '#3b82f6'
											}}
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

export default BookPricingMatrixTab;
