import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Dashboard from './dashboard/Dashboard';

// Wait for DOM to be ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initDashboard );
} else {
	initDashboard();
}

function initDashboard() {
	const rootElement = document.getElementById( 'tabesh-dashboard-root' );
	
	if ( rootElement ) {
		const root = createRoot( rootElement );
		root.render( <Dashboard /> );
	}
}
