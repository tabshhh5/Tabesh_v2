const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve( process.cwd(), 'assets/js/src', 'index.js' ),
		auth: path.resolve( process.cwd(), 'assets/js/src', 'auth.js' ),
		dashboard: path.resolve( process.cwd(), 'assets/js/src', 'dashboard.js' ),
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'assets/js/build' ),
	},
};
