import { __ } from '@wordpress/i18n';
import { useTheme } from './ThemeProvider';

const Header = ({ user, onMenuToggle, onSidebarToggle }) => {
	const { theme, toggleTheme, isDark } = useTheme();

	return (
		<header className="tabesh-header">
			<div className="tabesh-header-left">
				<button
					className="tabesh-icon-btn"
					onClick={onSidebarToggle}
					aria-label={__('Toggle sidebar', 'tabesh-v2')}
				>
					<span className="dashicons dashicons-menu"></span>
				</button>
				<h1 className="tabesh-header-title">
					{__('Tabesh Panel', 'tabesh-v2')}
				</h1>
			</div>

			<div className="tabesh-header-right">
				<button
					className="tabesh-icon-btn"
					onClick={toggleTheme}
					aria-label={__('Toggle theme', 'tabesh-v2')}
					title={isDark ? __('Switch to light mode', 'tabesh-v2') : __('Switch to dark mode', 'tabesh-v2')}
				>
					<span className={`dashicons ${isDark ? 'dashicons-admin-appearance' : 'dashicons-admin-customizer'}`}></span>
				</button>

				<button
					className="tabesh-icon-btn"
					onClick={onMenuToggle}
					aria-label={__('Toggle menu', 'tabesh-v2')}
				>
					<span className="dashicons dashicons-grid-view"></span>
				</button>

				<a
					href={window.tabeshDashboardData?.siteUrl || '/'}
					className="tabesh-icon-btn"
					aria-label={__('Back to site', 'tabesh-v2')}
				>
					<span className="dashicons dashicons-admin-home"></span>
				</a>

				<div className="tabesh-user-menu">
					<div className="tabesh-user-avatar">
						{user.displayName.charAt(0).toUpperCase()}
					</div>
					<div className="tabesh-user-info">
						<span className="tabesh-user-name">{user.displayName}</span>
						<a
							href={window.tabeshDashboardData?.logoutUrl || '#'}
							className="tabesh-logout-link"
						>
							{__('Logout', 'tabesh-v2')}
						</a>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
