import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Customers Panel Component.
 */
const CustomersPanel = () => {
	const [ customers, setCustomers ] = useState( [] );
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		loadCustomers();
	}, [] );

	const loadCustomers = async () => {
		try {
			const response = await apiFetch( {
				path: '/tabesh/v2/customers',
			} );
			setCustomers( response );
			setLoading( false );
		} catch ( error ) {
			console.error( 'Error loading customers:', error );
			setLoading( false );
		}
	};

	if ( loading ) {
		return (
			<div className="tabesh-v2-app">
				<LoadingSpinner
					message={ __( 'در حال بارگذاری مشتریان...', 'tabesh-v2' ) }
					size="medium"
				/>
			</div>
		);
	}

	return (
		<div className="tabesh-v2-app">
			<h1>{ __( 'Customers Panel', 'tabesh-v2' ) }</h1>
			<div className="card">
				<h2>{ __( 'Customer List', 'tabesh-v2' ) }</h2>
				{ customers.length === 0 ? (
					<p>{ __( 'No customers found.', 'tabesh-v2' ) }</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>{ __( 'ID', 'tabesh-v2' ) }</th>
								<th>{ __( 'Contact Name', 'tabesh-v2' ) }</th>
								<th>{ __( 'Email', 'tabesh-v2' ) }</th>
								<th>{ __( 'Phone', 'tabesh-v2' ) }</th>
								<th>{ __( 'Company', 'tabesh-v2' ) }</th>
							</tr>
						</thead>
						<tbody>
							{ customers.map( ( customer ) => (
								<tr key={ customer.id }>
									<td>{ customer.id }</td>
									<td>{ customer.contact_name }</td>
									<td>{ customer.email }</td>
									<td>{ customer.phone }</td>
									<td>{ customer.company_name }</td>
								</tr>
							) ) }
						</tbody>
					</table>
				) }
			</div>
		</div>
	);
};

export default CustomersPanel;
