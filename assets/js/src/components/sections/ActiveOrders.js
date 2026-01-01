import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * ActiveOrders Component.
 * 
 * Display currently active orders with progress tracking.
 */
const ActiveOrders = () => {
	const activeOrders = [
		{ id: 1004, title: __( 'چاپ پوستر A2', 'tabesh-v2' ), progress: 75, status: 'printing' },
		{ id: 1005, title: __( 'چاپ کارت ویزیت', 'tabesh-v2' ), progress: 40, status: 'design' },
		{ id: 1006, title: __( 'چاپ بنر نمایشگاهی', 'tabesh-v2' ), progress: 20, status: 'pending' },
	];

	return (
		<div className="section-active-orders">
			<div className="section-header">
				<h2>{ __( 'سفارشات در حال انجام', 'tabesh-v2' ) }</h2>
				<p className="section-description">
					{ __( 'پیگیری وضعیت سفارشات جاری', 'tabesh-v2' ) }
				</p>
			</div>

			<div className="active-orders-list">
				{ activeOrders.map( ( order ) => (
					<div key={ order.id } className="active-order-card">
						<div className="order-header">
							<div className="order-info">
								<h3>{ order.title }</h3>
								<span className="order-id">#{ order.id }</span>
							</div>
							<button className="order-action">
								<Icon icon={ icons.moreVertical } />
							</button>
						</div>

						<div className="order-progress">
							<div className="progress-bar">
								<div 
									className="progress-fill" 
									style={ { width: `${ order.progress }%` } }
								></div>
							</div>
							<span className="progress-label">{ order.progress }%</span>
						</div>

						<div className="order-timeline">
							<div className="timeline-step completed">
								<Icon icon={ icons.check } />
								<span>{ __( 'ثبت سفارش', 'tabesh-v2' ) }</span>
							</div>
							<div className={ `timeline-step ${ order.progress > 25 ? 'completed' : '' }` }>
								<Icon icon={ icons.edit } />
								<span>{ __( 'طراحی', 'tabesh-v2' ) }</span>
							</div>
							<div className={ `timeline-step ${ order.progress > 50 ? 'completed' : '' }` }>
								<Icon icon={ icons.media } />
								<span>{ __( 'چاپ', 'tabesh-v2' ) }</span>
							</div>
							<div className={ `timeline-step ${ order.progress === 100 ? 'completed' : '' }` }>
								<Icon icon={ icons.box } />
								<span>{ __( 'تحویل', 'tabesh-v2' ) }</span>
							</div>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
};

export default ActiveOrders;
