import { __ } from '@wordpress/i18n';

/**
 * PriceCharts Component.
 * 
 * Display price history charts for paper, gold, dollar, euro, and dirham.
 */
const PriceCharts = () => {
	const priceItems = [
		{ id: 'paper', title: __( 'کاغذ', 'tabesh-v2' ), price: '۲۵,۰۰۰', change: '+2.5%', trend: 'up' },
		{ id: 'gold', title: __( 'طلا', 'tabesh-v2' ), price: '۲,۱۵۰,۰۰۰', change: '+1.8%', trend: 'up' },
		{ id: 'dollar', title: __( 'دلار', 'tabesh-v2' ), price: '۵۲,۵۰۰', change: '-0.5%', trend: 'down' },
		{ id: 'euro', title: __( 'یورو', 'tabesh-v2' ), price: '۵۶,۸۰۰', change: '+0.3%', trend: 'up' },
		{ id: 'dirham', title: __( 'درهم', 'tabesh-v2' ), price: '۱۴,۲۰۰', change: '+0.1%', trend: 'up' },
	];

	return (
		<div className="section-price-charts">
			<div className="section-header">
				<h2>{ __( 'نمودار تاریخچه قیمت', 'tabesh-v2' ) }</h2>
				<div className="header-actions">
					<select className="period-selector">
						<option>{ __( 'امروز', 'tabesh-v2' ) }</option>
						<option>{ __( 'هفته گذشته', 'tabesh-v2' ) }</option>
						<option>{ __( 'ماه گذشته', 'tabesh-v2' ) }</option>
						<option>{ __( 'سال گذشته', 'tabesh-v2' ) }</option>
					</select>
				</div>
			</div>

			<div className="price-grid">
				{ priceItems.map( ( item ) => (
					<div key={ item.id } className="price-card">
						<div className="price-header">
							<h3>{ item.title }</h3>
							<span className={ `price-trend ${ item.trend }` }>{ item.change }</span>
						</div>
						<div className="price-value">{ item.price }</div>
						<div className="price-chart-placeholder">
							<svg viewBox="0 0 200 60" className="mini-chart">
								<polyline
									points="0,40 25,35 50,30 75,32 100,25 125,28 150,20 175,22 200,15"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
					</div>
				) ) }
			</div>

			<div className="main-chart">
				<h3>{ __( 'نمودار تفصیلی', 'tabesh-v2' ) }</h3>
				<div className="chart-container">
					<div className="chart-placeholder">
						{ __( 'نمودار اینجا نمایش داده می‌شود', 'tabesh-v2' ) }
					</div>
				</div>
			</div>
		</div>
	);
};

export default PriceCharts;
