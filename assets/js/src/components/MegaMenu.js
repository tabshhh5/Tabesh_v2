import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * MegaMenu Component.
 * 
 * Expandable mega menu on the right for RTL (Persian) and left for LTR.
 */
const MegaMenu = ( { sections, activeSection, onSectionChange, isOpen, onToggle } ) => {
	const isRTL = window.tabeshCustomerDashboard?.isRTL || false;

	// Organize sections into categories for better UX.
	const menuCategories = [
		{
			id: 'main',
			title: __( 'اصلی', 'tabesh-v2' ),
			items: [ 'dashboard', 'newOrder', 'orderHistory', 'activeOrders' ],
		},
		{
			id: 'business',
			title: __( 'کسب و کار', 'tabesh-v2' ),
			items: [ 'financialReports', 'salesMetrics', 'publishedProducts', 'advertisements' ],
		},
		{
			id: 'tools',
			title: __( 'ابزارها', 'tabesh-v2' ),
			items: [ 'fileManagement', 'priceCharts', 'articles', 'tradeUnion' ],
		},
		{
			id: 'support',
			title: __( 'پشتیبانی', 'tabesh-v2' ),
			items: [ 'aiChatbot', 'ticketSystem', 'accountManager' ],
		},
	];

	const getIcon = ( iconName ) => {
		// Map icon names to WordPress icons.
		const iconMap = {
			dashboard: icons.home,
			'chart-line': icons.chartLine,
			'media-document': icons.page,
			'plus-alt': icons.plusCircle,
			'list-view': icons.list,
			update: icons.update,
			'money-alt': icons.payment,
			portfolio: icons.folder,
			'format-chat': icons.comment,
			email: icons.inbox,
			businessman: icons.people,
			groups: icons.group,
			products: icons.store,
			'chart-bar': icons.chartBar,
			megaphone: icons.megaphone,
		};

		return iconMap[ iconName ] || icons.star;
	};

	return (
		<>
			<div className={ `tabesh-mega-menu ${ isOpen ? 'is-open' : '' } ${ isRTL ? 'is-rtl' : 'is-ltr' }` }>
				<div className="mega-menu-header">
					<h2>{ __( 'پنل مشتریان', 'tabesh-v2' ) }</h2>
					<button
						className="menu-close-btn"
						onClick={ onToggle }
						aria-label={ __( 'بستن منو', 'tabesh-v2' ) }
					>
						<Icon icon={ icons.close } />
					</button>
				</div>

				<div className="mega-menu-content">
					{ menuCategories.map( ( category ) => (
						<div key={ category.id } className="menu-category">
							<h3 className="category-title">{ category.title }</h3>
							<div className="category-items">
								{ category.items.map( ( sectionId ) => {
									const section = sections[ sectionId ];
									if ( ! section ) return null;

									return (
										<button
											key={ section.id }
											className={ `menu-item ${ activeSection === section.id ? 'is-active' : '' }` }
											onClick={ () => onSectionChange( section.id ) }
										>
											<Icon icon={ getIcon( section.icon ) } />
											<span>{ section.title }</span>
										</button>
									);
								} ) }
							</div>
						</div>
					) ) }
				</div>

				<div className="mega-menu-footer">
					<div className="user-info">
						<div className="user-avatar">
							<img 
								src={ window.tabeshCustomerDashboard?.user?.avatarUrl || '' } 
								alt={ window.tabeshCustomerDashboard?.user?.name || '' }
							/>
						</div>
						<div className="user-details">
							<span className="user-name">
								{ window.tabeshCustomerDashboard?.user?.name || __( 'کاربر', 'tabesh-v2' ) }
							</span>
							<span className="user-email">
								{ window.tabeshCustomerDashboard?.user?.email || '' }
							</span>
						</div>
					</div>
				</div>
			</div>

			{ isOpen && (
				<div 
					className="mega-menu-overlay"
					onClick={ onToggle }
					role="button"
					tabIndex={ 0 }
					onKeyDown={ ( e ) => e.key === 'Escape' && onToggle() }
					aria-label={ __( 'بستن منو', 'tabesh-v2' ) }
				/>
			) }
		</>
	);
};

export default MegaMenu;
