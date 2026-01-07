import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import LoginPage from './auth/LoginPage';

// Wait for DOM to be ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAuth );
} else {
	initAuth();
}

function initAuth() {
	const rootElement = document.getElementById( 'tabesh-auth-root' );
	
	if ( rootElement ) {
		const root = createRoot( rootElement );
		root.render( <LoginPage /> );
	}
}
