import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ThemeProvider } from './ThemeProvider';
import Header from './Header';
import Sidebar from './Sidebar';
import MegaMenu from './MegaMenu';
import Workspace from './Workspace';
import AdminPanel from './panels/AdminPanel';
import EmployeePanel from './panels/EmployeePanel';
import CustomerPanel from './panels/CustomerPanel';
import AuthorPanel from './panels/AuthorPanel';
import PublisherPanel from './panels/PublisherPanel';

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [activeView, setActiveView] = useState('home');
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

	useEffect(() => {
		// Get user data from localized script
		if (window.tabeshDashboardData && window.tabeshDashboardData.user) {
			setUser(window.tabeshDashboardData.user);
		}
	}, []);

	if (!user) {
		return (
			<div className="tabesh-dashboard-loading">
				<div className="tabesh-spinner"></div>
				<p>{__('Loading...', 'tabesh-v2')}</p>
			</div>
		);
	}

	const getUserRole = () => {
		if (!user.roles || user.roles.length === 0) return 'customer';
		
		// Priority order: administrator > manager > employee > author > publisher > customer
		if (user.roles.includes('administrator')) return 'administrator';
		if (user.roles.includes('manager')) return 'manager';
		if (user.roles.includes('employee')) return 'employee';
		if (user.roles.includes('author')) return 'author';
		if (user.roles.includes('publisher')) return 'publisher';
		return 'customer';
	};

	const renderRolePanel = () => {
		const role = getUserRole();

		switch (role) {
			case 'administrator':
			case 'manager':
				return <AdminPanel user={user} activeView={activeView} setActiveView={setActiveView} />;
			case 'employee':
				return <EmployeePanel user={user} activeView={activeView} setActiveView={setActiveView} />;
			case 'author':
				return <AuthorPanel user={user} activeView={activeView} setActiveView={setActiveView} />;
			case 'publisher':
				return <PublisherPanel user={user} activeView={activeView} setActiveView={setActiveView} />;
			default:
				return <CustomerPanel user={user} activeView={activeView} setActiveView={setActiveView} />;
		}
	};

	return (
		<ThemeProvider>
			<div className="tabesh-dashboard">
				<Header
					user={user}
					onMenuToggle={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
					onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
				/>

				<div className="tabesh-dashboard-content">
					{isSidebarOpen && (
						<Sidebar
							user={user}
							activeView={activeView}
							onViewChange={setActiveView}
							role={getUserRole()}
						/>
					)}

					<Workspace>
						{renderRolePanel()}
					</Workspace>

					{isMegaMenuOpen && (
						<MegaMenu
							user={user}
							role={getUserRole()}
							onClose={() => setIsMegaMenuOpen(false)}
						/>
					)}
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Dashboard;
