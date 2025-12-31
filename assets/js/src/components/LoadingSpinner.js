import { __ } from '@wordpress/i18n';

/**
 * Modern Loading Spinner Component
 * 
 * A visually appealing loading spinner with animation.
 * 
 * @param {Object} props Component props
 * @param {string} props.message Optional loading message
 * @param {string} props.size Size of spinner: 'small', 'medium', 'large'
 */
const LoadingSpinner = ( { message, size = 'medium' } ) => {
	return (
		<div className="tabesh-loading-container">
			<div className={ `tabesh-spinner tabesh-spinner-${ size }` }>
				<div className="tabesh-spinner-circle"></div>
				<div className="tabesh-spinner-circle"></div>
				<div className="tabesh-spinner-circle"></div>
			</div>
			{ message && (
				<p className="tabesh-loading-message">{ message }</p>
			) }
		</div>
	);
};

export default LoadingSpinner;
