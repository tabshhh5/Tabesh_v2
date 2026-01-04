import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';
import { useTheme } from '../contexts/ThemeContext';

/**
 * GlobalHeader Component.
 * 
 * Context-specific header for each workspace section.
 */
const GlobalHeader = ( { title, icon, onMenuToggle } ) => {
	const { isDark, toggleTheme } = useTheme();
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
					className="header-action-btn theme-toggle"
					onClick={ toggleTheme }
					aria-label={ isDark ? __( 'حالت روشن', 'tabesh-v2' ) : __( 'حالت تاریک', 'tabesh-v2' ) }
					title={ isDark ? __( 'تغییر به حالت روشن', 'tabesh-v2' ) : __( 'تغییر به حالت تاریک', 'tabesh-v2' ) }
				>
					{ isDark ? (
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="12" cy="12" r="5" />
							<line x1="12" y1="1" x2="12" y2="3" />
							<line x1="12" y1="21" x2="12" y2="23" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
							<line x1="1" y1="12" x2="3" y2="12" />
							<line x1="21" y1="12" x2="23" y2="12" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
						</svg>
					) : (
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
						</svg>
					) }
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
