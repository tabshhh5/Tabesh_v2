import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * GlobalHeader Component.
 * 
 * Context-specific header for each workspace section.
 */
const GlobalHeader = ( { title, icon, onMenuToggle } ) => {
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
		<header className="tabesh-global-header">
			<div className="header-left">
				<button
					className="menu-toggle-btn"
					onClick={ onMenuToggle }
					aria-label={ __( 'باز کردن منو', 'tabesh-v2' ) }
				>
					<Icon icon={ icons.menu } />
				</button>
				
				<div className="header-title">
					<Icon icon={ getIcon( icon ) } />
					<h1>{ title }</h1>
				</div>
			</div>

			<div className="header-right">
				<button
					className="header-action-btn"
					aria-label={ __( 'جستجو', 'tabesh-v2' ) }
				>
					<Icon icon={ icons.search } />
				</button>
				
				<button
					className="header-action-btn"
					aria-label={ __( 'اعلان‌ها', 'tabesh-v2' ) }
				>
					<Icon icon={ icons.bell } />
					<span className="notification-badge">3</span>
				</button>

				<button
					className="header-action-btn"
					aria-label={ __( 'تنظیمات', 'tabesh-v2' ) }
				>
					<Icon icon={ icons.cog } />
				</button>
			</div>
		</header>
	);
};

export default GlobalHeader;
