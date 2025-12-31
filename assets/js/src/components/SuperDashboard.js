import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './SuperDashboard.css';

/**
 * Super Dashboard Component
 * 
 * Modern studio-like customer dashboard with resizable panels
 */
const SuperDashboard = () => {
	const [activeModules, setActiveModules] = useState([]);
	const [layout, setLayout] = useState('grid');
	const [selectedModule, setSelectedModule] = useState(null);

	// Available modules
	const modules = [
		{ id: 'price-history', title: __('تاریخچه قیمت', 'tabesh-v2'), icon: '📊', color: '#4CAF50' },
		{ id: 'new-articles', title: __('مقالات جدید', 'tabesh-v2'), icon: '📰', color: '#2196F3' },
		{ id: 'new-order', title: __('ثبت سفارش جدید', 'tabesh-v2'), icon: '➕', color: '#FF9800' },
		{ id: 'order-history', title: __('تاریخچه سفارشات', 'tabesh-v2'), icon: '📋', color: '#9C27B0' },
		{ id: 'active-orders', title: __('سفارشات در حال انجام', 'tabesh-v2'), icon: '🔄', color: '#00BCD4' },
		{ id: 'financial-report', title: __('گزارش مالی', 'tabesh-v2'), icon: '💰', color: '#4CAF50' },
		{ id: 'file-management', title: __('مدیریت فایلها', 'tabesh-v2'), icon: '📁', color: '#FF5722' },
		{ id: 'ai-chatbot', title: __('چتبات هوش مصنوعی', 'tabesh-v2'), icon: '🤖', color: '#673AB7' },
		{ id: 'support-ticket', title: __('تیکت پشتیبانی', 'tabesh-v2'), icon: '🎫', color: '#E91E63' },
		{ id: 'account-manager', title: __('پیام به مدیر حساب', 'tabesh-v2'), icon: '💬', color: '#3F51B5' },
		{ id: 'guild-area', title: __('ناحیه کانون صنفی', 'tabesh-v2'), icon: '🏛️', color: '#795548' },
		{ id: 'published-products', title: __('محصولات منتشر شده', 'tabesh-v2'), icon: '📦', color: '#009688' },
		{ id: 'sales-metrics', title: __('میزان فروش', 'tabesh-v2'), icon: '📈', color: '#8BC34A' },
		{ id: 'advertising', title: __('بخش تبلیغات', 'tabesh-v2'), icon: '📢', color: '#FFC107' },
	];

	const handleModuleClick = (moduleId) => {
		if (activeModules.includes(moduleId)) {
			setActiveModules(activeModules.filter(id => id !== moduleId));
		} else {
			setActiveModules([...activeModules, moduleId]);
		}
	};

	const handleModuleClose = (moduleId) => {
		setActiveModules(activeModules.filter(id => id !== moduleId));
	};

	return (
		<div className="tabesh-super-dashboard">
			{/* Dashboard Header */}
			<div className="super-dashboard-header">
				<div className="header-left">
					<h1 className="dashboard-title">
						<span className="title-icon">✨</span>
						{__('استودیوی مدیریت تابش', 'tabesh-v2')}
					</h1>
					<p className="dashboard-subtitle">
						{__('خوش آمدید به پنل مدیریت حرفه‌ای', 'tabesh-v2')}
					</p>
				</div>
				<div className="header-right">
					<div className="layout-controls">
						<button
							className={`layout-btn ${layout === 'grid' ? 'active' : ''}`}
							onClick={() => setLayout('grid')}
							title={__('نمایش شبکه‌ای', 'tabesh-v2')}
						>
							<span className="icon">⊞</span>
						</button>
						<button
							className={`layout-btn ${layout === 'list' ? 'active' : ''}`}
							onClick={() => setLayout('list')}
							title={__('نمایش لیستی', 'tabesh-v2')}
						>
							<span className="icon">☰</span>
						</button>
					</div>
				</div>
			</div>

			{/* Module Selector */}
			<div className="module-selector">
				<div className="selector-header">
					<h3>{__('ماژول‌های موجود', 'tabesh-v2')}</h3>
					<span className="active-count">{activeModules.length} {__('فعال', 'tabesh-v2')}</span>
				</div>
				<div className="module-grid">
					{modules.map((module) => (
						<button
							key={module.id}
							className={`module-card ${activeModules.includes(module.id) ? 'active' : ''}`}
							onClick={() => handleModuleClick(module.id)}
							style={{ '--module-color': module.color }}
						>
							<span className="module-icon">{module.icon}</span>
							<span className="module-title">{module.title}</span>
							<span className="module-status">
								{activeModules.includes(module.id) ? '✓' : '+'}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Active Modules Display */}
			{activeModules.length > 0 && (
				<div className={`modules-workspace layout-${layout}`}>
					{activeModules.map((moduleId) => {
						const module = modules.find(m => m.id === moduleId);
						return (
							<ModulePanel
								key={moduleId}
								module={module}
								onClose={() => handleModuleClose(moduleId)}
								layout={layout}
							/>
						);
					})}
				</div>
			)}

			{/* Empty State */}
			{activeModules.length === 0 && (
				<div className="empty-workspace">
					<div className="empty-content">
						<span className="empty-icon">🎯</span>
						<h2>{__('فضای کاری شما خالی است', 'tabesh-v2')}</h2>
						<p>{__('برای شروع، یک یا چند ماژول از بالا انتخاب کنید', 'tabesh-v2')}</p>
					</div>
				</div>
			)}
		</div>
	);
};

/**
 * Module Panel Component
 */
const ModulePanel = ({ module, onClose, layout }) => {
	const [isMinimized, setIsMinimized] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const renderModuleContent = () => {
		switch (module.id) {
			case 'price-history':
				return <PriceHistoryModule />;
			case 'new-articles':
				return <NewArticlesModule />;
			case 'new-order':
				return <NewOrderModule />;
			case 'order-history':
				return <OrderHistoryModule />;
			case 'active-orders':
				return <ActiveOrdersModule />;
			case 'financial-report':
				return <FinancialReportModule />;
			case 'file-management':
				return <FileManagementModule />;
			case 'ai-chatbot':
				return <AIChatbotModule />;
			case 'support-ticket':
				return <SupportTicketModule />;
			case 'account-manager':
				return <AccountManagerModule />;
			case 'guild-area':
				return <GuildAreaModule />;
			case 'published-products':
				return <PublishedProductsModule />;
			case 'sales-metrics':
				return <SalesMetricsModule />;
			case 'advertising':
				return <AdvertisingModule />;
			default:
				return <PlaceholderModule title={module.title} />;
		}
	};

	return (
		<div
			className={`module-panel ${isMinimized ? 'minimized' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
			style={{ '--panel-color': module.color }}
		>
			<div className="panel-header">
				<div className="panel-title">
					<span className="panel-icon">{module.icon}</span>
					<span className="panel-text">{module.title}</span>
				</div>
				<div className="panel-controls">
					<button
						className="control-btn minimize"
						onClick={() => setIsMinimized(!isMinimized)}
						title={isMinimized ? __('بزرگ کردن', 'tabesh-v2') : __('کوچک کردن', 'tabesh-v2')}
					>
						{isMinimized ? '▢' : '−'}
					</button>
					<button
						className="control-btn fullscreen"
						onClick={() => setIsFullscreen(!isFullscreen)}
						title={isFullscreen ? __('حالت عادی', 'tabesh-v2') : __('تمام صفحه', 'tabesh-v2')}
					>
						{isFullscreen ? '❐' : '⛶'}
					</button>
					<button
						className="control-btn close"
						onClick={onClose}
						title={__('بستن', 'tabesh-v2')}
					>
						×
					</button>
				</div>
			</div>
			{!isMinimized && (
				<div className="panel-content">
					{renderModuleContent()}
				</div>
			)}
		</div>
	);
};

/**
 * Module Components (UI only, no backend connections)
 */

// Price History Module
const PriceHistoryModule = () => {
	// TODO: Phase 2 - Replace with API call to fetch real-time pricing data
	// This is static placeholder data for UI/UX demonstration only
	const currencies = [
		{ id: 'paper', name: __('کاغذ', 'tabesh-v2'), value: '125,000', change: '+2.5%', trend: 'up' },
		{ id: 'gold', name: __('طلا', 'tabesh-v2'), value: '2,450,000', change: '+1.2%', trend: 'up' },
		{ id: 'dollar', name: __('دلار', 'tabesh-v2'), value: '52,300', change: '-0.5%', trend: 'down' },
		{ id: 'euro', name: __('یورو', 'tabesh-v2'), value: '56,800', change: '+0.8%', trend: 'up' },
		{ id: 'dirham', name: __('درهم', 'tabesh-v2'), value: '14,250', change: '+0.3%', trend: 'up' },
	];

	return (
		<div className="price-history-content">
			<div className="currency-grid">
				{currencies.map((currency) => (
					<div key={currency.id} className={`currency-card ${currency.trend}`}>
						<div className="currency-name">{currency.name}</div>
						<div className="currency-value">{currency.value}</div>
						<div className={`currency-change ${currency.trend}`}>
							<span className="trend-icon">{currency.trend === 'up' ? '↗' : '↘'}</span>
							{currency.change}
						</div>
						<div className="mini-chart">
							{/* Placeholder for chart */}
							<div className="chart-placeholder">📊</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

// New Articles Module
const NewArticlesModule = () => {
	const articles = [
		{ id: 1, title: 'راهنمای انتخاب کاغذ مناسب', date: '1403/10/10', category: 'آموزشی' },
		{ id: 2, title: 'نکات مهم در چاپ افست', date: '1403/10/09', category: 'فنی' },
		{ id: 3, title: 'تکنولوژی‌های جدید چاپ', date: '1403/10/08', category: 'اخبار' },
	];

	return (
		<div className="articles-content">
			<div className="articles-list">
				{articles.map((article) => (
					<div key={article.id} className="article-item">
						<div className="article-icon">📄</div>
						<div className="article-info">
							<h4 className="article-title">{article.title}</h4>
							<div className="article-meta">
								<span className="article-category">{article.category}</span>
								<span className="article-date">{article.date}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

// New Order Module
const NewOrderModule = () => {
	const [selectedProduct, setSelectedProduct] = useState('');
	// TODO: Phase 2 - Fetch product list from API/WordPress settings
	// This is static placeholder data for UI/UX demonstration only
	const products = ['کتاب', 'بروشور', 'کارت ویزیت', 'تراکت', 'کاتالوگ'];

	return (
		<div className="new-order-content">
			<div className="order-form">
				<div className="form-section">
					<label className="form-label">{__('انتخاب محصول', 'tabesh-v2')}</label>
					<select
						className="form-select"
						value={selectedProduct}
						onChange={(e) => setSelectedProduct(e.target.value)}
					>
						<option value="">{__('محصول خود را انتخاب کنید', 'tabesh-v2')}</option>
						{products.map((product, index) => (
							<option key={index} value={product}>{product}</option>
						))}
					</select>
				</div>
				{selectedProduct && (
					<div className="product-list animate-slide-in">
						<h4>{__('پارامترهای محصول', 'tabesh-v2')}</h4>
						<div className="parameter-grid">
							<div className="parameter-item">
								<label>{__('سایز', 'tabesh-v2')}</label>
								<select className="form-select"><option>A4</option><option>A5</option></select>
							</div>
							<div className="parameter-item">
								<label>{__('تعداد', 'tabesh-v2')}</label>
								<input type="number" className="form-input" placeholder="1000" />
							</div>
							<div className="parameter-item">
								<label>{__('نوع کاغذ', 'tabesh-v2')}</label>
								<select className="form-select"><option>گلاسه</option><option>تحریر</option></select>
							</div>
							<div className="parameter-item">
								<label>{__('رنگ', 'tabesh-v2')}</label>
								<select className="form-select"><option>تمام رنگ</option><option>سیاه و سفید</option></select>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// Order History Module
const OrderHistoryModule = () => {
	const orders = [
		{ id: 1001, product: 'کتاب', date: '1403/10/10', status: 'تحویل شده', amount: '5,000,000' },
		{ id: 1002, product: 'بروشور', date: '1403/10/08', status: 'در حال تولید', amount: '2,500,000' },
		{ id: 1003, product: 'کارت ویزیت', date: '1403/10/05', status: 'تحویل شده', amount: '800,000' },
	];

	return (
		<div className="order-history-content">
			<div className="orders-table">
				{orders.map((order) => (
					<div key={order.id} className="order-row">
						<div className="order-id">#{order.id}</div>
						<div className="order-product">{order.product}</div>
						<div className="order-date">{order.date}</div>
						<div className={`order-status status-${order.status === 'تحویل شده' ? 'delivered' : 'processing'}`}>
							{order.status}
						</div>
						<div className="order-amount">{order.amount} ریال</div>
					</div>
				))}
			</div>
		</div>
	);
};

// Active Orders Module
const ActiveOrdersModule = () => {
	const activeOrders = [
		{ id: 1002, product: 'بروشور', progress: 65, stage: 'چاپ' },
		{ id: 1004, product: 'کاتالوگ', progress: 30, stage: 'پیش چاپ' },
	];

	return (
		<div className="active-orders-content">
			{activeOrders.map((order) => (
				<div key={order.id} className="active-order-card">
					<div className="order-header">
						<span className="order-number">#{order.id}</span>
						<span className="order-product-name">{order.product}</span>
					</div>
					<div className="order-stage">{__('مرحله:', 'tabesh-v2')} {order.stage}</div>
					<div className="progress-bar">
						<div className="progress-fill" style={{ width: `${order.progress}%` }}></div>
					</div>
					<div className="progress-text">{order.progress}% {__('تکمیل', 'tabesh-v2')}</div>
				</div>
			))}
		</div>
	);
};

// Financial Report Module
const FinancialReportModule = () => {
	return (
		<div className="financial-content">
			<div className="financial-grid">
				<div className="financial-card">
					<div className="financial-label">{__('مجموع خرید', 'tabesh-v2')}</div>
					<div className="financial-value">45,000,000 ریال</div>
					<div className="financial-trend up">+15% از ماه قبل</div>
				</div>
				<div className="financial-card">
					<div className="financial-label">{__('سفارشات تکمیل شده', 'tabesh-v2')}</div>
					<div className="financial-value">23 سفارش</div>
					<div className="financial-trend up">+8% از ماه قبل</div>
				</div>
				<div className="financial-card">
					<div className="financial-label">{__('میانگین سفارش', 'tabesh-v2')}</div>
					<div className="financial-value">1,956,000 ریال</div>
					<div className="financial-trend neutral">بدون تغییر</div>
				</div>
			</div>
		</div>
	);
};

// File Management Module
const FileManagementModule = () => {
	const files = [
		{ name: 'طرح-جلد-کتاب.pdf', size: '2.5 MB', date: '1403/10/10' },
		{ name: 'فایل-چاپ-بروشور.ai', size: '15.8 MB', date: '1403/10/08' },
		{ name: 'لوگو-شرکت.svg', size: '156 KB', date: '1403/10/05' },
	];

	return (
		<div className="file-management-content">
			<div className="files-list">
				{files.map((file, index) => (
					<div key={index} className="file-item">
						<span className="file-icon">📄</span>
						<div className="file-info">
							<div className="file-name">{file.name}</div>
							<div className="file-meta">
								<span>{file.size}</span>
								<span>{file.date}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

// AI Chatbot Module
const AIChatbotModule = () => {
	return (
		<div className="chatbot-content">
			<div className="chat-messages">
				<div className="chat-message bot">
					<div className="message-avatar">🤖</div>
					<div className="message-bubble">
						{__('سلام! چطور می‌تونم کمکتون کنم؟', 'tabesh-v2')}
					</div>
				</div>
			</div>
			<div className="chat-input-area">
				<input
					type="text"
					className="chat-input"
					placeholder={__('پیام خود را بنویسید...', 'tabesh-v2')}
				/>
				<button className="chat-send">📤</button>
			</div>
		</div>
	);
};

// Support Ticket Module
const SupportTicketModule = () => {
	return (
		<div className="support-ticket-content">
			<div className="ticket-form">
				<input
					type="text"
					className="form-input"
					placeholder={__('موضوع تیکت', 'tabesh-v2')}
				/>
				<textarea
					className="form-textarea"
					placeholder={__('توضیحات خود را بنویسید...', 'tabesh-v2')}
					rows="5"
				></textarea>
				<button className="submit-btn">{__('ارسال تیکت', 'tabesh-v2')}</button>
			</div>
		</div>
	);
};

// Account Manager Module
const AccountManagerModule = () => {
	return (
		<div className="account-manager-content">
			<div className="manager-info">
				<div className="manager-avatar">👤</div>
				<div className="manager-details">
					<h4>{__('مدیر حساب شما', 'tabesh-v2')}</h4>
					<p>{__('احمد محمدی', 'tabesh-v2')}</p>
				</div>
			</div>
			<div className="message-form">
				<textarea
					className="form-textarea"
					placeholder={__('پیام خود را بنویسید...', 'tabesh-v2')}
					rows="4"
				></textarea>
				<button className="submit-btn">{__('ارسال پیام', 'tabesh-v2')}</button>
			</div>
		</div>
	);
};

// Guild Area Module
const GuildAreaModule = () => {
	return (
		<div className="guild-content">
			<div className="guild-info">
				<h3>{__('اخبار کانون صنفی', 'tabesh-v2')}</h3>
				<div className="guild-item">
					<span className="guild-icon">📢</span>
					<span>{__('جلسه هیئت مدیره - 1403/10/15', 'tabesh-v2')}</span>
				</div>
				<div className="guild-item">
					<span className="guild-icon">📋</span>
					<span>{__('بخشنامه جدید - 1403/10/12', 'tabesh-v2')}</span>
				</div>
			</div>
		</div>
	);
};

// Published Products Module
const PublishedProductsModule = () => {
	return (
		<div className="products-content">
			<div className="products-grid">
				<div className="product-card">
					<div className="product-image">📦</div>
					<div className="product-name">{__('کتاب A4', 'tabesh-v2')}</div>
					<div className="product-status active">{__('فعال', 'tabesh-v2')}</div>
				</div>
				<div className="product-card">
					<div className="product-image">📦</div>
					<div className="product-name">{__('بروشور A5', 'tabesh-v2')}</div>
					<div className="product-status active">{__('فعال', 'tabesh-v2')}</div>
				</div>
			</div>
		</div>
	);
};

// Sales Metrics Module
const SalesMetricsModule = () => {
	return (
		<div className="sales-content">
			<div className="metrics-chart">
				<div className="chart-placeholder">
					<span>📊</span>
					<p>{__('نمودار فروش', 'tabesh-v2')}</p>
				</div>
			</div>
			<div className="metrics-summary">
				<div className="metric-item">
					<span className="metric-label">{__('این ماه', 'tabesh-v2')}</span>
					<span className="metric-value">12 {__('سفارش', 'tabesh-v2')}</span>
				</div>
				<div className="metric-item">
					<span className="metric-label">{__('ماه قبل', 'tabesh-v2')}</span>
					<span className="metric-value">8 {__('سفارش', 'tabesh-v2')}</span>
				</div>
			</div>
		</div>
	);
};

// Advertising Module
const AdvertisingModule = () => {
	return (
		<div className="advertising-content">
			<div className="ad-banner">
				<div className="ad-icon">📢</div>
				<div className="ad-text">
					<h4>{__('تخفیف ویژه', 'tabesh-v2')}</h4>
					<p>{__('20% تخفیف برای سفارشات بالای 10 میلیون', 'tabesh-v2')}</p>
				</div>
			</div>
		</div>
	);
};

// Placeholder Module
const PlaceholderModule = ({ title }) => {
	return (
		<div className="placeholder-content">
			<div className="placeholder-icon">⚙️</div>
			<p>{__('محتوای', 'tabesh-v2')} {title}</p>
		</div>
	);
};

export default SuperDashboard;
