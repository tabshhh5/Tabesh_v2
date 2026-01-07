import { __ } from '@wordpress/i18n';

const getMenuItems = (role) => {
	const commonItems = [
		{ id: 'home', icon: 'dashboard', label: __('Dashboard', 'tabesh-v2') },
		{ id: 'profile', icon: 'admin-users', label: __('Profile', 'tabesh-v2') },
		{ id: 'orders', icon: 'clipboard', label: __('Orders', 'tabesh-v2') },
		{ id: 'tickets', icon: 'email', label: __('Support Tickets', 'tabesh-v2') },
	];

	const roleSpecificItems = {
		administrator: [
			{ id: 'users', icon: 'groups', label: __('Users', 'tabesh-v2') },
			{ id: 'reports', icon: 'chart-bar', label: __('Reports', 'tabesh-v2') },
			{ id: 'settings', icon: 'admin-settings', label: __('Settings', 'tabesh-v2') },
		],
		manager: [
			{ id: 'users', icon: 'groups', label: __('Users', 'tabesh-v2') },
			{ id: 'reports', icon: 'chart-bar', label: __('Reports', 'tabesh-v2') },
		],
		employee: [
			{ id: 'assigned-orders', icon: 'portfolio', label: __('Assigned Orders', 'tabesh-v2') },
		],
		author: [
			{ id: 'books', icon: 'book', label: __('My Books', 'tabesh-v2') },
			{ id: 'sales', icon: 'chart-area', label: __('Sales', 'tabesh-v2') },
		],
		publisher: [
			{ id: 'books', icon: 'book', label: __('My Books', 'tabesh-v2') },
			{ id: 'sales', icon: 'chart-area', label: __('Sales', 'tabesh-v2') },
			{ id: 'prices', icon: 'money-alt', label: __('Price History', 'tabesh-v2') },
		],
	};

	return [...commonItems, ...(roleSpecificItems[role] || [])];
};

const Sidebar = ({ user, activeView, onViewChange, role }) => {
	const menuItems = getMenuItems(role);

	return (
		<aside className="tabesh-sidebar">
			<nav className="tabesh-sidebar-nav">
				{menuItems.map((item) => (
					<button
						key={item.id}
						className={`tabesh-sidebar-item ${activeView === item.id ? 'active' : ''}`}
						onClick={() => onViewChange(item.id)}
					>
						<span className={`dashicons dashicons-${item.icon}`}></span>
						<span className="tabesh-sidebar-label">{item.label}</span>
					</button>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
