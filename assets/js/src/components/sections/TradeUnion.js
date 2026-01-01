import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * TradeUnion Component.
 * 
 * Trade union area with news and resources.
 */
const TradeUnion = () => {
	const announcements = [
		{ id: 1, title: __( 'جلسه مجمع عمومی', 'tabesh-v2' ), date: '۱۴۰۲/۱۱/۰۱' },
		{ id: 2, title: __( 'تغییرات نرخ کاغذ', 'tabesh-v2' ), date: '۱۴۰۲/۱۰/۲۸' },
		{ id: 3, title: __( 'دوره آموزشی جدید', 'tabesh-v2' ), date: '۱۴۰۲/۱۰/۲۵' },
	];

	return (
		<div className="section-trade-union">
			<div className="section-header">
				<h2>{ __( 'ناحیه کانون صنفی', 'tabesh-v2' ) }</h2>
				<p className="section-description">
					{ __( 'اخبار و اطلاعیه‌های کانون صنفی چاپ', 'tabesh-v2' ) }
				</p>
			</div>

			<div className="union-stats">
				<div className="stat-box">
					<Icon icon={ icons.people } />
					<div>
						<p className="stat-value">۱,۲۵۰</p>
						<span>{ __( 'اعضا', 'tabesh-v2' ) }</span>
					</div>
				</div>
				<div className="stat-box">
					<Icon icon={ icons.calendar } />
					<div>
						<p className="stat-value">۱۵</p>
						<span>{ __( 'رویداد امسال', 'tabesh-v2' ) }</span>
					</div>
				</div>
			</div>

			<div className="announcements-section">
				<h3>{ __( 'اطلاعیه‌ها', 'tabesh-v2' ) }</h3>
				<div className="announcements-list">
					{ announcements.map( ( item ) => (
						<div key={ item.id } className="announcement-card">
							<Icon icon={ icons.megaphone } />
							<div className="announcement-content">
								<h4>{ item.title }</h4>
								<span className="announcement-date">{ item.date }</span>
							</div>
							<button className="read-more-btn">
								<Icon icon={ icons.chevronLeft } />
							</button>
						</div>
					) ) }
				</div>
			</div>

			<div className="resources-section">
				<h3>{ __( 'منابع و مستندات', 'tabesh-v2' ) }</h3>
				<div className="resources-grid">
					<div className="resource-card">
						<Icon icon={ icons.download } />
						<h4>{ __( 'دستورالعمل قیمت‌گذاری', 'tabesh-v2' ) }</h4>
					</div>
					<div className="resource-card">
						<Icon icon={ icons.download } />
						<h4>{ __( 'استانداردهای چاپ', 'tabesh-v2' ) }</h4>
					</div>
					<div className="resource-card">
						<Icon icon={ icons.download } />
						<h4>{ __( 'قوانین و مقررات', 'tabesh-v2' ) }</h4>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TradeUnion;
