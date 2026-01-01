import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * DashboardHome Component.
 * 
 * Main dashboard overview with quick stats and recent activities.
 */
const DashboardHome = () => {
	return (
		<div className="section-dashboard-home">
			<div className="dashboard-grid">
				<div className="stat-card">
					<div className="stat-icon">
						<Icon icon={ icons.tag } />
					</div>
					<div className="stat-content">
						<h3>{ __( 'سفارشات فعال', 'tabesh-v2' ) }</h3>
						<p className="stat-value">12</p>
						<span className="stat-change positive">+3 { __( 'این هفته', 'tabesh-v2' ) }</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">
						<Icon icon={ icons.check } />
					</div>
					<div className="stat-content">
						<h3>{ __( 'سفارشات تکمیل شده', 'tabesh-v2' ) }</h3>
						<p className="stat-value">148</p>
						<span className="stat-change positive">+8 { __( 'این ماه', 'tabesh-v2' ) }</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">
						<Icon icon={ icons.payment } />
					</div>
					<div className="stat-content">
						<h3>{ __( 'مجموع خرید', 'tabesh-v2' ) }</h3>
						<p className="stat-value">۴۵,۲۰۰,۰۰۰</p>
						<span className="stat-label">{ __( 'تومان', 'tabesh-v2' ) }</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">
						<Icon icon={ icons.info } />
					</div>
					<div className="stat-content">
						<h3>{ __( 'تیکت‌های باز', 'tabesh-v2' ) }</h3>
						<p className="stat-value">2</p>
						<span className="stat-change">{ __( 'پاسخ در انتظار', 'tabesh-v2' ) }</span>
					</div>
				</div>
			</div>

			<div className="dashboard-sections">
				<div className="recent-orders">
					<h2>{ __( 'آخرین سفارشات', 'tabesh-v2' ) }</h2>
					<div className="order-list">
						{ [ 1, 2, 3 ].map( ( i ) => (
							<div key={ i } className="order-item">
								<div className="order-info">
									<span className="order-id">#{ 1000 + i }</span>
									<span className="order-title">
										{ __( 'چاپ کاتالوگ رنگی', 'tabesh-v2' ) }
									</span>
								</div>
								<div className="order-meta">
									<span className="order-status in-progress">
										{ __( 'در حال انجام', 'tabesh-v2' ) }
									</span>
									<span className="order-date">
										{ __( '۲ روز پیش', 'tabesh-v2' ) }
									</span>
								</div>
							</div>
						) ) }
					</div>
				</div>

				<div className="quick-actions">
					<h2>{ __( 'دسترسی سریع', 'tabesh-v2' ) }</h2>
					<div className="action-buttons">
						<button className="action-btn primary">
							<Icon icon={ icons.plusCircle } />
							<span>{ __( 'سفارش جدید', 'tabesh-v2' ) }</span>
						</button>
						<button className="action-btn">
							<Icon icon={ icons.upload } />
							<span>{ __( 'آپلود فایل', 'tabesh-v2' ) }</span>
						</button>
						<button className="action-btn">
							<Icon icon={ icons.inbox } />
							<span>{ __( 'ارسال تیکت', 'tabesh-v2' ) }</span>
						</button>
						<button className="action-btn">
							<Icon icon={ icons.comment } />
							<span>{ __( 'چت با پشتیبانی', 'tabesh-v2' ) }</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;
