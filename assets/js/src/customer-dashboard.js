import { render } from '@wordpress/element';
import CustomerSuperPanel from './components/CustomerSuperPanel';
import './styles/customer-dashboard.scss';

/**
 * Initialize the Customer Super Panel.
 */
const initCustomerDashboard = () => {
	const container = document.getElementById( 'tabesh-customer-super-panel' );
	
	if ( container ) {
		render( <CustomerSuperPanel />, container );
	}
};

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initCustomerDashboard );
} else {
	initCustomerDashboard();
}
