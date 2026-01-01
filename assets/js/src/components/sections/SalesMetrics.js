import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * SalesMetrics Component.
 * 
 * Display sales metrics and analytics.
 */
const SalesMetrics = () => {
	return (
		<div className="section-sales-metrics">
			<div className="section-header">
				<h2>{ __( 'میزان فروش', 'tabesh-v2' ) }</h2>
				<select className="period-selector">
					<option>{ __( 'این ماه', 'tabesh-v2' ) }</option>
					<option>{ __( 'ماه گذشته', 'tabesh-v2' ) }</option>
					<option>{ __( 'سه ماه گذشته', 'tabesh-v2' ) }</option>
					<option>{ __( 'امسال', 'tabesh-v2' ) }</option>
				</select>
			</div>

			<div className="metrics-overview">
				<div className="metric-card primary">
					<Icon icon={ icons.trendingUp } />
					<div>
						<h3>{ __( 'کل فروش', 'tabesh-v2' ) }</h3>
						<p className="metric-value">۳۰,۰۰۰</p>
						<span className="metric-change positive">+12% { __( 'نسبت به ماه قبل', 'tabesh-v2' ) }</span>
					</div>
				</div>
				<div className="metric-card">
					<Icon icon={ icons.payment } />
					<div>
						<h3>{ __( 'درآمد', 'tabesh-v2' ) }</h3>
						<p className="metric-value">۴۵,۲۰۰,۰۰۰</p>
						<span className="metric-label">{ __( 'تومان', 'tabesh-v2' ) }</span>
					</div>
				</div>
				<div className="metric-card">
					<Icon icon={ icons.tag } />
					<div>
						<h3>{ __( 'تعداد سفارش', 'tabesh-v2' ) }</h3>
						<p className="metric-value">148</p>
						<span className="metric-change positive">+8 { __( 'این ماه', 'tabesh-v2' ) }</span>
					</div>
				</div>
			</div>

			<div className="chart-section">
				<h3>{ __( 'نمودار فروش', 'tabesh-v2' ) }</h3>
				<div className="chart-container">
					<div className="chart-placeholder large">
						<svg viewBox="0 0 400 200" className="sales-chart">
							<polyline
								points="0,150 50,120 100,130 150,100 200,110 250,80 300,90 350,60 400,70"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
							/>
							<polyline
								points="0,150 50,120 100,130 150,100 200,110 250,80 300,90 350,60 400,70 400,200 0,200"
								fill="currentColor"
								opacity="0.1"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div className="top-products">
				<h3>{ __( 'پرفروش‌ترین محصولات', 'tabesh-v2' ) }</h3>
				<div className="products-list">
					{ [ 1, 2, 3, 4, 5 ].map( ( i ) => (
						<div key={ i } className="product-row">
							<span className="rank">{ i }</span>
							<div className="product-info">
								<span className="product-name">
									{ __( 'محصول نمونه', 'tabesh-v2' ) } { i }
								</span>
							</div>
							<div className="product-sales">
								<span className="sales-count">{ 1000 - i * 150 }</span>
								<span className="sales-label">{ __( 'فروش', 'tabesh-v2' ) }</span>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default SalesMetrics;
