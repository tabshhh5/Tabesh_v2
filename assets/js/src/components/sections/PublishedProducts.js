import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * PublishedProducts Component.
 * 
 * Display customer's published products.
 */
const PublishedProducts = () => {
	const products = [
		{ id: 1, name: __( 'کتاب آموزش برنامه‌نویسی', 'tabesh-v2' ), copies: 1000, sales: 750 },
		{ id: 2, name: __( 'کاتالوگ محصولات', 'tabesh-v2' ), copies: 500, sales: 480 },
		{ id: 3, name: __( 'بروشور تبلیغاتی', 'tabesh-v2' ), copies: 2000, sales: 1850 },
	];

	return (
		<div className="section-published-products">
			<div className="section-header">
				<h2>{ __( 'محصولات منتشر شده', 'tabesh-v2' ) }</h2>
				<button className="btn-primary">
					<Icon icon={ icons.plus } />
					{ __( 'محصول جدید', 'tabesh-v2' ) }
				</button>
			</div>

			<div className="products-grid">
				{ products.map( ( product ) => (
					<div key={ product.id } className="product-card">
						<div className="product-image">
							<Icon icon={ icons.store } />
						</div>
						<div className="product-info">
							<h3>{ product.name }</h3>
							<div className="product-stats">
								<div className="stat">
									<span className="stat-label">{ __( 'تیراژ', 'tabesh-v2' ) }</span>
									<span className="stat-value">{ product.copies }</span>
								</div>
								<div className="stat">
									<span className="stat-label">{ __( 'فروش', 'tabesh-v2' ) }</span>
									<span className="stat-value">{ product.sales }</span>
								</div>
								<div className="stat">
									<span className="stat-label">{ __( 'درصد', 'tabesh-v2' ) }</span>
									<span className="stat-value">
										{ Math.round( ( product.sales / product.copies ) * 100 ) }%
									</span>
								</div>
							</div>
							<div className="progress-bar">
								<div
									className="progress-fill"
									style={ { width: `${ ( product.sales / product.copies ) * 100 }%` } }
								></div>
							</div>
						</div>
						<div className="product-actions">
							<button className="action-btn">
								<Icon icon={ icons.seen } />
							</button>
							<button className="action-btn">
								<Icon icon={ icons.edit } />
							</button>
							<button className="action-btn">
								<Icon icon={ icons.download } />
							</button>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
};

export default PublishedProducts;
