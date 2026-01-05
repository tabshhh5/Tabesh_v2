import { render } from '@wordpress/element';
import AuthForm from './components/auth/AuthForm';

/**
 * Initialize the Authentication Form.
 */
const initAuthForm = () => {
	const container = document.getElementById( 'tabesh-auth-root' );
	
	if ( container ) {
		render( <AuthForm />, container );
	}
};

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAuthForm );
} else {
	initAuthForm();
}
