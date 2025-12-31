import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Employees Panel Component.
 */
const EmployeesPanel = () => {
	const [ orders, setOrders ] = useState( [] );
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		loadOrders();
	}, [] );

	const loadOrders = async () => {
		try {
			const response = await apiFetch( {
				path: '/tabesh/v2/orders',
			} );
			setOrders( response.orders || [] );
			setLoading( false );
		} catch ( error ) {
			console.error( 'Error loading orders:', error );
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
			<h1>{ __( 'Employees Panel', 'tabesh-v2' ) }</h1>
			<div className="card">
				<h2>{ __( 'Assigned Orders', 'tabesh-v2' ) }</h2>
				{ orders.length === 0 ? (
					<p>{ __( 'No assigned orders found.', 'tabesh-v2' ) }</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>{ __( 'Order Number', 'tabesh-v2' ) }</th>
								<th>{ __( 'Status', 'tabesh-v2' ) }</th>
								<th>{ __( 'Deadline', 'tabesh-v2' ) }</th>
								<th>{ __( 'Priority', 'tabesh-v2' ) }</th>
							</tr>
						</thead>
						<tbody>
							{ orders.map( ( order ) => (
								<tr key={ order.id }>
									<td>{ order.order_number }</td>
									<td>{ order.status }</td>
									<td>{ order.deadline }</td>
									<td>{ order.priority }</td>
								</tr>
							) ) }
						</tbody>
					</table>
				) }
			</div>
		</div>
	);
};

export default EmployeesPanel;
