import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import App from './components/App';
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
