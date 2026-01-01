import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * Advertisements Component.
 * 
 * Display and manage advertisements.
 */
const Advertisements = () => {
	const ads = [
		{ id: 1, title: __( 'تخفیف ویژه چاپ کتاب', 'tabesh-v2' ), status: 'active', views: 1250, clicks: 89 },
		{ id: 2, title: __( 'پیشنهاد ویژه پوستر', 'tabesh-v2' ), status: 'paused', views: 850, clicks: 45 },
		{ id: 3, title: __( 'کاتالوگ با قیمت استثنایی', 'tabesh-v2' ), status: 'active', views: 2100, clicks: 156 },
	];

	return (
		<div className="section-advertisements">
			<div className="section-header">
				<h2>{ __( 'تبلیغات', 'tabesh-v2' ) }</h2>
				<button className="btn-primary">
					<Icon icon={ icons.plus } />
					{ __( 'تبلیغ جدید', 'tabesh-v2' ) }
				</button>
			</div>

			<div className="ads-stats">
				<div className="stat-card">
					<Icon icon={ icons.seen } />
					<div>
						<h3>{ __( 'کل بازدید', 'tabesh-v2' ) }</h3>
						<p className="stat-value">4,200</p>
					</div>
				</div>
				<div className="stat-card">
					<Icon icon={ icons.external } />
					<div>
						<h3>{ __( 'کل کلیک', 'tabesh-v2' ) }</h3>
						<p className="stat-value">290</p>
					</div>
				</div>
				<div className="stat-card">
					<Icon icon={ icons.percent } />
					<div>
						<h3>{ __( 'نرخ کلیک', 'tabesh-v2' ) }</h3>
						<p className="stat-value">6.9%</p>
					</div>
				</div>
			</div>

			<div className="ads-list">
				<h3>{ __( 'تبلیغات من', 'tabesh-v2' ) }</h3>
				{ ads.map( ( ad ) => (
					<div key={ ad.id } className="ad-card">
						<div className="ad-header">
							<div className="ad-title">
								<Icon icon={ icons.megaphone } />
								<h4>{ ad.title }</h4>
							</div>
							<span className={ `ad-status ${ ad.status }` }>
								{ ad.status === 'active' ? __( 'فعال', 'tabesh-v2' ) : __( 'متوقف', 'tabesh-v2' ) }
							</span>
						</div>
						<div className="ad-stats">
							<div className="ad-stat">
								<Icon icon={ icons.seen } />
								<span>{ ad.views } { __( 'بازدید', 'tabesh-v2' ) }</span>
							</div>
							<div className="ad-stat">
								<Icon icon={ icons.external } />
								<span>{ ad.clicks } { __( 'کلیک', 'tabesh-v2' ) }</span>
							</div>
							<div className="ad-stat">
								<Icon icon={ icons.percent } />
								<span>{ ( ( ad.clicks / ad.views ) * 100 ).toFixed( 1 ) }% { __( 'نرخ', 'tabesh-v2' ) }</span>
							</div>
						</div>
						<div className="ad-actions">
							<button className="action-btn">
								<Icon icon={ icons.edit } />
								{ __( 'ویرایش', 'tabesh-v2' ) }
							</button>
							<button className="action-btn">
								<Icon icon={ icons.chartBar } />
								{ __( 'آمار', 'tabesh-v2' ) }
							</button>
							<button className="action-btn">
								{ ad.status === 'active' ? <Icon icon={ icons.close } /> : <Icon icon={ icons.check } /> }
								{ ad.status === 'active' ? __( 'توقف', 'tabesh-v2' ) : __( 'فعال‌سازی', 'tabesh-v2' ) }
							</button>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
};

export default Advertisements;
