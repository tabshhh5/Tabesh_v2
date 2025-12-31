import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import App from './components/App';
import CustomersPanel from './panels/CustomersPanel';
import ManagersPanel from './panels/ManagersPanel';
import EmployeesPanel from './panels/EmployeesPanel';
import SettingsPanel from './panels/SettingsPanel';

/**
 * Initialize the Tabesh v2 React application.
 */
const initApp = () => {
	// Main app
	const appRoot = document.getElementById( 'tabesh-v2-app' );
	if ( appRoot ) {
		render( <App />, appRoot );
	}

	// Customers panel
	const customersRoot = document.getElementById( 'tabesh-v2-customers' );
	if ( customersRoot ) {
		render( <CustomersPanel />, customersRoot );
	}

	// Managers panel
	const managersRoot = document.getElementById( 'tabesh-v2-managers' );
	if ( managersRoot ) {
		render( <ManagersPanel />, managersRoot );
	}

	// Employees panel
	const employeesRoot = document.getElementById( 'tabesh-v2-employees' );
	if ( employeesRoot ) {
		render( <EmployeesPanel />, employeesRoot );
	}

	// Settings panel
	const settingsRoot = document.getElementById( 'tabesh-v2-settings' );
	if ( settingsRoot ) {
		render( <SettingsPanel />, settingsRoot );
	}
};

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initApp );
} else {
	initApp();
}
