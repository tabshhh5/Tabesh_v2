import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Main App Component.
 */
const App = () => {
	const [ stats, setStats ] = useState( null );
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		loadStats();
	}, [] );

	const loadStats = async () => {
		try {
			const response = await apiFetch( {
				path: '/tabesh/v2/orders',
			} );
			setStats( {
				total: response.total || 0,
			} );
			setLoading( false );
		} catch ( error ) {
			console.error( 'Error loading stats:', error );
			setLoading( false );
		}
	};

	if ( loading ) {
		return (
			<div className="tabesh-v2-app">
				<div className="loading">
					{ __( 'Loading...', 'tabesh-v2' ) }
				</div>
			</div>
		);
	}

	return (
		<div className="tabesh-v2-app">
			<h1>
				{ __( 'Tabesh v2 - Print Shop Order Management', 'tabesh-v2' ) }
			</h1>
			<div className="card">
				<h2>{ __( 'Welcome to Tabesh v2', 'tabesh-v2' ) }</h2>
				<p>
					{ __(
						'This is a comprehensive print shop order management system.',
						'tabesh-v2'
					) }
				</p>
				<div className="stats-grid">
					<div className="stat-card">
						<p>{ __( 'Total Orders', 'tabesh-v2' ) }</p>
						<h3>{ stats?.total || 0 }</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
