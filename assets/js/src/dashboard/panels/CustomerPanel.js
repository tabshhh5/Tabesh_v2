import { __ } from '@wordpress/i18n';

const CustomerPanel = ({ user, activeView, setActiveView }) => {
	const renderView = () => {
		switch (activeView) {
			case 'home':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Welcome', 'tabesh-v2')} {user.displayName}</h2>
						<p>{__('This is your customer dashboard.', 'tabesh-v2')}</p>

						<div className="tabesh-dashboard-grid">
							<div className="tabesh-card">
								<h3>{__('Active Orders', 'tabesh-v2')}</h3>
								<div className="tabesh-stat">0</div>
							</div>
							<div className="tabesh-card">
								<h3>{__('Completed Orders', 'tabesh-v2')}</h3>
								<div className="tabesh-stat">0</div>
							</div>
							<div className="tabesh-card">
								<h3>{__('Open Tickets', 'tabesh-v2')}</h3>
								<div className="tabesh-stat">0</div>
							</div>
						</div>
					</div>
				);

			case 'profile':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Profile', 'tabesh-v2')}</h2>
						<div className="tabesh-card">
							<p><strong>{__('Name:', 'tabesh-v2')}</strong> {user.displayName}</p>
							<p><strong>{__('Username:', 'tabesh-v2')}</strong> {user.username}</p>
						</div>
					</div>
				);

			case 'orders':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('My Orders', 'tabesh-v2')}</h2>
						<p>{__('No orders yet.', 'tabesh-v2')}</p>
					</div>
				);

			case 'tickets':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Support Tickets', 'tabesh-v2')}</h2>
						<p>{__('No tickets yet.', 'tabesh-v2')}</p>
					</div>
				);

			default:
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Not Found', 'tabesh-v2')}</h2>
						<p>{__('The requested page was not found.', 'tabesh-v2')}</p>
					</div>
				);
		}
	};

	return <div className="tabesh-customer-panel">{renderView()}</div>;
};

export default CustomerPanel;
