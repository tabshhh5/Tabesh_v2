const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve( process.cwd(), 'assets/js/src', 'index.js' ),
		'customer-dashboard': path.resolve( process.cwd(), 'assets/js/src', 'customer-dashboard.js' ),
		auth: path.resolve( process.cwd(), 'assets/js/src', 'auth.js' ),
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'assets/js/build' ),
	},
};
