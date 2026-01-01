import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * Articles Component.
 * 
 * Display recent articles and news.
 */
const Articles = () => {
	const articles = [
		{
			id: 1,
			title: __( 'راهنمای انتخاب کاغذ مناسب برای چاپ کتاب', 'tabesh-v2' ),
			excerpt: __( 'در این مقاله با انواع کاغذ و کاربرد آن‌ها آشنا می‌شوید...', 'tabesh-v2' ),
			date: __( '۳ روز پیش', 'tabesh-v2' ),
			category: __( 'آموزشی', 'tabesh-v2' ),
		},
		{
			id: 2,
			title: __( 'جدیدترین تکنولوژی‌های چاپ دیجیتال', 'tabesh-v2' ),
			excerpt: __( 'آشنایی با فناوری‌های نوین در صنعت چاپ...', 'tabesh-v2' ),
			date: __( '۵ روز پیش', 'tabesh-v2' ),
			category: __( 'فناوری', 'tabesh-v2' ),
		},
		{
			id: 3,
			title: __( 'نکات مهم در طراحی فایل برای چاپ', 'tabesh-v2' ),
			excerpt: __( 'برای بهترین نتیجه چاپ، این نکات را رعایت کنید...', 'tabesh-v2' ),
			date: __( '۱ هفته پیش', 'tabesh-v2' ),
			category: __( 'طراحی', 'tabesh-v2' ),
		},
	];

	return (
		<div className="section-articles">
			<div className="section-header">
				<h2>{ __( 'مقالات و اخبار', 'tabesh-v2' ) }</h2>
				<div className="header-actions">
					<input
						type="text"
						placeholder={ __( 'جستجوی مقاله...', 'tabesh-v2' ) }
						className="search-input"
					/>
				</div>
			</div>

			<div className="articles-grid">
				{ articles.map( ( article ) => (
					<article key={ article.id } className="article-card">
						<div className="article-image">
							<div className="image-placeholder">
								<Icon icon={ icons.page } />
							</div>
						</div>
						<div className="article-content">
							<span className="article-category">{ article.category }</span>
							<h3 className="article-title">{ article.title }</h3>
							<p className="article-excerpt">{ article.excerpt }</p>
							<div className="article-meta">
								<span className="article-date">
									<Icon icon={ icons.calendar } />
									{ article.date }
								</span>
								<button className="read-more">
									{ __( 'ادامه مطلب', 'tabesh-v2' ) }
									<Icon icon={ icons.chevronLeft } />
								</button>
							</div>
						</div>
					</article>
				) ) }
			</div>

			<div className="load-more-wrapper">
				<button className="load-more-btn">
					{ __( 'مقالات بیشتر', 'tabesh-v2' ) }
				</button>
			</div>
		</div>
	);
};

export default Articles;
