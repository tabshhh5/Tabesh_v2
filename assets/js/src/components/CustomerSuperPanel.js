import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ThemeProvider } from '../contexts/ThemeContext';
import MegaMenu from './MegaMenu';
import GlobalHeader from './GlobalHeader';
import DashboardHome from './sections/DashboardHome';
import PriceCharts from './sections/PriceCharts';
import Articles from './sections/Articles';
import NewOrder from './sections/NewOrder';
import OrderHistory from './sections/OrderHistory';
import ActiveOrders from './sections/ActiveOrders';
import FinancialReports from './sections/FinancialReports';
import FileManagement from './sections/FileManagement';
import AIChatbot from './sections/AIChatbot';
import TicketSystem from './sections/TicketSystem';
import AccountManager from './sections/AccountManager';
import TradeUnion from './sections/TradeUnion';
import PublishedProducts from './sections/PublishedProducts';
import SalesMetrics from './sections/SalesMetrics';
import Advertisements from './sections/Advertisements';

/**
 * Customer Super Panel Component.
 * 
 * Modern, professional dashboard workspace for customers.
 */
const CustomerSuperPanel = () => {
	const [ activeSection, setActiveSection ] = useState( 'dashboard' );
	// Menu now starts as open and persists its state
	const [ isMegaMenuOpen, setIsMegaMenuOpen ] = useState( true );

	// Define all available sections.
	const sections = {
		dashboard: {
			id: 'dashboard',
			title: __( 'پیشخوان', 'tabesh-v2' ),
			icon: 'dashboard',
			component: DashboardHome,
		},
		priceCharts: {
			id: 'priceCharts',
			title: __( 'نمودار تاریخچه قیمت', 'tabesh-v2' ),
			icon: 'chart-line',
			component: PriceCharts,
		},
		articles: {
			id: 'articles',
			title: __( 'مقالات جدید', 'tabesh-v2' ),
			icon: 'media-document',
			component: Articles,
		},
		newOrder: {
			id: 'newOrder',
			title: __( 'ثبت سفارش جدید', 'tabesh-v2' ),
			icon: 'plus-alt',
			component: NewOrder,
		},
		orderHistory: {
			id: 'orderHistory',
			title: __( 'تاریخچه سفارشات', 'tabesh-v2' ),
			icon: 'list-view',
			component: OrderHistory,
		},
		activeOrders: {
			id: 'activeOrders',
			title: __( 'سفارشات در حال انجام', 'tabesh-v2' ),
			icon: 'update',
			component: ActiveOrders,
		},
		financialReports: {
			id: 'financialReports',
			title: __( 'گزارش مالی', 'tabesh-v2' ),
			icon: 'money-alt',
			component: FinancialReports,
		},
		fileManagement: {
			id: 'fileManagement',
			title: __( 'مدیریت فایل', 'tabesh-v2' ),
			icon: 'portfolio',
			component: FileManagement,
		},
		aiChatbot: {
			id: 'aiChatbot',
			title: __( 'چتبات هوش مصنوعی', 'tabesh-v2' ),
			icon: 'format-chat',
			component: AIChatbot,
		},
		ticketSystem: {
			id: 'ticketSystem',
			title: __( 'ارسال تیکت', 'tabesh-v2' ),
			icon: 'email',
			component: TicketSystem,
		},
		accountManager: {
			id: 'accountManager',
			title: __( 'پیام به مدیر حساب', 'tabesh-v2' ),
			icon: 'businessman',
			component: AccountManager,
		},
		tradeUnion: {
			id: 'tradeUnion',
			title: __( 'ناحیه کانون صنفی', 'tabesh-v2' ),
			icon: 'groups',
			component: TradeUnion,
		},
		publishedProducts: {
			id: 'publishedProducts',
			title: __( 'محصولات منتشر شده', 'tabesh-v2' ),
			icon: 'products',
			component: PublishedProducts,
		},
		salesMetrics: {
			id: 'salesMetrics',
			title: __( 'میزان فروش', 'tabesh-v2' ),
			icon: 'chart-bar',
			component: SalesMetrics,
		},
		advertisements: {
			id: 'advertisements',
			title: __( 'تبلیغات', 'tabesh-v2' ),
			icon: 'megaphone',
			component: Advertisements,
		},
	};

	const currentSection = sections[ activeSection ];
	const CurrentComponent = currentSection.component;

	const handleSectionChange = ( sectionId ) => {
		setActiveSection( sectionId );
		// Don't close menu on section change - keep it side-by-side
	};

	const toggleMegaMenu = () => {
		setIsMegaMenuOpen( ! isMegaMenuOpen );
	};

	return (
		<ThemeProvider>
			<div className="tabesh-super-panel">
				<MegaMenu
					sections={ sections }
					activeSection={ activeSection }
					onSectionChange={ handleSectionChange }
					isOpen={ isMegaMenuOpen }
					onToggle={ toggleMegaMenu }
				/>
				
				<div className={ `tabesh-workspace ${ isMegaMenuOpen ? 'menu-open' : '' }` }>
					<GlobalHeader
						title={ currentSection.title }
						icon={ currentSection.icon }
						onMenuToggle={ toggleMegaMenu }
					/>
					
					<div className="tabesh-content">
						<CurrentComponent />
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default CustomerSuperPanel;
