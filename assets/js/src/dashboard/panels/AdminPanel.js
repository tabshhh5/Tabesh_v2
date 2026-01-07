import { __ } from '@wordpress/i18n';

const AdminPanel = ({ user, activeView, setActiveView }) => {
	const renderView = () => {
		switch (activeView) {
			case 'home':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Admin Dashboard', 'tabesh-v2')}</h2>
						<p>{__('Welcome to the admin panel.', 'tabesh-v2')}</p>

						<div className="tabesh-dashboard-grid">
							<div className="tabesh-card">
								<h3>{__('Total Orders', 'tabesh-v2')}</h3>
								<div className="tabesh-stat">0</div>
							</div>
							<div className="tabesh-card">
								<h3>{__('Total Users', 'tabesh-v2')}</h3>
								<div className="tabesh-stat">0</div>
							</div>
							<div className="tabesh-card">
								<h3>{__('Revenue', 'tabesh-v2')}</h3>
								<div className="tabesh-stat">0</div>
							</div>
						</div>
					</div>
				);

			default:
				return (
					<div className="tabesh-panel-content">
						<h2>{activeView}</h2>
						<p>{__('Admin panel content for', 'tabesh-v2')} {activeView}</p>
					</div>
				);
		}
	};

	return <div className="tabesh-admin-panel">{renderView()}</div>;
};

export default AdminPanel;
