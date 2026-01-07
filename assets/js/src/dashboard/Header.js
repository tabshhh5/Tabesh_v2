import { __ } from '@wordpress/i18n';

const Header = ({ user, onMenuToggle, onSidebarToggle }) => {
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
