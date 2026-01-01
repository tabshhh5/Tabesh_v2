import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * FinancialReports Component.
 * 
 * Display financial reports and statistics.
 */
const FinancialReports = () => {
	return (
		<div className="section-financial-reports">
			<div className="section-header">
				<h2>{ __( 'گزارش مالی', 'tabesh-v2' ) }</h2>
				<select className="period-selector">
					<option>{ __( 'این ماه', 'tabesh-v2' ) }</option>
					<option>{ __( 'ماه گذشته', 'tabesh-v2' ) }</option>
					<option>{ __( 'سه ماه گذشته', 'tabesh-v2' ) }</option>
					<option>{ __( 'امسال', 'tabesh-v2' ) }</option>
				</select>
			</div>

			<div className="financial-stats">
				<div className="stat-card primary">
					<Icon icon={ icons.payment } />
					<h3>{ __( 'مجموع خرید', 'tabesh-v2' ) }</h3>
					<p className="stat-value">۴۵,۲۰۰,۰۰۰</p>
					<span className="stat-label">{ __( 'تومان', 'tabesh-v2' ) }</span>
				</div>
				<div className="stat-card">
					<Icon icon={ icons.check } />
					<h3>{ __( 'پرداخت شده', 'tabesh-v2' ) }</h3>
					<p className="stat-value">۴۰,۰۰۰,۰۰۰</p>
					<span className="stat-label">{ __( 'تومان', 'tabesh-v2' ) }</span>
				</div>
				<div className="stat-card">
					<Icon icon={ icons.warning } />
					<h3>{ __( 'باقی‌مانده', 'tabesh-v2' ) }</h3>
					<p className="stat-value">۵,۲۰۰,۰۰۰</p>
					<span className="stat-label">{ __( 'تومان', 'tabesh-v2' ) }</span>
				</div>
			</div>

			<div className="transactions-section">
				<h3>{ __( 'تراکنش‌های اخیر', 'tabesh-v2' ) }</h3>
				<div className="transactions-list">
					{ [ 1, 2, 3, 4, 5 ].map( ( i ) => (
						<div key={ i } className="transaction-item">
							<div className="transaction-icon">
								<Icon icon={ icons.payment } />
							</div>
							<div className="transaction-info">
								<span className="transaction-title">
									{ __( 'پرداخت سفارش', 'tabesh-v2' ) } #{ 1000 + i }
								</span>
								<span className="transaction-date">
									{ __( '۲ روز پیش', 'tabesh-v2' ) }
								</span>
							</div>
							<div className="transaction-amount">
								<span className="amount">۳,۵۰۰,۰۰۰</span>
								<span className="currency">{ __( 'تومان', 'tabesh-v2' ) }</span>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default FinancialReports;
